import assert from 'node:assert/strict';
import {
  canVerifyInstitutionAccreditation,
  resolveStudentVerificationAccess
} from '../src/server/routes/educationVerificationAccess';

function run() {
  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['STUDENT'],
    requestedInstitutionId: 'school-a'
  }), { allowed: false, error: 'FORBIDDEN' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['GUARDIAN'],
    requestedInstitutionId: 'school-a'
  }), { allowed: false, error: 'FORBIDDEN' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['INSTITUTION_ADMIN'],
    authenticatedInstitutionId: 'school-a'
  }), { allowed: true, institutionId: 'school-a' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['INSTITUTION_ADMIN'],
    authenticatedInstitutionId: 'school-a',
    requestedInstitutionId: 'school-b'
  }), { allowed: false, error: 'FORBIDDEN' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['ADMISSIONS_OFFICER'],
    requestedInstitutionId: 'school-a'
  }), { allowed: false, error: 'INSTITUTION_SCOPE_REQUIRED' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['COMPLIANCE_OFFICER'],
    requestedInstitutionId: 'school-b'
  }), { allowed: true, institutionId: 'school-b' });

  assert.deepEqual(resolveStudentVerificationAccess({
    roles: ['PLATFORM_ADMIN']
  }), { allowed: false, error: 'INSTITUTION_SCOPE_REQUIRED' });

  assert.equal(canVerifyInstitutionAccreditation(['STUDENT']), false);
  assert.equal(canVerifyInstitutionAccreditation(['INSTITUTION_ADMIN']), false);
  assert.equal(canVerifyInstitutionAccreditation(['COMPLIANCE_ADMIN']), true);

  console.log('Education verification authorization suite passed');
}

run();
