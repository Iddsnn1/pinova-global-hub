import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { VtuNgAdapter } from '../src/server/integrations/vtuNgAdapter';

const previousPin = process.env.VTU_USER_PIN;
const previousUsername = process.env.VTU_USERNAME;
const previousPassword = process.env.VTU_PASSWORD;

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

  console.log('VTU webhook signature tests passed.');
} finally {
  if (previousPin === undefined) delete process.env.VTU_USER_PIN;
  else process.env.VTU_USER_PIN = previousPin;
  if (previousUsername === undefined) delete process.env.VTU_USERNAME;
  else process.env.VTU_USERNAME = previousUsername;
  if (previousPassword === undefined) delete process.env.VTU_PASSWORD;
  else process.env.VTU_PASSWORD = previousPassword;
}
