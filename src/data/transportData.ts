import { UtilityServiceProvider } from '../types/utility';

export interface TransitStation {
  code: string;
  name: string;
  city: string;
  stateOrRegion?: string;
  country: string;
  countryCode: string;
  transportTypes: ('rail' | 'bus')[];
  aliases: string[];
}

export interface TransportRouteDefinition {
  id: string;
  providerId: string;
  providerName: string;
  transportType: 'rail' | 'bus';
  originCode: string;
  originName: string;
  originCity: string;
  originCountry: string;
  originCountryCode: string;
  destinationCode: string;
  destinationName: string;
  destinationCity: string;
  destinationCountry: string;
  destinationCountryCode: string;
  corridorName: string;
  stops?: string[];
  distanceKm?: number;
  duration: string;
  frequency: string;
  fiatFare: number;
  currency: string;
  departureTimes: string[];
  classOptions: {
    id: string;
    name: string;
    fiatPrice: number;
    description: string;
    badge?: string;
  }[];
}

export const TRANSIT_STATIONS: TransitStation[] = [
  // --- NIGERIA ---
  {
    code: 'ABV',
    name: 'Abuja (Idu Rail Terminal & Utako Bus Hub)',
    city: 'Abuja',
    stateOrRegion: 'FCT',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail', 'bus'],
    aliases: ['ABUJA', 'IDU', 'UTAKO', 'FCT', 'ABUJA CENTRAL', 'ABV']
  },
  {
    code: 'KAD',
    name: 'Kaduna (Rigasa Rail Station & Mando Hub)',
    city: 'Kaduna',
    stateOrRegion: 'Kaduna',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail', 'bus'],
    aliases: ['KADUNA', 'RIGASA', 'MANDO', 'KADUNA SOUTH', 'KAD']
  },
  {
    code: 'LOS',
    name: 'Lagos (Ebute Metta Mobolaji Johnson & Jibowu Hub)',
    city: 'Lagos',
    stateOrRegion: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail', 'bus'],
    aliases: ['LAGOS', 'EBUTE METTA', 'JIBOWU', 'YABA', 'IKEJA', 'MOBOLAJI JOHNSON', 'LOS']
  },
  {
    code: 'IBA',
    name: 'Ibadan (Moniya Chief Obafemi Awolowo Station & Iwo Rd Hub)',
    city: 'Ibadan',
    stateOrRegion: 'Oyo',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail', 'bus'],
    aliases: ['IBADAN', 'MONIYA', 'IWO ROAD', 'OYO', 'AWOLOWO STATION', 'IBA']
  },
  {
    code: 'KAN',
    name: 'Kano (Kano Central Terminal & Sabon Gari Hub)',
    city: 'Kano',
    stateOrRegion: 'Kano',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail', 'bus'],
    aliases: ['KANO', 'SABON GARI', 'KANO CENTRAL', 'KAN']
  },
  {
    code: 'BNI',
    name: 'Benin City (Uselu / Akpakpava Terminal)',
    city: 'Benin City',
    stateOrRegion: 'Edo',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['bus'],
    aliases: ['BENIN', 'BENIN CITY', 'USELU', 'AKPAKPAVA', 'EDO', 'BNI']
  },
  {
    code: 'PHC',
    name: 'Port Harcourt (Waterlines Transit Terminal)',
    city: 'Port Harcourt',
    stateOrRegion: 'Rivers',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['bus'],
    aliases: ['PORT HARCOURT', 'WATERLINES', 'RIVERS', 'PHC', 'PH']
  },
  {
    code: 'ENU',
    name: 'Enugu (Holy Ghost Transit Station)',
    city: 'Enugu',
    stateOrRegion: 'Enugu',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['bus'],
    aliases: ['ENUGU', 'HOLY GHOST', 'COAL CITY', 'ENU']
  },
  {
    code: 'WRI',
    name: 'Warri (Ujevwu Itakpe-Ajaokuta Rail Station)',
    city: 'Warri',
    stateOrRegion: 'Delta',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail'],
    aliases: ['WARRI', 'UJEVWU', 'DELTA', 'WRI']
  },
  {
    code: 'ITK',
    name: 'Itakpe / Ajaokuta Rail Station',
    city: 'Itakpe',
    stateOrRegion: 'Kogi',
    country: 'Nigeria',
    countryCode: 'NG',
    transportTypes: ['rail'],
    aliases: ['ITAKPE', 'AJAOKUTA', 'KOGI', 'ITK']
  },
  {
    code: 'ACC',
    name: 'Accra (Circle Central Terminal)',
    city: 'Accra',
    stateOrRegion: 'Greater Accra',
    country: 'Ghana',
    countryCode: 'GH',
    transportTypes: ['bus'],
    aliases: ['ACCRA', 'CIRCLE', 'GHANA', 'ACC']
  },

  // --- UNITED STATES ---
  {
    code: 'NYP',
    name: 'New York (Penn Station / Port Authority Bus Terminal)',
    city: 'New York',
    stateOrRegion: 'NY',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['NEW YORK', 'NYC', 'NYP', 'PENN STATION', 'MANHATTAN', 'PORT AUTHORITY']
  },
  {
    code: 'WAS',
    name: 'Washington D.C. (Union Station)',
    city: 'Washington',
    stateOrRegion: 'DC',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['WASHINGTON', 'WASHINGTON DC', 'WAS', 'UNION STATION DC', 'DC']
  },
  {
    code: 'BOS',
    name: 'Boston (South Station)',
    city: 'Boston',
    stateOrRegion: 'MA',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['BOSTON', 'BOS', 'SOUTH STATION', 'MASSACHUSETTS']
  },
  {
    code: 'PHL',
    name: 'Philadelphia (William H. Gray III 30th Street Station)',
    city: 'Philadelphia',
    stateOrRegion: 'PA',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['PHILADELPHIA', 'PHL', 'PHILLY', '30TH STREET']
  },
  {
    code: 'CHI',
    name: 'Chicago (Union Station & Harrison Bus Hub)',
    city: 'Chicago',
    stateOrRegion: 'IL',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['CHICAGO', 'CHI', 'UNION STATION CHICAGO', 'ILLINOIS']
  },
  {
    code: 'STL',
    name: 'St. Louis (Gateway Multimodal Center)',
    city: 'St. Louis',
    stateOrRegion: 'MO',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['ST LOUIS', 'SAINT LOUIS', 'STL', 'GATEWAY', 'MISSOURI']
  },
  {
    code: 'LAX',
    name: 'Los Angeles (Union Station & DTLA Bus Station)',
    city: 'Los Angeles',
    stateOrRegion: 'CA',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['LOS ANGELES', 'LA', 'LAX', 'CALIFORNIA', 'UNION STATION LA']
  },
  {
    code: 'SAN',
    name: 'San Diego (Santa Fe Depot)',
    city: 'San Diego',
    stateOrRegion: 'CA',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail'],
    aliases: ['SAN DIEGO', 'SAN', 'SANTA FE DEPOT']
  },
  {
    code: 'LAS',
    name: 'Las Vegas (South Strip Transit Hub)',
    city: 'Las Vegas',
    stateOrRegion: 'NV',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['bus'],
    aliases: ['LAS VEGAS', 'LAS', 'VEGAS', 'NEVADA']
  },
  {
    code: 'DET',
    name: 'Detroit (Amtrak Station & Howard St Bus Hub)',
    city: 'Detroit',
    stateOrRegion: 'MI',
    country: 'United States',
    countryCode: 'US',
    transportTypes: ['rail', 'bus'],
    aliases: ['DETROIT', 'DET', 'MICHIGAN']
  },

  // --- UNITED KINGDOM & EUROPE ---
  {
    code: 'LON',
    name: 'London (St Pancras Intl, Victoria Coach & Euston)',
    city: 'London',
    stateOrRegion: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['rail', 'bus'],
    aliases: ['LONDON', 'ST PANCRAS', 'VICTORIA', 'EUSTON', 'KINGS CROSS', 'LON', 'STP']
  },
  {
    code: 'PAR',
    name: 'Paris (Gare du Nord & Bercy Seine Hub)',
    city: 'Paris',
    stateOrRegion: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    transportTypes: ['rail', 'bus'],
    aliases: ['PARIS', 'GARE DU NORD', 'BERCY', 'PAR', 'FRANCE']
  },
  {
    code: 'BRU',
    name: 'Brussels (Bruxelles-Midi / Zuid)',
    city: 'Brussels',
    stateOrRegion: 'Brussels',
    country: 'Belgium',
    countryCode: 'BE',
    transportTypes: ['rail', 'bus'],
    aliases: ['BRUSSELS', 'BRUXELLES', 'MIDI', 'ZUID', 'BRU', 'BELGIUM']
  },
  {
    code: 'AMS',
    name: 'Amsterdam (Centraal Station & Sloterdijk)',
    city: 'Amsterdam',
    stateOrRegion: 'North Holland',
    country: 'Netherlands',
    countryCode: 'NL',
    transportTypes: ['rail', 'bus'],
    aliases: ['AMSTERDAM', 'CENTRAAL', 'SLOTERDIJK', 'AMS', 'NETHERLANDS']
  },
  {
    code: 'MAN',
    name: 'Manchester (Piccadilly Station & Chorlton Coach Hub)',
    city: 'Manchester',
    stateOrRegion: 'Greater Manchester',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['rail', 'bus'],
    aliases: ['MANCHESTER', 'PICCADILLY', 'CHORLTON', 'MAN']
  },
  {
    code: 'BHX',
    name: 'Birmingham (New Street & Digbeth Coach Station)',
    city: 'Birmingham',
    stateOrRegion: 'West Midlands',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['rail', 'bus'],
    aliases: ['BIRMINGHAM', 'NEW STREET', 'DIGBETH', 'BHX']
  },
  {
    code: 'EDB',
    name: 'Edinburgh (Waverley Station & St Andrew Bus Hub)',
    city: 'Edinburgh',
    stateOrRegion: 'Scotland',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['rail', 'bus'],
    aliases: ['EDINBURGH', 'WAVERLEY', 'ST ANDREW', 'EDB', 'SCOTLAND']
  },
  {
    code: 'BRS',
    name: 'Bristol (Temple Meads & Marlborough Coach Station)',
    city: 'Bristol',
    stateOrRegion: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['rail', 'bus'],
    aliases: ['BRISTOL', 'TEMPLE MEADS', 'MARLBOROUGH', 'BRS']
  },
  {
    code: 'LHR',
    name: 'London Heathrow Airport (Central Coach Station)',
    city: 'London',
    stateOrRegion: 'Greater London',
    country: 'United Kingdom',
    countryCode: 'GB',
    transportTypes: ['bus'],
    aliases: ['HEATHROW', 'LHR', 'HEATHROW AIRPORT', 'CENTRAL BUS STATION']
  },

  // --- SAUDI ARABIA ---
  {
    code: 'MEK',
    name: 'Makkah (Haramain High Speed Station & SAPTCO Hub)',
    city: 'Makkah',
    stateOrRegion: 'Makkah Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail', 'bus'],
    aliases: ['MAKKAH', 'MECCA', 'MEK', 'MAK', 'RUSAISAH', 'HOLY MAKKAH']
  },
  {
    code: 'MED',
    name: 'Madinah (Haramain High Speed Station & Knowledge Hub)',
    city: 'Madinah',
    stateOrRegion: 'Madinah Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail', 'bus'],
    aliases: ['MADINAH', 'MEDINA', 'MED', 'MAD', 'KNOWLEDGE ECONOMIC CITY']
  },
  {
    code: 'JED',
    name: 'Jeddah (Al-Sulaymaniyah Rail Station & SAPTCO VIP Hub)',
    city: 'Jeddah',
    stateOrRegion: 'Makkah Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail', 'bus'],
    aliases: ['JEDDAH', 'JED', 'AL-SULAYMANIYAH', 'KING ABDULAZIZ', 'SAPTCO VIP JEDDAH']
  },
  {
    code: 'RUH',
    name: 'Riyadh (SAR North-South Rail Station & SAPTCO Central)',
    city: 'Riyadh',
    stateOrRegion: 'Riyadh Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail', 'bus'],
    aliases: ['RIYADH', 'RUH', 'SAR RIYADH', 'SAPTCO AZIZIYAH']
  },
  {
    code: 'DMM',
    name: 'Dammam (SAR Eastern Station & SAPTCO Hub)',
    city: 'Dammam',
    stateOrRegion: 'Eastern Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail', 'bus'],
    aliases: ['DAMMAM', 'DMM', 'EASTERN PROVINCE', 'SAR DAMMAM']
  },
  {
    code: 'QAS',
    name: 'Qassim (Buraydah SAR High Speed Station)',
    city: 'Qassim',
    stateOrRegion: 'Al-Qassim',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    transportTypes: ['rail'],
    aliases: ['QASSIM', 'BURAYDAH', 'QAS', 'AL-QASSIM']
  },

  // --- KENYA ---
  {
    code: 'NBO',
    name: 'Nairobi (Nairobi Terminus SGR & CBD Hub)',
    city: 'Nairobi',
    stateOrRegion: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    transportTypes: ['rail', 'bus'],
    aliases: ['NAIROBI', 'NBO', 'NAIROBI TERMINUS', 'SYOKIMAU']
  },
  {
    code: 'MBA',
    name: 'Mombasa (Mombasa Terminus SGR & Mwembe Tayari Hub)',
    city: 'Mombasa',
    stateOrRegion: 'Coast',
    country: 'Kenya',
    countryCode: 'KE',
    transportTypes: ['rail', 'bus'],
    aliases: ['MOMBASA', 'MBA', 'MOMBASA TERMINUS', 'MIRITINI']
  },
  {
    code: 'NVS',
    name: 'Naivasha (Mai Mahiu / Suswa SGR Terminus)',
    city: 'Naivasha',
    stateOrRegion: 'Nakuru',
    country: 'Kenya',
    countryCode: 'KE',
    transportTypes: ['rail'],
    aliases: ['NAIVASHA', 'SUSWA', 'MAI MAHIU', 'NVS']
  }
];

export const VERIFIED_TRANSPORT_ROUTES: TransportRouteDefinition[] = [
  // =========================================================================
  // RAIL ROUTES
  // =========================================================================

  // Nigeria Rail (NRC)
  {
    id: 'route-rail-nrc-abv-kad',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'ABV',
    originName: 'Abuja Idu Station',
    originCity: 'Abuja',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'KAD',
    destinationName: 'Kaduna Rigasa Station',
    destinationCity: 'Kaduna',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Abuja - Kaduna Standard Gauge Corridor',
    stops: ['Kubwa', 'Jere', 'Rijana', 'Dutse'],
    distanceKm: 186,
    duration: '2h 15m',
    frequency: 'Daily (6 Departures)',
    fiatFare: 15.0,
    currency: 'USD',
    departureTimes: ['07:00', '09:50', '14:20', '18:00'],
    classOptions: [
      { id: 'nrc-std', name: 'Standard Class', fiatPrice: 15.0, description: 'Air-conditioned reserved seat', badge: 'Popular' },
      { id: 'nrc-vip', name: 'First Class VIP', fiatPrice: 28.0, description: 'Leather executive recliner with refreshments', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-nrc-kad-abv',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'KAD',
    originName: 'Kaduna Rigasa Station',
    originCity: 'Kaduna',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'ABV',
    destinationName: 'Abuja Idu Station',
    destinationCity: 'Abuja',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Kaduna - Abuja Standard Gauge Corridor',
    stops: ['Dutse', 'Rijana', 'Jere', 'Kubwa'],
    distanceKm: 186,
    duration: '2h 15m',
    frequency: 'Daily (6 Departures)',
    fiatFare: 15.0,
    currency: 'USD',
    departureTimes: ['06:40', '10:35', '14:00', '17:30'],
    classOptions: [
      { id: 'nrc-std', name: 'Standard Class', fiatPrice: 15.0, description: 'Air-conditioned reserved seat', badge: 'Popular' },
      { id: 'nrc-vip', name: 'First Class VIP', fiatPrice: 28.0, description: 'Leather executive recliner with refreshments', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-nrc-los-iba',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'LOS',
    originName: 'Lagos Ebute Metta (Mobolaji Johnson)',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'IBA',
    destinationName: 'Ibadan Moniya (Obafemi Awolowo)',
    destinationCity: 'Ibadan',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Lagos - Ibadan High-Capacity Rail Corridor',
    stops: ['Agege', 'Abeokuta (Wole Soyinka)', 'Olodo'],
    distanceKm: 157,
    duration: '1h 45m',
    frequency: 'Daily (4 Departures)',
    fiatFare: 18.0,
    currency: 'USD',
    departureTimes: ['08:00', '12:30', '16:00', '18:30'],
    classOptions: [
      { id: 'nrc-std', name: 'Standard Coach', fiatPrice: 18.0, description: 'Fast modern passenger coach', badge: 'Popular' },
      { id: 'nrc-biz', name: 'Business VIP Pass', fiatPrice: 32.0, description: 'Spacious seating with power outlets', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-nrc-iba-los',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'IBA',
    originName: 'Ibadan Moniya (Obafemi Awolowo)',
    originCity: 'Ibadan',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'LOS',
    destinationName: 'Lagos Ebute Metta (Mobolaji Johnson)',
    destinationCity: 'Lagos',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Ibadan - Lagos High-Capacity Rail Corridor',
    stops: ['Abeokuta', 'Agege'],
    distanceKm: 157,
    duration: '1h 45m',
    frequency: 'Daily (4 Departures)',
    fiatFare: 18.0,
    currency: 'USD',
    departureTimes: ['08:00', '13:00', '16:00', '19:00'],
    classOptions: [
      { id: 'nrc-std', name: 'Standard Coach', fiatPrice: 18.0, description: 'Fast modern passenger coach', badge: 'Popular' },
      { id: 'nrc-biz', name: 'Business VIP Pass', fiatPrice: 32.0, description: 'Spacious seating with power outlets', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-nrc-wri-itk',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'WRI',
    originName: 'Warri Ujevwu Station',
    originCity: 'Warri',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'ITK',
    destinationName: 'Itakpe Ajaokuta Station',
    destinationCity: 'Itakpe',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Warri - Itakpe Central Rail Corridor',
    stops: ['Abraka', 'Agbor', 'Uromi', 'Auchi'],
    distanceKm: 326,
    duration: '4h 30m',
    frequency: 'Daily (2 Departures)',
    fiatFare: 12.0,
    currency: 'USD',
    departureTimes: ['07:30', '14:00'],
    classOptions: [
      { id: 'nrc-wri-std', name: 'Standard Pass', fiatPrice: 12.0, description: 'Reserved passenger seat', badge: 'Popular' }
    ]
  },
  {
    id: 'route-rail-nrc-itk-wri',
    providerId: 'prov-rail-nrc-ng',
    providerName: 'Nigerian Railway Corporation (NRC)',
    transportType: 'rail',
    originCode: 'ITK',
    originName: 'Itakpe Ajaokuta Station',
    originCity: 'Itakpe',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'WRI',
    destinationName: 'Warri Ujevwu Station',
    destinationCity: 'Warri',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Itakpe - Warri Central Rail Corridor',
    stops: ['Auchi', 'Uromi', 'Agbor', 'Abraka'],
    distanceKm: 326,
    duration: '4h 30m',
    frequency: 'Daily (2 Departures)',
    fiatFare: 12.0,
    currency: 'USD',
    departureTimes: ['08:00', '14:30'],
    classOptions: [
      { id: 'nrc-wri-std', name: 'Standard Pass', fiatPrice: 12.0, description: 'Reserved passenger seat', badge: 'Popular' }
    ]
  },

  // USA Rail (Amtrak)
  {
    id: 'route-rail-amtrak-nyp-was',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'NYP',
    originName: 'New York Penn Station',
    originCity: 'New York',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'WAS',
    destinationName: 'Washington Union Station',
    destinationCity: 'Washington',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Northeast Corridor (NEC) High-Speed Express',
    stops: ['Newark Penn', 'Philadelphia 30th St', 'Wilmington', 'Baltimore Penn'],
    distanceKm: 360,
    duration: '2h 55m',
    frequency: 'Every 30 Minutes',
    fiatFare: 65.0,
    currency: 'USD',
    departureTimes: ['06:00', '07:30', '09:00', '11:15', '14:00', '16:30', '18:45'],
    classOptions: [
      { id: 'am-reg', name: 'Northeast Regional Coach', fiatPrice: 65.0, description: 'Reserved coach seating with free Wi-Fi', badge: 'Standard' },
      { id: 'am-acela', name: 'Acela Express First Class', fiatPrice: 145.0, description: 'High-speed 150mph express with meal service', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-amtrak-was-nyp',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'WAS',
    originName: 'Washington Union Station',
    originCity: 'Washington',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'NYP',
    destinationName: 'New York Penn Station',
    destinationCity: 'New York',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Northeast Corridor Northbound',
    stops: ['Baltimore Penn', 'Wilmington', 'Philadelphia 30th St', 'Newark Penn'],
    distanceKm: 360,
    duration: '2h 55m',
    frequency: 'Every 30 Minutes',
    fiatFare: 65.0,
    currency: 'USD',
    departureTimes: ['06:15', '08:00', '10:20', '13:00', '15:40', '18:00'],
    classOptions: [
      { id: 'am-reg', name: 'Northeast Regional Coach', fiatPrice: 65.0, description: 'Reserved coach seating with free Wi-Fi', badge: 'Standard' },
      { id: 'am-acela', name: 'Acela Express First Class', fiatPrice: 145.0, description: 'High-speed 150mph express with meal service', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-amtrak-bos-nyp',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'BOS',
    originName: 'Boston South Station',
    originCity: 'Boston',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'NYP',
    destinationName: 'New York Penn Station',
    destinationCity: 'New York',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Boston - New York Coastal Rail Corridor',
    stops: ['Providence', 'New Haven Union', 'Stamford'],
    distanceKm: 372,
    duration: '3h 30m',
    frequency: 'Hourly',
    fiatFare: 55.0,
    currency: 'USD',
    departureTimes: ['06:45', '08:30', '11:00', '14:15', '17:30'],
    classOptions: [
      { id: 'am-bos-std', name: 'Coach Class', fiatPrice: 55.0, description: 'Reserved passenger coach', badge: 'Popular' },
      { id: 'am-bos-acela', name: 'Acela Business Class', fiatPrice: 110.0, description: 'Priority boarding with quiet car', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-amtrak-nyp-bos',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'NYP',
    originName: 'New York Penn Station',
    originCity: 'New York',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'BOS',
    destinationName: 'Boston South Station',
    destinationCity: 'Boston',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'New York - Boston Coastal Rail Corridor',
    stops: ['Stamford', 'New Haven Union', 'Providence'],
    distanceKm: 372,
    duration: '3h 30m',
    frequency: 'Hourly',
    fiatFare: 55.0,
    currency: 'USD',
    departureTimes: ['07:00', '09:30', '12:00', '15:15', '18:30'],
    classOptions: [
      { id: 'am-bos-std', name: 'Coach Class', fiatPrice: 55.0, description: 'Reserved passenger coach', badge: 'Popular' },
      { id: 'am-bos-acela', name: 'Acela Business Class', fiatPrice: 110.0, description: 'Priority boarding with quiet car', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-amtrak-chi-stl',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'CHI',
    originName: 'Chicago Union Station',
    originCity: 'Chicago',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'STL',
    destinationName: 'St. Louis Gateway Station',
    destinationCity: 'St. Louis',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Lincoln Service 110mph Rail Corridor',
    stops: ['Joliet', 'Bloomington-Normal', 'Springfield', 'Alton'],
    distanceKm: 457,
    duration: '4h 45m',
    frequency: '4 Daily Trains',
    fiatFare: 38.0,
    currency: 'USD',
    departureTimes: ['07:05', '09:25', '13:45', '17:35'],
    classOptions: [
      { id: 'am-chi-std', name: 'Coach Class', fiatPrice: 38.0, description: 'Standard high-speed coach', badge: 'Popular' },
      { id: 'am-chi-biz', name: 'Business Class', fiatPrice: 72.0, description: 'Wide leather seats & complimentary drinks', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-amtrak-lax-san',
    providerId: 'prov-rail-amtrak-us',
    providerName: 'Amtrak Rail USA',
    transportType: 'rail',
    originCode: 'LAX',
    originName: 'Los Angeles Union Station',
    originCity: 'Los Angeles',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'SAN',
    destinationName: 'San Diego Santa Fe Depot',
    destinationCity: 'San Diego',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Pacific Surfliner Scenic Coastal Rail',
    stops: ['Anaheim', 'Irvine', 'San Juan Capistrano', 'Oceanside'],
    distanceKm: 206,
    duration: '2h 50m',
    frequency: '5 Daily Departures',
    fiatFare: 36.0,
    currency: 'USD',
    departureTimes: ['06:10', '09:15', '12:30', '15:50', '19:10'],
    classOptions: [
      { id: 'am-ps-std', name: 'Surfliner Coach', fiatPrice: 36.0, description: 'Ocean view passenger coach', badge: 'Scenic' },
      { id: 'am-ps-biz', name: 'Surfliner Business Class', fiatPrice: 58.0, description: 'Panoramic upper deck with snacks', badge: 'VIP' }
    ]
  },

  // UK & Europe Rail (Eurostar & UK Rail)
  {
    id: 'route-rail-eurostar-lon-par',
    providerId: 'prov-rail-eurostar-eu',
    providerName: 'Eurostar International',
    transportType: 'rail',
    originCode: 'LON',
    originName: 'London St Pancras International',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'PAR',
    destinationName: 'Paris Gare du Nord',
    destinationCity: 'Paris',
    destinationCountry: 'France',
    destinationCountryCode: 'FR',
    corridorName: 'High-Speed Cross-Channel Channel Tunnel Corridor',
    stops: ['Ebbsfleet', 'Calais-Fréthun', 'Lille Europe'],
    distanceKm: 492,
    duration: '2h 18m',
    frequency: 'Hourly',
    fiatFare: 95.0,
    currency: 'USD',
    departureTimes: ['06:01', '08:01', '10:24', '13:01', '15:31', '17:31', '19:01'],
    classOptions: [
      { id: 'es-std', name: 'Eurostar Standard', fiatPrice: 95.0, description: 'Modern 300km/h e-ticket pass', badge: 'Popular' },
      { id: 'es-prem', name: 'Business Premier', fiatPrice: 220.0, description: 'Lounge access, 3-course chef meal, fast-track security', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-eurostar-par-lon',
    providerId: 'prov-rail-eurostar-eu',
    providerName: 'Eurostar International',
    transportType: 'rail',
    originCode: 'PAR',
    originName: 'Paris Gare du Nord',
    originCity: 'Paris',
    originCountry: 'France',
    originCountryCode: 'FR',
    destinationCode: 'LON',
    destinationName: 'London St Pancras International',
    destinationCity: 'London',
    destinationCountry: 'United Kingdom',
    destinationCountryCode: 'GB',
    corridorName: 'Channel Tunnel Paris - London High-Speed Corridor',
    stops: ['Lille Europe', 'Calais', 'Ebbsfleet'],
    distanceKm: 492,
    duration: '2h 18m',
    frequency: 'Hourly',
    fiatFare: 95.0,
    currency: 'USD',
    departureTimes: ['07:03', '09:03', '11:13', '14:03', '16:33', '18:33', '20:03'],
    classOptions: [
      { id: 'es-std', name: 'Eurostar Standard', fiatPrice: 95.0, description: 'Modern 300km/h e-ticket pass', badge: 'Popular' },
      { id: 'es-prem', name: 'Business Premier', fiatPrice: 220.0, description: 'Lounge access, 3-course chef meal, fast-track security', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-eurostar-lon-bru',
    providerId: 'prov-rail-eurostar-eu',
    providerName: 'Eurostar International',
    transportType: 'rail',
    originCode: 'LON',
    originName: 'London St Pancras International',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'BRU',
    destinationName: 'Brussels-Midi / Zuid',
    destinationCity: 'Brussels',
    destinationCountry: 'Belgium',
    destinationCountryCode: 'BE',
    corridorName: 'London - Brussels High Speed Rail',
    stops: ['Lille Europe'],
    distanceKm: 373,
    duration: '1h 53m',
    frequency: 'Every 2 Hours',
    fiatFare: 88.0,
    currency: 'USD',
    departureTimes: ['06:47', '09:01', '12:58', '16:04', '18:04'],
    classOptions: [
      { id: 'es-bru-std', name: 'Standard Pass', fiatPrice: 88.0, description: 'High-speed express e-ticket', badge: 'Popular' },
      { id: 'es-bru-prem', name: 'Standard Premier', fiatPrice: 165.0, description: 'Spacious seat with complimentary light meal', badge: 'Comfort' }
    ]
  },
  {
    id: 'route-rail-eurostar-lon-ams',
    providerId: 'prov-rail-eurostar-eu',
    providerName: 'Eurostar International',
    transportType: 'rail',
    originCode: 'LON',
    originName: 'London St Pancras International',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'AMS',
    destinationName: 'Amsterdam Centraal Station',
    destinationCity: 'Amsterdam',
    destinationCountry: 'Netherlands',
    destinationCountryCode: 'NL',
    corridorName: 'London - Amsterdam Direct High-Speed Corridor',
    stops: ['Brussels-Midi', 'Rotterdam Centraal'],
    distanceKm: 580,
    duration: '3h 52m',
    frequency: '4 Daily Direct Trains',
    fiatFare: 105.0,
    currency: 'USD',
    departureTimes: ['08:16', '11:04', '15:16', '18:04'],
    classOptions: [
      { id: 'es-ams-std', name: 'Eurostar Standard', fiatPrice: 105.0, description: 'Direct high-speed pass', badge: 'Popular' },
      { id: 'es-ams-prem', name: 'Eurostar Plus', fiatPrice: 195.0, description: 'Extra legroom and onboard meal', badge: 'VIP' }
    ]
  },

  // Saudi Arabia Rail (SAR Haramain & North-South Rail)
  {
    id: 'route-rail-sar-mek-med',
    providerId: 'prov-rail-sar-sa',
    providerName: 'SAR Haramain High Speed Rail',
    transportType: 'rail',
    originCode: 'MEK',
    originName: 'Makkah Haramain Station (Al-Rusaifah)',
    originCity: 'Makkah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MED',
    destinationName: 'Madinah Haramain Station',
    destinationCity: 'Madinah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Haramain High-Speed Pilgrim Corridor (300 km/h)',
    stops: ['Jeddah Al-Sulaymaniyah', 'King Abdulaziz Intl Airport (KAIA)', 'King Abdullah Economic City (KAEC)'],
    distanceKm: 453,
    duration: '2h 15m',
    frequency: 'Hourly Departures',
    fiatFare: 45.0,
    currency: 'USD',
    departureTimes: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    classOptions: [
      { id: 'sar-eco', name: 'Haramain Economy Class', fiatPrice: 45.0, description: 'Electric bullet train reserved seat', badge: 'Popular' },
      { id: 'sar-biz', name: 'Haramain Business VIP', fiatPrice: 85.0, description: 'VIP Lounge access and premium hospitality', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-sar-med-mek',
    providerId: 'prov-rail-sar-sa',
    providerName: 'SAR Haramain High Speed Rail',
    transportType: 'rail',
    originCode: 'MED',
    originName: 'Madinah Haramain Station',
    originCity: 'Madinah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MEK',
    destinationName: 'Makkah Haramain Station (Al-Rusaifah)',
    destinationCity: 'Makkah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Haramain High-Speed Southbound Pilgrim Corridor',
    stops: ['KAEC', 'KAIA Jeddah Airport', 'Jeddah Al-Sulaymaniyah'],
    distanceKm: 453,
    duration: '2h 15m',
    frequency: 'Hourly Departures',
    fiatFare: 45.0,
    currency: 'USD',
    departureTimes: ['06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30'],
    classOptions: [
      { id: 'sar-eco', name: 'Haramain Economy Class', fiatPrice: 45.0, description: 'Electric bullet train reserved seat', badge: 'Popular' },
      { id: 'sar-biz', name: 'Haramain Business VIP', fiatPrice: 85.0, description: 'VIP Lounge access and premium hospitality', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-sar-jed-med',
    providerId: 'prov-rail-sar-sa',
    providerName: 'SAR Haramain High Speed Rail',
    transportType: 'rail',
    originCode: 'JED',
    originName: 'Jeddah Al-Sulaymaniyah Station',
    originCity: 'Jeddah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MED',
    destinationName: 'Madinah Haramain Station',
    destinationCity: 'Madinah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Jeddah - Madinah High-Speed Rail Corridor',
    stops: ['KAEC'],
    distanceKm: 375,
    duration: '1h 48m',
    frequency: 'Every 45 Minutes',
    fiatFare: 38.0,
    currency: 'USD',
    departureTimes: ['07:15', '09:15', '11:15', '13:15', '15:15', '17:15', '19:15'],
    classOptions: [
      { id: 'sar-eco', name: 'Economy Class', fiatPrice: 38.0, description: 'High-speed electric seat', badge: 'Popular' },
      { id: 'sar-biz', name: 'Business VIP Pass', fiatPrice: 70.0, description: 'VIP leather seat & dates/coffee hospitality', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-sar-jed-mek',
    providerId: 'prov-rail-sar-sa',
    providerName: 'SAR Haramain High Speed Rail',
    transportType: 'rail',
    originCode: 'JED',
    originName: 'Jeddah Al-Sulaymaniyah Station',
    originCity: 'Jeddah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MEK',
    destinationName: 'Makkah Haramain Station',
    destinationCity: 'Makkah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Jeddah - Makkah Shuttle High-Speed Corridor',
    stops: [],
    distanceKm: 78,
    duration: '35m',
    frequency: 'Every 30 Minutes',
    fiatFare: 20.0,
    currency: 'USD',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    classOptions: [
      { id: 'sar-eco-shuttle', name: 'Economy Shuttle', fiatPrice: 20.0, description: 'Direct 35-min bullet train', badge: 'Popular' },
      { id: 'sar-biz-shuttle', name: 'Business Shuttle VIP', fiatPrice: 40.0, description: 'Priority boarding and executive cabin', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-sar-ruh-dmm',
    providerId: 'prov-rail-sar-sa',
    providerName: 'SAR Haramain High Speed Rail',
    transportType: 'rail',
    originCode: 'RUH',
    originName: 'Riyadh SAR Station',
    originCity: 'Riyadh',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'DMM',
    destinationName: 'Dammam SAR Station',
    destinationCity: 'Dammam',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Riyadh - Eastern Province Railway Corridor',
    stops: ['Hofuf', 'Abqaiq'],
    distanceKm: 449,
    duration: '3h 30m',
    frequency: '5 Daily Trains',
    fiatFare: 35.0,
    currency: 'USD',
    departureTimes: ['07:45', '11:00', '14:20', '17:35', '21:00'],
    classOptions: [
      { id: 'sar-east-eco', name: 'East Express Economy', fiatPrice: 35.0, description: 'Reserved passenger coach', badge: 'Popular' },
      { id: 'sar-east-biz', name: 'East Express Business Class', fiatPrice: 65.0, description: 'Spacious leather seat with catering', badge: 'VIP' }
    ]
  },

  // Kenya Rail (Madaraka Express SGR)
  {
    id: 'route-rail-sgr-nbo-mba',
    providerId: 'prov-rail-sgr-ke',
    providerName: 'Madaraka Express SGR (Kenya Railways)',
    transportType: 'rail',
    originCode: 'NBO',
    originName: 'Nairobi Terminus SGR (Syokimau)',
    originCity: 'Nairobi',
    originCountry: 'Kenya',
    originCountryCode: 'KE',
    destinationCode: 'MBA',
    destinationName: 'Mombasa Terminus SGR (Miritini)',
    destinationCity: 'Mombasa',
    destinationCountry: 'Kenya',
    destinationCountryCode: 'KE',
    corridorName: 'Nairobi - Mombasa Madaraka Express SGR Corridor',
    stops: ['Athi River', 'Emali', 'Kibwezi', 'Mtito Andei', 'Voi'],
    distanceKm: 472,
    duration: '4h 50m',
    frequency: 'Daily (3 Trains)',
    fiatFare: 18.0,
    currency: 'USD',
    departureTimes: ['08:00', '15:00', '22:00'],
    classOptions: [
      { id: 'sgr-eco', name: 'Madaraka Express Economy', fiatPrice: 18.0, description: 'Standard modern inter-county express seat', badge: 'Popular' },
      { id: 'sgr-fst', name: 'Madaraka Express First Class', fiatPrice: 40.0, description: 'Reclining seating with onboard dining access', badge: 'VIP' }
    ]
  },
  {
    id: 'route-rail-sgr-mba-nbo',
    providerId: 'prov-rail-sgr-ke',
    providerName: 'Madaraka Express SGR (Kenya Railways)',
    transportType: 'rail',
    originCode: 'MBA',
    originName: 'Mombasa Terminus SGR (Miritini)',
    originCity: 'Mombasa',
    originCountry: 'Kenya',
    originCountryCode: 'KE',
    destinationCode: 'NBO',
    destinationName: 'Nairobi Terminus SGR (Syokimau)',
    destinationCity: 'Nairobi',
    destinationCountry: 'Kenya',
    destinationCountryCode: 'KE',
    corridorName: 'Mombasa - Nairobi Madaraka Express SGR Corridor',
    stops: ['Voi', 'Mtito Andei', 'Kibwezi', 'Emali', 'Athi River'],
    distanceKm: 472,
    duration: '4h 50m',
    frequency: 'Daily (3 Trains)',
    fiatFare: 18.0,
    currency: 'USD',
    departureTimes: ['08:00', '15:00', '22:00'],
    classOptions: [
      { id: 'sgr-eco', name: 'Madaraka Express Economy', fiatPrice: 18.0, description: 'Standard modern inter-county express seat', badge: 'Popular' },
      { id: 'sgr-fst', name: 'Madaraka Express First Class', fiatPrice: 40.0, description: 'Reclining seating with onboard dining access', badge: 'VIP' }
    ]
  },

  // =========================================================================
  // INTER-CITY BUS & COACH ROUTES
  // =========================================================================

  // Nigeria Bus (GIGM)
  {
    id: 'route-bus-gigm-los-abv',
    providerId: 'prov-bus-gigm-ng',
    providerName: 'GIGM (God is Good Motors)',
    transportType: 'bus',
    originCode: 'LOS',
    originName: 'Lagos Jibowu Terminal',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'ABV',
    destinationName: 'Abuja Utako Central Terminal',
    destinationCity: 'Abuja',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Lagos - Abuja Interstate Highway Corridor',
    stops: ['Sagamu', 'Ore', 'Benin Bypass', 'Okene', 'Lokoja'],
    distanceKm: 750,
    duration: '9h 30m',
    frequency: 'Daily (5 Departures)',
    fiatFare: 25.0,
    currency: 'USD',
    departureTimes: ['06:00', '06:45', '07:30', '08:15', '20:00'],
    classOptions: [
      { id: 'gigm-prm', name: 'Prime Standard Coach', fiatPrice: 25.0, description: 'AC bus with live speed telemetry', badge: 'Popular' },
      { id: 'gigm-vip', name: 'First Executive Jet Pass', fiatPrice: 40.0, description: 'Captain seat with personal screen & refreshments', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-gigm-abv-los',
    providerId: 'prov-bus-gigm-ng',
    providerName: 'GIGM (God is Good Motors)',
    transportType: 'bus',
    originCode: 'ABV',
    originName: 'Abuja Utako Central Terminal',
    originCity: 'Abuja',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'LOS',
    destinationName: 'Lagos Jibowu Terminal',
    destinationCity: 'Lagos',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Abuja - Lagos Interstate Highway Corridor',
    stops: ['Lokoja', 'Okene', 'Benin Bypass', 'Ore', 'Sagamu'],
    distanceKm: 750,
    duration: '9h 30m',
    frequency: 'Daily (5 Departures)',
    fiatFare: 25.0,
    currency: 'USD',
    departureTimes: ['06:00', '06:45', '07:30', '08:15', '20:00'],
    classOptions: [
      { id: 'gigm-prm', name: 'Prime Standard Coach', fiatPrice: 25.0, description: 'AC bus with live speed telemetry', badge: 'Popular' },
      { id: 'gigm-vip', name: 'First Executive Jet Pass', fiatPrice: 40.0, description: 'Captain seat with personal screen & refreshments', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-gigm-los-bni',
    providerId: 'prov-bus-gigm-ng',
    providerName: 'GIGM (God is Good Motors)',
    transportType: 'bus',
    originCode: 'LOS',
    originName: 'Lagos Jibowu Terminal',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'BNI',
    destinationName: 'Benin City Uselu Terminal',
    destinationCity: 'Benin City',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Lagos - Benin Expressway Corridor',
    stops: ['Sagamu', 'Ijebu Ode', 'Ore'],
    distanceKm: 315,
    duration: '4h 45m',
    frequency: 'Hourly Departures',
    fiatFare: 16.0,
    currency: 'USD',
    departureTimes: ['06:30', '08:00', '10:00', '12:30', '14:30', '16:30'],
    classOptions: [
      { id: 'gigm-bni-std', name: 'GIGM Prime Coach', fiatPrice: 16.0, description: 'Express interstate bus', badge: 'Popular' },
      { id: 'gigm-bni-vip', name: 'Executive Jet Line', fiatPrice: 24.0, description: 'Luxury seating with onboard entertainment', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-gigm-los-phc',
    providerId: 'prov-bus-gigm-ng',
    providerName: 'GIGM (God is Good Motors)',
    transportType: 'bus',
    originCode: 'LOS',
    originName: 'Lagos Jibowu Terminal',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'PHC',
    destinationName: 'Port Harcourt Waterlines Terminal',
    destinationCity: 'Port Harcourt',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Lagos - Port Harcourt Interstate Corridor',
    stops: ['Ore', 'Benin City', 'Warri Bypass', 'Yenagoa Junction'],
    distanceKm: 615,
    duration: '8h 30m',
    frequency: '4 Daily Departures',
    fiatFare: 26.0,
    currency: 'USD',
    departureTimes: ['06:15', '07:00', '08:00', '19:30'],
    classOptions: [
      { id: 'gigm-phc-std', name: 'Prime Coach', fiatPrice: 26.0, description: 'Intercity AC Coach', badge: 'Popular' },
      { id: 'gigm-phc-vip', name: 'Executive Jet', fiatPrice: 38.0, description: 'VIP reclining seats & charging ports', badge: 'VIP' }
    ]
  },

  // Nigeria Bus (ABC Transport)
  {
    id: 'route-bus-abc-los-abv',
    providerId: 'prov-bus-abc-ng',
    providerName: 'ABC Transport Global Express',
    transportType: 'bus',
    originCode: 'LOS',
    originName: 'Lagos Jibowu Terminal',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'ABV',
    destinationName: 'Abuja Utako ABC Terminal',
    destinationCity: 'Abuja',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Lagos - Abuja Executive Highway Corridor',
    stops: ['Ore', 'Lokoja'],
    distanceKm: 750,
    duration: '9h 15m',
    frequency: 'Daily (3 Departures)',
    fiatFare: 28.0,
    currency: 'USD',
    departureTimes: ['06:30', '07:15', '20:30'],
    classOptions: [
      { id: 'abc-exec', name: 'ABC Executive Coach', fiatPrice: 28.0, description: 'Interstate luxury coach pass', badge: 'Popular' },
      { id: 'abc-sleep', name: 'Sleeper Coach Pass', fiatPrice: 42.0, description: 'Full flat bed sleeper cabin for night transit', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-abc-los-acc',
    providerId: 'prov-bus-abc-ng',
    providerName: 'ABC Transport Global Express',
    transportType: 'bus',
    originCode: 'LOS',
    originName: 'Lagos Jibowu West Africa Terminal',
    originCity: 'Lagos',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'ACC',
    destinationName: 'Accra Circle ABC Terminal',
    destinationCity: 'Accra',
    destinationCountry: 'Ghana',
    destinationCountryCode: 'GH',
    corridorName: 'Lagos - Cotonou - Lomé - Accra ECOWAS Cross-Border Corridor',
    stops: ['Seme Border', 'Cotonou', 'Aflao Border', 'Lomé', 'Tema'],
    distanceKm: 460,
    duration: '8h 00m',
    frequency: 'Daily (2 Departures)',
    fiatFare: 55.0,
    currency: 'USD',
    departureTimes: ['06:00', '07:00'],
    classOptions: [
      { id: 'abc-inter-std', name: 'West Africa Luxury Coach', fiatPrice: 55.0, description: 'Cross-border express with customs transit facilitation', badge: 'International' },
      { id: 'abc-inter-vip', name: 'West Africa VIP Pass', fiatPrice: 75.0, description: 'Fast-track immigration & VIP lounge seating', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-abc-abv-kan',
    providerId: 'prov-bus-abc-ng',
    providerName: 'ABC Transport Global Express',
    transportType: 'bus',
    originCode: 'ABV',
    originName: 'Abuja Utako Terminal',
    originCity: 'Abuja',
    originCountry: 'Nigeria',
    originCountryCode: 'NG',
    destinationCode: 'KAN',
    destinationName: 'Kano Sabon Gari Terminal',
    destinationCity: 'Kano',
    destinationCountry: 'Nigeria',
    destinationCountryCode: 'NG',
    corridorName: 'Abuja - Kaduna - Kano Northern Expressway',
    stops: ['Kaduna', 'Zaria'],
    distanceKm: 420,
    duration: '5h 30m',
    frequency: 'Daily (3 Departures)',
    fiatFare: 20.0,
    currency: 'USD',
    departureTimes: ['07:00', '10:30', '14:00'],
    classOptions: [
      { id: 'abc-kan-std', name: 'Executive Standard Coach', fiatPrice: 20.0, description: 'Air-conditioned transit', badge: 'Popular' }
    ]
  },

  // USA Bus (Greyhound Lines)
  {
    id: 'route-bus-gh-nyc-bos',
    providerId: 'prov-bus-greyhound-us',
    providerName: 'Greyhound Lines USA',
    transportType: 'bus',
    originCode: 'NYP',
    originName: 'New York Port Authority Bus Terminal',
    originCity: 'New York',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'BOS',
    destinationName: 'Boston South Station Bus Terminal',
    destinationCity: 'Boston',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'New York - Boston Interstate Coach Corridor',
    stops: ['Hartford Union Station', 'Worcester'],
    distanceKm: 346,
    duration: '4h 15m',
    frequency: 'Hourly',
    fiatFare: 35.0,
    currency: 'USD',
    departureTimes: ['06:00', '08:30', '11:00', '13:30', '16:00', '18:30', '21:00'],
    classOptions: [
      { id: 'gh-std', name: 'Greyhound Standard Seat', fiatPrice: 35.0, description: 'Coach with free Wi-Fi and power outlets', badge: 'Popular' },
      { id: 'gh-flex', name: 'Greyhound Flex Pass + Bag', fiatPrice: 58.0, description: '1 free checked bag + date flexibility', badge: 'Flexible' }
    ]
  },
  {
    id: 'route-bus-gh-bos-nyc',
    providerId: 'prov-bus-greyhound-us',
    providerName: 'Greyhound Lines USA',
    transportType: 'bus',
    originCode: 'BOS',
    originName: 'Boston South Station Bus Terminal',
    originCity: 'Boston',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'NYP',
    destinationName: 'New York Port Authority Bus Terminal',
    destinationCity: 'New York',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Boston - New York Interstate Coach Corridor',
    stops: ['Worcester', 'Hartford Union Station'],
    distanceKm: 346,
    duration: '4h 15m',
    frequency: 'Hourly',
    fiatFare: 35.0,
    currency: 'USD',
    departureTimes: ['06:30', '09:00', '11:30', '14:00', '16:30', '19:00', '21:30'],
    classOptions: [
      { id: 'gh-std', name: 'Greyhound Standard Seat', fiatPrice: 35.0, description: 'Coach with free Wi-Fi and power outlets', badge: 'Popular' },
      { id: 'gh-flex', name: 'Greyhound Flex Pass + Bag', fiatPrice: 58.0, description: '1 free checked bag + date flexibility', badge: 'Flexible' }
    ]
  },
  {
    id: 'route-bus-gh-nyc-was',
    providerId: 'prov-bus-greyhound-us',
    providerName: 'Greyhound Lines USA',
    transportType: 'bus',
    originCode: 'NYP',
    originName: 'New York Port Authority Bus Terminal',
    originCity: 'New York',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'WAS',
    destinationName: 'Washington Union Station Bus Deck',
    destinationCity: 'Washington',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'New York - Philadelphia - Washington DC Corridor',
    stops: ['Philadelphia Bus Station', 'Baltimore Downtown'],
    distanceKm: 365,
    duration: '4h 30m',
    frequency: 'Every 45 Minutes',
    fiatFare: 32.0,
    currency: 'USD',
    departureTimes: ['06:15', '08:00', '10:15', '12:45', '15:15', '17:45', '20:00'],
    classOptions: [
      { id: 'gh-was-std', name: 'Standard Coach', fiatPrice: 32.0, description: 'Direct highway coach', badge: 'Popular' },
      { id: 'gh-was-prm', name: 'Priority Boarding Pass', fiatPrice: 48.0, description: 'First boarding + overhead storage', badge: 'Priority' }
    ]
  },
  {
    id: 'route-bus-gh-lax-las',
    providerId: 'prov-bus-greyhound-us',
    providerName: 'Greyhound Lines USA',
    transportType: 'bus',
    originCode: 'LAX',
    originName: 'Los Angeles DTLA Bus Station',
    originCity: 'Los Angeles',
    originCountry: 'United States',
    originCountryCode: 'US',
    destinationCode: 'LAS',
    destinationName: 'Las Vegas South Strip Transit Hub',
    destinationCity: 'Las Vegas',
    destinationCountry: 'United States',
    destinationCountryCode: 'US',
    corridorName: 'Los Angeles - Las Vegas Desert Express Corridor',
    stops: ['San Bernardino', 'Barstow'],
    distanceKm: 435,
    duration: '5h 15m',
    frequency: '6 Daily Departures',
    fiatFare: 39.0,
    currency: 'USD',
    departureTimes: ['07:00', '10:00', '13:00', '16:00', '19:00', '23:30'],
    classOptions: [
      { id: 'gh-las-std', name: 'Standard Express', fiatPrice: 39.0, description: 'Desert express coach with AC & Wi-Fi', badge: 'Popular' }
    ]
  },

  // UK Bus (National Express UK)
  {
    id: 'route-bus-nx-lon-bhx',
    providerId: 'prov-bus-national-express-gb',
    providerName: 'National Express UK',
    transportType: 'bus',
    originCode: 'LON',
    originName: 'London Victoria Coach Station',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'BHX',
    destinationName: 'Birmingham Digbeth Coach Station',
    destinationCity: 'Birmingham',
    destinationCountry: 'United Kingdom',
    destinationCountryCode: 'GB',
    corridorName: 'London - Birmingham M40 Coach Corridor',
    stops: ['Coventry Pool Meadow'],
    distanceKm: 190,
    duration: '2h 40m',
    frequency: 'Every 30 Minutes',
    fiatFare: 26.0,
    currency: 'USD',
    departureTimes: ['06:30', '08:00', '09:30', '11:00', '13:00', '15:30', '17:30', '19:30'],
    classOptions: [
      { id: 'nx-std', name: 'National Express Single Pass', fiatPrice: 26.0, description: 'Comfortable coach with power sockets & Wi-Fi', badge: 'Popular' },
      { id: 'nx-flex', name: 'Flexible Return Pass', fiatPrice: 42.0, description: 'Change journey time anytime without fee', badge: 'Flexible' }
    ]
  },
  {
    id: 'route-bus-nx-lon-man',
    providerId: 'prov-bus-national-express-gb',
    providerName: 'National Express UK',
    transportType: 'bus',
    originCode: 'LON',
    originName: 'London Victoria Coach Station',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'MAN',
    destinationName: 'Manchester Coach Station (Chorlton St)',
    destinationCity: 'Manchester',
    destinationCountry: 'United Kingdom',
    destinationCountryCode: 'GB',
    corridorName: 'London - Manchester InterCity Coach Corridor',
    stops: ['Milton Keynes', 'Stoke-on-Trent'],
    distanceKm: 335,
    duration: '4h 45m',
    frequency: 'Hourly Departures',
    fiatFare: 30.0,
    currency: 'USD',
    departureTimes: ['07:00', '09:00', '11:30', '14:00', '16:30', '19:00', '23:30'],
    classOptions: [
      { id: 'nx-man-std', name: 'Standard Seat', fiatPrice: 30.0, description: 'Reclining coach seat with USB charging', badge: 'Popular' }
    ]
  },
  {
    id: 'route-bus-nx-lon-lhr',
    providerId: 'prov-bus-national-express-gb',
    providerName: 'National Express UK',
    transportType: 'bus',
    originCode: 'LON',
    originName: 'London Victoria Coach Station',
    originCity: 'London',
    originCountry: 'United Kingdom',
    originCountryCode: 'GB',
    destinationCode: 'LHR',
    destinationName: 'London Heathrow Central Bus Station',
    destinationCity: 'London',
    destinationCountry: 'United Kingdom',
    destinationCountryCode: 'GB',
    corridorName: 'London - Heathrow Airport Express Coach Transfer',
    stops: ['Heathrow Terminal 5'],
    distanceKm: 25,
    duration: '40m',
    frequency: 'Every 15 Minutes',
    fiatFare: 16.0,
    currency: 'USD',
    departureTimes: ['05:00', '05:30', '06:00', '07:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    classOptions: [
      { id: 'nx-air', name: 'Airport Express Direct Pass', fiatPrice: 16.0, description: 'Guaranteed airport transfer to Heathrow', badge: 'Best Value' }
    ]
  },

  // Saudi Arabia Bus (SAPTCO VIP Express)
  {
    id: 'route-bus-saptco-ruh-jed',
    providerId: 'prov-bus-saptco-sa',
    providerName: 'SAPTCO VIP Express',
    transportType: 'bus',
    originCode: 'RUH',
    originName: 'Riyadh SAPTCO Central Hub',
    originCity: 'Riyadh',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'JED',
    destinationName: 'Jeddah SAPTCO VIP Station',
    destinationCity: 'Jeddah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Riyadh - Jeddah VIP Trans-Arabian Highway Corridor',
    stops: ['Al-Quwayiyah', 'Zulm', 'Taif'],
    distanceKm: 950,
    duration: '10h 30m',
    frequency: '4 Daily VIP Coaches',
    fiatFare: 38.0,
    currency: 'USD',
    departureTimes: ['07:00', '12:00', '18:30', '22:00'],
    classOptions: [
      { id: 'saptco-std', name: 'SAPTCO Standard Coach', fiatPrice: 38.0, description: 'AC intercity bus with drinks', badge: 'Popular' },
      { id: 'saptco-vip', name: 'SAPTCO VIP Luxury Coach', fiatPrice: 65.0, description: 'Wide 2+1 reclining leather chairs with hot meals', badge: 'VIP' }
    ]
  },
  {
    id: 'route-bus-saptco-jed-mek',
    providerId: 'prov-bus-saptco-sa',
    providerName: 'SAPTCO VIP Express',
    transportType: 'bus',
    originCode: 'JED',
    originName: 'Jeddah SAPTCO Station',
    originCity: 'Jeddah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MEK',
    destinationName: 'Makkah SAPTCO Al-Haram Terminal',
    destinationCity: 'Makkah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Jeddah - Makkah Pilgrim Highway Express',
    stops: [],
    distanceKm: 85,
    duration: '1h 00m',
    frequency: 'Every 20 Minutes',
    fiatFare: 15.0,
    currency: 'USD',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    classOptions: [
      { id: 'saptco-shuttle', name: 'Pilgrim Shuttle Express', fiatPrice: 15.0, description: 'Direct highway coach to Holy Mosque', badge: 'Popular' }
    ]
  },
  {
    id: 'route-bus-saptco-jed-med',
    providerId: 'prov-bus-saptco-sa',
    providerName: 'SAPTCO VIP Express',
    transportType: 'bus',
    originCode: 'JED',
    originName: 'Jeddah SAPTCO Station',
    originCity: 'Jeddah',
    originCountry: 'Saudi Arabia',
    originCountryCode: 'SA',
    destinationCode: 'MED',
    destinationName: 'Madinah SAPTCO Haram Terminal',
    destinationCity: 'Madinah',
    destinationCountry: 'Saudi Arabia',
    destinationCountryCode: 'SA',
    corridorName: 'Jeddah - Madinah Coastal Highway Corridor',
    stops: ['Rabigh', 'Badr'],
    distanceKm: 420,
    duration: '5h 00m',
    frequency: 'Every 2 Hours',
    fiatFare: 28.0,
    currency: 'USD',
    departureTimes: ['06:30', '08:30', '11:00', '14:00', '17:00', '20:30'],
    classOptions: [
      { id: 'saptco-med-std', name: 'Standard Coach', fiatPrice: 28.0, description: 'AC bus with hydration kit', badge: 'Popular' },
      { id: 'saptco-med-vip', name: 'VIP Luxury Express', fiatPrice: 48.0, description: 'VIP leather seating with lunch box', badge: 'VIP' }
    ]
  }
];

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
