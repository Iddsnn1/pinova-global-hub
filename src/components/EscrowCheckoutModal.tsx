import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Loader2, AlertCircle, ArrowRight, Smartphone, MapPin, Truck } from 'lucide-react';
import { OrderItem, CartItem, Coupon } from '../types';
import { executePiPayment, authenticatePiUser } from '../lib/piSdk';

interface EscrowCheckoutModalProps {
  cartItems: OrderItem[];
  appliedCoupon?: Coupon;
  shippingCountry: string;
  onClose: () => void;
  onPaymentSuccess: (newOrderData: any) => void;
  userUsername: string;
  onTrackOrder?: (orderId: string) => void;
}

export const EscrowCheckoutModal: React.FC<EscrowCheckoutModalProps> = ({
  cartItems,
  appliedCoupon,
  shippingCountry,
  onClose,
  onPaymentSuccess,
  userUsername,
  onTrackOrder
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
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getItemUnitPrice = (item: CartItem): number => {
    const basePrice = item.product.discountPercent
      ? item.product.pricePi * (1 - item.product.discountPercent / 100)
      : item.product.pricePi;
    const delta = item.customDetails?.variant?.priceDeltaPi || 0;
    return basePrice + delta;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + getItemUnitPrice(item) * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const isPhysicalOrder = cartItems.some((i) => i.product.category === 'physical');
  const shippingCost = isPhysicalOrder ? 2.50 : 0;
  const totalAmountPi = subtotal - discountAmount + shippingCost;

  const addLog = (msg: string) => {
    setStatusLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleStartPayment = async () => {
    setPaymentStep('processing');
    setStatusLogs([]);
    setErrorMessage('');

    try {
      addLog('Authenticating user with Pi Network...');
      const authUser = await authenticatePiUser();
      addLog(`Authenticated as ${authUser.username}`);
    } catch (authErr: any) {
      const errMsg = authErr?.message || String(authErr);
      setPaymentStep('failed');
      setErrorMessage(`Pi Authentication failed: ${errMsg}`);
      addLog(`Authentication error: ${errMsg}`);
      return;
    }

    const memo = `PiNova Purchase (${cartItems.length} items) - Order by ${userUsername}`;
    const generatedOrderId = `ORD-PI-${Date.now().toString().slice(-6)}`;
    setCreatedOrderId(generatedOrderId);

    const metadata = {
      orderId: generatedOrderId,
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

          const hasServiceOrder = cartItems.some((i) => i.product.category === 'service');

          const newOrder = {
            id: metadata.orderId,
            buyerUsername: userUsername,
            items: cartItems,
            totalPi: Number(totalAmountPi.toFixed(2)),
            escrowStatus: isPhysicalOrder ? 'in_escrow' : (hasServiceOrder ? 'in_escrow' : 'released'),
            piPaymentId: paymentId,
            piTxid: txid,
            pstpStatus: isPhysicalOrder ? 'Payment Verified' : (hasServiceOrder ? 'Payment Verified' : 'Completed'),
            serverVerified: true,
            shippingAddress: isPhysicalOrder ? shippingAddress : undefined,
            digitalDeliveries: digitalDeliveries.length > 0 ? digitalDeliveries : undefined,
            carrier: isPhysicalOrder ? 'Global Tracked Express Carrier' : (hasServiceOrder ? 'PSTP Remote Service Gateway' : 'Digital Direct Gateway'),
            trackingNumber: isPhysicalOrder ? `PNV-TRK-${Math.floor(100000 + Math.random() * 900000)}` : (hasServiceOrder ? `SRV-${Math.floor(10000 + Math.random() * 90000)}` : undefined),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: [
              {
                status: 'Pending Payment',
                timestamp: new Date(Date.now() - 3000).toISOString(),
                actor: userUsername,
                actorRole: 'buyer',
                note: 'Order initiated and payment created in Pi Browser SDK.'
              },
              {
                status: 'Payment Verified',
                timestamp: new Date().toISOString(),
                actor: 'PSTP_Protection_Server',
                actorRole: 'system',
                note: 'Payment authorized and verified server-side via Pi Platform API.'
              },
              ...(isPhysicalOrder || hasServiceOrder ? [] : [
                {
                  status: 'Completed',
                  timestamp: new Date().toISOString(),
                  actor: cartItems[0]?.product.sellerName || 'Merchant',
                  actorRole: 'seller',
                  note: 'Digital assets and license tokens released to buyer vault.'
                }
              ])
            ]
          };

          onPaymentSuccess(newOrder);
        },
        onError: (err) => {
          setPaymentStep('failed');
          setErrorMessage(err.message || 'Payment execution failed in Pi SDK.');
          addLog(`Error: ${err.message}`);
        },
        onCancel: (paymentId) => {
          setPaymentStep('failed');
          setErrorMessage('Payment cancelled by user in Pi Browser.');
          addLog(`Cancelled payment ID: ${paymentId}`);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">PSTP Order Protection & Checkout</h3>
              <p className="text-[11px] text-slate-500">Non-Custodial Pi Escrow Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: REVIEW */}
          {paymentStep === 'review' && (
            <>
              {/* Order Items Summary */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Summary ({cartItems.length} items)</div>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pt-1.5 first:pt-0">
                      <div className="truncate max-w-[240px]">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{item.product.title}</span>
                        {item.customDetails?.variant && (
                          <span className="text-[10px] text-purple-500 font-semibold block truncate">
                            ({item.customDetails.variant.title})
                          </span>
                        )}
                        <span className="text-slate-500 ml-1">x{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {(getItemUnitPrice(item) * item.quantity).toFixed(2)} π
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Shipping Address Input */}
              {isPhysicalOrder && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>Shipping Destination Address</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="col-span-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Payment authorized and verified via official Pi Network platform. Your order is protected by PiNova Order Protection.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Order ID:</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{createdOrderId}</span>
                </div>
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
                onClick={() => {
                  onClose();
                  if (onTrackOrder && createdOrderId) {
                    onTrackOrder(createdOrderId);
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track This Order in Hub</span>
                <ArrowRight className="w-4 h-4" />
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
