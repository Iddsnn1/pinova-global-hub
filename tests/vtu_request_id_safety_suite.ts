import assert from 'node:assert/strict';
import { VtuNgAdapter } from '../src/server/integrations/vtuNgAdapter';

const adapter = new VtuNgAdapter();

const paymentId = 'pi-payment-sensitive-example-123456';
const first = adapter.generateRequestId(paymentId, 'UTIL');
const repeated = adapter.generateRequestId(paymentId, 'UTIL');
const otherPayment = adapter.generateRequestId('pi-payment-other-123456', 'UTIL');
const dataPrefix = adapter.generateRequestId(paymentId, 'DAT');
const sanitizedPrefix = adapter.generateRequestId(paymentId, 'utility / airtime');

assert.equal(first, repeated, 'retries for the same payment must derive the same provider request ID');
assert.notEqual(first, otherPayment, 'different payment IDs must not share a provider request ID');
assert.notEqual(first, dataPrefix, 'different utility operation prefixes must remain distinct');
assert.match(first, /^PNV-UTIL-[a-f0-9]{24}$/);
assert.ok(first.length <= 50, 'provider request IDs must respect the documented maximum');
assert.equal(first.includes(paymentId), false, 'provider request IDs must not expose the original payment identifier');
assert.match(sanitizedPrefix, /^PNV-UTILITYA-[a-f0-9]{24}$/);

console.log('VTU provider request ID safety suite passed.');
