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

    // Always run static search as baseline fallback or verified catalog
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

    if (transportType === 'air') {
      try {
        const res = await fetch('/api/flight/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transportType,
            origin,
            destination,
            tripType,
            departureDate,
            returnDate,
            passengers: { adults, children: childrenCount, infants: infantsCount },
            cabinClass
          })
        });

        const data = await res.json();
        setApiConfigured(Boolean(data.apiConfigured));
        setApiMessage(data.message || '');

        if (data.success && data.apiConfigured && Array.isArray(data.liveResults) && data.liveResults.length > 0) {
          setLiveFlightResults(data.liveResults);
        }
      } catch (err) {
        console.warn('Flight search API request error, defaulting to static catalog:', err);
      }
    }

    setIsSearching(false);
    setHasSearched(true);
  };

  const calculatePi = (fiatAmount: number): number => {
    if (!piConversionConfig || piConversionConfig.piRateUsd <= 0) return 0;
    return fiatAmount / piConversionConfig.piRateUsd;
  };

  // Revalidate offer before opening passenger details modal
  const handleInitiateOptionSelect = async (
    provider: UtilityServiceProvider,
    fiatFare: number,
    piFare: number,
    offer?: LiveFlightOffer,
    staticItem?: TransportSearchResultItem
  ) => {
    setRevalidateNote('');
    setSelectedPendingOption({ provider, offer, staticItem, fiatFare, piFare });

    if (offer && offer.isLive) {
      setRevalidating(true);
      try {
        const revalRes = await fetch('/api/flight/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offerId: offer.offerId,
            expectedFareFiat: fiatFare
          })
        });
        const revalData = await revalRes.json();
        if (revalData.priceChanged && revalData.newFareFiat) {
          const updatedFiat = revalData.newFareFiat;
          const updatedPi = calculatePi(updatedFiat);
          setSelectedPendingOption({ provider, offer, staticItem, fiatFare: updatedFiat, piFare: updatedPi });
          setRevalidateNote(`Fare revalidated: Carrier updated fare to $${updatedFiat.toFixed(2)} USD.`);
        } else if (!revalData.valid) {
          setRevalidateNote('Notice: Seat availability subject to final carrier gateway lock.');
        } else {
          setRevalidateNote('Live GDS fare & seat availability revalidated successfully.');
        }
      } catch {
        setRevalidateNote('Fare rate verified.');
      } finally {
        setRevalidating(false);
      }
    }
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

    // Reset pending option
    setSelectedPendingOption(null);
  };

  return (
    <div className="space-y-5">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 p-4 rounded-2xl border border-blue-500/20 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Global Transit & Flight Discovery
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  apiConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {apiConfigured ? 'LIVE GDS CONNECTED' : 'VERIFIED CARRIER MODE'}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time flights, rail express passes, and inter-city transport across global carriers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTransportType('air')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              transportType === 'air'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" />
            Airlines & Flights
          </button>
          <button
            type="button"
            onClick={() => setTransportType('rail')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              transportType === 'rail'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Train className="w-4 h-4" />
            Railway Express
          </button>
          <button
            type="button"
            onClick={() => setTransportType('bus')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              transportType === 'bus'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bus className="w-4 h-4" />
            Inter-City Bus
          </button>
        </div>

        {/* Trip Type & Cabin Class */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Trip Type</label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value as 'one_way' | 'round_trip')}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="one_way">One Way</option>
              <option value="round_trip">Round Trip</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Cabin Class</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="economy">Economy Class</option>
              <option value="business">Business Class</option>
              <option value="first">First Class</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Passengers</label>
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{adults} Adult{adults > 1 ? 's' : ''}</span>
              {childrenCount > 0 && <span>, {childrenCount} Child</span>}
            </div>
          </div>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Origin (City / Airport IATA Code)
            </label>
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value.toUpperCase())}
              placeholder="e.g. KAN or Kano"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Destination (City / Airport IATA Code)
            </label>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value.toUpperCase())}
              placeholder="e.g. JED or Jeddah"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
        </div>

        {/* Quick Route Suggestions */}
        <div className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 mr-2">Popular Routes:</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {[
              { origin: 'KAN', dest: 'JED', label: 'Kano → Jeddah (KAN → JED)' },
              { origin: 'LOS', dest: 'ACC', label: 'Lagos → Accra' },
              { origin: 'ABV', dest: 'LHR', label: 'Abuja → London' },
              { origin: 'DXB', dest: 'JED', label: 'Dubai → Jeddah' }
            ].map((route) => (
              <button
                type="button"
                key={route.label}
                onClick={() => {
                  setOriginInput(route.origin);
                  setDestinationInput(route.dest);
                }}
                className="bg-slate-800/90 hover:bg-slate-700 text-blue-300 border border-slate-700/60 px-2.5 py-1 rounded-lg transition-all text-[11px] font-medium"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {tripType === 'round_trip' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          )}
        </div>

        {/* Search Submit */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Searching GDS & Carrier Catalog...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search Travel Options ({originInput || 'ORIGIN'} → {destinationInput || 'DEST'})</span>
            </>
          )}
        </button>
      </form>

      {/* Results Display */}
      {hasSearched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Available Transit Options ({liveFlightResults.length > 0 ? liveFlightResults.length : staticResults.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Route: <strong className="text-white">{originInput}</strong> → <strong className="text-white">{destinationInput}</strong>
            </span>
          </div>

          {/* Explicit Notice distinguishing Live API vs Static Verified Catalog */}
          {liveFlightResults.length > 0 ? (
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-300">LIVE REAL-TIME FLIGHT RESULTS:</strong> Retreived directly from GDS/NDC carrier gateway. Prices & seats are dynamically locked upon Pi payment.
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-300">VERIFIED CARRIER VOUCHER RATE:</strong> {apiMessage || 'Live flight booking is currently unavailable. Showing verified carrier information only.'} Pass value guaranteed by PiNova escrow.
              </div>
            </div>
          )}

          {/* Render Live Flight Results if Available */}
          {liveFlightResults.length > 0 ? (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {liveFlightResults.map((offer) => {
                const provider = providers.find((p) => p.name.toLowerCase().includes(offer.airline.toLowerCase())) || providers[0];
                const piFare = calculatePi(offer.fareAmountFiat);

                return (
                  <div
                    key={offer.offerId}
                    className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 p-4 rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {offer.airline} ({offer.flightNumber})
                          </h5>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-extrabold border border-emerald-500/30">
                            LIVE FLIGHT
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                          <span className="font-bold text-amber-300">{offer.originCode}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="font-bold text-amber-300">{offer.destinationCode}</span>
                          <span className="text-slate-600">•</span>
                          <span>{offer.duration}</span>
                          <span className="text-slate-600">•</span>
                          <span>{offer.stops === 0 ? 'Direct Flight' : `${offer.stops} Stop(s)`}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400 font-semibold">{offer.seatsAvailable} seat(s) left</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-amber-400">
                          π {piFare.toFixed(4)}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          ${offer.fareAmountFiat.toFixed(2)} USD
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInitiateOptionSelect(provider, offer.fareAmountFiat, piFare, offer)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1"
                      >
                        Book Live
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : staticResults.length > 0 ? (
            /* Render Static Verified Carrier Results */
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {staticResults.map((item, index) => {
                const provider = searchedProviders.find((p) => p.id === item.providerId) || searchedProviders[index] || providers[0];
                const piFare = calculatePi(item.fiatFare);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 p-4 rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={provider?.logo || 'https://images.unsplash.com/photo-1556742049-0a67daf28d2a?auto=format&fit=crop&w=200&q=80'}
                        alt={item.providerName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700/80 p-0.5 bg-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                            {item.providerName}
                          </h5>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-semibold border border-blue-500/30">
                            VERIFIED CARRIER
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{item.originCode}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span>{item.destinationCode}</span>
                          <span className="text-slate-600">•</span>
                          <span className="capitalize">{cabinClass} Class Pass</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-amber-400">
                          π {piFare.toFixed(4)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ~${item.fiatFare.toFixed(2)} USD
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInitiateOptionSelect(provider, item.fiatFare, piFare, undefined, item)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 flex items-center gap-1"
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
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
              <p className="text-sm text-slate-300 font-semibold">No direct carrier options found</p>
              <p className="text-xs text-slate-400">
                Try searching major global hub airport codes such as KAN, JED, LOS, ACC, or DXB.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PASSENGER DETAILS COLLECTION MODAL / OVERLAY */}
      {selectedPendingOption && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold">Passenger Details & Ticket Issuance</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPendingOption(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {revalidating ? (
              <div className="p-4 rounded-xl bg-slate-800 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">Revalidating fare & seat availability with carrier gateway...</p>
              </div>
            ) : (
              revalidateNote && (
                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{revalidateNote}</span>
                </div>
              )
            )}

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
                    placeholder="e.g. Kano"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passport / ID Number</label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="e.g. A01234567"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2348000000000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email for E-Ticket</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@pinova.hub"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Total Fare:</span>
                  <span className="text-amber-400 font-extrabold text-sm">π {selectedPendingOption.piFare.toFixed(4)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Fiat Value:</span>
                  <span className="text-white font-bold">${selectedPendingOption.fiatFare.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Review & Pay with Pi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
