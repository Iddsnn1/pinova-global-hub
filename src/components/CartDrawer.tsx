import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Tag, ArrowRight, Check } from 'lucide-react';
import { OrderItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedCoupon?: Coupon, shippingCountry?: string) => void;
  coupons: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  coupons
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');

  if (!isOpen) return null;

  const subtotalPi = cartItems.reduce((acc, item) => {
    const price = item.product.discountPercent
      ? item.product.pricePi * (1 - item.product.discountPercent / 100)
      : item.product.pricePi;
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotalPi * appliedCoupon.discountPercent) / 100 : 0;
  const totalPi = Math.max(0, subtotalPi - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const matched = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (!matched) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (subtotalPi < matched.minSpendPi) {
      setCouponError(`Minimum spend of ${matched.minSpendPi} π required`);
      return;
    }
    setAppliedCoupon(matched);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Title Bar */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Your Pi Checkout Cart</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/60 mx-auto flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Your cart is empty</p>
                <p className="text-xs text-slate-400">Explore products across physical goods, airtime, and digital keys!</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = item.product.discountPercent
                  ? item.product.pricePi * (1 - item.product.discountPercent / 100)
                  : item.product.pricePi;

                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-200 dark:bg-slate-900"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{item.product.category}</p>
                      
                      {item.customDetails?.phoneNumber && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Phone: {item.customDetails.phoneNumber}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-amber-500 text-sm">
                          {(itemPrice * item.quantity).toFixed(2)} π
                        </span>

                        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* Shipping Country Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Destination Country:
                </label>
                <select
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="India">India</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Global Automated Digital">Global Automated Digital</option>
                </select>
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. PINOVA10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold uppercase focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Coupon "{appliedCoupon.code}" Applied ({appliedCoupon.discountPercent}% OFF)
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{subtotalPi.toFixed(2)} π</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{discountAmount.toFixed(2)} π</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Buyer Protection Fee</span>
                  <span className="font-bold text-emerald-500">0.00 π (FREE)</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Order Amount</span>
                  <span className="text-amber-500 text-lg">{totalPi.toFixed(2)} π</span>
                </div>
              </div>

              {/* Order Protection Notice */}
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center gap-2 text-[11px] text-purple-700 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                <span>PiNova Order Protection verifies and protects your payment through the official Pi Network platform.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onProceedToCheckout(appliedCoupon || undefined, shippingCountry);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Proceed to Pi Payment Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
