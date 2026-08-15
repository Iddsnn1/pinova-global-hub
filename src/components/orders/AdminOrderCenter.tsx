import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Filter, 
  Gavel, 
  DollarSign, 
  Truck, 
  User, 
  ShieldAlert,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { Order, PstpOrderStatus, Dispute, AuditLogEntry } from '../../types';
import { OrderOrchestrationService } from '../../modules/orders';

interface AdminOrderCenterProps {
  orders: Order[];
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const AdminOrderCenter: React.FC<AdminOrderCenterProps> = ({
  orders = [],
  onOrderUpdated
}) => {
  const service = new OrderOrchestrationService();
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [activeTab, setActiveTab] = useState<'all_orders' | 'disputes' | 'audit_timeline' | 'fulfillment_analytics'>('all_orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(safeOrders[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dispute Arbitration Form State
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('DISP-01');
  const [arbitrationDecision, setArbitrationDecision] = useState<'full_refund' | 'partial_refund' | 'release_seller' | 'dismiss'>('full_refund');
  const [arbitrationNote, setArbitrationNote] = useState('');
  const [arbitrationSuccessMsg, setArbitrationSuccessMsg] = useState('');

  const disputes = service.disputeManager.getDisputes();

  const filteredOrders = safeOrders.filter((o) => {
    const matchesSearch = (o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.buyerUsername || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.items || []).some(i => (i.product?.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && o.pstpStatus === statusFilter;
  });

  const activeOrder = selectedOrder || safeOrders[0];

  const handleAdminOverrideStatus = (nextStatus: PstpOrderStatus) => {
    if (!activeOrder) return;
    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      nextStatus,
      'SystemAdmin',
      'admin',
      'Administrator manual lifecycle override execution.'
    );
    setSelectedOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const resolved = service.disputeManager.resolveDisputeByAdmin(
      selectedDisputeId,
      arbitrationDecision,
      arbitrationNote,
      'PlatformAdmin'
    );
    if (resolved && activeOrder) {
      const nextStatus: PstpOrderStatus = arbitrationDecision === 'release_seller' ? 'Completed' : 'Refunded';
      const { updatedOrder } = service.lifecycleManager.transitionState(
        activeOrder,
        nextStatus,
        'PlatformAdmin',
        'admin',
        `Dispute resolved with decision: ${arbitrationDecision}. Note: ${arbitrationNote}`
      );
      setSelectedOrder(updatedOrder);
      if (onOrderUpdated) onOrderUpdated(updatedOrder);
    }
    setArbitrationSuccessMsg(`Dispute ${selectedDisputeId} resolved successfully. Ruling recorded in append-only audit log.`);
    setArbitrationNote('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-4">
      {/* Header */}
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Admin Order Control & Arbitration Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                PSTP Governance
              </span>
            </h2>
            <p className="text-xs text-slate-400">Monitor all platform orders, inspect state timelines, arbitrate disputes, and approve refunds.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 px-5 pt-3 overflow-x-auto bg-slate-50 dark:bg-slate-950">
        <button
          onClick={() => setActiveTab('all_orders')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'all_orders' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Global Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'disputes' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Gavel className="w-4 h-4 text-red-500" />
          <span>Dispute Arbitration</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_timeline')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'audit_timeline' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Audit Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('fulfillment_analytics')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'fulfillment_analytics' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Fulfillment Analytics</span>
        </button>
      </div>

      {/* TAB 1: ALL GLOBAL ORDERS */}
      {activeTab === 'all_orders' && (
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Left Column: Filterable Order List */}
          <div className="md:col-span-5 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Order ID, buyer, or product..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="all">All States (18 PSTP Stages)</option>
                <option value="Payment Verified">Payment Verified</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
                <option value="Disputed">Disputed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
              Platform Orders ({filteredOrders.length})
            </div>

            {filteredOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeOrder && o.id === activeOrder.id
                    ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/30 dark:border-purple-800 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">#{o.id.slice(0, 8)}</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{o.totalPi.toFixed(2)} Pi</span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                  Buyer: {o.buyerUsername} • Seller: {o.items[0]?.product.sellerName}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {o.pstpStatus}
                  </span>
                  <span className="text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Order Administrative Control Panel */}
          {activeOrder && (
            <div className="md:col-span-7 p-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">Order ID #{activeOrder.id}</div>
                  <div className="text-sm font-bold flex items-center gap-2 mt-0.5">
                    <span>Stage:</span>
                    <span className="text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded text-xs border border-purple-400/20 font-bold">
                      {activeOrder.pstpStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-400">Volume</div>
                  <div className="text-base font-extrabold text-purple-400">{activeOrder.totalPi.toFixed(2)} Pi</div>
                </div>
              </div>

              {/* Admin Override Action Bar */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Admin Lifecycle Override
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleAdminOverrideStatus('Order Confirmed')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => handleAdminOverrideStatus('Shipped')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                  >
                    Set Shipped
                  </button>
                  <button
                    onClick={() => handleAdminOverrideStatus('Completed')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                  >
                    Force Complete
                  </button>
                  <button
                    onClick={() => handleAdminOverrideStatus('Refunded')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                  >
                    Authorize Refund
                  </button>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">Purchased Items</div>
                {activeOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{i.product.title}</div>
                      <div className="text-[11px] text-slate-500">Qty: {i.quantity} • Vendor: {i.product.sellerName}</div>
                    </div>
                    <div className="font-bold text-purple-600">{i.product.pricePi * i.quantity} Pi</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISPUTE ARBITRATION */}
      {activeTab === 'disputes' && (
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-sm font-bold">PiNova Dispute Arbitration Portal</h3>
                <p className="text-xs text-slate-400">Arbitrate buyer-seller disputes and issue non-custodial protocol refunds.</p>
              </div>
            </div>
          </div>

          {arbitrationSuccessMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {arbitrationSuccessMsg}
            </div>
          )}

          <form onSubmit={handleResolveDispute} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200">Executive Ruling & Settlement</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Target Dispute</label>
                <select
                  value={selectedDisputeId}
                  onChange={(e) => setSelectedDisputeId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="DISP-01">DISP-01: Item Damaged in Transit (Order #ord-101)</option>
                  <option value="DISP-02">DISP-02: Non-delivery of Digital License (Order #ord-102)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Arbitration Decision</label>
                <select
                  value={arbitrationDecision}
                  onChange={(e) => setArbitrationDecision(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="full_refund">Full Refund to Buyer (100% Return)</option>
                  <option value="partial_refund">Partial Refund (50% Compromise)</option>
                  <option value="release_seller">Release Funds to Seller (Dismiss Dispute)</option>
                  <option value="dismiss">Dismiss Case (Invalid Evidence)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Arbitration Justification Note</label>
              <textarea
                required
                rows={3}
                value={arbitrationNote}
                onChange={(e) => setArbitrationNote(e.target.value)}
                placeholder="Enter justification for the audit trail..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-sm transition-colors"
            >
              Execute Binding Ruling
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: AUDIT TIMELINE */}
      {activeTab === 'audit_timeline' && activeOrder && (
        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Append-only Status Transition Logs for Order #{activeOrder.id}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              A server-side chronological record of order lifecycle events. Historical events are not edited or removed through normal application workflows.
            </p>
          </div>
          <div className="space-y-3 border-l-2 border-purple-500/40 pl-4 py-1">
            {(activeOrder.timeline || []).map((tl, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600" />
                <div className="font-bold text-slate-900 dark:text-slate-100">{tl.status}</div>
                <div className="text-[11px] text-slate-500">
                  By {tl.actor} ({tl.actorRole}) • {new Date(tl.timestamp).toLocaleString()}
                </div>
                {tl.note && <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">{tl.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FULFILLMENT ANALYTICS */}
      {activeTab === 'fulfillment_analytics' && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-xs text-slate-500">Avg. Fulfillment SLA</div>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">4.2 Hours</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ 18% Faster than Target</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-xs text-slate-500">Successful Delivery Rate</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">99.4%</div>
              <div className="text-[10px] text-slate-400 mt-1">Over 1,240 Executed Orders</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-xs text-slate-500">Dispute Ratio</div>
              <div className="text-2xl font-extrabold text-amber-500 mt-1">0.12%</div>
              <div className="text-[10px] text-slate-400 mt-1">Below Enterprise Threshold</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
