import { StorageEngine } from '../StorageEngine';
import { FlightFulfillmentEntity } from '../types';

export class FlightFulfillmentRepository {
  private engine: StorageEngine<FlightFulfillmentEntity>;

  constructor() {
    this.engine = new StorageEngine<FlightFulfillmentEntity>('flight_fulfillments', 'key');
  }

  public recordBooking(key: string, booking: Omit<FlightFulfillmentEntity, 'id' | 'key'> & { id?: string }): FlightFulfillmentEntity {
    const record: FlightFulfillmentEntity = {
      id: booking.id || `FLT-BOK-${Date.now()}`,
      key,
      paymentId: booking.paymentId,
      pnr: booking.pnr,
      bookingReference: booking.bookingReference,
      ticketNumber: booking.ticketNumber,
      bookingStatus: booking.bookingStatus,
      provider: booking.provider,
      passengerName: booking.passengerName,
      timestamp: booking.timestamp || new Date().toISOString(),
      idempotencyKey: booking.idempotencyKey,
      metadata: booking.metadata
    };

    this.engine.set(key, record);
    return record;
  }

  public findByKey(key: string): FlightFulfillmentEntity | null {
    return this.engine.get(key);
  }

  public findByPaymentId(paymentId: string): FlightFulfillmentEntity | null {
    return this.engine.find((f) => f.paymentId === paymentId);
  }

  public findByPnr(pnr: string): FlightFulfillmentEntity | null {
    return this.engine.find((f) => f.pnr === pnr);
  }

  public getAll(): FlightFulfillmentEntity[] {
    return this.engine.getAll();
  }

  public count(): number {
    return this.engine.count();
  }
}
