import React, { useState } from 'react';
import { 
  Plane, 
  Clock, 
  Luggage, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FlightOffer, FlightSearchCriteria, FlightFareOption } from '../../types/flight';
import { AIRLINE_INFO } from '../../data/flightData';

interface FlightResultsListProps {
  offers: FlightOffer[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  searchCriteria: FlightSearchCriteria | null;
  onSelectOffer: (offer: FlightOffer) => void;
  onRetry: () => void;
  piRateUsd: number;
}

// Single Flight Itinerary Card with selectable fare options
const FlightOfferCard: React.FC<{
  offer: FlightOffer;
  piRateUsd: number;
  onSelectOffer: (offer: FlightOffer) => void;
}> = ({ offer, piRateUsd, onSelectOffer }) => {
  const initialOption = offer.fareOptions && offer.fareOptions.length > 0
    ? offer.fareOptions[0]
    : null;

  const [selectedFareOption, setSelectedFareOption] = useState<FlightFareOption | null>(initialOption);

  const activeOfferId = selectedFareOption ? selectedFareOption.offerId : offer.offerId;
  const activeFareAmountFiat = selectedFareOption ? selectedFareOption.fareAmountFiat : offer.fareAmountFiat;
  const activeFareBrandName = selectedFareOption?.fareBrandName || offer.fareBrandName;
  const activeBaggage = selectedFareOption ? selectedFareOption.baggage : offer.baggage;
  const activeFareConditions = selectedFareOption?.fareConditions || offer.fareConditions;
  const activeSeats = selectedFareOption ? selectedFareOption.seatsAvailable : offer.seatsAvailable;

  const piCalculated = piRateUsd > 0 ? (activeFareAmountFiat / piRateUsd) : 0;
  const formattedPi = piCalculated < 0.0001 
    ? piCalculated.toFixed(6) 
    : piCalculated.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
    } catch {
      return '';
    }
  };

  const airlineMeta = AIRLINE_INFO[offer.airline];

  const handleSelect = () => {
    const chosenOffer: FlightOffer = {
      ...offer,
      offerId: activeOfferId, // Preserves exact Duffel offer ID for selected fare
      fareAmountFiat: activeFareAmountFiat,
      fareAmountPi: piCalculated,
      fareBrandName: activeFareBrandName,
      baggage: activeBaggage,
      fareConditions: activeFareConditions,
      seatsAvailable: activeSeats,
      baseFareFiat: selectedFareOption?.baseFareFiat ?? offer.baseFareFiat,
      taxesAndFeesFiat: selectedFareOption?.taxesAndFeesFiat ?? offer.taxesAndFeesFiat
    };
    onSelectOffer(chosenOffer);
  };

  return (
    <div
      key={offer.offerId}
      className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-4 sm:p-5 transition-all shadow-lg hover:shadow-purple-900/10 space-y-4"
    >
      {/* Top row: Airline info & Price */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-inner"
            style={{ backgroundColor: airlineMeta?.color || '#3b82f6' }}
          >
            {offer.airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">{offer.airline}</span>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                {offer.flightNumber}
              </span>
              {offer.bookingMode === 'LIVE_DUFFEL' && offer.isLive === true ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  LIVE DUFFEL GDS
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  VERIFIED CARRIER
                </span>
              )}
              {offer.aircraft && (
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {offer.aircraft}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="capitalize">{activeFareBrandName || offer.cabinClass.replace('_', ' ')}</span>
              <span>•</span>
              <span className={activeSeats <= 3 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                {activeSeats} seat{activeSeats > 1 ? 's' : ''} left
              </span>
            </div>
          </div>
        </div>

        {/* Price Block */}
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black text-amber-300 flex items-center justify-end gap-1 font-mono">
            <span>{formattedPi}</span>
            <span className="text-sm font-sans font-bold">π</span>
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            ≈ ${activeFareAmountFiat.toLocaleString(undefined, { minimumFractionDigits: 2 })} {offer.fareCurrency}
          </div>
        </div>
      </div>

      {/* Middle row: Schedule & Route Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
        {/* Origin */}
        <div>
          <div className="text-base sm:text-lg font-black text-white">
            {formatTime(offer.departureTime)}
          </div>
          <div className="text-xs font-black text-purple-300">
            {offer.originCode}
          </div>
          <div className="text-[10px] text-slate-400">
            {formatDate(offer.departureTime)}
          </div>
        </div>

        {/* Duration & Stops Graphic */}
        <div className="text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            <span>{offer.duration}</span>
          </div>
          <div className="flex items-center gap-1 px-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <div className="h-0.5 flex-1 bg-slate-700 relative">
              {offer.stops > 0 && (
                <div className="absolute left-1/2 -top-1 w-2 h-2 rounded-full bg-amber-400 -translate-x-1/2" />
              )}
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-[10px] font-bold">
            {offer.stops === 0 ? (
              <span className="text-emerald-400">Non-stop Direct</span>
            ) : (
              <span className="text-amber-400">{offer.stops} Stop ({offer.stopAirports?.join(', ') || 'Connection'})</span>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="text-left sm:text-right">
          <div className="text-base sm:text-lg font-black text-white">
            {formatTime(offer.arrivalTime)}
          </div>
          <div className="text-xs font-black text-amber-300">
            {offer.destinationCode}
          </div>
          <div className="text-[10px] text-slate-400">
            {formatDate(offer.arrivalTime)}
          </div>
        </div>
      </div>

      {/* Selectable Fare Options (if itinerary has multiple fare brands) */}
      {offer.fareOptions && offer.fareOptions.length > 1 && (
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Available Fare Tiers ({offer.fareOptions.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Select desired ticket conditions
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {offer.fareOptions.map((opt) => {
              const isSelected = opt.offerId === activeOfferId;
              const optPi = piRateUsd > 0 ? (opt.fareAmountFiat / piRateUsd).toFixed(4) : '0';
              return (
                <button
                  key={opt.offerId}
                  type="button"
                  onClick={() => setSelectedFareOption(opt)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-900/30 border-purple-500 shadow-md shadow-purple-900/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {opt.fareBrandName || 'Standard Fare'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div className="text-sm font-black text-amber-300 mt-1 font-mono">
                    ${opt.fareAmountFiat.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {optPi} π • {opt.baggage?.checkedBaggage || 'Standard Baggage'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Row: Baggage, Conditions & Select Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 bg-slate-800/70 px-2.5 py-1 rounded-xl">
            <Luggage className="w-3.5 h-3.5 text-purple-400" />
            <span>{activeBaggage.checkedBaggage}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {activeFareConditions || 'Standard Carrier Policy'}
          </div>
        </div>

        <button
          onClick={handleSelect}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all"
        >
          <span>Select & Book</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const FlightResultsList: React.FC<FlightResultsListProps> = ({
  offers,
  isLoading,
  isError,
  errorMessage,
  searchCriteria,
  onSelectOffer,
  onRetry,
  piRateUsd
}) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto animate-pulse">
            <Plane className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="font-black text-base text-white">Searching Airline Network & GDS Schedules...</h4>
            <p className="text-xs text-slate-400 mt-1">
              Comparing verified routes and real-time carrier availability for {searchCriteria?.origin} ➔ {searchCriteria?.destination}
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs font-bold text-amber-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Calculating Pi exchange rate conversion...</span>
          </div>
        </div>

        {/* Skeleton cards */}
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-32 h-6 bg-slate-800 rounded-xl" />
              <div className="w-24 h-6 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-12 bg-slate-800/60 rounded-xl" />
            <div className="flex justify-between items-center pt-2">
              <div className="w-40 h-4 bg-slate-800 rounded-lg" />
              <div className="w-28 h-8 bg-purple-900/40 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-base text-white">Flight Search Unavailable</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {errorMessage || 'Unable to retrieve flight options at this time. Please retry or adjust your departure date.'}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 inline-flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Search Again</span>
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (offers.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Plane className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-base text-white">No Flights Found on Selected Route</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            We could not find matching scheduled flights between {searchCriteria?.origin || 'origin'} and {searchCriteria?.destination || 'destination'} on the selected date.
          </p>
        </div>
        <div className="text-xs text-purple-400 font-bold">
          Tip: Try popular routes like Kano (KAN) ➔ Jeddah (JED) or Lagos (LOS) ➔ London (LHR).
        </div>
      </div>
    );
  }

  // 4. Populated Results
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-extrabold text-slate-300">
          Available Flight Itineraries ({offers.length})
        </div>
        <div className="text-[11px] text-amber-300 font-bold">
          Exchange Rate: 1 π = ${piRateUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
        </div>
      </div>

      {/* Flight Offer Cards */}
      {offers.map((offer) => (
        <FlightOfferCard
          key={offer.offerId}
          offer={offer}
          piRateUsd={piRateUsd}
          onSelectOffer={onSelectOffer}
        />
      ))}
    </div>
  );
};
