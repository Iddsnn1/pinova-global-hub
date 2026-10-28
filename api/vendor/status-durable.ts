import { authenticateVendorRequest as authenticateRequest } from '../../dist/server.cjs';
import {
  getDurableVendorApplication,
  getDurableVendorApplicationByIdentity,
  durableVendorStorageEnabled
} from '../../src/server/services/DurableVendorApplicationStore';

async function resolveAuthenticatedApplication(user: any): Promise<any | null> {
  const rawUsername = String(user?.username || '').trim();
  const normalizedUsername = rawUsername.replace(/^@/, '').toLowerCase();

  // Read vendor application records from the Neon-backed service directly.
  // Do not use the similarly named legacy Blob helpers exported by dist/server.cjs.
  if (rawUsername) {
    const direct = await getDurableVendorApplication(rawUsername);
    if (direct) return direct;
  }

  // Only use identifiers from the authenticated session; never trust client-supplied
  // owner/username headers as an identity fallback.
  const uidCandidates = [user?.piUid, user?.uid, user?.id]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  for (const uid of uidCandidates) {
    const byIdentity = await getDurableVendorApplicationByIdentity('', uid);
    if (byIdentity) {
      const storedUsername = String(byIdentity?.pioneerUsername || '')
        .trim()
        .replace(/^@/, '')
        .toLowerCase();
      const storedUid = String(byIdentity?.pioneerUid || '').trim();
      if ((normalizedUsername && storedUsername === normalizedUsername) ||
          (storedUid && uidCandidates.includes(storedUid))) {
        return byIdentity;
      }
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  try {
    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authenticated Pioneer session required.' });
    if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });

    const application = await resolveAuthenticatedApplication(user);
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
