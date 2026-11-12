import type { UserIdentityEntity, UserRole } from './types';

/**
 * Durable authentication persistence contract.
 *
 * Implementations must treat database identity/status/roles as authoritative.
 * Raw bearer tokens must never be persisted; session methods accept the raw
 * token only to derive a one-way hash internally.
 */
export interface AuthRepository {
  assertSchemaReady(): Promise<void>;
  findUserByUsername(username: string): Promise<UserIdentityEntity | null>;
  findUserById(id: string): Promise<UserIdentityEntity | null>;
  upsertVerifiedPiIdentity(input: {
    username: string;
    piUid: string;
    email?: string;
  }): Promise<UserIdentityEntity>;
  setAuthoritativeRoles(userId: string, roles: UserRole[]): Promise<UserIdentityEntity | null>;
  createSession(token: string, userId: string, expiresAt: number): Promise<void>;
  findActiveSession(token: string): Promise<{
    user: UserIdentityEntity;
    expiresAt: number;
  } | null>;
  revokeSession(token: string, expiresAt: number): Promise<void>;
  pruneExpiredAuthRows(): Promise<void>;
}
