import crypto from 'crypto';
import { UserIdentityRepository } from './UserIdentityRepository';
import { LegacyAuthRepository } from './LegacyAuthRepository';
import type { AuthRepository } from './AuthRepository';
import { RoleRepository } from './RoleRepository';
import type { AuthenticatedUser, SessionEntity, UserRole } from './types';

const PRIVILEGED_ROLES: UserRole[] = [
  'PLATFORM_ADMIN', 'COMPLIANCE_ADMIN', 'COMPLIANCE_OFFICER',
  'BURSAR', 'FINANCE_ADMIN', 'INSTITUTION_ADMIN'
];

function toAuthenticatedUser(user: {
  id: string; username: string; piUid?: string; roles: UserRole[];
  institutionId?: string; guardianId?: string;
}, authMethod?: string): AuthenticatedUser {
  return {
    id: user.id,
    username: user.username,
    piUid: user.piUid,
    roles: user.roles,
    permissions: RoleRepository.getPermissionsForRoles(user.roles),
    institutionId: user.institutionId,
    guardianId: user.guardianId,
    authMethod
  };
}

export class AuthorizationService {
  private readonly authRepo: AuthRepository;
  private readonly legacyRepo: LegacyAuthRepository | null;
  private readonly secretKey: string;

  constructor(repository?: AuthRepository | UserIdentityRepository) {
    if (repository instanceof UserIdentityRepository) {
      this.legacyRepo = new LegacyAuthRepository(repository);
      this.authRepo = this.legacyRepo;
    } else if (repository) {
      this.legacyRepo = repository instanceof LegacyAuthRepository ? repository : null;
      this.authRepo = repository;
    } else {
      this.legacyRepo = new LegacyAuthRepository();
      this.authRepo = this.legacyRepo;
    }

    const configuredSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
    if (!configuredSecret && process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SIGNING_SECRET_REQUIRED');
    }
    this.secretKey = configuredSecret || crypto.randomBytes(32).toString('hex');
  }

  /** Compatibility accessor for existing local tests and development tooling. */
  public getUserRepo(): UserIdentityRepository {
    if (!this.legacyRepo) throw new Error('AUTH_REPOSITORY_IS_NOT_LEGACY');
    return this.legacyRepo.getUserRepository();
  }

  /**
   * Issues a signed bearer token and persists its hash through the repository.
   * A non-admin caller cannot assign privileged roles. Durable repositories
   * retain existing database roles; only the server-authorized admin path may
   * write a new role set.
   */
  public async createSession(
    param: string | {
      username: string; uid?: string; roles?: UserRole[]; accessToken?: string;
      institutionId?: string; isAuthorizedAdmin?: boolean;
    },
    ttlMs: number = 7 * 86400000
  ): Promise<SessionEntity & { user: AuthenticatedUser }> {
    const username = (typeof param === 'string' ? param : param.username).trim().replace(/^@/, '');
    const uid = typeof param === 'object' ? param.uid : undefined;
    const requestedRoles = typeof param === 'object' ? param.roles : undefined;
    const institutionId = typeof param === 'object' ? param.institutionId : undefined;
    const isAuthorizedAdmin = typeof param === 'object' && param.isAuthorizedAdmin === true;

    if (!username || !Number.isFinite(ttlMs) || ttlMs <= 0 || ttlMs > 30 * 86400000) {
      throw new Error('AUTH_SESSION_INPUT_INVALID');
    }

    let user = await this.authRepo.findUserByUsername(username);
    if (!user) {
      if (!uid) throw new Error('AUTH_VERIFIED_IDENTITY_REQUIRED');
      user = await this.authRepo.upsertVerifiedPiIdentity({ username, piUid: uid });
    }

    if (user.status !== 'ACTIVE') throw new Error('AUTH_IDENTITY_NOT_ACTIVE');
    if (uid && user.piUid && uid !== user.piUid) throw new Error('AUTH_PI_UID_MISMATCH');

    if (isAuthorizedAdmin && requestedRoles?.length) {
      const updated = await this.authRepo.setAuthoritativeRoles(user.id, requestedRoles);
      if (!updated) throw new Error('AUTH_ROLE_UPDATE_FAILED');
      user = updated;
    } else if (this.legacyRepo && requestedRoles?.length) {
      // Local test adapter only: preserve historical role-based fixtures.
      const safeRoles = requestedRoles.filter(role => !PRIVILEGED_ROLES.includes(role));
      const updated = await this.authRepo.setAuthoritativeRoles(user.id, safeRoles);
      if (updated) user = updated;
    }

    const expiresAt = Date.now() + ttlMs;
    const payload = Buffer.from(JSON.stringify({
      v: 2,
      sub: user.id,
      username: user.username,
      exp: expiresAt,
      nonce: crypto.randomBytes(16).toString('hex')
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', this.secretKey).update(payload).digest('base64url');
    const token = `pinova_sess_v2_${payload}.${signature}`;

    await this.authRepo.createSession(token, user.id, expiresAt);

    const session: SessionEntity = {
      token,
      userId: user.id,
      username: user.username,
      roles: user.roles,
      institutionId: user.institutionId,
      expiresAt,
      createdAt: new Date().toISOString()
    };
    return Object.assign(session, { user: toAuthenticatedUser(user, 'SESSION') });
  }

  public async authenticateToken(tokenHeader?: string): Promise<AuthenticatedUser | null> {
    return this.verifyToken(tokenHeader);
  }

  public async verifyToken(tokenHeader?: string): Promise<AuthenticatedUser | null> {
    if (!tokenHeader) return null;
    let token = tokenHeader.trim();
    if (token.startsWith('Bearer ')) token = token.slice(7).trim();
    else if (token.startsWith('Key ')) token = token.slice(4).trim();
    if (!token) return null;

    const adminSecret = process.env.ADMIN_API_KEY || process.env.PI_API_KEY || process.env.PI_SERVER_KEY;
    if (adminSecret && !['YOUR_PI_PLATFORM_API_KEY', 'MY_PI_API_KEY'].includes(adminSecret) && token === adminSecret) {
      const roles: UserRole[] = ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN'];
      return {
        id: 'sys-machine-admin', username: 'system_admin', roles,
        permissions: RoleRepository.getPermissionsForRoles(roles), isMachineKey: true
      };
    }

    // Durable/local session verification always checks repository state after
    // verifying the HMAC. No role or identity is trusted from token claims.
    if (token.startsWith('pinova_sess_v2_')) {
      try {
        const signed = token.slice('pinova_sess_v2_'.length);
        const separator = signed.lastIndexOf('.');
        if (separator <= 0) return null;
        const payload = signed.slice(0, separator);
        const signature = signed.slice(separator + 1);
        const expected = crypto.createHmac('sha256', this.secretKey).update(payload).digest('base64url');
        const provided = Buffer.from(signature);
        const expectedBytes = Buffer.from(expected);
        if (provided.length !== expectedBytes.length || !crypto.timingSafeEqual(provided, expectedBytes)) return null;

        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (decoded?.v !== 2 || typeof decoded.sub !== 'string' ||
            !Number.isFinite(decoded.exp) || Date.now() >= decoded.exp) return null;

        const active = await this.authRepo.findActiveSession(token);
        if (!active || active.expiresAt <= Date.now() || active.user.id !== decoded.sub ||
            active.user.status !== 'ACTIVE') return null;
        return toAuthenticatedUser(active.user, 'SESSION');
      } catch {
        return null;
      }
    }

    // Reject old stateless tokens: they have no durable session row and may
    // carry obsolete privilege claims.
    if (token.startsWith('pinova_sess_v1_')) return null;

    if (token.startsWith('pinova_test_token_')) {
      if (process.env.NODE_ENV === 'production' || !this.legacyRepo) return null;
      const username = token.slice('pinova_test_token_'.length).trim();
      if (!username) return null;
      const user = await this.authRepo.findUserByUsername(username);
      if (!user || user.status !== 'ACTIVE') return null;
      return toAuthenticatedUser(user, 'TEST');
    }

    // Verify raw Pi access tokens with the official Platform API only.
    if (token.length > 20 && !token.includes(' ')) {
      try {
        const piApiKey = (process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
        if (process.env.NODE_ENV === 'production' && piApiKey &&
            !['YOUR_PI_PLATFORM_API_KEY', 'MY_PI_API_KEY'].includes(piApiKey)) {
          const response = await fetch('https://api.minepi.com/v2/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!response.ok) return null;
          const piUser = await response.json() as { uid?: string; username?: string };
          if (!piUser.uid || !piUser.username) return null;
          const user = await this.authRepo.upsertVerifiedPiIdentity({
            username: piUser.username, piUid: piUser.uid
          });
          if (user.status !== 'ACTIVE') return null;
          return toAuthenticatedUser(user, 'PI_PLATFORM');
        }
      } catch (error) {
        console.warn('[AuthorizationService] Pi Platform token verification failed:', error);
      }
    }
    return null;
  }

  public async invalidateSession(token: string): Promise<boolean> {
    let cleanToken = token.trim();
    if (cleanToken.startsWith('Bearer ')) cleanToken = cleanToken.slice(7).trim();
    if (cleanToken.startsWith('Key ')) cleanToken = cleanToken.slice(4).trim();
    if (!cleanToken) return false;
    await this.authRepo.revokeSession(cleanToken, 0);
    return true;
  }

  public hasPermission(user: AuthenticatedUser, permission: any): boolean {
    if (!user?.permissions) return false;
    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : Array.from(user.permissions as Set<string>);
    if (permissions.includes('*') || permissions.includes('platform.admin.access')) return true;
    const requested = String(permission);
    return permissions.includes(requested) || permissions.includes(requested.replace(/:/g, '.'));
  }

  public hasRole(user: AuthenticatedUser, role: UserRole): boolean {
    return Boolean(user?.roles?.includes(role));
  }
}
