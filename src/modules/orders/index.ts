import { 
  Order, 
  PstpOrderStatus, 
  StatusTransitionLog, 
  AuditLogEntry, 
  FulfillmentRecord, 
  ShippingLabel, 
  ReturnRequest, 
  Dispute, 
  DigitalReceipt
} from '../../types';
import { NotificationModule } from '../notification';

// Allowable transitions mapping for strict order lifecycle enforcement
const ALLOWED_TRANSITIONS: Partial<Record<PstpOrderStatus, PstpOrderStatus[]>> = {
  'Draft': ['Pending Payment', 'Cancelled'],
  'Pending Payment': ['Payment Authorized', 'Cancelled'],
  'Payment Authorized': ['Payment Verified', 'Cancelled'],
  'Payment Verified': ['Transaction Recorded', 'Refunded', 'Cancelled'],
  'Transaction Recorded': ['Order Confirmed', 'Refunded', 'Cancelled'],
  'Order Confirmed': ['Seller Accepted', 'Processing', 'Preparing Shipment', 'Refunded', 'Cancelled'],
  'Seller Accepted': ['Preparing Order', 'Processing', 'Preparing Shipment'],
  'Processing': ['Preparing Order', 'Preparing Shipment', 'Packed', 'Ready for Pickup', 'Shipped', 'Refunded', 'Cancelled'],
  'Preparing Order': ['Packed', 'Preparing Shipment', 'Shipped'],
  'Preparing Shipment': ['Packed', 'Ready for Pickup', 'Shipped', 'Refunded', 'Cancelled'],
  'Packed': ['Ready for Pickup', 'Shipped', 'Out for Delivery'],
  'Ready for Pickup': ['Delivered', 'Cancelled'],
  'Shipped': ['In Transit', 'Out for Delivery', 'Delivered', 'Disputed'],
  'Out for Delivery': ['Delivered', 'Disputed'],
  'In Transit': ['Delivered', 'Disputed'],
  'Delivered': ['Buyer Confirmation', 'Completed', 'Refund Requested', 'Refunded', 'Disputed'],
  'Buyer Confirmation': ['Completed', 'Disputed', 'Refunded'],
  'Completed': ['Closed', 'Refunded', 'Disputed'],
  'Cancelled': ['Closed'],
  'Refund Requested': ['Refund Completed', 'Refunded', 'Disputed'],
  'Refund Completed': ['Closed'],
  'Refunded': ['Closed'],
  'Disputed': ['Resolved', 'Completed', 'Refunded', 'Closed'],
  'Resolved': ['Closed'],
  'Closed': []
};

export class OrderLifecycleManager {
  private notificationModule = new NotificationModule();

  isValidTransition(currentStatus: PstpOrderStatus, nextStatus: PstpOrderStatus): boolean {
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    return allowed.includes(nextStatus);
  }

  transitionState(
    order: Order, 
    nextStatus: PstpOrderStatus, 
    actor: string, 
    actorRole: 'buyer' | 'seller' | 'admin' | 'system',
    note?: string
  ): { updatedOrder: Order; auditLog: AuditLogEntry; notificationSent: boolean } {
    if (!this.isValidTransition(order.pstpStatus, nextStatus)) {
      console.warn(`[OrderLifecycle] Transition from '${order.pstpStatus}' to '${nextStatus}' is invalid. Overriding with system/admin rule.`);
    }

    const logEntry: StatusTransitionLog = {
      status: nextStatus,
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      note
    };

    const auditLog: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      paymentId: order.piPaymentId,
      actor,
      actorRole,
      action: `ORDER_STATUS_CHANGED_${nextStatus.toUpperCase().replace(/\s+/g, '_')}`,
      details: `Transitioned from '${order.pstpStatus}' to '${nextStatus}'. Note: ${note || 'None'}`,
      ipAddress: '127.0.0.1 (Sandbox Gateway)',
      deviceInfo: 'Pi Browser / PiNova Gateway',
      timestamp: new Date().toISOString()
    };

    const updatedOrder: Order = {
      ...order,
      pstpStatus: nextStatus,
      updatedAt: new Date().toISOString(),
      timeline: [...(order.timeline || []), logEntry]
    };

    // Auto Dispatch Notification
    let notificationSent = false;
    try {
      this.notificationModule.createNotification(
        'order',
        `Order Update #${order.id.slice(0, 8)}: ${nextStatus}`,
        `Your order status is now: ${nextStatus}. ${note ? `Note: ${note}` : ''}`
      );
      notificationSent = true;
    } catch (e) {
      console.error('[NotificationError]', e);
    }

    return { updatedOrder, auditLog, notificationSent };
  }

  recordAdminCorrection(
    order: Order,
    actor: string,
    reason: string,
    correctionDetails: string,
    relatedEventRef?: string
  ): { updatedOrder: Order; auditLog: AuditLogEntry } {
    const logEntry: StatusTransitionLog = {
      status: order.pstpStatus,
      timestamp: new Date().toISOString(),
      actor,
      actorRole: 'admin',
      note: `ADMIN_CORRECTION [Ref: ${relatedEventRef || 'N/A'}]: ${reason} - ${correctionDetails}`
    };

    const auditLog: AuditLogEntry = {
      id: `audit-corr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      paymentId: order.piPaymentId,
      actor,
      actorRole: 'admin',
      action: 'ADMIN_CORRECTION',
      details: `Admin correction recorded for order #${order.id}. Reason: ${reason}. Related Ref: ${relatedEventRef || 'N/A'}. Details: ${correctionDetails}`,
      ipAddress: '127.0.0.1 (Sandbox Gateway)',
      deviceInfo: 'Pi Nova Admin Console',
      timestamp: new Date().toISOString()
    };

    const updatedOrder: Order = {
      ...order,
      updatedAt: new Date().toISOString(),
      timeline: [...(order.timeline || []), logEntry]
    };

    return { updatedOrder, auditLog };
  }
}

export class OrderFulfillmentEngine {
  processFulfillment(order: Order): FulfillmentRecord {
    const isDigital = order.items.some(i => i.product.category === 'digital' || i.product.category === 'giftcard');
    const isUtility = order.items.some(i => i.product.category === 'utility' || i.product.category === 'airtime');

    let fulfillmentType: FulfillmentRecord['fulfillmentType'] = 'warehouse';
    let digitalTokens: string[] = [];

    if (isUtility) {
      fulfillmentType = 'utility';
      digitalTokens = order.items.map(i => `UTILITY-TOKEN-${Math.floor(Math.random() * 900000000 + 100000000)}`);
    } else if (isDigital) {
      fulfillmentType = 'digital';
      digitalTokens = order.items.map(i => i.product.digitalKey || `KEY-${Math.floor(Math.random() * 900000 + 100000)}-PINOVA`);
    }

    return {
      id: `FULFILL-${Date.now()}`,
      orderId: order.id,
      fulfillmentType,
      status: 'fulfilled',
      assignedWarehouse: isDigital || isUtility ? 'Digital Cloud Hub' : 'Main Nairobi Fulfillment Center',
      carrier: isDigital || isUtility ? 'Direct Instant API Gateway' : 'Safaricom Express Logistics',
      trackingNumber: order.trackingNumber || `TRACK-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      digitalTokensReleased: digitalTokens,
      fulfilledBy: 'System Auto-Fulfillment Engine',
      fulfilledAt: new Date().toISOString(),
      notes: `Automated fulfillment execution completed for order type: ${fulfillmentType}`
    };
  }
}

export class LogisticsShippingManager {
  private supportedCarriers = [
    { code: 'DHL', name: 'DHL Express Global', estimatedDays: '2-4 Business Days' },
    { code: 'FEDEX', name: 'FedEx International', estimatedDays: '3-5 Business Days' },
    { code: 'SAFARICOM', name: 'Safaricom Express Logistics', estimatedDays: '1-2 Days' },
    { code: 'LOCAL_COURIER', name: 'Local Pi Partner Courier', estimatedDays: 'Same Day / Next Day' },
    { code: 'PICKUP', name: 'PiNova Click & Collect Station', estimatedDays: 'Instant / Ready for Pickup' }
  ];

  getAvailableCarriers() {
    return this.supportedCarriers;
  }

  generateShippingLabel(order: Order, carrierCode: string = 'SAFARICOM'): ShippingLabel {
    const carrierObj = this.supportedCarriers.find(c => c.code === carrierCode) || this.supportedCarriers[2];
    const trackingNum = `PNV-${carrierCode}-${Date.now().toString().slice(-6)}`;

    return {
      id: `LABEL-${Date.now()}`,
      orderId: order.id,
      carrier: carrierObj.name,
      trackingNumber: trackingNum,
      senderName: order.items[0]?.product.sellerName || 'PiNova Global Vendor Store',
      senderAddress: 'Vendor Fulfillment Hub, Hub 04, Pi Plaza',
      recipientName: order.shippingAddress?.fullName || order.buyerUsername,
      recipientAddress: order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'Digital Delivery Address',
      weightKg: 1.25,
      labelFormat: 'PDF',
      barcodeData: `*${trackingNum}*`,
      issuedAt: new Date().toISOString()
    };
  }

  getDeliveryMilestones(trackingNumber: string) {
    return [
      { title: 'Order Confirmed & Prepared', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), location: 'Vendor Warehouse', completed: true },
      { title: 'Picked Up by Carrier', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), location: 'Central Logistics Hub', completed: true },
      { title: 'In Transit / Custom Clearance', timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(), location: 'Regional Distribution Center', completed: true },
      { title: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), location: 'Local Courier Station', completed: true },
      { title: 'Delivered to Recipient', timestamp: new Date().toISOString(), location: 'Destination Address', completed: false }
    ];
  }
}

export class ReturnRefundManager {
  private returnRequests: ReturnRequest[] = [];

  createReturnRequest(
    orderId: string, 
    buyerUsername: string, 
    sellerUsername: string, 
    reason: ReturnRequest['reason'], 
    description: string, 
    refundAmountPi: number,
    evidenceImages: string[] = []
  ): ReturnRequest {
    const req: ReturnRequest = {
      id: `RET-${Date.now()}`,
      orderId,
      buyerUsername,
      sellerUsername,
      reason,
      description,
      evidenceImages,
      status: 'PENDING_SELLER_REVIEW',
      refundAmountPi,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.returnRequests.push(req);
    return req;
  }

  getReturnRequestsByOrder(orderId: string): ReturnRequest[] {
    return this.returnRequests.filter(r => r.orderId === orderId);
  }

  updateReturnStatus(
    returnId: string, 
    status: ReturnRequest['status'], 
    responseNote?: string,
    returnTrackingNumber?: string
  ): ReturnRequest | undefined {
    const req = this.returnRequests.find(r => r.id === returnId);
    if (!req) return undefined;
    req.status = status;
    req.sellerResponseNote = responseNote;
    if (returnTrackingNumber) req.returnTrackingNumber = returnTrackingNumber;
    req.updatedAt = new Date().toISOString();
    return req;
  }
}

export class DisputeArbitrationManager {
  private disputes: Dispute[] = [];

  openDispute(
    orderId: string,
    buyerUsername: string,
    sellerUsername: string,
    reason: string,
    description: string,
    amountPi: number
  ): Dispute {
    const dispute: Dispute = {
      id: `DISP-${Date.now()}`,
      orderId,
      buyerUsername,
      sellerUsername,
      reason,
      description,
      amountPi,
      status: 'open',
      evidenceFiles: [],
      comments: [
        {
          id: `COMM-${Date.now()}`,
          sender: buyerUsername,
          role: 'buyer',
          text: `Opened dispute: ${description}`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.disputes.push(dispute);
    return dispute;
  }

  addComment(disputeId: string, sender: string, role: 'buyer' | 'seller' | 'admin', text: string): Dispute | undefined {
    const dispute = this.disputes.find(d => d.id === disputeId);
    if (!dispute) return undefined;
    dispute.comments.push({
      id: `COMM-${Date.now()}`,
      sender,
      role,
      text,
      timestamp: new Date().toISOString()
    });
    dispute.updatedAt = new Date().toISOString();
    if (role === 'seller' && dispute.status === 'open') {
      dispute.status = 'seller_responded';
    }
    return dispute;
  }

  resolveDisputeByAdmin(
    disputeId: string,
    decision: 'full_refund' | 'partial_refund' | 'release_seller' | 'dismiss',
    note: string,
    adminUsername: string = 'AdminArbitration',
    refundAmountPi?: number
  ): Dispute | undefined {
    const dispute = this.disputes.find(d => d.id === disputeId);
    if (!dispute) return undefined;
    dispute.adminResolution = {
      decision,
      note,
      refundAmountPi: refundAmountPi || (decision === 'full_refund' ? dispute.amountPi : 0),
      resolvedBy: adminUsername,
      resolvedAt: new Date().toISOString()
    };
    dispute.status = decision === 'release_seller' || decision === 'dismiss' ? 'resolved_rejected' : 'resolved_refunded';
    dispute.updatedAt = new Date().toISOString();
    return dispute;
  }

  getDisputes(): Dispute[] {
    return this.disputes;
  }
}

export class DigitalReceiptGenerator {
  generateReceipt(order: Order): DigitalReceipt {
    const subtotalPi = order.items.reduce((acc, i) => acc + (i.product.pricePi * i.quantity), 0);
    const taxPi = subtotalPi * 0.05; // 5% reference tax
    const shippingPi = order.items.some(i => i.product.category === 'physical') ? 5.0 : 0.0;
    const discountPi = order.totalPi < subtotalPi ? (subtotalPi + taxPi + shippingPi) - order.totalPi : 0;

    return {
      receiptId: `RCPT-${order.id.slice(0, 8).toUpperCase()}`,
      orderId: order.id,
      piPaymentId: order.piPaymentId || `PI-PAY-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      piTxid: order.piTxid || `PI-TX-${Math.floor(Math.random() * 900000000 + 100000000)}`,
      buyerUsername: order.buyerUsername,
      sellerName: order.items[0]?.product.sellerName || 'PiNova Global Vendor',
      items: order.items.map(i => ({
        title: i.product.title,
        quantity: i.quantity,
        unitPricePi: i.product.pricePi,
        totalPi: i.product.pricePi * i.quantity
      })),
      subtotalPi,
      taxPi,
      shippingPi,
      discountPi: Math.max(0, discountPi),
      totalPi: order.totalPi,
      timestamp: order.createdAt,
      qrCodeVerificationUrl: `https://pinova.net/verify-receipt?id=${order.id}`
    };
  }
}

export class OrderOrchestrationService {
  lifecycleManager = new OrderLifecycleManager();
  fulfillmentEngine = new OrderFulfillmentEngine();
  logisticsManager = new LogisticsShippingManager();
  returnRefundManager = new ReturnRefundManager();
  disputeManager = new DisputeArbitrationManager();
  receiptGenerator = new DigitalReceiptGenerator();
}

