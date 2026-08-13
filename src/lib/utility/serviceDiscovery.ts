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
 * Filter utility providers by state or province name.
 */
export function filterProvidersByState(
  providers: UtilityServiceProvider[],
  state?: string
): UtilityServiceProvider[] {
  if (!state || state.trim() === '' || state.toUpperCase() === 'ALL') {
    return providers;
  }

  const targetState = state.trim().toLowerCase();
  return providers.filter((p) => {
    if (p.state && p.state.toLowerCase() === targetState) {
      return true;
    }
    // Also check if provider name or designations explicitly contain the state name
    const pName = p.name.toLowerCase();
    if (pName.includes(targetState)) {
      return true;
    }
    if (p.designations && p.designations.some((d) => d.toLowerCase().includes(targetState))) {
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
    if (p.accountLabel.toLowerCase().includes(q)) return true;
    if (p.institutionName && p.institutionName.toLowerCase().includes(q)) return true;
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

  if (criteria.countryCode && criteria.countryCode !== 'GLOBAL' && criteria.countryCode !== 'ALL') {
    filtered = filterProvidersByCountry(filtered, criteria.countryCode);
  }

  if (criteria.state) {
    filtered = filterProvidersByState(filtered, criteria.state);
  }

  if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
    filtered = searchProviders(filtered, criteria.searchQuery);
  }

  if (criteria.institutionType && criteria.institutionType !== 'all') {
    filtered = filtered.filter(
      (p) =>
        p.institutionType === criteria.institutionType ||
        (criteria.institutionType === 'exam_board' && p.category === 'exam')
    );
  }

  const items: InstitutionSearchResultItem[] = filtered.map((p) => ({
    providerId: p.id,
    institutionName: p.institutionName || p.name,
    institutionCode: p.institutionCode,
    institutionType: p.institutionType || (p.category === 'exam' ? 'exam_board' : 'university'),
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
