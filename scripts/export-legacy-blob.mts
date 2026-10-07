import { list, get } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

type Bucket = 'products' | 'orders' | 'vendorApplications';

const prefixes: Record<Bucket, string> = {
  products: 'product-catalog/',
  orders: 'marketplace-orders/',
  vendorApplications: 'vendor-applications/',
};

// The durable migration source is the private pinova-global-hub-blob store.
// CI uses the dedicated read/write token for this store only. Never use the branding store token.
const readWriteToken = process.env.PRIVATE_BLOB_READ_WRITE_TOKEN?.trim();
const storeId = process.env.PRIVATE_BLOB_STORE_ID?.trim();

if (!readWriteToken) {
  throw new Error('LEGACY_BLOB_TOKEN_MISSING: PRIVATE_BLOB_READ_WRITE_TOKEN is required');
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

const blobOptions = { token: readWriteToken };

async function readJson(pathname: string): Promise<{ value: unknown; raw: string } | null> {
  try {
    const result = await get(pathname, { access: 'private', ...blobOptions });
    if (!result || result.statusCode !== 200 || !result.stream) return null;

    // ReadableStream is not typed as AsyncIterable in the CI TypeScript lib set.
    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const raw = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString('utf8');
    return { value: JSON.parse(raw), raw };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`LEGACY_BLOB_READ_FAILED: unable to download ${pathname}: ${message}`);
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
  sourceSha256?: string;
  recordId?: string;
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

    const raw = value.raw;
    const sourceSha256 = createHash('sha256').update(raw, 'utf8').digest('hex');
    const canonicalize = (input: unknown): unknown => {
      if (Array.isArray(input)) return input.map(canonicalize);
      if (input && typeof input === 'object') {
        return Object.fromEntries(
          Object.entries(input as Record<string, unknown>)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, child]) => [key, canonicalize(child)]),
        );
      }
      return input;
    };
    const normalized = JSON.stringify(canonicalize(value.value));
    const recordId =
      value.value && typeof value.value === 'object' && value.value !== null && 'id' in value.value
        ? String((value.value as { id?: unknown }).id ?? '').trim()
        : '';
    if (!recordId) {
      throw new Error(`LEGACY_BLOB_RECORD_ID_MISSING: ${blob.pathname} does not contain a top-level id`);
    }
    manifest.push({
      bucket,
      pathname: blob.pathname,
      size: blob.size,
      sha256: createHash('sha256').update(normalized, 'utf8').digest('hex'),
      sourceSha256,
      recordId,
      status: 'exported',
    });
    exported[bucket].push(value.value);
  }
}

const backup = {
  schemaVersion: 2,
  exportedAt: new Date().toISOString(),
  source: {
    provider: 'vercel-blob',
    mode: 'read-only',
    authentication: 'private-read-write-token',
    storeId,
    prefixes,
  },
  products: exported.products,
  orders: exported.orders,
  vendorApplications: exported.vendorApplications,
  // Fulfillment history is preserved inside each order's timeline in the legacy JSON.
  // Do not synthesize normalized fulfillment rows during export.
  orderFulfillment: [],
  manifest,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(backup, null, 2) + '\n', 'utf8');

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
