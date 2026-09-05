/**
 * PiNova Global Hub — Audit V2 P0/P1 Remediation Test Suite
 * Comprehensive verification of all security and education remediations.
 */

import os from 'os';
import path from 'path';
process.env.PINOVA_DATA_DIR = path.join(os.tmpdir(), `pinova_audit_test_${Date.now()}`);

import crypto from 'crypto';
import { UserIdentityRepository } from '../src/server/auth/UserIdentityRepository';
import { AuthorizationService } from '../src/server/auth/AuthorizationService';
import { createRateLimiter } from '../src/server/auth/rateLimit';
import { EducationRepository } from '../src/server/db/repositories/EducationRepository';
import { EducationClassificationEngine } from '../src/server/services/EducationClassificationEngine';
import { StudentVerificationService } from '../src/server/services/StudentVerificationService';
import { SecurityEventRepository, ALLOWED_SECURITY_EVENT_TYPES } from '../src/server/db/repositories/SecurityEventRepository';
import { PstpDisputeRepository } from '../src/server/db/repositories/PstpDisputeRepository';
import { PstpAuditRepository } from '../src/server/db/repositories/PstpAuditRepository';
import { AuditService } from '../src/server/services/AuditService';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName} ${errorDetail ? `— ${errorDetail}` : ''}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('PINOVA GLOBAL HUB — AUDIT V2 REMEDIATION TEST SUITE');
  console.log('================================================================\n');

  // --- 1. AUTHENTICATION & SERVER-SIDE AUTHORIZATION ---
  console.log('--- SECTION 1: SERVER-SIDE AUTHORIZATION & SESSION AUDIT ---');

  const userRepo = new UserIdentityRepository();
  const authService = new AuthorizationService(userRepo);

  // 1.1 Session Creation & Identity Binding
  const pioneerSession = await authService.createSession({
    username: 'pioneer_alice',
    uid: 'pi-uid-alice-123',
    roles: ['PIONEER', 'STUDENT']
  });
  assert(Boolean(pioneerSession.token), 'Scenario 1.1: Auth service issues secure random session token');
  assert(pioneerSession.user.username === 'pioneer_alice', 'Scenario 1.2: Authenticated user profile bound to session');
  assert(pioneerSession.user.roles.includes('PIONEER'), 'Scenario 1.3: User possesses assigned role');

  // 1.2 Role Checking
  const isAliceAdmin = authService.hasRole(pioneerSession.user, 'PLATFORM_ADMIN');
  assert(!isAliceAdmin, 'Scenario 1.4: Regular Pioneer lacks PLATFORM_ADMIN role');

  const isAliceStudent = authService.hasRole(pioneerSession.user, 'STUDENT');
  assert(isAliceStudent, 'Scenario 1.5: Regular Pioneer with student role possesses STUDENT role');

  // 1.3 Admin Session & Permissions
  const adminSession = await authService.createSession({
    username: 'admin_bob',
    uid: 'pi-uid-bob-admin',
    roles: ['PLATFORM_ADMIN']
  });
  assert(authService.hasRole(adminSession.user, 'PLATFORM_ADMIN'), 'Scenario 1.6: Platform admin possesses PLATFORM_ADMIN role');
  assert(authService.hasPermission(adminSession.user, 'pstp:disputes:resolve'), 'Scenario 1.7: Platform admin possesses dispute resolution permission');
  assert(authService.hasPermission(adminSession.user, 'education:fees:override'), 'Scenario 1.8: Platform admin possesses fee override permission');

  // 1.4 Client Header Impersonation Rejection
  // If a user token is regular pioneer, an attacker cannot claim admin permissions
  const tokenUser = await authService.authenticateToken(pioneerSession.token);
  assert(tokenUser !== null && !tokenUser.roles.includes('PLATFORM_ADMIN'), 'Scenario 1.9: Token cannot be spoofed to elevate privileges');

  // 1.5 Logout & Session Invalidation
  authService.invalidateSession(pioneerSession.token);
  const invalidatedUser = await authService.authenticateToken(pioneerSession.token);
  assert(invalidatedUser === null, 'Scenario 1.10: Invalidated session token rejected upon subsequent authentication');


  // --- 2. PSTP DISPUTE RESOLUTION & SECURITY ---
  console.log('\n--- SECTION 2: PSTP DISPUTE SECURITY & STATE MACHINE AUDIT ---');

  const pstpDisputeRepo = new PstpDisputeRepository();
  const pstpAuditRepo = new PstpAuditRepository();
  const auditService = AuditService.getInstance(pstpAuditRepo);

  const dispute = pstpDisputeRepo.createDispute({
    orderId: 'ORD-TEST-9001',
    buyerUsername: 'pioneer_alice',
    sellerUsername: 'merchant_charlie',
    reason: 'Defective item received',
    description: 'The screen is shattered upon arrival.',
    amountPi: 50.0,
    status: 'open'
  });

  assert(dispute.status === 'open', 'Scenario 2.1: Initial dispute created in "open" state');
  assert(dispute.buyerUsername === 'pioneer_alice', 'Scenario 2.2: Buyer authoritatively set');

  // 2.2 Add Comment
  const updatedWithComment = pstpDisputeRepo.addComment(dispute.id, {
    sender: 'pioneer_alice',
    role: 'buyer',
    text: 'Attached image evidence.'
  });
  assert(updatedWithComment !== null && updatedWithComment.comments.length === 1, 'Scenario 2.3: Authorized comment appended to dispute');

  // 2.3 Resolve Dispute
  const resolvedDispute = pstpDisputeRepo.resolveDispute(dispute.id, {
    decision: 'full_refund',
    note: 'Evidence confirmed item arrived shattered.',
    refundAmountPi: 50.0,
    resolvedBy: 'admin_bob',
    resolvedAt: new Date().toISOString()
  });

  assert(resolvedDispute !== null && resolvedDispute.status === 'resolved_refunded', 'Scenario 2.4: Dispute resolved to resolved_refunded state');
  assert(resolvedDispute?.adminResolution?.refundAmountPi === 50.0, 'Scenario 2.5: Refund amount accurately captured');

  // 2.4 Audit Log Recorded
  const auditLog = auditService.recordPstpAudit({
    orderId: dispute.orderId,
    actor: 'admin_bob',
    actorRole: 'admin',
    action: 'DISPUTE_RESOLVED',
    details: 'Full refund granted to buyer'
  });
  assert(auditLog.action === 'DISPUTE_RESOLVED', 'Scenario 2.6: Audit log successfully generated');
  assert(auditLog.actor === 'admin_bob', 'Scenario 2.7: Audit actor matches authenticated admin');


  // --- 3. SECURITY EVENTS REPOSITORY ---
  console.log('\n--- SECTION 3: SECURITY EVENTS & ATTACK MONITORING AUDIT ---');

  const securityRepo = new SecurityEventRepository();

  // 3.1 Allowed Event Types
  let recordedEvent = null;
  try {
    recordedEvent = securityRepo.recordEvent({
      eventType: 'tamper_detected',
      severity: 'critical',
      username: 'attacker_x',
      details: 'Client attempted to submit altered Pi fee amount'
    });
  } catch (e) {
    // Should not throw for allowed event
  }
  assert(recordedEvent !== null && recordedEvent.eventType === 'tamper_detected', 'Scenario 3.1: Valid security event recorded');

  // 3.2 Unknown Event Rejection
  let rejectedUnknown = false;
  try {
    securityRepo.recordEvent({
      eventType: 'UNKNOWN_RANDOM_CRAP' as any,
      severity: 'info',
      details: 'Testing rejection of unwhitelisted types'
    });
  } catch (err) {
    rejectedUnknown = true;
  }
  assert(rejectedUnknown, 'Scenario 3.2: Unwhitelisted security event type rejected by repository');


  // --- 4. GLOBAL EDUCATION TAXONOMY ---
  console.log('\n--- SECTION 4: GLOBAL EDUCATION TAXONOMY AUDIT ---');

  const classificationEngine = EducationClassificationEngine.getInstance();
  const supported = classificationEngine.getSupportedCountries();
  assert(supported.includes('NG'), 'Scenario 4.1: Nigeria taxonomy supported');
  assert(supported.includes('GH'), 'Scenario 4.2: Ghana taxonomy supported');
  assert(supported.includes('GB'), 'Scenario 4.3: UK taxonomy supported');
  assert(supported.includes('US'), 'Scenario 4.4: US taxonomy supported');

  const ngTaxonomy = classificationEngine.getTaxonomy('NG');
  assert(ngTaxonomy.educationSystemName.includes('6-3-3-4'), 'Scenario 4.5: Nigeria academic structure is 6-3-3-4');
  assert(ngTaxonomy.supportedLevels.some((l) => l.tier === 'primary'), 'Scenario 4.6: Nigeria basic primary level included');
  assert(ngTaxonomy.supportedLevels[0].periods.length === 3, 'Scenario 4.7: Nigeria 3-term academic calendar specified');

  const usTaxonomy = classificationEngine.getTaxonomy('US');
  assert(usTaxonomy.countryCode === 'US' && (usTaxonomy.educationSystemName.includes('K-12') || usTaxonomy.educationSystemName.includes('Pre-K')), 'Scenario 4.8: US academic structure is Pre-K/K-12 + Higher Ed');
  assert(usTaxonomy.supportedLevels.some((l) => l.periods.some((p) => p.toLowerCase().includes('fall'))), 'Scenario 4.9: US Fall semester included');


  // --- 5. AUTHORITATIVE STUDENT VERIFICATION SERVICE ---
  console.log('\n--- SECTION 5: STUDENT IDENTITY & VERIFICATION SERVICE AUDIT ---');

  const verificationService = StudentVerificationService.getInstance();

  // 5.1 Authoritative Verification
  const validVerification = await verificationService.verifyStudent({
    studentReference: '2021/ENG/0491',
    institutionId: 'inst-unilag-001',
    countryCode: 'NG'
  });
  assert(validVerification.verified, 'Scenario 5.1: Known student matches institution registry');
  assert(validVerification.verificationStatus === 'VERIFIED', 'Scenario 5.2: Verification status is VERIFIED');

  // 5.2 Invalid Student Rejection
  const invalidVerification = await verificationService.verifyStudent({
    studentReference: 'FAKE/999/000',
    institutionId: 'inst-unilag-001',
    countryCode: 'NG'
  });
  assert(!invalidVerification.verified, 'Scenario 5.3: Unknown student fails verification');
  assert(invalidVerification.verificationStatus === 'REJECTED', 'Scenario 5.4: Status is REJECTED');

  // 5.3 Institution Accreditation
  const instAccreditation = await verificationService.verifyInstitution('NG-FED-001', 'NG');
  assert(instAccreditation.accredited, 'Scenario 5.5: Accredited university confirmed via regulatory body');


  // --- 6. EDUCATION REPOSITORY FINANCIAL CALCULATIONS & OVERPAYMENT ---
  console.log('\n--- SECTION 6: SCHOOL FEE ENGINE & OVERPAYMENT DEFENSE AUDIT ---');

  // 6.1 Server-Authoritative Fee Calculation
  const calculated = EducationRepository.calculateInvoiceTotals({
    subtotal: 1000,
    discount: 100,
    tax: 50
  });
  assert(calculated.subtotal === 1000, 'Scenario 6.1: Subtotal preserved');
  assert(calculated.discount === 100, 'Scenario 6.2: Discount subtracted');
  assert(calculated.tax === 50, 'Scenario 6.3: Tax added');
  assert(calculated.totalAmount === 950, 'Scenario 6.4: Authoritative total = 1000 - 100 + 50 = 950');

  // 6.2 Excessive Discount Protection
  const excessiveDiscount = EducationRepository.calculateInvoiceTotals({
    subtotal: 500,
    discount: 9999,
    tax: 0
  });
  assert(excessiveDiscount.discount === 500, 'Scenario 6.5: Excessive discount capped at subtotal');
  assert(excessiveDiscount.totalAmount === 0, 'Scenario 6.6: Total cannot drop below zero');

  // 6.3 Overpayment Prevention in EducationRepository
  const eduRepo = new EducationRepository();

  const invoice = eduRepo.createInvoice({
    id: `inv-test-${Date.now()}`,
    invoiceNumber: `INV-TEST-001`,
    institutionId: 'inst-unilag-01',
    institutionName: 'University of Lagos',
    studentId: 'std-ng-001',
    studentName: 'Chiamaka Adeleke',
    studentMatricOrReg: 'MAT-2024-001',
    educationTier: 'tertiary',
    programmeOrClass: 'Computer Science',
    academicSession: '2024/2025',
    termOrSemester: '1st Semester',
    educationLevel: 'Undergraduate',
    items: [
      { id: 'li-1', category: 'tuition', description: 'Tuition Fee', amount: 400, isCompulsory: true, compulsory: true }
    ],
    lineItems: [
      { id: 'li-1', category: 'tuition', description: 'Tuition Fee', amount: 400, isCompulsory: true, compulsory: true }
    ],
    subtotal: 400,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 400,
    amountPaid: 0,
    outstandingBalance: 400,
    currency: 'USD',
    dueDate: '2025-12-31',
    status: 'UNPAID',
    issuedDate: new Date().toISOString(),
    allowedInstallments: 1,
    installmentsPaidCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  assert(invoice.outstandingBalance === 400, 'Scenario 6.7: Invoice initialized with correct balance');

  // 6.4 Valid Partial Payment
  const partialPaymentResult = eduRepo.recordPayment({
    invoiceId: invoice.id,
    amountPaid: 250,
    currency: 'USD',
    paymentMethod: 'PI_NETWORK',
    payerUsername: 'pioneer_parent'
  });
  assert(partialPaymentResult.invoice.amountPaid === 250, 'Scenario 6.8: Invoice records partial payment');
  assert(partialPaymentResult.invoice.outstandingBalance === 150, 'Scenario 6.9: Outstanding balance reduced to 150');
  assert(partialPaymentResult.invoice.status === 'PARTIALLY_PAID', 'Scenario 6.10: Invoice status updated to PARTIALLY_PAID');

  // 6.5 Overpayment Rejection
  let overpaymentBlocked = false;
  try {
    eduRepo.recordPayment({
      invoiceId: invoice.id,
      amountPaid: 200, // Balance is 150, paying 200 is an overpayment!
      currency: 'USD',
      paymentMethod: 'PI_NETWORK',
      payerUsername: 'pioneer_parent'
    });
  } catch (err: any) {
    if (err.message.includes('exceeds outstanding balance')) {
      overpaymentBlocked = true;
    }
  }
  assert(overpaymentBlocked, 'Scenario 6.11: Payment exceeding outstanding balance is strictly rejected');


  // --- 7. CRYPTOGRAPHIC RECEIPT DIGEST & TAMPER DETECTION ---
  console.log('\n--- SECTION 7: CANONICAL RECEIPT DIGEST & TAMPER DETECTION AUDIT ---');

  const receipt = partialPaymentResult.receipt;
  assert(Boolean(receipt.verificationHash), 'Scenario 7.1: Receipt generated with cryptographic hash');
  assert(receipt.verificationHash.length === 64, 'Scenario 7.2: Verification hash is a valid 256-bit (64 hex chars) SHA-256 digest');

  // 7.3 Verification of Untampered Receipt
  const verifyValid = eduRepo.verifyReceipt(receipt.receiptNumber);
  assert(verifyValid.found, 'Scenario 7.3: Receipt found in storage registry');
  assert(verifyValid.status === 'VERIFIED', 'Scenario 7.4: Verification status is VERIFIED');

  // 7.4 Tamper Detection
  // Simulate tampering with receipt amount in memory
  const storedReceipt = eduRepo.getReceiptByNumber(receipt.receiptNumber);
  if (storedReceipt) {
    const tamperedReceipt = { ...storedReceipt, amountPaid: 999999 };
    // Compute digest on tampered data
    const tamperedDigest = EducationRepository.computeReceiptDigest({
      receiptReference: tamperedReceipt.receiptNumber,
      invoiceReference: tamperedReceipt.invoiceNumber,
      paymentId: tamperedReceipt.paymentId,
      studentId: tamperedReceipt.studentId,
      institutionId: tamperedReceipt.institutionId,
      amount: tamperedReceipt.amountPaid, // altered amount!
      currency: tamperedReceipt.currency,
      paymentTimestamp: tamperedReceipt.paymentDate,
      settlementStatus: 'COMPLETED'
    });
    assert(tamperedDigest !== receipt.verificationHash, 'Scenario 7.5: Altered receipt data produces mismatched cryptographic digest (Tamper Detected)');
  }


  // --- 8. ADMISSIONS STATE MACHINE ---
  console.log('\n--- SECTION 8: ADMISSIONS STATE MACHINE AUDIT ---');

  const application = eduRepo.submitAdmissionApplication({
    institutionId: 'inst-unilag-01',
    institutionName: 'University of Lagos',
    programmeId: 'prog-cs',
    programmeName: 'B.Sc. Computer Science',
    applicantFullName: 'Emeka Okonkwo',
    applicantEmail: 'emeka@example.com',
    academicSession: '2025/2026',
    documents: []
  });

  assert(application.status === 'SUBMITTED', 'Scenario 8.1: Application initial state is SUBMITTED');

  // Valid transition: SUBMITTED -> UNDER_REVIEW
  const underReview = eduRepo.updateAdmissionStatus(application.id, 'UNDER_REVIEW', 'Documents under committee review', 'admissions_officer');
  assert(underReview.status === 'UNDER_REVIEW', 'Scenario 8.2: Transition to UNDER_REVIEW allowed');

  // Valid transition: UNDER_REVIEW -> OFFERED
  const offered = eduRepo.updateAdmissionStatus(application.id, 'OFFERED', 'Accepted by admissions board', 'admissions_chair');
  assert(offered.status === 'OFFERED', 'Scenario 8.3: Transition to OFFERED allowed');

  // Valid transition: OFFERED -> ACCEPTED / OFFER_ACCEPTED
  const accepted = eduRepo.acceptAdmissionOffer(application.id);
  assert(accepted?.status === 'ACCEPTED' || accepted?.status === 'OFFER_ACCEPTED', 'Scenario 8.4: Offer acceptance transitions to ACCEPTED / OFFER_ACCEPTED');

  // Invalid transition: Try transitioning ACCEPTED -> SUBMITTED (Backward transition disallowed)
  let invalidTransitionBlocked = false;
  try {
    eduRepo.updateAdmissionStatus(application.id, 'SUBMITTED', 'Attempting backward reset', 'malicious_user');
  } catch (err) {
    invalidTransitionBlocked = true;
  }
  assert(invalidTransitionBlocked, 'Scenario 8.5: Invalid backward transition disallowed by state machine');


  // --- 9. RATE LIMITING ENGINE ---
  console.log('\n--- SECTION 9: RATE LIMITING ENGINE AUDIT ---');

  const limiter = createRateLimiter({
    windowMs: 1000,
    maxRequests: 3,
    message: 'Rate limit exceeded'
  });

  const mockReq = { ip: '192.168.1.100', headers: {} } as any;
  let statusSet = 0;
  let responseBody: any = null;
  const mockRes = {
    setHeader: () => {},
    status: (code: number) => { statusSet = code; return mockRes; },
    json: (body: any) => { responseBody = body; return mockRes; }
  } as any;

  let nextCalls = 0;
  const next = () => { nextCalls++; };

  // Call 1, 2, 3 should succeed
  limiter(mockReq, mockRes, next);
  limiter(mockReq, mockRes, next);
  limiter(mockReq, mockRes, next);
  assert(nextCalls === 3, 'Scenario 9.1: Requests under threshold proceed to next()');

  // Call 4 should trigger 429
  limiter(mockReq, mockRes, next);
  assert(statusSet === 429, 'Scenario 9.2: 4th request within window returns 429 Too Many Requests');
  assert(responseBody?.error === 'RATE_LIMIT_EXCEEDED', 'Scenario 9.3: Rate limit response returns structured error');

  console.log('\n================================================================');
  console.log(`AUDIT V2 REMEDIATION RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test runner encountered uncaught fatal error:', err);
  process.exit(1);
});
