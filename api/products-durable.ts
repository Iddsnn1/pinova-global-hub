import crypto from 'crypto';
import { getBundledServer, authenticateRequest } from '../src/server/services/DurableVendorAuth';
import { getDurableVendorApplication, durableVendorStorageEnabled } from '../src/server/services/DurableVendorApplicationStore';

export default async function handler(req: any, res: any) {
  const server = getBundledServer();
  if (req.method === 'GET') {
    const repo = new server.ProductRepository();
    const q = typeof req.query?.q === 'string' ? req.query.q : '';
    const category = typeof req.query?.category === 'string' ? req.query.category : undefined;
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

  const repo = new server.ProductRepository();
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
