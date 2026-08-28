import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  RefreshCw, 
  Compass, 
  Layers,
  Globe
} from 'lucide-react';
import { FlightSearchCriteria, FlightOffer, FlightConfigStatus, FlightBookingRecord } from '../../types/flight';
import { PiConversionConfig, UtilityServiceProvider } from '../../types/utility';
import { fetchFlightConfig, searchFlights } from '../../modules/flight';
import { FlightSearchForm } from './FlightSearchForm';
import { FlightResultsList } from './FlightResultsList';
import { FlightBookingModal } from './FlightBookingModal';
import { generateVerifiedCarrierOffers } from '../../data/flightData';

interface FlightServicesHubProps {
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onBookingSuccess?: (booking: FlightBookingRecord) => void;
  onSelectOptionForUtility?: (
    provider: UtilityServiceProvider,
    routeMeta: {
      originCode: string;
      destinationCode: string;
      tripDetails: string;
      fiatFare: number;
      passengerDetails?: any;
    }
  ) => void;
  initialOrigin?: string;
  initialDestination?: string;
  initialDepartureDate?: string;
}

export const FlightServicesHub: React.FC<FlightServicesHubProps> = ({
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onBookingSuccess,
  onSelectOptionForUtility,
  initialOrigin = 'KAN',
  initialDestination = 'JED',
  initialDepartureDate = '2026-08-31'
}) => {
  // Backend config status
  const [flightConfig, setFlightConfig] = useState<FlightConfigStatus>({
    apiConfigured: false,
    provider: 'duffel',
    mode: 'verified-carrier',
    baseUrl: 'https://api.duffel.com',
    message: 'Connecting to Flight Provider API...'
  });

  // Search State
  const [currentCriteria, setCurrentCriteria] = useState<FlightSearchCriteria>({
    origin: initialOrigin,
    destination: initialDestination,
    tripType: 'one_way',
    departureDate: initialDepartureDate,
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'economy'
  });

  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Booking Modal State
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<FlightOffer | null>(null);

  // Initialize Flight Config & Initial Search
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const cfg = await fetchFlightConfig();
      if (isMounted) {
        setFlightConfig(cfg);
        // Execute initial search for default route
        executeSearch(currentCriteria, cfg.apiConfigured);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const executeSearch = async (criteria: FlightSearchCriteria, isConfigured: boolean = flightConfig.apiConfigured) => {
    setIsSearching(true);
    setIsError(false);
    setErrorMessage(null);
    setCurrentCriteria(criteria);

    try {
      const result = await searchFlights(criteria, piConversionConfig.piRateUsd);
      setOffers(result.offers);
      setFlightConfig((prev) => ({
        ...prev,
        apiConfigured: result.apiConfigured,
        message: result.message
      }));
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || 'Failed to search flight routes.');
      // Generate fallback offers
      const fallbacks = generateVerifiedCarrierOffers(
        criteria.origin,
        criteria.destination,
        criteria.departureDate,
        criteria.cabinClass,
        piConversionConfig.piRateUsd
      );
      setOffers(fallbacks);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOffer = (offer: FlightOffer) => {
    // If a utility callback is supplied, bridge it back to FlexibleUtilityModal or open BookingModal
    if (onSelectOptionForUtility) {
      const dummyProvider: UtilityServiceProvider = {
        id: `flight_${offer.airline.toLowerCase().replace(/\s+/g, '_')}`,
        name: offer.airline,
        category: 'transport',
        logo: offer.airlineLogo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
        country: 'Global',
        countryCode: 'GLOBAL',
        currency: 'USD',
        enabled: true,
        supportsCustomAmount: true,
        supportsFixedPackages: false,
        accountLabel: 'Passenger ID / Passport',
        accountPlaceholder: 'Enter Passenger Passport or ID Number',
        packages: [],
        designations: [
          `${offer.originCode} ➔ ${offer.destinationCode} (${offer.flightNumber}) - ${offer.cabinClass}`
        ]
      };

      onSelectOptionForUtility(dummyProvider, {
        originCode: offer.originCode,
        destinationCode: offer.destinationCode,
        tripDetails: `${offer.airline} (${offer.flightNumber}) ${offer.originCode}➔${offer.destinationCode} [${offer.cabinClass}]`,
        fiatFare: offer.fareAmountFiat
      });
    }

    // Also open the dedicated booking modal for immediate direct Pi booking
    setSelectedOfferForBooking(offer);
  };

  return (
    <div className="space-y-6">
      
      {/* Flight Search Form */}
      <FlightSearchForm
        onSearch={(criteria) => executeSearch(criteria)}
        isSearching={isSearching}
        apiConfigured={flightConfig.apiConfigured}
        apiMessage={flightConfig.message}
        initialCriteria={currentCriteria}
      />

      {/* Flight Results List */}
      <FlightResultsList
        offers={offers}
        isLoading={isSearching}
        isError={isError}
        errorMessage={errorMessage}
        searchCriteria={currentCriteria}
        onSelectOffer={handleSelectOffer}
        onRetry={() => executeSearch(currentCriteria)}
        piRateUsd={piConversionConfig.piRateUsd}
      />

      {/* Direct Booking & E-Ticket Modal */}
      {selectedOfferForBooking && (
        <FlightBookingModal
          offer={selectedOfferForBooking}
          piRateUsd={piConversionConfig.piRateUsd}
          userBalancePi={userBalancePi}
          buyerUsername={buyerUsername}
          onClose={() => setSelectedOfferForBooking(null)}
          onBookingSuccess={(booking) => {
            if (onBookingSuccess) {
              onBookingSuccess(booking);
            }
          }}
        />
      )}

    </div>
  );
};
