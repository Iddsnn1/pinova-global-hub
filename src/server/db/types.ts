export interface PaymentLedgerEntity {
  paymentId: string;
  orderId?: string;
  buyerUsername?: string;
  sellerName?: string;
  amountPi?: number;
  txid?: string;
  status: 'APPROVED' | 'COMPLETED' | 'INCOMPLETE' | 'FAILED' | 'CANCELLED';
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  completionStatus: 'COMPLETED' | 'PENDING' | 'FAILED';
  idempotencyKey?: string;
  verifiedAt?: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface PstpAuditLogEntity {
  id: string;
  orderId?: string;
  paymentId?: string;
  actor: string;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
  action: string;
  details: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
}

export interface DisputeEvidenceFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DisputeComment {
  id: string;
  sender: string;
  role: 'buyer' | 'seller' | 'admin' | 'system';
  text: string;
  timestamp: string;
}

export interface DisputeAdminResolution {
  decision: string;
  note: string;
  refundAmountPi: number;
  resolvedBy: string;
  resolvedAt: string;
}

export interface PstpDisputeEntity {
  id: string;
  orderId: string;
  buyerUsername: string;
  sellerUsername: string;
  reason: string;
  description: string;
  amountPi: number;
  status: 'open' | 'seller_responded' | 'under_review' | 'resolved_refunded' | 'resolved_rejected' | 'closed';
  evidenceFiles: DisputeEvidenceFile[];
  comments: DisputeComment[];
  adminResolution?: DisputeAdminResolution;
  createdAt: string;
  updatedAt: string;
}

export interface FlightFulfillmentEntity {
  id: string;
  key: string; // paymentId or custom idempotencyKey
  paymentId: string;
  bookingAttemptId?: string;
  offerId?: string;
  idempotencyKey?: string;
  pnr: string | null;
  bookingReference: string; // Airline PNR
  duffelOrderId?: string | null; // Duffel internal order ID
  ticketNumber: string | null;
  bookingStatus:
    | 'TICKET_ISSUED'
    | 'VERIFIED_CARRIER_VOUCHER_ISSUED'
    | 'BOOKING_FAILED_HELD_FOR_REFUND'
    | 'BOOKING_RECONCILIATION_REQUIRED'
    | 'BOOKING_OUTCOME_UNKNOWN'
    | 'HELD_IN_ESCROW'
    | 'CANCELLED';
  reconciliationStatus?: 'NOT_REQUIRED' | 'PENDING' | 'RECONCILED_SUCCESS' | 'RECONCILED_FAILED' | 'UNKNOWN';
  provider: string;
  passengerName: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
  bookingMode?: 'LIVE_DUFFEL' | 'VERIFIED_CARRIER';
  isLiveBooking?: boolean;
  message?: string;
  metadata?: Record<string, any>;
}

export interface UtilityFulfillmentEntity {
  id: string;
  key: string; // paymentId or custom idempotencyKey
  transactionId: string;
  paymentId: string;
  txid: string;
  status: 'FULFILLED' | 'FULFILLMENT_PENDING' | 'FAILED';
  message: string;
  category: string;
  providerId: string;
  accountNumber: string;
  fiatAmount: number;
  piAmount: number;
  packageName: string;
  timestamp: string;
  providerReference?: string;
  metadata?: Record<string, any>;
}

export interface SecurityEventEntity {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  username?: string;
  ip: string;
  device: string;
  location?: string;
  details: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdempotencyEntity {
  key: string;
  result: any;
  createdAt: string;
  expiresAt: number;
}
