import { createHash, randomUUID } from 'crypto';
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
 * Neon-backed auth persistence. Schema creation is idempotent and is intended
 * to be invoked by the explicit migration/bootstrap path, not on every request.
 */
export class NeonAuthRepository {
  private sql: Sql;

  constructor(sql: Sql = getNeonSql()) {
    this.sql = sql;
  }

  public async ensureSchema(): Promise<void> {
    await this.sql`CREATE TABLE IF NOT EXISTS pinova_user_identities (
      id text PRIMARY KEY,
      username text NOT NULL,
      username_normalized text NOT NULL UNIQUE,
      pi_uid text UNIQUE,
      email text,
      roles jsonb NOT NULL DEFAULT '[]'::jsonb,
      institution_id text,
      guardian_id text,
      status text NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','SUSPENDED','PENDING_VERIFICATION')),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await this.sql`CREATE INDEX IF NOT EXISTS pinova_user_identities_pi_uid_idx
      ON pinova_user_identities (pi_uid) WHERE pi_uid IS NOT NULL`;
    await this.sql`CREATE TABLE IF NOT EXISTS pinova_auth_sessions (
      token_hash char(64) PRIMARY KEY,
      user_id text NOT NULL REFERENCES pinova_user_identities(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await this.sql`CREATE INDEX IF NOT EXISTS pinova_auth_sessions_user_idx
      ON pinova_auth_sessions (user_id)`;
    await this.sql`CREATE INDEX IF NOT EXISTS pinova_auth_sessions_expiry_idx
      ON pinova_auth_sessions (expires_at)`;
    await this.sql`CREATE TABLE IF NOT EXISTS pinova_auth_revocations (
      token_hash char(64) PRIMARY KEY,
      revoked_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz NOT NULL
    )`;
    await this.sql`CREATE INDEX IF NOT EXISTS pinova_auth_revocations_expiry_idx
      ON pinova_auth_revocations (expires_at)`;
  }

  public async findUserByUsername(username: string): Promise<UserIdentityEntity | null> {
    const key = normalizeUsername(username);
    if (!key) return null;
    const rows = await this.sql`SELECT * FROM pinova_user_identities WHERE username_normalized = ${key} LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async findUserById(id: string): Promise<UserIdentityEntity | null> {
    const rows = await this.sql`SELECT * FROM pinova_user_identities WHERE id = ${id} LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async upsertVerifiedPiIdentity(input: {
    username: string;
    piUid: string;
    email?: string;
  }): Promise<UserIdentityEntity> {
    const username = input.username.trim().replace(/^@/, '');
    const normalized = normalizeUsername(username);
    if (!username || !normalized || !input.piUid.trim()) {
      throw new Error('AUTH_IDENTITY_INVALID');
    }
    const rows = await this.sql`
      INSERT INTO pinova_user_identities
        (id, username, username_normalized, pi_uid, email, roles, status)
      VALUES
        (${randomUUID()}, ${username}, ${normalized}, ${input.piUid.trim()},
         ${input.email || null}, '["PIONEER"]'::jsonb, 'ACTIVE')
      ON CONFLICT (username_normalized) DO UPDATE SET
        username = EXCLUDED.username,
        pi_uid = COALESCE(pinova_user_identities.pi_uid, EXCLUDED.pi_uid),
        email = COALESCE(EXCLUDED.email, pinova_user_identities.email),
        updated_at = now()
      RETURNING *
    `;
    if (!rows[0]) throw new Error('AUTH_IDENTITY_UPSERT_FAILED');
    if (String(rows[0].pi_uid) !== input.piUid.trim()) {
      throw new Error('AUTH_PI_UID_MISMATCH');
    }
    return mapUser(rows[0]);
  }

  /** Privileged role changes must only be called behind server-side admin authorization. */
  public async setAuthoritativeRoles(userId: string, roles: UserRole[]): Promise<UserIdentityEntity | null> {
    const rows = await this.sql`
      UPDATE pinova_user_identities SET roles = ${JSON.stringify([...new Set(roles)])}::jsonb,
        updated_at = now()
      WHERE id = ${userId} RETURNING *
    `;
    return rows[0] ? mapUser(rows[0]) : null;
  }

  public async createSession(token: string, userId: string, expiresAt: number): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');
    await this.sql`INSERT INTO pinova_auth_sessions (token_hash, user_id, expires_at)
      VALUES (${hash}, ${userId}, to_timestamp(${expiresAt / 1000}))
      ON CONFLICT (token_hash) DO NOTHING`;
  }

  public async findActiveSession(token: string): Promise<{ user: UserIdentityEntity; expiresAt: number } | null> {
    const hash = createHash('sha256').update(token).digest('hex');
    const rows = await this.sql`
      SELECT u.*, s.expires_at
      FROM pinova_auth_sessions s
      JOIN pinova_user_identities u ON u.id = s.user_id
      WHERE s.token_hash = ${hash}
        AND s.expires_at > now()
        AND NOT EXISTS (
          SELECT 1 FROM pinova_auth_revocations r
          WHERE r.token_hash = s.token_hash AND r.expires_at > now()
        )
      LIMIT 1
    `;
    if (!rows[0]) return null;
    const { expires_at, ...userRow } = rows[0];
    return { user: mapUser(userRow), expiresAt: new Date(expires_at).getTime() };
  }

  /** Revoke before returning from logout; only the hash is persisted. */
  public async revokeSession(token: string, expiresAt: number): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');
    await this.sql`INSERT INTO pinova_auth_revocations (token_hash, expires_at)
      VALUES (${hash}, to_timestamp(${expiresAt / 1000}))
      ON CONFLICT (token_hash) DO UPDATE SET revoked_at = now(),
        expires_at = GREATEST(pinova_auth_revocations.expires_at, EXCLUDED.expires_at)`;
    await this.sql`DELETE FROM pinova_auth_sessions WHERE token_hash = ${hash}`;
  }

  public async pruneExpiredAuthRows(): Promise<void> {
    await this.sql`DELETE FROM pinova_auth_sessions WHERE expires_at <= now()`;
    await this.sql`DELETE FROM pinova_auth_revocations WHERE expires_at <= now()`;
  }
}
