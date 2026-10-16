import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import type { Pool } from 'pg';
import { NeonUtilityInvoiceRepository } from '../src/server/db/repositories/NeonUtilityInvoiceRepository';

const now = new Date();
const invoiceRow = {
  invoice_id: 'UTIL-INV-TEST',
  owner_user_id: 'buyer-01',
  owner_pi_uid: 'buyer-uid-01',
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

function mockPoolForReservation(options: { amount?: number; updateRows?: number; invoiceStatus?: string; expiresAt?: string; priorRecord?: Record<string, unknown> } = {}) {
  const statements: string[] = [];
  const client = {
    query: async (sql: string) => {
      statements.push(sql.trim().replace(/\s+/g, ' '));
      if (sql.includes('FROM public.utility_invoices') && sql.includes('FOR UPDATE')) {
        return { rows: [{ ...invoiceRow, status: options.invoiceStatus ?? 'OPEN', expires_at: options.expiresAt ?? invoiceRow.expires_at }], rowCount: 1 };
      }
      if (sql.includes('FROM public.utility_payment_idempotency') && sql.includes('FOR UPDATE')) {
        return { rows: options.priorRecord ? [options.priorRecord] : [], rowCount: options.priorRecord ? 1 : 0 };
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
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
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
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069017,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-02' },
  });
  assert.deepEqual(rejected, { status: 'REJECTED', error: 'PI_PAYMENT_AMOUNT_MISMATCH' });
  assert.ok(mismatch.statements.includes('ROLLBACK'));
  assert.ok(!mismatch.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));

  // Defense in depth: the transactional repository independently rejects
  // a payment UID that does not match the invoice owner, even if the route
  // already performed the same check before calling this repository.
  const wrongOwner = mockPoolForReservation();
  const wrongOwnerRepo = new NeonUtilityInvoiceRepository(wrongOwner.pool);
  const wrongOwnerResult = await wrongOwnerRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'different-pi-uid',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-wrong-owner' },
  });
  assert.deepEqual(wrongOwnerResult, { status: 'REJECTED', error: 'PI_PAYMENT_OWNER_MISMATCH' });
  assert.ok(wrongOwner.statements.includes('ROLLBACK'));
  assert.ok(!wrongOwner.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));
  assert.ok(!wrongOwner.statements.some((statement) => statement.includes('INSERT INTO public.utility_fulfillment_attempts')));

  // A payment in the wrong direction cannot reserve the invoice or dispatch
  // fulfillment, even if its amount and identifier otherwise match.
  const wrongDirection = mockPoolForReservation();
  const wrongDirectionRepo = new NeonUtilityInvoiceRepository(wrongDirection.pool);
  const wrongDirectionResult = await wrongDirectionRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'buyer-uid-01',
    direction: 'app_to_user',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-wrong-direction' },
  });
  assert.deepEqual(wrongDirectionResult, { status: 'REJECTED', error: 'PI_PAYMENT_DIRECTION_INVALID' });
  assert.ok(wrongDirection.statements.includes('ROLLBACK'));
  assert.ok(!wrongDirection.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));

  // Payment identity must come from a completed and transaction-verified Pi
  // payment, not merely from a matching ID and amount.
  const incomplete = mockPoolForReservation();
  const incompleteRepo = new NeonUtilityInvoiceRepository(incomplete.pool);
  const incompleteResult = await incompleteRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: false },
    transaction: { verified: true, txid: 'pi-tx-incomplete' },
  });
  assert.deepEqual(incompleteResult, { status: 'REJECTED', error: 'PI_PAYMENT_NOT_COMPLETED' });
  assert.ok(incomplete.statements.includes('ROLLBACK'));
  assert.ok(!incomplete.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));

  const fingerprint = createHash('sha256')
    .update(['UTIL-INV-TEST', 'pi-payment-01', 'pi-tx-01', '0.000002069016'].join('|'))
    .digest('hex');
  const replay = mockPoolForReservation({
    invoiceStatus: 'FULFILLED',
    priorRecord: {
      invoice_id: 'UTIL-INV-TEST',
      payment_id: 'pi-payment-01',
      request_fingerprint: fingerprint,
      status: 'RESOLVED',
      response: { success: true, providerReference: 'provider-ref-01' },
    },
  });
  const replayRepo = new NeonUtilityInvoiceRepository(replay.pool);
  const replayResult = await replayRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-01' },
  });
  assert.deepEqual(replayResult, {
    status: 'RESOLVED',
    invoiceId: 'UTIL-INV-TEST',
    paymentId: 'pi-payment-01',
    txid: 'pi-tx-01',
    response: { success: true, providerReference: 'provider-ref-01' },
  });
  assert.ok(!replay.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));
  assert.ok(!replay.statements.some((statement) => statement.includes('INSERT INTO public.utility_fulfillment_attempts')));

  const expired = mockPoolForReservation({ expiresAt: new Date(Date.now() - 60_000).toISOString() });
  const expiredRepo = new NeonUtilityInvoiceRepository(expired.pool);
  const expiredResult = await expiredRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-expired' },
  });
  assert.deepEqual(expiredResult, { status: 'REJECTED', error: 'UTILITY_INVOICE_EXPIRED' });
  assert.ok(expired.statements.includes('ROLLBACK'));
  assert.ok(!expired.statements.some((statement) => statement.includes('INSERT INTO public.utility_payment_idempotency')));

  const race = mockPoolForReservation({ updateRows: 0 });
  const raceRepo = new NeonUtilityInvoiceRepository(race.pool);
  const raceResult = await raceRepo.authorizeAndReserve('UTIL-INV-TEST', 'buyer-01', 'pi-payment-01', {
    identifier: 'pi-payment-01',
    user_uid: 'buyer-uid-01',
    direction: 'user_to_app',
    network: 'Pi Testnet',
    amount: 0.000002069016,
    status: { developer_completed: true },
    transaction: { verified: true, txid: 'pi-tx-03' },
  });
  assert.deepEqual(raceResult, { status: 'REJECTED', error: 'UTILITY_INVOICE_STATE_CONFLICT' });
  assert.ok(race.statements.includes('ROLLBACK'));


  // Invoice creation must recompute the canonical Pi amount from fiat + trusted FX.
  const previousFxSource = process.env.PINOVA_FX_PROVIDER_SOURCE;
  const previousFxUrl = process.env.PINOVA_FX_PROVIDER_URL;
  const previousFxKey = process.env.PINOVA_FX_PROVIDER_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.PINOVA_FX_PROVIDER_SOURCE = 'currencyapi.com';
  process.env.PINOVA_FX_PROVIDER_URL = 'https://api.currencyapi.com/v3/latest';
  process.env.PINOVA_FX_PROVIDER_API_KEY = 'test-only-key';
  let fxFetchCalls = 0;
  let providerRate = 1538.4615384615383;
  let providerAsOf = new Date().toISOString();
  globalThis.fetch = (async () => {
    fxFetchCalls++;
    return new Response(JSON.stringify({
    meta: { last_updated_at: providerAsOf },
    data: { NGN: { code: 'NGN', value: providerRate } },
  }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  const creationStatements: Array<{ sql: string; values?: unknown[] }> = [];
  const createPool = {
    query: async (sql: string, values?: unknown[]) => {
      creationStatements.push({ sql, values });
      return {
        rows: [{
          ...invoiceRow,
          invoice_id: 'UTIL-INV-CREATE',
          payment_id: null,
          fiat_amount: '1000.00',
          pi_amount: String(values?.[9] ?? '0.000002069016'),
          status: 'OPEN',
        }],
        rowCount: 1,
      };
    },
    end: async () => undefined,
  };
  const createRepo = new NeonUtilityInvoiceRepository(createPool as unknown as Pool);
  const createInput = {
    ownerUserId: 'buyer-01',
    ownerPiUid: 'buyer-uid-01',
    serviceCategory: 'airtime',
    providerId: 'provider-mtn',
    accountNumber: '08000000000',
    packageName: 'NGN 1000 airtime',
    fiatAmount: '1000.00',
    fiatCurrency: 'NGN',
    piAmount: '0.000002069016',
    fxSource: 'currencyapi.com',
    fxAsOf: new Date(Date.now() - 60_000).toISOString(),
    fxUsdPerFiatUnit: '0.00065',
    expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
  };
  try {
    const callsBeforeUnsafeAmount = fxFetchCalls;
    await assert.rejects(
      () => createRepo.createInvoice({ ...createInput, fiatAmount: '1234567890123456.00' }),
      /UTILITY_FIAT_AMOUNT_PRECISION_UNSUPPORTED/,
      'amounts with more than 15 significant digits must be rejected rather than silently rounded by JavaScript Number',
    );
    assert.equal(fxFetchCalls, callsBeforeUnsafeAmount,
      'unsafe fiat precision must be rejected before making an FX provider request');

    const created = await createRepo.createInvoice(createInput);
    assert.equal(created.piAmount, '0.000002069016');
    assert.ok(creationStatements[0].sql.includes('INSERT INTO public.utility_invoices'));
    assert.equal(creationStatements[0].values?.[9], '0.000002069016');

    // A provider quote older than the configured freshness window must fail closed
    // before any invoice is written; do not silently reuse stale FX data.
    providerAsOf = new Date(Date.now() - 16 * 60_000).toISOString();
    creationStatements.length = 0;
    await assert.rejects(
      () => createRepo.createInvoice(createInput),
      /FX_QUOTE_STALE/,
      'quotes older than the 15-minute policy must be rejected',
    );
    assert.equal(creationStatements.length, 0, 'stale FX must never create a durable invoice');
    providerAsOf = new Date().toISOString();

    creationStatements.length = 0;
    const staleClientEstimate = await createRepo.createInvoice({
      ...createInput,
      piAmount: '999999.999999999999',
    });
    assert.equal(staleClientEstimate.piAmount, '0.000002069016',
      'stale or tampered browser Pi estimate must be ignored in favor of the same trusted quote used for persistence');
    assert.equal(creationStatements[0].values?.[9], '0.000002069016',
      'canonical Pi amount, not the client estimate, must be persisted');

    // If the trusted provider quote changes after the browser estimate, the
    // server must recompute the canonical Pi amount from the new quote.
    providerRate = 1600;
    creationStatements.length = 0;
    const changedProviderQuote = await createRepo.createInvoice({
      ...createInput,
      piAmount: '0.000002069016',
      fxUsdPerFiatUnit: '0.00065',
    });
    assert.equal(changedProviderQuote.piAmount, '0.000001989438');
    assert.equal(creationStatements[0].values?.[9], '0.000001989438');
    assert.ok(Math.abs(Number(creationStatements[0].values?.[12]) - (1 / 1600)) < 1e-15,
      'the persisted FX rate must match the changed provider quote');
    providerRate = 1538.4615384615383;

    // Client-supplied FX fields are untrusted and must never be persisted.
    creationStatements.length = 0;
    const clientQuoteTampered = await createRepo.createInvoice({
      ...createInput,
      fxSource: 'attacker-controlled-source',
      fxAsOf: new Date(Date.now() - 60 * 60_000).toISOString(),
      fxUsdPerFiatUnit: '0.00066',
    });
    assert.equal(clientQuoteTampered.fxSource, 'currencyapi.com');
    assert.equal(creationStatements[0].values?.[10], 'currencyapi.com');
    assert.notEqual(creationStatements[0].values?.[12], '0.00066',
      'persisted FX rate must come from the server-side provider, not the client');
  } finally {
    if (previousFxSource === undefined) delete process.env.PINOVA_FX_PROVIDER_SOURCE;
    else process.env.PINOVA_FX_PROVIDER_SOURCE = previousFxSource;
    if (previousFxUrl === undefined) delete process.env.PINOVA_FX_PROVIDER_URL;
    else process.env.PINOVA_FX_PROVIDER_URL = previousFxUrl;
    if (previousFxKey === undefined) delete process.env.PINOVA_FX_PROVIDER_API_KEY;
    else process.env.PINOVA_FX_PROVIDER_API_KEY = previousFxKey;
    globalThis.fetch = previousFetch;
  }

  // Durable invoice lookup is owner-scoped and preserves the verified Pi UID
  // used by the HTTP layer to prevent cross-identity invoice disclosure.
  const lookupCalls: Array<{ sql: string; values?: unknown[] }> = [];
  const lookupPool = {
    query: async (sql: string, values?: unknown[]) => {
      lookupCalls.push({ sql, values });
      return { rows: [{ ...invoiceRow, invoice_id: 'UTIL-INV-LOOKUP' }], rowCount: 1 };
    },
    end: async () => undefined,
  };
  const lookupRepo = new NeonUtilityInvoiceRepository(lookupPool as unknown as Pool);
  const owned = await lookupRepo.findOwnedInvoice('UTIL-INV-LOOKUP', 'buyer-01');
  assert.equal(owned?.invoiceId, 'UTIL-INV-LOOKUP');
  assert.equal(owned?.ownerUserId, 'buyer-01');
  assert.equal(owned?.ownerPiUid, 'buyer-uid-01');
  assert.ok(lookupCalls[0].sql.includes('WHERE invoice_id = $1 AND owner_user_id = $2'));
  assert.deepEqual(lookupCalls[0].values, ['UTIL-INV-LOOKUP', 'buyer-01']);

  const absentPool = {
    query: async () => ({ rows: [], rowCount: 0 }),
    end: async () => undefined,
  };
  const absentRepo = new NeonUtilityInvoiceRepository(absentPool as unknown as Pool);
  assert.equal(await absentRepo.findOwnedInvoice('UTIL-INV-ABSENT', 'buyer-01'), null);

  console.log('Neon utility invoice repository tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
