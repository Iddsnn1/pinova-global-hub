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
  const runtimeRequire = createRequire(path.resolve(process.cwd(), 'api/vendor/document-link-durable.js'));
  const mod = runtimeRequire('../../dist/server.cjs');
  serverModule = (mod && typeof mod.authenticateVendorRequest === 'function' ? mod : mod?.default) as ServerModule;
  return serverModule;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  try {
    const server = getServerModule();
    const user = await server.authenticateVendorRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    if (!server.durableVendorStorageEnabled() || !server.vendorDocumentStorageEnabled()) {
      return res.status(503).json({ success: false, error: 'DURABLE_DOCUMENT_STORAGE_UNAVAILABLE' });
    }

    const username = String(user.username).trim();
    const reference = String(req.body?.reference || '').trim();
    const match = reference.match(/^private:\/\/vendor-documents\/([a-f0-9]{32})$/);
    if (!match) return res.status(400).json({ success: false, error: 'INVALID_PRIVATE_DOCUMENT_REFERENCE' });

    const id = match[1];
    const metadataObject = await server.getVendorDocument(`vendor-documents/${id}.meta.json`);
    if (!metadataObject) return res.status(404).json({ success: false, error: 'DOCUMENT_METADATA_NOT_FOUND' });
    let metadata: any;
    try {
      metadata = JSON.parse(Buffer.from(metadataObject.body).toString('utf8'));
    } catch {
      return res.status(422).json({ success: false, error: 'DOCUMENT_METADATA_INVALID' });
    }

    const normalize = (value: unknown) => String(value || '').trim().replace(/^@/, '').toLowerCase();
    if (!metadata || metadata.id !== id || normalize(metadata.owner) !== normalize(username)) {
      return res.status(403).json({ success: false, error: 'DOCUMENT_OWNER_MISMATCH' });
    }
    const encryptedObject = await server.getVendorDocument(`vendor-documents/${id}.enc`);
    if (!encryptedObject || encryptedObject.body.byteLength === 0) {
      return res.status(404).json({ success: false, error: 'ENCRYPTED_DOCUMENT_NOT_FOUND' });
    }

    const application = await server.getDurableVendorApplication(username);
    if (!application) {
      return res.status(409).json({
        success: false,
        error: 'VENDOR_APPLICATION_NOT_FOUND',
        message: 'Complete and save your merchant profile before linking verification documents.'
      });
    }

    const documents = Array.isArray(application.documents) ? application.documents : [];
    const alreadyLinked = documents.some((doc: any) => doc?.fileUrl === reference);
    const document = {
      id,
      fileUrl: reference,
      documentType: String(metadata.documentType || 'verification'),
      fileName: String(metadata.originalFilename || 'verification-document'),
      mimeType: String(metadata.mimeType || 'application/octet-stream'),
      uploadedAt: String(metadata.uploadedAt || new Date().toISOString()),
      encrypted: true,
      storage: 'private'
    };
    const updated = alreadyLinked ? application : {
      ...application,
      documents: [...documents, document],
      updatedAt: new Date().toISOString()
    };

    if (!alreadyLinked) {
      await server.saveDurableVendorApplication(updated);
      await server.pstpAuditRepo.appendLog({
        orderId: application.id,
        actor: username,
        actorRole: 'seller',
        action: 'VENDOR_KYC_DOCUMENT_LINKED',
        details: `Private encrypted KYC document ${id} linked to the authenticated merchant application.`,
        ipAddress: req.ip || '127.0.0.1',
        deviceInfo: req.headers?.['user-agent'] || 'Pi Browser'
      });
    }

    return res.status(200).json({ success: true, linked: true, application: updated });
  } catch (error: any) {
    console.error('[durable-vendor-document-link]', error);
    return res.status(500).json({ success: false, error: 'DOCUMENT_LINK_FAILED', message: 'Unable to link the encrypted verification document.' });
  }
}
