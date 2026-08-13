import { PiConversionConfig } from '../../types/utility';

export interface IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, config: PiConversionConfig): number;
  calculateFiatFromPi(piAmount: number, config: PiConversionConfig): number;
  getPricingDisclaimer(): string;
}

export class PricingRuleEngine implements IPricingRuleEngine {
  calculatePiFromFiat(fiatAmount: number, config: PiConversionConfig): number {
    if (!config.piRateUsd || config.piRateUsd <= 0) return 0;
    return fiatAmount / config.piRateUsd;
  }

  calculateFiatFromPi(piAmount: number, config: PiConversionConfig): number {
    return piAmount * (config.piRateUsd || 314159.00);
  }

  getPricingDisclaimer(): string {
    return 'Pricing configurations are established by marketplace administrators. Pi Network does not publish, guarantee, or endorse exchange rates.';
  }
}

export const pricingEngine = new PricingRuleEngine();
