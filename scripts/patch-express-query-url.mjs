import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'node_modules', 'express', 'lib', 'middleware', 'query.js');

if (!fs.existsSync(target)) {
  console.log('[express-query-patch] Express query middleware not found; skipping.');
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const legacyImport = "var parseUrl = require('parseurl');";
const safeImport = `function parseUrl(req) {
  const raw = String(req.url || '');
  const queryIndex = raw.indexOf('?');
  const query = queryIndex >= 0 ? raw.slice(queryIndex + 1).split('#', 1)[0] : null;
  return { query };
}`;

if (!source.includes(legacyImport)) {
  console.log('[express-query-patch] No legacy parseurl import found; leaving dependency untouched.');
  process.exit(0);
}

const patched = source.replace(legacyImport, safeImport);
fs.writeFileSync(target, patched);
console.log('[express-query-patch] Patched Express query middleware to use WHATWG-safe URL extraction.');
