import {
  UtilityServiceProvider,
  ElectricityServiceArea,
  ElectricityResolutionCriteria,
  ElectricityResolutionResult,
  ElectricityMeterVerificationResult
} from '../../types/utility';
import {
  ELECTRICITY_PROVIDERS_MASTER,
  ELECTRICITY_SERVICE_AREAS,
  KNOWN_METER_RESOLVER_PREFIXES
} from '../../data/electricityData';
import { resolveSubdivisionCode } from '../../data/countrySubdivisions';

/**
 * Normalizes state or region name strings for resilient comparison.
 */
export function normalizeStateName(rawState?: string): string {
  if (!rawState) return '';
  const trimmed = rawState.trim().toLowerCase();
  if (trimmed === 'fct' || trimmed.includes('abuja') || trimmed.includes('federal capital')) {
    return 'federal capital territory';
  }
  return trimmed;
}

/**
 * Resolve electricity providers and granular service areas based on Country and State/Region.
 * Follows the non-1:1 hierarchical model (Country → State/Region → Service Area → Provider).
 */
export function resolveElectricityProviders(
  criteria: ElectricityResolutionCriteria,
  allProviders: UtilityServiceProvider[] = []
): ElectricityResolutionResult {
  const countryCode = (criteria.countryCode || 'NG').toUpperCase();
  const rawState = criteria.state || '';
  const normalizedState = normalizeStateName(rawState);

  // Combine built-in electricity providers with any passed in
  const elecProviders = [
    ...ELECTRICITY_PROVIDERS_MASTER,
    ...allProviders.filter(
      (p) => p.category === 'electricity' && !ELECTRICITY_PROVIDERS_MASTER.some((ep) => ep.id === p.id)
    )
  ];

  // 1. Filter providers by country
  const countryProviders = elecProviders.filter((p) => {
    const pCode = (p.countryCode || '').toUpperCase();
    const pCountry = (p.country || '').toUpperCase();
    return pCode === countryCode || pCountry === countryCode;
  });

  const countryName = countryProviders.length > 0 ? countryProviders[0].country : countryCode;

  // 2. If no state specified or ALL selected
  if (!rawState || rawState.toUpperCase() === 'ALL' || rawState.trim() === '') {
    return {
      countryCode,
      countryName,
      state: undefined,
      availableServiceAreas: ELECTRICITY_SERVICE_AREAS.filter((sa) => sa.countryCode === countryCode),
      availableProviders: countryProviders,
      requiresServiceAreaSelection: false,
      statusMessage: `Showing all available electricity distribution providers for ${countryName}. Select a state or service area to narrow down.`,
      isProviderResolved: countryProviders.length === 1,
      resolvedProvider: countryProviders.length === 1 ? countryProviders[0] : undefined
    };
  }

  // 3. Find service areas matching this state
  const matchingServiceAreas = ELECTRICITY_SERVICE_AREAS.filter((sa) => {
    if (sa.countryCode !== countryCode) return false;
    const saStateNorm = normalizeStateName(sa.state);
    if (saStateNorm === normalizedState) return true;
    if (saStateNorm.includes(normalizedState) || normalizedState.includes(saStateNorm)) return true;
    return false;
  });

  // 4. Find matching providers for this state
  const matchingProviderIds = new Set<string>();
  matchingServiceAreas.forEach((sa) => matchingProviderIds.add(sa.providerId));

  // Also check supportedStates array on providers
  const matchingProvidersFromMetadata = countryProviders.filter((p) => {
    if (matchingProviderIds.has(p.id)) return true;
    if (p.state && normalizeStateName(p.state) === normalizedState) return true;
    if (p.supportedStates && p.supportedStates.some((s) => normalizeStateName(s) === normalizedState)) {
      return true;
    }
    if (p.countryCode) {
      const pSub = resolveSubdivisionCode(p.countryCode, p.state || '').toLowerCase();
      const targetSub = resolveSubdivisionCode(p.countryCode, rawState).toLowerCase();
      if (pSub && targetSub && pSub === targetSub) return true;
    }
    return false;
  });

  const availableProviders = matchingProvidersFromMetadata;
  const isResolved = availableProviders.length === 1;
  const resolvedProvider = isResolved ? availableProviders[0] : undefined;

  // 5. Selected Service Area resolution
  let selectedServiceArea: ElectricityServiceArea | undefined;
  if (criteria.serviceAreaId) {
    selectedServiceArea = matchingServiceAreas.find((sa) => sa.id === criteria.serviceAreaId);
  } else if (matchingServiceAreas.length > 0) {
    // Default to primary service area if available
    selectedServiceArea = matchingServiceAreas.find((sa) => sa.isPrimary) || matchingServiceAreas[0];
  }

  // 6. Formulate precise context message
  let statusMessage = '';
  let requiresServiceAreaSelection = false;

  if (availableProviders.length === 0) {
    statusMessage = `Provider availability requires additional location or meter verification for ${rawState}, ${countryName}.`;
  } else if (availableProviders.length === 1) {
    const p = availableProviders[0];
    statusMessage = `Verified electricity distribution service for ${rawState} (${p.name}).`;
  } else {
    // Multi-provider state (e.g. Lagos with EKEDC/IKEDC, or Abia with APLE/EEDC)
    requiresServiceAreaSelection = true;
    const providerNames = availableProviders.map((p) => p.name).join(' and ');
    statusMessage = `${rawState} is served by multiple electricity providers (${providerNames}). Select your service area or verify your meter number for automatic provider routing.`;
  }

  return {
    countryCode,
    countryName,
    state: rawState,
    selectedServiceArea,
    availableServiceAreas: matchingServiceAreas,
    availableProviders,
    requiresServiceAreaSelection,
    statusMessage,
    isProviderResolved: isResolved,
    resolvedProvider
  };
}

/**
 * Identify likely provider and service-area based on meter prefixes or account patterns.
 * This is solely for provider identification / narrowing, NOT for customer verification.
 */
export function identifyLikelyElectricityProvider(
  meterNumber: string,
  countryCode: string = 'NG',
  preliminaryProviderId?: string
): {
  matched: boolean;
  providerId: string;
  providerName: string;
  serviceAreaName?: string;
  state?: string;
} {
  const cleanMeter = (meterNumber || '').replace(/[^a-zA-Z0-9]/g, '').trim();
  const cCode = countryCode.toUpperCase();

  const matchedPrefix = KNOWN_METER_RESOLVER_PREFIXES.find((p) => {
    return p.countryCode === cCode && cleanMeter.startsWith(p.prefix);
  });

  if (matchedPrefix) {
    return {
      matched: true,
      providerId: matchedPrefix.providerId,
      providerName: matchedPrefix.providerName,
      serviceAreaName: matchedPrefix.serviceAreaName,
      state: matchedPrefix.state
    };
  }

  if (preliminaryProviderId) {
    const p = ELECTRICITY_PROVIDERS_MASTER.find((item) => item.id === preliminaryProviderId);
    if (p) {
      return {
        matched: false,
        providerId: p.id,
        providerName: p.name,
        state: p.state
      };
    }
  }

  return {
    matched: false,
    providerId: preliminaryProviderId || 'prov-elec-ng-abuja-electricity-aedc',
    providerName: 'Electricity Distribution Provider'
  };
}

/**
 * Strict Electricity Meter Resolution and Provider Verification.
 * 
 * Follows the mandatory sequence:
 * 1. Format validation (Structure check)
 * 2. Provider Resolution (Identify likely provider, detect potential mismatch)
 * 3. Real Provider Verification (Query provider API for real customer details)
 * 
 * Never fabricates or synthesizes customer name, tariff, balance, or energy units.
 */
export async function verifyElectricityMeter(params: {
  meterNumber: string;
  meterType?: 'prepaid' | 'postpaid';
  preliminaryProviderId?: string;
  countryCode?: string;
  state?: string;
  serviceAreaId?: string;
}): Promise<ElectricityMeterVerificationResult> {
  const cleanMeter = (params.meterNumber || '').replace(/[^a-zA-Z0-9]/g, '').trim();
  const meterType = params.meterType || 'prepaid';
  const countryCode = (params.countryCode || 'NG').toUpperCase();

  // 1. Format validation
  if (!cleanMeter || cleanMeter.length < 5) {
    return {
      valid: false,
      status: 'INVALID',
      meterNumber: cleanMeter,
      meterType,
      providerIdentified: false,
      isCustomerVerified: false,
      resolvedProviderId: params.preliminaryProviderId || '',
      resolvedProviderName: 'Unknown Provider',
      statusTitle: 'Invalid Meter Number',
      statusMessage: 'Please enter a valid meter or customer account number (at least 5 alphanumeric characters).'
    };
  }

  // 2. Provider Identification (Prefix / Service-Area Resolution)
  const identified = identifyLikelyElectricityProvider(cleanMeter, countryCode, params.preliminaryProviderId);
  const resolvedProviderId = identified.providerId;
  const resolvedProviderName = identified.providerName;
  const resolvedServiceArea = identified.serviceAreaName;

  // Detect mismatch if user selected a provider that conflicts with authoritative prefix routing
  const providerMismatchDetected = Boolean(
    params.preliminaryProviderId &&
    identified.matched &&
    params.preliminaryProviderId !== identified.providerId
  );

  let preliminaryProviderName = '';
  let correctionNotice: string | undefined;

  if (providerMismatchDetected) {
    const prevProv = ELECTRICITY_PROVIDERS_MASTER.find((p) => p.id === params.preliminaryProviderId);
    preliminaryProviderName = prevProv ? prevProv.name : params.preliminaryProviderId!;
    correctionNotice = `Your meter is associated with a different electricity provider (${resolvedProviderName}). Please review the service area/provider selection.`;
  }

  // If there's an explicit mismatch detected, return MISMATCH status immediately
  if (providerMismatchDetected) {
    return {
      valid: true,
      status: 'MISMATCH',
      meterNumber: cleanMeter,
      meterType,
      providerIdentified: true,
      isCustomerVerified: false,
      resolvedProviderId,
      resolvedProviderName,
      resolvedServiceArea,
      providerMismatchDetected: true,
      preliminaryProviderId: params.preliminaryProviderId,
      preliminaryProviderName,
      correctionNotice,
      statusTitle: 'Provider mismatch',
      statusSubtitle: 'Action Required',
      statusMessage: `Your meter is associated with ${resolvedProviderName}${resolvedServiceArea ? ` (${resolvedServiceArea})` : ''}, not ${preliminaryProviderName}. Please switch provider to proceed.`
    };
  }

  // 3. Real Provider Verification via API Gateway
  try {
    const response = await fetch('/api/v1/utility/electricity/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meterNumber: cleanMeter,
        meterType,
        providerId: resolvedProviderId,
        countryCode,
        serviceAreaId: params.serviceAreaId
      })
    });

    if (response.ok) {
      const data = await response.json();

      if (data.isCustomerVerified && data.status === 'VERIFIED') {
        // Real provider API returned verified customer information
        return {
          valid: true,
          status: 'VERIFIED',
          meterNumber: cleanMeter,
          meterType,
          providerIdentified: true,
          isCustomerVerified: true,
          verificationMethod: 'LIVE_PROVIDER_API',
          resolvedProviderId: data.resolvedProviderId || resolvedProviderId,
          resolvedProviderName: data.resolvedProviderName || resolvedProviderName,
          resolvedServiceArea: data.resolvedServiceArea || resolvedServiceArea,
          customerName: data.customerName,
          customerAddress: data.customerAddress,
          accountStatus: data.accountStatus || 'ACTIVE',
          tariffBand: data.tariffBand,
          tariffRatePerKwh: data.tariffRatePerKwh,
          outstandingDebtFiat: data.outstandingDebtFiat,
          minVendFiat: data.minVendFiat,
          unitsPurchasable: data.unitsPurchasable,
          statusTitle: 'Meter verified ✓',
          statusSubtitle: 'Customer details confirmed',
          statusMessage: 'Customer details confirmed by electricity distribution provider.'
        };
      }
    }
  } catch (err) {
    // Network or API route unreachable
  }

  // 4. Default / Unconfigured Provider API Gateway
  // Return "Meter number captured" and "Provider verification required" without synthetic data
  return {
    valid: true,
    status: 'UNAVAILABLE',
    meterNumber: cleanMeter,
    meterType,
    providerIdentified: true,
    isCustomerVerified: false,
    verificationMethod: 'UNCONFIGURED',
    resolvedProviderId,
    resolvedProviderName,
    resolvedServiceArea,
    // Note: Do NOT fabricate customerName, tariffBand, units, or balance!
    statusTitle: 'Meter number captured',
    statusSubtitle: 'Provider verification required',
    statusMessage: 'We need to verify this meter with the electricity provider before displaying customer details or processing the transaction.'
  };
}
