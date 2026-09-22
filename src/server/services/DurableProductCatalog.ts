import { del, get, list, put } from '@vercel/blob';
import type { Product, ProductCategory, AvailabilityStatus } from '../../types';

const PREFIX = 'product-catalog/';

function enabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function keyFor(id: string): string {
  return `${PREFIX}${encodeURIComponent(String(id).trim())}.json`;
}

async function readPath(pathname: string): Promise<Product | null> {
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
  return JSON.parse(new TextDecoder().decode(bytes)) as Product;
}

async function listAll(): Promise<Product[]> {
  if (!enabled()) return [];
  const products: Product[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor });
    for (const blob of page.blobs) {
      const product = await readPath(blob.pathname);
      if (product) products.push(product);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return products;
}

function normalize(product: Product, existing?: Product): Product {
  const now = new Date().toISOString();
  const normalized: Product = {
    ...product,
    title: String(product.title || '').trim(),
    description: String(product.description || '').trim(),
    sellerId: String(product.sellerId || '').trim(),
    sellerName: String(product.sellerName || '').trim(),
    images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
    features: Array.isArray(product.features) ? product.features.filter(Boolean) : [],
    tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
    isActive: product.isActive ?? false,
    isDeleted: product.isDeleted ?? false,
    moderationStatus: product.moderationStatus ?? 'PENDING_REVIEW',
    createdAt: existing?.createdAt ?? product.createdAt ?? now,
    updatedAt: now
  };
  if (!normalized.id || !normalized.sellerId || !normalized.title) throw new Error('PRODUCT_ID_SELLER_ID_AND_TITLE_REQUIRED');
  if (!Number.isFinite(normalized.pricePi) || normalized.pricePi < 0) throw new Error('INVALID_PRODUCT_PRICE');
  if (!Number.isInteger(normalized.stock) || normalized.stock < 0) throw new Error('INVALID_PRODUCT_STOCK');
  return normalized;
}

export function durableProductStorageEnabled(): boolean {
  return enabled();
}

export async function getDurableProduct(id: string): Promise<Product | null> {
  if (!id?.trim() || !enabled()) return null;
  return readPath(keyFor(id));
}

export async function listDurableProducts(options?: {
  includeDeleted?: boolean;
  activeOnly?: boolean;
  sellerId?: string;
  category?: ProductCategory;
  q?: string;
}): Promise<Product[]> {
  const normalizedQuery = String(options?.q || '').trim().toLowerCase();
  return (await listAll()).filter((product) => {
    if (!options?.includeDeleted && product.isDeleted === true) return false;
    if (options?.activeOnly && product.isActive !== true) return false;
    if (options?.sellerId && product.sellerId !== options.sellerId) return false;
    if (options?.category && product.category !== options.category) return false;
    if (normalizedQuery) {
      const haystack = [
        product.title, product.description, product.subcategory, product.sellerName,
        ...(product.features || []), ...(product.tags || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });
}

export async function saveDurableProduct(product: Product): Promise<Product> {
  if (!enabled()) throw new Error('DURABLE_PRODUCT_STORAGE_UNAVAILABLE');
  const existing = await getDurableProduct(product.id);
  const normalized = normalize(product, existing || undefined);
  await put(keyFor(normalized.id), JSON.stringify(normalized), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    cacheControlMaxAge: 60
  });
  return normalized;
}

export async function updateDurableProductAvailability(
  id: string,
  availabilityStatus: AvailabilityStatus,
  stock: number
): Promise<Product | null> {
  const existing = await getDurableProduct(id);
  if (!existing || existing.isDeleted === true) return null;
  if (!Number.isInteger(stock) || stock < 0) throw new Error('INVALID_PRODUCT_STOCK');
  return saveDurableProduct({
    ...existing,
    stock,
    availabilityStatus,
    isActive: availabilityStatus !== 'out_of_stock' && existing.isActive !== false
  });
}

export async function softDeleteDurableProduct(id: string): Promise<boolean> {
  const existing = await getDurableProduct(id);
  if (!existing) return false;
  await saveDurableProduct({ ...existing, isDeleted: true, isActive: false });
  return true;
}

export async function reserveDurableProductStockBatch(
  requests: Array<{ id: string; quantity: number }>
): Promise<Product[] | undefined> {
  const merged = new Map<string, number>();
  for (const request of requests) {
    if (!request.id || !Number.isInteger(request.quantity) || request.quantity < 1) throw new Error('INVALID_STOCK_RESERVATION_QUANTITY');
    merged.set(request.id, (merged.get(request.id) || 0) + request.quantity);
  }
  const products = [];
  for (const [id, quantity] of merged) {
    const product = await getDurableProduct(id);
    if (!product || product.isDeleted === true || product.isActive !== true) return undefined;
    if (product.fulfillmentType !== 'digital_download' && product.fulfillmentType !== 'instant_key' && product.stock < quantity) return undefined;
    products.push({ product, quantity });
  }
  const updated: Product[] = [];
  for (const { product, quantity } of products) {
    if (product.fulfillmentType === 'digital_download' || product.fulfillmentType === 'instant_key') {
      updated.push(product);
      continue;
    }
    updated.push(await saveDurableProduct({
      ...product,
      stock: product.stock - quantity,
      availabilityStatus: product.stock - quantity <= 0 ? 'out_of_stock' : product.availabilityStatus,
      isActive: product.stock - quantity > 0
    }));
  }
  return updated;
}

export async function deleteDurableProductBlob(id: string): Promise<boolean> {
  if (!enabled()) return false;
  const existing = await getDurableProduct(id);
  if (!existing) return false;
  await del(keyFor(id));
  return true;
}
