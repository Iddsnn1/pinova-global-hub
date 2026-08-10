import { safeFetchJson } from '../../lib/safeFetch';

export interface ValidationResult {
  valid: boolean;
  accountNumber: string;
  providerId: string;
  providerName: string;
  requiresManualVerification: boolean;
  verificationMethod: 'DIRECT_API' | 'MANUAL_VERIFICATION';
  accountName?: string;
  statusMessage: string;
  disclaimer?: string;
}

export interface IProviderValidationAdapter {
  providerId: string;
  hasLiveApi: boolean;
  validateAccount(accountNumber: string, providerName: string): Promise<ValidationResult>;
}

export class DirectApiValidationAdapter implements IProviderValidationAdapter {
  providerId: string;
  hasLiveApi = true;

  constructor(providerId: string) {
    this.providerId = providerId;
  }

  async validateAccount(accountNumber: string, providerName: string): Promise<ValidationResult> {
    try {
      const result = await safeFetchJson('/api/v1/utility/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: this.providerId, accountNumber })
      });
      if (result.ok && result.data) {
        const data = result.data;
        return {
          valid: data.valid ?? true,
          accountNumber,
          providerId: this.providerId,
          providerName,
          requiresManualVerification: data.requiresManualVerification ?? false,
          verificationMethod: data.verificationMethod ?? 'DIRECT_API',
          accountName: data.accountName,
          statusMessage: data.statusMessage || 'Account confirmed via provider API gateway.',
          disclaimer: data.disclaimer || 'Direct API verification.'
        };
      }
    } catch (e) {
      console.warn('Provider direct API connection notice:', e);
    }

    return {
      valid: true,
      accountNumber,
      providerId: this.providerId,
      providerName,
      requiresManualVerification: true,
      verificationMethod: 'MANUAL_VERIFICATION',
      statusMessage: 'Account recorded for manual provider verification prior to settlement.',
      disclaimer: 'Provider API offline or pending connection. Account details logged for manual operations check.'
    };
  }
}

export class ManualVerificationAdapter implements IProviderValidationAdapter {
  providerId: string;
  hasLiveApi = false;

  constructor(providerId: string) {
    this.providerId = providerId;
  }

  async validateAccount(accountNumber: string, providerName: string): Promise<ValidationResult> {
    return {
      valid: true,
      accountNumber,
      providerId: this.providerId,
      providerName,
      requiresManualVerification: true,
      verificationMethod: 'MANUAL_VERIFICATION',
      statusMessage: 'Account recorded for manual provider verification prior to settlement.',
      disclaimer: 'No direct customer lookup API available for this provider. Details will be verified manually by fulfillment operations.'
    };
  }
}

export class ProviderValidationFactory {
  private static adapters: Map<string, IProviderValidationAdapter> = new Map();

  static getAdapter(providerId: string, hasDirectApi = false): IProviderValidationAdapter {
    const key = `${providerId}_${hasDirectApi ? 'api' : 'manual'}`;
    if (!this.adapters.has(key)) {
      if (hasDirectApi) {
        this.adapters.set(key, new DirectApiValidationAdapter(providerId));
      } else {
        this.adapters.set(key, new ManualVerificationAdapter(providerId));
      }
    }
    return this.adapters.get(key)!;
  }
}
