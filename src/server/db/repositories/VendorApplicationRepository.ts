import { StorageEngine } from '../StorageEngine';

export type VendorApplicationStatus = 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTION_REQUIRED';
export type SellerType = 'individual' | 'business';

export interface VendorApplicationDoc {
  id: string;
  docType: 'identity_proof' | 'address_proof' | 'business_registration' | 'tax_cert' | 'store_license';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
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
  adminReviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_VENDOR_APPLICATIONS: VendorApplicationEntity[] = [
  {
    id: 'VAPP-NG-9081',
    pioneerUsername: 'pi_artisan_hub',
    pioneerUid: 'UID_99812_ARTISAN',
    storeName: 'Pi Artisan Crafts & Heritage',
    sellerType: 'business',
    country: 'Nigeria',
    countryCode: 'NG',
    stateRegion: 'Kano',
    city: 'Kano Municipal',
    contactEmail: 'artisan@pinova.hub',
    contactPhone: '+234 803 111 2233',
    contactTelegram: '@pi_artisan',
    storeDescription: 'Handcrafted authentic leathercraft, artisanal textiles, and heritage memorabilia.',
    storeTagline: 'Preserving African Heritage on the Pi Blockchain',
    logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    businessRegistrationNumber: 'RC-1049283-NG',
    taxId: 'TIN-99482711',
    categoriesToSell: ['physical', 'giftcard'],
    documents: [
      {
        id: 'doc_id_1',
        docType: 'business_registration',
        fileName: 'CAC_Certificate_ArtisanCrafts.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'doc_id_2',
        docType: 'identity_proof',
        fileName: 'National_ID_Slip.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    policies: {
      returnRefundPolicy: '14-day hassle-free return for unwashed items with PSTP buyer guarantee.',
      deliveryShippingPolicy: 'Standard express dispatch within 24-48 business hours across Nigeria & West Africa.',
      warrantyTerms: '6-month craftsmanship guarantee on leather goods.'
    },
    pstpAgreementAccepted: true,
    status: 'APPROVED',
    adminReviewNotes: 'Verified against CAC business registry and verified Pioneer KYC credentials.',
    reviewedBy: 'PiNova Chief Compliance Officer',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

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
    return this.engine.getAll();
  }

  public findById(id: string): VendorApplicationEntity | undefined {
    return this.engine.get(id);
  }

  public findByUsername(username: string): VendorApplicationEntity | undefined {
    const list = this.engine.getAll();
    return list.find(app => app.pioneerUsername.toLowerCase() === username.toLowerCase());
  }

  public save(application: VendorApplicationEntity): VendorApplicationEntity {
    this.engine.set(application.id, application);
    return application;
  }

  public updateStatus(
    id: string,
    status: VendorApplicationStatus,
    adminNotes?: string,
    reviewedBy?: string
  ): VendorApplicationEntity | undefined {
    const existing = this.engine.get(id);
    if (!existing) return undefined;

    const updated: VendorApplicationEntity = {
      ...existing,
      status,
      adminReviewNotes: adminNotes ?? existing.adminReviewNotes,
      reviewedBy: reviewedBy ?? 'Platform Compliance Lead',
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.engine.set(id, updated);
    return updated;
  }
}
