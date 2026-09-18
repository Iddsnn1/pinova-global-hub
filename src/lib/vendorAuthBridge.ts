import { getAuthenticatedPiUser, PiSdkManager } from './piSdk';

/**
 * Server-Authoritative Vendor Authentication Bridge
 * 
 * Safely resolves authenticated merchant credentials from active Pi SDK state,
 * establishes durable server sessions via POST /api/auth/session, and manages
 * session renewal, 401 retry loops, and server-enforced seller access.
 * 
 * Non-negotiable security rules:
 * - Server is the sole authority for authentication & authorization.
 * - Client roles and localStorage are NEVER trusted as security boundaries.
 * - Sensitive credentials & secrets are never leaked.
 */

let inMemoryServerToken: string | null = null;
let tokenExpiresAt: number | null = null;

export function getVendorAuthToken(): string | null {
  try {
    // 1. Check in-memory server session token if still valid
    if (inMemoryServerToken && (!tokenExpiresAt || Date.now() < tokenExpiresAt)) {
      return inMemoryServerToken;
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      // 2. Check storage for established server auth_token
      const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('pi_auth_token') ||
        localStorage.getItem('pinova_token') ||
        localStorage.getItem('pinova_access_token');
      if (token && token.trim()) {
        inMemoryServerToken = token.trim();
        return token.trim();
      }

      // 3. Check sessionStorage
      const sessionToken = sessionStorage.getItem('auth_token') || sessionStorage.getItem('pi_auth_token');
      if (sessionToken && sessionToken.trim()) return sessionToken.trim();
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
  // Rule 8: NEVER substitute raw Pi access token as the protected vendor authorization credential.
  return null;
}

export function getVendorUsername(): string | null {
  try {
    const piUser = getAuthenticatedPiUser();
    if (piUser?.username && typeof piUser.username === 'string' && piUser.username.trim()) {
      return piUser.username.trim();
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const username =
        localStorage.getItem('pinova_pioneer_username') ||
        localStorage.getItem('pi_username') ||
        localStorage.getItem('username');
      if (username && username.trim()) return username.trim();
    }
  } catch {
    // Ignore
  }
  return null;
}

export function syncVendorAuth(token?: string | null, username?: string | null, expiresAt?: number | null): void {
  if (token) {
    inMemoryServerToken = token;
    tokenExpiresAt = expiresAt || null;
  }
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('pi_auth_token', token);
    }
    if (username) {
      localStorage.setItem('pinova_pioneer_username', username);
    }
  } catch {
    // Ignore
  }
}

export function clearVendorAuthToken(): void {
  inMemoryServerToken = null;
  tokenExpiresAt = null;
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('pi_auth_token');
    localStorage.removeItem('pinova_token');
    localStorage.removeItem('pinova_access_token');
  } catch {
    // Ignore
  }
}

/**
 * Establishes or refreshes an authenticated server session via POST /api/auth/session.
 * Translates the Pi SDK access token into a cryptographically verified server session token.
 *
 * Flow:
 * 1. Obtains Pi access token via window.Pi.authenticate() or active Pi SDK state.
 * 2. Transmits Pi access token to POST /api/auth/session.
 * 3. Receives server-issued session token.
 * 4. Stores token as auth_token in memory and storage.
 * 5. Returns server session token for Authorization: Bearer header.
 */
export async function ensureServerSession(forceRefresh: boolean = false): Promise<string | null> {
  const currentToken = getVendorAuthToken();

  // If token already valid and refresh not requested, reuse
  if (!forceRefresh && currentToken && inMemoryServerToken && (!tokenExpiresAt || Date.now() < tokenExpiresAt - 60000)) {
    return currentToken;
  }

  let rawAccessToken: string | undefined;
  let username = 'pioneer_user';
  let uid = `pi-uid-${Date.now()}`;

  // 1. Reuse the canonical Pi SDK manager first. This preserves an already
  // authenticated Pioneer session and avoids launching a second native
  // Pi.authenticate() call from the vendor flow.
  try {
    const managedUser = getAuthenticatedPiUser() || await PiSdkManager.authenticate(
      ['username', 'payments'],
      undefined,
      false
    );
    if (managedUser?.accessToken) {
      rawAccessToken = managedUser.accessToken;
      if (managedUser.username) username = managedUser.username;
      if (managedUser.uid) uid = managedUser.uid;
    }
  } catch (piAuthErr) {
    console.warn('[vendorAuthBridge] canonical Pi SDK authentication unavailable:', piAuthErr);
  }

  // 2. Fallback to the raw Pi SDK only when the canonical manager could not
  // provide a verified active user.
  if (!rawAccessToken && typeof window !== 'undefined' && window.Pi && typeof window.Pi.authenticate === 'function') {
    try {
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        (payment: any) => {
          console.log('[vendorAuthBridge] Incomplete payment found during Pi auth:', payment);
        }
      );
      if (authResult?.accessToken) {
        rawAccessToken = authResult.accessToken;
        if (authResult.user?.username) username = authResult.user.username;
        if (authResult.user?.uid) uid = authResult.user.uid;
      }
    } catch (piAuthErr) {
      console.warn('[vendorAuthBridge] raw window.Pi.authenticate encountered an issue:', piAuthErr);
    }
  }

  // 3. Fallback to stored Pioneer username
  if (!username || username === 'pioneer_user') {
    const storedUsername = getVendorUsername();
    if (storedUsername) username = storedUsername;
  }

  // If no Pi access token can be acquired:
  if (!rawAccessToken) {
    if (!forceRefresh && currentToken) return currentToken;
    return null;
  }

  try {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        accessToken: rawAccessToken,
        username,
        uid
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.token && typeof data.token === 'string') {
        const expiresTime = data.expiresAt ? new Date(data.expiresAt).getTime() : Date.now() + 24 * 60 * 60 * 1000;
        syncVendorAuth(data.token, username, expiresTime);
        return data.token;
      }
    } else {
      console.warn(`[vendorAuthBridge] /api/auth/session returned status ${res.status}`);
    }
  } catch (err) {
    console.warn('[vendorAuthBridge] Unable to negotiate server session:', err);
  }

  if (!forceRefresh && currentToken) {
    return currentToken;
  }

  return null;
}

/**
 * Prepares authorization headers using server session token and Pioneer username.
 */
export function getVendorAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getVendorAuthToken();
  const username = getVendorUsername();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (username) {
    headers['X-Pioneer-Username'] = username;
  }
  return headers;
}

/**
 * Executes a server-authenticated fetch request.
 * - Attaches Authorization: Bearer <server-session-token>
 * - On 401 Unauthorized: clears stale tokens, establishes a fresh session, and retries once.
 */
export async function vendorAuthenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  // Ensure we have an active session token
  let token = await ensureServerSession(false);
  const username = getVendorUsername();

  const mergeHeaders = (authToken: string | null): HeadersInit => {
    const headers = new Headers(init.headers || {});
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    if (username) {
      headers.set('X-Pioneer-Username', username);
    }
    return headers;
  };

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers: mergeHeaders(token)
    });
  } catch (netErr) {
    throw netErr;
  }

  // On 401 Unauthorized: token may have expired. Invalidate and retry once with fresh session.
  if (response.status === 401) {
    console.warn('[vendorAuthBridge] 401 received. Attempting session refresh and retry.');
    clearVendorAuthToken();
    const freshToken = await ensureServerSession(true);

    if (freshToken) {
      try {
        response = await fetch(input, {
          ...init,
          headers: mergeHeaders(freshToken)
        });
      } catch (retryErr) {
        throw retryErr;
      }
    }
  }

  return response;
}

/**
 * Installs the global fetch interceptor bridge for protected vendor requests.
 * Ensures all vendor uploads and seller endpoints carry verified server sessions
 * and handle 401 token refreshes automatically.
 *
 * In browser environments or sandboxed iframes (e.g. AI Studio preview) where
 * window.fetch is a non-writable accessor property with only a getter,
 * this function gracefully handles property definitions and never throws uncaught exceptions.
 */
export function installVendorAuthBridge(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).__PINOVA_VENDOR_AUTH_BRIDGE__) return;

  try {
    const rawFetch = window.fetch;
    if (typeof rawFetch !== 'function') return;

    const nativeFetch = rawFetch.bind(window);

    const wrappedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const requestUrl = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      const isProtectedVendorRequest =
        requestUrl.includes('/api/vendor/document-upload') ||
        requestUrl.includes('/api/v1/vendor/document-upload') ||
        requestUrl.includes('/api/vendor/branding-upload') ||
        requestUrl.includes('/api/v1/vendor/branding-upload') ||
        requestUrl.includes('/api/vendor/seller/');

      if (!isProtectedVendorRequest) {
        return nativeFetch(input, init);
      }

      let token = await ensureServerSession(false);
      const username = getVendorUsername();

      const requestHeaders = new Headers(
        init?.headers || (input instanceof Request ? input.headers : undefined)
      );
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }
      if (username && !requestHeaders.has('X-Pioneer-Username')) {
        requestHeaders.set('X-Pioneer-Username', username);
      }

      const response = await nativeFetch(input, {
        ...init,
        headers: requestHeaders
      });

      if (response.status !== 401) {
        return response;
      }

      clearVendorAuthToken();
      token = await ensureServerSession(true);
      if (!token) return response;

      requestHeaders.set('Authorization', `Bearer ${token}`);
      return nativeFetch(input, {
        ...init,
        headers: requestHeaders
      });
    };

    let installed = false;
    try {
      Object.defineProperty(window, 'fetch', {
        value: wrappedFetch,
        writable: true,
        configurable: true
      });
      installed = true;
    } catch {
      // In browser/iframe contexts where window.fetch has only a getter or cannot be redefined,
      // never directly assign window.fetch (to avoid "Cannot set property fetch of #<Window> which has only a getter").
      // The bridge gracefully falls back to explicit vendorFetch usage without throwing.
    }

    if (installed) {
      (window as any).__PINOVA_VENDOR_AUTH_BRIDGE__ = true;
    }
  } catch (err) {
    console.warn('[vendorAuthBridge] Safe fetch bridge initialization bypassed:', err);
  }
}

export const vendorFetch = vendorAuthenticatedFetch;

/**
 * Server-authoritative seller access check.
 * Query /api/vendor/seller/access to inspect approved merchant state.
 */
export async function getSellerAccess(): Promise<{
  success: boolean;
  authorized: boolean;
  status: string;
  sellerLifecycle: 'ACTIVE' | 'INACTIVE';
  verified: boolean;
  pstpAuthorized: boolean;
  storeName?: string | null;
  applicationId?: string | null;
  error?: string;
  message?: string;
}> {
  try {
    const res = await vendorAuthenticatedFetch('/api/vendor/seller/access');
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      authorized: false,
      status: 'UNREGISTERED',
      sellerLifecycle: 'INACTIVE',
      verified: false,
      pstpAuthorized: false,
      error: 'NETWORK_OR_SERVER_ERROR',
      message: err.message || 'Unable to verify seller status with PiNova server.'
    };
  }
}

/**
 * Server-authoritative seller authorization.
 * Only APPROVED merchants receive active seller authorization.
 */
export async function authorizeSeller(): Promise<{
  success: boolean;
  authorized: boolean;
  sellerLifecycle: string;
  verified: boolean;
  storeName?: string;
  applicationId?: string;
  error?: string;
  message?: string;
}> {
  try {
    const res = await vendorAuthenticatedFetch('/api/vendor/seller/authorize', {
      method: 'POST'
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      authorized: false,
      sellerLifecycle: 'INACTIVE',
      verified: false,
      error: 'AUTHORIZATION_REQUEST_FAILED',
      message: err.message
    };
  }
}

/**
 * Server-authoritative PSTP seller authorization.
 * Validates approved status AND PSTP Escrow agreement acceptance.
 */
export async function authorizePstpSeller(): Promise<{
  success: boolean;
  authorized: boolean;
  pstpAuthorized: boolean;
  sellerLifecycle: string;
  verified: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const res = await vendorAuthenticatedFetch('/api/vendor/seller/authorize-pstp', {
      method: 'POST'
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      authorized: false,
      pstpAuthorized: false,
      sellerLifecycle: 'INACTIVE',
      verified: false,
      error: 'PSTP_AUTHORIZATION_FAILED',
      message: err.message
    };
  }
}
