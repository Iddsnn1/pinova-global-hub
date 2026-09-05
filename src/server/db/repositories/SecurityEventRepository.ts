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

export const ALLOWED_SECURITY_EVENT_TYPES = [
  'suspicious_login',
  'large_transaction',
  'failed_verification',
  'rate_limit_hit',
  'client_sdk_anomaly',
  'tamper_detected',
  'unauthorized_access_attempt',
  'idempotency_collision',
  'auth_failure',
  'security_audit'
] as const;

export class SecurityEventRepository {
  private engine: StorageEngine<SecurityEventEntity>;

  constructor() {
    this.engine = new StorageEngine<SecurityEventEntity>('security_events', 'id', INITIAL_SECURITY_EVENTS);
  }

  public recordEvent(event: Omit<SecurityEventEntity, 'id' | 'createdAt' | 'updatedAt' | 'ip' | 'device' | 'resolved'> & { id?: string; ip?: string; device?: string; resolved?: boolean }): SecurityEventEntity {
    // Validate event type against allowlist
    const normalizedType = (event.eventType || '').toLowerCase().trim();
    const isAllowed = ALLOWED_SECURITY_EVENT_TYPES.some((t) => t === normalizedType);
    if (!isAllowed) {
      throw new Error(`Invalid or disallowed security eventType: "${event.eventType}". Must match registered allowlist.`);
    }

    const now = new Date().toISOString();
    const record: SecurityEventEntity = {
      id: event.id || `SEC-EVENT-${Date.now()}`,
      eventType: normalizedType,
      severity: event.severity || 'medium',
      username: event.username,
      actorId: event.actorId,
      correlationId: event.correlationId || `CORR-SEC-${Date.now()}`,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      ip: event.ip,
      device: event.device,
      location: event.location,
      details: event.details ? String(event.details).slice(0, 1000) : 'Security event recorded',
      metadata: event.metadata,
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
