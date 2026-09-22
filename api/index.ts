import type { IncomingMessage, ServerResponse } from 'http';
import { createRequire } from 'module';
import path from 'path';
import crypto from 'crypto';
import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, listDurableVendorApplications, durableVendorStorageEnabled, ProductRepository } from '../dist/server.cjs';

// Ensure serverless environment flag is set before loading server module
process.env.VERCEL = process.env.VERCEL || '1';

declare const require: any;

const req = typeof require === 'function'
  ? require
  : createRequire(path.resolve(process.cwd(), 'api/index.js'));

function getApp() {
  try {
    const mod = req('../dist/server.cjs');
    return mod.default || mod;
  } catch (err1: any) {
    try {
      const mod = req(path.resolve(process.cwd(), 'dist/server.cjs'));
      return mod.default || mod;
    } catch (err2: any) {
      try {
        const mod = req('../server');
        return mod.default || mod;
      } catch (err3: any) {
        console.error('[Vercel Handler] Error loading server module:', { err1: err1?.message, err2: err2?.message, err3: err3?.message });
        throw new Error(`Failed to load server module: ${err1?.message || String(err1)}`);
      }
    }
  }
}

function getBearerToken(req: IncomingMessage): string | null {
  const raw = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw.trim();
}

async function resolveApprovedMerchant(username: string, pioneerUid?: string | string[] | null): Promise<any | null> {
  const direct = await getDurableVendorApplication(username);
  if (direct) return direct;

  const target = String(username || '').trim().replace(/^@/, '').toLowerCase();
  const uidCandidates = (Array.isArray(pioneerUid) ? pioneerUid : [pioneerUid])
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  if (!target && !uidCandidates.length) return null;

  const entries = await listDurableVendorApplications();
  return entries.find((application: any) => {
    const storedUsername = String(application?.pioneerUsername || '').trim().replace(/^@/, '').toLowerCase();
    const storedUid = String(application?.pioneerUid || '').trim();
    return (target && storedUsername === target) || (storedUid && uidCandidates.includes(storedUid));
  }) || null;
}

async function handleDurableProducts(req: any, res: any): Promise<boolean> {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (pathname !== '/api/products' && pathname !== '/api/v1/products' && !pathname.startsWith('/api/v1/products/') && !req.url?.includes('__path=/products')) return false;

  const repo = new ProductRepository();
  if (req.method === 'GET') {
    const parsed = new URL(req.url || '/', 'http://localhost');
    const q = parsed.searchParams.get('q') || '';
    const category = parsed.searchParams.get('category') || undefined;
    const products = q ? repo.search(q, { activeOnly: true, category }) : repo.getAll({ activeOnly: true, category });
    return res.json({ ok: true, products });
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  if (!durableVendorStorageEnabled()) return res.status(503).json({ ok: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });
  const user = await authenticateRequest(req);
  if (!user?.username) return res.status(401).json({ ok: false, error: 'INVALID_SESSION' });
  // Seller authorization must use the same durable compliance record that the
  // Platform Administration review queue updates. Do not use the ephemeral
  // serverless StorageEngine as the source of merchant activation state.
  // Portable sessions may expose either the local auth user id or the
  // authoritative Pi UID. The durable application can legitimately contain
  // either identity depending on when the application was created.
  const durableMerchant = await resolveApprovedMerchant(user.username, [user.piUid, user.id]);
  const canSell = durableMerchant?.status === 'APPROVED'
    && durableMerchant?.verificationStatus === 'Verified'
    && durableMerchant?.sellerStatus === 'Active';
  if (!canSell) {
    console.warn('[seller/access] durable merchant access denied', {
      username: String(user.username || '').trim().replace(/^@/, '').toLowerCase(),
      hasPiUid: Boolean(user.piUid),
      hasLocalUserId: Boolean(user.id),
      matchedMerchant: Boolean(durableMerchant),
      merchantStatus: durableMerchant?.status || null,
      verificationStatus: durableMerchant?.verificationStatus || null,
      sellerStatus: durableMerchant?.sellerStatus || null
    });
    return res.status(403).json({ ok: false, error: 'MERCHANT_SELLER_ACCESS_REQUIRED' });
  }

  const body = req.body || {};
  const stock = Number.isInteger(body.stock) && body.stock >= 0 ? body.stock : 0;
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const pricePi = Number(body.pricePi ?? 0);
  if (!title || !description || !Number.isFinite(pricePi) || pricePi < 0) return res.status(400).json({ ok: false, error: 'INVALID_PRODUCT_INPUT' });

  const product = {
    id: `prd_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`, title, description, pricePi,
    category: body.category || 'physical', subcategory: String(body.subcategory || ''),
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : [], stock, rating: 0, reviewsCount: 0,
    sellerId: String(user.username).trim(), sellerName: String(user.username).trim(), sellerVerified: true,
    features: Array.isArray(body.features) ? body.features.filter(Boolean) : [], specs: body.specs,
    productType: body.productType, fulfillmentType: body.fulfillmentType,
    availabilityStatus: body.availabilityStatus || (stock > 0 ? 'in_stock' : 'out_of_stock'),
    tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [], isActive: false, moderationStatus: 'PENDING_REVIEW'
  };
  const saved = repo.save(product as any);
  return res.status(201).json({ ok: true, product: saved });
}

async function handleVendorStatus(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (pathname !== '/api/vendor/status' && pathname !== '/vendor/status') return false;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Pioneer-Username');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED' }));
    return true;
  }

  const token = getBearerToken(req);
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ success: false, error: 'AUTHENTICATION_REQUIRED' }));
    return true;
  }

  try {
    const user = await authenticateRequest(req as any);
    if (!user?.username) {
      res.statusCode = 401;
      res.end(JSON.stringify({ success: false, error: 'INVALID_SESSION' }));
      return true;
    }

    // Legacy /api/vendor/status must never read the ephemeral VendorApplicationRepository.
    // Vercel production normally rewrites this route to the durable handler, but this
    // fallback is intentionally kept aligned with the same durable compliance source
    // so routing changes cannot resurrect a stale approval/status authority.
    const application = await getDurableVendorApplication(user.username);
    const status = application?.status || 'UNREGISTERED';
    const verified = application?.verificationStatus === 'Verified';
    const sellerActive = application?.sellerStatus === 'Active';

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      status,
      verified,
      pstpAuthorized: verified && sellerActive && status === 'APPROVED',
      sellerLifecycle: sellerActive && status === 'APPROVED' ? 'ACTIVE' : 'INACTIVE',
      storeName: application?.storeName || null,
      application: application ? {
        id: application.id,
        storeName: application.storeName,
        storeDescription: application.storeDescription,
        storeLogo: application.storeLogo || application.logoUrl || '',
        storeBanner: application.storeBanner || application.bannerUrl || '',
        status: application.status,
        verificationStatus: application.verificationStatus,
        sellerStatus: application.sellerStatus,
        pstpAgreementAccepted: application.pstpAgreementAccepted
      } : null
    }));
  } catch (error: any) {
    console.error('[vendor/status] isolated handler failed', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: 'VENDOR_STATUS_UNAVAILABLE' }));
  }

  return true;
}

let cachedApp: any = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const reqUrl = req.url || '';

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Key, X-Idempotency-Key, Idempotency-Key, X-Branding-Type, X-Asset-Type, X-Filename, X-Pioneer-Username, X-Username, Range');
    res.statusCode = 200;
    res.end();
    return;
  }

  const rawUrl = req.url || '';
  const decodedUrl = decodeURIComponent(rawUrl).toLowerCase();

  if (decodedUrl.includes('validation-key')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end('8a6a4b885d34141bb2512da532760394d83de4673574b82de61c4a0895e00cb11dacc69b4618c84393a5518a75ca356597e3df7ed67a9d884baa7b8edd3f7cca');
    return;
  }

  if (await handleVendorStatus(req, res)) return;

  if (
    reqUrl === '/api/health' ||
    reqUrl === '/health' ||
    reqUrl.startsWith('/api/health?') ||
    reqUrl.startsWith('/health?') ||
    reqUrl.includes('__path=/health') ||
    reqUrl.includes('__path=%2Fhealth')
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok', runtime: 'vercel' }));
    return;
  }

  if (
    reqUrl === '/api/debug/runtime' ||
    reqUrl === '/debug/runtime' ||
    reqUrl.startsWith('/api/debug/runtime?') ||
    reqUrl.startsWith('/debug/runtime?') ||
    reqUrl.includes('__path=/debug/runtime') ||
    reqUrl.includes('__path=%2Fdebug%2Fruntime')
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, runtime: 'vercel', nodeVersion: process.version, requestUrl: reqUrl }));
    return;
  }

  if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const pathQuery = parsedUrl.searchParams.get('__path');
      if (pathQuery) {
        let cleanPath = pathQuery;
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        if (!cleanPath.startsWith('/api/') && cleanPath !== '/api') cleanPath = '/api' + cleanPath;
        parsedUrl.searchParams.delete('__path');
        const searchStr = parsedUrl.searchParams.toString();
        req.url = cleanPath + (searchStr ? '?' + searchStr : '');
      }
    } catch (e) {
      // ignore parse error
    }
  }

  try {
    if (!cachedApp) cachedApp = getApp();
    return cachedApp(req, res);
  } catch (err: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: 'SERVER_HANDLER_EXCEPTION', message: 'An unexpected internal server error occurred.' }));
  }
}