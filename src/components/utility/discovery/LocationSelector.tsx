import React from 'react';
import { MapPin, Globe, Building } from 'lucide-react';
import { getSubdivisionInfo, COUNTRY_SUBDIVISIONS_MAP } from '../../../data/countrySubdivisions';

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

export const NIGERIAN_STATES = COUNTRY_SUBDIVISIONS_MAP.NG.subdivisions;

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  countryCode,
  state = '',
  cityOrLga = '',
  availableCountries = [
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'TR', name: 'Turkey / Türkiye', flag: '🇹🇷' },
    { code: 'GLOBAL', name: 'Global / International', flag: '🌐' }
  ],
  availableStates,
  onCountryChange,
  onStateChange,
  onCityOrLgaChange,
  showStateSelector = true,
  showCitySelector = false,
  stateLabel,
  disabled = false
}) => {
  const subInfo = getSubdivisionInfo(countryCode);
  const resolvedStates = availableStates !== undefined ? availableStates : subInfo.subdivisions;
  const computedStateLabel = stateLabel || (subInfo.subdivisionName ? `${subInfo.subdivisionName} / Region` : 'State / Region');

  return (
    <div className="space-y-3 w-full">
      {/* Country Select */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          Country / Region
        </label>
        <select
          value={countryCode}
          onChange={(e) => {
            onCountryChange(e.target.value);
            onStateChange('');
          }}
          disabled={disabled}
          className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50"
        >
          <option value="">Select Country...</option>
          {availableCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag ? `${c.flag} ` : ''}{c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State / Province Select */}
      {showStateSelector && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            {computedStateLabel}
          </label>
          {resolvedStates.length > 0 ? (
            <select
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              disabled={disabled || !countryCode}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
            >
              <option value="">All {subInfo.subdivisionName ? `${subInfo.subdivisionName}s` : 'States'} / Regions</option>
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
              placeholder={`e.g. ${subInfo.subdivisionName || 'State or Province'} name`}
              disabled={disabled || !countryCode}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
            />
          )}
        </div>
      )}

      {/* City / LGA Select */}
      {showCitySelector && onCityOrLgaChange && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            City / District
          </label>
          <input
            type="text"
            value={cityOrLga}
            onChange={(e) => onCityOrLgaChange(e.target.value)}
            placeholder="e.g. City or Municipal District"
            disabled={disabled || !countryCode}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};
