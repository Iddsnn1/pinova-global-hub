/**
 * PiNova Global Hub — shared fiat-to-Pi conversion primitives.
 *
 * IMPORTANT:
 * - PI_REFERENCE_RATE_USD is the product's configured community reference,
 *   not a claim about Pi Network's official market price.
 * - usdPerFiatUnit must come from a trusted, timestamped FX quote supplied by
 *   the caller. This module deliberately does not invent/fallback FX rates.
 * - Payment authorization must recalculate and validate amounts server-side.
 */
export const PI_REFERENCE_RATE_USD = 314159;
export const PI_AMOUNT_DECIMALS = 12;

export interface FiatToPiQuote {
  fiatAmount: number;
  fiatCurrency: string;
  /** USD value of one unit of fiatCurrency (e.g. 1 NGN = x USD). */
  usdPerFiatUnit: number;
  /** ISO-8601 timestamp from the trusted FX source. */
  fxAsOf: string;
  /** Optional override for controlled tests/configuration. */
  piReferenceRateUsd?: number;
}

export interface FiatToPiResult {
  fiatAmount: number;
  fiatCurrency: string;
  usdAmount: number;
  piAmount: string;
  piReferenceRateUsd: number;
  fxAsOf: string;
}

export class CurrencyConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurrencyConversionError';
  }
}

/**
 * Convert a fiat amount to Pi using an explicit FX quote and the PiNova
 * reference rate. Throws on missing, malformed, or non-positive inputs.
 * Returns a decimal string so callers can preserve the 12-decimal result.
 */
export function convertFiatToPi(quote: FiatToPiQuote): FiatToPiResult {
  if (!quote || typeof quote !== 'object') {
    throw new CurrencyConversionError('A fiat conversion quote is required.');
  }

  const { fiatAmount, fiatCurrency, usdPerFiatUnit, fxAsOf } = quote;
  const piReferenceRateUsd = quote.piReferenceRateUsd ?? PI_REFERENCE_RATE_USD;

  if (!Number.isFinite(fiatAmount) || fiatAmount <= 0) {
    throw new CurrencyConversionError('Fiat amount must be a finite positive number.');
  }
  if (typeof fiatCurrency !== 'string' || !/^[A-Z]{3}$/.test(fiatCurrency)) {
    throw new CurrencyConversionError('Fiat currency must be a valid 3-letter uppercase code.');
  }
  if (!Number.isFinite(usdPerFiatUnit) || usdPerFiatUnit <= 0) {
    throw new CurrencyConversionError('A valid positive fiat-to-USD FX rate is required.');
  }
  if (typeof fxAsOf !== 'string' || !Number.isFinite(Date.parse(fxAsOf))) {
    throw new CurrencyConversionError('A valid FX quote timestamp is required.');
  }
  if (!Number.isFinite(piReferenceRateUsd) || piReferenceRateUsd <= 0) {
    throw new CurrencyConversionError('Pi reference rate must be a finite positive number.');
  }

  const usdAmount = fiatAmount * usdPerFiatUnit;
  const unroundedPi = usdAmount / piReferenceRateUsd;
  if (!Number.isFinite(usdAmount) || !Number.isFinite(unroundedPi) || unroundedPi <= 0) {
    throw new CurrencyConversionError('Conversion result is outside the supported numeric range.');
  }

  const piAmount = unroundedPi.toFixed(PI_AMOUNT_DECIMALS);
  if (Number(piAmount) === 0) {
    throw new CurrencyConversionError('Pi amount is below the supported 12-decimal precision.');
  }

  return {
    fiatAmount,
    fiatCurrency,
    usdAmount,
    piAmount,
    piReferenceRateUsd,
    fxAsOf: new Date(fxAsOf).toISOString(),
  };
}
