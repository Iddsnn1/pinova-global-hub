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

/**
 * Normalizes any country input (ISO-2 code, ISO-3 code, or full country name)
 * into a standardized 2-letter uppercase ISO country code.
 * If 'ALL' or 'GLOBAL' is provided, returns 'ALL'.
 * If an invalid or unresolvable country is provided, returns the trimmed uppercase string
 * so downstream queries will safely yield 0 results instead of skipping the filter.
 */
export function normalizeCountryCode(countryOrCode?: string): string | undefined {
  if (!countryOrCode) return undefined;
  const trimmed = countryOrCode.trim();
  if (!trimmed) return undefined;
  const upper = trimmed.toUpperCase();
  if (upper === 'ALL' || upper === 'GLOBAL') {
    return 'ALL';
  }

  const info = getCountryInfo(trimmed);
  if (info) {
    return info.code;
  }

  return upper;
}

/**
 * Authoritative parent-region to sub-entity / county / alias relationships.
 * Allows standardized regions (like UK 'South East England') to cleanly resolve
 * institutions located in specific counties (like 'Oxfordshire').
 */
export const SUBDIVISION_PARENT_MAP: Record<string, Record<string, string[]>> = {
  GB: {
    'South East England': [
      'Oxfordshire',
      'Berkshire',
      'Buckinghamshire',
      'Hampshire',
      'Isle of Wight',
      'Kent',
      'Surrey',
      'East Sussex',
      'West Sussex',
      'Oxford',
      'Reading',
      'Brighton',
      'Southampton',
      'Portsmouth'
    ],
    'Greater London': [
      'London',
      'City of London',
      'Westminster',
      'Camden',
      'Greenwich',
      'Kensington',
      'Islington'
    ],
    'North West England': [
      'Lancashire',
      'Greater Manchester',
      'Merseyside',
      'Cheshire',
      'Cumbria',
      'Manchester',
      'Liverpool'
    ],
    'West Midlands': [
      'West Midlands County',
      'Staffordshire',
      'Warwickshire',
      'Worcestershire',
      'Shropshire',
      'Herefordshire',
      'Birmingham',
      'Coventry',
      'Wolverhampton'
    ],
    'South West England': [
      'Bristol',
      'Cornwall',
      'Devon',
      'Dorset',
      'Gloucestershire',
      'Somerset',
      'Wiltshire'
    ],
    'East of England': [
      'Bedfordshire',
      'Cambridgeshire',
      'Essex',
      'Hertfordshire',
      'Norfolk',
      'Suffolk',
      'Cambridge'
    ],
    'East Midlands': [
      'Derbyshire',
      'Leicestershire',
      'Lincolnshire',
      'Northamptonshire',
      'Nottinghamshire',
      'Rutland'
    ],
    'Yorkshire and the Humber': [
      'North Yorkshire',
      'South Yorkshire',
      'West Yorkshire',
      'East Riding of Yorkshire',
      'Leeds',
      'Sheffield'
    ],
    'North East England': [
      'County Durham',
      'Northumberland',
      'Tyne and Wear',
      'Newcastle',
      'Sunderland'
    ],
    'Scotland': [
      'Edinburgh',
      'Glasgow',
      'Aberdeen',
      'Dundee',
      'Inverness',
      'Highlands'
    ],
    'Wales': [
      'Cardiff',
      'Swansea',
      'Newport',
      'Wrexham'
    ],
    'Northern Ireland': [
      'Belfast',
      'Derry',
      'Lisburn',
      'Newry',
      'Antrim',
      'Down'
    ]
  },
  NG: {
    'Federal Capital Territory': ['FCT', 'Abuja', 'Federal Capital Territory (Abuja)', 'F.C.T.'],
    'Lagos': ['Lagos State'],
    'Kano': ['Kano State']
  },
  US: {
    'California': ['CA', 'Calif.'],
    'New York': ['NY'],
    'Texas': ['TX'],
    'Massachusetts': ['MA'],
    'Washington': ['WA'],
    'Illinois': ['IL']
  },
  GH: {
    'Greater Accra': ['Accra', 'Accra Metropolis', 'Legon'],
    'Ashanti': ['Kumasi']
  }
};

/**
 * Normalizes or resolves whether a candidate state/county/subdivision matches or belongs
 * to a target subdivision or parent region for a given country.
 */
export function matchesSubdivision(
  countryCode: string | undefined,
  candidateSubdivision: string | undefined,
  targetSubdivision: string | undefined
): boolean {
  if (!targetSubdivision || targetSubdivision.toLowerCase() === 'all') return true;
  if (!candidateSubdivision) return false;

  const target = targetSubdivision.trim().toLowerCase();
  const candidate = candidateSubdivision.trim().toLowerCase();

  // 1. Direct case-insensitive match
  if (target === candidate) return true;

  // 2. Check parent-region and alias relationships
  const cCode = countryCode ? normalizeCountryCode(countryCode) : undefined;
  if (cCode && SUBDIVISION_PARENT_MAP[cCode]) {
    const countryMap = SUBDIVISION_PARENT_MAP[cCode];

    // Check if target is a parent region containing candidate
    for (const [parentRegion, children] of Object.entries(countryMap)) {
      if (parentRegion.toLowerCase() === target) {
        if (children.some((c) => c.toLowerCase() === candidate)) {
          return true;
        }
      }
      // Check if candidate is a parent region and target is a child
      if (parentRegion.toLowerCase() === candidate) {
        if (children.some((c) => c.toLowerCase() === target)) {
          return true;
        }
      }
    }
  }

  // 3. Check subdivision code resolution (e.g. NG-KN vs Kano, US-CA vs California)
  if (cCode) {
    const resolvedCandidateCode = resolveSubdivisionCode(cCode, candidateSubdivision).toLowerCase();
    const resolvedTargetCode = resolveSubdivisionCode(cCode, targetSubdivision).toLowerCase();
    if (resolvedCandidateCode && resolvedTargetCode && resolvedCandidateCode === resolvedTargetCode) {
      return true;
    }
  }

  return false;
}
