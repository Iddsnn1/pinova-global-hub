import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Package, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../../types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateFulfillment: (orderId: string, trackingNumber: string, carrier: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateFulfillment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // State for updating fulfillment
  const [editingFulfillmentOrderId, setEditingFulfillmentOrderId] = useState<string | null>(null);
  const [carrierInput, setCarrierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyerUsername || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.pstpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveFulfillment = (orderId: string) => {
    if (!carrierInput.trim() || !trackingInput.trim()) return;
    onUpdateFulfillment(orderId, trackingInput.trim(), carrierInput.trim());
    setEditingFulfillmentOrderId(null);
    setCarrierInput('');
    setTrackingInput('');
  };

  return (
    <div className="space-y-6" id="seller-orders-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Customer Orders & Fulfillment
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track customer purchases, PSTP escrow status, and dispatch shipments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
            {orders.length} Authorized Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by ID or customer username..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="all">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-16 px-6 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {orders.length === 0 ? 'No store orders yet' : 'No matching orders found'}
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5">
            {orders.length === 0
              ? 'Authorized orders will appear here in real-time when customers buy your products on PiNova Marketplace.'
              : 'Try clearing your filter or searching for a different order ID.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isEditingFulfillment = editingFulfillmentOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-5 shadow-xs transition-all"
              >
                {/* Order Summary Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 font-mono text-xs font-bold">
                      ORD
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {order.id}
                        </span>
                        <span className="text-xs text-neutral-500">
                          by @{order.buyerUsername || 'pioneer'}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent transaction'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* PSTP Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      order.escrowStatus === 'released' || order.pstpStatus === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      PSTP: {order.escrowStatus || 'in_escrow'}
                    </span>

                    {/* Fulfillment Status */}
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {order.pstpStatus}
                    </span>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Items & Total preview */}
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {order.items?.length || 1} item(s):{' '}
                    </span>
                    {order.items?.map(i => `${i.product.title} (x${i.quantity})`).join(', ') || 'Marketplace items'}
                  </div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 shrink-0">
                    Total: {order.totalPi?.toFixed(2)} π
                  </div>
                </div>

                {/* Tracking & Carrier Info */}
                {order.trackingNumber && (
                  <div className="mt-2 p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-neutral-600 dark:text-neutral-300">
                        Carrier: <strong className="text-neutral-900 dark:text-neutral-100">{order.carrier || 'Express'}</strong>
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-300 font-mono">
                        #{order.trackingNumber}
                      </span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      In Transit
                    </span>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        Line Items
                      </h5>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-neutral-400" />
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                {item.product.title}
                              </span>
                              <span className="text-neutral-500">
                                x {item.quantity}
                              </span>
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {(item.product.pricePi ? item.product.pricePi * item.quantity : 0).toFixed(2)} π
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment Action Form */}
                    {order.pstpStatus !== 'Delivered' && order.pstpStatus !== 'Completed' && (
                      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700">
                        {isEditingFulfillment ? (
                          <div className="space-y-3">
                            <h6 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                              Update Shipment Tracking
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={carrierInput}
                                onChange={(e) => setCarrierInput(e.target.value)}
                                placeholder="Carrier (e.g. DHL, FedEx, Local)"
                                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100"
                              />
                              <input
                                type="text"
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                placeholder="Tracking / Consignment Number"
                                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingFulfillmentOrderId(null)}
                                className="px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-600 text-xs text-neutral-600 dark:text-neutral-400"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveFulfillment(order.id)}
                                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                              >
                                Save & Mark Shipped
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">
                              Fulfillment status: <strong>{order.pstpStatus}</strong>
                            </span>
                            <button
                              onClick={() => {
                                setEditingFulfillmentOrderId(order.id);
                                setCarrierInput(order.carrier || '');
                                setTrackingInput(order.trackingNumber || '');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              {order.trackingNumber ? 'Edit Tracking' : 'Dispatch / Add Tracking'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
