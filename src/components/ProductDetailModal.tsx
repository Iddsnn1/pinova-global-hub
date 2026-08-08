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
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  reviews,
  onAddReview,
  userOrders = []
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'shipping'>('overview');

  // Custom Category Inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const discountedPrice = product.discountPercent
    ? product.pricePi * (1 - product.discountPercent / 100)
    : product.pricePi;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(product.id, newRating, newComment);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const getCustomDetails = () => {
    if (product.category === 'airtime') return { phoneNumber };
    if (product.category === 'utility') return { accountNumber };
    if (product.category === 'giftcard') return { recipientEmail };
    return undefined;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 relative">
              <img
                src={product.images[selectedImage]}
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
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
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

            {/* Seller Info Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Verified Vendor</p>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <span>{product.sellerName}</span>
                  {product.sellerVerified && (
                    <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  99.8% Escrow Fulfillment
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Form */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Title */}
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                <span>{product.subcategory}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>

              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
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
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Pi Escrow Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400">
                      {discountedPrice.toFixed(2)} π
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
                  <span>Escrow Locked</span>
                </div>
              </div>

              {/* Category-Specific Custom Input Fields */}
              {product.category === 'airtime' && (
                <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    Enter Target Mobile Phone Number:
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +2348030001122 or +14155552671"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">Airtime or data credit will be top-up instantly upon Pi payment confirmation.</p>
                </div>
              )}

              {product.category === 'utility' && (
                <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Enter Utility Account / Meter Number:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01293847561 or Account ID"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">Electricity tokens or water settlement reference will be generated immediately.</p>
                </div>
              )}

              {product.category === 'giftcard' && (
                <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-500" />
                    Recipient Email for Code Delivery (Optional):
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. friend@example.com (or leave empty for self)"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">Gift code is revealed in your Buyer Dashboard digital vault instantly.</p>
                </div>
              )}

              {/* Quantity Selector for Physical Items */}
              {product.category === 'physical' && (
                <div className="flex items-center gap-4 my-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-bold text-sm text-slate-900 dark:text-slate-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Description & Specs Tabs */}
              <div className="mt-4">
                <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-3 border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 px-3 border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeTab === 'overview' && (
                    <div className="space-y-3">
                      <p>{product.description}</p>
                      {product.features && product.features.length > 0 && (
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">Key Features:</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                            {product.features.map((feat, idx) => (
                              <li key={idx}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <ProductReviewsSection product={product} userOrders={userOrders} />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(product, quantity, getCustomDetails());
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  onInstantBuy(product, quantity, getCustomDetails());
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 hover:opacity-95 transition-opacity"
              >
                Buy Now ({(discountedPrice * quantity).toFixed(2)} π)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
