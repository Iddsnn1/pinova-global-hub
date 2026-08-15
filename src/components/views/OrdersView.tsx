import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Key, 
  FileText, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Printer, 
  Download, 
  Copy, 
  User, 
  Store, 
  ShieldAlert,
  History,
  Barcode,
  Package
} from 'lucide-react';
import { Order, UserRole } from '../../types';
import { BuyerOrderHub } from '../orders/BuyerOrderHub';
import { SellerFulfillmentCenter } from '../orders/SellerFulfillmentCenter';
import { AdminOrderCenter } from '../orders/AdminOrderCenter';

interface OrdersViewProps {
  orders: Order[];
  currentUserRole: UserRole;
  currentUsername: string;
  initialOrderId?: string;
  initialSubTab?: 'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute';
  onUpdateOrderStatus: (orderId: string, newStatus: any, note?: string) => void;
  onConfirmReceipt: (orderId: string) => void;
  onRequestReturn: (orderId: string, reason: string) => void;
  onOpenDispute: (orderId: string, statement: string) => void;
  onResolveDispute: (orderId: string, resolution: 'buyer_refund' | 'seller_payout', note: string) => void;
  onExploreMarketplace?: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  currentUserRole,
  currentUsername,
  initialOrderId,
  initialSubTab = 'tracking',
  onUpdateOrderStatus,
  onConfirmReceipt,
  onRequestReturn,
  onOpenDispute,
  onResolveDispute,
  onExploreMarketplace,
  onOrderUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'admin' | 'audit'>('buyer');

  // Switch to buyer tracking if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId) {
      setActiveTab('buyer');
    }
  }, [initialOrderId]);

  // Sample Audit Logs generated from order lifecycle events
  const auditLogs = orders.flatMap((ord) => 
    (ord.timeline || []).map((tl, idx) => ({
      id: `AUDIT-${ord.id}-${idx}`,
      orderId: ord.id,
      status: tl.status,
      timestamp: tl.timestamp,
      actor: tl.actor,
      actorRole: tl.actorRole,
      note: tl.note
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-purple-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PiNova Global Hub — Track Order & Order Lifecycle Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Order Tracking & Lifecycle Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Live carrier tracking, cryptographic Pi blockchain verification, instant digital license reveals, official printable receipts, returns, and dispute arbitration.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('buyer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'buyer'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Track Order & Buyer Hub ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seller')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seller'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Seller Fulfillment Center</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'admin'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Admin & Dispute Arbitration</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <History className="w-4 h-4 text-emerald-400" />
          <span>Append-only Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'buyer' && (
        <BuyerOrderHub
          orders={orders}
          buyerUsername={currentUsername}
          initialOrderId={initialOrderId}
          initialTab={initialSubTab}
          onConfirmReceipt={onConfirmReceipt}
          onRequestReturn={onRequestReturn}
          onOpenDispute={onOpenDispute}
          onExploreMarketplace={onExploreMarketplace}
          onOrderUpdated={onOrderUpdated}
        />
      )}

      {activeTab === 'seller' && (
        <SellerFulfillmentCenter
          orders={orders}
          sellerUsername={currentUsername || 'PiNova Store'}
          onOrderUpdated={onOrderUpdated}
        />
      )}

      {activeTab === 'admin' && (
        <AdminOrderCenter
          orders={orders}
          onOrderUpdated={onOrderUpdated}
        />
      )}

      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-500" />
                <span>Append-only Lifecycle Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A server-side chronological record of order lifecycle events. Historical events are not edited or removed through normal application workflows.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 shrink-0">{auditLogs.length} Recorded Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Audit Log ID</th>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor (Role)</th>
                  <th className="py-2.5 px-3">Transition Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 font-mono text-[11px]">
                    <td className="py-2.5 px-3 text-slate-400">{log.id}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-400">{log.orderId}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">{log.actor} ({log.actorRole})</td>
                    <td className="py-2.5 px-3 text-slate-300">{log.note}</td>
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
