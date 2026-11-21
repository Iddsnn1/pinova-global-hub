import assert from 'node:assert/strict';
import { matchesPaymentBinding, type PaymentBinding } from '../src/server/services/DurableEducationStore';
import type { EducationPaymentTransaction } from '../src/types/education';

const payment = {
  id: 'PAY-EDU-A',
  invoiceId: 'INV-1',
  idempotencyKey: 'IDEMP-A',
  piPaymentId: 'PI-PAY-A',
  piTxid: 'TX-A',
  payerUsername: 'pi_user',
  amountPaid: 5,
  piAmount: 5,
} as EducationPaymentTransaction;

const expected: PaymentBinding = {
  invoiceId: 'INV-1',
  idempotencyKey: 'IDEMP-A',
  piPaymentId: 'PI-PAY-A',
  piTxid: 'TX-A',
  payerUsername: 'PI_USER',
  amountPaid: 5,
  piAmount: 5,
};

assert.equal(matchesPaymentBinding(payment, expected), true, 'exact retry binding must match');
assert.equal(matchesPaymentBinding(payment, { ...expected, invoiceId: 'INV-2' }), false, 'invoice mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, idempotencyKey: 'IDEMP-B' }), false, 'idempotency mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, piPaymentId: 'PI-PAY-B' }), false, 'Pi payment ID mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, piTxid: 'TX-B' }), false, 'TXID mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, payerUsername: 'other_user' }), false, 'payer mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, amountPaid: 6 }), false, 'amount mismatch must fail');
assert.equal(matchesPaymentBinding(payment, { ...expected, piAmount: 6 }), false, 'Pi amount mismatch must fail');

// Model the mixed-key collision: the idempotency key resolves to payment A,
// while the TXID resolves to payment B. Every returned match must be exact.
const paymentB = {
  ...payment,
  id: 'PAY-EDU-B',
  idempotencyKey: 'IDEMP-B',
  piPaymentId: 'PI-PAY-B',
  piTxid: 'TX-B',
} as EducationPaymentTransaction;
const mixedMatches = [payment, paymentB];
assert.equal(mixedMatches.every((entry) => matchesPaymentBinding(entry, expected)), false,
  'a mixed idempotency-key/TXID collision must be rejected');

console.log('DURABLE EDUCATION PAYMENT BINDING SUITE: PASS');
