import assert from 'node:assert/strict';
import {
  convertFiatToPi,
  CurrencyConversionError,
  PI_REFERENCE_RATE_USD,
} from '../src/utils/currencyToPi';
import { calculateAuthoritativePiAmount, calculatePiAmountFromFiatQuote } from '../src/utils/formatters';

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

console.log('Global currency-to-Pi conversion suite: all assertions passed.');
