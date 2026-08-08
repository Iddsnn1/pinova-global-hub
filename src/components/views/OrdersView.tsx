import React, { useState } from 'react';
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
  Barcode
} from 'lucide-react';
import { Order, UserRole } from '../../types';
import { BuyerOrderHub } from '../orders/BuyerOrderHub';
import { SellerFulfillmentCenter } from '../orders/SellerFulfillmentCenter';

interface OrdersViewProps {
  orders: Order[];
  currentUserRole: UserRole;
  currentUsername: string;
  onUpdateOrderStatus: (orderId: string, newStatus: any, note?: string) => void;
  onConfirmReceipt: (orderId: string) => void;
  onRequestReturn: (orderId: string, reason: string) => void;
  onOpenDispute: (orderId: string, statement: string) => void;
  onResolveDispute: (orderId: string, resolution: 'buyer_refund' | 'seller_payout', note: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  currentUserRole,
  currentUsername,
  onUpdateOrderStatus,
  onConfirmReceipt,
  onRequestReturn,
  onOpenDispute,
  onResolveDispute
}) => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'admin' | 'audit'>('buyer');
  const [searchFilter, setSearchFilter] = useState('');

  // Sample Audit Logs generated from order lifecycle events
  const auditLogs = orders.flatMap((ord) => 
    ord.timeline.map((tl, idx) => ({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-purple-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Module 4 — Unified Order Management & Fulfillment Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Order Fulfillment & Compliance Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track live carrier logistics, reveal digital keys, print digital receipts, manage returns, and review immutable PSTP audit trail records.
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
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Buyer Order Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('seller')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seller'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
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
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
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
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-emerald-400" />
          <span>Immutable Audit Logs</span>
        </button>
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'buyer' && (
        <BuyerOrderHub
          orders={orders}
          onConfirmReceipt={onConfirmReceipt}
          onRequestReturn={onRequestReturn}
          onOpenDispute={onOpenDispute}
        />
      )}

      {activeTab === 'seller' && (
        <SellerFulfillmentCenter
          orders={orders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      )}

      {activeTab === 'admin' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Platform Order Audit & Dispute Arbitration Panel</span>
            </h2>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Order ID: {ord.id}
                    </div>
                    <div className="text-slate-500">
                      Buyer: {ord.buyerUsername} | Status: <span className="font-extrabold text-purple-400">{ord.pstpStatus}</span>
                    </div>
                    <div className="text-amber-500 font-black mt-0.5">
                      Total: {ord.totalPi.toFixed(2)} π
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onResolveDispute(ord.id, 'buyer_refund', 'Approved buyer refund after dispute review.')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
                    >
                      Approve Buyer Refund
                    </button>
                    <button
                      onClick={() => onResolveDispute(ord.id, 'seller_payout', 'Approved seller payout after fulfillment verification.')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                    >
                      Release Seller Funds
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-500" />
            <span>Immutable Lifecycle Audit Trail Records</span>
          </h2>

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
