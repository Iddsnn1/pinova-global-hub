import { PiConversionConfig } from '../../types/utility';
import { PI_REFERENCE_RATE_USD } from '../../config/piReference';

export interface IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, config: PiConversionConfig): number;
  calculateFiatFromPi(piAmount: number, config: PiConversionConfig): number;
  getPricingDisclaimer(): string;
}

export class PricingRuleEngine implements IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, _config: PiConversionConfig): number {
    if (!Number.isFinite(fiatAmount) || fiatAmount <= 0) return 0;
    return Number((fiatAmount / PI_REFERENCE_RATE_USD).toFixed(12));
  }

  calculateFiatFromPi(piAmount: number, _config: PiConversionConfig): number {
    if (!Number.isFinite(piAmount) || piAmount <= 0) return 0;
    return piAmount * PI_REFERENCE_RATE_USD;
  }

  getPricingDisclaimer(): string {
    return 'Pricing configurations are established by marketplace administrators. Pi Network does not publish, guarantee, or endorse exchange rates.';
  }
}

export const pricingEngine = new PricingRuleEngine();
