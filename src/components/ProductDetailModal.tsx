import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Download, 
  Smartphone, 
  Zap, 
  Gift, 
  Package, 
  Share2, 
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, Review, Order } from '../types';

import { ProductReviewsSection } from './trust/ProductReviewsSection';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customDetails?: any) => void;
  onInstantBuy: (product: Product, quantity: number, customDetails?: any) => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string) => void;
  userOrders?: Order[];
  onOpenStorefront?: (sellerName: string) => void;
  onContactSeller?: (sellerUsername: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  reviews,
  onAddReview,
  userOrders = [],
  onOpenStorefront,
  onContactSeller
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'specs' | 'escrow'>('overview');

  // Custom Category Inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [serviceBrief, setServiceBrief] = useState('');

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const basePrice = product.discountPercent
    ? product.pricePi * (1 - product.discountPercent / 100)
    : product.pricePi;
  const unitPrice = basePrice + (selectedVariant?.priceDeltaPi || 0);

  const isOutOfStock = product.stock <= 0 && product.category === 'physical';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(product.id, newRating, newComment);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const getCustomDetails = () => {
    const details: Record<string, any> = {};
    if (selectedVariant) {
      details.variant = selectedVariant;
    }
    if (product.category === 'airtime') details.phoneNumber = phoneNumber;
    if (product.category === 'utility') details.accountNumber = accountNumber;
    if (product.category === 'giftcard') details.recipientEmail = recipientEmail;
    if (product.category === 'service') details.serviceBrief = serviceBrief;
    return Object.keys(details).length > 0 ? details : undefined;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border border-slate-200 dark:border-slate-700 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery & Merchant Card */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 relative">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-800/60 text-amber-300 font-bold text-xs uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx
                        ? 'border-purple-600 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Merchant Identity Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Merchant & Storefront</p>
                <div 
                  onClick={() => {
                    if (onOpenStorefront) {
                      onClose();
                      onOpenStorefront(product.sellerName);
                    }
                  }}
                  className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-sm cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <span>{product.sellerName}</span>
                  {product.sellerVerified && (
                    <span className="inline-flex items-center text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onContactSeller && (
                  <button
                    onClick={() => {
                      onClose();
                      onContactSeller(product.sellerName);
                    }}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-200 transition-colors"
                    title="Message Seller"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                {onOpenStorefront && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStorefront(product.sellerName);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    Store
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Form */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Title */}
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                <span>{product.subcategory}</span>
                <span>•</span>
                <span className={isOutOfStock ? 'text-rose-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                  {isOutOfStock ? 'Out of Stock' : (product.category === 'physical' ? `${product.stock} In Stock` : 'Instant Access')}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                {product.title}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
                <span className="text-xs text-slate-400">({productReviews.length || product.reviewsCount} reviews)</span>
              </div>

              {/* Price Banner */}
              <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-800/40 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-purple-300 font-medium uppercase tracking-wider">PSTP Escrow Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400">
                      {unitPrice.toFixed(2)} π
                    </span>
                    {product.discountPercent && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.pricePi.toFixed(2)} π
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Escrow Protected</span>
                </div>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="my-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Option / Edition:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedVariantId === v.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                        }`}
                      >
                        {v.title}
                        {v.priceDeltaPi ? ` (+${v.priceDeltaPi.toFixed(2)} π)` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category-Specific Custom Input Fields */}
              {product.category === 'airtime' && (
                <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    Enter Target Mobile Phone Number:
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +14155552671 or +2348030001122"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              )}

              {product.category === 'utility' && (
                <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Enter Utility Account / Meter Number:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01293847561 or Account Reference"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              )}

              {product.category === 'giftcard' && (
                <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-500" />
                    Recipient Email for Code Delivery (Optional):
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. friend@example.com (or leave empty for your vault)"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              )}

              {product.category === 'service' && (
                <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-indigo-500" />
                    Project Scope / Brief Details (Optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your requirements, repository link, or desired timeline..."
                    value={serviceBrief}
                    onChange={(e) => setServiceBrief(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  />
                </div>
              )}

              {/* Quantity Selector for Physical Items */}
              {product.category === 'physical' && !isOutOfStock && (
                <div className="flex items-center gap-4 my-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold text-xs text-slate-900 dark:text-slate-100">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Description & Tabs */}
              <div className="mt-4">
                <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'specs'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Specifications & Delivery
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {activeTab === 'overview' && (
                    <div className="space-y-3">
                      <p>{product.description}</p>
                      {product.features && product.features.length > 0 && (
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Highlights:</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                            {product.features.map((feat, idx) => (
                              <li key={idx}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-2">
                      {product.serviceDuration && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-medium">Turnaround Timeline:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{product.serviceDuration}</span>
                        </div>
                      )}
                      {product.serviceLocation && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-medium">Service Delivery:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{product.serviceLocation}</span>
                        </div>
                      )}
                      {product.shippingWeightKg && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-medium">Shipping Weight:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{product.shippingWeightKg} kg</span>
                        </div>
                      )}
                      {product.specs && Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-medium">{key}:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <ProductReviewsSection product={product} userOrders={userOrders} />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product, quantity, getCustomDetails());
                  onClose();
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-colors ${
                  isOutOfStock
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Add to Cart
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => {
                  onInstantBuy(product, quantity, getCustomDetails());
                  onClose();
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-purple-500/20 hover:opacity-95'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : `Buy Now (${(unitPrice * quantity).toFixed(2)} π)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
