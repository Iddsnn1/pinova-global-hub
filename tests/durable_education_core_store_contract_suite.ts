import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(process.cwd(), 'src/server/services/DurableEducationCoreStore.ts'), 'utf8');
for (const method of [
  'getInstitutions', 'getInstitutionById', 'createInstitution',
  'getStudentById', 'getStudentsByGuardian', 'createStudent',
  'getGuardianChildren', 'saveGuardianChildSummary',
  'getAdmissions', 'getAdmissionById', 'createAdmission', 'updateAdmissionStatus',
  'getScholarships', 'createScholarship', 'updateScholarship'
]) assert.match(source, new RegExp('async ' + method + '\\('), method + ' must be implemented');
assert.match(source, /DURABLE_EDUCATION_STORAGE_UNAVAILABLE/);
assert.match(source, /ON CONFLICT \(id\) DO NOTHING/);
assert.match(source, /EDUCATION_ADMISSION_UPDATE_BINDING_MISMATCH/);
console.log('EDUCATION CORE STORE CONTRACT: PASS');

for (const filter of ['state', 'tier', 'isPublic', 'search']) {
  assert.match(source, new RegExp('filter\\?\\.' + filter), 'institution directory must preserve ' + filter + ' filtering');
}
assert.match(source, /rawStatus\.toUpperCase\(\) !== 'ALL'/, 'admissions status ALL sentinel must disable filtering');
assert.match(source, /normalizeCountryCode/);
assert.match(source, /matchesSubdivision/);
assert.match(source, /rawType\.toLowerCase\(\) !== 'all'/, 'institution type all sentinel must disable filtering');
assert.match(source, /rawStatus\.toUpperCase\(\) !== 'ALL'/, 'verification status ALL sentinel must disable filtering');
console.log('EDUCATION INSTITUTION FILTER PARITY: PASS');


const settlementSource = fs.readFileSync(path.resolve(process.cwd(), 'src/server/services/DurableEducationStore.ts'), 'utf8');
assert.match(settlementSource, /async getPaymentsByInvoiceId\(/, 'durable payment history read must be available');
assert.match(settlementSource, /FROM education_payments[\s\S]*?WHERE invoice_id = \$\{id\}[\s\S]*?ORDER BY verified_at DESC/, 'payment history must be scoped to invoice and ordered newest first');
assert.match(settlementSource, /async getAuditLogs\(/, 'durable audit log read must be available');
assert.match(settlementSource, /FROM education_audit_logs[\s\S]*?entity_type = \$\{type\}[\s\S]*?ORDER BY created_at DESC/, 'audit log reads must support entity filtering and newest-first order');
assert.match(settlementSource, /DURABLE_EDUCATION_STORAGE_UNAVAILABLE/, 'durable reads must fail closed when Neon is unavailable');
console.log('EDUCATION DURABLE HISTORY AND AUDIT READ CONTRACT: PASS');

const transitionSource = fs.readFileSync(path.resolve(process.cwd(), 'src/server/services/DurableEducationCoreStore.ts'), 'utf8');
assert.match(transitionSource, /async transitionAdmissionStatus\(/, 'durable admission transitions must be available');
assert.match(transitionSource, /EDUCATION_ADMISSION_ILLEGAL_STATUS_TRANSITION/, 'durable admission transitions must enforce the state machine');
assert.ok(transitionSource.includes('WHERE id = ${key} AND status = ${expected}'), 'admission transitions must compare-and-set the expected current status');
assert.ok(transitionSource.includes('INSERT INTO education_audit_logs') && transitionSource.includes('FROM updated') && transitionSource.includes('RETURNING id'), 'admission transition audit must commit atomically with the status update');
assert.match(transitionSource, /EDUCATION_ADMISSION_TRANSITION_BINDING_MISMATCH/, 'admission transition payload must be bound to its record and actor');
console.log('EDUCATION ATOMIC ADMISSION TRANSITION CONTRACT: PASS');



const scholarshipSource = source.slice(source.indexOf('async getScholarships('));
assert.ok(scholarshipSource.includes("item.applicableTiers.includes(tier as any)"), 'scholarship listing must filter by tier');
assert.ok(scholarshipSource.includes("item.eligibleCountries.some(code => clean(code).toUpperCase() === country)"), 'scholarship listing must filter country codes case-insensitively');
assert.ok(scholarshipSource.includes('async updateScholarship('), 'durable scholarship updates must be available');
assert.ok(scholarshipSource.includes('EDUCATION_SCHOLARSHIP_UPDATE_ID_MISMATCH'), 'scholarship update cannot change its ID');
assert.ok(scholarshipSource.includes('EDUCATION_SCHOLARSHIP_UPDATE_FIELD_NOT_ALLOWED'), 'scholarship updates must reject unknown fields');
assert.ok(scholarshipSource.includes('EDUCATION_SCHOLARSHIP_SPONSOR_TYPE_INVALID'), 'scholarship updates must validate sponsor type');
assert.ok(scholarshipSource.includes('data = data || ${patchJson}::jsonb'), 'scholarship updates must merge only supplied JSON fields');
assert.ok(scholarshipSource.includes("INSERT INTO education_audit_logs") && scholarshipSource.includes("FROM updated") && scholarshipSource.includes("RETURNING id"), 'scholarship update and audit must be atomic');
console.log('EDUCATION DURABLE SCHOLARSHIP CONTRACT: PASS');


const guardianRepositorySource = fs.readFileSync(path.resolve(process.cwd(), 'src/server/db/repositories/EducationRepository.ts'), 'utf8');
assert.match(guardianRepositorySource, /status !== 'CANCELLED'/, 'cancelled invoices must be excluded from guardian balances');
assert.match(guardianRepositorySource, /invoiceCurrencies\.length > 1/, 'guardian summaries must detect mixed invoice currencies');
assert.match(guardianRepositorySource, /hasMixedCurrencies \? 0/, 'mixed-currency legacy totals must fail closed instead of being added');
assert.match(guardianRepositorySource, /currency,\s*totalBilledFiat: totalBilled/, 'guardian summaries must expose the authoritative invoice currency');
console.log('GUARDIAN INVOICE CURRENCY AND CANCELLATION SAFETY CONTRACT: PASS');


const serverSource = fs.readFileSync(path.resolve(process.cwd(), 'server.ts'), 'utf8');
const guardianRoute = serverSource.slice(
  serverSource.indexOf("app.get('/api/education/guardians/:id/children'"),
  serverSource.indexOf("// 4. Invoices & Authoritative School Fees Engine")
);
assert.match(guardianRoute, /isGlobalAdmin\s*\|\|\s*isInstitutionAdmin/, 'institution admins may access guardian summaries only through the later institution-scoped filter');
assert.match(guardianRoute, /if \(isInstitutionAdmin\)[\s\S]*?INSTITUTION_SCOPE_REQUIRED[\s\S]*?child\.institutionId === institutionId/, 'institution admin guardian reads must require and enforce institution scope');
assert.match(serverSource, /educationRepo\.updateAdmissionStatus\(id, status, updatedBy, reason\)/, 'admission status audit must attribute the authenticated actor and preserve decision notes');
console.log('EDUCATION GUARDIAN SCOPE AND ADMISSION AUDIT ACTOR CONTRACT: PASS');

const studentRoute = serverSource.slice(
  serverSource.indexOf("app.get('/api/education/students/:id'"),
  serverSource.indexOf("app.get('/api/education/guardians/me/children'")
);
assert.match(studentRoute, /const isInstitutionAdmin = roles\.includes\('INSTITUTION_ADMIN'\)/, 'student route must identify institution administrators separately');
assert.match(studentRoute, /!req\.user\?\.institutionId \|\| req\.user\.institutionId !== student\.currentInstitutionId/, 'institution administrators must be restricted to students at their authenticated institution');
assert.match(studentRoute, /Institution administrator access is limited to students enrolled at the authenticated institution/, 'cross-institution student access must be denied explicitly');
console.log('EDUCATION STUDENT INSTITUTION SCOPE CONTRACT: PASS');

