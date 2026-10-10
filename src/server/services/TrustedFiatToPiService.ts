import {
  convertFiatToPi,
  type FiatToPiResult,
  PI_REFERENCE_RATE_USD,
} from '../../utils/currencyToPi';
import {
  DEFAULT_MAX_TRUSTED_FX_AGE_MS,
  validateTrustedFxQuote,
  type TrustedFxQuote,
} from './TrustedFxQuoteService';

export interface TrustedFiatToPiRequest {
  fiatAmount: number;
  currency: string;
  quote: TrustedFxQuote;
  trustedSource: string;
  nowMs?: number;
  maxAgeMs?: number;
}

/**
 * Server-side reference conversion using an explicitly trusted, timestamped FX quote.
 * This does not fetch FX data and must not be treated as payment authorization.
 * Callers must obtain the quote from a configured provider and independently
 * verify the canonical invoice amount before creating or approving a Pi payment.
 */
export function calculateTrustedFiatToPi(
  request: TrustedFiatToPiRequest
): FiatToPiResult {
  if (!request || typeof request !== 'object') {
    throw new Error('FX_CONVERSION_REQUEST_REQUIRED');
  }

  const currency = String(request.currency || '').trim().toUpperCase();
  const maxAgeMs = request.maxAgeMs ?? DEFAULT_MAX_TRUSTED_FX_AGE_MS;
  const quote = validateTrustedFxQuote(
    request.quote,
    currency,
    request.trustedSource,
    request.nowMs ?? Date.now(),
    maxAgeMs
  );

  return convertFiatToPi({
    fiatAmount: request.fiatAmount,
    fiatCurrency: currency,
    usdPerFiatUnit: quote.usdPerFiatUnit,
    fxAsOf: quote.asOf,
    piReferenceRateUsd: PI_REFERENCE_RATE_USD,
    maxFxAgeMs: maxAgeMs,
  });
}
