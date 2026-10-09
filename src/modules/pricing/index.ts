import { PiConversionConfig } from '../../types/utility';
import { PI_REFERENCE_RATE_USD, calculatePiReferenceFromUsd, calculateUsdReferenceFromPi } from '../../config/piReference';

export interface IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, config: PiConversionConfig): number;
  calculateFiatFromPi(piAmount: number, config: PiConversionConfig): number;
  getPricingDisclaimer(): string;
}

/**
 * Legacy display/reference engine only. It has no trusted FX quote input,
 * so non-USD conversions fail closed instead of treating local fiat as USD.
 * These calculations are never payment authorization.
 */
export class PricingRuleEngine implements IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, config: PiConversionConfig): number {
    if (!Number.isFinite(fiatAmount) || fiatAmount <= 0) return 0;
    if (String(config?.currencyCode || '').trim().toUpperCase() !== 'USD') return 0;
    return calculatePiReferenceFromUsd(fiatAmount);
  }

  calculateFiatFromPi(piAmount: number, config: PiConversionConfig): number {
    if (!Number.isFinite(piAmount) || piAmount <= 0) return 0;
    if (String(config?.currencyCode || '').trim().toUpperCase() !== 'USD') return 0;
    return calculateUsdReferenceFromPi(piAmount);
  }

  getPricingDisclaimer(): string {
    return `Pricing uses PiNova's community reference of 1 Pi = USD ${PI_REFERENCE_RATE_USD}; this is not an official Pi Network market rate. Non-USD conversion requires a trusted, timestamped FX quote. Estimates do not authorize payments.`;
  }
}

export const pricingEngine = new PricingRuleEngine();
