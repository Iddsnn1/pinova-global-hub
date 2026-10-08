import assert from 'node:assert/strict';
import {
  calculatePiFromAuthoritativeQuote,
  expectedPiMatchesPaidAmount
} from '../src/server/services/AuthoritativeFxQuoteService';

process.env.PINOVA_FX_QUOTE_SIGNING_SECRET = 'test-secret';

const quote = {
  quoteId: 'fxq_test',
  currencyCode: 'NGN',
  unitsPerUsd: 1500,
  source: 'TEST_AUTHORIZED_SOURCE',
  issuedAt: '2026-10-08T00:00:00.000Z',
  expiresAt: '2026-10-08T01:00:00.000Z'
};

const pi = calculatePiFromAuthoritativeQuote(314159, quote);
assert.equal(pi, 1);
assert.equal(expectedPiMatchesPaidAmount(314159, quote, 1), true);
assert.equal(expectedPiMatchesPaidAmount(314159, quote, 1.000000000001), false);

console.log('Authoritative FX quote precision tests passed');
