import type { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import { productRepo } from '../src/server/db';
import { authService } from '../src/server/auth';

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

async function readJson(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return json(res, 204, {});

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = url.pathname.replace(/^\/api\/v1\/products\/?/, '').replace(/\/$/, '');

    if (req.method === 'GET') {
      if (path) {
        const product = productRepo.findById(path);
        if (!product || product.isActive !== true) return json(res, 404, { ok: false, error: 'PRODUCT_NOT_FOUND' });
        return json(res, 200, { ok: true, product });
      }

      const q = typeof url.searchParams.get('q') === 'string' ? url.searchParams.get('q') || '' : '';
      const category = url.searchParams.get('category') || undefined;
      const products = q
        ? productRepo.search(q, { activeOnly: true, category: category as any })
        : productRepo.getAll({ activeOnly: true, category: category as any });
      return json(res, 200, { ok: true, products });
    }

    const token = bearer(req);
    if (!token) return json(res, 401, { ok: false, error: 'AUTHENTICATION_REQUIRED' });
    const user = await authService.authenticateToken(token);
    if (!user?.username) return json(res, 401, { ok: false, error: 'INVALID_SESSION' });

    if (req.method === 'POST' && !path) {
      const body = await readJson(req);
      const sellerId = String(user.username).trim();
      const product = productRepo.save({
        ...body,
        id: String(body.id || `prd_${Date.now()}_${randomBytes(5).toString('hex')}`),
        sellerId,
        sellerName: String(body.sellerName || user.username),
        isActive: false,
        moderationStatus: 'PENDING_REVIEW'
      });
      return json(res, 201, { ok: true, product });
    }

    if ((req.method === 'PATCH' || req.method === 'DELETE') && path) {
      const existing = productRepo.findById(path);
      if (!existing) return json(res, 404, { ok: false, error: 'PRODUCT_NOT_FOUND' });
      if (existing.sellerId !== user.username && !user.roles.includes('PLATFORM_ADMIN')) {
        return json(res, 403, { ok: false, error: 'PRODUCT_ACCESS_DENIED' });
      }

      if (req.method === 'DELETE') {
        productRepo.softDelete(path);
        return json(res, 200, { ok: true, deleted: true });
      }

      const body = await readJson(req);
      if (typeof body.isActive === 'boolean') productRepo.updateAvailability(path, body.isActive);
      const updated = productRepo.findById(path);
      return json(res, 200, { ok: true, product: updated });
    }

    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('[products-api]', error);
    return json(res, 400, { ok: false, error: error instanceof Error ? error.message : 'PRODUCT_API_FAILED' });
  }
}
