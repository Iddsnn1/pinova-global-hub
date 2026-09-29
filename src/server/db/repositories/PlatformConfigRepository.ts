import { StorageEngine } from '../StorageEngine';

export interface PricingConfigEntity {
  id: string;
  piRateUsd: number; // Fixed PiNova reference value; not admin-editable.
  minPurchasePi: number;
  maxPurchasePi: number;
  currencyCode: string;
  currencySymbol: string;
  autoRateUpdateEnabled: boolean; // Live market feeds may be used for display only.
  autoUpdateSource: string;
  lastUpdated: string;
  updatedBy: string;
  disclaimer: string;
}

export interface PricingAuditLogEntity {
  id: string;
  timestamp: string;
  previousRate: number;
  newRate: number;
  currency: string;
  updatedBy: string;
  source: string;
  ipAddress: string;
}

const DEFAULT_PRICING_CONFIG: PricingConfigEntity = {
  id: 'current_pricing',
  piRateUsd: 314159.00,
  minPurchasePi: 0.000001,
  maxPurchasePi: 1000.00,
  currencyCode: 'USD',
  currencySymbol: '$',
  autoRateUpdateEnabled: false,
  autoUpdateSource: 'PiNova Reference Value — Community-Supported Target',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Platform Governance Engine',
  disclaimer: 'PiNova reference value: 1 π = $314,159 USD. This is a community-supported application reference, not an official Pi Network market rate. Native Pi settlement remains authoritative; other currencies are display conversions.'
};

export class PlatformConfigRepository {
  private configEngine: StorageEngine<PricingConfigEntity>;
  private auditEngine: StorageEngine<PricingAuditLogEntity>;

  constructor() {
    this.configEngine = new StorageEngine<PricingConfigEntity>('platform_pricing_config', 'id', [DEFAULT_PRICING_CONFIG]);
    this.auditEngine = new StorageEngine<PricingAuditLogEntity>('pricing_audit_logs', 'id');
  }

  public getConfig(): PricingConfigEntity {
    return this.configEngine.get('current_pricing') || DEFAULT_PRICING_CONFIG;
  }

  public updateConfig(newConfig: Partial<PricingConfigEntity>): PricingConfigEntity {
    const current = this.getConfig();
    const updated: PricingConfigEntity = {
      ...current,
      ...newConfig,
      id: 'current_pricing',
      lastUpdated: new Date().toISOString()
    };
    this.configEngine.set('current_pricing', updated);
    return updated;
  }

  public addAuditLog(log: Omit<PricingAuditLogEntity, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): PricingAuditLogEntity {
    const record: PricingAuditLogEntity = {
      id: log.id || `PRC-LOG-${Date.now()}`,
      timestamp: log.timestamp || new Date().toISOString(),
      previousRate: log.previousRate,
      newRate: log.newRate,
      currency: log.currency || 'USD',
      updatedBy: log.updatedBy || 'Platform Admin',
      source: log.source || 'Admin Console',
      ipAddress: log.ipAddress || '127.0.0.1'
    };
    this.auditEngine.unshift(record);
    return record;
  }

  public getAuditLogs(): PricingAuditLogEntity[] {
    return this.auditEngine.getAll();
  }
}
