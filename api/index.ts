import type { IncomingMessage, ServerResponse } from 'http';
import { createRequire } from 'module';
import path from 'path';
import crypto from 'crypto';
import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, durableVendorStorageEnabled, ProductRepository } from '../dist/server.cjs';

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

async function handleDurableProducts(req: any, res: any): Promise<boolean> {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (pathname !== '/api/products' && pathname !== '/api/v1/products' && !pathname.startsWith('/api/v1/products/')) return false;

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
  const merchant = await getDurableVendorApplication(user.username);
  const canSell = merchant?.status === 'APPROVED' && merchant.verificationStatus === 'Verified' && merchant.sellerStatus === 'Active';
  if (!canSell) return res.status(403).json({ ok: false, error: 'MERCHANT_SELLER_ACCESS_REQUIRED' });

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
    const { authService, VendorApplicationRepository } = getServerDependencies();
    const user = await authService.authenticateToken(token);
    if (!user?.username) {
      res.statusCode = 401;
      res.end(JSON.stringify({ success: false, error: 'INVALID_SESSION' }));
      return true;
    }

    const vendorApplicationRepo = new VendorApplicationRepository();
    const application = vendorApplicationRepo.findByUsername(user.username);
    const access = vendorApplicationRepo.getMerchantAccess(user.username);
    const status = access.applicationStatus || 'UNREGISTERED';

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      status,
      verified: access.verificationStatus === 'Verified',
      pstpAuthorized: access.canReceivePstpOrders,
      sellerLifecycle: access.sellerStatus === 'Active' ? 'ACTIVE' : 'INACTIVE',
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
let cachedDependencies: any = null;

function getServerDependencies() {
  if (cachedDependencies) return cachedDependencies;
  const mod = getApp();
  cachedDependencies = {
    authService: mod.authService,
    VendorApplicationRepository: mod.VendorApplicationRepository
  };
  if (!cachedDependencies.authService || !cachedDependencies.VendorApplicationRepository) {
    throw new Error('Bundled server dependencies are unavailable');
  }
  return cachedDependencies;
}

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