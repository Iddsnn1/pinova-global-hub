import { StorageEngine } from '../StorageEngine';
import { PstpAuditLogEntity } from '../types';

const INITIAL_AUDIT_LOGS: PstpAuditLogEntity[] = [
  {
    id: 'LOG-UUID-9001',
    orderId: 'ORD-PI-778210',
    paymentId: 'PAY-PI-449102',
    actor: 'system',
    actorRole: 'system',
    action: 'PAYMENT_SERVER_APPROVED',
    details: 'Pi Platform API v2 payment verification completed with 256-bit signature validation.',
    ipAddress: '127.0.0.1',
    deviceInfo: 'Pi Nova Core Escrow Engine',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'LOG-UUID-9002',
    orderId: 'ORD-PI-778210',
    paymentId: 'PAY-PI-449102',
    actor: 'TechPulse_Official',
    actorRole: 'seller',
    action: 'ORDER_STATUS_CHANGED',
    details: 'Order status updated from "Payment Verified" to "Shipped". Carrier: FedEx Express, Tracking: FX-9921-PI.',
    ipAddress: '198.51.100.44',
    deviceInfo: 'Merchant Workstation / Chrome 124',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

export class PstpAuditRepository {
  private engine: StorageEngine<PstpAuditLogEntity>;

  constructor() {
    this.engine = new StorageEngine<PstpAuditLogEntity>('pstp_audit_logs', 'id', INITIAL_AUDIT_LOGS);
  }

  public appendLog(entry: Omit<PstpAuditLogEntity, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): PstpAuditLogEntity {
    const log: PstpAuditLogEntity = {
      id: entry.id || `LOG-UUID-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId: entry.orderId,
      paymentId: entry.paymentId,
      actor: entry.actor || 'system',
      actorRole: entry.actorRole || 'system',
      action: entry.action || 'AUDIT_EVENT',
      details: entry.details || 'PSTP Security Audit Log Entry',
      ipAddress: entry.ipAddress || '127.0.0.1',
      deviceInfo: entry.deviceInfo || 'Pi Browser Web',
      timestamp: entry.timestamp || new Date().toISOString()
    };

    this.engine.unshift(log);
    return log;
  }

  public getAll(): PstpAuditLogEntity[] {
    return this.engine.getAll();
  }

  public findByOrderId(orderId: string): PstpAuditLogEntity[] {
    return this.engine.filter((l) => l.orderId === orderId);
  }

  public findByPaymentId(paymentId: string): PstpAuditLogEntity[] {
    return this.engine.filter((l) => l.paymentId === paymentId);
  }

  public count(): number {
    return this.engine.count();
  }
}
