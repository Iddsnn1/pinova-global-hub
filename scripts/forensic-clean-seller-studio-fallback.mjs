import fs from 'node:fs';
import path from 'node:path';

// Build-time guard only: never rewrite application source during deployment.
const file = path.resolve('src/components/seller/SellerStudioV2.tsx');
if (!fs.existsSync(file)) {
  console.error('[seller-fallback-check] SellerStudioV2.tsx was not found.');
  process.exit(1);
}

const source = fs.readFileSync(file, 'utf8');
const forbiddenFallbacks = [
  ['fabricated verified merchant bio', /Official verified PiNova Merchant Store\./],
  ['fabricated five-star rating', /rating:\\s*5\\.0\\s*,/],
  ['stock banner image fallback', /photo-1441986300917-64674bd600d8/],
  ['stock logo image fallback', /photo-1472851294608-062f824d29cc/],
  ['fabricated joined date', /joinedDate:\\s*['"]2025-01-01['"]/],
  ['fabricated global shipping claim', /shippingCountries:\\s*\\[['"]Global['"]\\]/]
];

const violations = forbiddenFallbacks
  .filter(([, pattern]) => pattern.test(source))
  .map(([label]) => label);

if (violations.length) {
  console.error('[seller-fallback-check] Unsafe synthetic merchant defaults detected:', violations);
  process.exit(1);
}

console.log('[seller-fallback-check] No synthetic merchant identity defaults detected.');
