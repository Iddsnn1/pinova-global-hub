-- PiNova Global Hub — Education ledger foundation
-- Purpose: durable School Fees -> Pi Pay -> Receipt persistence.
-- Apply only through the controlled deployment migration process.
-- Pi amounts use NUMERIC(30,12) to preserve the project's 12-decimal Pi contract.

BEGIN;

CREATE TABLE IF NOT EXISTS education_invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_matric_or_reg TEXT,
  guardian_id TEXT,
  education_tier TEXT NOT NULL,
  education_level TEXT,
  programme_or_class TEXT NOT NULL,
  academic_session TEXT NOT NULL,
  term_or_semester TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  line_items JSONB,
  subtotal NUMERIC(30,12) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(30,12) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  discount_reason TEXT,
  tax_amount NUMERIC(30,12) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC(30,12) NOT NULL CHECK (total_amount >= 0),
  amount_paid NUMERIC(30,12) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  outstanding_balance NUMERIC(30,12) NOT NULL CHECK (outstanding_balance >= 0),
  currency TEXT NOT NULL CHECK (currency = 'PI'),
  country_code TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  issued_date TIMESTAMPTZ,
  status TEXT NOT NULL,
  allowed_installments INTEGER NOT NULL DEFAULT 1 CHECK (allowed_installments > 0),
  installments_paid_count INTEGER NOT NULL DEFAULT 0 CHECK (installments_paid_count >= 0),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT education_invoice_balance_consistency
    CHECK (amount_paid + outstanding_balance = total_amount)
);

CREATE INDEX IF NOT EXISTS education_invoices_student_idx
  ON education_invoices(student_id);

CREATE INDEX IF NOT EXISTS education_invoices_guardian_idx
  ON education_invoices(guardian_id);

CREATE INDEX IF NOT EXISTS education_invoices_institution_idx
  ON education_invoices(institution_id);

CREATE TABLE IF NOT EXISTS education_payments (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES education_invoices(id),
  institution_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  amount_paid NUMERIC(30,12) NOT NULL CHECK (amount_paid > 0),
  currency TEXT NOT NULL CHECK (currency = 'PI'),
  pi_amount NUMERIC(30,12) NOT NULL CHECK (pi_amount > 0),
  pi_payment_id TEXT UNIQUE,
  pi_txid TEXT UNIQUE,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  receipt_number TEXT NOT NULL UNIQUE,
  payer_username TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  audit_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT education_payment_invoice_idempotency_uq
    UNIQUE (invoice_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS education_payments_invoice_idx
  ON education_payments(invoice_id);

CREATE TABLE IF NOT EXISTS education_receipts (
  receipt_number TEXT PRIMARY KEY,
  verification_reference TEXT NOT NULL UNIQUE,
  verification_hash TEXT NOT NULL,
  algorithm TEXT NOT NULL DEFAULT 'SHA-256',
  invoice_id TEXT NOT NULL REFERENCES education_invoices(id),
  invoice_number TEXT NOT NULL,
  payment_id TEXT UNIQUE REFERENCES education_payments(id),
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  institution_logo TEXT,
  student_id TEXT,
  student_name TEXT NOT NULL,
  student_matric_or_reg TEXT NOT NULL,
  education_level TEXT NOT NULL,
  academic_session TEXT NOT NULL,
  term_or_semester TEXT NOT NULL,
  charge_description TEXT NOT NULL,
  amount_paid NUMERIC(30,12) NOT NULL CHECK (amount_paid > 0),
  currency TEXT NOT NULL CHECK (currency = 'PI'),
  pi_amount NUMERIC(30,12) NOT NULL CHECK (pi_amount > 0),
  pi_payment_id TEXT,
  pi_txid TEXT,
  payment_method TEXT NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  settlement_status TEXT,
  verified_by_server BOOLEAN NOT NULL DEFAULT TRUE,
  public_safe_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS education_receipts_invoice_idx
  ON education_receipts(invoice_id);

CREATE INDEX IF NOT EXISTS education_receipts_pi_txid_idx
  ON education_receipts(pi_txid);

COMMIT;
