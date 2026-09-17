import type { Product } from '../types';
import { safeFetchJson } from './safeFetch';

export interface ProductApiResult {
  ok: boolean;
  status: number;
  product?: Product;
  error?: string;
}

function getStoredSessionToken(): string | null {
  try {
    return (
      localStorage.getItem('auth_token') ||
      localStorage.getItem('pinova_token') ||
      localStorage.getItem('pi_auth_token')
    );
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> | null {
  const token = getStoredSessionToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : null;
}

export async function createSellerProduct(input: Partial<Product>): Promise<ProductApiResult> {
  const headers = authHeaders();
  if (!headers) {
    return { ok: false, status: 401, error: 'AUTHENTICATION_REQUIRED' };
  }

  const result = await safeFetchJson<{ ok?: boolean; product?: Product; error?: string }>(
    '/api/products',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: input.title || '',
        description: input.description || '',
        pricePi: Number(input.pricePi || 0),
        category: input.category || 'physical',
        subcategory: input.subcategory || '',
        images: Array.isArray(input.images) ? input.images : [],
        stock: Number.isInteger(input.stock) && (input.stock as number) >= 0 ? input.stock : 0,
        features: Array.isArray(input.features) ? input.features : [],
        specs: input.specs,
        productType: input.productType,
        fulfillmentType: input.fulfillmentType,
        availabilityStatus: input.availabilityStatus,
        tags: Array.isArray(input.tags) ? input.tags : []
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
  const headers = authHeaders();
  if (!headers) return { ok: false, status: 401, error: 'AUTHENTICATION_REQUIRED' };

  const result = await safeFetchJson<{ ok?: boolean; product?: Product; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    { method: 'PATCH', headers, body: JSON.stringify(patch) }
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
  const headers = authHeaders();
  if (!headers) return { ok: false, status: 401, error: 'AUTHENTICATION_REQUIRED' };

  const result = await safeFetchJson<{ ok?: boolean; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    { method: 'DELETE', headers }
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
