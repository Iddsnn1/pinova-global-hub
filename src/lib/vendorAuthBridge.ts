/*
 * Vendor authentication bridge
 *
 * Protected vendor endpoints require the server-issued session token, not the
 * raw Pi SDK access token. When a vendor request receives 401, this bridge
 * performs Pi authentication, exchanges the Pi access token for a server
 * session, stores the session token, and lets the original request retry.
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

    const response = await nativeFetch(input, init);

    if (!isProtectedVendorRequest || response.status !== 401) {
      return response;
    }

    // A stored session can be stale. Clear it and establish a fresh,
    // server-verified Pi session before retrying the protected request.
    clearStoredSessionTokens();
    const token = await establishVendorSession(true);
    if (!token) return response;

    const retryHeaders = new Headers(
      init?.headers || (input instanceof Request ? input.headers : undefined)
    );
    retryHeaders.set('Authorization', `Bearer ${token}`);

    return nativeFetch(input, {
      ...init,
      headers: retryHeaders
    });
  };

  (window as any).__PINOVA_VENDOR_AUTH_BRIDGE__ = true;
}
