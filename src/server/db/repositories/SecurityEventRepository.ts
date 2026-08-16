import { StorageEngine } from '../StorageEngine';
import { SecurityEventEntity } from '../types';

const INITIAL_SECURITY_EVENTS: SecurityEventEntity[] = [
  {
    id: 'SEC-EVT-501',
    eventType: 'suspicious_login',
    severity: 'medium',
    username: 'Pioneer_Guest',
    ip: '192.0.2.14',
    device: 'Safari 17 / iPhone 15 Pro',
    location: 'London, UK',
    details: 'New device login detected. Verified via Pi SDK session token.',
    resolved: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'SEC-EVT-502',
    eventType: 'large_transaction',
    severity: 'high',
    username: 'Enterprise_Buyer_01',
    ip: '203.0.113.88',
    device: 'Pi Browser 1.8 / Android 14',
    location: 'Singapore',
    details: 'Transaction of 4,500.00 π passed server verification & anti-fraud rate limit check.',
    resolved: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export class SecurityEventRepository {
  private engine: StorageEngine<SecurityEventEntity>;

  constructor() {
    this.engine = new StorageEngine<SecurityEventEntity>('security_events', 'id', INITIAL_SECURITY_EVENTS);
  }

  public recordEvent(event: Omit<SecurityEventEntity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): SecurityEventEntity {
    const now = new Date().toISOString();
    const record: SecurityEventEntity = {
      id: event.id || `SEC-EVENT-${Date.now()}`,
      eventType: event.eventType,
      severity: event.severity,
      username: event.username,
      ip: event.ip,
      device: event.device,
      location: event.location,
      details: event.details,
      resolved: event.resolved ?? false,
      createdAt: now,
      updatedAt: now
    };

    this.engine.unshift(record);
    return record;
  }

  public getAll(): SecurityEventEntity[] {
    return this.engine.getAll();
  }

  public findById(id: string): SecurityEventEntity | null {
    return this.engine.get(id);
  }
}
