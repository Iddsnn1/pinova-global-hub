-- PiNova durable authentication schema (Preview-first migration).
-- Session bearer tokens are never stored: only SHA-256 token hashes are persisted.
CREATE TABLE IF NOT EXISTS pinova_user_identities (
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
);
CREATE INDEX IF NOT EXISTS pinova_user_identities_pi_uid_idx
  ON pinova_user_identities (pi_uid) WHERE pi_uid IS NOT NULL;

CREATE TABLE IF NOT EXISTS pinova_auth_sessions (
  token_hash char(64) PRIMARY KEY,
  user_id text NOT NULL REFERENCES pinova_user_identities(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pinova_auth_sessions_user_idx ON pinova_auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS pinova_auth_sessions_expiry_idx ON pinova_auth_sessions (expires_at);

CREATE TABLE IF NOT EXISTS pinova_auth_revocations (
  token_hash char(64) PRIMARY KEY,
  revoked_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS pinova_auth_revocations_expiry_idx
  ON pinova_auth_revocations (expires_at);
