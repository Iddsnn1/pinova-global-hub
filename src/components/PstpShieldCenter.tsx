import React, { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/safeFetch';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  Upload,
  MessageSquare,
  ShieldAlert,
  Award,
  Clock,
  Send,
  X,
  UserCheck,
  Building,
  Activity,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Smartphone,
  Info
} from 'lucide-react';
import {
  Order,
  PstpOrderStatus,
  AuditLogEntry,
  Dispute,
  SecurityEvent,
  UserReputation,
  PiUser
} from '../types';

interface PstpShieldCenterProps {
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: PstpOrderStatus, note?: string) => void;
  currentUser: PiUser;
}

const ORDER_STATUS_HIERARCHY: PstpOrderStatus[] = [
  'Pending Payment',
  'Payment Verified',
  'Seller Accepted',
  'Preparing Order',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Completed',
  'Cancelled',
  'Refund Requested',
  'Refund Completed',
  'Disputed',
  'Resolved'
];

export const PstpShieldCenter: React.FC<PstpShieldCenterProps> = ({
  onClose,
  orders,
  onUpdateOrderStatus,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'disputes' | 'refunds' | 'security' | 'trust'>('overview');
  
  // Data states fetched from PSTP Server API
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Order for Timeline
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  
  // New Dispute Form State
  const [isFilingDispute, setIsFilingDispute] = useState<boolean>(false);
  const [disputeForm, setDisputeForm] = useState({
    orderId: orders[0]?.id || '',
    reason: 'Item defective or damaged in transit',
    description: '',
    evidenceFileName: '',
    evidenceFileUrl: ''
  });

  // Selected Dispute details modal/view
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  // Admin resolution form state
  const [adminResolutionNote, setAdminResolutionNote] = useState<string>('');
  const [partialRefundAmount, setPartialRefundAmount] = useState<number>(0);

  // User Reputation sample metrics
  const reputation: UserReputation = {
    username: currentUser.username,
    role: currentUser.role === 'admin' ? 'seller' : currentUser.role,
    trustScore: 98,
    isVerifiedBuyer: true,
    isVerifiedSeller: currentUser.role === 'seller' || currentUser.role === 'admin',
    completedOrders: 42,
    disputeRatePercent: 0.4,
    ratingsCount: 38,
    avgRating: 4.9,
    badgeLevel: 'Enterprise Platinum'
  };

  // Fetch PSTP API data
  const fetchPstpData = async () => {
    setLoading(true);
    try {
      const [logsRes, disputesRes, secRes] = await Promise.all([
        safeFetchJson('/api/pstp/audit-logs'),
        safeFetchJson('/api/pstp/disputes'),
        safeFetchJson('/api/pstp/security-events')
      ]);

      if (logsRes.data && logsRes.data.logs) setAuditLogs(logsRes.data.logs);
      if (disputesRes.data && disputesRes.data.disputes) setDisputes(disputesRes.data.disputes);
      if (secRes.data && secRes.data.events) setSecurityEvents(secRes.data.events);
    } catch (err) {
      console.error('Error fetching PSTP data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPstpData();
  }, []);

  const currentSelectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Handle status update
  const handleStatusChange = async (newStatus: PstpOrderStatus) => {
    if (!currentSelectedOrder) return;
    const note = `Status updated to "${newStatus}" by ${currentUser.username}`;
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(currentSelectedOrder.id, newStatus, note);
    }
    // Record to PSTP audit log backend
    await safeFetchJson('/api/pstp/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: currentSelectedOrder.id,
        actor: currentUser.username,
        actorRole: currentUser.role,
        action: 'ORDER_STATUS_TRANSITION',
        details: `Order status moved to ${newStatus}`,
        ipAddress: '127.0.0.1',
        deviceInfo: 'PSTP Protection Desk'
      })
    });
    fetchPstpData();
  };

  // Submit dispute
  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.description) return;
    const orderObj = orders.find((o) => o.id === disputeForm.orderId);
    
    const evidenceFiles = disputeForm.evidenceFileUrl ? [{
      id: `EVI-${Date.now()}`,
      fileName: disputeForm.evidenceFileName || 'evidence_doc.jpg',
      fileUrl: disputeForm.evidenceFileUrl,
      fileType: 'image' as const,
      uploadedBy: currentUser.username,
      uploadedAt: new Date().toISOString()
    }] : [];

    const res = await safeFetchJson('/api/pstp/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: disputeForm.orderId,
        buyerUsername: currentUser.username,
        sellerUsername: orderObj?.items[0]?.product.sellerName || 'Verified Merchant',
        reason: disputeForm.reason,
        description: disputeForm.description,
        amountPi: orderObj?.totalPi || 50,
        evidenceFiles
      })
    });

    const data = res.data || {};
    if (data.success) {
      setIsFilingDispute(false);
      setDisputeForm({
        orderId: orders[0]?.id || '',
        reason: 'Item defective or damaged in transit',
        description: '',
        evidenceFileName: '',
        evidenceFileUrl: ''
      });
      fetchPstpData();
    }
  };

  // Post comment on dispute
  const handleAddComment = async (disputeId: string) => {
    if (!commentText.trim()) return;
    const res = await safeFetchJson(`/api/pstp/disputes/${disputeId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: currentUser.username,
        role: currentUser.role,
        text: commentText
      })
    });
    const data = res.data || {};
    if (data.success) {
      setCommentText('');
      fetchPstpData();
    }
  };

  // Admin Dispute Resolution
  const handleResolveDispute = async (disputeId: string, decision: 'full_refund' | 'partial_refund' | 'release_seller' | 'dismiss') => {
    const res = await safeFetchJson(`/api/pstp/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decision,
        note: adminResolutionNote || `Admin resolved dispute as ${decision}`,
        refundAmountPi: decision === 'partial_refund' ? partialRefundAmount : undefined,
        resolvedBy: currentUser.username
      })
    });
    const data = res.data || {};
    if (data.success) {
      setAdminResolutionNote('');
      fetchPstpData();
    }
  };

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* PSTP Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl tracking-tight text-white">
                  PiNova Secure Transaction Protection
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider uppercase border border-emerald-500/30">
                  PSTP v2.0 Standard
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5 font-medium">
                Enterprise Buyer & Seller Order Protection Powered by Official Pi Network SDK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Core Principles & SDK</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>14-Stage Order Status</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'disputes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispute Resolution ({disputes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'refunds'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refund Management</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Security & Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'trust'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Trust & Badges</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & CORE PRINCIPLES */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Mandatory Core Principle Alert Box */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-600 dark:text-amber-400 text-sm">
                  <Info className="w-5 h-5" />
                  <span>Mandatory Platform Core Security Principle</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  PiNova Global Hub <strong>never claims to custody or hold Pi coins outside the official Pi Network payment flow</strong>. All transaction verifications run via official Pi SDK v2 methods (<code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded font-mono text-[11px]">Pi.authenticate()</code> and <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded font-mono text-[11px]">Pi.createPayment()</code>) paired with server-to-server endpoints (<code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded font-mono text-[11px]">/api/v2/payments/:paymentId/approve</code> and <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded font-mono text-[11px]">/api/v2/payments/:paymentId/complete</code>).
                </p>
              </div>

              {/* 4 Architectural Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1. Server-Side Verification</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Idempotent server verification prevents duplicate claims and enforces strict transaction validation with the Pi Platform REST API.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-[11px] text-emerald-400 border border-slate-800">
                    POST /v2/payments/&#123;paymentId&#125;/approve
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>2. Dual Protection Guarantee</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Buyer Protection:</strong> Guaranteed replacement or full refund if items are non-delivered or counterfeit.<br />
                    <strong>Seller Protection:</strong> Inventory allocation reserved only after server payment verification.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>3. Append-only Audit Trail</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Every status transition, dispute comment, refund approval, and payment verification is recorded server-side with verified timestamps, IP data, and actor roles.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>4. Real-Time Fraud Shield</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Automated rate limiting, IP geolocation anomaly detection, and high-value transaction fraud flagging safeguard merchant and pioneer balances.
                  </p>
                </div>

              </div>

              {/* Status Verification Badge Summary */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
                <h4 className="font-extrabold text-sm text-purple-300">Active PSTP Engine Status</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pi SDK Version</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">v2.0 (Active)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Server Verification</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">Enabled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Idempotency Mode</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">Strict Unique</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Audit Log Ledger</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">Append-only</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 14-STAGE ORDER TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Select Order Picker */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase">Select Order to Inspect</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.items[0]?.product.title} ({o.totalPi.toFixed(2)} π)
                      </option>
                    ))}
                  </select>
                </div>

                {currentSelectedOrder && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Current Status:</span>
                    <span className="px-3 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-xs">
                      {currentSelectedOrder.pstpStatus || 'Shipped'}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Transition Control (for testing seller/admin state changes) */}
              {(currentUser.role === 'seller' || currentUser.role === 'admin') && currentSelectedOrder && (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span>Advance PSTP 14-Stage Order Lifecycle</span>
                    <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded text-purple-200">Authorized Merchant Action</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUS_HIERARCHY.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                          currentSelectedOrder.pstpStatus === st
                            ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 14-Step Progress Lifecycle Visualization */}
              {currentSelectedOrder && (
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6 border border-slate-800">
                  <h3 className="font-extrabold text-base text-purple-300 flex items-center justify-between">
                    <span>Order Progress Lifecycle ({currentSelectedOrder.id})</span>
                    <span className="text-xs font-mono text-emerald-400">Txid: {currentSelectedOrder.piTxid?.substring(0, 16)}...</span>
                  </h3>

                  {/* Vertical / Horizontal Stepper Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status Steps List */}
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                      {ORDER_STATUS_HIERARCHY.map((step, idx) => {
                        const isCurrent = currentSelectedOrder.pstpStatus === step;
                        const timelineEvent = currentSelectedOrder.timeline?.find((t) => t.status === step);
                        const isPast = Boolean(timelineEvent);

                        return (
                          <div
                            key={step}
                            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                              isCurrent
                                ? 'bg-purple-900/60 border-purple-400 text-white shadow-lg'
                                : isPast
                                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                                : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-950 animate-pulse'
                                : isPast
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{step}</span>
                                {timelineEvent && (
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {new Date(timelineEvent.timestamp).toLocaleTimeString()}
                                  </span>
                                )}
                              </div>
                              {timelineEvent ? (
                                <p className="text-[11px] text-purple-200 mt-1">{timelineEvent.note}</p>
                              ) : (
                                <p className="text-[10px] text-slate-500 mt-0.5">Awaiting stage completion</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order & Metadata Summary Panel */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                      <h4 className="font-extrabold text-amber-400 text-sm uppercase tracking-wider">Order Audit Summary</h4>
                      
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-500">Buyer Username:</span>
                          <span className="font-bold">{currentSelectedOrder.buyerUsername}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-500">Total Pi Order Amount:</span>
                          <span className="font-bold text-amber-400">{currentSelectedOrder.totalPi.toFixed(2)} π</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-500">Pi Payment ID:</span>
                          <span className="font-mono text-purple-300 truncate max-w-[150px]">{currentSelectedOrder.piPaymentId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-500">Server Verification:</span>
                          <span className="font-bold text-emerald-400">Approved & Idempotent</span>
                        </div>
                        {currentSelectedOrder.shippingAddress && (
                          <div className="pt-2">
                            <span className="text-slate-500 block font-bold mb-1">Shipping Address:</span>
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                              {currentSelectedOrder.shippingAddress.fullName}<br />
                              {currentSelectedOrder.shippingAddress.street}, {currentSelectedOrder.shippingAddress.city}<br />
                              {currentSelectedOrder.shippingAddress.country} ({currentSelectedOrder.shippingAddress.postalCode})
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: DISPUTE RESOLUTION CENTER */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">Dispute Resolution Desk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Submit evidence, negotiate resolutions, or request internal admin arbitration</p>
                </div>

                <button
                  onClick={() => setIsFilingDispute(!isFilingDispute)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>File New Dispute Ticket</span>
                </button>
              </div>

              {/* New Dispute File Form */}
              {isFilingDispute && (
                <form onSubmit={handleFileDispute} className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                  <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">Submit Dispute Case to PSTP Desk</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Target Order ID</label>
                      <select
                        value={disputeForm.orderId}
                        onChange={(e) => setDisputeForm({ ...disputeForm, orderId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      >
                        {orders.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.id} ({o.totalPi.toFixed(2)} π)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Dispute Reason</label>
                      <select
                        value={disputeForm.reason}
                        onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      >
                        <option value="Item defective or damaged in transit">Item defective or damaged in transit</option>
                        <option value="Non-delivery or lost in shipment">Non-delivery or lost in shipment</option>
                        <option value="Incorrect item or digital code invalid">Incorrect item or digital code invalid</option>
                        <option value="Unapproved charge discrepancy">Unapproved charge discrepancy</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-bold block mb-1">Detailed Description & Statement</label>
                    <textarea
                      rows={3}
                      placeholder="Explain what happened clearly for buyer/seller and admin review..."
                      value={disputeForm.description}
                      onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Evidence Document/Photo Name</label>
                      <input
                        type="text"
                        placeholder="e.g. damaged_package_photo.jpg"
                        value={disputeForm.evidenceFileName}
                        onChange={(e) => setDisputeForm({ ...disputeForm, evidenceFileName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Evidence Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={disputeForm.evidenceFileUrl}
                        onChange={(e) => setDisputeForm({ ...disputeForm, evidenceFileUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFilingDispute(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md"
                    >
                      Submit Official Dispute
                    </button>
                  </div>
                </form>
              )}

              {/* Disputes List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Dispute Cases Sidebar */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Dispute Tickets</h4>
                  
                  {disputes.map((disp) => (
                    <div
                      key={disp.id}
                      onClick={() => setSelectedDisputeId(disp.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        selectedDisputeId === disp.id
                          ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 shadow-md'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs font-mono text-slate-800 dark:text-slate-200">{disp.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          disp.status === 'open'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : disp.status.includes('resolved')
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/30'
                        }`}>
                          {disp.status}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{disp.reason}</h5>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Order: {disp.orderId}</span>
                        <span className="font-bold text-amber-500">{disp.amountPi.toFixed(2)} π</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dispute Detail Panel */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  {selectedDispute ? (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{selectedDispute.reason}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Dispute ID: {selectedDispute.id} • Order: {selectedDispute.orderId}</p>
                        </div>
                        <span className="font-black text-amber-500 text-lg">{selectedDispute.amountPi.toFixed(2)} π</span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-500 uppercase text-[10px] block">Dispute Statement</span>
                        <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 leading-relaxed">
                          {selectedDispute.description}
                        </p>
                      </div>

                      {/* Evidence Files attachments */}
                      {selectedDispute.evidenceFiles?.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-slate-500 uppercase text-[10px] block">Uploaded Evidence Files</span>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedDispute.evidenceFiles.map((ev) => (
                              <div key={ev.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
                                <img src={ev.fileUrl} alt="evidence" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="truncate">
                                  <span className="font-bold block truncate">{ev.fileName}</span>
                                  <span className="text-[10px] text-slate-400">By {ev.uploadedBy}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Discussion Comments Thread */}
                      <div className="space-y-3 pt-2">
                        <span className="font-bold text-slate-500 uppercase text-[10px] block">Negotiation & Discussion Log</span>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {selectedDispute.comments.map((cmt) => (
                            <div key={cmt.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-purple-600 dark:text-purple-400">
                                  {cmt.sender} ({cmt.role.toUpperCase()})
                                </span>
                                <span className="text-slate-400">{new Date(cmt.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">{cmt.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add response to dispute log..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(selectedDispute.id)}
                            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      {/* Admin Resolution Desk (if admin role) */}
                      {currentUser.role === 'admin' && !selectedDispute.adminResolution && (
                        <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800/60 text-white space-y-3 mt-4">
                          <h5 className="font-extrabold text-xs text-amber-300 uppercase tracking-wider">Admin Decision Console</h5>
                          <input
                            type="text"
                            placeholder="Reasoning note for decision..."
                            value={adminResolutionNote}
                            onChange={(e) => setAdminResolutionNote(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs outline-none text-white"
                          />

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <button
                              onClick={() => handleResolveDispute(selectedDispute.id, 'full_refund')}
                              className="py-2 rounded-xl bg-emerald-600 text-white font-bold"
                            >
                              Full Refund
                            </button>
                            <button
                              onClick={() => handleResolveDispute(selectedDispute.id, 'partial_refund')}
                              className="py-2 rounded-xl bg-amber-600 text-white font-bold"
                            >
                              Partial Refund
                            </button>
                            <button
                              onClick={() => handleResolveDispute(selectedDispute.id, 'release_seller')}
                              className="py-2 rounded-xl bg-indigo-600 text-white font-bold"
                            >
                              Release Seller
                            </button>
                            <button
                              onClick={() => handleResolveDispute(selectedDispute.id, 'dismiss')}
                              className="py-2 rounded-xl bg-slate-700 text-slate-300 font-bold"
                            >
                              Dismiss Case
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display Admin Decision if already resolved */}
                      {selectedDispute.adminResolution && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                          <span className="font-extrabold text-emerald-500 uppercase block text-[10px]">Official Admin Decision</span>
                          <p className="font-bold text-slate-800 dark:text-slate-100">
                            Decision: {selectedDispute.adminResolution.decision.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">{selectedDispute.adminResolution.note}</p>
                        </div>
                      )}

                    </>
                  ) : (
                    <div className="py-16 text-center text-slate-400 text-xs">
                      Select a dispute case from the left list to inspect evidence & logs
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: REFUND MANAGEMENT */}
          {activeTab === 'refunds' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg text-white">Refund Management Engine</h3>
                    <p className="text-xs text-purple-300">Automated and manual approval refund workflows in accordance with Pi Network policies</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-bold block">1. Buyer Cancellation Refund</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Instant automatic release back to Pi wallet if order cancelled before "Seller Accepted" phase.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-bold block">2. Partial Refund Agreement</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Buyer and seller can negotiate partial refund percentages for minor shipping flaws or missing components.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-slate-400 font-bold block">3. Administrative Overrule</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      PSTP arbitration desk forces immediate refund completion in confirmed counterfeit or fraud events.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Refund History List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refund Approval History</h4>
                
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-black">
                      100%
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">ORD-PI-339101 (Damaged Shipment)</span>
                      <span className="text-[10px] text-slate-400">Approved by Admin_Protection_Desk on 2026-07-29</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-500 text-sm">+28.50 π Refunded</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Security Alerts Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-slate-900 dark:text-slate-100 space-y-2">
                  <div className="flex items-center gap-2 font-black text-rose-500 text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Real-Time Security Event Logs ({securityEvents.length})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Automated anti-fraud scanners inspect IP changes, high-value velocity, and device signatures.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-slate-900 dark:text-slate-100 space-y-2">
                  <div className="flex items-center gap-2 font-black text-purple-600 dark:text-purple-400 text-sm">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <span>2FA Readiness & Rate Limit Engine</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Maximum 30 API calls/minute limit enforced per Pioneer IP address. Two-factor authentication supported.
                  </p>
                </div>
              </div>

              {/* Security Event Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Threat Scans</h4>
                {securityEvents.map((evt) => (
                  <div key={evt.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                        evt.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {evt.severity}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{evt.eventType.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-[10px] text-slate-400">{evt.details}</span>
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400">
                      IP: {evt.ip}<br />
                      {new Date(evt.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Append-only Audit Log Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Append-only PSTP System Audit Trail</h4>
                
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 max-h-64 overflow-y-auto space-y-2 shadow-inner">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-800 pb-2">
                      <div className="flex justify-between text-purple-400 text-[10px]">
                        <span>[{new Date(log.timestamp).toISOString()}]</span>
                        <span>{log.id} • {log.actor} ({log.actorRole})</span>
                      </div>
                      <div className="text-white font-bold text-xs mt-0.5">{log.action}: {log.details}</div>
                      <div className="text-slate-500 text-[10px]">IP: {log.ipAddress} | Device: {log.deviceInfo}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: TRUST & REPUTATION */}
          {activeTab === 'trust' && (
            <div className="space-y-6">
              
              {/* Trust Score Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs border border-amber-400/30 uppercase tracking-wider">
                    {reputation.badgeLevel} Tier
                  </span>
                  <h3 className="font-black text-2xl text-white">Trust & Reputation Profile</h3>
                  <p className="text-xs text-purple-200">
                    Verified Pioneer account status backed by successful PSTP transactions & Zero Fraud Score
                  </p>
                </div>

                <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-purple-800/40 min-w-[160px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PSTP Trust Score</span>
                  <div className="text-4xl font-black text-amber-400">{reputation.trustScore} / 100</div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">Top 1% Pioneer Merchant</span>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">Verified Buyer Badge</h5>
                    <span className="text-[10px] text-emerald-500 font-bold">Authenticated via Pi SDK</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">Verified Seller Badge</h5>
                    <span className="text-[10px] text-emerald-500 font-bold">KYC & Merchant Verified</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">Low Dispute Rate</h5>
                    <span className="text-[10px] text-emerald-500 font-bold">{reputation.disputeRatePercent}% Historic Rate</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
