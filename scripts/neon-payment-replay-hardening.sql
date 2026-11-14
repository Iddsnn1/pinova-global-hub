-- PiNova Global Hub — durable payment replay hardening
-- Preview migration artifact. Do not apply to Production until the migration plan,
-- data preflight, backup, and explicit Production approval are complete.
-- Fail before creating either normalized unique index if existing rows collide.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM orders
    WHERE pi_txid IS NOT NULL
      AND btrim(pi_txid) <> ''
    GROUP BY btrim(pi_txid)
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'DUPLICATE_PI_TXIDS_EXIST';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM orders
    WHERE pi_payment_id IS NOT NULL
      AND btrim(pi_payment_id) <> ''
    GROUP BY btrim(pi_payment_id)
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'DUPLICATE_PI_PAYMENT_IDS_EXIST';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS orders_pi_txid_unique_idx
  ON orders (btrim(pi_txid))
  WHERE pi_txid IS NOT NULL AND btrim(pi_txid) <> '';

-- Normalize whitespace consistently; this complements the existing exact-value
-- UNIQUE constraint and prevents replay using a whitespace-variant payment ID.
CREATE UNIQUE INDEX IF NOT EXISTS orders_pi_payment_id_unique_idx
  ON orders (btrim(pi_payment_id))
  WHERE pi_payment_id IS NOT NULL AND btrim(pi_payment_id) <> '';
