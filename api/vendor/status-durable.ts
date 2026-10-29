import {
  authenticateVendorRequest as authenticateRequest,
  getDurableVendorApplication,
  getDurableVendorApplicationByIdentity,
  durableVendorStorageEnabled
} from '../../dist/server.cjs';

async function resolveAuthenticatedApplication(user: any): Promise<any | null> {
  const rawUsername = String(user?.username || '').trim();
  const normalizedUsername = rawUsername.replace(/^@/, '').toLowerCase();

  // The server bundle exports the Neon-backed durable vendor store. Use its
  // identity-aware lookup and avoid importing unbundled TypeScript at runtime.
  if (rawUsername) {
    const direct = await getDurableVendorApplication(rawUsername);
    if (direct) return direct;
  }

  // Only authenticated session identifiers are eligible for identity fallback.
  const uidCandidates = [user?.piUid, user?.uid, user?.id]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  for (const uid of uidCandidates) {
    const application = await getDurableVendorApplicationByIdentity('', uid);
    if (!application) continue;

    const storedUsername = String(application?.pioneerUsername || '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();
    const storedUid = String(application?.pioneerUid || '').trim();

    if ((normalizedUsername && storedUsername === normalizedUsername) ||
        (storedUid && uidCandidates.includes(storedUid))) {
      return application;
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
    // Keep the client response safe: never return raw database errors or credentials.
    // The structured fields let Preview diagnostics distinguish configuration,
    // authentication, and durable lookup failures without exposing secrets.
    const errorName = typeof error?.name === 'string' ? error.name.slice(0, 80) : 'UnknownError';
    const errorCode = typeof error?.code === 'string' && /^[A-Z0-9_]{1,64}$/.test(error.code)
      ? error.code
      : null;
    console.error('[durable-vendor-status]', {
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
        stage: 'durable_status_lookup',
        errorName,
        errorCode,
        durableStorageConfigured: durableVendorStorageEnabled(),
        deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
        deploymentBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
        requestId: req.headers?.['x-vercel-id'] || null
      }
    });
  }
}
