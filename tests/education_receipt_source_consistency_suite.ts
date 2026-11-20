import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const serverSource = fs.readFileSync(path.resolve(process.cwd(), 'server.ts'), 'utf8');
const routeStart = serverSource.indexOf("app.get('/api/education/receipts/:receiptNumber', authenticate");
assert.notEqual(routeStart, -1, 'authenticated receipt route must exist');
const routeEnd = serverSource.indexOf("\n});", routeStart);
assert.notEqual(routeEnd, -1, 'authenticated receipt route must close');
const route = serverSource.slice(routeStart, routeEnd);

assert.match(route, /async \(req: AuthenticatedRequest, res\)/, 'receipt retrieval must be asynchronous');
assert.match(route, /await durableEducationStore\.getReceiptByNumber\(/, 'authenticated receipt retrieval must use durable Neon storage');
assert.doesNotMatch(route, /educationRepo\.getReceiptByNumber\(/, 'authenticated receipt retrieval must not read legacy local storage');
assert.match(route, /res\.status\(unavailable \? 503 : 500\)/, 'durable storage outage must fail closed with 503');
assert.match(route, /receipt\.studentId/, 'student ownership check must remain enforced');
assert.match(route, /PLATFORM_ADMIN.*BURSAR.*FINANCE_ADMIN.*INSTITUTION_ADMIN/, 'authorized finance/admin roles must retain access');

console.log('EDUCATION RECEIPT SOURCE CONSISTENCY SUITE: PASS');
