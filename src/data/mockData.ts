import { Product, Vendor, Review, Coupon, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Smart Phones
  {
    id: 'prod-sp-01',
    title: 'PiNova Nexus 5G Flagship Smartphone',
    description: 'Enterprise 5G smartphone with custom Pi OS security enclave, 6.7" 120Hz AMOLED, 108MP camera, and built-in Pi Network key vault.',
    pricePi: 185.00,
    category: 'physical',
    subcategory: 'Smart Phones',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    rating: 4.9,
    reviewsCount: 112,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['Pi OS Hardware Security Enclave', '108MP AI Quad Camera', '5000mAh Battery with 67W Fast Charge', 'Dual SIM 5G'],
    specs: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Snapdragon 8 Gen 2', 'Screen': '6.7 inch AMOLED 120Hz' },
    shippingWeightKg: 0.22,
    tags: ['smartphones', '5g', 'flagship', 'android', 'pi phone'],
    featured: true,
    discountPercent: 12
  },

  // 2. Computers
  {
    id: 'prod-pc-01',
    title: 'MacBook Pro M3 Max 16-inch Workstation',
    description: 'Apple M3 Max chip with 16-core CPU and 40-core GPU, 48GB unified memory, 1TB SSD storage, Liquid Retina XDR display.',
    pricePi: 420.00,
    category: 'physical',
    subcategory: 'Computers',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.95,
    reviewsCount: 88,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['Apple M3 Max Chip', '48GB Unified RAM', '1TB High-speed NVMe', '22-Hour Battery Life'],
    specs: { 'Display': '16.2-inch Liquid Retina XDR', 'Resolution': '3456 x 2234', 'Weight': '2.16 kg' },
    shippingWeightKg: 2.16,
    tags: ['computers', 'laptops', 'macbook', 'apple', 'workstation'],
    featured: true
  },

  // 3. Fashion
  {
    id: 'prod-fas-01',
    title: 'Minimalist Japanese Silk Artisan Robe',
    description: 'Handcrafted 100% mulberry silk kimono robe featuring traditional gold crane embroidery and breathable weave for ultimate luxury lounging.',
    pricePi: 28.00,
    category: 'physical',
    subcategory: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.9,
    reviewsCount: 38,
    sellerId: 'ven-003',
    sellerName: 'Kyoto Artisan Collective',
    sellerVerified: true,
    features: ['100% Mulberry Silk', 'Hand-embroidered details', 'Includes matching sash', 'Hypoallergenic'],
    shippingWeightKg: 0.4,
    tags: ['fashion', 'silk', 'kimono', 'luxury', 'apparel']
  },

  // 4. Home & Living
  {
    id: 'prod-home-01',
    title: 'Nordic Ceramic Minimalist Smart Lamp & Wireless Charger',
    description: 'Dimmable warm touch LED lamp with 15W Qi fast wireless charging pad and integrated Bluetooth 5.3 acoustic speaker.',
    pricePi: 16.50,
    category: 'physical',
    subcategory: 'Home & Living',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 75,
    rating: 4.8,
    reviewsCount: 94,
    sellerId: 'ven-002',
    sellerName: 'Global Audio Masters',
    sellerVerified: true,
    features: ['15W Wireless Qi Charger', 'Touch Dimmer Control', 'Stereo Bluetooth Speaker', 'Eco Ceramic Base'],
    shippingWeightKg: 0.95,
    tags: ['home_living', 'smart lamp', 'decor', 'furniture', 'charger'],
    discountPercent: 15
  },

  // 5. Electronics
  {
    id: 'prod-elec-01',
    title: 'Pi Network Secure Hardware Wallet Pro',
    description: 'Enterprise-grade cold storage hardware wallet customized for Pi Coin and multi-chain crypto assets. Features OLED touchscreen, CC EAL6+ secure element.',
    pricePi: 45.00,
    category: 'physical',
    subcategory: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 120,
    rating: 4.9,
    reviewsCount: 142,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['CC EAL6+ Security Chip', 'OLED Full-Color Touchscreen', 'Custom Pi Key Vault', 'USB-C & Bluetooth 5.2'],
    specs: { 'Battery': '500 mAh', 'Screen': '2.4 inch OLED', 'Dimensions': '85 x 54 x 6 mm' },
    shippingWeightKg: 0.15,
    tags: ['electronics', 'hardware wallet', 'pi coin', 'security', 'crypto'],
    featured: true,
    discountPercent: 10
  },
  {
    id: 'prod-elec-02',
    title: 'Acoustic Pro Active Noise-Cancelling Headphones',
    description: 'Immersive spatial audio with 40mm beryllium drivers, active hybrid noise cancellation up to -45dB, and 50 hours battery life.',
    pricePi: 32.50,
    category: 'physical',
    subcategory: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.8,
    reviewsCount: 89,
    sellerId: 'ven-002',
    sellerName: 'Global Audio Masters',
    sellerVerified: true,
    features: ['Hybrid Active Noise Cancellation', '50-Hour Playtime', 'Hi-Res Wireless Audio'],
    shippingWeightKg: 0.65,
    tags: ['electronics', 'audio', 'headphones', 'anc', 'wireless']
  },

  // 6. Beauty
  {
    id: 'prod-beau-01',
    title: 'Organic Argan & Rosehip Botanical Skincare Set',
    description: '100% cold-pressed organic botanical serum and night recovery oil enriched with vitamins C & E for radiant skin hydration.',
    pricePi: 14.00,
    category: 'physical',
    subcategory: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    rating: 4.85,
    reviewsCount: 52,
    sellerId: 'ven-003',
    sellerName: 'Kyoto Artisan Collective',
    sellerVerified: true,
    features: ['Cold-pressed Organic Argan', 'Rich in Vitamin C & E', 'Paraben-Free & Cruelty-Free'],
    shippingWeightKg: 0.35,
    tags: ['beauty', 'skincare', 'organic', 'serum', 'wellness']
  },

  // 7. Groceries
  {
    id: 'prod-groc-01',
    title: 'Ethiopian Yirgacheffe Single-Origin Specialty Coffee Beans (1kg)',
    description: 'Freshly roasted whole-bean arabica coffee from high-altitude Ethiopian farms with floral bergamot notes and sweet citrus finish.',
    pricePi: 8.50,
    category: 'physical',
    subcategory: 'Groceries',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 180,
    rating: 4.9,
    reviewsCount: 204,
    sellerId: 'ven-003',
    sellerName: 'Kyoto Artisan Collective',
    sellerVerified: true,
    features: ['Single-Origin Yirgacheffe', '100% Arabica Whole Bean', 'Artisanal Medium Roast', 'Fair Trade Certified'],
    shippingWeightKg: 1.0,
    tags: ['groceries', 'coffee', 'specialty coffee', 'arabica', 'pantry'],
    featured: true
  },

  // 8. Vehicles
  {
    id: 'prod-veh-01',
    title: 'VoltRider Pro 45km/h Electric Scooter',
    description: 'Foldable urban commuter electric scooter with 800W brushless motor, 45km range, dual disc brakes, and smart app telemetry.',
    pricePi: 110.00,
    category: 'physical',
    subcategory: 'Vehicles',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    rating: 4.88,
    reviewsCount: 41,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['800W Brushless Motor', '45 km Long Distance Range', 'Dual Regenerative Disc Brakes', 'App Telemetry Sync'],
    shippingWeightKg: 14.5,
    tags: ['vehicles', 'scooter', 'electric vehicle', 'ev', 'commuter']
  },

  // 9. Books
  {
    id: 'prod-book-01',
    title: 'E-Book: The Complete Pi Network Economy Masterclass',
    description: 'In-depth 320-page digital ebook detailing Pi cryptocurrency tokenomics, merchant integration, web3 node operation, and future global utility strategies.',
    pricePi: 5.00,
    category: 'digital',
    subcategory: 'Books',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9999,
    rating: 4.8,
    reviewsCount: 210,
    sellerId: 'ven-004',
    sellerName: 'CodeNova Labs',
    sellerVerified: true,
    features: ['PDF, ePub & Kindle Formats', '320 Pages of Analytical Insights', 'Instant Automated Download'],
    digitalDownloadUrl: 'https://example.com/downloads/pi-network-masterclass.pdf',
    tags: ['books', 'ebook', 'pi network', 'crypto guide', 'digital book'],
    discountPercent: 20
  },

  // 10. Sports
  {
    id: 'prod-sport-01',
    title: 'AeroPulse GPS Fitness Smartwatch & Heart Rate Monitor',
    description: 'Rugged outdoor sports GPS watch with VO2 max telemetry, 5ATM waterproofing, 14-day battery life, and multi-sport tracking modes.',
    pricePi: 22.00,
    category: 'physical',
    subcategory: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 65,
    rating: 4.75,
    reviewsCount: 78,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['Dual-band GPS Receiver', 'VO2 Max & SpO2 Sensor', '50m 5ATM Water Resistance', '14-Day Battery'],
    shippingWeightKg: 0.18,
    tags: ['sports', 'smartwatch', 'fitness', 'gps', 'running']
  },

  // 11. Health
  {
    id: 'prod-health-01',
    title: 'HEPA 13 Ultra Quiet Air Purifier with Ionizer',
    description: 'Medical-grade HEPA 13 filter capturing 99.97% of airborne particles, dust, and pollen for rooms up to 500 sq ft.',
    pricePi: 38.00,
    category: 'physical',
    subcategory: 'Health',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    rating: 4.9,
    reviewsCount: 63,
    sellerId: 'ven-002',
    sellerName: 'Global Audio Masters',
    sellerVerified: true,
    features: ['Medical Grade True HEPA 13', 'Real-time PM2.5 Air Sensor', 'Whisper-Quiet 22dB Sleep Mode'],
    shippingWeightKg: 3.2,
    tags: ['health', 'air purifier', 'hepa', 'wellness', 'home health']
  },

  // 12. Toys
  {
    id: 'prod-toy-01',
    title: 'RoboRover STEM Programmable Robotics & AI Kit',
    description: 'Educational STEM robot building kit with obstacle avoidance sensors, Python coding app, and modular arm controls.',
    pricePi: 24.00,
    category: 'physical',
    subcategory: 'Toys',
    images: [
      'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    rating: 4.88,
    reviewsCount: 54,
    sellerId: 'ven-004',
    sellerName: 'CodeNova Labs',
    sellerVerified: true,
    features: ['Python & Scratch Coding Support', 'Ultrasonic Distance Sensor', 'Rechargeable Li-ion Battery'],
    shippingWeightKg: 1.1,
    tags: ['toys', 'stem', 'robotics', 'kids', 'programming']
  },

  // 13. Industrial Equipment
  {
    id: 'prod-ind-01',
    title: '5KW Off-Grid Hybrid Solar Inverter & MPPT Controller',
    description: 'Pure sine wave solar inverter system with 80A MPPT charge controller, lithium battery sync, and LCD status display.',
    pricePi: 160.00,
    category: 'physical',
    subcategory: 'Industrial Equipment',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    rating: 4.92,
    reviewsCount: 37,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['5000W Continuous Output', 'Integrated 80A MPPT', 'LiFePO4 Battery Communication', 'Overload Protection'],
    shippingWeightKg: 11.8,
    tags: ['industrial_equipment', 'solar inverter', 'power', 'mppt', 'off grid'],
    featured: true
  },

  // Digital Software & Gift Cards
  {
    id: 'prod-soft-01',
    title: 'Pi Nova SaaS Marketplace Complete Source Code Kit',
    description: 'Production-ready full-stack marketplace codebase built with React 19, Express, TypeScript, and Pi SDK integration.',
    pricePi: 75.00,
    category: 'digital',
    subcategory: 'Software & Code',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9999,
    rating: 5.0,
    reviewsCount: 52,
    sellerId: 'ven-004',
    sellerName: 'CodeNova Labs',
    sellerVerified: true,
    features: ['Full Source Code Access', 'Express & React 19 Backend', 'Pi SDK v2 Included'],
    digitalDownloadUrl: 'https://example.com/downloads/pinova-marketplace-v2.zip',
    digitalKey: 'PINOVA-LICENSE-KEY-98234-PI-ECO',
    tags: ['digital', 'source code', 'react', 'saas'],
    featured: true
  },
  {
    id: 'prod-gc-01',
    title: 'Amazon $50 USD Global eGift Card',
    description: 'Digital Amazon gift card code redeemable worldwide for millions of products on Amazon. Delivered instantly in Pi Nova digital vault.',
    pricePi: 14.50,
    category: 'giftcard',
    subcategory: 'Gift Cards',
    images: [
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 150,
    rating: 4.9,
    reviewsCount: 420,
    sellerId: 'ven-005',
    sellerName: 'Global GameVault',
    sellerVerified: true,
    features: ['Instant Digital Code', 'No Expiration Date', 'Usable on Amazon.com'],
    digitalKey: 'AMZN-50USD-8923-4412-PIX',
    tags: ['giftcard', 'amazon', 'shopping', '50 usd'],
    featured: true
  },

  // Airtime & Mobile Data
  {
    id: 'prod-air-01',
    title: 'MTN Nigeria 10GB Monthly High-Speed Data Top-up',
    description: 'Instant 10GB 4G/5G mobile internet data bundle delivered directly to any registered MTN Nigeria phone number.',
    pricePi: 2.50,
    category: 'airtime',
    subcategory: 'Airtime & Mobile Data',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9999,
    rating: 4.9,
    reviewsCount: 520,
    sellerId: 'ven-006',
    sellerName: 'PiPay Telecom Direct',
    sellerVerified: true,
    features: ['Instant Direct Top-Up', 'Valid for 30 Days', 'Works on 4G & 5G'],
    airtimeNetwork: 'MTN Nigeria',
    tags: ['airtime', 'data', 'mtn', 'telecom'],
    featured: true
  },

  // Utility Bills
  {
    id: 'prod-util-01',
    title: 'Ikeja Electric Electricity Prepaid Meter Token',
    description: 'Pay your electricity bill or buy prepaid meter energy units directly with Pi Coin. Token code generated instantly.',
    pricePi: 6.00,
    category: 'utility',
    subcategory: 'Utility Bills',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9999,
    rating: 4.9,
    reviewsCount: 189,
    sellerId: 'ven-007',
    sellerName: 'Global UtilityPay Network',
    sellerVerified: true,
    features: ['Instant Meter Token Generation', 'Valid for All Meter Types', 'Automated Verification'],
    utilityProvider: 'Ikeja Electric (IE)',
    tags: ['utility', 'electricity', 'meter token', 'power'],
    featured: true
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'ven-001',
    sellerUsername: 'pitech_admin',
    storeName: 'PiTech Official Store',
    bio: 'Pioneer hardware manufacturer creating certified accessories, hardware wallets, and electronics for Pi Network users worldwide.',
    rating: 4.9,
    reviewsCount: 380,
    verified: true,
    totalSalesPi: 14200.50,
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-01-15',
    shippingCountries: ['Worldwide', 'United States', 'United Kingdom', 'Nigeria', 'India', 'Japan', 'Germany', 'Brazil']
  },
  {
    id: 'ven-004',
    sellerUsername: 'codenova_dev',
    storeName: 'CodeNova Labs',
    bio: 'Verified digital downloads creator specializing in high-performance web templates, developer scripts, and educational Pi content.',
    rating: 4.95,
    reviewsCount: 262,
    verified: true,
    totalSalesPi: 8900.00,
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-03-10',
    shippingCountries: ['Digital Delivery (Global)']
  },
  {
    id: 'ven-006',
    sellerUsername: 'pipay_telecom',
    storeName: 'PiPay Telecom Direct',
    bio: 'Official global telecom aggregator enabling instant mobile airtime topups and data bundle recharges across 140+ countries in Pi Coin.',
    rating: 4.88,
    reviewsCount: 860,
    verified: true,
    totalSalesPi: 32100.00,
    bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-02-01',
    shippingCountries: ['Global Automated Digital']
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-elec-01',
    username: 'pioneer_alex',
    rating: 5,
    comment: 'Incredible hardware wallet! Received it via international express delivery in 4 days. Pi payment went smoothly through Pi Browser with escrow verification.',
    date: '2026-07-28',
    verifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: 'rev-002',
    productId: 'prod-sp-01',
    username: 'crypto_sarah',
    rating: 5,
    comment: 'Solid smartphone build quality and super smooth 120Hz AMOLED. Extremely happy to buy real devices with my Pi Coins!',
    date: '2026-07-15',
    verifiedPurchase: true,
    helpfulCount: 18
  },
  {
    id: 'rev-003',
    productId: 'prod-air-01',
    username: 'emmanuel_ng',
    rating: 5,
    comment: 'Instantly credited my MTN Nigeria line with 10GB data right after approving the Pi transaction! Unbelievably fast utility.',
    date: '2026-08-01',
    verifiedPurchase: true,
    helpfulCount: 42
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'PINOVA10', discountPercent: 10, minSpendPi: 10.0, active: true, expiresAt: '2026-12-31' },
  { code: 'PIONEER20', discountPercent: 20, minSpendPi: 30.0, active: true, expiresAt: '2026-12-31' },
  { code: 'FREESHIP', discountPercent: 100, minSpendPi: 50.0, active: true, expiresAt: '2026-12-31' }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-PI-892341',
    buyerUsername: 'pi_pioneer_01',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      }
    ],
    totalPi: 162.80,
    escrowStatus: 'in_escrow',
    pstpStatus: 'Shipped',
    serverVerified: true,
    piPaymentId: 'pi_pay_98234812934',
    piTxid: '0x9a2f3b8c1102e3f4a567890bcdef1234567890abcdef1234567890abcdef1234',
    shippingAddress: {
      fullName: 'Alexander Pioneer',
      street: '102 Innovation Drive',
      city: 'London',
      country: 'United Kingdom',
      postalCode: 'EC1A 1BB',
      phone: '+44 20 7946 0912'
    },
    trackingNumber: 'DHL-EXPRESS-98319204',
    carrier: 'DHL Express',
    createdAt: '2026-08-01T14:22:00Z',
    updatedAt: '2026-08-01T16:00:00Z',
    timeline: [
      {
        status: 'Pending Payment',
        timestamp: '2026-08-01T14:22:00Z',
        actor: 'pi_pioneer_01',
        actorRole: 'buyer',
        note: 'Order initiated in Pi Browser SDK.'
      },
      {
        status: 'Payment Verified',
        timestamp: '2026-08-01T14:22:05Z',
        actor: 'PSTP_Protection_Server',
        actorRole: 'system',
        note: 'Verified via Pi Platform API v2. Payment authorized and order protection active.'
      },
      {
        status: 'Seller Accepted',
        timestamp: '2026-08-01T14:45:00Z',
        actor: 'PiTech Official Store',
        actorRole: 'seller',
        note: 'Merchant acknowledged order and allocated stock.'
      },
      {
        status: 'Preparing Order',
        timestamp: '2026-08-01T15:10:00Z',
        actor: 'PiTech Official Store',
        actorRole: 'seller',
        note: 'Item retrieved from secure vault & serial number logged.'
      },
      {
        status: 'Packed',
        timestamp: '2026-08-01T15:40:00Z',
        actor: 'PiTech Official Store',
        actorRole: 'seller',
        note: 'Sealed with tamper-evident security tape.'
      },
      {
        status: 'Shipped',
        timestamp: '2026-08-01T16:00:00Z',
        actor: 'PiTech Official Store',
        actorRole: 'seller',
        note: 'Handed to DHL Express courier. Tracking: DHL-EXPRESS-98319204.'
      }
    ]
  },
  {
    id: 'ORD-PI-551920',
    buyerUsername: 'pi_pioneer_01',
    items: [
      {
        product: INITIAL_PRODUCTS[13], // MTN Data
        quantity: 1,
        customDetails: { phoneNumber: '+2348030001122' }
      }
    ],
    totalPi: 2.50,
    escrowStatus: 'released',
    pstpStatus: 'Completed',
    serverVerified: true,
    piPaymentId: 'pi_pay_11029384756',
    piTxid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    createdAt: '2026-08-02T10:15:00Z',
    updatedAt: '2026-08-02T10:15:05Z',
    digitalDeliveries: [
      {
        productId: 'prod-air-01',
        codeOrUrl: 'DATA-TOPUP-SUCCESS-REFE2918',
        title: 'MTN 10GB Data Recharge'
      }
    ],
    timeline: [
      {
        status: 'Pending Payment',
        timestamp: '2026-08-02T10:15:00Z',
        actor: 'pi_pioneer_01',
        actorRole: 'buyer',
        note: 'Utility recharge request submitted.'
      },
      {
        status: 'Payment Verified',
        timestamp: '2026-08-02T10:15:02Z',
        actor: 'PSTP_Escrow_Server',
        actorRole: 'system',
        note: 'Server-side payment verification passed.'
      },
      {
        status: 'Completed',
        timestamp: '2026-08-02T10:15:05Z',
        actor: 'PiPay Telecom Direct',
        actorRole: 'seller',
        note: 'Instant digital airtime dispatched to +2348030001122.'
      }
    ]
  }
];
