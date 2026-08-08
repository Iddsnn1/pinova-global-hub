import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  FileText, 
  RotateCcw, 
  ShieldAlert, 
  Printer, 
  ExternalLink, 
  QrCode, 
  Key, 
  Search, 
  MapPin, 
  ChevronRight,
  X,
  Info
} from 'lucide-react';
import { Order, PstpOrderStatus, ReturnRequest, Dispute } from '../../types';
import { OrderOrchestrationService } from '../../modules/orders';

interface BuyerOrderHubProps {
  orders: Order[];
  buyerUsername: string;
  onClose?: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const BuyerOrderHub: React.FC<BuyerOrderHubProps> = ({
  orders,
  buyerUsername,
  onClose,
  onOrderUpdated
}) => {
  const service = new OrderOrchestrationService();
  const buyerOrders = orders.filter((o) => (o.buyerUsername || '').toLowerCase() === (buyerUsername || '').toLowerCase() || buyerUsername === 'DemoBuyer');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(buyerOrders[0] || null);
  const [activeTab, setActiveTab] = useState<'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute'>('details');
  
  // Return Form State
  const [returnReason, setReturnReason] = useState<ReturnRequest['reason']>('defective');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnSuccessNote, setReturnSuccessNote] = useState('');

  // Dispute Form State
  const [disputeReason, setDisputeReason] = useState('Item Not Received');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeSuccessNote, setDisputeSuccessNote] = useState('');

  // Print Receipt View Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const activeOrder = selectedOrder || buyerOrders[0];

  const handleConfirmReceipt = (order: Order) => {
    const { updatedOrder } = service.lifecycleManager.transitionState(
      order,
      'Completed',
      buyerUsername,
      'buyer',
      'Buyer explicitly confirmed order receipt and satisfied condition.'
    );
    setSelectedOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    service.returnRefundManager.createReturnRequest(
      activeOrder.id,
      buyerUsername,
      activeOrder.items[0]?.product.sellerName || 'Vendor',
      returnReason,
      returnDesc,
      activeOrder.totalPi
    );
    setReturnSuccessNote('Return request successfully filed and transmitted to the seller for review.');
    setReturnDesc('');
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    service.disputeManager.openDispute(
      activeOrder.id,
      buyerUsername,
      activeOrder.items[0]?.product.sellerName || 'Vendor',
      disputeReason,
      disputeDesc,
      activeOrder.totalPi
    );

    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      'Disputed',
      buyerUsername,
      'buyer',
      `Buyer raised official dispute: ${disputeReason}`
    );
    setSelectedOrder(updatedOrder);
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
    setDisputeSuccessNote('Official dispute opened. PiNova Arbitration Team and Seller have been notified.');
    setDisputeDesc('');
  };

  if (!activeOrder) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Orders Found</h3>
        <p className="text-xs mt-1">You haven't placed any marketplace orders yet.</p>
      </div>
    );
  }

  const milestones = service.logisticsManager.getDeliveryMilestones(activeOrder.trackingNumber || 'PNV-001');
  const receipt = service.receiptGenerator.generateReceipt(activeOrder);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-6xl w-full mx-auto my-4">
      {/* Header */}
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Buyer Order & Fulfillment Hub
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                PSTP Order Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">Track shipments, download digital assets, view receipts, or handle disputes.</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Left Column: Order List */}
        <div className="md:col-span-4 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 max-h-[600px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">My Orders ({buyerOrders.length})</div>
          {buyerOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setActiveTab('details');
                setReturnSuccessNote('');
                setDisputeSuccessNote('');
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                o.id === activeOrder.id
                  ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/40 dark:border-purple-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">#{o.id.slice(0, 8)}</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{o.totalPi.toFixed(2)} Pi</span>
              </div>
              <div className="text-xs text-slate-500 line-clamp-1 mb-2">
                {o.items.map((i) => i.product.title).join(', ')}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {o.pstpStatus}
                </span>
                <span className="text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Active Order Detailed Workspace */}
        <div className="md:col-span-8 p-5 space-y-5">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400">Order #{activeOrder.id}</div>
              <div className="text-base font-bold flex items-center gap-2 mt-0.5">
                <span>Status:</span>
                <span className="text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                  {activeOrder.pstpStatus}
                </span>
              </div>
            </div>
            {activeOrder.pstpStatus === 'Delivered' && (
              <button
                onClick={() => handleConfirmReceipt(activeOrder)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Receipt & Release Seller Funds
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'details' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Order Details</span>
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'tracking' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Live Tracking</span>
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'digital' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Digital Keys & Downloads</span>
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'receipt' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Digital Receipt</span>
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'return' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return & Refund</span>
            </button>
            <button
              onClick={() => setActiveTab('dispute')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'dispute' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Dispute Portal</span>
            </button>
          </div>

          {/* TAB 1: ORDER DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Item Summary</div>
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.title} className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.product.title}</div>
                        <div className="text-[11px] text-slate-500">Qty: {item.quantity} | Seller: {item.product.sellerName}</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {(item.product.pricePi * item.quantity).toFixed(2)} Pi
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Shipping Address
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {activeOrder.shippingAddress ? (
                      <>
                        <div className="font-bold">{activeOrder.shippingAddress.fullName}</div>
                        <div>{activeOrder.shippingAddress.street}</div>
                        <div>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country}</div>
                        <div>Phone: {activeOrder.shippingAddress.phone}</div>
                      </>
                    ) : (
                      <div>Digital Delivery / Instant Electronic Fulfillment</div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-purple-500" />
                    Pi Network Payment Audit
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <div><span className="font-semibold">Payment ID:</span> {activeOrder.piPaymentId || 'PI-PAY-VERIFIED-01'}</div>
                    <div><span className="font-semibold">TxID:</span> {activeOrder.piTxid || 'PI-TX-SETTLED-LIVE-99'}</div>
                    <div><span className="font-semibold">Payment Mode:</span> Official Pi Network Payment Flow</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300">Carrier: {activeOrder.carrier || 'Safaricom Express Logistics'}</div>
                  <div className="text-xs text-purple-700 dark:text-purple-400 mt-0.5">Tracking Number: <span className="font-mono font-bold">{activeOrder.trackingNumber || 'PNV-SAF-993821'}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Est. Delivery</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">1-2 Business Days</div>
                </div>
              </div>

              <div className="space-y-4 pl-3 border-l-2 border-purple-500/40 my-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 ${m.completed ? 'bg-purple-600 border-purple-600' : 'bg-white dark:bg-slate-900 border-slate-300'}`} />
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{m.location}</span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL KEYS & DOWNLOADS */}
          {activeTab === 'digital' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500" />
                  Released Digital Keys & Tokens
                </div>
                {activeOrder.items.map((i, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{i.product.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Digital Key:</span>
                        <span className="font-mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                          {i.product.digitalKey || 'PNV-KEY-8823-9912-4411'}
                        </span>
                      </div>
                    </div>
                    {i.product.digitalDownloadUrl && (
                      <a
                        href={i.product.digitalDownloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL RECEIPT */}
          {activeTab === 'receipt' && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">PiNova Official Digital Receipt</h3>
                    <p className="text-[11px] text-slate-500">Receipt ID: {receipt.receiptId}</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-500">Buyer Username:</span> <span className="font-bold">{receipt.buyerUsername}</span><br />
                    <span className="text-slate-500">Seller Store:</span> <span className="font-bold">{receipt.sellerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Payment ID:</span> <span className="font-mono font-bold">{receipt.piPaymentId}</span><br />
                    <span className="text-slate-500">TxID:</span> <span className="font-mono font-bold">{receipt.piTxid}</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {receipt.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-medium">{it.title}</td>
                          <td className="p-2 text-center">{it.quantity}</td>
                          <td className="p-2 text-right font-bold">{it.totalPi.toFixed(2)} Pi</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <QrCode className="w-6 h-6 text-purple-600" />
                    <span>Verified on Pi Network Blockchain</span>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-slate-500">Total Settled</div>
                    <div className="text-base font-extrabold text-purple-600 dark:text-purple-400">{receipt.totalPi.toFixed(2)} Pi</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RETURN & REFUND */}
          {activeTab === 'return' && (
            <div className="space-y-4">
              {returnSuccessNote ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {returnSuccessNote}
                </div>
              ) : (
                <form onSubmit={handleCreateReturn} className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">File a Return & Refund Request</div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Reason for Return</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <option value="defective">Defective / Damaged Item</option>
                      <option value="item_not_as_described">Item Not as Described</option>
                      <option value="wrong_item">Sent Wrong Item</option>
                      <option value="late_delivery">Extremely Late Delivery</option>
                      <option value="changed_mind">Changed Mind</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Detailed Explanation</label>
                    <textarea
                      required
                      rows={3}
                      value={returnDesc}
                      onChange={(e) => setReturnDesc(e.target.value)}
                      placeholder="Describe why you wish to return this item..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    Submit Return Request
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: DISPUTE PORTAL */}
          {activeTab === 'dispute' && (
            <div className="space-y-4">
              {disputeSuccessNote ? (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  {disputeSuccessNote}
                </div>
              ) : (
                <form onSubmit={handleCreateDispute} className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    Escalate to PiNova Arbitration Team
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Dispute Subject</label>
                    <input
                      type="text"
                      required
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Statement & Evidence Context</label>
                    <textarea
                      required
                      rows={3}
                      value={disputeDesc}
                      onChange={(e) => setDisputeDesc(e.target.value)}
                      placeholder="Provide full statement and evidence details for admin review..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    Open Official Dispute
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
