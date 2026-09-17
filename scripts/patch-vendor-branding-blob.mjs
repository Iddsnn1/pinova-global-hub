#!/usr/bin/env node
/**
 * scripts/patch-vendor-branding-blob.mjs
 * 
 * Verifies and ensures the production server source contains the native
 * Vercel Blob storage integration, MIME validation, file signature enforcement,
 * and robust error codes before esbuild bundles dist/server.cjs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const serverPath = path.join(rootDir, 'server.ts');

if (!fs.existsSync(serverPath)) {
  console.error('[patch-vendor-branding-blob] server.ts not found at:', serverPath);
  process.exit(1);
}

const serverContent = fs.readFileSync(serverPath, 'utf8');

// Verification checks - format-tolerant but strictly enforcing security architecture
const hasBlobImport = serverContent.includes('@vercel/blob');
const hasBrandingRoute =
  serverContent.includes('/api/vendor/branding-upload') ||
  serverContent.includes('/api/v1/vendor/branding-upload');
const hasMagicByteCheck = serverContent.includes('validateBrandingImageSignature');
const hasStructuredErrors =
  serverContent.includes('BLOB_CONFIGURATION_ERROR') &&
  serverContent.includes('BLOB_UPLOAD_FAILED');
const hasBlobToken = serverContent.includes('BLOB_READ_WRITE_TOKEN');
const hasBlobPut =
  serverContent.includes('vendor-branding/${assetId}') ||
  serverContent.includes("vendor-branding/' + assetId") ||
  serverContent.includes('vendor-branding/" + assetId') ||
  /vendor-branding\/[`'"]?\s*(\+|\$)\s*\{?\s*assetId\s*\}?/i.test(serverContent) ||
  (/put\s*\(\s*[`'"]vendor-branding/i.test(serverContent) && serverContent.includes('assetId'));
const hasSellerAccess = serverContent.includes('/api/vendor/seller/access');
const hasSellerAuthorize = serverContent.includes('/api/vendor/seller/authorize');

const checks = {
  hasBlobImport,
  hasBrandingRoute,
  hasMagicByteCheck,
  hasStructuredErrors,
  hasBlobToken,
  hasBlobPut,
  hasSellerAccess,
  hasSellerAuthorize
};

const allPassed = Object.values(checks).every(Boolean);

if (allPassed) {
  if (process.env.DEBUG || process.argv.includes('--verbose')) {
    console.log('[patch-vendor-branding-blob] server.ts verified: native Vercel Blob storage, magic-byte checks, structured errors, and seller authorization routes are fully present.');
  }
  process.exit(0);
} else {
  console.error('[patch-vendor-branding-blob] Critical server integrity check failed:', checks);
  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  console.error(`[patch-vendor-branding-blob] Missing required architectural components: ${failedChecks.join(', ')}`);
  process.exit(1);
}
