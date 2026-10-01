import { list, get } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, resolve } from 'node:path';

type Bucket = 'products' | 'orders' | 'vendorApplications';

const prefixes: Record<Bucket, string> = {
  products: 'product-catalog/',
  orders: 'marketplace-orders/',
  vendorApplications: 'vendor-applications/',
};

// The durable migration source is the private pinova-global-hub-blob store.
// It is connected to the pinova-global-hub project and authenticates through
// Vercel's short-lived project OIDC token. Never use the branding store token.
const execFileAsync = promisify(execFile);

const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();
const storeId = process.env.PRIVATE_BLOB_STORE_ID?.trim();

if (!oidcToken) {
  throw new Error(
    'LEGACY_BLOB_OIDC_MISSING: VERCEL_OIDC_TOKEN is required for the connected private legacy store',
  );
}
if (!storeId) {
  throw new Error('LEGACY_BLOB_STORE_ID_MISSING: PRIVATE_BLOB_STORE_ID is required');
}
if (storeId !== 'store_zypKOROZmcB8ihIX') {
  throw new Error(`LEGACY_BLOB_STORE_MISMATCH: expected store_zypKOROZmcB8ihIX, got ${storeId}`);
}

const output = resolve(
  process.env.LEGACY_BLOB_BACKUP_FILE?.trim() ||
    '/tmp/pinova-legacy-blob-backup.json',
);

// Explicitly bind the SDK to the connected project's OIDC credential.
// No long-lived read/write token is accepted by this migration path.
const blobOptions = {
  oidcToken,
  storeId,
};

async function readJson(pathname: string): Promise<unknown | null> {
  const tempPath = resolve(
    '/tmp',
    `pinova-legacy-blob-${createHash('sha256').update(pathname).digest('hex').slice(0, 16)}.json`,
  );

  try {
    // The SDK's list() control-plane call accepts project OIDC, but its direct
    // private-object GET path currently returns 403 from the Blob data plane
    // in this external GitHub runner. Use the Vercel CLI for the actual
    // private download; Vercel documents the CLI as OIDC-capable for Blob.
    await execFileAsync(
      'npx',
      [
        '--yes',
        'vercel@latest',
        'blob',
        'get',
        pathname,
        '--access',
        'private',
        '--output',
        tempPath,
        '--no-color',
      ],
      {
        env: process.env,
        maxBuffer: 1024 * 1024,
      },
    );

    const raw = await readFile(tempPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `LEGACY_BLOB_READ_FAILED: unable to download ${pathname} through Vercel CLI: ${message}`,
    );
  } finally {
    await rm(tempPath, { force: true }).catch(() => undefined);
  }
}

async function listPrefix(prefix: string) {
  const blobs: Array<{ pathname: string; url?: string; size?: number }> = [];
  let cursor: string | undefined;

  do {
    const page = await list({
      prefix,
      limit: 1000,
      ...(cursor ? { cursor } : {}),
      ...blobOptions,
    });
    blobs.push(
      ...page.blobs.map((blob) => ({
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
      })),
    );
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return blobs;
}

const exported: Record<Bucket, unknown[]> = {
  products: [],
  orders: [],
  vendorApplications: [],
};

const manifest: Array<{
  bucket: Bucket;
  pathname: string;
  size?: number;
  sha256?: string;
  status: 'exported' | 'unreadable';
}> = [];

for (const bucket of Object.keys(prefixes) as Bucket[]) {
  const blobs = await listPrefix(prefixes[bucket]);

  for (const blob of blobs) {
    const value = await readJson(blob.pathname);
    if (value === null) {
      manifest.push({
        bucket,
        pathname: blob.pathname,
        size: blob.size,
        status: 'unreadable',
      });
      continue;
    }

    const raw = JSON.stringify(value);
    manifest.push({
      bucket,
      pathname: blob.pathname,
      size: blob.size,
      sha256: createHash('sha256').update(raw).digest('hex'),
      status: 'exported',
    });
    exported[bucket].push(value);
  }
}

const backup = {
  schemaVersion: 1,
  exportedAt: new Date().toISOString(),
  source: {
    provider: 'vercel-blob',
    mode: 'read-only',
    authentication: 'vercel-project-oidc',
    storeId,
    prefixes,
  },
  products: exported.products,
  orders: exported.orders,
  vendorApplications: exported.vendorApplications,
  orderFulfillment: [],
  manifest,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(backup, null, 2) + '\\n', 'utf8');

const counts = {
  products: exported.products.length,
  orders: exported.orders.length,
  vendorApplications: exported.vendorApplications.length,
  unreadable: manifest.filter((item) => item.status === 'unreadable').length,
};

console.log(JSON.stringify({ output, counts }, null, 2));
if (counts.unreadable > 0) {
  throw new Error('LEGACY_BLOB_EXPORT_INCOMPLETE');
}
