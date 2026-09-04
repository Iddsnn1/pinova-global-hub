import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Settings, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Lock, 
  ShieldAlert, 
  Key, 
  Layers, 
  Cpu, 
  Database, 
  Zap, 
  Server, 
  RefreshCw, 
  Clock, 
  Edit3, 
  UserCheck, 
  UserX, 
  Plus, 
  ChevronRight, 
  Info, 
  Sliders, 
  Globe, 
  Code, 
  DollarSign, 
  Check, 
  Eye,
  SlidersHorizontal,
  Bell,
  Scale,
  Radio,
  ToggleLeft,
  ToggleRight,
  HardDrive,
  BarChart2,
  TrendingUp,
  Download,
  Flame,
  CheckSquare,
  History,
  Gauge,
  FileCode,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

import { 
  PlatformAdminEngine, 
  ALL_GRANULAR_PERMISSIONS 
} from '../../modules/platform_admin/services';
import { 
  UserAccountRecord, 
  RolePermissionDefinition, 
  KYCDocumentRecord, 
  GlobalPlatformSettings,
  SystemPlatformAlert,
  AdminDisputeCase,
  FeatureFlagRecord,
  SystemIncidentRecord
} from '../../modules/platform_admin/types';

interface PlatformAdminViewProps {
  currentAdminUsername?: string;
  onNavigateSection?: (section: any) => void;
}

export type AdminTab = 
  | 'overview' 
  | 'disputes' 
  | 'monitoring' 
  | 'feature_flags' 
  | 'backup_recovery' 
  | 'incidents' 
  | 'users' 
  | 'rbac' 
  | 'config' 
  | 'audit';

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({
  currentAdminUsername = 'Pi_Pioneer_01',
  onNavigateSection
}) => {
  // Engine Instance
  const [engine] = useState(() => new PlatformAdminEngine());

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live Refresh State
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date().toLocaleTimeString());

  // Filter & Search for Users Directory
  const [userQuery, setUserQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');
  const [userKycFilter, setUserKycFilter] = useState<string>('ALL');

  // Modals & Selection States
  const [selectedUserForKyc, setSelectedUserForKyc] = useState<UserAccountRecord | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserAccountRecord | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState<string>('');

  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<UserAccountRecord | null>(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState('');

  // RBAC State
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<string>('role-super-admin');
  const [isCustomRoleModalOpen, setIsCustomRoleModalOpen] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [customRoleDesc, setCustomRoleDesc] = useState('');
  const [customRolePerms, setCustomRolePerms] = useState<string[]>([]);

  // KYC Review Note Modal
  const [reviewingDoc, setReviewingDoc] = useState<{ doc: KYCDocumentRecord; user: UserAccountRecord } | null>(null);
  const [kycReviewNote, setKycReviewNote] = useState('');

  // Dispute Management States
  const [disputeFilterStatus, setDisputeFilterStatus] = useState<string>('ALL');
  const [selectedDisputeForAssign, setSelectedDisputeForAssign] = useState<AdminDisputeCase | null>(null);
  const [assignModeratorInput, setAssignModeratorInput] = useState<string>('Trust_Moderator_Mark');
  const [selectedDisputeForDecision, setSelectedDisputeForDecision] = useState<AdminDisputeCase | null>(null);
  const [disputeDecisionStatus, setDisputeDecisionStatus] = useState<string>('RESOLVED_BUYER_REFUND');
  const [disputeDecisionNotesInput, setDisputeDecisionNotesInput] = useState<string>('');

  // Feature Flag States
  const [editingRolloutKey, setEditingRolloutKey] = useState<string | null>(null);
  const [editingRolloutVal, setEditingRolloutVal] = useState<number>(100);
  const [selectedFlagForKillswitch, setSelectedFlagForKillswitch] = useState<FeatureFlagRecord | null>(null);
  const [killswitchReasonInput, setKillswitchReasonInput] = useState<string>('');

  // Incident States
  const [isCreateIncidentModalOpen, setIsCreateIncidentModalOpen] = useState(false);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentComponent, setNewIncidentComponent] = useState<any>('PI_PLATFORM_API');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<any>('SEV_3_MEDIUM');
  const [newIncidentSummary, setNewIncidentSummary] = useState('');
  
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<SystemIncidentRecord | null>(null);
  const [incidentUpdateText, setIncidentUpdateText] = useState('');
  const [incidentUpdateStatus, setIncidentUpdateStatus] = useState<any>('INVESTIGATING');

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState<GlobalPlatformSettings>(() => engine.getGlobalSettings());

  // Data Refresh Trigger
  const [tick, setTick] = useState(0);
  const refreshData = () => {
    setLastRefreshedAt(new Date().toLocaleTimeString());
    setTick(prev => prev + 1);
  };

  // Derived Data
  const serviceHealthList = useMemo(() => engine.getServiceHealthRecords(), [tick]);
  const liveMetrics = useMemo(() => engine.getLiveSystemMetrics(), [tick]);
  const kpiData = useMemo(() => engine.getOperationalKPIs(), [tick]);
  const systemAlerts = useMemo(() => engine.getSystemAlerts(), [tick]);
  const filteredUsers = useMemo(() => {
    return engine.searchUsers(userQuery, userTypeFilter, userStatusFilter, userKycFilter);
  }, [userQuery, userTypeFilter, userStatusFilter, userKycFilter, tick]);
  const roleDefinitions = useMemo(() => engine.getRoleDefinitions(), [tick]);
  const categoriesList = useMemo(() => engine.getCategoriesConfig(), [tick]);
  const utilitiesList = useMemo(() => engine.getUtilitiesConfig(), [tick]);
  const auditLogsList = useMemo(() => engine.getAuditLogs(), [tick]);

  // Advanced Admin Derived Data
  const disputeCasesList = useMemo(() => engine.getDisputeCases(), [tick]);
  const disputeAnalytics = useMemo(() => engine.getDisputeAnalytics(), [tick]);
  const integrationMetricsList = useMemo(() => engine.getIntegrationMetrics(), [tick]);
  const hourlyUptimeTrend = useMemo(() => engine.getHourlyUptimeTrend(), [tick]);
  const featureFlagsList = useMemo(() => engine.getFeatureFlags(), [tick]);
  const backupRecoveryStatus = useMemo(() => engine.getBackupRecoveryStatus(), [tick]);
  const incidentsList = useMemo(() => engine.getIncidents(), [tick]);
  const executiveGovernance = useMemo(() => engine.getExecutiveGovernanceMetrics(), [tick]);

  const activeRoleDefinition = useMemo(() => {
    return roleDefinitions.find(r => r.roleId === selectedRoleForMatrix) || roleDefinitions[0];
  }, [roleDefinitions, selectedRoleForMatrix]);

  const filteredDisputes = useMemo(() => {
    if (disputeFilterStatus === 'ALL') return disputeCasesList;
    return disputeCasesList.filter(d => d.status === disputeFilterStatus);
  }, [disputeCasesList, disputeFilterStatus]);

  // Handlers
  const handleToggleUserStatus = (user: UserAccountRecord) => {
    if (user.status === 'SUSPENDED') {
      engine.reactivateUserAccount(user.id, currentAdminUsername);
      refreshData();
    } else {
      setSelectedUserForSuspend(user);
      setSuspensionReasonInput('');
    }
  };

  const handleConfirmSuspension = () => {
    if (selectedUserForSuspend && suspensionReasonInput.trim()) {
      engine.suspendUserAccount(selectedUserForSuspend.id, suspensionReasonInput.trim(), currentAdminUsername);
      setSelectedUserForSuspend(null);
      setSuspensionReasonInput('');
      refreshData();
    }
  };

  const handleConfirmRoleChange = () => {
    if (selectedUserForRole && newRoleSelection) {
      engine.updateUserRole(selectedUserForRole.id, newRoleSelection, currentAdminUsername);
      setSelectedUserForRole(null);
      setNewRoleSelection('');
      refreshData();
    }
  };

  const handleTogglePermission = (code: string) => {
    if (!activeRoleDefinition) return;
    const currentCodes = activeRoleDefinition.permissions;
    const nextCodes = currentCodes.includes(code)
      ? currentCodes.filter(c => c !== code)
      : [...currentCodes, code];
    engine.updateRolePermissions(activeRoleDefinition.roleId, nextCodes, currentAdminUsername);
    refreshData();
  };

  const handleCreateCustomRole = () => {
    if (customRoleName.trim() && customRoleDesc.trim()) {
      engine.createCustomRole(customRoleName.trim(), customRoleDesc.trim(), customRolePerms, currentAdminUsername);
      setCustomRoleName('');
      setCustomRoleDesc('');
      setCustomRolePerms([]);
      setIsCustomRoleModalOpen(false);
      refreshData();
    }
  };

  const handleReviewDocAction = (approved: boolean) => {
    if (reviewingDoc) {
      engine.reviewKycDocument(reviewingDoc.user.id, reviewingDoc.doc.id, approved, kycReviewNote.trim() || 'Reviewed by Admin', currentAdminUsername);
      setReviewingDoc(null);
      setKycReviewNote('');
      refreshData();
    }
  };

  const handleToggleSetting = (key: keyof GlobalPlatformSettings) => {
    if (typeof globalSettings[key] === 'boolean') {
      const nextVal = !globalSettings[key];
      const updated = { [key]: nextVal };
      engine.updateGlobalSettings(updated, currentAdminUsername);
      setGlobalSettings(prev => ({ ...prev, ...updated }));
      refreshData();
    }
  };

  const handleResolveAlert = (alertId: string) => {
    engine.resolveAlert(alertId, currentAdminUsername);
    refreshData();
  };

  // Dispute Handlers
  const handleAssignModerator = () => {
    if (selectedDisputeForAssign && assignModeratorInput.trim()) {
      engine.assignDisputeModerator(selectedDisputeForAssign.id, assignModeratorInput.trim(), currentAdminUsername);
      setSelectedDisputeForAssign(null);
      refreshData();
    }
  };

  const handleRecordDisputeDecision = () => {
    if (selectedDisputeForDecision && disputeDecisionNotesInput.trim()) {
      engine.updateDisputeStatus(selectedDisputeForDecision.id, disputeDecisionStatus as any, disputeDecisionNotesInput.trim(), currentAdminUsername);
      setSelectedDisputeForDecision(null);
      setDisputeDecisionNotesInput('');
      refreshData();
    }
  };

  const handleExportDisputesCsv = () => {
    const csvContent = engine.exportDisputeReportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pinova_disputes_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Feature Flag Handlers
  const handleSaveRolloutVal = (key: string) => {
    engine.updateFeatureFlag(key, { rolloutPercentage: editingRolloutVal }, currentAdminUsername);
    setEditingRolloutKey(null);
    refreshData();
  };

  const handleConfirmKillswitch = () => {
    if (selectedFlagForKillswitch && killswitchReasonInput.trim()) {
      engine.emergencyDisableFeature(selectedFlagForKillswitch.key, killswitchReasonInput.trim(), currentAdminUsername);
      setSelectedFlagForKillswitch(null);
      setKillswitchReasonInput('');
      refreshData();
    }
  };

  const handleRollbackFlag = (key: string) => {
    engine.rollbackFeatureFlag(key, currentAdminUsername);
    refreshData();
  };

  // Backup & Recovery Handlers
  const handleTriggerSnapshot = () => {
    engine.triggerConfigSnapshot(currentAdminUsername);
    refreshData();
  };

  const handleRunIntegrityCheck = () => {
    engine.runIntegrityCheck(currentAdminUsername);
    refreshData();
  };

  // Incident Handlers
  const handleCreateIncidentSubmit = () => {
    if (newIncidentTitle.trim() && newIncidentSummary.trim()) {
      engine.createIncident({
        title: newIncidentTitle.trim(),
        component: newIncidentComponent,
        severity: newIncidentSeverity,
        impactSummary: newIncidentSummary.trim()
      }, currentAdminUsername);
      setIsCreateIncidentModalOpen(false);
      setNewIncidentTitle('');
      setNewIncidentSummary('');
      refreshData();
    }
  };

  const handleAddIncidentUpdateSubmit = () => {
    if (selectedIncidentForUpdate && incidentUpdateText.trim()) {
      engine.addIncidentTimelineUpdate(
        selectedIncidentForUpdate.id,
        incidentUpdateText.trim(),
        incidentUpdateStatus,
        currentAdminUsername
      );
      setSelectedIncidentForUpdate(null);
      setIncidentUpdateText('');
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header & System Overview Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Platform Administration Console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-extrabold uppercase tracking-widest">
                  Module 9
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized Control Center, User Directory, RBAC Matrix & Operational Governance
              </p>
            </div>
          </div>
        </div>

        {/* Status Badges & Refresh Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400 font-medium">Node Sync:</span>
            <span className="font-bold text-emerald-400">In Sync (0.01s)</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400 font-medium">Refreshed:</span>
            <span className="font-bold text-slate-200">{lastRefreshedAt}</span>
          </div>

          <button
            onClick={() => onNavigateSection && onNavigateSection('developer_platform')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Code className="w-3.5 h-3.5 text-indigo-300" />
            <span>Module 11 Dev Platform</span>
          </button>

          <button
            onClick={() => onNavigateSection && onNavigateSection('security_trust')}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Module 10 Security Console</span>
          </button>

          <button
            onClick={refreshData}
            className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Live Metrics</span>
          </button>
        </div>
      </div>

      {/* Compliance & Legal Transparency Notice (Permanent) */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs flex flex-col md:flex-row items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <div>
            <span className="font-bold text-amber-300 block">Governance Transparency Statement</span>
            <p className="text-amber-200/80 leading-relaxed">{engine.getComplianceNotice()}</p>
          </div>
          <div className="pt-1 border-t border-amber-500/20 text-[11px] text-amber-300/80">
            <span className="font-bold text-amber-300">Performance Transparency Notice: </span>
            <span>{engine.getPerformanceNotice()}</span>
          </div>
        </div>
      </div>

      {/* Main Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'overview', label: 'Overview & Executive Governance', icon: <Activity className="w-4 h-4" />, count: systemAlerts.filter(a => !a.resolved).length },
          { id: 'disputes', label: 'Dispute & Case Management', icon: <Scale className="w-4 h-4" />, count: disputeAnalytics.openCases },
          { id: 'monitoring', label: 'API & Integration Monitoring', icon: <Radio className="w-4 h-4" /> },
          { id: 'feature_flags', label: 'Feature Rollout & Flags', icon: <SlidersHorizontal className="w-4 h-4" /> },
          { id: 'backup_recovery', label: 'Backup & Recovery', icon: <HardDrive className="w-4 h-4" /> },
          { id: 'incidents', label: 'Incident Management', icon: <Flame className="w-4 h-4" />, count: incidentsList.filter(i => i.status !== 'RESOLVED').length },
          { id: 'users', label: 'Users & Identity Directory', icon: <Users className="w-4 h-4" />, count: filteredUsers.length },
          { id: 'rbac', label: 'RBAC & Permissions', icon: <Key className="w-4 h-4" />, count: roleDefinitions.length },
          { id: 'config', label: 'Marketplace Configuration', icon: <Sliders className="w-4 h-4" /> },
          { id: 'audit', label: 'Governance Audit Trail', icon: <FileText className="w-4 h-4" />, count: auditLogsList.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? 'bg-white text-purple-900' : 'bg-slate-800 text-purple-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>


      {/* TAB 1: OVERVIEW & PLATFORM HEALTH */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Executive Governance Metrics Scorecard */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Gauge className="w-5 h-5 text-amber-400" />
                <span>Executive Governance Metrics & Platform Risk Scorecard</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                GOVERNANCE AUDITED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Operational Compliance</span>
                <span className="text-lg font-black text-emerald-400">{executiveGovernance.operationalComplianceScore}/100</span>
                <span className="text-[9px] text-slate-500 block">Non-Custodial Rules</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Security Score</span>
                <span className="text-lg font-black text-indigo-400">{executiveGovernance.securityScore}/100</span>
                <span className="text-[9px] text-slate-500 block">RBAC & API Shield</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Marketplace Trust</span>
                <span className="text-lg font-black text-purple-400">{executiveGovernance.marketplaceTrustScore}/100</span>
                <span className="text-[9px] text-slate-500 block">Verified Merchants</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">System Reliability</span>
                <span className="text-lg font-black text-emerald-400">{executiveGovernance.systemReliabilityPercent}%</span>
                <span className="text-[9px] text-slate-500 block">High Availability</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">SLA Performance</span>
                <span className="text-lg font-black text-blue-400">{executiveGovernance.slaPerformancePercent}%</span>
                <span className="text-[9px] text-slate-500 block">Microservices SLA</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Platform Uptime</span>
                <span className="text-lg font-black text-amber-400">{executiveGovernance.platformAvailabilityPercent}%</span>
                <span className="text-[9px] text-slate-500 block">Core Gateways</span>
              </div>
            </div>

            {/* Risk Indicators Scorecard */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Real-time Risk Indicators</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {executiveGovernance.riskIndicators.map((risk) => (
                  <div key={risk.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{risk.category}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                        risk.level === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {risk.level} RISK ({risk.score})
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{risk.description}</p>
                    <span className="text-[10px] text-purple-300 block font-semibold">Action: {risk.recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational KPIs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Active Users</span>
              <span className="text-xl font-black text-white">{kpiData.totalActiveUsers.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-emerald-400 block">+4.2% this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Active Merchants</span>
              <span className="text-xl font-black text-white">{kpiData.totalActiveMerchants.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-emerald-400 block">Level 3 Enterprise</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Active Marketplace Orders</span>
              <span className="text-xl font-black text-white">{kpiData.totalActiveOrders.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-purple-400 block">Protection Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Total Pi GMV</span>
              <span className="text-xl font-black text-amber-400">{kpiData.totalPiGmv.toLocaleString()} π</span>
              <span className="text-[10px] font-bold text-amber-500/80 block">Verified On-Chain</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Platform SLA</span>
              <span className="text-xl font-black text-emerald-400">{kpiData.systemSlaPercent}%</span>
              <span className="text-[10px] font-bold text-emerald-500/80 block">Optimized Performance</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-medium block">Dispute Rate</span>
              <span className="text-xl font-black text-blue-400">{kpiData.disputeRatePercent}%</span>
              <span className="text-[10px] font-bold text-blue-500/80 block">Low Escalation</span>
            </div>
          </div>

          {/* System Hardware & Node Status Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Infrastructure Metrics */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">System Resource Monitor</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  HEALTHY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-300">
                    <span>CPU Allocation</span>
                    <span>{liveMetrics.cpuUsagePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${liveMetrics.cpuUsagePercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-300">
                    <span>Memory Usage</span>
                    <span>{liveMetrics.memoryUsagePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${liveMetrics.memoryUsagePercent}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block">WebSocket Sessions</span>
                    <span className="font-bold text-white text-sm">{liveMetrics.activeWebSocketConnections.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block">Webhook Queue</span>
                    <span className="font-bold text-amber-400 text-sm">{liveMetrics.webhookQueueLength} pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Alerts Center */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Real-time Critical Platform Alerts</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {systemAlerts.filter(a => !a.resolved).length} Unresolved
                </span>
              </div>

              <div className="space-y-2.5">
                {systemAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                      alert.resolved
                        ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                        : alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                        ? 'bg-red-950/20 border-red-800/40 text-red-200'
                        : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                        alert.resolved ? 'text-slate-500' : alert.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{alert.title}</span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {alert.component}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-0.5 text-[11px]">{alert.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shrink-0 border border-slate-700 transition-colors"
                      >
                        Acknowledge & Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Microservices Uptime Health Matrix */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Enterprise Core Microservices Health</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Service Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">API Latency</th>
                    <th className="p-3">Uptime (30d)</th>
                    <th className="p-3">Error Rate</th>
                    <th className="p-3">Last Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {serviceHealthList.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          svc.status === 'HEALTHY' ? 'bg-emerald-400' : svc.status === 'DEGRADED' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <span>{svc.serviceName}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          svc.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {svc.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-purple-300">{svc.latencyMs} ms</td>
                      <td className="p-3 font-bold text-emerald-400">{svc.uptimePercentage}%</td>
                      <td className="p-3 text-slate-400">{svc.errorRatePercentage}%</td>
                      <td className="p-3 text-slate-500 text-[11px]">{new Date(svc.lastPingIso).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTE & CASE MANAGEMENT */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          {/* Dispute Analytics Summary Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Cases</span>
              <span className="text-xl font-black text-white">{disputeAnalytics.totalCases}</span>
              <span className="text-[9px] text-slate-500 block">Historical</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Open Cases</span>
              <span className="text-xl font-black text-amber-400">{disputeAnalytics.openCases}</span>
              <span className="text-[9px] text-amber-500/80 block">Requires Review</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">In Review</span>
              <span className="text-xl font-black text-indigo-400">{disputeAnalytics.inReviewCases}</span>
              <span className="text-[9px] text-indigo-400/80 block">Assigned Staff</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Awaiting Evidence</span>
              <span className="text-xl font-black text-purple-400">{disputeAnalytics.awaitingEvidenceCases}</span>
              <span className="text-[9px] text-purple-400/80 block">Buyer / Seller</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Buyer Refunds</span>
              <span className="text-xl font-black text-emerald-400">{disputeAnalytics.resolvedBuyerRefundCount}</span>
              <span className="text-[9px] text-emerald-500/80 block">Escrow Refund</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Seller Releases</span>
              <span className="text-xl font-black text-blue-400">{disputeAnalytics.resolvedSellerReleaseCount}</span>
              <span className="text-[9px] text-blue-400/80 block">Escrow Released</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Avg Resolution</span>
              <span className="text-xl font-black text-white">{disputeAnalytics.avgResolutionTimeHours}h</span>
              <span className="text-[9px] text-emerald-400 block">Within SLA</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Dispute Rate</span>
              <span className="text-xl font-black text-emerald-400">{disputeAnalytics.disputeRatePercent}%</span>
              <span className="text-[9px] text-slate-500 block">Low Escalation</span>
            </div>
          </div>

          {/* Dispute Controls & Non-Custodial Security Notice */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm">Dispute & Case Governance Console</h3>
                <p className="text-xs text-slate-400">Review claims, assign moderators, record administrative decisions, and generate official dispute reports.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={disputeFilterStatus}
                onChange={(e) => setDisputeFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Case Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="AWAITING_EVIDENCE">Awaiting Evidence</option>
                <option value="RESOLVED_BUYER_REFUND">Resolved (Buyer Refund)</option>
                <option value="RESOLVED_SELLER_RELEASE">Resolved (Seller Release)</option>
                <option value="DISMISSED">Dismissed</option>
              </select>

              <button
                onClick={handleExportDisputesCsv}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Export Dispute Report (CSV)</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200/90 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dispute management records administrative decisions and triggers Escrow release or refund rules in accordance with Official Pi payment lifecycle, without custody of user Pi or wallet private keys.</span>
          </div>

          {/* Disputes Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Case ID / Order</th>
                    <th className="p-3">Parties (Buyer / Seller)</th>
                    <th className="p-3">Dispute Reason</th>
                    <th className="p-3">Amount (Pi)</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned Moderator</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredDisputes.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-white block">{caseItem.id}</span>
                        <span className="text-[10px] text-purple-400 font-mono block">{caseItem.orderId}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-200 block">Buyer: {caseItem.buyerUsername}</span>
                        <span className="text-[10px] text-slate-400 block">Seller: {caseItem.sellerUsername}</span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <p className="text-slate-300 truncate" title={caseItem.disputeReason}>{caseItem.disputeReason}</p>
                        <span className="text-[9px] text-slate-500 block">Created: {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                      </td>

                      <td className="p-3 font-mono font-bold text-amber-400">
                        {caseItem.amountPi.toFixed(2)} π
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                          caseItem.priority === 'CRITICAL' || caseItem.priority === 'HIGH'
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {caseItem.priority}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          caseItem.status === 'RESOLVED_BUYER_REFUND' || caseItem.status === 'RESOLVED_SELLER_RELEASE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : caseItem.status === 'IN_REVIEW'
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {caseItem.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-3 text-slate-300">
                        {caseItem.moderatorAssigned ? (
                          <span className="font-bold text-purple-300">{caseItem.moderatorAssigned}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDisputeForAssign(caseItem)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDisputeForDecision(caseItem);
                              setDisputeDecisionNotesInput(caseItem.decisionNotes || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-sm"
                          >
                            Decide
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API & INTEGRATION MONITORING */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400" />
                <span>API & External Integration Operational Monitor</span>
              </h3>
              <p className="text-xs text-slate-400">Live operational status across 7 critical system integration domains.</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Verified</span>
            </div>
          </div>

          {/* Integration Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationMetricsList.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-white text-base">{item.domainName}</h4>
                  <span className="text-[11px] text-purple-300 font-mono block">{item.versionInfo}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[9px] text-slate-500 uppercase block">Latency</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">{item.latencyMs} ms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[9px] text-slate-500 uppercase block">Uptime</span>
                    <span className="font-bold text-white text-xs">{item.uptimePercentage}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[9px] text-slate-500 uppercase block">Error Rate</span>
                    <span className="font-bold text-slate-400 text-xs">{item.errorRatePercentage}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {item.details}
                </p>
              </div>
            ))}
          </div>

          {/* Historical Uptime Trend Grid */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>24-Hour Historical API Response & Uptime Trend</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {hourlyUptimeTrend.map((pt, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span>{pt.hourLabel}</span>
                    <span className="text-emerald-400 font-bold">{pt.uptimePercent}%</span>
                  </div>
                  <div className="h-12 flex items-end gap-1 bg-slate-900/60 p-1 rounded-xl">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-emerald-400 rounded-lg transition-all"
                      style={{ height: `${Math.min(100, (pt.latencyMs / 50) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>{pt.latencyMs}ms avg</span>
                    <span>{pt.requestVolume} reqs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE ROLLOUT MANAGEMENT */}
      {activeTab === 'feature_flags' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                <span>Feature Rollout & Flag Controls Console</span>
              </h3>
              <p className="text-xs text-slate-400">Gradual rollout percentages, beta testing groups, regional activations, and emergency safety killswitches.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200/90 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Feature flags manage application features and interface options; they never alter Official Pi authentication or payment integrity.</span>
          </div>

          {/* Feature Flags Cards List */}
          <div className="space-y-4">
            {featureFlagsList.map((flag) => (
              <div key={flag.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-white text-base">{flag.name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[10px] font-bold">
                        {flag.key}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        flag.status === 'ENABLED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : flag.status === 'DISABLED' ? 'bg-red-950 text-red-300 border-red-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {flag.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{flag.description}</p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 shrink-0">
                    {flag.previousRolloutState !== undefined && (
                      <button
                        onClick={() => handleRollbackFlag(flag.key)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 border border-slate-700"
                        title="Rollback to previous state"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Rollback</span>
                      </button>
                    )}

                    {flag.isEmergencyKillswitchCapable && flag.status !== 'DISABLED' && (
                      <button
                        onClick={() => setSelectedFlagForKillswitch(flag)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-red-600/30"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        <span>Emergency Disable</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Rollout % Slider & Configuration Details */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rollout Percentage</span>
                        <span className="font-black text-amber-400 text-sm">{flag.rolloutPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Target Regions</span>
                        <span className="font-bold text-slate-300">{flag.targetRegions.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Beta User Groups</span>
                        <span className="font-bold text-purple-300">{flag.betaGroups.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {editingRolloutKey === flag.key ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={editingRolloutVal}
                            onChange={(e) => setEditingRolloutVal(Number(e.target.value))}
                            className="w-32 accent-purple-500"
                          />
                          <button
                            onClick={() => handleSaveRolloutVal(flag.key)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRolloutKey(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRolloutKey(flag.key);
                            setEditingRolloutVal(flag.rolloutPercentage);
                          }}
                          className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-xs"
                        >
                          Adjust Rollout %
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        flag.status === 'DISABLED' ? 'bg-red-500' : 'bg-gradient-to-r from-purple-600 to-amber-400'
                      }`}
                      style={{ width: `${flag.rolloutPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & RECOVERY MONITORING */}
      {activeTab === 'backup_recovery' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <span>Backup & Recovery Readiness Monitor</span>
              </h3>
              <p className="text-xs text-slate-400">Database health scores, configuration snapshot hashes, recovery simulations, and integrity checks.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerSnapshot}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Trigger Config Snapshot
              </button>
              <button
                onClick={handleRunIntegrityCheck}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Run System Integrity Check
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Administrative visibility only. Infrastructure secrets, wallet private keys, and API credentials are zero-exposed.</span>
          </div>

          {/* Backup Status Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Database Health Score</span>
              <span className="text-2xl font-black text-emerald-400">{backupRecoveryStatus.databaseHealthScore}%</span>
              <span className="text-xs text-slate-400 block">Zero corrupted indices</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Recovery Readiness</span>
              <span className="text-2xl font-black text-indigo-400">{backupRecoveryStatus.recoveryReadinessPercent}%</span>
              <span className="text-xs text-slate-400 block">Tested & Verified</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Snapshot Size</span>
              <span className="text-2xl font-black text-white">{backupRecoveryStatus.sizeMb} MB</span>
              <span className="text-xs text-slate-400 block">{backupRecoveryStatus.backupType}</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Integrity Check</span>
              <span className="text-2xl font-black text-emerald-400">PASSED</span>
              <span className="text-[10px] text-slate-500 block truncate" title={backupRecoveryStatus.configSnapshotHash}>
                Hash: {backupRecoveryStatus.configSnapshotHash.slice(0, 16)}...
              </span>
            </div>
          </div>

          {/* Historical Snapshots Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Historical Snapshot Ledger</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Snapshot ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Size (MB)</th>
                    <th className="p-3">Verification Hash</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {backupRecoveryStatus.historicalSnapshots.map((snap) => (
                    <tr key={snap.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">{snap.id}</td>
                      <td className="p-3 text-purple-300 font-bold">{snap.type.replace(/_/g, ' ')}</td>
                      <td className="p-3 text-slate-300">{new Date(snap.timestampIso).toLocaleString()}</td>
                      <td className="p-3 font-mono">{snap.sizeMb} MB</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{snap.hash}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          {snap.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INCIDENT MANAGEMENT */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                <span>Centralized Incident Tracking Console</span>
              </h3>
              <p className="text-xs text-slate-400">Track service outages, performance degradation, API timeouts, and authentication incidents with severity classification.</p>
            </div>
            <button
              onClick={() => setIsCreateIncidentModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Report Incident</span>
            </button>
          </div>

          {/* Incidents List */}
          <div className="space-y-4">
            {incidentsList.map((inc) => (
              <div key={inc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-400 text-xs">{inc.code}</span>
                      <h4 className="font-bold text-white text-base">{inc.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Component: {inc.component.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                      inc.severity === 'SEV_1_CRITICAL' || inc.severity === 'SEV_2_HIGH'
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {inc.severity.replace(/_/g, ' ')}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      inc.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                    }`}>
                      {inc.status}
                    </span>

                    <button
                      onClick={() => setSelectedIncidentForUpdate(inc)}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                    >
                      Update Timeline
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {inc.impactSummary}
                </p>

                {/* Timeline History */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Incident Timeline Updates</span>
                  <div className="space-y-2">
                    {inc.timeline.map((update) => (
                      <div key={update.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-start justify-between gap-3">
                        <div>
                          <p className="text-slate-200">{update.updateText}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Updated by <span className="text-purple-300 font-bold">{update.updatedBy}</span> at {new Date(update.timestampIso).toLocaleString()}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px] font-bold">
                          {update.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB 2: USERS & IDENTITY DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Search & Filtering Control Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search by username, email, Pi wallet address, or store name..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Account Types</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Business">Business</option>
                <option value="Merchant">Merchant</option>
                <option value="Administrator">Administrator</option>
                <option value="Staff">Staff</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <select
                value={userKycFilter}
                onChange={(e) => setUserKycFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">All Identity Verification Levels</option>
                <option value="UNVERIFIED">Unverified</option>
                <option value="LEVEL_1_BASIC">Level 1 Basic</option>
                <option value="LEVEL_2_IDENTITY_VERIFIED">Level 2 Identity Verified</option>
                <option value="LEVEL_3_ENTERPRISE_MERCHANT">Level 3 Enterprise</option>
              </select>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Identity Accounts Directory ({filteredUsers.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">User / Merchant</th>
                    <th className="p-3">Role / Type</th>
                    <th className="p-3">Identity Verification</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{u.username}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{u.piWalletAddress}</span>
                            {u.storeName && (
                              <span className="text-[10px] text-amber-400 font-bold block">{u.storeName}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-purple-300 block">{u.role}</span>
                        <span className="text-[10px] text-slate-400 block">{u.accountType}</span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          u.kycLevel === 'LEVEL_2_IDENTITY_VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : u.kycLevel === 'LEVEL_1_BASIC'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {u.kycLevel.replace(/_/g, ' ')}
                        </span>
                        {u.kycDocuments.length > 0 && (
                          <button
                            onClick={() => setSelectedUserForKyc(u)}
                            className="text-[10px] text-purple-400 hover:underline block mt-1 font-bold"
                          >
                            Inspect {u.kycDocuments.length} Docs
                          </button>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`font-mono font-bold ${
                          u.riskScore > 50 ? 'text-red-400' : u.riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {u.riskScore}/100
                        </span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : u.status === 'SUSPENDED'
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {u.status}
                        </span>
                        {u.suspensionReason && (
                          <span className="text-[9px] text-red-400 block truncate max-w-[120px]" title={u.suspensionReason}>
                            {u.suspensionReason}
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-400 text-[11px]">
                        {new Date(u.registeredAt).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUserForRole(u);
                              setNewRoleSelection(u.role);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Assign Role"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          </button>

                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === 'SUSPENDED'
                                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                                : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800'
                            }`}
                            title={u.status === 'SUSPENDED' ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {u.status === 'SUSPENDED' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE-BASED ACCESS CONTROL (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Enterprise RBAC Permissions Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure granular access rights across 11 built-in platform roles or define custom permission groups.
              </p>
            </div>

            <button
              onClick={() => setIsCustomRoleModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Create Custom Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Roles Sidebar List */}
            <div className="lg:col-span-1 space-y-2 bg-slate-900 p-3 rounded-3xl border border-slate-800">
              <span className="text-[11px] font-extrabold uppercase text-slate-500 px-3 tracking-wider block">
                Platform Roles ({roleDefinitions.length})
              </span>
              {roleDefinitions.map((role) => (
                <button
                  key={role.roleId}
                  onClick={() => setSelectedRoleForMatrix(role.roleId)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between gap-2 ${
                    selectedRoleForMatrix === role.roleId
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{role.roleName}</span>
                    <span className="text-[10px] text-slate-400 block">{role.permissions.length} perms • {role.userCount} users</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedRoleForMatrix === role.roleId ? 'text-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>

            {/* Granular Permission Matrix Grid */}
            <div className="lg:col-span-3 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{activeRoleDefinition.roleName}</h3>
                    {activeRoleDefinition.isBuiltIn && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        Built-in Enterprise Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{activeRoleDefinition.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 block">
                    {activeRoleDefinition.permissions.length} / {ALL_GRANULAR_PERMISSIONS.length} Allowed
                  </span>
                </div>
              </div>

              {/* Categorized Permissions Checkboxes */}
              {['Platform Governance', 'User & Identity Management', 'Catalog & Content Policy', 'Utility & Billing Services', 'Financial & Transactions', 'Trust, Safety & Identity Verification'].map((cat) => {
                const catPerms = ALL_GRANULAR_PERMISSIONS.filter(p => p.category === cat);
                if (catPerms.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cat}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {catPerms.map((perm) => {
                        const isGranted = activeRoleDefinition.permissions.includes(perm.code);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => handleTogglePermission(perm.code)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                              isGranted
                                ? 'bg-purple-950/40 border-purple-800 text-white'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-xs font-black shrink-0 ${
                              isGranted ? 'bg-purple-600 text-white' : 'border border-slate-700 bg-slate-900'
                            }`}>
                              {isGranted && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <span className="font-bold text-xs block text-slate-200">{perm.label}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">{perm.code}</span>
                              <span className="text-[10px] text-slate-500 mt-0.5 block">{perm.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        </div>
      )}

      {/* TAB 4: MARKETPLACE CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Global Settings & Feature Toggles */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Global Platform Feature Controls</span>
              </h3>

              <div className="space-y-3 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Marketplace Order Protection Policy</span>
                    <span className="text-[10px] text-slate-400 block">Enforce marketplace order verification and buyer protection policies across all catalog products.</span>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('orderProtectionPolicyEnabled')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      globalSettings.orderProtectionPolicyEnabled ? 'bg-purple-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      globalSettings.orderProtectionPolicyEnabled ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Platform Maintenance Mode</span>
                    <span className="text-[10px] text-slate-400 block">Temporarily pause buyer order checkout while maintaining read access.</span>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('maintenanceMode')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      globalSettings.maintenanceMode ? 'bg-red-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      globalSettings.maintenanceMode ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Auto-Approve Level 1 Identity Verification</span>
                    <span className="text-[10px] text-slate-400 block">Automatically verify basic buyer profile information via Pi SDK v2 authentication.</span>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('autoApproveLevel1Kyc')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      globalSettings.autoApproveLevel1Kyc ? 'bg-purple-600' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      globalSettings.autoApproveLevel1Kyc ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Pi SDK API Request Management</span>
                    <span className="text-amber-400">{globalSettings.piSdkRateLimitPerMin} req/min</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Application-level API request controls for Pi Platform API endpoints to regulate request behavior and maintain optimized application performance.</p>
                </div>

              </div>
            </div>

            {/* Utility Gateways Control */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Utility & Bill Payment Gateways ({utilitiesList.length})</span>
              </h3>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {utilitiesList.map((utl) => (
                  <div key={utl.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{utl.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          utl.apiStatus === 'ONLINE' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {utl.apiStatus}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{utl.category} • Vol: {utl.dailyTxVolumePi.toLocaleString()} π/day</span>
                    </div>

                    <button
                      onClick={() => engine.toggleUtility(utl.id, !utl.enabled, currentAdminUsername)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        utl.enabled
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {utl.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Categories Manager Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Marketplace Product Categories Governance</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {categoriesList.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cat.name}</span>
                    <button
                      onClick={() => engine.toggleCategory(cat.id, !cat.enabled, currentAdminUsername)}
                      className={`w-8 h-4.5 rounded-full transition-colors relative ${
                        cat.enabled ? 'bg-purple-600' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        cat.enabled ? 'left-4' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Products: {cat.productCount}</span>
                    <span>Commission: {cat.commissionRatePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Platform Append-only Governance Audit Log</span>
            </h3>
            <span className="text-xs font-bold text-amber-400">
              {auditLogsList.length} Total System Actions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Admin Username</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Privacy-Protected Client ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium font-mono text-[11px]">
                {auditLogsList.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-white">{log.adminUsername}</td>
                    <td className="p-3 text-purple-300">{log.adminRole}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[9px] font-bold">
                        {log.targetType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{log.action}</td>
                    <td className="p-3 font-sans text-slate-300 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Identity Verification Document Inspector */}
      {selectedUserForKyc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <span>Marketplace Identity Verification Documents: {selectedUserForKyc.username}</span>
                </h3>
                <span className="text-xs text-slate-400">Account Type: {selectedUserForKyc.accountType}</span>
              </div>
              <button
                onClick={() => setSelectedUserForKyc(null)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300/90 font-medium">
              Notice: All identity and business verification processes are performed solely by PiNova Global Hub for platform compliance and safety, and do not represent official Pi Network identity verification.
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {selectedUserForKyc.kycDocuments.map((doc) => (
                <div key={doc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{doc.documentType.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300' : doc.status === 'REJECTED' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <img
                    src={doc.fileUrl}
                    alt={doc.documentType}
                    className="w-full h-36 object-cover rounded-xl border border-slate-800"
                  />

                  {doc.reviewerNotes && (
                    <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-xl italic">
                      Notes: {doc.reviewerNotes}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setReviewingDoc({ doc, user: selectedUserForKyc })}
                      className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-bold transition-all"
                    >
                      Review & Decide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KYC Action Decision */}
      {reviewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Review {reviewingDoc.doc.documentType.replace(/_/g, ' ')}</h3>
            
            <textarea
              placeholder="Enter review notes or verification audit details..."
              value={kycReviewNote}
              onChange={(e) => setKycReviewNote(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReviewingDoc(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewDocAction(false)}
                className="px-3.5 py-1.5 rounded-xl bg-red-950 text-red-300 border border-red-800 text-xs font-bold"
              >
                Reject Document
              </button>
              <button
                onClick={() => handleReviewDocAction(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Approve Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Assign Role */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Assign Role: {selectedUserForRole.username}</h3>
            
            <select
              value={newRoleSelection}
              onChange={(e) => setNewRoleSelection(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs font-bold"
            >
              {roleDefinitions.map((r) => (
                <option key={r.roleId} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForRole(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Save Role Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Account Suspension */}
      {selectedUserForSuspend && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-sm text-red-400">Suspend Account: {selectedUserForSuspend.username}</h3>
            <p className="text-xs text-slate-400">Specify the official compliance reason for account suspension. This action will be logged in the append-only audit trail.</p>

            <textarea
              placeholder="e.g. Counterfeit product listings flagged by content moderation."
              value={suspensionReasonInput}
              onChange={(e) => setSuspensionReasonInput(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForSuspend(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspension}
                disabled={!suspensionReasonInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm Account Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Custom Role */}
      {isCustomRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Create Custom RBAC Role</h3>
            
            <input
              type="text"
              placeholder="Role Name (e.g. Regional Regional Operations Officer)"
              value={customRoleName}
              onChange={(e) => setCustomRoleName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl"
            />

            <textarea
              placeholder="Description of permissions scope..."
              value={customRoleDesc}
              onChange={(e) => setCustomRoleDesc(e.target.value)}
              className="w-full h-16 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCustomRoleModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomRole}
                disabled={!customRoleName.trim() || !customRoleDesc.trim()}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Assign Dispute Moderator */}
      {selectedDisputeForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Assign Dispute Case Moderator</h3>
            </div>
            <p className="text-xs text-slate-400">Case ID: <span className="text-white font-bold">{selectedDisputeForAssign.id}</span></p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Select Staff Moderator</label>
              <select
                value={assignModeratorInput}
                onChange={(e) => setAssignModeratorInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs font-bold"
              >
                <option value="Trust_Moderator_Mark">Trust_Moderator_Mark (Level 2)</option>
                <option value="Compliance_Officer_Sarah">Compliance_Officer_Sarah (Level 3)</option>
                <option value="Dispute_Specialist_David">Dispute_Specialist_David (Level 2)</option>
                <option value="Escrow_Auditor_Elena">Escrow_Auditor_Elena (Level 3)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDisputeForAssign(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignModerator}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Record Administrative Dispute Decision */}
      {selectedDisputeForDecision && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Record Dispute Administrative Decision</h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Case ID:</span>
                <span className="font-bold text-white">{selectedDisputeForDecision.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escrow Value:</span>
                <span className="font-bold text-amber-400">{selectedDisputeForDecision.amountPi} π</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claimant:</span>
                <span className="font-bold text-purple-300">{selectedDisputeForDecision.buyerUsername}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Decision Resolution Outcome</label>
              <select
                value={disputeDecisionStatus}
                onChange={(e) => setDisputeDecisionStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs font-bold"
              >
                <option value="RESOLVED_BUYER_REFUND">Resolve & Trigger Buyer Escrow Refund</option>
                <option value="RESOLVED_SELLER_RELEASE">Resolve & Release Escrow Funds to Seller</option>
                <option value="AWAITING_EVIDENCE">Request Additional Dispute Evidence</option>
                <option value="DISMISSED">Dismiss Dispute Claim</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Administrative Decision Audit Notes</label>
              <textarea
                placeholder="Detail evidence reviewed, merchant communication, and official compliance reasoning..."
                value={disputeDecisionNotesInput}
                onChange={(e) => setDisputeDecisionNotesInput(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDisputeForDecision(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordDisputeDecision}
                disabled={!disputeDecisionNotesInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Record Decision & Execute Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Emergency Feature Flag Disable */}
      {selectedFlagForKillswitch && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/60 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">Emergency Feature Killswitch Activation</h3>
            </div>
            <p className="text-xs text-slate-300">Target Feature Flag: <span className="font-mono font-bold text-purple-300">{selectedFlagForKillswitch.key}</span></p>

            <textarea
              placeholder="Provide reason for immediate killswitch invocation (e.g. Degraded third-party provider latency detected)..."
              value={killswitchReasonInput}
              onChange={(e) => setKillswitchReasonInput(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedFlagForKillswitch(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmKillswitch}
                disabled={!killswitchReasonInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Invoke Emergency Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create System Incident Ticket */}
      {isCreateIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-white text-sm">Create Operational Incident Ticket</h3>
            </div>

            <input
              type="text"
              placeholder="Incident Title (e.g. Utility Provider Gateway Timeout)"
              value={newIncidentTitle}
              onChange={(e) => setNewIncidentTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Affected Component</label>
                <select
                  value={newIncidentComponent}
                  onChange={(e) => setNewIncidentComponent(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="PI_PLATFORM_API">Official Pi Platform API</option>
                  <option value="UTILITY_PROVIDER_GATEWAY">Utility Provider Gateway</option>
                  <option value="AI_SERVICE">AI Service Infrastructure</option>
                  <option value="NOTIFICATION_DISPATCHER">Notification Dispatcher</option>
                  <option value="ESCROW_MONITOR">Escrow State Monitor</option>
                  <option value="AUTH_SERVICE">Pi Auth Service</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Severity Rating</label>
                <select
                  value={newIncidentSeverity}
                  onChange={(e) => setNewIncidentSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="SEV_1_CRITICAL">SEV-1 Critical</option>
                  <option value="SEV_2_HIGH">SEV-2 High</option>
                  <option value="SEV_3_MEDIUM">SEV-3 Medium</option>
                  <option value="SEV_4_LOW">SEV-4 Low</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Detailed impact summary and initial triage observations..."
              value={newIncidentSummary}
              onChange={(e) => setNewIncidentSummary(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreateIncidentModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIncidentSubmit}
                disabled={!newIncidentTitle.trim() || !newIncidentSummary.trim()}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Submit Incident Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Incident Timeline Update */}
      {selectedIncidentForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Update Timeline for {selectedIncidentForUpdate.code}</h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block">Incident Status</label>
              <select
                value={incidentUpdateStatus}
                onChange={(e) => setIncidentUpdateStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs font-bold"
              >
                <option value="INVESTIGATING">Investigating</option>
                <option value="IDENTIFIED">Identified</option>
                <option value="MONITORING">Monitoring</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <textarea
              placeholder="Detail investigation findings, patch deployments, or resolution confirmation..."
              value={incidentUpdateText}
              onChange={(e) => setIncidentUpdateText(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIncidentForUpdate(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIncidentUpdateSubmit}
                disabled={!incidentUpdateText.trim()}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Post Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

