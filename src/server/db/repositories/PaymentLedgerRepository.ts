import { StorageEngine } from '../StorageEngine';
import { PaymentLedgerEntity } from '../types';

export class PaymentLedgerRepository {
  private engine: StorageEngine<PaymentLedgerEntity>;

  constructor() {
    this.engine = new StorageEngine<PaymentLedgerEntity>('payment_ledger', 'paymentId');
  }

  public recordApproval(paymentId: string, metadata?: Record<string, any>): PaymentLedgerEntity {
    const existing = this.engine.get(paymentId);
    const now = Date.now();
    const isoDate = new Date(now).toISOString();

    const record: PaymentLedgerEntity = {
      paymentId,
      orderId: metadata?.orderId || existing?.orderId,
      buyerUsername: metadata?.buyerUsername || existing?.buyerUsername,
      sellerName: metadata?.sellerName || existing?.sellerName,
      amountPi: metadata?.amountPi || existing?.amountPi,
      txid: existing?.txid,
      status: 'APPROVED',
      approvalStatus: 'APPROVED',
      completionStatus: existing?.completionStatus || 'PENDING',
      idempotencyKey: metadata?.idempotencyKey || existing?.idempotencyKey,
      timestamp: now,
      createdAt: existing?.createdAt || isoDate,
      updatedAt: isoDate,
      metadata: { ...(existing?.metadata || {}), ...(metadata || {}) }
    };

    this.engine.set(paymentId, record);
    return record;
  }

  public recordCompletion(paymentId: string, txid: string, metadata?: Record<string, any>): PaymentLedgerEntity {
    const existing = this.engine.get(paymentId);
    const now = Date.now();
    const isoDate = new Date(now).toISOString();

    const record: PaymentLedgerEntity = {
      paymentId,
      orderId: metadata?.orderId || existing?.orderId,
      buyerUsername: metadata?.buyerUsername || existing?.buyerUsername,
      sellerName: metadata?.sellerName || existing?.sellerName,
      amountPi: metadata?.amountPi || existing?.amountPi,
      txid,
      status: 'COMPLETED',
      approvalStatus: 'APPROVED',
      completionStatus: 'COMPLETED',
      verifiedAt: isoDate,
      idempotencyKey: metadata?.idempotencyKey || existing?.idempotencyKey,
      timestamp: now,
      createdAt: existing?.createdAt || isoDate,
      updatedAt: isoDate,
      metadata: { ...(existing?.metadata || {}), ...(metadata || {}) }
    };

    this.engine.set(paymentId, record);
    return record;
  }

  public recordCancellation(paymentId: string, reason?: string): PaymentLedgerEntity | null {
    const existing = this.engine.get(paymentId);
    if (!existing) {
      return null;
    }
    const now = Date.now();
    const isoDate = new Date(now).toISOString();
    const updated: PaymentLedgerEntity = {
      ...existing,
      status: 'CANCELLED',
      updatedAt: isoDate,
      metadata: {
        ...(existing.metadata || {}),
        cancelReason: reason || 'Cancelled by user/system'
      }
    };
    this.engine.set(paymentId, updated);
    return updated;
  }

  public findByPaymentId(paymentId: string): PaymentLedgerEntity | null {
    return this.engine.get(paymentId);
  }

  public findByTxid(txid: string): PaymentLedgerEntity | null {
    return this.engine.find((p) => p.txid === txid);
  }

  public findByOrderId(orderId: string): PaymentLedgerEntity | null {
    return this.engine.find((p) => p.orderId === orderId);
  }

  public getAll(): PaymentLedgerEntity[] {
    return this.engine.getAll();
  }

  public count(): number {
    return this.engine.count();
  }
}
