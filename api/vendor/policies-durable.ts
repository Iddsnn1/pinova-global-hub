import { createRequire } from 'module';
import path from 'path';

type ServerModule = {
  authenticateVendorRequest: (req: any) => Promise<any>;
  getDurableVendorApplication: (username: string) => Promise<any>;
  saveDurableVendorApplication: (application: any) => Promise<any>;
  durableVendorStorageEnabled: () => boolean;
  pstpAuditRepo: { appendLog: (entry: any) => Promise<any> | any };
};

let serverModule: ServerModule | null = null;
function getServerModule(): ServerModule {
  if (serverModule) return serverModule;
  const runtimeRequire = createRequire(path.resolve(process.cwd(), 'api/vendor/policies-durable.js'));
  const mod = runtimeRequire('../../dist/server.cjs');
  serverModule = (mod && typeof mod.authenticateVendorRequest === 'function' ? mod : mod?.default) as ServerModule;
  return serverModule;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const server = getServerModule();
    const user = await server.authenticateVendorRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    if (!server.durableVendorStorageEnabled()) {
      return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
    }

    const username = String(user.username).trim();
    const application = await server.getDurableVendorApplication(username);
    if (!application) return res.status(404).json({ success: false, error: 'VENDOR_APPLICATION_NOT_FOUND' });

    const body = req.body || {};
    if (body.pioneerUsername && String(body.pioneerUsername).trim().replace(/^@/, '').toLowerCase() !== username.replace(/^@/, '').toLowerCase()) {
      return res.status(403).json({ success: false, error: 'VENDOR_IDENTITY_MISMATCH' });
    }

    const input = body.policies && typeof body.policies === 'object' ? body.policies : {};
    const allowed = ['returnRefundPolicy', 'deliveryShippingPolicy', 'cancellationPolicy', 'warrantyTerms'];
    const updatedPolicies = { ...(application.policies || {}) };
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        if (typeof input[key] !== 'string' || input[key].length > 10000) {
          return res.status(400).json({ success: false, error: 'INVALID_POLICY_VALUE', field: key });
        }
        updatedPolicies[key] = input[key].trim();
      }
    }

    // Policy edits must not alter merchant review status or imply PSTP acceptance.
    const updated = { ...application, policies: updatedPolicies, updatedAt: new Date().toISOString() };
    await server.saveDurableVendorApplication(updated);
    await server.pstpAuditRepo.appendLog({
      orderId: application.id,
      actor: username,
      actorRole: 'seller',
      action: 'VENDOR_POLICIES_UPDATED',
      details: 'Merchant policy text updated; compliance status and PSTP acceptance were preserved.',
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: req.headers?.['user-agent'] || 'Pi Browser'
    });
    return res.status(200).json({ success: true, policies: updatedPolicies, application: updated });
  } catch (error: any) {
    console.error('[durable-vendor-policies]', error);
    return res.status(500).json({ success: false, error: 'VENDOR_POLICIES_UPDATE_FAILED' });
  }
}
