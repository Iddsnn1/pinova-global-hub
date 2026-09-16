import type { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import { authService } from '../src/server/auth';
import { orderRepo, productRepo } from '../src/server/db';
import type { Order, OrderItem, PstpOrderStatus } from '../src/types';

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function bearer(req: IncomingMessage): string | null {
  const raw = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw.trim();
}

async function readJson(req: IncomingMessage): Promise<Record<string, any>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function canViewOrder(order: Order, username: string, roles: string[]) {
  return order.buyerUsername === username || roles.includes('PLATFORM_ADMIN') || roles.includes('COMPLIANCE_OFFICER');
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return json(res, 204, {});

  try {
    const token = bearer(req);
    if (!token) return json(res, 401, { ok: false, error: 'AUTHENTICATION_REQUIRED' });
    const user = await authService.authenticateToken(token);
    if (!user?.username) return json(res, 401, { ok: false, error: 'INVALID_SESSION' });

    const url = new URL(req.url || '/', 'http://localhost');
    const path = url.pathname.replace(/^\/api\/v1\/orders\/?/, '').replace(/\/$/, '');

    if (req.method === 'GET') {
      if (!path) {
        return json(res, 200, { ok: true, orders: orderRepo.findByBuyer(user.username) });
      }
      const order = orderRepo.findById(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (!canViewOrder(order, user.username, user.roles || [])) {
        return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      }
      return json(res, 200, { ok: true, order });
    }

    if (req.method === 'POST' && !path) {
      const body = await readJson(req);
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return json(res, 400, { ok: false, error: 'ORDER_ITEMS_REQUIRED' });
      }

      const items: OrderItem[] = [];
      let totalPi = 0;
      for (const input of body.items) {
        const productId = String(input?.productId || '').trim();
        const quantity = Number.isInteger(input?.quantity) ? Number(input.quantity) : 0;
        if (!productId || quantity < 1) return json(res, 400, { ok: false, error: 'INVALID_ORDER_ITEM' });

        const product = productRepo.findById(productId);
        if (!product || product.isActive !== true || product.isDeleted === true) {
          return json(res, 409, { ok: false, error: 'PRODUCT_NOT_AVAILABLE', productId });
        }
        if (quantity > product.stock && product.fulfillmentType !== 'digital_download' && product.fulfillmentType !== 'instant_key') {
          return json(res, 409, { ok: false, error: 'INSUFFICIENT_STOCK', productId });
        }

        const lineTotal = product.pricePi * quantity;
        totalPi += lineTotal;
        items.push({ product, quantity, selectedVariant: input.selectedVariant, customDetails: input.customDetails });
      }

      const now = new Date().toISOString();
      const order: Order = {
        id: `ord_${Date.now()}_${randomBytes(6).toString('hex')}`,
        buyerUsername: user.username,
        items,
        totalPi,
        escrowStatus: 'payment_pending',
        pstpStatus: 'Pending Payment',
        createdAt: now,
        updatedAt: now,
        timeline: [{
          status: 'Pending Payment',
          timestamp: now,
          actor: user.username,
          actorRole: 'buyer',
          note: 'Order created; awaiting authoritative Pi payment verification.'
        }],
        serverVerified: false,
        securityFlag: false,
      };

      const saved = orderRepo.save(order);
      return json(res, 201, { ok: true, order: saved });
    }

    if (req.method === 'PATCH' && path) {
      const order = orderRepo.findById(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      const roles = user.roles || [];
      if (!canViewOrder(order, user.username, roles)) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });

      const body = await readJson(req);
      const nextStatus = body.pstpStatus as PstpOrderStatus;
      const allowedBuyerStatuses: PstpOrderStatus[] = ['Buyer Confirmation', 'Cancelled', 'Refund Requested', 'Disputed'];
      if (!allowedBuyerStatuses.includes(nextStatus) && !roles.includes('PLATFORM_ADMIN') && !roles.includes('COMPLIANCE_OFFICER')) {
        return json(res, 403, { ok: false, error: 'ORDER_STATUS_CHANGE_NOT_ALLOWED' });
      }

      const escrowStatus = body.escrowStatus || order.escrowStatus;
      const updated = orderRepo.updateStatus(path, nextStatus, escrowStatus, user.username, roles.includes('PLATFORM_ADMIN') ? 'admin' : 'buyer', String(body.note || ''));
      return json(res, 200, { ok: true, order: updated });
    }

    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('[orders-api]', error);
    return json(res, 400, { ok: false, error: error instanceof Error ? error.message : 'ORDER_API_FAILED' });
  }
}
