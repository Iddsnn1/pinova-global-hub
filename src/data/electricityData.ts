import { UtilityServiceProvider, ElectricityServiceArea, ElectricityMeterVerificationResult } from '../types/utility';

/**
 * Standard Electricity Service Providers Catalog
 * Comprehensive support for Nigeria DisCos, Ring-Fenced Grids, and Global Electricity Utilities.
 */
export const ELECTRICITY_PROVIDERS_MASTER: UtilityServiceProvider[] = [
  // --- NIGERIA ELECTRICITY DISTRIBUTION COMPANIES (DisCos) & UTILITIES ---
  {
    id: 'prov-elec-ng-abuja-electricity-aedc',
    name: 'Abuja Electricity (AEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Federal Capital Territory',
    supportedStates: ['Federal Capital Territory', 'FCT', 'Abuja', 'Niger', 'Kogi', 'Nasarawa'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit AEDC meter ID (e.g. 01423859218)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-aedc-1', name: 'AEDC $10 Token Credit', description: 'Standard residential token credit', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-aedc-2', name: 'AEDC $25 Token Credit', description: 'Family residential energy token', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-aedc-3', name: 'AEDC $100 Heavy Power Credit', description: 'Commercial / heavy residential credit', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-ikeja-electric-ikedc',
    name: 'Ikeja Electric (IKEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509390144011-879fe0397c84?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    supportedStates: ['Lagos', 'Ogun'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit IKEDC meter ID (e.g. 01019284721)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-ikedc-1', name: 'IKEDC $10 Token Credit', description: 'Direct token generation / bill credit', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-ikedc-2', name: 'IKEDC $25 Token Credit', description: 'Standard household credit', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-ikedc-3', name: 'IKEDC $100 Heavy Power Credit', description: 'Heavy residential & industrial pack', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-eko-electricity-ekedc',
    name: 'Eko Electricity (EKEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos',
    supportedStates: ['Lagos', 'Ogun'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit EKEDC meter ID (e.g. 01328491823)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-ekedc-1', name: 'EKEDC $10 Token Credit', description: 'Direct token generation / bill credit', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-ekedc-2', name: 'EKEDC $25 Token Credit', description: 'Island / Lekki / Surulere household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-ekedc-3', name: 'EKEDC $100 Heavy Power Credit', description: 'Commercial / industrial power pack', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-kano-electricity-kedco',
    name: 'Kano Electricity (KEDCO)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Kano',
    supportedStates: ['Kano', 'Katsina', 'Jigawa'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit KEDCO meter ID (e.g. 01558291048)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-kedco-1', name: 'KEDCO $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-kedco-2', name: 'KEDCO $25 Token Credit', description: 'Kano / Katsina / Jigawa residential pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-kedco-3', name: 'KEDCO $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-ibadan-electricity-ibedc',
    name: 'Ibadan Electricity (IBEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Oyo',
    supportedStates: ['Oyo', 'Ogun', 'Osun', 'Kwara'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit IBEDC meter ID (e.g. 01248192847)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-ibedc-1', name: 'IBEDC $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-ibedc-2', name: 'IBEDC $25 Token Credit', description: 'Oyo / Ogun / Osun / Kwara household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-ibedc-3', name: 'IBEDC $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-enugu-electricity-eedc',
    name: 'Enugu Electricity (EEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Enugu',
    supportedStates: ['Enugu', 'Abia', 'Imo', 'Anambra', 'Ebonyi'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit EEDC meter ID (e.g. 01678291048)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-eedc-1', name: 'EEDC $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-eedc-2', name: 'EEDC $25 Token Credit', description: 'South-East household energy token', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-eedc-3', name: 'EEDC $100 Heavy Power Credit', description: 'Commercial / industrial power pack', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-aba-power-aple',
    name: 'Aba Power Electric (APLE / Geometric Power)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Abia',
    supportedStates: ['Abia'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Aba Power Meter / Account Number',
    accountPlaceholder: 'Enter Aba Ring-Fence Meter ID (e.g. 01884920194)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-aple-1', name: 'Aba Power $10 Token Credit', description: 'Aba Ring-Fence prepaid token', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-aple-2', name: 'Aba Power $25 Token Credit', description: 'Commercial & household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-aple-3', name: 'Aba Power $100 Industrial Credit', description: 'Heavy manufacturing token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-port-harcourt-electricity-phed',
    name: 'Port Harcourt Electricity (PHED)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Rivers',
    supportedStates: ['Rivers', 'Bayelsa', 'Cross River', 'Akwa Ibom'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit PHED meter ID (e.g. 01792849182)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-phed-1', name: 'PHED $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-phed-2', name: 'PHED $25 Token Credit', description: 'Rivers / Bayelsa / Akwa Ibom household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-phed-3', name: 'PHED $100 Heavy Power Credit', description: 'Industrial coastal power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-benin-electricity-bedc',
    name: 'Benin Electricity (BEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Edo',
    supportedStates: ['Edo', 'Delta', 'Ondo', 'Ekiti'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit BEDC meter ID (e.g. 01918294819)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-bedc-1', name: 'BEDC $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-bedc-2', name: 'BEDC $25 Token Credit', description: 'Edo / Delta / Ondo household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-bedc-3', name: 'BEDC $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-kaduna-electricity-kaedco',
    name: 'Kaduna Electricity (KAEDCO)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Kaduna',
    supportedStates: ['Kaduna', 'Sokoto', 'Kebbi', 'Zamfara'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit KAEDCO meter ID (e.g. 01492819482)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-kaedco-1', name: 'KAEDCO $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-kaedco-2', name: 'KAEDCO $25 Token Credit', description: 'Kaduna / Sokoto / Kebbi residential pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-kaedco-3', name: 'KAEDCO $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-jos-electricity-jedc',
    name: 'Jos Electricity (JEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Plateau',
    supportedStates: ['Plateau', 'Bauchi', 'Benue', 'Gombe'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit JEDC meter ID (e.g. 01382918472)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-jedc-1', name: 'JEDC $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-jedc-2', name: 'JEDC $25 Token Credit', description: 'Plateau / Bauchi / Benue household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-jedc-3', name: 'JEDC $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-elec-ng-yola-electricity-yedc',
    name: 'Yola Electricity (YEDC)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Adamawa',
    supportedStates: ['Adamawa', 'Borno', 'Taraba', 'Yobe'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Meter Number / Customer Account ID',
    accountPlaceholder: 'Enter 11 to 13-digit YEDC meter ID (e.g. 01638291048)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: [
      'Prepaid Meter Token Generation',
      'Postpaid Monthly Bill Settlement',
      'Commercial Utility Payment'
    ],
    packages: [
      { id: 'pkg-elec-yedc-1', name: 'YEDC $10 Token Credit', description: 'Standard energy token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-yedc-2', name: 'YEDC $25 Token Credit', description: 'Adamawa / Borno / Taraba household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' },
      { id: 'pkg-elec-yedc-3', name: 'YEDC $100 Heavy Power Credit', description: 'Commercial enterprise power token', fiatPrice: 100, currency: 'USD', validity: 'Instant Token', badge: 'Best Value' }
    ]
  },

  // --- SOUTH AFRICA (ZA) ---
  {
    id: 'prov-elec-za-eskom-direct',
    name: 'Eskom Direct Electricity SA',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Gauteng',
    supportedStates: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Eskom Prepaid Meter Number',
    accountPlaceholder: 'Enter 11-digit Eskom meter number (e.g. 07182940192)',
    minCustomFiat: 2,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-za-1', name: 'Eskom $10 Token Credit', description: 'National grid prepaid units', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-za-2', name: 'Eskom $25 Token Credit', description: 'Household monthly power pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-elec-za-city-power-joburg',
    name: 'City Power Johannesburg',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509390144011-879fe0397c84?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Gauteng',
    supportedStates: ['Gauteng'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'City Power Meter Number',
    accountPlaceholder: 'Enter Joburg City Power meter number',
    minCustomFiat: 2,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-cpj-1', name: 'City Power $15 Token Credit', description: 'Johannesburg Metro token credit', fiatPrice: 15, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-cpj-2', name: 'City Power $30 Token Credit', description: 'Standard municipal electricity pack', fiatPrice: 30, currency: 'USD', validity: 'Instant Token', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-elec-za-cape-town-electricity',
    name: 'City of Cape Town Electricity',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Western Cape',
    supportedStates: ['Western Cape'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Cape Town Meter Number',
    accountPlaceholder: 'Enter Cape Town municipal meter ID',
    minCustomFiat: 2,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-cct-1', name: 'Cape Town $15 Token Credit', description: 'Cape Town municipal token', fiatPrice: 15, currency: 'USD', validity: 'Instant Token' }
    ]
  },

  // --- KENYA (KE) ---
  {
    id: 'prov-elec-ke-kplc-prepaid',
    name: 'Kenya Power (KPLC Prepaid & Postpaid)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    state: 'Nairobi',
    supportedStates: ['Nairobi', 'Mombasa', 'Rift Valley', 'Central', 'Western', 'Coast', 'Eastern', 'North Eastern', 'Nyanza'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'KPLC Meter Number / Account No',
    accountPlaceholder: 'Enter 11-digit KPLC prepaid meter number (e.g. 14192847192)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Monthly Bill Settlement'],
    packages: [
      { id: 'pkg-elec-kplc-1', name: 'KPLC $10 Token Credit', description: 'Kenya Power token recharge', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-kplc-2', name: 'KPLC $25 Token Credit', description: 'Household power pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' }
    ]
  },

  // --- GHANA (GH) ---
  {
    id: 'prov-elec-gh-ecg-ghana',
    name: 'Electricity Company of Ghana (ECG)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509390144011-879fe0397c84?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    state: 'Greater Accra',
    supportedStates: ['Greater Accra', 'Ashanti', 'Central', 'Western', 'Eastern', 'Volta'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'ECG Meter Number / Account ID',
    accountPlaceholder: 'Enter ECG meter ID (e.g. GH-024819284)',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-ecg-1', name: 'ECG $10 Power Token', description: 'Southern & Central Ghana grid credit', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' },
      { id: 'pkg-elec-ecg-2', name: 'ECG $25 Power Token', description: 'Accra & Kumasi household pack', fiatPrice: 25, currency: 'USD', validity: 'Instant Token', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-elec-gh-nedco-ghana',
    name: 'Northern Electricity Distribution Co (NEDCo)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=200&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    state: 'Northern',
    supportedStates: ['Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'NEDCo Meter ID',
    accountPlaceholder: 'Enter NEDCo meter account number',
    minCustomFiat: 1,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-nedco-1', name: 'NEDCo $10 Token Credit', description: 'Northern Ghana grid credit', fiatPrice: 10, currency: 'USD', validity: 'Instant Token' }
    ]
  },

  // --- UNITED STATES (US) ---
  {
    id: 'prov-elec-us-conedison-ny',
    name: 'ConEdison Electricity (New York)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509390144011-879fe0397c84?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    state: 'New York',
    supportedStates: ['New York'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'ConEdison 15-Digit Account Number',
    accountPlaceholder: 'Enter ConEd account number',
    minCustomFiat: 5,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Utility Bill Settlement', 'Commercial Utility Payment'],
    packages: [
      { id: 'pkg-elec-coned-1', name: 'ConEd $50 Bill Credit', description: 'NYC metro electric bill credit', fiatPrice: 50, currency: 'USD', validity: 'Bill Credit' }
    ]
  },
  {
    id: 'prov-elec-us-pge-california',
    name: 'Pacific Gas and Electric (PG&E)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    supportedStates: ['California'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'PG&E 10-Digit Account Number',
    accountPlaceholder: 'Enter PG&E account number',
    minCustomFiat: 5,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Utility Bill Settlement', 'Commercial Utility Payment'],
    packages: [
      { id: 'pkg-elec-pge-1', name: 'PG&E $50 Bill Credit', description: 'Northern California electric payment', fiatPrice: 50, currency: 'USD', validity: 'Bill Credit' }
    ]
  },
  {
    id: 'prov-elec-us-sce-socal',
    name: 'Southern California Edison (SCE)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    supportedStates: ['California'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'SCE Account Number',
    accountPlaceholder: 'Enter Southern California Edison account ID',
    minCustomFiat: 5,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-sce-1', name: 'SCE $50 Bill Credit', description: 'SoCal electric bill credit', fiatPrice: 50, currency: 'USD', validity: 'Bill Credit' }
    ]
  },
  {
    id: 'prov-elec-us-comed-chicago',
    name: 'ComEd Electricity (Chicago / Illinois)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    state: 'Illinois',
    supportedStates: ['Illinois'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'ComEd 10-Digit Account Number',
    accountPlaceholder: 'Enter ComEd account number',
    minCustomFiat: 5,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Utility Bill Settlement'],
    packages: [
      { id: 'pkg-elec-comed-1', name: 'ComEd $50 Bill Credit', description: 'Greater Chicago utility bill credit', fiatPrice: 50, currency: 'USD', validity: 'Bill Credit' }
    ]
  },

  // --- UNITED ARAB EMIRATES (AE) ---
  {
    id: 'prov-elec-ae-dewa-dubai',
    name: 'Dubai Electricity and Water Authority (DEWA)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    state: 'Dubai',
    supportedStates: ['Dubai'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'DEWA 9-Digit Account / Premise ID',
    accountPlaceholder: 'Enter 9-digit DEWA premise or account number',
    minCustomFiat: 5,
    maxCustomFiat: 2000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Monthly Bill Settlement', 'Commercial Utility Payment'],
    packages: [
      { id: 'pkg-elec-dewa-1', name: 'DEWA $25 Bill Settlement', description: 'Dubai municipal power credit', fiatPrice: 25, currency: 'USD', validity: 'Bill Credit' },
      { id: 'pkg-elec-dewa-2', name: 'DEWA $100 Bill Settlement', description: 'Standard residential bill settlement', fiatPrice: 100, currency: 'USD', validity: 'Bill Credit', badge: 'Popular' }
    ]
  },
  {
    id: 'prov-elec-ae-addc-abu-dhabi',
    name: 'Abu Dhabi Distribution Company (ADDC / TAQA)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    state: 'Abu Dhabi',
    supportedStates: ['Abu Dhabi'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'ADDC Account Number',
    accountPlaceholder: 'Enter 10-digit ADDC account number',
    minCustomFiat: 5,
    maxCustomFiat: 2000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Monthly Bill Settlement'],
    packages: [
      { id: 'pkg-elec-addc-1', name: 'ADDC $50 Bill Settlement', description: 'Abu Dhabi emirate utility payment', fiatPrice: 50, currency: 'USD', validity: 'Bill Credit' }
    ]
  },

  // --- TÜRKIYE (TR) ---
  {
    id: 'prov-elec-tr-bedas-istanbul',
    name: 'Boğaziçi Elektrik (BEDAŞ - Istanbul European)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    country: 'Türkiye',
    countryCode: 'TR',
    state: 'Istanbul',
    supportedStates: ['Istanbul'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'BEDAŞ Abone / Tesisat No',
    accountPlaceholder: 'Enter BEDAŞ subscriber or installation number',
    minCustomFiat: 3,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Monthly Bill Settlement', 'Prepaid Meter Token Generation'],
    packages: [
      { id: 'pkg-elec-bedas-1', name: 'BEDAŞ $20 Bill Payment', description: 'European Istanbul electricity settlement', fiatPrice: 20, currency: 'USD', validity: 'Bill Credit' }
    ]
  },
  {
    id: 'prov-elec-tr-ayedas-istanbul',
    name: 'AYEDAŞ (Istanbul Asian Side)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1509390144011-879fe0397c84?auto=format&fit=crop&w=200&q=80',
    country: 'Türkiye',
    countryCode: 'TR',
    state: 'Istanbul',
    supportedStates: ['Istanbul'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'AYEDAŞ Tesisat No',
    accountPlaceholder: 'Enter AYEDAŞ subscriber number',
    minCustomFiat: 3,
    maxCustomFiat: 1000,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Postpaid Monthly Bill Settlement'],
    packages: [
      { id: 'pkg-elec-ayedas-1', name: 'AYEDAŞ $20 Bill Payment', description: 'Asian Istanbul electricity settlement', fiatPrice: 20, currency: 'USD', validity: 'Bill Credit' }
    ]
  },

  // --- INDONESIA (ID) ---
  {
    id: 'prov-elec-id-pln-token-prabayar',
    name: 'PLN Token Listrik (Prabayar & Pascabayar)',
    category: 'electricity',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80',
    country: 'Indonesia',
    countryCode: 'ID',
    state: 'Jakarta',
    supportedStates: ['Jakarta', 'West Java', 'Central Java', 'East Java', 'Banten', 'Bali', 'North Sumatra', 'South Sumatra'],
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'ID Pelanggan / Nomor Meter PLN',
    accountPlaceholder: 'Enter 11 to 12-digit PLN meter number (e.g. 54192847192)',
    minCustomFiat: 1,
    maxCustomFiat: 500,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prepaid Meter Token Generation', 'Postpaid Monthly Bill Settlement'],
    packages: [
      { id: 'pkg-elec-pln-1', name: 'PLN 50k IDR Token (~$3.50)', description: 'Token Listrik Prabayar PLN', fiatPrice: 3.5, currency: 'USD', validity: 'Instant 20-Digit Token' },
      { id: 'pkg-elec-pln-2', name: 'PLN 100k IDR Token (~$7.00)', description: 'Token Listrik Prabayar PLN', fiatPrice: 7, currency: 'USD', validity: 'Instant 20-Digit Token', badge: 'Popular' },
      { id: 'pkg-elec-pln-3', name: 'PLN 250k IDR Token (~$17.00)', description: 'Token Listrik Rumah Tangga', fiatPrice: 17, currency: 'USD', validity: 'Instant 20-Digit Token', badge: 'Best Value' }
    ]
  }
];

/**
 * Authoritative Hierarchy of Electricity Service Areas
 * Maps Country → State/Province → Granular Electricity Service Area / District / LGA → Provider.
 */
export const ELECTRICITY_SERVICE_AREAS: ElectricityServiceArea[] = [
  // ================= NIGERIA: NIGER STATE =================
  // Under Abuja Electricity Distribution Company (AEDC)
  {
    id: 'sa-ng-niger-minna',
    name: 'Minna Central & Bosso District',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Niger',
    lgasOrCities: ['Chanchaga', 'Bosso', 'Minna GRA', 'Maikunkele', 'Tunga', 'Kpakungu', 'Shiroro Road'],
    coverageDescription: 'Minna Capital City, Bosso LGA, GRA, Tunga & Shiroro Road corridor',
    isPrimary: true
  },
  {
    id: 'sa-ng-niger-suleja',
    name: 'Suleja & Madalla Urban Area',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Niger',
    lgasOrCities: ['Suleja', 'Madalla', 'Tafa', 'Gauraka', 'Zuma Rock corridor', 'Kwamba'],
    coverageDescription: 'Suleja Commercial Zone, Madalla Border, Tafa & Abuja-Kaduna Express corridor'
  },
  {
    id: 'sa-ng-niger-bida',
    name: 'Bida & Agaie / Lapai District',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Niger',
    lgasOrCities: ['Bida', 'Gbako', 'Lapai', 'Agaie', 'Katcha', 'Kutigi', 'Badeggi'],
    coverageDescription: 'Bida Nupe Metropolis, Federal Poly Bida, Agaie & Lapai Emirates'
  },
  {
    id: 'sa-ng-niger-kontagora',
    name: 'Kontagora & Mariga District',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Niger',
    lgasOrCities: ['Kontagora', 'Mariga', 'Wushishi', 'Rafi', 'Zungeru'],
    coverageDescription: 'Kontagora Metropolis, Federal College of Education, Wushishi & Zungeru'
  },
  {
    id: 'sa-ng-niger-mokwa-kainji',
    name: 'Mokwa, New Bussa & Kainji Dam Corridor',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Niger',
    lgasOrCities: ['Mokwa', 'Borgu', 'New Bussa', 'Jebba North', 'Kainji'],
    coverageDescription: 'Mokwa, Kainji Hydroelectric Zone, New Bussa & Borgu Kingdom'
  },

  // ================= NIGERIA: FEDERAL CAPITAL TERRITORY (ABUJA) =================
  {
    id: 'sa-ng-fct-central',
    name: 'Abuja Central Business District (CBD & Three Arms Zone)',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Federal Capital Territory',
    lgasOrCities: ['Abuja Municipal', 'Central Area', 'Three Arms Zone', 'Diplomatic Zone'],
    coverageDescription: 'Federal Secretariat, National Assembly, Central Bank & Commercial Core',
    isPrimary: true
  },
  {
    id: 'sa-ng-fct-garki-wuse',
    name: 'Garki, Wuse & Maitama District',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Federal Capital Territory',
    lgasOrCities: ['Garki I', 'Garki II', 'Wuse 2', 'Wuse Zone 1-7', 'Maitama', 'Asokoro', 'Guzape'],
    coverageDescription: 'High-density residential and commercial districts of Abuja City'
  },
  {
    id: 'sa-ng-fct-kubwa-gwarinpa',
    name: 'Gwarinpa, Kubwa & Bwari Corridor',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Federal Capital Territory',
    lgasOrCities: ['Gwarinpa Estate', 'Kubwa', 'Bwari', 'Dawaki', 'Dutse', 'Mpape'],
    coverageDescription: 'Gwarinpa Housing Estate, Kubwa Expressway & Bwari Law School Area'
  },
  {
    id: 'sa-ng-fct-airport-lugbe',
    name: 'Airport Road, Lugbe & Kuje District',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Federal Capital Territory',
    lgasOrCities: ['Lugbe', 'Airport Road', 'Kuje', 'Gwagwalada', 'Abaji', 'Piwoyi', 'Chika'],
    coverageDescription: 'Airport Road expansion belt, UniAbuja Gwagwalada & Kuje Area Council'
  },

  // ================= NIGERIA: KANO STATE =================
  // Under Kano Electricity Distribution Company (KEDCO)
  {
    id: 'sa-ng-kano-metro',
    name: 'Kano Metropolitan Core (Nassarawa, Fagge, Dala, Gwale)',
    providerId: 'prov-elec-ng-kano-electricity-kedco',
    providerName: 'Kano Electricity (KEDCO)',
    countryCode: 'NG',
    state: 'Kano',
    lgasOrCities: ['Nassarawa', 'Fagge', 'Dala', 'Gwale', 'Kano Municipal', 'Tarauni', 'Bompai', 'Sabon Gari'],
    coverageDescription: 'Kano Commercial Core, Bompai Industrial Area, Sabon Gari Market & Old City',
    isPrimary: true
  },
  {
    id: 'sa-ng-kano-dawanau-bichi',
    name: 'Dawanau, Bichi & Gwarzo Commercial Corridor',
    providerId: 'prov-elec-ng-kano-electricity-kedco',
    providerName: 'Kano Electricity (KEDCO)',
    countryCode: 'NG',
    state: 'Kano',
    lgasOrCities: ['Dawanau Grain Market', 'Bichi', 'Gwarzo', 'Tofa', 'Rimingado', 'Kabo', 'Bagwai'],
    coverageDescription: 'Dawanau Grain Hub, Federal University Dutsinma road & Northern Kano'
  },
  {
    id: 'sa-ng-kano-wudil-rano',
    name: 'Wudil, Gaya & Rano Industrial/Agricultural District',
    providerId: 'prov-elec-ng-kano-electricity-kedco',
    providerName: 'Kano Electricity (KEDCO)',
    countryCode: 'NG',
    state: 'Kano',
    lgasOrCities: ['Wudil', 'Gaya', 'Rano', 'Kura', 'Garun Mallam', 'Dawakin Kudu', 'Challawa Industrial'],
    coverageDescription: 'Challawa Industrial Estate, KUST Wudil & Southern Kano Agricultural belt'
  },

  // ================= NIGERIA: LAGOS STATE =================
  // Multi-Provider: Eko Electricity (EKEDC) vs Ikeja Electric (IKEDC)
  {
    id: 'sa-ng-lagos-island-lekki',
    name: 'Lagos Island, Victoria Island, Ikoyi & Lekki Peninsula',
    providerId: 'prov-elec-ng-eko-electricity-ekedc',
    providerName: 'Eko Electricity (EKEDC)',
    countryCode: 'NG',
    state: 'Lagos',
    lgasOrCities: ['Lagos Island', 'Eti-Osa', 'Victoria Island', 'Ikoyi', 'Lekki Phase 1', 'Ajah', 'Ibeju-Lekki'],
    coverageDescription: 'Eko Atlantic, Marina, Ikoyi Banana Island, Lekki & Ajah coastal corridor',
    isPrimary: true
  },
  {
    id: 'sa-ng-lagos-surulere-apapa',
    name: 'Surulere, Apapa Ports & Festac / Badagry Coastal Zone',
    providerId: 'prov-elec-ng-eko-electricity-ekedc',
    providerName: 'Eko Electricity (EKEDC)',
    countryCode: 'NG',
    state: 'Lagos',
    lgasOrCities: ['Surulere', 'Apapa', 'Amuwo-Odofin', 'Festac Town', 'Ojo', 'Alaba Int Market', 'Badagry', 'Satellite Town'],
    coverageDescription: 'Apapa Sea Port, Surulere, Festac, Alaba International & Badagry Border'
  },
  {
    id: 'sa-ng-lagos-ikeja-central',
    name: 'Ikeja GRA, CBD & Central Commercial District',
    providerId: 'prov-elec-ng-ikeja-electric-ikedc',
    providerName: 'Ikeja Electric (IKEDC)',
    countryCode: 'NG',
    state: 'Lagos',
    lgasOrCities: ['Ikeja GRA', 'Alausa Secretariat', 'Allen Avenue', 'Opebi', 'Maryland', 'Anthony Village', 'Ojota'],
    coverageDescription: 'Lagos State Government Secretariat, Ikeja GRA, Maryland & Opebi Commercial Hub',
    isPrimary: true
  },
  {
    id: 'sa-ng-lagos-alimosho-ikorodu',
    name: 'Ikorodu, Alimosho, Oshodi & Agege Mainland Network',
    providerId: 'prov-elec-ng-ikeja-electric-ikedc',
    providerName: 'Ikeja Electric (IKEDC)',
    countryCode: 'NG',
    state: 'Lagos',
    lgasOrCities: ['Ikorodu', 'Alimosho', 'Egbeda', 'Ipaja', 'Oshodi', 'Isolo', 'Agege', 'Ifako-Ijaiye', 'Abule-Egba'],
    coverageDescription: 'High-density mainland residential centers: Ikorodu, Alimosho, Oshodi & Agege'
  },

  // ================= NIGERIA: ABIA STATE =================
  // Multi-Provider: Aba Power (APLE / Geometric) vs Enugu Electricity (EEDC)
  {
    id: 'sa-ng-abia-aba-ringfence',
    name: 'Aba Commercial & Industrial Ring-Fenced Area (Aba Power APLE)',
    providerId: 'prov-elec-ng-aba-power-aple',
    providerName: 'Aba Power Electric (APLE / Geometric Power)',
    countryCode: 'NG',
    state: 'Abia',
    lgasOrCities: ['Aba North', 'Aba South', 'Osisioma Ngwa', 'Obingwa', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Isiala Ngwa North', 'Isiala Ngwa South'],
    coverageDescription: 'Dedicated 188MW Geometric Power ring-fenced grid for 9 Aba manufacturing LGAs',
    isPrimary: true
  },
  {
    id: 'sa-ng-abia-umuahia-north',
    name: 'Umuahia Capital, Ohafia & Bende Network (EEDC)',
    providerId: 'prov-elec-ng-enugu-electricity-eedc',
    providerName: 'Enugu Electricity (EEDC)',
    countryCode: 'NG',
    state: 'Abia',
    lgasOrCities: ['Umuahia North', 'Umuahia South', 'Ikwuano', 'Ohafia', 'Bende', 'Arochukwu'],
    coverageDescription: 'Abia State Government House, Umuahia Central, Ohafia & Bende LGA Network'
  },

  // ================= NIGERIA: OYO STATE =================
  // Under Ibadan Electricity Distribution Company (IBEDC)
  {
    id: 'sa-ng-oyo-ibadan-metro',
    name: 'Ibadan Metropolitan (Dugbe, Bodija, Ring Road, Oluyole)',
    providerId: 'prov-elec-ng-ibadan-electricity-ibedc',
    providerName: 'Ibadan Electricity (IBEDC)',
    countryCode: 'NG',
    state: 'Oyo',
    lgasOrCities: ['Ibadan North', 'Ibadan South-West', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan North-East', 'Oluyole', 'Egbeda', 'Akinyele'],
    coverageDescription: 'Dugbe Commercial Center, University of Ibadan, Bodija, Ring Road & Iwo Road',
    isPrimary: true
  },
  {
    id: 'sa-ng-oyo-ogbomoso-saki',
    name: 'Ogbomoso, Oyo Town & Oke-Ogun Agricultural Belt',
    providerId: 'prov-elec-ng-ibadan-electricity-ibedc',
    providerName: 'Ibadan Electricity (IBEDC)',
    countryCode: 'NG',
    state: 'Oyo',
    lgasOrCities: ['Ogbomoso North', 'Ogbomoso South', 'Oyo East', 'Oyo West', 'Atiba', 'Saki West', 'Iseyin', 'Kishi'],
    coverageDescription: 'LAUTECH Ogbomoso, Oyo Town Historic District, Iseyin & Saki Border Hub'
  },

  // ================= NIGERIA: ENUGU STATE =================
  // Under Enugu Electricity Distribution Company (EEDC)
  {
    id: 'sa-ng-enugu-urban',
    name: 'Enugu Urban & Independence Layout',
    providerId: 'prov-elec-ng-enugu-electricity-eedc',
    providerName: 'Enugu Electricity (EEDC)',
    countryCode: 'NG',
    state: 'Enugu',
    lgasOrCities: ['Enugu North', 'Enugu South', 'Enugu East', 'Independence Layout', 'New Haven', 'Ogui', 'Abakpa Nike', 'Emene Industrial'],
    coverageDescription: 'Coal City Center, Akanu Ibiam Airport corridor, Emene Industrial & New Haven',
    isPrimary: true
  },
  {
    id: 'sa-ng-enugu-nsukka',
    name: 'Nsukka University Town & Udi / Oji River District',
    providerId: 'prov-elec-ng-enugu-electricity-eedc',
    providerName: 'Enugu Electricity (EEDC)',
    countryCode: 'NG',
    state: 'Enugu',
    lgasOrCities: ['Nsukka', 'UNN Campus', 'Udi', 'Oji River', 'Ezeagu', 'Igbo-Eze North', 'Orba'],
    coverageDescription: 'University of Nigeria Nsukka (UNN), Udi Hills & Oji River thermal station'
  },

  // ================= NIGERIA: RIVERS STATE =================
  // Under Port Harcourt Electricity Distribution Company (PHED)
  {
    id: 'sa-ng-rivers-ph-city',
    name: 'Port Harcourt City, Obio-Akpor & Trans-Amadi Industrial',
    providerId: 'prov-elec-ng-port-harcourt-electricity-phed',
    providerName: 'Port Harcourt Electricity (PHED)',
    countryCode: 'NG',
    state: 'Rivers',
    lgasOrCities: ['Port Harcourt City', 'Obio-Akpor', 'Trans-Amadi', 'Old GRA', 'New GRA', 'D-Line', 'Rumuokoro', 'Eleme'],
    coverageDescription: 'Oil & Gas Hub, Trans-Amadi Industrial Layout, Port Harcourt Old/New GRA & Onne Port',
    isPrimary: true
  },

  // ================= NIGERIA: EDO & DELTA STATES =================
  // Under Benin Electricity Distribution Company (BEDC)
  {
    id: 'sa-ng-edo-benin-city',
    name: 'Benin City Central & Ugbowo Corridor',
    providerId: 'prov-elec-ng-benin-electricity-bedc',
    providerName: 'Benin Electricity (BEDC)',
    countryCode: 'NG',
    state: 'Edo',
    lgasOrCities: ['Oredo', 'Ikpoba-Okha', 'Egor', 'Ugbowo (UNIBEN)', 'GRA Benin', 'Ring Road'],
    coverageDescription: 'Benin Metropolis, UNIBEN Ugbowo Campus & Ikpoba Hill Industrial Area',
    isPrimary: true
  },
  {
    id: 'sa-ng-delta-warri-asaba',
    name: 'Warri Urban & Asaba Capital Territory',
    providerId: 'prov-elec-ng-benin-electricity-bedc',
    providerName: 'Benin Electricity (BEDC)',
    countryCode: 'NG',
    state: 'Delta',
    lgasOrCities: ['Warri South', 'Uvwie (Effurun)', 'Asaba (Oshimili South)', 'Sapele', 'Ughelli'],
    coverageDescription: 'Asaba Government Complex, Warri Refinery belt & Effurun Commercial Center',
    isPrimary: true
  },

  // ================= NIGERIA: KADUNA STATE =================
  // Under Kaduna Electricity Distribution Company (KAEDCO)
  {
    id: 'sa-ng-kaduna-central',
    name: 'Kaduna Metropolis & Zaria Academic City',
    providerId: 'prov-elec-ng-kaduna-electricity-kaedco',
    providerName: 'Kaduna Electricity (KAEDCO)',
    countryCode: 'NG',
    state: 'Kaduna',
    lgasOrCities: ['Kaduna North', 'Kaduna South', 'Barnawa', 'Kawo', 'Kakuri Industrial', 'Zaria (ABU Samaru)', 'Sabon Gari Zaria'],
    coverageDescription: 'Ahmadu Bello Stadium, Kaduna Industrial Area, ABU Zaria & Kaduna Capital Core',
    isPrimary: true
  },

  // ================= NIGERIA: KOGI STATE =================
  {
    id: 'sa-ng-kogi-lokoja',
    name: 'Lokoja Confluence Capital & Ajaokuta Steel Belt (AEDC)',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Kogi',
    lgasOrCities: ['Lokoja', 'Ajaokuta', 'Okene', 'Kabba', 'Idah', 'Ankpa', 'Obajana'],
    coverageDescription: 'Lokoja Capital, Obajana Cement corridor & Ajaokuta Industrial Zone',
    isPrimary: true
  },

  // ================= NIGERIA: NASARAWA STATE =================
  {
    id: 'sa-ng-nasarawa-karu',
    name: 'Karu, Mararaba & Lafia Capital (AEDC)',
    providerId: 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Abuja Electricity (AEDC)',
    countryCode: 'NG',
    state: 'Nasarawa',
    lgasOrCities: ['Karu', 'Mararaba', 'Nyanya Border', 'Lafia', 'Keffi', 'Akwanga'],
    coverageDescription: 'Abuja Gateway / Mararaba corridor, Nasarawa State University Keffi & Lafia',
    isPrimary: true
  },

  // ================= SOUTH AFRICA =================
  {
    id: 'sa-za-gauteng-city-power',
    name: 'City of Johannesburg Municipal Grid',
    providerId: 'prov-elec-za-city-power-joburg',
    providerName: 'City Power Johannesburg',
    countryCode: 'ZA',
    state: 'Gauteng',
    lgasOrCities: ['Johannesburg CBD', 'Braamfontein', 'Randburg', 'Roodepoort', 'Sandton Central', 'Rosebank'],
    coverageDescription: 'Johannesburg Metropolitan Municipal electricity distribution network',
    isPrimary: true
  },
  {
    id: 'sa-za-gauteng-eskom',
    name: 'Eskom Gauteng Direct (Soweto, Midrand & National Feed)',
    providerId: 'prov-elec-za-eskom-direct',
    providerName: 'Eskom Direct Electricity SA',
    countryCode: 'ZA',
    state: 'Gauteng',
    lgasOrCities: ['Soweto', 'Midrand', 'Diepsloot', 'Tembisa', 'Kempton Park'],
    coverageDescription: 'Eskom direct grid customers and high-voltage feeder networks'
  },
  {
    id: 'sa-za-wc-cape-town',
    name: 'City of Cape Town Municipal Grid',
    providerId: 'prov-elec-za-cape-town-electricity',
    providerName: 'City of Cape Town Electricity',
    countryCode: 'ZA',
    state: 'Western Cape',
    lgasOrCities: ['Cape Town City Bowl', 'Atlantic Seaboard', 'Southern Suburbs', 'Bellville', 'Mitchells Plain'],
    coverageDescription: 'City of Cape Town metropolitan service area & Steenbras Hydro support',
    isPrimary: true
  },

  // ================= UNITED STATES =================
  {
    id: 'sa-us-ny-coned',
    name: 'ConEdison NYC & Westchester Service Territory',
    providerId: 'prov-elec-us-conedison-ny',
    providerName: 'ConEdison Electricity (New York)',
    countryCode: 'US',
    state: 'New York',
    lgasOrCities: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Westchester County'],
    coverageDescription: 'Five boroughs of New York City and Westchester County',
    isPrimary: true
  },
  {
    id: 'sa-us-ca-pge',
    name: 'PG&E Northern & Central California Grid',
    providerId: 'prov-elec-us-pge-california',
    providerName: 'Pacific Gas and Electric (PG&E)',
    countryCode: 'US',
    state: 'California',
    lgasOrCities: ['San Francisco', 'San Jose', 'Oakland', 'Sacramento', 'Fresno', 'Silicon Valley'],
    coverageDescription: 'Northern and Central California counties from Eureka to Bakersfield',
    isPrimary: true
  },
  {
    id: 'sa-us-ca-sce',
    name: 'SCE Southern California Service Territory',
    providerId: 'prov-elec-us-sce-socal',
    providerName: 'Southern California Edison (SCE)',
    countryCode: 'US',
    state: 'California',
    lgasOrCities: ['Los Angeles County', 'Orange County', 'San Bernardino', 'Riverside', 'Ventura'],
    coverageDescription: 'Southern California excluding LADWP municipal territory',
    isPrimary: false
  },

  // ================= UAE =================
  {
    id: 'sa-ae-dubai-dewa',
    name: 'Dubai Electricity & Water Authority (DEWA)',
    providerId: 'prov-elec-ae-dewa-dubai',
    providerName: 'Dubai Electricity and Water Authority (DEWA)',
    countryCode: 'AE',
    state: 'Dubai',
    lgasOrCities: ['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'Deira', 'Bur Dubai', 'Jumeirah'],
    coverageDescription: 'Emirate of Dubai integrated smart electricity grid',
    isPrimary: true
  },

  // ================= TÜRKIYE =================
  {
    id: 'sa-tr-istanbul-bedas',
    name: 'Istanbul European Side (BEDAŞ Distribution)',
    providerId: 'prov-elec-tr-bedas-istanbul',
    providerName: 'Boğaziçi Elektrik (BEDAŞ - Istanbul European)',
    countryCode: 'TR',
    state: 'Istanbul',
    lgasOrCities: ['Beyoğlu', 'Şişli', 'Beşiktaş', 'Bakırköy', 'Fatih', 'Esenyurt', 'Sarıyer'],
    coverageDescription: 'Boğaziçi Elektrik distribution network covering European Istanbul',
    isPrimary: true
  },
  {
    id: 'sa-tr-istanbul-ayedas',
    name: 'Istanbul Asian Side (AYEDAŞ Distribution)',
    providerId: 'prov-elec-tr-ayedas-istanbul',
    providerName: 'AYEDAŞ (Istanbul Asian Side)',
    countryCode: 'TR',
    state: 'Istanbul',
    lgasOrCities: ['Kadıköy', 'Üsküdar', 'Ataşehir', 'Maltepe', 'Pendik', 'Kartal'],
    coverageDescription: 'Anadolu Yakası Elektrik Dağıtım network covering Asian Istanbul'
  }
];

/**
 * Intelligent Meter Prefix Database
 * Deterministically associates meter ranges with their authoritative distribution provider.
 */
export const KNOWN_METER_RESOLVER_PREFIXES: {
  prefix: string;
  providerId: string;
  providerName: string;
  serviceAreaName: string;
  state: string;
  countryCode: string;
}[] = [
  // AEDC Prefix Ranges (Niger, FCT, Kogi, Nasarawa)
  { prefix: '0142', providerId: 'prov-elec-ng-abuja-electricity-aedc', providerName: 'Abuja Electricity (AEDC)', serviceAreaName: 'Minna Central / Niger District', state: 'Niger', countryCode: 'NG' },
  { prefix: '0143', providerId: 'prov-elec-ng-abuja-electricity-aedc', providerName: 'Abuja Electricity (AEDC)', serviceAreaName: 'Suleja & Madalla Area', state: 'Niger', countryCode: 'NG' },
  { prefix: '4501', providerId: 'prov-elec-ng-abuja-electricity-aedc', providerName: 'Abuja Electricity (AEDC)', serviceAreaName: 'Abuja Central & Wuse / Maitama', state: 'Federal Capital Territory', countryCode: 'NG' },
  { prefix: '0219', providerId: 'prov-elec-ng-abuja-electricity-aedc', providerName: 'Abuja Electricity (AEDC)', serviceAreaName: 'Gwarinpa & Kubwa Corridor', state: 'Federal Capital Territory', countryCode: 'NG' },
  { prefix: '1412', providerId: 'prov-elec-ng-abuja-electricity-aedc', providerName: 'Abuja Electricity (AEDC)', serviceAreaName: 'Lokoja & Karu District', state: 'Kogi', countryCode: 'NG' },

  // IKEDC Prefix Ranges (Lagos Mainland / Northern)
  { prefix: '0101', providerId: 'prov-elec-ng-ikeja-electric-ikedc', providerName: 'Ikeja Electric (IKEDC)', serviceAreaName: 'Ikeja GRA & Central Commercial', state: 'Lagos', countryCode: 'NG' },
  { prefix: '0202', providerId: 'prov-elec-ng-ikeja-electric-ikedc', providerName: 'Ikeja Electric (IKEDC)', serviceAreaName: 'Ikorodu & Alimosho District', state: 'Lagos', countryCode: 'NG' },
  { prefix: '1422', providerId: 'prov-elec-ng-ikeja-electric-ikedc', providerName: 'Ikeja Electric (IKEDC)', serviceAreaName: 'Oshodi & Somolu Network', state: 'Lagos', countryCode: 'NG' },

  // EKEDC Prefix Ranges (Lagos Island & Southern Coastal)
  { prefix: '0132', providerId: 'prov-elec-ng-eko-electricity-ekedc', providerName: 'Eko Electricity (EKEDC)', serviceAreaName: 'Lagos Island, VI & Lekki Peninsula', state: 'Lagos', countryCode: 'NG' },
  { prefix: '0232', providerId: 'prov-elec-ng-eko-electricity-ekedc', providerName: 'Eko Electricity (EKEDC)', serviceAreaName: 'Surulere & Apapa Ports Area', state: 'Lagos', countryCode: 'NG' },
  { prefix: '4532', providerId: 'prov-elec-ng-eko-electricity-ekedc', providerName: 'Eko Electricity (EKEDC)', serviceAreaName: 'Festac & Badagry Coastal Zone', state: 'Lagos', countryCode: 'NG' },

  // KEDCO Prefix Ranges (Kano, Katsina, Jigawa)
  { prefix: '0155', providerId: 'prov-elec-ng-kano-electricity-kedco', providerName: 'Kano Electricity (KEDCO)', serviceAreaName: 'Kano Metropolitan Core (Bompai & Nassarawa)', state: 'Kano', countryCode: 'NG' },
  { prefix: '0255', providerId: 'prov-elec-ng-kano-electricity-kedco', providerName: 'Kano Electricity (KEDCO)', serviceAreaName: 'Dawanau & Bichi District', state: 'Kano', countryCode: 'NG' },

  // IBEDC Prefix Ranges (Oyo, Ogun, Osun, Kwara)
  { prefix: '0124', providerId: 'prov-elec-ng-ibadan-electricity-ibedc', providerName: 'Ibadan Electricity (IBEDC)', serviceAreaName: 'Ibadan Metropolitan (Bodija & Dugbe)', state: 'Oyo', countryCode: 'NG' },
  { prefix: '0224', providerId: 'prov-elec-ng-ibadan-electricity-ibedc', providerName: 'Ibadan Electricity (IBEDC)', serviceAreaName: 'Abeokuta & Osogbo District', state: 'Ogun', countryCode: 'NG' },

  // EEDC Prefix Ranges (Enugu, Umuahia, Anambra, Imo, Ebonyi)
  { prefix: '0167', providerId: 'prov-elec-ng-enugu-electricity-eedc', providerName: 'Enugu Electricity (EEDC)', serviceAreaName: 'Enugu Urban & Independence Layout', state: 'Enugu', countryCode: 'NG' },
  { prefix: '0267', providerId: 'prov-elec-ng-enugu-electricity-eedc', providerName: 'Enugu Electricity (EEDC)', serviceAreaName: 'Umuahia Capital & Ohafia District', state: 'Abia', countryCode: 'NG' },

  // Aba Power APLE (Abia Ring Fence)
  { prefix: '0188', providerId: 'prov-elec-ng-aba-power-aple', providerName: 'Aba Power Electric (APLE / Geometric Power)', serviceAreaName: 'Aba Commercial & Industrial Ring-Fence', state: 'Abia', countryCode: 'NG' },
  { prefix: '0288', providerId: 'prov-elec-ng-aba-power-aple', providerName: 'Aba Power Electric (APLE / Geometric Power)', serviceAreaName: 'Osisioma & Obingwa Industrial', state: 'Abia', countryCode: 'NG' },

  // PHED Prefix Ranges (Rivers, Bayelsa, Cross River, Akwa Ibom)
  { prefix: '0179', providerId: 'prov-elec-ng-port-harcourt-electricity-phed', providerName: 'Port Harcourt Electricity (PHED)', serviceAreaName: 'Port Harcourt City & Trans-Amadi', state: 'Rivers', countryCode: 'NG' },

  // BEDC (Edo, Delta, Ondo, Ekiti)
  { prefix: '0191', providerId: 'prov-elec-ng-benin-electricity-bedc', providerName: 'Benin Electricity (BEDC)', serviceAreaName: 'Benin City Central & Warri Urban', state: 'Edo', countryCode: 'NG' },

  // KAEDCO (Kaduna, Sokoto, Kebbi, Zamfara)
  { prefix: '0149', providerId: 'prov-elec-ng-kaduna-electricity-kaedco', providerName: 'Kaduna Electricity (KAEDCO)', serviceAreaName: 'Kaduna Metropolis & Zaria', state: 'Kaduna', countryCode: 'NG' }
];
