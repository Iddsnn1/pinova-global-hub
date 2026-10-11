-- Utility invoice/payment schema. Apply through the reviewed Neon migration workflow.
-- Exact Pi values use NUMERIC(30,12); do not round to Number before authorization.
CREATE TABLE IF NOT EXISTS public.utility_invoices (
  invoice_id text PRIMARY KEY,
  owner_user_id text NOT NULL,
  payment_id text UNIQUE,
  service_category text NOT NULL,
  provider_id text NOT NULL,
  account_number text NOT NULL,
  package_name text NOT NULL,
  fiat_amount numeric(30, 8) NOT NULL CHECK (fiat_amount > 0),
  fiat_currency char(3) NOT NULL CHECK (fiat_currency ~ '^[A-Z]{3}$'),
  pi_amount numeric(30, 12) NOT NULL CHECK (pi_amount > 0),
  fx_source text NOT NULL,
  fx_as_of timestamptz NOT NULL,
  fx_usd_per_fiat_unit numeric(30, 16) NOT NULL CHECK (fx_usd_per_fiat_unit > 0),
  status text NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN','PAID','FULFILLMENT_PENDING','FULFILLED','CANCELLED','FAILED')),
  payment_txid text UNIQUE,
  provider_reference text,
  fulfillment_response jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  fulfilled_at timestamptz,
  CHECK (expires_at > created_at)
);
-- Supports applying this migration after an earlier draft where payment_id was NOT NULL.
ALTER TABLE public.utility_invoices ALTER COLUMN payment_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS utility_invoices_owner_created_idx
  ON public.utility_invoices (owner_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS utility_invoices_status_expiry_idx
  ON public.utility_invoices (status, expires_at);

CREATE TABLE IF NOT EXISTS public.utility_payment_idempotency (
  idempotency_key text PRIMARY KEY,
  invoice_id text NOT NULL REFERENCES public.utility_invoices(invoice_id),
  payment_id text NOT NULL,
  request_fingerprint text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','RESOLVED','FAILED')),
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (invoice_id, payment_id)
);
CREATE INDEX IF NOT EXISTS utility_payment_idempotency_expiry_idx
  ON public.utility_payment_idempotency (expires_at);

CREATE TABLE IF NOT EXISTS public.utility_fulfillment_attempts (
  attempt_id text PRIMARY KEY,
  invoice_id text NOT NULL REFERENCES public.utility_invoices(invoice_id),
  payment_id text NOT NULL,
  payment_txid text NOT NULL,
  provider text NOT NULL,
  status text NOT NULL CHECK (status IN ('STARTED','SUCCEEDED','FAILED','UNKNOWN')),
  provider_reference text,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (invoice_id, payment_txid)
);
CREATE INDEX IF NOT EXISTS utility_fulfillment_attempts_invoice_idx
  ON public.utility_fulfillment_attempts (invoice_id, created_at DESC);
