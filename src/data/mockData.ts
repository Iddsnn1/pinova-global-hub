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
    variants: [
      { id: 'var-sp-256', sku: 'PINOVA-SP-256GB', title: '12GB RAM + 256GB Storage (Titanium Black)', priceDeltaPi: 0, stock: 30, attributes: { ram: '12GB', storage: '256GB', color: 'Titanium Black' } },
      { id: 'var-sp-512', sku: 'PINOVA-SP-512GB', title: '16GB RAM + 512GB Storage (Celestial Silver)', priceDeltaPi: 25.00, stock: 15, attributes: { ram: '16GB', storage: '512GB', color: 'Celestial Silver' } },
      { id: 'var-sp-1tb', sku: 'PINOVA-SP-1TB', title: '16GB RAM + 1TB Storage (Pioneer Gold)', priceDeltaPi: 50.00, stock: 5, attributes: { ram: '16GB', storage: '1TB', color: 'Pioneer Gold' } }
    ],
    features: ['Pi OS Hardware Security Enclave', '108MP AI Quad Camera', '5000mAh Battery with 67W Fast Charge', 'Dual SIM 5G'],
    specs: { 'RAM': '12GB / 16GB', 'Storage': '256GB / 512GB / 1TB', 'Processor': 'Snapdragon 8 Gen 2', 'Screen': '6.7 inch AMOLED 120Hz' },
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
    variants: [
      { id: 'var-pc-48gb', sku: 'MBP-M3-48-1TB', title: '48GB Unified RAM + 1TB NVMe (Space Black)', priceDeltaPi: 0, stock: 8, attributes: { memory: '48GB', storage: '1TB', color: 'Space Black' } },
      { id: 'var-pc-64gb', sku: 'MBP-M3-64-2TB', title: '64GB Unified RAM + 2TB NVMe (Space Black)', priceDeltaPi: 65.00, stock: 5, attributes: { memory: '64GB', storage: '2TB', color: 'Space Black' } },
      { id: 'var-pc-128gb', sku: 'MBP-M3-128-4TB', title: '128GB Unified RAM + 4TB NVMe (Silver)', priceDeltaPi: 140.00, stock: 2, attributes: { memory: '128GB', storage: '4TB', color: 'Silver' } }
    ],
    features: ['Apple M3 Max Chip', '48GB-128GB Unified RAM', '1TB-4TB High-speed NVMe', '22-Hour Battery Life'],
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
    variants: [
      { id: 'var-fas-sm', sku: 'KYOTO-ROBE-SM-CRANE', title: 'Size S/M - Midnight Crane', priceDeltaPi: 0, stock: 10, attributes: { size: 'S/M', pattern: 'Midnight Crane' } },
      { id: 'var-fas-lxl', sku: 'KYOTO-ROBE-LXL-CRANE', title: 'Size L/XL - Midnight Crane', priceDeltaPi: 0, stock: 12, attributes: { size: 'L/XL', pattern: 'Midnight Crane' } },
      { id: 'var-fas-xxl', sku: 'KYOTO-ROBE-XXL-GOLD', title: 'Size XXL - Imperial Gold Embroidered', priceDeltaPi: 6.00, stock: 3, attributes: { size: 'XXL', pattern: 'Imperial Gold' } }
    ],
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
    variants: [
      { id: 'var-hw-std', sku: 'PINOVA-HW-STD', title: 'Standard Edition (OLED Hardware Key)', priceDeltaPi: 0, stock: 80, attributes: { edition: 'Standard', color: 'Matte Onyx' } },
      { id: 'var-hw-dlx', sku: 'PINOVA-HW-DLX-STEEL', title: 'Deluxe Vault Edition (+ Titanium Seed Backup Plate)', priceDeltaPi: 18.00, stock: 40, attributes: { edition: 'Deluxe Vault', color: 'Brushed Titanium' } }
    ],
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
    variants: [
      { id: 'var-book-std', sku: 'BOOK-PI-ECO-STD', title: 'Standard Edition (PDF & ePub)', priceDeltaPi: 0, stock: 9999, attributes: { format: 'PDF + ePub', tier: 'Standard' } },
      { id: 'var-book-dlx', sku: 'BOOK-PI-ECO-DLX', title: 'Deluxe Masterclass (+ Jupyter Notebooks & Video Lectures)', priceDeltaPi: 3.50, stock: 9999, attributes: { format: 'PDF + Video + Code', tier: 'Deluxe Masterclass' } }
    ],
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
    variants: [
      { id: 'var-soft-dev', sku: 'PINOVA-SRC-DEV', title: 'Single Developer License', priceDeltaPi: 0, stock: 9999, attributes: { license: 'Single Developer', updates: '1 Year' } },
      { id: 'var-soft-team', sku: 'PINOVA-SRC-TEAM', title: 'Commercial Team License (+ Extended Support)', priceDeltaPi: 45.00, stock: 9999, attributes: { license: 'Team Commercial', updates: 'Lifetime' } },
      { id: 'var-soft-ent', sku: 'PINOVA-SRC-ENT', title: 'Enterprise Unlimited White-Label License', priceDeltaPi: 120.00, stock: 9999, attributes: { license: 'Enterprise White-Label', updates: 'Dedicated Support' } }
    ],
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
    variants: [
      { id: 'var-gc-25', sku: 'AMZN-GC-25USD', title: '$25 USD Value Code', priceDeltaPi: -7.00, stock: 100, attributes: { denomination: '$25 USD' } },
      { id: 'var-gc-50', sku: 'AMZN-GC-50USD', title: '$50 USD Value Code', priceDeltaPi: 0, stock: 150, attributes: { denomination: '$50 USD' } },
      { id: 'var-gc-100', sku: 'AMZN-GC-100USD', title: '$100 USD Value Code', priceDeltaPi: 14.00, stock: 50, attributes: { denomination: '$100 USD' } }
    ],
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
    productType: 'digital',
    fulfillmentType: 'utility_token',
    availabilityStatus: 'in_stock',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9999,
    rating: 4.9,
    reviewsCount: 189,
    sellerId: 'ven-008',
    sellerName: 'Global UtilityPay Network',
    sellerVerified: true,
    features: ['Instant Meter Token Generation', 'Valid for All Meter Types', 'Automated Verification'],
    utilityProvider: 'Ikeja Electric (IE)',
    tags: ['utility', 'electricity', 'meter token', 'power'],
    featured: true
  },

  // Professional Services & Blockchain Consulting
  {
    id: 'prod-srv-01',
    title: 'Pi Network DApp Architecture & Security Audit',
    description: 'Comprehensive smart contract, backend enclave, and Pi SDK payment verification vulnerability audit conducted by certified enterprise blockchain security researchers.',
    pricePi: 120.00,
    category: 'service',
    subcategory: 'Professional Services',
    productType: 'service',
    fulfillmentType: 'service_delivery',
    availabilityStatus: 'in_stock',
    serviceLocation: 'Global Remote',
    serviceDuration: '3-5 Business Days',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 10,
    rating: 4.98,
    reviewsCount: 44,
    sellerId: 'ven-007',
    sellerName: 'PiNova Enterprise Services',
    sellerVerified: true,
    variants: [
      { id: 'var-srv-std', sku: 'AUDIT-SMART-CONTRACT-STD', title: 'Standard Smart Contract Security Audit', priceDeltaPi: 0, stock: 10, attributes: { tier: 'Standard', turnaround: '72 Hours' } },
      { id: 'var-srv-full', sku: 'AUDIT-FULL-ENCLAVE', title: 'Full Stack Architecture & Cryptographic Enclave Audit', priceDeltaPi: 60.00, stock: 5, attributes: { tier: 'Comprehensive', turnaround: '5 Days' } }
    ],
    features: ['Static & Dynamic Code Analysis', 'Pi Platform API v2 Payment Flow Verification', 'Cryptographic Enclave Review', 'Official Certified PDF Audit Report'],
    specs: { 'Deliverable': 'Full Technical PDF & Remediation Matrix', 'Turnaround': '72-120 Hours', 'Methodology': 'OWASP & NIST Blockchain Guidelines' },
    tags: ['service', 'security', 'audit', 'smart contract', 'enterprise', 'consulting'],
    featured: true
  },
  {
    id: 'prod-srv-02',
    title: 'Pi Node Dedicated Cloud Deployment & Monitoring',
    description: 'Turnkey high-availability cloud server deployment for running official Pi Network consensus nodes with 99.99% uptime SLA, automated backups, and 24/7 telemetry.',
    pricePi: 45.00,
    category: 'service',
    subcategory: 'Professional Services',
    productType: 'service',
    fulfillmentType: 'service_delivery',
    availabilityStatus: 'in_stock',
    serviceLocation: 'Global Cloud (Frankfurt / US-East / Tokyo)',
    serviceDuration: 'Monthly Managed SLA',
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    rating: 4.94,
    reviewsCount: 31,
    sellerId: 'ven-007',
    sellerName: 'PiNova Enterprise Services',
    sellerVerified: true,
    variants: [
      { id: 'var-node-4vcpu', sku: 'NODE-CLOUD-4VCPU', title: 'Standard Node (4 vCPU / 16GB RAM / 500GB NVMe)', priceDeltaPi: 0, stock: 20, attributes: { vcpu: '4 Core', memory: '16GB' } },
      { id: 'var-node-8vcpu', sku: 'NODE-CLOUD-8VCPU', title: 'High-Performance Node (8 vCPU / 32GB RAM / 1TB NVMe)', priceDeltaPi: 25.00, stock: 10, attributes: { vcpu: '8 Core', memory: '32GB' } }
    ],
    features: ['High-Performance NVMe Cloud VM', 'Pre-configured Docker & Pi Consensus Daemon', 'Automated Health Recovery', 'Dedicated Grafana Dashboard'],
    tags: ['service', 'node', 'cloud', 'hosting', 'infrastructure'],
    featured: true
  },

  // 14. Agriculture
  {
    id: 'prod-agri-01',
    title: 'Certified Organic Non-GMO Heirloom Crop Seed Vault',
    description: 'Hermetically sealed multi-variety seed bank containing 35 essential heirloom vegetables and grain crops with high germination rates and long-term storage capability.',
    pricePi: 19.50,
    category: 'physical',
    subcategory: 'Agriculture',
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 85,
    rating: 4.92,
    reviewsCount: 67,
    sellerId: 'ven-003',
    sellerName: 'Kyoto Artisan Collective',
    sellerVerified: true,
    features: ['35 Heirloom Seed Varieties', 'Non-GMO Certified', 'Hermetic Moisture Barrier Canister', 'Includes Germination Guide'],
    shippingWeightKg: 1.2,
    tags: ['agriculture', 'seeds', 'organic', 'farm produce', 'farming']
  },

  // 15. Travel & Transport Services
  {
    id: 'prod-trav-01',
    title: 'Global High-Speed Rail & Regional Bus Open Pass (30-Day)',
    description: 'Digital transit voucher providing flexible booking credits across verified international express bus and intercity rail lines with instant e-ticket issuance.',
    pricePi: 34.00,
    category: 'service',
    subcategory: 'Travel & Transport Services',
    productType: 'service',
    fulfillmentType: 'service_delivery',
    availabilityStatus: 'in_stock',
    serviceLocation: 'Global Multi-Region',
    serviceDuration: '30 Days Travel Validity',
    images: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 200,
    rating: 4.88,
    reviewsCount: 95,
    sellerId: 'ven-007',
    sellerName: 'PiNova Enterprise Services',
    sellerVerified: true,
    features: ['Instant Digital Travel Voucher', 'Flexible Rebooking', 'QR Code Boarding Pass'],
    tags: ['travel_transport', 'flights', 'buses', 'hotels', 'travel', 'transport']
  },

  // 16. Entertainment & Creative
  {
    id: 'prod-ent-01',
    title: '4K Cinema Drone Videography & Audio Mastering Package',
    description: 'Professional remote creative studio package covering 4K HDR drone aerial capture, color grading, and broadcast-ready stereo audio mastering.',
    pricePi: 55.00,
    category: 'service',
    subcategory: 'Entertainment & Creative',
    productType: 'service',
    fulfillmentType: 'service_delivery',
    availabilityStatus: 'in_stock',
    serviceLocation: 'Global Remote / On-Location Booking',
    serviceDuration: '3-7 Business Days',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    rating: 4.95,
    reviewsCount: 42,
    sellerId: 'ven-007',
    sellerName: 'PiNova Enterprise Services',
    sellerVerified: true,
    features: ['4K Cinema Drone Capture', 'DaVinci Resolve Color Grade', 'Mastered Audio Delivery (WAV & FLAC)'],
    tags: ['entertainment_creative', 'video', 'photography', 'music', 'creative services', 'media']
  },

  // 17. Pets & Animals
  {
    id: 'prod-pet-01',
    title: 'Smart Ultrasonic Automatic Pet Feeder & HD Camera',
    description: 'WiFi-connected dual-bowl automatic pet feeder with scheduled portion dispenser, 1080p two-way audio camera, and anti-clog rotor.',
    pricePi: 29.00,
    category: 'physical',
    subcategory: 'Pets & Animals',
    images: [
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    rating: 4.86,
    reviewsCount: 58,
    sellerId: 'ven-002',
    sellerName: 'Global Audio Masters',
    sellerVerified: true,
    features: ['1080p HD Night Vision Camera', 'Custom Voice Call-Outs', '4L Desiccant Sealed Hopper', 'App Portion Control'],
    shippingWeightKg: 2.3,
    tags: ['pets_animals', 'pet products', 'pet services', 'smart feeder', 'pets']
  },

  // 18. Baby & Kids
  {
    id: 'prod-baby-01',
    title: 'Montessori Wooden Sensory Activity & Learning Board',
    description: 'Eco-friendly solid birch sensory activity station designed for fine motor skill development, cognitive sorting, and interactive STEM discovery.',
    pricePi: 17.50,
    category: 'physical',
    subcategory: 'Baby & Kids',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 55,
    rating: 4.93,
    reviewsCount: 71,
    sellerId: 'ven-003',
    sellerName: 'Kyoto Artisan Collective',
    sellerVerified: true,
    features: ['100% Solid Birch Wood', 'Non-Toxic Water-Based Paint', 'Montessori Certified Design'],
    shippingWeightKg: 1.4,
    tags: ['baby_kids', 'toys', 'baby products', 'montessori', 'kids clothing']
  },

  // 19. Business & Office
  {
    id: 'prod-off-01',
    title: 'Thermal Barcode & Shipping Label High-Speed Printer',
    description: 'Commercial 203 DPI direct thermal label printer with USB and Bluetooth connectivity for automated warehouse and e-commerce merchant dispatch.',
    pricePi: 42.00,
    category: 'physical',
    subcategory: 'Business & Office',
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    rating: 4.91,
    reviewsCount: 64,
    sellerId: 'ven-001',
    sellerName: 'PiTech Official Store',
    sellerVerified: true,
    features: ['150mm/s High-Speed Printing', 'No Ink or Toner Needed', 'Works with 4x6 Shipping Labels', 'Cross-Platform Drivers'],
    shippingWeightKg: 1.8,
    tags: ['business_office', 'office supplies', 'business equipment', 'printing', 'wholesale']
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
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 14200.50,
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-01-15',
    country: 'United States',
    shippingCountries: ['Worldwide', 'United States', 'United Kingdom', 'Nigeria', 'India', 'Japan', 'Germany', 'Brazil'],
    productCount: 18,
    followersCount: 14200,
    policies: {
      shippingPolicy: 'Dispatches within 24-48 business hours via insured express carrier with tracking.',
      refundPolicy: '30-day PSTP Escrow return window for sealed hardware and unopened accessories.',
      averageDispatchTime: '1-2 business days',
      supportTerms: '24/7 dedicated support via direct messaging and compliance ticketing.'
    },
    contactEmail: 'support@pitech.store',
    contactPhone: '+1 (555) 438-9201',
    websiteUrl: 'https://pitech.store'
  },
  {
    id: 'ven-002',
    sellerUsername: 'audio_masters',
    storeName: 'Global Audio Masters',
    bio: 'Acoustic engineering and high-fidelity smart home equipment designed with studio precision and built for the decentralized era.',
    rating: 4.85,
    reviewsCount: 210,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 7420.00,
    bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-04-10',
    country: 'Germany',
    shippingCountries: ['Worldwide', 'European Union', 'United States', 'Canada', 'Australia', 'United Kingdom'],
    productCount: 12,
    followersCount: 8900,
    policies: {
      shippingPolicy: 'Global DHL Express delivery with tamper-proof seal and serial tracking.',
      refundPolicy: '14-day replacement warranty on acoustic components.',
      averageDispatchTime: '24 hours',
      supportTerms: 'Standard CET business hours technical audio support.'
    },
    contactEmail: 'orders@audiomasters.eu',
    websiteUrl: 'https://audiomasters.eu'
  },
  {
    id: 'ven-003',
    sellerUsername: 'kyoto_artisan',
    storeName: 'Kyoto Artisan Collective',
    bio: 'Traditional handcrafted silk apparel, bespoke ceramics, and artisanal home goods created by heritage Japanese guild masters.',
    rating: 4.92,
    reviewsCount: 145,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 5120.00,
    bannerImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-05-20',
    country: 'Japan',
    shippingCountries: ['Worldwide', 'Japan', 'United States', 'Singapore', 'South Korea', 'United Kingdom'],
    productCount: 9,
    followersCount: 6300,
    policies: {
      shippingPolicy: 'Japan Post EMS express international air freight with custom insured packaging.',
      refundPolicy: 'Authenticity guaranteed with certificate of origin; 14-day exchange policy.',
      averageDispatchTime: '2-3 business days',
      supportTerms: 'Bilingual support in Japanese and English.'
    },
    contactEmail: 'contact@kyotoartisan.jp'
  },
  {
    id: 'ven-004',
    sellerUsername: 'codenova_dev',
    storeName: 'CodeNova Labs',
    bio: 'Verified digital downloads creator specializing in high-performance web templates, developer scripts, and educational Pi content.',
    rating: 4.95,
    reviewsCount: 262,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 8900.00,
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-03-10',
    country: 'Canada',
    shippingCountries: ['Digital Delivery (Global)'],
    productCount: 14,
    followersCount: 11200,
    policies: {
      shippingPolicy: 'Instant automated digital asset delivery directly into your PiNova Digital Vault.',
      digitalDeliveryTerms: 'Single or multi-seat license key with permanent version update access.',
      refundPolicy: 'Digital download terms apply with PSTP key validation support.',
      averageDispatchTime: 'Instant (0 seconds)',
      supportTerms: 'GitHub repository issue tracker access and Discord developer channel.'
    },
    contactEmail: 'dev@codenova.io',
    websiteUrl: 'https://codenova.io'
  },
  {
    id: 'ven-005',
    sellerUsername: 'game_vault',
    storeName: 'Global GameVault',
    bio: 'Authorized global eGift card aggregator, digital entertainment distributor, and gaming balance exchange.',
    rating: 4.9,
    reviewsCount: 420,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 19800.00,
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-02-18',
    country: 'United Kingdom',
    shippingCountries: ['Worldwide Instant Digital'],
    productCount: 22,
    followersCount: 9400,
    policies: {
      shippingPolicy: 'Encrypted voucher redemption code delivered immediately upon server payment verification.',
      digitalDeliveryTerms: 'Original publisher keys redeemable on regional and global platforms.',
      averageDispatchTime: 'Instant'
    },
    contactEmail: 'support@gamevault.global'
  },
  {
    id: 'ven-006',
    sellerUsername: 'pipay_telecom',
    storeName: 'PiPay Telecom Direct',
    bio: 'Official global telecom aggregator enabling instant mobile airtime topups and data bundle recharges across 140+ countries in Pi Coin.',
    rating: 4.88,
    reviewsCount: 860,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 32100.00,
    bannerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-02-01',
    country: 'Global',
    shippingCountries: ['Global Automated Digital (140+ Countries)'],
    productCount: 30,
    followersCount: 18500,
    policies: {
      shippingPolicy: 'Direct carrier API automated topup with real-time network reference receipt.',
      averageDispatchTime: 'Under 10 seconds'
    },
    contactEmail: 'gateway@pipaytelecom.com'
  },
  {
    id: 'ven-007',
    sellerUsername: 'enterprise_services',
    storeName: 'PiNova Enterprise Services',
    bio: 'Certified blockchain architects and cloud engineers providing smart contract security audits, node hosting, and DApp deployment.',
    rating: 4.96,
    reviewsCount: 78,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 24500.00,
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-01-05',
    country: 'United States',
    shippingCountries: ['Global Remote Services'],
    productCount: 6,
    followersCount: 7200,
    policies: {
      shippingPolicy: 'Dedicated service delivery via milestone review, Git collaboration, and encrypted reports.',
      refundPolicy: 'PSTP Escrow milestone-based release upon agreed deliverables acceptance.',
      averageDispatchTime: '2-5 business days'
    },
    contactEmail: 'enterprise@pinovahub.com',
    websiteUrl: 'https://pinovahub.com/enterprise'
  },
  {
    id: 'ven-008',
    sellerUsername: 'utilitypay_network',
    storeName: 'Global UtilityPay Network',
    bio: 'Automated global utility clearinghouse supporting instant prepaid electricity, water, solar, and cable TV tokens with automated cryptographic invoice receipts.',
    rating: 4.95,
    reviewsCount: 195,
    verified: true,
    verificationStatus: 'Verified',
    sellerStatus: 'Active',
    totalSalesPi: 18900.00,
    bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80',
    joinedDate: '2024-02-14',
    country: 'International / Multi-Regional',
    shippingCountries: ['Worldwide Digital Delivery'],
    productCount: 15,
    followersCount: 14200,
    policies: {
      shippingPolicy: 'Instant automated generation and direct cryptographic meter token dispatch.',
      refundPolicy: 'Instant automated reverse credit if meter verification returns unconfirmed status.',
      averageDispatchTime: 'Instant (Under 5 seconds)'
    },
    contactEmail: 'support@utilitypay.network',
    websiteUrl: 'https://utilitypay.network'
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
