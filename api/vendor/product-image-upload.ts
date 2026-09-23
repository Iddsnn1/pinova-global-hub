import crypto from 'crypto';
import { put } from '@vercel/blob';
import { authenticateVendorRequest as authenticateRequest, getDurableVendorApplication, durableVendorStorageEnabled } from '../../dist/server.cjs';

export const config = { api: { bodyParser: false } };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

async function readRawBody(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (req.body instanceof Uint8Array) return Buffer.from(req.body);
  if (req.body instanceof ArrayBuffer) return Buffer.from(new Uint8Array(req.body));
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  try {
    const user = await authenticateRequest(req);
    if (!user?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authenticated Pioneer session required.' });
    if (!durableVendorStorageEnabled()) return res.status(503).json({ success: false, error: 'DURABLE_VENDOR_STORAGE_UNAVAILABLE' });

    const merchant = await getDurableVendorApplication(user.username);
    const canSell = merchant?.status === 'APPROVED' && merchant?.verificationStatus === 'Verified' && merchant?.sellerStatus === 'Active';
    if (!canSell) return res.status(403).json({ success: false, error: 'MERCHANT_SELLER_ACCESS_REQUIRED' });

    const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) return res.status(415).json({ success: false, error: 'UNSUPPORTED_IMAGE_TYPE', message: 'Use JPEG, PNG, WebP, or GIF.' });

    const body = await readRawBody(req);
    if (!body.length) return res.status(400).json({ success: false, error: 'EMPTY_IMAGE' });
    if (body.length > MAX_BYTES) return res.status(413).json({ success: false, error: 'IMAGE_TOO_LARGE', message: 'Maximum image size is 5 MB.' });

    const safeUsername = String(user.username).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'merchant';
    const extension = contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1];
    const assetId = crypto.randomBytes(12).toString('hex');
    const pathname = `product-images/${safeUsername}/${Date.now()}-${assetId}.${extension}`;
    const blob = await put(pathname, body, { access: 'public', contentType, addRandomSuffix: false, allowOverwrite: false });

    return res.status(200).json({ success: true, url: blob.url, pathname: blob.pathname, contentType, size: body.length });
  } catch (error: any) {
    console.error('[product-image-upload]', error);
    return res.status(500).json({ success: false, error: 'PRODUCT_IMAGE_UPLOAD_FAILED' });
  }
}
