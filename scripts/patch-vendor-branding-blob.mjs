#!/usr/bin/env node
/**
 * scripts/patch-vendor-branding-blob.mjs
 * 
 * Verifies and ensures the production server source contains the native
 * durable object storage integration, MIME validation, file signature enforcement,
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
const hasObjectStorageImport = serverContent.includes('src/server/services/ObjectStorage');
const hasBrandingRoute =
  serverContent.includes('/api/vendor/branding-upload') ||
  serverContent.includes('/api/v1/vendor/branding-upload');
const hasMagicByteCheck = serverContent.includes('validateBrandingImageSignature');
const hasStructuredErrors =
  serverContent.includes('OBJECT_STORAGE_NOT_CONFIGURED') &&
  serverContent.includes('PRODUCT_IMAGE_READ_ERROR') &&
  serverContent.includes('BRANDING_ASSET_READ_ERROR');
const hasObjectStorageConfig = serverContent.includes('objectStorageEnabled');
const hasObjectStoragePut = serverContent.includes('putObject') && serverContent.includes('vendor-branding/');
const hasNoBlobImport = !serverContent.includes('@vercel/blob');
const hasNoBlobToken = !serverContent.includes('BLOB_READ_WRITE_TOKEN');

const checks = {
  hasObjectStorageImport,
  hasBrandingRoute,
  hasMagicByteCheck,
  hasStructuredErrors,
  hasObjectStorageConfig,
  hasObjectStoragePut,
  hasNoBlobImport,
  hasNoBlobToken
};

const allPassed = Object.values(checks).every(Boolean);

if (allPassed) {
  if (process.env.DEBUG || process.argv.includes('--verbose')) {
    console.log('[patch-vendor-branding-blob] server.ts verified: durable object storage, magic-byte checks, structured errors, and legacy Blob dependencies are absent.');
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
