import { Order, PstpOrderStatus, EscrowStatus } from '../../../types';
import { StorageEngine } from '../StorageEngine';

/**
 * Authoritative server-side order persistence boundary.
 * Production orders are created only from authenticated checkout flows.
 * No fabricated order seed is permitted.
 */
export class OrderRepository {
  private engine: StorageEngine<Order>;

  constructor() {
    this.engine = new StorageEngine<Order>('marketplace_orders', 'id', []);
  }

  public getAll(options?: { includeDeleted?: boolean; buyerUsername?: string }): Order[] {
    const includeDeleted = options?.includeDeleted === true;
    return this.engine.getAll().filter((order) => {
      if (!includeDeleted && order.isDeleted === true) return false;
      if (options?.buyerUsername && order.buyerUsername !== options.buyerUsername) return false;
      return true;
    });
  }

  public findById(id: string, includeDeleted = false): Order | undefined {
    const order = this.engine.get(id);
    if (!order) return undefined;
    if (!includeDeleted && order.isDeleted === true) return undefined;
    return order;
  }

  public findByBuyer(buyerUsername: string): Order[] {
    return this.getAll({ buyerUsername });
  }

  public save(order: Order): Order {
    const now = new Date().toISOString();
    const existing = this.engine.get(order.id);
    const normalized: Order = {
      ...order,
      buyerUsername: order.buyerUsername.trim(),
      totalPi: Number(order.totalPi),
      items: Array.isArray(order.items) ? order.items : [],
      timeline: Array.isArray(order.timeline) ? order.timeline : [],
      isDeleted: order.isDeleted ?? false,
      createdAt: existing?.createdAt ?? order.createdAt ?? now,
      updatedAt: now,
    };

    if (!normalized.id || !normalized.buyerUsername) {
      throw new Error('ORDER_ID_AND_BUYER_REQUIRED');
    }
    if (!Number.isFinite(normalized.totalPi) || normalized.totalPi < 0) {
      throw new Error('INVALID_ORDER_TOTAL');
    }
    if (!normalized.items.length) {
      throw new Error('ORDER_ITEMS_REQUIRED');
    }

    this.engine.set(normalized.id, normalized);
    return normalized;
  }

  public updateStatus(
    id: string,
    pstpStatus: PstpOrderStatus,
    escrowStatus: EscrowStatus,
    actor: string,
    actorRole: 'buyer' | 'seller' | 'admin' | 'system',
    note?: string,
  ): Order | undefined {
    const existing = this.engine.get(id);
    if (!existing || existing.isDeleted === true) return undefined;

    const timestamp = new Date().toISOString();
    const updated: Order = {
      ...existing,
      pstpStatus,
      escrowStatus,
      updatedAt: timestamp,
      timeline: [
        ...existing.timeline,
        { status: pstpStatus, timestamp, actor, actorRole, note },
      ],
    };
    this.engine.set(id, updated);
    return updated;
  }

  public markPaymentVerified(id: string, piPaymentId: string, piTxid?: string): Order | undefined {
    const existing = this.engine.get(id);
    if (!existing || existing.isDeleted === true) return undefined;
    if (!piPaymentId.trim()) throw new Error('PI_PAYMENT_ID_REQUIRED');

    const timestamp = new Date().toISOString();
    const updated: Order = {
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
    };
    this.engine.set(id, updated);
    return updated;
  }

  public softDelete(id: string): boolean {
    const existing = this.engine.get(id);
    if (!existing) return false;
    this.engine.set(id, { ...existing, isDeleted: true, updatedAt: new Date().toISOString() });
    return true;
  }
}
