export * from './providerValidation';
import { UtilityServiceProvider } from '../../types/utility';
import { ProviderValidationFactory } from './providerValidation';

export class UtilityService {
  async validateCustomerAccount(provider: UtilityServiceProvider, accountNumber: string) {
    const adapter = ProviderValidationFactory.getAdapter(provider.id, provider.hasDirectValidationApi);
    return await adapter.validateAccount(accountNumber, provider.name);
  }
}

export const utilityService = new UtilityService();
