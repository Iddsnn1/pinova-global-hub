import { Router } from 'express';
import { productRepo } from './db';
import { authenticate, requireAuthenticatedUser, AuthenticatedRequest } from './auth';
import type { Product } from '../types';

/** Authoritative marketplace catalog API. */
export const productRouter = Router();

productRouter.get('/', (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const category = typeof req.query.category === 'string' ? req.query.category as Product['category'] : undefined;
    const products = q
      ? productRepo.search(q, { activeOnly: true, category })
      : productRepo.getAll({ activeOnly: true, category });
    return res.json({ ok: true, products });
  } catch (error) {
    console.error('[products:list]', error);
    return res.status(500).json({ ok: false, error: 'PRODUCT_CATALOG_UNAVAILABLE' });
  }
});

productRouter.get('/:id', (req, res) => {
  const product = productRepo.findById(req.params.id);
  if (!product || product.isActive !== true) return res.status(404).json({ ok: false, error: 'PRODUCT_NOT_FOUND' });
  return res.json({ ok: true, product });
});

productRouter.post('/', authenticate, requireAuthenticatedUser, (req: AuthenticatedRequest, res) => {
  try {
    const body = req.body || {};
    const user = req.user!;
    const sellerId = String(user.username || user.id || '').trim();
    if (!sellerId) return res.status(401).json({ ok: false, error: 'SELLER_IDENTITY_REQUIRED' });

    const stock = Number.isInteger(body.stock) && body.stock >= 0 ? body.stock : 0;
    const product: Product = {
      id: String(body.id || `prd_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`),
      title: String(body.title || ''),
      description: String(body.description || ''),
      pricePi: Number(body.pricePi ?? 0),
      category: body.category || 'physical',
      subcategory: String(body.subcategory || ''),
      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      stock,
      rating: Number(body.rating ?? 0),
      reviewsCount: Number(body.reviewsCount ?? 0),
      sellerId,
      sellerName: String(body.sellerName || user.username || sellerId),
      sellerVerified: false,
      features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
      specs: body.specs,
      productType: body.productType,
      fulfillmentType: body.fulfillmentType,
      availabilityStatus: body.availabilityStatus || (stock > 0 ? 'in_stock' : 'out_of_stock'),
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      isActive: false,
      moderationStatus: 'PENDING_REVIEW',
    };

    const saved = productRepo.save(product);
    return res.status(201).json({ ok: true, product: saved });
  } catch (error) {
    console.error('[products:create]', error);
    return res.status(400).json({ ok: false, error: error instanceof Error ? error.message : 'PRODUCT_CREATE_FAILED' });
  }
});
