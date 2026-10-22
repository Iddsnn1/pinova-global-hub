import assert from 'node:assert/strict';

// Offline-only contract checks. Network calls are replaced with a local stub.
async function run() {
  const originalFetch = globalThis.fetch;
  const oldEnv = process.env.NODE_ENV;
  const oldKey = process.env.PI_API_KEY;
  process.env.NODE_ENV = 'production';
  process.env.PI_API_KEY = 'mock-only-key';
  let calls = 0;
  let body: any = { status: { developer_completed: true }, transaction: { verified: true, txid: 'mock-tx' }, amount: 2.5, user_uid: 'mock-user' };
  globalThis.fetch = (async () => {
    calls++;
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  try {
    const { verifyPiPaymentAuthoritative } = await import('../src/server/services/PiPaymentVerificationService');
    const empty = await verifyPiPaymentAuthoritative(' ');
    assert.equal(empty.verified, false);
    assert.equal(calls, 0);
    const good = await verifyPiPaymentAuthoritative('mock-payment-1');
    assert.equal(good.verified, true);
    assert.equal(good.source, 'pi_platform');
    body = { status: { developer_completed: false }, transaction: { verified: true } };
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-2')).verified, false);
    body = { status: { developer_completed: true }, transaction: { verified: false } };
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-3')).verified, false);
    globalThis.fetch = (async () => new Response('unavailable', { status: 503 })) as typeof fetch;
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-4')).verified, false);

    // Malformed JSON and transport failures must fail closed in production.
    globalThis.fetch = (async () => new Response('{invalid-json', { status: 200 })) as typeof fetch;
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-5')).verified, false);
    globalThis.fetch = (async () => { throw new Error('simulated Pi API network failure'); }) as typeof fetch;
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-6')).verified, false);

    // Without a server key, production must not fall back to sandbox/ledger state.
    delete process.env.PI_API_KEY;
    delete process.env.PI_SERVER_KEY;
    globalThis.fetch = (async () => { throw new Error('fetch must not be called without a key'); }) as typeof fetch;
    assert.equal((await verifyPiPaymentAuthoritative('mock-payment-7')).verified, false);
    console.log('Pi payment verification mock suite passed.');
  } finally {
    globalThis.fetch = originalFetch;
    if (oldEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = oldEnv;
    if (oldKey === undefined) delete process.env.PI_API_KEY; else process.env.PI_API_KEY = oldKey;
  }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
