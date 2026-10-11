import assert from 'node:assert/strict';
import type { Pool, PoolClient } from 'pg';
import { NeonUtilityInvoiceRepository } from '../src/server/db/repositories/NeonUtilityInvoiceRepository';

const now = new Date();
const invoiceRow = {
  invoice_id: 'UTIL-INV-TEST',
  owner_user_id: 'buyer-01',
  payment_id: 'pi-payment-01',
  service_category: 'airtime',
  provider_id: 'provider-mtn',
  account_number: '08000000000',
  package_name: 'NGN 100 airtime',
  fiat_amount: '100.00',
  fiat_currency: 'NGN',
  pi_amount: '0.000002069016',
  fx_source: 'currencyapi.com',
  fx_as_of: now.toISOString(),
  fx_usd_per_fiat_unit: '0.00065',
  status: 'OPEN',
  payment_txid: null,
  expires_at: new Date(now.getTime() + 5 * 60_000).toISOString(),
  created_at: now.toISOString(),
};

function mockPoolForReservation(options: { amount?: number; updateRows?: number } = {}) {
  const statements: string[] = [];
  const client = {
    query: async (sql: string) => {
      statements.push(sql.trim().replace(/\s+/g, ' '));
      if (sql.includes('FROM public.utility_invoices') && sql.includes('FOR UPDATE')) {
        return { rows: [invoiceRow], rowCount: 1 };
      }
      if (sql.includes('INSERT INTO public.utility_payment_idempotency')) {
        return { rows: [{ idempotency_key: 'pi-payment-01' }], rowCount: 1 };
      }
      if (sql.includes('UPDATE public.utility_invoices')) {
        return { rows: [], rowCount: options.updateRows ?? 1 };
      }
      return { rows: [], rowCount: 1 };
    },
    release: () => undefined,
  };
  const pool = {
    connect: async () => client,
    query: async () => ({ rows: [], rowCount: 0 }),
    end: async () => undefined,
  };
  return { pool: pool as unknown as Pool, statements };
}

async function run() {
  const good = mockPoolForReservation();
  const repository = new NeonUtilityInvoiceRepository(good.pool);
  const result = await repository.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-01' },
  });
  assert.equal(result.status, 'RESERVED');
  assert.ok(good.statements.includes('BEGIN'));
  assert.ok(good.statements.includes('COMMIT'));
  assert.ok(good.statements.some((statement) => statement.includes('FOR UPDATE')));
  assert.ok(good.statements.some((statement) => statement.includes('utility_payment_idempotency')));
  assert.ok(good.statements.some((statement) => statement.includes('utility_fulfillment_attempts')));

  const mismatch = mockPoolForReservation();
  const mismatchRepo = new NeonUtilityInvoiceRepository(mismatch.pool);
  const rejected = await mismatchRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    amount: 0.000002069017,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-02' },
  });
  assert.deepEqual(rejected, { status: 'REJECTED', error: 'PI_PAYMENT_AMOUNT_MISMATCH' });
  assert.ok(mismatch.statements.includes('ROLLBACK'));
  assert.ok(!mismatch.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));

  const race = mockPoolForReservation({ updateRows: 0 });
  const raceRepo = new NeonUtilityInvoiceRepository(race.pool);
  const raceResult = await raceRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-03' },
  });
  assert.deepEqual(raceResult, { status: 'REJECTED', error: 'UTILITY_INVOICE_STATE_CONFLICT' });
  assert.ok(race.statements.includes('ROLLBACK'));

  console.log('Neon utility invoice repository tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
