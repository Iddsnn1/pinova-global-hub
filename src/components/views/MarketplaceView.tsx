import React, { useState, useEffect, useMemo } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  Car, 
  BookOpen, 
  GraduationCap,
  Activity, 
  HeartPulse, 
  Gamepad2, 
  Wrench, 
  Flame, 
  ChevronRight, 
  Package, 
  ArrowLeft, 
  Filter, 
  CheckCircle2, 
  Lock, 
  Star, 
  Search, 
  X, 
  ShieldCheck, 
  Tag, 
  SlidersHorizontal, 
  Download, 
  Briefcase, 
  Plane, 
  Camera, 
  Footprints, 
  Building2, 
  Layers, 
  Sprout,
  LayoutGrid,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Store,
  Compass,
  Coins
} from 'lucide-react';
import { Product, Vendor } from '../../types';
import { MarketplaceCategory } from '../../types/navigation';
import { MARKETPLACE_CATEGORIES, getMarketplaceCategoryDef, resolveMarketplaceCategory } from '../../data/categoryData';
import { ProductCard } from '../ProductCard';
import { CatalogFilterBar, FilterOptions } from '../CatalogFilterBar';

interface MarketplaceViewProps {
  selectedCategory: MarketplaceCategory;
  onSelectCategory: (category: MarketplaceCategory) => void;
  products: Product[];
  vendors: Vendor[];
  wishlistProductIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onInstantBuy: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onOpenStorefront: (sellerName: string) => void;
  onQuickView: (product: Product) => void;
  onOpenAiSearch: () => void;
  onOpenUniversalSearch?: (query?: string) => void;
  onOpenSellerStudio?: () => void;
  recentlyViewedProducts: Product[];
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
  vendors,
  wishlistProductIds,
  onSelectProduct,
  onAddToCart,
  onInstantBuy,
  onToggleWishlist,
  onOpenStorefront,
  onQuickView,
  onOpenAiSearch,
  onOpenUniversalSearch,
  onOpenSellerStudio,
  recentlyViewedProducts
}) => {
  // Search & Type state for primary discovery
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'physical' | 'digital' | 'service'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [showAllTaxonomy, setShowAllTaxonomy] = useState(false);

  // Category view filter state
  const [categoryFilters, setCategoryFilters] = useState<FilterOptions>({
    category: 'all',
    subcategory: '',
    minPrice: 0,
    maxPrice: 500,
    verifiedOnly: false,
    orderProtectionOnly: false,
    minRating: 0,
    discountOnly: false,
    sortBy: 'featured'
  });

  // Reset activeSubcategory whenever selectedCategory changes
  useEffect(() => {
    setActiveSubcategory('all');
  }, [selectedCategory]);

  // Map category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-indigo-400" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-amber-400" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-lime-400" />;
      case 'Car': return <Car className="w-5 h-5 text-blue-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-300" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-sky-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-red-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-violet-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-orange-400" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-teal-400" />;
      case 'Plane': return <Plane className="w-5 h-5 text-cyan-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-pink-400" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-amber-500" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      default: return <Package className="w-5 h-5 text-purple-400" />;
    }
  };

  const currentCategoryDef = getMarketplaceCategoryDef(selectedCategory);

  // Recommended products: featured or high rated items
  const recommendedProducts = useMemo(() => {
    return products
      .filter((p) => p.featured || p.rating >= 4.8 || (p.discountPercent && p.discountPercent > 0))
      .slice(0, 10);
  }, [products]);

  // Flash Deals products
  const flashDealsProducts = useMemo(() => {
    return products
      .filter((p) => p.discountPercent && p.discountPercent > 0)
      .slice(0, 8);
  }, [products]);

  // Search matching logic for Hub view
  const searchMatchedProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;

      // Filter by type if not 'all'
      if (selectedType === 'physical' && p.category !== 'physical') return false;
      if (selectedType === 'digital' && p.category !== 'digital' && p.category !== 'giftcard' && p.category !== 'airtime' && p.category !== 'utility') return false;
      if (selectedType === 'service' && p.category !== 'service') return false;

      // Verified filter
      if (verifiedOnly && !p.sellerVerified) return false;

      // Search query filtering across multiple fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchSubcat = (p.subcategory || '').toLowerCase().includes(q);
        const matchSeller = (p.sellerName || '').toLowerCase().includes(q);
        const matchTags = Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
        const matchFeatures = Array.isArray(p.features) && p.features.some((f) => typeof f === 'string' && f.toLowerCase().includes(q));
        
        return matchTitle || matchDesc || matchCat || matchSubcat || matchSeller || matchTags || matchFeatures;
      }

      return true;
    });
  }, [products, searchQuery, selectedType, verifiedOnly]);

  // Search matched merchants
  const searchMatchedVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;
    const q = searchQuery.toLowerCase().trim();
    return vendors.filter((v) => {
      const matchName = (v.storeName || '').toLowerCase().includes(q);
      const matchBio = (v.bio || '').toLowerCase().includes(q);
      const matchUser = (v.sellerUsername || '').toLowerCase().includes(q);
      const matchCountry = (v.country || '').toLowerCase().includes(q);
      return matchName || matchBio || matchUser || matchCountry;
    });
  }, [vendors, searchQuery]);

  // Category page products logic
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;
      if (selectedCategory === 'all') return true;
      
      const canonicalSelected = resolveMarketplaceCategory(selectedCategory);

      if (canonicalSelected === 'other_general' || selectedCategory === 'deals') {
        const isBaseDeal = Boolean((p.discountPercent && p.discountPercent > 0) || p.featured || p.rating >= 4.7);
        if (selectedCategory === 'deals' && !isBaseDeal) return false;

        if (activeSubcategory && activeSubcategory !== 'all' && activeSubcategory !== '') {
          if (activeSubcategory === 'Merchant Week Offers') {
            return Boolean((p.sellerVerified && ((p.discountPercent && p.discountPercent > 0) || p.featured)) || p.rating >= 4.8);
          } else if (activeSubcategory === 'Featured Deals' || activeSubcategory === 'Flash Deals & Promotions') {
            return Boolean(p.featured || (p.discountPercent && p.discountPercent > 0));
          } else if (activeSubcategory === 'Flash Sales') {
            return Boolean((p.discountPercent && p.discountPercent >= 15) || (Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes('flash'))));
          } else if (activeSubcategory === 'Limited-Time Discounts') {
            return Boolean(p.discountPercent && p.discountPercent >= 10);
          } else if (activeSubcategory === 'Recommended Promotions') {
            return Boolean(p.rating >= 4.7 || p.featured);
          }
        }
        if (selectedCategory === 'deals') return true;
      }
      
      const catNameLower = (currentCategoryDef?.name || '').toLowerCase();
      const selCatLower = String(selectedCategory || '').toLowerCase();
      const canCatLower = String(canonicalSelected || '').toLowerCase();
      
      const categoryStr = (p.category || '').toLowerCase();
      const subcategoryStr = (p.subcategory || '').toLowerCase();
      const tagsArr = Array.isArray(p.tags) ? p.tags : [];
      
      const matchesCategoryDirect = categoryStr === selCatLower || categoryStr === canCatLower || categoryStr.includes(selCatLower) || categoryStr.includes(canCatLower);
      const matchesCategoryTag = tagsArr.some(t => {
        if (typeof t !== 'string') return false;
        const tl = t.toLowerCase();
        return tl.includes(selCatLower) || selCatLower.includes(tl) || tl.includes(canCatLower) || canCatLower.includes(tl);
      });
      const matchesSubcat = (subcategoryStr && (
        subcategoryStr.includes(catNameLower) || 
        catNameLower.includes(subcategoryStr) || 
        subcategoryStr.includes(selCatLower) ||
        subcategoryStr.includes(canCatLower)
      ));
      
      // Also check if any of the category's canonical subcategories matches the product
      const subcategoriesList = currentCategoryDef?.subcategories || [];
      const matchesKnownSubcategory = subcategoriesList.some(sub => {
        const subL = sub.toLowerCase();
        return subcategoryStr.includes(subL) || tagsArr.some(t => typeof t === 'string' && t.toLowerCase().includes(subL)) || (p.title || '').toLowerCase().includes(subL);
      });

      const matchesCat = matchesCategoryDirect || matchesCategoryTag || matchesSubcat || matchesKnownSubcategory;
      if (!matchesCat) return false;

      if (activeSubcategory && activeSubcategory !== 'all' && activeSubcategory !== '') {
        const subLower = String(activeSubcategory).toLowerCase();
        const matchSub = subcategoryStr.includes(subLower);
        const matchTags = tagsArr.some(t => typeof t === 'string' && (t.toLowerCase().includes(subLower) || subLower.includes(t.toLowerCase())));
        const matchTitle = (p.title || '').toLowerCase().includes(subLower);
        return matchSub || matchTags || matchTitle;
      }

      return true;
    });
  }, [products, selectedCategory, currentCategoryDef, activeSubcategory]);

  const filteredCategoryProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        if (!p) return false;
        const matchesPrice = p.pricePi <= categoryFilters.maxPrice;
        const matchesRating = p.rating >= categoryFilters.minRating;
        const matchesVerified = !categoryFilters.verifiedOnly || p.sellerVerified;
        const matchesDiscount = !categoryFilters.discountOnly || (p.discountPercent && p.discountPercent >= 10);

        return matchesPrice && matchesRating && matchesVerified && matchesDiscount;
      })
      .sort((a, b) => {
        if (categoryFilters.sortBy === 'rating') return b.rating - a.rating;
        if (categoryFilters.sortBy === 'price_low') return a.pricePi - b.pricePi;
        if (categoryFilters.sortBy === 'price_high') return b.pricePi - a.pricePi;
        if (categoryFilters.sortBy === 'newest') return b.id > a.id ? 1 : -1;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [categoryProducts, categoryFilters]);

  const isSearchActive = searchQuery.trim().length > 0 || selectedType !== 'all' || verifiedOnly;

  // Handle direct subcategory tap from landing page cards
  const handleCategorySubcategoryNavigate = (catId: MarketplaceCategory, subName?: string) => {
    onSelectCategory(catId);
    if (subName) {
      setActiveSubcategory(subName);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      
      {/* CASE A: HUB VIEW (Marketplace Landing Discovery Page) */}
      {selectedCategory === 'all' ? (
        <div className="space-y-10">
          
          {/* 1. PREMIUM MARKETPLACE HERO SECTION */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-purple-800/40 shadow-2xl mx-3 sm:mx-6 p-6 sm:p-8 lg:p-10">
            {/* Subtle Ambient Radial Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              
              {/* Header Title & Subtitle */}
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/60 text-purple-300 text-xs font-extrabold uppercase tracking-wider shadow-inner">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>PiNova Global Marketplace</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Discover Products & Services
                </h1>

                <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                  Shop from verified merchants worldwide with Pi. Discover physical goods, digital assets, and professional services backed by non-custodial escrow protection.
                </p>
              </div>

              {/* Trust Indicators Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-1 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-purple-500/30 text-purple-200">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Verified Merchants</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-amber-500/30 text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Official Pi Payments</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-emerald-500/30 text-emerald-300">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>PSTP Escrow Protection</span>
                </div>
                {onOpenSellerStudio && (
                  <button
                    onClick={onOpenSellerStudio}
                    className="sm:ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-purple-300" />
                    <span>Seller Studio</span>
                  </button>
                )}
              </div>

              {/* 2. PROMINENT UNIVERSAL MARKETPLACE SEARCH FIELD */}
              <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-purple-900/60 shadow-2xl backdrop-blur-md space-y-3">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-purple-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, services, merchants, categories, or keywords..."
                    className="w-full pl-11 pr-24 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        if (onOpenUniversalSearch) {
                          onOpenUniversalSearch(searchQuery);
                        } else {
                          onOpenAiSearch();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-md transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>

                {/* Search Type Filters & AI Concierge Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedType === 'all'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      All Items
                    </button>

                    <button
                      onClick={() => setSelectedType('physical')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedType === 'physical'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Physical Goods</span>
                    </button>

                    <button
                      onClick={() => setSelectedType('digital')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedType === 'digital'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Digital Tokens</span>
                    </button>

                    <button
                      onClick={() => setSelectedType('service')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedType === 'service'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Services</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded accent-purple-600 cursor-pointer"
                      />
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Verified Only</span>
                    </label>

                    <button
                      onClick={onOpenAiSearch}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-amber-300 border border-purple-700/50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>AI Concierge</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. QUICK ACCESS ROW */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-slate-400 text-xs font-bold shrink-0">Quick Access:</span>
                  {[
                    { label: '🔥 Flash Deals', action: () => onSelectCategory('deals' as any), highlight: true },
                    { label: '⭐ Top Rated', action: () => { setSelectedType('all'); setSearchQuery(''); setCategoryFilters(prev => ({ ...prev, sortBy: 'rating', minRating: 4.8 })); onSelectCategory('all'); } },
                    { label: '🆕 New Arrivals', action: () => { setSelectedType('all'); setSearchQuery(''); setCategoryFilters(prev => ({ ...prev, sortBy: 'newest' })); onSelectCategory('all'); } },
                    { label: '🏪 Verified Stores', action: () => { setVerifiedOnly(true); } },
                    { label: '⚡ Tech & Services', action: () => onSelectCategory('professional_services') },
                    { label: '📱 Mobile & Tech', action: () => onSelectCategory('phones_mobile') },
                    { label: '💻 Laptops & IT', action: () => onSelectCategory('computers_technology') },
                    { label: '🚗 Automotive', action: () => onSelectCategory('automotive_transport') },
                    { label: '🏠 Home & Living', action: () => onSelectCategory('home_living') },
                    { label: '💎 Fashion & Beauty', action: () => onSelectCategory('fashion_beauty') }
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                        btn.highlight 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                          : 'bg-slate-800/80 hover:bg-purple-950 text-slate-200 hover:text-white border border-slate-700/70 hover:border-purple-600'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ACTIVE SEARCH RESULTS DISPLAY */}
          {isSearchActive ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Search Results</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {searchMatchedProducts.length} items found
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {searchQuery ? `Matching query "${searchQuery}"` : 'Filtered marketplace discovery'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setVerifiedOnly(false);
                  }}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Search</span>
                </button>
              </div>

              {/* Matched Merchants if searching by merchant name or keyword */}
              {searchMatchedVendors.length > 0 && searchQuery.trim().length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Matching Stores ({searchMatchedVendors.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchMatchedVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        onClick={() => onOpenStorefront(vendor.storeName || vendor.sellerUsername)}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer flex items-center gap-3 shadow-sm hover:shadow-md"
                      >
                        <img
                          src={vendor.logoImage || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                          alt={vendor.storeName}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
                            <span>{vendor.storeName}</span>
                            {vendor.verified && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{vendor.bio}</div>
                          <div className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{vendor.rating}</span>
                            <span className="text-slate-400">({vendor.reviewsCount} reviews)</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products Grid */}
              {searchMatchedProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <Package className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    No items found matching your search query.
                  </p>
                  <p className="text-xs text-slate-500">Try broadening your search term or clearing the type filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setVerifiedOnly(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchMatchedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onAddToCart={(p, e) => {
                        e.stopPropagation();
                        onAddToCart(p, 1);
                      }}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistProductIds.includes(product.id)}
                      onInstantBuy={(p, e) => {
                        e.stopPropagation();
                        onInstantBuy(p, 1);
                      }}
                      onOpenStorefront={onOpenStorefront}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* STANDARD LANDING FLOW: Visual Category Explorer -> Recommended for You -> Flash Deals -> Verified Merchants */
            <div className="space-y-12">
              
              {/* 4. VISUAL CATEGORY EXPLORER */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <LayoutGrid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <span>Explore Categories</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Visual discovery across all 18 canonical global commerce sectors
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAllTaxonomy(!showAllTaxonomy)}
                    className="self-start sm:self-auto text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1.5"
                  >
                    <span>{showAllTaxonomy ? 'Show Featured Categories' : 'View All 18 Categories →'}</span>
                  </button>
                </div>

                {/* Visual Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(showAllTaxonomy ? MARKETPLACE_CATEGORIES : MARKETPLACE_CATEGORIES.slice(0, 8)).map((cat) => {
                    const catIdLower = (cat.id || '').toLowerCase();
                    const catNameLower = (cat.name || '').toLowerCase();
                    const count = products.filter((p) => {
                      const tagMatch = Boolean(catIdLower) && Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(catIdLower));
                      const subMatch = Boolean(catNameLower) && (p.subcategory || '').toLowerCase().includes(catNameLower);
                      return tagMatch || subMatch;
                    }).length;

                    // Display top 3-4 subcategories
                    const keySubcategories = cat.subcategories.slice(0, 4);

                    return (
                      <div
                        key={cat.id}
                        className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                      >
                        {/* Header Banner Preview */}
                        <div className="h-24 w-full overflow-hidden relative bg-slate-950 cursor-pointer" onClick={() => onSelectCategory(cat.id)}>
                          <img
                            src={cat.bannerImage}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                          
                          {/* Item Count Badge */}
                          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-extrabold text-amber-300 border border-slate-700">
                            {count > 0 ? `${count} listings` : 'Active'}
                          </div>

                          {/* Category Floating Icon */}
                          <div className="absolute -bottom-3 left-4 w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border-2 border-purple-500/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 pt-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div 
                              onClick={() => onSelectCategory(cat.id)}
                              className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer flex items-center justify-between"
                            >
                              <span>{cat.name}</span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          </div>

                          {/* Interactive Key Subcategory Chips */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Subcategories:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {keySubcategories.map((sub, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategorySubcategoryNavigate(cat.id, sub);
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 text-[10px] font-semibold transition-colors"
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* CTA Row */}
                          <div 
                            onClick={() => onSelectCategory(cat.id)}
                            className="pt-1 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 cursor-pointer group-hover:text-purple-500"
                          >
                            <span>Browse Catalog</span>
                            <span className="flex items-center gap-0.5 text-[11px]">
                              <span>View All</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expand / Collapse Footer Button */}
                {!showAllTaxonomy && (
                  <div className="pt-3 text-center">
                    <button
                      onClick={() => setShowAllTaxonomy(true)}
                      className="px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
                    >
                      <LayoutGrid className="w-4 h-4 text-purple-500" />
                      <span>View All 18 Canonical Categories ({MARKETPLACE_CATEGORIES.length - 8} more)</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
              </section>

              {/* 5. RECOMMENDED PRODUCTS / DISCOVERY SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Recommended for You</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Curated flagship listings from verified merchants & creators worldwide
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCategoryFilters(prev => ({ ...prev, sortBy: 'featured' }));
                      onSelectCategory('all');
                    }}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>View More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {recommendedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                      onAddToCart={(p, e) => {
                        e.stopPropagation();
                        onAddToCart(p, 1);
                      }}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistProductIds.includes(product.id)}
                      onInstantBuy={(p, e) => {
                        e.stopPropagation();
                        onInstantBuy(p, 1);
                      }}
                      onOpenStorefront={onOpenStorefront}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              </section>

              {/* 6. TRENDING FLASH DEALS & PROMOTIONS */}
              {flashDealsProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <span>Pi Flash Deals & Discounts</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                              Limited Time
                            </span>
                          </h3>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Special promotional rates verified with official Pi coin settlement
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectCategory('deals' as any)}
                        className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                      >
                        <span>All Deals</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {flashDealsProducts.slice(0, 4).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectProduct={onSelectProduct}
                          onAddToCart={(p, e) => {
                            e.stopPropagation();
                            onAddToCart(p, 1);
                          }}
                          onToggleWishlist={onToggleWishlist}
                          isWishlisted={wishlistProductIds.includes(product.id)}
                          onInstantBuy={(p, e) => {
                            e.stopPropagation();
                            onInstantBuy(p, 1);
                          }}
                          onOpenStorefront={onOpenStorefront}
                          onQuickView={onQuickView}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* 7. VERIFIED PI MERCHANTS SHOWCASE */}
              {vendors.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                          Verified Pi Merchants
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Global storefronts operating with Official Pi Network SDK & PSTP Escrow standard
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {vendors.map((vendor) => {
                      const vendorProductsCount = products.filter(
                        (p) => (p.sellerName || '').toLowerCase() === (vendor.storeName || vendor.sellerUsername || '').toLowerCase()
                      ).length;

                      return (
                        <div
                          key={vendor.id}
                          onClick={() => onOpenStorefront(vendor.storeName || vendor.sellerUsername)}
                          className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                        >
                          {/* Banner Header */}
                          <div className="h-20 w-full overflow-hidden relative bg-slate-950">
                            <img
                              src={vendor.bannerImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'}
                              alt={vendor.storeName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          </div>

                          {/* Logo & Basic Info */}
                          <div className="p-4 pt-0 -mt-6 relative z-10 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-end justify-between mb-2">
                                <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-900 overflow-hidden bg-white shadow-md">
                                  <img
                                    src={vendor.logoImage || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                                    alt={vendor.storeName}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                  {vendorProductsCount} Listings
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                <span>{vendor.storeName}</span>
                                {vendor.verified && (
                                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-purple-100 dark:fill-purple-950 flex-shrink-0" />
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                {vendor.bio}
                              </p>
                            </div>

                            {/* Rating & Action */}
                            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-slate-800 dark:text-slate-200">{vendor.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-slate-400 font-normal">({vendor.reviewsCount})</span>
                              </div>

                              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Visit Store
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 8. RECENTLY VIEWED PRODUCTS */}
              {recentlyViewedProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Recently Viewed Items</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recentlyViewedProducts.slice(0, 5).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={onSelectProduct}
                        onAddToCart={(p, e) => {
                          e.stopPropagation();
                          onAddToCart(p, 1);
                        }}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlistProductIds.includes(product.id)}
                        onInstantBuy={(p, e) => {
                          e.stopPropagation();
                          onInstantBuy(p, 1);
                        }}
                        onOpenStorefront={onOpenStorefront}
                        onQuickView={onQuickView}
                      />
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

        </div>
      ) : (
        /* CASE B: DEDICATED CATEGORY CATALOG PAGE */
        <div className="space-y-6">
          
          {/* Category Banner Header */}
          <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl mx-3 sm:mx-6 border border-slate-800">
            <img
              src={currentCategoryDef?.bannerImage}
              alt={currentCategoryDef?.name}
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />
            <div className="relative z-10 p-6 sm:p-8 space-y-4 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Categories</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
                  {getCategoryIcon(currentCategoryDef?.iconName || 'Package')}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {currentCategoryDef?.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                    {currentCategoryDef?.description}
                  </p>
                </div>
              </div>

              {/* Subcategories interactive pill bar */}
              {currentCategoryDef?.subcategories && (
                <div className="flex flex-wrap items-center gap-2 pt-1 relative z-20">
                  <button
                    type="button"
                    onClick={() => setActiveSubcategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                      activeSubcategory === 'all'
                        ? 'bg-purple-600 text-white border border-purple-400 shadow-purple-500/30'
                        : 'bg-slate-800/90 hover:bg-slate-700/90 text-purple-300 border border-purple-900/60'
                    }`}
                  >
                    <span>All {selectedCategory === 'deals' ? 'Deals' : 'Items'}</span>
                  </button>

                  {currentCategoryDef.subcategories.map((sub, idx) => {
                    const isActive = activeSubcategory === sub;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSubcategory(isActive ? 'all' : sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white border border-amber-300 shadow-amber-500/30'
                            : 'bg-slate-800/90 hover:bg-slate-700/90 text-purple-200 border border-purple-900/60 hover:text-white'
                        }`}
                      >
                        {selectedCategory === 'deals' && (
                          <Flame className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-amber-400'}`} />
                        )}
                        <span>{sub}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Filter & Sorting Controls */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <CatalogFilterBar
              filters={categoryFilters}
              onFilterChange={(updated) => setCategoryFilters((prev) => ({ ...prev, ...updated }))}
              onResetFilters={() => {
                setActiveSubcategory('all');
                setCategoryFilters({
                  category: 'all',
                  subcategory: '',
                  minPrice: 0,
                  maxPrice: 500,
                  verifiedOnly: false,
                  orderProtectionOnly: false,
                  minRating: 0,
                  discountOnly: false,
                  sortBy: 'featured'
                });
              }}
              totalResults={filteredCategoryProducts.length}
            />
          </div>

          {/* Category Product Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{currentCategoryDef?.name}</span>
                {activeSubcategory !== 'all' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {activeSubcategory}
                  </span>
                )}
                <span className="text-slate-500 font-medium text-sm">({filteredCategoryProducts.length})</span>
              </h2>
            </div>

            {filteredCategoryProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  No items found in {currentCategoryDef?.name} matching your criteria
                </p>
                <button
                  onClick={() => {
                    setCategoryFilters({
                      category: 'all',
                      subcategory: '',
                      minPrice: 0,
                      maxPrice: 500,
                      verifiedOnly: false,
                      orderProtectionOnly: false,
                      minRating: 0,
                      discountOnly: false,
                      sortBy: 'featured'
                    });
                    setActiveSubcategory('all');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredCategoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={(p, e) => {
                      e.stopPropagation();
                      onAddToCart(p, 1);
                    }}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistProductIds.includes(product.id)}
                    onInstantBuy={(p, e) => {
                      e.stopPropagation();
                      onInstantBuy(p, 1);
                    }}
                    onOpenStorefront={onOpenStorefront}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recently Viewed Products */}
          {recentlyViewedProducts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recently Viewed Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recentlyViewedProducts.slice(0, 5).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={(p, e) => {
                      e.stopPropagation();
                      onAddToCart(p, 1);
                    }}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistProductIds.includes(product.id)}
                    onInstantBuy={(p, e) => {
                      e.stopPropagation();
                      onInstantBuy(p, 1);
                    }}
                    onOpenStorefront={onOpenStorefront}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
