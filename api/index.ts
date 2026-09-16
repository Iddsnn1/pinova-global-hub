import type { IncomingMessage, ServerResponse } from 'http';
import { createRequire } from 'module';
import { randomBytes } from 'crypto';
import { authService } from '../src/server/auth';
import { vendorApplicationRepo } from '../src/server/db';
import { requireVendorPstpSellerAccess, requireVendorSellerAccess } from '../src/server/services/VendorAccessService';

const require = createRequire(import.meta.url);
const MAX_BRANDING_BYTES = 5 * 1024 * 1024;

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

function isVendorBrandingPath(reqUrl: string): boolean {
  try {
    const url = new URL(reqUrl, 'http://localhost');
    return ['/api/vendor/branding-upload','/api/v1/vendor/branding-upload'].includes(url.pathname);
  } catch { return false; }
}

function validateBrandingImageSignature(body: Buffer, mime: string): boolean {
  if (mime === 'image/jpeg') return body.length >= 3 && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff;
  if (mime === 'image/png') return body.length >= 8 && body.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if (mime === 'image/webp') return body.length >= 12 && body.subarray(0, 4).toString('ascii') === 'RIFF' && body.subarray(8, 12).toString('ascii') === 'WEBP';
  return false;
}

async function readRawRequestBody(req: IncomingMessage): Promise<Buffer> {
  const prebuffered = (req as any).body;
  if (Buffer.isBuffer(prebuffered)) return prebuffered;
  if (prebuffered instanceof Uint8Array) return Buffer.from(prebuffered);
  if (typeof prebuffered === 'string') return Buffer.from(prebuffered);

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req as any) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BRANDING_BYTES) {
      const error: any = new Error('Branding image exceeds maximum allowed size of 5 MB.');
      error.code = 'FILE_TOO_LARGE';
      throw error;
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks, total);
}

async function handleVendorBrandingUpload(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  if (!isVendorBrandingPath(req.url || '')) return false;

  console.info('[Vendor Branding Vercel] Request reached branding handler', { method: req.method });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Branding-Type, X-Filename');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return true; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ success:false, error:'METHOD_NOT_ALLOWED' })); return true; }

  try {
    const token = getBearerToken(req);
    if (!token) {
      console.info('[Vendor Branding Vercel] Authentication', { usernamePresent: false });
      res.statusCode = 401;
      res.end(JSON.stringify({ success:false, error:'AUTHENTICATION_REQUIRED', message:'Authentication required to upload merchant storefront branding.' }));
      return true;
    }

    const user = await authService.authenticateToken(token);
    console.info('[Vendor Branding Vercel] Authentication', { usernamePresent: Boolean(user?.username) });
    if (!user?.username) {
      res.statusCode = 401;
      res.end(JSON.stringify({ success:false, error:'INVALID_SESSION', message:'Authentication required to upload merchant storefront branding.' }));
      return true;
    }

    let mime = String(Array.isArray(req.headers['content-type']) ? req.headers['content-type'][0] : req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (mime === 'image/jpg') mime = 'image/jpeg';
    if (!['image/jpeg','image/png','image/webp'].includes(mime)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success:false, error:'INVALID_MIME_TYPE', message:'Invalid branding image format.' }));
      return true;
    }
    console.info('[Vendor Branding Vercel] MIME accepted', { mime });

    const body = await readRawRequestBody(req);
    console.info('[Vendor Branding Vercel] File received', { size: body.length });
    if (!body.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success:false, error:'EMPTY_FILE', message:'Branding image content is empty or unreadable.' }));
      return true;
    }
    if (body.length > MAX_BRANDING_BYTES) {
      res.statusCode = 413;
      res.end(JSON.stringify({ success:false, error:'FILE_TOO_LARGE', message:'Branding image exceeds maximum allowed size of 5 MB.' }));
      return true;
    }
    if (!validateBrandingImageSignature(body, mime)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success:false, error:'FILE_SIGNATURE_MISMATCH', message:'File content does not match the declared image signature.' }));
      return true;
    }
    console.info('[Vendor Branding Vercel] Signature accepted', { accepted: true });

    const url = new URL(req.url || '/', 'http://localhost');
    const brandingType = String(req.headers['x-branding-type'] || url.searchParams.get('type') || 'logo').toLowerCase() === 'banner' ? 'banner' : 'logo';
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const assetId = `${brandingType}_${randomBytes(16).toString('hex')}.${ext}`;

    if (process.env.VERCEL !== '1') return false;

    const { put } = await import('@vercel/blob');
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    console.info('[Vendor Branding Vercel] Blob configuration', { configured: Boolean(blobToken) });
    if (!blobToken) {
      const error: any = new Error('BLOB_READ_WRITE_TOKEN is not configured for Vercel branding uploads.');
      error.code = 'BLOB_CONFIGURATION_ERROR';
      throw error;
    }

    console.info('[Vendor Branding Vercel] Blob put started', { assetId, size: body.length });
    const blob = await put(`vendor-branding/${assetId}`, body, {
      access: 'public',
      contentType: mime,
      addRandomSuffix: false,
      token: blobToken
    });
    console.info('[Vendor Branding Vercel] Blob put succeeded', { assetId, urlPresent: Boolean(blob?.url) });

    res.statusCode = 201;
    res.end(JSON.stringify({ success:true, url:blob.url, assetId, brandingType, storage:'vercel-blob', message:`Store ${brandingType} uploaded successfully.` }));
    return true;
  } catch (error: any) {
    console.error('[Vendor Branding Vercel] Blob operation failed', { name:error?.name, code:error?.code, message:error?.message });
    const code = error?.code === 'BLOB_CONFIGURATION_ERROR'
      ? 'BLOB_CONFIGURATION_ERROR'
      : error?.code === 'FILE_TOO_LARGE'
        ? 'FILE_TOO_LARGE'
        : 'BLOB_UPLOAD_FAILED';
    const status = code === 'FILE_TOO_LARGE' ? 413 : 500;
    res.statusCode = status;
    res.end(JSON.stringify({
      success:false,
      error:code,
      message:code === 'FILE_TOO_LARGE'
        ? 'Branding image exceeds maximum allowed size of 5 MB.'
        : code === 'BLOB_CONFIGURATION_ERROR'
          ? 'Branding image storage is not configured.'
          : 'Branding image storage is temporarily unavailable.'
    }));
    return true;
  }
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

  normalizeRewrittenPath(req);

  // Vercel branding uploads are handled here so the request body reaches Blob directly,
  // without depending on Express raw-body parsing inside the bundled server.
  if (await handleVendorBrandingUpload(req, res)) return;

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
