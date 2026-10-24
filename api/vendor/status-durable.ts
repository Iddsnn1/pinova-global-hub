import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, durableVendorStorageEnabled } from '../../dist/server.cjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  try {
    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authenticated Pioneer session required.' });
    if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
    const application = await getDurableVendorApplication(user.username);
    const approved = application?.status === 'APPROVED' && application.verificationStatus === 'Verified' && application.sellerStatus === 'Active';
    const access = {
      applicationFound: Boolean(application),
      applicationStatus: application?.status || null,
      verificationStatus: application?.verificationStatus || 'Unverified',
      sellerStatus: application?.sellerStatus || 'Inactive',
      canSell: approved,
      canReceivePstpOrders: approved && application?.pstpAgreementAccepted === true
    };
    return res.status(200).json({
      success: true,
      authorized: approved,
      status: application?.status || 'UNREGISTERED',
      sellerLifecycle: approved ? 'ACTIVE' : 'INACTIVE',
      verified: approved,
      pstpAuthorized: access.canReceivePstpOrders,
      storeName: application?.storeName || null,
      applicationId: application?.id || null,
      access
    });
  } catch (error: any) {
    console.error('[durable-vendor-status]', error);
    return res.status(500).json({ success: false, error: 'SELLER_ACCESS_CHECK_ERROR' });
  }
}
