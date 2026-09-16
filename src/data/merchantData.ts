import { MerchantStore, InventoryRecord, StockTransfer, CrmCustomer } from '../types';

/**
 * Production-safe empty merchant state.
 * Real merchant/store data must come from authenticated server-side persistence.
 * No fictional merchants, staff, warehouses, customers, sales or inventory are seeded here.
 */
export const INITIAL_MERCHANT_STORES: MerchantStore[] = [
  {
    id: 'pending-store',
    sellerUsername: '',
    storeName: '',
    storeType: 'individual',
    description: '',
    logoImage: '',
    bannerImage: '',
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
