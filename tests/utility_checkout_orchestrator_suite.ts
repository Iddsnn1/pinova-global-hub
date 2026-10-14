import assert from 'node:assert/strict';
import { processUtilityCheckout, type UtilityCheckoutDependencies } from '../src/server/services/UtilityCheckoutOrchestrator';

const invoice = {
  invoiceId: 'UTIL-INV-TEST', ownerUserId: 'buyer-01', ownerPiUid: 'buyer-uid-01', paymentId: 'pi-payment-01',
  fiatAmount: '100.00', fiatCurrency: 'NGN', piAmount: '0.000002069016', status: 'OPEN' as const,
  serviceCategory: 'airtime', providerId: 'provider-mtn', accountNumber: '08000000000',
  packageName: 'NGN 100 airtime', fxSource: 'currencyapi.com',
  fxAsOf: new Date().toISOString(), fxUsdPerFiatUnit: '0.00065',
  expiresAt: new Date(Date.now() + 300_000).toISOString(), createdAt: new Date().toISOString(),
};
const verifiedPayment = {
  verified: true, status: 'VERIFIED' as const, source: 'pi_platform' as const,
  message: 'verified', paymentData: {
    identifier: 'pi-payment-01', user_uid: 'buyer-uid-01', direction: 'user_to_app', network: 'Pi Testnet', amount: 0.000002069016,
    status: { developer_completed: true }, transaction: { verified: true, txid: 'pi-tx-01' },
  },
};

function setup(overrides: Partial<UtilityCheckoutDependencies> = {}) {
  const calls = { verify: 0, reserve: 0, fulfill: 0, record: 0, outcome: 'SUCCEEDED' as 'SUCCEEDED' | 'FAILED' | 'UNKNOWN' };
  const repository = {
    findOwnedInvoice: async () => invoice,
    authorizeAndReserve: async () => {
      calls.reserve++;
      return { status: 'RESERVED' as const, invoiceId: invoice.invoiceId, paymentId: invoice.paymentId, txid: 'pi-tx-01', attemptId: 'attempt-01' };
    },
    recordFulfillmentOutcome: async (input: { status: 'SUCCEEDED' | 'FAILED' | 'UNKNOWN' }) => {
      calls.record++;
      calls.outcome = input.status;
      return true;
    },
  };
  const deps: UtilityCheckoutDependencies = {
    repository: repository as unknown as UtilityCheckoutDependencies['repository'],
    verifyPayment: async () => { calls.verify++; return verifiedPayment; },
    fulfill: async () => {
      calls.fulfill++;
      return { status: 'SUCCEEDED' as const, providerReference: 'vtu-ref-01', response: { ok: true } };
    },
    ...overrides,
  };
  return { deps, calls, repository };
}

async function run() {
  const missing = setup({
    repository: {
      ...setup().repository,
      findOwnedInvoice: async () => null,
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(missing.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: 'attacker', paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'UTILITY_INVOICE_NOT_FOUND' });
  assert.equal(missing.calls.verify, 0);
  assert.equal(missing.calls.fulfill, 0);

  const mismatch = setup();
  assert.deepEqual(await processUtilityCheckout(mismatch.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: 'different-payment',
  }), { status: 'REJECTED', error: 'PI_PAYMENT_ID_MISMATCH' });
  assert.equal(mismatch.calls.fulfill, 0);

  const notVerified = setup({ verifyPayment: async () => ({ ...verifiedPayment, verified: false }) });
  assert.deepEqual(await processUtilityCheckout(notVerified.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_NOT_VERIFIED' });
  assert.equal(notVerified.calls.reserve, 0);

  const ownerMismatch = setup({
    verifyPayment: async () => ({
      ...verifiedPayment,
      paymentData: { ...verifiedPayment.paymentData, user_uid: 'different-pi-uid' },
    }),
  });
  assert.deepEqual(await processUtilityCheckout(ownerMismatch.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_OWNER_MISMATCH' });
  assert.equal(ownerMismatch.calls.reserve, 0);
  assert.equal(ownerMismatch.calls.fulfill, 0);

  const missingInvoiceUid = setup({
    repository: {
      ...setup().repository,
      findOwnedInvoice: async () => ({ ...invoice, ownerPiUid: '' }),
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(missingInvoiceUid.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_OWNER_MISMATCH' });
  assert.equal(missingInvoiceUid.calls.reserve, 0);
  assert.equal(missingInvoiceUid.calls.fulfill, 0);

  const success = setup();
  assert.deepEqual(await processUtilityCheckout(success.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), {
    status: 'FULFILLED', invoiceId: invoice.invoiceId, paymentId: invoice.paymentId,
    txid: 'pi-tx-01', providerReference: 'vtu-ref-01', response: { ok: true },
  });
  assert.equal(success.calls.reserve, 1);
  assert.equal(success.calls.fulfill, 1);
  assert.equal(success.calls.record, 1);

  const inProgress = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => ({ status: 'IN_PROGRESS' as const, invoiceId: invoice.invoiceId, paymentId: invoice.paymentId, txid: 'pi-tx-01' }),
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.equal((await processUtilityCheckout(inProgress.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  })).status, 'IN_PROGRESS');
  assert.equal(inProgress.calls.fulfill, 0);

  const unknown = setup({
    fulfill: async () => { throw new Error('upstream response lost'); },
  });
  assert.equal((await processUtilityCheckout(unknown.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  })).status, 'FULFILLMENT_PENDING');
  assert.equal(unknown.calls.outcome, 'UNKNOWN');

  // If the provider may have acted but outcome persistence fails, checkout must
  // return pending and must not silently claim success or dispatch a second time.
  const recordFailure = setup({
    repository: {
      ...setup().repository,
      recordFulfillmentOutcome: async () => false,
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.equal((await processUtilityCheckout(recordFailure.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  })).status, 'FULFILLMENT_PENDING');
  assert.equal(recordFailure.calls.fulfill, 1);

  // A previously resolved idempotency reservation returns its recorded result
  // without calling the external provider again.
  const resolved = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => ({
        status: 'RESOLVED' as const, invoiceId: invoice.invoiceId,
        paymentId: invoice.paymentId, txid: 'pi-tx-01', response: { receipt: 'cached' },
      }),
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(resolved.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), {
    status: 'RESOLVED', invoiceId: invoice.invoiceId, paymentId: invoice.paymentId,
    response: { receipt: 'cached' },
  });
  assert.equal(resolved.calls.fulfill, 0);

  console.log('Utility checkout orchestrator tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
