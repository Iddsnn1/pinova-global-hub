import { PiUser } from '../types';
import { safeFetchJson } from './safeFetch';

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: PiPayment) => void
      ) => Promise<{
        accessToken: string;
        user: {
          username: string;
          uid: string;
        };
      }>;
      createPayment: (
        paymentData: PiPaymentData,
        callbacks: PiPaymentCallbacks
      ) => void;
    };
    __PI_DIAGNOSTICS__?: PiSdkDiagnosticState;
  }
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PiPayment) => void;
}

export type PiAuthState =
  | 'AUTH_NOT_STARTED'
  | 'AUTH_INVOKING'
  | 'AUTH_WAITING_NATIVE_BRIDGE'
  | 'AUTH_SUCCESS'
  | 'AUTH_DENIED'
  | 'AUTH_ERROR'
  | 'AUTH_NATIVE_BRIDGE_PENDING'
  | 'PI_AUTH_UNAVAILABLE';

export interface PiSdkDiagnosticState {
  sdkState: 'not_loaded' | 'loaded' | 'initializing' | 'ready';
  authState: PiAuthState;
  paymentScope: 'granted' | 'not_granted';
  userState: 'authenticated' | 'not_authenticated';
  username: string | null;
  error: string | null;
  isPiBrowser: boolean;
  runtimeCheck?: {
    hasPi: boolean;
    initType: string;
    authType: string;
    createPaymentType: string;
  };
  currentOrigin?: string;
}

// Explicit State Tracking
let sdkLoaded = false;
let sdkInitialized = false;
let authLifecycleState: PiAuthState = 'AUTH_NOT_STARTED';
let authenticated = false;
let paymentScopeGranted = false;
let authenticatedUser: PiUser | null = null;
let authenticationError: string | null = null;

// Singleton Promises (Locks)
let piInitPromise: Promise<boolean> | null = null;
let piAuthPromise: Promise<PiUser> | null = null;

// Diagnostic Listeners
type DiagnosticListener = (state: PiSdkDiagnosticState) => void;
const diagnosticListeners: Set<DiagnosticListener> = new Set();

export function getPiSdkDiagnosticState(): PiSdkDiagnosticState {
  let sdkState: PiSdkDiagnosticState['sdkState'] = 'not_loaded';
  if (sdkInitialized && typeof window !== 'undefined' && window.Pi) {
    sdkState = 'ready';
  } else if (piInitPromise) {
    sdkState = 'initializing';
  } else if (sdkLoaded || (typeof window !== 'undefined' && Boolean(window.Pi))) {
    sdkState = 'loaded';
  }

  const hasPi = typeof window !== 'undefined' && Boolean(window.Pi);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return {
    sdkState,
    authState: authLifecycleState,
    paymentScope: paymentScopeGranted ? 'granted' : 'not_granted',
    userState: authenticated && authenticatedUser ? 'authenticated' : 'not_authenticated',
    username: authenticatedUser?.username || null,
    error: authenticationError,
    isPiBrowser: isPiBrowser(),
    runtimeCheck: {
      hasPi,
      initType: typeof window !== 'undefined' && window.Pi ? typeof window.Pi.init : 'undefined',
      authType: typeof window !== 'undefined' && window.Pi ? typeof window.Pi.authenticate : 'undefined',
      createPaymentType: typeof window !== 'undefined' && window.Pi ? typeof window.Pi.createPayment : 'undefined'
    },
    currentOrigin
  };
}

export function subscribePiSdkState(listener: DiagnosticListener): () => void {
  diagnosticListeners.add(listener);
  listener(getPiSdkDiagnosticState());
  return () => {
    diagnosticListeners.delete(listener);
  };
}

function notifyDiagnosticStateChange() {
  const currentState = getPiSdkDiagnosticState();
  if (typeof window !== 'undefined') {
    window.__PI_DIAGNOSTICS__ = currentState;
  }
  diagnosticListeners.forEach((listener) => {
    try {
      listener(currentState);
    } catch (e) {
      console.error('[PI] Listener execution error:', e);
    }
  });
}

export function isSandboxMode(): boolean {
  if (typeof window === 'undefined') return false;
  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_PI_SANDBOX === 'false' || metaEnv.VITE_PI_ENV === 'mainnet') {
      return false;
    }
    if (metaEnv.VITE_PI_SANDBOX === 'true' || metaEnv.VITE_PI_ENV === 'sandbox') {
      return true;
    }
  }
  const origin = window.location.origin || '';
  if (origin.includes('pinova-global-marketplace.vercel.app') || metaEnv?.MODE === 'production' || metaEnv?.PROD) {
    return false;
  }
  return process.env.NODE_ENV !== 'production';
}

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('PiBrowser') || userAgent.includes('Pi Network') || Boolean((window as any).Pi);
}

export function isPiSdkInitialized(): boolean {
  return sdkInitialized && typeof window !== 'undefined' && Boolean(window.Pi);
}

export function isPaymentScopeReady(): boolean {
  return paymentScopeGranted && Boolean(authenticatedUser) && authenticated;
}

export async function loadPiSdkScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.Pi) {
    sdkLoaded = true;
    notifyDiagnosticStateChange();
    return true;
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src*="sdk.minepi.com/pi-sdk.js"]');
    if (existingScript) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Pi) {
          clearInterval(interval);
          sdkLoaded = true;
          notifyDiagnosticStateChange();
          resolve(true);
        } else if (attempts > 25) {
          clearInterval(interval);
          resolve(Boolean(window.Pi));
        }
      }, 150);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      sdkLoaded = Boolean(window.Pi);
      console.log('[PI] SDK script loaded successfully');
      notifyDiagnosticStateChange();
      resolve(sdkLoaded);
    };
    script.onerror = () => {
      console.warn('[PI] SDK script failed to load from CDN.');
      notifyDiagnosticStateChange();
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export async function initPiSdk(sandbox: boolean = isSandboxMode()): Promise<boolean> {
  if (sdkInitialized && typeof window !== 'undefined' && window.Pi) {
    return true;
  }
  if (piInitPromise) {
    return piInitPromise;
  }

  console.log('[PI] SDK initialization started. Sandbox:', sandbox);
  notifyDiagnosticStateChange();

  piInitPromise = (async () => {
    if (typeof window === 'undefined') return false;

    if (!window.Pi) {
      await loadPiSdkScript();
    }

    if (window.Pi) {
      sdkLoaded = true;
      try {
        window.Pi.init({ version: '2.0', sandbox });
        sdkInitialized = true;
        console.log('[PI] SDK initialized successfully with sandbox:', sandbox);
        notifyDiagnosticStateChange();
        return true;
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        if (errMsg.toLowerCase().includes('initialized')) {
          sdkInitialized = true;
          console.log('[PI] SDK initialized (already active)');
          notifyDiagnosticStateChange();
          return true;
        }
        console.warn('[PI] SDK init exception:', errMsg);
      }
    } else {
      console.warn('[PI] window.Pi unavailable after script load');
    }

    notifyDiagnosticStateChange();
    return sdkInitialized;
  })();

  const result = await piInitPromise;
  if (!result) {
    piInitPromise = null;
  }
  return result;
}

export async function authenticatePiUser(
  onIncompletePaymentFound?: (payment: PiPayment) => void,
  forceReauth: boolean = false
): Promise<PiUser> {
  console.log('[PI AUTH] function entered');
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  console.log('[PI AUTH] current URL:', currentUrl);
  console.log('[PI AUTH] current origin:', currentOrigin);

  const inPiBrowser = isPiBrowser();
  console.log('[PI AUTH] Pi Browser detected:', inPiBrowser);

  const sandbox = isSandboxMode();
  console.log('[PI AUTH] Sandbox mode:', sandbox);

  // Non-Pi Browser Environment
  if (!inPiBrowser) {
    console.log('[PI AUTH] Non-Pi Browser environment detected.');
    sdkLoaded = false;
    sdkInitialized = false;
    authenticated = false;
    paymentScopeGranted = false;
    authenticatedUser = null;
    authLifecycleState = 'AUTH_ERROR';
    authenticationError = 'Official Pi Browser is required for Pi Network authentication.';
    notifyDiagnosticStateChange();
    throw new Error('Official Pi Browser is required to authenticate with Pi Network.');
  }

  // Inside Pi Browser: Return active session if payment scope granted and forceReauth is false
  if (!forceReauth && paymentScopeGranted && authenticatedUser && authenticated) {
    console.log('[PI AUTH] Already authenticated with payment scope for user:', authenticatedUser.username);
    authLifecycleState = 'AUTH_SUCCESS';
    notifyDiagnosticStateChange();
    return authenticatedUser;
  }

  // SINGLETON AUTHENTICATION LOCK: Await active authentication request if pending
  if (piAuthPromise) {
    console.log('[PI AUTH] Authentication already pending. Awaiting active authentication request...');
    return piAuthPromise;
  }

  piAuthPromise = (async () => {
    console.log('[PI AUTH] start');
    authLifecycleState = 'AUTH_INVOKING';
    authenticationError = null;
    notifyDiagnosticStateChange();

    let nativeWatchdogTimer: any = null;

    try {
      const hasSdk = await initPiSdk(sandbox);
      if (!hasSdk || typeof window === 'undefined' || !window.Pi) {
        authLifecycleState = 'PI_AUTH_UNAVAILABLE';
        notifyDiagnosticStateChange();
        throw new Error('Pi Network SDK failed to initialize in Pi Browser.');
      }

      const piObjectExists = Boolean(window.Pi);
      const authFnExists = typeof window.Pi.authenticate === 'function';
      const initFnExists = typeof window.Pi.init === 'function';
      const createPaymentFnExists = typeof window.Pi.createPayment === 'function';

      console.log('[PI AUTH] Pi object exists:', piObjectExists);
      console.log('[PI AUTH] authenticate function exists:', authFnExists);
      console.log('[PI AUTH] init function exists:', initFnExists);
      console.log('[PI AUTH] createPayment function exists:', createPaymentFnExists);

      if (!authFnExists) {
        authLifecycleState = 'PI_AUTH_UNAVAILABLE';
        authenticationError = 'window.Pi.authenticate is not a function in runtime environment.';
        notifyDiagnosticStateChange();
        throw new Error('PI_AUTH_UNAVAILABLE');
      }

      authLifecycleState = 'AUTH_WAITING_NATIVE_BRIDGE';
      console.log('[PI AUTH] calling Pi.authenticate');
      notifyDiagnosticStateChange();

      // Bounded UI Diagnostic Watchdog (Does NOT cancel the native promise)
      nativeWatchdogTimer = setTimeout(() => {
        if (authLifecycleState === 'AUTH_WAITING_NATIVE_BRIDGE') {
          console.warn('[PI AUTH] Watchdog: Native bridge response pending after 15 seconds. Updating diagnostic UI state.');
          authLifecycleState = 'AUTH_NATIVE_BRIDGE_PENDING';
          notifyDiagnosticStateChange();
        }
      }, 15000);

      const requestedScopes = ['payments', 'username'];

      // Synchronous / non-blocking wrapper for onIncompletePaymentFound callback
      const handleIncompletePayment = (payment: PiPayment) => {
        console.log('[PI AUTH] Incomplete payment detected on Pi Network:', payment?.identifier);
        void Promise.resolve()
          .then(() => {
            if (onIncompletePaymentFound) {
              onIncompletePaymentFound(payment);
            }
          })
          .catch((cbErr) => {
            console.error('[PI AUTH] incomplete payment handler error', cbErr);
          });
      };

      // Native Pi.authenticate call
      const auth = await window.Pi.authenticate(requestedScopes, handleIncompletePayment);

      console.log('[PI AUTH] native bridge returned');
      console.log('[PI AUTH] promise resolved');

      if (auth && auth.user && auth.accessToken) {
        authenticated = true;
        paymentScopeGranted = true;
        authLifecycleState = 'AUTH_SUCCESS';
        authenticationError = null;
        authenticatedUser = {
          username: auth.user.username,
          uid: auth.user.uid,
          accessToken: auth.accessToken,
          authenticated: true,
          role: auth.user.username === 'admin' ? 'admin' : 'buyer'
        };
        console.log('[PI AUTH] success for user username length:', auth.user.username?.length);
        return authenticatedUser;
      } else {
        throw new Error('Pi Authentication did not return user credentials or access token.');
      }
    } catch (err: any) {
      console.log('[PI AUTH] promise rejected');
      authenticated = false;
      paymentScopeGranted = false;
      authenticatedUser = null;

      const rawMsg = String(err?.message || err || 'Pi Network authentication failed');
      const isCancelled = rawMsg.toLowerCase().includes('cancel') || rawMsg.toLowerCase().includes('denied') || rawMsg.toLowerCase().includes('reject');

      if (isCancelled) {
        authLifecycleState = 'AUTH_DENIED';
        authenticationError = 'Pioneer cancelled or denied permission in Pi Browser.';
        console.log('[PI AUTH] denied/cancelled');
      } else if (rawMsg === 'PI_AUTH_UNAVAILABLE') {
        authLifecycleState = 'PI_AUTH_UNAVAILABLE';
        authenticationError = 'window.Pi.authenticate API is unavailable in this environment.';
      } else {
        authLifecycleState = 'AUTH_ERROR';
        authenticationError = rawMsg;
        console.error('[PI AUTH] error:', rawMsg);
      }
      throw new Error(authenticationError);
    } finally {
      console.log('[PI AUTH] finally');
      if (nativeWatchdogTimer) {
        clearTimeout(nativeWatchdogTimer);
      }
      piAuthPromise = null;
      notifyDiagnosticStateChange();
    }
  })();

  return piAuthPromise;
}

export async function initAndAuthenticateProactively(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser | null> {
  const inPi = isPiBrowser();
  if (!inPi) {
    console.log('[PI AUTH] Proactive init skipped: Non-Pi Browser environment');
    return null;
  }

  try {
    console.log('[PI AUTH] Proactive initialization starting...');
    const sdkReady = await initPiSdk();
    if (!sdkReady) {
      console.warn('[PI AUTH] Proactive SDK init failed: window.Pi unavailable');
      return null;
    }

    console.log('[PI AUTH] Proactive authentication starting...');
    return await authenticatePiUser(onIncompletePaymentFound, false);
  } catch (err: any) {
    console.warn('[PI AUTH] Proactive authentication notice:', err?.message || err);
    return null;
  }
}

export async function ensurePaymentScopeReady(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<boolean> {
  const inPi = isPiBrowser();
  if (!inPi) {
    throw new Error('Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.');
  }

  const sdkReady = await initPiSdk();
  if (!sdkReady || !window.Pi) {
    throw new Error('Pi Network SDK failed to initialize.');
  }

  if (paymentScopeGranted && authenticatedUser && authenticated) {
    console.log('[PI AUTH] Payment scope already granted for user:', authenticatedUser.username);
    return true;
  }

  console.log('[PI AUTH] Payment scope not ready. Triggering authentication...');
  const user = await authenticatePiUser(onIncompletePaymentFound, false);
  if (!paymentScopeGranted || !user) {
    throw new Error('Payment permission ("payments" scope) was not granted by Pioneer in Pi Browser.');
  }
  return true;
}

export async function createPiPayment(params: {
  amountPi: number;
  memo: string;
  metadata?: Record<string, any>;
  onStatusUpdate?: (statusMessage: string) => void;
  onIncompletePaymentFound?: (payment: PiPayment) => void;
}): Promise<{
  success: boolean;
  paymentId?: string;
  txid?: string;
  fulfillmentStatus?: 'FULFILLED' | 'FULFILLMENT_PENDING' | 'FAILED';
  message?: string;
  data?: any;
}> {
  console.log('[PI] createPiPayment started', params);

  const diag = getPiSdkDiagnosticState();
  if (diag.authState === 'AUTH_INVOKING' || diag.authState === 'AUTH_WAITING_NATIVE_BRIDGE') {
    if (params.onStatusUpdate) params.onStatusUpdate('Waiting for Pi Browser authorization…');
  } else if (diag.authState === 'AUTH_NATIVE_BRIDGE_PENDING') {
    if (params.onStatusUpdate) params.onStatusUpdate('Pi Browser authentication is not responding.');
  } else {
    if (params.onStatusUpdate) params.onStatusUpdate('Connecting Pi Network Wallet...');
  }

  const inPi = isPiBrowser();
  if (!inPi) {
    if (params.onStatusUpdate) params.onStatusUpdate('Official Pi Browser required');
    return {
      success: false,
      message: 'Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.'
    };
  }

  try {
    if (params.onStatusUpdate) params.onStatusUpdate('Waiting for Pi Browser authorization…');
    await ensurePaymentScopeReady(params.onIncompletePaymentFound);
  } catch (authErr: any) {
    const errMsg = authErr?.message || String(authErr);
    console.error('[PI] createPiPayment error - Authorization failed:', errMsg);
    if (params.onStatusUpdate) params.onStatusUpdate('Authorization failed');
    return {
      success: false,
      message: `Pi Payment Authorization failed: ${errMsg}`
    };
  }

  return new Promise((resolve) => {
    executePiPayment(
      {
        amount: params.amountPi,
        memo: params.memo,
        metadata: params.metadata || {}
      },
      {
        onStatusUpdate: params.onStatusUpdate,
        onIncompletePaymentFound: params.onIncompletePaymentFound,
        onSuccess: async (paymentId, txid) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment verified on Pi ledger. Processing fulfillment...');

          try {
            const fulfillResult = await safeFetchJson('/api/v2/utility/fulfill', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId,
                txid,
                category: params.metadata?.category || 'utility',
                country: params.metadata?.country,
                countryCode: params.metadata?.countryCode,
                providerId: params.metadata?.providerId || 'unknown',
                accountNumber: params.metadata?.accountNumber || '',
                fiatAmount: params.metadata?.fiatAmount || 0,
                piAmount: params.amountPi,
                packageName: params.metadata?.packageName || '',
                idempotencyKey: paymentId
              })
            });

            const fulfillData = fulfillResult.data || {};
            if (fulfillResult.ok && fulfillData.success) {
              const status = fulfillData.data?.status;
              if (params.onStatusUpdate) {
                params.onStatusUpdate(status === 'FULFILLED' ? 'Fulfilled successfully!' : 'Fulfillment pending');
              }
              resolve({
                success: true,
                paymentId,
                txid,
                fulfillmentStatus: status || 'FULFILLMENT_PENDING',
                message: fulfillData.data?.message || 'Payment Received — Order Processed Successfully',
                data: fulfillData.data
              });
            } else {
              if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment verification failed');
              resolve({
                success: false,
                paymentId,
                txid,
                fulfillmentStatus: 'FAILED',
                message: fulfillData.message || 'Server-side payment verification failed.'
              });
            }
          } catch (err: any) {
            if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment error');
            resolve({
              success: false,
              paymentId,
              txid,
              fulfillmentStatus: 'FAILED',
              message: `Fulfillment error: ${err.message || 'Failed to reach fulfillment endpoint'}`
            });
          }
        },
        onCancel: (paymentId) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled in Pi Wallet');
          resolve({
            success: false,
            paymentId,
            message: 'Payment was cancelled in Pi Wallet.'
          });
        },
        onError: (err) => {
          if (params.onStatusUpdate) params.onStatusUpdate('Payment error encountered');
          resolve({
            success: false,
            message: err.message || 'Payment failed in Pi Wallet.'
          });
        }
      }
    );
  });
}

export function executePiPayment(
  paymentData: PiPaymentData,
  callbacks: {
    onSuccess: (paymentId: string, txid: string) => void;
    onCancel: (paymentId: string) => void;
    onError: (error: Error) => void;
    onStatusUpdate?: (statusMessage: string) => void;
    onIncompletePaymentFound?: (payment: PiPayment) => void;
  }
): void {
  let hasHandledResponse = false;
  const updateStatus = (msg: string) => {
    console.log('[PI PAYMENT] status:', msg);
    if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
  };

  const inPi = isPiBrowser();
  if (!inPi || typeof window === 'undefined' || !window.Pi) {
    updateStatus('Official Pi Browser required');
    if (!hasHandledResponse) {
      hasHandledResponse = true;
      callbacks.onError(new Error('Official Pi Browser is required to execute Pi payments. Please open this app inside Pi Browser.'));
    }
    return;
  }

  const runPaymentFlow = async () => {
    try {
      updateStatus('Waiting for Pi Browser authorization…');
      await ensurePaymentScopeReady(callbacks.onIncompletePaymentFound);

      if (!paymentScopeGranted) {
        throw new Error('Cannot create payment without payment scope ("payments").');
      }

      updateStatus('Connecting to Pi Network Wallet...');

      const statusWarningTimer = setTimeout(() => {
        if (!hasHandledResponse) {
          updateStatus('Awaiting transaction confirmation in Pi Wallet...');
        }
      }, 15000);

      window.Pi!.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          clearTimeout(statusWarningTimer);
          console.log('[PI PAYMENT] paymentId received:', paymentId);
          updateStatus('Waiting for server approval...');
          try {
            const res = await safeFetchJson('/api/v2/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
            const data = res.data || {};
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || res.error || 'Server approval failed');
            }
            updateStatus('Payment approved by server. Please confirm transaction in Pi Wallet...');
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment approval failed');
              callbacks.onError(err);
            }
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          clearTimeout(statusWarningTimer);
          console.log('[PI PAYMENT] completion requested:', { paymentId, txid });
          updateStatus('Payment submitted to Pi blockchain. Completing on server...');
          try {
            const res = await safeFetchJson('/api/v2/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            const data = res.data || {};
            if (!res.ok || !data.success) {
              throw new Error(data.message || data.error || res.error || 'Server completion failed');
            }
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment verified successfully!');
              callbacks.onSuccess(paymentId, txid);
            }
          } catch (err: any) {
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment completion failed');
              callbacks.onError(err);
            }
          }
        },
        onCancel: (paymentId: string) => {
          clearTimeout(statusWarningTimer);
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            updateStatus('Payment cancelled');
            callbacks.onCancel(paymentId);
          }
        },
        onError: (error: Error) => {
          clearTimeout(statusWarningTimer);
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            console.warn('[PI PAYMENT] Native error encountered:', error);
            updateStatus('Payment error: ' + (error?.message || 'Transaction rejected'));
            callbacks.onError(error || new Error('Payment error encountered in Pi Wallet'));
          }
        }
      });
    } catch (err: any) {
      if (!hasHandledResponse) {
        hasHandledResponse = true;
        updateStatus('Payment execution failed');
        callbacks.onError(err || new Error('Failed to initialize Pi Wallet payment'));
      }
    }
  };

  runPaymentFlow();
}
