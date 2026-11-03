import React, { useState } from 'react';
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
  ChevronRight,
  Truck,
  CreditCard,
  Box,
  Clock
} from 'lucide-react';
import { Product, Order, Vendor, PiUser } from '../../types';
import { MainSection, MarketplaceCategory } from '../../types/navigation';
import { ConnectPiButton, AuthStatus } from '../auth/ConnectPiButton';

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
  onConnectPi?: () => void;
  authStatus?: AuthStatus;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  activeOrders,
  onNavigateSection,
  onOpenUniversalSearch,
  onOpenPstpShield,
  onTrackOrder,
  onOpenVendorApplication,
  onConnectPi,
  authStatus = user?.authenticated ? 'connected' : 'disconnected'
}) => {
  const [trackingQuery, setTrackingQuery] = useState('');
  return (
    <div className="relative max-w-7xl mx-auto px-3 sm:px-6 space-y-7 sm:space-y-9 pb-24 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DISCOVERY + SEARCH + POPULAR SEARCHES                     */}
      {/* ========================================================================= */}
      <section 
        id="hero-banner" 
        className="relative isolate rounded-[1.6rem] sm:rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.34),_transparent_48%),linear-gradient(135deg,#080d1c_0%,#24104b_52%,#101827_100%)] text-white p-5 sm:p-8 md:p-10 border border-violet-400/25 shadow-[0_24px_70px_-28px_rgba(91,33,182,0.65)] overflow-hidden"
      >
        {/* Subtle Brand Ambient Glows */}
        <div className="absolute -top-24 -right-20 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="relative z-10 space-y-4 sm:space-y-5">
          
          {/* Top Row: Brand Statement & Compact Trust Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            {/* Value Proposition */}
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-violet-100 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-xl shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PiNova Global Hub</span>
              </div>
              <h1 className="text-[1.7rem] sm:text-3xl md:text-4xl lg:text-[2.85rem] font-black tracking-[-0.045em] text-white leading-[1.08] max-w-2xl">
                Enterprise Pi Commerce & Utilities
              </h1>
              <p className="text-sm sm:text-base text-slate-300/95 leading-relaxed max-w-xl">
                Non-custodial merchant ecosystem, instant global utility fulfillment, and protected transactions.
              </p>
            </div>

            {/* Compact Trust & Protection Strip */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 bg-white/[0.07] border border-white/15 px-4 py-3 rounded-2xl backdrop-blur-xl shadow-xl shrink-0">
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
              className="group relative cursor-pointer bg-slate-950/70 hover:bg-slate-950/90 text-slate-300 rounded-2xl sm:rounded-[1.35rem] border border-white/15 p-3.5 sm:p-4 md:p-5 shadow-[0_16px_40px_-22px_rgba(0,0,0,.9)] flex items-center justify-between gap-3 transition-all duration-300 hover:border-violet-300/60 hover:shadow-violet-950/50 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  Search products, merchants, services, utilities, or orders...
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 text-white text-xs font-extrabold shadow-lg shadow-violet-950/40 shrink-0">
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

      {/* Unauthenticated Quick Connect Banner */}
      {(!user.authenticated || authStatus === 'disconnected') && onConnectPi && (
        <section 
          id="home-unauthenticated-connect-banner"
          className="relative overflow-hidden p-4 sm:p-5 rounded-[1.4rem] bg-[radial-gradient(ellipse_at_top_right,_rgba(168,85,247,.24),_transparent_48%),linear-gradient(115deg,#17102f_0%,#111827_55%,#171b3c_100%)] border border-violet-400/30 shadow-[0_18px_48px_-28px_rgba(76,29,149,.8)] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-amber-400 p-[2px] shadow-lg shadow-violet-950/50 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg">
                π
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">Connect with Pi Network</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-900/80 text-amber-300 border border-purple-700/60 text-[10px] font-bold">
                  Testnet Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Authenticate in Pi Browser to sync your Pioneer account, unlock zero-trust escrow payments, and manage your orders.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0">
            <ConnectPiButton
              user={user}
              authStatus={authStatus}
              onConnect={onConnectPi}
              variant="standalone"
              className="w-full sm:w-auto"
            />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. PINOVA GLOBAL HUB MODULES: CENTRAL SERVICE DISCOVERY                   */}
      {/* ========================================================================= */}
      <section id="global-hub-modules" className="space-y-4 sm:space-y-5">
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
            8 Core Portals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Module 1: Marketplace */}
          <div
            id="hub-module-marketplace"
            onClick={() => onNavigateSection('marketplace', 'all')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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

          {/* Module 5: AI Concierge */}
          <div
            id="hub-module-ai-concierge"
            onClick={() => onNavigateSection('ai_search')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                AI Concierge
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Intelligence & Chat</p>
            </div>
          </div>

          {/* Module 6: PSTP Security */}
          <div
            id="hub-module-pstp-security"
            onClick={onOpenPstpShield}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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

          {/* Module 7: Developer SDK */}
          <div
            id="hub-module-developer"
            onClick={() => onNavigateSection('developer_platform' as any)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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

          {/* Module 8: Future Services */}
          <div
            id="hub-module-future-services"
            onClick={() => onNavigateSection('future_services')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            className="min-h-[142px] p-4 sm:p-5 rounded-[1.35rem] bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/70 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] hover:shadow-[0_18px_38px_-20px_rgba(91,33,182,.28)] flex flex-col items-center justify-center text-center space-y-3 hover:-translate-y-1"
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
      {/* 3. INDEPENDENT PLATFORM SECTION: TRACK ORDER                              */}
      {/* ========================================================================= */}
      <section 
        id="track-order-section" 
        className="rounded-[1.5rem] bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 p-4 sm:p-6 shadow-[0_16px_45px_-32px_rgba(15,23,42,.45)] space-y-5 transition-all hover:border-violet-400/50"
      >
        {/* Header: Concise Title + Status Badge + Single Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Package className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
                TRACK ORDER
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Order Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-8 sm:pl-8">
              Track your order from payment to delivery.
            </p>
          </div>
        </div>

        {/* Compact Active Order & Lifecycle Indicator Card */}
        {(() => {
          const displayOrder = activeOrders && activeOrders.length > 0 ? activeOrders[0] : null;
          const orderId = displayOrder?.id || '';
          const orderStatus = displayOrder ? (displayOrder.pstpStatus || displayOrder.escrowStatus || 'STATUS PENDING').replace('_', ' ').toUpperCase() : 'NO ACTIVE ORDER';

          return (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3 sm:p-3.5 space-y-2.5">
              {/* Order ID & Status Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {orderId || 'No active order'}
                  </span>
                  {displayOrder && (
                    <span className="text-[11px] text-amber-500 dark:text-amber-400 font-bold hidden sm:inline">
                      • {displayOrder.totalPi} π
                    </span>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {orderStatus}
                </span>
              </div>

              {/* Lifecycle Progress Sequence */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
                <span className="inline-flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                  <CreditCard className="w-3 h-3 text-purple-500 shrink-0" />
                  <span>Payment</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-mono text-[10px]">→</span>
                <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                  <Box className="w-3 h-3 text-blue-500 shrink-0" />
                  <span>Fulfillment</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-mono text-[10px]">→</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60">
                  <Truck className="w-3 h-3 text-amber-500 shrink-0 animate-pulse" />
                  <span>Shipment</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-mono text-[10px]">→</span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Delivery</span>
                </span>
              </div>
            </div>
          );
        })()}

        {/* Input & Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <form 
            id="quick-order-track-form"
            onSubmit={(e) => {
              e.preventDefault();
              const targetId = trackingQuery.trim() || (activeOrders && activeOrders.length > 0 ? activeOrders[0].id : '');
              if (targetId) {
                onTrackOrder?.(targetId);
              } else {
                onNavigateSection('orders');
              }
            }}
            className="flex items-center gap-2 flex-1 sm:max-w-md"
          >
            <div className="relative flex-1">
              <input
                id="home-quick-track-input"
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder="Order ID / Tracking Number"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              id="home-quick-track-submit-btn"
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
          </form>

          <button
            id="view-all-orders-btn"
            onClick={() => onNavigateSection('orders')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PI MERCHANT WEEK: PROMOTIONAL CAMPAIGN SECTION                         */}
      {/* ========================================================================= */}
      <section 
        id="pi-merchant-week" 
        className="p-5 sm:p-7 md:p-8 rounded-[1.5rem] sm:rounded-[1.8rem] bg-[radial-gradient(ellipse_at_top_right,_rgba(168,85,247,.22),_transparent_48%),linear-gradient(115deg,#17102f_0%,#151c35_55%,#0b1220_100%)] text-white border border-violet-400/25 shadow-[0_22px_60px_-32px_rgba(76,29,149,.75)] space-y-3 relative overflow-hidden"
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
        className="p-5 sm:p-7 md:p-8 rounded-[1.5rem] sm:rounded-[1.8rem] bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,.16),_transparent_48%),linear-gradient(115deg,#211a19_0%,#111827_55%,#21143c_100%)] border border-amber-400/30 shadow-[0_22px_60px_-32px_rgba(120,53,15,.55)] flex flex-wrap items-center justify-between gap-4 sm:gap-5 text-white"
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
