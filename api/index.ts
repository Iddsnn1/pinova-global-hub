import type { IncomingMessage, ServerResponse } from 'http';
import { createRequire } from 'module';
import { authService } from '../src/server/auth';
import { vendorApplicationRepo } from '../src/server/db';
import { requireVendorPstpSellerAccess, requireVendorSellerAccess } from '../src/server/services/VendorAccessService';

const require = createRequire(import.meta.url);

function getApp() {
  try {
    if (process.env.VERCEL === '1') process.env.PINOVA_DATA_DIR = '/tmp/pinova_data';
    const mod = require('../dist/server.cjs');
    return mod.default || mod;
  } catch (err1: any) {
    try {
      const mod = require('../server');
      return mod.default || mod;
    } catch (err2: any) {
      console.error('[Vercel Handler] Error loading server module:', { err1: err1?.message, err2: err2?.message });
      throw new Error(`Failed to load server module: ${err1?.message || String(err1)}`);
    }
  }
}

function getBearerToken(req: IncomingMessage): string | null {
  const raw = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw.trim();
}

function normalizeRewrittenPath(req: IncomingMessage): void {
  if (!req.url) return;
  try {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const pathQuery = parsedUrl.searchParams.get('__path');
    if (!pathQuery) return;

    let cleanPath = pathQuery;
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (!cleanPath.startsWith('/api/') && cleanPath !== '/api') cleanPath = '/api' + cleanPath;
    parsedUrl.searchParams.delete('__path');
    const searchStr = parsedUrl.searchParams.toString();
    req.url = cleanPath + (searchStr ? '?' + searchStr : '');
  } catch {
    // Leave the original request URL intact; the bundled Express app will handle it.
  }
}

function isVendorSellerPath(reqUrl: string): boolean {
  try {
    const url = new URL(reqUrl, 'http://localhost');
    return ['/api/vendor/seller/access','/api/vendor/seller/authorize','/api/vendor/seller/authorize-pstp','/api/v1/vendor/seller/access','/api/v1/vendor/seller/authorize','/api/v1/vendor/seller/authorize-pstp'].includes(url.pathname);
  } catch { return false; }
}

async function handleVendorSellerAuthorization(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  if (!isVendorSellerPath(req.url || '')) return false;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return true; }
  const token = getBearerToken(req);
  if (!token) { res.statusCode = 401; res.end(JSON.stringify({ success:false, authorized:false, error:'AUTHENTICATION_REQUIRED' })); return true; }
  const user = await authService.authenticateToken(token);
  if (!user?.username) { res.statusCode = 401; res.end(JSON.stringify({ success:false, authorized:false, error:'INVALID_SESSION' })); return true; }
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  try {
    if (pathname.endsWith('/access')) {
      const access = vendorApplicationRepo.getMerchantAccess(user.username);
      res.statusCode = 200; res.end(JSON.stringify({ success:true, access })); return true;
    }
    const access = pathname.endsWith('/authorize-pstp') ? requireVendorPstpSellerAccess(vendorApplicationRepo, user.username) : requireVendorSellerAccess(vendorApplicationRepo, user.username);
    res.statusCode = 200; res.end(JSON.stringify({ success:true, authorized:true, access }));
  } catch (error: any) {
    res.statusCode = error?.statusCode === 403 ? 403 : 500;
    res.end(JSON.stringify({ success:false, authorized:false, error:error?.code || 'SELLER_ACCESS_DENIED', message:error?.message || 'Seller access denied.' }));
  }
  return true;
}

let cachedApp: any = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const originalUrl = req.url || '';
  const decodedUrl = decodeURIComponent(originalUrl).toLowerCase();

  if (decodedUrl.includes('validation-key')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end('8a6a4b885d34141bb2512da532760394d83de4673574b82de61c4a0895e00cb11dacc69b4618c84393a5518a75ca356597e3df7ed67a9d884baa7b8edd3f7cca');
    return;
  }

  // Vercel rewrites /api/* to /api/index?__path=/*. Normalize first so every
  // API route sees the same canonical path. Branding uploads are deliberately
  // NOT handled here; the bundled Express server is the single authoritative
  // branding route and applies its raw-body, validation, auth, and Blob logic.
  normalizeRewrittenPath(req);

  if (await handleVendorSellerAuthorization(req, res)) return;

  const reqUrl = req.url || '';
  if (reqUrl === '/api/health' || reqUrl === '/health' || reqUrl.startsWith('/api/health?') || reqUrl.startsWith('/health?')) {
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Access-Control-Allow-Origin', '*'); res.statusCode = 200; res.end(JSON.stringify({ status:'ok', runtime:'vercel' })); return;
  }

  if (reqUrl === '/api/debug/runtime' || reqUrl === '/debug/runtime' || reqUrl.startsWith('/api/debug/runtime?') || reqUrl.startsWith('/debug/runtime?')) {
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Access-Control-Allow-Origin', '*'); res.statusCode = 200; res.end(JSON.stringify({ ok:true, runtime:'vercel', nodeVersion:process.version, requestUrl:reqUrl })); return;
  }

  try {
    if (!cachedApp) cachedApp = getApp();
    return cachedApp(req, res);
  } catch (err: any) {
    console.error('[Vercel Handler] Request failed', { name:err?.name, code:err?.code, message:err?.message });
    res.setHeader('Content-Type', 'application/json'); res.setHeader('Access-Control-Allow-Origin', '*'); res.statusCode = 500;
    res.end(JSON.stringify({ success:false, error:'SERVER_HANDLER_EXCEPTION', message:'Internal server error.' }));
  }
}
