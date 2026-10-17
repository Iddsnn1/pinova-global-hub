import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';

// Exercise the real Express middleware/route stack without enabling provider
// fulfillment or contacting Neon. This test must run in its own tsx process.
process.env.VERCEL = '1';
process.env.SESSION_SECRET = 'route-test-signing-key-local';
process.env.PINOVA_UTILITY_CHECKOUT_ENABLED = 'false';
process.env.DATABASE_URL = 'postgres://127.0.0.1:1/utility_route_test_must_not_connect';

async function run() {
  const { default: app, authService } = await import('../server');
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const invoiceId = 'UTIL-00000000-0000-4000-8000-000000000001';
    const session = authService.createSession({
      username: 'utility-route-test-user',
      uid: 'pi-utility-route-test-uid',
      roles: ['BUYER'],
    });

    // Authentication middleware runs before the route guard.
    const unauthenticated = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: 'test-payment-id' }),
      },
    );
    assert.equal(unauthenticated.status, 401);
    assert.equal((await unauthenticated.json()).error, 'UNAUTHORIZED');

    // An authenticated request with the feature flag OFF must fail closed
    // before repository construction, database access, or provider dispatch.
    const disabled = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'test-payment-id' }),
      },
    );
    assert.equal(disabled.status, 503);
    assert.equal(disabled.headers.get('cache-control'), 'no-store');
    assert.equal(disabled.headers.get('retry-after'), '300');
    assert.equal((await disabled.json()).error, 'UTILITY_CHECKOUT_DISABLED');

    // With the gate enabled only inside this isolated test process, malformed
    // input must be rejected before constructing a repository or calling VTU.
    process.env.PINOVA_UTILITY_CHECKOUT_ENABLED = 'true';
    const malformed = await fetch(
      `${baseUrl}/api/v2/utility/invoices/not-an-invoice-id/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'test-payment-id' }),
      },
    );
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error, 'UTILITY_CHECKOUT_INPUT_INVALID');

    // A valid invoice-shaped ID with a missing payment ID must also be rejected
    // before the route constructs a repository or attempts provider fulfillment.
    const malformedPayment = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: '' }),
      },
    );
    assert.equal(malformedPayment.status, 400);
    assert.equal((await malformedPayment.json()).error, 'UTILITY_CHECKOUT_INPUT_INVALID');

    // Payment identifiers above the documented limit must be rejected before database/provider work.
    const oversizedPayment = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'x'.repeat(201) }),
      },
    );
    assert.equal(oversizedPayment.status, 400);
    assert.equal((await oversizedPayment.json()).error, 'UTILITY_CHECKOUT_INPUT_INVALID');

    // Control characters are not valid payment identifiers.
    const controlCharacterPayment = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'test-payment\u0000id' }),
      },
    );
    assert.equal(controlCharacterPayment.status, 400);
    assert.equal((await controlCharacterPayment.json()).error, 'UTILITY_CHECKOUT_INPUT_INVALID');

    // A valid signed session without an authoritative Pi UID must fail closed
    // before repository construction, payment verification, or provider fulfillment.
    const missingPiIdentitySession = authService.createSession({
      username: 'utility-route-test-no-pi-identity',
      roles: ['BUYER'],
    });
    const missingPiIdentity = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${missingPiIdentitySession.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'test-payment-id' }),
      },
    );
    assert.equal(missingPiIdentity.status, 403);
    assert.equal((await missingPiIdentity.json()).error, 'PI_IDENTITY_REQUIRED');

    // A syntactically valid checkout with the feature gate enabled must fail closed
    // when the invoice repository is unavailable. The test DATABASE_URL points at
    // loopback port 1, so no invoice can be loaded/reserved and no provider can run.
    const unavailableRepository = await fetch(
      `${baseUrl}/api/v2/utility/invoices/${invoiceId}/checkout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: 'test-payment-id' }),
      },
    );
    assert.equal(unavailableRepository.status, 503);
    assert.equal(unavailableRepository.headers.get('cache-control'), 'no-store');
    assert.equal((await unavailableRepository.json()).error, 'UTILITY_CHECKOUT_UNAVAILABLE');

    // FX estimate endpoint rejects malformed amounts/currencies before provider access.
    const invalidFxAmount = await fetch(`${baseUrl}/api/currency/fiat-to-pi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fiatAmount: 0, currency: 'NGN' }),
    });
    assert.equal(invalidFxAmount.status, 400);
    assert.equal((await invalidFxAmount.json()).code, 'FIAT_AMOUNT_INVALID');

    const invalidFxCurrency = await fetch(`${baseUrl}/api/currency/fiat-to-pi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fiatAmount: 1000, currency: 'Naira' }),
    });
    assert.equal(invalidFxCurrency.status, 400);
    assert.equal((await invalidFxCurrency.json()).code, 'FIAT_CURRENCY_INVALID');

    // A valid estimate request with no trusted provider configured must fail closed.
    // Remove only process-local test values; restore the original environment afterwards.
    const fxEnvKeys = [
      'PINOVA_FX_PROVIDER_URL',
      'PINOVA_FX_PROVIDER_SOURCE',
      'PINOVA_FX_PROVIDER_API_KEY',
    ] as const;
    const originalFxEnv = Object.fromEntries(fxEnvKeys.map((key) => [key, process.env[key]]));
    try {
      for (const key of fxEnvKeys) delete process.env[key];
      const unavailableFx = await fetch(`${baseUrl}/api/currency/fiat-to-pi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fiatAmount: 1000, currency: 'NGN' }),
      });
      assert.equal(unavailableFx.status, 503);
      assert.equal(unavailableFx.headers.get('cache-control'), 'no-store');
      const unavailableFxBody = await unavailableFx.json();
      assert.equal(unavailableFxBody.success, false);
      assert.equal(unavailableFxBody.code, 'FX_PROVIDER_ENDPOINT_NOT_CONFIGURED');
      assert.equal(unavailableFxBody.estimateOnly, true);
      assert.equal(unavailableFxBody.paymentAuthorized, false);
      assert.equal(JSON.stringify(unavailableFxBody).includes('fixture-only-not-a-real-secret'), false);
    } finally {
      for (const key of fxEnvKeys) {
        const value = originalFxEnv[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }

    console.log('Utility checkout HTTP route integration suite passed (no DB/provider calls intended).');
  } finally {
    process.env.PINOVA_UTILITY_CHECKOUT_ENABLED = 'false';
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
