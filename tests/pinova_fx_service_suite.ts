import assert from 'node:assert/strict';
import { quoteFiatToPiReference, signPiNovaFxQuote, verifyPiNovaFxQuoteToken, FxConfigurationError, FxProviderError } from '../src/server/services/PiNovaFxService';
import { PI_REFERENCE_RATE_USD } from '../src/config/piReference';

async function run() {
  const oneDollar = await quoteFiatToPiReference(1, 'USD');
  assert.equal(oneDollar.currency, 'USD');
  assert.equal(oneDollar.amountUsd, 1);
  assert.equal(oneDollar.usdToCurrencyRate, 1);
  assert.equal(oneDollar.referencePiAmount, Number((1 / PI_REFERENCE_RATE_USD).toFixed(12)));
  assert.equal(oneDollar.referenceRateUsdPerPi, PI_REFERENCE_RATE_USD);
  assert.equal(oneDollar.source, 'identity-usd');

  const fractionalUsd = await quoteFiatToPiReference(15, ' usd ');
  assert.equal(fractionalUsd.amountUsd, 15);
  assert.equal(fractionalUsd.referencePiAmount, Number((15 / PI_REFERENCE_RATE_USD).toFixed(12)));

  await assert.rejects(() => quoteFiatToPiReference(0, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(-1, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(Number.NaN, 'USD'), RangeError);
  await assert.rejects(() => quoteFiatToPiReference(1, 'US'), TypeError);
  await assert.rejects(() => quoteFiatToPiReference(1, 'US1'), TypeError);

  // All non-USD provider cases below use a stubbed fetch: no external request,
  // CurrencyAPI quota use, payment, or utility recharge occurs.
  const previousApiKey = process.env.PINOVA_FX_PROVIDER_API_KEY;
  const previousProviderUrl = process.env.PINOVA_FX_PROVIDER_URL;
  const originalFetch = globalThis.fetch;
  process.env.PINOVA_FX_PROVIDER_API_KEY = 'test-only-currencyapi-key';
  delete process.env.PINOVA_FX_PROVIDER_URL;

  let observedUrl: URL | undefined;
  let observedApiKey: string | null = null;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    observedUrl = new URL(String(input));
    observedApiKey = new Headers(init?.headers).get('apikey');
    return new Response(JSON.stringify({ data: { NGN: { code: 'NGN', value: 1500 } } }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }) as typeof fetch;

  try {
    const ngnQuote = await quoteFiatToPiReference(3000, 'NGN');
    assert.equal(observedUrl?.hostname, 'api.currencyapi.com');
    assert.equal(observedUrl?.searchParams.get('base_currency'), 'USD');
    assert.equal(observedUrl?.searchParams.get('currencies'), 'NGN');
    assert.equal(observedApiKey, 'test-only-currencyapi-key');
    assert.equal(ngnQuote.source, 'currencyapi.com');
    assert.equal(ngnQuote.currency, 'NGN');
    assert.equal(ngnQuote.usdToCurrencyRate, 1500);
    assert.equal(ngnQuote.amount, 3000);
    assert.equal(ngnQuote.amountUsd, 2);
    assert.equal(ngnQuote.referencePiAmount, Number((2 / PI_REFERENCE_RATE_USD).toFixed(12)));

    globalThis.fetch = (async () => new Response('provider unavailable', { status: 503 })) as typeof fetch;
    await assert.rejects(() => quoteFiatToPiReference(3000, 'NGN'), FxProviderError);

    globalThis.fetch = (async () => new Response(JSON.stringify({ data: { NGN: { code: 'NGN', value: 0 } } }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })) as typeof fetch;
    await assert.rejects(() => quoteFiatToPiReference(3000, 'NGN'), FxProviderError);

    globalThis.fetch = (async () => new Response('{invalid-json', { status: 200 })) as typeof fetch;
    await assert.rejects(() => quoteFiatToPiReference(3000, 'NGN'), FxProviderError);

    globalThis.fetch = (async () => { throw new Error('simulated network failure'); }) as typeof fetch;
    await assert.rejects(() => quoteFiatToPiReference(3000, 'NGN'), FxProviderError);

    delete process.env.PINOVA_FX_PROVIDER_API_KEY;
    await assert.rejects(() => quoteFiatToPiReference(3000, 'NGN'), FxConfigurationError);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousApiKey === undefined) delete process.env.PINOVA_FX_PROVIDER_API_KEY;
    else process.env.PINOVA_FX_PROVIDER_API_KEY = previousApiKey;
    if (previousProviderUrl === undefined) delete process.env.PINOVA_FX_PROVIDER_URL;
    else process.env.PINOVA_FX_PROVIDER_URL = previousProviderUrl;
  }

  const previousSecret = process.env.PINOVA_FX_QUOTE_SECRET;
  process.env.PINOVA_FX_QUOTE_SECRET = 'test-only-fx-quote-secret-which-is-long-enough';
  try {
    // The server must not sign an internally inconsistent quote, even when the
    // caller is trusted code: fiat, USD, and Pi-reference amounts must agree.
    assert.throws(
      () => signPiNovaFxQuote({ ...oneDollar, amountUsd: 2 }),
      TypeError
    );
    assert.throws(
      () => signPiNovaFxQuote({ ...oneDollar, referencePiAmount: oneDollar.referencePiAmount + 1 }),
      TypeError
    );

    const signed = signPiNovaFxQuote(oneDollar, 1_800_000_000_000);
    const verified = verifyPiNovaFxQuoteToken(signed.token, 1_800_000_001_000);
    assert.ok(verified);
    assert.equal(verified.currency, 'USD');
    assert.equal(verified.amount, 1);
    assert.equal(verified.referencePiAmount, oneDollar.referencePiAmount);
    assert.equal(verifyPiNovaFxQuoteToken(signed.token + 'x', 1_800_000_001_000), null);
    // Change the signed payload itself while keeping the original signature.
    // A forged fiat/Pi quote must fail verification, even if the edited JSON is valid.
    const [encodedPayload, originalSignature] = signed.token.split('.');
    const decodedPayload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const forgedPayload = decodedPayload.replace('"amount":1', '"amount":2');
    assert.notEqual(forgedPayload, decodedPayload);
    const forgedToken = Buffer.from(forgedPayload, 'utf8').toString('base64url') + '.' + originalSignature;
    assert.equal(verifyPiNovaFxQuoteToken(forgedToken, 1_800_000_001_000), null);
    assert.equal(verifyPiNovaFxQuoteToken(signed.token, 1_800_000_301_000), null);
    // Expiration is exclusive: a quote must be rejected at the exact expiry millisecond.
    assert.equal(verifyPiNovaFxQuoteToken(signed.token, 1_800_000_300_000), null);

    // Tampering with the USD conversion amount or Pi amount must also invalidate
    // the signature, preventing fiat/Pi amount substitution.
    const parsedPayload = JSON.parse(decodedPayload);
    for (const field of ['amountUsd', 'referencePiAmount']) {
      const forged = { ...parsedPayload, [field]: parsedPayload[field] + 1 };
      const encoded = Buffer.from(JSON.stringify(forged), 'utf8').toString('base64url');
      assert.equal(verifyPiNovaFxQuoteToken(encoded + '.' + originalSignature, 1_800_000_001_000), null);
    }
  } finally {
    if (previousSecret === undefined) delete process.env.PINOVA_FX_QUOTE_SECRET;
    else process.env.PINOVA_FX_QUOTE_SECRET = previousSecret;
  }

  console.log('PiNova FX service suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
