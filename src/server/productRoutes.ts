import { Router } from 'express';
import { productRepo } from './db';
import { authenticate, requireAuthenticatedUser, AuthenticatedRequest } from './auth';

/**
 * Authoritative marketplace catalog API.
 * Public reads expose only active, non-deleted products.
 * Writes require an authenticated server-side identity.
 */
export const productRouter = Router();

productRouter.get('/', (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const category = typeof req.query.category === 'string' ? req.query.category as any : undefined;
    const products = q
      ? productRepo.search(q, { activeOnly: true, category })
      : productRepo.getAll({ activeOnly: true, category });
    res.json({ ok: true, products });
  } catch (error) {
    console.error('[products:list]', error);
    res.status(500).json({ ok: false, error: 'PRODUCT_CATALOG_UNAVAILABLE' });
  }
});

productRouter.get('/:id', (req, res) => {
  const product = productRepo.findById(req.params.id);
  if (!product || product.isActive !== true) {
    return res.status(404).json({ ok: false, error: 'PRODUCT_NOT_FOUND' });
  }
  return res.json({ ok: true, product });
});

productRouter.post('/', authenticate, requireAuthenticatedUser, (req: AuthenticatedRequest, res) => {
  try {
    const body = req.body || {};
    const user = req.user!;
    const sellerId = String(user.username || user.id || '').trim();
    if (!sellerId) return res.status(401).json({ ok: false, error: 'SELLER_IDENTITY_REQUIRED' });

    const product = productRepo.save({
      ...body,
      id: String(body.id || cryptoRandomId()),
      sellerId,
      sellerName: String(body.sellerName || user.username || sellerId),
      isActive: false,
      moderationStatus: 'PENDING_REVIEW',
    });
    return res.status(201).json({ ok: true, product });
  } catch (error) {
    console.error('[products:create]', error);
    return res.status(400).json({ ok: false, error: error instanceof Error ? error.message : 'PRODUCT_CREATE_FAILED' });
  }
});

function cryptoRandomId(): string {
  return `prd_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
