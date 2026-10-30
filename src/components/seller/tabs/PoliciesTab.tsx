import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Ban, 
  Award, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { vendorAuthenticatedFetch } from '../../../lib/vendorAuthBridge';

interface PoliciesTabProps {
  userUsername: string;
  initialApplication: any;
  onPoliciesUpdated: (updatedPolicies: any) => void;
}

export const PoliciesTab: React.FC<PoliciesTabProps> = ({
  userUsername,
  initialApplication,
  onPoliciesUpdated
}) => {
  const existingPolicies = initialApplication?.policies || {};

  const [returnPolicy, setReturnPolicy] = useState(
    existingPolicies.returnRefundPolicy ||
    'Customers may request returns or full refunds within 7 calendar days of verified physical delivery for items that are damaged, defective, or materially different from the listing. All refunds are mediated via PSTP Escrow.'
  );

  const [deliveryPolicy, setDeliveryPolicy] = useState(
    existingPolicies.deliveryShippingPolicy ||
    'Orders are packed and dispatched within 2 business days. Tracked shipping with verified consignment numbers is provided for all physical shipments. Tracking details are registered on the PiNova platform.'
  );

  const [cancellationPolicy, setCancellationPolicy] = useState(
    existingPolicies.cancellationPolicy ||
    'Orders can be cancelled by the buyer before the merchant registers a shipment tracking number. Once shipped, standard return policies apply.'
  );

  const [warrantyTerms, setWarrantyTerms] = useState(
    existingPolicies.warrantyTerms ||
    'Standard 30-day merchant warranty against manufacturing faults. Does not cover accidental damage or misuse.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updatedPolicies = {
        returnRefundPolicy: returnPolicy.trim(),
        deliveryShippingPolicy: deliveryPolicy.trim(),
        cancellationPolicy: cancellationPolicy.trim(),
        warrantyTerms: warrantyTerms.trim()
      };

      const payload = {
        ...initialApplication,
        pioneerUsername: userUsername,
        policies: updatedPolicies,
        pstpAgreementAccepted: true
      };

      const res = await vendorAuthenticatedFetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Store policies successfully saved and bound to PSTP Escrow.');
        onPoliciesUpdated(updatedPolicies);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.message || data.error || 'Failed to update store policies.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error updating store policies.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-policies-tab">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Store Policies & PSTP Terms
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Clear commitments on returns, dispatch times, refunds, and warranties
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            PSTP Bound
          </span>
        </div>

        {successMsg && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSavePolicies} className="space-y-5">
          {/* Policy 1: Returns & Refunds */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              Returns & Refunds Policy *
            </label>
            <textarea
              rows={3}
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            <span className="text-[11px] text-neutral-500">
              Must meet minimum 7-day return window for defective items under PSTP rules.
            </span>
          </div>

          {/* Policy 2: Shipping & Delivery */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-purple-600" />
              Delivery & Shipping Policy *
            </label>
            <textarea
              rows={3}
              value={deliveryPolicy}
              onChange={(e) => setDeliveryPolicy(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            <span className="text-[11px] text-neutral-500">
              State your dispatch timelines, couriers used, and international availability.
            </span>
          </div>

          {/* Policy 3: Order Cancellation */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-purple-600" />
              Order Cancellation Policy
            </label>
            <textarea
              rows={2}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          {/* Policy 4: Warranty & Guarantees */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              Warranty Terms & Quality Guarantee
            </label>
            <textarea
              rows={2}
              value={warrantyTerms}
              onChange={(e) => setWarrantyTerms(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end">
            <button
              id="save-policies-btn"
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Policies...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Store Policies
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
