-- PiNova auth durability schema (Preview-first).
-- Apply only to the dedicated Neon Preview branch after reviewing the migration.
-- Session tokens are never stored in plaintext; only SHA-256 token hashes are persisted.

CREATE TABLE IF NOT EXISTS public.user_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  pi_uid TEXT UNIQUE,
  email TEXT,
  roles JSONB NOT NULL DEFAULT '["PIONEER"]'::jsonb,
  institution_id TEXT,
  guardian_id TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
  session_version BIGINT NOT NULL DEFAULT 1 CHECK (session_version > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_identities_roles_array CHECK (jsonb_typeof(roles) = 'array')
);

CREATE UNIQUE INDEX IF NOT EXISTS user_identities_username_lower_uq
  ON public.user_identities (LOWER(username));

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash CHAR(64) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.user_identities(id) ON DELETE CASCADE,
  session_version BIGINT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT
);

CREATE INDEX IF NOT EXISTS user_sessions_user_active_idx
  ON public.user_sessions (user_id, expires_at)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS user_sessions_expiry_idx
  ON public.user_sessions (expires_at);

CREATE TABLE IF NOT EXISTS public.revoked_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT
);

-- Restrict direct table access to the application database role.
-- Role grants are intentionally handled by deployment-specific migration
-- after confirming the exact Neon application role; no guessed role names.
