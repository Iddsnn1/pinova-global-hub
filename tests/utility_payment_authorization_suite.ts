import assert from 'node:assert/strict';
import {
  authorizeUtilityPayment,
  normalizePiAmount,
  piAmountToPico,
  type CanonicalUtilityInvoice,
} from '../src/server/services/UtilityPaymentAuthorizationService';

const invoice: CanonicalUtilityInvoice = {
  invoiceId: 'UTIL-INV-001',
  paymentId: 'pi-payment-001',
  fiatAmount: '1000.00',
  fiatCurrency: 'NGN',
  piAmount: '0.000002069016',
  status: 'OPEN',
};
const payment = {
  identifier: 'pi-payment-001',
  user_uid: 'buyer-uid-001',
  direction: 'user_to_app',
  network: 'Pi Testnet',
  amount: 0.000002069016,
  status: { developer_completed: true },
  transaction: { verified: true, txid: 'pi-tx-001' },
};

assert.equal(piAmountToPico('0.000002069016'), 2069016n);
assert.equal(piAmountToPico(0.000000000001), 1n);
assert.equal(piAmountToPico(1e-7), 100000n);
assert.equal(piAmountToPico(1.2e-7), 120000n);
assert.equal(piAmountToPico(1e-13), null);
assert.equal(piAmountToPico('0.0000000000010'), 1n);
assert.equal(normalizePiAmount('2.5'), '2.500000000000');
assert.equal(normalizePiAmount('0.000002069016'), '0.000002069016');
assert.equal(piAmountToPico('0.0000000000001'), null);
assert.equal(piAmountToPico('1e-7'), null);
assert.equal(piAmountToPico('-1'), null);
assert.equal(piAmountToPico('1,000'), null);

assert.equal(authorizeUtilityPayment(invoice, 'pi-payment-001', payment, 'buyer-uid-001').authorized, true);
assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, direction: 'app_to_user' }, 'buyer-uid-001').error,
  'PI_PAYMENT_DIRECTION_INVALID',
);
assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, network: 'Pi Network' }, 'buyer-uid-001').error,
  'PI_PAYMENT_NETWORK_MISMATCH',
);

assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, amount: 0.000002069017 }, 'buyer-uid-001').error,
  'PI_PAYMENT_AMOUNT_MISMATCH',
);
assert.equal(
  authorizeUtilityPayment(invoice, 'different-payment', payment).error,
  'PI_PAYMENT_ID_MISMATCH',
);
assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, identifier: undefined }, 'buyer-uid-001').error,
  'PI_PAYMENT_ID_MISMATCH',
);
assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, identifier: 123 }, 'buyer-uid-001').error,
  'PI_PAYMENT_ID_MISMATCH',
);
assert.equal(
  authorizeUtilityPayment(invoice, 'pi-payment-001', { ...payment, status: { developer_completed: false } }, 'buyer-uid-001').error,
  'PI_PAYMENT_NOT_COMPLETED',
);
assert.equal(
  authorizeUtilityPayment({ ...invoice, status: 'PAID' }, 'pi-payment-001', payment).error,
  'UTILITY_INVOICE_NOT_PAYABLE',
);
assert.equal(
  authorizeUtilityPayment(null, 'pi-payment-001', payment).error,
  'UTILITY_INVOICE_REQUIRED',
);
assert.equal(
  authorizeUtilityPayment({ ...invoice, piAmount: 'not-an-amount' }, 'pi-payment-001', payment).error,
  'UTILITY_INVOICE_AMOUNT_INVALID',
);

console.log('Utility payment authorization tests passed.');
