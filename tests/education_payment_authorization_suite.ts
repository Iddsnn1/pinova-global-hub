import os from 'os';
import path from 'path';

process.env.PINOVA_DATA_DIR = path.join(os.tmpdir(), 'pinova_edu_payment_auth_' + Date.now());

import { EducationRepository } from '../src/server/db/repositories/EducationRepository';
import {
  setJambCapsAuthoritativeAdapter,
  verifyJambCapsAuthorization
} from '../src/server/services/JambCapsAuthorizationService';

const ok = (value: boolean, name: string) => {
  if (!value) throw new Error('FAILED: ' + name);
  console.log('[PASS] ' + name);
};

async function run() {
  const repo = new EducationRepository();

  const invoice = repo.createInvoice({
    id: 'inv-edu-security-001',
    invoiceNumber: 'INV/EDU/SEC/001',
    institutionId: 'inst-001',
    institutionName: 'Authorized Institution Test Fixture',
    studentId: 'student-001',
    studentName: 'Test Student',
    studentMatricOrReg: 'MAT-001',
    guardianId: 'guardian-001',
    educationTier: 'tertiary',
    educationLevel: 'Undergraduate',
    programmeOrClass: '100 Level',
    academicSession: '2026/2027',
    termOrSemester: 'Semester 1',
    items: [{ id: 'fee-1', category: 'tuition', description: 'Tuition', amount: 3.5, isCompulsory: true }],
    subtotal: 3.5,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 3.5,
    amountPaid: 0,
    outstandingBalance: 3.5,
    currency: 'PI',
    dueDate: '2026-10-31T00:00:00.000Z',
    status: 'UNPAID',
    allowedInstallments: 1,
    installmentsPaidCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const first = repo.recordPayment({
    invoiceId: invoice.id,
    amountPaid: 3.5,
    currency: 'PI',
    piAmount: 3.5,
    piPaymentId: 'pi-pay-security-001',
    piTxid: 'tx-security-001',
    paymentMethod: 'PI_NETWORK',
    payerUsername: 'guardian-001',
    idempotencyKey: 'edu-idem-001'
  });

  ok(first.payment.status === 'VERIFIED_COMPLETED', 'verified Pi payment creates completed education settlement');
  ok(first.invoice.status === 'PAID', 'invoice becomes PAID only after authoritative settlement');
  ok(first.receipt.verificationHash === first.payment.auditHash, 'receipt digest is bound to payment audit hash');

  const replay = repo.recordPayment({
    invoiceId: invoice.id,
    amountPaid: 3.5,
    currency: 'PI',
    piAmount: 3.5,
    piPaymentId: 'pi-pay-security-001',
    piTxid: 'tx-security-001',
    paymentMethod: 'PI_NETWORK',
    payerUsername: 'guardian-001',
    idempotencyKey: 'edu-idem-001'
  });
  ok(replay.payment.id === first.payment.id, 'exact replay returns the original settlement');
  ok(repo.getAllPayments().length === 1, 'exact replay does not create a second payment');

  let replayMismatchRejected = false;
  try {
    repo.recordPayment({
      invoiceId: invoice.id,
      amountPaid: 2.5,
      currency: 'PI',
      piAmount: 2.5,
      piPaymentId: 'pi-pay-security-001',
      piTxid: 'tx-security-001',
      paymentMethod: 'PI_NETWORK',
      payerUsername: 'guardian-001',
      idempotencyKey: 'edu-idem-001'
    });
  } catch (error: any) {
    replayMismatchRejected = error?.message === 'PAYMENT_REPLAY_BINDING_MISMATCH';
  }
  ok(replayMismatchRejected, 'replay with altered amount is rejected');

  let crossInvoiceReplayRejected = false;
  try {
    repo.recordPayment({
      invoiceId: 'another-invoice',
      amountPaid: 3.5,
      currency: 'PI',
      piAmount: 3.5,
      piPaymentId: 'pi-pay-security-001',
      piTxid: 'tx-security-001',
      paymentMethod: 'PI_NETWORK',
      payerUsername: 'guardian-001',
      idempotencyKey: 'edu-idem-001'
    });
  } catch (error: any) {
    crossInvoiceReplayRejected = error?.message === 'PAYMENT_REPLAY_BINDING_MISMATCH';
  }
  ok(crossInvoiceReplayRejected, 'replay cannot be rebound to another invoice');

  const receiptNumber = first.receipt.receiptNumber;
  const storedReceipt = repo.getReceiptByNumber(receiptNumber)!;
  storedReceipt.amountPaid = 2.5;
  const tampered = repo.verifyReceipt(receiptNumber);
  ok(tampered.status === 'TAMPERED' && !tampered.valid, 'receipt amount mutation fails SHA-256 verification');

  setJambCapsAuthoritativeAdapter(null);
  const noAdapter = await verifyJambCapsAuthorization({
    candidateReference: 'JAMB-TEST-001',
    institutionId: 'inst-001',
    programmeId: 'prog-001',
    operation: 'ADMISSION_STATUS'
  });
  ok(!noAdapter.authorized && noAdapter.availability === 'UNAVAILABLE', 'JAMB authorization fails closed without an authoritative adapter');

  setJambCapsAuthoritativeAdapter({
    verify: async () => ({ authorized: false, authoritativeReference: 'CAPS-DENIED-001' })
  });
  const denied = await verifyJambCapsAuthorization({
    candidateReference: 'JAMB-TEST-001',
    institutionId: 'inst-001',
    programmeId: 'prog-001',
    operation: 'ADMISSION_STATUS'
  });
  ok(!denied.authorized, 'negative authoritative JAMB response cannot authorize');

  setJambCapsAuthoritativeAdapter({
    verify: async () => ({ authorized: true, authoritativeReference: 'CAPS-AUTH-001' })
  });
  const authorized = await verifyJambCapsAuthorization({
    candidateReference: 'JAMB-TEST-001',
    institutionId: 'inst-001',
    programmeId: 'prog-001',
    operation: 'ADMISSION_STATUS'
  });
  ok(authorized.authorized && authorized.authoritativeReference === 'CAPS-AUTH-001', 'only an authoritative JAMB response can authorize');

  setJambCapsAuthoritativeAdapter(null);
  console.log('Education payment replay + denomination + receipt + JAMB authorization suite: GREEN');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
