import assert from 'node:assert/strict';
import {
  DEFAULT_MAX_TRUSTED_FX_AGE_MS,
  validateTrustedFxQuote,
} from '../src/server/services/TrustedFxQuoteService';
import {
  getTrustedFxProviderConfig,
  parseCurrencyApiPayload,
  parseTrustedFxProviderPayload,
} from '../src/server/services/TrustedFxProviderService';

const now = Date.parse('2026-10-20T12:00:00.000Z');
const freshAsOf = new Date(now - 60_000).toISOString();

function throwsCode(run: () => unknown, code: string) {
  assert.throws(run, (error: unknown) => error instanceof Error && error.message === code, code);
}

function run() {
  const valid = validateTrustedFxQuote({
    currency: 'ngn', usdPerFiatUnit: 0.001, asOf: freshAsOf, source: 'trusted.test',
  }, 'NGN', 'trusted.test', now);
  assert.equal(valid.currency, 'NGN');
  assert.equal(valid.usdPerFiatUnit, 0.001);
  assert.equal(valid.asOf, freshAsOf);

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001,
    asOf: new Date(now - DEFAULT_MAX_TRUSTED_FX_AGE_MS - 1).toISOString(),
    source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_QUOTE_STALE');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001,
    asOf: new Date(now + 61_000).toISOString(), source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_TIMESTAMP_IN_FUTURE');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'KES', usdPerFiatUnit: 0.001, asOf: freshAsOf, source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_CURRENCY_MISMATCH');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001, asOf: freshAsOf, source: 'other.test',
  }, 'NGN', 'trusted.test', now), 'FX_SOURCE_UNTRUSTED');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0, asOf: freshAsOf, source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_RATE_INVALID');


  // The freshness boundary is inclusive: a quote exactly 15 minutes old is
  // valid, but one millisecond older must fail closed.
  const exactlyAtBoundary = validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001,
    asOf: new Date(now - DEFAULT_MAX_TRUSTED_FX_AGE_MS).toISOString(),
    source: 'trusted.test',
  }, 'NGN', 'trusted.test', now);
  assert.equal(exactlyAtBoundary.usdPerFiatUnit, 0.001);

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001,
    asOf: 'not-a-timestamp', source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_TIMESTAMP_INVALID');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001, asOf: freshAsOf, source: '',
  }, 'NGN', '', now), 'FX_TRUSTED_SOURCE_NOT_CONFIGURED');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: 0.001, asOf: freshAsOf, source: 'trusted.test',
  }, 'Naira', 'trusted.test', now), 'FX_CURRENCY_INVALID');

  throwsCode(() => validateTrustedFxQuote({
    currency: 'NGN', usdPerFiatUnit: Number.POSITIVE_INFINITY,
    asOf: freshAsOf, source: 'trusted.test',
  }, 'NGN', 'trusted.test', now), 'FX_RATE_INVALID');

  const normalized = parseTrustedFxProviderPayload({
    source: 'trusted.test',
    asOf: freshAsOf,
    baseCurrency: 'USD',
    rates: { NGN: 1000 },
  }, 'NGN', 'trusted.test', now);
  assert.equal(normalized.usdPerFiatUnit, 0.001);

  throwsCode(() => parseTrustedFxProviderPayload({
    source: 'untrusted.test', asOf: freshAsOf, baseCurrency: 'USD', rates: { NGN: 1000 },
  }, 'NGN', 'trusted.test', now), 'FX_SOURCE_UNTRUSTED');

  throwsCode(() => parseTrustedFxProviderPayload({
    source: 'trusted.test', asOf: freshAsOf, baseCurrency: 'EUR', rates: { NGN: 1000 },
  }, 'NGN', 'trusted.test', now), 'FX_PROVIDER_BASE_CURRENCY_UNSUPPORTED');

  const currencyApi = parseCurrencyApiPayload({
    meta: { last_updated_at: freshAsOf },
    data: { NGN: { code: 'NGN', value: 1000 } },
  }, 'NGN', 'currencyapi.com', now);
  assert.equal(currencyApi.usdPerFiatUnit, 0.001);

  throwsCode(() => parseCurrencyApiPayload({
    meta: { last_updated_at: new Date(now - DEFAULT_MAX_TRUSTED_FX_AGE_MS - 1).toISOString() },
    data: { NGN: { code: 'NGN', value: 1000 } },
  }, 'NGN', 'currencyapi.com', now), 'FX_QUOTE_STALE');

  throwsCode(() => parseCurrencyApiPayload({
    meta: { last_updated_at: freshAsOf },
    data: { NGN: { code: 'USD', value: 1000 } },
  }, 'NGN', 'currencyapi.com', now), 'FX_PROVIDER_RATE_MISSING_OR_INVALID');

  // Provider configuration must reject insecure transport and embedded URL credentials
  // before any network request can occur.
  throwsCode(() => getTrustedFxProviderConfig({
    PINOVA_FX_PROVIDER_URL: 'http://api.example.test/latest',
    PINOVA_FX_PROVIDER_SOURCE: 'trusted.test',
  }), 'FX_PROVIDER_HTTPS_REQUIRED');

  throwsCode(() => getTrustedFxProviderConfig({
    PINOVA_FX_PROVIDER_URL: 'https://user:password@api.example.test/latest',
    PINOVA_FX_PROVIDER_SOURCE: 'trusted.test',
  }), 'FX_PROVIDER_CREDENTIALS_IN_URL_FORBIDDEN');

  throwsCode(() => getTrustedFxProviderConfig({
    PINOVA_FX_PROVIDER_URL: 'not-a-valid-url',
    PINOVA_FX_PROVIDER_SOURCE: 'trusted.test',
  }), 'FX_PROVIDER_ENDPOINT_INVALID');

  throwsCode(() => getTrustedFxProviderConfig({
    PINOVA_FX_PROVIDER_URL: 'https://api.currencyapi.com/v3/latest',
    PINOVA_FX_PROVIDER_SOURCE: 'currencyapi.com',
  }), 'FX_PROVIDER_API_KEY_REQUIRED');

  throwsCode(() => parseCurrencyApiPayload({
    meta: { last_updated_at: freshAsOf },
    data: { NGN: { code: 'NGN', value: 1000 } },
  }, 'NGN', 'other-provider.test', now), 'FX_SOURCE_UNTRUSTED');

  console.log('Trusted FX quote/provider validation suite passed.');
}

run();
