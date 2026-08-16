export * from './types/utility';

export type UserRole = 'buyer' | 'seller' | 'admin';

export type ProductCategory = 'physical' | 'digital' | 'service' | 'airtime' | 'utility' | 'giftcard';
export type ProductType = 'physical' | 'digital' | 'service';
export type FulfillmentType = 'shipping' | 'digital_download' | 'instant_key' | 'service_delivery' | 'airtime_topup' | 'utility_token';
export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order' | 'digital_unlimited';

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  priceDeltaPi?: number;
  stock: number;
  attributes: Record<string, string>; // size, color, storage, material, weight, etc.
  imageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  pricePi: number;
  category: ProductCategory;
  subcategory: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  features: string[];
  specs?: Record<string, string>;
  productType?: ProductType;
  fulfillmentType?: FulfillmentType;
  availabilityStatus?: AvailabilityStatus;
  fiatReferencePrice?: { amount: number; currency: string };
  serviceLocation?: string;
  serviceDuration?: string;
  digitalDeliveryType?: 'instant_download' | 'license_key' | 'account_access' | 'custom_file';
  digitalDownloadUrl?: string;
  digitalKey?: string;
  airtimeNetwork?: string;
  utilityProvider?: string;
  shippingWeightKg?: number;
  shippingOrigin?: string;
  estimatedDeliveryDays?: string;
  tags: string[];
  discountPercent?: number;
  featured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // Enterprise Enhancements
  variants?: ProductVariant[];
  videoUrl?: string;
  media360Urls?: string[];
  downloadLimit?: number;
  licenseKeys?: string[];
  seoSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  moderationStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'REPORTED';
  moderationReason?: string;
  barcode?: string;
}

// PSTP Granular Order Lifecycle Hierarchy
export type PstpOrderStatus = 
  | 'Draft'
  | 'Pending Payment'
  | 'Payment Authorized'
  | 'Payment Verified'
  | 'Transaction Recorded'
  | 'Order Confirmed'
  | 'Seller Accepted'
  | 'Processing'
  | 'Preparing Order'
  | 'Preparing Shipment'
  | 'Packed'
  | 'Ready for Pickup'
  | 'Shipped'
  | 'Out for Delivery'
  | 'In Transit'
  | 'Delivered'
  | 'Buyer Confirmation'
  | 'Completed'
  | 'Cancelled'
  | 'Refund Requested'
  | 'Refund Completed'
  | 'Refunded'
  | 'Disputed'
  | 'Resolved'
  | 'Closed';

export type OrderType = 'physical' | 'digital' | 'utility' | 'giftcard' | 'service';

export interface ReturnRequest {
  id: string;
  orderId: string;
  buyerUsername: string;
  sellerUsername: string;
  reason: 'defective' | 'item_not_as_described' | 'wrong_item' | 'late_delivery' | 'changed_mind' | 'other';
  description: string;
  evidenceImages: string[];
  status: 'PENDING_SELLER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ITEM_RETURNED' | 'REFUND_ISSUED' | 'DISPUTED';
  refundAmountPi: number;
  returnTrackingNumber?: string;
  returnCarrier?: string;
  sellerResponseNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  weightKg: number;
  labelFormat: 'PDF' | 'PNG' | 'ZPL';
  barcodeData: string;
  issuedAt: string;
}

export interface FulfillmentRecord {
  id: string;
  orderId: string;
  fulfillmentType: 'warehouse' | 'digital' | 'utility' | 'third_party' | 'manual';
  status: 'pending' | 'picking' | 'packed' | 'shipped' | 'fulfilled' | 'failed';
  assignedWarehouse?: string;
  carrier?: string;
  trackingNumber?: string;
  digitalTokensReleased?: string[];
  fulfilledBy: string;
  fulfilledAt?: string;
  notes?: string;
}

export interface DigitalReceipt {
  receiptId: string;
  orderId: string;
  piPaymentId: string;
  piTxid: string;
  buyerUsername: string;
  sellerName: string;
  items: Array<{ title: string; quantity: number; unitPricePi: number; totalPi: number }>;
  subtotalPi: number;
  discountPi: number;
  taxPi: number;
  shippingPi: number;
  totalPi: number;
  timestamp: string;
  qrCodeVerificationUrl: string;
}

export type EscrowStatus = 
  | 'payment_pending'
  | 'approved'
  | 'in_escrow'
  | 'shipped'
  | 'delivered'
  | 'released'
  | 'disputed'
  | 'refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  customDetails?: {
    variant?: ProductVariant;
    phoneNumber?: string;
    accountNumber?: string;
    recipientEmail?: string;
    serviceBrief?: string;
  };
}

export type CartItem = OrderItem;

export interface StatusTransitionLog {
  status: PstpOrderStatus;
  timestamp: string;
  actor: string;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
  note?: string;
}

export interface Order {
  id: string; // UUID primary key
  buyerUsername: string;
  items: OrderItem[];
  totalPi: number;
  escrowStatus: EscrowStatus;
  pstpStatus: PstpOrderStatus;
  piPaymentId?: string;
  piTxid?: string;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  digitalDeliveries?: {
    productId: string;
    codeOrUrl: string;
    title: string;
  }[];
  disputeReason?: string;
  timeline: StatusTransitionLog[];
  serverVerified?: boolean;
  securityFlag?: boolean;
}

export interface AuditLogEntry {
  id: string; // UUID primary key
  orderId?: string;
  paymentId?: string;
  actor: string;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
  action: string;
  details: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
  isDeleted?: boolean;
}

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'document';
  uploadedBy: string;
  uploadedAt: string;
}

export interface DisputeComment {
  id: string;
  sender: string;
  role: 'buyer' | 'seller' | 'admin';
  text: string;
  timestamp: string;
}

export interface Dispute {
  id: string; // UUID primary key
  orderId: string;
  buyerUsername: string;
  sellerUsername: string;
  reason: string;
  description: string;
  amountPi: number;
  status: 'open' | 'seller_responded' | 'under_review' | 'resolved_refunded' | 'resolved_rejected';
  evidenceFiles: EvidenceFile[];
  comments: DisputeComment[];
  adminResolution?: {
    decision: 'full_refund' | 'partial_refund' | 'release_seller' | 'dismiss';
    note: string;
    refundAmountPi?: number;
    resolvedBy: string;
    resolvedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface RefundRecord {
  id: string; // UUID primary key
  orderId: string;
  buyerUsername: string;
  sellerUsername: string;
  amountPi: number;
  refundType: 'full' | 'partial';
  status: 'requested' | 'approved' | 'processing' | 'completed' | 'rejected';
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface SecurityEvent {
  id: string; // UUID primary key
  eventType: 'suspicious_login' | 'rate_limit_exceeded' | 'fraud_flag' | 'large_transaction' | 'ip_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  username: string;
  ip: string;
  device: string;
  location: string;
  details: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface PaymentRecord {
  id: string; // UUID primary key
  piPaymentId: string;
  piTxid: string;
  buyerUsername: string;
  sellerUsername: string;
  amountPi: number;
  status: 'initiated' | 'server_approved' | 'tx_verified' | 'completed' | 'failed';
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface UserReputation {
  username: string;
  role: 'buyer' | 'seller';
  trustScore: number; // 0 - 100
  isVerifiedBuyer: boolean;
  isVerifiedSeller: boolean;
  completedOrders: number;
  disputeRatePercent: number;
  ratingsCount: number;
  avgRating: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Enterprise Platinum';
}

export type MerchantVerificationStatus = 'Verified' | 'Pending Verification' | 'Unverified' | 'Suspended';
export type MerchantSellerStatus = 'Active' | 'Inactive' | 'Probation' | 'Suspended';

export interface MerchantPolicy {
  shippingPolicy?: string;
  refundPolicy?: string;
  digitalDeliveryTerms?: string;
  supportTerms?: string;
  averageDispatchTime?: string;
}

export interface Vendor {
  id: string;
  sellerUsername: string;
  storeName: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  verificationStatus?: MerchantVerificationStatus;
  sellerStatus?: MerchantSellerStatus;
  totalSalesPi: number;
  bannerImage: string;
  logoImage: string;
  joinedDate: string;
  country?: string;
  shippingCountries: string[];
  productCount?: number;
  followersCount?: number;
  policies?: MerchantPolicy;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  reputationScore?: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export type Merchant = Vendor;

export interface Review {
  id: string;
  productId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpendPi: number;
  active: boolean;
  expiresAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'escrow' | 'system' | 'message' | 'dispute' | 'refund' | 'security' | 'order_protection';
  timestamp: string;
  read: boolean;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  text: string;
  orderId?: string;
  timestamp: string;
  read: boolean;
}

export interface PiUser {
  username: string;
  uid: string;
  walletAddress?: string;
  accessToken?: string;
  authenticated: boolean;
  role: 'buyer' | 'seller' | 'admin';
  twoFactorEnabled?: boolean;
  trustScore?: number;
  isVerifiedBuyer?: boolean;
  isVerifiedSeller?: boolean;
  reputationScore?: number;
}

// Module 5 — Merchant & Business Ecosystem Types
export type MerchantStoreType = 
  | 'individual' 
  | 'business' 
  | 'brand' 
  | 'enterprise' 
  | 'franchise' 
  | 'wholesale' 
  | 'distributor';

export type MerchantVerificationLevel = 
  | 'individual' 
  | 'registered_business' 
  | 'verified_business' 
  | 'premium_merchant' 
  | 'enterprise_merchant' 
  | 'official_brand' 
  | 'authorized_distributor';

export type StaffRole = 'owner' | 'admin' | 'manager' | 'sales' | 'support' | 'warehouse' | 'finance';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  permissions: string[];
  joinedAt: string;
  status: 'active' | 'invited' | 'disabled';
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  country: string;
  capacityUnits: number;
  currentStockUnits: number;
  isPrimary: boolean;
  managerName?: string;
}

export interface InventoryRecord {
  id: string;
  sku: string;
  productId: string;
  productTitle: string;
  warehouseId: string;
  warehouseName: string;
  stockOnHand: number;
  reservedStock: number;
  reorderPoint: number;
  batchNumber: string;
  barcode: string;
  lastRestocked: string;
}

export interface StockTransfer {
  id: string;
  fromWarehouse: string;
  toWarehouse: string;
  sku: string;
  productTitle: string;
  quantity: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  transferredBy: string;
  date: string;
}

export interface CrmCustomer {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  totalOrders: number;
  totalSpentPi: number;
  lastOrderDate: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP Pioneer';
  notes: string;
  supportTicketCount: number;
  tags: string[];
}

export interface VerificationDoc {
  id: string;
  docType: 'business_license' | 'tax_id' | 'identity_proof' | 'brand_auth' | 'domain_verify';
  fileName: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  note?: string;
}

export interface MerchantStore {
  id: string;
  sellerUsername: string;
  storeName: string;
  storeType: MerchantStoreType;
  description: string;
  logoImage: string;
  bannerImage: string;
  email: string;
  phone: string;
  businessHours: string;
  location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  websiteUrl?: string;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
  };
  verificationLevel: MerchantVerificationLevel;
  rating: number;
  reviewsCount: number;
  followersCount: number;
  totalSalesPi: number;
  joinedDate: string;
  shippingCountries: string[];
  warehouses: Warehouse[];
  staff: StaffMember[];
  verificationDocs: VerificationDoc[];
  isDefault?: boolean;
}

