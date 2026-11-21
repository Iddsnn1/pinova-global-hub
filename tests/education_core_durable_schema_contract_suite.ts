import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const migration = fs.readFileSync(
  path.resolve(process.cwd(), 'migrations/20261120_education_core_records.sql'),
  'utf8'
);
for (const table of [
  'education_institutions',
  'education_students',
  'education_guardian_children',
  'education_admissions',
  'education_scholarships'
]) {
  assert.match(migration, new RegExp('CREATE TABLE IF NOT EXISTS ' + table + '\\b'));
}
assert.match(migration, /data JSONB NOT NULL/g);
assert.match(migration, /ON CONFLICT \(migration_id\) DO NOTHING/);
assert.doesNotMatch(migration, /DROP TABLE|TRUNCATE|DELETE FROM|ALTER TABLE .* DROP/i);
assert.match(migration, /No legacy records are copied or deleted/);
console.log('EDUCATION CORE DURABLE SCHEMA CONTRACT: PASS');
