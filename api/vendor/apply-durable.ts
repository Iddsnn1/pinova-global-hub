import { createRequire } from 'module';
import path from 'path';

type ServerModule = {
  authenticateVendorRequest: (req: any) => Promise<any>;
  getDurableVendorApplication: (username: string) => Promise<any>;
  saveDurableVendorApplication: (application: any) => Promise<any>;
  durableVendorStorageEnabled: () => boolean;
  vendorDocumentStorageEnabled: () => boolean;
  getVendorDocument: (key: string) => Promise<{ body: Uint8Array; contentType: string } | null>;
  pstpAuditRepo: { appendLog: (entry: any) => Promise<any> | any };
};

let serverModule: ServerModule | null = null;

function getServerModule(): ServerModule {
  if (serverModule) return serverModule;
  const runtimeRequire = createRequire(path.resolve(process.cwd(), 'api/vendor/apply-durable.js'));
  const mod = runtimeRequire('../../dist/server.cjs');
  // Keep named exports when the CommonJS bundle exposes durable services alongside
  // its default Express app. Selecting mod.default unconditionally drops them.
  serverModule = (mod && (
    typeof mod.durableVendorStorageEnabled === 'function' ||
    typeof mod.authenticateVendorRequest === 'function'
  ) ? mod : mod?.default) as ServerModule;
  return serverModule;
}

const authenticateRequest = (req: any) => getServerModule().authenticateVendorRequest(req);
const getDurableVendorApplication = (username: string) => getServerModule().getDurableVendorApplication(username);
const saveDurableVendorApplication = (application: any) => getServerModule().saveDurableVendorApplication(application);
const durableVendorStorageEnabled = () => getServerModule().durableVendorStorageEnabled();
const pstpAuditRepo = {
  appendLog: (entry: any) => getServerModule().pstpAuditRepo.appendLog(entry)
};

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

    const storeName = String(body.storeName || '').trim();
    const contactEmail = String(body.contactEmail || '').trim();
    const country = String(body.country || '').trim();
    const categoriesToSell = Array.isArray(body.categoriesToSell)
      ? body.categoriesToSell.map((value: any) => String(value || '').trim()).filter(Boolean)
      : [];
    const policies = body.policies && typeof body.policies === 'object' ? body.policies : {};
    const returnRefundPolicy = String(policies.returnRefundPolicy || '').trim();
    const deliveryShippingPolicy = String(policies.deliveryShippingPolicy || '').trim();
    const pstpAgreementAccepted = body.pstpAgreementAccepted === true;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);

    const missingFields: string[] = [];
    if (!storeName) missingFields.push('storeName');
    if (!contactEmail) missingFields.push('contactEmail');
    else if (!emailValid) missingFields.push('contactEmailValid');
    if (!country) missingFields.push('country');
    if (!categoriesToSell.length) missingFields.push('category');
    if (!returnRefundPolicy) missingFields.push('returnRefundPolicy');
    if (!deliveryShippingPolicy) missingFields.push('deliveryShippingPolicy');
    if (!pstpAgreementAccepted) missingFields.push('pstpAgreementAccepted');

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        error: 'REQUIRED_MERCHANT_PROFILE_FIELDS',
        message: 'Store name, contact email, country, category, return/shipping policies, and PSTP agreement are required.',
        missingFields
      });
    }

    const submittedDocuments = Array.isArray(body.documents) ? body.documents : [];
    if (!submittedDocuments.length) {
      return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_REQUIRED', message: 'A securely uploaded verification document is required.' });
    }
    if (!getServerModule().vendorDocumentStorageEnabled()) {
      return res.status(503).json({ success: false, error: 'VENDOR_DOCUMENT_STORAGE_NOT_CONFIGURED' });
    }

    // Never trust a client-supplied private:// prefix alone. Confirm both objects
    // exist and the server-written metadata binds the document to this Pioneer.
    const normalizeIdentity = (value: unknown) => String(value || '').trim().replace(/^@/, '').toLowerCase();
    const documents: any[] = [];
    for (const submitted of submittedDocuments) {
      const reference = String(submitted?.fileUrl || '').trim();
      const match = reference.match(/^private:\/\/vendor-documents\/([a-f0-9]{32})$/);
      if (!match) {
        return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_REQUIRED', message: 'Public URLs and external references are prohibited.' });
      }
      const documentId = match[1];
      const metadataObject = await getServerModule().getVendorDocument(`vendor-documents/${documentId}.meta.json`);
      if (!metadataObject) return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_NOT_FOUND' });
      let metadata: any;
      try {
        metadata = JSON.parse(Buffer.from(metadataObject.body).toString('utf8'));
      } catch {
        return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_METADATA_INVALID' });
      }
      if (metadata?.id !== documentId || normalizeIdentity(metadata?.owner) !== normalizeIdentity(effectiveUsername)) {
        return res.status(403).json({ success: false, error: 'VERIFICATION_DOCUMENT_OWNER_MISMATCH' });
      }
      const encryptedObject = await getServerModule().getVendorDocument(`vendor-documents/${documentId}.enc`);
      if (!encryptedObject || encryptedObject.body.byteLength === 0) {
        return res.status(400).json({ success: false, error: 'VERIFICATION_DOCUMENT_CIPHERTEXT_MISSING' });
      }
      documents.push({
        id: documentId,
        docType: String(metadata.documentType || submitted.docType || 'identity_proof'),
        fileName: String(metadata.originalFilename || submitted.fileName || 'verification-document'),
        fileUrl: reference,
        mimeType: String(metadata.mimeType || 'application/octet-stream'),
        uploadedAt: String(metadata.uploadedAt || new Date().toISOString()),
        encrypted: true,
        storage: 'private'
      });
    }

    const existing = await getDurableVendorApplication(effectiveUsername);
    // Submission is NEVER an approval action. Every new application or resubmission
    // must enter the server-authoritative Merchant Compliance Queue. Only the
    // privileged compliance review endpoint may transition a merchant to APPROVED.
    const status = 'PENDING_REVIEW';
    const now = new Date().toISOString();
    const application = {
      ...(existing || {}),
      // Explicit merchant-editable allowlist. Never persist arbitrary client fields
      // such as review state, approval flags, role metadata, or server-owned IDs.
      storeName,
      storeDescription: typeof body.storeDescription === 'string' ? body.storeDescription.trim() : (existing?.storeDescription || ''),
      sellerType: typeof body.sellerType === 'string' ? body.sellerType.trim() : (existing?.sellerType || ''),
      contactEmail,
      contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone.trim() : (existing?.contactPhone || ''),
      country,
      countryCode: typeof body.countryCode === 'string' ? body.countryCode.trim().toUpperCase() : (existing?.countryCode || ''),
      stateRegion: typeof body.stateRegion === 'string' ? body.stateRegion.trim() : (existing?.stateRegion || ''),
      city: typeof body.city === 'string' ? body.city.trim() : (existing?.city || ''),
      storeLogo: typeof body.storeLogo === 'string' ? body.storeLogo : (existing?.storeLogo || ''),
      storeBanner: typeof body.storeBanner === 'string' ? body.storeBanner : (existing?.storeBanner || ''),
      categoriesToSell,
      documents,
      policies: {
        ...(existing?.policies || {}),
        returnRefundPolicy,
        deliveryShippingPolicy,
        ...(typeof policies.cancellationPolicy === 'string' ? { cancellationPolicy: policies.cancellationPolicy.trim() } : {}),
        ...(typeof policies.warrantyTerms === 'string' ? { warrantyTerms: policies.warrantyTerms.trim() } : {})
      },
      pstpAgreementAccepted,
      id: existing?.id || `VAPP-${String(body.countryCode || 'GL').slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-8)}`,
      pioneerUsername: effectiveUsername,
      // Persist the verified Pi UID, not the per-instance internal user record ID.
      // Never accept a client-supplied UID as the merchant identity.
      pioneerUid: user.piUid || user.id,
      status,
      verificationStatus: 'Pending Verification',
      sellerStatus: 'Probation',
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    const saved = await saveDurableVendorApplication(application);
    await pstpAuditRepo.appendLog({
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
