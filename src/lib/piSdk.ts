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

export const BUILD_COMMIT = 'ab540d7c08480fe396633aece64ba373b64b5332';

export type NativeBridgeState =
  | 'idle'
  | 'calling_invocation'
  | 'call_blocked'
  | 'promise_returned'
  | 'promise_pending'
  | 'promise_resolved'
  | 'promise_rejected';

export type PiAuthState =
  | 'AUTH_NOT_STARTED'
  | 'AUTH_CALL_STARTED'
  | 'AUTH_PROMISE_RETURNED'
  | 'AUTH_SUCCESS'
  | 'AUTH_DENIED'
  | 'AUTH_ERROR'
  | 'AUTH_NATIVE_PENDING'
  | 'PI_AUTHENTICATE_UNAVAILABLE';

export type PiAuthErrorType =
  | 'AUTH_BRIDGE_TIMEOUT'
  | 'AUTH_BRIDGE_REJECTED'
  | 'AUTH_USER_CANCELLED'
  | 'AUTH_ERROR'
  | 'PI_AUTHENTICATE_UNAVAILABLE'
  | null;

export interface PiSdkDiagnosticState {
  sdkScriptState: 'loaded' | 'not_loaded';
  piInitState: 'success' | 'failed' | 'not_called';
  piAuthApiState: 'available' | 'unavailable';
  authenticateInvocation: 'called' | 'not_called';
  authenticateInvocationCount: number;
  hasActiveAuthPromise: boolean;
  nativeBridgeState: NativeBridgeState;
  piEnvDetected: boolean;
  productionOrigin: string;
  sandbox: boolean;
  // Standardized Required Diagnostic Metrics
  sdkReadyState: 'ready' | 'not_ready';
  network: 'SANDBOX' | 'MAINNET';
  piAuthenticationState: 'success' | 'pending' | 'failed';
  paymentScopeState: 'granted' | 'not_granted';
  apiConfiguration: 'configured' | 'missing';
  buildCommit: string;
  sdkState: 'not_loaded' | 'loaded' | 'initializing' | 'ready';
  authState: PiAuthState;
  authErrorType: PiAuthErrorType;
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
  isIframe?: boolean;
}

// Explicit State Tracking
let sdkLoaded = false;
let sdkInitialized = false;
let piInitState: 'success' | 'failed' | 'not_called' = 'not_called';
let piAuthApiState: 'available' | 'unavailable' = 'unavailable';
let authenticateInvocation: 'called' | 'not_called' = 'not_called';
let authInvocationCount = 0;
let nativeBridgeState: NativeBridgeState = 'idle';
let authLifecycleState: PiAuthState = 'AUTH_NOT_STARTED';
let authErrorType: PiAuthErrorType = null;
let authenticated = false;
let paymentScopeGranted = false;
let authenticatedUser: PiUser | null = null;
let authenticationError: string | null = null;
let apiConfigState: 'configured' | 'missing' = 'configured';

export async function fetchApiConfiguration(): Promise<'configured' | 'missing'> {
  try {
    const res = await safeFetchJson('/api/v2/payments/config');
    if (res.ok && res.data && res.data.apiConfiguration) {
      apiConfigState = res.data.apiConfiguration as 'configured' | 'missing';
    }
  } catch (e) {
    // Default to configured if check endpoint fails or offline
  }
  notifyDiagnosticStateChange();
  return apiConfigState;
}

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
  const isIframe = typeof window !== 'undefined' ? window.self !== window.top : false;
  const isSandbox = isSandboxMode();

  const isSdkReady = sdkInitialized && hasPi;
  const authStateSummary: 'success' | 'pending' | 'failed' =
    authenticated && authenticatedUser
      ? 'success'
      : (authLifecycleState === 'AUTH_CALL_STARTED' || authLifecycleState === 'AUTH_PROMISE_RETURNED' || authLifecycleState === 'AUTH_NATIVE_PENDING' || Boolean(piAuthPromise))
      ? 'pending'
      : authLifecycleState === 'AUTH_DENIED' || authLifecycleState === 'AUTH_ERROR' || authLifecycleState === 'PI_AUTHENTICATE_UNAVAILABLE'
      ? 'failed'
      : 'pending';

  return {
    sdkScriptState: hasPi || sdkLoaded ? 'loaded' : 'not_loaded',
    piInitState,
    piAuthApiState: typeof window !== 'undefined' && window.Pi && typeof window.Pi.authenticate === 'function' ? 'available' : piAuthApiState,
    authenticateInvocation,
    authenticateInvocationCount: authInvocationCount,
    hasActiveAuthPromise: Boolean(piAuthPromise),
    nativeBridgeState,
    piEnvDetected: isPiBrowser(),
    productionOrigin: currentOrigin,
    sandbox: isSandbox,
    sdkReadyState: isSdkReady ? 'ready' : 'not_ready',
    network: isSandbox ? 'SANDBOX' : 'MAINNET',
    piAuthenticationState: authStateSummary,
    paymentScopeState: paymentScopeGranted ? 'granted' : 'not_granted',
    apiConfiguration: apiConfigState,
    buildCommit: BUILD_COMMIT,
    sdkState,
    authState: authLifecycleState,
    authErrorType,
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
    currentOrigin,
    isIframe
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
  if (typeof window === 'undefined') return true;

  // 1. Check user override from localStorage
  try {
    const override = localStorage.getItem('pi_sandbox_override');
    if (override === 'true') return true;
    if (override === 'false') return false;
  } catch (e) {
    // Ignore storage errors
  }

  // 2. Check URL query params (?sandbox=true / ?sandbox=false / ?env=sandbox / ?env=mainnet)
  const search = window.location.search || '';
  if (search.includes('sandbox=true') || search.includes('sandbox=1') || search.includes('env=sandbox')) {
    return true;
  }
  if (search.includes('sandbox=false') || search.includes('sandbox=0') || search.includes('env=mainnet')) {
    return false;
  }

  // 3. Check VITE_PI_SANDBOX or VITE_PI_ENV
  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_PI_SANDBOX === 'false' || metaEnv.VITE_PI_ENV === 'mainnet') {
      return false;
    }
    if (metaEnv.VITE_PI_SANDBOX === 'true' || metaEnv.VITE_PI_ENV === 'sandbox') {
      return true;
    }
  }

  // Default to true (SANDBOX / TESTNET) as the Pi Developer Portal application is configured as TESTNET / SANDBOX.
  // Production hosting (Vercel) does NOT mean Pi Mainnet; the Developer Portal configuration is the source of truth.
  return true;
}

export function setCustomSandboxMode(sandbox: boolean) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('pi_sandbox_override', sandbox ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not save sandbox override to localStorage', e);
    }
  }
  sdkInitialized = false;
  piInitPromise = null;
  initPiSdk(sandbox);
}

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  const isPiUa = userAgent.includes('PiBrowser') || userAgent.includes('Pi Network');
  const hasPiNative = Boolean((window as any).PiNative);
  const hasUrlParam = typeof window.location !== 'undefined' && window.location.search.includes('pi_browser=1');
  return isPiUa || hasPiNative || hasUrlParam;
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
    piInitState = 'success';
    return true;
  }
  if (piInitPromise) {
    return piInitPromise;
  }

  console.log('[PI] SDK initialization started. Sandbox:', sandbox);
  notifyDiagnosticStateChange();

  piInitPromise = (async () => {
    if (typeof window === 'undefined') return false;

    // Fetch API config status concurrently
    void fetchApiConfiguration();

    if (!window.Pi) {
      await loadPiSdkScript();
    }

    if (window.Pi) {
      sdkLoaded = true;
      try {
        window.Pi.init({ version: '2.0', sandbox });
        sdkInitialized = true;
        piInitState = 'success';
        console.log('[PI] SDK initialized successfully with sandbox:', sandbox);
        notifyDiagnosticStateChange();
        return true;
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        if (errMsg.toLowerCase().includes('initialized')) {
          sdkInitialized = true;
          piInitState = 'success';
          console.log('[PI] SDK initialized (already active)');
          notifyDiagnosticStateChange();
          return true;
        }
        console.warn('[PI] SDK init exception:', errMsg);
        piInitState = 'failed';
      }
    } else {
      console.warn('[PI] window.Pi unavailable after script load');
      piInitState = 'failed';
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
  console.log('[PI DIAGNOSTIC] typeof window.Pi:', typeof window !== 'undefined' ? typeof window.Pi : 'undefined');
  console.log('[PI DIAGNOSTIC] typeof window.Pi.init:', typeof window !== 'undefined' && window.Pi ? typeof window.Pi.init : 'undefined');
  console.log('[PI DIAGNOSTIC] typeof window.Pi.authenticate:', typeof window !== 'undefined' && window.Pi ? typeof window.Pi.authenticate : 'undefined');
  console.log('[PI DIAGNOSTIC] typeof window.Pi.createPayment:', typeof window !== 'undefined' && window.Pi ? typeof window.Pi.createPayment : 'undefined');
  console.log('[PI DIAGNOSTIC] window.location.origin:', currentOrigin);
  console.log('[PI DIAGNOSTIC] window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : '');
  console.log('[PI DIAGNOSTIC] document.readyState:', typeof document !== 'undefined' ? document.readyState : '');
  console.log('[PI DIAGNOSTIC] window.self === window.top:', typeof window !== 'undefined' ? window.self === window.top : true);
  console.log('[PI DIAGNOSTIC] build commit:', BUILD_COMMIT);

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
    console.log('[PI AUTH] AUTH_CALL_STARTED');
    authLifecycleState = 'AUTH_CALL_STARTED';
    authErrorType = null;
    authenticationError = null;
    notifyDiagnosticStateChange();

    let nativeWatchdogTimer: any = null;

    try {
      const hasSdk = await initPiSdk(sandbox);
      if (!hasSdk || typeof window === 'undefined' || !window.Pi) {
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        piAuthApiState = 'unavailable';
        notifyDiagnosticStateChange();
        throw new Error('Pi Network SDK failed to initialize in Pi Browser.');
      }

      // Ensure native webview bridge event listeners are attached and settled
      if (typeof document !== 'undefined' && document.readyState !== 'complete') {
        await new Promise((r) => setTimeout(r, 300));
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
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        piAuthApiState = 'unavailable';
        authenticationError = 'window.Pi.authenticate is not a function in runtime environment.';
        notifyDiagnosticStateChange();
        throw new Error('PI_AUTHENTICATE_UNAVAILABLE');
      }

      piAuthApiState = 'available';
      authenticateInvocation = 'called';
      authInvocationCount++;
      nativeBridgeState = 'calling_invocation';
      notifyDiagnosticStateChange();

      // Bounded UI Diagnostic Watchdog (Does NOT cancel or replace the native promise)
      nativeWatchdogTimer = setTimeout(() => {
        if (nativeBridgeState === 'promise_returned') {
          console.warn('[PI BRIDGE] AUTH_NATIVE_PENDING: Native bridge returned promise, but promise remains pending after 15 seconds.');
          nativeBridgeState = 'promise_pending';
          authLifecycleState = 'AUTH_NATIVE_PENDING';
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

      console.log('[PI BRIDGE] authenticate invocation starting. Total invocation count:', authInvocationCount);

      let authPromise: Promise<any>;
      try {
        authPromise = window.Pi.authenticate(requestedScopes, handleIncompletePayment);
        const isPromise = Boolean(authPromise && typeof (authPromise as any).then === 'function');
        console.log('[PI BRIDGE] authenticate invocation returned');
        console.log('[PI BRIDGE] authPromise returned and isPromise:', isPromise);
        nativeBridgeState = 'promise_returned';
        authLifecycleState = 'AUTH_PROMISE_RETURNED';
        console.log('[PI AUTH] AUTH_PROMISE_RETURNED');
        notifyDiagnosticStateChange();
      } catch (syncErr: any) {
        console.error('[PI BRIDGE] AUTHENTICATE_CALL_BLOCKED:', syncErr);
        nativeBridgeState = 'call_blocked';
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_REJECTED';
        authenticationError = `[PI BRIDGE] AUTHENTICATE_CALL_BLOCKED: ${syncErr?.message || syncErr}`;
        notifyDiagnosticStateChange();
        throw syncErr;
      }

      // Attach then / catch handlers without Promise.race canceling native promise
      authPromise.then(
        (res) => console.log('[PI BRIDGE] authPromise resolved in native bridge:', Boolean(res)),
        (err) => console.log('[PI BRIDGE] authPromise rejected in native bridge:', err?.message || err)
      );

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('AUTH_BRIDGE_TIMEOUT: Pi Network authentication timed out waiting for Pi Browser bridge response.'));
        }, 25000);
      });

      const auth = await Promise.race([authPromise, timeoutPromise]);

      console.log('[PI BRIDGE] authenticate promise resolved');
      nativeBridgeState = 'promise_resolved';

      if (auth && auth.user && auth.accessToken && auth.user.uid && auth.user.username) {
        authenticated = true;
        paymentScopeGranted = true;
        authLifecycleState = 'AUTH_SUCCESS';
        authErrorType = null;
        console.log('[PI AUTH] AUTH_SUCCESS for user:', auth.user.username);
        authenticationError = null;
        authenticatedUser = {
          username: auth.user.username,
          uid: auth.user.uid,
          accessToken: auth.accessToken,
          authenticated: true,
          role: auth.user.username === 'admin' ? 'admin' : 'buyer'
        };
        notifyDiagnosticStateChange();
        return authenticatedUser;
      } else {
        throw new Error('Pi Authentication did not return user credentials or access token.');
      }
    } catch (err: any) {
      console.log('[PI BRIDGE] authenticate promise rejected:', err);
      if (nativeBridgeState !== 'call_blocked') {
        nativeBridgeState = 'promise_rejected';
      }
      authenticated = false;
      paymentScopeGranted = false;
      authenticatedUser = null;

      let rawMsg = 'Pi Network authentication failed';
      if (typeof err === 'string') {
        rawMsg = err;
      } else if (err && typeof err === 'object') {
        rawMsg = err.message || err.error || err.description || (err.toString && err.toString() !== '[object Object]' ? err.toString() : JSON.stringify(err));
      }

      const isTimeout = rawMsg.includes('AUTH_BRIDGE_TIMEOUT') || rawMsg.includes('120000ms') || rawMsg.toLowerCase().includes('timed out');
      const isCancelled = rawMsg.toLowerCase().includes('cancel') || rawMsg.toLowerCase().includes('denied') || rawMsg.toLowerCase().includes('dismiss') || rawMsg.toLowerCase().includes('user_cancelled');
      const isUnavailable = rawMsg === 'PI_AUTHENTICATE_UNAVAILABLE' || rawMsg.includes('not a function');

      if (isCancelled) {
        authLifecycleState = 'AUTH_DENIED';
        authErrorType = 'AUTH_USER_CANCELLED';
        authenticationError = 'Pioneer cancelled or denied permission in Pi Browser.';
        console.log('[PI AUTH] AUTH_DENIED');
      } else if (isTimeout) {
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_TIMEOUT';
        authenticationError = 'Pi Browser bridge response timed out. Please tap "Retry Pi Authentication" to reconnect.';
        console.warn('[PI AUTH] AUTH_BRIDGE_TIMEOUT:', rawMsg);
      } else if (isUnavailable) {
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        authenticationError = 'window.Pi.authenticate API is unavailable in this environment.';
        console.log('[PI AUTH] PI_AUTHENTICATE_UNAVAILABLE');
      } else {
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_REJECTED';
        authenticationError = rawMsg;
        console.error('[PI AUTH] AUTH_ERROR:', rawMsg);
      }
      notifyDiagnosticStateChange();
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

    // Wait for document/webview readiness before calling authenticate
    if (typeof document !== 'undefined' && document.readyState !== 'complete') {
      await new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true });
        setTimeout(resolve, 1000);
      });
    }

    // Settlement delay for native webview bridge event listeners on initial page mount
    await new Promise((r) => setTimeout(r, 600));

    console.log('[PI AUTH] Proactive authentication starting...');
    return await authenticatePiUser(onIncompletePaymentFound, false);
  } catch (err: any) {
    console.warn('[PI AUTH] Proactive authentication notice (caught gracefully):', err?.message || err);
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
  if (diag.authState === 'AUTH_CALL_STARTED' || diag.authState === 'AUTH_PROMISE_RETURNED') {
    if (params.onStatusUpdate) params.onStatusUpdate('Waiting for Pi Browser authorization…');
  } else if (diag.authState === 'AUTH_NATIVE_PENDING') {
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
            const rawFiat = params.metadata?.fiatAmount ?? params.metadata?.fiatFare;
            const cleanFiat = typeof rawFiat === 'number' ? rawFiat : (typeof rawFiat === 'string' ? parseFloat(rawFiat.replace(/[^0-9.]/g, '')) : NaN);
            const appliedRate = typeof params.metadata?.piRateApplied === 'number' && params.metadata.piRateApplied > 0 ? params.metadata.piRateApplied : 10.0;
            const validFiat = (Number.isFinite(cleanFiat) && cleanFiat > 0)
              ? Number(cleanFiat.toFixed(2))
              : (params.amountPi > 0 ? Number((params.amountPi * appliedRate).toFixed(2)) : 10.0);

            const fulfillResult = await safeFetchJson('/api/v2/utility/fulfill', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId,
                txid,
                category: params.metadata?.category || 'transport',
                country: params.metadata?.country || 'Global',
                countryCode: params.metadata?.countryCode || 'GLOBAL',
                providerId: params.metadata?.providerId || 'unknown',
                accountNumber: params.metadata?.accountNumber || params.metadata?.passportNumber || params.metadata?.passengerEmail || '',
                fiatAmount: validFiat,
                piAmount: Number(params.amountPi),
                packageName: params.metadata?.packageName || params.metadata?.route || 'Travel Pass',
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
