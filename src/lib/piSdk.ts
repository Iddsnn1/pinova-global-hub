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

export type PiPaymentStage =
  | 'IDLE'
  | 'SDK_LOADING'
  | 'SDK_READY'
  | 'PI_AUTHENTICATING'
  | 'PI_AUTHENTICATED'
  | 'PAYMENT_CREATING'
  | 'PAYMENT_APPROVAL'
  | 'PAYMENT_COMPLETION'
  | 'SERVER_VERIFICATION'
  | 'ESCROW_FULFILLMENT'
  | 'COMPLETED'
  | 'FAILED';

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
  currentPaymentStage?: PiPaymentStage;
  lastErrorCode?: string | null;
  configuredAppUrl?: string;
  expectedProductionOrigin?: string;
  runtimeCheck?: {
    hasPi: boolean;
    initType: string;
    authType: string;
    createPaymentType: string;
  };
  currentOrigin?: string;
  isIframe?: boolean;
}

// Explicit Internal State Tracking
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
let serverConfigSynced = false;
let serverConfiguredSandbox: boolean | null = null;
let currentPaymentStage: PiPaymentStage = 'IDLE';
let lastErrorCode: string | null = null;
let configuredAppUrl = 'https://iddsnn.com';
const expectedProductionOrigin = 'https://iddsnn.com';

// Singleton Locks
let piInitPromise: Promise<boolean> | null = null;
let piAuthPromise: Promise<PiUser> | null = null;

// Diagnostic Listeners
type DiagnosticListener = (state: PiSdkDiagnosticState) => void;
const diagnosticListeners: Set<DiagnosticListener> = new Set();

function generateReqId(prefix: string = 'pi'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

export function getSafeRuntimeContext() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://iddsnn.com';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'iddsnn.com';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  const sdkAvailable = typeof window !== 'undefined' && Boolean(window.Pi);
  const environment = isSandboxMode() ? 'SANDBOX' : 'MAINNET';
  return { origin, hostname, protocol, sdkAvailable, environment };
}

export async function fetchApiConfiguration(): Promise<'configured' | 'missing'> {
  try {
    const res = await safeFetchJson('/api/v2/payments/config');
    if (res.ok && res.data) {
      if (res.data.apiConfiguration) {
        apiConfigState = res.data.apiConfiguration as 'configured' | 'missing';
      }
      if (typeof res.data.sandbox === 'boolean') {
        serverConfiguredSandbox = res.data.sandbox;
        serverConfigSynced = true;
      }
      if (res.data.configuredAppUrl) {
        configuredAppUrl = res.data.configuredAppUrl;
      }
    }
  } catch {
    // Keep fallback defaults
  }
  notifyDiagnosticStateChange();
  return apiConfigState;
}

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
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://iddsnn.com';
  let isIframe = false;
  try {
    isIframe = typeof window !== 'undefined' ? window.self !== window.top : false;
  } catch {
    isIframe = true;
  }
  const isSandbox = isSandboxMode();
  const isSdkReady = sdkInitialized && hasPi;

  const authStateSummary: 'success' | 'pending' | 'failed' =
    authenticated && authenticatedUser
      ? 'success'
      : (authLifecycleState === 'AUTH_CALL_STARTED' ||
          authLifecycleState === 'AUTH_PROMISE_RETURNED' ||
          authLifecycleState === 'AUTH_NATIVE_PENDING' ||
          Boolean(piAuthPromise))
      ? 'pending'
      : authLifecycleState === 'AUTH_DENIED' ||
        authLifecycleState === 'AUTH_ERROR' ||
        authLifecycleState === 'PI_AUTHENTICATE_UNAVAILABLE'
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
    currentPaymentStage,
    lastErrorCode,
    configuredAppUrl,
    expectedProductionOrigin,
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
      console.error('[Pi SDK] Listener execution error:', e);
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
  } catch {
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

  // 4. Check synchronized backend configuration if received
  if (serverConfigSynced && serverConfiguredSandbox !== null) {
    return serverConfiguredSandbox;
  }

  // Default to true (SANDBOX / TESTNET) to match Developer Portal Sandbox setup
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
  const isPiUa = /PiBrowser|Pi Network/i.test(userAgent);
  const hasPiNative = Boolean((window as any).PiNative || (window as any).__PI_NATIVE__);
  const hasUrlParam = typeof window.location !== 'undefined' && /pi_browser=1|pi_browser=true/i.test(window.location.search);
  const hasPiObject = Boolean(window.Pi && typeof window.Pi.createPayment === 'function');
  return isPiUa || hasPiNative || hasUrlParam || hasPiObject;
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
        } else if (attempts >= 60) {
          // 6 seconds max wait for pre-existing script tag
          clearInterval(interval);
          sdkLoaded = Boolean(window.Pi);
          resolve(sdkLoaded);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Pi) {
          clearInterval(interval);
          sdkLoaded = true;
          notifyDiagnosticStateChange();
          resolve(true);
        } else if (attempts >= 30) {
          clearInterval(interval);
          sdkLoaded = Boolean(window.Pi);
          notifyDiagnosticStateChange();
          resolve(sdkLoaded);
        }
      }, 100);
    };
    script.onerror = () => {
      console.warn('[Pi SDK] SCRIPT_LOAD_FAILED CDN script failed to load');
      sdkLoaded = false;
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

  const reqId = generateReqId('init');
  const ctx = getSafeRuntimeContext();

  console.log(
    `[Pi SDK] INIT_START reqId=${reqId} runtimeOrigin=${ctx.origin} hostname=${ctx.hostname} protocol=${ctx.protocol} sdkAvailable=${ctx.sdkAvailable} initialized=${sdkInitialized} environment=${ctx.environment} requiredScopes=payments,username`
  );

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
      console.log(`[Pi SDK] SCRIPT_READY reqId=${reqId}`);
      try {
        window.Pi.init({ version: '2.0', sandbox });
        sdkInitialized = true;
        piInitState = 'success';
        console.log(
          `[Pi SDK] INIT_SUCCESS reqId=${reqId} runtimeOrigin=${ctx.origin} environment=${sandbox ? 'SANDBOX' : 'MAINNET'}`
        );
        notifyDiagnosticStateChange();
        return true;
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        if (errMsg.toLowerCase().includes('initialized')) {
          sdkInitialized = true;
          piInitState = 'success';
          console.log(`[Pi SDK] INIT_SUCCESS (already active) reqId=${reqId}`);
          notifyDiagnosticStateChange();
          return true;
        }
        console.warn(`[Pi SDK] INIT_FAILURE reqId=${reqId} error=${errMsg}`);
        piInitState = 'failed';
        lastErrorCode = 'SDK_INIT_FAILED';
      }
    } else {
      console.warn(`[Pi SDK] INIT_FAILURE reqId=${reqId} error=SCRIPT_UNAVAILABLE`);
      piInitState = 'failed';
      lastErrorCode = 'SDK_NOT_LOADED';
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
  const reqId = generateReqId('auth');
  const ctx = getSafeRuntimeContext();
  const inPi = isPiBrowser();

  console.log(
    `[Pi SDK] AUTH_START reqId=${reqId} runtimeOrigin=${ctx.origin} hostname=${ctx.hostname} inPiBrowser=${inPi} environment=${ctx.environment} requiredScopes=payments,username`
  );

  // Non-Pi Browser Environment check
  if (!inPi) {
    sdkLoaded = false;
    sdkInitialized = false;
    authenticated = false;
    paymentScopeGranted = false;
    authenticatedUser = null;
    authLifecycleState = 'AUTH_ERROR';
    authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
    lastErrorCode = 'PI_AUTH_REQUIRED';
    authenticationError = 'Official Pi Browser is required for Pi Network payments. Please open this app inside Pi Browser.';
    console.log(`[Pi SDK] AUTH_FAILURE reqId=${reqId} reason=NON_PI_BROWSER runtimeOrigin=${ctx.origin}`);
    notifyDiagnosticStateChange();
    throw new Error('Official Pi Browser is required to authenticate with Pi Network. Please open this app inside Pi Browser.');
  }

  // Inside Pi Browser: Return active session if already authenticated
  if (!forceReauth && paymentScopeGranted && authenticatedUser && authenticated) {
    authLifecycleState = 'AUTH_SUCCESS';
    notifyDiagnosticStateChange();
    return authenticatedUser;
  }

  // Singleton Authentication Lock
  if (piAuthPromise) {
    return piAuthPromise;
  }

  piAuthPromise = (async () => {
    authLifecycleState = 'AUTH_CALL_STARTED';
    authErrorType = null;
    authenticationError = null;
    notifyDiagnosticStateChange();

    let nativeWatchdogTimer: any = null;

    try {
      const sandbox = isSandboxMode();
      const hasSdk = await initPiSdk(sandbox);
      if (!hasSdk || typeof window === 'undefined' || !window.Pi) {
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        piAuthApiState = 'unavailable';
        lastErrorCode = 'SDK_INIT_FAILED';
        notifyDiagnosticStateChange();
        throw new Error('Pi Network SDK could not initialize. Please verify the Pi App domain configuration.');
      }

      if (typeof window.Pi.authenticate !== 'function') {
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        piAuthApiState = 'unavailable';
        lastErrorCode = 'PI_AUTHENTICATE_UNAVAILABLE';
        authenticationError = 'Pi authenticate API is unavailable in this environment.';
        notifyDiagnosticStateChange();
        throw new Error('Pi authenticate API is unavailable in this environment.');
      }

      piAuthApiState = 'available';
      authenticateInvocation = 'called';
      authInvocationCount++;
      nativeBridgeState = 'calling_invocation';
      notifyDiagnosticStateChange();

      nativeWatchdogTimer = setTimeout(() => {
        if (nativeBridgeState === 'promise_returned') {
          nativeBridgeState = 'promise_pending';
          authLifecycleState = 'AUTH_NATIVE_PENDING';
          notifyDiagnosticStateChange();
        }
      }, 15000);

      const requestedScopes = ['payments', 'username'];

      const handleIncompletePayment = (payment: PiPayment) => {
        console.log(`[Pi SDK] INCOMPLETE_PAYMENT_FOUND paymentId=${payment?.identifier}`);
        void Promise.resolve()
          .then(() => {
            if (onIncompletePaymentFound) {
              onIncompletePaymentFound(payment);
            }
          })
          .catch((cbErr) => {
            console.error('[Pi SDK] Incomplete payment callback error:', cbErr);
          });
      };

      let authPromise: Promise<any>;
      try {
        authPromise = window.Pi.authenticate(requestedScopes, handleIncompletePayment);
        nativeBridgeState = 'promise_returned';
        authLifecycleState = 'AUTH_PROMISE_RETURNED';
        notifyDiagnosticStateChange();
      } catch (syncErr: any) {
        nativeBridgeState = 'call_blocked';
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_REJECTED';
        lastErrorCode = 'PI_AUTH_FAILED';
        authenticationError = syncErr?.message || 'Authentication call was blocked by Pi Browser bridge.';
        notifyDiagnosticStateChange();
        throw syncErr;
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('AUTH_BRIDGE_TIMEOUT: Pi Network authentication timed out waiting for Pi Browser bridge response.'));
        }, 25000);
      });

      const auth = await Promise.race([authPromise, timeoutPromise]);
      nativeBridgeState = 'promise_resolved';

      if (auth && auth.user && auth.accessToken && auth.user.uid && auth.user.username) {
        authenticated = true;
        paymentScopeGranted = true;
        authLifecycleState = 'AUTH_SUCCESS';
        authErrorType = null;
        authenticationError = null;
        console.log(`[Pi SDK] AUTH_SUCCESS reqId=${reqId} username=${auth.user.username} uid=${auth.user.uid}`);
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
        rawMsg = err.message || err.error || err.description || JSON.stringify(err);
      }

      const isTimeout = rawMsg.includes('AUTH_BRIDGE_TIMEOUT') || rawMsg.toLowerCase().includes('timed out');
      const isCancelled =
        rawMsg.toLowerCase().includes('cancel') ||
        rawMsg.toLowerCase().includes('denied') ||
        rawMsg.toLowerCase().includes('dismiss') ||
        rawMsg.toLowerCase().includes('user_cancelled');
      const isUnavailable = rawMsg === 'PI_AUTHENTICATE_UNAVAILABLE' || rawMsg.includes('unavailable');

      if (isCancelled) {
        authLifecycleState = 'AUTH_DENIED';
        authErrorType = 'AUTH_USER_CANCELLED';
        lastErrorCode = 'PI_AUTH_REQUIRED';
        authenticationError = 'Pioneer cancelled or denied permissions in Pi Browser.';
      } else if (isTimeout) {
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_TIMEOUT';
        lastErrorCode = 'PI_AUTH_FAILED';
        authenticationError = 'Pi Browser bridge response timed out. Please tap "Retry Pi Authentication".';
      } else if (isUnavailable) {
        authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
        authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
        lastErrorCode = 'PI_AUTHENTICATE_UNAVAILABLE';
        authenticationError = 'Pi authenticate API is unavailable in this environment.';
      } else {
        authLifecycleState = 'AUTH_ERROR';
        authErrorType = 'AUTH_BRIDGE_REJECTED';
        lastErrorCode = 'PI_AUTH_FAILED';
        authenticationError = rawMsg;
      }

      console.warn(`[Pi SDK] AUTH_FAILURE reqId=${reqId} error=${authenticationError}`);
      notifyDiagnosticStateChange();
      throw new Error(authenticationError);
    } finally {
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
    return null;
  }

  try {
    const sdkReady = await initPiSdk();
    if (!sdkReady) {
      return null;
    }

    if (typeof document !== 'undefined' && document.readyState !== 'complete') {
      await new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true });
        setTimeout(resolve, 1000);
      });
    }

    await new Promise((r) => setTimeout(r, 600));
    return await authenticatePiUser(onIncompletePaymentFound, false);
  } catch (err: any) {
    console.warn('[Pi SDK] Proactive auth notice (handled safely):', err?.message || err);
    return null;
  }
}

export async function ensurePaymentScopeReady(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<boolean> {
  currentPaymentStage = 'SDK_LOADING';
  notifyDiagnosticStateChange();

  const inPi = isPiBrowser();
  if (!inPi) {
    currentPaymentStage = 'FAILED';
    lastErrorCode = 'SDK_NOT_LOADED';
    notifyDiagnosticStateChange();
    throw new Error('Pi Network SDK is not available. Please open this app in Pi Browser and try again.');
  }

  const sdkReady = await initPiSdk();
  if (!sdkReady || !window.Pi) {
    currentPaymentStage = 'FAILED';
    lastErrorCode = 'SDK_INIT_FAILED';
    notifyDiagnosticStateChange();
    throw new Error('Pi Network SDK could not initialize. Please verify the Pi App domain configuration.');
  }

  currentPaymentStage = 'SDK_READY';
  notifyDiagnosticStateChange();

  if (paymentScopeGranted && authenticatedUser && authenticated) {
    currentPaymentStage = 'PI_AUTHENTICATED';
    notifyDiagnosticStateChange();
    return true;
  }

  currentPaymentStage = 'PI_AUTHENTICATING';
  notifyDiagnosticStateChange();

  const user = await authenticatePiUser(onIncompletePaymentFound, false);
  if (!paymentScopeGranted || !user) {
    currentPaymentStage = 'FAILED';
    lastErrorCode = 'PI_AUTH_FAILED';
    notifyDiagnosticStateChange();
    throw new Error('Pi authentication is required before payment. Permissions were not granted.');
  }

  currentPaymentStage = 'PI_AUTHENTICATED';
  notifyDiagnosticStateChange();
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
  const reqId = generateReqId('pay');
  const ctx = getSafeRuntimeContext();

  console.log(
    `[Pi SDK] PAYMENT_CREATE_START reqId=${reqId} runtimeOrigin=${ctx.origin} hostname=${ctx.hostname} amountPi=${params.amountPi} memo=${params.memo}`
  );

  const inPi = isPiBrowser();
  if (!inPi) {
    currentPaymentStage = 'FAILED';
    lastErrorCode = 'SDK_NOT_LOADED';
    notifyDiagnosticStateChange();
    if (params.onStatusUpdate) params.onStatusUpdate('Pi Browser required');
    return {
      success: false,
      message: 'Pi Network SDK is not available. Please open this app in Pi Browser and try again.'
    };
  }

  try {
    if (params.onStatusUpdate) params.onStatusUpdate('Connecting Pi Network Wallet...');
    await ensurePaymentScopeReady(params.onIncompletePaymentFound);
  } catch (authErr: any) {
    const errMsg = authErr?.message || String(authErr);
    console.warn(`[Pi SDK] PAYMENT_CREATE_FAILURE reqId=${reqId} stage=${currentPaymentStage} error=${errMsg}`);
    if (params.onStatusUpdate) params.onStatusUpdate('Authorization failed');
    return {
      success: false,
      message: errMsg
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
          currentPaymentStage = 'SERVER_VERIFICATION';
          notifyDiagnosticStateChange();
          if (params.onStatusUpdate) params.onStatusUpdate('Payment verified on Pi ledger. Processing fulfillment...');

          try {
            const rawFiat = params.metadata?.fiatAmount ?? params.metadata?.fiatFare;
            const cleanFiat =
              typeof rawFiat === 'number'
                ? rawFiat
                : typeof rawFiat === 'string'
                ? parseFloat(rawFiat.replace(/[^0-9.]/g, ''))
                : NaN;
            const appliedRate =
              typeof params.metadata?.piRateApplied === 'number' && params.metadata.piRateApplied > 0
                ? params.metadata.piRateApplied
                : 10.0;
            const validFiat =
              Number.isFinite(cleanFiat) && cleanFiat > 0
                ? Number(cleanFiat.toFixed(2))
                : params.amountPi > 0
                ? Number((params.amountPi * appliedRate).toFixed(2))
                : 10.0;

            currentPaymentStage = 'ESCROW_FULFILLMENT';
            notifyDiagnosticStateChange();

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
                accountNumber:
                  params.metadata?.accountNumber ||
                  params.metadata?.passportNumber ||
                  params.metadata?.passengerEmail ||
                  '',
                fiatAmount: validFiat,
                piAmount: Number(params.amountPi),
                packageName: params.metadata?.packageName || params.metadata?.route || 'Travel Pass',
                idempotencyKey: paymentId
              })
            });

            const fulfillData = fulfillResult.data || {};
            if (fulfillResult.ok && fulfillData.success) {
              currentPaymentStage = 'COMPLETED';
              notifyDiagnosticStateChange();
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
              currentPaymentStage = 'FAILED';
              lastErrorCode = 'SERVER_VERIFICATION_FAILED';
              notifyDiagnosticStateChange();
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
            currentPaymentStage = 'FAILED';
            lastErrorCode = 'SERVER_VERIFICATION_FAILED';
            notifyDiagnosticStateChange();
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
          currentPaymentStage = 'FAILED';
          lastErrorCode = 'PAYMENT_CREATE_FAILED';
          notifyDiagnosticStateChange();
          if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled in Pi Wallet');
          resolve({
            success: false,
            paymentId,
            message: 'Payment was cancelled in Pi Wallet.'
          });
        },
        onError: (err) => {
          currentPaymentStage = 'FAILED';
          notifyDiagnosticStateChange();
          if (params.onStatusUpdate) params.onStatusUpdate('Payment error encountered');
          resolve({
            success: false,
            message: err.message || 'Pi payment could not be created.'
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
    if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
  };

  const inPi = isPiBrowser();
  if (!inPi || typeof window === 'undefined' || !window.Pi) {
    updateStatus('Official Pi Browser required');
    if (!hasHandledResponse) {
      hasHandledResponse = true;
      callbacks.onError(new Error('Pi Network SDK is not available. Please open this app in Pi Browser and try again.'));
    }
    return;
  }

  const runPaymentFlow = async () => {
    try {
      currentPaymentStage = 'PI_AUTHENTICATING';
      updateStatus('Waiting for Pi Browser authorization…');
      await ensurePaymentScopeReady(callbacks.onIncompletePaymentFound);

      if (!paymentScopeGranted) {
        currentPaymentStage = 'FAILED';
        lastErrorCode = 'PI_AUTH_REQUIRED';
        throw new Error('Pi authentication is required before payment.');
      }

      currentPaymentStage = 'PAYMENT_CREATING';
      notifyDiagnosticStateChange();
      updateStatus('Connecting to Pi Network Wallet...');

      const statusWarningTimer = setTimeout(() => {
        if (!hasHandledResponse) {
          updateStatus('Awaiting transaction confirmation in Pi Wallet...');
        }
      }, 15000);

      window.Pi!.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          clearTimeout(statusWarningTimer);
          currentPaymentStage = 'PAYMENT_APPROVAL';
          notifyDiagnosticStateChange();
          console.log(`[Pi SDK] PAYMENT_APPROVAL_START paymentId=${paymentId}`);
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
            console.log(`[Pi SDK] PAYMENT_APPROVAL_SUCCESS paymentId=${paymentId}`);
            updateStatus('Payment approved by server. Please confirm transaction in Pi Wallet...');
          } catch (err: any) {
            console.warn(`[Pi SDK] PAYMENT_APPROVAL_FAILURE paymentId=${paymentId} error=${err.message}`);
            currentPaymentStage = 'FAILED';
            lastErrorCode = 'PAYMENT_APPROVAL_FAILED';
            notifyDiagnosticStateChange();
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment approval failed');
              callbacks.onError(err);
            }
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          clearTimeout(statusWarningTimer);
          currentPaymentStage = 'PAYMENT_COMPLETION';
          notifyDiagnosticStateChange();
          console.log(`[Pi SDK] PAYMENT_COMPLETION_START paymentId=${paymentId} txid=${txid}`);
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
            console.log(`[Pi SDK] PAYMENT_CREATE_SUCCESS paymentId=${paymentId} txid=${txid}`);
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment verified successfully!');
              callbacks.onSuccess(paymentId, txid);
            }
          } catch (err: any) {
            console.warn(`[Pi SDK] PAYMENT_COMPLETION_FAILURE paymentId=${paymentId} error=${err.message}`);
            currentPaymentStage = 'FAILED';
            lastErrorCode = 'PAYMENT_COMPLETION_FAILED';
            notifyDiagnosticStateChange();
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              updateStatus('Payment completion failed');
              callbacks.onError(err);
            }
          }
        },
        onCancel: (paymentId: string) => {
          clearTimeout(statusWarningTimer);
          currentPaymentStage = 'FAILED';
          lastErrorCode = 'PAYMENT_CREATE_FAILED';
          notifyDiagnosticStateChange();
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            updateStatus('Payment cancelled');
            callbacks.onCancel(paymentId);
          }
        },
        onError: (error: Error) => {
          clearTimeout(statusWarningTimer);
          currentPaymentStage = 'FAILED';
          lastErrorCode = 'PAYMENT_CREATE_FAILED';
          notifyDiagnosticStateChange();
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            console.warn(`[Pi SDK] PAYMENT_CREATE_FAILURE error=${error?.message || 'Transaction rejected'}`);
            updateStatus('Payment error: ' + (error?.message || 'Transaction rejected'));
            callbacks.onError(error || new Error('Pi payment could not be created.'));
          }
        }
      });
    } catch (err: any) {
      if (!hasHandledResponse) {
        hasHandledResponse = true;
        currentPaymentStage = 'FAILED';
        notifyDiagnosticStateChange();
        updateStatus('Payment execution failed');
        callbacks.onError(err || new Error('Pi payment could not be created.'));
      }
    }
  };

  runPaymentFlow();
}
