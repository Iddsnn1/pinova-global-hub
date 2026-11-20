import {
  AuthoritativeEducationConnectorRegistry,
  IAuthoritativeEducationConnector
} from '../src/server/services/AuthoritativeEducationConnectorRegistry';
import {
  InstitutionVerificationResult,
  StudentVerificationResult
} from '../src/server/services/AccreditationProviderAdapter';

const ok = (value: boolean, name: string) => {
  if (!value) throw new Error('FAILED: ' + name);
  console.log('[PASS] ' + name);
};

class TestConnector implements IAuthoritativeEducationConnector {
  readonly isConfigured = true;
  readonly authorities: string[];

  constructor(
    public readonly providerId: string,
    public readonly countryCode = 'NG',
    public readonly capabilities: readonly string[] = ['INSTITUTION_REGISTRY', 'ADMISSION_STATUS']
  ) {
    this.authorities = [providerId];
  }

  async verifyInstitution(code: string): Promise<InstitutionVerificationResult> {
    return { valid: true, status: 'VERIFIED', authorityName: this.providerId, accreditationReference: code, checkedAt: new Date().toISOString() };
  }

  async verifyStudent(_institutionId: string, reference: string): Promise<StudentVerificationResult> {
    return { verified: true, status: 'VERIFIED', authorityName: this.providerId, referenceId: reference, checkedAt: new Date().toISOString() };
  }
}

const registry = new AuthoritativeEducationConnectorRegistry();
const nucDefault = registry.get('NUC');
const nbteDefault = registry.get('NBTE');
const jambDefault = registry.get('JAMB_CAPS');

ok(!nucDefault.isConfigured && !nbteDefault.isConfigured && !jambDefault.isConfigured, 'all authority sockets start safely unconfigured');
registry.register(new TestConnector('NUC'));
ok(registry.get('NUC').isConfigured, 'NUC connector can be configured independently');
ok(!registry.get('NBTE').isConfigured, 'configuring NUC does not configure NBTE');
ok(!registry.get('JAMB_CAPS').isConfigured, 'configuring NUC does not configure JAMB CAPS');
ok(registry.resolveForCapability('INSTITUTION_REGISTRY', 'NUC')?.providerId === 'NUC', 'explicit NUC routing selects only NUC');
ok(registry.resolveForCapability('INSTITUTION_REGISTRY', 'NBTE')?.providerId === 'NBTE', 'explicit NBTE routing selects only NBTE');
ok(registry.resolveForCapability('INSTITUTION_REGISTRY') === null, 'ambiguous institution-registry routing requires an explicit authority');
ok(registry.resolveForCapability('ADMISSION_STATUS')?.providerId === 'JAMB_CAPS', 'admission-status routing resolves to JAMB CAPS only');

registry.register(new TestConnector('US-EDUCATION-AUTHORITY', 'US', ['INSTITUTION_REGISTRY']));
ok(registry.resolve('US', 'INSTITUTION_REGISTRY')?.providerId === 'US-EDUCATION-AUTHORITY', 'a new country authority can register without changing the provider ID union');
ok(registry.resolve('US', 'ADMISSION_STATUS') === null, 'country connectors cannot be selected for capabilities they do not declare');

const nucResult = await registry.get('NUC').verifyInstitution('NUC-123');
ok(nucResult.valid && nucResult.authorityName === 'NUC', 'NUC connector response retains its own authority identity');
const nbteResult = await registry.get('NBTE').verifyInstitution('NBTE-123');
ok(!nbteResult.valid && nbteResult.status === 'UNAVAILABLE', 'unconfigured NBTE fails closed without affecting NUC');

console.log('Independent education connector isolation suite: GREEN');
