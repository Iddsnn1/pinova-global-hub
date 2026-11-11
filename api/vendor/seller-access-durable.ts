import { createRequire } from 'module';
import path from 'path';

type ServerModule = {
  authenticateVendorRequest: (req: any) => Promise<any>;
  getDurableVendorApplication: (username: string) => Promise<any>;
  getDurableVendorApplicationByIdentity: (username: string, pioneerUid?: string | null) => Promise<any>;
  durableVendorStorageEnabled: () => boolean;
};

let serverModule: ServerModule | null = null;

function getServerModule(): ServerModule {
  if (serverModule) return serverModule;
  const runtimeRequire = createRequire(path.resolve(process.cwd(), 'api/vendor/seller-access-durable.js'));
  const mod = runtimeRequire('../../dist/server.cjs');
  // Preserve named exports when the bundle exposes them alongside its default app.
  serverModule = (mod && (
    typeof mod.durableVendorStorageEnabled === 'function' ||
    typeof mod.authenticateVendorRequest === 'function'
  ) ? mod : mod?.default) as ServerModule;
  return serverModule;
}

async function resolveAuthenticatedApplication(user: any): Promise<any | null> {
  const rawUsername = String(user?.username || '').trim();
  const normalizedUsername = rawUsername.replace(/^@/, '').toLowerCase();

  if (rawUsername) {
    const direct = await getServerModule().getDurableVendorApplication(rawUsername);
    if (direct) return direct;
  }

  // Only server-authenticated Pioneer identifiers may be used as identity fallbacks.
  const uidCandidates = [user?.piUid, user?.uid, user?.id]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  for (const uid of uidCandidates) {
    const application = await getServerModule().getDurableVendorApplicationByIdentity('', uid);
    if (!application) continue;

    const storedUsername = String(application?.pioneerUsername || '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();
    const storedUid = String(application?.pioneerUid || '').trim();

    if (
      (normalizedUsername && storedUsername === normalizedUsername) ||
      (storedUid && uidCandidates.includes(storedUid))
    ) {
      return application;
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const server = getServerModule();
    const user = await server.authenticateVendorRequest(req);
    if (!user?.username) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authenticated Pioneer session required.'
      });
    }
    if (!server.durableVendorStorageEnabled()) {
      return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
    }

    const application = await resolveAuthenticatedApplication(user);
    const approved = application?.status === 'APPROVED' &&
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
      // Return only the authenticated merchant's own application for Seller Studio hydration.
      application: application || null,
      access
    });
  } catch (error: any) {
    const errorName = typeof error?.name === 'string' ? error.name.slice(0, 80) : 'UnknownError';
    const errorCode = typeof error?.code === 'string' && /^[A-Z0-9_]{1,64}$/.test(error.code)
      ? error.code
      : null;
    console.error('[durable-seller-access]', {
      name: errorName,
      code: errorCode,
      requestId: req.headers?.['x-vercel-id'] || null,
      deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
      deploymentBranch: process.env.VERCEL_GIT_COMMIT_REF || null
    });
    return res.status(500).json({
      success: false,
      error: 'SELLER_ACCESS_CHECK_ERROR',
      diagnostic: {
        stage: 'durable_seller_access_lookup',
        errorName,
        errorCode,
        durableStorageConfigured: (() => {
          try { return getServerModule().durableVendorStorageEnabled(); } catch { return false; }
        })(),
        deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
        deploymentBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
        requestId: req.headers?.['x-vercel-id'] || null
      }
    });
  }
}
