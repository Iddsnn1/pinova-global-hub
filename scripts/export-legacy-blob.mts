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

const token =
  process.env.PRIVATE_BLOB_READ_WRITE_TOKEN?.trim();

if (!token) {
  throw new Error(
    'LEGACY_BLOB_READ_TOKEN_MISSING: set PRIVATE_BLOB_READ_WRITE_TOKEN in the GitHub Actions environment',
  );
}

const storeId = process.env.PRIVATE_BLOB_STORE_ID?.trim() || undefined;
const output = resolve(
  process.env.LEGACY_BLOB_BACKUP_FILE?.trim() ||
    '/tmp/pinova-legacy-blob-backup.json',
);
const blobOptions = storeId ? { token, storeId } : { token };

async function readJson(pathname: string): Promise<unknown | null> {
  const result = await get(pathname, {
    access: 'private',
    useCache: false,
    ...blobOptions,
  });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const chunks: Uint8Array[] = [];
  const reader = result.stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }

  return JSON.parse(new TextDecoder().decode(bytes));
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
    prefixes,
  },
  products: exported.products,
  orders: exported.orders,
  vendorApplications: exported.vendorApplications,
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
