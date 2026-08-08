import React, { useState } from 'react';
import { 
  Package, 
  Download, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  Key, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Zap,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Order, Product } from '../types';

interface BuyerDashboardProps {
  orders: Order[];
  onConfirmReceipt: (orderId: string) => void;
  onOpenMessage: (recipientUsername: string, orderId?: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenPstpShield?: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  orders,
  onConfirmReceipt,
  onOpenMessage,
  onSelectProduct,
  onOpenPstpShield
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'digital_vault' | 'escrow_ledger'>('orders');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Payment Verified</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 text-xs font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Order Delivered</span>
          </span>
        );
      case 'released':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Order Completed & Settled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/30 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const digitalItems = orders.flatMap((o) => o.digitalDeliveries || []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Dashboard Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Pioneer Buyer Portal</span>
          <h1 className="text-2xl font-black text-white mt-1">My Orders & Order Protection</h1>
          <p className="text-xs text-slate-300 mt-1">Track physical shipments, unlock digital keys, and manage order verification logs securely.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] text-purple-200 uppercase font-semibold">Active Orders</div>
            <div className="text-lg font-black text-amber-300">{orders.length}</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] text-purple-200 uppercase font-semibold">Digital Keys</div>
            <div className="text-lg font-black text-emerald-400">{digitalItems.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('digital_vault')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'digital_vault'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Digital Keys & Downloads ({digitalItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow_ledger')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'escrow_ledger'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Pi Order Protection Ledger</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">No purchase orders found</p>
              <p className="text-xs text-slate-400">Explore PiNova Global Marketplace to start your first Pi order!</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Order Top Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100">{order.id}</span>
                      <span className="text-xs text-slate-400">({new Date(order.createdAt).toLocaleDateString()})</span>
                      {order.pstpStatus && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-wide">
                          PSTP: {order.pstpStatus}
                        </span>
                      )}
                    </div>
                    {order.piTxid && (
                      <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs mt-0.5">
                        Txid: {order.piTxid}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.escrowStatus)}
                    <span className="font-black text-amber-500 text-lg">{order.totalPi.toFixed(2)} π</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.product.title}</h4>
                          <p className="text-[11px] text-slate-400">
                            Seller: <span className="font-semibold text-purple-600 dark:text-purple-400">{item.product.sellerName}</span> • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenMessage(item.product.sellerName, order.id)}
                        className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-purple-600 text-xs font-semibold flex items-center gap-1"
                        title="Contact Vendor"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Message Seller</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tracking & Escrow Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {order.trackingNumber ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <Truck className="w-4 h-4 text-indigo-500" />
                      <span>Carrier: <strong>{order.carrier}</strong> | Tracking: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{order.trackingNumber}</strong></span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No physical tracking number required (Digital or In-Process)</div>
                  )}

                  {/* Escrow Release & PSTP Action Buttons */}
                  <div className="flex items-center gap-2">
                    {onOpenPstpShield && (
                      <button
                        onClick={onOpenPstpShield}
                        className="px-3.5 py-2 rounded-xl bg-purple-950 text-purple-200 border border-purple-700/60 hover:bg-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>PSTP Inspector & Dispute</span>
                      </button>
                    )}

                    {order.escrowStatus !== 'released' && (
                      <button
                        onClick={() => onConfirmReceipt(order.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm Receipt & Complete Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* DIGITAL VAULT TAB */}
      {activeTab === 'digital_vault' && (
        <div className="space-y-4">
          {digitalItems.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Key className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Digital Vault Empty</p>
              <p className="text-xs text-slate-400">Purchased e-books, SaaS code kits, gift card PINs, and utility tokens appear here instantly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {digitalItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Key className="w-4 h-4" />
                    <span>Digital License / Delivery Key</span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">{item.title}</h4>

                  <div className="p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 flex items-center justify-between">
                    <span className="truncate max-w-[240px] font-bold">{item.codeOrUrl}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.codeOrUrl)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-sans text-[10px] font-bold hover:bg-emerald-500/30"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PI ESCROW LEDGER TAB */}
      {activeTab === 'escrow_ledger' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Official Pi Blockchain Order Protection Verification Logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Txid</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{o.id}</td>
                    <td className="p-3 font-mono text-purple-600 dark:text-purple-400">{o.piPaymentId || 'N/A'}</td>
                    <td className="p-3 font-mono text-amber-500 truncate max-w-[150px]">{o.piTxid || 'N/A'}</td>
                    <td className="p-3 font-black text-slate-900 dark:text-slate-100">{o.totalPi.toFixed(2)} π</td>
                    <td className="p-3 font-bold text-emerald-500 capitalize">{o.escrowStatus.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
