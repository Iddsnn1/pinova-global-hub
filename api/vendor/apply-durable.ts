import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, saveDurableVendorApplication, durableVendorStorageEnabled, pstpAuditRepo } from '../../dist/server.cjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE', message: 'Merchant storage is not configured.' });

  try {
    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authenticated Pioneer session required.' });

    const body = req.body || {};
    const effectiveUsername = String(user.username).trim();
    if (body.pioneerUsername && String(body.pioneerUsername).trim().toLowerCase() !== effectiveUsername.toLowerCase()) {
      return res.status(403).json({ success: false, error: 'VENDOR_IDENTITY_MISMATCH' });
    }

    const documents = Array.isArray(body.documents) ? body.documents : [];
    if (!documents.length) return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_REQUIRED', message: 'A securely uploaded verification document is required.' });
    if (documents.some((d: any) => !String(d?.fileUrl || '').startsWith('private://vendor-documents/'))) {
      return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_REQUIRED', message: 'Public URLs and external references are prohibited.' });
    }

    const existing = await getDurableVendorApplication(effectiveUsername);
    const status = existing?.status === 'APPROVED' ? 'APPROVED' : 'PENDING_REVIEW';
    const now = new Date().toISOString();
    const application = {
      ...(existing || {}),
      ...body,
      id: existing?.id || `VAPP-${String(body.countryCode || 'GL').slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-8)}`,
      pioneerUsername: effectiveUsername,
      pioneerUid: user.id || body.pioneerUid,
      documents,
      status,
      verificationStatus: status === 'APPROVED' ? 'Verified' : 'Pending Verification',
      sellerStatus: status === 'APPROVED' ? 'Active' : 'Probation',
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    const saved = await saveDurableVendorApplication(application);
    pstpAuditRepo.appendLog({
      orderId: saved.id,
      actor: effectiveUsername,
      actorRole: 'seller',
      action: 'VENDOR_APPLICATION_SUBMITTED',
      details: `Vendor application submitted for store "${saved.storeName || ''}".`,
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: req.headers?.['user-agent'] || 'Pi Browser'
    });

    return res.status(200).json({ success: true, message: 'Vendor application submitted for compliance review.', application: saved });
  } catch (error: any) {
    console.error('[durable-vendor-apply]', error);
    return res.status(500).json({ success: false, error: 'VENDOR_APPLY_EXCEPTION', message: error?.message || 'Vendor application failed.' });
  }
}
