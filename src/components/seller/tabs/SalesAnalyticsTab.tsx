import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  BarChart3, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { Order, Product } from '../../../types';

interface SalesAnalyticsTabProps {
  orders: Order[];
  products: Product[];
}

export const SalesAnalyticsTab: React.FC<SalesAnalyticsTabProps> = ({
  orders,
  products
}) => {
  // Authoritative calculations from real state
  const metrics = useMemo(() => {
    let totalVolumePi = 0;
    let completedVolumePi = 0;
    let inEscrowVolumePi = 0;
    let completedCount = 0;
    let pendingCount = 0;

    orders.forEach(order => {
      const amount = order.totalPi || 0;
      totalVolumePi += amount;

      if (order.pstpStatus === 'Completed' || order.pstpStatus === 'Delivered' || order.escrowStatus === 'released') {
        completedVolumePi += amount;
        completedCount++;
      } else if (order.pstpStatus === 'Processing' || order.pstpStatus === 'Pending Payment' || order.escrowStatus === 'in_escrow') {
        inEscrowVolumePi += amount;
        pendingCount++;
      }
    });

    const averageOrderValue = orders.length > 0 ? (totalVolumePi / orders.length) : 0;

    return {
      totalVolumePi,
      completedVolumePi,
      inEscrowVolumePi,
      completedCount,
      pendingCount,
      totalOrders: orders.length,
      averageOrderValue
    };
  }, [orders]);

  return (
    <div className="space-y-6" id="sales-analytics-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                PSTP Business Intelligence
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Authoritative Ledger
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Sales Analytics
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Verified transaction volume, escrow settlement metrics, and buyer fulfillment performance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Lifetime Activity</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Derived strictly from real state) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Total Volume</span>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {metrics.totalVolumePi.toFixed(2)} <span className="text-purple-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Across {metrics.totalOrders} total orders
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Settled & Released</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.completedVolumePi.toFixed(2)} <span className="text-emerald-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {metrics.completedCount} fulfilled orders
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">In Escrow (Locked)</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {metrics.inEscrowVolumePi.toFixed(2)} <span className="text-amber-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {metrics.pendingCount} pending fulfillment
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Avg Order Value</span>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {metrics.averageOrderValue.toFixed(2)} <span className="text-purple-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Per verified transaction
          </span>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Fulfillment Performance & Order Breakdown
        </h3>

        {orders.length === 0 ? (
          /* Truthful Empty State */
          <div className="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <BarChart3 className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              No sales data yet.
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              Analytics will appear as verified transactions occur on your storefront. All transaction numbers reflect real blockchain & PSTP escrow settlements.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-700 dark:text-neutral-300">Escrow Settlement Rate</span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  {((metrics.completedCount / orders.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(metrics.completedCount / orders.length) * 100}%` }}
                />
                <div 
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(metrics.pendingCount / orders.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Fulfilled & Released ({metrics.completedCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  In Escrow ({metrics.pendingCount})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
