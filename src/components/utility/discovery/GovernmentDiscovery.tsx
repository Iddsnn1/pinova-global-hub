import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  FileText,
  Landmark
} from 'lucide-react';
import { UtilityServiceProvider } from '../../../types/utility';
import { resolveGovernmentServices } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector, NIGERIAN_STATES } from './LocationSelector';

interface GovernmentDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  onCountryChange: (countryCode: string) => void;
  onSelectGovernmentAgency: (
    provider: UtilityServiceProvider,
    serviceName: string,
    referenceLabel: string
  ) => void;
}

export const GovernmentDiscovery: React.FC<GovernmentDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  onCountryChange,
  onSelectGovernmentAgency
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jurisdictionLevel, setJurisdictionLevel] = useState<'all' | 'national' | 'state' | 'municipal'>('all');

  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    setSearchQuery('');
    onCountryChange(code);
  };

  const handleStateSelect = (st: string) => {
    setSelectedState(st);
  };

  const govResult = resolveGovernmentServices(providers, {
    countryCode: selectedCountryCode || 'NG',
    state: selectedState,
    searchQuery,
    jurisdictionLevel
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-emerald-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Government & Civic Service Portals
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                TSA / Revenue Clearance
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Direct settlement for federal taxes, passports, driver licenses, vehicle registration & municipal fees.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Jurisdiction Filter */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'NG'}
          state={selectedState}
          availableStates={selectedCountryCode === 'NG' ? NIGERIAN_STATES : undefined}
          onCountryChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          showStateSelector={true}
          stateLabel="State / Federal Territory"
        />

        {/* Agency Search & Jurisdiction Buttons */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Search Agency or Service
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Passport, Tax, Remita RRR, Driver Licence, IRS..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Agencies' },
              { id: 'national', label: 'Federal / National' },
              { id: 'state', label: 'State IRS' },
              { id: 'municipal', label: 'Municipal / City' }
            ].map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setJurisdictionLevel(j.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  jurisdictionLevel === j.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agency Search Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Government Agencies ({govResult.agencies.length})
          </h4>
        </div>

        {govResult.agencies.length > 0 ? (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {govResult.agencies.map((agency) => {
              const fullProvider = providers.find((p) => p.id === agency.providerId) || providers[0];

              return (
                <div
                  key={agency.providerId}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fullProvider.logo}
                        alt={agency.agencyName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {agency.agencyName}
                        </h5>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Landmark className="w-3 h-3 text-emerald-400" />
                          <span>{agency.country}</span>
                          {agency.state && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300">{agency.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {agency.hasDirectValidationApi && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        API Validation
                      </span>
                    )}
                  </div>

                  {/* Available Services */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Civic Service:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agency.availableServices.map((serviceName) => (
                        <button
                          type="button"
                          key={serviceName}
                          onClick={() =>
                            onSelectGovernmentAgency(
                              fullProvider,
                              serviceName,
                              agency.referenceLabel
                            )
                          }
                          className="text-left bg-slate-800/90 hover:bg-emerald-950/50 hover:border-emerald-500/60 border border-slate-700/80 p-2.5 rounded-xl transition-all text-xs text-white font-medium flex items-center justify-between group/btn"
                        >
                          <span className="truncate mr-2">{serviceName}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center space-y-1">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No agencies match your search</p>
            <p className="text-xs text-slate-400">Try searching for broader terms like "Tax", "Passport", "TSA", or "Permit".</p>
          </div>
        )}
      </div>
    </div>
  );
};
