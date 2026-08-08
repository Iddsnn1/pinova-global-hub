import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Barcode, 
  FileText, 
  RotateCcw, 
  AlertCircle, 
  ChevronRight, 
  Check, 
  MapPin, 
  User,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Order, PstpOrderStatus, ShippingLabel, FulfillmentRecord } from '../../types';
import { OrderOrchestrationService } from '../../modules/orders';

interface SellerFulfillmentCenterProps {
  orders: Order[];
  sellerUsername: string;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const SellerFulfillmentCenter: React.FC<SellerFulfillmentCenterProps> = ({
  orders,
  sellerUsername,
  onOrderUpdated
}) => {
  const service = new OrderOrchestrationService();

  // Filter orders that belong to this seller
  const sellerOrders = orders.filter((o) =>
    o.items.some((i) => i.product && (i.product.sellerName || '').toLowerCase() === (sellerUsername || '').toLowerCase()) || sellerUsername === 'PiNova Store'
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(sellerOrders[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'queue' | 'packing' | 'label' | 'tracking'>('queue');

  // Shipping Form State
  const [carrier, setCarrier] = useState('SAFARICOM');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [transitionNote, setTransitionNote] = useState('');

  const activeOrder = selectedOrder || sellerOrders[0];

  const filteredOrders = sellerOrders.filter((o) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return ['Payment Verified', 'Order Confirmed', 'Processing'].includes(o.pstpStatus);
    if (filterStatus === 'shipped') return ['Shipped', 'In Transit', 'Out for Delivery'].includes(o.pstpStatus);
    if (filterStatus === 'completed') return ['Delivered', 'Completed'].includes(o.pstpStatus);
    return true;
  });

  const handleUpdateStatus = (nextStatus: PstpOrderStatus) => {
    if (!activeOrder) return;
    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      nextStatus,
      sellerUsername,
      'seller',
      transitionNote || `Seller changed order status to ${nextStatus}`
    );
    if (trackingNumber && !updatedOrder.trackingNumber) {
      updatedOrder.trackingNumber = trackingNumber;
    }
    setSelectedOrder(updatedOrder);
    setTransitionNote('');
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  const handleGenerateLabel = () => {
    if (!activeOrder) return;
    const label = service.logisticsManager.generateShippingLabel(activeOrder, carrier);
    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      'Preparing Shipment',
      sellerUsername,
      'seller',
      `Generated shipping label with carrier ${label.carrier} and tracking number ${label.trackingNumber}`
    );
    updatedOrder.trackingNumber = label.trackingNumber;
    updatedOrder.carrier = label.carrier;
    setSelectedOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  if (!activeOrder) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Orders in Queue</h3>
        <p className="text-xs mt-1">There are no customer orders assigned to your storefront.</p>
      </div>
    );
  }

  const generatedLabel = service.logisticsManager.generateShippingLabel(activeOrder, carrier);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-4">
      {/* Header */}
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Seller Fulfillment & Dispatch Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                SLA Operational
              </span>
            </h2>
            <p className="text-xs text-slate-400">Process incoming orders, print packing slips, generate shipping labels, and update tracking.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Left Column: Order Queue */}
        <div className="md:col-span-4 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 max-h-[650px] overflow-y-auto">
          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-[11px]">
            {['all', 'pending', 'shipped', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Order Queue ({filteredOrders.length})
          </div>

          {filteredOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setActiveTab('queue');
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                o.id === activeOrder.id
                  ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">#{o.id.slice(0, 8)}</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{o.totalPi.toFixed(2)} Pi</span>
              </div>
              <div className="text-xs text-slate-500 line-clamp-1 mb-2">
                Buyer: {o.buyerUsername} • {o.items.map((i) => i.product.title).join(', ')}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {o.pstpStatus}
                </span>
                <span className="text-slate-400">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Order Processing Workspace */}
        <div className="md:col-span-8 p-5 space-y-5">
          {/* Active Order Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400">Customer Order #{activeOrder.id}</div>
              <div className="text-base font-bold flex items-center gap-2 mt-0.5">
                <span>Buyer: {activeOrder.buyerUsername}</span>
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs border border-amber-400/20">
                  {activeOrder.pstpStatus}
                </span>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-slate-400">Order Total</div>
              <div className="text-lg font-extrabold text-amber-400">{activeOrder.totalPi.toFixed(2)} Pi</div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('queue')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'queue' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>State Workflow</span>
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'packing' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Packing Slip</span>
            </button>
            <button
              onClick={() => setActiveTab('label')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'label' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Barcode className="w-4 h-4" />
              <span>Shipping Label & Barcode</span>
            </button>
          </div>

          {/* TAB 1: WORKFLOW & TRANSITIONS */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Advance Order Lifecycle State
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('Processing')}
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Set Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Preparing Shipment')}
                    className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Preparing Shipment
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Shipped')}
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Delivered')}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Mark Delivered
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Carrier & Tracking Details</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <option value="SAFARICOM">Safaricom Express Logistics</option>
                      <option value="DHL">DHL Express Global</option>
                      <option value="FEDEX">FedEx International</option>
                      <option value="LOCAL_COURIER">Local Pi Partner Courier</option>
                    </select>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter Tracking Number e.g. PNV-9981"
                      className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                  Items to Fulfill
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activeOrder.items.map((i, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{i.product.title}</div>
                        <div className="text-[11px] text-slate-500">SKU: {i.product.id} | Qty: {i.quantity}</div>
                      </div>
                      <div className="font-bold text-amber-600 dark:text-amber-400">
                        {(i.product.pricePi * i.quantity).toFixed(2)} Pi
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKING SLIP */}
          {activeTab === 'packing' && (
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Official Packing Slip</h3>
                  <p className="text-[11px] text-slate-500">Order Reference: #{activeOrder.id}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Packing Slip
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">SHIP TO:</span><br />
                  {activeOrder.shippingAddress ? (
                    <>
                      <div>{activeOrder.shippingAddress.fullName}</div>
                      <div>{activeOrder.shippingAddress.street}</div>
                      <div>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country}</div>
                    </>
                  ) : (
                    <div>Digital Fulfillment Target</div>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">FULFILLED BY:</span><br />
                  <div>{activeOrder.items[0]?.product.sellerName || sellerUsername}</div>
                  <div>PiNova Vendor Station Hub 04</div>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-200/50 dark:bg-slate-800 font-bold">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2 text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activeOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{it.product.title}</td>
                        <td className="p-2 text-center font-bold">{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SHIPPING LABEL & BARCODE */}
          {activeTab === 'label' && (
            <div className="space-y-4">
              <div className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-500" />
                    {generatedLabel.carrier}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-xs">PRIORITY LOGISTICS</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">FROM:</div>
                    <div className="font-bold">{generatedLabel.senderName}</div>
                    <div className="text-slate-500">{generatedLabel.senderAddress}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">TO:</div>
                    <div className="font-bold">{generatedLabel.recipientName}</div>
                    <div className="text-slate-500">{generatedLabel.recipientAddress}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-900 text-center rounded-lg space-y-1">
                  <div className="font-mono text-xl tracking-widest font-extrabold text-slate-900 dark:text-slate-100">
                    {generatedLabel.barcodeData}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">TRACKING #: {generatedLabel.trackingNumber}</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleGenerateLabel}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                  >
                    Confirm & Save Tracking Label
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Print Label
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
