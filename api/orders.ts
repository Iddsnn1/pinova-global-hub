import type { IncomingMessage, ServerResponse } from 'http';
import { createHash, randomBytes } from 'crypto';
import { authService } from '../src/server/auth';
import { orderRepo, productRepo, paymentLedgerRepo, pstpAuditRepo, idempotencyRepo } from '../src/server/db';
import { verifyPiPaymentAuthoritative } from '../src/server/services/PiPaymentVerificationService';
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

function idempotencyKey(req: IncomingMessage): string | null {
  const raw = Array.isArray(req.headers['idempotency-key']) ? req.headers['idempotency-key'][0] : req.headers['idempotency-key'];
  const key = String(raw || '').trim();
  return key || null;
}

async function readJson(req: IncomingMessage): Promise<Record<string, any>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function requestHash(body: unknown): string {
  return createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex');
}

function canViewOrder(order: Order, username: string, roles: string[]) {
  return order.buyerUsername === username || roles.includes('PLATFORM_ADMIN') || roles.includes('COMPLIANCE_OFFICER');
}

function extractPiUserUid(paymentData: any): string | null {
  const candidates = [paymentData?.user_uid, paymentData?.userUid, paymentData?.payer?.uid, paymentData?.payer?.user_uid];
  const value = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
  return value ? value.trim() : null;
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
      if (!path) return json(res, 200, { ok: true, orders: orderRepo.findByBuyer(user.username) });
      const order = orderRepo.findById(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (!canViewOrder(order, user.username, user.roles || [])) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      return json(res, 200, { ok: true, order });
    }

    if (req.method === 'POST' && path.endsWith('/payment-verify')) {
      const orderId = path.slice(0, -'/payment-verify'.length).replace(/\/$/, '');
      const order = orderRepo.findById(orderId);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (order.buyerUsername !== user.username && !(user.roles || []).includes('PLATFORM_ADMIN')) {
        return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      }
      if (order.serverVerified === true) return json(res, 200, { ok: true, verified: true, order });

      const body = await readJson(req);
      const paymentId = String(body.paymentId || '').trim();
      if (!paymentId) return json(res, 400, { ok: false, error: 'PI_PAYMENT_ID_REQUIRED' });

      const existingPayment = paymentLedgerRepo.findByPaymentId(paymentId);
      if (existingPayment?.orderId && existingPayment.orderId !== order.id) {
        return json(res, 409, { ok: false, verified: false, error: 'PI_PAYMENT_ALREADY_BOUND_TO_ORDER' });
      }

      const verification = await verifyPiPaymentAuthoritative(paymentId);
      if (!verification.verified) {
        return json(res, 402, { ok: false, verified: false, error: 'PI_PAYMENT_NOT_VERIFIED', message: verification.message });
      }

      const paymentData = verification.paymentData || {};
      const paymentAmount = Number(paymentData.amount);
      if (!Number.isFinite(paymentAmount) || Math.abs(paymentAmount - order.totalPi) > 0.0000001) {
        return json(res, 409, { ok: false, verified: false, error: 'PI_PAYMENT_AMOUNT_MISMATCH' });
      }

      const piUserUid = extractPiUserUid(paymentData);
      if (!piUserUid || !user.piUid || piUserUid !== user.piUid) {
        return json(res, 403, { ok: false, verified: false, error: 'PI_PAYMENT_BUYER_MISMATCH' });
      }

      const txid = String(paymentData?.transaction?.txid || paymentData?.transaction?.hash || body.txid || '').trim();
      if (process.env.NODE_ENV === 'production' && !txid) {
        return json(res, 409, { ok: false, verified: false, error: 'PI_TRANSACTION_ID_REQUIRED' });
      }
      if (txid) {
        const existingTx = paymentLedgerRepo.findByTxid(txid);
        if (existingTx?.paymentId && existingTx.paymentId !== paymentId) {
          return json(res, 409, { ok: false, verified: false, error: 'PI_TRANSACTION_ALREADY_USED' });
        }
      }

      const ledger = txid
        ? paymentLedgerRepo.recordCompletion(paymentId, txid, { orderId: order.id, buyerUsername: order.buyerUsername, amountPi: order.totalPi, piUserUid })
        : paymentLedgerRepo.recordApproval(paymentId, { orderId: order.id, buyerUsername: order.buyerUsername, amountPi: order.totalPi, piUserUid });

      const updated = orderRepo.markPaymentVerified(order.id, paymentId, txid || undefined);
      pstpAuditRepo.appendLog({
        orderId: order.id,
        paymentId,
        actor: 'system',
        actorRole: 'system',
        action: 'PAYMENT_SERVER_VERIFIED',
        details: `Pi payment server-verified (${verification.source}); PSTP escrow protection activated.`,
        ipAddress: 'server',
        deviceInfo: 'PiNova PSTP Payment Verification Service'
      });

      return json(res, 200, { ok: true, verified: true, escrowStatus: updated?.escrowStatus, pstpStatus: updated?.pstpStatus, order: updated, paymentLedger: ledger });
    }

    if (req.method === 'POST' && !path) {
      const body = await readJson(req);
      if (!Array.isArray(body.items) || body.items.length === 0) return json(res, 400, { ok: false, error: 'ORDER_ITEMS_REQUIRED' });

      const key = idempotencyKey(req);
      if (!key) return json(res, 400, { ok: false, error: 'IDEMPOTENCY_KEY_REQUIRED' });
      if (key.length > 200) return json(res, 400, { ok: false, error: 'INVALID_IDEMPOTENCY_KEY' });

      const fingerprint = 'order-create:v1';
      const hash = requestHash(body);
      const reservation = await idempotencyRepo.reserveIdempotencyKey(`${user.username}:orders:${key}`, fingerprint, hash);
      if (reservation.status === 'RESOLVED') return json(res, 200, reservation.cachedResult);
      if (reservation.status === 'IN_PROGRESS') return json(res, 409, { ok: false, error: 'ORDER_REQUEST_IN_PROGRESS' });
      if (reservation.status === 'CONFLICT') return json(res, 409, { ok: false, error: 'IDEMPOTENCY_KEY_PAYLOAD_CONFLICT' });

      try {
        const items: OrderItem[] = [];
        let totalPi = 0;
        for (const input of body.items) {
          const productId = String(input?.productId || '').trim();
          const quantity = Number.isInteger(input?.quantity) ? Number(input.quantity) : 0;
          if (!productId || quantity < 1) throw new Error('INVALID_ORDER_ITEM');
          const product = productRepo.findById(productId);
          if (!product || product.isActive !== true || product.isDeleted === true) throw new Error(`PRODUCT_NOT_AVAILABLE:${productId}`);
          if (quantity > product.stock && product.fulfillmentType !== 'digital_download' && product.fulfillmentType !== 'instant_key') throw new Error(`INSUFFICIENT_STOCK:${productId}`);
          totalPi += product.pricePi * quantity;
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
          timeline: [{ status: 'Pending Payment', timestamp: now, actor: user.username, actorRole: 'buyer', note: 'Order created; awaiting authoritative Pi payment verification.' }],
          serverVerified: false,
          securityFlag: false,
        };

        // Reserve physical stock immediately. Digital/instant fulfillment is not decremented here.
        for (const item of items) {
          if (item.product.fulfillmentType === 'digital_download' || item.product.fulfillmentType === 'instant_key') continue;
          const reserved = productRepo.reserveStock(item.product.id, item.quantity);
          if (!reserved) throw new Error(`INSUFFICIENT_STOCK:${item.product.id}`);
        }

        const saved = orderRepo.save(order);
        const response = { ok: true, order: saved };
        await idempotencyRepo.resolveIdempotencyKey(`${user.username}:orders:${key}`, response);
        return json(res, 201, response);
      } catch (error) {
        await idempotencyRepo.releaseIdempotencyKey(`${user.username}:orders:${key}`);
        return json(res, 409, { ok: false, error: error instanceof Error ? error.message : 'ORDER_CREATE_FAILED' });
      }
    }

    if (req.method === 'PATCH' && path) {
      const order = orderRepo.findById(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      const roles = user.roles || [];
      if (!canViewOrder(order, user.username, roles)) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      const body = await readJson(req);
      const nextStatus = body.pstpStatus as PstpOrderStatus;
      const allowedBuyerStatuses: PstpOrderStatus[] = ['Buyer Confirmation', 'Cancelled', 'Refund Requested', 'Disputed'];
      if (!allowedBuyerStatuses.includes(nextStatus) && !roles.includes('PLATFORM_ADMIN') && !roles.includes('COMPLIANCE_OFFICER')) return json(res, 403, { ok: false, error: 'ORDER_STATUS_CHANGE_NOT_ALLOWED' });
      const escrowStatus = body.escrowStatus || order.escrowStatus;
      if (nextStatus === 'Completed' && order.serverVerified !== true) return json(res, 409, { ok: false, error: 'ORDER_PAYMENT_NOT_SERVER_VERIFIED' });
      const updated = orderRepo.updateStatus(path, nextStatus, escrowStatus, user.username, roles.includes('PLATFORM_ADMIN') ? 'admin' : 'buyer', String(body.note || ''));
      return json(res, 200, { ok: true, order: updated });
    }

    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('[orders-api]', error);
    return json(res, 400, { ok: false, error: error instanceof Error ? error.message : 'ORDER_API_FAILED' });
  }
}
