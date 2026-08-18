import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, ArrowRight, ArrowLeft, Tag, Lock, CheckCircle2 } from 'lucide-react';
import { CartItem, Coupon } from '../../types';

interface CartViewProps {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onOpenCheckoutModal: () => void;
  onNavigateSection: (sec: any) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  appliedCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onApplyCoupon,
  onRemoveCoupon,
  onOpenCheckoutModal,
  onNavigateSection
}) => {
  const [couponInput, setCouponInput] = useState('');

  const getItemUnitPrice = (item: CartItem): number => {
    const basePrice = item.product.discountPercent
      ? item.product.pricePi * (1 - item.product.discountPercent / 100)
      : item.product.pricePi;
    const delta = item.customDetails?.variant?.priceDeltaPi || 0;
    return basePrice + delta;
  };

  const subtotalPi = cart.reduce((acc, item) => acc + getItemUnitPrice(item) * item.quantity, 0);
  const discountAmountPi = appliedCoupon
    ? (subtotalPi * appliedCoupon.discountPercent) / 100
    : 0;
  const totalPi = Math.max(0, subtotalPi - discountAmountPi);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Your PiNova Cart is Empty
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Browse our global marketplace catalog across 13 major categories and 15 utility services to add items to your cart.
          </p>
        </div>
        <button
          onClick={() => onNavigateSection('marketplace')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xl transition-colors"
        >
          Explore Marketplace Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSection('marketplace')}
            className="p-2 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Shopping Cart & Order Summary
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {cart.length} item{cart.length > 1 ? 's' : ''} in cart
            </p>
          </div>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {item.product.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Seller: <span className="text-purple-400 font-semibold">{item.product.sellerName}</span>
                  </div>

                  {item.customDetails?.variant && (
                    <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-[11px] border border-purple-500/20">
                      Option: {item.customDetails.variant.title}
                    </div>
                  )}

                  {item.customDetails?.phoneNumber && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Recipient: <span className="font-mono font-semibold">{item.customDetails.phoneNumber}</span>
                    </div>
                  )}
                  {item.customDetails?.accountNumber && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Meter / Acct: <span className="font-mono font-semibold">{item.customDetails.accountNumber}</span>
                    </div>
                  )}
                  {item.customDetails?.recipientEmail && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Delivery Email: <span className="font-mono font-semibold">{item.customDetails.recipientEmail}</span>
                    </div>
                  )}
                  {item.customDetails?.serviceBrief && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      Scope: <span className="italic">{item.customDetails.serviceBrief}</span>
                    </div>
                  )}

                  <div className="text-xs font-black text-amber-500 mt-1">
                    {getItemUnitPrice(item).toFixed(2)} π / unit
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center text-slate-900 dark:text-slate-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {(getItemUnitPrice(item) * item.quantity).toFixed(2)} π
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-[10px] text-rose-500 hover:underline font-bold mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 h-fit">
          <h2 className="font-black text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Order Summary</span>
          </h2>

          {/* Coupon Code Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Discount Promo Code</label>
            {appliedCoupon ? (
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-purple-950/80 border border-purple-800 text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>{appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PINOVA10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold"
                />
                <button
                  onClick={() => {
                    onApplyCoupon(couponInput);
                    setCouponInput('');
                  }}
                  className="px-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Pricing Math */}
          <div className="space-y-2.5 text-xs text-slate-300 border-t border-b border-slate-800 py-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-white">{subtotalPi.toFixed(2)} π</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-purple-400 font-bold">
                <span>Discount ({appliedCoupon.code}):</span>
                <span>-{discountAmountPi.toFixed(2)} π</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Escrow Order Protection Fee:</span>
              <span className="text-emerald-400 font-bold">0.00 π (FREE)</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
              <span>Total Payment Required:</span>
              <span className="text-amber-400 text-lg">{totalPi.toFixed(2)} π</span>
            </div>
          </div>

          {/* PSTP Protection Note */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>Your payment is locked in PSTP Escrow. Funds are released to sellers only when you confirm receipt.</p>
          </div>

          {/* Checkout Trigger */}
          <button
            onClick={onOpenCheckoutModal}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <span>Proceed to Escrow Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
