-- PiNova Global Hub: durable authentication schema
-- Apply only to an isolated Preview Neon branch first. Never run against Production
-- without a reviewed backup, migration plan, and explicit release approval.

CREATE TABLE IF NOT EXISTS public.user_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  pi_uid text,
  email text,
  roles jsonb NOT NULL DEFAULT '["PIONEER"]'::jsonb,
  institution_id text,
  guardian_id text,
  status text NOT NULL DEFAULT 'ACTIVE',
  session_version bigint NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_identities_roles_array CHECK (jsonb_typeof(roles) = 'array'),
  CONSTRAINT user_identities_status_check CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
  CONSTRAINT user_identities_session_version_check CHECK (session_version > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_identities_username_lower_uq
  ON public.user_identities (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS user_identities_pi_uid_key
  ON public.user_identities (pi_uid)
  WHERE pi_uid IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash char(64) NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES public.user_identities(id) ON DELETE CASCADE,
  session_version bigint NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revoke_reason text
);

CREATE INDEX IF NOT EXISTS user_sessions_expiry_idx
  ON public.user_sessions (expires_at);
CREATE INDEX IF NOT EXISTS user_sessions_user_active_idx
  ON public.user_sessions (user_id, expires_at)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS public.revoked_sessions (
  token_hash char(64) PRIMARY KEY,
  revoked_at timestamptz NOT NULL DEFAULT now(),
  reason text
);
