import { StorageEngine } from '../StorageEngine';
import { FlightFulfillmentEntity } from '../types';

export class FlightFulfillmentRepository {
  private engine: StorageEngine<FlightFulfillmentEntity>;

  constructor() {
    this.engine = new StorageEngine<FlightFulfillmentEntity>('flight_fulfillments', 'key');
  }

  public recordBooking(key: string, booking: Omit<FlightFulfillmentEntity, 'id' | 'key'> & { id?: string }): FlightFulfillmentEntity {
    const existing = this.engine.get(key) || this.findByPaymentId(booking.paymentId);
    const now = new Date().toISOString();
    const record: FlightFulfillmentEntity = {
      id: booking.id || existing?.id || `FLT-BOK-${Date.now()}`,
      key,
      paymentId: booking.paymentId,
      bookingAttemptId: booking.bookingAttemptId || existing?.bookingAttemptId,
      offerId: booking.offerId || existing?.offerId,
      idempotencyKey: booking.idempotencyKey || existing?.idempotencyKey,
      pnr: booking.pnr !== undefined ? booking.pnr : (existing?.pnr || null),
      bookingReference: booking.bookingReference,
      duffelOrderId: booking.duffelOrderId !== undefined ? booking.duffelOrderId : (existing?.duffelOrderId || null),
      ticketNumber: booking.ticketNumber !== undefined ? booking.ticketNumber : (existing?.ticketNumber || null),
      bookingStatus: booking.bookingStatus,
      reconciliationStatus: booking.reconciliationStatus || existing?.reconciliationStatus || 'NOT_REQUIRED',
      provider: booking.provider,
      passengerName: booking.passengerName,
      timestamp: booking.timestamp || existing?.timestamp || now,
      createdAt: existing?.createdAt || booking.createdAt || now,
      updatedAt: now,
      bookingMode: booking.bookingMode || existing?.bookingMode,
      isLiveBooking: booking.isLiveBooking !== undefined ? booking.isLiveBooking : existing?.isLiveBooking,
      message: booking.message || existing?.message,
      metadata: {
        ...(existing?.metadata || {}),
        ...(booking.metadata || {})
      }
    };

    this.engine.set(key, record);
    return record;
  }

  public updateBooking(key: string, updates: Partial<FlightFulfillmentEntity>): FlightFulfillmentEntity | null {
    const existing = this.engine.get(key) || (updates.paymentId ? this.findByPaymentId(updates.paymentId) : null);
    if (!existing) return null;
    const updated: FlightFulfillmentEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.engine.set(existing.key, updated);
    return updated;
  }

  public findByKey(key: string): FlightFulfillmentEntity | null {
    return this.engine.get(key);
  }

  public findByPaymentId(paymentId: string): FlightFulfillmentEntity | null {
    const clean = paymentId.trim();
    const direct = this.engine.get(clean);
    if (direct) return direct;
    return this.engine.find((f) => f.paymentId === clean);
  }

  public findByIdempotencyKey(idempotencyKey: string): FlightFulfillmentEntity | null {
    const clean = idempotencyKey.trim();
    const direct = this.engine.get(clean);
    if (direct) return direct;
    return this.engine.find((f) => f.idempotencyKey === clean);
  }

  public findByDuffelOrderId(duffelOrderId: string): FlightFulfillmentEntity | null {
    const clean = duffelOrderId.trim();
    return this.engine.find((f) => f.duffelOrderId === clean);
  }

  public findByOfferId(offerId: string): FlightFulfillmentEntity | null {
    const clean = offerId.trim();
    return this.engine.find((f) => f.offerId === clean);
  }

  public findByPnr(pnr: string): FlightFulfillmentEntity | null {
    const clean = pnr.trim();
    return this.engine.find((f) => f.pnr === clean || f.bookingReference === clean);
  }

  public getAll(): FlightFulfillmentEntity[] {
    return this.engine.getAll();
  }

  public count(): number {
    return this.engine.count();
  }
}
