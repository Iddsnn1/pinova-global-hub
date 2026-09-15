import express from 'express';
import { authenticate, AuthenticatedRequest } from '../auth';
import { vendorApplicationRepo } from '../db';
import { requireVendorPstpSellerAccess, requireVendorSellerAccess } from '../services/VendorAccessService';

export const vendorSellerRouter = express.Router();

vendorSellerRouter.get('/access', authenticate, (req: AuthenticatedRequest, res) => {
  const username = req.user?.username;
  const access = vendorApplicationRepo.getMerchantAccess(username || '');
  return res.status(200).json({ success: true, access });
});

vendorSellerRouter.post('/authorize', authenticate, (req: AuthenticatedRequest, res) => {
  try {
    const access = requireVendorSellerAccess(vendorApplicationRepo, req.user?.username);
    return res.status(200).json({ success: true, authorized: true, access });
  } catch (error: any) {
    return res.status(error?.statusCode === 403 ? 403 : 500).json({
      success: false,
      authorized: false,
      error: error?.code || 'SELLER_ACCESS_DENIED',
      message: error?.message || 'Seller access denied.'
    });
  }
});

vendorSellerRouter.post('/authorize-pstp', authenticate, (req: AuthenticatedRequest, res) => {
  try {
    const access = requireVendorPstpSellerAccess(vendorApplicationRepo, req.user?.username);
    return res.status(200).json({ success: true, authorized: true, access });
  } catch (error: any) {
    return res.status(error?.statusCode === 403 ? 403 : 500).json({
      success: false,
      authorized: false,
      error: error?.code || 'PSTP_SELLER_ACCESS_DENIED',
      message: error?.message || 'PSTP seller access denied.'
    });
  }
});
