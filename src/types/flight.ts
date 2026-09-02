export type TripType = 'one_way' | 'round_trip' | 'multi_city';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface AirportOption {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface FlightPassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchCriteria {
  origin: string;
  destination: string;
  tripType: TripType;
  departureDate: string;
  returnDate?: string;
  passengers: FlightPassengerCounts;
  cabinClass: CabinClass;
}

export interface FlightBaggageAllowance {
  cabinBaggage: string;
  checkedBaggage: string;
  additionalInfo?: string;
}

export interface FlightSegment {
  marketingAirline: string;
  operatingAirline?: string;
  flightNumber: string;
  aircraft?: string;
  originCode: string;
  originName?: string;
  destinationCode: string;
  destinationName?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cabinClass: CabinClass;
}

export interface FlightOffer {
  offerId: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  aircraft?: string;
  originCode: string;
  originCity?: string;
  destinationCode: string;
  destinationCity?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopAirports?: string[];
  cabinClass: CabinClass;
  baggage: FlightBaggageAllowance;
  fareAmountFiat: number;
  fareCurrency: string;
  fareAmountPi: number;
  baseFareFiat?: number;
  taxesAndFeesFiat?: number;
  seatsAvailable: number;
  fareConditions?: string;
  refundable?: boolean;
  isLive: boolean;
  bookingMode?: 'LIVE_DUFFEL' | 'VERIFIED_CARRIER';
  isLiveBooking?: boolean;
  providerName?: string;
  offerRequestId?: string;
  expiresAt?: string;
  searchTimestamp?: string;
  segments?: FlightSegment[];
}

export interface FlightPassengerDetails {
  id?: string;
  title?: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Alh.' | 'Hjy.';
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  email: string;
  phone: string;
}

export interface FlightBookingRecord {
  bookingId: string;
  pnr: string | null;
  bookingReference: string;
  ticketNumber: string | null;
  bookingStatus: 'TICKET_ISSUED' | 'VERIFIED_CARRIER_VOUCHER_ISSUED' | 'HELD_IN_ESCROW' | 'CANCELLED' | 'BOOKING_FAILED_HELD_FOR_REFUND';
  bookingMode?: 'LIVE_DUFFEL' | 'VERIFIED_CARRIER';
  isLiveBooking?: boolean;
  flightSummary: {
    airline: string;
    flightNumber: string;
    originCode: string;
    destinationCode: string;
    departureTime: string;
    arrivalTime: string;
    cabinClass: CabinClass;
  };
  passenger: FlightPassengerDetails;
  payment: {
    piPaymentId: string;
    piTxid?: string;
    piAmount: number;
    fiatAmount: number;
    fiatCurrency: string;
    piRateApplied: number;
    escrowProtected: boolean;
  };
  provider: string;
  issuedAt: string;
  eTicketUrl?: string;
  qrCodeData?: string;
  notice?: string;
}

export interface FlightConfigStatus {
  apiConfigured: boolean;
  provider: string;
  mode: 'live-duffel' | 'verified-carrier';
  baseUrl: string;
  message: string;
  reqId?: string;
}
