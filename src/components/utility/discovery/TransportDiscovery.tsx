import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  ArrowRight, 
  Calendar, 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  RefreshCw, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Lock 
} from 'lucide-react';
import { 
  UtilityServiceProvider, 
  TransportSearchCriteria, 
  TransportSearchResultItem, 
  PiConversionConfig 
} from '../../../types/utility';
import { 
  constructTransportSearchCriteria, 
  searchTransportRoutes 
} from '../../../lib/utility/serviceDiscovery';
import { FlightServicesHub } from '../../flight/FlightServicesHub';

export interface LiveFlightOffer {
  offerId: string;
  airline: string;
  flightNumber: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  aircraft: string;
  cabinClass: string;
  baggageAllowance: string;
  fareAmountFiat: number;
  currency: string;
  seatsAvailable: number;
  fareConditions: string;
  isLive: boolean;
}

interface TransportDiscoveryProps {
  providers: UtilityServiceProvider[];
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onSelectOption: (
    provider: UtilityServiceProvider,
    routeMeta: {
      originCode: string;
      destinationCode: string;
      fiatFare: number;
      piAmount: number;
      tripDetails: string;
      transportType: string;
      isLive?: boolean;
      offerId?: string;
      airline?: string;
      flightNumber?: string;
      departureTime?: string;
      arrivalTime?: string;
      passengerDetails?: {
        givenName: string;
        familyName: string;
        passportNumber?: string;
        email?: string;
        phone?: string;
      };
    }
  ) => void;
}

export const TransportDiscovery: React.FC<TransportDiscoveryProps> = ({
  providers,
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onSelectOption
}) => {
  const [transportType, setTransportType] = useState<'air' | 'rail' | 'bus'>('air');
  const [originInput, setOriginInput] = useState<string>('KAN');
  const [destinationInput, setDestinationInput] = useState<string>('JED');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [departureDate, setDepartureDate] = useState<string>(todayStr);
  const [returnDate, setReturnDate] = useState<string>('');
  
  const [adults, setAdults] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [infantsCount, setInfantsCount] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('economy');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [apiConfigured, setApiConfigured] = useState<boolean>(false);
  const [apiMessage, setApiMessage] = useState<string>('');
  
  const [liveFlightResults, setLiveFlightResults] = useState<LiveFlightOffer[]>([]);
  const [staticResults, setStaticResults] = useState<TransportSearchResultItem[]>([]);
  const [searchedProviders, setSearchedProviders] = useState<UtilityServiceProvider[]>([]);

  // Selected Option Pending Passenger Details Modal
  const [selectedPendingOption, setSelectedPendingOption] = useState<{
    provider: UtilityServiceProvider;
    offer?: LiveFlightOffer;
    staticItem?: TransportSearchResultItem;
    fiatFare: number;
    piFare: number;
  } | null>(null);

  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [revalidating, setRevalidating] = useState<boolean>(false);
  const [revalidateNote, setRevalidateNote] = useState<string>('');

  // Check backend Flight API status on load
  useEffect(() => {
    fetch('/api/flight/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.apiConfigured === 'boolean') {
          setApiConfigured(data.apiConfigured);
          setApiMessage(data.message || '');
        }
      })
      .catch(() => {
        setApiConfigured(false);
        setApiMessage('Live flight booking is currently unavailable. Showing verified carrier information only.');
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = originInput.trim().toUpperCase();
    const destination = destinationInput.trim().toUpperCase();
    if (!origin || !destination) return;

    setIsSearching(true);
    setHasSearched(false);
    setLiveFlightResults([]);
    setStaticResults([]);

    const criteria: TransportSearchCriteria = constructTransportSearchCriteria({
      transportType,
      originCode: origin,
      destinationCode: destination,
      departureDate,
      returnDate: tripType === 'round_trip' ? returnDate : undefined,
      tripType,
      passengers: { adults, children: childrenCount, infants: infantsCount },
      cabinClass
    });

    const staticRes = searchTransportRoutes(providers, criteria);
    setStaticResults(staticRes.results);
    setSearchedProviders(staticRes.matchingProviders);

    setIsSearching(false);
    setHasSearched(true);
  };

  const calculatePi = (fiatAmount: number): number => {
    if (!piConversionConfig || piConversionConfig.piRateUsd <= 0) return 0;
    return fiatAmount / piConversionConfig.piRateUsd;
  };

  const handleInitiateOptionSelect = async (
    provider: UtilityServiceProvider,
    fiatFare: number,
    piFare: number,
    offer?: LiveFlightOffer,
    staticItem?: TransportSearchResultItem
  ) => {
    setRevalidateNote('');
    setSelectedPendingOption({ provider, offer, staticItem, fiatFare, piFare });
  };

  const handleConfirmPassengerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendingOption) return;

    const { provider, offer, staticItem, fiatFare, piFare } = selectedPendingOption;

    const origin = originInput.trim().toUpperCase();
    const destination = destinationInput.trim().toUpperCase();

    const passengerDetails = {
      givenName: givenName.trim() || 'Pioneer',
      familyName: familyName.trim() || 'Traveler',
      passportNumber: passportNumber.trim(),
      email: email.trim(),
      phone: phone.trim()
    };

    let tripDetails = `${origin} -> ${destination} (${departureDate})`;
    if (offer) {
      tripDetails = `${offer.airline} ${offer.flightNumber}: ${origin} -> ${destination} (${departureDate})`;
    } else if (staticItem) {
      tripDetails = `${staticItem.providerName}: ${origin} -> ${destination} (${departureDate})`;
    }

    onSelectOption(provider, {
      originCode: origin,
      destinationCode: destination,
      fiatFare,
      piAmount: piFare,
      tripDetails,
      transportType,
      isLive: Boolean(offer?.isLive),
      offerId: offer?.offerId,
      airline: offer?.airline || provider.name,
      flightNumber: offer?.flightNumber,
      departureTime: offer?.departureTime,
      arrivalTime: offer?.arrivalTime,
      passengerDetails
    });

    setSelectedPendingOption(null);
  };

  return (
    <div className="space-y-5">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTransportType('air')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            transportType === 'air'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Plane className="w-4 h-4" />
          Airlines & Flight Services
        </button>
        <button
          type="button"
          onClick={() => setTransportType('rail')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            transportType === 'rail'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Train className="w-4 h-4" />
          Railway Transit Express
        </button>
        <button
          type="button"
          onClick={() => setTransportType('bus')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            transportType === 'bus'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          Inter-City Bus Lines
        </button>
      </div>

      {/* When Airlines is selected, render the dedicated FlightServicesHub */}
      {transportType === 'air' ? (
        <FlightServicesHub
          piConversionConfig={piConversionConfig}
          userBalancePi={userBalancePi}
          buyerUsername={buyerUsername}
          onSelectOptionForUtility={(provider, routeMeta) => {
            const piFare = calculatePi(routeMeta.fiatFare);
            onSelectOption(provider, {
              ...routeMeta,
              piAmount: piFare,
              transportType: 'air'
            });
          }}
        />
      ) : (
        /* Rail and Bus Search Form */
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-300">
                {transportType === 'rail' ? 'Railway Express Pass Booking' : 'Inter-City Coach Booking'}
              </span>
              <span className="text-xs text-slate-400">PSTP Escrow Guaranteed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Origin Station / Terminal
                </label>
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value.toUpperCase())}
                  placeholder="e.g. KAN (Kano) or ABV (Abuja)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Destination Station / Terminal
                </label>
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value.toUpperCase())}
                  placeholder="e.g. LOS (Lagos) or KAD (Kaduna)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Class / Seat Type</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="economy">Standard Economy</option>
                  <option value="business">First / VIP Executive Class</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-xs"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Searching Route Schedules...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Route Schedules ({originInput} ➔ {destinationInput})</span>
                </>
              )}
            </button>
          </form>

          {/* Results for Rail/Bus */}
          {hasSearched && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Available Scheduled Passes ({staticResults.length})
                </h4>
                <span className="text-[11px] text-slate-400">
                  Route: <strong className="text-white">{originInput}</strong> ➔ <strong className="text-white">{destinationInput}</strong>
                </span>
              </div>

              {staticResults.length > 0 ? (
                <div className="space-y-2.5">
                  {staticResults.map((item, index) => {
                    const provider = searchedProviders.find((p) => p.id === item.providerId) || searchedProviders[index] || providers[0];
                    const piFare = calculatePi(item.fiatFare);

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                            {transportType === 'rail' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">
                                {item.providerName}
                              </h5>
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-bold border border-purple-500/30">
                                VERIFIED CARRIER
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{item.originCode}</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span>{item.destinationCode}</span>
                              <span className="text-slate-600">•</span>
                              <span className="capitalize">{cabinClass} Pass</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                          <div className="text-right">
                            <div className="text-sm font-black text-amber-400 font-mono">
                              π {piFare.toFixed(4)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              ~${item.fiatFare.toFixed(2)} USD
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleInitiateOptionSelect(provider, item.fiatFare, piFare, undefined, item)}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-1"
                          >
                            Select
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                  <p className="text-sm text-slate-300 font-semibold">No direct carrier options found</p>
                  <p className="text-xs text-slate-400">
                    Try searching major hub routes such as Kano, Lagos, Abuja, or Kaduna.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Passenger details modal for Rail/Bus */}
          {selectedPendingOption && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <h4 className="text-base font-bold">Passenger Details & Transit Pass</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPendingOption(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleConfirmPassengerDetails} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">First / Given Name *</label>
                      <input
                        type="text"
                        required
                        value={givenName}
                        onChange={(e) => setGivenName(e.target.value)}
                        placeholder="e.g. Ibrahim"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Last / Family Name *</label>
                      <input
                        type="text"
                        required
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        placeholder="e.g. Bello"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+2348000000000"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="traveler@pinova.hub"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block">Total Transit Fare:</span>
                      <span className="text-amber-400 font-black text-sm font-mono">π {selectedPendingOption.piFare.toFixed(4)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Fiat Equivalent:</span>
                      <span className="text-white font-bold">${selectedPendingOption.fiatFare.toFixed(2)} USD</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Proceed to Review & Pay with Pi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

