import { createHash } from 'crypto';
import { getNeonSql } from '../db/NeonDatabase';
import type { UserIdentityEntity, UserRole } from './types';
import type { AuthRepository } from './AuthRepository';

type Sql = ReturnType<typeof getNeonSql>;

function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, '').toLowerCase();
}

function mapUser(row: any): UserIdentityEntity {
  const status = String(row.status);
  if (!['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'].includes(status)) {
    throw new Error('AUTH_IDENTITY_STATUS_INVALID');
  }
  return {
    id: String(row.id),
    username: String(row.username),
    piUid: row.pi_uid ? String(row.pi_uid) : undefined,
    email: row.email ? String(row.email) : undefined,
    roles: Array.isArray(row.roles) ? row.roles as UserRole[] : [],
    institutionId: row.institution_id ? String(row.institution_id) : undefined,
    guardianId: row.guardian_id ? String(row.guardian_id) : undefined,
    status: status as UserIdentityEntity['status'],
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

/**
 * Neon-backed auth persistence for the pre-provisioned Preview schema.
 * Stores only SHA-256 session-token hashes, never bearer tokens.
 * This adapter is intentionally not wired into runtime until the service
 * and test adapters are migrated together.
 */
export class NeonAuthRepository implements AuthRepository {
  private readonly sql: Sql;

  constructor(sql: Sql = getNeonSql()) {
    this.sql = sql;
  }

  public async assertSchemaReady(): Promise<void> {
    const rows = await this.sql`
      SELECT
        to_regclass('public.user_identities') AS identities,
        to_regclass('public.user_sessions') AS sessions,
        to_regclass('public.revoked_sessions') AS revocations
    `;
    const row = rows[0];
    if (!row?.identities || !row?.sessions || !row?.revocations) {
      throw new Error('AUTH_DURABLE_SCHEMA_NOT_READY');
    }
  }

  public async findUserByUsername(username: string): Promise<UserIdentityEntity | null> {
    const key = normalizeUsername(username);
    if (!key) return null;
    const rows = await this.sql`
      SELECT * FROM user_identities
      WHERE lower(username) = ${key}
      LIMIT 1
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async findUserById(id: string): Promise<UserIdentityEntity | null> {
    const rows = await this.sql`
      SELECT * FROM user_identities
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async upsertVerifiedPiIdentity(input: {
    username: string;
    piUid: string;
    email?: string;
  }): Promise<UserIdentityEntity> {
    const username = input.username.trim().replace(/^@/, '');
    const normalized = normalizeUsername(username);
    const piUid = input.piUid.trim();
    if (!username || !normalized || !piUid) throw new Error('AUTH_IDENTITY_INVALID');

    const rows = await this.sql`
      INSERT INTO user_identities (username, pi_uid, email)
      VALUES (${username}, ${piUid}, ${input.email || null})
      ON CONFLICT (lower(username)) DO UPDATE SET
        username = EXCLUDED.username,
        pi_uid = COALESCE(user_identities.pi_uid, EXCLUDED.pi_uid),
        email = COALESCE(EXCLUDED.email, user_identities.email),
        updated_at = now()
      RETURNING *
    `;
    if (!rows[0]) throw new Error('AUTH_IDENTITY_UPSERT_FAILED');
    if (String(rows[0].pi_uid) !== piUid) throw new Error('AUTH_PI_UID_MISMATCH');
    return mapUser(rows[0]);
  }

  /** Caller must enforce server-side administrator authorization before role changes. */
  public async setAuthoritativeRoles(
    userId: string,
    roles: UserRole[]
  ): Promise<UserIdentityEntity | null> {
    const uniqueRoles = [...new Set(roles)];
    const rows = await this.sql`
      UPDATE user_identities
      SET roles = ${JSON.stringify(uniqueRoles)}::jsonb, updated_at = now()
      WHERE id = ${userId}::uuid
      RETURNING *
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async createSession(token: string, userId: string, expiresAt: number): Promise<void> {
    if (!token || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new Error('AUTH_SESSION_INVALID');
    }
    const hash = createHash('sha256').update(token).digest('hex');
    const rows = await this.sql`
      INSERT INTO user_sessions (token_hash, user_id, session_version, expires_at)
      SELECT ${hash}, id, session_version, to_timestamp(${expiresAt / 1000})
      FROM user_identities
      WHERE id = ${userId}::uuid AND status = 'ACTIVE'
      RETURNING id
    `;
    if (!rows[0]) throw new Error('AUTH_SESSION_IDENTITY_NOT_FOUND_OR_INACTIVE');
  }

  public async findActiveSession(
    token: string
  ): Promise<{ user: UserIdentityEntity; expiresAt: number } | null> {
    if (!token) return null;
    const hash = createHash('sha256').update(token).digest('hex');
    const rows = await this.sql`
      SELECT u.*, s.expires_at
      FROM user_sessions s
      JOIN user_identities u ON u.id = s.user_id
      WHERE s.token_hash = ${hash}
        AND s.expires_at > now()
        AND s.revoked_at IS NULL
        AND s.session_version = u.session_version
        AND u.status = 'ACTIVE'
        AND NOT EXISTS (
          SELECT 1 FROM revoked_sessions r WHERE r.token_hash = s.token_hash
        )
      LIMIT 1
    `;
    if (!rows[0]) return null;
    const { expires_at, ...userRow } = rows[0];
    return {
      user: mapUser(userRow),
      expiresAt: new Date(expires_at).getTime()
    };
  }

  /** Revocation is persisted before the secondary session-row update. */
  public async revokeSession(token: string, _expiresAt: number): Promise<void> {
    if (!token) return;
    const hash = createHash('sha256').update(token).digest('hex');
    await this.sql`
      INSERT INTO revoked_sessions (token_hash, reason)
      VALUES (${hash}, 'logout')
      ON CONFLICT (token_hash) DO UPDATE
      SET revoked_at = now(), reason = 'logout'
    `;
    await this.sql`
      UPDATE user_sessions
      SET revoked_at = now(), revoke_reason = 'logout'
      WHERE token_hash = ${hash} AND revoked_at IS NULL
    `;
  }

  public async pruneExpiredAuthRows(): Promise<void> {
    await this.sql`DELETE FROM user_sessions WHERE expires_at <= now()`;
    await this.sql`
      DELETE FROM revoked_sessions
      WHERE revoked_at < now() - interval '30 days'
    `;
  }
}
