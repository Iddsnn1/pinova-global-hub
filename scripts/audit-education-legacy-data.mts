import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type CollectionSpec = { name: string; primaryKey: string };
const collections: CollectionSpec[] = [
  { name: 'education_institutions', primaryKey: 'id' },
  { name: 'education_students', primaryKey: 'id' },
  { name: 'education_guardian_children', primaryKey: 'studentId' },
  { name: 'education_invoices', primaryKey: 'id' },
  { name: 'education_payments', primaryKey: 'id' },
  { name: 'education_receipts', primaryKey: 'receiptNumber' },
  { name: 'education_admissions', primaryKey: 'id' },
  { name: 'education_scholarships', primaryKey: 'id' },
  { name: 'education_audit_logs', primaryKey: 'id' }
];

type CollectionReport = {
  collection: string;
  primaryKey: string;
  status: 'PRESENT' | 'MISSING' | 'INVALID_JSON' | 'INVALID_SHAPE';
  records: number | null;
  duplicateKeys: number | null;
  missingKeys: number | null;
  sha256: string | null;
  bytes: number | null;
  currencyCounts?: Record<string, number>;
  error?: string;
};

const dataDir = process.env.PINOVA_DATA_DIR || path.join(process.cwd(), 'data', 'db');
const report: CollectionReport[] = [];

for (const spec of collections) {
  const filePath = path.join(dataDir, spec.name + '.json');
  if (!fs.existsSync(filePath)) {
    report.push({
      collection: spec.name, primaryKey: spec.primaryKey, status: 'MISSING',
      records: null, duplicateKeys: null, missingKeys: null, sha256: null, bytes: null
    });
    continue;
  }

  const raw = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(raw).digest('hex');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.toString('utf8'));
  } catch {
    report.push({
      collection: spec.name, primaryKey: spec.primaryKey, status: 'INVALID_JSON',
      records: null, duplicateKeys: null, missingKeys: null, sha256, bytes: raw.byteLength,
      error: 'File is not valid JSON; source left untouched'
    });
    continue;
  }

  if (!Array.isArray(parsed)) {
    report.push({
      collection: spec.name, primaryKey: spec.primaryKey, status: 'INVALID_SHAPE',
      records: null, duplicateKeys: null, missingKeys: null, sha256, bytes: raw.byteLength,
      error: 'Expected a JSON array; source left untouched'
    });
    continue;
  }

  const seen = new Set<string>();
  let duplicateKeys = 0;
  let missingKeys = 0;
  const currencyCounts: Record<string, number> = {};
  for (const value of parsed) {
    const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const key = String(record[spec.primaryKey] ?? record.id ?? '').trim();
    if (!key) missingKeys++;
    else if (seen.has(key)) duplicateKeys++;
    else seen.add(key);

    if (spec.name === 'education_invoices') {
      const currency = String(record.currency ?? 'UNKNOWN').trim().toUpperCase() || 'UNKNOWN';
      currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
    }
  }

  report.push({
    collection: spec.name, primaryKey: spec.primaryKey, status: 'PRESENT',
    records: parsed.length, duplicateKeys, missingKeys, sha256, bytes: raw.byteLength,
    ...(spec.name === 'education_invoices' ? { currencyCounts } : {})
  });
}

const summary = {
  audit: 'PINOVA_EDUCATION_LEGACY_READ_ONLY_AUDIT',
  generatedAt: new Date().toISOString(),
  dataDirectory: dataDir,
  readOnly: true,
  noRecordsExported: true,
  collections: report,
  totals: {
    presentCollections: report.filter(item => item.status === 'PRESENT').length,
    missingCollections: report.filter(item => item.status === 'MISSING').length,
    invalidCollections: report.filter(item => item.status === 'INVALID_JSON' || item.status === 'INVALID_SHAPE').length,
    records: report.reduce((sum, item) => sum + (item.records ?? 0), 0),
    duplicateKeys: report.reduce((sum, item) => sum + (item.duplicateKeys ?? 0), 0),
    missingKeys: report.reduce((sum, item) => sum + (item.missingKeys ?? 0), 0)
  }
};

process.stdout.write(JSON.stringify(summary, null, 2) + '\\n');
if (summary.totals.invalidCollections > 0 || summary.totals.duplicateKeys > 0 || summary.totals.missingKeys > 0) {
  process.exitCode = 2;
}
