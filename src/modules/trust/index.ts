import { Order, Product } from '../../types';

export type VerificationLevel = 
  | 'Basic User'
  | 'Verified Pioneer'
  | 'Verified Buyer'
  | 'Verified Seller'
  | 'Verified Business'
  | 'Trusted Merchant'
  | 'Enterprise Merchant';

export type TrustBadgeType = 
  | 'Verified Identity'
  | 'Verified Seller'
  | 'Verified Business'
  | 'Trusted Merchant'
  | 'Top Rated Seller'
  | 'Fast Shipping'
  | 'Excellent Support'
  | 'Recommended Store';

export interface VerificationRequirement {
  level: VerificationLevel;
  piAuthenticationRequired: boolean;
  minCompletedOrders: number;
  minRating: number;
  kycDocRequired: boolean;
  businessRegistrationRequired: boolean;
  manualAdminApprovalRequired: boolean;
  description: string;
}

export interface TrustBadge {
  id: TrustBadgeType;
  title: string;
  description: string;
  iconName: string;
  badgeColor: string;
  autoAssigned: boolean;
}

export interface ReputationMetrics {
  userId: string;
  username: string;
  role: 'buyer' | 'seller' | 'merchant';
  verificationLevel: VerificationLevel;
  badges: TrustBadgeType[];
  completedOrders: number;
  successfulDeliveries: number;
  customerRating: number;
  totalReviewsCount: number;
  responseTimeMinutes: number;
  orderCancellationRatePct: number;
  refundRatePct: number;
  disputeResolutionRatePct: number;
  policyComplianceScore: number; // 0 to 100
  trustScore: number; // 0 to 100
  calculatedAt: string;
}

export interface ReviewItem {
  id: string;
  productId?: string;
  productTitle?: string;
  sellerId: string;
  sellerName: string;
  buyerUsername: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  orderId?: string;
  helpfulVotes: number;
  reported: boolean;
  moderationStatus: 'APPROVED' | 'PENDING' | 'FLAGGED' | 'REJECTED';
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  targetId: string; // sellerId or buyerUsername
  targetType: 'buyer' | 'seller' | 'review' | 'order';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  evidence: string;
  detectedAt: string;
  resolved: boolean;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface VerificationRequest {
  id: string;
  applicantUsername: string;
  requestedLevel: VerificationLevel;
  documentsProvided: string[];
  businessTaxId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedBy?: string;
  adminNote?: string;
}

// Default Configuration Rules
export const VERIFICATION_REQUIREMENTS: Record<VerificationLevel, VerificationRequirement> = {
  'Basic User': {
    level: 'Basic User',
    piAuthenticationRequired: true,
    minCompletedOrders: 0,
    minRating: 0,
    kycDocRequired: false,
    businessRegistrationRequired: false,
    manualAdminApprovalRequired: false,
    description: 'Initial account authenticated via official Pi Browser SDK.'
  },
  'Verified Pioneer': {
    level: 'Verified Pioneer',
    piAuthenticationRequired: true,
    minCompletedOrders: 1,
    minRating: 4.0,
    kycDocRequired: false,
    businessRegistrationRequired: false,
    manualAdminApprovalRequired: false,
    description: 'Pioneer with authenticated Pi Wallet and confirmed marketplace transaction.'
  },
  'Verified Buyer': {
    level: 'Verified Buyer',
    piAuthenticationRequired: true,
    minCompletedOrders: 3,
    minRating: 4.5,
    kycDocRequired: false,
    businessRegistrationRequired: false,
    manualAdminApprovalRequired: false,
    description: 'Frequent marketplace buyer with high order fulfillment history.'
  },
  'Verified Seller': {
    level: 'Verified Seller',
    piAuthenticationRequired: true,
    minCompletedOrders: 10,
    minRating: 4.6,
    kycDocRequired: true,
    businessRegistrationRequired: false,
    manualAdminApprovalRequired: true,
    description: 'Identity-checked merchant with verified seller records.'
  },
  'Verified Business': {
    level: 'Verified Business',
    piAuthenticationRequired: true,
    minCompletedOrders: 25,
    minRating: 4.7,
    kycDocRequired: true,
    businessRegistrationRequired: true,
    manualAdminApprovalRequired: true,
    description: 'Registered business entity with full legal documentation.'
  },
  'Trusted Merchant': {
    level: 'Trusted Merchant',
    piAuthenticationRequired: true,
    minCompletedOrders: 50,
    minRating: 4.8,
    kycDocRequired: true,
    businessRegistrationRequired: true,
    manualAdminApprovalRequired: true,
    description: 'Top-tier merchant with exceptional delivery performance and high customer trust.'
  },
  'Enterprise Merchant': {
    level: 'Enterprise Merchant',
    piAuthenticationRequired: true,
    minCompletedOrders: 100,
    minRating: 4.9,
    kycDocRequired: true,
    businessRegistrationRequired: true,
    manualAdminApprovalRequired: true,
    description: 'Enterprise partner with dedicated support SLAs and direct API integration.'
  }
};

export const TRUST_BADGES_CATALOG: Record<TrustBadgeType, TrustBadge> = {
  'Verified Identity': {
    id: 'Verified Identity',
    title: 'Verified Pioneer Identity',
    description: 'Authenticated via official Pi Network Browser SDK v2',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    autoAssigned: true
  },
  'Verified Seller': {
    id: 'Verified Seller',
    title: 'Verified Merchant',
    description: 'Merchant identity and store credentials vetted by platform compliance',
    iconName: 'CheckCircle',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    autoAssigned: false
  },
  'Verified Business': {
    id: 'Verified Business',
    title: 'Registered Business Entity',
    description: 'Official corporate tax registration and business license verified',
    iconName: 'Building2',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    autoAssigned: false
  },
  'Trusted Merchant': {
    id: 'Trusted Merchant',
    title: 'Trusted Merchant Badge',
    description: 'Maintains >98% Trust Score and 50+ completed orders without disputes',
    iconName: 'Award',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    autoAssigned: true
  },
  'Top Rated Seller': {
    id: 'Top Rated Seller',
    title: 'Top Rated Seller',
    description: 'Consistently holds a 4.8+ star rating from verified purchasers',
    iconName: 'Star',
    badgeColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    autoAssigned: true
  },
  'Fast Shipping': {
    id: 'Fast Shipping',
    title: 'Ultra-Fast Dispatch',
    description: 'Dispatches physical orders within 24 hours of confirmation',
    iconName: 'Zap',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    autoAssigned: true
  },
  'Excellent Support': {
    id: 'Excellent Support',
    title: 'Rapid Support Response',
    description: 'Average inquiry response time under 15 minutes',
    iconName: 'MessageSquare',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
    autoAssigned: true
  },
  'Recommended Store': {
    id: 'Recommended Store',
    title: 'PiNova Recommended',
    description: 'Highlighted by marketplace compliance for high quality standards',
    iconName: 'ThumbsUp',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    autoAssigned: false
  }
};

export class TrustScoreCalculator {
  static calculateScore(metrics: Partial<ReputationMetrics>): number {
    const completedWeight = Math.min(100, ((metrics.completedOrders || 0) / 50) * 100) * 0.25;
    const ratingWeight = (((metrics.customerRating || 5.0) / 5.0) * 100) * 0.35;
    const cancellationPenalty = (metrics.orderCancellationRatePct || 0) * 1.5;
    const refundPenalty = (metrics.refundRatePct || 0) * 1.2;
    const complianceWeight = (metrics.policyComplianceScore ?? 100) * 0.40;

    const rawScore = completedWeight + ratingWeight + complianceWeight - cancellationPenalty - refundPenalty;
    return Math.max(10, Math.min(99.9, Math.round(rawScore * 10) / 10));
  }
}

export class FraudDetectionEngine {
  private alerts: FraudAlert[] = [
    {
      id: 'ALERT-801',
      targetId: 'seller_techhub',
      targetType: 'seller',
      severity: 'MEDIUM',
      reason: 'Rapid listing price reduction anomaly detected',
      evidence: 'Price decreased by 85% within 10 minutes across 12 items',
      detectedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      resolved: false
    },
    {
      id: 'ALERT-802',
      targetId: 'user_pioneer_99',
      targetType: 'buyer',
      severity: 'HIGH',
      reason: 'Multiple rapid refund requests submitted',
      evidence: 'Submitted 4 dispute claims within 24 hours on digital products',
      detectedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      resolved: false
    }
  ];

  analyzeSeller(sellerId: string, orders: Order[]): FraudAlert | null {
    const sellerOrders = orders.filter((o) => (o as any).sellerId === sellerId);
    const cancelled = sellerOrders.filter((o) => o.pstpStatus === 'Cancelled');
    
    if (sellerOrders.length >= 5 && cancelled.length / sellerOrders.length > 0.4) {
      const alert: FraudAlert = {
        id: `ALERT-${Date.now()}`,
        targetId: sellerId,
        targetType: 'seller',
        severity: 'HIGH',
        reason: 'Excessive order cancellation rate',
        evidence: `Cancelled ${cancelled.length} out of ${sellerOrders.length} recent orders.`,
        detectedAt: new Date().toISOString(),
        resolved: false
      };
      this.alerts.unshift(alert);
      return alert;
    }
    return null;
  }

  getAlerts(): FraudAlert[] {
    return this.alerts;
  }

  resolveAlert(alertId: string, adminUsername: string, note: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedBy = adminUsername;
      alert.resolutionNote = note;
    }
  }
}

export class ReviewAuthorizationEngine {
  private reviews: ReviewItem[] = [
    {
      id: 'REV-101',
      productId: 'prod-001',
      productTitle: 'PiNova Smart POS Terminal',
      sellerId: 'vendor-01',
      sellerName: 'PiNova Official Hardware Store',
      buyerUsername: 'pioneer_alex',
      rating: 5,
      title: 'Seamless Pi Payment Integration!',
      comment: 'Arrived in 3 days in Lagos. Verified payment via Pi Browser worked flawlessly!',
      isVerifiedPurchase: true,
      orderId: 'ORD-8812',
      helpfulVotes: 24,
      reported: false,
      moderationStatus: 'APPROVED',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'REV-102',
      productId: 'prod-002',
      productTitle: 'Safaricom Airtime Topup (Kenya)',
      sellerId: 'vendor-02',
      sellerName: 'Global Telecom Utilities',
      buyerUsername: 'mary_m_mombasa',
      rating: 5,
      title: 'Instant Topup in 10 Seconds',
      comment: 'Topup credited to my Safaricom phone line immediately after Pi payment confirmation.',
      isVerifiedPurchase: true,
      orderId: 'ORD-8815',
      helpfulVotes: 18,
      reported: false,
      moderationStatus: 'APPROVED',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  canUserReviewProduct(username: string, productId: string, userOrders: Order[]): boolean {
    return userOrders.some((order) => 
      order.buyerUsername === username &&
      order.items.some((item) => item.product.id === productId) &&
      (order.escrowStatus === 'released' || order.escrowStatus === 'delivered' || order.pstpStatus === 'Completed')
    );
  }

  submitReview(
    username: string,
    product: Product,
    rating: number,
    title: string,
    comment: string,
    userOrders: Order[]
  ): { success: boolean; message: string; review?: ReviewItem } {
    const isVerified = this.canUserReviewProduct(username, product.id, userOrders);
    
    if (!isVerified) {
      return {
        success: false,
        message: 'Only verified purchasers who have completed an order for this item can leave a review.'
      };
    }

    const matchingOrder = userOrders.find((o) => o.buyerUsername === username && o.items.some((i) => i.product.id === product.id));

    const newReview: ReviewItem = {
      id: `REV-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      buyerUsername: username,
      rating,
      title,
      comment,
      isVerifiedPurchase: true,
      orderId: matchingOrder?.id,
      helpfulVotes: 0,
      reported: false,
      moderationStatus: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    this.reviews.unshift(newReview);
    return {
      success: true,
      message: 'Thank you! Your verified purchase review has been published.',
      review: newReview
    };
  }

  getReviewsForProduct(productId: string): ReviewItem[] {
    return this.reviews.filter((r) => r.productId === productId && r.moderationStatus === 'APPROVED');
  }

  getReviewsForSeller(sellerId: string): ReviewItem[] {
    return this.reviews.filter((r) => r.sellerId === sellerId && r.moderationStatus === 'APPROVED');
  }

  getAllReviews(): ReviewItem[] {
    return this.reviews;
  }
}

export class TrustModule {
  fraudEngine = new FraudDetectionEngine();
  reviewEngine = new ReviewAuthorizationEngine();

  private verificationRequests: VerificationRequest[] = [
    {
      id: 'REQ-101',
      applicantUsername: 'vendor_electronics_kenya',
      requestedLevel: 'Verified Business',
      documentsProvided: ['Business License (KRA VAT Cert)', 'National ID Card Scan'],
      businessTaxId: 'KRA-P051892110Z',
      status: 'PENDING',
      submittedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ];

  getVerificationRequests(): VerificationRequest[] {
    return this.verificationRequests;
  }

  submitVerificationRequest(username: string, level: VerificationLevel, docs: string[], taxId?: string): VerificationRequest {
    const req: VerificationRequest = {
      id: `REQ-${Date.now()}`,
      applicantUsername: username,
      requestedLevel: level,
      documentsProvided: docs,
      businessTaxId: taxId,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };
    this.verificationRequests.unshift(req);
    return req;
  }

  approveVerification(requestId: string, adminUsername: string, note?: string) {
    const req = this.verificationRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'APPROVED';
      req.reviewedBy = adminUsername;
      req.adminNote = note || 'Verification requirements verified and approved.';
    }
  }

  rejectVerification(requestId: string, adminUsername: string, note: string) {
    const req = this.verificationRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'REJECTED';
      req.reviewedBy = adminUsername;
      req.adminNote = note;
    }
  }
}

export const trustModule = new TrustModule();
