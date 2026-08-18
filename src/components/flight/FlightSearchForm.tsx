import React, { useState, useRef, useEffect } from 'react';
import { 
  Plane, 
  ArrowRightLeft, 
  Calendar, 
  Users, 
  Search, 
  RefreshCw, 
  MapPin, 
  ShieldCheck, 
  ChevronDown,
  X
} from 'lucide-react';
import { FlightSearchCriteria, TripType, CabinClass, AirportOption } from '../../types/flight';
import { GLOBAL_AIRPORTS } from '../../data/flightData';

interface FlightSearchFormProps {
  onSearch: (criteria: FlightSearchCriteria) => void;
  isSearching: boolean;
  apiConfigured: boolean;
  apiMessage?: string;
  initialCriteria?: Partial<FlightSearchCriteria>;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch,
  isSearching,
  apiConfigured,
  apiMessage,
  initialCriteria
}) => {
  const [tripType, setTripType] = useState<TripType>(initialCriteria?.tripType || 'one_way');
  const [originCode, setOriginCode] = useState<string>(initialCriteria?.origin || 'KAN');
  const [destinationCode, setDestinationCode] = useState<string>(initialCriteria?.destination || 'JED');

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekObj = new Date(Date.now() + 7 * 86400000);
  const nextWeekStr = nextWeekObj.toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState<string>(initialCriteria?.departureDate || todayStr);
  const [returnDate, setReturnDate] = useState<string>(initialCriteria?.returnDate || nextWeekStr);

  const [adults, setAdults] = useState<number>(initialCriteria?.passengers?.adults || 1);
  const [childrenCount, setChildrenCount] = useState<number>(initialCriteria?.passengers?.children || 0);
  const [infantsCount, setInfantsCount] = useState<number>(initialCriteria?.passengers?.infants || 0);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialCriteria?.cabinClass || 'economy');

  // Passenger Dropdown open state
  const [showPassengerPopover, setShowPassengerPopover] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);

  // Origin / Destination Autocomplete state
  const [originSearch, setOriginSearch] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (passengerRef.current && !passengerRef.current.contains(e.target as Node)) {
        setShowPassengerPopover(false);
      }
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPassengers = adults + childrenCount + infantsCount;

  const handleSwapAirports = () => {
    const temp = originCode;
    setOriginCode(destinationCode);
    setDestinationCode(temp);
  };

  const getAirportDisplay = (code: string): AirportOption | undefined => {
    return GLOBAL_AIRPORTS.find((a) => a.code === code.toUpperCase());
  };

  const filteredOriginAirports = GLOBAL_AIRPORTS.filter((a) => {
    if (!originSearch.trim()) return true;
    const q = originSearch.toLowerCase();
    return a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
  });

  const filteredDestAirports = GLOBAL_AIRPORTS.filter((a) => {
    if (!destSearch.trim()) return true;
    const q = destSearch.toLowerCase();
    return a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originCode || !destinationCode) return;
    if (originCode === destinationCode) {
      alert('Origin and Destination airports cannot be the same.');
      return;
    }

    onSearch({
      origin: originCode.trim().toUpperCase(),
      destination: destinationCode.trim().toUpperCase(),
      tripType,
      departureDate,
      returnDate: tripType === 'round_trip' ? returnDate : undefined,
      passengers: { adults, children: childrenCount, infants: infantsCount },
      cabinClass
    });
  };

  const originAirport = getAirportDisplay(originCode);
  const destAirport = getAirportDisplay(destinationCode);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 text-white">
      
      {/* Flight Provider Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-white">Global Flight Services</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/40">
                GDS & CARRIER NETWORK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct international airline ticketing with Pi Network Escrow protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold self-start sm:self-auto bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>PSTP Escrow Protected</span>
        </div>
      </div>

      {/* Main Search Controls */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1: Trip Type & Cabin Class Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTripType('one_way')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tripType === 'one_way'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('round_trip')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tripType === 'round_trip'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Round Trip
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Cabin Class */}
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as CabinClass)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="economy">Economy Class</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business Class</option>
              <option value="first">First Class</option>
            </select>

            {/* Passengers Selector Popover Trigger */}
            <div className="relative" ref={passengerRef}>
              <button
                type="button"
                onClick={() => setShowPassengerPopover(!showPassengerPopover)}
                className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPassengerPopover && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 space-y-3">
                  <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                    Passengers
                  </div>

                  {/* Adults */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Adults</div>
                      <div className="text-[10px] text-slate-400">Age 12+</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-white">{adults}</span>
                      <button
                        type="button"
                        disabled={totalPassengers >= 9}
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Children</div>
                      <div className="text-[10px] text-slate-400">Age 2-11</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={childrenCount <= 0}
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-white">{childrenCount}</span>
                      <button
                        type="button"
                        disabled={totalPassengers >= 9}
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Infants</div>
                      <div className="text-[10px] text-slate-400">Under 2 (on lap)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={infantsCount <= 0}
                        onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-white">{infantsCount}</span>
                      <button
                        type="button"
                        disabled={infantsCount >= adults || totalPassengers >= 9}
                        onClick={() => setInfantsCount(infantsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassengerPopover(false)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors mt-2"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Origin & Destination Inputs with Swap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          
          {/* Origin Input */}
          <div className="relative" ref={originRef}>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              From (Origin Airport or City)
            </label>
            <div
              onClick={() => setShowOriginDropdown(true)}
              className="bg-slate-800 border border-slate-700 hover:border-purple-500/80 rounded-2xl p-3 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                  {originCode}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{originAirport?.city || originCode}</span>
                    <span className="text-xs text-slate-400 font-normal">({originCode})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {originAirport?.name || 'Global Departure Hub'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>

            {/* Origin Dropdown Autocomplete */}
            {showOriginDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl z-40 space-y-2">
                <input
                  type="text"
                  autoFocus
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  placeholder="Search city, airport name, or 3-letter IATA code..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredOriginAirports.map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => {
                        setOriginCode(a.code);
                        setShowOriginDropdown(false);
                        setOriginSearch('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{a.city}</span>, <span className="text-slate-400">{a.country}</span>
                        <div className="text-[10px] text-slate-500">{a.name}</div>
                      </div>
                      <span className="font-mono font-black text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                        {a.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button (Centered between inputs on desktop) */}
          <button
            type="button"
            onClick={handleSwapAirports}
            title="Swap Origin and Destination"
            className="hidden md:flex absolute left-1/2 top-9 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white items-center justify-center shadow-lg transition-transform hover:rotate-180"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          {/* Destination Input */}
          <div className="relative" ref={destRef}>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              To (Destination Airport or City)
            </label>
            <div
              onClick={() => setShowDestDropdown(true)}
              className="bg-slate-800 border border-slate-700 hover:border-purple-500/80 rounded-2xl p-3 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                  {destinationCode}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{destAirport?.city || destinationCode}</span>
                    <span className="text-xs text-slate-400 font-normal">({destinationCode})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {destAirport?.name || 'Global Destination Hub'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>

            {/* Destination Dropdown Autocomplete */}
            {showDestDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl z-40 space-y-2">
                <input
                  type="text"
                  autoFocus
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder="Search city, airport name, or 3-letter IATA code..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredDestAirports.map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => {
                        setDestinationCode(a.code);
                        setShowDestDropdown(false);
                        setDestSearch('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{a.city}</span>, <span className="text-slate-400">{a.country}</span>
                        <div className="text-[10px] text-slate-500">{a.name}</div>
                      </div>
                      <span className="font-mono font-black text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                        {a.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Row 3: Travel Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              min={todayStr}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {tripType === 'round_trip' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                min={departureDate || todayStr}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Searching GDS & Airline Schedules...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search Flights ({originCode} ➔ {destinationCode})</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};

