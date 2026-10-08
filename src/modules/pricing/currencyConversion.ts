import { PI_REFERENCE_DECIMAL_PLACES, PI_REFERENCE_RATE_USD } from '../../config/piReference';

export interface FiatToPiConversionInput {
  amount: number;
  currencyCode: string;
  /**
   * FX quote expressed as: 1 USD = X units of the source currency.
   * This value must come from an explicitly configured/authorized FX source.
   */
  unitsPerUsd: number;
}

export interface FiatToPiConversionResult {
  sourceAmount: number;
  sourceCurrency: string;
  usdAmount: number;
  piAmount: number;
  piReferenceRateUsd: number;
}

/**
 * Canonical PiNova conversion pipeline:
 * source fiat -> USD -> Pi reference.
 *
 * No currency-specific fallback is permitted. Missing/invalid FX data must
 * fail closed so a guessed or stale rate can never silently authorize payment.
 */
export function convertFiatToPi(input: FiatToPiConversionInput): FiatToPiConversionResult {
  const currencyCode = input.currencyCode.trim().toUpperCase();

  if (!currencyCode) {
    throw new Error('CURRENCY_CODE_REQUIRED');
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('FIAT_AMOUNT_INVALID');
  }
  if (!Number.isFinite(input.unitsPerUsd) || input.unitsPerUsd <= 0) {
    throw new Error('FX_RATE_UNAVAILABLE');
  }

  const usdAmount = currencyCode === 'USD'
    ? input.amount
    : input.amount / input.unitsPerUsd;

  if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
    throw new Error('USD_AMOUNT_INVALID');
  }

  const piAmount = Number(
    (usdAmount / PI_REFERENCE_RATE_USD).toFixed(PI_REFERENCE_DECIMAL_PLACES)
  );

  if (!Number.isFinite(piAmount) || piAmount <= 0) {
    throw new Error('PI_AMOUNT_INVALID');
  }

  return {
    sourceAmount: input.amount,
    sourceCurrency: currencyCode,
    usdAmount,
    piAmount,
    piReferenceRateUsd: PI_REFERENCE_RATE_USD,
  };
}

/**
 * Converts a Pi amount back to the source fiat currency using the same
 * explicit FX quote. This is for reference/display calculations; payment
 * settlement remains Pi-native.
 */
export function convertPiToFiat(
  piAmount: number,
  currencyCode: string,
  unitsPerUsd: number
): number {
  const normalizedCurrency = currencyCode.trim().toUpperCase();

  if (!Number.isFinite(piAmount) || piAmount <= 0) {
    throw new Error('PI_AMOUNT_INVALID');
  }
  if (!normalizedCurrency) {
    throw new Error('CURRENCY_CODE_REQUIRED');
  }
  if (!Number.isFinite(unitsPerUsd) || unitsPerUsd <= 0) {
    throw new Error('FX_RATE_UNAVAILABLE');
  }

  const usdAmount = piAmount * PI_REFERENCE_RATE_USD;
  return normalizedCurrency === 'USD' ? usdAmount : usdAmount * unitsPerUsd;
}
