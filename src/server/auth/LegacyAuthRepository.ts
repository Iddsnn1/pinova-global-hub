import { UserIdentityRepository } from './UserIdentityRepository';
import { StorageEngine } from '../db/StorageEngine';
import type { AuthRepository } from './AuthRepository';
import type { UserIdentityEntity, UserRole, SessionEntity } from './types';

/**
 * Compatibility adapter for local development and isolated tests only.
 * It deliberately remains process-local and must not be mistaken for durable
 * multi-instance authentication storage.
 */
export class LegacyAuthRepository implements AuthRepository {
  private readonly users: UserIdentityRepository;
  private readonly sessions: StorageEngine<SessionEntity>;
  private readonly revoked: StorageEngine<{ token: string; revokedAt: string }>;

  constructor(users = new UserIdentityRepository()) {
    this.users = users;
    this.sessions = new StorageEngine<SessionEntity>('user_sessions', 'token');
    this.revoked = new StorageEngine<{ token: string; revokedAt: string }>('revoked_sessions', 'token');
  }

  public async assertSchemaReady(): Promise<void> {}

  public async findUserByUsername(username: string): Promise<UserIdentityEntity | null> {
    return this.users.findByUsername(username);
  }

  public async findUserById(id: string): Promise<UserIdentityEntity | null> {
    return this.users.findById(id);
  }

  public async upsertVerifiedPiIdentity(input: {
    username: string;
    piUid: string;
    email?: string;
  }): Promise<UserIdentityEntity> {
    return this.users.upsertUser({
      username: input.username,
      piUid: input.piUid,
      email: input.email
    });
  }

  public async setAuthoritativeRoles(
    userId: string,
    roles: UserRole[]
  ): Promise<UserIdentityEntity | null> {
    const user = this.users.findById(userId);
    if (!user) return null;
    const updated = { ...user, roles: [...new Set(roles)], updatedAt: new Date().toISOString() };
    // UserIdentityRepository exposes role operations by username; replace roles
    // through its storage-backed upsert path without accepting browser headers.
    return this.users.upsertUser({
      username: updated.username,
      piUid: updated.piUid,
      email: updated.email,
      roles: updated.roles,
      institutionId: updated.institutionId,
      guardianId: updated.guardianId
    });
  }

  public async createSession(token: string, userId: string, expiresAt: number): Promise<void> {
    const user = this.users.findById(userId);
    if (!user || user.status !== 'ACTIVE') throw new Error('AUTH_SESSION_IDENTITY_NOT_FOUND_OR_INACTIVE');
    this.sessions.set(token, {
      token,
      userId: user.id,
      username: user.username,
      roles: user.roles,
      institutionId: user.institutionId,
      expiresAt,
      createdAt: new Date().toISOString()
    });
  }

  public async findActiveSession(
    token: string
  ): Promise<{ user: UserIdentityEntity; expiresAt: number } | null> {
    if (this.revoked.get(token)) return null;
    const session = this.sessions.get(token);
    if (!session || session.expiresAt <= Date.now()) return null;
    const user = this.users.findById(session.userId);
    if (!user || user.status !== 'ACTIVE') return null;
    return { user, expiresAt: session.expiresAt };
  }

  public async revokeSession(token: string, _expiresAt: number): Promise<void> {
    this.sessions.delete(token);
    this.revoked.set(token, { token, revokedAt: new Date().toISOString() });
  }

  public async pruneExpiredAuthRows(): Promise<void> {
    const now = Date.now();
    for (const session of this.sessions.getAll()) {
      if (session.expiresAt <= now) this.sessions.delete(session.token);
    }
  }

  public getUserRepository(): UserIdentityRepository {
    return this.users;
  }
}
