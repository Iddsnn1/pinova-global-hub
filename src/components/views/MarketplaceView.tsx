import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Check
} from 'lucide-react';
import { Product, Vendor } from '../../types';
import { MarketplaceCategory } from '../../types/navigation';
import { MARKETPLACE_CATEGORIES, MarketplaceCategoryDef } from '../../data/categoryData';
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
  recentlyViewedProducts
}) => {
  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [filters, setFilters] = useState<FilterOptions>({
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
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-purple-400" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-indigo-400" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-amber-400" />;
      case 'Home': return <Home className="w-6 h-6 text-emerald-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-pink-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-lime-400" />;
      case 'Car': return <Car className="w-6 h-6 text-blue-400" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-amber-300" />;
      case 'Activity': return <Activity className="w-6 h-6 text-red-400" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-violet-400" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-orange-400" />;
      default: return <Package className="w-6 h-6 text-purple-400" />;
    }
  };

  const currentCategoryDef = MARKETPLACE_CATEGORIES.find((c) => c.id === selectedCategory);

  // Filter logic
  const categoryProducts = products.filter((p) => {
    if (!p) return false;
    if (selectedCategory === 'all') return true;
    
    if (selectedCategory === 'deals') {
      const isBaseDeal = Boolean((p.discountPercent && p.discountPercent > 0) || p.featured || p.rating >= 4.7);
      if (!isBaseDeal) return false;

      if (activeSubcategory && activeSubcategory !== 'all' && activeSubcategory !== '') {
        if (activeSubcategory === 'Merchant Week Offers') {
          return Boolean((p.sellerVerified && ((p.discountPercent && p.discountPercent > 0) || p.featured)) || p.rating >= 4.8);
        } else if (activeSubcategory === 'Featured Deals') {
          return Boolean(p.featured);
        } else if (activeSubcategory === 'Flash Sales') {
          return Boolean((p.discountPercent && p.discountPercent >= 15) || (Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes('flash'))));
        } else if (activeSubcategory === 'Limited-Time Discounts') {
          return Boolean(p.discountPercent && p.discountPercent >= 10);
        } else if (activeSubcategory === 'Recommended Promotions') {
          return Boolean(p.rating >= 4.7 || p.featured);
        }
      }
      return true;
    }
    
    const catNameLower = (currentCategoryDef?.name || '').toLowerCase();
    const selCatLower = (selectedCategory || '').toLowerCase();
    
    const categoryStr = (p.category || '').toLowerCase();
    const subcategoryStr = (p.subcategory || '').toLowerCase();
    const tagsArr = Array.isArray(p.tags) ? p.tags : [];
    
    const matchesCategoryDirect = categoryStr === selCatLower || categoryStr.includes(selCatLower);
    const matchesCategoryTag = tagsArr.some(t => typeof t === 'string' && (t.toLowerCase().includes(selCatLower) || selCatLower.includes(t.toLowerCase())));
    const matchesSubcat = (subcategoryStr && subcategoryStr.includes(catNameLower)) || (catNameLower && subcategoryStr.length > 0 && catNameLower.includes(subcategoryStr)) || (subcategoryStr && subcategoryStr.includes(selCatLower));
    
    const matchesCat = matchesCategoryDirect || matchesCategoryTag || matchesSubcat;
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

  // Fallback if category has no direct items yet so user experience is always rich
  const displayProducts = selectedCategory === 'all' 
    ? (categoryProducts.length > 0 ? categoryProducts : products) 
    : categoryProducts;

  const filteredProducts = displayProducts
    .filter((p) => {
      if (!p) return false;
      const titleStr = (p.title || '').toLowerCase();
      const descStr = (p.description || '').toLowerCase();
      const queryStr = (searchQuery || '').toLowerCase();
      const tagsArr = Array.isArray(p.tags) ? p.tags : [];

      const matchesSearch =
        !searchQuery ||
        titleStr.includes(queryStr) ||
        descStr.includes(queryStr) ||
        tagsArr.some((t) => typeof t === 'string' && t.toLowerCase().includes(queryStr));

      const matchesPrice = p.pricePi <= filters.maxPrice;
      const matchesRating = p.rating >= filters.minRating;
      const matchesVerified = !filters.verifiedOnly || p.sellerVerified;
      const matchesDiscount = !filters.discountOnly || (p.discountPercent && p.discountPercent >= 10);

      return matchesSearch && matchesPrice && matchesRating && matchesVerified && matchesDiscount;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price_low') return a.pricePi - b.pricePi;
      if (filters.sortBy === 'price_high') return b.pricePi - a.pricePi;
      if (filters.sortBy === 'newest') return b.id > a.id ? 1 : -1;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const featuredProducts = categoryProducts.filter((p) => p.featured);
  const flashDeals = categoryProducts.filter((p) => p.discountPercent && p.discountPercent >= 10);

  return (
    <div className="space-y-8 pb-20">
      
      {/* CASE A: HUB VIEW (All Categories Hub) */}
      {selectedCategory === 'all' ? (
        <div className="space-y-10">
          
          {/* Main Marketplace Hero Banner */}
          <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Enterprise Pi Coin Global E-Commerce Catalog</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Discover Global Goods & Services with <span className="bg-gradient-to-r from-amber-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">Pi Network</span>
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Select a dedicated marketplace category below to browse verified listings with full-screen focus, PSTP Escrow protection, and instant Pi SDK v2 checkout.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={onOpenAiSearch}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-extrabold text-xs shadow-xl shadow-purple-500/25 hover:opacity-95 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>AI Product Concierge</span>
                  </button>
                </div>
              </div>

              {/* Stats & Trust Card */}
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-purple-800/50 space-y-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-xs text-white">Full-Screen Category Engine</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    13 Categories Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="font-black text-amber-400 text-lg">100% Verified</div>
                    <div className="text-slate-400 text-[11px]">Pi Platform API v2</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="font-black text-emerald-400 text-lg">0.00 π</div>
                    <div className="text-slate-400 text-[11px]">Buyer Protection Fee</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dedicated Category Selector Grid (All 13 Categories) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  Marketplace Categories
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tap any category to open its dedicated full-screen catalog page
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {MARKETPLACE_CATEGORIES.map((cat) => {
                const count = products.filter((p) => {
                  const tagMatch = p.tags.some(t => t.toLowerCase().includes(cat.id.toLowerCase()));
                  const subMatch = p.subcategory.toLowerCase().includes(cat.name.toLowerCase());
                  return tagMatch || subMatch;
                }).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all text-left flex flex-col justify-between space-y-3 group shadow-sm hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center border border-purple-200 dark:border-purple-800 group-hover:scale-110 transition-transform">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {count > 0 ? `${count} items` : 'Active'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {cat.description}
                      </p>
                    </div>

                    <div className="text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Open Category</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flash Deals across Marketplace */}
          {flashDeals.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Flash Deals & Discounted Products
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {flashDeals.slice(0, 5).map((product) => (
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

          {/* Featured Verified Merchants Showcase */}
          {vendors.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      Verified Pi Merchants & Global Storefronts
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Explore standalone merchant stores backed by Pi Payment Server-Verified & PSTP Escrow Protection
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
                      className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
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
                            <div className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-900 overflow-hidden bg-white shadow-md">
                              <img
                                src={vendor.logoImage || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                                alt={vendor.storeName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                              {vendorProductsCount} Active Listings
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
            </div>
          )}

          {/* All Featured Listings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Featured Global Listings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing verified products available for direct Pi Coin settlement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
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

        </div>
      ) : (
        /* CASE B: DEDICATED CATEGORY CATALOG PAGE */
        <div className="space-y-6">
          
          {/* Category Banner Header */}
          <div className="relative bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl mx-4 sm:mx-6 border border-slate-800">
            <img
              src={currentCategoryDef?.bannerImage}
              alt={currentCategoryDef?.name}
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />
            <div className="relative z-10 p-6 sm:p-10 space-y-4 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Marketplace Categories</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
                  {getCategoryIcon(currentCategoryDef?.iconName || 'Package')}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    {currentCategoryDef?.name} Dedicated Catalog
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    {currentCategoryDef?.description}
                  </p>
                </div>
              </div>

              {/* Subcategories & Promotions interactive pill bar */}
              {currentCategoryDef?.subcategories && (
                <div className="flex flex-wrap items-center gap-2 pt-2 relative z-20">
                  <span className="text-xs text-slate-300 font-extrabold self-center mr-1">
                    {selectedCategory === 'deals' ? 'Filter Promotions:' : 'Subcategories:'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        setActiveSubcategory('all');
                      } catch (err) {
                        console.error('Error toggling subcategory:', err);
                      }
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer select-none ${
                      activeSubcategory === 'all'
                        ? 'bg-purple-600 text-white border border-purple-400 shadow-purple-500/30 ring-2 ring-purple-400/30'
                        : 'bg-slate-800/90 hover:bg-slate-700/90 text-purple-300 border border-purple-900/60 hover:border-purple-500'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 pointer-events-none" />
                    <span className="pointer-events-none">All {selectedCategory === 'deals' ? 'Deals' : 'Items'}</span>
                  </button>

                  {currentCategoryDef.subcategories.map((sub, idx) => {
                    const isActive = activeSubcategory === sub;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            setActiveSubcategory(isActive ? 'all' : sub);
                          } catch (err) {
                            console.error('Error selecting subcategory:', err);
                          }
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer select-none ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white border border-amber-300 shadow-amber-500/30 scale-105 ring-2 ring-amber-400/30'
                            : 'bg-slate-800/90 hover:bg-slate-700/90 text-purple-200 border border-purple-900/60 hover:border-purple-400 hover:text-white'
                        }`}
                        title={`Filter by ${sub}`}
                      >
                        {selectedCategory === 'deals' && (
                          <Flame className={`w-3.5 h-3.5 pointer-events-none ${isActive ? 'text-amber-200' : 'text-amber-400'}`} />
                        )}
                        <span className="pointer-events-none">{sub}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-white pointer-events-none" />}
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
              filters={filters}
              onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
              onResetFilters={() => {
                setActiveSubcategory('all');
                setFilters({
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
                setSearchQuery('');
              }}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Category Product Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{currentCategoryDef?.name}</span>
                {activeSubcategory !== 'all' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {activeSubcategory}
                  </span>
                )}
                <span className="text-slate-500 font-medium text-sm">({filteredProducts.length})</span>
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  No products found in {currentCategoryDef?.name} matching your criteria
                </p>
                <button
                  onClick={() => {
                    setFilters({
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
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset Category Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
