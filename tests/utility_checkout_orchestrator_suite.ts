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
    repository: (overrides.repository ?? repository) as unknown as UtilityCheckoutDependencies['repository'],
    verifyPayment: async (paymentId) => {
      calls.verify++;
      if (overrides.verifyPayment) return overrides.verifyPayment(paymentId);
      return verifiedPayment;
    },
    fulfill: async (invoice, paymentId, txid) => {
      calls.fulfill++;
      if (overrides.fulfill) return overrides.fulfill(invoice, paymentId, txid);
      return { status: 'SUCCEEDED' as const, providerReference: 'vtu-ref-01', response: { ok: true } };
    },
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
  assert.equal(missing.calls.reserve, 0);
  assert.equal(missing.calls.fulfill, 0);
  assert.equal(missing.calls.record, 0);

  const mismatch = setup();
  assert.deepEqual(await processUtilityCheckout(mismatch.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: 'different-payment',
  }), { status: 'REJECTED', error: 'PI_PAYMENT_ID_MISMATCH' });
  assert.equal(mismatch.calls.verify, 0);
  assert.equal(mismatch.calls.reserve, 0);
  assert.equal(mismatch.calls.fulfill, 0);
  assert.equal(mismatch.calls.record, 0);

  const notVerified = setup({ verifyPayment: async () => ({ ...verifiedPayment, verified: false }) });
  assert.deepEqual(await processUtilityCheckout(notVerified.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_NOT_VERIFIED' });
  assert.equal(notVerified.calls.verify, 1, 'the payment verifier must run exactly once');
  assert.equal(notVerified.calls.reserve, 0, 'an unverified payment must not reserve the invoice');
  assert.equal(notVerified.calls.fulfill, 0, 'an unverified payment must never call the provider');
  assert.equal(notVerified.calls.record, 0);

  // A verifier response that claims success but omits authoritative payment data
  // is malformed and must not reach reservation or the provider boundary.
  const missingVerifiedPaymentData = setup({
    verifyPayment: async () => ({
      verified: true,
      status: 'VERIFIED' as const,
      source: 'pi_platform' as const,
      message: 'verified response missing payment data',
      paymentData: undefined,
    }),
  });
  assert.deepEqual(await processUtilityCheckout(missingVerifiedPaymentData.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_NOT_VERIFIED' });
  assert.equal(missingVerifiedPaymentData.calls.verify, 1);
  assert.equal(missingVerifiedPaymentData.calls.reserve, 0,
    'a malformed verifier success without payment data must not reserve the invoice');
  assert.equal(missingVerifiedPaymentData.calls.fulfill, 0,
    'a malformed verifier success without payment data must never call the provider');
  assert.equal(missingVerifiedPaymentData.calls.record, 0);

  const ownerMismatch = setup({
    verifyPayment: async () => ({
      ...verifiedPayment,
      paymentData: { ...verifiedPayment.paymentData, user_uid: 'different-pi-uid' },
    }),
  });
  assert.deepEqual(await processUtilityCheckout(ownerMismatch.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_OWNER_MISMATCH' });
  assert.equal(ownerMismatch.calls.verify, 1, 'the authoritative Pi UID is checked after verification');
  assert.equal(ownerMismatch.calls.reserve, 0, 'a Pi UID mismatch must not reserve the invoice');
  assert.equal(ownerMismatch.calls.fulfill, 0, 'a Pi UID mismatch must never call the provider');
  assert.equal(ownerMismatch.calls.record, 0);

  const missingInvoiceUid = setup({
    repository: {
      ...setup().repository,
      findOwnedInvoice: async () => ({ ...invoice, ownerPiUid: '' }),
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(missingInvoiceUid.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_OWNER_MISMATCH' });
  assert.equal(missingInvoiceUid.calls.verify, 1);
  assert.equal(missingInvoiceUid.calls.reserve, 0, 'an invoice without an owner Pi UID must not be reserved');
  assert.equal(missingInvoiceUid.calls.fulfill, 0, 'an invoice without an owner Pi UID must never call the provider');
  assert.equal(missingInvoiceUid.calls.record, 0);

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

  // A transient failure of the authoritative Pi verifier must fail closed
  // before reserving an invoice or contacting the utility provider.
  const verificationUnavailable = setup({
    verifyPayment: async () => { throw new Error('Pi Platform temporarily unavailable'); },
  });
  assert.deepEqual(await processUtilityCheckout(verificationUnavailable.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_VERIFICATION_UNAVAILABLE' });
  assert.equal(verificationUnavailable.calls.verify, 1);
  assert.equal(verificationUnavailable.calls.reserve, 0, 'verification outage must not reserve the invoice');
  assert.equal(verificationUnavailable.calls.fulfill, 0, 'verification outage must never call the provider');
  assert.equal(verificationUnavailable.calls.record, 0);

  // A definite provider rejection must be recorded and surfaced as a failed
  // fulfillment, never as a successful receipt.
  const providerRejected = setup({
    fulfill: async () => ({ status: 'FAILED' as const, providerReference: 'vtu-decline-01', response: { code: 'DECLINED' } }),
  });
  assert.deepEqual(await processUtilityCheckout(providerRejected.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), {
    status: 'FULFILLMENT_FAILED', invoiceId: invoice.invoiceId, paymentId: invoice.paymentId,
    txid: 'pi-tx-01', error: 'UTILITY_PROVIDER_REJECTED',
  });
  assert.equal(providerRejected.calls.outcome, 'FAILED');
  assert.equal(providerRejected.calls.record, 1);

  // An explicit ambiguous provider response is also pending; it must be recorded as
  // UNKNOWN rather than being treated as a definite failure or successful recharge.
  const explicitUnknown = setup({
    fulfill: async () => ({ status: 'UNKNOWN' as const, providerReference: 'vtu-ambiguous-01', response: { code: 'PROCESSING' } }),
  });
  assert.deepEqual(await processUtilityCheckout(explicitUnknown.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), {
    status: 'FULFILLMENT_PENDING', invoiceId: invoice.invoiceId,
    paymentId: invoice.paymentId, txid: 'pi-tx-01',
  });
  assert.equal(explicitUnknown.calls.outcome, 'UNKNOWN');
  assert.equal(explicitUnknown.calls.record, 1);
  assert.equal(explicitUnknown.calls.fulfill, 1, 'ambiguous outcomes must not trigger an automatic second dispatch');

  // If recording throws after the provider call, report pending for reconciliation
  // and do not misrepresent the outcome as success.
  const recordThrows = setup({
    repository: {
      ...setup().repository,
      recordFulfillmentOutcome: async () => { throw new Error('database write failed'); },
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(recordThrows.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), {
    status: 'FULFILLMENT_PENDING', invoiceId: invoice.invoiceId,
    paymentId: invoice.paymentId, txid: 'pi-tx-01',
  });
  assert.equal(recordThrows.calls.fulfill, 1);

  // Concurrent requests must rely on the repository's atomic reservation:
  // only one request receives RESERVED; the competing request receives IN_PROGRESS.
  // Even when both requests have valid authoritative payment data, the provider
  // must be dispatched exactly once.
  let reservationCalls = 0;
  let providerCalls = 0;
  let releaseProvider!: () => void;
  const providerGate = new Promise<void>((resolve) => { releaseProvider = resolve; });
  const concurrent = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => {
        reservationCalls++;
        if (reservationCalls === 1) {
          return { status: 'RESERVED' as const, invoiceId: invoice.invoiceId, paymentId: invoice.paymentId, txid: 'pi-tx-concurrent', attemptId: 'attempt-concurrent' };
        }
        return { status: 'IN_PROGRESS' as const, invoiceId: invoice.invoiceId, paymentId: invoice.paymentId, txid: 'pi-tx-concurrent' };
      },
    } as unknown as UtilityCheckoutDependencies['repository'],
    fulfill: async () => {
      providerCalls++;
      await providerGate;
      return { status: 'SUCCEEDED' as const, providerReference: 'provider-concurrent-01', response: { ok: true } };
    },
  });
  const concurrentInput = {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  };
  const firstCheckout = processUtilityCheckout(concurrent.deps, concurrentInput);
  const secondCheckout = processUtilityCheckout(concurrent.deps, concurrentInput);
  const secondResult = await secondCheckout;
  assert.equal(secondResult.status, 'IN_PROGRESS');
  assert.equal(providerCalls, 1, 'the competing request must not dispatch provider fulfillment');
  releaseProvider();
  const firstResult = await firstCheckout;
  assert.equal(firstResult.status, 'FULFILLED');
  assert.equal(providerCalls, 1, 'only the reservation winner may call the provider');
  assert.equal(reservationCalls, 2);

  // An exact-Pi-amount mismatch rejected by the transactional reservation must
  // never proceed to the utility provider or be recorded as a fulfillment.
  let amountMismatchReservationCalls = 0;
  const amountMismatch = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => {
        amountMismatchReservationCalls++;
        return {
          status: 'REJECTED' as const,
          error: 'PI_PAYMENT_AMOUNT_MISMATCH',
        };
      },
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(amountMismatch.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'PI_PAYMENT_AMOUNT_MISMATCH' });
  assert.equal(amountMismatchReservationCalls, 1, 'the reservation must reject the mismatched Pi amount exactly once');
  assert.equal(amountMismatch.calls.fulfill, 0, 'an amount mismatch must never call the provider');
  assert.equal(amountMismatch.calls.record, 0, 'a rejected payment must not record fulfillment');

  // An expired invoice is rejected by the repository's transactional reservation.
  // Even with a valid Pi payment, expiry must never dispatch a recharge or record success.
  let expiredReservationCalls = 0;
  const expiredInvoice = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => {
        expiredReservationCalls++;
        return { status: 'REJECTED' as const, error: 'UTILITY_INVOICE_EXPIRED' };
      },
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(expiredInvoice.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'UTILITY_INVOICE_EXPIRED' });
  assert.equal(expiredInvoice.calls.verify, 1, 'authoritative payment verification precedes the atomic expiry check');
  assert.equal(expiredReservationCalls, 1, 'the repository must enforce expiry transactionally');
  assert.equal(expiredInvoice.calls.fulfill, 0, 'an expired invoice must never call the recharge provider');
  assert.equal(expiredInvoice.calls.record, 0, 'an expired invoice must not record fulfillment');

  // A conflicting idempotency reservation is a hard stop, not a retry signal.
  const idempotencyConflict = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => ({ status: 'REJECTED' as const, error: 'UTILITY_IDEMPOTENCY_CONFLICT' }),
    } as unknown as UtilityCheckoutDependencies['repository'],
  });
  assert.deepEqual(await processUtilityCheckout(idempotencyConflict.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'UTILITY_IDEMPOTENCY_CONFLICT' });
  assert.equal(idempotencyConflict.calls.fulfill, 0, 'an idempotency conflict must never call the provider');
  assert.equal(idempotencyConflict.calls.record, 0, 'an idempotency conflict must not record fulfillment');

  // Repository lookup failures are fail-closed and must not proceed to Pi verification or fulfillment.
  let lookupAttempts = 0;
  let lookupFailureProviderCalls = 0;
  const lookupFailure = setup({
    repository: {
      ...setup().repository,
      findOwnedInvoice: async () => {
        lookupAttempts++;
        throw new Error('database unavailable');
      },
    } as unknown as UtilityCheckoutDependencies['repository'],
    fulfill: async () => {
      lookupFailureProviderCalls++;
      return { status: 'SUCCEEDED' as const };
    },
  });
  assert.deepEqual(await processUtilityCheckout(lookupFailure.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'UTILITY_INVOICE_LOOKUP_FAILED' });
  assert.equal(lookupAttempts, 1, 'a repository lookup failure is attempted once');
  assert.equal(lookupFailure.calls.verify, 0, 'a failed invoice lookup must not verify a payment');
  assert.equal(lookupFailureProviderCalls, 0, 'a failed invoice lookup must never call the provider');
  assert.equal(lookupFailure.calls.record, 0);

  // Reservation exceptions must stop after authoritative verification; provider fulfillment must not run.
  let reservationFailureAttempts = 0;
  let reservationFailureProviderCalls = 0;
  const reservationFailure = setup({
    repository: {
      ...setup().repository,
      authorizeAndReserve: async () => {
        reservationFailureAttempts++;
        throw new Error('reservation transaction unavailable');
      },
    } as unknown as UtilityCheckoutDependencies['repository'],
    fulfill: async () => {
      reservationFailureProviderCalls++;
      return { status: 'SUCCEEDED' as const };
    },
  });
  assert.deepEqual(await processUtilityCheckout(reservationFailure.deps, {
    invoiceId: invoice.invoiceId, ownerUserId: invoice.ownerUserId, paymentId: invoice.paymentId,
  }), { status: 'REJECTED', error: 'UTILITY_PAYMENT_RESERVATION_FAILED' });
  assert.equal(reservationFailure.calls.verify, 1, 'reservation failure follows one authoritative verification');
  assert.equal(reservationFailureAttempts, 1, 'the failed reservation must not be retried blindly');
  assert.equal(reservationFailureProviderCalls, 0, 'provider fulfillment must never run without a reservation');
  assert.equal(reservationFailure.calls.record, 0);

  console.log('Utility checkout orchestrator tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
