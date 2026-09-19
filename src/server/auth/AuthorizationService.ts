import crypto from 'crypto';
import { UserIdentityRepository } from './UserIdentityRepository';
import { RoleRepository } from './RoleRepository';
import { AuthenticatedUser, SessionEntity, Permission, UserRole } from './types';
import { StorageEngine } from '../db/StorageEngine';

export class AuthorizationService {
  private userRepo: UserIdentityRepository;
  private sessionEngine: StorageEngine<SessionEntity>;
  private secretKey: string;

  constructor(userRepo?: UserIdentityRepository) {
    this.userRepo = userRepo || new UserIdentityRepository();
    this.sessionEngine = new StorageEngine<SessionEntity>('user_sessions', 'token');
    this.secretKey = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'pinova-sec-auth-v2-master-key';
  }

  public getUserRepo(): UserIdentityRepository {
    return this.userRepo;
  }

  /**
   * Creates an authoritative server session for a verified user
   */
  public createSession(
    param: string | { username: string; uid?: string; roles?: UserRole[]; accessToken?: string; institutionId?: string },
    ttlMs: number = 7 * 86400000
  ): SessionEntity & { user: AuthenticatedUser } {
    const username = typeof param === 'string' ? param : param.username;
    const uid = typeof param === 'object' ? param.uid : undefined;
    const roles = typeof param === 'object' ? param.roles : undefined;
    const institutionId = typeof param === 'object' ? param.institutionId : undefined;
    const isAuthorizedAdmin = typeof param === 'object' && 'isAuthorizedAdmin' in param
      ? (param as any).isAuthorizedAdmin === true
      : true;

    // Filter out privileged roles unless the caller is an authorized administrator
    const safeRoles = isAuthorizedAdmin
      ? roles
      : roles?.filter((r) => !['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN', 'COMPLIANCE_OFFICER', 'BURSAR', 'FINANCE_ADMIN', 'INSTITUTION_ADMIN'].includes(r));

    let user = this.userRepo.findByUsername(username);
    if (!user) {
      user = this.userRepo.upsertUser({ username, piUid: uid, roles: safeRoles, institutionId });
    } else if (isAuthorizedAdmin && safeRoles && safeRoles.length > 0) {
      user = this.userRepo.upsertUser({ username, piUid: uid || user.piUid, roles: safeRoles, institutionId: institutionId || user.institutionId });
    }

    // Vercel runs API handlers in separate serverless instances. A session token
    // stored only in StorageEngine can therefore disappear between /api/auth/session
    // and /api/vendor/apply. Use a signed, stateless session token as the portable
    // server credential while still re-fetching the user's authoritative roles.
    const expiresAt = Date.now() + ttlMs;
    const nonce = crypto.randomBytes(16).toString('hex');
    const payload = Buffer.from(JSON.stringify({
      v: 1,
      username: user.username,
      uid: user.piUid || uid || null,
      exp: expiresAt,
      nonce
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', this.secretKey).update(payload).digest('base64url');
    const token = `pinova_sess_v1_${payload}.${signature}`;
    const session: SessionEntity = {
      token,
      userId: user.id,
      username: user.username,
      roles: user.roles,
      institutionId: user.institutionId,
      expiresAt,
      createdAt: new Date().toISOString()
    };

    this.sessionEngine.set(token, session);

    const authUser: AuthenticatedUser = {
      id: user.id,
      username: user.username,
      piUid: user.piUid,
      roles: user.roles,
      permissions: RoleRepository.getPermissionsForRoles(user.roles),
      institutionId: user.institutionId,
      authMethod: 'SESSION'
    };

    return Object.assign(session, { user: authUser });
  }

  /**
   * Alias for verifyToken for semantic parity across callers
   */
  public async authenticateToken(tokenHeader?: string): Promise<AuthenticatedUser | null> {
    return this.verifyToken(tokenHeader);
  }

  /**
   * Authoritatively verifies an authentication token
   */
  public async verifyToken(tokenHeader?: string): Promise<AuthenticatedUser | null> {
    if (!tokenHeader) return null;

    let token = tokenHeader.trim();
    if (token.startsWith('Bearer ')) {
      token = token.substring(7).trim();
    } else if (token.startsWith('Key ')) {
      token = token.substring(4).trim();
    }

    if (!token) return null;

    // 1. Check Server Machine Secrets (Admin scripts / API keys)
    const adminSecret = process.env.ADMIN_API_KEY || process.env.PI_API_KEY || process.env.PI_SERVER_KEY;
    if (adminSecret && adminSecret !== 'YOUR_PI_PLATFORM_API_KEY' && adminSecret !== 'MY_PI_API_KEY' && token === adminSecret) {
      const roles: UserRole[] = ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN'];
      return {
        id: 'sys-machine-admin',
        username: 'system_admin',
        roles,
        permissions: RoleRepository.getPermissionsForRoles(roles),
        isMachineKey: true
      };
    }

    // 2. Check Active Session Engine
    const session = this.sessionEngine.get(token);
    if (session) {
      if (Date.now() > session.expiresAt) {
        this.sessionEngine.delete(token);
        return null;
      }

      // Re-fetch authoritative roles from user repository (in case roles were updated/revoked)
      const user = this.userRepo.findByUsername(session.username);
      if (!user || user.status === 'SUSPENDED') {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        piUid: user.piUid,
        roles: user.roles,
        permissions: RoleRepository.getPermissionsForRoles(user.roles),
        institutionId: user.institutionId,
        guardianId: user.guardianId
      };
    }

    // 3. Verify portable signed session tokens. This is required across Vercel
    // serverless instances where an in-memory/file-backed session cache is not shared.
    if (token.startsWith('pinova_sess_v1_')) {
      try {
        const signed = token.slice('pinova_sess_v1_'.length);
        const separator = signed.lastIndexOf('.');
        if (separator <= 0) return null;

        const payload = signed.slice(0, separator);
        const signature = signed.slice(separator + 1);
        const expected = crypto.createHmac('sha256', this.secretKey).update(payload).digest('base64url');

        const providedBuf = Buffer.from(signature);
        const expectedBuf = Buffer.from(expected);
        if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
          return null;
        }

        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (decoded?.v !== 1 || !decoded?.username || !Number.isFinite(decoded?.exp) || Date.now() > decoded.exp) {
          return null;
        }

        const user = this.userRepo.findByUsername(String(decoded.username));
        if (!user || user.status === 'SUSPENDED') return null;

        // Never trust roles/permissions from the token. Re-read them from the
        // authoritative repository so revocations still take effect.
        return {
          id: user.id,
          username: user.username,
          piUid: user.piUid,
          roles: user.roles,
          permissions: RoleRepository.getPermissionsForRoles(user.roles),
          institutionId: user.institutionId,
          guardianId: user.guardianId
        };
      } catch {
        return null;
      }
    }

    // 4. Check Test / Dev Signed Tokens (e.g. "pinova_test_token_<username>")
    if (token.startsWith('pinova_test_token_')) {
      // In production mode: strictly disallow test tokens
      if (process.env.NODE_ENV === 'production') {
        return null;
      }

      const username = token.replace('pinova_test_token_', '').trim();
      if (username) {
        const user = this.userRepo.findByUsername(username) || this.userRepo.upsertUser({ username });
        if (user.status === 'SUSPENDED') return null;

        return {
          id: user.id,
          username: user.username,
          piUid: user.piUid,
          roles: user.roles,
          permissions: RoleRepository.getPermissionsForRoles(user.roles),
          institutionId: user.institutionId,
          guardianId: user.guardianId
        };
      }
    }

    // 5. If token appears to be a Pi Access Token, verify with Pi Network Platform API
    if (token.length > 20 && !token.includes(' ')) {
      try {
        const isProduction = process.env.NODE_ENV === 'production';
        const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();

        // Pi's Sandbox is a Pi Browser/SDK environment mapped onto Pi Testnet.
        // The backend identity endpoint remains the official Platform API
        // (/v2/me); there is no separate api.sandbox.minepi.com Platform API host.
        // Therefore never construct a non-existent sandbox API hostname here.
        const piApiBase = 'https://api.minepi.com';

        // The access token is verified server-side against Pi's official Platform API.
        if (isProduction && piApiKey && piApiKey !== 'YOUR_PI_PLATFORM_API_KEY' && piApiKey !== 'MY_PI_API_KEY') {
          const res = await fetch(`${piApiBase}/v2/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const piUser = await res.json() as { uid: string; username: string };
            const user = this.userRepo.upsertUser({
              username: piUser.username,
              piUid: piUser.uid
            });

            return {
              id: user.id,
              username: user.username,
              piUid: user.piUid,
              roles: user.roles,
              permissions: RoleRepository.getPermissionsForRoles(user.roles),
              institutionId: user.institutionId,
              guardianId: user.guardianId
            };
          }
        }
      } catch (err) {
        console.warn('[AuthorizationService] Pi platform token verification check error:', err);
      }
    }

    return null;
  }

  public invalidateSession(token: string): boolean {
    let cleanToken = token.trim();
    if (cleanToken.startsWith('Bearer ')) cleanToken = cleanToken.substring(7).trim();
    if (cleanToken.startsWith('Key ')) cleanToken = cleanToken.substring(4).trim();
    return this.sessionEngine.delete(cleanToken);
  }

  public hasPermission(user: AuthenticatedUser, permission: any): boolean {
    if (!user || !user.permissions) return false;
    const perms = Array.isArray(user.permissions)
      ? user.permissions
      : Array.from(user.permissions as Set<string>);

    if (perms.includes('*') || perms.includes('platform.admin.access')) return true;

    const strPerm = String(permission);
    const normalized = strPerm.replace(/:/g, '.');
    return perms.includes(strPerm) || perms.includes(normalized);
  }

  public hasRole(user: AuthenticatedUser, role: UserRole): boolean {
    return user.roles.includes(role);
  }
}
