import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Package, 
  Zap, 
  Briefcase, 
  Store, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  ChevronRight,
  Filter,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, Vendor, Order } from '../types';
import { MainSection } from '../types/navigation';
import { MARKETPLACE_CATEGORIES, UTILITY_CATEGORIES } from '../data/categoryData';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  onSelectProduct: (product: Product) => void;
  onSelectVendorByName: (sellerName: string) => void;
  onNavigateSection: (section: MainSection, cat?: any) => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onSelectOrder?: (orderId: string) => void;
}

type SearchTab = 'all' | 'products' | 'utilities' | 'services' | 'sellers' | 'categories' | 'orders';

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  products,
  vendors,
  orders,
  onSelectProduct,
  onSelectVendorByName,
  onNavigateSection,
  onAddToCart,
  onInstantBuy,
  onSelectOrder
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Products
  const filteredProducts = useMemo(() => {
    if (!trimmed) return products.slice(0, 6);
    return products.filter(p => {
      if (!p) return false;
      const titleStr = (p.title || '').toLowerCase();
      const descStr = (p.description || '').toLowerCase();
      const catStr = (p.category || '').toLowerCase();
      const subcatStr = (p.subcategory || '').toLowerCase();
      const sellerStr = (p.sellerName || '').toLowerCase();
      const tagsArr = Array.isArray(p.tags) ? p.tags : [];

      return (
        titleStr.includes(trimmed) ||
        descStr.includes(trimmed) ||
        catStr.includes(trimmed) ||
        subcatStr.includes(trimmed) ||
        tagsArr.some(t => typeof t === 'string' && t.toLowerCase().includes(trimmed)) ||
        sellerStr.includes(trimmed)
      );
    });
  }, [products, trimmed]);

  // Search Sellers
  const filteredSellers = useMemo(() => {
    if (!trimmed) return vendors.slice(0, 4);
    return vendors.filter(v => {
      if (!v) return false;
      const storeStr = (v.storeName || '').toLowerCase();
      const sellerStr = (v.sellerUsername || '').toLowerCase();
      const bioStr = (v.bio || '').toLowerCase();

      return storeStr.includes(trimmed) || sellerStr.includes(trimmed) || bioStr.includes(trimmed);
    });
  }, [vendors, trimmed]);

  // Search Categories
  const filteredCategories = useMemo(() => {
    if (!trimmed) return [];
    const mpCats = MARKETPLACE_CATEGORIES.filter(c => 
      (c.name || '').toLowerCase().includes(trimmed) || (c.description || '').toLowerCase().includes(trimmed)
    ).map(c => ({ ...c, type: 'marketplace' as const }));

    const utilCats = UTILITY_CATEGORIES.filter(c => 
      (c.name || '').toLowerCase().includes(trimmed) || (c.description || '').toLowerCase().includes(trimmed)
    ).map(c => ({ ...c, type: 'utility' as const }));

    return [...mpCats, ...utilCats];
  }, [trimmed]);

  // Search Utilities
  const sampleUtilities = [
    { id: 'util-1', name: 'Instant Airtime Topup (Global)', network: 'MTN, Airtel, Vodacom, Orange, AT&T', category: 'airtime', priceRange: '1 - 100 π' },
    { id: 'util-2', name: 'High-Speed Mobile Data Bundle', network: '4G/5G Enterprise Connectivity', category: 'mobile_data', priceRange: '2 - 50 π' },
    { id: 'util-3', name: 'Electricity Utility Token Payment', network: 'Prepaid Smart Meter Pay', category: 'electricity', priceRange: '5 - 500 π' },
    { id: 'util-4', name: 'Water & Sanitation Bill Settle', network: 'Municipal Water Board', category: 'water_bills', priceRange: '3 - 200 π' },
    { id: 'util-5', name: 'Cable TV Subscription Renewal', network: 'DStv, GOtv, StarTimes', category: 'cable_tv', priceRange: '8 - 80 π' }
  ];

  const filteredUtilities = useMemo(() => {
    if (!trimmed) return sampleUtilities;
    return sampleUtilities.filter(u => 
      (u.name || '').toLowerCase().includes(trimmed) ||
      (u.network || '').toLowerCase().includes(trimmed) ||
      (u.category || '').toLowerCase().includes(trimmed)
    );
  }, [trimmed]);

  // Search Services
  const sampleServices = [
    { id: 'srv-1', title: 'Pi Network App & Smart Contract Dev', provider: 'CryptoCode Solutions', category: 'freelance_tech', pricePi: 150.00, rating: 4.9 },
    { id: 'srv-2', title: 'Pi Merchant Accounting & Tax Legal Settle', provider: 'Pioneer Legal Group', category: 'consultation', pricePi: 45.00, rating: 5.0 },
    { id: 'srv-3', title: 'Hardware POS & Crypto Terminal Repair', provider: 'TechFix Global', category: 'repairs_maintenance', pricePi: 30.00, rating: 4.8 }
  ];

  const filteredServices = useMemo(() => {
    if (!trimmed) return sampleServices;
    return sampleServices.filter(s => 
      (s.title || '').toLowerCase().includes(trimmed) ||
      (s.provider || '').toLowerCase().includes(trimmed) ||
      (s.category || '').toLowerCase().includes(trimmed)
    );
  }, [trimmed]);

  // Search Orders
  const filteredOrders = useMemo(() => {
    if (!trimmed) return orders.slice(0, 3);
    return orders.filter(o => {
      if (!o) return false;
      const orderIdStr = (o.id || '').toLowerCase();
      const pstpStr = (o.pstpStatus || '').toLowerCase();
      const trackStr = (o.trackingNumber || '').toLowerCase();
      const itemsMatch = Array.isArray(o.items) && o.items.some(i => i && i.product && (i.product.title || '').toLowerCase().includes(trimmed));

      return orderIdStr.includes(trimmed) || itemsMatch || pstpStr.includes(trimmed) || trackStr.includes(trimmed);
    });
  }, [orders, trimmed]);

  const totalResultsCount = 
    filteredProducts.length + 
    filteredSellers.length + 
    filteredCategories.length + 
    filteredUtilities.length + 
    filteredServices.length + 
    filteredOrders.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]">
        
        {/* Top Header Search Input Bar */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <span>PiNova Global Hub — Universal Search</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, merchants, services, utilities, or order IDs..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-800/90 text-white placeholder-slate-400 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base font-medium shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Tabs Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: `All (${totalResultsCount})`, icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'products', label: `Products (${filteredProducts.length})`, icon: <Package className="w-3.5 h-3.5" /> },
              { id: 'utilities', label: `Utilities (${filteredUtilities.length})`, icon: <Zap className="w-3.5 h-3.5 text-emerald-400" /> },
              { id: 'services', label: `Services (${filteredServices.length})`, icon: <Briefcase className="w-3.5 h-3.5 text-blue-400" /> },
              { id: 'sellers', label: `Sellers (${filteredSellers.length})`, icon: <Store className="w-3.5 h-3.5 text-amber-400" /> },
              { id: 'orders', label: `Orders (${filteredOrders.length})`, icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SearchTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          
          {/* Quick AI Suggestion Prompt if query is present */}
          {query && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-800/60 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Looking for intelligent recommendations for <strong>"{query}"</strong>?</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('ai_search');
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1"
              >
                <span>Ask AI Concierge</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PRODUCTS SECTION */}
          {(activeTab === 'all' || activeTab === 'products') && filteredProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span>Marketplace Products</span>
                </h3>
                <span className="text-[11px] text-slate-400">{filteredProducts.length} items found</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer flex gap-3 group shadow-sm"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-400">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {prod.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-amber-500">
                          {prod.pricePi.toFixed(2)} π
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onInstantBuy(prod);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UTILITIES SECTION */}
          {(activeTab === 'all' || activeTab === 'utilities') && filteredUtilities.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <span>Utility Bill & Topup Providers</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredUtilities.map((util) => (
                  <div
                    key={util.id}
                    onClick={() => {
                      onClose();
                      onNavigateSection('utilities');
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{util.name}</h4>
                        <p className="text-[11px] text-slate-500">{util.network}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl whitespace-nowrap">
                      Pay Bill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES SECTION */}
          {(activeTab === 'all' || activeTab === 'services') && filteredServices.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>Professional Services & Consultations</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      onClose();
                      onNavigateSection('services');
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{srv.title}</h4>
                      <p className="text-[11px] text-slate-500">By {srv.provider} • Rating: ⭐ {srv.rating}</p>
                      <p className="text-xs font-black text-amber-500 mt-0.5">{srv.pricePi.toFixed(2)} π</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl whitespace-nowrap">
                      Book Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SELLERS SECTION */}
          {(activeTab === 'all' || activeTab === 'sellers') && filteredSellers.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-500" />
                  <span>Verified Pi Merchants</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredSellers.map((ven) => (
                  <div
                    key={ven.id}
                    onClick={() => {
                      onClose();
                      onSelectVendorByName(ven.storeName);
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all cursor-pointer flex items-center gap-3 shadow-sm"
                  >
                    <img
                      src={ven.logoImage}
                      alt={ven.storeName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{ven.storeName}</h4>
                        {ven.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">@{ven.sellerUsername} • ⭐ {ven.rating}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS SECTION */}
          {(activeTab === 'all' || activeTab === 'orders') && filteredOrders.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>User Active & Past Orders</span>
                </h3>
              </div>

              <div className="space-y-2">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      onClose();
                      if (onSelectOrder) {
                        onSelectOrder(ord.id);
                      } else {
                        onNavigateSection('orders');
                      }
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div>
                      <span className="font-extrabold text-purple-400">{ord.id}</span>
                      <p className="text-slate-500 text-[11px]">
                        {ord.items.map(i => i.product.title).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold text-[10px]">
                        {ord.pstpStatus}
                      </span>
                      <span className="font-black text-amber-500">{ord.totalPi.toFixed(2)} π</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {totalResultsCount === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No results found for "{query}"</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for general keywords like "smartphones", "laptops", "airtime", "electricity", or "freelance".
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
