import assert from 'node:assert/strict';
import { getPiAuthoritativeTransactionId, matchesPiAmountAt12Decimals } from '../src/server/services/PiOrderPaymentContract';

assert.equal(matchesPiAmountAt12Decimals(2.5, 2.5), true);
assert.equal(matchesPiAmountAt12Decimals(0.000047746523, 0.000047746523), true);

// A mismatch beyond the supported 12-decimal settlement precision must fail.
assert.equal(matchesPiAmountAt12Decimals(2.5000001, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(0.000047846523, 0.000047746523), false);
assert.equal(matchesPiAmountAt12Decimals(Number.NaN, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(Infinity, 2.5), false);
assert.equal(matchesPiAmountAt12Decimals(0, 0), false);
assert.equal(matchesPiAmountAt12Decimals(-1, 1), false);

// Settlement transaction IDs must come from Pi's authoritative response only.
assert.equal(getPiAuthoritativeTransactionId({ transaction: { txid: 'pi-tx-123' } }), 'pi-tx-123');
assert.equal(getPiAuthoritativeTransactionId({ transaction: { hash: 'pi-hash-456' } }), 'pi-hash-456');
assert.equal(getPiAuthoritativeTransactionId({ transaction: {} }), '');
assert.equal(getPiAuthoritativeTransactionId({}), '');
assert.equal(getPiAuthoritativeTransactionId(null), '');


console.log('Pi order payment amount contract suite passed.');
