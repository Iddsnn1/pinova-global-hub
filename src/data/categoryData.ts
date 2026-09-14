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
    id: 'phones_mobile',
    name: 'Phones & Mobile',
    description: 'Smartphones, feature phones, tablets, accessories, chargers, protective cases, and spare parts.',
    iconName: 'Smartphone',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Smartphones',
      'Feature Phones',
      'Tablets',
      'Phone Accessories',
      'Chargers & Cables',
      'Cases & Protection',
      'Batteries',
      'Spare Parts'
    ]
  },
  {
    id: 'computers_technology',
    name: 'Computers & Technology',
    description: 'Laptops, desktop workstations, monitors, printers, networking hardware, storage, and software.',
    iconName: 'Laptop',
    bannerImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Laptops',
      'Desktops',
      'Monitors',
      'Printers & Scanners',
      'Computer Accessories',
      'Networking',
      'Storage',
      'Software & Digital Products'
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'TVs, audio systems, digital cameras, gaming consoles, smart home devices, wearables, and appliances.',
    iconName: 'Zap',
    bannerImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'TVs',
      'Audio',
      'Cameras',
      'Gaming',
      'Smart Home',
      'Wearables',
      'Appliances',
      'Electronic Components'
    ]
  },
  {
    id: 'automotive_transport',
    name: 'Automotive & Transport',
    description: 'Cars, motorcycles, commercial vehicles, auto spare parts, tires, wheels, batteries, and repair services.',
    iconName: 'Car',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Cars',
      'Motorcycles',
      'Commercial Vehicles',
      'Auto Parts',
      'Tires & Wheels',
      'Batteries',
      'Accessories',
      'Repairs & Services'
    ]
  },
  {
    id: 'home_living',
    name: 'Home & Living',
    description: 'Furniture, kitchenware, home appliances, ambient lighting, home improvement, security, and garden decor.',
    iconName: 'Home',
    bannerImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Furniture',
      'Kitchen',
      'Home Appliances',
      'Lighting',
      'Home Improvement',
      'Security',
      'Garden & Outdoor'
    ]
  },
  {
    id: 'fashion_beauty',
    name: 'Fashion & Beauty',
    description: 'Men & women apparel, kids wear, designer footwear, bags, artisan jewelry, watches, and personal care.',
    iconName: 'Shirt',
    bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Men',
      'Women',
      'Kids',
      'Shoes',
      'Bags',
      'Jewelry',
      'Watches',
      'Beauty & Personal Care'
    ]
  },
  {
    id: 'food_groceries',
    name: 'Food & Groceries',
    description: 'Specialty pantry staples, organic fresh foods, packaged snacks, fine beverages, and catering services.',
    iconName: 'ShoppingBag',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Groceries',
      'Fresh Food',
      'Packaged Food',
      'Beverages',
      'Restaurants & Food Services',
      'Catering'
    ]
  },
  {
    id: 'industrial_construction',
    name: 'Industrial, Tools & Construction',
    description: 'Power tools, building materials, electrical components, plumbing equipment, and industrial machinery.',
    iconName: 'Wrench',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Tools',
      'Building Materials',
      'Electrical Supplies',
      'Plumbing',
      'Machinery',
      'Industrial Equipment',
      'Agricultural Equipment'
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    description: 'Direct farm produce, certified seeds, organic fertilizers, livestock, and agricultural machinery.',
    iconName: 'Sprout',
    bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Farm Produce',
      'Seeds',
      'Fertilizers',
      'Livestock',
      'Farm Equipment',
      'Agricultural Services'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Online masterclasses, blockchain courses, academic tutoring, professional certifications, and study guides.',
    iconName: 'GraduationCap',
    bannerImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Courses',
      'Tutoring',
      'Training',
      'Certifications',
      'Educational Materials'
    ]
  },
  {
    id: 'professional_services',
    name: 'Professional & Local Services',
    description: 'Technology development, repair technicians, home cleaning, legal consulting, accounting, and delivery.',
    iconName: 'Briefcase',
    bannerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Technology Services',
      'Repairs',
      'Cleaning',
      'Construction',
      'Design',
      'Legal',
      'Accounting',
      'Marketing',
      'Consulting',
      'Delivery & Logistics'
    ]
  },
  {
    id: 'travel_transport',
    name: 'Travel & Transport Services',
    description: 'Flight bookings, hotel reservations, interstate buses, train passes, vehicle rentals, and travel itineraries.',
    iconName: 'Plane',
    bannerImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Flights',
      'Hotels',
      'Buses',
      'Trains',
      'Car Rental',
      'Travel Services'
    ]
  },
  {
    id: 'entertainment_creative',
    name: 'Entertainment & Creative',
    description: 'Concert & event passes, media production, professional photography, studio audio recording, and visual arts.',
    iconName: 'Camera',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Events',
      'Photography',
      'Video',
      'Music',
      'Creative Services',
      'Media'
    ]
  },
  {
    id: 'pets_animals',
    name: 'Pets & Animals',
    description: 'Pet food, animal accessories, veterinary consultations, grooming supplies, and livestock services.',
    iconName: 'Footprints',
    bannerImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Pet Products',
      'Pet Services',
      'Livestock & Animal Services'
    ]
  },
  {
    id: 'baby_kids',
    name: 'Baby & Kids',
    description: 'Baby essentials, educational toys, kids fashion, nursery furniture, and maternity care products.',
    iconName: 'Gamepad2',
    bannerImage: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Baby Products',
      'Toys',
      'Kids Clothing',
      'Maternity'
    ]
  },
  {
    id: 'health_wellness',
    name: 'Health & Wellness',
    description: 'Vitamins, supplements, fitness gym gear, personal wellness trackers, therapeutic devices, and air care.',
    iconName: 'HeartPulse',
    bannerImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Health Products',
      'Fitness',
      'Wellness Services',
      'Personal Care'
    ]
  },
  {
    id: 'business_office',
    name: 'Business & Office',
    description: 'Office stationery, commercial printing, business hardware, corporate solutions, and wholesale merchandise.',
    iconName: 'Building2',
    bannerImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Office Supplies',
      'Business Equipment',
      'Printing',
      'Corporate Services',
      'Wholesale'
    ]
  },
  {
    id: 'other_general',
    name: 'Other & Promotions',
    description: 'Flash sales, limited-time promotions, merchant week specials, and general catalog marketplace listings.',
    iconName: 'Layers',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    subcategories: [
      'Miscellaneous Products',
      'Miscellaneous Services',
      'Flash Deals & Promotions'
    ]
  }
];

export const MARKETPLACE_CATEGORY_ALIASES: Record<string, MarketplaceCategory> = {
  phones_mobile: 'phones_mobile',
  computers_technology: 'computers_technology',
  electronics: 'electronics',
  automotive_transport: 'automotive_transport',
  home_living: 'home_living',
  fashion_beauty: 'fashion_beauty',
  food_groceries: 'food_groceries',
  industrial_construction: 'industrial_construction',
  agriculture: 'agriculture',
  education: 'education',
  professional_services: 'professional_services',
  travel_transport: 'travel_transport',
  entertainment_creative: 'entertainment_creative',
  pets_animals: 'pets_animals',
  baby_kids: 'baby_kids',
  health_wellness: 'health_wellness',
  business_office: 'business_office',
  other_general: 'other_general',

  // Aliases and legacy mappings
  smartphones: 'phones_mobile',
  phones: 'phones_mobile',
  mobile: 'phones_mobile',
  computers: 'computers_technology',
  technology: 'computers_technology',
  laptops: 'computers_technology',
  vehicles: 'automotive_transport',
  automotive: 'automotive_transport',
  cars: 'automotive_transport',
  fashion: 'fashion_beauty',
  beauty: 'fashion_beauty',
  clothing: 'fashion_beauty',
  apparel: 'fashion_beauty',
  groceries: 'food_groceries',
  food: 'food_groceries',
  industrial_equipment: 'industrial_construction',
  tools: 'industrial_construction',
  construction: 'industrial_construction',
  books: 'education',
  courses: 'education',
  services: 'professional_services',
  technology_services: 'professional_services',
  freelance: 'professional_services',
  travel: 'travel_transport',
  transport_services: 'travel_transport',
  entertainment: 'entertainment_creative',
  creative: 'entertainment_creative',
  pets: 'pets_animals',
  animals: 'pets_animals',
  toys: 'baby_kids',
  baby: 'baby_kids',
  kids: 'baby_kids',
  sports: 'health_wellness',
  health: 'health_wellness',
  wellness: 'health_wellness',
  fitness: 'health_wellness',
  office: 'business_office',
  business: 'business_office',
  deals: 'other_general',
  promotions: 'other_general',
  other: 'other_general',
  general: 'other_general',
  all: 'all'
};

export const resolveMarketplaceCategory = (input?: string): MarketplaceCategory => {
  if (!input) return 'all';
  const clean = input.trim().toLowerCase().replace(/[\s-&]+/g, '_');
  if (clean === 'all') return 'all';
  if (MARKETPLACE_CATEGORY_ALIASES[clean]) {
    return MARKETPLACE_CATEGORY_ALIASES[clean];
  }
  const found = MARKETPLACE_CATEGORIES.find(
    (c) => c.id === clean || c.name.toLowerCase().replace(/[\s-&]+/g, '_') === clean
  );
  return found ? found.id : (clean as MarketplaceCategory);
};

export const getMarketplaceCategoryDef = (id?: string): MarketplaceCategoryDef | undefined => {
  if (!id || id === 'all') return undefined;
  const canonicalId = resolveMarketplaceCategory(id);
  return MARKETPLACE_CATEGORIES.find((c) => c.id === canonicalId) || MARKETPLACE_CATEGORIES.find((c) => c.id === id);
};

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
    name: 'Exam Cards & PINs',
    description: 'Purchase WAEC, NECO, JAMB, NABTEB, and NBAIS result checker pin cards and registration tokens.',
    iconName: 'FileCheck',
    popularProviders: ['WAEC Direct PIN', 'NECO Result Scratch Card', 'JAMB e-PIN', 'NABTEB Direct', 'NBAIS Result PIN'],
    fieldLabel: 'Candidate Registration / Email',
    placeholder: 'candidate@examportal.edu',
    badgeText: 'Instant PIN Code',
    defaultAmountsUsd: [5, 10, 15, 25]
  },
  {
    id: 'education_payments',
    name: 'School Fees & Tuition Engine',
    description: 'Pay school fees, university tuition deposits, and academic charges across 6 tiers using Pi Coin.',
    iconName: 'GraduationCap',
    popularProviders: ['Bayero University Kano', 'University of Lagos', 'Accra Institute of Tech', 'National Open University', 'Imperial Gateway'],
    fieldLabel: 'Student Matriculation ID',
    placeholder: 'STU-2026-8812',
    badgeText: 'Official Receipt',
    defaultAmountsUsd: [50, 100, 250, 500]
  },
  {
    id: 'institution_registry',
    name: 'Institution Registry & Directory',
    description: 'Search verified universities, polytechnics, basic colleges, and schools across global jurisdictions.',
    iconName: 'Building2',
    popularProviders: ['BUK Portal', 'Unilag Nigeria', 'NUC Accredited Registry', 'Cambridge International', 'GTEC Ghana'],
    fieldLabel: 'Search Institution / State',
    placeholder: 'e.g. Bayero University, Kano State',
    badgeText: 'Verified Registry',
    defaultAmountsUsd: [10, 25, 50, 100]
  },
  {
    id: 'admissions_portal',
    name: 'Admissions & Enrolment Pipeline',
    description: 'Submit and track multi-institution academic admission applications and acceptance fee clearances.',
    iconName: 'BookOpen',
    popularProviders: ['JAMB CAPS Portal', 'BUK Admissions Desk', 'Unilag Central Enrolment', 'Direct Secondary Entry'],
    fieldLabel: 'Application Ref Number',
    placeholder: 'APP-2026-9042',
    badgeText: 'Admissions Desk',
    defaultAmountsUsd: [15, 30, 60, 120]
  },
  {
    id: 'receipt_verifier',
    name: 'Digital Receipt & Clearance Verifier',
    description: 'Cryptographically verify student tuition clearance certificates, digital bursary stamps, and audit hashes.',
    iconName: 'ShieldCheck',
    popularProviders: ['PiNova Verifier', 'Institutional Bursary Clearance', 'Government Audit Gateway'],
    fieldLabel: 'Receipt or Clearance Hash',
    placeholder: 'REC-NG-2026-XXXX or Verification Hash',
    badgeText: 'Zero-Trust Audit',
    defaultAmountsUsd: [1, 2, 5, 10]
  },
  {
    id: 'scholarships_aid',
    name: 'Scholarships & Student Grants',
    description: 'Explore merit scholarships, Pioneer endowment grants, and need-based academic subsidies.',
    iconName: 'Award',
    popularProviders: ['Pi Community Scholarship Fund', 'BUK Merit Grant', 'West Africa STEM Fellowship'],
    fieldLabel: 'Applicant National ID / NIN',
    placeholder: 'NIN or Student ID',
    badgeText: 'Financial Aid',
    defaultAmountsUsd: [5, 10, 20, 50]
  },
  {
    id: 'education_marketplace',
    name: 'Academic Marketplace & Supplies',
    description: 'Official curriculum textbooks, JAMB/WAEC prep past questions, scientific calculators, and STEM kits.',
    iconName: 'ShoppingBag',
    popularProviders: ['NERDC Curriculum Books', 'JAMB/WAEC Solutions', 'Casio STEM Lab Kit', 'Oxford Courseware'],
    fieldLabel: 'Student Delivery Address',
    placeholder: 'Campus Hall / Residential Address',
    badgeText: 'Curated Goods',
    defaultAmountsUsd: [10, 25, 50, 100]
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
