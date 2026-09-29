import { getAuthoritativeEducationProvider, getNigeriaAuthoritativeProviderForCapability, listAuthoritativeEducationProviders } from '../src/server/services/AuthoritativeEducationProviderRegistry';

const ok = (value: boolean, name: string) => {
  if (!value) throw new Error('FAILED: ' + name);
  console.log('[PASS] ' + name);
};

const providers = listAuthoritativeEducationProviders();
ok(providers.length === 3, 'Nigeria authoritative provider registry contains only NUC, NBTE and JAMB CAPS');
ok(providers.every((p) => p.countryCode === 'NG'), 'All registered providers are scoped to Nigeria');
ok(providers.every((p) => p.integrationStatus === 'UNCONFIGURED'), 'No unverified provider credentials are treated as configured');

const nuc = getAuthoritativeEducationProvider('NUC');
ok(nuc.authorityName === 'National Universities Commission', 'NUC authority is explicit');
ok(nuc.capabilities.includes('INSTITUTION_REGISTRY'), 'NUC is an institution-registry provider');
ok(nuc.capabilities.includes('APPROVED_PROGRAMMES'), 'NUC is an approved-programme provider');

const nbte = getAuthoritativeEducationProvider('NBTE');
ok(nbte.authorityName === 'National Board for Technical Education', 'NBTE authority is explicit');
ok(nbte.capabilities.includes('INSTITUTION_REGISTRY'), 'NBTE is an institution-registry provider');

const jamb = getAuthoritativeEducationProvider('JAMB_CAPS');
ok(jamb.capabilities.includes('ADMISSION_PROCESSING'), 'JAMB CAPS is an admission-processing provider');
ok(jamb.capabilities.includes('ADMISSION_STATUS'), 'JAMB CAPS is an admission-status provider');

const admissionProviders = getNigeriaAuthoritativeProviderForCapability('ADMISSION_PROCESSING');
ok(admissionProviders.length === 1 && admissionProviders[0].id === 'JAMB_CAPS', 'Admission processing is not ambiguously assigned to NUC/NBTE');

console.log('Authoritative education provider registry safety gate: GREEN');
