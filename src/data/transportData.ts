import { UtilityServiceProvider } from '../types/utility';

export const VERIFIED_TRANSPORT_PROVIDERS: UtilityServiceProvider[] = [
  // --- RAIL PROVIDERS ---
  {
    id: 'prov-rail-nrc-ng',
    name: 'Nigerian Railway Corporation (NRC)',
    category: 'transport',
    transportType: 'rail',
    logo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger National ID / Passport',
    accountPlaceholder: 'Enter Passenger NIN / Passport Number',
    minCustomFiat: 10,
    maxCustomFiat: 200,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Standard Gauge Train Ticket', 'VIP Executive Seat Pass', 'First Class Express Booking'],
    packages: [
      { id: 'pkg-rail-nrc-std', name: 'NRC Standard Class Pass', description: 'Air-conditioned reserved standard seat', fiatPrice: 15, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-rail-nrc-vip', name: 'NRC First Class Executive', description: 'Spacious leather recliner seat with refreshments', fiatPrice: 28, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-rail-amtrak-us',
    name: 'Amtrak Rail USA',
    category: 'transport',
    transportType: 'rail',
    logo: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger ID / Amtrak Guest Rewards',
    accountPlaceholder: 'Enter Passenger ID or Rewards #',
    minCustomFiat: 25,
    maxCustomFiat: 500,
    currency: 'USD',
    enabled: true,
    designations: ['Acela Express Pass', 'Northeast Regional Seat', 'Coast Starlight Sleeper'],
    packages: [
      { id: 'pkg-rail-am-reg', name: 'Amtrak Coach Class', description: 'Reserved passenger coach pass', fiatPrice: 65, currency: 'USD', validity: '1 Trip', badge: 'Standard' },
      { id: 'pkg-rail-am-biz', name: 'Amtrak Business Class / Acela', description: 'Priority boarding, power outlets & quiet car', fiatPrice: 120, currency: 'USD', validity: '1 Trip', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-rail-eurostar-eu',
    name: 'Eurostar International',
    category: 'transport',
    transportType: 'rail',
    logo: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passport / National ID Number',
    accountPlaceholder: 'Enter Passport Number for Border Control',
    minCustomFiat: 50,
    maxCustomFiat: 600,
    currency: 'USD',
    enabled: true,
    designations: ['Standard Eurostar E-Ticket', 'Standard Premier Pass', 'Business Premier Fast-Track'],
    packages: [
      { id: 'pkg-rail-es-std', name: 'Eurostar Standard Pass', description: 'High-speed cross-channel rail ticket', fiatPrice: 95, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-rail-es-prem', name: 'Eurostar Business Premier', description: 'Lounge access, 3-course meal & flexible cancellation', fiatPrice: 220, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-rail-sar-sa',
    name: 'SAR Haramain High Speed Rail',
    category: 'transport',
    transportType: 'rail',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=200&q=80',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Iqama / Passport / Visa Number',
    accountPlaceholder: 'Enter Pilgrim / Resident ID',
    minCustomFiat: 20,
    maxCustomFiat: 300,
    currency: 'USD',
    enabled: true,
    designations: ['Economy Haramain Ticket', 'Business Class Haramain Pass'],
    packages: [
      { id: 'pkg-rail-sar-eco', name: 'Haramain Economy Class', description: 'High-speed electric bullet train (300 km/h)', fiatPrice: 45, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-rail-sar-biz', name: 'Haramain Business Class', description: 'VIP Lounge access and premium cabin seating', fiatPrice: 85, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-rail-sgr-ke',
    name: 'Madaraka Express SGR (Kenya Railways)',
    category: 'transport',
    transportType: 'rail',
    logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=200&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'National ID / Passport Number',
    accountPlaceholder: 'Enter Kenyan ID or Passport',
    minCustomFiat: 10,
    maxCustomFiat: 150,
    currency: 'USD',
    enabled: true,
    designations: ['Economy Class SGR Pass', 'First Class SGR Ticket'],
    packages: [
      { id: 'pkg-rail-sgr-eco', name: 'Madaraka Express Economy', description: 'Standard inter-county express seat', fiatPrice: 18, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-rail-sgr-fst', name: 'Madaraka Express First Class', description: 'Reclining seating with onboard dining access', fiatPrice: 40, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  },

  // --- BUS & COACH PROVIDERS ---
  {
    id: 'prov-bus-gigm-ng',
    name: 'GIGM (God is Good Motors)',
    category: 'transport',
    transportType: 'bus',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger Phone & Full Name',
    accountPlaceholder: 'Enter Passenger Phone Number',
    minCustomFiat: 15,
    maxCustomFiat: 150,
    currency: 'USD',
    enabled: true,
    hasDirectValidationApi: true,
    designations: ['Prime Executive Coach', 'Jet Bus VIP Line', 'Express Courier Seat'],
    packages: [
      { id: 'pkg-bus-gigm-prm', name: 'GIGM Prime Standard Pass', description: 'Air-conditioned coach with speed telemetry', fiatPrice: 25, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-bus-gigm-vip', name: 'GIGM First Executive Jet Pass', description: 'Captain seat with personal screen & refreshments', fiatPrice: 40, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  },
  {
    id: 'prov-bus-abc-ng',
    name: 'ABC Transport Global Express',
    category: 'transport',
    transportType: 'bus',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=200&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger Phone / Passport',
    accountPlaceholder: 'Enter Phone or Passport Number',
    minCustomFiat: 15,
    maxCustomFiat: 200,
    currency: 'USD',
    enabled: true,
    designations: ['Executive Coach Pass', 'Cross-Border West Africa Luxury', 'Sleeper Coach Line'],
    packages: [
      { id: 'pkg-bus-abc-exec', name: 'ABC Executive Coach Pass', description: 'Intercity interstate express coach ticket', fiatPrice: 28, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-bus-abc-inter', name: 'ABC West Africa Cross-Border (Lagos-Accra)', description: 'International transit with customs assistance', fiatPrice: 55, currency: 'USD', validity: '1 Trip', badge: 'International' }
    ]
  },
  {
    id: 'prov-bus-greyhound-us',
    name: 'Greyhound Lines USA',
    category: 'transport',
    transportType: 'bus',
    logo: 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=200&q=80',
    country: 'United States',
    countryCode: 'US',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger Government ID / Rewards #',
    accountPlaceholder: 'Enter Passenger State ID or Passport',
    minCustomFiat: 20,
    maxCustomFiat: 300,
    currency: 'USD',
    enabled: true,
    designations: ['Greyhound Standard Ticket', 'Flexible Coach Pass', 'Priority Boarding Pass'],
    packages: [
      { id: 'pkg-bus-gh-std', name: 'Greyhound Standard Seat', description: 'Direct interstate coach with free onboard Wi-Fi', fiatPrice: 35, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-bus-gh-flex', name: 'Greyhound Flex Pass + Bag', description: 'Includes 1 free checked bag and date change flexibility', fiatPrice: 58, currency: 'USD', validity: '1 Trip', badge: 'Flexible' }
    ]
  },
  {
    id: 'prov-bus-national-express-gb',
    name: 'National Express UK',
    category: 'transport',
    transportType: 'bus',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Passenger Email & Phone',
    accountPlaceholder: 'Enter Contact Details for E-Ticket',
    minCustomFiat: 15,
    maxCustomFiat: 200,
    currency: 'USD',
    enabled: true,
    designations: ['UK Coach E-Ticket', 'Airport Coach Connect', 'Flexible Return Pass'],
    packages: [
      { id: 'pkg-bus-nx-std', name: 'National Express Single Pass', description: 'Comfortable coach with power sockets & Wi-Fi', fiatPrice: 26, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-bus-nx-air', name: 'Airport Express Direct Pass', description: 'Guaranteed airport transfer to Heathrow/Gatwick', fiatPrice: 38, currency: 'USD', validity: '1 Trip', badge: 'Best Value' }
    ]
  },
  {
    id: 'prov-bus-saptco-sa',
    name: 'SAPTCO VIP Express',
    category: 'transport',
    transportType: 'bus',
    logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=200&q=80',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    supportsCustomAmount: true,
    supportsFixedPackages: true,
    accountLabel: 'Iqama / Passport / Visa Number',
    accountPlaceholder: 'Enter Identification Number',
    minCustomFiat: 15,
    maxCustomFiat: 200,
    currency: 'USD',
    enabled: true,
    designations: ['SAPTCO Standard Bus', 'SAPTCO VIP Luxury Coach'],
    packages: [
      { id: 'pkg-bus-sap-std', name: 'SAPTCO Standard Seat', description: 'Intercity air-conditioned coach pass', fiatPrice: 22, currency: 'USD', validity: '1 Trip', badge: 'Popular' },
      { id: 'pkg-bus-sap-vip', name: 'SAPTCO VIP Luxury Pass', description: 'Wide reclining leather seats with hospitality meals', fiatPrice: 48, currency: 'USD', validity: '1 Trip', badge: 'VIP' }
    ]
  }
];

