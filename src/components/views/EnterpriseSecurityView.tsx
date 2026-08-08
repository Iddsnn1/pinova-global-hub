import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Smartphone,
  Laptop,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  Sliders,
  UserCheck,
  UserX,
  Eye,
  Search,
  Filter,
  Clock,
  Database,
  Server,
  Zap,
  Sparkles,
  Trash2,
  Info,
  Fingerprint,
  ChevronRight,
  Shield,
  Layers,
  Award,
  Bell,
  MessageSquare
} from 'lucide-react';

import { enterpriseSecurityEngine } from '../../modules/security/engine';
import {
  RiskLevel,
  SecurityAlertItem,
  FraudAnalysisRecord,
  AbuseReportItem,
  ContentModerationItem,
  EnterpriseAuditRecord
} from '../../modules/security/types';

interface EnterpriseSecurityViewProps {
  userRole?: string;
  onNavigateSection?: (section: string) => void;
}

export const EnterpriseSecurityView: React.FC<EnterpriseSecurityViewProps> = () => {
  const engine = enterpriseSecurityEngine;

  // Active Tab inside Enterprise Security Console
  const [activeTab, setActiveTab] = useState<
    'overview' | 'iam' | 'fraud' | 'trust_safety' | 'privacy' | 'continuity' | 'audit' | 'admin_policies'
  >('overview');

  // Interactive State
  const [mfaConfig, setMfaConfig] = useState(engine.getMfaConfig());
  const [sessions, setSessions] = useState(engine.getSessions());
  const [trustedDevices, setTrustedDevices] = useState(engine.getTrustedDevices());
  const [loginHistory] = useState(engine.getLoginHistory());
  const [alerts, setAlerts] = useState(engine.getSecurityAlerts());
  const [fraudRecords, setFraudRecords] = useState(engine.getFraudRecords());
  const [abuseReports, setAbuseReports] = useState(engine.getAbuseReports());
  const [moderationQueue, setModerationQueue] = useState(engine.getModerationQueue());
  const [privacyConsent, setPrivacyConsent] = useState(engine.getPrivacyConsent());
  const [businessContinuity, setBusinessContinuity] = useState(engine.getBusinessContinuity());
  const [policySettings, setPolicySettings] = useState(engine.getPolicySettings());
  const [auditLogs] = useState(engine.getAuditLogs());
  const scoreBreakdown = engine.getSecurityScoreBreakdown();

  // Audit Log Search & Filters
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('ALL');
  const [auditRiskFilter, setAuditRiskFilter] = useState<string>('ALL');

  // Modals & Triggers
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCodeInput, setMfaCodeInput] = useState('');
  const [mfaModalStep, setMfaModalStep] = useState<'qr' | 'success'>('qr');
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const [selectedFraudRecord, setSelectedFraudRecord] = useState<FraudAnalysisRecord | null>(null);
  const [selectedAbuseReport, setSelectedAbuseReport] = useState<AbuseReportItem | null>(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // New Abuse Report Form State
  const [reportTargetType, setReportTargetType] = useState<AbuseReportItem['targetType']>('LISTING');
  const [reportTargetId, setReportTargetId] = useState('');
  const [reportTargetTitle, setReportTargetTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<AbuseReportItem['reasonCategory']>('FRAUD');
  const [reportDetails, setReportDetails] = useState('');

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler: MFA Toggle
  const handleToggleMfa = () => {
    if (!mfaConfig.enabled) {
      setShowMfaModal(true);
      setMfaModalStep('qr');
    } else {
      const updated = engine.toggleMfa(false);
      setMfaConfig(updated);
      showToast('Multi-Factor Authentication (MFA) disabled.');
    }
  };

  const handleVerifyMfaCode = () => {
    if (mfaCodeInput.trim().length >= 4) {
      setMfaModalStep('success');
      const updated = engine.toggleMfa(true);
      setMfaConfig(updated);
      showToast('MFA enabled and verified successfully!');
    } else {
      showToast('Please enter a valid 6-digit verification code.');
    }
  };

  // Handler: Revoke Session
  const handleRevokeSession = (sessionId: string) => {
    const updated = engine.revokeSession(sessionId);
    setSessions(updated);
    showToast(`Session ${sessionId} revoked successfully.`);
  };

  // Handler: Revoke Trusted Device
  const handleRevokeDevice = (deviceId: string) => {
    const updated = engine.revokeTrustedDevice(deviceId);
    setTrustedDevices(updated);
    showToast('Device trust revoked.');
  };

  // Handler: Resolve Alert
  const handleResolveAlert = (alertId: string) => {
    const updated = engine.resolveAlert(alertId, 'Pi_Pioneer_01', 'Alert acknowledged and verified.');
    setAlerts(updated);
    showToast('Security alert resolved.');
  };

  // Handler: Fraud Record Status
  const handleUpdateFraudStatus = (recordId: string, status: FraudAnalysisRecord['status'], note: string) => {
    const updated = engine.updateFraudRecordStatus(recordId, status, 'ComplianceOfficer_01', note);
    setFraudRecords(updated);
    setSelectedFraudRecord(null);
    showToast(`Fraud analysis case updated to ${status}.`);
  };

  // Handler: Submit Abuse Report
  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTargetId.trim() || !reportDetails.trim()) {
      showToast('Please complete all required fields for the report.');
      return;
    }
    const newRep = engine.submitAbuseReport(
      'Pi_Pioneer_01',
      reportTargetType,
      reportTargetId,
      reportTargetTitle || reportTargetId,
      reportCategory,
      reportDetails
    );
    setAbuseReports([newRep, ...abuseReports]);
    setShowNewReportModal(false);
    setReportTargetId('');
    setReportTargetTitle('');
    setReportDetails('');
    showToast('Abuse report submitted to Trust & Safety moderation team.');
  };

  // Handler: Update Moderation Item
  const handleModerationAction = (itemId: string, status: ContentModerationItem['moderationStatus']) => {
    const updated = engine.updateModerationStatus(itemId, status, `Moderated by admin as ${status}`);
    setModerationQueue(updated);
    showToast(`Content moderation status set to ${status}.`);
  };

  // Handler: Toggle Privacy Consent
  const handleToggleConsent = (key: keyof typeof privacyConsent) => {
    const newSettings = { [key]: !privacyConsent[key] };
    const updated = engine.updatePrivacyConsent(newSettings);
    setPrivacyConsent(updated);
    showToast('Privacy preferences updated.');
  };

  // Handler: Download Personal Data JSON
  const handleDownloadPersonalData = () => {
    const jsonStr = engine.generatePersonalDataJson('Pi_Pioneer_01');
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pinova-user-privacy-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Personal marketplace data file generated and downloaded.');
  };

  // Handler: Export Audit Logs CSV
  const handleExportAuditCsv = () => {
    const csvStr = engine.exportAuditLogsCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pinova-enterprise-audit-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Enterprise audit log exported to CSV file.');
  };

  // Handler: Run Recovery Readiness Review
  const handleRunDrDrill = () => {
    const updated = engine.triggerDisasterRecoveryDrill();
    setBusinessContinuity(updated);
    showToast('Business Continuity Readiness Assessment executed successfully!');
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesQuery =
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.actorUsername.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesModule = auditModuleFilter === 'ALL' || log.module === auditModuleFilter;
    const matchesRisk = auditRiskFilter === 'ALL' || log.riskLevel === auditRiskFilter;
    return matchesQuery && matchesModule && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-purple-600 text-white px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-purple-400/50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Module 10 — Enterprise Security, Risk & Trust Infrastructure
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-700 uppercase tracking-wider">
                  Enterprise Operational
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Centralized security, risk analysis, fraud prevention, trust & safety, privacy governance, and operational resilience engine for PiNova Global Marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Dynamic Security Health</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-xl font-black text-amber-400">{scoreBreakdown.overallScore}/100</span>
              <span className="text-xs font-bold text-emerald-400">({scoreBreakdown.grade})</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Permanent Compliance & Performance Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 block">Pi Network Security & Non-Custody Transparency</span>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">{engine.getComplianceNotice()}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-start gap-3 shadow-sm">
          <Activity className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-purple-300 block">Performance Transparency Statement</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">{engine.getPerformanceNotice()}</p>
          </div>
        </div>
      </div>

      {/* Console Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Security Overview', icon: Shield },
          { id: 'iam', label: 'Identity & Access (IAM)', icon: Key },
          { id: 'fraud', label: 'Fraud Engine & AI Risk', icon: ShieldAlert },
          { id: 'trust_safety', label: 'Trust & Safety', icon: UserCheck },
          { id: 'privacy', label: 'Privacy & Data Controls', icon: Lock },
          { id: 'continuity', label: 'Business Continuity & Service Availability', icon: Server },
          { id: 'audit', label: 'Enterprise Audit Logs', icon: FileText },
          { id: 'admin_policies', label: 'Admin Security Policies', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & HEALTH */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Calculated Security Posture</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{scoreBreakdown.overallScore} / 100</div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full"
                  style={{ width: `${scoreBreakdown.overallScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">Security Health Index Grade {scoreBreakdown.grade}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Active Alerts</span>
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{alerts.filter(a => !a.resolved).length} Unresolved</div>
              <span className="text-[10px] text-slate-400 block font-medium">
                {alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length} High/Critical Severity
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Active Sessions</span>
                <Laptop className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300">{sessions.length} Sessions</div>
              <span className="text-[10px] text-slate-400 block font-medium">{trustedDevices.length} Registered Trusted Devices</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Continuity Status</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{businessContinuity.overallHealth}</div>
              <span className="text-[10px] text-slate-400 block font-medium">RPO: {businessContinuity.rpoMinutes}m | RTO: {businessContinuity.rtoMinutes}m</span>
            </div>
          </div>

          {/* Breakdown & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Score Breakdown Bars */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Security Assessment Categories</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Authentication & MFA</span>
                    <span className="font-bold text-amber-400">{scoreBreakdown.mfaScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${scoreBreakdown.mfaScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Session & Device Integrity</span>
                    <span className="font-bold text-emerald-400">{scoreBreakdown.sessionScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${scoreBreakdown.sessionScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Privacy & Data Protection</span>
                    <span className="font-bold text-purple-400">{scoreBreakdown.privacyScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${scoreBreakdown.privacyScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Policy Enforcement</span>
                    <span className="font-bold text-blue-400">{scoreBreakdown.policyScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${scoreBreakdown.policyScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations & Guidance */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Security & Compliance Recommendations</span>
              </h3>
              <div className="space-y-2.5">
                {scoreBreakdown.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Active Security Alerts List */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Active Threat & Security Alerts</span>
              </h3>
              <span className="text-xs text-slate-400">{alerts.filter(a => !a.resolved).length} Requires Action</span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    alert.resolved
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                      : 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                          ? 'bg-rose-900 text-rose-200'
                          : 'bg-amber-900 text-amber-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{alert.category}]</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{alert.description}</p>
                    <span className="text-[10px] text-slate-500 block">Logged: {new Date(alert.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {alert.resolved ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Acknowledge & Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: IDENTITY & ACCESS (IAM) */}
      {activeTab === 'iam' && (
        <div className="space-y-6">
          
          {/* MFA Status Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Multi-Factor Authentication (MFA)</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  mfaConfig.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {mfaConfig.enabled ? 'ACTIVE & ENFORCED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Secures account access via TOTP Authenticator apps. PiNova authentication uses official Pi SDK v2 session keys alongside MFA verification.
              </p>
            </div>

            <button
              onClick={handleToggleMfa}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                mfaConfig.enabled
                  ? 'bg-slate-800 text-slate-300 hover:bg-rose-950 hover:text-rose-300 border border-slate-700'
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-600/30'
              }`}
            >
              {mfaConfig.enabled ? 'Disable MFA' : 'Enable & Configure MFA'}
            </button>
          </div>

          {/* Active Sessions Manager */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Laptop className="w-4 h-4 text-purple-400" />
                <span>Active Login Sessions ({sessions.length})</span>
              </h3>
              <span className="text-xs text-slate-400">All sessions use privacy-protected client IDs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Device & Browser</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Privacy Client IP</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {sessions.map((sess) => (
                    <tr key={sess.sessionId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        {sess.deviceType.includes('MOBILE') ? (
                          <Smartphone className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Laptop className="w-4 h-4 text-blue-400" />
                        )}
                        <div>
                          <span>{sess.deviceName}</span>
                          {sess.isCurrentSession && (
                            <span className="ml-2 px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[9px] font-black border border-purple-800">
                              CURRENT SESSION
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">{sess.location}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{sess.ipAddress}</td>
                      <td className="p-3 text-slate-400">{new Date(sess.lastActiveAt).toLocaleTimeString()}</td>
                      <td className="p-3 text-right">
                        {!sess.isCurrentSession && (
                          <button
                            onClick={() => handleRevokeSession(sess.sessionId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trusted Devices & Login History Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Trusted Devices */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>Registered Trusted Devices</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                {trustedDevices.map((dev) => (
                  <div key={dev.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">{dev.deviceName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Fingerprint: {dev.fingerprint}</span>
                      <span className="text-[10px] text-slate-500 block">Registered: {new Date(dev.registeredIso).toLocaleDateString()}</span>
                    </div>

                    {dev.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleRevokeDevice(dev.id)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-[10px] font-bold"
                      >
                        Revoke Trust
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400">REVOKED</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Login History */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Recent Login History</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {loginHistory.map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>{log.eventType}</span>
                        <span className={`text-[10px] font-extrabold ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          [{log.status}]
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{log.location} • {log.ipAddress}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: FRAUD PREVENTION & AI RISK ENGINE */}
      {activeTab === 'fraud' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Fraud Prevention & AI Risk Scoring Engine</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Evaluates transaction velocity, device cluster anomalies, and price variance patterns. Fraud scores provide operational guidance and support human review.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold text-xs">
              {fraudRecords.filter(f => f.status === 'PENDING_REVIEW' || f.status === 'FLAGGED').length} Pending Review
            </span>
          </div>

          {/* Fraud Case Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {fraudRecords.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-5 rounded-3xl border space-y-3 ${
                    rec.riskLevel === 'CRITICAL' || rec.riskLevel === 'HIGH'
                      ? 'bg-slate-900 border-rose-500/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rec.targetName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-slate-300 uppercase">
                        {rec.targetType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Risk Score:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                        rec.riskScore >= 70 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {rec.riskScore} / 100 ({rec.riskLevel})
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI Confidence Assessment ({rec.aiConfidenceScore}%)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rec.aiReasoning}</p>
                  </div>

                  {/* Velocity Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">24h Tx Count</span>
                      <span className="font-bold text-white">{rec.velocityMetrics.txCount24h}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">24h Volume</span>
                      <span className="font-bold text-amber-400">{rec.velocityMetrics.totalPi24h} π</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Cancel Rate</span>
                      <span className="font-bold text-rose-400">{rec.velocityMetrics.cancelRatePct}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">IP Clusters</span>
                      <span className="font-bold text-purple-400">{rec.velocityMetrics.duplicateIpMatches}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">Logged: {new Date(rec.createdAt).toLocaleString()}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateFraudStatus(rec.id, 'CLEARED', 'Cleared after manual evidence review')}
                        className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-xs hover:bg-emerald-900"
                      >
                        Clear Case
                      </button>
                      <button
                        onClick={() => handleUpdateFraudStatus(rec.id, 'FLAGGED', 'Flagged for restricted checkout limits')}
                        className="px-3 py-1 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 font-bold text-xs hover:bg-rose-900"
                      >
                        Flag Account
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rules & Policy Rules Config */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Fraud Rule Parameters</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">Fraud Alert Threshold</span>
                  <span className="text-amber-400 font-mono text-sm">{policySettings.fraudAlertThresholdScore} / 100</span>
                  <p className="text-[10px] text-slate-400">Risk scores exceeding threshold trigger automatic manual review flags.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">Max Velocity Tx Count / 24h</span>
                  <span className="text-purple-400 font-mono text-sm">30 Transactions</span>
                  <p className="text-[10px] text-slate-400">Triggers duplicate account cluster review when threshold is breached.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: TRUST & SAFETY CENTER */}
      {activeTab === 'trust_safety' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Trust & Safety Operations Center</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Manage community abuse reports, policy violation claims, and content moderation queues across products, reviews, and messaging.
              </p>
            </div>
            
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Abuse Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Abuse Reports List */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Submitted Abuse & Policy Reports</span>
              </h3>

              <div className="space-y-3 text-xs">
                {abuseReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rep.targetTitle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-400 border border-amber-800">
                        {rep.reasonCategory}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{rep.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Reporter: {rep.reporterUsername}</span>
                      <span className="font-mono">{new Date(rep.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Moderation Queue */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Automated Content Moderation Queue</span>
              </h3>

              <div className="space-y-3 text-xs">
                {moderationQueue.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 font-mono">[{item.contentType}]</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        item.moderationStatus === 'QUARANTINED' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.moderationStatus}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
                      "{item.rawText}"
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Reason: {item.flagReason}</span>
                    
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleModerationAction(item.id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold"
                      >
                        Reject & Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 5: PRIVACY & DATA PROTECTION */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          
          {/* Privacy Controls Dashboard */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              <span>Personal Data Protection & Consent Governance</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Analytics Cookies</span>
                  <span className="text-[10px] text-slate-400">Anonymous session analytics to improve marketplace loading.</span>
                </div>
                <button
                  onClick={() => handleToggleConsent('analyticsCookies')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${privacyConsent.analyticsCookies ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${privacyConsent.analyticsCookies ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Third-Party Data Sharing</span>
                  <span className="text-[10px] text-slate-400">Strictly disabled across all PiNova marketplace services.</span>
                </div>
                <button
                  onClick={() => handleToggleConsent('thirdPartyDataSharing')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${privacyConsent.thirdPartyDataSharing ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${privacyConsent.thirdPartyDataSharing ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* User Data Download & Account Removal */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Personal Data Portability & Account Erasure</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Export My Personal Marketplace Data</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Download a complete JSON package containing active sessions, login history, abuse reports, and privacy consent records.
                </p>
                <button
                  onClick={handleDownloadPersonalData}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-purple-600/30"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Personal Data (JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-rose-400 block">Delete Marketplace Account</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Staged account deletion clears all marketplace profile data while maintaining required legal transaction records.
                </p>
                <button
                  onClick={() => setShowAccountDeleteModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Request Account Erasure</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: BUSINESS CONTINUITY & SERVICE AVAILABILITY */}
      {activeTab === 'continuity' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>Business Continuity & Service Availability Status</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Monitors Application Backup Status, Infrastructure Availability Status, and operational RPO/RTO metrics.
              </p>
            </div>

            <button
              onClick={handleRunDrDrill}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Execute Recovery Readiness Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">RPO Target (Recovery Point)</span>
              <span className="text-xl font-black text-amber-400">{businessContinuity.rpoMinutes} Minutes</span>
              <span className="text-[10px] text-slate-500 block">Automated system backup snapshot frequency</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">RTO Target (Recovery Time)</span>
              <span className="text-xl font-black text-emerald-400">{businessContinuity.rtoMinutes} Minutes</span>
              <span className="text-[10px] text-slate-500 block">Infrastructure availability standby window</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">Last Recovery Readiness Review</span>
              <span className="text-sm font-bold text-white">{new Date(businessContinuity.lastDrillIso).toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 block font-bold">VERIFIED OPERATIONAL</span>
            </div>
          </div>

          {/* Service Availability List */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Core Service Availability Matrix</span>
            </h3>

            <div className="space-y-3">
              {businessContinuity.activeServices.map((srv, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{srv.service}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono">{srv.latencyMs}ms</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-black text-[10px]">
                      {srv.status} ({srv.uptimePct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 7: ENTERPRISE AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Immutable Enterprise Audit & Compliance Logs</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Complete audit trail of system events, authentication attempts, risk evaluations, and governance decisions using privacy-protected client IDs.
              </p>
            </div>

            <button
              onClick={handleExportAuditCsv}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-purple-600/30"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Export Audit Log (CSV)</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search action, actor, or details..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={auditModuleFilter}
                onChange={(e) => setAuditModuleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Modules</option>
                <option value="Identity & Access">Identity & Access</option>
                <option value="Fraud Prevention">Fraud Prevention</option>
                <option value="Business Continuity">Business Continuity</option>
                <option value="Security Operations">Security Operations</option>
              </select>

              <select
                value={auditRiskFilter}
                onChange={(e) => setAuditRiskFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Privacy Client ID</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 font-bold text-white">
                      <span>{log.actorUsername}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{log.actorRole}</span>
                    </td>
                    <td className="p-3 font-bold text-purple-300 font-mono text-[11px]">{log.action}</td>
                    <td className="p-3 text-slate-300">{log.module}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        log.riskLevel === 'CRITICAL' || log.riskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">{log.clientIdentifier}</td>
                    <td className="p-3 text-slate-300 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 8: ADMIN SECURITY POLICIES */}
      {activeTab === 'admin_policies' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Administrator Security Policy & Governance Rules</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Configure platform-wide security policies, rate controls, and automated quarantine triggers.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enforce MFA for Administrator Accounts</span>
                  <span className="text-[10px] text-slate-400">Requires mandatory TOTP MFA for all admin and compliance staff logins.</span>
                </div>
                <button
                  onClick={() => {
                    const updated = engine.updatePolicySettings({ enforceMfaForAdmins: !policySettings.enforceMfaForAdmins });
                    setPolicySettings(updated);
                    showToast('Admin MFA policy updated.');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${policySettings.enforceMfaForAdmins ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${policySettings.enforceMfaForAdmins ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Auto-Quarantine Suspicious Reviews</span>
                  <span className="text-[10px] text-slate-400">Automatically flag reviews soliciting off-platform transactions or spam.</span>
                </div>
                <button
                  onClick={() => {
                    const updated = engine.updatePolicySettings({ autoQuarantineSuspiciousReviews: !policySettings.autoQuarantineSuspiciousReviews });
                    setPolicySettings(updated);
                    showToast('Review quarantine policy updated.');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${policySettings.autoQuarantineSuspiciousReviews ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${policySettings.autoQuarantineSuspiciousReviews ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: MFA Setup */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Configure Multi-Factor Authentication</span>
              </h3>
              <button onClick={() => setShowMfaModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {mfaModalStep === 'qr' ? (
              <div className="space-y-4 text-xs text-center">
                <p className="text-slate-300">Scan this setup QR code with Google Authenticator or Authy:</p>
                <div className="w-44 h-44 bg-white mx-auto rounded-2xl p-3 flex items-center justify-center border-4 border-purple-600">
                  <div className="w-full h-full border-2 border-dashed border-slate-900 rounded-xl flex items-center justify-center text-slate-900 font-bold text-[10px]">
                    [PINOVA-TOTP-QR]
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">Secret: {mfaConfig.secretKey}</span>
                
                <input
                  type="text"
                  placeholder="Enter 6-digit code from app..."
                  value={mfaCodeInput}
                  onChange={(e) => setMfaCodeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-center text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  onClick={handleVerifyMfaCode}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                >
                  Verify Code & Enable MFA
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">MFA Successfully Enabled!</h4>
                <p className="text-xs text-slate-400">Your account is now protected with Multi-Factor Authentication.</p>
                <button
                  onClick={() => setShowMfaModal(false)}
                  className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Submit Abuse Report */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmitNewReport} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Submit Abuse or Policy Report</span>
              </h3>
              <button type="button" onClick={() => setShowNewReportModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Type</label>
                <select
                  value={reportTargetType}
                  onChange={(e) => setReportTargetType(e.target.value as AbuseReportItem['targetType'])}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="LISTING">Product Listing</option>
                  <option value="USER">User / Account</option>
                  <option value="STORE">Merchant Store</option>
                  <option value="MESSAGE">Chat Message</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target ID or Name</label>
                <input
                  type="text"
                  placeholder="e.g. prod-008 or user_xyz"
                  value={reportTargetId}
                  onChange={(e) => setReportTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Violation Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as AbuseReportItem['reasonCategory'])}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="FRAUD">Fraud or Scam Attempt</option>
                  <option value="COUNTERFEIT">Counterfeit / Fake Product</option>
                  <option value="HARASSMENT">Off-platform Harassment / Spam</option>
                  <option value="POLICY_VIOLATION">Marketplace Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Detailed Explanation & Evidence</label>
                <textarea
                  rows={3}
                  placeholder="Describe the suspicious behavior or policy violation..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Account Delete */}
      {showAccountDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl max-w-md w-full p-6 space-y-4 text-slate-200">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Staged Account Erasure Request</span>
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              This action initiates a 30-day staged account erasure. Your profile data will be purged while maintaining required legal transaction records.
            </p>

            <div className="space-y-2 text-xs">
              <label className="text-slate-400 font-medium">Type "DELETE" to confirm:</label>
              <input
                type="text"
                placeholder="DELETE"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 font-mono text-center"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAccountDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText !== 'DELETE'}
                onClick={() => {
                  setShowAccountDeleteModal(false);
                  setDeleteConfirmationText('');
                  showToast('Staged account deletion request logged successfully.');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs ${
                  deleteConfirmationText === 'DELETE' ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                Confirm Erasure
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
