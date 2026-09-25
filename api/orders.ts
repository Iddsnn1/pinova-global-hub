import type { IncomingMessage, ServerResponse } from 'http';
import { createHash, randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { authService, paymentLedgerRepo, pstpAuditRepo, idempotencyRepo, verifyPiPaymentAuthoritative, durableOrderStorageEnabled, getDurableOrder, listDurableOrders, saveDurableOrder, markDurableOrderPaymentVerified } from '../dist/server.cjs';
import { listDurableVendorApplications } from '../dist/server.cjs';
import { durableProductStorageEnabled, getDurableProduct, reserveDurableProductStockBatch } from '../dist/server.cjs';
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
function requestHash(body: unknown): string { return createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex'); }
function canViewOrder(order: Order, username: string, roles: string[]) {
  return order.buyerUsername === username || roles.includes('PLATFORM_ADMIN') || roles.includes('COMPLIANCE_OFFICER');
}
function extractPiUserUid(paymentData: any): string | null {
  const candidates = [paymentData?.user_uid, paymentData?.userUid, paymentData?.payer?.uid, paymentData?.payer?.user_uid];
  const value = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
  return value ? value.trim() : null;
}


function verifyCarrierSignature(payload: string, signature: string | null, secret: string): boolean {
  const normalized = String(signature || '').trim().replace(/^sha256=/i, '');
  if (!normalized || !secret) return false;
  const expected = createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
  try {
    const a = Buffer.from(normalized, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function normalizeUsername(value: unknown): string {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

const SELLER_LIFECYCLE_TRANSITIONS: Partial<Record<PstpOrderStatus, PstpOrderStatus[]>> = {
  'Payment Verified': ['Seller Accepted'],
  'Seller Accepted': ['Preparing Order'],
  'Preparing Order': ['Packed'],
  'Packed': ['Shipped'],
  // Carrier-controlled milestones are intentionally not seller-editable.
  // They must come from a future carrier/webhook evidence path.
  'Shipped': [],
};

function isSellerTransitionAllowed(current: PstpOrderStatus, next: PstpOrderStatus): boolean {
  return (SELLER_LIFECYCLE_TRANSITIONS[current] || []).includes(next);
}

function sellerOwnsOrder(order: Order, username: string): boolean {
  const seller = normalizeUsername(username);
  if (!seller) return false;
  return order.items.length > 0 && order.items.every((item) => normalizeUsername(item.product?.sellerId) === seller);
}

async function isApprovedActiveMerchant(username: string): Promise<boolean> {
  const target = normalizeUsername(username);
  if (!target) return false;
  const applications = await listDurableVendorApplications();
  return applications.some((application: any) =>
    normalizeUsername(application?.pioneerUsername) === target &&
    application?.status === 'APPROVED' &&
    application?.verificationStatus === 'Verified' &&
    application?.sellerStatus === 'Active' &&
    application?.pstpAgreementAccepted === true
  );
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return json(res, 204, {});

  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname.replace(/^\/api\/v1\/orders\/?/, '').replace(/\/$/, '');

  try {
    // Carrier webhook is server-to-server and intentionally sits outside Pioneer session auth.
    // It accepts only signed, idempotent carrier evidence for the three carrier-controlled milestones.
    if (req.method === 'POST' && path.endsWith('/carrier-webhook')) {
      const secret = String(process.env.PINOVA_CARRIER_WEBHOOK_SECRET || '').trim();
      if (!secret) return json(res, 503, { ok: false, error: 'CARRIER_WEBHOOK_NOT_CONFIGURED' });
      const signature = Array.isArray(req.headers['x-carrier-signature'])
        ? req.headers['x-carrier-signature'][0]
        : (req.headers['x-carrier-signature'] as string | undefined);
      const rawBody = await (async () => {
        const chunks: Buffer[] = [];
        for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return Buffer.concat(chunks).toString('utf8');
      })();
      if (!verifyCarrierSignature(rawBody, signature || null, secret)) {
        return json(res, 401, { ok: false, error: 'INVALID_CARRIER_SIGNATURE' });
      }

      let body: any;
      try { body = JSON.parse(rawBody); } catch { return json(res, 400, { ok: false, error: 'INVALID_JSON' }); }
      const orderId = String(body.orderId || '').trim();
      const nextStatus = String(body.status || '').trim() as PstpOrderStatus;
      const trackingNumber = String(body.trackingNumber || '').trim();
      const carrier = String(body.carrier || '').trim();
      const eventId = String(body.eventId || '').trim();
      const allowed: PstpOrderStatus[] = ['In Transit', 'Out for Delivery', 'Delivered'];
      if (!orderId || !allowed.includes(nextStatus) || !trackingNumber || !carrier || !eventId) {
        return json(res, 400, { ok: false, error: 'CARRIER_EVIDENCE_FIELDS_REQUIRED' });
      }

      const order = await getDurableOrder(orderId);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (!order.trackingNumber || order.trackingNumber !== trackingNumber) {
        return json(res, 409, { ok: false, error: 'TRACKING_NUMBER_MISMATCH' });
      }
      const normalizedCarrier = carrier.toLowerCase();
      if (!String(order.carrier || '').trim() || String(order.carrier).toLowerCase() !== normalizedCarrier) {
        return json(res, 409, { ok: false, error: 'CARRIER_MISMATCH' });
      }
      const duplicate = (Array.isArray(order.timeline) ? order.timeline : []).some((entry: any) =>
        String(entry?.note || '').includes(`carrier-event:${eventId}`)
      );
      if (duplicate) return json(res, 200, { ok: true, duplicate: true, order });

      const allowedTransitions: Record<string, PstpOrderStatus> = {
        'Shipped': 'In Transit',
        'In Transit': 'Out for Delivery',
        'Out for Delivery': 'Delivered'
      };
      if (allowedTransitions[order.pstpStatus] !== nextStatus) {
        return json(res, 409, {
          ok: false,
          error: 'INVALID_CARRIER_LIFECYCLE_TRANSITION',
          currentStatus: order.pstpStatus,
          requestedStatus: nextStatus
        });
      }

      const timestamp = new Date().toISOString();
      const updated = await saveDurableOrder({
        ...order,
        pstpStatus: nextStatus,
        updatedAt: timestamp,
        escrowStatus: nextStatus === 'Delivered' ? 'delivered' : 'shipped',
        timeline: [
          ...(Array.isArray(order.timeline) ? order.timeline : []),
          {
            status: nextStatus,
            timestamp,
            actor: carrier,
            actorRole: 'system',
            note: `Carrier evidence accepted; carrier-event:${eventId}`
          }
        ]
      });

      pstpAuditRepo.appendLog({
        orderId: order.id,
        paymentId: order.piPaymentId,
        actor: carrier,
        actorRole: 'system',
        action: 'CARRIER_LIFECYCLE_EVIDENCE_ACCEPTED',
        details: `Signed carrier event ${eventId} advanced order to ${nextStatus}.`,
        ipAddress: 'server',
        deviceInfo: 'PiNova Carrier Webhook'
      });

      return json(res, 200, { ok: true, serverAuthoritative: true, order: updated });
    }

    const token = bearer(req);
    if (!token) return json(res, 401, { ok: false, error: 'AUTHENTICATION_REQUIRED' });
    const user = await authService.authenticateToken(token);
    if (!user?.username) return json(res, 401, { ok: false, error: 'INVALID_SESSION' });
    if (!durableProductStorageEnabled()) return json(res, 503, { ok: false, error: 'DURABLE_PRODUCT_STORAGE_UNAVAILABLE' });
    if (!durableOrderStorageEnabled()) return json(res, 503, { ok: false, error: 'DURABLE_ORDER_STORAGE_UNAVAILABLE' });
    if (req.method === 'GET') {
      if (!path) return json(res, 200, { ok: true, orders: await listDurableOrders(user.username) });
      const order = await getDurableOrder(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (!canViewOrder(order, user.username, user.roles || [])) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      return json(res, 200, { ok: true, order });
    }

    if (req.method === 'POST' && path.endsWith('/payment-verify')) {
      const orderId = path.slice(0, -'/payment-verify'.length).replace(/\/$/, '');
      const order = await getDurableOrder(orderId);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (order.buyerUsername !== user.username && !(user.roles || []).includes('PLATFORM_ADMIN')) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      if (order.serverVerified === true) return json(res, 200, { ok: true, verified: true, order });

      const body = await readJson(req);
      const paymentId = String(body.paymentId || '').trim();
      if (!paymentId) return json(res, 400, { ok: false, error: 'PI_PAYMENT_ID_REQUIRED' });
      const existingPayment = paymentLedgerRepo.findByPaymentId(paymentId);
      if (existingPayment?.orderId && existingPayment.orderId !== order.id) return json(res, 409, { ok: false, verified: false, error: 'PI_PAYMENT_ALREADY_BOUND_TO_ORDER' });

      const verification = await verifyPiPaymentAuthoritative(paymentId);
      if (!verification.verified) return json(res, 402, { ok: false, verified: false, error: 'PI_PAYMENT_NOT_VERIFIED', message: verification.message });
      const paymentData = verification.paymentData || {};
      const paymentAmount = Number(paymentData.amount);
      if (!Number.isFinite(paymentAmount) || Math.abs(paymentAmount - order.totalPi) > 0.0000001) return json(res, 409, { ok: false, verified: false, error: 'PI_PAYMENT_AMOUNT_MISMATCH' });

      const piUserUid = extractPiUserUid(paymentData);
      if (!piUserUid || !user.piUid || piUserUid !== user.piUid) return json(res, 403, { ok: false, verified: false, error: 'PI_PAYMENT_BUYER_MISMATCH' });

      const txid = String(paymentData?.transaction?.txid || paymentData?.transaction?.hash || body.txid || '').trim();
      if (process.env.NODE_ENV === 'production' && !txid) return json(res, 409, { ok: false, verified: false, error: 'PI_TRANSACTION_ID_REQUIRED' });
      if (txid) {
        const existingTx = paymentLedgerRepo.findByTxid(txid);
        if (existingTx?.paymentId && existingTx.paymentId !== paymentId) return json(res, 409, { ok: false, verified: false, error: 'PI_TRANSACTION_ALREADY_USED' });
      }

      const ledger = txid
        ? paymentLedgerRepo.recordCompletion(paymentId, txid, { orderId: order.id, buyerUsername: order.buyerUsername, amountPi: order.totalPi, piUserUid })
        : paymentLedgerRepo.recordApproval(paymentId, { orderId: order.id, buyerUsername: order.buyerUsername, amountPi: order.totalPi, piUserUid });
      const updated = await markDurableOrderPaymentVerified(order.id, paymentId, txid || undefined);
      if (!updated) return json(res, 404, { ok: false, verified: false, error: 'ORDER_NOT_FOUND' });
      pstpAuditRepo.appendLog({ orderId: order.id, paymentId, actor: 'system', actorRole: 'system', action: 'PAYMENT_SERVER_VERIFIED', details: `Pi payment server-verified (${verification.source}); PSTP escrow protection activated.`, ipAddress: 'server', deviceInfo: 'PiNova PSTP Payment Verification Service' });
      return json(res, 200, { ok: true, verified: true, escrowStatus: updated?.escrowStatus, pstpStatus: updated?.pstpStatus, order: updated, paymentLedger: ledger });
    }


    if (req.method === 'PATCH' && path.endsWith('/fulfillment')) {
      const orderId = path.slice(0, -'/fulfillment'.length).replace(/\/$/, '');
      const order = await getDurableOrder(orderId);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });

      const sellerUsername = normalizeUsername(user.username);
      if (!sellerOwnsOrder(order, sellerUsername)) {
        return json(res, 403, { ok: false, error: 'SELLER_ORDER_OWNERSHIP_REQUIRED' });
      }
      if (!(await isApprovedActiveMerchant(sellerUsername))) {
        return json(res, 403, { ok: false, error: 'ACTIVE_VERIFIED_MERCHANT_REQUIRED' });
      }
      if (order.serverVerified !== true) {
        return json(res, 409, { ok: false, error: 'ORDER_PAYMENT_NOT_SERVER_VERIFIED' });
      }

      const body = await readJson(req);
      const nextStatus = String(body.pstpStatus || '').trim() as PstpOrderStatus;
      if (!isSellerTransitionAllowed(order.pstpStatus, nextStatus)) {
        return json(res, 409, {
          ok: false,
          error: 'INVALID_SELLER_LIFECYCLE_TRANSITION',
          from: order.pstpStatus,
          to: nextStatus,
          allowedNext: SELLER_LIFECYCLE_TRANSITIONS[order.pstpStatus] || []
        });
      }

      const carrier = String(body.carrier || '').trim();
      const trackingNumber = String(body.trackingNumber || '').trim();

      if (nextStatus === 'Shipped' && (!carrier || !trackingNumber)) {
        return json(res, 400, { ok: false, error: 'CARRIER_AND_TRACKING_REQUIRED_FOR_SHIPMENT' });
      }

      const timestamp = new Date().toISOString();
      const escrowStatus =
        nextStatus === 'Delivered'
          ? 'delivered'
          : nextStatus === 'Shipped' || nextStatus === 'In Transit' || nextStatus === 'Out for Delivery'
            ? 'shipped'
            : 'in_escrow';

      const updated = await saveDurableOrder({
        ...order,
        pstpStatus: nextStatus,
        escrowStatus,
        ...(carrier ? { carrier } : {}),
        ...(trackingNumber ? { trackingNumber } : {}),
        updatedAt: timestamp,
        timeline: [
          ...(Array.isArray(order.timeline) ? order.timeline : []),
          {
            status: nextStatus,
            timestamp,
            actor: user.username,
            actorRole: 'seller',
            note: String(body.note || 'Seller advanced fulfillment to ' + nextStatus + '.'),
          },
        ],
      });

      pstpAuditRepo.appendLog({
        orderId: order.id,
        paymentId: order.piPaymentId,
        actor: user.username,
        actorRole: 'seller',
        action: 'SELLER_FULFILLMENT_' + nextStatus.toUpperCase().replace(/\s+/g, '_'),
        details: 'Server-authorized seller lifecycle transition: ' + order.pstpStatus + ' -> ' + nextStatus + '.',
        ipAddress: 'server',
        deviceInfo: 'PiNova Seller Fulfillment API'
      });

      return json(res, 200, {
        ok: true,
        order: updated,
        serverAuthoritative: true,
        escrowStatus: updated.escrowStatus,
        pstpStatus: updated.pstpStatus
      });
    }

    if (req.method === 'POST' && path.endsWith('/confirm-receipt')) {
      const orderId = path.slice(0, -'/confirm-receipt'.length).replace(/\/$/, '');
      const order = await getDurableOrder(orderId);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      if (order.buyerUsername !== user.username && !(user.roles || []).includes('PLATFORM_ADMIN')) {
        return json(res, 403, { ok: false, error: 'BUYER_ORDER_OWNERSHIP_REQUIRED' });
      }
      if (order.serverVerified !== true) {
        return json(res, 409, { ok: false, error: 'ORDER_PAYMENT_NOT_SERVER_VERIFIED' });
      }
      if (order.pstpStatus !== 'Delivered') {
        return json(res, 409, {
          ok: false,
          error: 'RECEIPT_CONFIRMATION_REQUIRES_VERIFIED_DELIVERY',
          currentStatus: order.pstpStatus
        });
      }

      const timestamp = new Date().toISOString();
      const updated = await saveDurableOrder({
        ...order,
        pstpStatus: 'Completed',
        escrowStatus: 'released',
        updatedAt: timestamp,
        timeline: [
          ...(Array.isArray(order.timeline) ? order.timeline : []),
          {
            status: 'Buyer Confirmation',
            timestamp,
            actor: user.username,
            actorRole: 'buyer',
            note: 'Buyer confirmed receipt after server-recorded delivery; PSTP escrow release authorized.'
          },
          {
            status: 'Completed',
            timestamp,
            actor: 'system',
            actorRole: 'system',
            note: 'Order completed and PSTP escrow released after buyer confirmation.'
          }
        ],
      });

      pstpAuditRepo.appendLog({
        orderId: order.id,
        paymentId: order.piPaymentId,
        actor: user.username,
        actorRole: 'buyer',
        action: 'BUYER_RECEIPT_CONFIRMED_ESCROW_RELEASED',
        details: 'Buyer confirmed receipt after server-verified Delivered state; escrow released and order completed.',
        ipAddress: 'server',
        deviceInfo: 'PiNova PSTP Receipt Confirmation'
      });

      return json(res, 200, {
        ok: true,
        order: updated,
        serverAuthoritative: true,
        escrowStatus: updated.escrowStatus,
        pstpStatus: updated.pstpStatus
      });
    }

    if (req.method === 'POST' && !path) {
      const body = await readJson(req);
      if (!Array.isArray(body.items) || body.items.length === 0) return json(res, 400, { ok: false, error: 'ORDER_ITEMS_REQUIRED' });
      const key = idempotencyKey(req);
      if (!key) return json(res, 400, { ok: false, error: 'IDEMPOTENCY_KEY_REQUIRED' });
      if (key.length > 200) return json(res, 400, { ok: false, error: 'INVALID_IDEMPOTENCY_KEY' });

      const scopedKey = `${user.username}:orders:${key}`;
      const reservation = await idempotencyRepo.reserveIdempotencyKey(scopedKey, 'order-create:v1', requestHash(body));
      if (reservation.status === 'RESOLVED') return json(res, 200, reservation.cachedResult);
      if (reservation.status === 'IN_PROGRESS') return json(res, 409, { ok: false, error: 'ORDER_REQUEST_IN_PROGRESS' });
      if (reservation.status === 'CONFLICT') return json(res, 409, { ok: false, error: 'IDEMPOTENCY_KEY_PAYLOAD_CONFLICT' });

      try {
        const items: OrderItem[] = [];
        let subtotalPi = 0;
        let discountPi = 0;
        let shippingPi = 0;
        const promoCode = String(body.promoCode || '').trim().toUpperCase();
        const physicalReservations = new Map<string, number>();
        for (const input of body.items) {
          const productId = String(input?.productId || '').trim();
          const quantity = Number.isInteger(input?.quantity) ? Number(input.quantity) : 0;
          if (!productId || quantity < 1) throw new Error('INVALID_ORDER_ITEM');
          const product = await getDurableProduct(productId);
          if (!product || product.isActive !== true || product.isDeleted === true) throw new Error(`PRODUCT_NOT_AVAILABLE:${productId}`);
          if (product.fulfillmentType !== 'digital_download' && product.fulfillmentType !== 'instant_key') physicalReservations.set(productId, (physicalReservations.get(productId) || 0) + quantity);
          const requestedVariantId = input?.customDetails?.variant?.id || input?.selectedVariant;
          let variantDeltaPi = 0;
          if (requestedVariantId) {
            const variant = Array.isArray(product.variants) ? product.variants.find((candidate) => candidate.id === requestedVariantId) : undefined;
            if (!variant) throw new Error(`PRODUCT_VARIANT_NOT_AVAILABLE:${productId}`);
            variantDeltaPi = Number(variant.priceDeltaPi || 0);
          }
          subtotalPi += (product.pricePi + variantDeltaPi) * quantity;
          items.push({ product, quantity, selectedVariant: input.selectedVariant, customDetails: input.customDetails });
        }

        if (promoCode) {
          const apps = await listDurableVendorApplications();
          const nowMs = Date.now();
          const promoOwners = apps.filter((app:any) =>
            app?.status === 'APPROVED' &&
            app?.verificationStatus === 'Verified' &&
            app?.sellerStatus === 'Active' &&
            Array.isArray(app?.promos)
          );
          const matches = promoOwners.flatMap((app:any) =>
            app.promos.filter((promo:any) =>
              promo?.active === true &&
              String(promo.code || '').toUpperCase() === promoCode &&
              Date.parse(promo.expiresAt) > nowMs
            ).map((promo:any) => ({ promo, sellerUsername: String(app.pioneerUsername) }))
          );
          if (matches.length === 0) throw new Error('INVALID_OR_EXPIRED_PROMO');
          const match = matches[0];
          const eligibleSubtotal = items.reduce((sum, item) => {
            if (item.product.sellerId !== match.sellerUsername) return sum;
            const variantDelta = Number(item.customDetails?.variant?.priceDeltaPi || 0);
            return sum + (item.product.pricePi + variantDelta) * item.quantity;
          }, 0);
          if (eligibleSubtotal < Number(match.promo.minPurchasePi)) throw new Error('PROMO_MINIMUM_SPEND_NOT_MET');
          discountPi = Math.min(eligibleSubtotal, eligibleSubtotal * (Number(match.promo.discountPercent) / 100));
        }
        const isPhysicalOrder = items.some((item) => item.product.category === 'physical');
        shippingPi = isPhysicalOrder ? 2.5 : 0;
        const totalPi = Math.max(0, subtotalPi - discountPi + shippingPi);
        const now = new Date().toISOString();
        const order: Order = {
          id: `ord_${Date.now()}_${randomBytes(6).toString('hex')}`,
          buyerUsername: user.username,
          items,
          totalPi,
          ...(promoCode ? { promoCode, discountPi, subtotalPi, shippingPi } : {}),
          escrowStatus: 'payment_pending',
          pstpStatus: 'Pending Payment',
          createdAt: now,
          updatedAt: now,
          timeline: [{ status: 'Pending Payment', timestamp: now, actor: user.username, actorRole: 'buyer', note: 'Order created; awaiting authoritative Pi payment verification.' }],
          serverVerified: false,
          securityFlag: false,
        };

        const reserved = await reserveDurableProductStockBatch([...physicalReservations.entries()].map(([id, quantity]) => ({ id, quantity })));
        if (!reserved && physicalReservations.size) throw new Error('INSUFFICIENT_STOCK');

        const saved = await saveDurableOrder(order);
        const response = { ok: true, order: saved };
        await idempotencyRepo.resolveIdempotencyKey(scopedKey, response);
        return json(res, 201, response);
      } catch (error) {
        await idempotencyRepo.releaseIdempotencyKey(scopedKey);
        return json(res, 409, { ok: false, error: error instanceof Error ? error.message : 'ORDER_CREATE_FAILED' });
      }
    }

    if (req.method === 'PATCH' && path) {
      const order = await getDurableOrder(path);
      if (!order) return json(res, 404, { ok: false, error: 'ORDER_NOT_FOUND' });
      const roles = user.roles || [];
      if (!canViewOrder(order, user.username, roles)) return json(res, 403, { ok: false, error: 'ORDER_ACCESS_DENIED' });
      const body = await readJson(req);
      const nextStatus = body.pstpStatus as PstpOrderStatus;
      const sellerLifecycleStatuses: PstpOrderStatus[] = [
        'Seller Accepted', 'Preparing Order', 'Packed', 'Shipped',
        'In Transit', 'Out for Delivery', 'Delivered', 'Completed'
      ];
      if (sellerLifecycleStatuses.includes(nextStatus)) {
        return json(res, 403, { ok: false, error: 'SELLER_LIFECYCLE_REQUIRES_FULFILLMENT_OR_CARRIER_EVIDENCE' });
      }
      const allowedBuyerStatuses: PstpOrderStatus[] = ['Buyer Confirmation', 'Cancelled', 'Refund Requested', 'Disputed'];
      if (!allowedBuyerStatuses.includes(nextStatus) && !roles.includes('PLATFORM_ADMIN') && !roles.includes('COMPLIANCE_OFFICER')) return json(res, 403, { ok: false, error: 'ORDER_STATUS_CHANGE_NOT_ALLOWED' });
      const escrowStatus = body.escrowStatus || order.escrowStatus;
      if (nextStatus === 'Completed' && order.serverVerified !== true) return json(res, 409, { ok: false, error: 'ORDER_PAYMENT_NOT_SERVER_VERIFIED' });
      const timestamp = new Date().toISOString();
      const updated = await saveDurableOrder({
        ...order,
        pstpStatus: nextStatus,
        escrowStatus,
        updatedAt: timestamp,
        timeline: [
          ...order.timeline,
          {
            status: nextStatus,
            timestamp,
            actor: user.username,
            actorRole: roles.includes('PLATFORM_ADMIN') ? 'admin' : 'buyer',
            note: String(body.note || ''),
          },
        ],
      });
      return json(res, 200, { ok: true, order: updated });
    }

    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    console.error('[orders-api]', error);
    return json(res, 400, { ok: false, error: error instanceof Error ? error.message : 'ORDER_API_FAILED' });
  }
}
