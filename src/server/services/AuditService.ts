import crypto from 'crypto';
import { PstpAuditRepository } from '../db/repositories/PstpAuditRepository';
import { PstpAuditLogEntity } from '../db/types';
import { AuthenticatedUser } from '../auth/types';

export interface RecordAuditParams {
  actor?: AuthenticatedUser | { id?: string; username: string; roles?: string[] };
  action: string;
  resourceType?: string;
  resourceId?: string;
  orderId?: string;
  paymentId?: string;
  correlationId?: string;
  result?: 'SUCCESS' | 'FAILURE' | 'REJECTED' | 'WARNING';
  details: string;
  metadata?: Record<string, any>;
  previousStateHash?: string;
  newStateHash?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export class AuditService {
  private static instance: AuditService | null = null;
  private auditRepo: PstpAuditRepository;

  public static getInstance(auditRepo?: PstpAuditRepository): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService(auditRepo || new PstpAuditRepository());
    }
    return AuditService.instance;
  }

  constructor(auditRepo: PstpAuditRepository) {
    this.auditRepo = auditRepo;
  }

  /**
   * Helper for recording PSTP and Education audit entries
   */
  public recordPstpAudit(params: {
    orderId?: string;
    paymentId?: string;
    actor: string;
    actorRole?: string;
    action: string;
    details: string;
    ipAddress?: string;
    deviceInfo?: string;
    metadata?: Record<string, any>;
  }): PstpAuditLogEntity {
    return this.recordEvent({
      orderId: params.orderId,
      paymentId: params.paymentId,
      actor: { username: params.actor, roles: params.actorRole ? [params.actorRole] : undefined },
      action: params.action,
      details: params.details,
      ipAddress: params.ipAddress,
      deviceInfo: params.deviceInfo,
      metadata: params.metadata
    });
  }

  /**
   * Authoritatively records an immutable audit event generated server-side.
   * Server derives actor role and actor identity strictly from verified credentials.
   */
  public recordEvent(params: RecordAuditParams): PstpAuditLogEntity {
    const eventId = `EVT-AUDIT-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const timestamp = new Date().toISOString();

    // Derive actor details strictly from authenticated identity
    let actorUsername = 'system';
    let actorId: string | undefined = undefined;
    let actorRole = 'system';

    if (params.actor) {
      actorUsername = params.actor.username;
      actorId = params.actor.id;
      if (Array.isArray(params.actor.roles) && params.actor.roles.length > 0) {
        actorRole = params.actor.roles[0];
      } else {
        actorRole = 'PIONEER';
      }
    }

    // Sanitize metadata to remove sensitive credentials (e.g. secret keys or raw passwords)
    const sanitizedMetadata: Record<string, any> = {};
    if (params.metadata && typeof params.metadata === 'object') {
      for (const [key, value] of Object.entries(params.metadata)) {
        if (/secret|token|password|key|private/i.test(key) && typeof value === 'string') {
          sanitizedMetadata[key] = '[REDACTED]';
        } else {
          sanitizedMetadata[key] = value;
        }
      }
    }

    const logEntry: PstpAuditLogEntity = {
      id: eventId,
      eventId,
      orderId: params.orderId,
      paymentId: params.paymentId,
      actor: actorUsername,
      actorId,
      actorRole,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      correlationId: params.correlationId || `CORR-${Date.now()}`,
      result: params.result || 'SUCCESS',
      details: params.details,
      ipAddress: params.ipAddress || '127.0.0.1',
      deviceInfo: params.deviceInfo || 'Pi Server / Automated Engine',
      timestamp,
      metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : undefined,
      previousStateHash: params.previousStateHash,
      newStateHash: params.newStateHash
    };

    return this.auditRepo.appendLog(logEntry);
  }

  /**
   * Sanitized recording for client telemetry.
   * Client-supplied actorRole is ALWAYS overridden to 'CLIENT_TELEMETRY' to prevent spoofing.
   */
  public recordClientTelemetry(
    body: {
      action?: string;
      details?: string;
      orderId?: string;
      paymentId?: string;
      metadata?: any;
    },
    authenticatedUser?: AuthenticatedUser,
    ip?: string,
    userAgent?: string
  ): PstpAuditLogEntity {
    return this.recordEvent({
      actor: authenticatedUser ? {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        roles: ['CLIENT_TELEMETRY'] // strictly isolated role
      } : {
        username: 'anonymous_client',
        roles: ['CLIENT_TELEMETRY']
      },
      action: body.action || 'CLIENT_TELEMETRY_PING',
      details: body.details ? String(body.details).slice(0, 500) : 'Client recorded telemetry',
      orderId: body.orderId,
      paymentId: body.paymentId,
      result: 'SUCCESS',
      ipAddress: ip,
      deviceInfo: userAgent,
      metadata: typeof body.metadata === 'object' ? body.metadata : undefined
    });
  }

  public getLogs(): PstpAuditLogEntity[] {
    return this.auditRepo.getAll();
  }
}
