/*
 * Vendor authentication bridge
 *
 * Protected vendor endpoints require the server-issued session token, not the
 * raw Pi SDK access token. Before sensitive vendor uploads, this bridge makes
 * sure a fresh server session exists so the file is never sent unauthenticated.
 */

let sessionPromise: Promise<string | null> | null = null;

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

function clearStoredSessionTokens(): void {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('pinova_token');
    localStorage.removeItem('pi_auth_token');
  } catch {}
}

async function establishVendorSession(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh) {
    const existing = getStoredSessionToken();
    if (existing) return existing;
  }

  if (typeof window === 'undefined' || typeof window.Pi?.authenticate !== 'function') {
    return null;
  }

  if (!sessionPromise) {
    sessionPromise = (async () => {
      const authResult = await window.Pi!.authenticate(
        ['username', 'payments', 'wallet_address'],
        () => undefined
      );

      if (!authResult?.accessToken || !authResult.user?.username) {
        return null;
      }

      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken: authResult.accessToken,
          username: authResult.user.username,
          uid: authResult.user.uid
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      const token = typeof data?.token === 'string' ? data.token : null;
      if (!token) return null;

      localStorage.setItem('auth_token', token);
      return token;
    })().finally(() => {
      sessionPromise = null;
    });
  }

  return sessionPromise;
}

export function installVendorAuthBridge(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).__PINOVA_VENDOR_AUTH_BRIDGE__) return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const requestUrl = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

    const isProtectedVendorRequest =
      requestUrl.includes('/api/vendor/document-upload') ||
      requestUrl.includes('/api/v1/vendor/document-upload') ||
      requestUrl.includes('/api/vendor/branding-upload') ||
      requestUrl.includes('/api/v1/vendor/branding-upload');

    if (!isProtectedVendorRequest) {
      return nativeFetch(input, init);
    }

    // Sensitive vendor uploads must have a fresh server session BEFORE the
    // file is transmitted. This avoids sending KYC/branding data unauthenticated.
    // The server-side authenticate middleware remains mandatory.
    let token = await establishVendorSession(true);

    if (token) {
      const requestHeaders = new Headers(
        init?.headers || (input instanceof Request ? input.headers : undefined)
      );
      requestHeaders.set('Authorization', `Bearer ${token}`);

      const response = await nativeFetch(input, {
        ...init,
        headers: requestHeaders
      });

      if (response.status !== 401) {
        return response;
      }

      // Session may have expired between preflight and upload. Refresh once
      // and retry without ever falling back to an unauthenticated upload.
      clearStoredSessionTokens();
      token = await establishVendorSession(true);
      if (!token) return response;

      requestHeaders.set('Authorization', `Bearer ${token}`);
      return nativeFetch(input, {
        ...init,
        headers: requestHeaders
      });
    }

    // No Pi/server session could be established. Preserve the original request
    // semantics but do NOT invent or weaken authentication credentials.
    // The protected server endpoint will return its normal 401 response.
    return nativeFetch(input, init);
  };

  (window as any).__PINOVA_VENDOR_AUTH_BRIDGE__ = true;
}
