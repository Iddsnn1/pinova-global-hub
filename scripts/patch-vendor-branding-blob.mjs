import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
const source = fs.readFileSync(file, 'utf8');
const startMarker = '// POST /api/vendor/branding-upload & /api/v1/vendor/branding-upload';
const endMarker = '// GET /api/vendor/branding-asset/:assetId & /api/v1/vendor/branding-asset/:assetId';
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);
if (start < 0 || end <= start) throw new Error('Branding route boundaries not found');

const route = `${startMarker}
app.post(['/api/vendor/branding-upload', '/api/v1/vendor/branding-upload'], authenticate, handleVendorBrandingRawBody, async (req: AuthenticatedRequest, res) => {
  try {
    const authUser = req.authenticatedUser || (req as any).user;
    if (!authUser?.username) return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required to upload merchant storefront branding.' });

    let mimeType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return res.status(400).json({ success: false, error: 'INVALID_MIME_TYPE', message: 'Invalid branding image format.' });
    }

    // Vercel may pre-buffer the request before Express receives it. Prefer that
    // buffer when available; otherwise the route-level raw parser reads the stream.
    const rawBody = (req as any).body;
    let fileBuffer: Buffer;
    if (Buffer.isBuffer(rawBody)) {
      fileBuffer = rawBody;
    } else if (rawBody instanceof Uint8Array) {
      fileBuffer = Buffer.from(rawBody);
    } else if (typeof rawBody === 'string') {
      fileBuffer = Buffer.from(rawBody, 'binary');
    } else {
      fileBuffer = Buffer.from(rawBody || '');
    }

    if (!fileBuffer.length) return res.status(400).json({ success: false, error: 'EMPTY_FILE', message: 'Branding image content is empty or unreadable.' });
    if (fileBuffer.length > 5 * 1024 * 1024) return res.status(400).json({ success: false, error: 'FILE_TOO_LARGE', message: 'Branding image exceeds maximum allowed size of 5 MB.' });
    if (!validateBrandingImageSignature(fileBuffer, mimeType)) return res.status(400).json({ success: false, error: 'FILE_SIGNATURE_MISMATCH', message: 'File content does not match the declared image signature.' });

    const brandingType = String(req.headers['x-branding-type'] || req.query?.type || 'logo').toLowerCase() === 'banner' ? 'banner' : 'logo';
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const assetId = brandingType + '_' + crypto.randomBytes(16).toString('hex') + '.' + ext;

    if (process.env.VERCEL === '1') {
      const { put } = await import('@vercel/blob');
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      const blobPath = 'vendor-branding/' + assetId;
      const baseOptions = { access: 'public' as const, contentType: mimeType, addRandomSuffix: false };

      let blob;
      try {
        blob = await put(blobPath, fileBuffer, blobToken ? { ...baseOptions, token: blobToken } : baseOptions);
      } catch (firstError: any) {
        // If a configured token is stale/unavailable, retry once using Vercel's
        // runtime OIDC credentials. Never persist branding to ephemeral /tmp.
        if (blobToken) {
          console.error('[Vendor Branding] Blob token upload failed; retrying with runtime credentials', {
            name: firstError?.name,
            code: firstError?.code,
            message: firstError?.message
          });
          try {
            blob = await put(blobPath, fileBuffer, baseOptions);
          } catch (secondError: any) {
            console.error('[Vendor Branding] Blob OIDC upload failed', {
              name: secondError?.name,
              code: secondError?.code,
              message: secondError?.message
            });
            const error: any = new Error('Vercel Blob upload failed');
            error.code = secondError?.code || firstError?.code || 'BLOB_UPLOAD_FAILED';
            throw error;
          }
        } else {
          console.error('[Vendor Branding] Blob upload failed', {
            name: firstError?.name,
            code: firstError?.code,
            message: firstError?.message
          });
          const error: any = new Error('Vercel Blob upload failed');
          error.code = firstError?.code || 'BLOB_UPLOAD_FAILED';
          throw error;
        }
      }

      return res.status(201).json({ success: true, url: blob.url, assetId, brandingType, storage: 'vercel-blob', message: 'Store ' + brandingType + ' uploaded successfully.' });
    }

    const dir = getVendorBrandingDir();
    fs.writeFileSync(path.join(dir, assetId), fileBuffer, { mode: 0o644 });
    return res.status(201).json({ success: true, url: '/api/vendor/branding-asset/' + assetId, assetId, brandingType, storage: 'local-dev', message: 'Store ' + brandingType + ' uploaded successfully.' });
  } catch (err: any) {
    console.error('[Vendor Branding] Upload failed', { name: err?.name, code: err?.code, message: err?.message });
    const errorCode = err?.code === 'BLOB_CONFIGURATION_ERROR' ? 'BLOB_CONFIGURATION_ERROR' : 'BLOB_UPLOAD_FAILED';
    return res.status(500).json({ success: false, error: errorCode, message: 'Branding image storage is temporarily unavailable.' });
  }
});

`;
fs.writeFileSync(file, source.slice(0, start) + route + source.slice(end), 'utf8');
console.log('Durable branding route patched with Vercel pre-buffer compatibility, explicit-token upload, and safe OIDC retry.');
