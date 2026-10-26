import {
  authenticateVendorRequest as authenticateRequest,
  getDurableVendorApplication,
  getDurableVendorApplicationByIdentity,
  durableVendorStorageEnabled
} from '../../dist/server.cjs';

function publicApplicationSummary(application: any) {
  if (!application) return null;
  // Never return KYC documents, private storage paths, or other sensitive fields
  // through the dashboard status endpoint.
  return {
    id: application.id || null,
    pioneerUsername: application.pioneerUsername || null,
    status: application.status || null,
    verificationStatus: application.verificationStatus || 'Unverified',
    sellerStatus: application.sellerStatus || 'Inactive',
    storeName: application.storeName || null,
    storeDescription: application.storeDescription || '',
    storeLogo: application.storeLogo || '',
    storeBanner: application.storeBanner || '',
    pstpAgreementAccepted: application.pstpAgreementAccepted === true,
    updatedAt: application.updatedAt || null
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

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

    // Match the same server-side identity resolution used by seller routes.
    // Never trust a username or UID supplied in the request body/query.
    const username = String(user.username).trim();
    let application = await getDurableVendorApplication(username);
    if (!application) {
      const uidCandidates = [user.piUid, user.uid, user.id]
        .map((value: unknown) => String(value || '').trim())
        .filter(Boolean);

      for (const uid of uidCandidates) {
        application = await getDurableVendorApplicationByIdentity(username, uid);
        if (application) break;
      }
    }

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

    return res.status(200).json({
      success: true,
      authorized: approved,
      status: application?.status || 'UNREGISTERED',
      sellerLifecycle: approved ? 'ACTIVE' : 'INACTIVE',
      verified: approved,
      pstpAuthorized: access.canReceivePstpOrders,
      storeName: application?.storeName || null,
      applicationId: application?.id || null,
      application: publicApplicationSummary(application),
      access
    });
  } catch (error: any) {
    console.error('[durable-vendor-status] Status lookup failed.');
    return res.status(500).json({ success: false, error: 'SELLER_ACCESS_CHECK_ERROR' });
  }
}
