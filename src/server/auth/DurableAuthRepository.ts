import crypto from 'crypto';
import { getNeonSql, neonDatabaseEnabled } from '../db/NeonDatabase';
import { UserRole, UserIdentityEntity } from './types';

type IdentityRow = {
  id: string;
  username: string;
  pi_uid: string | null;
  email: string | null;
  roles: unknown;
  institution_id: string | null;
  guardian_id: string | null;
  status: UserIdentityEntity['status'];
  session_version: string | number;
  created_at: Date | string;
  updated_at: Date | string;
};

type SessionRow = {
  id: string;
  user_id: string;
  session_version: string | number;
  expires_at: Date | string;
  revoked_at: Date | string | null;
};

function mapIdentity(row: IdentityRow): UserIdentityEntity & { sessionVersion: number } {
  const roles = Array.isArray(row.roles)
    ? row.roles.filter((role): role is UserRole => typeof role === 'string')
    : [];
  return {
    id: row.id,
    username: row.username,
    piUid: row.pi_uid || undefined,
    email: row.email || undefined,
    roles,
    institutionId: row.institution_id || undefined,
    guardianId: row.guardian_id || undefined,
    status: row.status,
    sessionVersion: Number(row.session_version),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

/**
 * Shared Neon-backed identity/session authority.
 * This repository deliberately has no file-store fallback: production auth must fail
 * closed if the durable database is unavailable.
 */
export class DurableAuthRepository {
  static isEnabled(): boolean {
    return neonDatabaseEnabled();
  }

  private get sql() {
    return getNeonSql();
  }

  async findIdentityByUsername(username: string) {
    const clean = username.trim().replace(/^@/, '');
    if (!clean) return null;
    const rows = await this.sql.query(
      'SELECT id, username, pi_uid, email, roles, institution_id, guardian_id, status, session_version, created_at, updated_at FROM public.user_identities WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [clean]
    ) as IdentityRow[];
    return rows[0] ? mapIdentity(rows[0]) : null;
  }

  async upsertVerifiedIdentity(input: {
    username: string;
    piUid?: string;
    roles?: UserRole[];
    institutionId?: string;
    isAuthorizedAdmin?: boolean;
  }) {
    const username = input.username.trim().replace(/^@/, '');
    if (!username) throw new Error('AUTH_USERNAME_REQUIRED');
    const hasExplicitRoles = Array.isArray(input.roles) && input.roles.length > 0;
    const roles = hasExplicitRoles
      ? (input.isAuthorizedAdmin
          ? input.roles!
          : input.roles!.filter((role) =>
              !['PLATFORM_ADMIN', 'COMPLIANCE_ADMIN', 'COMPLIANCE_OFFICER', 'BURSAR', 'FINANCE_ADMIN', 'INSTITUTION_ADMIN'].includes(role)
            ))
      : null;
    const rows = await this.sql.query(
      `INSERT INTO public.user_identities (username, pi_uid, roles, institution_id)
       VALUES ($1, $2, COALESCE($3::jsonb, '["PIONEER"]'::jsonb), $4)
       ON CONFLICT ((LOWER(username))) DO UPDATE SET
         pi_uid = COALESCE(EXCLUDED.pi_uid, user_identities.pi_uid),
         roles = COALESCE($3::jsonb, user_identities.roles),
         institution_id = COALESCE(EXCLUDED.institution_id, user_identities.institution_id),
         updated_at = NOW()
       RETURNING id, username, pi_uid, email, roles, institution_id, guardian_id, status, session_version, created_at, updated_at`,
      [username, input.piUid || null, roles ? JSON.stringify(roles) : null, input.institutionId || null]
    ) as IdentityRow[];
    if (!rows[0]) throw new Error('AUTH_IDENTITY_UPSERT_FAILED');
    return mapIdentity(rows[0]);
  }

  async createSession(input: { token: string; userId: string; sessionVersion: number; expiresAt: number }) {
    const tokenHash = crypto.createHash('sha256').update(input.token).digest('hex');
    await this.sql.query(
      `INSERT INTO public.user_sessions (token_hash, user_id, session_version, expires_at)
       VALUES ($1, $2::uuid, $3, TO_TIMESTAMP($4 / 1000.0))`,
      [tokenHash, input.userId, input.sessionVersion, input.expiresAt]
    );
  }

  async findActiveSession(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rows = await this.sql.query(
      `SELECT s.id, s.user_id, s.session_version, s.expires_at, s.revoked_at
       FROM public.user_sessions s
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    ) as SessionRow[];
    return rows[0] || null;
  }

  async revokeSession(token: string, reason = 'logout') {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.sql.query(
      `UPDATE public.user_sessions SET revoked_at = NOW(), revoke_reason = $2
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [tokenHash, reason]
    );
  }

  async revokeAllUserSessions(userId: string, reason = 'identity_changed') {
    await this.sql.query(
      `UPDATE public.user_sessions SET revoked_at = NOW(), revoke_reason = $2
       WHERE user_id = $1::uuid AND revoked_at IS NULL`,
      [userId, reason]
    );
    await this.sql.query(
      'UPDATE public.user_identities SET session_version = session_version + 1, updated_at = NOW() WHERE id = $1::uuid',
      [userId]
    );
  }
}
