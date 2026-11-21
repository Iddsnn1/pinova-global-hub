import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const auditPath = path.resolve(process.cwd(), 'scripts/audit-education-legacy-data.mts');
const source = fs.readFileSync(auditPath, 'utf8');
for (const collection of [
  'education_institutions', 'education_students', 'education_guardian_children',
  'education_invoices', 'education_payments', 'education_receipts',
  'education_admissions', 'education_scholarships', 'education_audit_logs'
]) assert.ok(source.includes(collection), 'legacy audit must cover ' + collection);

assert.match(source, /PINOVA_DATA_DIR/);
assert.match(source, /createHash\('sha256'\)/);
assert.match(source, /duplicateKeys/);
assert.match(source, /missingKeys/);
assert.match(source, /INVALID_JSON/);
assert.match(source, /INVALID_SHAPE/);
assert.match(source, /readOnly: true/);
assert.match(source, /noRecordsExported: true/);
assert.match(source, /File is not valid JSON; source left untouched/);
assert.match(source, /Expected a JSON array; source left untouched/);
assert.doesNotMatch(source, /writeFileSync|renameSync|unlinkSync|INSERT INTO|UPDATE /,
  'audit must never mutate legacy files or Neon data');
console.log('EDUCATION LEGACY READ-ONLY MIGRATION AUDIT CONTRACT: PASS');
