import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(process.cwd(), 'src/server/services/DurableEducationCoreStore.ts'), 'utf8');
for (const method of [
  'getInstitutions', 'getInstitutionById', 'createInstitution',
  'getStudentById', 'getStudentsByGuardian', 'createStudent',
  'getGuardianChildren', 'saveGuardianChildSummary',
  'getAdmissions', 'getAdmissionById', 'createAdmission', 'updateAdmissionStatus',
  'getScholarships', 'createScholarship'
]) assert.match(source, new RegExp('async ' + method + '\\('), method + ' must be implemented');
assert.match(source, /DURABLE_EDUCATION_STORAGE_UNAVAILABLE/);
assert.match(source, /ON CONFLICT \(id\) DO NOTHING/);
assert.match(source, /EDUCATION_ADMISSION_UPDATE_BINDING_MISMATCH/);
console.log('EDUCATION CORE STORE CONTRACT: PASS');

for (const filter of ['state', 'tier', 'isPublic', 'search']) {
  assert.match(source, new RegExp('filter\\?\\.' + filter), 'institution directory must preserve ' + filter + ' filtering');
}
assert.match(source, /normalizeCountryCode/);
assert.match(source, /matchesSubdivision/);
assert.match(source, /rawType\.toLowerCase\(\) !== 'all'/, 'institution type all sentinel must disable filtering');
assert.match(source, /rawStatus\.toUpperCase\(\) !== 'ALL'/, 'verification status ALL sentinel must disable filtering');
console.log('EDUCATION INSTITUTION FILTER PARITY: PASS');
