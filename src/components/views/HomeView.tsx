import React from 'react';
import { 
  Search, 
  Zap, 
  ShoppingBag, 
  Package, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Store,
  Compass,
  Sparkles,
  Layers,
  Code,
  Flame,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Product, Order, Vendor, PiUser } from '../../types';
import { MainSection, MarketplaceCategory } from '../../types/navigation';

interface HomeViewProps {
  user: PiUser;
  userBalancePi: number;
  products?: Product[];
  vendors?: Vendor[];
  activeOrders?: Order[];
  recentlyViewedProducts?: Product[];
  wishlistProducts?: Product[];
  onNavigateSection: (section: MainSection, cat?: MarketplaceCategory) => void;
  onOpenUniversalSearch: (initialQuery?: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onInstantBuy?: (product: Product) => void;
  onToggleWishlist?: (product: Product, e: React.MouseEvent) => void;
  onOpenPstpShield: () => void;
  onOpenQrScanner?: () => void;
  onOpenStorefrontByName?: (sellerName: string) => void;
  onConfirmReceipt?: (orderId: string) => void;
  onTrackOrder?: (orderId?: string) => void;
  onOpenVendorApplication?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  activeOrders,
  onNavigateSection,
  onOpenUniversalSearch,
  onOpenPstpShield,
  onTrackOrder,
  onOpenVendorApplication
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-7 pb-20 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DISCOVERY + SEARCH + POPULAR SEARCHES                     */}
      {/* ========================================================================= */}
      <section 
        id="hero-banner" 
        className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 sm:p-7 md:p-9 border border-purple-800/40 shadow-xl sm:shadow-2xl overflow-hidden"
      >
        {/* Subtle Brand Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 sm:space-y-5">
          
          {/* Top Row: Brand Statement & Compact Trust Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            {/* Value Proposition */}
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/70 border border-purple-700/50 text-purple-200 text-[11px] font-bold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PiNova Global Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Enterprise Pi Commerce & Utilities
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Non-custodial merchant ecosystem, instant global utility fulfillment, and protected transactions.
              </p>
            </div>

            {/* Compact Trust & Protection Strip */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 bg-slate-900/80 border border-purple-500/30 px-3 py-2 rounded-xl backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PSTP Protected
                </span>
              </div>

              <button
                id="hero-pstp-shield-button"
                onClick={onOpenPstpShield}
                className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-amber-300 text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
                title="PSTP Protection Shield"
              >
                <span>Shield Details</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Universal Hero Search Input Trigger */}
          <div className="pt-0.5">
            <div
              id="hero-universal-search-bar"
              onClick={() => onOpenUniversalSearch()}
              className="group relative cursor-pointer bg-slate-900/90 hover:bg-slate-850 text-slate-300 rounded-xl sm:rounded-2xl border border-purple-500/40 p-3 sm:p-3.5 md:p-4 shadow-lg flex items-center justify-between gap-3 transition-all hover:border-purple-400 hover:shadow-purple-900/20"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  Search products, merchants, services, utilities, or orders...
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span className="hidden xs:inline">Search</span>
              </div>
            </div>

            {/* Popular Searches Chips: Actual searchable products and services */}
            <div className="relative pt-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                <span className="text-slate-400 text-[11px] font-bold shrink-0 hidden xs:inline">Popular:</span>
                {[
                  { id: 'pop-airtime', label: '⚡ Airtime Topup', action: () => onNavigateSection('utilities', 'airtime' as any) },
                  { id: 'pop-phones', label: '📱 Flagship Phones', action: () => onNavigateSection('marketplace', 'phones_mobile') },
                  { id: 'pop-electricity', label: '💡 Electricity Pay', action: () => onNavigateSection('utilities', 'electricity' as any) },
                  { id: 'pop-laptops', label: '💻 Laptops', action: () => onNavigateSection('marketplace', 'computers_technology') },
                  { id: 'pop-services', label: '🎨 Tech Services', action: () => onNavigateSection('marketplace', 'professional_services') },
                  { id: 'pop-electronics', label: '🎧 Electronics', action: () => onNavigateSection('marketplace', 'electronics') }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    id={chip.id}
                    onClick={chip.action}
                    className="min-h-[34px] px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/90 hover:bg-purple-950 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-purple-600/60 transition-all whitespace-nowrap font-medium text-[11px] active:scale-95 flex items-center shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PINOVA GLOBAL HUB MODULES: CENTRAL SERVICE DISCOVERY                   */}
      {/* ========================================================================= */}
      <section id="global-hub-modules" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>PiNova Global Hub Modules</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enterprise ecosystem for commerce, utilities, transport, logistics & digital services
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            7 Core Portals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3.5">
          
          {/* Module 1: Marketplace */}
          <div
            id="hub-module-marketplace"
            onClick={() => onNavigateSection('marketplace', 'all')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
                Marketplace
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Goods & Catalog</p>
            </div>
          </div>

          {/* Module 2: Utilities */}
          <div
            id="hub-module-utilities"
            onClick={() => onNavigateSection('utilities')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                Global Utilities
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Airtime, Power & TV</p>
            </div>
          </div>

          {/* Module 3: Travel & Transport */}
          <div
            id="hub-module-transport"
            onClick={() => onNavigateSection('utilities', 'transport' as any)}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 transition-colors">
                Travel & Transport
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Flights & Mobility</p>
            </div>
          </div>

          {/* Module 4: Services */}
          <div
            id="hub-module-services"
            onClick={() => onNavigateSection('services')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                Services
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Freelance & Tech</p>
            </div>
          </div>

          {/* Module 5: PSTP Security */}
          <div
            id="hub-module-pstp-security"
            onClick={onOpenPstpShield}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                PSTP Security
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Escrow Protection</p>
            </div>
          </div>

          {/* Module 6: Developer SDK */}
          <div
            id="hub-module-developer"
            onClick={() => onNavigateSection('developer_platform' as any)}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Code className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
                Developer SDK
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">APIs & Integrations</p>
            </div>
          </div>

          {/* Module 7: Future Services */}
          <div
            id="hub-module-future-services"
            onClick={() => onNavigateSection('future_services')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                Future Services
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ecosystem Expansion</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INDEPENDENT PLATFORM SECTION: ORDERS & LOGISTICS / ACTIVE ORDERS       */}
      {/* ========================================================================= */}
      <section id="orders-logistics-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Orders & Logistics</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                  Active Tracking
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live shipment monitoring, PSTP escrow milestones, and carrier verification
              </p>
            </div>
          </div>

          <button
            id="view-all-orders-btn"
            onClick={() => onNavigateSection('orders')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1 transition-colors group"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Orders Card / Preview Strip */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
          {activeOrders && activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.slice(0, 2).map((ord) => {
                const firstItem = ord.items?.[0];
                const totalItemsCount = ord.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;
                return (
                  <div
                    key={ord.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 overflow-hidden flex items-center justify-center shrink-0">
                        {firstItem?.product?.images?.[0] ? (
                          <img
                            src={firstItem.product.images[0]}
                            alt={firstItem.product.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                            {ord.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            {ord.status || 'PAID / IN TRANSIT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-sm">
                          {firstItem?.product?.title || 'Order Package'} {totalItemsCount > 1 && `+ ${totalItemsCount - 1} more`}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Total: <strong className="text-amber-400 font-black">{ord.totalPi || ord.totalAmount} π</strong> • Carrier: FedEx Express / Tracking: FX-9921-PI
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                      <button
                        onClick={() => onTrackOrder?.(ord.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left py-2">
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  No Pending Orders Currently
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All your past orders have been completed and verified under PSTP escrow.
                </p>
              </div>
              <button
                onClick={() => onNavigateSection('marketplace', 'all')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PI MERCHANT WEEK: PROMOTIONAL CAMPAIGN SECTION                         */}
      {/* ========================================================================= */}
      <section 
        id="pi-merchant-week" 
        className="p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white border border-purple-700/40 shadow-xl space-y-3 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 sm:w-80 h-72 sm:h-80 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5" />
              <span>Pi Merchant Week</span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white leading-snug">
              Pi Merchant Fest: Verified Merchants & Protected Escrow
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore verified merchants across physical goods, utilities, and digital services with guaranteed non-custodial PSTP escrow protection and Pi Network SDK v2 protocol.
            </p>
          </div>

          <button
            id="pi-merchant-week-shop-deals-btn"
            onClick={() => onNavigateSection('marketplace', 'deals')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 transition-all shrink-0 active:scale-95"
          >
            <span>Shop Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MERCHANT ONBOARDING OPEN: PRIMARY ACQUISITION PORTAL                   */}
      {/* ========================================================================= */}
      <section 
        id="merchant-onboarding-open" 
        className="p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/60 border border-amber-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4 sm:gap-5 text-white"
      >
        <div className="space-y-1.5 sm:space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Merchant Onboarding Open</span>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-white">
            Sell Your Products & Services for Pi
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Apply to become a Verified Vendor. Get guaranteed PSTP Escrow order protection, Seller Studio management dashboard, and reach Pi users worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {onOpenVendorApplication && (
            <button
              id="become-verified-vendor-btn"
              onClick={onOpenVendorApplication}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Become a Verified Vendor</span>
            </button>
          )}
          <button
            id="open-seller-studio-btn"
            onClick={() => onNavigateSection('seller_studio' as any)}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Open Seller Studio</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </section>

    </div>
  );
};
