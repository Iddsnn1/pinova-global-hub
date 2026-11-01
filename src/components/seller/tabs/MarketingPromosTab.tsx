import React, { useEffect, useState } from 'react';
import { 
  Tag, 
  Plus, 
  Sparkles, 
  Gift, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy
} from 'lucide-react';

interface MarketingPromosTabProps {
  userUsername: string;
}

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  minPurchasePi: number;
  expiresAt: string;
  usageCount: number;
  status: 'active' | 'scheduled' | 'expired';
}

export const MarketingPromosTab: React.FC<MarketingPromosTabProps> = ({
  userUsername
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minPurchasePi, setMinPurchasePi] = useState(5);
  const [expiryDays, setExpiryDays] = useState(30);
  const [promosList, setPromosList] = useState<PromoCode[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(true);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/vendor/promos');
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && Array.isArray(data?.promos)) {
          setPromosList(data.promos.filter((p: any) => p.sellerUsername === userUsername));
        }
      } catch {
        if (!cancelled) setPromoError('Unable to load server promotions.');
      } finally {
        if (!cancelled) setPromoLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userUsername]);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    try {
      const res = await fetch('/api/vendor/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim().toUpperCase(),
          discountPercent: Math.min(100, Math.max(1, discountPercent)),
          minPurchasePi: Math.max(0, minPurchasePi),
          expiresAt: expiryDate.toISOString()
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.promo) {
        setPromoError(data?.message || data?.error || 'Unable to create promotion.');
        return;
      }
      setPromosList(prev => [...prev, data.promo]);
      setPromoCode('');
      setPromoError('');
      setShowCreateModal(false);
    } catch {
      setPromoError('Unable to reach the promotion service.');
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6" id="marketing-promos-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Pioneer Engagement
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Store Promotions & Coupons
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Marketing & Promos
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Create custom store discounts, coupon codes, and special pioneer loyalty rewards.
            </p>
          </div>

          <button
            id="create-promo-code-btn"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* Promos List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-600" />
          Active Store Coupon Campaigns
        </h3>

        {promoLoading ? (<div className="py-12 text-center text-xs text-neutral-500">Loading server promotions…</div>) : promosList.length === 0 ? (
          /* Truthful Empty State */
          <div className="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <Tag className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              No active promotions or coupons yet.
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              Create targeted Pi promotions to reward loyal Pioneers and incentivize order completion across your storefront.
            </p>
            <button
              id="empty-create-promo-btn"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Promotion</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promosList.map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(promo.code, promo.id)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                      title="Copy Code"
                    >
                      {copiedId === promo.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <strong className="text-neutral-900 dark:text-neutral-100">{promo.discountPercent}% Off</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Purchase:</span>
                    <span>{promo.minPurchasePi} π</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Expires:</span>
                    <span>{promo.expiresAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Promo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Create Promotional Discount
            </h3>

            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Coupon Code (uppercase) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PIONEER10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Discount Percentage *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 1)}
                      className="w-full pl-3 pr-7 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                    <Percent className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Min Order (π)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minPurchasePi}
                    onChange={(e) => setMinPurchasePi(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Validity Duration (Days)
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value={7}>7 Days (1 Week Flash Sale)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={90}>90 Days (Quarterly Campaign)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold min-h-[44px]"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
