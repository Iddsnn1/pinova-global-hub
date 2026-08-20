import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Info, 
  ShieldCheck, 
  RefreshCw, 
  User, 
  Globe,
  MapPin,
  Compass,
  Milestone,
  ArrowLeft
} from 'lucide-react';
import { 
  UtilityServiceProvider, 
  TransportSearchCriteria, 
  TransportSearchResultItem, 
  PiConversionConfig 
} from '../../../types/utility';
import { 
  resolveTransportRoute,
  resolveTransitStation
} from '../../../lib/utility/serviceDiscovery';
import { 
  TRANSIT_STATIONS 
} from '../../../data/transportData';
import { FlightServicesHub } from '../../flight/FlightServicesHub';

export type TransportModeType = 'air' | 'rail' | 'bus' | 'bus_line';

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

export const TransportDiscovery: React.FC<TransportDiscoveryProps> = ({
  providers,
  selectedCountryCode = 'GLOBAL',
  initialState = '',
  onCountryChange,
  onStateChange,
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onSelectOption
}) => {
  // 1. Initial State: No transport mode selected initially on clean landing
  const [selectedMode, setSelectedMode] = useState<TransportModeType | null>(null);

  // 2. Progressive Route Discovery Inputs
  const [originInput, setOriginInput] = useState<string>('');
  const [destinationInput, setDestinationInput] = useState<string>('');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [departureDate, setDepartureDate] = useState<string>(todayStr);
  const [returnDate, setReturnDate] = useState<string>('');
  
  const [adults, setAdults] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [infantsCount, setInfantsCount] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('economy');

  // Suggestions Dropdown State
  const [showOriginSuggestions, setShowOriginSuggestions] = useState<boolean>(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState<boolean>(false);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  // 3. Passenger Details Modal State
  const [selectedPendingOption, setSelectedPendingOption] = useState<{
    provider: UtilityServiceProvider;
    staticItem?: TransportSearchResultItem;
    fiatFare: number;
    piFare: number;
  } | null>(null);

  const [passengerTitle, setPassengerTitle] = useState<'Mr' | 'Mrs' | 'Ms' | 'Dr'>('Mr');
  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Pi Fare Calculator
  const calculatePi = (fiatAmount: number): number => {
    const rate = piConversionConfig?.piRateUsd > 0 ? piConversionConfig.piRateUsd : 10.0;
    const raw = typeof fiatAmount === 'number' && Number.isFinite(fiatAmount) && fiatAmount > 0 ? fiatAmount : 25.0;
    return Number((raw / rate).toFixed(4));
  };

  // Station Suggestions based on current mode
  const relevantStations = useMemo(() => {
    if (!selectedMode || selectedMode === 'air') return [];
    const modeKey: 'rail' | 'bus' = selectedMode === 'rail' ? 'rail' : 'bus';
    return TRANSIT_STATIONS.filter((st) => st.transportTypes.includes(modeKey));
  }, [selectedMode]);

  const originSuggestions = useMemo(() => {
    if (!originInput.trim()) return relevantStations.slice(0, 6);
    const q = originInput.trim().toUpperCase();
    return relevantStations.filter((st) => 
      st.code.toUpperCase().includes(q) ||
      st.city.toUpperCase().includes(q) ||
      st.name.toUpperCase().includes(q) ||
      st.aliases.some((a) => a.toUpperCase().includes(q))
    ).slice(0, 6);
  }, [originInput, relevantStations]);

  const destSuggestions = useMemo(() => {
    if (!destinationInput.trim()) return relevantStations.slice(0, 6);
    const q = destinationInput.trim().toUpperCase();
    return relevantStations.filter((st) => 
      st.code.toUpperCase().includes(q) ||
      st.city.toUpperCase().includes(q) ||
      st.name.toUpperCase().includes(q) ||
      st.aliases.some((a) => a.toUpperCase().includes(q))
    ).slice(0, 6);
  }, [destinationInput, relevantStations]);

  // Mode Selection Handler
  const handleSelectMode = (mode: TransportModeType) => {
    setSelectedMode(mode);
    setOriginInput('');
    setDestinationInput('');
    setShowOriginSuggestions(false);
    setShowDestSuggestions(false);
  };

  const handleSwapStations = () => {
    const temp = originInput;
    setOriginInput(destinationInput);
    setDestinationInput(temp);
  };

  // Canonical Route Resolution: Executes strictly whenever Origin, Destination, and Mode are defined
  const routeResolutionResult = useMemo(() => {
    if (!selectedMode || selectedMode === 'air') {
      return null;
    }

    const cleanOrigin = originInput.trim().toUpperCase();
    const cleanDest = destinationInput.trim().toUpperCase();

    // If both origin and destination have been specified, resolve route
    if (cleanOrigin && cleanDest) {
      return resolveTransportRoute(providers, {
        mode: selectedMode,
        origin: cleanOrigin,
        destination: cleanDest,
        departureDate,
        returnDate: tripType === 'round_trip' ? returnDate : undefined,
        tripType,
        passengers: { adults, children: childrenCount, infants: infantsCount },
        cabinClass,
        countryCode: selectedCountryCode !== 'GLOBAL' ? selectedCountryCode : undefined
      });
    }

    return null;
  }, [
    selectedMode,
    originInput,
    destinationInput,
    departureDate,
    returnDate,
    tripType,
    adults,
    childrenCount,
    infantsCount,
    cabinClass,
    selectedCountryCode,
    providers
  ]);

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

    const safeFiat = typeof fiatFare === 'number' && Number.isFinite(fiatFare) && fiatFare > 0 
      ? Number(fiatFare.toFixed(2)) 
      : 25.0;

    onSelectOption(provider, {
      originCode: origin,
      destinationCode: destination,
      fiatFare: safeFiat,
      piAmount: piFare,
      tripDetails,
      transportType: selectedMode || 'rail',
      airline: provider.name,
      flightNumber: staticItem?.flightOrTripNumber || `EXP-${Math.floor(100 + Math.random() * 900)}`,
      departureTime: staticItem?.departureTime || `${departureDate}T08:30:00Z`,
      arrivalTime: staticItem?.arrivalTime || `${departureDate}T11:45:00Z`,
      passengerDetails
    });

    setSelectedPendingOption(null);
  };

  // Get user-friendly mode label
  const getModeLabel = (mode: TransportModeType): string => {
    switch (mode) {
      case 'air': return 'Flights';
      case 'rail': return 'Train';
      case 'bus': return 'Inter-City Bus';
      case 'bus_line': return 'Inter-City Bus Line';
      default: return 'Transport';
    }
  };

  // =========================================================================
  // VIEW 1: CLEAN MINIMAL TRANSPORT LANDING PAGE
  // =========================================================================
  if (!selectedMode) {
    return (
      <div className="space-y-6">
        {/* Minimal Landing Header */}
        <div className="space-y-1.5 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Transport
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Find verified transport services and routes worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Transport Mode Selection */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Transport Mode
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Flights */}
            <button
              type="button"
              id="transport-mode-flights"
              onClick={() => handleSelectMode('air')}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/60 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Flights
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Airlines & GDS flight bookings
                </p>
              </div>
            </button>

            {/* Train */}
            <button
              type="button"
              id="transport-mode-train"
              onClick={() => handleSelectMode('rail')}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Train className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Train
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  High-speed rail & passenger trains
                </p>
              </div>
            </button>

            {/* Inter-City Bus */}
            <button
              type="button"
              id="transport-mode-bus"
              onClick={() => handleSelectMode('bus')}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Inter-City Bus
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Scheduled long-distance coach operators
                </p>
              </div>
            </button>

            {/* Inter-City Bus Line */}
            <button
              type="button"
              id="transport-mode-bus-line"
              onClick={() => handleSelectMode('bus_line')}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Milestone className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Inter-City Bus Line
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Interstate highway transit corridors & express lines
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FLIGHTS HUB (Live Airline GDS Search)
  // =========================================================================
  if (selectedMode === 'air') {
    return (
      <div className="space-y-5">
        {/* Mode Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedMode(null)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Transport Modes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
              Transport ➔ Flights
            </span>
          </div>

          {/* Quick Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleSelectMode('air')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white shadow"
            >
              Flights
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode('rail')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Train
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode('bus')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Bus
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode('bus_line')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Bus Line
            </button>
          </div>
        </div>

        {/* Flight Services Hub */}
        <FlightServicesHub
          piConversionConfig={piConversionConfig}
          userBalancePi={userBalancePi}
          buyerUsername={buyerUsername}
          initialOrigin={originInput || 'KAN'}
          initialDestination={destinationInput || 'JED'}
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
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: PROGRESSIVE ROUTE DISCOVERY FOR TRAIN, INTER-CITY BUS & BUS LINE
  // =========================================================================
  return (
    <div className="space-y-5">
      {/* Mode Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedMode(null)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Return to Transport Modes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className={`text-xs font-black uppercase ${
            selectedMode === 'rail' 
              ? 'text-amber-600 dark:text-amber-400' 
              : selectedMode === 'bus_line'
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            Transport ➔ {getModeLabel(selectedMode)}
          </span>
        </div>

        {/* Quick Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleSelectMode('air')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedMode === 'air'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Flights
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('rail')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedMode === 'rail'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Train
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('bus')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedMode === 'bus'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bus
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('bus_line')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedMode === 'bus_line'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bus Line
          </button>
        </div>
      </div>

      {/* Progressive Route Input Form */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        
        {/* Step 1 & Step 2: From / Origin and To / Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Step 1: From / Origin */}
          <div className="sm:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              From / Origin *
            </label>
            <div className="relative">
              <input
                ref={originInputRef}
                type="text"
                id="transport-origin-input"
                value={originInput}
                onFocus={() => setShowOriginSuggestions(true)}
                onChange={(e) => {
                  setOriginInput(e.target.value.toUpperCase());
                  setShowOriginSuggestions(true);
                }}
                placeholder={selectedMode === 'rail' ? 'Station or City (e.g. ABV, LOS, NYP, LON)' : 'Terminal or City (e.g. LOS, ABV, NYC, LON)'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 uppercase"
                required
              />
              {originInput && (
                <button
                  type="button"
                  onClick={() => setOriginInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Origin Suggestions Dropdown */}
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                  Suggested Stations / Terminals
                </div>
                {originSuggestions.map((st) => (
                  <button
                    key={`orig-${st.code}`}
                    type="button"
                    onClick={() => {
                      setOriginInput(st.code);
                      setShowOriginSuggestions(false);
                      if (!destinationInput) {
                        destInputRef.current?.focus();
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white mr-1.5">{st.code}</span>
                      <span className="text-slate-600 dark:text-slate-300">{st.city}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{st.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-2 flex justify-center pt-1 sm:pt-4">
            <button
              type="button"
              id="transport-swap-btn"
              onClick={handleSwapStations}
              title="Swap Origin and Destination"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Step 2: To / Destination */}
          <div className="sm:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              To / Destination *
            </label>
            <div className="relative">
              <input
                ref={destInputRef}
                type="text"
                id="transport-dest-input"
                value={destinationInput}
                onFocus={() => setShowDestSuggestions(true)}
                onChange={(e) => {
                  setDestinationInput(e.target.value.toUpperCase());
                  setShowDestSuggestions(true);
                }}
                placeholder={selectedMode === 'rail' ? 'Station or City (e.g. KAD, IBA, WAS, PAR)' : 'Terminal or City (e.g. ABV, BNI, KAN, BOS)'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 uppercase"
                required
              />
              {destinationInput && (
                <button
                  type="button"
                  onClick={() => setDestinationInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Destination Suggestions Dropdown */}
            {showDestSuggestions && destSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                  Suggested Stations / Terminals
                </div>
                {destSuggestions.map((st) => (
                  <button
                    key={`dest-${st.code}`}
                    type="button"
                    onClick={() => {
                      setDestinationInput(st.code);
                      setShowDestSuggestions(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white mr-1.5">{st.code}</span>
                      <span className="text-slate-600 dark:text-slate-300">{st.city}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{st.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Journey Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Departure Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Trip Type</label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="one_way">One Way</option>
              <option value="round_trip">Round Trip</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              Passengers
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 Passenger (Adult)</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Class / Seat Type</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="economy">Standard Economy</option>
              <option value="business">First / Executive VIP</option>
              <option value="first">Sleeper / Royal Cabin</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. ROUTE-SPECIFIC RESULTS OR EMPTY STATE */}
      {/* ===================================================================== */}
      {originInput.trim() && destinationInput.trim() ? (
        <div className="space-y-3">
          {routeResolutionResult && routeResolutionResult.results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Available Route Corridors & Schedules</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold">
                    {routeResolutionResult.results.length} verified
                  </span>
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Route: <strong className="text-slate-900 dark:text-white">{originInput}</strong> ➔ <strong className="text-slate-900 dark:text-white">{destinationInput}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {routeResolutionResult.results.map((item) => {
                  const provider = routeResolutionResult.matchingProviders.find((p) => p.id === item.providerId) || providers[0];
                  const safeFare = typeof item.fiatFare === 'number' && Number.isFinite(item.fiatFare) && item.fiatFare > 0 ? item.fiatFare : 25.0;
                  const piFare = calculatePi(safeFare);

                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 p-4 sm:p-5 rounded-3xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                          selectedMode === 'rail'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : selectedMode === 'bus_line'
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {selectedMode === 'rail' ? (
                            <Train className="w-6 h-6" />
                          ) : selectedMode === 'bus_line' ? (
                            <Milestone className="w-6 h-6" />
                          ) : (
                            <Bus className="w-6 h-6" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {item.providerName}
                            </h5>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold border border-emerald-500/20">
                              {item.badge || 'VERIFIED OPERATOR'}
                            </span>
                            {item.corridorName && (
                              <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-md font-bold border border-purple-500/20 flex items-center gap-1">
                                <Milestone className="w-3 h-3" />
                                {item.corridorName}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white">{item.originCity || item.originCode}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-slate-900 dark:text-white">{item.destinationCity || item.destinationCode}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-purple-600 dark:text-purple-400 capitalize">{cabinClass} Class</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.duration || 'Direct Express'}
                            </span>
                            {item.distanceKm && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500 dark:text-slate-400">{item.distanceKm} km</span>
                              </>
                            )}
                          </div>
                          {item.stops && item.stops.length > 0 && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Stops: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.stops.join(' ➔ ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="text-right">
                          <div className="text-base font-black text-amber-500 dark:text-amber-400 font-mono">
                            {piFare.toFixed(4)} π
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            ≈ ${safeFare.toFixed(2)} USD
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleInitiateOptionSelect(provider, safeFare, piFare, item)}
                          className={`font-black px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center gap-1.5 ${
                            selectedMode === 'rail'
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                              : selectedMode === 'bus_line'
                                ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
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
            </div>
          ) : (
            /* Clear Empty State when no matching routes exist for Selected Origin -> Destination */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-slate-900 dark:text-white font-extrabold">
                  No services found for this route
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  No verified {getModeLabel(selectedMode)} services are currently available for <strong className="text-slate-900 dark:text-white">{originInput}</strong> ➔ <strong className="text-slate-900 dark:text-white">{destinationInput}</strong>.
                </p>
              </div>

              {/* Explicit Actions */}
              <div className="pt-2 flex justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setOriginInput('');
                    originInputRef.current?.focus();
                  }}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Change Origin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestinationInput('');
                    destInputRef.current?.focus();
                  }}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Change Destination
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode(null)}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  Change Transport Mode
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Prompt user to complete origin and destination */
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {!originInput.trim() ? 'Step 1: Enter Origin Terminal / City' : 'Step 2: Enter Destination Terminal / City'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {!originInput.trim() 
              ? `Select your starting station or city to begin ${getModeLabel(selectedMode)} route discovery.`
              : `Now enter your target destination to resolve verified direct routes and schedules.`}
          </p>
        </div>
      )}

      {/* Passenger Details Modal for Rail/Bus */}
      {selectedPendingOption && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <User className="w-4 h-4" />
                </span>
                <h4 className="text-base font-black">Passenger Details & Transit Pass</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPendingOption(null)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleConfirmPassengerDetails} className="space-y-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <select
                    value={passengerTitle}
                    onChange={(e) => setPassengerTitle(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Given Name *</label>
                  <input
                    type="text"
                    required
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    placeholder="e.g. Ibrahim"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Family Name *</label>
                  <input
                    type="text"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="e.g. Bello"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="passenger@pinova.hub"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  National ID / NIN / Passport Number (Manifest Verification)
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. A09827361 or NIN-1029384756"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Route & Carrier:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{originInput} ➔ {destinationInput} • {selectedPendingOption.provider.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Total Fare (USD):</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">${selectedPendingOption.fiatFare.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-extrabold text-amber-600 dark:text-amber-300">Pi Payment Required:</span>
                  <span className="text-amber-600 dark:text-amber-300 font-black text-sm font-mono">{selectedPendingOption.piFare.toFixed(4)} π</span>
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
  );
};
