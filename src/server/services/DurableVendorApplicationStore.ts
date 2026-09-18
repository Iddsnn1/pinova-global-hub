import { get, list, put } from '@vercel/blob';

export interface DurableVendorApplication {
  id: string;
  pioneerUsername: string;
  [key: string]: any;
}

const PREFIX = 'vendor-applications/';

function enabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function keyFor(username: string): string {
  const safe = encodeURIComponent(username.trim().toLowerCase());
  return `${PREFIX}${safe}.json`;
}

async function readPath(pathname: string): Promise<DurableVendorApplication | null> {
  if (!enabled()) return null;
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const chunks: Uint8Array[] = [];
  const reader = result.stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const bytes = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function getDurableVendorApplication(username: string): Promise<DurableVendorApplication | null> {
  if (!username?.trim() || !enabled()) return null;
  return readPath(keyFor(username));
}

export async function saveDurableVendorApplication(application: DurableVendorApplication): Promise<DurableVendorApplication> {
  if (!enabled()) throw new Error('DURABLE_VENDOR_STORAGE_UNAVAILABLE');
  await put(keyFor(application.pioneerUsername), JSON.stringify(application), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    cacheControlMaxAge: 60
  });
  return application;
}

export async function listDurableVendorApplications(): Promise<DurableVendorApplication[]> {
  if (!enabled()) return [];
  const entries: DurableVendorApplication[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor });
    for (const blob of page.blobs) {
      const app = await readPath(blob.pathname);
      if (app) entries.push(app);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return entries;
}

export function durableVendorStorageEnabled(): boolean {
  return enabled();
}
