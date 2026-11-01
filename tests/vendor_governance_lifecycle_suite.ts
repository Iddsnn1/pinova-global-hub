/**
 * Vendor Governance Lifecycle Test Suite
 *
 * Verifies that server-side governance status is the authoritative source for
 * merchant verification and seller activation.
 */

import { VendorApplicationRepository } from '../src/server/db/repositories/VendorApplicationRepository';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const repo = new VendorApplicationRepository();
const testApplicationId = 'TEST-VAPP-LIFECYCLE';
const testUsername = 'test_vendor_lifecycle';
const seeded = repo.save({
  id: testApplicationId,
  pioneerUsername: testUsername,
  storeName: 'Test Merchant Lifecycle Fixture',
  sellerType: 'business',
  country: 'Test Country',
  countryCode: 'ZZ',
  stateRegion: 'Test Region',
  city: 'Test City',
  contactEmail: 'vendor-lifecycle@example.invalid',
  contactPhone: 'TEST_ONLY',
  storeDescription: 'Synthetic test-only merchant fixture for governance lifecycle tests.',
  categoriesToSell: [],
  documents: [],
  policies: {
    returnRefundPolicy: 'TEST_ONLY',
    deliveryShippingPolicy: 'TEST_ONLY'
  },
  pstpAgreementAccepted: true,
  status: 'PENDING_REVIEW',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
assert(Boolean(seeded), 'Test-only vendor application must be created');
assert(seeded.status === 'PENDING_REVIEW', 'New repository fixtures must begin in review');
assert(seeded.verificationStatus === 'Pending Verification', 'Pending application must not be Verified');
assert(seeded.sellerStatus === 'Probation', 'Pending application must not be Active');

const pending = repo.updateStatus(testApplicationId, 'PENDING_REVIEW', 'Awaiting governance review', 'test-admin');
assert(pending?.verificationStatus === 'Pending Verification', 'Pending review must not be Verified');
assert(pending?.sellerStatus === 'Probation', 'Pending review must not be Active');

const accessWhilePending = repo.getMerchantAccess(testUsername);
assert(accessWhilePending.canSell === false, 'Pending vendor must not be allowed to sell');
assert(accessWhilePending.canReceivePstpOrders === false, 'Pending vendor must not receive PSTP orders');

let approvalBlocked = false;
try {
  repo.updateStatus(testApplicationId, 'APPROVED', 'Governance approved', 'test-admin');
} catch (error) {
  approvalBlocked = error instanceof Error
    && error.message === 'MERCHANT_APPROVAL_MUST_USE_COMPLIANCE_QUEUE';
}
assert(approvalBlocked, 'Legacy repository must reject merchant approval mutations');

const accessAfterBlockedApproval = repo.getMerchantAccess(testUsername);
assert(accessAfterBlockedApproval.canSell === false, 'Blocked legacy approval must not grant seller access');
assert(accessAfterBlockedApproval.canReceivePstpOrders === false, 'Blocked legacy approval must not grant PSTP access');

const rejected = repo.updateStatus(testApplicationId, 'REJECTED', 'Verification rejected', 'test-admin');
assert(rejected?.verificationStatus === 'Unverified', 'Rejected vendor must become Unverified');
assert(rejected?.sellerStatus === 'Suspended', 'Rejected vendor must be Suspended');

const accessAfterRejection = repo.getMerchantAccess(testUsername);
assert(accessAfterRejection.canSell === false, 'Rejected vendor must not be allowed to sell');
assert(accessAfterRejection.canReceivePstpOrders === false, 'Rejected vendor must not receive PSTP orders');

console.log('Vendor governance lifecycle suite: PASS');
