import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Order } from '../../../types';

interface PaymentsTabProps {
  orders: Order[];
  serverPstpAuthorized: boolean;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ orders, serverPstpAuthorized }) => {
  const escrowOrders = orders.filter(
    (order) => order.escrowStatus === 'in_escrow'
  );
  const settledOrders = orders.filter(
    (order) => order.escrowStatus === 'released' || order.pstpStatus === 'Completed'
  );

  const inEscrowPi = escrowOrders.reduce((sum, order) => sum + (order.totalPi || 0), 0);
  const settledPi = settledOrders.reduce((sum, order) => sum + (order.totalPi || 0), 0);
  const totalVolumePi = orders.reduce((sum, order) => sum + (order.totalPi || 0), 0);

  return (
    <div className="space-y-6" id="seller-payments-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Pi Settlements & PSTP Escrow
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Merchant payment activity derived from authorized order records.
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
          serverPstpAuthorized
            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {serverPstpAuthorized ? 'PSTP Protection Active' : 'PSTP Pending Acceptance'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Settled & Released</span>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{settledPi.toFixed(2)} π</div>
          <p className="text-xs text-neutral-500 mt-1">{settledOrders.length} released/settled orders</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">In PSTP Escrow</span>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{inEscrowPi.toFixed(2)} π</div>
          <p className="text-xs text-neutral-500 mt-1">{escrowOrders.length} orders currently in escrow</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Recorded Store Volume</span>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{totalVolumePi.toFixed(2)} π</div>
          <p className="text-xs text-neutral-500 mt-1">{orders.length} recorded orders</p>
        </div>
      </div>

      <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-1" />
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Pi Payment Server-Verified Escrow Protection</h4>
          <p className="mt-1">
            This view does not create or verify payments. It displays payment and escrow state already recorded for the merchant orders.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Payment Transactions & Audit Trail</h4>
        <p className="text-xs text-neutral-500 mt-1">Pi transaction references and settlement states linked to store orders.</p>

        {orders.length === 0 ? (
          <div className="py-14 px-4 text-center">
            <CreditCard className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No payment activity yet</h5>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">Payment records will appear here when real orders exist.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
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
                  const txRef = order.piPaymentId || order.piTxid;
                  const isSettled = order.escrowStatus === 'released' || order.pstpStatus === 'Completed';

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 font-mono text-[11px] text-purple-600 dark:text-purple-400">{txRef || 'Not recorded'}</td>
                      <td className="py-3 font-mono text-neutral-900 dark:text-neutral-100">{order.id}</td>
                      <td className="py-3 text-neutral-600 dark:text-neutral-300">{order.buyerUsername ? `@${order.buyerUsername}` : 'Unknown payer'}</td>
                      <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">{(order.totalPi || 0).toFixed(2)} π</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${
                          isSettled
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isSettled ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {isSettled ? 'PSTP Released' : 'PSTP State Recorded'}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500 text-[11px]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Not recorded'}
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
