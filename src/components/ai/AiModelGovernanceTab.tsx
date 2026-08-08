import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Activity,
  Sliders,
  Cpu,
  Calendar,
  Zap,
  Check,
  FileCheck,
  Key,
  Award,
  BarChart3,
  ListFilter,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  AIProviderKey,
  AIModelVersionRecord,
  AIModelApprovalRequest,
  AIModelDeploymentRecord,
  AIStagedRolloutConfig,
  AIProviderSlaMetrics,
  AIModelRetirementRecord,
  AIAuditLog
} from '../../modules/ai';

interface AiModelGovernanceTabProps {
  onAddAuditLog: (
    user: string,
    role: 'Buyer' | 'Merchant' | 'Admin' | 'System',
    provider: string,
    action: string,
    promptSnippet: string,
    responseSnippet: string,
    status: string
  ) => void;
  setNoticeMessage: (msg: string | null) => void;
}

export const AiModelGovernanceTab: React.FC<AiModelGovernanceTabProps> = ({
  onAddAuditLog,
  setNoticeMessage
}) => {
  // ----------------------------------------------------
  // 1. AI MODEL APPROVAL WORKFLOW STATE
  // ----------------------------------------------------
  const [approvalRequests, setApprovalRequests] = useState<AIModelApprovalRequest[]>([
    {
      id: 'app-901',
      modelName: 'Google Gemini 3.7 Flash Pro Candidate',
      providerKey: 'gemini',
      targetVersion: 'v3.7.0-beta',
      requestedBy: '@AI_Research_Lead',
      requestDate: '2026-08-02 14:20',
      status: 'Pending_Review',
      justificationNotes: 'Upgrades context window to 1M tokens, reduces latency by 25% for mobile search and merchant copywriting.'
    },
    {
      id: 'app-900',
      modelName: 'Google Gemini 3.6 Flash',
      providerKey: 'gemini',
      targetVersion: 'v3.6.2',
      requestedBy: '@Engineering_Team',
      requestDate: '2026-07-14 09:10',
      status: 'Approved',
      justificationNotes: 'Passed all safety, accuracy, and Pi Network e-commerce compliance benchmarks.',
      reviewerNotes: 'Approved for primary production routing.',
      reviewerName: '@Governance_Admin_Signoff',
      reviewDate: '2026-07-15 08:00',
      signatureVerificationHash: 'SIG-SHA256-PI-NOVA-882390F11A9C4E22'
    },
    {
      id: 'app-899',
      modelName: 'Unfiltered Experimental Model',
      providerKey: 'custom',
      targetVersion: 'v0.1-exp',
      requestedBy: '@External_Contributor',
      requestDate: '2026-06-28 11:45',
      status: 'Rejected',
      justificationNotes: 'Experimental model tested for raw product scraping.',
      reviewerNotes: 'Rejected due to failure on seed phrase & phishing moderation checks.',
      reviewerName: '@Safety_Officer',
      reviewDate: '2026-06-29 10:15',
      signatureVerificationHash: 'SIG-SHA256-REJECTED-771890332B1'
    }
  ]);

  const [showNewApprovalModal, setShowNewApprovalModal] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    modelName: '',
    providerKey: 'gemini' as AIProviderKey,
    targetVersion: '',
    justificationNotes: ''
  });

  const [reviewModalState, setReviewModalState] = useState<{
    open: boolean;
    request: AIModelApprovalRequest | null;
    reviewerName: string;
    reviewerNotes: string;
    action: 'approve' | 'reject';
  }>({
    open: false,
    request: null,
    reviewerName: '@Governance_Admin',
    reviewerNotes: '',
    action: 'approve'
  });

  const handleCreateApprovalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestForm.modelName || !newRequestForm.targetVersion) return;

    const req: AIModelApprovalRequest = {
      id: `app-${Date.now()}`,
      modelName: newRequestForm.modelName,
      providerKey: newRequestForm.providerKey,
      targetVersion: newRequestForm.targetVersion,
      requestedBy: '@Admin_User',
      requestDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending_Review',
      justificationNotes: newRequestForm.justificationNotes || 'Requested for evaluation.'
    };

    setApprovalRequests(prev => [req, ...prev]);
    setShowNewApprovalModal(false);
    setNewRequestForm({ modelName: '', providerKey: 'gemini', targetVersion: '', justificationNotes: '' });
    setNoticeMessage(`Approval request submitted for ${req.modelName} (${req.targetVersion}).`);

    onAddAuditLog(
      '@Admin_User',
      'Admin',
      req.providerKey,
      'Submit AI Model Approval Request',
      req.modelName,
      `Target Version: ${req.targetVersion}, Status: Pending_Review`,
      'Success'
    );
  };

  const handleExecuteReview = () => {
    if (!reviewModalState.request) return;
    const req = reviewModalState.request;
    const isApprove = reviewModalState.action === 'approve';

    const hash = `SIG-SHA256-PI-NOVA-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;

    setApprovalRequests(prev =>
      prev.map(item => {
        if (item.id === req.id) {
          return {
            ...item,
            status: isApprove ? 'Approved' : 'Rejected',
            reviewerName: reviewModalState.reviewerName,
            reviewerNotes: reviewModalState.reviewerNotes || (isApprove ? 'Approved after safety audit.' : 'Rejected by reviewer.'),
            reviewDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatureVerificationHash: hash
          };
        }
        return item;
      })
    );

    setNoticeMessage(`Model Approval Workflow: ${req.modelName} ${isApprove ? 'APPROVED' : 'REJECTED'}. Signature Hash: ${hash}`);
    setReviewModalState({ open: false, request: null, reviewerName: '@Governance_Admin', reviewerNotes: '', action: 'approve' });

    onAddAuditLog(
      reviewModalState.reviewerName,
      'Admin',
      req.providerKey,
      isApprove ? 'Approve AI Model Version' : 'Reject AI Model Version',
      `${req.modelName} ${req.targetVersion}`,
      `Reviewer notes: ${reviewModalState.reviewerNotes}. Signature: ${hash}`,
      isApprove ? 'Approved' : 'Rejected'
    );
  };

  // ----------------------------------------------------
  // 2. MODEL DEPLOYMENT HISTORY STATE
  // ----------------------------------------------------
  const [deploymentHistory, setDeploymentHistory] = useState<AIModelDeploymentRecord[]>([
    {
      id: 'dep-101',
      modelName: 'Google Gemini 3.6 Flash',
      providerKey: 'gemini',
      version: 'v3.6.2',
      deployedAt: '2026-07-15 08:30',
      environmentTag: 'prod-primary',
      deploymentStatus: 'Deployed',
      durationMinutes: 28800,
      rollbackTargetVersion: 'v3.5.8',
      deployedBy: '@Deployment_Engine',
      notes: 'Active primary production build serving global catalog search & copywriting.'
    },
    {
      id: 'dep-100',
      modelName: 'OpenAI GPT-4o',
      providerKey: 'openai',
      version: 'v2026.04',
      deployedAt: '2026-04-20 12:00',
      environmentTag: 'prod-primary',
      deploymentStatus: 'Deployed',
      durationMinutes: 153600,
      rollbackTargetVersion: 'v2025.12',
      deployedBy: '@System_Admin',
      notes: 'Active failover target for peak load distribution.'
    },
    {
      id: 'dep-099',
      modelName: 'Google Gemini 3.5 Pro',
      providerKey: 'gemini',
      version: 'v3.5.8',
      deployedAt: '2026-05-10 10:00',
      environmentTag: 'rollback-target',
      deploymentStatus: 'Rolled_Back',
      durationMinutes: 14400,
      rollbackTargetVersion: 'v3.5.2',
      deployedBy: '@Governance_Officer',
      notes: 'Verified stable previous build ready as 1-click fallback.'
    },
    {
      id: 'dep-098',
      modelName: 'Claude 3.5 Sonnet',
      providerKey: 'anthropic',
      version: 'v2.1',
      deployedAt: '2026-03-30 14:00',
      environmentTag: 'staging',
      deploymentStatus: 'Deployed',
      durationMinutes: 180000,
      rollbackTargetVersion: 'v2.0',
      deployedBy: '@QA_Lead',
      notes: 'Active in staging environment for dispute resolution analysis.'
    }
  ]);

  const [deploymentFilterTag, setDeploymentFilterTag] = useState<string>('All');

  // ----------------------------------------------------
  // 3. STAGED ROLLOUT (CANARY) MANAGEMENT STATE
  // ----------------------------------------------------
  const [stagedRollout, setStagedRollout] = useState<AIStagedRolloutConfig>({
    modelId: 'ver-gemini-3.7.0',
    modelName: 'Google Gemini 3.7 Flash Pro Candidate',
    version: 'v3.7.0',
    canaryPercentage: 15,
    rampStrategy: 'Progressive Linear 5-100%',
    healthThresholds: {
      maxErrorRatePct: 1.5,
      maxP95LatencyMs: 250,
      minQualityScorePct: 95.0
    },
    currentStep: 'Step 2/4: 15% Canary Allocation Active',
    autoAbortTriggered: false
  });

  const handleUpdateCanaryPercentage = (pct: number) => {
    let stepLabel = `Custom Allocation: ${pct}% Traffic`;
    if (pct <= 5) stepLabel = 'Step 1/4: 5% Initial Canary Baseline';
    else if (pct <= 25) stepLabel = `Step 2/4: ${pct}% Progressive Ramp`;
    else if (pct <= 50) stepLabel = `Step 3/4: ${pct}% Half-Traffic Scale`;
    else if (pct === 100) stepLabel = 'Step 4/4: 100% Full Production Promotion';

    setStagedRollout(prev => ({
      ...prev,
      canaryPercentage: pct,
      currentStep: stepLabel,
      autoAbortTriggered: false
    }));

    setNoticeMessage(`Staged Rollout: Canary traffic allocation updated to ${pct}%.`);
    onAddAuditLog(
      '@Admin_Operator',
      'Admin',
      'Staged_Rollout_Engine',
      'Update Canary Traffic Allocation',
      stagedRollout.modelName,
      `Allocated ${pct}% traffic. Strategy: ${stagedRollout.rampStrategy}`,
      'Canary_Updated'
    );
  };

  const handleSimulateErrorSpike = () => {
    setStagedRollout(prev => ({
      ...prev,
      canaryPercentage: 0,
      currentStep: 'AUTO-ABORT EXECUTED: 0% Traffic (Safely Rolled Back)',
      autoAbortTriggered: true,
      abortReason: 'Error rate spike detected (5.2% > 1.5% threshold) on canary traffic stream.'
    }));

    setNoticeMessage('🚨 AUTOMATIC ROLLOUT ABORT: Error rate spike (5.2%) breached 1.5% threshold! Canary traffic reset to 0%. System safely fallback to primary production model.');

    onAddAuditLog(
      'System_Health_Guard',
      'System',
      stagedRollout.modelName,
      'Automated Canary Rollout Abort',
      'Error rate threshold breached (5.2% > 1.5%)',
      'Canary reset to 0%. Reverted traffic to primary model.',
      'Rollback_Executed'
    );
  };

  // ----------------------------------------------------
  // 4. EMERGENCY ROLLBACK STATE & HANDLER
  // ----------------------------------------------------
  const handleExecuteEmergencyRollback = () => {
    setNoticeMessage('⚡ EMERGENCY KILL-SWITCH EXECUTED: Production traffic immediately reverted to last stable build (Google Gemini 3.5 Pro v3.5.8) with zero downtime.');

    onAddAuditLog(
      '@Governance_Admin',
      'Admin',
      'Google Gemini 3.5 Pro',
      'Emergency Rollback Kill-Switch Execution',
      'Zero-downtime fallback to v3.5.8',
      'Reverted active production routing to stable build v3.5.8.',
      'Rollback_Executed'
    );
  };

  // ----------------------------------------------------
  // 5. PROVIDER SLA MONITORING STATE
  // ----------------------------------------------------
  const [slaMetricsList] = useState<AIProviderSlaMetrics[]>([
    {
      providerKey: 'gemini',
      providerName: 'Google Gemini 3.6 Flash',
      avgLatencyMs: 124,
      p95LatencyMs: 182,
      p99LatencyMs: 245,
      availabilityUptimePct: 99.98,
      tokenThroughputPerSec: 1450,
      rateLimitConsumptionPct: 34,
      costPerCallPi: 0.0002,
      errorRatePct: 0.2,
      errorBreakdown: { rateLimit429: 0.1, serverError500: 0.08, timeout504: 0.02 }
    },
    {
      providerKey: 'openai',
      providerName: 'OpenAI GPT-4o',
      avgLatencyMs: 185,
      p95LatencyMs: 290,
      p99LatencyMs: 410,
      availabilityUptimePct: 99.91,
      tokenThroughputPerSec: 920,
      rateLimitConsumptionPct: 48,
      costPerCallPi: 0.0005,
      errorRatePct: 0.4,
      errorBreakdown: { rateLimit429: 0.25, serverError500: 0.1, timeout504: 0.05 }
    },
    {
      providerKey: 'anthropic',
      providerName: 'Anthropic Claude 3.5 Sonnet',
      avgLatencyMs: 142,
      p95LatencyMs: 210,
      p99LatencyMs: 315,
      availabilityUptimePct: 99.95,
      tokenThroughputPerSec: 1100,
      rateLimitConsumptionPct: 22,
      costPerCallPi: 0.0004,
      errorRatePct: 0.15,
      errorBreakdown: { rateLimit429: 0.08, serverError500: 0.05, timeout504: 0.02 }
    },
    {
      providerKey: 'deepseek',
      providerName: 'DeepSeek V3 Commerce',
      avgLatencyMs: 88,
      p95LatencyMs: 140,
      p99LatencyMs: 195,
      availabilityUptimePct: 99.85,
      tokenThroughputPerSec: 2100,
      rateLimitConsumptionPct: 18,
      costPerCallPi: 0.0001,
      errorRatePct: 0.5,
      errorBreakdown: { rateLimit429: 0.3, serverError500: 0.15, timeout504: 0.05 }
    }
  ]);

  // ----------------------------------------------------
  // 6. MODEL RETIREMENT WORKFLOW STATE
  // ----------------------------------------------------
  const [retirementRecords, setRetirementRecords] = useState<AIModelRetirementRecord[]>([
    {
      modelId: 'ret-1',
      modelName: 'Google Gemini 3.0 Flash',
      version: 'v3.0.1',
      scheduledSunsetDate: '2026-09-30',
      gracefulNoticeSent: true,
      trafficRerouteTarget: 'Google Gemini 3.6 Flash (v3.6.2)',
      archivationStatus: 'Scheduled_Sunset',
      notes: 'Legacy 3.0 build scheduled for graceful sunset. Automatic rerouting rule configured.'
    },
    {
      modelId: 'ret-2',
      modelName: 'OpenAI GPT-3.5 Turbo',
      version: 'v1.0.0',
      scheduledSunsetDate: '2026-01-15',
      gracefulNoticeSent: true,
      trafficRerouteTarget: 'OpenAI GPT-4o (v2026.04)',
      archivationStatus: 'Archived',
      notes: 'Fully retired and archived. Historical metrics preserved.'
    }
  ]);

  const [newSunsetDate, setNewSunsetDate] = useState('2026-10-31');

  const handleScheduleRetirement = (modelId: string) => {
    setRetirementRecords(prev =>
      prev.map(item => {
        if (item.modelId === modelId) {
          return {
            ...item,
            scheduledSunsetDate: newSunsetDate,
            archivationStatus: 'Scheduled_Sunset',
            gracefulNoticeSent: true
          };
        }
        return item;
      })
    );

    setNoticeMessage(`Model Retirement Workflow: Deprecation scheduled for ${newSunsetDate}. Graceful notices dispatched to API consumers.`);

    onAddAuditLog(
      '@Governance_Admin',
      'Admin',
      'Model_Retirement_Engine',
      'Schedule Model Retirement & Deprecation',
      `Model ID: ${modelId}`,
      `Sunset date set to ${newSunsetDate}. Automated traffic rerouting enabled.`,
      'Success'
    );
  };

  const handleDispatchDeprecationNotice = (record: AIModelRetirementRecord) => {
    setNoticeMessage(`Graceful Deprecation Notice dispatched to active merchant API consumers for ${record.modelName} ${record.version}. Sunset target: ${record.scheduledSunsetDate}`);

    onAddAuditLog(
      '@Governance_Admin',
      'Admin',
      record.modelName,
      'Dispatch Graceful API Deprecation Notice',
      record.version,
      `Broadcast notice to API consumers. Traffic reroute target: ${record.trafficRerouteTarget}`,
      'Success'
    );
  };

  const filteredDeployments = deploymentHistory.filter(d =>
    deploymentFilterTag === 'All' ? true : d.environmentTag === deploymentFilterTag
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION 1: EMERGENCY ROLLBACK KILL-SWITCH BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-rose-600/60 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>Emergency Kill-Switch & Production Safeguard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Emergency AI Model Rollback Center
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Instantly revert active production routing to last stable build (<strong className="text-amber-300">Google Gemini 3.5 Pro v3.5.8</strong>) with zero downtime, instant system alerts, and immutable audit logs.
          </p>
        </div>

        <button
          onClick={handleExecuteEmergencyRollback}
          className="px-6 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs rounded-2xl shadow-xl hover:shadow-rose-600/30 transition-all flex items-center gap-2 shrink-0 border border-white/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-white" />
          <span>Execute Instant 1-Click Rollback</span>
        </button>
      </div>

      {/* SECTION 2: AI MODEL APPROVAL WORKFLOW */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" /> AI Model Approval Workflow & Governance Sign-Off
            </h3>
            <p className="text-xs text-slate-500">
              Submit, review, approve, or reject candidate AI models with reviewer justification notes and cryptographic verification signature hashes.
            </p>
          </div>

          <button
            onClick={() => setShowNewApprovalModal(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-purple-600/20"
          >
            <Zap className="w-4 h-4" /> Request Model Approval
          </button>
        </div>

        {/* Approval Requests Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvalRequests.map(req => (
            <div
              key={req.id}
              className={`p-4 rounded-2xl border space-y-3 text-xs ${
                req.status === 'Pending_Review'
                  ? 'bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-white'
                  : req.status === 'Approved'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-white truncate">{req.modelName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  req.status === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : req.status === 'Rejected'
                    ? 'bg-rose-500/20 text-rose-500'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div>Target Version: <span className="font-mono text-slate-900 dark:text-slate-200">{req.targetVersion}</span></div>
                <div>Requested By: <strong>{req.requestedBy}</strong> ({req.requestDate})</div>
                <div className="text-[10px] italic text-slate-600 dark:text-slate-400">"{req.justificationNotes}"</div>
              </div>

              {req.status === 'Pending_Review' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                  <button
                    onClick={() => setReviewModalState({ open: true, request: req, reviewerName: '@Governance_Admin', reviewerNotes: '', action: 'approve' })}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setReviewModalState({ open: true, request: req, reviewerName: '@Governance_Admin', reviewerNotes: '', action: 'reject' })}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1"
                  >
                    Reject
                  </button>
                </div>
              )}

              {req.status !== 'Pending_Review' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[10px] text-slate-500">
                  <div>Reviewed By: <strong className="text-slate-800 dark:text-slate-200">{req.reviewerName}</strong> ({req.reviewDate})</div>
                  {req.reviewerNotes && <div>Notes: {req.reviewerNotes}</div>}
                  {req.signatureVerificationHash && (
                    <div className="font-mono text-[9px] text-purple-600 dark:text-purple-400 font-bold truncate">
                      Signature: {req.signatureVerificationHash}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: STAGED ROLLOUT (CANARY TRAFFIC ALLOCATION) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" /> Staged Rollout & Canary Traffic Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Control percentage-based canary traffic allocation (1%-100%), set metric thresholds, and test automated rollbacks on error spikes.
            </p>
          </div>

          <button
            onClick={handleSimulateErrorSpike}
            className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" /> Simulate Canary Error Spike
          </button>
        </div>

        {/* Active Rollout Card */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Candidate Model in Canary Deployment</span>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">{stagedRollout.modelName} ({stagedRollout.version})</h4>
              <span className="text-xs text-purple-400 font-semibold">{stagedRollout.currentStep}</span>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-amber-400">{stagedRollout.canaryPercentage}%</span>
              <span className="text-[10px] text-slate-400 block font-semibold">Canary Traffic Allocated</span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={1}
              max={100}
              value={stagedRollout.canaryPercentage}
              onChange={e => handleUpdateCanaryPercentage(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>1% Canary Test</span>
              <span>25% Ramp</span>
              <span>50% Scale</span>
              <span>100% Full Promotion</span>
            </div>
          </div>

          {/* Quick Ramp Presets */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[5, 25, 50, 100].map(p => (
              <button
                key={p}
                onClick={() => handleUpdateCanaryPercentage(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  stagedRollout.canaryPercentage === p
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-purple-500/20'
                }`}
              >
                Ramp to {p}%
              </button>
            ))}
          </div>

          {/* Threshold Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Max Error Rate Threshold</span>
              <span className="font-bold text-emerald-400">&lt; {stagedRollout.healthThresholds.maxErrorRatePct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Max P95 Latency Threshold</span>
              <span className="font-bold text-indigo-400">&lt; {stagedRollout.healthThresholds.maxP95LatencyMs} ms</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Quality Score Threshold</span>
              <span className="font-bold text-amber-400">&gt; {stagedRollout.healthThresholds.minQualityScorePct}%</span>
            </div>
          </div>

          {stagedRollout.autoAbortTriggered && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4" /> AUTO-ABORT EXECUTED
              </div>
              <p className="text-[11px] leading-relaxed text-rose-200">{stagedRollout.abortReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: MODEL DEPLOYMENT HISTORY LOG */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Production Model Deployment History Log
            </h3>
            <p className="text-xs text-slate-500">
              Detailed chronological record of active model deployments, environment tags, rollout duration, and target rollback versions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-bold shrink-0">Filter Tag:</span>
            {['All', 'prod-primary', 'staging', 'canary-10', 'rollback-target'].map(tag => (
              <button
                key={tag}
                onClick={() => setDeploymentFilterTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap ${
                  deploymentFilterTag === tag
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Deployed At</th>
                <th className="py-2.5 px-3">Model Name & Version</th>
                <th className="py-2.5 px-3">Environment Tag</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Rollback Target</th>
                <th className="py-2.5 px-3 text-right">Deployed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeployments.map(dep => (
                <tr key={dep.id}>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{dep.deployedAt}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {dep.modelName}
                    <span className="block text-[10px] text-purple-500 font-mono">{dep.version}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-300 dark:border-slate-700">
                      {dep.environmentTag}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dep.deploymentStatus === 'Deployed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : dep.deploymentStatus === 'Rolled_Back'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}>
                      {dep.deploymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{dep.durationMinutes / 60}h active</td>
                  <td className="py-3 px-3 font-mono text-indigo-400">{dep.rollbackTargetVersion}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">{dep.deployedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: PROVIDER SLA MONITORING */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" /> AI Provider SLA & Real-Time Performance Telemetry
          </h3>
          <p className="text-xs text-slate-500">
            Monitor response latencies (p95/p99), uptime availability %, token throughput, rate limit consumption, and error breakdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {slaMetricsList.map(sla => (
            <div
              key={sla.providerKey}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between font-black text-slate-900 dark:text-white">
                <span>{sla.providerName}</span>
                <span className="text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  {sla.availabilityUptimePct}% Uptime
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Latency:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sla.avgLatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">p95 Latency:</span>
                  <span className="font-bold text-indigo-400">{sla.p95LatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">p99 Latency:</span>
                  <span className="font-bold text-purple-400">{sla.p99LatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Token Throughput:</span>
                  <span className="font-bold text-emerald-400">{sla.tokenThroughputPerSec} tok/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate Limit Used:</span>
                  <span className="font-bold text-amber-400">{sla.rateLimitConsumptionPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Error Rate:</span>
                  <span className="font-bold text-rose-400">{sla.errorRatePct}%</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Error Breakdown:</span>
                <div>429 Rate Limits: {sla.errorBreakdown.rateLimit429}%</div>
                <div>500 Server Errors: {sla.errorBreakdown.serverError500}%</div>
                <div>504 Timeouts: {sla.errorBreakdown.timeout504}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: MODEL RETIREMENT & DEPRECATION WORKFLOW */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" /> Model Retirement & Sunset Deprecation Workflow
            </h3>
            <p className="text-xs text-slate-500">
              Schedule model deprecation, send graceful notices to API consumers, configure automated traffic rerouting, and archive sunset models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newSunsetDate}
              onChange={e => setNewSunsetDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {retirementRecords.map(ret => (
            <div
              key={ret.modelId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{ret.modelName} ({ret.version})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  ret.archivationStatus === 'Archived' ? 'bg-slate-500/20 text-slate-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {ret.archivationStatus}
                </span>
              </div>

              <p className="text-[11px] text-slate-500">{ret.notes}</p>

              <div className="space-y-1 text-[11px]">
                <div>Sunset Date Target: <strong className="text-amber-500">{ret.scheduledSunsetDate}</strong></div>
                <div>Automated Traffic Reroute Target: <strong className="text-purple-400">{ret.trafficRerouteTarget}</strong></div>
                <div>Graceful Broadcast Notice: {ret.gracefulNoticeSent ? 'Dispatched to API consumers' : 'Pending dispatch'}</div>
              </div>

              {ret.archivationStatus !== 'Archived' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleScheduleRetirement(ret.modelId)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs"
                  >
                    Set Sunset Date ({newSunsetDate})
                  </button>
                  <button
                    onClick={() => handleDispatchDeprecationNotice(ret)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs"
                  >
                    Broadcast Deprecation Notice
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NEW REQUEST APPROVAL MODAL */}
      {showNewApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Request AI Model Approval</h3>
            <form onSubmit={handleCreateApprovalRequest} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Model Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gemini 3.7 Flash Pro"
                  value={newRequestForm.modelName}
                  onChange={e => setNewRequestForm({ ...newRequestForm, modelName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Version:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v3.7.0"
                  value={newRequestForm.targetVersion}
                  onChange={e => setNewRequestForm({ ...newRequestForm, targetVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Justification & Notes:</label>
                <textarea
                  rows={3}
                  placeholder="Explain accuracy gains, latency benchmarks, or safety tests..."
                  value={newRequestForm.justificationNotes}
                  onChange={e => setNewRequestForm({ ...newRequestForm, justificationNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewApprovalModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & SIGN-OFF MODAL */}
      {reviewModalState.open && reviewModalState.request && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              {reviewModalState.action === 'approve' ? 'Approve AI Model Version' : 'Reject AI Model Version'}
            </h3>
            <p className="text-xs text-slate-500">
              Evaluating: <strong className="text-slate-900 dark:text-white">{reviewModalState.request.modelName} ({reviewModalState.request.targetVersion})</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reviewer Sign-Off Name:</label>
                <input
                  type="text"
                  value={reviewModalState.reviewerName}
                  onChange={e => setReviewModalState({ ...reviewModalState, reviewerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Justification / Audit Notes:</label>
                <textarea
                  rows={3}
                  value={reviewModalState.reviewerNotes}
                  onChange={e => setReviewModalState({ ...reviewModalState, reviewerNotes: e.target.value })}
                  placeholder="Provide approval reasoning or rejection grounds..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-mono">
                Cryptographic signature verification hash will be auto-generated upon sign-off.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleExecuteReview}
                  className={`flex-1 py-2.5 text-white font-bold rounded-xl ${
                    reviewModalState.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm {reviewModalState.action === 'approve' ? 'Approval' : 'Rejection'}
                </button>
                <button
                  onClick={() => setReviewModalState({ open: false, request: null, reviewerName: '@Governance_Admin', reviewerNotes: '', action: 'approve' })}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
