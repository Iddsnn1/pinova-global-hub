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
  status: 'APPROVED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
assert(Boolean(seeded), 'Test-only vendor application must be created');
assert(seeded.status === 'APPROVED', 'Approved application must remain APPROVED');
assert(seeded.verificationStatus === 'Verified', 'Approved application must be Verified');
assert(seeded.sellerStatus === 'Active', 'Approved application must be Active');

const pending = repo.updateStatus(testApplicationId, 'PENDING_REVIEW', 'Awaiting governance review', 'test-admin');
assert(pending?.verificationStatus === 'Pending Verification', 'Pending review must not be Verified');
assert(pending?.sellerStatus === 'Probation', 'Pending review must not be Active');

const accessWhilePending = repo.getMerchantAccess(testUsername);
assert(accessWhilePending.canSell === false, 'Pending vendor must not be allowed to sell');
assert(accessWhilePending.canReceivePstpOrders === false, 'Pending vendor must not receive PSTP orders');

const approved = repo.updateStatus(testApplicationId, 'APPROVED', 'Governance approved', 'test-admin');
assert(approved?.verificationStatus === 'Verified', 'Approved vendor must become Verified');
assert(approved?.sellerStatus === 'Active', 'Approved vendor must become Active');

const accessAfterApproval = repo.getMerchantAccess(testUsername);
assert(accessAfterApproval.canSell === true, 'Approved vendor must be allowed to sell');
assert(accessAfterApproval.canReceivePstpOrders === true, 'Approved vendor with PSTP agreement must receive PSTP orders');

const rejected = repo.updateStatus(testApplicationId, 'REJECTED', 'Verification rejected', 'test-admin');
assert(rejected?.verificationStatus === 'Unverified', 'Rejected vendor must become Unverified');
assert(rejected?.sellerStatus === 'Suspended', 'Rejected vendor must be Suspended');

const accessAfterRejection = repo.getMerchantAccess(testUsername);
assert(accessAfterRejection.canSell === false, 'Rejected vendor must not be allowed to sell');
assert(accessAfterRejection.canReceivePstpOrders === false, 'Rejected vendor must not receive PSTP orders');

console.log('Vendor governance lifecycle suite: PASS');
