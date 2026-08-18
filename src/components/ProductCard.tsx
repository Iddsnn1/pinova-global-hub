import React from 'react';
import { Star, Heart, ShoppingBag, ShieldCheck, Zap, Download, Gift, Smartphone, Package } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onInstantBuy: (product: Product, e: React.MouseEvent) => void;
  onOpenStorefront?: (sellerName: string, e: React.MouseEvent) => void;
  onQuickView?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onInstantBuy,
  onOpenStorefront,
  onQuickView
}) => {
  const { t, formatCurrency } = useTranslation();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'digital': return <Download className="w-3 h-3 text-cyan-400" />;
      case 'airtime': return <Smartphone className="w-3 h-3 text-emerald-400" />;
      case 'utility': return <Zap className="w-3 h-3 text-amber-400" />;
      case 'giftcard': return <Gift className="w-3 h-3 text-purple-400" />;
      default: return <Package className="w-3 h-3 text-indigo-400" />;
    }
  };

  const discountedPrice = product.discountPercent
    ? product.pricePi * (1 - product.discountPercent / 100)
    : product.pricePi;

  const priceFormatted = formatCurrency(discountedPrice, 314159.00, true);

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 hover:border-purple-500/80 dark:hover:border-purple-500/80 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500'
          }`}
          title="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide border border-white/10 shadow-sm">
          {getCategoryIcon(product.category)}
          <span className="capitalize">{product.category}</span>
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product, e);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all backdrop-blur-md"
            >
              Quick Preview
            </button>
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercent && (
          <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md">
            -{product.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900">
        <div>
          {/* Seller Status */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span 
              onClick={(e) => {
                if (onOpenStorefront) {
                  e.stopPropagation();
                  onOpenStorefront(product.sellerName, e);
                }
              }}
              className="truncate max-w-[120px] font-semibold hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
            >
              {product.sellerName}
            </span>
            {product.sellerVerified && (
              <span className="inline-flex items-center text-purple-700 dark:text-purple-300 font-bold text-[9px] bg-purple-50 dark:bg-purple-950/80 px-1 py-0.5 rounded border border-purple-200 dark:border-purple-800/60">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-purple-600 dark:text-purple-400" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Star Rating & Delivery tag */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-[11px] font-bold ml-1 text-slate-800 dark:text-slate-200">{product.rating}</span>
              <span className="text-[10px] text-slate-400 ml-1">({product.reviewsCount})</span>
            </div>

            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {product.category === 'digital' || product.category === 'airtime' || product.category === 'utility' ? 'Instant' : '1-3d Delivery'}
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Protected Price</div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400 tracking-tight">
                {discountedPrice.toFixed(2)} π
              </span>
              {product.discountPercent && (
                <span className="text-[10px] text-slate-400 line-through font-medium">
                  {product.pricePi.toFixed(2)} π
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to Cart */}
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Instant Buy */}
            <button
              onClick={(e) => onInstantBuy(product, e)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] shadow-md shadow-purple-600/20 hover:opacity-95 transition-opacity"
            >
              Buy with π
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
