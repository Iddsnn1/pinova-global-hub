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
          valid: data.valid === true,
          accountNumber,
          providerId: this.providerId,
          providerName,
          requiresManualVerification: data.requiresManualVerification === false && data.valid === true,
          verificationMethod: data.verificationMethod === 'DIRECT_API' && data.valid === true ? 'DIRECT_API' : 'MANUAL_VERIFICATION',
          accountName: data.accountName,
          statusMessage: data.statusMessage || (data.valid === true ? 'Account confirmed via provider API gateway.' : 'Provider did not authoritatively verify this account.'),
          disclaimer: data.disclaimer || 'Direct API verification.'
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
      statusMessage: 'Live provider verification is unavailable. Payment is blocked until the provider API confirms this account.',
      disclaimer: 'No successful provider lookup was received; this account is not verified.'
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
      statusMessage: 'This provider has no live account-verification API. Payment is blocked until an authoritative verification service is configured.',
      disclaimer: 'No direct customer lookup API is configured; the account is not verified.'
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
