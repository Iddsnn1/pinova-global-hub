import type { Product } from '../types';
import { safeFetchJson } from './safeFetch';
import { vendorAuthenticatedFetch, getVendorAuthHeaders } from './vendorAuthBridge';

export interface ProductApiResult {
  ok: boolean;
  status: number;
  product?: Product;
  error?: string;
}

export async function createSellerProduct(input: Partial<Product>): Promise<ProductApiResult> {

  // Seller identity, activation, moderation state, rating and product id are server-owned.
  // Do not persist client-generated demo metadata or placeholder media.
  const result = await safeFetchJson<{ ok?: boolean; product?: Product; error?: string }>(
    '/api/products',
    {
      method: 'POST',
      headers: { ...getVendorAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title || '',
        description: input.description || '',
        pricePi: Number(input.pricePi || 0),
        category: input.category || 'physical',
        subcategory: input.subcategory || '',
        images: [],
        stock: Number.isInteger(input.stock) && (input.stock as number) >= 0 ? input.stock : 0,
        features: [],
        specs: input.specs,
        productType: input.productType,
        fulfillmentType: input.fulfillmentType,
        availabilityStatus: input.availabilityStatus,
        tags: [input.category, input.subcategory].filter(
          (value): value is string => typeof value === 'string' && value.trim().length > 0
        )
      })
    }
  );

  if (!result.ok || !result.data?.product) {
    return {
      ok: false,
      status: result.status,
      error: result.data?.error || result.error || 'PRODUCT_CREATE_FAILED'
    };
  }

  return { ok: true, status: result.status, product: result.data.product };
}

export async function updateSellerProduct(
  productId: string,
  patch: Partial<Product>
): Promise<ProductApiResult> {
  const result = await safeFetchJson<{ ok?: boolean; product?: Product; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    { method: 'PATCH', headers: { ...getVendorAuthHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }
  );

  if (!result.ok || !result.data?.product) {
    return {
      ok: false,
      status: result.status,
      error: result.data?.error || result.error || 'PRODUCT_UPDATE_FAILED'
    };
  }

  return { ok: true, status: result.status, product: result.data.product };
}

export async function deleteSellerProduct(productId: string): Promise<ProductApiResult> {
  const result = await safeFetchJson<{ ok?: boolean; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    { method: 'DELETE', headers: getVendorAuthHeaders() }
  );

  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      error: result.data?.error || result.error || 'PRODUCT_DELETE_FAILED'
    };
  }

  return { ok: true, status: result.status };
}
