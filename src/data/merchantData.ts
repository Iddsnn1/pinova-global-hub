import { MerchantStore, Warehouse, InventoryRecord, CrmCustomer, StaffMember, StockTransfer, VerificationDoc } from '../types';

export const INITIAL_MERCHANT_STORES: MerchantStore[] = [
  {
    id: 'store-001',
    sellerUsername: 'pioneer_merchant_hq',
    storeName: 'PiNova Tech Enterprise HQ',
    storeType: 'business',
    description: 'Official flagship electronics, verified hardware, and premium IoT equipment built for the Pi Network ecosystem.',
    logoImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    email: 'contact@pinovatech.io',
    phone: '+1 (555) 392-8810',
    businessHours: 'Mon - Fri: 08:00 - 18:00 UTC',
    location: {
      address: '750 Innovation Way, Suite 400',
      city: 'San Francisco',
      country: 'United States',
      postalCode: '94105'
    },
    websiteUrl: 'https://pinovatech.io',
    socialLinks: {
      twitter: '@PiNovaTechHQ',
      telegram: 't.me/pinovatech',
      instagram: '@pinovatechofficial',
      linkedin: 'linkedin.com/company/pinovatech'
    },
    verificationLevel: 'verified_business',
    rating: 4.9,
    reviewsCount: 342,
    followersCount: 12450,
    totalSalesPi: 14850.00,
    joinedDate: '2024-03-15',
    shippingCountries: ['Worldwide', 'USA', 'Canada', 'Germany', 'Japan', 'Nigeria', 'Brazil', 'Vietnam'],
    isDefault: true,
    warehouses: [
      {
        id: 'wh-01',
        name: 'Silicon Valley Mega Fulfillment Hub',
        location: 'San Jose, CA',
        country: 'United States',
        capacityUnits: 50000,
        currentStockUnits: 34200,
        isPrimary: true,
        managerName: 'Alex Mercer'
      },
      {
        id: 'wh-02',
        name: 'Frankfurt EU Regional Depot',
        location: 'Frankfurt',
        country: 'Germany',
        capacityUnits: 30000,
        currentStockUnits: 18900,
        isPrimary: false,
        managerName: 'Klaus Webber'
      }
    ],
    staff: [
      {
        id: 'st-01',
        name: 'Sarah Chen',
        email: 'sarah.c@pinovatech.io',
        role: 'owner',
        permissions: ['ALL_PERMISSIONS', 'MANAGE_FINANCE', 'MANAGE_STAFF', 'EDIT_STORE', 'PROCESS_ORDERS'],
        joinedAt: '2024-03-15',
        status: 'active'
      },
      {
        id: 'st-02',
        name: 'David Rodriguez',
        email: 'd.rodriguez@pinovatech.io',
        role: 'manager',
        permissions: ['PROCESS_ORDERS', 'MANAGE_INVENTORY', 'VIEW_ANALYTICS'],
        joinedAt: '2024-04-10',
        status: 'active'
      },
      {
        id: 'st-03',
        name: 'Elena Rostova',
        email: 'elena.support@pinovatech.io',
        role: 'support',
        permissions: ['VIEW_ORDERS', 'MANAGE_DISPUTES', 'CRM_ACCESS'],
        joinedAt: '2024-06-01',
        status: 'active'
      }
    ],
    verificationDocs: [
      {
        id: 'doc-101',
        docType: 'business_license',
        fileName: 'California_State_Business_License_2026.pdf',
        status: 'VERIFIED',
        uploadedAt: '2024-03-16',
        note: 'Approved by PiNova Enterprise Compliance Committee'
      },
      {
        id: 'doc-102',
        docType: 'tax_id',
        fileName: 'US_IRS_EIN_Tax_Verification.pdf',
        status: 'VERIFIED',
        uploadedAt: '2024-03-16'
      }
    ]
  },
  {
    id: 'store-002',
    sellerUsername: 'pioneer_merchant_hq',
    storeName: 'PiNova Official Brand Boutique',
    storeType: 'brand',
    description: 'Exclusive luxury merchandise, smart wearables, and limited-edition Pioneer collectibles.',
    logoImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    email: 'boutique@pinovabrand.com',
    phone: '+1 (555) 998-2100',
    businessHours: 'Mon - Sun: 09:00 - 21:00 UTC',
    location: {
      address: '100 Luxury Boulevard',
      city: 'New York',
      country: 'United States',
      postalCode: '10001'
    },
    verificationLevel: 'official_brand',
    rating: 5.0,
    reviewsCount: 189,
    followersCount: 8900,
    totalSalesPi: 8720.50,
    joinedDate: '2024-08-01',
    shippingCountries: ['Worldwide'],
    isDefault: false,
    warehouses: [],
    staff: [],
    verificationDocs: []
  },
  {
    id: 'store-003',
    sellerUsername: 'pioneer_merchant_hq',
    storeName: 'Global Pioneer Wholesale Supply',
    storeType: 'wholesale',
    description: 'Bulk order supply chain & B2B wholesale distribution payable via official Pi Network protocol.',
    logoImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    email: 'wholesale@pinovasupply.com',
    phone: '+1 (555) 441-3320',
    businessHours: 'Mon - Fri: 07:00 - 19:00 UTC',
    location: {
      address: '500 Logistics Parkway',
      city: 'Chicago',
      country: 'United States',
      postalCode: '60601'
    },
    verificationLevel: 'authorized_distributor',
    rating: 4.8,
    reviewsCount: 94,
    followersCount: 3200,
    totalSalesPi: 34100.00,
    joinedDate: '2025-01-10',
    shippingCountries: ['USA', 'Canada', 'EU', 'Asia-Pacific'],
    isDefault: false,
    warehouses: [],
    staff: [],
    verificationDocs: []
  }
];

export const INITIAL_INVENTORY_RECORDS: InventoryRecord[] = [
  {
    id: 'inv-01',
    sku: 'PINOVA-S24-PRO-256',
    productId: 'p1',
    productTitle: 'PiNova S24 Ultra Flagship Smartphone 256GB',
    warehouseId: 'wh-01',
    warehouseName: 'Silicon Valley Mega Fulfillment Hub',
    stockOnHand: 140,
    reservedStock: 12,
    reorderPoint: 25,
    batchNumber: 'BATCH-2026-Q3-889A',
    barcode: '893019283019',
    lastRestocked: '2026-07-28'
  },
  {
    id: 'inv-02',
    sku: 'PINOVA-LAPTOP-M3',
    productId: 'p2',
    productTitle: 'PiNova Book Pro M3 Max Workstation 32GB',
    warehouseId: 'wh-01',
    warehouseName: 'Silicon Valley Mega Fulfillment Hub',
    stockOnHand: 45,
    reservedStock: 5,
    reorderPoint: 10,
    batchNumber: 'BATCH-2026-Q3-102B',
    barcode: '893019283020',
    lastRestocked: '2026-07-30'
  },
  {
    id: 'inv-03',
    sku: 'PINOVA-WATCH-U2',
    productId: 'p3',
    productTitle: 'Pioneer Horizon Smart Watch Series X',
    warehouseId: 'wh-02',
    warehouseName: 'Frankfurt EU Regional Depot',
    stockOnHand: 220,
    reservedStock: 18,
    reorderPoint: 40,
    batchNumber: 'BATCH-2026-EU-404',
    barcode: '893019283021',
    lastRestocked: '2026-08-01'
  },
  {
    id: 'inv-04',
    sku: 'PINOVA-HEADSET-PRO',
    productId: 'p4',
    productTitle: 'Acoustic Pro Wireless Active Noise Canceling Headphones',
    warehouseId: 'wh-02',
    warehouseName: 'Frankfurt EU Regional Depot',
    stockOnHand: 18,
    reservedStock: 2,
    reorderPoint: 20,
    batchNumber: 'BATCH-2026-EU-501',
    barcode: '893019283022',
    lastRestocked: '2026-06-15'
  }
];

export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [
  {
    id: 'TR-9901',
    fromWarehouse: 'Silicon Valley Mega Fulfillment Hub',
    toWarehouse: 'Frankfurt EU Regional Depot',
    sku: 'PINOVA-S24-PRO-256',
    productTitle: 'PiNova S24 Ultra Flagship Smartphone',
    quantity: 30,
    status: 'IN_TRANSIT',
    transferredBy: 'David Rodriguez',
    date: '2026-08-02'
  },
  {
    id: 'TR-9844',
    fromWarehouse: 'Frankfurt EU Regional Depot',
    toWarehouse: 'Silicon Valley Mega Fulfillment Hub',
    sku: 'PINOVA-WATCH-U2',
    productTitle: 'Pioneer Horizon Smart Watch Series X',
    quantity: 50,
    status: 'COMPLETED',
    transferredBy: 'Alex Mercer',
    date: '2026-07-25'
  }
];

export const INITIAL_CRM_CUSTOMERS: CrmCustomer[] = [
  {
    id: 'crm-01',
    username: '@pioneer_alex',
    email: 'alex.pioneer@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    totalOrders: 14,
    totalSpentPi: 1890.50,
    lastOrderDate: '2026-08-03',
    tier: 'VIP Pioneer',
    notes: 'Frequent buyer of tech gadgets. Promptly releases payment upon verified receipt.',
    supportTicketCount: 0,
    tags: ['Tech Enthusiast', 'High Volume', 'Verified Pioneer']
  },
  {
    id: 'crm-02',
    username: '@crypto_hannah',
    email: 'hannah.m@techmail.org',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    totalOrders: 8,
    totalSpentPi: 920.00,
    lastOrderDate: '2026-07-29',
    tier: 'Gold',
    notes: 'Prefers expedited international courier shipping via DHL.',
    supportTicketCount: 1,
    tags: ['Boutique Collector', 'Gold Tier']
  },
  {
    id: 'crm-03',
    username: '@merchant_dave',
    email: 'dave@globalimports.co',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    totalOrders: 23,
    totalSpentPi: 5400.00,
    lastOrderDate: '2026-08-01',
    tier: 'VIP Pioneer',
    notes: 'B2B Wholesale account buyer. Requests custom commercial invoices.',
    supportTicketCount: 0,
    tags: ['B2B Partner', 'Wholesale Purchaser']
  }
];
