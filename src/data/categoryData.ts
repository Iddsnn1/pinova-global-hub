import { MarketplaceCategory, UtilityCategory, ServiceCategory } from '../types/navigation';

export interface MarketplaceCategoryDef {
  id: MarketplaceCategory;
  name: string;
  description: string;
  iconName: string;
  bannerImage: string;
  subcategories: string[];
}

export interface UtilityCategoryDef {
  id: UtilityCategory;
  name: string;
  description: string;
  iconName: string;
  popularProviders: string[];
  fieldLabel: string;
  placeholder: string;
  badgeText: string;
  defaultAmountsUsd: number[];
}

export interface ServiceCategoryDef {
  id: ServiceCategory;
  name: string;
  description: string;
  iconName: string;
  popularServices: string[];
  averagePricePi: number;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryDef[] = [
  {
    id: 'smartphones',
    name: 'Smart Phones',
    description: 'Flagship & budget smartphones, 5G devices, mobile accessories, and Pi-compatible mobile hardware.',
    iconName: 'Smartphone',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Flagship 5G', 'Android Phones', 'iPhones & iOS', 'Phone Accessories', 'Screen Protectors']
  },
  {
    id: 'computers',
    name: 'Computers',
    description: 'Laptops, desktop workstations, gaming PCs, PC components, monitors, and networking hardware.',
    iconName: 'Laptop',
    bannerImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Laptops', 'Desktops', 'Monitors', 'PC Parts', 'Storage & SSDs', 'Keyboards & Mice']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Men & women apparel, designer footwear, artisan jewelry, luxury silk robes, and activewear.',
    iconName: 'Shirt',
    bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Footwear', 'Watches & Jewelry', 'Bags & Accessories']
  },
  {
    id: 'home_living',
    name: 'Home & Living',
    description: 'Smart home automation, artisan furniture, kitchen appliances, luxury bedding, and decor.',
    iconName: 'Home',
    bannerImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Smart Home', 'Furniture', 'Kitchenware', 'Lighting', 'Bedding & Textiles']
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Audio devices, hardware wallets, solar generators, cameras, drones, and wearable tech.',
    iconName: 'Zap',
    bannerImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Audio & ANC Headphones', 'Crypto Hardware Wallets', 'Power Banks & Solar', 'Cameras & Drones', 'Smartwatches']
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Organic skincare, luxury fragrances, haircare formulas, grooming tools, and wellness kits.',
    iconName: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Skincare', 'Perfumes & Fragrances', 'Makeup', 'Haircare', 'Grooming Tools']
  },
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Organic foods, specialty coffee beans, gourmet pantry items, imported snacks, and beverages.',
    iconName: 'ShoppingBag',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Specialty Coffee & Tea', 'Organic Snacks', 'Pantry Staples', 'Superfoods', 'Spices & Oils']
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    description: 'Electric scooters, EV accessories, auto spare parts, car diagnostic tools, and dashcams.',
    iconName: 'Car',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Electric Scooters & E-Bikes', 'Car Electronics & Dashcams', 'Spare Parts', 'Car Care & Detailing']
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Cryptocurrency masterclasses, technical manuals, fiction bestsellers, e-books, and audiobooks.',
    iconName: 'BookOpen',
    bannerImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Crypto & Blockchain', 'Business & Tech', 'E-Books', 'Fiction & Literature', 'Educational']
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness equipment, smartwatch trackers, outdoor camping gear, sports wear, and bicycles.',
    iconName: 'Activity',
    bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Fitness Equipment', 'Outdoor & Camping', 'Cycling & Scooters', 'Sportswear', 'Recovery Tech']
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Medical monitors, herbal supplements, wellness massage tools, and air purifiers.',
    iconName: 'HeartPulse',
    bannerImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Vitamins & Supplements', 'Health Monitors', 'Massage Devices', 'Air Quality & Purifiers']
  },
  {
    id: 'toys',
    name: 'Toys',
    description: 'STEM building kits, programmable robotics, remote control drones, board games, and plushies.',
    iconName: 'Gamepad2',
    bannerImage: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['STEM & Robotics', 'RC Drones & Cars', 'Board Games & Puzzles', 'Action Figures']
  },
  {
    id: 'industrial_equipment',
    name: 'Industrial Equipment',
    description: 'Solar panels, 3D printers, commercial tools, measuring instruments, and heavy workshop gear.',
    iconName: 'Wrench',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Solar Inverters & Batteries', '3D Printers & CNC', 'Power Tools', 'Safety & PPE']
  },
  {
    id: 'deals',
    name: 'Promotions & Deals',
    description: 'Merchant Week Offers, Featured Deals, Flash Sales, Limited-Time Discounts & Recommended Promotions.',
    iconName: 'Flame',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Merchant Week Offers', 'Featured Deals', 'Flash Sales', 'Limited-Time Discounts', 'Recommended Promotions']
  }
];

export const UTILITY_CATEGORIES: UtilityCategoryDef[] = [
  {
    id: 'airtime',
    name: 'Airtime',
    description: 'Instant mobile talktime credit top-up for 140+ global telecom operators in Pi Coin.',
    iconName: 'Smartphone',
    popularProviders: ['MTN Nigeria', 'Airtel India', 'Safaricom Kenya', 'Vodafone Ghana', 'Orange Francophone', 'Globe Philippines'],
    fieldLabel: 'Mobile Phone Number',
    placeholder: '+234 803 123 4567 or +254 712 345 678',
    badgeText: 'Instant Topup',
    defaultAmountsUsd: [5, 10, 20, 50]
  },
  {
    id: 'mobile_data',
    name: 'Mobile Data',
    description: 'High-speed 4G / 5G internet data bundles directly credited to any mobile subscriber line.',
    iconName: 'Wifi',
    popularProviders: ['MTN 10GB Monthly', 'Airtel Unlimited Data', 'Safaricom 5G Bundle', 'Vodafone Data Pass', 'Jio India Data'],
    fieldLabel: 'Subscriber Mobile Number',
    placeholder: '+234 803 999 8877',
    badgeText: 'High Speed 5G',
    defaultAmountsUsd: [3, 8, 15, 30]
  },
  {
    id: 'electricity',
    name: 'Electricity',
    description: 'Pay prepaid meter tokens or settle postpaid electric utility bills instantly in Pi Coin.',
    iconName: 'Zap',
    popularProviders: ['Ikeja Electric (IE)', 'Eko Electricity (EKEDC)', 'Kenya Power (KPLC)', 'Tshwane Electricity SA', 'TESCO UK'],
    fieldLabel: 'Meter or Account Number',
    placeholder: '4502-1192-3819 or Account ID',
    badgeText: 'Instant Token',
    defaultAmountsUsd: [10, 25, 50, 100]
  },
  {
    id: 'water_bills',
    name: 'Water Bills',
    description: 'Settle residential and commercial municipal water meter balances with verified ledger receipts.',
    iconName: 'Droplet',
    popularProviders: ['Nairobi Water', 'Lagos Water Corp', 'Rand Water South Africa', 'Manila Water', 'NWSC Uganda'],
    fieldLabel: 'Water Account ID',
    placeholder: 'ACC-WAT-98213-KE',
    badgeText: 'Verified Receipt',
    defaultAmountsUsd: [10, 20, 40, 80]
  },
  {
    id: 'cable_tv',
    name: 'Cable TV',
    description: 'Renew satellite and digital television decoder subscriptions directly in Pi Coin.',
    iconName: 'Tv',
    popularProviders: ['DSTV Premium', 'GOtv Max', 'StarTimes Super', 'Tata Play India', 'Canal+ Afrique'],
    fieldLabel: 'Smartcard / IUC Number',
    placeholder: '1029-3847-5612',
    badgeText: 'Instant Renewal',
    defaultAmountsUsd: [15, 30, 60, 90]
  },
  {
    id: 'internet_services',
    name: 'Internet Services',
    description: 'Pay fiber optic broadband, Starlink, and ISP monthly subscription invoices.',
    iconName: 'Globe',
    popularProviders: ['Starlink Satellite', 'Safaricom Home Fibre', 'Spectranet 4G', 'Airtel Broadband', 'Liquid Telecom'],
    fieldLabel: 'ISP Account / Circuit ID',
    placeholder: 'ACC-STARLINK-8831-PI',
    badgeText: 'Broadband',
    defaultAmountsUsd: [30, 60, 100, 150]
  },
  {
    id: 'exam_cards',
    name: 'Exam Cards',
    description: 'Purchase WAEC, NECO, JAMB, NABTEB, and university entrance result checker pin cards.',
    iconName: 'FileCheck',
    popularProviders: ['WAEC Direct PIN', 'NECO Result Scratch Card', 'JAMB e-PIN', 'NABTEB Direct'],
    fieldLabel: 'Candidate Registration / Email',
    placeholder: 'candidate@examportal.edu',
    badgeText: 'Instant PIN Code',
    defaultAmountsUsd: [5, 10, 15, 25]
  },
  {
    id: 'education_payments',
    name: 'Education Payments',
    description: 'Pay school fees, university tuition deposits, and online course certifications using Pi Coin.',
    iconName: 'GraduationCap',
    popularProviders: ['Global University Tuition Gateway', 'Coursera Certificate Pass', 'EdX MasterPass', 'Udemy Tech Pass'],
    fieldLabel: 'Student Matriculation ID',
    placeholder: 'STU-2026-8812',
    badgeText: 'Official Receipt',
    defaultAmountsUsd: [50, 100, 250, 500]
  },
  {
    id: 'gift_cards',
    name: 'Gift Cards',
    description: 'Buy digital eGift cards for Amazon, Apple, Google Play, Steam, PlayStation, and Walmart.',
    iconName: 'Gift',
    popularProviders: ['Amazon eGift', 'Apple & iTunes', 'Google Play', 'Steam Wallet', 'PlayStation Store', 'Xbox Live'],
    fieldLabel: 'Recipient Email Address',
    placeholder: 'pioneer.recipient@gmail.com',
    badgeText: 'Digital Voucher',
    defaultAmountsUsd: [10, 25, 50, 100]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Top up in-game currencies, battle passes, PUBG UC, Free Fire Diamonds, and Roblox Robux.',
    iconName: 'Gamepad2',
    popularProviders: ['PUBG Mobile UC', 'Free Fire Diamonds', 'Roblox Robux', 'Mobile Legends Diamonds', 'Call of Duty CP'],
    fieldLabel: 'Player ID / Game Character ID',
    placeholder: 'PLAYER-ID-992813',
    badgeText: 'Instant Credit',
    defaultAmountsUsd: [5, 10, 25, 50]
  },
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Renew Netflix, Spotify Premium, YouTube Premium, Disney+, and Apple Music passes.',
    iconName: 'Video',
    popularProviders: ['Netflix Premium', 'Spotify Family Pass', 'YouTube Premium', 'Disney+ Hotstar', 'Amazon Prime Video'],
    fieldLabel: 'Subscriber Account Email',
    placeholder: 'streamer.pioneer@pi.net',
    badgeText: 'Instant Key',
    defaultAmountsUsd: [10, 15, 25, 40]
  },
  {
    id: 'government_services',
    name: 'Government Services',
    description: 'Pay municipal taxes, passport application fees, civic permit renewals, and license verifications.',
    iconName: 'Landmark',
    popularProviders: ['Remita Gov e-Portal', 'National Identity Verification Fee', 'Driver License Renewal', 'City Business Permit'],
    fieldLabel: 'RRR / Government Invoice ID',
    placeholder: 'RRR-2918-3849-1029',
    badgeText: 'Official Gateway',
    defaultAmountsUsd: [20, 50, 100, 200]
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Pay health insurance premiums, auto vehicle policies, and micro-travel protection.',
    iconName: 'Shield',
    popularProviders: ['Pi Nova Micro Health Plan', 'Auto Vehicle Third Party', 'Global Travel Protection', 'Home Property Shield'],
    fieldLabel: 'Policy / National ID Number',
    placeholder: 'POL-PI-88231',
    badgeText: 'Protection Pass',
    defaultAmountsUsd: [15, 30, 75, 150]
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Book metro train passes, interstate bus tickets, ride-hailing credits, and toll pass recharges.',
    iconName: 'Car',
    popularProviders: ['Lagos Cowry Metro Pass', 'Uber Ride Voucher', 'Interstate Express Bus', 'Highway Electronic Toll PIN'],
    fieldLabel: 'Metro Card / Rider ID',
    placeholder: 'CARD-METRO-99812',
    badgeText: 'Instant QR Ticket',
    defaultAmountsUsd: [5, 15, 30, 60]
  },
  {
    id: 'event_tickets',
    name: 'Event Tickets',
    description: 'Purchase verified digital entry tickets and VIP passes for concerts, sports matches, and Pi meetups.',
    iconName: 'Ticket',
    popularProviders: ['Global Pi Fest Conference', 'Afrobeats Live Concert', 'Tech Pioneer Summit', 'E-Sports World Cup Pass'],
    fieldLabel: 'Attendee Full Name & Email',
    placeholder: 'Alex Pioneer (alex@pi.org)',
    badgeText: 'NFT Entry Pass',
    defaultAmountsUsd: [20, 50, 120, 300]
  },
  {
    id: 'vouchers',
    name: 'Shopping Vouchers',
    description: 'Purchase digital retail, supermarket, and dining discount vouchers.',
    iconName: 'Ticket',
    popularProviders: ['Jumia Shopping Voucher', 'Carrefour Express Pass', 'Shoprite Discount Pass'],
    fieldLabel: 'Recipient Phone or Email',
    placeholder: 'pioneer.shopper@pi.net',
    badgeText: 'Instant Voucher',
    defaultAmountsUsd: [10, 25, 50, 100]
  },
  {
    id: 'betting',
    name: 'Sports Betting',
    description: 'Instant wallet deposit to licensed sportsbooks and gaming accounts.',
    iconName: 'Coins',
    popularProviders: ['Bet9ja Direct', 'SportyBet Instant', '1xBet Wallet', 'Betika Kenya'],
    fieldLabel: 'Player Account User ID',
    placeholder: 'USER-BET-991823',
    badgeText: 'Instant Deposit',
    defaultAmountsUsd: [5, 10, 20, 50]
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Credit',
    description: 'Load store credit for Jumia, Amazon, AliExpress, and online merchant hubs.',
    iconName: 'Gift',
    popularProviders: ['Jumia Store Credit', 'Amazon Shopper Pass', 'AliExpress Credit PIN'],
    fieldLabel: 'Customer Account / Email',
    placeholder: 'buyer@ecomstore.com',
    badgeText: 'Store Credit',
    defaultAmountsUsd: [10, 20, 50, 100]
  }
];

export const SERVICE_CATEGORIES: ServiceCategoryDef[] = [
  {
    id: 'consultation',
    name: 'Professional Consultation',
    description: '1-on-1 virtual consultations with verified Pi legal experts, crypto accountants, and tech advisors.',
    iconName: 'UserCheck',
    popularServices: ['Pi App Architecture Audit', 'Crypto Tax & Compliance', 'Legal Trademark Advice'],
    averagePricePi: 25.00
  },
  {
    id: 'freelance_tech',
    name: 'Tech & Design Freelancing',
    description: 'Hire skilled developer pioneers for UI/UX design, React code development, smart contract setup, and translation.',
    iconName: 'Code',
    popularServices: ['Full-stack App Development', 'UI/UX Mobile Design', 'Pi SDK Integration'],
    averagePricePi: 50.00
  },
  {
    id: 'repairs_maintenance',
    name: 'Repairs & Tech Maintenance',
    description: 'Hardware repair bookings, smartphone screen replacement, laptop diagnostics, and solar installation.',
    iconName: 'Wrench',
    popularServices: ['Smartphone Screen Repair', 'Laptop Motherboard Service', 'Solar Inverter Setup'],
    averagePricePi: 35.00
  },
  {
    id: 'home_cleaning',
    name: 'Home & Office Services',
    description: 'Book verified local cleaning crews, handyman assistance, plumbing, and HVAC maintenance.',
    iconName: 'Sparkles',
    popularServices: ['Residential Deep Clean', 'Handyman Plumbing Service', 'AC Chemical Service'],
    averagePricePi: 30.00
  },
  {
    id: 'events_photography',
    name: 'Event & Media Services',
    description: 'Book professional photographers, videographers, DJ audio setups, and event coordinators.',
    iconName: 'Camera',
    popularServices: ['Product Photography Package', 'Event Drone Videography', 'Brand Logo Animation'],
    averagePricePi: 45.00
  }
];
