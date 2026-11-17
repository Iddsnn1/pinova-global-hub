import { createHash } from 'crypto';
import { getNeonSql } from '../db/NeonDatabase';
import type { UserIdentityEntity, UserRole } from './types';

type Sql = ReturnType<typeof getNeonSql>;

function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, '').toLowerCase();
}

function mapUser(row: any): UserIdentityEntity {
  return {
    id: String(row.id),
    username: String(row.username),
    piUid: row.pi_uid ? String(row.pi_uid) : undefined,
    email: row.email ? String(row.email) : undefined,
    roles: Array.isArray(row.roles) ? row.roles as UserRole[] : [],
    institutionId: row.institution_id ? String(row.institution_id) : undefined,
    guardianId: row.guardian_id ? String(row.guardian_id) : undefined,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

/**
 * Adapter for the existing Preview auth schema:
 * user_identities, user_sessions and revoked_sessions.
 * Only SHA-256 token hashes are persisted; bearer tokens remain in memory
 * for the response and are never written to PostgreSQL.
 */
export class NeonAuthRepository {
  private sql: Sql;

  constructor(sql: Sql = getNeonSql()) {
    this.sql = sql;
  }

  /** Fail fast if the pre-provisioned durable auth schema is not available. */
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
    const rows = await this.sql`SELECT * FROM user_identities WHERE lower(username) = ${key} LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async findUserById(id: string): Promise<UserIdentityEntity | null> {
    const rows = await this.sql`SELECT * FROM user_identities WHERE id = ${id}::uuid LIMIT 1`;
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

  /** Privileged role changes must only be called behind server-side admin authorization. */
  public async setAuthoritativeRoles(userId: string, roles: UserRole[]): Promise<UserIdentityEntity | null> {
    const rows = await this.sql`
      UPDATE user_identities
      SET roles = ${JSON.stringify([...new Set(roles)])}::jsonb, updated_at = now()
      WHERE id = ${userId}::uuid
      RETURNING *
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async createSession(token: string, userId: string, expiresAt: number): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');
    const rows = await this.sql`
      INSERT INTO user_sessions (token_hash, user_id, session_version, expires_at)
      SELECT ${hash}, id, session_version, to_timestamp(${expiresAt / 1000})
      FROM user_identities
      WHERE id = ${userId}::uuid
      RETURNING id
    `;
    if (!rows[0]) throw new Error('AUTH_SESSION_IDENTITY_NOT_FOUND');
  }

  public async findActiveSession(token: string): Promise<{ user: UserIdentityEntity; expiresAt: number } | null> {
    const hash = createHash('sha256').update(token).digest('hex');
    const rows = await this.sql`
      SELECT u.*, s.expires_at
      FROM user_sessions s
      JOIN user_identities u ON u.id = s.user_id
      WHERE s.token_hash = ${hash}
        AND s.expires_at > now()
        AND s.revoked_at IS NULL
        AND s.session_version = u.session_version
        AND NOT EXISTS (
          SELECT 1 FROM revoked_sessions r WHERE r.token_hash = s.token_hash
        )
      LIMIT 1
    `;
    if (!rows[0]) return null;
    const { expires_at, ...userRow } = rows[0];
    return { user: mapUser(userRow), expiresAt: new Date(expires_at).getTime() };
  }

  /** Revocation is written first; a subsequent update failure still fails closed. */
  public async revokeSession(token: string, _expiresAt: number): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');
    await this.sql`
      INSERT INTO revoked_sessions (token_hash, reason)
      VALUES (${hash}, 'logout')
      ON CONFLICT (token_hash) DO UPDATE SET revoked_at = now(), reason = 'logout'
    `;
    await this.sql`
      UPDATE user_sessions
      SET revoked_at = now(), revoke_reason = 'logout'
      WHERE token_hash = ${hash} AND revoked_at IS NULL
    `;
  }

  public async pruneExpiredAuthRows(): Promise<void> {
    await this.sql`DELETE FROM user_sessions WHERE expires_at <= now()`;
    await this.sql`DELETE FROM revoked_sessions WHERE revoked_at < now() - interval '30 days'`;
  }
}
