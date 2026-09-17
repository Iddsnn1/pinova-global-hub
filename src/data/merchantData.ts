import { MerchantStore, InventoryRecord, StockTransfer, CrmCustomer } from '../types';

/**
 * Production-safe empty merchant state.
 * Real merchant/store data must come from authenticated server-side persistence.
 * No fictional merchants, staff, warehouses, customers, sales or inventory are seeded here.
 * Transparent assets prevent broken-image UI while a verified merchant profile is unavailable.
 */
const EMPTY_MERCHANT_ASSET = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export const INITIAL_MERCHANT_STORES: MerchantStore[] = [
  {
    id: 'pending-store',
    sellerUsername: '',
    storeName: '',
    storeType: 'individual',
    description: '',
    logoImage: EMPTY_MERCHANT_ASSET,
    bannerImage: EMPTY_MERCHANT_ASSET,
    email: '',
    phone: '',
    businessHours: '',
    location: {
      address: '',
      city: '',
      country: '',
      postalCode: ''
    },
    verificationLevel: 'individual',
    rating: 0,
    reviewsCount: 0,
    followersCount: 0,
    totalSalesPi: 0,
    joinedDate: '',
    shippingCountries: [],
    isDefault: true,
    warehouses: [],
    staff: [],
    verificationDocs: []
  }
];

export const INITIAL_INVENTORY_RECORDS: InventoryRecord[] = [];

export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [];

export const INITIAL_CRM_CUSTOMERS: CrmCustomer[] = [];