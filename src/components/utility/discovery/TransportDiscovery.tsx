import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  ArrowRight, 
  ArrowLeftRight,
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
  Lock,
  Globe,
  MapPin,
  Compass,
  Check
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
  selectedCountryCode?: string;
  initialState?: string;
  onCountryChange?: (countryCode: string) => void;
  onStateChange?: (stateName: string) => void;
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
        title?: string;
        givenName: string;
        familyName: string;
        passportNumber?: string;
        email?: string;
        phone?: string;
        coachClass?: string;
      };
    }
  ) => void;
}

const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  NG: { name: 'Nigeria', flag: '🇳🇬' },
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦' },
  AE: { name: 'United Arab Emirates', flag: '🇦🇪' },
  KE: { name: 'Kenya', flag: '🇰🇪' },
  GH: { name: 'Ghana', flag: '🇬🇭' },
  ZA: { name: 'South Africa', flag: '🇿🇦' },
  IN: { name: 'India', flag: '🇮🇳' },
  PH: { name: 'Philippines', flag: '🇵🇭' },
  ID: { name: 'Indonesia', flag: '🇮🇩' },
  VN: { name: 'Vietnam', flag: '🇻🇳' }
};

export const TransportDiscovery: React.FC<TransportDiscoveryProps> = ({
  providers,
  selectedCountryCode = 'NG',
  initialState = '',
  onCountryChange,
  onStateChange,
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onSelectOption
}) => {
  const [transportType, setTransportType] = useState<'air' | 'rail' | 'bus'>('air');
  
  // Journey Route state - strictly decoupled from Service Location
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
  
  const [staticResults, setStaticResults] = useState<TransportSearchResultItem[]>([]);
  const [searchedProviders, setSearchedProviders] = useState<UtilityServiceProvider[]>([]);

  // Selected Option Pending Passenger Details Modal
  const [selectedPendingOption, setSelectedPendingOption] = useState<{
    provider: UtilityServiceProvider;
    staticItem?: TransportSearchResultItem;
    fiatFare: number;
    piFare: number;
  } | null>(null);

  // Passenger state
  const [passengerTitle, setPassengerTitle] = useState<'Mr' | 'Mrs' | 'Ms' | 'Dr'>('Mr');
  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // Service Location Context
  const activeCountryCode = selectedCountryCode.toUpperCase();
  const activeCountry = COUNTRY_NAMES[activeCountryCode] || { name: activeCountryCode, flag: '🌐' };

  // Mode-change sensible route defaults
  const handleModeChange = (newMode: 'air' | 'rail' | 'bus') => {
    setTransportType(newMode);
    setHasSearched(false);
    setStaticResults([]);

    if (newMode === 'air') {
      setOriginInput('KAN');
      setDestinationInput('JED');
    } else if (newMode === 'rail') {
      setOriginInput('ABV');
      setDestinationInput('KAD');
    } else if (newMode === 'bus') {
      setOriginInput('LOS');
      setDestinationInput('ABV');
    }
  };

  const handleSwapStations = () => {
    const temp = originInput;
    setOriginInput(destinationInput);
    setDestinationInput(temp);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = originInput.trim().toUpperCase();
    const destination = destinationInput.trim().toUpperCase();
    if (!origin || !destination) return;

    setIsSearching(true);
    setHasSearched(false);
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
    const rate = piConversionConfig?.piRateUsd > 0 ? piConversionConfig.piRateUsd : 10.0;
    const raw = typeof fiatAmount === 'number' && Number.isFinite(fiatAmount) && fiatAmount > 0 ? fiatAmount : 25.0;
    return Number((raw / rate).toFixed(4));
  };

  const handleInitiateOptionSelect = (
    provider: UtilityServiceProvider,
    fiatFare: number,
    piFare: number,
    staticItem?: TransportSearchResultItem
  ) => {
    const cleanFare = typeof fiatFare === 'number' && Number.isFinite(fiatFare) && fiatFare > 0 ? fiatFare : 25.0;
    setSelectedPendingOption({ 
      provider, 
      staticItem, 
      fiatFare: Number(cleanFare.toFixed(2)), 
      piFare 
    });
  };

  const handleConfirmPassengerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendingOption) return;

    const { provider, staticItem, fiatFare, piFare } = selectedPendingOption;

    const origin = originInput.trim().toUpperCase();
    const destination = destinationInput.trim().toUpperCase();

    const passengerDetails = {
      title: passengerTitle,
      givenName: givenName.trim() || 'Pioneer',
      familyName: familyName.trim() || 'Traveler',
      passportNumber: passportNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      coachClass: cabinClass
    };

    const tripDetails = staticItem 
      ? `${staticItem.providerName}: ${origin} ➔ ${destination} (${departureDate})`
      : `${provider.name}: ${origin} ➔ ${destination} (${departureDate})`;

    const safeFiat = typeof fiatFare === 'number' && Number.isFinite(fiatFare) && fiatFare > 0 ? Number(fiatFare.toFixed(2)) : 25.0;

    onSelectOption(provider, {
      originCode: origin,
      destinationCode: destination,
      fiatFare: safeFiat,
      piAmount: piFare,
      tripDetails,
      transportType,
      airline: provider.name,
      flightNumber: staticItem?.flightNumber || `EXP-${Math.floor(100 + Math.random() * 900)}`,
      departureTime: staticItem?.departureTime || `${departureDate}T08:30:00Z`,
      arrivalTime: staticItem?.arrivalTime || `${departureDate}T11:45:00Z`,
      passengerDetails
    });

    setSelectedPendingOption(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SERVICE LOCATION CONTEXT (DECOUPLED FROM JOURNEY ROUTE) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-purple-500/20 text-purple-400">
                <Globe className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Service Location & Regional Billing Context
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                Local Billing
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Your service location defines your local currency settlement and utility partner network. 
              <strong className="text-slate-300"> Your travel journey route (Departure ➔ Arrival) is completely global and independent.</strong>
            </p>
          </div>

          {/* Active Service Location Tag */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-extrabold text-white shadow-inner">
              <span className="text-base leading-none">{activeCountry.flag}</span>
              <span>{activeCountry.name}</span>
              {initialState && <span className="text-purple-400">• {initialState}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TRANSPORT MODE TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleModeChange('air')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            transportType === 'air'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Airlines & Flight Services</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 font-bold">
            Live GDS
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('rail')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            transportType === 'rail'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Railway Transit Express</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-bold">
            InterCity
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('bus')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
            transportType === 'bus'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Inter-City Bus Lines</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold">
            Coach VIP
          </span>
        </button>
      </div>

      {/* 3. AIR MODE: Dedicated Flight Services Hub */}
      {transportType === 'air' ? (
        <FlightServicesHub
          piConversionConfig={piConversionConfig}
          userBalancePi={userBalancePi}
          buyerUsername={buyerUsername}
          initialOrigin={originInput}
          initialDestination={destinationInput}
          onSelectOptionForUtility={(provider, routeMeta) => {
            const safeFiat = typeof routeMeta.fiatFare === 'number' && Number.isFinite(routeMeta.fiatFare) && routeMeta.fiatFare > 0
              ? Number(routeMeta.fiatFare.toFixed(2))
              : 100.0;
            const piFare = calculatePi(safeFiat);

            onSelectOption(provider, {
              ...routeMeta,
              fiatFare: safeFiat,
              piAmount: piFare,
              transportType: 'air'
            });
          }}
        />
      ) : (
        /* 4. RAIL & BUS MODES: Dedicated Route Search & Booking Experience */
        <div className="space-y-5">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-xl ${transportType === 'rail' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {transportType === 'rail' ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                </span>
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  {transportType === 'rail' ? 'Railway Express Pass Booking' : 'Inter-City Coach Schedule & Booking'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                PSTP Escrow Protected
              </span>
            </div>

            {/* Origin & Destination Inputs with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Origin Station / Terminal *
                </label>
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value.toUpperCase())}
                  placeholder={transportType === 'rail' ? 'e.g. Origin Station or City' : 'e.g. Origin Bus Terminal'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  title="Swap Origin and Destination"
                  className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors shadow"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Destination Station / Terminal *
                </label>
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value.toUpperCase())}
                  placeholder={transportType === 'rail' ? 'e.g. Destination Station or City' : 'e.g. Destination Bus Terminal'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Journey Parameters: Date, Trip Type, Passengers, Class */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Departure Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Trip Type</label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="one_way">One Way</option>
                  <option value="round_trip">Round Trip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  Passengers
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>1 Passenger (Adult)</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Class / Seat Type</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="economy">Standard Economy</option>
                  <option value="business">First / Executive VIP</option>
                  <option value="first">Sleeper / Royal Cabin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className={`w-full text-white font-black py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${
                transportType === 'rail'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
              }`}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Searching Route Schedules...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Verified {transportType === 'rail' ? 'Train' : 'Bus'} Routes ({originInput} ➔ {destinationInput})</span>
                </>
              )}
            </button>
          </form>

          {/* Results List */}
          {hasSearched && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Available Route Schedules</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                    {staticResults.length} options
                  </span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Route: <strong className="text-white">{originInput}</strong> ➔ <strong className="text-white">{destinationInput}</strong>
                </span>
              </div>

              {staticResults.length > 0 ? (
                <div className="space-y-3">
                  {staticResults.map((item, index) => {
                    const provider = searchedProviders.find((p) => p.id === item.providerId) || searchedProviders[index] || providers[0];
                    const safeFare = typeof item.fiatFare === 'number' && Number.isFinite(item.fiatFare) && item.fiatFare > 0 ? item.fiatFare : 25.0;
                    const piFare = calculatePi(safeFare);

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-4 sm:p-5 rounded-3xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-md"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                            transportType === 'rail'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {transportType === 'rail' ? <Train className="w-6 h-6" /> : <Bus className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                                {item.providerName}
                              </h5>
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-500/30">
                                VERIFIED OPERATOR
                              </span>
                            </div>
                            <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                              <span className="font-bold text-white">{item.originCode}</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span className="font-bold text-white">{item.destinationCode}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-purple-300 capitalize">{cabinClass} Class</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{item.duration || 'Direct Express'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-0 border-slate-800">
                          <div className="text-right">
                            <div className="text-base font-black text-amber-400 font-mono">
                              {piFare.toFixed(4)} π
                            </div>
                            <div className="text-[11px] text-slate-400">
                              ≈ ${safeFare.toFixed(2)} USD
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleInitiateOptionSelect(provider, safeFare, piFare, item)}
                            className={`font-black px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center gap-1.5 ${
                              transportType === 'rail'
                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                            }`}
                          >
                            <span>Book Pass</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
                  <p className="text-sm text-slate-200 font-bold">No direct carrier scheduled routes found for {originInput} ➔ {destinationInput}</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try searching with alternative station codes or major transit terminals.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Passenger Details Modal for Rail/Bus */}
          {selectedPendingOption && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                      <User className="w-4 h-4" />
                    </span>
                    <h4 className="text-base font-black">Passenger Details & Transit Pass</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPendingOption(null)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-xl bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleConfirmPassengerDetails} className="space-y-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                      <select
                        value={passengerTitle}
                        onChange={(e) => setPassengerTitle(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Dr">Dr.</option>
                      </select>
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Given Name *</label>
                      <input
                        type="text"
                        required
                        value={givenName}
                        onChange={(e) => setGivenName(e.target.value)}
                        placeholder="e.g. Ibrahim"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Family Name *</label>
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
                        placeholder="+234 800 000 0000"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="passenger@pinova.hub"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      National ID / NIN / Passport Number (For Manifest Verification)
                    </label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. A09827361 or NIN-1029384756"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Route & Carrier:</span>
                      <span className="font-bold text-white">{originInput} ➔ {destinationInput} • {selectedPendingOption.provider.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Fare (USD):</span>
                      <span className="font-bold text-white font-mono">${selectedPendingOption.fiatFare.toFixed(2)} USD</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="font-extrabold text-amber-300">Pi Payment Required:</span>
                      <span className="text-amber-300 font-black text-sm font-mono">{selectedPendingOption.piFare.toFixed(4)} π</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
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

