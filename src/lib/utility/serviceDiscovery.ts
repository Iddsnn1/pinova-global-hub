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
  GenericServiceDiscoveryResult
} from '../../types/utility';
import { resolveSubdivisionCode } from '../../data/countrySubdivisions';

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
 * Searches transport routes and operators based on transport criteria.
 * Operates deterministically against verified dataset transport carriers.
 */
export function searchTransportRoutes(
  providers: UtilityServiceProvider[],
  criteria: TransportSearchCriteria
): TransportSearchResult {
  const transportProviders = providers.filter((p) => p.category === 'transport');

  let matchingProviders = transportProviders;

  if (criteria.countryCode) {
    const countryMatches = filterProvidersByCountry(transportProviders, criteria.countryCode);
    if (countryMatches.length > 0) {
      matchingProviders = countryMatches;
    }
  }

  const results: TransportSearchResultItem[] = [];

  matchingProviders.forEach((p) => {
    // Generate deterministic route result items for matching operators
    const baseFare = p.minCustomFiat || p.packages[0]?.fiatPrice || 30;

    results.push({
      id: `trip-${p.id}-${criteria.originCode}-${criteria.destinationCode}`,
      providerId: p.id,
      providerName: p.name,
      providerLogo: p.logo,
      transportType: p.transportType || 'air',
      originCode: criteria.originCode || 'ORIGIN',
      originCity: p.origin || criteria.originCode || 'Origin Station',
      destinationCode: criteria.destinationCode || 'DEST',
      destinationCity: p.destination || criteria.destinationCode || 'Destination Station',
      fiatFare: baseFare,
      currency: p.currency || 'USD',
      badge: p.packages[0]?.badge || 'Verified Transit Pass',
      isAvailable: true,
      notes: `Voucher / E-ticket Pass for ${p.name}`
    });
  });

  return {
    criteria,
    results,
    matchingProviders,
    totalFound: results.length,
    message:
      results.length > 0
        ? `Found ${results.length} travel option(s) for ${criteria.originCode} -> ${criteria.destinationCode}.`
        : `No transport routes found for ${criteria.originCode} -> ${criteria.destinationCode}.`
  };
}

/**
 * Determines whether a given provider or utility category supports the advanced Service Discovery workflow.
 */
export function supportsServiceDiscovery(
  providerOrCategory: UtilityServiceProvider | UtilityCategoryType
): boolean {
  if (typeof providerOrCategory === 'string') {
    const discoveryCategories: UtilityCategoryType[] = [
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
  if (['transport', 'water', 'government', 'education', 'events'].includes(category)) {
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
  let matchingProviders: UtilityServiceProvider[] = [];

  switch (request.category) {
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
    isSupported: true,
    statusMessage: `Discovery completed for category '${request.category}'.`
  };
}
