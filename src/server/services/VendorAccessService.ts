import { VendorApplicationRepository } from '../db/repositories/VendorApplicationRepository';

export type VendorAccessDecision = ReturnType<VendorApplicationRepository['getMerchantAccess']>;

/**
 * Server-authoritative merchant access guard.
 * Client roles, badges, localStorage and UI state are never trusted here.
 */
export function getVendorAccess(
  repository: VendorApplicationRepository,
  username: string | undefined
): VendorAccessDecision {
  if (!username || !username.trim()) {
    return {
      applicationFound: false,
      applicationStatus: null,
      verificationStatus: 'Unverified',
      sellerStatus: 'Inactive',
      canSell: false,
      canReceivePstpOrders: false
    };
  }

  return repository.getMerchantAccess(username.trim());
}

export function requireVendorSellerAccess(
  repository: VendorApplicationRepository,
  username: string | undefined
): VendorAccessDecision {
  const access = getVendorAccess(repository, username);
  if (!access.canSell) {
    const error = new Error('Verified and active merchant status is required to perform seller operations.') as Error & {
      statusCode?: number;
      code?: string;
      access?: VendorAccessDecision;
    };
    error.statusCode = 403;
    error.code = 'MERCHANT_SELLER_ACCESS_REQUIRED';
    error.access = access;
    throw error;
  }
  return access;
}

export function requireVendorPstpSellerAccess(
  repository: VendorApplicationRepository,
  username: string | undefined
): VendorAccessDecision {
  const access = requireVendorSellerAccess(repository, username);
  if (!access.canReceivePstpOrders) {
    const error = new Error('Verified and active merchant status with an accepted PSTP agreement is required.') as Error & {
      statusCode?: number;
      code?: string;
      access?: VendorAccessDecision;
    };
    error.statusCode = 403;
    error.code = 'PSTP_SELLER_ACCESS_REQUIRED';
    error.access = access;
    throw error;
  }
  return access;
}
