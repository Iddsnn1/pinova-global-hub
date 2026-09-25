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
      throw new Error(`INVALID_ORDER_LIFECYCLE_TRANSITION:${order.pstpStatus}->${nextStatus}`);
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

/**
 * Legacy compatibility surface only.
 *
 * Fulfillment must be driven by persisted server-authoritative order events.
 * This class deliberately refuses to invent tokens, warehouses, carriers,
 * timestamps, or fulfillment completion.
 */
export class OrderFulfillmentEngine {
  processFulfillment(_order: Order): FulfillmentRecord {
    throw new Error('FULFILLMENT_REQUIRES_AUTHORITATIVE_SERVER_EVENT');
  }
}

export class LogisticsShippingManager {
  private supportedCarriers = [
    { code: 'DHL', name: 'DHL Express Global' },
    { code: 'FEDEX', name: 'FedEx International' },
    { code: 'SAFARICOM', name: 'Safaricom Express Logistics' },
    { code: 'LOCAL_COURIER', name: 'Local Pi Partner Courier' },
    { code: 'PICKUP', name: 'PiNova Click & Collect Station' }
  ];

  getAvailableCarriers() {
    return this.supportedCarriers;
  }

  /**
   * Shipping labels may only represent carrier/tracking data already recorded
   * on the authoritative order. No synthetic tracking number, address,
   * warehouse, weight, or ETA is generated here.
   */
  generateShippingLabel(order: Order, carrierCode?: string): ShippingLabel {
    const carrier = String(order.carrier || '').trim();
    const trackingNumber = String(order.trackingNumber || '').trim();

    if (!carrier || !trackingNumber) {
      throw new Error('SHIPPING_LABEL_REQUIRES_RECORDED_CARRIER_AND_TRACKING');
    }

    if (carrierCode && carrier.toLowerCase() !== carrierCode.trim().toLowerCase()) {
      throw new Error('SHIPPING_LABEL_CARRIER_MISMATCH');
    }

    if (!order.shippingAddress) {
      throw new Error('SHIPPING_LABEL_REQUIRES_SHIPPING_ADDRESS');
    }

    const recipientName = String(order.shippingAddress.fullName || '').trim();
    const recipientAddress = [
      order.shippingAddress.street,
      order.shippingAddress.city,
      order.shippingAddress.country
    ].filter(Boolean).join(', ');

    if (!recipientName || !recipientAddress) {
      throw new Error('SHIPPING_LABEL_REQUIRES_COMPLETE_SHIPPING_ADDRESS');
    }

    return {
      id: `LABEL-${order.id}-${trackingNumber}`,
      orderId: order.id,
      carrier,
      trackingNumber,
      senderName: order.items[0]?.product.sellerName || 'PiNova Global Vendor Store',
      senderAddress: '',
      recipientName,
      recipientAddress,
      weightKg: 0,
      labelFormat: 'PDF',
      barcodeData: trackingNumber,
      issuedAt: new Date().toISOString()
    };
  }

  /**
   * Returns only milestones that are actually recorded on the order.
   * This must never fabricate carrier progress from wall-clock time.
   */
  getDeliveryMilestones(order: Order) {
    const timeline = Array.isArray(order.timeline) ? order.timeline : [];
    const milestoneStatuses: PstpOrderStatus[] = [
      'Packed',
      'Shipped',
      'In Transit',
      'Out for Delivery',
      'Delivered'
    ];

    return milestoneStatuses
      .map((status) => {
        const event = timeline.find((entry) => entry.status === status);
        if (!event) return null;

        return {
          title:
            status === 'Packed' ? 'Seller Confirmed & Item Packed' :
            status === 'Shipped' ? 'Dispatched with Carrier' :
            status === 'In Transit' ? 'In Transit / Hub Transfer' :
            status === 'Out for Delivery' ? 'Out for Delivery' :
            'Delivered to Recipient',
          status,
          timestamp: event.timestamp,
          location:
            status === 'Shipped'
              ? order.carrier || 'Carrier'
              : status === 'Delivered'
                ? (order.shippingAddress
                    ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                    : 'Destination Address')
                : undefined,
          completed: true
        };
      })
      .filter((milestone): milestone is NonNullable<typeof milestone> => Boolean(milestone));
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
    const taxPi = subtotalPi * 0.05;
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
