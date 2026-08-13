export type UtilityCategoryType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'internet'
  | 'water'
  | 'exam'
  | 'education'
  | 'giftcard'
  | 'voucher'
  | 'betting'
  | 'gaming'
  | 'streaming'
  | 'insurance'
  | 'government'
  | 'transport'
  | 'events'
  | 'ecommerce';

export interface UtilityProviderPackage {
  id: string;
  name: string;
  description: string;
  fiatPrice: number;
  currency: string; // e.g. USD, NGN, KSh, EUR
  validity?: string; // e.g. 30 Days, Instant, Lifetime
  badge?: string; // e.g. Popular, Best Value, Hot
}

export interface UtilityServiceProvider {
  id: string;
  name: string;
  category: UtilityCategoryType;
  logo: string;
  country: string;
  countryCode?: string;
  dialCode?: string;
  supportsCustomAmount: boolean;
  supportsFixedPackages: boolean;
  accountLabel: string; // e.g. "Phone Number", "Meter Number", "IUC / Smartcard Number", "Customer Ref ID"
  accountPlaceholder: string;
  accountValidationRegex?: string;
  minCustomFiat?: number;
  maxCustomFiat?: number;
  currency: string; // e.g. "USD"
  enabled: boolean;
  hasDirectValidationApi?: boolean;
  designations?: string[];
  packages: UtilityProviderPackage[];

  // --- Phase 2 Service Discovery Schema Extensions (Optional) ---
  state?: string;
  region?: string;
  city?: string;
  lga?: string; // Local Government Area
  jurisdictionLevel?: 'national' | 'state' | 'municipal' | 'regional' | 'global';

  // Agency / Government Metadata
  agencyType?: 'federal' | 'state' | 'municipal' | 'statutory_board' | 'private';
  serviceType?: string;
  serviceCode?: string;
  referenceType?: string; // e.g. "RRR", "Taxpayer ID", "License Ref", "Meter No"

  // Education / Institution Metadata
  institutionType?: 'university' | 'polytechnic' | 'college' | 'exam_board' | 'e_learning' | 'secondary';
  institutionCode?: string;
  institutionName?: string;
  institutionAliases?: string[];
  serviceTypes?: string[];

  // Transport & Travel Metadata
  transportType?: 'air' | 'rail' | 'bus' | 'ferry' | 'transit_card';
  origin?: string;
  destination?: string;
  originCode?: string; // IATA (e.g. "KAN", "JED", "LOS") or Terminal Code
  destinationCode?: string; // IATA or Terminal Code
  route?: TransportRouteDetails;
  supportsLiveSearch?: boolean;
}

// ==========================================
// Phase 2 Service Discovery Data Models
// ==========================================

export interface TransportRouteDetails {
  originName: string;
  originCode: string;
  originCity: string;
  originCountry: string;
  destinationName: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  frequency?: string; // e.g. "Daily", "Mon, Wed, Fri"
  operatingCarriers?: string[];
}

export interface TransportSearchCriteria {
  transportType?: 'air' | 'rail' | 'bus' | 'ferry' | 'transit_card' | 'all';
  originCode: string; // e.g. "KAN"
  destinationCode: string; // e.g. "JED"
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  tripType: 'one_way' | 'round_trip';
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  countryCode?: string;
}

export interface TransportSearchResultItem {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  transportType: 'air' | 'rail' | 'bus' | 'ferry' | 'transit_card';
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  departureTime?: string;
  arrivalTime?: string;
  flightOrTripNumber?: string;
  fiatFare: number;
  currency: string;
  badge?: string;
  isAvailable: boolean;
  notes?: string;
}

export interface TransportSearchResult {
  criteria: TransportSearchCriteria;
  results: TransportSearchResultItem[];
  matchingProviders: UtilityServiceProvider[];
  totalFound: number;
  message?: string;
}

export interface LocationDiscoveryCriteria {
  category: UtilityCategoryType;
  countryCode: string; // e.g. "NG", "SA", "US", "GLOBAL"
  state?: string;
  region?: string;
  city?: string;
  lga?: string;
}

export interface LocationDiscoveryResult {
  countryCode: string;
  countryName: string;
  state?: string;
  city?: string;
  availableProviders: UtilityServiceProvider[];
  hasVerifiedService: boolean;
  statusMessage: string;
}

export interface InstitutionSearchCriteria {
  countryCode?: string;
  state?: string;
  searchQuery?: string; // e.g. "Bayero"
  institutionType?: 'university' | 'polytechnic' | 'college' | 'exam_board' | 'e_learning' | 'secondary' | 'all';
}

export interface InstitutionSearchResultItem {
  providerId: string;
  institutionName: string;
  institutionCode?: string;
  institutionType: string;
  country: string;
  countryCode: string;
  state?: string;
  availableServices: string[];
  matchedAliases?: string[];
  packages: UtilityProviderPackage[];
}

export interface InstitutionSearchResult {
  criteria: InstitutionSearchCriteria;
  institutions: InstitutionSearchResultItem[];
  totalMatches: number;
}

export interface GovernmentSearchCriteria {
  countryCode: string;
  jurisdictionLevel?: 'national' | 'state' | 'municipal' | 'all';
  state?: string;
  agencyType?: 'federal' | 'state' | 'municipal' | 'statutory_board' | 'private' | 'all';
  searchQuery?: string;
}

export interface GovernmentSearchResultItem {
  providerId: string;
  agencyName: string;
  agencyType: string;
  country: string;
  countryCode: string;
  state?: string;
  referenceLabel: string;
  availableServices: string[];
  packages: UtilityProviderPackage[];
  hasDirectValidationApi: boolean;
}

export interface GovernmentSearchResult {
  criteria: GovernmentSearchCriteria;
  agencies: GovernmentSearchResultItem[];
  totalFound: number;
}

export interface GenericServiceDiscoveryRequest {
  category: UtilityCategoryType;
  countryCode: string;
  state?: string;
  region?: string;
  city?: string;
  lga?: string;
  searchQuery?: string;
  serviceType?: string;
  providerId?: string;
  transportParams?: TransportSearchCriteria;
  institutionParams?: InstitutionSearchCriteria;
  governmentParams?: GovernmentSearchCriteria;
}

export interface GenericServiceDiscoveryResult {
  request: GenericServiceDiscoveryRequest;
  matchingProviders: UtilityServiceProvider[];
  locationResult?: LocationDiscoveryResult;
  transportResult?: TransportSearchResult;
  institutionResult?: InstitutionSearchResult;
  governmentResult?: GovernmentSearchResult;
  isSupported: boolean;
  statusMessage: string;
}

export interface PiConversionConfig {
  piRateUsd: number; // e.g. 314159.00 ($314,159.00 USD per 1 Pi)
  minPurchasePi: number; // e.g. 0.05 Pi
  maxPurchasePi: number; // e.g. 1000.00 Pi
  currencyCode: string; // "USD"
  currencySymbol: string; // "$"
  autoRateUpdateEnabled: boolean;
  autoUpdateSource?: string; // e.g. "Pi Market Index Oracle API"
  lastUpdated: string;
  updatedBy: string;
}

export interface ConversionRateLog {
  id: string;
  previousRateUsd: number;
  newRateUsd: number;
  reason: string;
  updatedBy: string;
  timestamp: string;
}

export interface AccountValidationResult {
  valid: boolean;
  accountName?: string;
  accountNumber: string;
  providerId: string;
  statusMessage: string;
  details?: Record<string, any>;
}

export interface UtilityTransactionReceipt {
  transactionId: string;
  piPaymentId?: string;
  piTxid?: string;
  category: UtilityCategoryType;
  providerId: string;
  providerName: string;
  accountNumber: string;
  accountName?: string;
  fiatAmount: number;
  fiatCurrency: string;
  appliedPiRateUsd: number;
  piAmount: number;
  packageName?: string;
  tokenOrCode?: string; // e.g. Electricity Recharge Token, WAEC PIN, Voucher Code
  serialNumber?: string;
  status: 'SUCCESS' | 'PROCESSING' | 'FAILED' | 'REFUNDED';
  timestamp: string;
  orderProtectionGuaranteed: boolean;
  buyerUsername: string;
}
