import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, UserCheck, Lock, Activity, RefreshCw, Zap, Globe, Package, BarChart3 } from 'lucide-react';
import { Order, Vendor } from '../types';
import { PiConversionConfig, ConversionRateLog } from '../types/utility';
import { UtilityAdminPanel } from './utility/UtilityAdminPanel';
import { TranslationManagementTab } from './admin/TranslationManagementTab';
import { AdminTrustCenter } from './trust/AdminTrustCenter';
import { AdminOrderCenter } from './orders/AdminOrderCenter';
import { FinanceAnalyticsView } from './views/FinanceAnalyticsView';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface AdminDashboardProps {
  orders: Order[];
  vendors: Vendor[];
  onToggleVendorVerification: (vendorId: string) => void;
  onResolveDispute: (orderId: string, resolution: 'refund' | 'release') => void;
  onOpenPstpShield?: () => void;
  utilityConfig?: PiConversionConfig;
  onUpdateUtilityConfig?: (newConfig: PiConversionConfig, note: string) => void;
  utilityRateLogs?: ConversionRateLog[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders = [],
  vendors = [],
  onToggleVendorVerification,
  onResolveDispute,
  onOpenPstpShield,
  utilityConfig,
  onUpdateUtilityConfig,
  utilityRateLogs = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'i18n' | 'trust' | 'orders' | 'vendors' | 'disputes' | 'utility' | 'finance'>('trust');
  const [vendorApplications, setVendorApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [reviewingAppId, setReviewingAppId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch applications when vendors tab is active
  React.useEffect(() => {
    if (activeTab === 'vendors') {
      setLoadingApps(true);
      fetch('/api/admin/vendor-applications')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.applications)) {
            setVendorApplications(data.applications);
          }
        })
        .catch((err) => console.warn('Failed to load vendor applications:', err))
        .finally(() => setLoadingApps(false));
    }
  }, [activeTab]);

  const handleReviewApplication = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/vendor-application/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: adminNotes || (status === 'APPROVED' ? 'Verified by PiNova Compliance Desk' : 'Incomplete documentation'),
          reviewedBy: 'Admin_Lead_01'
        })
      });
      const data = await res.json();
      if (data.success && data.application) {
        setVendorApplications((prev) =>
          prev.map((app) => (app.id === id ? data.application : app))
        );
        setReviewingAppId(null);
        setAdminNotes('');
      }
    } catch (err) {
      console.error('Error reviewing vendor application:', err);
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeVendors = Array.isArray(vendors) ? vendors : [];

  const totalVolumePi = safeOrders.reduce((acc, o) => acc + (o?.totalPi || 0), 0) + 4250.0;
  const inEscrowVolumePi = safeOrders.filter((o) => o?.escrowStatus === 'in_escrow').reduce((acc, o) => acc + (o?.totalPi || 0), 0) + 120.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">PiNova Platform Governance</span>
          <h1 className="text-2xl font-black text-white mt-1">Admin Control Desk & Security Audit</h1>
          <p className="text-xs text-slate-300 mt-1">Order protection dispute resolution, merchant verification, and server-verified Pi transaction audit logs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenPstpShield && (
            <button
              onClick={onOpenPstpShield}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:opacity-95 transition-opacity"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Launch PSTP Security Console</span>
            </button>
          )}

          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] text-purple-200 uppercase font-semibold">Total Pi Volume</div>
            <div className="text-lg font-black text-amber-300">{totalVolumePi.toFixed(2)} π</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] text-purple-200 uppercase font-semibold">Protected Volume</div>
            <div className="text-lg font-black text-emerald-400">{inEscrowVolumePi.toFixed(2)} π</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'orders'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-indigo-400" />
          <span>Orders & Fulfillment Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('trust')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'trust'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          <span>Trust & Reputation Center</span>
        </button>

        <button
          onClick={() => setActiveTab('i18n')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'i18n'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Language & Localization (i18n)</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('utility')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'utility'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Utility & Conversion Rate Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'vendors'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Vendor Verification Queue ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'finance'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-500" />
          <span>Finance, Analytics & BI</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'disputes'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Order Dispute Center</span>
        </button>
      </div>

      {/* ORDERS & FULFILLMENT TAB */}
      {activeTab === 'orders' && <AdminOrderCenter orders={orders} />}

      {/* TRUST CENTER TAB */}
      {activeTab === 'trust' && <AdminTrustCenter />}

      {/* I18N MANAGEMENT TAB */}
      {activeTab === 'i18n' && <TranslationManagementTab />}

      {/* UTILITY CONVERSION ENGINE TAB */}
      {activeTab === 'utility' && utilityConfig && onUpdateUtilityConfig && (
        <UtilityAdminPanel
          config={utilityConfig}
          onUpdateConfig={onUpdateUtilityConfig}
          rateLogs={utilityRateLogs}
        />
      )}

      {/* VENDORS TAB */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          
          {/* Vendor Applications Review Queue */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-500" />
                  <span>Submitted Vendor Onboarding Applications ({vendorApplications.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Review Pioneer KYC documents, store policies, and compliance credentials.</p>
              </div>
              {loadingApps && <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />}
            </div>

            {vendorApplications.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                No pending vendor applications found in queue.
              </div>
            ) : (
              <div className="space-y-3">
                {vendorApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.logoUrl || app.storeLogo || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=200&q=80'}
                          alt={app.storeName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{app.storeName}</h4>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                              @{app.pioneerUsername}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {app.city ? `${app.city}, ` : ''}{app.country || 'Global'} • Type: <strong className="capitalize text-slate-300">{app.sellerType || 'Individual'}</strong> • Email: {app.contactEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleReviewApplication(app.id, 'APPROVED')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Verify</span>
                          </button>
                        )}
                        {app.status !== 'REJECTED' && (
                          <button
                            onClick={() => {
                              if (reviewingAppId === app.id) {
                                handleReviewApplication(app.id, 'REJECTED');
                              } else {
                                setReviewingAppId(app.id);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold transition-colors"
                          >
                            <span>{reviewingAppId === app.id ? 'Confirm Rejection' : 'Reject Application'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Store Description & Policy Preview */}
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div><strong>Bio:</strong> {app.storeDescription || 'No description provided.'}</div>
                      {app.businessRegistrationNumber && (
                        <div><strong>CAC/Reg:</strong> <span className="font-mono text-amber-300">{app.businessRegistrationNumber}</span></div>
                      )}
                      {app.policies?.returnRefundPolicy && (
                        <div className="text-[11px] text-slate-400"><strong>Return Policy:</strong> {app.policies.returnRefundPolicy}</div>
                      )}
                    </div>

                    {reviewingAppId === app.id && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Enter rejection reason or compliance notes..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          onClick={() => handleReviewApplication(app.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                        >
                          Submit Rejection
                        </button>
                        <button
                          onClick={() => setReviewingAppId(null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Verified Merchants */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Live Merchant Directory ({safeVendors.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeVendors.map((v) => (
                <div key={v.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={v.logoImage} alt="logo" referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <span>{v.storeName}</span>
                        {v.verified && <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400">Total Sales: {v.totalSalesPi.toFixed(2)} π</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleVendorVerification(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      v.verified
                        ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {v.verified ? 'Revoke Badge' : 'Approve Verification'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === 'disputes' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Order Protection Dispute Resolution Queue</h3>
          <p className="text-xs text-slate-400">Review buyer & seller claims. Administrators can settle orders to seller or process Pi refund to buyer.</p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-black text-slate-900 dark:text-slate-100">Order ORD-PI-892341 (Claim #4910)</span>
              <p className="text-amber-800 dark:text-amber-300">Buyer claims delayed shipping for hardware wallet. Vendor provided DHL Tracking DHL-EXPRESS-98319204.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onResolveDispute('ORD-PI-892341', 'release')}
                className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
              >
                Settle Order to Seller
              </button>
              <button
                onClick={() => onResolveDispute('ORD-PI-892341', 'refund')}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg"
              >
                Refund Buyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINANCE & ANALYTICS TAB */}
      {activeTab === 'finance' && (
        <FinanceAnalyticsView
          products={INITIAL_PRODUCTS}
          orders={safeOrders}
          onOpenPstpShield={onOpenPstpShield}
        />
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Pi Network Node Health & Platform Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400">Official Pi SDK Version</span>
              <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">v2.0 (Active)</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400">Server Approval Endpoint</span>
              <div className="font-bold text-emerald-500 text-sm">POST /v2/payments/{'{paymentId}'}/approve</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400">Server Completion Endpoint</span>
              <div className="font-bold text-emerald-500 text-sm">POST /v2/payments/{'{paymentId}'}/complete</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
