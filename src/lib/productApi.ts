import type { Product } from '../types';
import { vendorAuthenticatedFetch } from './vendorAuthBridge';

export interface ProductApiResult {
  ok: boolean;
  status: number;
  product?: Product;
  error?: string;
}

async function authenticatedJsonFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const response = await vendorAuthenticatedFetch(input, init);
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    let data: T | undefined;
    if (text.trim()) {
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(text) as T;
        } catch {
          return { ok: false, status: response.status, error: 'INVALID_JSON_RESPONSE' };
        }
      } else {
        return {
          ok: false,
          status: response.status,
          error: `Server returned non-JSON response (${contentType || 'unknown'})`
        };
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? undefined : ((data as any)?.error || `HTTP_${response.status}`)
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 0,
      error: error?.message || 'NETWORK_ERROR'
    };
  }
}

export async function createSellerProduct(input: Partial<Product>): Promise<ProductApiResult> {
  const result = await authenticatedJsonFetch<{ ok?: boolean; product?: Product; error?: string }>(
    '/api/products',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title || '',
        description: input.description || '',
        pricePi: Number(input.pricePi || 0),
        category: input.category || 'physical',
        marketplaceCategory: input.marketplaceCategory || '',
        subcategory: input.subcategory || '',
        images: Array.isArray(input.images) ? input.images.filter(Boolean) : [],
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
  const result = await authenticatedJsonFetch<{ ok?: boolean; product?: Product; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    }
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
  const result = await authenticatedJsonFetch<{ ok?: boolean; error?: string }>(
    `/api/products/${encodeURIComponent(productId)}`,
    { method: 'DELETE' }
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
