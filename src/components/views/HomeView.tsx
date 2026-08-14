import React from 'react';
import { 
  Sparkles, 
  Search, 
  Zap, 
  ShoppingBag, 
  Package, 
  ShieldCheck, 
  Briefcase, 
  User, 
  Heart, 
  Clock, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Wallet, 
  Star, 
  Flame, 
  Gift, 
  ExternalLink,
  Store,
  RefreshCw,
  PhoneCall,
  Tv,
  Droplet,
  Lightbulb,
  Compass
} from 'lucide-react';
import { Product, Order, Vendor, PiUser } from '../../types';
import { MainSection, MarketplaceCategory } from '../../types/navigation';

interface HomeViewProps {
  user: PiUser;
  userBalancePi: number;
  products: Product[];
  vendors: Vendor[];
  activeOrders: Order[];
  recentlyViewedProducts: Product[];
  wishlistProducts: Product[];
  onNavigateSection: (section: MainSection, cat?: MarketplaceCategory) => void;
  onOpenUniversalSearch: (initialQuery?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onOpenPstpShield: () => void;
  onOpenQrScanner?: () => void;
  onOpenStorefrontByName: (sellerName: string) => void;
  onConfirmReceipt: (orderId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  userBalancePi,
  products,
  vendors,
  activeOrders,
  recentlyViewedProducts,
  wishlistProducts,
  onNavigateSection,
  onOpenUniversalSearch,
  onSelectProduct,
  onAddToCart,
  onInstantBuy,
  onToggleWishlist,
  onOpenPstpShield,
  onOpenQrScanner,
  onOpenStorefrontByName,
  onConfirmReceipt
}) => {
  const featuredProducts = products.filter(p => p.featured || p.rating >= 4.8).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8 pb-20 animate-fade-in">
      
      {/* 1. WELCOME BANNER & COMMAND CENTER HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 md:p-10 border border-purple-800/50 shadow-2xl overflow-hidden">
        
        {/* Subtle Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Top Row: User Greeting & Account Status Card */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-extrabold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PiNova Global Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Welcome back, {user.username} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Pioneer Mainnet Verified • PSTP Order Protection Active
              </p>
            </div>

            {/* Account Status Card (Replaces Duplicated Wallet Balance) */}
            <div className="w-full lg:w-auto bg-slate-900/90 border border-purple-500/30 p-3 sm:p-4 rounded-2xl shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-sm">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-white">@{user.username}</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Pioneer Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      PSTP Escrow Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3 justify-between sm:justify-start">
                {activeOrders.length > 0 && (
                  <button
                    onClick={() => onNavigateSection('orders')}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Package className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{activeOrders.length} Active Orders</span>
                  </button>
                )}
                <button
                  onClick={onOpenPstpShield}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  title="PSTP Protection Shield"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PSTP Shield</span>
                </button>
              </div>
            </div>
          </div>

          {/* Universal Hero Search Input Trigger */}
          <div className="pt-2">
            <div
              onClick={() => onOpenUniversalSearch()}
              className="group relative cursor-pointer bg-slate-800/90 hover:bg-slate-800 text-slate-300 rounded-2xl border border-purple-500/40 p-3.5 sm:p-4 shadow-xl flex items-center justify-between gap-3 transition-all hover:border-purple-400"
            >
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Universal Search: products, merchants, services, utilities, or orders...
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Search</span>
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 text-xs">
              <span className="text-slate-400 text-[11px] font-bold shrink-0">Popular Searches:</span>
              {[
                { label: '⚡ Airtime Topup', query: 'airtime' },
                { label: '📱 Flagship Phones', query: 'smartphones' },
                { label: '💡 Electricity Pay', query: 'electricity' },
                { label: '💻 Laptops', query: 'computers' },
                { label: '🎨 Tech Services', query: 'freelance' },
                { label: '📦 Active Orders', query: 'orders' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenUniversalSearch(chip.query)}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-purple-950 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors whitespace-nowrap font-medium text-[11px]"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. CORE HUB MODULES & QUICK COMMAND GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>PiNova Global Hub Modules</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Enterprise ecosystem for commerce, utilities, services & digital identity</p>
          </div>
          <span className="hidden sm:inline-block text-xs text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            6 Integrated Portals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Module 1: Marketplace */}
          <div
            onClick={() => onNavigateSection('marketplace', 'all')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-purple-500">
                Marketplace
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Goods & Catalog</p>
            </div>
          </div>

          {/* Module 2: Utilities & Bills */}
          <div
            onClick={() => onNavigateSection('utilities')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-500">
                Utilities
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Airtime, Power & TV</p>
            </div>
          </div>

          {/* Module 3: Services */}
          <div
            onClick={() => onNavigateSection('services')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-500">
                Services
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Freelance & Tech</p>
            </div>
          </div>

          {/* Module 4: Transport & Travel */}
          <div
            onClick={() => onNavigateSection('utilities', 'transport' as any)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-cyan-500">
                Transport & Travel
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Flights & Mobility</p>
            </div>
          </div>

          {/* Module 5: AI Shopping Concierge */}
          <div
            onClick={() => onNavigateSection('ai_search')}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 border border-purple-700/60 text-white transition-all cursor-pointer group shadow-md flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white group-hover:text-amber-300">
                AI Concierge
              </h3>
              <p className="text-[10px] text-slate-300 mt-0.5">Smart Assistant</p>
            </div>
          </div>

          {/* Module 6: PSTP Escrow & Security */}
          <div
            onClick={onOpenPstpShield}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-2 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-500">
                PSTP Security
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Escrow Protection</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. AUTHORITATIVE ORDER TRACKING & LOGISTICS SECTION */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            <span>Active Orders & Logistics Track</span>
          </h2>
          <button
            onClick={() => onNavigateSection('orders')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>{activeOrders.length > 0 ? `View All Orders (${activeOrders.length})` : 'Order History'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.slice(0, 2).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-purple-400">{ord.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold text-[10px] border border-purple-800">
                    {ord.pstpStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {ord.items.map((i) => i.product.title).join(', ')}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Total: <strong className="text-amber-500">{ord.totalPi.toFixed(2)} π</strong> • Carrier: {ord.carrier || 'Global Express'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    Carrier Tracking: <span className="font-mono text-purple-400">{ord.trackingNumber || 'TRK-LOG-8823'}</span>
                  </span>
                  {ord.pstpStatus === 'Shipped' && (
                    <button
                      onClick={() => onConfirmReceipt(ord.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl shadow"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Active Shipments in Transit</p>
                <p className="text-[11px] text-slate-500">All completed orders remain protected under PSTP Escrow.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateSection('orders')}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-xs font-bold transition-all shrink-0"
            >
              View History
            </button>
          </div>
        )}
      </div>

      {/* 4. CONTINUE SHOPPING / RECENTLY VIEWED */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>Continue Shopping — Recently Viewed</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentlyViewedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="w-48 shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer shadow-sm space-y-2 group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-full h-28 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-400">
                    {prod.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-black text-amber-500">{prod.pricePi.toFixed(2)} π</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PROMOTIONAL BANNERS & FEATURED DEALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Banner 1 */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border border-purple-700/50 shadow-xl space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Pi Merchant Week</span>
          </div>
          <h3 className="text-lg font-black text-white">Global Merchant Fest: 15% Bonus on Protected Purchases</h3>
          <p className="text-xs text-slate-300">
            Enjoy zero platform transaction fees when paying via official Pi SDK v2 payment protocol.
          </p>
          <button
            onClick={() => onNavigateSection('marketplace', 'deals')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-1"
          >
            <span>Shop Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Banner 2 */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-700/50 shadow-xl space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Utility Fulfillment</span>
          </div>
          <h3 className="text-lg font-black text-white">Top Up Airtime & Electricity with Pi</h3>
          <p className="text-xs text-slate-300">
            Automated API API integration for MTN, Airtel, DStv, and Global Power Grids.
          </p>
          <button
            onClick={() => onNavigateSection('utilities', 'electricity' as any)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-1"
          >
            <span>Pay Utilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 6. WISHLIST PREVIEW WIDGET (IF ANY) */}
      {wishlistProducts.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Your Wishlist Saved Items ({wishlistProducts.length})</span>
            </h2>
            <button
              onClick={() => onNavigateSection('marketplace')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              View Marketplace
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {wishlistProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{item.title}</h4>
                    <span className="text-xs font-black text-amber-500">{item.pricePi.toFixed(2)} π</span>
                  </div>
                </div>
                <button
                  onClick={() => onInstantBuy(item)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PERSONALIZED RECOMMENDATIONS & FEATURED GOODS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Recommended Featured Goods</span>
            </h2>
            <p className="text-xs text-slate-500">Handpicked items with verified merchant protection</p>
          </div>
          <button
            onClick={() => onNavigateSection('marketplace')}
            className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold text-xs hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer shadow-sm group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => onToggleWishlist(p, e)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase">
                    {p.category}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                    <span>By {p.sellerName}</span>
                    {p.sellerVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-400 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-base font-black text-amber-500">{p.pricePi.toFixed(2)} π</span>
                  <div className="text-[10px] text-slate-400">⭐ {p.rating} ({p.reviewsCount} reviews)</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstantBuy(p);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
