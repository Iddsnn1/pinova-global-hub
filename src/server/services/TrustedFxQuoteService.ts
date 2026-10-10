export interface TrustedFxQuote {
  currency: string;
  usdPerFiatUnit: number;
  asOf: string;
  source: string;
}

export const DEFAULT_MAX_TRUSTED_FX_AGE_MS = 15 * 60 * 1000;

export function validateTrustedFxQuote(
  quote: TrustedFxQuote,
  expectedCurrency: string,
  trustedSource: string,
  nowMs = Date.now(),
  maxAgeMs = DEFAULT_MAX_TRUSTED_FX_AGE_MS
): TrustedFxQuote {
  if (!quote || typeof quote !== 'object') throw new Error('FX_QUOTE_REQUIRED');
  const currency = String(quote.currency || '').trim().toUpperCase();
  const expected = String(expectedCurrency || '').trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(expected)) throw new Error('FX_CURRENCY_INVALID');
  if (!trustedSource) throw new Error('FX_TRUSTED_SOURCE_NOT_CONFIGURED');
  if (quote.source !== trustedSource) throw new Error('FX_SOURCE_UNTRUSTED');
  if (currency !== expected) throw new Error('FX_CURRENCY_MISMATCH');
  if (!Number.isFinite(quote.usdPerFiatUnit) || quote.usdPerFiatUnit <= 0) throw new Error('FX_RATE_INVALID');
  const timestamp = Date.parse(quote.asOf);
  if (!Number.isFinite(timestamp)) throw new Error('FX_TIMESTAMP_INVALID');
  if (!Number.isFinite(maxAgeMs) || maxAgeMs <= 0 || !Number.isFinite(nowMs)) throw new Error('FX_VALIDATION_CONFIG_INVALID');
  const ageMs = nowMs - timestamp;
  if (ageMs < -60_000) throw new Error('FX_TIMESTAMP_IN_FUTURE');
  if (ageMs > maxAgeMs) throw new Error('FX_QUOTE_STALE');
  return { currency, usdPerFiatUnit: quote.usdPerFiatUnit, asOf: new Date(timestamp).toISOString(), source: quote.source };
}
