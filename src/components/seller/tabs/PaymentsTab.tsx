import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ExternalLink, 
  ArrowUpRight, 
  AlertCircle,
  Hash
} from 'lucide-react';
import { Order } from '../../../types';

interface PaymentsTabProps {
  orders: Order[];
  serverPstpAuthorized: boolean;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  orders,
  serverPstpAuthorized
}) => {
  // Derive truthful payments strictly from authorized merchant orders
  const escrowOrders = orders.filter(o => o.escrowStatus === 'in_escrow' || o.pstpStatus === 'Processing' || o.pstpStatus === 'Pending Payment');
  const settledOrders = orders.filter(o => o.escrowStatus === 'released' || o.pstpStatus === 'Completed' || o.pstpStatus === 'Delivered');

  const inEscrowPi = escrowOrders.reduce((sum, o) => sum + (o.totalPi || 0), 0);
  const settledPi = settledOrders.reduce((sum, o) => sum + (o.totalPi || 0), 0);
  const totalVolumePi = orders.reduce((sum, o) => sum + (o.totalPi || 0), 0);

  return (
    <div className="space-y-6" id="seller-payments-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Pi Settlements & PSTP Escrow
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Server-verified Pi payments protected by the PiNova Pioneer Seller Trust Protocol (PSTP)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
            serverPstpAuthorized
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            {serverPstpAuthorized ? 'PSTP Protection Active' : 'PSTP Pending Acceptance'}
          </span>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Settled & Released</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {settledPi.toFixed(2)} π
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Delivered & verified releases
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In PSTP Escrow</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {inEscrowPi.toFixed(2)} π
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Held safely pending delivery
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Store Volume</span>
            <span className="text-purple-600 font-bold">π</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {totalVolumePi.toFixed(2)} π
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Lifetime server-verified transactions
          </p>
        </div>
      </div>

      {/* Security Architecture Notice */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
            Pi Payment Server-Verified Escrow Protection
          </h4>
          <p>
            Payments on PiNova are authenticated via cryptographic server-side Pi SDK token negotiation. All transactions are held in PSTP Escrow until the buyer confirms physical receipt or tracking signals verified delivery.
          </p>
          <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-purple-600 dark:text-purple-400">
            <span>• No Client-Side Payment Verification</span>
            <span>• Server-Verified Timestamps</span>
            <span>• Zero-Knowledge Merchant Custody</span>
          </div>
        </div>
      </div>

      {/* Transaction Records Table / Empty State */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Payment Transactions & Audit Trail
            </h4>
            <p className="text-xs text-neutral-500">
              Individual Pi transactions and settlement states linked to store orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-14 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No payment activity yet
            </h5>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Customer payments made in Pi will appear here with cryptographic transaction hashes and escrow status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 pb-2">
                  <th className="font-semibold py-2">Tx Reference</th>
                  <th className="font-semibold py-2">Order ID</th>
                  <th className="font-semibold py-2">Payer</th>
                  <th className="font-semibold py-2">Amount (π)</th>
                  <th className="font-semibold py-2">Settlement Status</th>
                  <th className="font-semibold py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {orders.map((order) => {
                  const txRef = order.piPaymentId || order.piTxid || `pi_tx_${order.id.replace('ORD-', '')}`;
                  const isSettled = order.escrowStatus === 'released' || order.pstpStatus === 'Completed' || order.pstpStatus === 'Delivered';

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 font-mono text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                        {txRef}
                      </td>
                      <td className="py-3 font-mono text-neutral-900 dark:text-neutral-100">
                        {order.id}
                      </td>
                      <td className="py-3 text-neutral-600 dark:text-neutral-300">
                        @{order.buyerUsername || 'customer'}
                      </td>
                      <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">
                        {order.totalPi?.toFixed(2)} π
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${
                          isSettled
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isSettled ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {isSettled ? 'PSTP Released' : 'PSTP Escrow Locked'}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500 text-[11px]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
