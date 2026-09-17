import React from 'react';
import { 
  ShieldCheck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  ShoppingBag, 
  Sparkles,
  Lock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Store,
  Boxes,
  FileSpreadsheet,
  CreditCard,
  BarChart3,
  Users,
  UserCheck,
  Tag,
  HelpCircle,
  FileText,
  Layers
} from 'lucide-react';
import { Order, Product, Vendor } from '../../../types';

interface OverviewTabProps {
  userUsername: string;
  vendorProfile: Vendor;
  products: Product[];
  orders: Order[];
  serverStatus: {
    status: string;
    verified: boolean;
    pstpAuthorized: boolean;
    sellerLifecycle: string;
    storeName: string | null;
  };
  onNavigateTab: (tabId: string) => void;
  onOpenOnboarding: () => void;
  onAddProduct: () => void;
  onOpenStorefrontPreview: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userUsername,
  vendorProfile,
  products,
  orders,
  serverStatus,
  onNavigateTab,
  onOpenOnboarding,
  onAddProduct,
  onOpenStorefrontPreview
}) => {
  // Truthful calculations based strictly on real state
  const isApproved = serverStatus.status === 'APPROVED';
  const isPending = serverStatus.status === 'PENDING_REVIEW' || serverStatus.status === 'UNDER_REVIEW';
  const isUnregistered = serverStatus.status === 'UNREGISTERED' || !serverStatus.status;
  const isActionRequired = serverStatus.status === 'ACTION_REQUIRED';
  const isRejected = serverStatus.status === 'REJECTED';

  const pendingOrders = orders.filter(o => 
    o.pstpStatus === 'Pending Payment' || o.pstpStatus === 'Processing' || o.escrowStatus === 'in_escrow'
  );
  const completedOrders = orders.filter(o => 
    o.pstpStatus === 'Completed' || o.pstpStatus === 'Delivered' || o.escrowStatus === 'released'
  );

  const totalPiVolume = orders.reduce((sum, o) => sum + (o.totalPi || 0), 0);

  return (
    <div className="space-y-6" id="seller-overview-tab">
      {/* Onboarding / Verification Alert Banner */}
      {isUnregistered && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Merchant Registration Required
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
                Complete your 5-step seller onboarding with business details and KYC verification to unlock Pi payments and PSTP Escrow Protection.
              </p>
            </div>
          </div>
          <button
            id="start-onboarding-btn"
            onClick={onOpenOnboarding}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            Start Onboarding
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isPending && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Application Under Compliance Review
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  PENDING
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
                Your merchant application and KYC documents have been received. Platform compliance is reviewing your records.
              </p>
            </div>
          </div>
          <button
            id="view-kyc-status-btn"
            onClick={() => onNavigateTab('kyc')}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            Check KYC Status
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isActionRequired && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Action Required On Application
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
                The compliance team requested additional documentation or corrections. Please check the KYC tab to update your records.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('kyc')}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center justify-center gap-2 shrink-0"
          >
            Update Documents
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isApproved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Verified Pioneer Merchant
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  ACTIVE
                </span>
                {serverStatus.pstpAuthorized && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    PSTP ESCROW READY
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Your store is live and protected by server-verified Pi settlements.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenStorefrontPreview}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            View Storefront
          </button>
        </div>
      )}

      {/* Real Core KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Products */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {products.length}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {products.filter(p => p.stock > 0).length} in stock
          </p>
        </div>

        {/* Metric 2: Pending Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {pendingOrders.length}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Requires fulfillment
          </p>
        </div>

        {/* Metric 3: Completed Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {completedOrders.length}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Verified delivered
          </p>
        </div>

        {/* Metric 4: Total Pi Volume */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Store Pi Volume</span>
            <span className="text-amber-500 font-bold text-base">π</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {totalPiVolume.toFixed(2)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            PSTP protected
          </p>
        </div>
      </div>

      {/* Quick Action Bar & Store Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Health & Governance */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Store Health & Verification
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Authoritative requirements for active merchant status
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isApproved 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}>
              {serverStatus.status || 'UNREGISTERED'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isApproved ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {isApproved ? '✓' : '1'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    KYC & Identity Verification
                  </div>
                  <div className="text-xs text-neutral-500">
                    AES-256-GCM encrypted document verification
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab('kyc')}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {isApproved ? 'Verified' : 'Review'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  vendorProfile.logoImage ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {vendorProfile.logoImage ? '✓' : '2'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Store Branding & Visuals
                  </div>
                  <div className="text-xs text-neutral-500">
                    Official store logo and showcase banner
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab('branding')}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {vendorProfile.logoImage ? 'Manage' : 'Upload'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  products.length > 0 ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {products.length > 0 ? '✓' : '3'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Published Products
                  </div>
                  <div className="text-xs text-neutral-500">
                    Active inventory listed on PiNova Global Marketplace
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab('products')}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {products.length > 0 ? `${products.length} Listed` : 'Add Product'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  serverStatus.pstpAuthorized ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {serverStatus.pstpAuthorized ? '✓' : '4'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    PSTP Escrow Agreement
                  </div>
                  <div className="text-xs text-neutral-500">
                    Cryptographic dispute resolution & buyer trust protection
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab('policies')}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {serverStatus.pstpAuthorized ? 'Accepted' : 'View Terms'}
              </button>
            </div>
          </div>
        </div>

        {/* Fast Action Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Store Actions
            </h4>
            <p className="text-xs text-neutral-500 mb-4">
              Quick shortcuts to common seller tasks
            </p>

            <div className="space-y-2.5">
              <button
                id="overview-add-product-btn"
                onClick={onAddProduct}
                className="w-full p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>

              <button
                onClick={() => onNavigateTab('orders')}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-500" />
                View Customer Orders ({orders.length})
              </button>

              <button
                onClick={() => onNavigateTab('branding')}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-neutral-500" />
                Customize Branding
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Session Verified
            </span>
            <span>@{userUsername}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Recent Store Orders
            </h4>
            <p className="text-xs text-neutral-500">
              Authorized customer purchases awaiting or completing fulfillment
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              See all ({orders.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No orders yet
            </h5>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              Orders will appear here after customers purchase from your store. Publish products to begin receiving Pi orders.
            </p>
            {products.length === 0 && (
              <button
                onClick={onAddProduct}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 pb-2">
                  <th className="font-semibold py-2">Order ID</th>
                  <th className="font-semibold py-2">Customer</th>
                  <th className="font-semibold py-2">Items</th>
                  <th className="font-semibold py-2">Amount (π)</th>
                  <th className="font-semibold py-2">PSTP Status</th>
                  <th className="font-semibold py-2">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      {order.id}
                    </td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-300">
                      @{order.buyerUsername || 'pioneer_customer'}
                    </td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-400">
                      {order.items?.length || 1} item(s)
                    </td>
                    <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {order.totalPi?.toFixed(2)} π
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.escrowStatus === 'released' || order.pstpStatus === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {order.escrowStatus || 'in_escrow'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {order.pstpStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Seller Studio Module Directory (Universal Quick-Access) */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              Seller Studio Modules Directory
            </h4>
            <p className="text-xs text-neutral-500">
              One-tap direct access to all verified merchant operations, inventory, and governance consoles
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
            15 Operational Modules
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
          {[
            { id: 'multi_store', label: 'Multi-Store', desc: 'Store branches', icon: Store },
            { id: 'products', label: 'Products', desc: `${products.length} items`, icon: Package },
            { id: 'inventory', label: 'Inventory', desc: 'Stock & depots', icon: Boxes },
            { id: 'orders', label: 'Orders', desc: `${orders.length} active`, icon: ShoppingBag },
            { id: 'bulk_csv', label: 'Bulk CSV', desc: 'Batch tools', icon: FileSpreadsheet },
            { id: 'payments', label: 'Financials', desc: 'Escrow ledgers', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', desc: 'Sales metrics', icon: BarChart3 },
            { id: 'customers', label: 'CRM', desc: 'Buyer profiles', icon: Users },
            { id: 'marketing', label: 'Promos', desc: 'Coupons & sales', icon: Tag },
            { id: 'kyc', label: 'Verification', desc: 'Merchant KYC', icon: ShieldCheck },
            { id: 'branding', label: 'Branding', desc: 'Logo & banner', icon: Sparkles },
            { id: 'staff', label: 'Staff RBAC', desc: 'Team roles', icon: UserCheck },
            { id: 'policies', label: 'Policies', desc: 'Store terms', icon: FileText },
            { id: 'security', label: 'Security', desc: 'Audit logs', icon: Lock },
            { id: 'help', label: 'Support', desc: 'Merchant help', icon: HelpCircle },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                id={`overview-module-shortcut-${m.id}`}
                onClick={() => onNavigateTab(m.id)}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-700 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 text-left transition-all min-h-[56px] flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-2 min-w-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block truncate">
                    {m.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    {m.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
