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
const seeded = repo.findById('VAPP-NG-9081');
assert(Boolean(seeded), 'Seeded vendor application must exist for lifecycle test');
assert(seeded?.status === 'APPROVED', 'Approved application must remain APPROVED');
assert(seeded?.verificationStatus === 'Verified', 'Approved application must be Verified');
assert(seeded?.sellerStatus === 'Active', 'Approved application must be Active');

const pending = repo.updateStatus('VAPP-NG-9081', 'PENDING_REVIEW', 'Awaiting governance review', 'test-admin');
assert(pending?.verificationStatus === 'Pending Verification', 'Pending review must not be Verified');
assert(pending?.sellerStatus === 'Probation', 'Pending review must not be Active');

const accessWhilePending = repo.getMerchantAccess('pi_artisan_hub');
assert(accessWhilePending.canSell === false, 'Pending vendor must not be allowed to sell');
assert(accessWhilePending.canReceivePstpOrders === false, 'Pending vendor must not receive PSTP orders');

const approved = repo.updateStatus('VAPP-NG-9081', 'APPROVED', 'Governance approved', 'test-admin');
assert(approved?.verificationStatus === 'Verified', 'Approved vendor must become Verified');
assert(approved?.sellerStatus === 'Active', 'Approved vendor must become Active');

const accessAfterApproval = repo.getMerchantAccess('pi_artisan_hub');
assert(accessAfterApproval.canSell === true, 'Approved vendor must be allowed to sell');
assert(accessAfterApproval.canReceivePstpOrders === true, 'Approved vendor with PSTP agreement must receive PSTP orders');

const rejected = repo.updateStatus('VAPP-NG-9081', 'REJECTED', 'Verification rejected', 'test-admin');
assert(rejected?.verificationStatus === 'Unverified', 'Rejected vendor must become Unverified');
assert(rejected?.sellerStatus === 'Suspended', 'Rejected vendor must be Suspended');

const accessAfterRejection = repo.getMerchantAccess('pi_artisan_hub');
assert(accessAfterRejection.canSell === false, 'Rejected vendor must not be allowed to sell');
assert(accessAfterRejection.canReceivePstpOrders === false, 'Rejected vendor must not receive PSTP orders');

console.log('Vendor governance lifecycle suite: PASS');
