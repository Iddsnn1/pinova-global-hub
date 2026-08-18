import React, { useState } from 'react';
import { X, Star, ShieldCheck, ShoppingBag, Zap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onFullDetails: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onOpenStorefront?: (sellerName: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onFullDetails,
  onAddToCart,
  onInstantBuy,
  onToggleWishlist,
  isWishlisted,
  onOpenStorefront
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discountedPrice = product.discountPercent
    ? product.pricePi * (1 - product.discountPercent / 100)
    : product.pricePi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          
          {/* Left Column: Image */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 relative">
              <img
                src={product.images[selectedImage] || product.images[0] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'}
                alt={product.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => onToggleWishlist(product, e)}
                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                  isWishlisted
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-purple-600 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="thumb" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <button
                  onClick={() => onOpenStorefront?.(product.sellerName)}
                  className="hover:underline text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1"
                >
                  <span>{product.sellerName}</span>
                  {product.sellerVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                </button>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="my-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold uppercase">Price in Pi Coin</div>
                  <div className="text-2xl font-black text-amber-500">{discountedPrice.toFixed(2)} π</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Order Protection Active
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onAddToCart(product, quantity);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onInstantBuy(product, quantity);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <span>Buy Now with π</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onFullDetails(product);
                }}
                className="w-full text-center text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline py-1"
              >
                View Full Specifications & Customer Reviews →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
