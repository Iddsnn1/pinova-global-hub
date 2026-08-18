import { ALL_GLOBAL_COUNTRIES, GlobalCountry, getCountryInfo, getCountryFlag, searchGlobalCountries } from './countriesData';

export * from './countriesData';

export interface CountrySubdivisionItem {
  name: string;
  code: string;
}

export interface CountrySubdivisionInfo {
  countryCode: string;
  countryName: string;
  subdivisionName: string; // e.g. State, Region, County, Province, Emirate, Governorate
  subdivisions: string[];
  subdivisionItems?: CountrySubdivisionItem[];
}

export const COUNTRY_SUBDIVISIONS_MAP: Record<string, CountrySubdivisionInfo> = {};

// Dynamically populate from the canonical global dataset
ALL_GLOBAL_COUNTRIES.forEach((c) => {
  const code = c.code.toUpperCase();
  const subItems: CountrySubdivisionItem[] = c.subdivisionItems
    ? c.subdivisionItems.map((item) => ({ name: item.name, code: item.code }))
    : c.subdivisions.map((s, idx) => ({
        name: s,
        code: `${code}-${s.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase() || idx + 1}`
      }));

  COUNTRY_SUBDIVISIONS_MAP[code] = {
    countryCode: code,
    countryName: c.name,
    subdivisionName: c.subdivisionType || 'State / Region',
    subdivisions: c.subdivisions || [],
    subdivisionItems: subItems
  };
});

export function getSubdivisionInfo(countryCode: string): CountrySubdivisionInfo {
  const code = (countryCode || '').trim().toUpperCase();
  if (COUNTRY_SUBDIVISIONS_MAP[code]) {
    return COUNTRY_SUBDIVISIONS_MAP[code];
  }
  
  const cInfo = getCountryInfo(code);
  if (cInfo) {
    return {
      countryCode: cInfo.code,
      countryName: cInfo.name,
      subdivisionName: cInfo.subdivisionType || 'State / Region',
      subdivisions: cInfo.subdivisions || [],
      subdivisionItems: cInfo.subdivisionItems || cInfo.subdivisions.map((s, idx) => ({
        name: s,
        code: `${cInfo.code}-${s.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase() || idx + 1}`
      }))
    };
  }

  return {
    countryCode: code,
    countryName: code || 'Global',
    subdivisionName: 'State / Region',
    subdivisions: []
  };
}

export function resolveSubdivisionCode(countryCode: string, subdivisionNameOrCode: string): string {
  if (!subdivisionNameOrCode) return '';
  const norm = subdivisionNameOrCode.trim();
  const info = getSubdivisionInfo(countryCode);
  if (info.subdivisionItems) {
    const found = info.subdivisionItems.find(
      (item) => item.code.toUpperCase() === norm.toUpperCase() || item.name.toLowerCase() === norm.toLowerCase()
    );
    if (found) return found.code;
  }
  // Generate standard prefix if not in map
  return `${(countryCode || 'GL').toUpperCase()}-${norm.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase()}`;
}
