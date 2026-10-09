import assert from 'node:assert/strict';
import {
  convertFiatToPi,
  CurrencyConversionError,
  PI_REFERENCE_RATE_USD,
} from '../src/utils/currencyToPi';
import { calculateAuthoritativePiAmount, calculatePiAmountFromFiatQuote } from '../src/utils/formatters';
import { marketplaceService } from '../src/modules/marketplace';
import { validateTrustedFxQuote } from '../src/server/services/TrustedFxQuoteService';
import { calculateTrustedFiatToPi } from '../src/server/services/TrustedFiatToPiService';

// Keep the shared quote timestamp fresh regardless of runner timezone/date.
const fxAsOf = new Date(Date.now() - 60_000).toISOString();

// USD is a 1:1 FX quote in this deterministic unit test.
const oneUsd = convertFiatToPi({
  fiatAmount: 1,
  fiatCurrency: 'USD',
  usdPerFiatUnit: 1,
  fxAsOf,
});
assert.equal(oneUsd.usdAmount, 1);
assert.equal(oneUsd.piAmount, '0.000003183102');
assert.equal(oneUsd.piReferenceRateUsd, 314159);

// Small values retain up to 12 decimal places rather than rounding to 4.
const halfUsd = convertFiatToPi({
  fiatAmount: 0.5,
  fiatCurrency: 'USD',
  usdPerFiatUnit: 1,
  fxAsOf,
});
assert.equal(halfUsd.piAmount, '0.000001591551');

// Illustrative FX input only; this is not a live exchange-rate assertion.
const illustrativeNgn = convertFiatToPi({
  fiatAmount: 1000,
  fiatCurrency: 'NGN',
  usdPerFiatUnit: 0.00065,
  fxAsOf,
});
assert.equal(illustrativeNgn.usdAmount, 0.65);
assert.equal(illustrativeNgn.piAmount, (0.65 / PI_REFERENCE_RATE_USD).toFixed(12));

// Fail closed: no implicit FX fallback, bad currencies, bad timestamps, and
// values that cannot be represented at the supported Pi precision.
assert.throws(
  () => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'NGN', usdPerFiatUnit: 0, fxAsOf }),
  CurrencyConversionError,
);
assert.throws(
  () => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'Naira', usdPerFiatUnit: 0.001, fxAsOf }),
  CurrencyConversionError,
);
assert.throws(
  () => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'USD', usdPerFiatUnit: 1, fxAsOf: 'not-a-date' }),
  CurrencyConversionError,
);
assert.throws(
  () => convertFiatToPi({ fiatAmount: 1e-10, fiatCurrency: 'USD', usdPerFiatUnit: 1, fxAsOf }),
  CurrencyConversionError,
);
assert.throws(() => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'USD', usdPerFiatUnit: 1, fxAsOf: '2020-01-01T00:00:00.000Z' }), /stale/i);
assert.throws(() => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'USD', usdPerFiatUnit: 1, fxAsOf: '2030-01-01T00:00:00.000Z' }), /future/i);
assert.throws(() => convertFiatToPi({ fiatAmount: 100, fiatCurrency: 'USD', usdPerFiatUnit: 1, fxAsOf, maxFxAgeMs: 0 }), /maximum FX quote age/i);
assert.equal(calculatePiAmountFromFiatQuote({ fiatAmount: 1000, fiatCurrency: 'NGN', usdPerFiatUnit: 0.00065, fxAsOf }), Number((0.65 / PI_REFERENCE_RATE_USD).toFixed(12)));
assert.equal(calculateAuthoritativePiAmount(1, 500000), 0.000002);

// Marketplace display estimates must not silently treat unknown currencies as USD.
assert.equal(marketplaceService.currencyCalculator.getEstimatedValue(1, 'XOF'), 'Estimate unavailable (XOF)');
assert.equal(marketplaceService.currencyCalculator.getEstimatedValue(1, 'usd').includes('$'), true);

// Trusted FX quotes require an explicitly configured source, matching currency,
// positive rates, and a fresh timestamp. These are deterministic fixture tests.
const trustedFxNow = Date.parse('2026-10-09T12:00:00.000Z');
const validNgnQuote = {
  currency: 'NGN',
  usdPerFiatUnit: 0.00065,
  asOf: '2026-10-09T11:55:00.000Z',
  source: 'configured-test-provider',
};
assert.equal(
  validateTrustedFxQuote(validNgnQuote, 'NGN', 'configured-test-provider', trustedFxNow).usdPerFiatUnit,
  0.00065,
);

// Server conversion accepts only an explicitly trusted, fresh quote and keeps
// the Pi amount at the shared 12-decimal precision. This uses a live timestamp
// solely to make the test independent of the runner's wall clock.
const liveTestQuote = { ...validNgnQuote, asOf: new Date(Date.now() - 60_000).toISOString() };
const trustedConversion = calculateTrustedFiatToPi({
  fiatAmount: 1000,
  currency: 'NGN',
  quote: liveTestQuote,
  trustedSource: 'configured-test-provider',
});
assert.equal(trustedConversion.usdAmount, 0.65);
assert.equal(trustedConversion.piAmount, '0.000002068016');
assert.throws(
  () => calculateTrustedFiatToPi({ fiatAmount: 1000, currency: 'NGN', quote: liveTestQuote, trustedSource: 'wrong-provider' }),
  /FX_SOURCE_UNTRUSTED/,
);
assert.throws(
  () => calculateTrustedFiatToPi({ fiatAmount: 1000, currency: 'NGN', quote: { ...liveTestQuote, asOf: '2020-01-01T00:00:00.000Z' }, trustedSource: 'configured-test-provider' }),
  /FX_QUOTE_STALE/,
);
assert.throws(
  () => validateTrustedFxQuote(validNgnQuote, 'NGN', '', trustedFxNow),
  /FX_TRUSTED_SOURCE_NOT_CONFIGURED/,
);
assert.throws(
  () => validateTrustedFxQuote({ ...validNgnQuote, source: 'untrusted-provider' }, 'NGN', 'configured-test-provider', trustedFxNow),
  /FX_SOURCE_UNTRUSTED/,
);
assert.throws(
  () => validateTrustedFxQuote(validNgnQuote, 'KES', 'configured-test-provider', trustedFxNow),
  /FX_CURRENCY_MISMATCH/,
);
assert.throws(
  () => validateTrustedFxQuote({ ...validNgnQuote, asOf: '2026-10-09T10:00:00.000Z' }, 'NGN', 'configured-test-provider', trustedFxNow),
  /FX_QUOTE_STALE/,
);
assert.throws(
  () => validateTrustedFxQuote({ ...validNgnQuote, usdPerFiatUnit: 0 }, 'NGN', 'configured-test-provider', trustedFxNow),
  /FX_RATE_INVALID/,
);

console.log('Global currency-to-Pi conversion suite: all assertions passed.');
