/**
 * Pi Oracle reference configuration.
 *
 * This is the PiNova application settlement reference supplied by the
 * platform operator for invoicing/education calculations.
 *
 * It is an application reference, not a claim that Pi Network Core Team
 * publishes or guarantees a fixed market price.
 */
export const PI_ORACLE_RATE_USD = 314159;
export const PI_ORACLE_DECIMAL_PLACES = 12;

export function calculatePiFromUsd(usdAmount: number): number {
  if (!Number.isFinite(usdAmount) || usdAmount <= 0) return 0;
  return Number((usdAmount / PI_ORACLE_RATE_USD).toFixed(PI_ORACLE_DECIMAL_PLACES));
}

export function calculateUsdFromPi(piAmount: number): number {
  if (!Number.isFinite(piAmount) || piAmount <= 0) return 0;
  return piAmount * PI_ORACLE_RATE_USD;
}
