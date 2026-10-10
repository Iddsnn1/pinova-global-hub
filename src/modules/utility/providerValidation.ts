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
          // A successful HTTP response or syntactic check is not proof that the
          // subscriber exists. Only an explicit provider-confirmed account name
          // with valid=true and no manual-verification requirement counts as verified.
          valid: data.valid === true && typeof data.accountName === 'string' &&
            data.accountName.trim().length > 0 && data.requiresManualVerification !== true,
          accountNumber,
          providerId: this.providerId,
          providerName,
          requiresManualVerification: data.requiresManualVerification !== false ||
            !(typeof data.accountName === 'string' && data.accountName.trim().length > 0),
          verificationMethod: data.verificationMethod === 'DIRECT_API' && data.valid === true &&
            typeof data.accountName === 'string' && data.accountName.trim().length > 0 &&
            data.requiresManualVerification !== true ? 'DIRECT_API' : 'MANUAL_VERIFICATION',
          accountName: typeof data.accountName === 'string' && data.accountName.trim()
            ? data.accountName.trim() : undefined,
          statusMessage: (typeof data.accountName === 'string' && data.accountName.trim() &&
            data.valid === true && data.requiresManualVerification !== true)
            ? (data.statusMessage || 'Subscriber account confirmed by provider.')
            : 'Number format/check response received, but the subscriber account has not been verified.',
          disclaimer: data.disclaimer || 'Do not treat a format check as subscriber ownership verification.'
        };
      }
    } catch (e) {
      console.warn('Provider direct API connection notice:', e);
    }

    return {
      valid: false,
      accountNumber,
      providerId: this.providerId,
      providerName,
      requiresManualVerification: true,
      verificationMethod: 'MANUAL_VERIFICATION',
      statusMessage: 'Subscriber account could not be verified because the provider lookup is unavailable.',
      disclaimer: 'The account is not verified. Checkout must remain blocked until provider verification is available.'
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
      valid: false,
      accountNumber,
      providerId: this.providerId,
      providerName,
      requiresManualVerification: true,
      verificationMethod: 'MANUAL_VERIFICATION',
      statusMessage: 'Subscriber account has not been verified. No live provider lookup is configured.',
      disclaimer: 'Do not treat the entered number as verified. Checkout must remain blocked until provider verification is available.'
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
