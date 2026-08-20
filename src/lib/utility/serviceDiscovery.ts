import {
  UtilityServiceProvider,
  UtilityCategoryType,
  TransportSearchCriteria,
  TransportSearchResult,
  TransportSearchResultItem,
  LocationDiscoveryCriteria,
  LocationDiscoveryResult,
  InstitutionSearchCriteria,
  InstitutionSearchResult,
  InstitutionSearchResultItem,
  GovernmentSearchCriteria,
  GovernmentSearchResult,
  GovernmentSearchResultItem,
  GenericServiceDiscoveryRequest,
  GenericServiceDiscoveryResult,
  ElectricityResolutionResult
} from '../../types/utility';
import { resolveSubdivisionCode } from '../../data/countrySubdivisions';
import { resolveElectricityProviders } from './electricityDiscovery';
import {
  VERIFIED_TRANSPORT_PROVIDERS,
  VERIFIED_TRANSPORT_ROUTES,
  TRANSIT_STATIONS,
  TransportRouteDefinition,
  TransitStation
} from '../../data/transportData';

/**
 * Filter utility providers by country name or 2-letter / ISO country code.
 */
export function filterProvidersByCountry(
  providers: UtilityServiceProvider[],
  countryOrCode: string
): UtilityServiceProvider[] {
  if (!countryOrCode || countryOrCode === 'ALL' || countryOrCode === 'GLOBAL') {
    return providers;
  }

  const query = countryOrCode.trim().toLowerCase();
  return providers.filter((p) => {
    const pCountry = p.country ? p.country.toLowerCase() : '';
    const pCode = p.countryCode ? p.countryCode.toLowerCase() : '';
    return pCountry === query || pCode === query || pCountry.includes(query);
  });
}

/**
 * Filter utility providers by state, province, or administrative subdivision.
 */
export function filterProvidersByState(
  providers: UtilityServiceProvider[],
  stateOrSubdivision?: string
): UtilityServiceProvider[] {
  if (!stateOrSubdivision || stateOrSubdivision.trim() === '' || stateOrSubdivision.toUpperCase() === 'ALL') {
    return providers;
  }

  const rawTarget = stateOrSubdivision.trim();
  const target = rawTarget.toLowerCase();

  return providers.filter((p) => {
    // 1. Direct subdivisionCode match or resolved match
    if (p.subdivisionCode) {
      if (p.subdivisionCode.toLowerCase() === target) {
        return true;
      }
      if (p.countryCode) {
        const resolvedCode = resolveSubdivisionCode(p.countryCode, p.subdivisionCode).toLowerCase();
        const targetResolvedCode = resolveSubdivisionCode(p.countryCode, rawTarget).toLowerCase();
        if (resolvedCode && targetResolvedCode && resolvedCode === targetResolvedCode) {
          return true;
        }
      }
    }

    // 2. Direct state attribute match
    if (p.state) {
      const pState = p.state.toLowerCase();
      if (pState === target) {
        return true;
      }
      if (
        (pState.includes('abuja') && target.includes('abuja')) ||
        (p.countryCode && resolveSubdivisionCode(p.countryCode, p.state).toLowerCase() === resolveSubdivisionCode(p.countryCode, rawTarget).toLowerCase())
      ) {
        return true;
      }
    }

    // 3. Multi-subdivision coverage array
    if (p.supportedSubdivisions && p.supportedSubdivisions.some((sub) => {
      const subLower = sub.toLowerCase();
      if (subLower === target) return true;
      if (p.countryCode) {
        const subResolved = resolveSubdivisionCode(p.countryCode, sub).toLowerCase();
        const targetResolved = resolveSubdivisionCode(p.countryCode, rawTarget).toLowerCase();
        if (subResolved && targetResolved && subResolved === targetResolved) return true;
      }
      return false;
    })) {
      return true;
    }

    // 4. Multi-state coverage array
    if (p.supportedStates && p.supportedStates.some((s) => {
      const sLower = s.toLowerCase();
      if (sLower === target) return true;
      if (sLower.includes('abuja') && target.includes('abuja')) return true;
      if (p.countryCode) {
        const sResolved = resolveSubdivisionCode(p.countryCode, s).toLowerCase();
        const targetResolved = resolveSubdivisionCode(p.countryCode, rawTarget).toLowerCase();
        if (sResolved && targetResolved && sResolved === targetResolved) return true;
      }
      return false;
    })) {
      return true;
    }

    return false;
  });
}

/**
 * Filter utility providers by city or Local Government Area (LGA).
 */
export function filterProvidersByCityOrLga(
  providers: UtilityServiceProvider[],
  cityOrLga?: string
): UtilityServiceProvider[] {
  if (!cityOrLga || cityOrLga.trim() === '') {
    return providers;
  }

  const query = cityOrLga.trim().toLowerCase();
  return providers.filter((p) => {
    if (p.city && p.city.toLowerCase().includes(query)) return true;
    if (p.lga && p.lga.toLowerCase().includes(query)) return true;
    if (p.name.toLowerCase().includes(query)) return true;
    return false;
  });
}

/**
 * Fuzzy search providers by text query and optional category filter.
 */
export function searchProviders(
  providers: UtilityServiceProvider[],
  query: string,
  category?: UtilityCategoryType
): UtilityServiceProvider[] {
  let filtered = providers;

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (!query || query.trim() === '') {
    return filtered;
  }

  const q = query.trim().toLowerCase();
  return filtered.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.country.toLowerCase().includes(q)) return true;
    if (p.countryCode && p.countryCode.toLowerCase().includes(q)) return true;
    if (p.state && p.state.toLowerCase().includes(q)) return true;
    if (p.subdivisionCode && p.subdivisionCode.toLowerCase().includes(q)) return true;
    if (p.accountLabel.toLowerCase().includes(q)) return true;
    if (p.institutionName && p.institutionName.toLowerCase().includes(q)) return true;
    if (p.institutionCode && p.institutionCode.toLowerCase().includes(q)) return true;
    if (p.institutionAliases && p.institutionAliases.some((a) => a.toLowerCase().includes(q))) return true;
    if (p.designations && p.designations.some((d) => d.toLowerCase().includes(q))) return true;
    if (p.packages && p.packages.some((pkg) => pkg.name.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Hierarchical discovery resolution for Water utility providers.
 * Correctly identifies when a state has a verified digital service vs when it lacks one.
 */
export function resolveWaterProviders(
  providers: UtilityServiceProvider[],
  countryCode: string,
  state?: string
): LocationDiscoveryResult {
  const waterProviders = providers.filter((p) => p.category === 'water');
  const countryFiltered = filterProvidersByCountry(waterProviders, countryCode);

  let finalProviders = countryFiltered;
  if (state && state.trim() !== '' && state.toUpperCase() !== 'ALL') {
    finalProviders = filterProvidersByState(countryFiltered, state);
  }

  const countryName = countryFiltered.length > 0 ? countryFiltered[0].country : countryCode;
  const hasVerified = finalProviders.length > 0;

  let statusMessage = '';
  if (hasVerified) {
    statusMessage = state
      ? `Verified digital water utility provider(s) available for ${state}, ${countryName}.`
      : `Verified digital water utility provider(s) available for ${countryName}.`;
  } else {
    statusMessage = state
      ? `No verified digital water billing service available for ${state}, ${countryName}.`
      : `No verified digital water billing service available for ${countryName}.`;
  }

  return {
    countryCode,
    countryName,
    state,
    availableProviders: finalProviders,
    hasVerifiedService: hasVerified,
    statusMessage
  };
}

/**
 * Resolve the normalized institution type for any provider (with deterministic fallbacks).
 */
export function resolveInstitutionType(
  provider: UtilityServiceProvider
): 'university' | 'polytechnic' | 'college' | 'exam_board' | 'e_learning' | 'secondary' {
  if (provider.institutionType) {
    return provider.institutionType;
  }
  if (provider.category === 'exam' || provider.id.startsWith('prov-exam-')) {
    return 'exam_board';
  }
  const nameLower = (provider.name || '').toLowerCase();
  const idLower = (provider.id || '').toLowerCase();
  if (
    idLower.includes('global') ||
    idLower.includes('coursera') ||
    idLower.includes('edx') ||
    idLower.includes('udemy') ||
    nameLower.includes('coursera') ||
    nameLower.includes('edx') ||
    nameLower.includes('udemy') ||
    nameLower.includes('e-learning') ||
    nameLower.includes('learning')
  ) {
    return 'e_learning';
  }
  if (nameLower.includes('polytechnic') || nameLower.includes('poly')) {
    return 'polytechnic';
  }
  if (nameLower.includes('college') || nameLower.includes('fce') || nameLower.includes('coe')) {
    return 'college';
  }
  return 'university';
}

/**
 * Get dynamic institution counts by type for a given country and optional state filter.
 */
export function getInstitutionCountsByType(
  providers: UtilityServiceProvider[],
  countryCode: string,
  state?: string
): {
  all: number;
  university: number;
  polytechnic: number;
  college: number;
  exam_board: number;
  e_learning: number;
} {
  const eduProviders = providers.filter(
    (p) => p.category === 'education' || p.category === 'exam'
  );

  let filtered = eduProviders;
  if (countryCode && countryCode !== 'GLOBAL' && countryCode !== 'ALL') {
    filtered = filterProvidersByCountry(filtered, countryCode);
  }

  if (state && state.trim() !== '' && state.toUpperCase() !== 'ALL') {
    filtered = filtered.filter((p) => {
      const type = resolveInstitutionType(p);
      if (type === 'exam_board') return true;
      return filterProvidersByState([p], state).length > 0;
    });
  }

  const counts = {
    all: filtered.length,
    university: 0,
    polytechnic: 0,
    college: 0,
    exam_board: 0,
    e_learning: 0
  };

  filtered.forEach((p) => {
    const t = resolveInstitutionType(p);
    if (counts[t] !== undefined) {
      counts[t]++;
    }
  });

  return counts;
}

/**
 * Search and resolve educational institutions (universities, colleges, exam boards, e-learning platforms).
 */
export function searchInstitutions(
  providers: UtilityServiceProvider[],
  criteria: InstitutionSearchCriteria
): InstitutionSearchResult {
  const eduProviders = providers.filter(
    (p) => p.category === 'education' || p.category === 'exam'
  );

  let filtered = eduProviders;

  // 1. Country Filter
  if (criteria.countryCode && criteria.countryCode !== 'GLOBAL' && criteria.countryCode !== 'ALL') {
    filtered = filterProvidersByCountry(filtered, criteria.countryCode);
  }

  // 2. Region / State Filter
  if (criteria.state && criteria.state.trim() !== '' && criteria.state.toUpperCase() !== 'ALL') {
    if (criteria.institutionType === 'exam_board') {
      filtered = filtered.filter((p) => {
        if (p.category === 'exam' || resolveInstitutionType(p) === 'exam_board') {
          return true;
        }
        return filterProvidersByState([p], criteria.state).length > 0;
      });
    } else {
      filtered = filterProvidersByState(filtered, criteria.state);
    }
  }

  // 3. Institution Type Filter
  if (criteria.institutionType && criteria.institutionType !== 'all') {
    filtered = filtered.filter((p) => {
      const resolvedType = resolveInstitutionType(p);
      return resolvedType === criteria.institutionType;
    });
  }

  // 4. Text Search Query Filter
  if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
    filtered = searchProviders(filtered, criteria.searchQuery);
  }

  const items: InstitutionSearchResultItem[] = filtered.map((p) => ({
    providerId: p.id,
    institutionName: p.institutionName || p.name,
    institutionCode: p.institutionCode,
    institutionType: resolveInstitutionType(p),
    country: p.country,
    countryCode: p.countryCode || 'GLOBAL',
    state: p.state,
    availableServices: p.designations || ['Student Fee Payment', 'Tuition Clearance'],
    matchedAliases: p.institutionAliases,
    packages: p.packages
  }));

  return {
    criteria,
    institutions: items,
    totalMatches: items.length
  };
}

/**
 * Resolve government agencies and civic service payment portals.
 */
export function resolveGovernmentServices(
  providers: UtilityServiceProvider[],
  criteria: GovernmentSearchCriteria
): GovernmentSearchResult {
  const govProviders = providers.filter((p) => p.category === 'government');

  let filtered = filterProvidersByCountry(govProviders, criteria.countryCode);

  if (criteria.state) {
    filtered = filterProvidersByState(filtered, criteria.state);
  }

  if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
    filtered = searchProviders(filtered, criteria.searchQuery);
  }

  if (criteria.jurisdictionLevel && criteria.jurisdictionLevel !== 'all') {
    filtered = filtered.filter((p) => p.jurisdictionLevel === criteria.jurisdictionLevel);
  }

  if (criteria.agencyType && criteria.agencyType !== 'all') {
    filtered = filtered.filter((p) => p.agencyType === criteria.agencyType);
  }

  const items: GovernmentSearchResultItem[] = filtered.map((p) => ({
    providerId: p.id,
    agencyName: p.name,
    agencyType: p.agencyType || 'federal',
    country: p.country,
    countryCode: p.countryCode || 'GLOBAL',
    state: p.state,
    referenceLabel: p.accountLabel || 'Reference ID / RRR / Taxpayer ID',
    availableServices: p.designations || ['Government Tax Settlement', 'Civic Fee Clearance'],
    packages: p.packages,
    hasDirectValidationApi: Boolean(p.hasDirectValidationApi)
  }));

  return {
    criteria,
    agencies: items,
    totalFound: items.length
  };
}

/**
 * Constructs a sanitized TransportSearchCriteria instance with safe defaults.
 */
export function constructTransportSearchCriteria(
  params: Partial<TransportSearchCriteria>
): TransportSearchCriteria {
  return {
    transportType: params.transportType || 'all',
    originCode: (params.originCode || '').toUpperCase().trim(),
    destinationCode: (params.destinationCode || '').toUpperCase().trim(),
    departureDate: params.departureDate || new Date().toISOString().split('T')[0],
    returnDate: params.returnDate,
    tripType: params.tripType || (params.returnDate ? 'round_trip' : 'one_way'),
    passengers: {
      adults: params.passengers?.adults ?? 1,
      children: params.passengers?.children ?? 0,
      infants: params.passengers?.infants ?? 0
    },
    cabinClass: params.cabinClass || 'economy',
    countryCode: params.countryCode
  };
}

/**
 * Normalizes transit terminal, station, city, or alias query string.
 */
export function normalizeTransitTerm(term: string): string {
  if (!term) return '';
  return term
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

/**
 * Resolves a given station code, city name, or alias against the canonical transit station registry.
 */
export function resolveTransitStation(query: string): TransitStation | undefined {
  if (!query || !query.trim()) return undefined;
  const clean = normalizeTransitTerm(query);
  if (!clean) return undefined;

  return TRANSIT_STATIONS.find((st) => {
    if (normalizeTransitTerm(st.code) === clean) return true;
    if (normalizeTransitTerm(st.city) === clean) return true;
    if (normalizeTransitTerm(st.name).includes(clean) || clean.includes(normalizeTransitTerm(st.name))) return true;
    if (st.aliases.some((a) => normalizeTransitTerm(a) === clean || clean.includes(normalizeTransitTerm(a)) || normalizeTransitTerm(a).includes(clean))) return true;
    return false;
  });
}

/**
 * Checks if a given query matches a station's code, city, name, aliases, or intermediate corridor stops.
 */
export function matchesStationOrCity(
  query: string,
  stationCode: string,
  stationCity: string,
  stationName: string,
  aliases?: string[],
  stops?: string[]
): boolean {
  if (!query || !query.trim()) return true;
  const cleanQuery = normalizeTransitTerm(query);
  if (!cleanQuery) return true;

  // Direct code match (e.g. "ABV", "KAD", "LOS", "NYP", "WAS")
  if (normalizeTransitTerm(stationCode) === cleanQuery) return true;

  // City match (e.g. "ABUJA", "KADUNA", "LAGOS", "NEW YORK")
  const cleanCity = normalizeTransitTerm(stationCity);
  if (cleanCity === cleanQuery || cleanCity.includes(cleanQuery) || cleanQuery.includes(cleanCity)) return true;

  // Station full name match
  const cleanName = normalizeTransitTerm(stationName);
  if (cleanName === cleanQuery || cleanName.includes(cleanQuery) || cleanQuery.includes(cleanName)) return true;

  // Station aliases match
  if (aliases && aliases.length > 0) {
    if (aliases.some((a) => {
      const cleanAlias = normalizeTransitTerm(a);
      return cleanAlias === cleanQuery || cleanAlias.includes(cleanQuery) || cleanQuery.includes(cleanAlias);
    })) {
      return true;
    }
  }

  // Registry alias fallback
  const resolved = resolveTransitStation(query);
  if (resolved) {
    if (normalizeTransitTerm(resolved.code) === normalizeTransitTerm(stationCode)) return true;
    if (normalizeTransitTerm(resolved.city) === cleanCity) return true;
  }

  // Intermediate stops match (if query specifies a stop along this corridor)
  if (stops && stops.length > 0) {
    if (stops.some((s) => {
      const cleanStop = normalizeTransitTerm(s);
      return cleanStop === cleanQuery || cleanStop.includes(cleanQuery) || cleanQuery.includes(cleanStop);
    })) {
      return true;
    }
  }

  return false;
}

/**
 * Canonical route-aware matcher: Evaluates whether a transport route satisfies the hard routing constraints.
 * Hierarchy: Origin -> Destination -> Country/Region -> Transport Mode -> Route Corridor -> Available Operators
 */
export function matchesTransportRoute(
  route: TransportRouteDefinition,
  criteria: TransportSearchCriteria
): boolean {
  // 1. Transport Mode Constraint (rail, bus, bus_line)
  if (criteria.transportType && criteria.transportType !== 'all') {
    if (criteria.transportType === 'bus' || criteria.transportType === 'bus_line') {
      if (route.transportType !== 'bus') {
        return false;
      }
    } else if (route.transportType !== criteria.transportType) {
      return false;
    }
  }

  // 2. Country / Region Constraint
  if (criteria.countryCode && criteria.countryCode !== 'ALL' && criteria.countryCode !== 'GLOBAL') {
    const targetCountry = criteria.countryCode.toUpperCase().trim();
    const matchesCountry =
      route.originCountryCode.toUpperCase() === targetCountry ||
      route.destinationCountryCode.toUpperCase() === targetCountry ||
      normalizeTransitTerm(route.originCountry).includes(normalizeTransitTerm(targetCountry)) ||
      normalizeTransitTerm(route.destinationCountry).includes(normalizeTransitTerm(targetCountry));

    if (!matchesCountry) {
      return false;
    }
  }

  // 3. HARD DESTINATION CONSTRAINT
  // If destination is specified, the route MUST serve this destination station/city/alias or corridor stop.
  const destQuery = criteria.destinationCode?.trim();
  if (destQuery && destQuery.length > 0) {
    const destStation = resolveTransitStation(destQuery);
    const destAliases = destStation?.aliases || [];
    const isDestMatch = matchesStationOrCity(
      destQuery,
      route.destinationCode,
      route.destinationCity,
      route.destinationName,
      destAliases,
      route.stops
    );

    if (!isDestMatch) {
      return false;
    }
  }

  // 4. HARD ORIGIN CONSTRAINT
  // If origin is specified, the route MUST originate from or serve this origin station/city/alias or corridor stop.
  const origQuery = criteria.originCode?.trim();
  if (origQuery && origQuery.length > 0) {
    const origStation = resolveTransitStation(origQuery);
    const origAliases = origStation?.aliases || [];
    const isOrigMatch = matchesStationOrCity(
      origQuery,
      route.originCode,
      route.originCity,
      route.originName,
      origAliases,
      route.stops
    );

    if (!isOrigMatch) {
      return false;
    }
  }

  // 5. Origin and Destination cannot be the exact same terminal unless it's a loop/transit card
  if (origQuery && destQuery) {
    const cleanOrig = normalizeTransitTerm(origQuery);
    const cleanDest = normalizeTransitTerm(destQuery);
    if (cleanOrig === cleanDest && cleanOrig.length > 0) {
      return false;
    }
  }

  return true;
}

/**
 * Searches transport routes and operators based on transport criteria.
 * Operates deterministically against verified dataset transport carriers and route corridors.
 */
export function searchTransportRoutes(
  providers: UtilityServiceProvider[],
  criteria: TransportSearchCriteria
): TransportSearchResult {
  // Combine input providers with system verified transport providers
  const allProvidersMap = new Map<string, UtilityServiceProvider>();
  [...providers, ...VERIFIED_TRANSPORT_PROVIDERS].forEach((p) => {
    if (p.category === 'transport') {
      allProvidersMap.set(p.id, p);
    }
  });

  // Filter routes using canonical matchesTransportRoute
  const matchedRoutes = VERIFIED_TRANSPORT_ROUTES.filter((route) =>
    matchesTransportRoute(route, criteria)
  );

  const results: TransportSearchResultItem[] = [];
  const matchingProviderIds = new Set<string>();

  matchedRoutes.forEach((route) => {
    const provider = allProvidersMap.get(route.providerId) || VERIFIED_TRANSPORT_PROVIDERS.find(p => p.id === route.providerId);
    matchingProviderIds.add(route.providerId);

    // Calculate class fare
    let fare = route.fiatFare;
    let badge = route.transportType === 'rail' 
      ? 'Verified Rail Express' 
      : criteria.transportType === 'bus_line' 
        ? 'Verified Highway Bus Line' 
        : 'Verified Coach Pass';
        
    if (criteria.cabinClass && criteria.cabinClass !== 'economy') {
      const matchClass = route.classOptions.find(
        (c) => c.id.includes(criteria.cabinClass!) || c.name.toLowerCase().includes(criteria.cabinClass!)
      );
      if (matchClass) {
        fare = matchClass.fiatPrice;
        badge = matchClass.badge || 'VIP';
      }
    }

    const depTime = route.departureTimes[0] || '08:00';
    const departureFormatted = `${criteria.departureDate} ${depTime}`;
    const tripNumber = `${route.transportType === 'rail' ? 'TRN' : 'BUS'}-${route.originCode}${route.destinationCode}-${depTime.replace(':', '')}`;

    results.push({
      id: `trip-${route.id}-${criteria.originCode || route.originCode}-${criteria.destinationCode || route.destinationCode}`,
      providerId: route.providerId,
      providerName: route.providerName,
      providerLogo: provider?.logo,
      transportType: route.transportType,
      originCode: route.originCode,
      originCity: `${route.originCity} (${route.originName})`,
      destinationCode: route.destinationCode,
      destinationCity: `${route.destinationCity} (${route.destinationName})`,
      departureTime: departureFormatted,
      arrivalTime: `${criteria.departureDate} (+${route.duration})`,
      flightOrTripNumber: tripNumber,
      duration: route.duration,
      corridorName: route.corridorName,
      distanceKm: route.distanceKm,
      frequency: route.frequency,
      stops: route.stops,
      fiatFare: fare,
      currency: route.currency,
      badge: badge,
      isAvailable: true,
      notes: `PSTP Guaranteed Transit on ${route.corridorName}`
    });
  });

  // Providers that match the filtered routes
  const matchingProviders = Array.from(matchingProviderIds)
    .map((id) => allProvidersMap.get(id))
    .filter((p): p is UtilityServiceProvider => p !== undefined);

  const originDisplay = criteria.originCode || 'Selected Origin';
  const destDisplay = criteria.destinationCode || 'Selected Destination';

  return {
    criteria,
    results,
    matchingProviders,
    totalFound: results.length,
    message:
      results.length > 0
        ? `Found ${results.length} verified ${criteria.transportType || 'transport'} route(s) for ${originDisplay} ➔ ${destDisplay}.`
        : `No verified ${criteria.transportType || 'transport'} services found for ${originDisplay} ➔ ${destDisplay}.`
  };
}

/**
 * Authoritative Route Resolver:
 * Single canonical entry point to resolve routes and matched services given mode, origin, and destination.
 */
export function resolveTransportRoute(
  providers: UtilityServiceProvider[],
  params: {
    mode: 'air' | 'rail' | 'bus' | 'bus_line' | 'all';
    origin: string;
    destination: string;
    departureDate?: string;
    returnDate?: string;
    tripType?: 'one_way' | 'round_trip';
    passengers?: { adults: number; children?: number; infants?: number };
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
    countryCode?: string;
  }
): TransportSearchResult {
  const criteria = constructTransportSearchCriteria({
    transportType: params.mode,
    originCode: params.origin.trim().toUpperCase(),
    destinationCode: params.destination.trim().toUpperCase(),
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    tripType: params.tripType,
    passengers: params.passengers,
    cabinClass: params.cabinClass,
    countryCode: params.countryCode
  });

  return searchTransportRoutes(providers, criteria);
}

/**
 * Determines whether a given provider or utility category supports the advanced Service Discovery workflow.
 */
export function supportsServiceDiscovery(
  providerOrCategory: UtilityServiceProvider | UtilityCategoryType
): boolean {
  if (typeof providerOrCategory === 'string') {
    const discoveryCategories: UtilityCategoryType[] = [
      'electricity',
      'transport',
      'water',
      'government',
      'education',
      'events'
    ];
    return discoveryCategories.includes(providerOrCategory);
  }

  if (!providerOrCategory) return false;

  const category = providerOrCategory.category;
  if (['electricity', 'transport', 'water', 'government', 'education', 'events'].includes(category)) {
    return true;
  }

  return Boolean(
    providerOrCategory.supportsLiveSearch ||
      providerOrCategory.state ||
      providerOrCategory.originCode ||
      providerOrCategory.institutionCode
  );
}

/**
 * Generic Service Discovery Engine router function.
 * Routes discovery requests to category-specific helper handlers.
 */
export function executeServiceDiscovery(
  providers: UtilityServiceProvider[],
  request: GenericServiceDiscoveryRequest
): GenericServiceDiscoveryResult {
  const isSupported = supportsServiceDiscovery(request.category);

  if (!isSupported) {
    const matching = searchProviders(providers, request.searchQuery || '', request.category);
    return {
      request,
      matchingProviders: matching,
      isSupported: false,
      statusMessage: `Category '${request.category}' uses standard utility selection.`
    };
  }

  let locationResult: LocationDiscoveryResult | undefined;
  let transportResult: TransportSearchResult | undefined;
  let institutionResult: InstitutionSearchResult | undefined;
  let governmentResult: GovernmentSearchResult | undefined;
  let electricityResult: ElectricityResolutionResult | undefined;
  let matchingProviders: UtilityServiceProvider[] = [];

  switch (request.category) {
    case 'electricity': {
      electricityResult = resolveElectricityProviders(
        {
          countryCode: request.countryCode,
          state: request.state
        },
        providers
      );
      matchingProviders = electricityResult.availableProviders;
      break;
    }
    case 'water': {
      locationResult = resolveWaterProviders(providers, request.countryCode, request.state);
      matchingProviders = locationResult.availableProviders;
      break;
    }
    case 'education': {
      institutionResult = searchInstitutions(providers, {
        countryCode: request.countryCode,
        state: request.state,
        searchQuery: request.searchQuery,
        ...request.institutionParams
      });
      matchingProviders = providers.filter((p) =>
        institutionResult?.institutions.some((item) => item.providerId === p.id)
      );
      break;
    }
    case 'government': {
      governmentResult = resolveGovernmentServices(providers, {
        countryCode: request.countryCode,
        state: request.state,
        searchQuery: request.searchQuery,
        ...request.governmentParams
      });
      matchingProviders = providers.filter((p) =>
        governmentResult?.agencies.some((item) => item.providerId === p.id)
      );
      break;
    }
    case 'transport': {
      if (request.transportParams) {
        transportResult = searchTransportRoutes(providers, request.transportParams);
        matchingProviders = transportResult.matchingProviders;
      } else {
        matchingProviders = filterProvidersByCountry(
          providers.filter((p) => p.category === 'transport'),
          request.countryCode
        );
      }
      break;
    }
    default: {
      matchingProviders = searchProviders(providers, request.searchQuery || '', request.category);
      break;
    }
  }

  return {
    request,
    matchingProviders,
    locationResult,
    transportResult,
    institutionResult,
    governmentResult,
    electricityResult,
    isSupported: true,
    statusMessage: `Discovery completed for category '${request.category}'.`
  };
}
