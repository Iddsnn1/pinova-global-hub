import {
  IAccreditationProviderAdapter,
  InstitutionVerificationResult,
  StudentVerificationResult
} from './AccreditationProviderAdapter';
import {
  AuthoritativeEducationProviderId,
  AuthoritativeProviderCapability,
  getAuthoritativeEducationProvider,
  getNigeriaAuthoritativeProviderForCapability
} from './AuthoritativeEducationProviderRegistry';

export interface IAuthoritativeEducationConnector extends IAccreditationProviderAdapter {
  readonly providerId: AuthoritativeEducationProviderId;
  readonly isConfigured: boolean;
}

class UnconfiguredEducationConnector implements IAuthoritativeEducationConnector {
  readonly isConfigured = false;

  constructor(
    public readonly providerId: AuthoritativeEducationProviderId,
    public readonly countryCode: string,
    public readonly authorities: string[]
  ) {}

  async verifyInstitution(_institutionCode: string): Promise<InstitutionVerificationResult> {
    return {
      valid: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0],
      notes: `${this.providerId} connector is not configured. No authoritative verification was performed.`,
      checkedAt: new Date().toISOString()
    };
  }

  async verifyStudent(_institutionId: string, studentReference: string, _academicSession?: string): Promise<StudentVerificationResult> {
    return {
      verified: false,
      status: 'UNAVAILABLE',
      authorityName: this.authorities[0],
      referenceId: studentReference,
      notes: `${this.providerId} connector is not configured. No authoritative verification was performed.`,
      checkedAt: new Date().toISOString()
    };
  }
}

/**
 * Each authority owns an independent connector slot. Registering or replacing one
 * provider never mutates another provider's connector.
 */
export class AuthoritativeEducationConnectorRegistry {
  private readonly connectors = new Map<AuthoritativeEducationProviderId, IAuthoritativeEducationConnector>();

  constructor() {
    for (const id of ['NUC', 'NBTE', 'JAMB_CAPS'] as const) {
      const descriptor = getAuthoritativeEducationProvider(id);
      this.connectors.set(id, new UnconfiguredEducationConnector(
        id,
        descriptor.countryCode,
        [descriptor.authorityName]
      ));
    }
  }

  register(connector: IAuthoritativeEducationConnector): void {
    this.connectors.set(connector.providerId, connector);
  }

  get(providerId: AuthoritativeEducationProviderId): IAuthoritativeEducationConnector {
    const connector = this.connectors.get(providerId);
    if (!connector) throw new Error(`No connector slot exists for ${providerId}`);
    return connector;
  }

  resolveForCapability(
    capability: AuthoritativeProviderCapability,
    preferredProviderId?: AuthoritativeEducationProviderId
  ): IAuthoritativeEducationConnector | null {
    const candidates = getNigeriaAuthoritativeProviderForCapability(capability);
    if (preferredProviderId) {
      const descriptor = candidates.find((provider) => provider.id === preferredProviderId);
      return descriptor ? this.get(preferredProviderId) : null;
    }
    if (candidates.length !== 1) return null;
    return this.get(candidates[0].id);
  }
}

export const authoritativeEducationConnectorRegistry = new AuthoritativeEducationConnectorRegistry();
