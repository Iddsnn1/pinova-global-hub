import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, durableVendorStorageEnabled } from '../../dist/server.cjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  const user = await authenticateRequest(req);
  if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  const application = await getDurableVendorApplication(user.username);
  const approved = application?.status === 'APPROVED' && application.verificationStatus === 'Verified' && application.sellerStatus === 'Active';
  if (!approved) return res.status(403).json({ success: false, authorized: false, error: 'MERCHANT_NOT_APPROVED', message: 'Seller authorization requires an approved merchant application.' });
  return res.json({ success: true, authorized: true, sellerLifecycle: 'ACTIVE', verified: true, storeName: application.storeName, applicationId: application.id, access: { applicationFound: true, applicationStatus: application.status, verificationStatus: application.verificationStatus, sellerStatus: application.sellerStatus, canSell: true, canReceivePstpOrders: Boolean(application.pstpAgreementAccepted) } });
}
