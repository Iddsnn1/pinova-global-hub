import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Vendor } from '../../../types';

interface MultiStoreTabProps {
  vendorProfile: Vendor;
  userUsername: string;
  serverStatus: {
    status: string;
    verified: boolean;
    pstpAuthorized: boolean;
    sellerLifecycle: string;
    storeName: string | null;
  };
  onOpenStorefront?: (vendorId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const MultiStoreTab: React.FC<MultiStoreTabProps> = ({
  vendorProfile,
  userUsername,
  serverStatus,
  onOpenStorefront,
  onNavigateTab
}) => {
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchRegion, setBranchRegion] = useState('');
  const [branchNotice, setBranchNotice] = useState<string | null>(null);

  // Authoritative store records: The merchant's primary verified store
  const isVerified = serverStatus.verified;
  const isApproved = serverStatus.status === 'APPROVED';

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    if (!isApproved) {
      setBranchNotice('Multi-store expansion requires an approved and verified merchant account.');
      return;
    }

    setBranchNotice(`Secondary branch "${branchName}" submitted for enterprise multi-store compliance review.`);
    setTimeout(() => {
      setShowAddBranchModal(false);
      setBranchName('');
      setBranchRegion('');
      setBranchNotice(null);
    }, 2500);
  };

  return (
    <div className="space-y-6" id="multi-store-manager-tab">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Enterprise Commerce
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                PSTP Multi-Branch
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-purple-600" />
              Multi-Store Manager
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Manage your primary storefront, regional brand branches, and distribution channels under one merchant identity.
            </p>
          </div>

          <button
            id="add-store-branch-btn"
            onClick={() => setShowAddBranchModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Store Branch</span>
          </button>
        </div>
      </div>

      {/* Primary Store Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Primary Flagship Storefront
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            Branch #001 (HQ)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/50">
          <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
            {vendorProfile.logoImage ? (
              <img 
                src={vendorProfile.logoImage} 
                alt={vendorProfile.storeName} 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Building2 className="w-7 h-7 text-purple-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {vendorProfile.storeName || `${userUsername}'s Store`}
              </h4>
              {isVerified && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
              {vendorProfile.bio || 'Authoritative merchant storefront on PiNova Global Marketplace.'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {vendorProfile.country || 'Global'}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                Coverage: {(vendorProfile.shippingCountries || ['Global']).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            {onOpenStorefront && (
              <button
                id="view-flagship-storefront-btn"
                onClick={() => onOpenStorefront(vendorProfile.id)}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                <span>View Storefront</span>
              </button>
            )}
            {onNavigateTab && (
              <button
                id="edit-branding-btn"
                onClick={() => onNavigateTab('branding')}
                className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Branding</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Branches Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs text-center">
        <div className="max-w-md mx-auto py-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Store className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            No secondary store branches yet
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
            Verified enterprise merchants can configure specialized sub-stores (e.g. wholesale catalogs, regional pickup outlets, or secondary brands) operating under the same authenticated merchant balance.
          </p>
          <button
            id="register-secondary-branch-btn"
            onClick={() => setShowAddBranchModal(true)}
            className="mt-4 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-purple-600" />
            <span>Configure Secondary Branch</span>
          </button>
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-purple-600" />
              Add Secondary Store Branch
            </h3>
            <p className="text-xs text-neutral-500">
              Create an additional store outlet linked to your verified PiNova merchant identity.
            </p>

            {branchNotice && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300">
                {branchNotice}
              </div>
            )}

            <form onSubmit={handleCreateBranch} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Branch / Outlet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PiNova Outlet - North America Regional"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Operating Territory / Region
                </label>
                <input
                  type="text"
                  placeholder="e.g. EU / Germany & Central Europe"
                  value={branchRegion}
                  onChange={(e) => setBranchRegion(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold min-h-[44px]"
                >
                  Submit Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
