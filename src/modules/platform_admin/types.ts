export type UserAccountType = 'Buyer' | 'Seller' | 'Business' | 'Merchant' | 'Administrator' | 'Staff';

export type UserAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'UNDER_REVIEW' | 'FLAGGED';

export type MarketplaceIdentityVerificationLevel = 'UNVERIFIED' | 'LEVEL_1_BASIC' | 'LEVEL_2_IDENTITY_VERIFIED' | 'LEVEL_3_ENTERPRISE_MERCHANT';
export type KYCVerificationLevel = MarketplaceIdentityVerificationLevel;

export interface IdentityVerificationDocumentRecord {
  id: string;
  documentType: 'GOVERNMENT_ID' | 'BUSINESS_REGISTRATION' | 'PROOF_OF_ADDRESS' | 'TAX_IDENTIFICATION' | 'STORE_FRONT_PHOTO';
  fileUrl: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerNotes?: string;
}
export type KYCDocumentRecord = IdentityVerificationDocumentRecord;

export interface UserAccountRecord {
  id: string;
  username: string;
  email: string;
  piWalletAddress: string;
  role: string;
  accountType: UserAccountType;
  status: UserAccountStatus;
  kycLevel: MarketplaceIdentityVerificationLevel;
  registeredAt: string;
  lastActiveAt: string;
  storeName?: string;
  businessRegistrationNumber?: string;
  kycDocuments: IdentityVerificationDocumentRecord[];
  activityLogsCount: number;
  riskScore: number; // 0 (Low) - 100 (High Risk)
  suspensionReason?: string;
}

export interface AccountActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  ipAddress: string; // Privacy-protected masked client IP
  userAgent: string;
  location: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export type PlatformRoleName = 
  | 'Super Administrator'
  | 'Platform Administrator'
  | 'Compliance Officer'
  | 'Finance Officer'
  | 'Operations Manager'
  | 'Support Manager'
  | 'Trust & Safety Moderator'
  | 'Content Moderator'
  | 'Marketing Manager'
  | 'Business Analyst'
  | 'Auditor';

export type PermissionCategory = 
  | 'Platform Governance'
  | 'User & Identity Management'
  | 'Catalog & Content Policy'
  | 'Utility & Billing Services'
  | 'Financial & Transactions'
  | 'Trust, Safety & Identity Verification'
  | 'System Configuration';

export interface GranularPermission {
  id: string;
  code: string;
  label: string;
  category: PermissionCategory;
  description: string;
}

export interface RolePermissionDefinition {
  roleId: string;
  roleName: string;
  isBuiltIn: boolean;
  permissions: string[]; // array of permission code strings
  description: string;
  userCount: number;
}

export interface ServiceHealthRecord {
  id: string;
  serviceName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'MAINTENANCE';
  latencyMs: number;
  uptimePercentage: number;
  errorRatePercentage: number;
  lastPingIso: string;
}

export interface LiveSystemMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeWebSocketConnections: number;
  piNodeSyncStatus: 'IN_SYNC' | 'CATCHING_UP' | 'DISCONNECTED';
  webhookQueueLength: number;
  databaseLatencyMs: number;
}

export interface OperationalKPIs {
  totalActiveUsers: number;
  totalActiveMerchants: number;
  totalActiveOrders: number;
  totalPiGmv: number;
  platformFeeEarningsPi: number;
  systemSlaPercent: number;
  disputeRatePercent: number;
}

export interface MarketplaceCategoryConfig {
  id: string;
  code: string;
  name: string;
  iconName: string;
  order: number;
  enabled: boolean;
  commissionRatePercent: number;
  productCount: number;
}

export interface UtilityServiceConfig {
  id: string;
  code: string;
  name: string;
  category: string;
  enabled: boolean;
  providerApiUrl: string;
  apiStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  feeMarkupPercent: number;
  dailyTxVolumePi: number;
}

export interface GlobalPlatformSettings {
  orderProtectionPolicyEnabled: boolean;
  maintenanceMode: boolean;
  piSdkRateLimitPerMin: number;
  kycEnforcementLevel: 'OPTIONAL' | 'BASIC_REQUIRED' | 'STRICT_KYC_REQUIRED';
  maxOrderAmountPi: number;
  autoApproveLevel1Kyc: boolean;
  systemAlertEmails: string[];
}

export interface SystemPlatformAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  component: string;
}

export interface GovernanceAuditRecord {
  id: string;
  adminUsername: string;
  adminRole: string;
  targetType: 'USER' | 'ROLE' | 'CATEGORY' | 'UTILITY' | 'SETTINGS' | 'SYSTEM' | 'DISPUTE' | 'FEATURE_FLAG' | 'INCIDENT';
  targetId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Dispute & Case Management
export type DisputeCaseStatus = 'OPEN' | 'IN_REVIEW' | 'AWAITING_EVIDENCE' | 'RESOLVED_BUYER_REFUND' | 'RESOLVED_SELLER_RELEASE' | 'DISMISSED';
export type DisputePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DisputeTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  notes?: string;
}

export interface AdminDisputeCase {
  id: string;
  orderId: string;
  buyerUsername: string;
  sellerUsername: string;
  disputeReason: string;
  amountPi: number;
  status: DisputeCaseStatus;
  priority: DisputePriority;
  moderatorAssigned?: string;
  createdAt: string;
  updatedAt: string;
  decisionNotes?: string;
  evidenceUrls?: string[];
  history: DisputeTimelineEvent[];
}

export interface DisputeAnalyticsSummary {
  totalCases: number;
  openCases: number;
  inReviewCases: number;
  awaitingEvidenceCases: number;
  resolvedBuyerRefundCount: number;
  resolvedSellerReleaseCount: number;
  dismissedCount: number;
  avgResolutionTimeHours: number;
  disputeRatePercent: number;
}

// API & Integration Monitoring
export interface IntegrationOperationalMetric {
  id: string;
  domainName: string; // e.g. 'Official Pi Platform API', 'Official Pi SDK Compatibility'
  category: 'PI_CORE' | 'MARKETPLACE' | 'AI_SERVICES' | 'NOTIFICATIONS' | 'LOCALIZATION' | 'UTILITY_PROVIDERS';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';
  latencyMs: number;
  uptimePercentage: number;
  errorRatePercentage: number;
  versionInfo: string;
  lastCheckedIso: string;
  details: string;
}

export interface HourlyUptimeTrendPoint {
  hourLabel: string;
  latencyMs: number;
  uptimePercent: number;
  requestVolume: number;
}

// Feature Rollout Management
export type FeatureFlagCategory = 'CORE_CHECKOUT' | 'COMMERCE' | 'AI_FEATURES' | 'UTILITIES' | 'LOCALIZATION' | 'ADMINISTRATION';
export type FeatureFlagStatus = 'ENABLED' | 'DISABLED' | 'BETA_TESTING' | 'REGIONAL_ROLLOUT';

export interface FeatureFlagHistoryEvent {
  timestamp: string;
  modifiedBy: string;
  change: string;
  reason: string;
}

export interface FeatureFlagRecord {
  id: string;
  key: string;
  name: string;
  description: string;
  category: FeatureFlagCategory;
  status: FeatureFlagStatus;
  rolloutPercentage: number; // 0 - 100
  targetRegions: string[];
  betaGroups: string[];
  isEmergencyKillswitchCapable: boolean;
  lastModifiedIso: string;
  modifiedBy: string;
  previousRolloutState?: FeatureFlagStatus;
  previousRolloutPercentage?: number;
  history: FeatureFlagHistoryEvent[];
}

// Backup & Recovery Monitoring
export interface HistoricalSnapshotRecord {
  id: string;
  timestampIso: string;
  type: 'AUTOMATED_HOURLY' | 'DAILY_SNAPSHOT' | 'MANUAL_ADMIN_SNAPSHOT' | 'PRE_DEPLOYMENT_CHECKPOINT';
  sizeMb: number;
  hash: string;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'ARCHIVED';
}

export interface BackupRecoveryStatus {
  lastBackupIso: string;
  backupType: 'AUTOMATED_HOURLY' | 'DAILY_SNAPSHOT' | 'MANUAL_ADMIN_SNAPSHOT';
  sizeMb: number;
  status: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED';
  databaseHealthScore: number; // 0 - 100
  configSnapshotHash: string;
  recoveryReadinessPercent: number;
  integrityCheckPassed: boolean;
  encryptedChecksum: string;
  lastTestedIso: string;
  historicalSnapshots: HistoricalSnapshotRecord[];
}

// Incident Management
export type IncidentSeverity = 'SEV_1_CRITICAL' | 'SEV_2_HIGH' | 'SEV_3_MEDIUM' | 'SEV_4_LOW';
export type IncidentStatus = 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
export type IncidentComponent = 'PI_PLATFORM_API' | 'UTILITY_PROVIDER_GATEWAY' | 'AI_SERVICE' | 'NOTIFICATION_DISPATCHER' | 'ESCROW_MONITOR' | 'AUTH_SERVICE';

export interface IncidentTimelineUpdate {
  id: string;
  timestampIso: string;
  updateText: string;
  updatedBy: string;
  status: IncidentStatus;
}

export interface SystemIncidentRecord {
  id: string;
  code: string;
  title: string;
  component: IncidentComponent;
  severity: IncidentSeverity;
  status: IncidentStatus;
  startedAtIso: string;
  resolvedAtIso?: string;
  impactSummary: string;
  rootCause?: string;
  timeline: IncidentTimelineUpdate[];
}

// Governance Dashboard
export interface RiskIndicatorMetric {
  id: string;
  category: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0 - 100
  description: string;
  recommendation: string;
}

export interface ExecutiveGovernanceMetrics {
  operationalComplianceScore: number; // 0 - 100
  securityScore: number; // 0 - 100
  marketplaceTrustScore: number; // 0 - 100
  systemReliabilityPercent: number;
  slaPerformancePercent: number;
  platformAvailabilityPercent: number;
  riskIndicators: RiskIndicatorMetric[];
}

