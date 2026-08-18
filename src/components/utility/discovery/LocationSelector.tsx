import React, { useState, useMemo } from 'react';
import { MapPin, Globe, Building, Search, X, RotateCcw } from 'lucide-react';
import { getSubdivisionInfo } from '../../../data/countrySubdivisions';
import { ALL_GLOBAL_COUNTRIES } from '../../../data/countriesData';

export interface LocationSelectorProps {
  countryCode: string;
  state?: string;
  cityOrLga?: string;
  availableCountries?: { code: string; name: string; flag?: string }[];
  availableStates?: string[];
  availableCities?: string[];
  onCountryChange: (countryCode: string) => void;
  onStateChange: (state: string) => void;
  onCityOrLgaChange?: (cityOrLga: string) => void;
  showStateSelector?: boolean;
  showCitySelector?: boolean;
  stateLabel?: string;
  disabled?: boolean;
}

const DEFAULT_GLOBAL_COUNTRIES: { code: string; name: string; flag: string; dialCode?: string }[] = [
  { code: 'GLOBAL', name: 'Global Services', flag: '🌐', dialCode: '' },
  ...ALL_GLOBAL_COUNTRIES.map((c) => ({ code: c.code, name: c.name, flag: c.flag, dialCode: c.dialCode }))
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  countryCode = 'GLOBAL',
  state = '',
  cityOrLga = '',
  availableCountries = DEFAULT_GLOBAL_COUNTRIES,
  availableStates,
  onCountryChange,
  onStateChange,
  onCityOrLgaChange,
  showStateSelector = true,
  showCitySelector = false,
  stateLabel,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeCode = (countryCode || 'GLOBAL').toUpperCase();

  const subInfo = useMemo(() => {
    return getSubdivisionInfo(activeCode);
  }, [activeCode]);

  const resolvedStates = availableStates !== undefined ? availableStates : (subInfo.subdivisions || []);
  const computedStateLabel = stateLabel || (subInfo.subdivisionName ? `${subInfo.subdivisionName}` : 'State / Region');

  const selectedCountryObj = useMemo(() => {
    return availableCountries.find((c) => c.code.toUpperCase() === activeCode) || {
      code: activeCode,
      name: activeCode === 'GLOBAL' ? 'Global Services' : activeCode,
      flag: '🌐'
    };
  }, [availableCountries, activeCode]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return availableCountries;
    const q = searchQuery.toLowerCase().trim();
    return availableCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c as any).dialCode?.toLowerCase().includes(q)
    );
  }, [availableCountries, searchQuery]);

  const handleCountrySelect = (newCode: string) => {
    if (newCode === activeCode) return;
    onCountryChange(newCode);
    onStateChange('');
    if (onCityOrLgaChange) {
      onCityOrLgaChange('');
    }
    setSearchQuery('');
  };

  const handleResetToGlobal = () => {
    handleCountrySelect('GLOBAL');
  };

  return (
    <div className="space-y-3 w-full" id="canonical-location-selector">
      {/* Service Availability Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Service availability</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Select service location to load valid local utility gateways and verified providers.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          {activeCode !== 'GLOBAL' && (
            <button
              type="button"
              onClick={handleResetToGlobal}
              disabled={disabled}
              className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Global</span>
            </button>
          )}
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-200 flex items-center gap-1.5 shadow-sm">
            <span className="text-base leading-none">{selectedCountryObj.flag}</span>
            <span>{selectedCountryObj.name}</span>
            {state ? (
              <span className="text-amber-400 font-bold border-l border-purple-700 pl-1.5">
                · {state}
              </span>
            ) : (
              <span className="text-slate-400 border-l border-purple-700 pl-1.5">
                · All Regions
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Country Search Bar & Quick Switch */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleResetToGlobal}
          disabled={disabled}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border shrink-0 ${
            activeCode === 'GLOBAL'
              ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-purple-400'
          }`}
        >
          <span>🌐</span>
          <span>Global Services</span>
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 190+ countries (e.g. Canada, Germany, Japan, Nigeria, Kenya)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all disabled:opacity-50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Country Search Filter Results Modal Panel (if searching) */}
      {searchQuery.trim() !== '' && (
        <div className="p-2.5 bg-slate-900 rounded-xl border border-purple-900/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Search Results ({filteredCountries.length} countries found)</span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-purple-400 hover:underline text-[10px]"
            >
              Clear Search
            </button>
          </div>
          {filteredCountries.length === 0 ? (
            <div className="text-xs text-amber-400 py-2 text-center">
              No countries found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredCountries.slice(0, 24).map((c) => {
                const isSelected = activeCode === c.code.toUpperCase();
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c.code)}
                    className={`p-1.5 rounded-lg text-left text-xs font-bold transition-all flex items-center gap-1.5 border truncate ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <span className="text-sm leading-none shrink-0">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] opacity-70 ml-auto font-mono shrink-0">{c.code}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Country & Dynamic Subdivision Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Country Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-purple-400" />
            <span>Country</span>
          </label>
          <select
            value={activeCode}
            onChange={(e) => handleCountrySelect(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          >
            {availableCountries.map((c) => (
              <option key={`country-${c.code}`} value={c.code}>
                {c.flag ? `${c.flag} ` : ''}{c.name} {c.code !== 'GLOBAL' ? `(${c.code})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* State / Region / Subdivision Selector */}
        {showStateSelector && (
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{computedStateLabel}</span>
            </label>
            {activeCode === 'GLOBAL' ? (
              <div className="flex items-center px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-400">
                <span>All Regions / Global Services</span>
              </div>
            ) : resolvedStates.length > 0 ? (
              <select
                value={state}
                onChange={(e) => {
                  onStateChange(e.target.value);
                  if (onCityOrLgaChange) onCityOrLgaChange('');
                }}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-100 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="">All {subInfo.subdivisionName ? `${subInfo.subdivisionName}s` : 'Regions'} / Nationwide</option>
                {resolvedStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={state}
                onChange={(e) => onStateChange(e.target.value)}
                placeholder={`e.g. ${computedStateLabel} name`}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            )}
          </div>
        )}
      </div>

      {/* City / LGA / District (if enabled) */}
      {showCitySelector && onCityOrLgaChange && activeCode !== 'GLOBAL' && (
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-emerald-400" />
            <span>City / District</span>
          </label>
          <input
            type="text"
            value={cityOrLga}
            onChange={(e) => onCityOrLgaChange(e.target.value)}
            placeholder="e.g. City or Municipal District name"
            disabled={disabled}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};

