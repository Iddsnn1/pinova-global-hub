import { get, list, put } from '@vercel/blob';
import type { Order } from '../../types';

const PREFIX = 'marketplace-orders/';

function enabled(): boolean {
  return Boolean(process.env.PRIVATE_BLOB_STORE_ID);
}

function blobOptions() {
  const storeId = process.env.PRIVATE_BLOB_STORE_ID;
  if (!storeId) throw new Error('PRIVATE_BLOB_STORE_ID_UNAVAILABLE');
  return { storeId };
}

function keyFor(id: string): string {
  return `${PREFIX}${encodeURIComponent(String(id).trim())}.json`;
}

async function readPath(pathname: string): Promise<Order | null> {
  if (!enabled()) return null;
  const page = await list({ prefix: pathname, limit: 10, ...blobOptions() });
  if (!page.blobs.some((blob) => blob.pathname === pathname)) return null;
  const result = await get(pathname, { access: 'private', useCache: false, ...blobOptions() });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const chunks: Uint8Array[] = [];
  const reader = result.stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as Order;
}

async function listAll(): Promise<Order[]> {
  if (!enabled()) return [];
  const orders: Order[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor, ...blobOptions() });
    for (const blob of page.blobs) {
      const order = await readPath(blob.pathname);
      if (order) orders.push(order);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return orders;
}

export function durableOrderStorageEnabled(): boolean {
  return enabled();
}

export async function getDurableOrder(id: string): Promise<Order | null> {
  if (!id?.trim() || !enabled()) return null;
  return readPath(keyFor(id));
}

export async function listDurableOrders(buyerUsername?: string): Promise<Order[]> {
  const orders = await listAll();
  return orders
    .filter((order) => order.isDeleted !== true)
    .filter((order) => !buyerUsername || order.buyerUsername === buyerUsername);
}

export async function saveDurableOrder(order: Order): Promise<Order> {
  if (!enabled()) throw new Error('DURABLE_ORDER_STORAGE_UNAVAILABLE');
  const existing = await getDurableOrder(order.id);
  const now = new Date().toISOString();
  const normalized: Order = {
    ...order,
    buyerUsername: String(order.buyerUsername || '').trim(),
    totalPi: Number(order.totalPi),
    items: Array.isArray(order.items) ? order.items : [],
    timeline: Array.isArray(order.timeline) ? order.timeline : [],
    isDeleted: order.isDeleted ?? false,
    createdAt: existing?.createdAt ?? order.createdAt ?? now,
    updatedAt: now,
  };
  if (!normalized.id || !normalized.buyerUsername) throw new Error('ORDER_ID_AND_BUYER_REQUIRED');
  if (!Number.isFinite(normalized.totalPi) || normalized.totalPi < 0) throw new Error('INVALID_ORDER_TOTAL');
  if (!normalized.items.length) throw new Error('ORDER_ITEMS_REQUIRED');

  await put(keyFor(normalized.id), JSON.stringify(normalized), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    ...blobOptions(),
  });
  return normalized;
}

export async function markDurableOrderPaymentVerified(
  id: string,
  piPaymentId: string,
  piTxid?: string,
): Promise<Order | null> {
  const existing = await getDurableOrder(id);
  if (!existing || existing.isDeleted === true) return null;
  if (!piPaymentId.trim()) throw new Error('PI_PAYMENT_ID_REQUIRED');

  const timestamp = new Date().toISOString();
  return saveDurableOrder({
    ...existing,
    piPaymentId: piPaymentId.trim(),
    piTxid: piTxid?.trim() || existing.piTxid,
    serverVerified: true,
    pstpStatus: 'Payment Verified',
    escrowStatus: 'approved',
    updatedAt: timestamp,
    timeline: [
      ...existing.timeline,
      {
        status: 'Payment Verified',
        timestamp,
        actor: 'system',
        actorRole: 'system',
        note: 'Pi payment server-verified; order may proceed to PSTP protection.',
      },
    ],
  });
}
