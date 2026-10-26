import {
  authenticateVendorRequest as authenticateRequest,
  getDurableVendorApplicationByIdentity,
  durableVendorStorageEnabled
} from '../../dist/server.cjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });

  try {
    const user = await authenticateRequest(req);
    if (!user?.username) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authenticated Pioneer session required.'
      });
    }

    if (!durableVendorStorageEnabled()) {
      return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
    }

    // Resolve by the server-authenticated username first, then the authenticated
    // Pi UID. Never accept an identity supplied by the browser for this lookup.
    const application = await getDurableVendorApplicationByIdentity(
      user.username,
      user.piUid || user.id || null
    );

    const approved =
      application?.status === 'APPROVED' &&
      application.verificationStatus === 'Verified' &&
      application.sellerStatus === 'Active';

    const access = {
      applicationFound: Boolean(application),
      applicationStatus: application?.status || null,
      verificationStatus: application?.verificationStatus || 'Unverified',
      sellerStatus: application?.sellerStatus || 'Inactive',
      canSell: approved,
      canReceivePstpOrders: approved && application?.pstpAgreementAccepted === true
    };

    // Return only storefront/status fields needed by the UI. Do not expose KYC
    // documents, contact details, or the complete persisted application record.
    const publicApplication = application ? {
      id: application.id || null,
      storeName: application.storeName || null,
      storeDescription: application.storeDescription || '',
      storeLogo: application.storeLogo || '',
      storeBanner: application.storeBanner || '',
      status: application.status || null,
      verificationStatus: application.verificationStatus || 'Unverified',
      sellerStatus: application.sellerStatus || 'Inactive',
      pstpAgreementAccepted: application.pstpAgreementAccepted === true
    } : null;

    return res.status(200).json({
      success: true,
      authorized: approved,
      status: application?.status || 'UNREGISTERED',
      sellerLifecycle: approved ? 'ACTIVE' : 'INACTIVE',
      verified: approved,
      pstpAuthorized: access.canReceivePstpOrders,
      storeName: application?.storeName || null,
      applicationId: application?.id || null,
      application: publicApplication,
      access
    });
  } catch (error: any) {
    console.error('[durable-vendor-status]', error);
    return res.status(500).json({ success: false, error: 'SELLER_ACCESS_CHECK_ERROR' });
  }
}
