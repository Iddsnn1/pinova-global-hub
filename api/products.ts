import type { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import { ProductRepository } from '../src/server/db/repositories/ProductRepository.ts';
import { authService } from '../src/server/auth/index.ts';
import type { Product } from '../src/types';

const productRepo = new ProductRepository();

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function bearer(req: IncomingMessage): string | null {
  const raw = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw.trim();
}

async function readJson(req: IncomingMessage): Promise<Record<string, any>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, any>;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return json(res, 204, {});

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = url.pathname
      .replace(/^\/api\/(?:v1\/)?products\/?/, '')
      .replace(/\/$/, '');

    if (req.method === 'GET') {
      if (path) {
        const product = productRepo.findById(path);
        if (!product || product.isActive !== true) {
          return json(res, 404, { ok: false, error: 'PRODUCT_NOT_FOUND' });
        }
        return json(res, 200, { ok: true, product });
      }

      const q = url.searchParams.get('q') || '';
      const category = url.searchParams.get('category') || undefined;
      const products = q
        ? productRepo.search(q, { activeOnly: true, category: category as Product['category'] | undefined })
        : productRepo.getAll({ activeOnly: true, category: category as Product['category'] | undefined });
      return json(res, 200, { ok: true, products });
    }

    const token = bearer(req);
    if (!token) return json(res, 401, { ok: false, error: 'AUTHENTICATION_REQUIRED' });
    const user = await authService.authenticateToken(token);
    if (!user?.username) return json(res, 401, { ok: false, error: 'INVALID_SESSION' });

    if (req.method === 'POST' && !path) {
      const body = await readJson(req);
      const sellerId = String(user.username).trim();
      const stock = Number.isInteger(body.stock) && body.stock >= 0 ? body.stock : 0;
      const product: Product = {
        id: `prd_${Date.now()}_${randomBytes(5).toString('hex')}`,
        title: String(body.title || '').trim(),
        description: String(body.description || '').trim(),
        pricePi: Number(body.pricePi ?? 0),
        category: body.category || 'physical',
        subcategory: String(body.subcategory || ''),
        images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
        stock,
        rating: 0,
        reviewsCount: 0,
        sellerId,
        sellerName: String(user.username),
        sellerVerified: false,
        features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
        specs: body.specs,
        productType: body.productType,
        fulfillmentType: body.fulfillmentType,
        availabilityStatus: body.availabilityStatus || (stock > 0 ? 'in_stock' : 'out_of_stock'),
        tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
        isActive: false,
        moderationStatus: 'PENDING_REVIEW'
      };
      const saved = productRepo.save(product);
      return json(res, 201, { ok: true, product: saved });
    }

    if ((req.method === 'PATCH' || req.method === 'DELETE') && path) {
      const existing = productRepo.findById(path);
      if (!existing) return json(res, 404, { ok: false, error: 'PRODUCT_NOT_FOUND' });

      const roles = Array.isArray(user.roles) ? user.roles : [];
      const isAdmin = roles.includes('PLATFORM_ADMIN');
      if (existing.sellerId !== user.username && !isAdmin) {
        return json(res, 403, { ok: false, error: 'PRODUCT_ACCESS_DENIED' });
      }

      if (req.method === 'DELETE') {
        productRepo.softDelete(path);
        return json(res, 200, { ok: true, deleted: true });
      }

      const body = await readJson(req);
      const { id: _id, sellerId: _sellerId, sellerName: _sellerName, sellerVerified: _sellerVerified, rating: _rating, reviewsCount: _reviewsCount, isActive: _isActive, moderationStatus: _moderationStatus, ...safePatch } = body;
      const updated = productRepo.save({
        ...existing,
        ...safePatch,
        id: existing.id,
        sellerId: existing.sellerId,
        sellerName: existing.sellerName,
        sellerVerified: existing.sellerVerified,
        rating: existing.rating,
        reviewsCount: existing.reviewsCount,
        isActive: existing.isActive,
        moderationStatus: existing.moderationStatus
      });
      return json(res, 200, { ok: true, product: updated });
    }

    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('[products-api]', error);
    return json(res, 400, {
      ok: false,
      error: error instanceof Error ? error.message : 'PRODUCT_API_FAILED'
    });
  }
}
