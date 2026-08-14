/**
 * Module 11 — Enterprise Developer Platform, Integration & Extensibility Engine
 * Type Definitions for PiNova Global Hub
 */

export type ApiVersion = 'v1' | 'v2' | 'v3-beta';

export type ApiEndpointCategory = 
  | 'PAYMENTS'
  | 'UTILITIES'
  | 'ORDERS'
  | 'CATALOG'
  | 'AI_ENGINE'
  | 'NOTIFICATIONS'
  | 'ANALYTICS'
  | 'SECURITY';

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  version: ApiVersion;
  category: ApiEndpointCategory;
  name: string;
  description: string;
  rateLimitPerMin: number;
  deprecated: boolean;
  deprecationNotice?: string;
  activeRequests24h: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  slaPercent: number;
  requiresAuth: boolean;
  requiredScope: string;
}

export type IntegrationCategory =
  | 'PAYMENT'
  | 'UTILITY'
  | 'SHIPPING'
  | 'NOTIFICATION'
  | 'AI_PROVIDER'
  | 'CRM_ERP'
  | 'ANALYTICS';

export interface IntegrationConnector {
  id: string;
  name: string;
  category: IntegrationCategory;
  provider: string;
  description: string;
  status: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED' | 'CONFIGURING';
  healthPercent: number;
  lastPingIso: string;
  apiDocsUrl: string;
  isCustomEndpointAllowed: boolean;
  activeConfig: Record<string, string>;
  supportedEvents: string[];
}

export interface WebhookSubscription {
  id: string;
  name: string;
  targetUrl: string;
  secretKeyMasked: string;
  events: string[];
  status: 'ACTIVE' | 'PAUSED' | 'FAILED_RETRYING';
  successRate24h: number;
  totalDelivered24h: number;
  createdIso: string;
  lastTriggeredIso: string;
}

export interface WebhookDeliveryLog {
  id: string;
  subscriptionId: string;
  eventType: string;
  targetUrl: string;
  payloadSnippet: string;
  statusCode: number;
  deliveryDurationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING' | 'DEAD_LETTER';
  timestampIso: string;
  retryCount: number;
  errorMessage?: string;
  signatureHeader: string;
}

export type PluginCategory =
  | 'MARKETPLACE'
  | 'UTILITY_EXT'
  | 'MERCHANT_TOOL'
  | 'AI_ASSISTANT'
  | 'ANALYTICS_EXT'
  | 'ADMIN_TOOL';

export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  category: PluginCategory;
  author: string;
  description: string;
  installed: boolean;
  enabled: boolean;
  updateAvailable: boolean;
  latestVersion: string;
  healthStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  permissions: string[];
  lastUpdatedIso: string;
  iconName: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: 'SANDBOX' | 'STAGING' | 'PRODUCTION' | 'ALL';
  moduleTarget: string;
  rolloutPercent: number;
  lastModifiedIso: string;
  modifiedBy: string;
}

export type EnvironmentProfile = 'SANDBOX' | 'STAGING' | 'PRODUCTION';

export interface RuntimeConfigProfile {
  environment: EnvironmentProfile;
  gatewayBaseUrl: string;
  defaultRateLimitPerMin: number;
  hmacSignatureHeader: string;
  webhookMaxRetries: number;
  strictSslEnforcement: boolean;
  debugLogLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  maxPayloadSizeBytes: number;
}

export interface EventBusMessage {
  id: string;
  topic: string;
  sourceModule: string;
  payloadSummary: string;
  publishedIso: string;
  status: 'DISPATCHED' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'DLQ_FAILED';
  subscribersCount: number;
}

export interface BackgroundJob {
  id: string;
  name: string;
  queue: 'HIGH_PRIORITY' | 'DEFAULT' | 'BATCH_LOW';
  status: 'RUNNING' | 'QUEUED' | 'COMPLETED' | 'FAILED' | 'SCHEDULED';
  progressPercent: number;
  attempts: number;
  maxAttempts: number;
  scheduledIso: string;
  executedIso?: string;
  errorLog?: string;
}

export interface DeveloperApiKey {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  role: 'READ_ONLY' | 'FULL_DEVELOPER' | 'ADMIN_INTEGRATION';
  scopes: string[];
  createdIso: string;
  lastUsedIso: string;
  rateLimitPerMin: number;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export interface DeveloperOAuthClient {
  id: string;
  clientId: string;
  clientName: string;
  redirectUris: string[];
  allowedScopes: string[];
  status: 'ACTIVE' | 'SUSPENDED';
  createdIso: string;
}

export interface ObservabilityMetric {
  timestampIso: string;
  totalApiRequests: number;
  avgResponseTimeMs: number;
  errorCount: number;
  activeWebhooks: number;
  queueBacklog: number;
  systemHealthPercent: number;
}

export interface DeveloperAuditLog {
  id: string;
  timestamp: string;
  actorUsername: string;
  actorRole: string;
  action: string;
  module: string;
  integration: string;
  eventType: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  clientIdentifier: string;
  details: string;
}

export interface DeveloperPlatformHealthSummary {
  overallStatus: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
  activeEndpointsCount: number;
  connectedIntegrationsCount: number;
  activePluginsCount: number;
  webhookSuccessRate24h: number;
  avgApiLatencyMs: number;
  apiSlaPercentage: number;
  activeJobsInQueue: number;
}
