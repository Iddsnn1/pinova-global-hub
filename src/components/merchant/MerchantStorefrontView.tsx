import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Package, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Search, 
  Filter, 
  Globe, 
  Mail, 
  Phone, 
  Clock, 
  Layers, 
  SlidersHorizontal,
  Download,
  Truck,
  Briefcase,
  AlertCircle,
  Share2,
  Check
} from 'lucide-react';
import { Vendor, Product, Review } from '../../types';
import { ProductCard } from '../ProductCard';

export interface MerchantStorefrontViewProps {
  vendor: Vendor;
  products: Product[];
  reviews?: Review[];
  onClose?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  wishlistProductIds: string[];
  onInstantBuy: (product: Product, e: React.MouseEvent) => void;
  onContactSeller: (sellerUsername: string) => void;
  onQuickView?: (product: Product, e: React.MouseEvent) => void;
  isModal?: boolean;
}

export const MerchantStorefrontView: React.FC<MerchantStorefrontViewProps> = ({
  vendor,
  products,
  reviews = [],
  onClose,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistProductIds,
  onInstantBuy,
  onContactSeller,
  onQuickView,
  isModal = false
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(vendor.followersCount || 1200);
  const [activeTab, setActiveTab] = useState<'catalog' | 'about' | 'policies' | 'reviews'>('catalog');
  
  // In-store catalog filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'physical' | 'digital' | 'service'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price_low' | 'price_high' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const vendorProducts = useMemo(() => {
    return products.filter(
      (p) => p.sellerId === vendor.id || (p.sellerName || '').toLowerCase() === (vendor.storeName || '').toLowerCase()
    );
  }, [products, vendor]);

  const vendorReviews = useMemo(() => {
    const productIds = new Set(vendorProducts.map((p) => p.id));
    return reviews.filter((r) => productIds.has(r.productId));
  }, [vendorProducts, reviews]);

  const filteredProducts = useMemo(() => {
    return vendorProducts
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (p.title || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTags) return false;
        }

        // Product type
        if (selectedType !== 'all') {
          if (selectedType === 'physical' && p.category !== 'physical') return false;
          if (selectedType === 'digital' && p.category !== 'digital' && p.category !== 'giftcard' && p.category !== 'airtime' && p.category !== 'utility') return false;
          if (selectedType === 'service' && p.category !== 'service') return false;
        }

        // In-stock only
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_low') return a.pricePi - b.pricePi;
        if (sortBy === 'price_high') return b.pricePi - a.pricePi;
        if (sortBy === 'newest') return b.id > a.id ? 1 : -1;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [vendorProducts, searchQuery, selectedType, inStockOnly, sortBy]);

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  const handleShareStore = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `?store=${encodeURIComponent(vendor.storeName)}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isVerified = vendor.verificationStatus === 'Verified' || (vendor.verificationStatus === undefined && vendor.verified);

  const containerContent = (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      
      {/* Top Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 overflow-hidden">
        <img
          src={vendor.bannerImage}
          alt={vendor.storeName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors border border-white/20 shadow-xl"
            aria-label="Close Storefront"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-extrabold border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
            <Award className="w-3.5 h-3.5" />
            <span>PiNova Official Merchant Hub</span>
          </span>
        </div>
      </div>

      {/* Store Header & Stats */}
      <div className="px-4 sm:px-8 pb-6 -mt-16 relative z-10 flex flex-wrap sm:flex-nowrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden flex-shrink-0">
            <img
              src={vendor.logoImage}
              alt={vendor.storeName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {vendor.storeName}
              </h1>
              {isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Server-Verified Merchant</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
                  {vendor.verificationStatus || 'Standard Merchant'}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl line-clamp-2 font-medium">
              {vendor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{vendor.rating}</span>
                <span className="text-slate-400 font-normal">({vendor.reviewsCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{vendorProducts.length}</span> Listings
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{vendor.totalSalesPi.toFixed(2)} π</span> Total Volume
              </span>
              {vendor.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{vendor.country}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-1 w-full sm:w-auto">
          <button
            onClick={handleToggleFollow}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
              isFollowing
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Following ({followerCount})</span>
              </>
            ) : (
              <span>+ Follow Merchant ({followerCount})</span>
            )}
          </button>

          <button
            onClick={() => onContactSeller(vendor.sellerUsername)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Contact Seller</span>
          </button>

          <button
            onClick={handleShareStore}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
            title="Share Store Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 flex gap-6 text-xs font-bold pt-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalogue ({vendorProducts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>About & Specifications</span>
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'policies'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Policies & Escrow Protection</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews ({vendor.reviewsCount})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-8 flex-1 overflow-y-auto space-y-6">
        
        {/* TAB 1: CATALOGUE */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search inside ${vendor.storeName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Product Type Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedType === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All ({vendorProducts.length})
                </button>
                <button
                  onClick={() => setSelectedType('physical')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                    selectedType === 'physical'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  <span>Physical</span>
                </button>
                <button
                  onClick={() => setSelectedType('digital')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                    selectedType === 'digital'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Download className="w-3 h-3" />
                  <span>Digital</span>
                </button>
                <button
                  onClick={() => setSelectedType('service')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                    selectedType === 'service'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Services</span>
                </button>
              </div>

              {/* Sorting & In-Stock toggle */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="featured">Featured First</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different product category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
                >
                  Reset Store Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => {
                      if (onClose) onClose();
                      onSelectProduct(p);
                    }}
                    onAddToCart={(p, e) => onAddToCart(p, e)}
                    onToggleWishlist={(p, e) => onToggleWishlist(p, e)}
                    isWishlisted={wishlistProductIds.includes(product.id)}
                    onInstantBuy={(p, e) => {
                      if (onClose) onClose();
                      onInstantBuy(p, e);
                    }}
                    onQuickView={onQuickView ? (p, e) => onQuickView(p, e) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ABOUT & SPECS */}
        {activeTab === 'about' && (
          <div className="max-w-3xl space-y-6 text-xs text-slate-600 dark:text-slate-300">
            
            {/* Merchant Bio */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>About {vendor.storeName}</span>
              </h3>
              <p className="leading-relaxed">{vendor.bio}</p>
            </div>

            {/* Merchant Identity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-medium">Marketplace Onboarding</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Member Since {vendor.joinedDate}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-medium">Merchant Country & Location</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{vendor.country || 'Global Pioneer Merchant'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-medium">Ships To & Service Area</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>{vendor.shippingCountries.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Customer Support & Direct Contact Channels</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {vendor.contactEmail && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email: <strong className="text-slate-900 dark:text-slate-100">{vendor.contactEmail}</strong></span>
                  </div>
                )}
                {vendor.contactPhone && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Phone: <strong className="text-slate-900 dark:text-slate-100">{vendor.contactPhone}</strong></span>
                  </div>
                )}
                {vendor.websiteUrl && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Website: <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">{vendor.websiteUrl}</a></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  <span>In-App Chat: <strong className="text-purple-400">@{vendor.sellerUsername}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POLICIES & ESCROW */}
        {activeTab === 'policies' && (
          <div className="max-w-3xl space-y-4 text-xs text-slate-600 dark:text-slate-300">
            
            {/* PiNova Escrow Protection Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/50 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>PSTP Escrow Protection Guarantee</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                All purchases with <strong>{vendor.storeName}</strong> are protected by PiNova Escrow Protection. Your Pi Coins remain held securely in escrow until goods are physically delivered or digital assets are verified and received by the buyer.
              </p>
            </div>

            {/* Policies Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Fulfillment & Shipping Policy</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {vendor.policies?.shippingPolicy || 'Dispatches within 24-48 business hours via insured tracked carrier. Tracking numbers are updated in the buyer Order Hub upon dispatch.'}
                </p>
                {vendor.policies?.averageDispatchTime && (
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Average Dispatch Time: {vendor.policies.averageDispatchTime}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Refund & Dispute Resolution Policy</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {vendor.policies?.refundPolicy || 'Eligible items may be returned within 14-30 days under standard PSTP buyer protection. Escrow funds are refunded to the buyer if items fail delivery or do not match merchant specifications.'}
                </p>
              </div>

              {vendor.policies?.digitalDeliveryTerms && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Digital Asset & License Terms</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {vendor.policies.digitalDeliveryTerms}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl space-y-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Merchant Overall Rating</div>
                <div className="text-2xl font-black text-amber-500 flex items-center gap-1.5">
                  <Star className="w-6 h-6 fill-current" />
                  <span>{vendor.rating}</span>
                  <span className="text-xs font-normal text-slate-400">/ 5.0 ({vendor.reviewsCount} customer reviews)</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                100% PSTP Escrow Verified
              </span>
            </div>

            {vendorReviews.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <Star className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
                <span>Reviews are aggregated from verified Pi purchase orders across this merchant's catalogue.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {vendorReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {rev.username}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Verified Pi Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl my-6 max-h-[90vh] flex">
          {containerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {containerContent}
    </div>
  );
};
