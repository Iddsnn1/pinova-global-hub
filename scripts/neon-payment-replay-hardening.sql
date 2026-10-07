-- PiNova Global Hub — durable payment replay hardening
-- Run once against the production Neon database before enabling payment verification.
-- This intentionally fails if existing non-empty txids are duplicated so no data is silently discarded.

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
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS orders_pi_txid_unique_idx
  ON orders (btrim(pi_txid))
  WHERE pi_txid IS NOT NULL AND btrim(pi_txid) <> '';

-- Keep payment-id replay protection durable as well.
CREATE UNIQUE INDEX IF NOT EXISTS orders_pi_payment_id_unique_idx
  ON orders (btrim(pi_payment_id))
  WHERE pi_payment_id IS NOT NULL AND btrim(pi_payment_id) <> '';
