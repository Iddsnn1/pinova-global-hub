import express from 'express';
import { authenticate, AuthenticatedRequest } from '../auth';
import {
  getDurableVendorApplication,
  durableVendorStorageEnabled
} from '../services/DurableVendorApplicationStore';

export const vendorSellerRouter = express.Router();

function sellerAccess(application: any) {
  const applicationFound = Boolean(application);
  const applicationStatus = application?.status ?? null;
  const verificationStatus = application?.verificationStatus ?? 'Unverified';
  const sellerStatus = application?.sellerStatus ?? 'Inactive';
  const canSell =
    applicationStatus === 'APPROVED' &&
    verificationStatus === 'Verified' &&
    sellerStatus === 'Active';
  const canReceivePstpOrders = canSell && application?.pstpAgreementAccepted === true;

  return {
    applicationFound,
    applicationStatus,
    verificationStatus,
    sellerStatus,
    canSell,
    canReceivePstpOrders
  };
}

async function resolveMerchant(req: AuthenticatedRequest) {
  if (!durableVendorStorageEnabled()) {
    const error = new Error('Durable merchant storage is unavailable.') as Error & { statusCode?: number; code?: string };
    error.statusCode = 503;
    error.code = 'DURABLE_VENDOR_STORAGE_UNAVAILABLE';
    throw error;
  }

  const username = String(req.user?.username || '').trim();
  if (!username) {
    const error = new Error('Authenticated Pioneer username is required.') as Error & { statusCode?: number; code?: string };
    error.statusCode = 401;
    error.code = 'INVALID_SESSION';
    throw error;
  }

  // Prefer exact Pioneer username. Only if no record exists may the server
  // resolve the same merchant by the authenticated Pi UID. This preserves
  // ownership boundaries while supporting Pi sessions whose display username
  // differs from the merchant application username.
  const direct = await getDurableVendorApplication(username);
  if (direct) return direct;

  const uidCandidates = [req.user?.piUid, req.user?.uid, req.user?.id]
    .map(value => String(value || '').trim())
    .filter(Boolean);
  if (!uidCandidates.length) return null;

  const { listDurableVendorApplications } = await import('../services/DurableVendorApplicationStore');
  const applications = await listDurableVendorApplications();
  return applications.find((application: any) => {
    const storedUid = String(application?.pioneerUid || '').trim();
    return storedUid && uidCandidates.includes(storedUid);
  }) || null;
}

vendorSellerRouter.get('/access', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const application = await resolveMerchant(req);
    return res.status(200).json({ success: true, access: sellerAccess(application) });
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({
      success: false,
      access: sellerAccess(null),
      error: error?.code || 'SELLER_ACCESS_LOOKUP_FAILED',
      message: error?.message || 'Unable to resolve merchant access.'
    });
  }
});

vendorSellerRouter.post('/authorize', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const application = await resolveMerchant(req);
    const access = sellerAccess(application);
    if (!access.canSell) {
      return res.status(403).json({
        success: false,
        authorized: false,
        error: 'MERCHANT_SELLER_ACCESS_REQUIRED',
        message: 'Verified and active merchant status is required to perform seller operations.',
        access
      });
    }
    return res.status(200).json({ success: true, authorized: true, access });
  } catch (error: any) {
    return res.status(error?.statusCode === 403 ? 403 : (error?.statusCode || 500)).json({
      success: false,
      authorized: false,
      error: error?.code || 'SELLER_ACCESS_DENIED',
      message: error?.message || 'Seller access denied.'
    });
  }
});

vendorSellerRouter.post('/authorize-pstp', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const application = await resolveMerchant(req);
    const access = sellerAccess(application);
    if (!access.canSell) {
      return res.status(403).json({
        success: false,
        authorized: false,
        pstpAuthorized: false,
        error: 'MERCHANT_SELLER_ACCESS_REQUIRED',
        message: 'Verified and active merchant status is required to perform seller operations.',
        access
      });
    }
    if (!access.canReceivePstpOrders) {
      return res.status(403).json({
        success: false,
        authorized: false,
        pstpAuthorized: false,
        error: 'PSTP_SELLER_ACCESS_REQUIRED',
        message: 'Verified and active merchant status with an accepted PSTP agreement is required.',
        access
      });
    }
    return res.status(200).json({
      success: true,
      authorized: true,
      pstpAuthorized: true,
      access
    });
  } catch (error: any) {
    return res.status(error?.statusCode === 403 ? 403 : (error?.statusCode || 500)).json({
      success: false,
      authorized: false,
      pstpAuthorized: false,
      error: error?.code || 'PSTP_SELLER_ACCESS_DENIED',
      message: error?.message || 'PSTP seller access denied.'
    });
  }
});
