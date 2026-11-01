import { StorageEngine } from '../StorageEngine';

export type VendorApplicationStatus = 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTION_REQUIRED';
export type SellerType = 'individual' | 'business';
export type MerchantVerificationStatus = 'Verified' | 'Pending Verification' | 'Unverified' | 'Suspended';
export type MerchantSellerStatus = 'Active' | 'Inactive' | 'Probation' | 'Suspended';

export interface VendorApplicationDoc {
  id: string;
  docType: 'identity_proof' | 'address_proof' | 'business_registration' | 'tax_cert' | 'store_license';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  documentNumber?: string;
}

export interface VendorApplicationEntity {
  id: string;
  pioneerUsername: string;
  pioneerUid?: string;
  storeName: string;
  sellerType: SellerType;
  country: string;
  countryCode: string;
  stateRegion: string;
  city: string;
  contactEmail: string;
  contactPhone: string;
  contactTelegram?: string;
  storeDescription: string;
  storeTagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  storeLogo?: string;
  storeBanner?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  websiteUrl?: string;
  categoriesToSell: string[];
  documents: VendorApplicationDoc[];
  policies: {
    returnRefundPolicy: string;
    deliveryShippingPolicy: string;
    warrantyTerms?: string;
  };
  pstpAgreementAccepted: boolean;
  status: VendorApplicationStatus;
  /** Authoritative merchant lifecycle derived from governance status. */
  verificationStatus: MerchantVerificationStatus;
  sellerStatus: MerchantSellerStatus;
  adminReviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

type VendorApplicationInput = Omit<VendorApplicationEntity, 'verificationStatus' | 'sellerStatus'> &
  Partial<Pick<VendorApplicationEntity, 'verificationStatus' | 'sellerStatus'>>;

// Production starts with no synthetic merchant/KYC records. Real applications
// are created through the authoritative vendor onboarding flow.
const INITIAL_VENDOR_APPLICATIONS: VendorApplicationEntity[] = [];

export class VendorApplicationRepository {
  private engine: StorageEngine<VendorApplicationEntity>;

  constructor() {
    this.engine = new StorageEngine<VendorApplicationEntity>(
      'vendor_applications',
      'id',
      INITIAL_VENDOR_APPLICATIONS
    );
  }

  public getAll(): VendorApplicationEntity[] {
    return this.engine.getAll().map(app => this.ensureLifecycle(app));
  }

  public findById(id: string): VendorApplicationEntity | undefined {
    const app = this.engine.get(id);
    return app ? this.ensureLifecycle(app) : undefined;
  }

  public findByUsername(username: string): VendorApplicationEntity | undefined {
    const list = this.getAll();
    return list.find(app => app.pioneerUsername.toLowerCase() === username.toLowerCase());
  }

  private ensureLifecycle(app: VendorApplicationEntity): VendorApplicationEntity {
    if (!app.verificationStatus || !app.sellerStatus) {
      const lifecycle = this.lifecycleForStatus(app.status);
      app.verificationStatus = app.verificationStatus ?? lifecycle.verificationStatus;
      app.sellerStatus = app.sellerStatus ?? lifecycle.sellerStatus;
    }
    return app;
  }

  public save(application: VendorApplicationInput): VendorApplicationEntity {
    // This legacy repository is read-compatible only. Merchant activation is
    // exclusively owned by the durable Compliance Queue. No local repository
    // caller may create or preserve an APPROVED merchant state.
    if (application.status === 'APPROVED') {
      throw new Error('MERCHANT_APPROVAL_MUST_USE_COMPLIANCE_QUEUE');
    }

    const lifecycle = this.lifecycleForStatus(application.status);
    const normalized: VendorApplicationEntity = {
      ...application,
      verificationStatus: lifecycle.verificationStatus,
      sellerStatus: lifecycle.sellerStatus
    };

    this.engine.set(normalized.id, normalized);
    return normalized;
  }

  /**
   * Legacy compatibility helper for non-approval lifecycle updates.
   *
   * IMPORTANT: APPROVED is intentionally rejected here. The only supported
   * merchant approval mutation is the authenticated durable Compliance Queue
   * review endpoint.
   */
  public updateStatus(
    id: string,
    status: VendorApplicationStatus,
    adminNotes?: string,
    reviewedBy?: string
  ): VendorApplicationEntity | undefined {
    if (status === 'APPROVED') {
      throw new Error('MERCHANT_APPROVAL_MUST_USE_COMPLIANCE_QUEUE');
    }

    const existing = this.engine.get(id);
    if (!existing) return undefined;

    const lifecycle = this.lifecycleForStatus(status);
    const updated: VendorApplicationEntity = {
      ...existing,
      status,
      verificationStatus: lifecycle.verificationStatus,
      sellerStatus: lifecycle.sellerStatus,
      adminReviewNotes: adminNotes ?? existing.adminReviewNotes,
      reviewedBy: reviewedBy ?? 'Legacy Governance Read-Only',
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.engine.set(id, updated);
    return updated;
  }

  public getMerchantAccess(username: string): {
    applicationFound: boolean;
    applicationStatus: VendorApplicationStatus | null;
    verificationStatus: MerchantVerificationStatus;
    sellerStatus: MerchantSellerStatus;
    canSell: boolean;
    canReceivePstpOrders: boolean;
  } {
    const application = this.findByUsername(username);
    if (!application) {
      return {
        applicationFound: false,
        applicationStatus: null,
        verificationStatus: 'Unverified',
        sellerStatus: 'Inactive',
        canSell: false,
        canReceivePstpOrders: false
      };
    }

    const canSell = application.status === 'APPROVED'
      && application.verificationStatus === 'Verified'
      && application.sellerStatus === 'Active';

    return {
      applicationFound: true,
      applicationStatus: application.status,
      verificationStatus: application.verificationStatus,
      sellerStatus: application.sellerStatus,
      canSell,
      canReceivePstpOrders: canSell && application.pstpAgreementAccepted
    };
  }

  private lifecycleForStatus(status: VendorApplicationStatus): {
    verificationStatus: MerchantVerificationStatus;
    sellerStatus: MerchantSellerStatus;
  } {
    switch (status) {
      case 'APPROVED':
        return { verificationStatus: 'Verified', sellerStatus: 'Active' };
      case 'REJECTED':
        return { verificationStatus: 'Unverified', sellerStatus: 'Suspended' };
      case 'ACTION_REQUIRED':
        return { verificationStatus: 'Pending Verification', sellerStatus: 'Probation' };
      case 'UNDER_REVIEW':
      case 'PENDING_REVIEW':
      default:
        return { verificationStatus: 'Pending Verification', sellerStatus: 'Probation' };
    }
  }
}
