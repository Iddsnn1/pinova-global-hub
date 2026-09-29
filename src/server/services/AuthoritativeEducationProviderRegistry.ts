export type AuthoritativeEducationProviderId = 'NUC' | 'NBTE' | 'JAMB_CAPS';

export type AuthoritativeProviderCapability =
  | 'INSTITUTION_REGISTRY'
  | 'APPROVED_PROGRAMMES'
  | 'ADMISSION_PROCESSING'
  | 'ADMISSION_STATUS';

export interface AuthoritativeEducationProviderDescriptor {
  id: AuthoritativeEducationProviderId;
  countryCode: 'NG';
  authorityName: string;
  officialBaseUrl: string;
  capabilities: AuthoritativeProviderCapability[];
  integrationStatus: 'UNCONFIGURED' | 'CONFIGURED';
  notes: string;
}

const PROVIDERS: Record<AuthoritativeEducationProviderId, AuthoritativeEducationProviderDescriptor> = {
  NUC: {
    id: 'NUC',
    countryCode: 'NG',
    authorityName: 'National Universities Commission',
    officialBaseUrl: 'https://enuc.nuc.edu.ng/nus',
    capabilities: ['INSTITUTION_REGISTRY', 'APPROVED_PROGRAMMES'],
    integrationStatus: 'UNCONFIGURED',
    notes: 'Official Nigerian University System registry. No public developer API credential is configured in PiNova.'
  },
  NBTE: {
    id: 'NBTE',
    countryCode: 'NG',
    authorityName: 'National Board for Technical Education',
    officialBaseUrl: 'https://dms.nbte.gov.ng/',
    capabilities: ['INSTITUTION_REGISTRY', 'APPROVED_PROGRAMMES'],
    integrationStatus: 'UNCONFIGURED',
    notes: 'Official NBTE TVID/DMS source. Partner/API access must be authorized before synchronization.'
  },
  JAMB_CAPS: {
    id: 'JAMB_CAPS',
    countryCode: 'NG',
    authorityName: 'Joint Admissions and Matriculation Board — CAPS',
    officialBaseUrl: 'https://caps.jamb.gov.ng/',
    capabilities: ['ADMISSION_PROCESSING', 'ADMISSION_STATUS', 'INSTITUTION_REGISTRY', 'APPROVED_PROGRAMMES'],
    integrationStatus: 'UNCONFIGURED',
    notes: 'Official CAPS admission system. PiNova must use authorized credentials/access for candidate or institution admission operations.'
  }
};

export function getAuthoritativeEducationProvider(
  id: AuthoritativeEducationProviderId
): AuthoritativeEducationProviderDescriptor {
  return PROVIDERS[id];
}

export function listAuthoritativeEducationProviders(): AuthoritativeEducationProviderDescriptor[] {
  return Object.values(PROVIDERS);
}

export function getNigeriaAuthoritativeProviderForCapability(
  capability: AuthoritativeProviderCapability
): AuthoritativeEducationProviderDescriptor[] {
  return listAuthoritativeEducationProviders().filter((provider) =>
    provider.capabilities.includes(capability)
  );
}
