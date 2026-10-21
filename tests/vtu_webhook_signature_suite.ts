import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { VtuNgAdapter } from '../src/server/integrations/vtuNgAdapter';

const previousPin = process.env.VTU_USER_PIN;
const previousUsername = process.env.VTU_USERNAME;
const previousPassword = process.env.VTU_PASSWORD;
const previousBaseUrl = process.env.VTU_API_BASE_URL;
const previousFetch = globalThis.fetch;

function signature(secret: string, body: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

try {
  delete process.env.VTU_USER_PIN;
  delete process.env.VTU_USERNAME;
  delete process.env.VTU_PASSWORD;
  const noSecret = new VtuNgAdapter();

  // Airtime input guards must reject invalid requests before provider credentials
  // or network access are considered. These tests intentionally never call VTU.ng.
  const invalidPhone = await noSecret.purchaseAirtime({
    paymentId: 'pi-payment-test', phone: 'not-a-phone', serviceId: 'mtn', amount: 500,
  });
  assert.equal(invalidPhone.errorCode, 'VTU_INVALID_CUSTOMER');

  const missingPayment = await noSecret.purchaseAirtime({
    paymentId: '', phone: '+2348031234567', serviceId: 'mtn', amount: 500,
  });
  assert.equal(missingPayment.errorCode, 'VTU_INVALID_CUSTOMER');

  for (const amount of [0, -500, 500.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    const invalidAmount = await noSecret.purchaseAirtime({
      paymentId: 'pi-payment-test', phone: '08031234567', serviceId: 'mtn', amount,
    });
    assert.equal(invalidAmount.errorCode, 'VTU_INVALID_AMOUNT',
      `invalid NGN amount ${String(amount)} must fail before provider dispatch`);
  }

  const stableRequestId1 = noSecret.generateRequestId('pi-payment-repeat-123', 'AIR');
  const stableRequestId2 = noSecret.generateRequestId('pi-payment-repeat-123', 'AIR');
  assert.equal(stableRequestId1, stableRequestId2,
    'retries for one Pi payment must reuse the same provider idempotency/request ID');
  assert.notEqual(stableRequestId1, noSecret.generateRequestId('different-pi-payment', 'AIR'),
    'different Pi payments must use different provider request IDs');
  assert.ok(stableRequestId1.length <= 50, 'provider request ID must respect the provider length limit');

  const unsupportedService = await noSecret.purchaseAirtime({
    paymentId: 'pi-payment-test', phone: '08031234567', serviceId: 'unsupported-network', amount: 500,
  });
  assert.equal(unsupportedService.errorCode, 'VTU_SERVICE_NOT_CONFIGURED');

  // Fuzzy substring matches are unsafe at an irreversible provider boundary:
  // "notmtn" must not be normalized to the MTN network.
  const fuzzyService = await noSecret.purchaseAirtime({
    paymentId: 'pi-payment-test', phone: '08031234567', serviceId: 'notmtn', amount: 500,
  });
  assert.equal(fuzzyService.errorCode, 'VTU_SERVICE_NOT_CONFIGURED');

  const unconfiguredCustomer = await noSecret.verifyCustomer('mtn', '08000000000');
  assert.equal(unconfiguredCustomer.success, false,
    'missing provider credentials must not report a successful customer verification');
  assert.equal(unconfiguredCustomer.valid, false,
    'missing provider credentials must not mark the customer as valid');
  const body = '{ "request_id": "PNV-1", "status": "SUCCESS" }';
  assert.equal(noSecret.verifyWebhookSignature(body, signature('secret', body)), false,
    'missing webhook secret must reject even a correctly formed signature');
  assert.equal(noSecret.verifyWebhookSignature(body, undefined), false,
    'missing signature must reject');

  process.env.VTU_USER_PIN = 'test-webhook-secret';
  const configured = new VtuNgAdapter();
  const validBody = '{ "request_id": "PNV-1", "status": "SUCCESS" }';
  const validSignature = signature('test-webhook-secret', validBody);
  assert.equal(configured.verifyWebhookSignature(validBody, validSignature), true,
    'valid HMAC for the exact raw body must pass');
  assert.equal(configured.verifyWebhookSignature(validBody + '\n', validSignature), false,
    'body byte changes must invalidate the signature');
  assert.equal(configured.verifyWebhookSignature(validBody, '00'), false,
    'signature with wrong length must fail without throwing');
  assert.equal(configured.verifyWebhookSignature(validBody, validSignature.toUpperCase()), false,
    'hex signature comparison is case-sensitive');
  assert.equal(configured.verifyWebhookSignature(validBody, '  ' + validSignature + '  '), true,
    'surrounding header whitespace is trimmed');


  // Mock the provider boundary to verify international Nigerian numbers are
  // normalized before the outbound airtime request. This never contacts VTU.ng.
  process.env.VTU_USERNAME = 'test-user';
  process.env.VTU_PASSWORD = 'test-password';
  process.env.VTU_API_BASE_URL = 'https://vtu.test.invalid/wp-json';
  const outboundBodies: Array<{ url: string; body: any }> = [];
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    outboundBodies.push({ url, body });
    if (url.endsWith('/jwt-auth/v1/token')) {
      return new Response(JSON.stringify({ token: 'mock-jwt-token' }), { status: 200 });
    }
    if (url.endsWith('/api/v2/airtime')) {
      return new Response(JSON.stringify({ code: 'success', message: 'ORDER COMPLETED', data: { status: 'completed-api', order_id: 'mock-order-01' } }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: 'unexpected mock URL' }), { status: 500 });
  }) as typeof fetch;
  const normalizedAdapter = new VtuNgAdapter();
  const normalizedResult = await normalizedAdapter.purchaseAirtime({
    paymentId: 'pi-payment-normalization-test',
    phone: '+234 803 123 4567',
    serviceId: 'mtn-ng',
    amount: 500,
  });
  assert.equal(normalizedResult.status, 'FULFILLED');
  const airtimeRequest = outboundBodies.find((entry) => entry.url.endsWith('/api/v2/airtime'));
  assert.ok(airtimeRequest, 'airtime provider request should be made only to the mocked endpoint');
  assert.equal(airtimeRequest?.body.phone, '08031234567',
    'international +234 phone numbers must be normalized to Nigerian 11-digit format');
  assert.equal(airtimeRequest?.body.amount, 500);
  assert.equal(airtimeRequest?.body.service_id, 'mtn');

  console.log('VTU webhook signature tests passed.');
} finally {
  if (previousPin === undefined) delete process.env.VTU_USER_PIN;
  else process.env.VTU_USER_PIN = previousPin;
  if (previousUsername === undefined) delete process.env.VTU_USERNAME;
  else process.env.VTU_USERNAME = previousUsername;
  if (previousPassword === undefined) delete process.env.VTU_PASSWORD;
  else process.env.VTU_PASSWORD = previousPassword;
  if (previousBaseUrl === undefined) delete process.env.VTU_API_BASE_URL;
  else process.env.VTU_API_BASE_URL = previousBaseUrl;
  globalThis.fetch = previousFetch;
}
