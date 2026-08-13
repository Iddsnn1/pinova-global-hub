import React, { useState, useEffect } from 'react';
import { Droplets, MapPin, AlertCircle, CheckCircle2, ChevronRight, Building } from 'lucide-react';
import { UtilityServiceProvider } from '../../../types/utility';
import { resolveWaterProviders } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector } from './LocationSelector';

interface WaterDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  onCountryChange: (countryCode: string) => void;
  onSelectWaterService: (provider: UtilityServiceProvider, designation: string) => void;
}

export const WaterDiscovery: React.FC<WaterDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  onCountryChange,
  onSelectWaterService
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [cityOrLga, setCityOrLga] = useState<string>('');

  // Parent selection change resets state and city
  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    setCityOrLga('');
    onCountryChange(code);
  };

  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    setCityOrLga('');
  };

  // Resolve water providers using Phase 2 discovery engine
  const discoveryResult = resolveWaterProviders(
    providers,
    selectedCountryCode || 'NG',
    selectedState
  );

  return (
    <div className="space-y-4">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-cyan-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Municipal & Regional Water Discovery
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Verified Billers
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Select your state and municipal water utility board to settle water bills or buy meter credit.
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchical Location Selector */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'NG'}
          state={selectedState}
          cityOrLga={cityOrLga}
          onCountryChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          onCityOrLgaChange={setCityOrLga}
          showStateSelector={true}
          showCitySelector={true}
          stateLabel="State / Region"
        />
      </div>

      {/* Discovery Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Water Utility Providers</span>
          </h4>
          <span className="text-xs text-cyan-400 font-semibold">
            {discoveryResult.availableProviders.length} Biller(s) Available
          </span>
        </div>

        {discoveryResult.hasVerifiedService ? (
          <div className="space-y-3">
            {discoveryResult.availableProviders.map((prov) => {
              const defaultDesigs = prov.designations || [
                'Prepaid Water Meter Payment',
                'Municipal Residential Settlement',
                'Commercial Water Bill'
              ];

              return (
                <div
                  key={prov.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={prov.logo}
                        alt={prov.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {prov.name}
                        </h5>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{prov.country}</span>
                          {prov.state && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300 font-medium">{prov.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Gateway
                    </span>
                  </div>

                  {/* Available Service Designations */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Water Service Type:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultDesigs.map((desig) => (
                        <button
                          type="button"
                          key={desig}
                          onClick={() => onSelectWaterService(prov, desig)}
                          className="text-left bg-slate-800/90 hover:bg-cyan-950/50 hover:border-cyan-500/60 border border-slate-700/80 p-2.5 rounded-xl transition-all text-xs text-white font-medium flex items-center justify-between group/btn"
                        >
                          <span className="truncate mr-2">{desig}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Honest Unverified Gateway Disclaimer */
          <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl text-center space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit mx-auto text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-amber-300">
                No Verified Digital Water Gateway
              </h5>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                {discoveryResult.statusMessage}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Try selecting a neighboring region or major metropolis with digital billing infrastructure (e.g. Lagos State, FCT Abuja, Nairobi, or Greater Accra).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
