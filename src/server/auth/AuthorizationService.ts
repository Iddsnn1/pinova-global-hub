import crypto from 'crypto';
import { RoleRepository } from './RoleRepository';
import { AuthenticatedUser, SessionEntity, UserRole } from './types';
import { NeonAuthRepository } from './NeonAuthRepository';

const SESSION_TTL_MS = 7 * 86400000;
const PRIVILEGED_ROLES: UserRole[] = [
  'PLATFORM_ADMIN', 'COMPLIANCE_ADMIN', 'COMPLIANCE_OFFICER',
  'BURSAR', 'FINANCE_ADMIN', 'INSTITUTION_ADMIN'
];

type CreateSessionInput = {
  username: string;
  uid?: string;
  roles?: UserRole[];
  accessToken?: string;
  institutionId?: string;
  isAuthorizedAdmin?: boolean;
};

export class AuthorizationService {
  private repository?: NeonAuthRepository;

  private get authRepository(): NeonAuthRepository {
    if (!this.repository) this.repository = new NeonAuthRepository();
    return this.repository;
  }

  private getSecret(): string {
    const secret = String(process.env.JWT_SECRET || process.env.SESSION_SECRET || '').trim();
    if (secret.length < 32) throw new Error('AUTH_SESSION_SECRET_MISSING_OR_WEAK');
    return secret;
  }

  /** Creates a session only for a Pi identity already verified and persisted in Neon. */
  public async createSession(
    param: string | CreateSessionInput,
    ttlMs: number = SESSION_TTL_MS
  ): Promise<SessionEntity & { user: AuthenticatedUser }> {
    const input: CreateSessionInput = typeof param === 'string' ? { username: param } : param;
    const username = String(input.username || '').trim().replace(/^@/, '');
    const uid = String(input.uid || '').trim();
    if (!username || !uid) throw new Error('AUTH_VERIFIED_PI_IDENTITY_REQUIRED');
    if (!Number.isFinite(ttlMs) || ttlMs <= 0 || ttlMs > 30 * 86400000) {
      throw new Error('AUTH_SESSION_TTL_INVALID');
    }

    const repository = this.authRepository;
    let identity = await repository.findUserByUsername(username);
    if (!identity || !identity.piUid || identity.piUid !== uid) {
      throw new Error('AUTH_DURABLE_IDENTITY_NOT_FOUND_OR_MISMATCH');
    }

    // Only a server-authorized admin flow may write roles. Browser-supplied
    // roles are ignored for every other session creation.
    if (input.isAuthorizedAdmin === true) {
      const requestedRoles = Array.isArray(input.roles)
        ? input.roles.filter((role): role is UserRole => PRIVILEGED_ROLES.includes(role) || identity!.roles.includes(role) || role === 'PIONEER' || role === 'BUYER' || role === 'SELLER' || role === 'STUDENT' || role === 'GUARDIAN' || role === 'TEACHER' || role === 'ADMISSIONS_OFFICER')
        : identity.roles;
      const safeRoles = requestedRoles.length ? requestedRoles : ['PIONEER' as UserRole];
      identity = (await repository.setAuthoritativeRoles(identity.id, safeRoles)) || identity;
    }

    if (identity.status !== 'ACTIVE') throw new Error('AUTH_IDENTITY_NOT_ACTIVE');

    const secret = this.getSecret();
    const expiresAt = Date.now() + ttlMs;
    const nonce = crypto.randomBytes(24).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      v: 2, sub: identity.id, username: identity.username, exp: expiresAt, nonce
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    const token = `pinova_sess_v2_${payload}.${signature}`;

    await repository.createSession(token, identity.id, expiresAt);

    const session: SessionEntity = {
      token, userId: identity.id, username: identity.username,
      roles: identity.roles, institutionId: identity.institutionId,
      expiresAt, createdAt: new Date().toISOString()
    };
    const user: AuthenticatedUser = {
      id: identity.id, username: identity.username, piUid: identity.piUid,
      roles: identity.roles, permissions: RoleRepository.getPermissionsForRoles(identity.roles),
      institutionId: identity.institutionId, guardianId: identity.guardianId, authMethod: 'SESSION'
    };
    return Object.assign(session, { user });
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

    // Machine credentials are a separate server-to-server mechanism, not user sessions.
    const machineSecret = process.env.ADMIN_API_KEY || process.env.PI_API_KEY || process.env.PI_SERVER_KEY;
    if (machineSecret && !['YOUR_PI_PLATFORM_API_KEY', 'MY_PI_API_KEY'].includes(machineSecret) && token === machineSecret) {
      const roles: UserRole[] = ['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN'];
      return {
        id: 'sys-machine-admin', username: 'system_admin', roles,
        permissions: RoleRepository.getPermissionsForRoles(roles), isMachineKey: true, authMethod: 'API_KEY'
      };
    }

    if (token.startsWith('pinova_sess_v2_')) {
      try {
        const secret = this.getSecret();
        const signed = token.slice('pinova_sess_v2_'.length);
        const separator = signed.lastIndexOf('.');
        if (separator <= 0) return null;
        const payload = signed.slice(0, separator);
        const signature = signed.slice(separator + 1);
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
        const providedBytes = Buffer.from(signature);
        const expectedBytes = Buffer.from(expected);
        if (providedBytes.length !== expectedBytes.length ||
            !crypto.timingSafeEqual(providedBytes, expectedBytes)) return null;

        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (decoded?.v !== 2 || typeof decoded.sub !== 'string' ||
            !Number.isFinite(decoded.exp) || Date.now() >= decoded.exp) return null;

        const active = await this.authRepository.findActiveSession(token);
        if (!active || active.user.id !== decoded.sub || active.user.status !== 'ACTIVE') return null;
        const identity = active.user;
        return {
          id: identity.id, username: identity.username, piUid: identity.piUid,
          roles: identity.roles, permissions: RoleRepository.getPermissionsForRoles(identity.roles),
          institutionId: identity.institutionId, guardianId: identity.guardianId, authMethod: 'SESSION'
        };
      } catch {
        return null;
      }
    }

    // Raw Pi access tokens are accepted only after authoritative Platform verification.
    if (token.length > 20 && !token.includes(' ')) {
      try {
        const piApiKey = String(process.env.PI_API_KEY || process.env.PI_SERVER_KEY || '').trim();
        if (!piApiKey || ['YOUR_PI_PLATFORM_API_KEY', 'MY_PI_API_KEY'].includes(piApiKey)) return null;
        const response = await fetch('https://api.minepi.com/v2/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const piUser = await response.json() as { uid?: string; username?: string };
        if (!piUser.uid || !piUser.username) return null;
        const identity = await this.authRepository.upsertVerifiedPiIdentity({
          username: piUser.username, piUid: piUser.uid
        });
        if (identity.status !== 'ACTIVE') return null;
        return {
          id: identity.id, username: identity.username, piUid: identity.piUid,
          roles: identity.roles, permissions: RoleRepository.getPermissionsForRoles(identity.roles),
          institutionId: identity.institutionId, guardianId: identity.guardianId, authMethod: 'PI_PLATFORM'
        };
      } catch (error) {
        console.warn('[AuthorizationService] Pi token verification or durable identity lookup failed.');
        return null;
      }
    }

    // Legacy stateless sessions and local test tokens are intentionally rejected.
    return null;
  }

  /** Durable revocation completes before logout can report success. */
  public async invalidateSession(tokenHeader: string): Promise<boolean> {
    let token = tokenHeader.trim();
    if (token.startsWith('Bearer ')) token = token.slice(7).trim();
    else if (token.startsWith('Key ')) token = token.slice(4).trim();
    if (!token) return false;

    let expiresAt = Date.now() + SESSION_TTL_MS;
    if (token.startsWith('pinova_sess_v2_')) {
      try {
        const signed = token.slice('pinova_sess_v2_'.length);
        const payload = signed.slice(0, signed.lastIndexOf('.'));
        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (Number.isFinite(decoded?.exp)) expiresAt = Math.max(expiresAt, decoded.exp);
      } catch {
        // Keep a bounded revocation window for malformed/unknown tokens.
      }
    }
    await this.authRepository.revokeSession(token, expiresAt);
    return true;
  }

  public hasPermission(user: AuthenticatedUser, permission: any): boolean {
    if (!user || !user.permissions) return false;
    const perms = Array.isArray(user.permissions)
      ? user.permissions
      : Array.from(user.permissions as Set<string>);
    if (perms.includes('*') || perms.includes('platform.admin.access')) return true;
    const value = String(permission);
    const normalized = value.replace(/:/g, '.');
    return perms.includes(value) || perms.includes(normalized);
  }

  public hasRole(user: AuthenticatedUser, role: UserRole): boolean {
    return user.roles.includes(role);
  }
}
