import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Building2, 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Activity, 
  Zap, 
  ThumbsUp, 
  Lock
} from 'lucide-react';
import { 
  trustModule, 
  VerificationRequest, 
  FraudAlert, 
  VerificationLevel, 
  TrustBadgeType, 
  TRUST_BADGES_CATALOG,
  VERIFICATION_REQUIREMENTS
} from '../../modules/trust';

export const AdminTrustCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'badges' | 'alerts' | 'reviews'>('verifications');
  const [verifications, setVerifications] = useState<VerificationRequest[]>(trustModule.getVerificationRequests());
  const [alerts, setAlerts] = useState<FraudAlert[]>(trustModule.fraudEngine.getAlerts());
  const [reviews, setReviews] = useState(trustModule.reviewEngine.getAllReviews());

  // Modal / Selection State
  const [selectedReq, setSelectedReq] = useState<VerificationRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Badge Assign State
  const [targetUser, setTargetUser] = useState('vendor-01');
  const [selectedBadge, setSelectedBadge] = useState<TrustBadgeType>('Verified Business');
  const [assignedSuccessMsg, setAssignedSuccessMsg] = useState<string | null>(null);

  const filteredRequests = verifications.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const handleApproveRequest = (reqId: string) => {
    trustModule.approveVerification(reqId, 'Admin_Compliance', adminNote);
    setVerifications([...trustModule.getVerificationRequests()]);
    setSelectedReq(null);
    setAdminNote('');
  };

  const handleRejectRequest = (reqId: string) => {
    if (!adminNote.trim()) {
      alert('Please provide a reason for rejecting the verification request.');
      return;
    }
    trustModule.rejectVerification(reqId, 'Admin_Compliance', adminNote);
    setVerifications([...trustModule.getVerificationRequests()]);
    setSelectedReq(null);
    setAdminNote('');
  };

  const handleResolveAlert = (alertId: string) => {
    trustModule.fraudEngine.resolveAlert(alertId, 'Admin_Security', 'Investigated and cleared by compliance team.');
    setAlerts([...trustModule.fraudEngine.getAlerts()]);
  };

  const handleAssignBadge = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignedSuccessMsg(`Successfully granted "${selectedBadge}" badge to ${targetUser}!`);
    setTimeout(() => setAssignedSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">PSTP Compliance & Identity Governance</span>
              <h2 className="text-2xl font-black">Admin Trust & Reputation Center</h2>
              <p className="text-xs text-slate-400 mt-1">Review merchant KYC/business verification requests, assign badges, monitor fraud alerts, and moderate customer reviews.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Pending Verifications: {verifications.filter(v => v.status === 'PENDING').length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Active Fraud Alerts: {alerts.filter(a => !a.resolved).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'verifications'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verification Queue ({verifications.filter(v => v.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'badges'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Trust Badges Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fraud & Anomaly Alerts ({alerts.filter(a => !a.resolved).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Review Moderation ({reviews.length})</span>
        </button>
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Status:</span>
              <div className="flex items-center gap-1">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                      statusFilter === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <div 
                key={req.id} 
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative hover:border-purple-500/40 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{req.id}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>@{req.applicantUsername}</span>
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    req.status === 'APPROVED' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      : req.status === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="font-medium">Requested Level:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{req.requestedLevel}</span>
                  </div>
                  {req.businessTaxId && (
                    <div className="flex justify-between">
                      <span className="font-medium">Tax/Business ID:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">{req.businessTaxId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Submitted At:</span>
                    <span>{new Date(req.submittedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Attached Governance Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.documentsProvided.map((doc, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                        <FileText className="w-3 h-3 text-purple-500" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {req.adminNote && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-slate-200 block mb-0.5">Admin Note ({req.reviewedBy}):</span>
                    {req.adminNote}
                  </div>
                )}

                {req.status === 'PENDING' && (
                  <div className="pt-3 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Decision</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FOR APPROVING / REJECTING VERIFICATION */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-500" />
                <span>Verification Decision — @{selectedReq.applicantUsername}</span>
              </h3>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
                <span className="font-bold block">Target Level: {selectedReq.requestedLevel}</span>
                <p className="mt-1 opacity-90">{VERIFICATION_REQUIREMENTS[selectedReq.requestedLevel]?.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Administrator Compliance Note:</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Provide approval reasoning or rejection rationale..."
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none h-24"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleApproveRequest(selectedReq.id)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Verification Level</span>
              </button>
              <button
                onClick={() => handleRejectRequest(selectedReq.id)}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRUST BADGES CATALOG & ASSIGNMENT */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Grant Badge Box */}
          <form onSubmit={handleAssignBadge} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Grant Administrative Trust Badge</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target User ID / Vendor ID:</label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  required
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Trust Badge:</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value as TrustBadgeType)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {(Object.keys(TRUST_BADGES_CATALOG) as TrustBadgeType[]).map((badgeKey) => (
                    <option key={badgeKey} value={badgeKey}>
                      {TRUST_BADGES_CATALOG[badgeKey].title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {assignedSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{assignedSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Assign Badge to User Account</span>
            </button>
          </form>

          {/* Badges Catalog Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(TRUST_BADGES_CATALOG) as TrustBadgeType[]).map((badgeKey) => {
              const b = TRUST_BADGES_CATALOG[badgeKey];
              return (
                <div key={badgeKey} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${b.badgeColor}`}>
                      {b.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {b.autoAssigned ? 'Auto-Rule' : 'Admin Manual'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FRAUD & ANOMALY ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alertItem) => (
              <div 
                key={alertItem.id}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border space-y-3 ${
                  alertItem.resolved 
                    ? 'border-slate-200 dark:border-slate-800 opacity-75' 
                    : 'border-rose-500/40 dark:border-rose-500/40 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${alertItem.resolved ? 'text-slate-400' : 'text-rose-500 animate-bounce'}`} />
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{alertItem.id}</span>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {alertItem.reason}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    alertItem.severity === 'HIGH' || alertItem.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  }`}>
                    Severity: {alertItem.severity}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p><span className="font-bold text-slate-900 dark:text-slate-100">Target Entity:</span> {alertItem.targetId} ({alertItem.targetType})</p>
                  <p><span className="font-bold text-slate-900 dark:text-slate-100">Evidence Record:</span> {alertItem.evidence}</p>
                  <p><span className="font-bold text-slate-900 dark:text-slate-100">Detected:</span> {new Date(alertItem.detectedAt).toLocaleString()}</p>
                </div>

                {alertItem.resolved ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Resolved by {alertItem.resolvedBy}: {alertItem.resolutionNote}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleResolveAlert(alertItem.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Investigate & Mark Resolved</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEW MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{rev.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{rev.comment}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>By @{rev.buyerUsername} for {rev.productTitle}</span>
                  <span className="font-mono text-purple-500 font-bold">Helpful Votes: {rev.helpfulVotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
