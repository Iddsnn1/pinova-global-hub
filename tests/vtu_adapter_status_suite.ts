import assert from 'node:assert/strict';
import { VtuNgAdapter } from '../src/server/integrations/vtuNgAdapter';

process.env.VTU_USERNAME = 'test-user';
process.env.VTU_PASSWORD = 'test-password';

async function run() {
  async function purchaseWith(payload: unknown) {
    const adapter = new VtuNgAdapter();
    (adapter as any).executeVtuRequest = async () => ({ ok: true, status: 200, data: payload });
    return adapter.purchaseAirtime({
      paymentId: 'pi-test-payment-01',
      phone: '08012345678',
      serviceId: 'mtn',
      amount: 100,
    });
  }

  const processing = await purchaseWith({
    code: 'success', message: 'ORDER PROCESSING',
    data: { status: 'processing-api', order_id: 12345 },
  });
  assert.equal(processing.success, false, 'HTTP success must not turn a processing order into a fulfilled recharge');
  assert.equal(processing.fulfilled, false);
  assert.equal(processing.status, 'FULFILLMENT_PENDING');

  const completed = await purchaseWith({
    code: 'success', message: 'ORDER COMPLETED',
    data: { status: 'completed-api', order_id: 12346 },
  });
  assert.equal(completed.success, true);
  assert.equal(completed.fulfilled, true);
  assert.equal(completed.status, 'FULFILLED');

  const refunded = await purchaseWith({
    code: 'success', message: 'ORDER REFUNDED',
    data: { status: 'refunded', order_id: 12347 },
  });
  assert.equal(refunded.success, false);
  assert.equal(refunded.fulfilled, false);
  assert.equal(refunded.status, 'FAILED');
  assert.equal(refunded.errorCode, 'VTU_TRANSACTION_FAILED');

  const ambiguous = await purchaseWith({
    code: 'success', message: 'ORDER QUEUED',
    data: { status: 'queued-api', order_id: 12348 },
  });
  assert.equal(ambiguous.status, 'FULFILLMENT_PENDING', 'queued/unknown states must remain pending until requery confirms completion');

  // Requery must accept only application-generated request IDs and must
  // normalize provider statuses so callers never confuse HTTP success with fulfillment.
  const requeryAdapter = new VtuNgAdapter();
  let requeryCalls = 0;
  let requeryPayload: unknown = { data: { status: 'processing-api' } };
  (requeryAdapter as any).executeVtuRequest = async (_path: string, options: any) => {
    requeryCalls++;
    assert.equal(_path, '/api/v2/requery');
    assert.equal(JSON.parse(options.body).request_id, 'PNV-AIR-abcdef0123456789abcdef01');
    return { ok: true, status: 200, data: requeryPayload };
  };
  const invalidRequery = await requeryAdapter.requeryOrder('some-other-customer-order');
  assert.equal(invalidRequery.success, false, 'arbitrary provider references must not be queried');
  assert.equal(requeryCalls, 0, 'invalid request IDs must be rejected before network access');

  const processingRequery = await requeryAdapter.requeryOrder('PNV-AIR-abcdef0123456789abcdef01');
  assert.equal(processingRequery.success, true);
  assert.equal(processingRequery.status, 'PROCESSING');
  requeryPayload = { data: { status: 'completed-api' } };
  const completedRequery = await requeryAdapter.requeryOrder('PNV-AIR-abcdef0123456789abcdef01');
  assert.equal(completedRequery.status, 'COMPLETED');
  requeryPayload = { data: { status: 'refunded' } };
  const refundedRequery = await requeryAdapter.requeryOrder('PNV-AIR-abcdef0123456789abcdef01');
  assert.equal(refundedRequery.status, 'FAILED');
  requeryPayload = { data: { status: 'unrecognized-provider-state' } };
  const unknownRequery = await requeryAdapter.requeryOrder('PNV-AIR-abcdef0123456789abcdef01');
  assert.equal(unknownRequery.status, 'UNKNOWN', 'unknown provider statuses must never be treated as fulfilled');
  assert.equal(requeryCalls, 4);

  console.log('VTU provider status interpretation suite passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
