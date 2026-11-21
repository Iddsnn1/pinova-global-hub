import {
  IAccreditationProviderAdapter,
  InstitutionVerificationResult,
  StudentVerificationResult
} from './AccreditationProviderAdapter';
import {
  AuthoritativeEducationProviderId,
  AuthoritativeProviderCapability,
  listAuthoritativeEducationProviders
} from './AuthoritativeEducationProviderRegistry';

export interface IAuthoritativeEducationConnector extends IAccreditationProviderAdapter {
  readonly providerId: string;
  readonly countryCode: string;
  readonly capabilities: readonly string[];
  readonly isConfigured: boolean;
}

class UnconfiguredEducationConnector implements IAuthoritativeEducationConnector {
  readonly isConfigured = false;

  constructor(
    public readonly providerId: string,
    public readonly countryCode: string,
    public readonly authorities: string[],
    public readonly capabilities: readonly string[]
  ) {}

  async verifyInstitution(_institutionCode: string): Promise<InstitutionVerificationResult> {
    return {
      valid: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0] || this.providerId,
      notes: `${this.providerId} connector is not configured. No authoritative verification was performed.`,
      checkedAt: new Date().toISOString()
    };
  }

  async verifyStudent(_institutionId: string, studentReference: string, _academicSession?: string): Promise<StudentVerificationResult> {
    return {
      verified: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0] || this.providerId,
      referenceId: studentReference,
      notes: `${this.providerId} connector is not configured. No authoritative verification was performed.`,
      checkedAt: new Date().toISOString()
    };
  }
}

/**
 * Global connector slots are keyed by provider ID, not by country.
 * Any country's regulator or authorized provider can register its own adapter.
 */
export class AuthoritativeEducationConnectorRegistry {
  private readonly connectors = new Map<string, IAuthoritativeEducationConnector>();

  constructor() {
    for (const descriptor of listAuthoritativeEducationProviders()) {
      this.connectors.set(descriptor.id, new UnconfiguredEducationConnector(
        descriptor.id,
        descriptor.countryCode,
        [descriptor.authorityName],
        descriptor.capabilities
      ));
    }
  }

  register(connector: IAuthoritativeEducationConnector): void {
    const providerId = connector.providerId.trim();
    if (!providerId) throw new Error('Education connector providerId is required');
    if (!connector.countryCode.trim()) throw new Error(`Education connector ${providerId} requires a countryCode`);
    this.connectors.set(providerId, connector);
  }

  get(providerId: string): IAuthoritativeEducationConnector {
    const connector = this.connectors.get(providerId);
    if (!connector) throw new Error(`No connector slot exists for ${providerId}`);
    return connector;
  }

  resolve(
    countryCode: string,
    capability: string,
    preferredProviderId?: string
  ): IAuthoritativeEducationConnector | null {
    const country = countryCode.trim().toUpperCase();
    const candidates = [...this.connectors.values()].filter((connector) =>
      connector.countryCode.toUpperCase() === country &&
      connector.capabilities.includes(capability)
    );
    if (preferredProviderId) {
      return candidates.find((connector) => connector.providerId === preferredProviderId) || null;
    }
    return candidates.length === 1 ? candidates[0] : null;
  }

  resolveForCapability(
    capability: AuthoritativeProviderCapability,
    preferredProviderId?: AuthoritativeEducationProviderId
  ): IAuthoritativeEducationConnector | null {
    return this.resolve('NG', capability, preferredProviderId);
  }
}

export const authoritativeEducationConnectorRegistry = new AuthoritativeEducationConnectorRegistry();
