/**
 * Safe Fetch Wrapper to guarantee non-crashing JSON API responses
 * Prevents "Unexpected token A... is not valid JSON" errors when servers return HTML or non-JSON errors.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  contentType: string;
  data: T | null;
  rawText: string;
  error?: string;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();
    const bodyPrefix = rawText.substring(0, 100).replace(/\s+/g, ' ');

    console.log(`[API DEBUG]\nURL: ${url}\nSTATUS: ${response.status}\nCONTENT-TYPE: ${contentType}\nBODY PREFIX: ${bodyPrefix}`);

    if (contentType.toLowerCase().includes('application/json')) {
      try {
        const data = JSON.parse(rawText) as T;
        return {
          ok: response.ok,
          status: response.status,
          contentType,
          data,
          rawText
        };
      } catch (jsonErr: any) {
        console.warn(`[API DEBUG] Failed to parse JSON from ${url}:`, jsonErr);
        return {
          ok: false,
          status: response.status,
          contentType,
          data: null,
          rawText,
          error: `JSON syntax error: ${jsonErr.message}`
        };
      }
    } else {
      console.warn(`[API DEBUG] Non-JSON response received from ${url} (${contentType}). Body prefix: ${bodyPrefix}`);
      return {
        ok: false,
        status: response.status,
        contentType,
        data: null,
        rawText,
        error: `Server returned non-JSON response (${contentType || 'unknown'})`
      };
    }
  } catch (err: any) {
    console.error(`[API DEBUG] Network error calling ${url}:`, err);
    return {
      ok: false,
      status: 0,
      contentType: '',
      data: null,
      rawText: '',
      error: err.message || 'Network error'
    };
  }
}
