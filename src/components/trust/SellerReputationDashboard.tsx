import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Zap, 
  MessageSquare, 
  Building2, 
  FileText, 
  ChevronRight,
  ThumbsUp
} from 'lucide-react';
import { 
  trustModule, 
  TrustScoreCalculator, 
  ReputationMetrics, 
  VerificationLevel, 
  TrustBadgeType, 
  TRUST_BADGES_CATALOG,
  VERIFICATION_REQUIREMENTS
} from '../../modules/trust';

interface SellerReputationDashboardProps {
  sellerUsername?: string;
  sellerId?: string;
}

export const SellerReputationDashboard: React.FC<SellerReputationDashboardProps> = ({
  sellerUsername = 'vendor_electronics_kenya',
  sellerId = 'vendor-01'
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<VerificationLevel>('Verified Business');
  const [taxIdInput, setTaxIdInput] = useState('');
  const [requestSubmittedMsg, setRequestSubmittedMsg] = useState<string | null>(null);

  // Mock Active Metrics
  const metrics: ReputationMetrics = {
    userId: sellerId,
    username: sellerUsername,
    role: 'seller',
    verificationLevel: 'Verified Seller',
    badges: ['Verified Identity', 'Verified Seller', 'Fast Shipping', 'Top Rated Seller'],
    completedOrders: 42,
    successfulDeliveries: 41,
    customerRating: 4.88,
    totalReviewsCount: 28,
    responseTimeMinutes: 12,
    orderCancellationRatePct: 1.2,
    refundRatePct: 0.8,
    disputeResolutionRatePct: 100,
    policyComplianceScore: 98,
    trustScore: 96.4,
    calculatedAt: new Date().toISOString()
  };

  const reviews = trustModule.reviewEngine.getReviewsForSeller(sellerId);

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trustModule.submitVerificationRequest(sellerUsername, selectedLevel, ['Business License', 'Tax Registration'], taxIdInput);
    setRequestSubmittedMsg(`Verification request for "${selectedLevel}" submitted to PSTP Admin Compliance!`);
    setTimeout(() => {
      setRequestSubmittedMsg(null);
      setShowUpgradeModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Reputation Hero Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-2xl font-black text-amber-400">{metrics.trustScore}%</span>
              <span className="text-[9px] uppercase font-bold text-amber-300">Trust Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">@{metrics.username}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {metrics.verificationLevel}
                </span>
              </div>
              <h2 className="text-2xl font-black mt-0.5">Seller Performance Metrics & Verified Ratings</h2>
              <p className="text-xs text-slate-400 mt-1">High seller performance metrics increase product search ranking and display verified seller ratings across PiNova Marketplace.</p>
            </div>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Apply for Business Verification</span>
          </button>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Customer Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{metrics.customerRating} / 5.0</div>
          <span className="text-[10px] text-emerald-500 font-bold">Based on {metrics.totalReviewsCount} verified reviews</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Order Fulfillment</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{metrics.completedOrders} Orders</div>
          <span className="text-[10px] text-slate-400">100% Successful Deliveries</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Avg Response Time</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{metrics.responseTimeMinutes} Mins</div>
          <span className="text-[10px] text-cyan-500 font-bold">Fast Support Badge Qualified</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Dispute Resolution</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">{metrics.disputeResolutionRatePct}%</div>
          <span className="text-[10px] text-purple-400 font-bold">Zero Unresolved Claims</span>
        </div>
      </div>

      {/* Badges Display */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Active Store Badges ({metrics.badges.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.badges.map((bKey) => {
            const badge = TRUST_BADGES_CATALOG[bKey];
            if (!badge) return null;
            return (
              <div key={bKey} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.badgeColor}`}>
                  {badge.title}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Verified Customer Reviews ({reviews.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Verified Purchaser
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{r.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{r.comment}</p>
              <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                <span>By @{r.buyerUsername}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPGRADE LEVEL MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleUpgradeSubmit} className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>Request Verification Level Upgrade</span>
              </h3>
              <button type="button" onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-200 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Verification Tier:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as VerificationLevel)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none"
                >
                  <option value="Verified Business">Verified Business (Tax & Corporate Cert)</option>
                  <option value="Trusted Merchant">Trusted Merchant (50+ Orders & Top Rating)</option>
                  <option value="Enterprise Merchant">Enterprise Merchant (Dedicated SLA)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Registration / Tax ID Number:</label>
                <input
                  type="text"
                  value={taxIdInput}
                  onChange={(e) => setTaxIdInput(e.target.value)}
                  placeholder="e.g. KRA-VAT-89102 or US-EIN-981240"
                  required
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-bold outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200 block">Verification Requirements:</span>
                <p>{VERIFICATION_REQUIREMENTS[selectedLevel]?.description}</p>
              </div>

              {requestSubmittedMsg && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{requestSubmittedMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Submit Upgrade Request to PSTP Admin
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
