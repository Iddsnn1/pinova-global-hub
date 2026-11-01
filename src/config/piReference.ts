/**
 * PiNova Global Hub — Pi reference configuration.
 *
 * The configured USD reference is an application/operator reference for
 * optional display and reference calculations. It is NOT the native Pi
 * settlement authority and is not a claim of an official Pi Network market rate.
 *
 * Native payments must always use the canonical Pi amount stored on the
 * invoice/order. This module must never be used to derive the amount sent
 * to Pi Network checkout or to verify a blockchain payment.
 */
export const PI_REFERENCE_RATE_USD = 314159;
export const PI_REFERENCE_DECIMAL_PLACES = 12;

export function calculatePiReferenceFromUsd(usdAmount: number): number {
  if (!Number.isFinite(usdAmount) || usdAmount <= 0) return 0;
  return Number((usdAmount / PI_REFERENCE_RATE_USD).toFixed(PI_REFERENCE_DECIMAL_PLACES));
}

export function calculateUsdReferenceFromPi(piAmount: number): number {
  if (!Number.isFinite(piAmount) || piAmount <= 0) return 0;
  return piAmount * PI_REFERENCE_RATE_USD;
}
