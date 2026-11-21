-- PiNova Education durable settlement foundation.
-- Preview-only rollout. Does not import, overwrite, or delete legacy file-backed records.
CREATE TABLE IF NOT EXISTS education_invoices (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (currency = 'PI'),
  total_amount NUMERIC(30,12) NOT NULL CHECK (total_amount >= 0),
  amount_paid NUMERIC(30,12) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  outstanding_balance NUMERIC(30,12) NOT NULL CHECK (outstanding_balance >= 0),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_invoices_institution_student_idx ON education_invoices (institution_id, student_id);
CREATE INDEX IF NOT EXISTS education_invoices_status_idx ON education_invoices (status);

CREATE TABLE IF NOT EXISTS education_payments (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES education_invoices(id),
  institution_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  pi_payment_id TEXT,
  pi_txid TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  amount_paid NUMERIC(30,12) NOT NULL CHECK (amount_paid > 0),
  currency TEXT NOT NULL CHECK (currency = 'PI'),
  status TEXT NOT NULL,
  data JSONB NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS education_payments_pi_payment_id_uq
  ON education_payments (pi_payment_id) WHERE pi_payment_id IS NOT NULL AND btrim(pi_payment_id) <> '';
CREATE UNIQUE INDEX IF NOT EXISTS education_payments_pi_txid_uq
  ON education_payments (pi_txid) WHERE pi_txid IS NOT NULL AND btrim(pi_txid) <> '';
CREATE INDEX IF NOT EXISTS education_payments_invoice_verified_idx ON education_payments (invoice_id, verified_at DESC);

CREATE TABLE IF NOT EXISTS education_receipts (
  receipt_number TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE REFERENCES education_payments(id),
  invoice_id TEXT NOT NULL REFERENCES education_invoices(id),
  verification_hash TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_receipts_invoice_idx ON education_receipts (invoice_id);

CREATE TABLE IF NOT EXISTS education_audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_username TEXT NOT NULL,
  audit_hash TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS education_audit_logs_entity_idx ON education_audit_logs (entity_type, entity_id, created_at DESC);

CREATE TABLE IF NOT EXISTS pinova_schema_migrations (
  migration_id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO pinova_schema_migrations (migration_id)
VALUES ('20261117_education_durable_settlement')
ON CONFLICT (migration_id) DO NOTHING;
