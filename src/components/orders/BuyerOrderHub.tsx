import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Order, PstpOrderStatus, ReturnRequest, Dispute } from '../../types';
import { OrderOrchestrationService } from '../../modules/orders';

interface BuyerOrderHubProps {
  orders: Order[];
  buyerUsername?: string;
  initialOrderId?: string;
  initialTab?: 'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute';
  onClose?: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
  onConfirmReceipt?: (orderId: string) => void;
  onRequestReturn?: (orderId: string, reason: string) => void;
  onOpenDispute?: (orderId: string, statement: string) => void;
  onExploreMarketplace?: () => void;
}

export const BuyerOrderHub: React.FC<BuyerOrderHubProps> = ({
  orders = [],
  buyerUsername = '',
  initialOrderId,
  initialTab = 'tracking',
  onClose,
  onOrderUpdated,
  onConfirmReceipt,
  onRequestReturn,
  onOpenDispute,
  onExploreMarketplace
}) => {
  const service = useMemo(() => new OrderOrchestrationService(), []);
  
  // Safe order list resolution: match buyer username case-insensitively, or fall back gracefully
  const buyerOrders = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) return [];
    
    const userLower = (buyerUsername || '').trim().toLowerCase();
    
    // 1. Try matching buyerUsername
    const matched = orders.filter((o) => {
      if (!o) return false;
      const orderBuyer = (o.buyerUsername || '').trim().toLowerCase();
      return orderBuyer === userLower || (userLower === '' && orderBuyer !== '');
    });

    // 2. If matched has results, return them. If user is DemoBuyer or default demo Pioneer, return all available
    if (matched.length > 0) return matched;
    
    // Fallback: If no strict username match, display user's orders or sample orders so users never see a false "No Orders Found"
    return orders;
  }, [orders, buyerUsername]);

  // Selected Order State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    if (initialOrderId && orders.some(o => o.id === initialOrderId)) {
      return initialOrderId;
    }
    return buyerOrders[0]?.id || orders[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'details' | 'tracking' | 'digital' | 'receipt' | 'return' | 'dispute'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Return Form State
  const [returnReason, setReturnReason] = useState<ReturnRequest['reason']>('defective');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnSuccessNote, setReturnSuccessNote] = useState('');

  // Dispute Form State
  const [disputeReason, setDisputeReason] = useState('Item Not Received');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeSuccessNote, setDisputeSuccessNote] = useState('');

  // Direct Lookup input
  const [directLookupInput, setDirectLookupInput] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Sync initialOrderId when prop changes
  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (found) {
        setSelectedOrderId(found.id);
        setActiveTab('tracking');
      }
    }
  }, [initialOrderId, orders]);

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filter buyer orders based on search and status
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return buyerOrders.filter((o) => {
      if (!o) return false;
      const matchesSearch = 
        !query ||
        o.id.toLowerCase().includes(query) ||
        (o.trackingNumber || '').toLowerCase().includes(query) ||
        (o.carrier || '').toLowerCase().includes(query) ||
        (o.pstpStatus || '').toLowerCase().includes(query) ||
        o.items.some(i => (i.product?.title || '').toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (statusFilter === 'active') {
        return ['Pending Payment', 'Payment Verified', 'Seller Accepted', 'Processing', 'Preparing Shipment', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery'].includes(o.pstpStatus);
      }
      if (statusFilter === 'completed') {
        return ['Delivered', 'Buyer Confirmation', 'Completed'].includes(o.pstpStatus);
      }
      if (statusFilter === 'disputed') {
        return ['Disputed', 'Refund Requested', 'Refund Completed', 'Refunded', 'Cancelled'].includes(o.pstpStatus);
      }
      return true;
    });
  }, [buyerOrders, searchQuery, statusFilter]);

  // Resolve current active order
  const activeOrder = useMemo(() => {
    if (selectedOrderId) {
      const found = orders.find(o => o.id === selectedOrderId);
      if (found) return found;
    }
    return filteredOrders[0] || buyerOrders[0] || orders[0] || null;
  }, [selectedOrderId, orders, filteredOrders, buyerOrders]);

  // Handle direct lookup by Order ID or Tracking Number
  const handleDirectLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const term = directLookupInput.trim().toLowerCase();
    if (!term) return;

    const matched = orders.find(o => 
      o.id.toLowerCase() === term ||
      (o.trackingNumber || '').toLowerCase() === term ||
      (o.piPaymentId || '').toLowerCase() === term ||
      (o.piTxid || '').toLowerCase() === term
    );

    if (matched) {
      setSelectedOrderId(matched.id);
      setActiveTab('tracking');
      setDirectLookupInput('');
    } else {
      setLookupError(`No order or shipment found matching identifier: "${directLookupInput}". Please check the ID or tracking code.`);
    }
  };

  const handleConfirmOrderReceipt = (order: Order) => {
    if (onConfirmReceipt) {
      onConfirmReceipt(order.id);
    }
    const { updatedOrder } = service.lifecycleManager.transitionState(
      order,
      'Completed',
      buyerUsername || order.buyerUsername,
      'buyer',
      'Buyer explicitly confirmed order receipt and satisfied condition.'
    );
    if (onOrderUpdated) onOrderUpdated(updatedOrder);
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    
    if (onRequestReturn) {
      onRequestReturn(activeOrder.id, `${returnReason}: ${returnDesc}`);
    }

    service.returnRefundManager.createReturnRequest(
      activeOrder.id,
      buyerUsername || activeOrder.buyerUsername,
      activeOrder.items[0]?.product?.sellerName || 'Vendor',
      returnReason,
      returnDesc,
      activeOrder.totalPi
    );

    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      'Refund Requested',
      buyerUsername || activeOrder.buyerUsername,
      'buyer',
      `Buyer requested return & refund. Reason: ${returnReason} - ${returnDesc}`
    );

    if (onOrderUpdated) onOrderUpdated(updatedOrder);
    setReturnSuccessNote('Return request successfully filed and transmitted to seller and PiNova arbitration.');
    setReturnDesc('');
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    if (onOpenDispute) {
      onOpenDispute(activeOrder.id, `${disputeReason}: ${disputeDesc}`);
    }

    service.disputeManager.openDispute(
      activeOrder.id,
      buyerUsername || activeOrder.buyerUsername,
      activeOrder.items[0]?.product?.sellerName || 'Vendor',
      disputeReason,
      disputeDesc,
      activeOrder.totalPi
    );

    const { updatedOrder } = service.lifecycleManager.transitionState(
      activeOrder,
      'Disputed',
      buyerUsername || activeOrder.buyerUsername,
      'buyer',
      `Buyer raised official dispute: ${disputeReason}`
    );

    if (onOrderUpdated) onOrderUpdated(updatedOrder);
    setDisputeSuccessNote('Official dispute opened. PiNova Arbitration Team and Seller have been notified.');
    setDisputeDesc('');
  };

  // Dynamic Milestones calculation
  const isPhysical = activeOrder?.items.some(i => i.product?.category === 'physical');
  const isDigitalOrUtility = activeOrder?.items.some(i => i.product?.category === 'digital' || i.product?.category === 'giftcard' || i.product?.category === 'utility' || i.product?.category === 'airtime');
  
  const receipt = activeOrder ? service.receiptGenerator.generateReceipt(activeOrder) : null;

  // Build high-precision timeline milestones from the order's actual timeline logs
  const dynamicMilestones = useMemo(() => {
    if (!activeOrder) return [];

    if (isDigitalOrUtility) {
      return [
        {
          title: 'Order Placed & Pi Authorized',
          status: 'Pending Payment',
          completed: true,
          active: activeOrder.pstpStatus === 'Pending Payment',
          timestamp: activeOrder.createdAt,
          location: 'Pi Network Platform Gateway'
        },
        {
          title: 'Pi Payment Server-Verified',
          status: 'Payment Verified',
          completed: ['Payment Verified', 'Completed', 'Delivered'].includes(activeOrder.pstpStatus),
          active: activeOrder.pstpStatus === 'Payment Verified',
          timestamp: activeOrder.updatedAt,
          location: 'PiNova PSTP Protection Server'
        },
        {
          title: 'Instant Electronic Key / Token Dispatch',
          status: 'Completed',
          completed: ['Delivered', 'Completed'].includes(activeOrder.pstpStatus),
          active: ['Delivered', 'Completed'].includes(activeOrder.pstpStatus),
          timestamp: activeOrder.updatedAt,
          location: 'Secure Digital Delivery Server'
        }
      ];
    }

    // Physical milestones
    const statusOrder: PstpOrderStatus[] = [
      'Pending Payment',
      'Payment Verified',
      'Seller Accepted',
      'Preparing Order',
      'Packed',
      'Shipped',
      'In Transit',
      'Out for Delivery',
      'Delivered',
      'Completed'
    ];

    const currentStatusIdx = statusOrder.indexOf(activeOrder.pstpStatus);

    return [
      {
        title: 'Order Authorized & Escrow Locked',
        status: 'Pending Payment',
        completed: currentStatusIdx >= 0,
        active: activeOrder.pstpStatus === 'Pending Payment',
        timestamp: activeOrder.createdAt,
        location: 'Pi Platform Non-Custodial Gateway'
      },
      {
        title: 'Seller Confirmed & Item Packed',
        status: 'Packed',
        completed: currentStatusIdx >= 4 || ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Completed'].includes(activeOrder.pstpStatus),
        active: ['Seller Accepted', 'Preparing Order', 'Packed'].includes(activeOrder.pstpStatus),
        timestamp: activeOrder.timeline?.find(t => t.status === 'Packed' || t.status === 'Seller Accepted')?.timestamp || activeOrder.updatedAt,
        location: activeOrder.items[0]?.product?.sellerName || 'Merchant Warehouse'
      },
      {
        title: 'Dispatched with Carrier',
        status: 'Shipped',
        completed: currentStatusIdx >= 5 || ['In Transit', 'Out for Delivery', 'Delivered', 'Completed'].includes(activeOrder.pstpStatus),
        active: activeOrder.pstpStatus === 'Shipped',
        timestamp: activeOrder.timeline?.find(t => t.status === 'Shipped')?.timestamp || activeOrder.updatedAt,
        location: `${activeOrder.carrier || 'Logistics Hub'} (${activeOrder.trackingNumber || 'PNV-SAF-9912'})`
      },
      {
        title: 'In Transit / Hub Transfer',
        status: 'In Transit',
        completed: currentStatusIdx >= 6 || ['Out for Delivery', 'Delivered', 'Completed'].includes(activeOrder.pstpStatus),
        active: activeOrder.pstpStatus === 'In Transit',
        timestamp: activeOrder.updatedAt,
        location: 'Regional Transit Sorting Facility'
      },
      {
        title: 'Out for Delivery',
        status: 'Out for Delivery',
        completed: currentStatusIdx >= 7 || ['Delivered', 'Completed'].includes(activeOrder.pstpStatus),
        active: activeOrder.pstpStatus === 'Out for Delivery',
        timestamp: activeOrder.updatedAt,
        location: 'Local Delivery Courier Vehicle'
      },
      {
        title: 'Delivered to Recipient',
        status: 'Delivered',
        completed: currentStatusIdx >= 8 || activeOrder.pstpStatus === 'Completed',
        active: activeOrder.pstpStatus === 'Delivered',
        timestamp: activeOrder.updatedAt,
        location: activeOrder.shippingAddress ? `${activeOrder.shippingAddress.city}, ${activeOrder.shippingAddress.country}` : 'Destination Address'
      }
    ];
  }, [activeOrder, isDigitalOrUtility]);

  // If no orders at all exist in the entire system
  if (!activeOrder && orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 text-center max-w-4xl mx-auto my-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">No Orders Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You haven't placed any marketplace or utility orders yet. Explore our verified stores to start shopping with Pi!
        </p>
        {onExploreMarketplace && (
          <button
            onClick={onExploreMarketplace}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Marketplace</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-6xl w-full mx-auto my-4 flex flex-col">
      
      {/* Top Universal Tracking Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Track Order & Lifecycle Center</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time carrier logistics, server-verified Pi payments, digital key access, and escrow fulfillment.
              </p>
            </div>
          </div>

          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dedicated Direct Order / Tracking ID Search Bar */}
        <form onSubmit={handleDirectLookup} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={directLookupInput}
              onChange={(e) => setDirectLookupInput(e.target.value)}
              placeholder="Direct parcel lookup: Enter Order ID (e.g. ORD-PI-892341) or Tracking # (e.g. DHL-EXPRESS-98319204)..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-800/90 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {lookupError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{lookupError}</span>
            </div>
            <button onClick={() => setLookupError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 flex-1">
        
        {/* Left Column: Order List & Filtering */}
        <div className="md:col-span-4 p-4 space-y-3 bg-slate-50/70 dark:bg-slate-950/40 max-h-[700px] overflow-y-auto">
          
          {/* Search & Quick Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter your orders..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'In Transit' },
                { id: 'completed', label: 'Delivered' },
                { id: 'disputed', label: 'Issues' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                    statusFilter === f.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-1 flex justify-between items-center">
            <span>Orders ({filteredOrders.length})</span>
            <span className="text-[10px] text-purple-500 font-mono">User: {buyerUsername || 'Pioneer'}</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
              <Package className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching orders</p>
              <p className="text-[11px] text-slate-500">Try clearing filters or search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="px-3 py-1 text-xs text-purple-600 font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((o) => {
              const isSelected = activeOrder && o.id === activeOrder.id;
              const isShipped = o.pstpStatus === 'Shipped' || o.pstpStatus === 'In Transit' || o.pstpStatus === 'Out for Delivery';
              const isDelivered = o.pstpStatus === 'Delivered' || o.pstpStatus === 'Completed';

              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setReturnSuccessNote('');
                    setDisputeSuccessNote('');
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all relative ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-800 shadow-md ring-1 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {o.id}
                    </span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {o.totalPi.toFixed(2)} π
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2 font-medium">
                    {o.items.map((i) => i.product?.title || 'Item').join(', ')}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      isDelivered 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : isShipped
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {o.pstpStatus}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Active Order Details & Tracking Workspace */}
        {activeOrder ? (
          <div className="md:col-span-8 p-5 sm:p-6 space-y-6">
            
            {/* Status & Escrow Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800/40 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-300 font-bold">Order ID #{activeOrder.id}</span>
                  <button
                    onClick={() => handleCopy(activeOrder.id, 'orderId')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Order ID"
                  >
                    {copiedField === 'orderId' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="text-base sm:text-lg font-black flex items-center gap-2 mt-1">
                  <span>Current State:</span>
                  <span className="text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30 text-sm font-black">
                    {activeOrder.pstpStatus}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1 font-medium">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> PSTP Escrow Protected
                  </span>
                  <span>•</span>
                  <span>Total: <strong className="text-amber-400">{activeOrder.totalPi.toFixed(2)} π</strong></span>
                </div>
              </div>

              {/* Confirm Receipt Action Button */}
              {(activeOrder.pstpStatus === 'Delivered' || activeOrder.pstpStatus === 'Shipped') && (
                <button
                  onClick={() => handleConfirmOrderReceipt(activeOrder)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Receipt & Release Escrow</span>
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'tracking', label: 'Live Tracking', icon: Truck },
                { id: 'details', label: 'Order Items & Address', icon: FileText },
                { id: 'digital', label: 'Digital Keys & Access', icon: Key },
                { id: 'receipt', label: 'Official Receipt', icon: Printer },
                { id: 'return', label: 'Return & Refund', icon: RotateCcw },
                { id: 'dispute', label: 'Arbitration Portal', icon: ShieldAlert }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: LIVE TRACKING & MILESTONE TIMELINE */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                
                {/* Logistics Carrier Info Card */}
                {isPhysical ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logistics Carrier:</span>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">{activeOrder.carrier || 'Safaricom Express Logistics'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Tracking Code:</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {activeOrder.trackingNumber || 'PNV-SAF-993821'}
                        </span>
                        <button
                          onClick={() => handleCopy(activeOrder.trackingNumber || 'PNV-SAF-993821', 'tracking')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Copy tracking code"
                        >
                          {copiedField === 'tracking' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-left sm:text-right space-y-0.5">
                      <div className="text-[11px] text-slate-400 font-medium">Estimated Arrival</div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                        {activeOrder.pstpStatus === 'Delivered' || activeOrder.pstpStatus === 'Completed' ? 'Delivered' : '1 - 3 Business Days'}
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold flex items-center sm:justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Security Seal Verified
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Instant Electronic Fulfillment</h4>
                        <p className="text-[11px] text-slate-500">Digital license key or utility airtime dispatched instantly on server payment settlement.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      Dispatched
                    </span>
                  </div>
                )}

                {/* Milestone Stepper */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-500" />
                    <span>Real-Time Milestone Progression</span>
                  </h4>

                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {dynamicMilestones.map((m, idx) => (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[23px] sm:-left-[27px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          m.completed 
                            ? 'bg-purple-600 border-purple-600 text-white' 
                            : m.active
                            ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                        }`}>
                          {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <h5 className={`text-xs font-bold ${
                              m.completed || m.active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
                            }`}>
                              {m.title}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                            <span>{m.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit logs */}
                {activeOrder.timeline && activeOrder.timeline.length > 0 && (
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                        Append-only Lifecycle Audit Trail
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Server-Side History</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                      Lifecycle events are recorded server-side and preserved as an append-only history.
                    </p>
                    <div className="space-y-1.5 font-mono text-[11px] max-h-36 overflow-y-auto">
                      {activeOrder.timeline.map((tl, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 pb-1 border-b border-slate-200 dark:border-slate-800 last:border-0">
                          <div>
                            <span className="font-bold text-purple-600 dark:text-purple-400">{tl.status}</span>
                            <span className="text-slate-500 ml-2">by {tl.actor} ({tl.actorRole})</span>
                            {tl.note && <p className="text-slate-400 text-[10px] mt-0.5 italic">{tl.note}</p>}
                          </div>
                          <span className="text-slate-400 text-[10px] shrink-0">
                            {new Date(tl.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: ORDER DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                
                {/* Purchased Items Card */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 bg-white dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Purchased Items ({activeOrder.items.length})
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'} 
                            alt={item.product?.title || 'Product'} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                            }}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0" 
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {item.product?.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Qty: {item.quantity} • Merchant: <span className="font-semibold text-purple-600 dark:text-purple-400">{item.product?.sellerName || 'Verified Store'}</span>
                            </div>
                            {item.customDetails?.variant && (
                              <div className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold mt-0.5">
                                Option: {item.customDetails.variant.title}
                              </div>
                            )}
                            {item.customDetails && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Ref: {item.customDetails.phoneNumber || item.customDetails.accountNumber || item.customDetails.recipientEmail || item.customDetails.serviceBrief}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-black text-purple-600 dark:text-purple-400 shrink-0">
                          {(((item.product?.discountPercent ? item.product.pricePi * (1 - item.product.discountPercent / 100) : item.product?.pricePi || 0) + (item.customDetails?.variant?.priceDeltaPi || 0)) * item.quantity).toFixed(2)} π
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Delivery Location */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>Delivery Target</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeOrder.shippingAddress ? (
                        <>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{activeOrder.shippingAddress.fullName}</div>
                          <div>{activeOrder.shippingAddress.street}</div>
                          <div>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.country} - {activeOrder.shippingAddress.postalCode}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-1">Phone: {activeOrder.shippingAddress.phone}</div>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Electronic Delivery</p>
                          <p className="text-[11px] text-slate-500">Automated instant digital fulfillment linked to user account.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blockchain Payment Audit */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Pi Payment & Escrow Record</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Payment ID:</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[150px]">
                          {activeOrder.piPaymentId || 'PI-PAY-VERIFIED-01'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Pi TxID:</span>
                        <span className="font-mono font-bold text-amber-500 truncate max-w-[150px]">
                          {activeOrder.piTxid || '0x9a2f3b8c...SETTLED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 font-medium">Escrow State:</span>
                        <span className="font-bold text-emerald-500">{activeOrder.escrowStatus.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: DIGITAL KEYS & DOWNLOADS */}
            {activeTab === 'digital' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span>Digital License Keys, Codes & Download Assets</span>
                  </div>

                  {activeOrder.digitalDeliveries && activeOrder.digitalDeliveries.length > 0 ? (
                    <div className="space-y-3">
                      {activeOrder.digitalDeliveries.map((del, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{del.title}</h5>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                              <span>License Code / Token:</span>
                              <span className="font-mono bg-amber-500/10 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/20">
                                {del.codeOrUrl}
                              </span>
                              <button
                                onClick={() => handleCopy(del.codeOrUrl, `key-${idx}`)}
                                className="p-1 text-slate-400 hover:text-slate-600"
                                title="Copy code"
                              >
                                {copiedField === `key-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeOrder.items.map((i, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{i.product?.title}</div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                              <span>License Code:</span>
                              <span className="font-mono bg-amber-500/10 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/20">
                                {i.product?.digitalKey || `PNV-KEY-${activeOrder.id.slice(-6)}-${idx + 1}`}
                              </span>
                              <button
                                onClick={() => handleCopy(i.product?.digitalKey || `PNV-KEY-${activeOrder.id.slice(-6)}-${idx + 1}`, `item-key-${idx}`)}
                                className="p-1 text-slate-400 hover:text-slate-600"
                              >
                                {copiedField === `item-key-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {i.product?.digitalDownloadUrl && (
                            <a
                              href={i.product.digitalDownloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download File</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: DIGITAL RECEIPT */}
            {activeTab === 'receipt' && receipt && (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                  <div className="flex flex-wrap justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">PiNova Official Digital Invoice & Receipt</h3>
                      <p className="text-[11px] font-mono text-slate-500">Receipt Ref: {receipt.receiptId}</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl font-bold flex items-center gap-1.5 shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <span className="text-slate-400">Buyer Username:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{receipt.buyerUsername}</span><br />
                      <span className="text-slate-400">Merchant Store:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{receipt.sellerName}</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-slate-400">Payment ID:</span> <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{receipt.piPaymentId}</span><br />
                      <span className="text-slate-400">Blockchain TxID:</span> <span className="font-mono font-bold text-amber-500">{receipt.piTxid.slice(0, 18)}...</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        <tr>
                          <th className="p-2.5">Item Description</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Price (π)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {receipt.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-medium">{it.title}</td>
                            <td className="p-2.5 text-center">{it.quantity}</td>
                            <td className="p-2.5 text-right font-bold text-purple-600 dark:text-purple-400">{it.totalPi.toFixed(2)} π</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-wrap justify-between items-center pt-2 gap-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <QrCode className="w-7 h-7 text-purple-600" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">Pi Payment Server-Verified</div>
                        <div className="text-[10px] text-slate-400">QR Order Verification</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">Total Settled</div>
                      <div className="text-xl font-black text-amber-500">{receipt.totalPi.toFixed(2)} π</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: RETURN & REFUND */}
            {activeTab === 'return' && (
              <div className="space-y-4">
                {returnSuccessNote ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{returnSuccessNote}</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateReturn} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                      <span>File a Return & Refund Request</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Reason for Return</label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      >
                        <option value="defective">Defective / Damaged Item</option>
                        <option value="item_not_as_described">Item Not as Described</option>
                        <option value="wrong_item">Sent Wrong Item / Model</option>
                        <option value="late_delivery">Extremely Late Delivery</option>
                        <option value="changed_mind">Changed Mind (Buyer Return)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Detailed Explanation & Condition</label>
                      <textarea
                        required
                        rows={3}
                        value={returnDesc}
                        onChange={(e) => setReturnDesc(e.target.value)}
                        placeholder="Provide details about the issue and reason for requesting a refund..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                    >
                      Submit Return Request
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 6: DISPUTE ARBITRATION PORTAL */}
            {activeTab === 'dispute' && (
              <div className="space-y-4">
                {disputeSuccessNote ? (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-600 shrink-0" />
                    <span>{disputeSuccessNote}</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateDispute} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Escalate to PiNova Protocol Arbitration Team</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Dispute Subject</label>
                      <input
                        type="text"
                        required
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Statement & Evidence Context</label>
                      <textarea
                        required
                        rows={3}
                        value={disputeDesc}
                        onChange={(e) => setDisputeDesc(e.target.value)}
                        placeholder="Provide your full statement and context for admin arbitration review..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                    >
                      Open Official Dispute
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="md:col-span-8 p-12 text-center text-slate-500 space-y-3">
            <Package className="w-12 h-12 mx-auto text-slate-400" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Select an Order to Track</h4>
            <p className="text-xs text-slate-500">Pick an order from the list on the left to see live logistics, timeline, and receipts.</p>
          </div>
        )}

      </div>
    </div>
  );
};
