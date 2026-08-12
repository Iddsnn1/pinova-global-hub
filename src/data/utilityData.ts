import { UtilityServiceProvider, PiConversionConfig, ConversionRateLog, UtilityTransactionReceipt } from '../types/utility';

export const INITIAL_PI_CONVERSION_CONFIG: PiConversionConfig = {
  piRateUsd: 10.00, // Default: 1 Pi = $10.00 USD
  minPurchasePi: 0.000001,
  maxPurchasePi: 1000.00,
  currencyCode: 'USD',
  currencySymbol: '$',
  autoRateUpdateEnabled: true,
  autoUpdateSource: 'Pi Market Index Oracle API',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System Governance Engine'
};

export const INITIAL_CONVERSION_RATE_LOGS: ConversionRateLog[] = [
  {
    id: 'RATE-LOG-101',
    previousRateUsd: 8.50,
    newRateUsd: 10.00,
    reason: 'Pi Ecosystem Global Commerce Rate Adjustment',
    updatedBy: 'Platform_Admin',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'RATE-LOG-102',
    previousRateUsd: 10.00,
    newRateUsd: 10.00,
    reason: 'Routine Oracle Price Feed Verification',
    updatedBy: 'Oracle_Automated_Bot',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const UTILITY_CATEGORY_META: Record<string, { title: string; description: string; iconName: string; color: string }> = {
  airtime: {
    title: 'Airtime Recharge',
    description: 'Instant mobile top-up for global telecom carriers.',
    iconName: 'Smartphone',
    color: 'from-emerald-500 to-teal-600'
  },
  data: {
    title: 'Mobile Data Bundles',
    description: 'High-speed 4G/5G data packages for all networks.',
    iconName: 'Wifi',
    color: 'from-blue-500 to-indigo-600'
  },
  electricity: {
    title: 'Electricity Bills',
    description: 'Instant prepaid meter token generation & postpaid bill settlement.',
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600'
  },
  cable: {
    title: 'Cable TV Subscriptions',
    description: 'Pay DStv, GOtv, StarTimes, Canal+, and Sky packages instantly.',
    iconName: 'Tv',
    color: 'from-purple-500 to-violet-600'
  },
  internet: {
    title: 'Internet & Starlink',
    description: 'Starlink, fiber broadband, and 4G Wi-Fi subscriptions.',
    iconName: 'Globe',
    color: 'from-cyan-500 to-blue-600'
  },
  water: {
    title: 'Water Bills',
    description: 'Municipal and utility water bill settlement with instant receipts.',
    iconName: 'Droplets',
    color: 'from-sky-500 to-blue-600'
  },
  exam: {
    title: 'Exam Cards & E-PINs',
    description: 'WAEC Direct result pins, JAMB UTME PINs, and NECO tokens.',
    iconName: 'GraduationCap',
    color: 'from-indigo-500 to-purple-600'
  },
  education: {
    title: 'Education Payments',
    description: 'University tuition fees, school fee portal deposits, and e-learning.',
    iconName: 'BookOpen',
    color: 'from-rose-500 to-pink-600'
  },
  giftcard: {
    title: 'Global Gift Cards',
    description: 'Amazon, Apple, Google Play, Steam, PlayStation, and Xbox vouchers.',
    iconName: 'Gift',
    color: 'from-amber-400 to-rose-500'
  },
  voucher: {
    title: 'Digital Vouchers',
    description: 'Uber Cash, Starbucks, shopping vouchers, and store credits.',
    iconName: 'Ticket',
    color: 'from-fuchsia-500 to-pink-600'
  },
  betting: {
    title: 'Betting Wallet Top-up',
    description: 'Instant deposit to registered betting accounts (where permitted).',
    iconName: 'Coins',
    color: 'from-emerald-600 to-green-700'
  },
  gaming: {
    title: 'Gaming Top-ups',
    description: 'Free Fire Diamonds, PUBG UC, Roblox Robux, and Valorant Points.',
    iconName: 'Gamepad2',
    color: 'from-red-500 to-rose-600'
  },
  streaming: {
    title: 'Streaming Subscriptions',
    description: 'Netflix, Spotify Premium, Apple Music, and Disney+ vouchers.',
    iconName: 'Film',
    color: 'from-red-600 to-amber-600'
  },
  insurance: {
    title: 'Insurance Payments',
    description: 'Health, travel, auto, and property insurance premium payments.',
    iconName: 'Shield',
    color: 'from-teal-500 to-emerald-600'
  },
  government: {
    title: 'Government Services',
    description: 'Municipal taxes, passport renewal fees, and civic levies.',
    iconName: 'Building2',
    color: 'from-slate-600 to-slate-800'
  },
  transport: {
    title: 'Transport Tickets',
    description: 'Airline flight e-vouchers, railway passes, and bus fares.',
    iconName: 'Plane',
    color: 'from-blue-600 to-indigo-700'
  },
  events: {
    title: 'Event & Conference Tickets',
    description: 'Concerts, sports matches, and tech summit VIP access passes.',
    iconName: 'Ticket',
    color: 'from-purple-600 to-pink-600'
  },
  ecommerce: {
    title: 'Store Credit Vouchers',
    description: 'PiNova Store Credit, eBay, and global retail gift certificates.',
    iconName: 'ShoppingBag',
    color: 'from-amber-500 to-indigo-600'
  }
};

export const SAMPLE_UTILITY_PROVIDERS: UtilityServiceProvider[] = [
  // 1. AIRTIME (Organized by Country & Operator)
  // Nigeria (NG)
  {
    id: 'prov-airtime-mtn-ng',
    name: 'MTN Nigeria',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    dialCode: '+234',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Mobile Phone Number',
    accountPlaceholder: '0803 123 4567 or +234 803 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    packages: [
      { id: 'pkg-mtn-ng-2usd', name: 'MTN ₦1,000 Airtime', description: 'Instant network VTU top-up', fiatPrice: 2.00, currency: 'USD', validity: 'Instant', badge: 'Popular' },
      { id: 'pkg-mtn-ng-5usd', name: 'MTN ₦2,500 Airtime', description: 'Instant network VTU top-up', fiatPrice: 5.00, currency: 'USD', validity: 'Instant' },
      { id: 'pkg-mtn-ng-10usd', name: 'MTN ₦5,000 Airtime + Bonus', description: 'Includes +10% bonus talktime', fiatPrice: 10.00, currency: 'USD', validity: 'Instant', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-airtime-airtel-ng',
    name: 'Airtel Nigeria',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    dialCode: '+234',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Mobile Phone Number',
    accountPlaceholder: '0802 123 4567 or +234 802 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    packages: [
      { id: 'pkg-airtel-ng-2usd', name: 'Airtel ₦1,000 Airtime', description: 'Instant network credit top-up', fiatPrice: 2.00, currency: 'USD', validity: 'Instant' },
      { id: 'pkg-airtel-ng-5usd', name: 'Airtel ₦2,500 Airtime', description: 'Instant network credit top-up', fiatPrice: 5.00, currency: 'USD', validity: 'Instant', badge: 'Popular' },
      { id: 'pkg-airtel-ng-10usd', name: 'Airtel ₦5,000 Premium Top-up', description: 'Instant network credit top-up', fiatPrice: 10.00, currency: 'USD', validity: 'Instant' }
    ]
  },
  {
    id: 'prov-airtime-glo-ng',
    name: 'Glo Nigeria',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    dialCode: '+234',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Mobile Phone Number',
    accountPlaceholder: '0805 123 4567 or +234 805 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    packages: [
      { id: 'pkg-glo-ng-2usd', name: 'Glo ₦1,000 Airtime', description: 'Grandmasters of Data talktime', fiatPrice: 2.00, currency: 'USD', validity: 'Instant' },
      { id: 'pkg-glo-ng-5usd', name: 'Glo ₦2,500 Airtime + 5x Bonus', description: 'Includes 5x recharge promo bonus', fiatPrice: 5.00, currency: 'USD', validity: 'Instant', badge: '5x Bonus' }
    ]
  },
  {
    id: 'prov-airtime-9mobile-ng',
    name: '9mobile Nigeria',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    dialCode: '+234',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Mobile Phone Number',
    accountPlaceholder: '0809 123 4567 or +234 809 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    packages: [
      { id: 'pkg-9mob-ng-2usd', name: '9mobile ₦1,000 Airtime', description: 'Instant 9mobile line recharge', fiatPrice: 2.00, currency: 'USD', validity: 'Instant' },
      { id: 'pkg-9mob-ng-5usd', name: '9mobile ₦2,500 Airtime', description: 'Instant 9mobile line recharge', fiatPrice: 5.00, currency: 'USD', validity: 'Instant' }
    ]
  },

  // Kenya (KE)
  {
    id: 'prov-airtime-safaricom-ke',
    name: 'Safaricom Kenya',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    dialCode: '+254',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'M-PESA / Mobile Number',
    accountPlaceholder: '0712 345 678 or +254 712 345 678',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    packages: [
      { id: 'pkg-saf-3usd', name: 'Safaricom KSh 400 Airtime', description: 'Direct top-up via Pi Escrow', fiatPrice: 3.00, currency: 'USD', validity: 'Instant' },
      { id: 'pkg-saf-15usd', name: 'Safaricom KSh 2,000 Airtime', description: 'Direct top-up via Pi Escrow', fiatPrice: 15.00, currency: 'USD', validity: 'Instant', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-airtime-airtel-ke',
    name: 'Airtel Kenya',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    dialCode: '+254',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Airtel Mobile Number',
    accountPlaceholder: '0733 123 456 or +254 733 123 456',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-airtel-ke-3usd', name: 'Airtel KSh 400 Airtime', description: 'Instant network credit load', fiatPrice: 3.00, currency: 'USD', validity: 'Instant' }
    ]
  },
  {
    id: 'prov-airtime-telkom-ke',
    name: 'Telkom Kenya',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    dialCode: '+254',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Telkom Line Number',
    accountPlaceholder: '0770 123 456 or +254 770 123 456',
    minCustomFiat: 1.00,
    maxCustomFiat: 100.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-telkom-ke-3usd', name: 'Telkom KSh 400 Airtime', description: 'Instant top-up', fiatPrice: 3.00, currency: 'USD', validity: 'Instant' }
    ]
  },

  // Ghana (GH)
  {
    id: 'prov-airtime-mtn-gh',
    name: 'MTN Ghana',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    dialCode: '+233',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'MTN Ghana Number',
    accountPlaceholder: '024 123 4567 or +233 24 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-mtn-gh-3usd', name: 'MTN GH₵ 45 Airtime', description: 'Instant topup for MTN Ghana lines', fiatPrice: 3.00, currency: 'USD', validity: 'Instant', badge: 'Popular' },
      { id: 'pkg-mtn-gh-10usd', name: 'MTN GH₵ 150 Airtime', description: 'Instant topup for MTN Ghana lines', fiatPrice: 10.00, currency: 'USD', validity: 'Instant' }
    ]
  },
  {
    id: 'prov-airtime-telecel-gh',
    name: 'Telecel Ghana (Vodafone)',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    dialCode: '+233',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Telecel Ghana Number',
    accountPlaceholder: '020 123 4567 or +233 20 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-telecel-gh-3usd', name: 'Telecel GH₵ 45 Airtime', description: 'Instant credit delivery', fiatPrice: 3.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-airtime-at-gh',
    name: 'AT (AirtelTigo Ghana)',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    dialCode: '+233',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'AT Ghana Number',
    accountPlaceholder: '026 123 4567 or +233 26 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-at-gh-3usd', name: 'AT GH₵ 45 Airtime', description: 'Instant credit delivery', fiatPrice: 3.00, currency: 'USD' }
    ]
  },

  // India (IN)
  {
    id: 'prov-airtime-jio-in',
    name: 'Reliance Jio',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    country: 'India',
    countryCode: 'IN',
    dialCode: '+91',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Jio Mobile Number',
    accountPlaceholder: '98765 43210 or +91 98765 43210',
    minCustomFiat: 1.00,
    maxCustomFiat: 250.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-jio-in-3usd', name: 'Jio ₹299 Unlimited Plan', description: '28 Days Unlimited Voice & 1.5GB/Day', fiatPrice: 3.60, currency: 'USD', validity: '28 Days', badge: 'Popular' },
      { id: 'pkg-jio-in-8usd', name: 'Jio ₹666 84-Day Plan', description: '84 Days Unlimited Voice & 1.5GB/Day', fiatPrice: 8.00, currency: 'USD', validity: '84 Days', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-airtime-airtel-in',
    name: 'Airtel India',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'India',
    countryCode: 'IN',
    dialCode: '+91',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Airtel Mobile Number',
    accountPlaceholder: '98100 12345 or +91 98100 12345',
    minCustomFiat: 1.00,
    maxCustomFiat: 250.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-airtel-in-3usd', name: 'Airtel ₹299 Unlimited Plan', description: '28 Days Unlimited Calls & 1.5GB/Day', fiatPrice: 3.60, currency: 'USD', validity: '28 Days' }
    ]
  },
  {
    id: 'prov-airtime-vi-in',
    name: 'Vi (Vodafone Idea)',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'India',
    countryCode: 'IN',
    dialCode: '+91',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Vi Mobile Number',
    accountPlaceholder: '98200 12345 or +91 98200 12345',
    minCustomFiat: 1.00,
    maxCustomFiat: 250.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-vi-in-3usd', name: 'Vi ₹299 Unlimited Pack', description: '28 Days Unlimited Voice + Hero Unlimited', fiatPrice: 3.60, currency: 'USD' }
    ]
  },
  {
    id: 'prov-airtime-bsnl-in',
    name: 'BSNL India',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'India',
    countryCode: 'IN',
    dialCode: '+91',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'BSNL Mobile Number',
    accountPlaceholder: '94120 12345 or +91 94120 12345',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-bsnl-in-2usd', name: 'BSNL ₹199 Prepaid Voucher', description: '30 Days Talktime & Data voucher', fiatPrice: 2.40, currency: 'USD' }
    ]
  },

  // United States (US)
  {
    id: 'prov-airtime-att-us',
    name: 'AT&T Prepaid',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    dialCode: '+1',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'US Prepaid Mobile Number',
    accountPlaceholder: '(555) 019-2834 or +1 555 019 2834',
    minCustomFiat: 5.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-att-15usd', name: 'AT&T $15.00 Refill', description: 'Instant refill PIN or direct load', fiatPrice: 15.00, currency: 'USD' },
      { id: 'pkg-att-50usd', name: 'AT&T $50.00 Unlimited Refill', description: '30-day unlimited talk & text plan', fiatPrice: 50.00, currency: 'USD', badge: 'Best Seller' }
    ]
  },
  {
    id: 'prov-airtime-tmobile-us',
    name: 'T-Mobile Prepaid',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    dialCode: '+1',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'T-Mobile Phone Number',
    accountPlaceholder: '(555) 019-2835 or +1 555 019 2835',
    minCustomFiat: 10.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-tmob-25usd', name: 'T-Mobile $25 Refill Card', description: 'Instant refill to prepaid plan', fiatPrice: 25.00, currency: 'USD', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-airtime-verizon-us',
    name: 'Verizon Wireless',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    dialCode: '+1',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Verizon Mobile Number',
    accountPlaceholder: '(555) 019-2836 or +1 555 019 2836',
    minCustomFiat: 10.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-vzw-35usd', name: 'Verizon $35 Prepaid Refill', description: 'Instant prepaid account refill', fiatPrice: 35.00, currency: 'USD' }
    ]
  },

  // United Kingdom (GB)
  {
    id: 'prov-airtime-ee-uk',
    name: 'EE UK',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    dialCode: '+44',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'EE Mobile Number',
    accountPlaceholder: '07911 123456 or +44 7911 123456',
    minCustomFiat: 5.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-ee-uk-15usd', name: 'EE £10 Top-up Voucher', description: 'Instant EE Pay As You Go credit', fiatPrice: 13.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-airtime-o2-uk',
    name: 'O2 UK',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    dialCode: '+44',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'O2 Mobile Number',
    accountPlaceholder: '07911 654321 or +44 7911 654321',
    minCustomFiat: 5.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-o2-uk-15usd', name: 'O2 £10 Top-up Voucher', description: 'Instant O2 Pay As You Go credit', fiatPrice: 13.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-airtime-vodafone-uk',
    name: 'Vodafone UK',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    dialCode: '+44',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Vodafone Number',
    accountPlaceholder: '07911 987654 or +44 7911 987654',
    minCustomFiat: 5.00,
    maxCustomFiat: 200.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-voda-uk-15usd', name: 'Vodafone £10 Top-up', description: 'Instant Vodafone credit', fiatPrice: 13.00, currency: 'USD' }
    ]
  },

  // South Africa (ZA)
  {
    id: 'prov-airtime-vodacom-za',
    name: 'Vodacom South Africa',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    dialCode: '+27',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Vodacom Phone Number',
    accountPlaceholder: '082 123 4567 or +27 82 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-voda-za-5usd', name: 'Vodacom R100 Airtime', description: 'Instant Vodacom airtime delivery', fiatPrice: 5.50, currency: 'USD', validity: 'Instant', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-airtime-mtn-za',
    name: 'MTN South Africa',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    dialCode: '+27',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'MTN Phone Number',
    accountPlaceholder: '083 123 4567 or +27 83 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-mtn-za-5usd', name: 'MTN R100 Airtime', description: 'Instant MTN South Africa airtime', fiatPrice: 5.50, currency: 'USD' }
    ]
  },

  // Philippines (PH)
  {
    id: 'prov-airtime-globe-ph',
    name: 'Globe Telecom',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'Philippines',
    countryCode: 'PH',
    dialCode: '+63',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Globe Mobile Number',
    accountPlaceholder: '0917 123 4567 or +63 917 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-globe-ph-3usd', name: 'Globe ₱150 Load', description: 'Instant mobile load top-up', fiatPrice: 2.70, currency: 'USD', badge: 'Popular' },
      { id: 'pkg-globe-ph-9usd', name: 'Globe ₱500 Load', description: 'Instant mobile load top-up', fiatPrice: 9.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-airtime-smart-ph',
    name: 'Smart Communications',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    country: 'Philippines',
    countryCode: 'PH',
    dialCode: '+63',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Smart Mobile Number',
    accountPlaceholder: '0918 123 4567 or +63 918 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-smart-ph-3usd', name: 'Smart ₱150 Load', description: 'Instant prepaid load credit', fiatPrice: 2.70, currency: 'USD' }
    ]
  },

  // Indonesia (ID)
  {
    id: 'prov-airtime-telkomsel-id',
    name: 'Telkomsel',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Indonesia',
    countryCode: 'ID',
    dialCode: '+62',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Telkomsel Number',
    accountPlaceholder: '0812 3456 7890 or +62 812 3456 7890',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-tsel-id-3usd', name: 'Telkomsel Rp 50,000 Pulsa', description: 'Instant pulsa top-up', fiatPrice: 3.20, currency: 'USD', badge: 'Popular' }
    ]
  },

  // Vietnam (VN)
  {
    id: 'prov-airtime-viettel-vn',
    name: 'Viettel Telecom',
    category: 'airtime',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Vietnam',
    countryCode: 'VN',
    dialCode: '+84',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Viettel Phone Number',
    accountPlaceholder: '098 123 4567 or +84 98 123 4567',
    minCustomFiat: 1.00,
    maxCustomFiat: 150.00,
    currency: 'USD',
    enabled: true,
    packages: [
      { id: 'pkg-vtel-vn-4usd', name: 'Viettel 100,000 VND Card', description: 'Instant scratch card code or direct top-up', fiatPrice: 4.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 2. DATA
  {
    id: 'prov-data-mtn-ng',
    name: 'MTN Nigeria 4G/5G Data',
    category: 'data',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Recipient Mobile Phone Number',
    accountPlaceholder: '0803 123 4567 or +234 803 123 4567',
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['SME Data Bundle', 'Direct 4G/5G Top-Up', 'Corporate Unlimited', 'Night Streamer Pack'],
    packages: [
      { id: 'pkg-data-mtn-1gb', name: 'MTN 1GB Monthly SME Data', description: 'Instant high-speed 4G/5G data delivery', fiatPrice: 1.20, currency: 'USD', validity: '30 Days', badge: 'Popular' },
      { id: 'pkg-data-mtn-5gb', name: 'MTN 5GB Monthly Data Plan', description: 'High-speed 5G network bundle', fiatPrice: 4.50, currency: 'USD', validity: '30 Days', badge: 'Starter' },
      { id: 'pkg-data-mtn-15gb', name: 'MTN 15GB Monthly Data Plan', description: 'High-speed 5G network bundle', fiatPrice: 10.00, currency: 'USD', validity: '30 Days', badge: 'Best Seller' }
    ]
  },
  {
    id: 'prov-data-airtel-ng',
    name: 'Airtel Nigeria Data Bundles',
    category: 'data',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Airtel Mobile Number',
    accountPlaceholder: '0802 123 4567 or +234 802 123 4567',
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Direct Data Bundle', 'Router 4G LTE Pass'],
    packages: [
      { id: 'pkg-data-airtel-3gb', name: 'Airtel 3GB Weekly Plan', description: '3GB 4G data valid for 7 days', fiatPrice: 2.50, currency: 'USD', validity: '7 Days' },
      { id: 'pkg-data-airtel-10gb', name: 'Airtel 10GB Monthly Data', description: '10GB data valid for 30 days', fiatPrice: 7.50, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-data-saf-ke',
    name: 'Safaricom Kenya Data Bundles',
    category: 'data',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Safaricom Phone Number',
    accountPlaceholder: '0712 345 678 or +254 712 345 678',
    currency: 'USD',
    enabled: true,
    designations: ['Safaricom Data Bundle', 'No-Expiry Data Pass'],
    packages: [
      { id: 'pkg-saf-data-2gb', name: 'Safaricom 2.5GB 30-Day Plan', description: '30-day mobile data package', fiatPrice: 3.50, currency: 'USD', validity: '30 Days' },
      { id: 'pkg-saf-data-10gb', name: 'Safaricom 10GB Monthly Data', description: 'Unlimited 4G/5G speeds', fiatPrice: 12.00, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-data-jio-in',
    name: 'Reliance Jio India Data Boosters',
    category: 'data',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    country: 'India',
    countryCode: 'IN',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Jio Phone Number',
    accountPlaceholder: '98765 43210',
    currency: 'USD',
    enabled: true,
    designations: ['4G/5G Data Booster', 'Work From Home Pack'],
    packages: [
      { id: 'pkg-jio-data-6gb', name: 'Jio ₹61 6GB Data Booster', description: 'Add-on data pack for active plan', fiatPrice: 0.85, currency: 'USD', validity: 'Active Plan' },
      { id: 'pkg-jio-data-50gb', name: 'Jio ₹301 50GB Work From Home', description: 'High-speed 50GB data voucher', fiatPrice: 3.80, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-data-att-us',
    name: 'AT&T USA Mobile Data Pass',
    category: 'data',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'AT&T Wireless Number',
    accountPlaceholder: '(555) 019-2834',
    currency: 'USD',
    enabled: true,
    designations: ['Mobile Data Pass', 'Hotspot Refill'],
    packages: [
      { id: 'pkg-att-data-15gb', name: 'AT&T $20 15GB Prepaid Data Pass', description: 'Instant high-speed 5G hotspot refill', fiatPrice: 20.00, currency: 'USD', validity: '30 Days' }
    ]
  },

  // 3. ELECTRICITY
  {
    id: 'prov-elec-ikeja',
    name: 'Ikeja Electric (IKEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer ID',
    accountPlaceholder: '0101 2345 6789 or 4501928374',
    minCustomFiat: 2.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token', 'Postpaid Utility Bill'],
    packages: [
      { id: 'pkg-elec-10usd', name: '100 Units Token Pass', description: '20-digit prepaid meter token code', fiatPrice: 10.00, currency: 'USD' },
      { id: 'pkg-elec-25usd', name: '280 Units Family Token Pass', description: '20-digit prepaid meter token code', fiatPrice: 25.00, currency: 'USD', badge: 'Popular' },
      { id: 'pkg-elec-50usd', name: '600 Units Commercial Power', description: 'Instant token generation via Pi Platform', fiatPrice: 50.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-elec-eko',
    name: 'Eko Electricity (EKEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter / Account ID',
    accountPlaceholder: '0401 9283 7410',
    minCustomFiat: 2.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token', 'Postpaid Utility Bill'],
    packages: [
      { id: 'pkg-eko-15usd', name: '160 Units Prepaid Token Pass', description: 'Instant 20-digit recharge PIN', fiatPrice: 15.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-elec-kplc',
    name: 'Kenya Power (KPLC Stima)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'KPLC Meter Number',
    accountPlaceholder: '3719 2837 410',
    minCustomFiat: 2.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Stima Token', 'Postpaid Electricity Bill'],
    packages: [
      { id: 'pkg-kplc-10usd', name: 'KPLC KSh 1,200 Token Pass', description: 'Instant Stima 20-digit recharge token', fiatPrice: 10.00, currency: 'USD', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-elec-coned',
    name: 'ConEd / US Power Utility Settlement',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: false,
    accountLabel: 'ConEd Account Number',
    accountPlaceholder: '9812-4019-22',
    minCustomFiat: 10.00,
    maxCustomFiat: 800.00,
    currency: 'USD',
    enabled: true,
    designations: ['Postpaid Power Utility Bill', 'Commercial Electricity Deposit'],
    packages: []
  },
  {
    id: 'prov-elec-edf',
    name: 'EDF Energy UK Electricity',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'EDF Account / Meter Key ID',
    accountPlaceholder: 'MTR-UK-981203',
    minCustomFiat: 10.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Prepaid Key Token', 'Monthly Energy Bill'],
    packages: [
      { id: 'pkg-edf-25usd', name: 'EDF £20 Energy Top-up', description: 'Prepaid key card voucher code', fiatPrice: 25.00, currency: 'USD' }
    ]
  },

  // 4. CABLE TV
  {
    id: 'prov-cable-dstv',
    name: 'DStv Subscriptions & Upgrades',
    category: 'cable',
    logo: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Smartcard / IUC Number',
    accountPlaceholder: '10-digit Smartcard Number (e.g. 7019283741)',
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Decoder Subscription', 'Bouquet Upgrade', 'Monthly Package Renewal'],
    packages: [
      { id: 'pkg-dstv-yanga', name: 'DStv Yanga Package', description: 'Over 85 channels including HD sports', fiatPrice: 8.00, currency: 'USD', validity: '30 Days' },
      { id: 'pkg-dstv-compact', name: 'DStv Compact Package', description: 'Over 130 channels, Premier League & Movies', fiatPrice: 22.00, currency: 'USD', validity: '30 Days', badge: 'Best Seller' },
      { id: 'pkg-dstv-premium', name: 'DStv Premium Package', description: 'All channels, Champions League, Showmax access', fiatPrice: 55.00, currency: 'USD', validity: '30 Days', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-cable-gotv',
    name: 'GOtv Subscription Packages',
    category: 'cable',
    logo: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'IUC / Decoder Number',
    accountPlaceholder: '2019 2837 41',
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['GOtv Package Renewal', 'Decoder Upgrade'],
    packages: [
      { id: 'pkg-gotv-jolli', name: 'GOtv Jolli Package', description: 'Over 65 popular entertainment channels', fiatPrice: 6.00, currency: 'USD', validity: '30 Days' },
      { id: 'pkg-gotv-max', name: 'GOtv Max Package', description: 'Over 75 channels including La Liga & Serie A', fiatPrice: 9.50, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-cable-dstv-ke',
    name: 'DStv Kenya Packages',
    category: 'cable',
    logo: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Smartcard / IUC Number',
    accountPlaceholder: '1001 9283 74',
    currency: 'USD',
    enabled: true,
    designations: ['Decoder Subscription', 'Bouquet Upgrade'],
    packages: [
      { id: 'pkg-dstv-ke-compact', name: 'DStv Kenya Compact', description: 'Over 120 channels Premier League & Movies', fiatPrice: 24.00, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-cable-sky',
    name: 'Sky Digital TV UK',
    category: 'cable',
    logo: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Sky Viewing Card ID',
    accountPlaceholder: 'UK-SKY-981203',
    currency: 'USD',
    enabled: true,
    designations: ['Sky Sports Pass', 'Cinema Pass', 'Monthly Subscription'],
    packages: [
      { id: 'pkg-sky-sports', name: 'Sky Sports Monthly Pass', description: 'All 8 Sky Sports Premier League & F1 channels', fiatPrice: 40.00, currency: 'USD', validity: '30 Days' }
    ]
  },

  // 5. INTERNET & STARLINK
  {
    id: 'prov-net-starlink',
    name: 'Starlink Satellite Internet',
    category: 'internet',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Starlink Account Ref / User Email',
    accountPlaceholder: 'ACC-981203 or user@domain.com',
    minCustomFiat: 25.00,
    maxCustomFiat: 1000.00,
    currency: 'USD',
    enabled: true,
    designations: ['Residential Satellite', 'Priority Broadband', 'Roam Mobile Pass'],
    packages: [
      { id: 'pkg-starlink-res', name: 'Starlink Residential Monthly Service', description: 'Unlimited high-speed satellite broadband', fiatPrice: 75.00, currency: 'USD', validity: '30 Days', badge: 'Official' },
      { id: 'pkg-starlink-roam', name: 'Starlink Roam / Global Mobile Plan', description: 'Global satellite coverage on the go', fiatPrice: 120.00, currency: 'USD', validity: '30 Days' }
    ]
  },
  {
    id: 'prov-net-spectranet',
    name: 'Spectranet 4G LTE Nigeria',
    category: 'internet',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Spectranet User ID / Account Number',
    accountPlaceholder: 'SPEC-981203',
    minCustomFiat: 10.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    designations: ['Unlimited 4G LTE', 'Capped High Speed'],
    packages: [
      { id: 'pkg-spec-50gb', name: 'Spectranet 50GB Monthly Data', description: '50GB high-speed 4G broadband', fiatPrice: 20.00, currency: 'USD', validity: '30 Days', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-net-saf-fibre',
    name: 'Safaricom Home Fibre Kenya',
    category: 'internet',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Fibre Account ID',
    accountPlaceholder: 'SAF-FIB-98120',
    currency: 'USD',
    enabled: true,
    designations: ['Home Fibre Bronze', 'Home Fibre Gold'],
    packages: [
      { id: 'pkg-saf-fibre-bronze', name: '10 Mbps Bronze Unlimited', description: 'Unlimited home fibre internet', fiatPrice: 25.00, currency: 'USD', validity: '30 Days' }
    ]
  },
  {
    id: 'prov-net-xfinity',
    name: 'Comcast Xfinity Broadband USA',
    category: 'internet',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Xfinity Account Number',
    accountPlaceholder: '8200-1928-371',
    minCustomFiat: 25.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Residential Broadband', 'Gigabit Fiber'],
    packages: [
      { id: 'pkg-xfinity-500', name: '500 Mbps High-Speed Pass', description: 'Unlimited high-speed home internet', fiatPrice: 50.00, currency: 'USD', validity: '30 Days' }
    ]
  },

  // 6. WATER
  {
    id: 'prov-water-lagos',
    name: 'Lagos Water Corporation (LSWC)',
    category: 'water',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'LSWC Customer Account ID',
    accountPlaceholder: 'LSWC-9918230',
    minCustomFiat: 5.00,
    maxCustomFiat: 400.00,
    currency: 'USD',
    enabled: true,
    designations: ['Prepaid Water Meter', 'Postpaid Municipal Bill'],
    packages: [
      { id: 'pkg-water-ng-10', name: 'LSWC $10 Utility Credit', description: 'Settles Lagos municipal water bill balance', fiatPrice: 10.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-water-nairobi',
    name: 'Nairobi City Water (NCWSC)',
    category: 'water',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'NCWSC Meter / Account ID',
    accountPlaceholder: 'NC-WATER-98120',
    minCustomFiat: 5.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    designations: ['Water Meter Token', 'Monthly Utility Bill'],
    packages: [
      { id: 'pkg-water-ke-15', name: 'Nairobi Water KSh 1,800 Credit', description: 'Direct municipal water bill settlement', fiatPrice: 15.00, currency: 'USD', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-water-rand',
    name: 'Rand Water Utility Board',
    category: 'water',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Rand Water Account Ref',
    accountPlaceholder: 'RW-ZA-981203',
    minCustomFiat: 10.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Municipal Water Meter', 'Commercial Water Bill'],
    packages: [
      { id: 'pkg-water-za-20', name: 'Rand Water R350 Credit', description: 'Direct municipal water bill settlement', fiatPrice: 20.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-water-manila',
    name: 'Manila Water Company',
    category: 'water',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'Philippines',
    countryCode: 'PH',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Manila Water Account ID',
    accountPlaceholder: 'MW-PH-88120',
    minCustomFiat: 5.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    designations: ['Residential Water Bill', 'Commercial Water Credit'],
    packages: [
      { id: 'pkg-water-ph-10', name: 'Manila Water ₱500 Credit', description: 'Direct water bill settlement', fiatPrice: 10.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-water-board',
    name: 'US Municipal Water Board',
    category: 'water',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Water Customer Account ID',
    accountPlaceholder: 'WTR-9918230',
    minCustomFiat: 10.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Municipal Water Credit', 'Commercial Water Bill'],
    packages: [
      { id: 'pkg-water-20', name: '$20 Water Utility Credit', description: 'Settles municipal water bill balance', fiatPrice: 20.00, currency: 'USD' }
    ]
  },

  // 7. EXAM CARDS
  {
    id: 'prov-exam-waec',
    name: 'WAEC Direct Result E-PINs',
    category: 'exam',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Candidate Registration Number / Phone',
    accountPlaceholder: '4101928374 or candidate@gmail.com',
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Result Checker PIN', 'Candidate Registration e-PIN', 'Verification Token'],
    packages: [
      { id: 'pkg-waec-pin', name: 'WAEC Direct Result Checker PIN', description: '5-use electronic result pin code', fiatPrice: 4.50, currency: 'USD', validity: 'Instant PIN', badge: 'Official' },
      { id: 'pkg-jamb-pin', name: 'JAMB UTME Registration E-PIN', description: 'Official Profile Code UTME pin', fiatPrice: 12.00, currency: 'USD', validity: 'Instant PIN', badge: 'Official' },
      { id: 'pkg-neco-token', name: 'NECO Result Verification Token', description: 'Instant token delivery to email & dashboard', fiatPrice: 3.50, currency: 'USD', validity: 'Instant PIN' }
    ]
  },
  {
    id: 'prov-exam-knec',
    name: 'KNEC Exam Verification Kenya',
    category: 'exam',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Candidate Index / Email',
    accountPlaceholder: 'INDEX-2026-9812',
    currency: 'USD',
    enabled: true,
    designations: ['KCSE Result Verification', 'KCPE Portal Token'],
    packages: [
      { id: 'pkg-knec-token', name: 'KNEC Result Checker Token', description: 'Instant Kenya National Exams Portal Token', fiatPrice: 5.00, currency: 'USD', badge: 'Official' }
    ]
  },
  {
    id: 'prov-exam-waec-gh',
    name: 'WAEC Ghana Result Checker E-PIN',
    category: 'exam',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Candidate Index Number',
    accountPlaceholder: '0010293841',
    currency: 'USD',
    enabled: true,
    designations: ['WASSCE Result Voucher', 'BECE Result Checker'],
    packages: [
      { id: 'pkg-waec-gh-pin', name: 'WAEC Ghana WASSCE Result PIN', description: 'Official Ghana Result Checker Voucher', fiatPrice: 4.50, currency: 'USD', badge: 'Official' }
    ]
  },

  // 8. EDUCATION
  {
    id: 'prov-edu-unilag',
    name: 'UNILAG Student Tuition Portal',
    category: 'education',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Student Matriculation Number',
    accountPlaceholder: '190407019 or MAT-2026-981',
    minCustomFiat: 10.00,
    maxCustomFiat: 2000.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Tuition Fee Portal', 'Acceptance Fee Deposit', 'Hostel / Accommodation Fee'],
    packages: [
      { id: 'pkg-edu-unilag-acc', name: 'Acceptance Fee Portal Clearance', description: 'Instant portal clearance receipt', fiatPrice: 30.00, currency: 'USD', badge: 'Official' },
      { id: 'pkg-edu-unilag-sem', name: 'Semester School Fees Deposit', description: 'Direct university Bursary credit', fiatPrice: 150.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-edu-uon',
    name: 'University of Nairobi (UoN)',
    category: 'education',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Student Reg Number',
    accountPlaceholder: 'F17/19203/2026',
    minCustomFiat: 10.00,
    maxCustomFiat: 1500.00,
    currency: 'USD',
    enabled: true,
    designations: ['University Semester Tuition', 'Application Fee'],
    packages: [
      { id: 'pkg-edu-uon-fee', name: 'UoN Semester Fee Voucher', description: 'Direct tuition portal settlement', fiatPrice: 100.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-edu-coursera',
    name: 'Coursera Global Learning',
    category: 'education',
    logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Learner Account Email',
    accountPlaceholder: 'student@domain.com',
    currency: 'USD',
    enabled: true,
    designations: ['Specialization Pass', 'Monthly Learning Subscription'],
    packages: [
      { id: 'pkg-coursera-sub', name: 'Coursera Plus Monthly Subscription', description: 'Unlimited access to 7,000+ courses and certificates', fiatPrice: 39.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 9. GIFT CARDS
  {
    id: 'prov-gift-amazon',
    name: 'Amazon Global E-Gift Cards',
    category: 'giftcard',
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Recipient Delivery Email',
    accountPlaceholder: 'gift@example.com',
    minCustomFiat: 10.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Store Region Voucher', 'Digital Gift Code'],
    packages: [
      { id: 'pkg-gc-amz-25', name: '$25 Amazon E-Gift Code', description: 'Redeemable on all Amazon regional stores', fiatPrice: 25.00, currency: 'USD', badge: 'Best Seller' },
      { id: 'pkg-gc-amz-50', name: '$50 Amazon E-Gift Code', description: 'Redeemable on all Amazon regional stores', fiatPrice: 50.00, currency: 'USD' },
      { id: 'pkg-gc-amz-100', name: '$100 Amazon E-Gift Code', description: 'Redeemable on all Amazon regional stores', fiatPrice: 100.00, currency: 'USD', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-gift-apple',
    name: 'Apple & iTunes Gift Card',
    category: 'giftcard',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Apple ID Email',
    accountPlaceholder: 'user@icloud.com',
    currency: 'USD',
    enabled: true,
    designations: ['App Store & iTunes Code', 'Apple Store Gift Card'],
    packages: [
      { id: 'pkg-gc-app-15', name: '$15 Apple Gift Card Code', description: 'App Store, Apple Music, iCloud storage', fiatPrice: 15.00, currency: 'USD' },
      { id: 'pkg-gc-app-50', name: '$50 Apple Gift Card Code', description: 'App Store, Apple Music, hardware store credit', fiatPrice: 50.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 10. VOUCHERS
  {
    id: 'prov-vch-uber',
    name: 'Uber Rides & Eats Cash Voucher',
    category: 'voucher',
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Uber User Account Email',
    accountPlaceholder: 'rider@example.com',
    minCustomFiat: 10.00,
    maxCustomFiat: 300.00,
    currency: 'USD',
    enabled: true,
    designations: ['Uber Ride Pass', 'Uber Eats Food Credit'],
    packages: [
      { id: 'pkg-vch-uber-20', name: '$20 Uber Cash Gift Code', description: 'Redeemable for rides and food orders', fiatPrice: 20.00, currency: 'USD', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-vch-starbucks',
    name: 'Starbucks Coffee Voucher',
    category: 'voucher',
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Recipient Email',
    accountPlaceholder: 'coffee@example.com',
    currency: 'USD',
    enabled: true,
    designations: ['Coffee Gift Pass', 'Rewards Balance Top-up'],
    packages: [
      { id: 'pkg-vch-sbux-15', name: '$15 Starbucks Digital Card', description: 'Redeemable at all participating Starbucks stores', fiatPrice: 15.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-vch-jumia',
    name: 'Jumia E-Commerce Voucher',
    category: 'voucher',
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Jumia Customer Email',
    accountPlaceholder: 'buyer@jumia.com',
    minCustomFiat: 5.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['E-Commerce Shopping Pass', 'Express Delivery Voucher'],
    packages: [
      { id: 'pkg-vch-jumia-25', name: 'Jumia ₦15,000 Voucher', description: 'Instant shopping credit for Jumia marketplace', fiatPrice: 25.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 11. BETTING
  {
    id: 'prov-bet-1xbet',
    name: '1xBet Wallet Deposit',
    category: 'betting',
    logo: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: '1xBet Account User ID',
    accountPlaceholder: '9-digit Account ID (e.g. 481920384)',
    minCustomFiat: 2.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['Player Wallet Deposit', 'Bonus Promo Top-Up'],
    packages: [
      { id: 'pkg-bet-10usd', name: '$10 Instant Wallet Credit', description: 'Direct wallet deposit via Pi Network', fiatPrice: 10.00, currency: 'USD' },
      { id: 'pkg-bet-50usd', name: '$50 Wallet Credit + Bonus', description: 'Direct wallet deposit via Pi Network', fiatPrice: 50.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-bet-sporty',
    name: 'SportyBet Nigeria Top-up',
    category: 'betting',
    logo: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'SportyBet User Mobile Number',
    accountPlaceholder: '0803 123 4567',
    minCustomFiat: 2.00,
    maxCustomFiat: 500.00,
    currency: 'USD',
    enabled: true,
    designations: ['User Account Deposit', 'Virtual Game Top-up'],
    packages: [
      { id: 'pkg-bet-sporty-10', name: 'SportyBet ₦5,000 Deposit', description: 'Instant wallet top-up', fiatPrice: 10.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 12. GAMING
  {
    id: 'prov-game-pubg',
    name: 'PUBG Mobile Unknown Cash (UC)',
    category: 'gaming',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'PUBG Character ID (UID)',
    accountPlaceholder: '5192837410',
    currency: 'USD',
    enabled: true,
    designations: ['Direct In-Game Top-Up (UID)', 'Royale Pass Redemption Voucher'],
    packages: [
      { id: 'pkg-pubg-60', name: '60 UC Pack', description: 'Instant game account top-up', fiatPrice: 1.20, currency: 'USD' },
      { id: 'pkg-pubg-660', name: '660 UC Royale Pass Pack', description: 'Includes 600 UC + 60 Extra Bonus UC', fiatPrice: 10.00, currency: 'USD', badge: 'Popular' },
      { id: 'pkg-pubg-1800', name: '1800 UC Pack', description: 'Includes 1500 UC + 300 Extra Bonus UC', fiatPrice: 25.00, currency: 'USD', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-game-freefire',
    name: 'Free Fire Diamonds Top-Up',
    category: 'gaming',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Free Fire Player ID',
    accountPlaceholder: '891029384',
    currency: 'USD',
    enabled: true,
    designations: ['Player ID Diamonds Refill', 'Weekly Membership Pass'],
    packages: [
      { id: 'pkg-ff-530', name: '530 Diamonds Pack', description: 'Instant diamond delivery to player UID', fiatPrice: 5.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 13. STREAMING
  {
    id: 'prov-stream-netflix',
    name: 'Netflix Subscription Voucher',
    category: 'streaming',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Recipient Email',
    accountPlaceholder: 'streamer@example.com',
    currency: 'USD',
    enabled: true,
    designations: ['Individual Subscription', 'Family Plan Voucher', '4K Ultra HD Pass'],
    packages: [
      { id: 'pkg-nflx-1m', name: '1-Month Standard 1080p Pass', description: 'Watch on 2 screens simultaneously in Full HD', fiatPrice: 12.00, currency: 'USD' },
      { id: 'pkg-nflx-premium', name: '1-Month Premium 4K Ultra HD Pass', description: 'Watch on 4 screens in 4K HDR with Spatial Audio', fiatPrice: 18.00, currency: 'USD', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-stream-spotify',
    name: 'Spotify Premium Gift Voucher',
    category: 'streaming',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: false,
    supportsFixedPackages: true,
    accountLabel: 'Spotify User Email',
    accountPlaceholder: 'music@domain.com',
    currency: 'USD',
    enabled: true,
    designations: ['Individual Premium Code', 'Duo/Family Subscription Pass'],
    packages: [
      { id: 'pkg-spot-1m', name: '1-Month Premium Individual Pass', description: 'Ad-free music streaming & offline downloads', fiatPrice: 10.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 14. INSURANCE
  {
    id: 'prov-ins-sanlam',
    name: 'Sanlam Life Insurance Cover',
    category: 'insurance',
    logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Sanlam Policy Reference ID',
    accountPlaceholder: 'POL-ZA-981203',
    minCustomFiat: 10.00,
    maxCustomFiat: 1000.00,
    currency: 'USD',
    enabled: true,
    designations: ['Policy Premium Renewal', 'Life Protection Cover'],
    packages: [
      { id: 'pkg-ins-sanlam-monthly', name: 'Monthly Policy Premium Pass', description: 'Direct policy premium settlement', fiatPrice: 25.00, currency: 'USD' }
    ]
  },
  {
    id: 'prov-ins-leadway',
    name: 'Leadway Assurance Nigeria',
    category: 'insurance',
    logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Leadway Policy Number',
    accountPlaceholder: 'LAD-2026-9812',
    minCustomFiat: 10.00,
    maxCustomFiat: 1000.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Health Insurance Cover', 'Auto Protection Premium'],
    packages: [
      { id: 'pkg-ins-leadway-health', name: 'Comprehensive Health Plan', description: 'Instant HMO portal activation', fiatPrice: 35.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 15. GOVERNMENT
  {
    id: 'prov-gov-remita',
    name: 'Remita TSA Govt Taxes & Passports',
    category: 'government',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Remita Retrieval Reference (RRR)',
    accountPlaceholder: '1203-9812-3841',
    minCustomFiat: 5.00,
    maxCustomFiat: 2000.00,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Federal Tax / TSA Levy', 'Passport Renewal RRR', 'Customs Duty Fee'],
    packages: [
      { id: 'pkg-gov-passport', name: 'Standard e-Passport RRR Payment', description: 'Official Immigration RRR fee settlement', fiatPrice: 45.00, currency: 'USD', badge: 'Official' }
    ]
  },
  {
    id: 'prov-gov-ecitizen',
    name: 'Kenya eCitizen Portal Services',
    category: 'government',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'eCitizen Bill / Ref Number',
    accountPlaceholder: 'EC-2026-9812',
    minCustomFiat: 5.00,
    maxCustomFiat: 1500.00,
    currency: 'USD',
    enabled: true,
    designations: ['National ID / Passport Fee', 'Driving License Renewal'],
    packages: [
      { id: 'pkg-gov-ke-dl', name: 'Driving License Renewal Fee', description: 'Instant eCitizen portal clearance', fiatPrice: 20.00, currency: 'USD' }
    ]
  },

  // 16. TRANSPORT & FLIGHTS
  {
    id: 'prov-trans-airline',
    name: 'Global Airline Flight Voucher',
    category: 'transport',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger Full Name & Email',
    accountPlaceholder: 'John Doe - traveler@domain.com',
    minCustomFiat: 50.00,
    maxCustomFiat: 2000.00,
    currency: 'USD',
    enabled: true,
    designations: ['Flight e-Voucher', 'Star Alliance Flight Pass'],
    packages: [
      { id: 'pkg-flight-100', name: '$100 Flight Ticket Pass', description: 'Redeemable on Star Alliance & SkyTeam carriers', fiatPrice: 100.00, currency: 'USD' },
      { id: 'pkg-flight-300', name: '$300 International Flight Pass', description: 'Redeemable on Star Alliance & SkyTeam carriers', fiatPrice: 300.00, currency: 'USD', badge: 'Popular' }
    ]
  },

  // 17. EVENTS
  {
    id: 'prov-event-eventbrite',
    name: 'Eventbrite Global Summit Tickets',
    category: 'events',
    logo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Attendee Email / Ticket ID',
    accountPlaceholder: 'attendee@example.com',
    minCustomFiat: 10.00,
    maxCustomFiat: 1000.00,
    currency: 'USD',
    enabled: true,
    designations: ['VIP Access Pass', 'Regular Event Ticket', 'Early Bird Delegate'],
    packages: [
      { id: 'pkg-event-vip', name: 'Global Tech Conference VIP Pass', description: 'Includes Keynote Access & Networking Gala', fiatPrice: 75.00, currency: 'USD', badge: 'VIP' }
    ]
  },

  // 18. ECOMMERCE
  {
    id: 'prov-ecom-pinova',
    name: 'PiNova Store Credit Voucher',
    category: 'ecommerce',
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=80',
    country: 'Global',
    countryCode: 'GLOBAL',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'PiNova User Account Email',
    accountPlaceholder: 'shopper@pinova.com',
    minCustomFiat: 5.00,
    maxCustomFiat: 1000.00,
    currency: 'USD',
    enabled: true,
    designations: ['Store Credit Voucher', 'Retail Gift Certificate'],
    packages: [
      { id: 'pkg-ecom-50', name: '$50 Marketplace Store Credit', description: 'Redeemable on all global merchant goods', fiatPrice: 50.00, currency: 'USD', badge: 'Popular' }
    ]
  }
];

export const INITIAL_UTILITY_TRANSACTIONS: UtilityTransactionReceipt[] = [
  {
    transactionId: 'UTIL-TX-990102',
    piPaymentId: 'pi_pay_demo_981203',
    piTxid: '0x7a819b2c3d4e5f6a1b2c3d4e5f6a7b8c',
    category: 'airtime',
    providerId: 'prov-airtime-mtn',
    providerName: 'MTN Mobile Top-Up',
    accountNumber: '+234 803 112 2334',
    accountName: 'Verified Line (MTN Nigeria)',
    fiatAmount: 10.00,
    fiatCurrency: 'USD',
    appliedPiRateUsd: 10.00,
    piAmount: 1.00,
    packageName: 'MTN $10.00 Airtime Topup',
    tokenOrCode: 'MTN-REF-99820192',
    serialNumber: 'SRL-2026-99120',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    orderProtectionGuaranteed: true,
    buyerUsername: 'Pioneer_Explorer'
  },
  {
    transactionId: 'UTIL-TX-990103',
    piPaymentId: 'pi_pay_demo_771823',
    piTxid: '0x8b920c3d4e5f6a1b2c3d4e5f6a7b8c9d',
    category: 'electricity',
    providerId: 'prov-elec-ikeja',
    providerName: 'Ikeja Electric',
    accountNumber: '0101 2938 4710',
    accountName: 'Meter Owner: Chief A. Okonjo',
    fiatAmount: 25.00,
    fiatCurrency: 'USD',
    appliedPiRateUsd: 10.00,
    piAmount: 2.50,
    packageName: '280 Units Family Token Pass',
    tokenOrCode: '4910 - 2819 - 0019 - 3821 - 8810',
    serialNumber: 'TOKEN-IE-2026-8831',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    orderProtectionGuaranteed: true,
    buyerUsername: 'Pioneer_Explorer'
  }
];
