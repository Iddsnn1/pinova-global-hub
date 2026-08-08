import React, { useState } from 'react';
import { X, ShieldCheck, Star, MapPin, Calendar, Package, MessageSquare, Award, CheckCircle2 } from 'lucide-react';
import { Vendor, Product } from '../types';
import { ProductCard } from './ProductCard';

interface SellerStorefrontModalProps {
  vendor: Vendor;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  wishlistProductIds: string[];
  onInstantBuy: (product: Product, e: React.MouseEvent) => void;
  onContactSeller: (sellerUsername: string) => void;
}

export const SellerStorefrontModal: React.FC<SellerStorefrontModalProps> = ({
  vendor,
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistProductIds,
  onInstantBuy,
  onContactSeller
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'about' | 'policies'>('catalog');

  const vendorProducts = products.filter(
    (p) => p.sellerId === vendor.id || (p.sellerName || '').toLowerCase() === (vendor.storeName || '').toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 transition-colors border border-white/20 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          
          {/* Store Banner */}
          <div className="relative h-44 sm:h-60 w-full bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 overflow-hidden">
            <img
              src={vendor.bannerImage}
              alt={vendor.storeName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          {/* Store Profile Bar */}
          <div className="px-6 sm:px-10 pb-6 -mt-16 relative z-10 flex flex-wrap sm:flex-nowrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex-shrink-0">
                <img
                  src={vendor.logoImage}
                  alt={vendor.storeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{vendor.storeName}</h1>
                  {vendor.verified && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Pi Merchant</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg line-clamp-1 font-medium">{vendor.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{vendor.rating}</span>
                    <span className="text-slate-400 font-normal">({vendor.reviewsCount} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    <span>{vendorProducts.length} Active Listings</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{vendor.totalSalesPi.toFixed(2)} π Total Volume</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-1 w-full sm:w-auto">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md ${
                  isFollowing
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isFollowing ? 'Following Store' : '+ Follow Merchant'}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onContactSeller(vendor.sellerUsername);
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 sm:px-10 border-b border-slate-200 dark:border-slate-800 flex gap-6 text-xs font-bold pt-4">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'catalog'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Store Catalog ({vendorProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Merchant Info & Specs
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'policies'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              PiNova Guarantees & Policies
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {activeTab === 'catalog' && (
              <div>
                {vendorProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No items currently listed by this merchant.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {vendorProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={(p) => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        onAddToCart={(p, e) => onAddToCart(p, e)}
                        onToggleWishlist={(p, e) => onToggleWishlist(p, e)}
                        isWishlisted={wishlistProductIds.includes(product.id)}
                        onInstantBuy={(p, e) => {
                          onClose();
                          onInstantBuy(p, e);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-2xl space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">About {vendor.storeName}</h3>
                  <p>{vendor.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-slate-400 font-medium">Joined Marketplace</span>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{vendor.joinedDate}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-slate-400 font-medium">Supported Shipping Regions</span>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{vendor.shippingCountries.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="max-w-2xl space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>PiNova Order Protection Standard</span>
                  </div>
                  <p>All orders placed with {vendor.storeName} are protected by PiNova Order Protection. Payments are authorized and verified via the official Pi Network platform API prior to order dispatch.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
