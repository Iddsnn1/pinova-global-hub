-- Compatibility migration for databases where utility invoices were created
-- before owner_pi_uid was part of the canonical schema.
-- Do not infer Pi UIDs from internal user IDs or backfill unverified identities.
ALTER TABLE public.utility_invoices
  ADD COLUMN IF NOT EXISTS owner_pi_uid text;

-- Existing rows without an authoritative Pi UID remain unverified and must not
-- be authorized for payment. New invoice writes must supply a server-authenticated UID.
CREATE INDEX IF NOT EXISTS utility_invoices_owner_pi_uid_idx
  ON public.utility_invoices (owner_pi_uid)
  WHERE owner_pi_uid IS NOT NULL;
