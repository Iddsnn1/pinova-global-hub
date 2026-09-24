import React, { useMemo } from 'react';
import { formatPiAmount } from '../../../utils/formatters';
import { TrendingUp, BarChart3, Calendar, ShieldCheck } from 'lucide-react';
import { Order, Product } from '../../../types';

interface SalesAnalyticsTabProps {
  orders: Order[];
  products: Product[];
}

export const SalesAnalyticsTab: React.FC<SalesAnalyticsTabProps> = ({ orders }) => {
  const metrics = useMemo(() => {
    let totalVolumePi = 0;
    let settledVolumePi = 0;
    let inEscrowVolumePi = 0;
    let settledCount = 0;
    let escrowCount = 0;

    orders.forEach((order) => {
      const amount = Number.isFinite(order.totalPi) ? order.totalPi : 0;
      totalVolumePi += amount;

      const isSettled =
        order.pstpStatus === 'Completed' ||
        order.escrowStatus === 'released';

      if (isSettled) {
        settledVolumePi += amount;
        settledCount += 1;
      } else if (order.escrowStatus === 'in_escrow') {
        inEscrowVolumePi += amount;
        escrowCount += 1;
      }
    });

    return {
      totalVolumePi,
      settledVolumePi,
      inEscrowVolumePi,
      settledCount,
      escrowCount,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? totalVolumePi / orders.length : 0,
    };
  }, [orders]);

  const settlementRate =
    metrics.totalOrders > 0
      ? (metrics.settledCount / metrics.totalOrders) * 100
      : 0;

  return (
    <div className="space-y-6" id="sales-analytics-tab">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                PSTP Business Intelligence
              </span>
              <span className="text-xs text-neutral-400 font-mono">Server-derived</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Sales Analytics
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Order volume, escrow state, and settlement metrics derived from the merchant order data.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Lifetime Activity</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Recorded Order Volume</span>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {formatPiAmount(metrics.totalVolumePi, { minDecimals: 2 })} <span className="text-purple-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Across {metrics.totalOrders} recorded orders
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Settled & Released</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPiAmount(metrics.settledVolumePi, { minDecimals: 2 })} <span className="text-emerald-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {metrics.settledCount} settled orders
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">In Escrow (Locked)</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatPiAmount(metrics.inEscrowVolumePi, { minDecimals: 2 })} <span className="text-amber-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            {metrics.escrowCount} orders currently in escrow
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-neutral-500 block">Average Order Value</span>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {formatPiAmount(metrics.averageOrderValue, { minDecimals: 2 })} <span className="text-purple-600 text-sm font-semibold">π</span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Per recorded order
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Fulfillment & Settlement Performance
        </h3>

        {orders.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <BarChart3 className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              No sales data yet.
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              Analytics will appear as real orders are recorded for your store.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-neutral-700 dark:text-neutral-300">Settlement Rate</span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  {settlementRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.min(100, settlementRate)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                <span>{metrics.settledCount} settled/released</span>
                <span>{metrics.escrowCount} currently in escrow</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Metrics are derived from the merchant order records; no synthetic sales are added.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
