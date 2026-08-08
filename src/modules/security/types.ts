export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SecurityAlertCategory = 'AUTH' | 'FRAUD' | 'DEVICE' | 'POLICY' | 'THREAT' | 'PRIVACY';

export type ReportCategory = 'SPAM' | 'FRAUD' | 'COUNTERFEIT' | 'HARASSMENT' | 'POLICY_VIOLATION' | 'OTHER';

export type ReportTargetType = 'USER' | 'LISTING' | 'MESSAGE' | 'STORE';

export type FraudTargetType = 'BUYER' | 'SELLER' | 'STORE' | 'LISTING' | 'TRANSACTION';

export interface MfaConfig {
  enabled: boolean;
  method: 'AUTHENTICATOR_APP' | 'SMS_PIN' | 'EMAIL_OTP';
  secretKey?: string;
  verifiedAt?: string;
  backupCodesCount: number;
}

export interface UserSessionRecord {
  sessionId: string;
  userId: string;
  username: string;
  deviceFingerprint: string;
  deviceName: string;
  deviceType: 'MOBILE_PI_BROWSER' | 'DESKTOP_CHROME' | 'DESKTOP_SAFARI' | 'TABLET_PI_BROWSER';
  ipAddress: string; // Privacy-protected / masked IP (e.g. 192.168.1.***)
  location: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrentSession: boolean;
  trusted: boolean;
}

export interface TrustedDeviceRecord {
  id: string;
  deviceName: string;
  deviceType: string;
  fingerprint: string;
  ipAddress: string; // Privacy masked
  registeredIso: string;
  lastUsedIso: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface LoginHistoryRecord {
  id: string;
  userId: string;
  username: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'MFA_CHALLENGE' | 'PASSWORD_CHANGE' | 'RECOVERY_INITIATED' | 'REVOKED_SESSION';
  ipAddress: string; // Privacy-masked client ID
  location: string;
  userAgent: string;
  timestamp: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface SecurityAlertItem {
  id: string;
  severity: RiskLevel;
  category: SecurityAlertCategory;
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolutionNote?: string;
  targetId?: string;
}

export interface SecurityScoreBreakdown {
  overallScore: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  mfaScore: number;
  sessionScore: number;
  deviceScore: number;
  privacyScore: number;
  policyScore: number;
  recommendations: string[];
}

export interface FraudAnalysisRecord {
  id: string;
  targetId: string;
  targetName: string;
  targetType: FraudTargetType;
  riskScore: number; // 0 (Safe) to 100 (Critical Risk)
  riskLevel: RiskLevel;
  triggerRules: string[];
  velocityMetrics: {
    txCount24h: number;
    totalPi24h: number;
    cancelRatePct: number;
    duplicateIpMatches: number;
  };
  aiConfidenceScore: number; // 0 to 100
  aiReasoning: string;
  status: 'PENDING_REVIEW' | 'FLAGGED' | 'CLEARED' | 'ACTION_TAKEN';
  createdAt: string;
  reviewedBy?: string;
  actionTaken?: string;
}

export interface AbuseReportItem {
  id: string;
  reporterUsername: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  reasonCategory: ReportCategory;
  details: string;
  evidenceUrls?: string[];
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DISMISSED';
  submittedAt: string;
  resolutionNotes?: string;
  reviewedBy?: string;
}

export interface ContentModerationItem {
  id: string;
  contentType: 'REVIEW' | 'PRODUCT_TITLE' | 'PRODUCT_DESCRIPTION' | 'STORE_BIO' | 'MESSAGE';
  contentId: string;
  authorUsername: string;
  rawText: string;
  flagReason: string;
  flaggedByAi: boolean;
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'QUARANTINED';
  createdAt: string;
  reviewerNotes?: string;
}

export interface PrivacyConsentSettings {
  analyticsCookies: boolean;
  marketingConsent: boolean;
  thirdPartyDataSharing: boolean;
  personalizedAds: boolean;
  searchIndexing: boolean;
  dataRetentionDays: number;
  privacyNoticeVersion: string;
}

export interface DataExportRequest {
  id: string;
  username: string;
  requestedAt: string;
  status: 'PROCESSING' | 'READY' | 'EXPIRED';
  fileSizeMb?: number;
}

export interface ThreatIncidentRecord {
  id: string;
  incidentTitle: string;
  severity: RiskLevel;
  threatType: 'BRUTE_FORCE_ATTEMPT' | 'API_VELOCITY_SPIKE' | 'SUSPICIOUS_LOCATION_HOP' | 'MALICIOUS_BOT_PATTERN' | 'DUPLICATE_ACCOUNT_CLUSTER';
  status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
  detectedAt: string;
  impactedCount: number;
  mitigationSteps: string;
}

export interface ServiceHealthItem {
  service: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  uptimePct: number;
  latencyMs: number;
}

export interface BusinessContinuityStatus {
  overallHealth: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE_MODE';
  applicationBackupStatus: 'SYNCHRONIZED' | 'BACKUP_IN_PROGRESS';
  serviceContinuityRegion: string;
  rpoMinutes: number;
  rtoMinutes: number;
  lastDrillIso: string;
  lastSnapshotIso: string;
  activeServices: ServiceHealthItem[];
}

export interface EnterpriseAuditRecord {
  id: string;
  timestamp: string;
  actorUsername: string;
  actorRole: string;
  action: string;
  module: string;
  eventType: string;
  riskLevel: RiskLevel;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  clientIdentifier: string; // Privacy-Protected / Masked Client IP / Hashed ID
  details: string;
}

export interface SecurityPolicySettings {
  enforceMfaForAdmins: boolean;
  requireDeviceVerificationForHighPi: boolean;
  autoQuarantineSuspiciousReviews: boolean;
  piSdkApiRequestLimitPerMin: number;
  maxFailedLoginAttempts: number;
  sessionTimeoutHours: number;
  fraudAlertThresholdScore: number;
}
