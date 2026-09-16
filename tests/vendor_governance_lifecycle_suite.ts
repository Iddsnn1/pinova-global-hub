/**
 * Vendor Governance Lifecycle Test Suite
 *
 * Verifies that server-side governance status is the authoritative source for
 * merchant verification and seller activation without relying on production seed data.
 */

import { VendorApplicationRepository } from '../src/server/db/repositories/VendorApplicationRepository';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const repo = new VendorApplicationRepository();

// Test fixture is created explicitly in the test environment; no fabricated
// merchant/KYC record is shipped as production repository seed data.
const fixture = repo.save({
  id: 'TEST-VAPP-LIFECYCLE',
  pioneerUsername: 'test_vendor_lifecycle',
  pioneerUid: 'TEST_UID_LIFECYCLE',
  storeName: 'Lifecycle Test Merchant',
  sellerType: 'business',
  country: 'Nigeria',
  countryCode: 'NG',
  stateRegion: 'Kano',
  city: 'Kano',
  contactEmail: 'test@example.invalid',
  contactPhone: '+00000000000',
  storeDescription: 'Automated governance lifecycle test fixture.',
  categoriesToSell: ['physical'],
  documents: [],
  policies: {
    returnRefundPolicy: 'Test only',
    deliveryShippingPolicy: 'Test only'
  },
  pstpAgreementAccepted: true,
  status: 'APPROVED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

assert(fixture.status === 'APPROVED', 'Approved application must remain APPROVED');
assert(fixture.verificationStatus === 'Verified', 'Approved application must be Verified');
assert(fixture.sellerStatus === 'Active', 'Approved application must be Active');

const pending = repo.updateStatus('TEST-VAPP-LIFECYCLE', 'PENDING_REVIEW', 'Awaiting governance review', 'test-admin');
assert(pending?.verificationStatus === 'Pending Verification', 'Pending review must not be Verified');
assert(pending?.sellerStatus === 'Probation', 'Pending review must not be Active');

const accessWhilePending = repo.getMerchantAccess('test_vendor_lifecycle');
assert(accessWhilePending.canSell === false, 'Pending vendor must not be allowed to sell');
assert(accessWhilePending.canReceivePstpOrders === false, 'Pending vendor must not receive PSTP orders');

const approved = repo.updateStatus('TEST-VAPP-LIFECYCLE', 'APPROVED', 'Governance approved', 'test-admin');
assert(approved?.verificationStatus === 'Verified', 'Approved vendor must become Verified');
assert(approved?.sellerStatus === 'Active', 'Approved vendor must become Active');

const accessAfterApproval = repo.getMerchantAccess('test_vendor_lifecycle');
assert(accessAfterApproval.canSell === true, 'Approved vendor must be allowed to sell');
assert(accessAfterApproval.canReceivePstpOrders === true, 'Approved vendor with PSTP agreement must receive PSTP orders');

const rejected = repo.updateStatus('TEST-VAPP-LIFECYCLE', 'REJECTED', 'Verification rejected', 'test-admin');
assert(rejected?.verificationStatus === 'Unverified', 'Rejected vendor must become Unverified');
assert(rejected?.sellerStatus === 'Suspended', 'Rejected vendor must be Suspended');

const accessAfterRejection = repo.getMerchantAccess('test_vendor_lifecycle');
assert(accessAfterRejection.canSell === false, 'Rejected vendor must not be allowed to sell');
assert(accessAfterRejection.canReceivePstpOrders === false, 'Rejected vendor must not receive PSTP orders');

console.log('Vendor governance lifecycle suite: PASS');
