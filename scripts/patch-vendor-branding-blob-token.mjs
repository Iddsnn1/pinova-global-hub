import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('scripts/patch-vendor-branding-blob.mjs');
const source = fs.readFileSync(file, 'utf8');
const from = "const blob = await put('vendor-branding/' + assetId, fileBuffer, { access: 'public', contentType: mimeType, addRandomSuffix: false });";
const to = "const blobToken = process.env.BLOB_READ_WRITE_TOKEN;\n      if (!blobToken) throw new Error('BLOB_READ_WRITE_TOKEN is not configured for Vercel branding uploads.');\n      const blob = await put('vendor-branding/' + assetId, fileBuffer, { access: 'public', contentType: mimeType, addRandomSuffix: false, token: blobToken });";
if (!source.includes(from)) throw new Error('Vercel Blob put call not found');
fs.writeFileSync(file, source.replace(from, to).replace('Vercel Blob OIDC support.', 'Vercel Blob token authentication support.'), 'utf8');
console.log('Branding route patched to use BLOB_READ_WRITE_TOKEN explicitly.');
