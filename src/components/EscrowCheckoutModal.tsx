import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Loader2, AlertCircle, ArrowRight, Smartphone, MapPin } from 'lucide-react';
import { OrderItem, Coupon } from '../types';
import { executePiPayment } from '../lib/piSdk';

interface EscrowCheckoutModalProps {
  cartItems: OrderItem[];
  appliedCoupon?: Coupon;
  shippingCountry: string;
  onClose: () => void;
  onPaymentSuccess: (newOrderData: any) => void;
  userUsername: string;
}

export const EscrowCheckoutModal: React.FC<EscrowCheckoutModalProps> = ({
  cartItems,
  appliedCoupon,
  shippingCountry,
  onClose,
  onPaymentSuccess,
  userUsername
}) => {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userUsername || 'Pioneer User',
    street: '123 Enterprise Way',
    city: 'New York',
    country: shippingCountry,
    postalCode: '10001',
    phone: '+1 212 555 0199'
  });

  const [paymentStep, setPaymentStep] = useState<'review' | 'processing' | 'success' | 'failed'>('review');
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [completedPaymentId, setCompletedPaymentId] = useState<string>('');
  const [completedTxid, setCompletedTxid] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPercent
      ? item.product.pricePi * (1 - item.product.discountPercent / 100)
      : item.product.pricePi;
    return acc + price * item.quantity;
  }, 0);

  const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const totalAmountPi = Math.max(0.01, subtotal - discount);

  const isPhysicalOrder = cartItems.some((i) => i.product.category === 'physical');

  const addLog = (msg: string) => {
    setStatusLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleStartPayment = () => {
    setPaymentStep('processing');
    setStatusLogs([]);
    addLog('Preparing payment metadata for Pi Network SDK...');

    const memo = `PiNova Purchase (${cartItems.length} items) - Order by ${userUsername}`;
    const metadata = {
      orderId: `ORD-PI-${Date.now().toString().slice(-6)}`,
      buyerUsername: userUsername,
      itemCount: cartItems.length,
      shippingCountry
    };

    executePiPayment(
      {
        amount: Number(totalAmountPi.toFixed(2)),
        memo,
        metadata
      },
      {
        onStatusUpdate: (msg) => {
          addLog(msg);
        },
        onSuccess: (paymentId, txid) => {
          setCompletedPaymentId(paymentId);
          setCompletedTxid(txid);
          setPaymentStep('success');

          // Construct digital deliveries if any
          const digitalDeliveries = cartItems
            .filter((i) => i.product.category === 'digital' || i.product.category === 'giftcard' || i.product.category === 'airtime' || i.product.category === 'utility')
            .map((i) => ({
              productId: i.product.id,
              codeOrUrl: i.product.digitalKey || i.product.digitalDownloadUrl || `DELIVERY-CODE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              title: i.product.title
            }));

          const newOrder = {
            id: metadata.orderId,
            buyerUsername: userUsername,
            items: cartItems,
            totalPi: Number(totalAmountPi.toFixed(2)),
            escrowStatus: isPhysicalOrder ? 'in_escrow' : 'released',
            piPaymentId: paymentId,
            piTxid: txid,
            shippingAddress: isPhysicalOrder ? shippingAddress : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            digitalDeliveries
          };

          onPaymentSuccess(newOrder);
        },
        onCancel: (paymentId) => {
          setPaymentStep('failed');
          setErrorMessage(`Payment ${paymentId} was cancelled by user.`);
          addLog(`Payment cancelled.`);
        },
        onError: (err) => {
          setPaymentStep('failed');
          setErrorMessage(err.message || 'Payment processing failed');
          addLog(`Error: ${err.message}`);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">Protected Checkout Experience</h3>
              <p className="text-xs text-purple-300 mt-1 font-medium">Official Pi SDK v2 Payment Workflow & Pi Platform API Integration</p>
            </div>
          </div>

          {paymentStep === 'review' && (
            <button onClick={onClose} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* STEP 1: REVIEW ORDER & SHIPPING */}
          {paymentStep === 'review' && (
            <>
              {/* Order Items Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Order Summary ({cartItems.length} items)
                </h4>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <img src={item.product.images[0]} alt="thumb" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{item.product.title}</span>
                        <span className="text-slate-400">x{item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-amber-500">
                        {(item.product.pricePi * item.quantity).toFixed(2)} π
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Shipping Address Form if physical */}
              {isPhysicalOrder && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>Shipping Address Details ({shippingCountry})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="col-span-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Final Total & Order Protection Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-800/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Total Pi to Pay</span>
                  <div className="text-2xl font-black text-amber-400">{totalAmountPi.toFixed(2)} π</div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-bold block">100% Order Protection</span>
                  <span className="text-[10px] text-purple-300">Protected by PiNova Order Protection</span>
                </div>
              </div>

              {/* Transparency & Operational Compliance Notice */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 leading-relaxed space-y-1.5">
                <p>
                  <strong>Transparency Notice:</strong> PiNova Global Marketplace is built on a non-custodial marketplace architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services. Payment approval and completion are processed through the Official Pi SDK v2 payment workflow and Pi Platform API according to their documented integration flow; PiNova never performs wallet custody, settlement, blockchain validation, or transaction finality.
                </p>
                <p>
                  <strong>Operational Notice:</strong> Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability, response times, and service outcomes may vary depending on provider availability, network connectivity, and Official Pi Platform service status.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-sm shadow-xl shadow-purple-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Authorize Pi Payment ({totalAmountPi.toFixed(2)} π)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* STEP 2: PROCESSING IN PI SDK */}
          {paymentStep === 'processing' && (
            <div className="py-8 space-y-6 text-center">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                <Lock className="w-6 h-6 text-amber-400 absolute" />
              </div>

              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-slate-100">Connecting to Pi Network SDK...</h4>
                <p className="text-xs text-slate-400 mt-1">Please confirm the payment prompt inside your Pi Wallet.</p>
              </div>

              {/* Status Log Box */}
              <div className="p-4 rounded-2xl bg-slate-950 text-left space-y-1 font-mono text-[11px] text-emerald-400 max-h-40 overflow-y-auto border border-slate-800 shadow-inner">
                {statusLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {paymentStep === 'success' && (
            <div className="py-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-black text-xl text-slate-900 dark:text-slate-100">Payment Verified & Order Confirmed!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Payment authorized and verified via official Pi Network platform. Your order is protected by PiNova Order Protection.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Payment ID:</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[200px]">{completedPaymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Pi Blockchain Txid:</span>
                  <span className="font-mono font-bold text-amber-500 truncate max-w-[200px]">{completedTxid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Protection Status:</span>
                  <span className="font-bold text-emerald-500">Payment Authorized & Order Protected</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md"
              >
                View Order in Buyer Dashboard
              </button>
            </div>
          )}

          {/* STEP 4: FAILED */}
          {paymentStep === 'failed' && (
            <div className="py-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 mx-auto flex items-center justify-center">
                <AlertCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-slate-100">Payment Failed or Cancelled</h4>
                <p className="text-xs text-red-500 font-semibold mt-1">{errorMessage}</p>
              </div>

              <button
                onClick={() => setPaymentStep('review')}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
