import assert from 'node:assert/strict';
import { matchesPiAmountAt12Decimals } from '../src/server/services/PiOrderPaymentContract';

assert.equal(matchesPiAmountAt12Decimals(2.5, 2.5), true);
assert.equal(matchesPiAmountAt12Decimals(0.000047746523, 0.000047746523), true);

// A mismatch beyond the supported 12-decimal settlement precision must fail.
assert.equal(matchesPiAmountAt12Decimals(2.5000001, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(0.000047846523, 0.000047746523), false);
assert.equal(matchesPiAmountAt12Decimals(Number.NaN, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(Infinity, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(0, 0), false);
assert.equal(matchesPiAmountAt12Decimals(-1, 1), false);

console.log('Pi order payment amount contract suite passed.');
