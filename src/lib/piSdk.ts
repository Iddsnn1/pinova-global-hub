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
    __PI_SDK_MANAGER__?: any;
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

export const BUILD_COMMIT = 'b89f21cd99e230aa7782ce477ba6190f10c5580a';

// State Machine States
export type PiPaymentStage =
  | 'IDLE'
  | 'INITIALIZING_PI'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'CREATING_PAYMENT'
  | 'WAITING_FOR_PI_APPROVAL'
  | 'WAITING_FOR_PI_COMPLETION'
  | 'SERVER_VERIFICATION'
  | 'ESCROW_FULFILLMENT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'TIMEOUT';

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
  | 'AUTH_TIMEOUT'
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
  piInitState: 'success' | 'failed' | 'not_called' | 'initializing';
  piAuthApiState: 'available' | 'unavailable';
  authenticateInvocation: 'called' | 'not_called';
  authenticateInvocationCount: number;
  authAttemptId: string | null;
  activeAuthRequest: boolean;
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

// In-Memory Diagnostic Log Stream Buffer
const diagnosticLogBuffer: { timestamp: string; message: string; type: 'info' | 'warn' | 'error' }[] = [];
type LogListener = (logs: { timestamp: string; message: string; type: 'info' | 'warn' | 'error' }[]) => void;
const logListeners: Set<LogListener> = new Set();

export function logPiTrace(message: string, type: 'info' | 'warn' | 'error' = 'info'): void {
  const timestamp = new Date().toISOString();
  if (type === 'error') {
    console.error(message);
  } else if (type === 'warn') {
    console.warn(message);
  } else {
    console.log(message);
  }
  diagnosticLogBuffer.push({ timestamp, message, type });
  if (diagnosticLogBuffer.length > 200) {
    diagnosticLogBuffer.shift();
  }
  logListeners.forEach((listener) => {
    try {
      listener([...diagnosticLogBuffer]);
    } catch {
      // safe fallback
    }
  });
}

export function getPiDiagnosticLogs() {
  return [...diagnosticLogBuffer];
}

export function subscribePiDiagnosticLogs(listener: LogListener): () => void {
  logListeners.add(listener);
  listener([...diagnosticLogBuffer]);
  return () => {
    logListeners.delete(listener);
  };
}

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

export function isSandboxMode(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const override = localStorage.getItem('pi_sandbox_override');
    if (override === 'true') return true;
    if (override === 'false') return false;
  } catch {
    // Ignore storage errors
  }

  const search = window.location.search || '';
  if (search.includes('sandbox=true') || search.includes('sandbox=1') || search.includes('env=sandbox')) {
    return true;
  }
  if (search.includes('sandbox=false') || search.includes('sandbox=0') || search.includes('env=mainnet')) {
    return false;
  }

  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_PI_SANDBOX === 'false' || metaEnv.VITE_PI_ENV === 'mainnet') {
      return false;
    }
    if (metaEnv.VITE_PI_SANDBOX === 'true' || metaEnv.VITE_PI_ENV === 'sandbox') {
      return true;
    }
  }

  return true;
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

/**
 * Single Centralized Client-Side Pi SDK Service: PiSdkManager
 */
class PiSdkManagerService {
  private sdkLoaded = false;
  private sdkInitialized = false;
  private piInitState: 'success' | 'failed' | 'not_called' | 'initializing' = 'not_called';
  private piAuthApiState: 'available' | 'unavailable' = 'unavailable';
  private authenticateInvocation: 'called' | 'not_called' = 'not_called';
  private authInvocationCount = 0;
  private authAttemptCount = 0;
  private lastAuthAttemptId: string | null = null;
  private nativeBridgeState: NativeBridgeState = 'idle';
  private authLifecycleState: PiAuthState = 'AUTH_NOT_STARTED';
  private authErrorType: PiAuthErrorType = null;
  private authenticated = false;
  private paymentScopeGranted = false;
  private authenticatedUser: PiUser | null = null;
  private authenticationError: string | null = null;
  private apiConfigState: 'configured' | 'missing' = 'configured';
  private currentPaymentStage: PiPaymentStage = 'IDLE';
  private lastErrorCode: string | null = null;
  private configuredAppUrl = 'https://iddsnn.com';
  private readonly expectedProductionOrigin = 'https://iddsnn.com';

  // Singleton Promises
  private piInitPromise: Promise<boolean> | null = null;
  private piAuthPromise: Promise<PiUser> | null = null;
  private activePaymentId: string | null = null;
  private activePaymentInFlight = false;

  private diagnosticListeners: Set<(state: PiSdkDiagnosticState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.__PI_SDK_MANAGER__ = this;
    }
  }

  public subscribeDiagnostic(listener: (state: PiSdkDiagnosticState) => void): () => void {
    this.diagnosticListeners.add(listener);
    listener(this.getDiagnosticState());
    return () => {
      this.diagnosticListeners.delete(listener);
    };
  }

  private notifyDiagnosticStateChange() {
    const currentState = this.getDiagnosticState();
    if (typeof window !== 'undefined') {
      (window as any).__PI_DIAGNOSTICS__ = currentState;
    }
    this.diagnosticListeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (e) {
        console.error('[Pi SDK] Listener execution error:', e);
      }
    });
  }

  public getDiagnosticState(): PiSdkDiagnosticState {
    let sdkState: PiSdkDiagnosticState['sdkState'] = 'not_loaded';
    if (this.sdkInitialized && typeof window !== 'undefined' && window.Pi) {
      sdkState = 'ready';
    } else if (this.piInitPromise || this.piInitState === 'initializing') {
      sdkState = 'initializing';
    } else if (this.sdkLoaded || (typeof window !== 'undefined' && Boolean(window.Pi))) {
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
    const isSdkReady = this.sdkInitialized && hasPi;

    const authStateSummary: 'success' | 'pending' | 'failed' =
      this.authenticated && this.authenticatedUser
        ? 'success'
        : this.authLifecycleState === 'AUTH_CALL_STARTED' ||
          this.authLifecycleState === 'AUTH_PROMISE_RETURNED' ||
          this.authLifecycleState === 'AUTH_NATIVE_PENDING' ||
          Boolean(this.piAuthPromise)
        ? 'pending'
        : this.authLifecycleState === 'AUTH_DENIED' ||
          this.authLifecycleState === 'AUTH_ERROR' ||
          this.authLifecycleState === 'AUTH_TIMEOUT' ||
          this.authLifecycleState === 'PI_AUTHENTICATE_UNAVAILABLE'
        ? 'failed'
        : 'pending';

    return {
      sdkScriptState: hasPi || this.sdkLoaded ? 'loaded' : 'not_loaded',
      piInitState: this.piInitState,
      piAuthApiState: typeof window !== 'undefined' && window.Pi && typeof window.Pi.authenticate === 'function' ? 'available' : this.piAuthApiState,
      authenticateInvocation: this.authenticateInvocation,
      authenticateInvocationCount: this.authInvocationCount,
      authAttemptId: this.lastAuthAttemptId,
      activeAuthRequest: Boolean(this.piAuthPromise),
      hasActiveAuthPromise: Boolean(this.piAuthPromise),
      nativeBridgeState: this.nativeBridgeState,
      piEnvDetected: isPiBrowser(),
      productionOrigin: currentOrigin,
      sandbox: isSandbox,
      sdkReadyState: isSdkReady ? 'ready' : 'not_ready',
      network: isSandbox ? 'SANDBOX' : 'MAINNET',
      piAuthenticationState: authStateSummary,
      paymentScopeState: this.paymentScopeGranted ? 'granted' : 'not_granted',
      apiConfiguration: this.apiConfigState,
      buildCommit: BUILD_COMMIT,
      sdkState,
      authState: this.authLifecycleState,
      authErrorType: this.authErrorType,
      paymentScope: this.paymentScopeGranted ? 'granted' : 'not_granted',
      userState: this.authenticated && this.authenticatedUser ? 'authenticated' : 'not_authenticated',
      username: this.authenticatedUser?.username || null,
      error: this.authenticationError,
      isPiBrowser: isPiBrowser(),
      currentPaymentStage: this.currentPaymentStage,
      lastErrorCode: this.lastErrorCode,
      configuredAppUrl: this.configuredAppUrl,
      expectedProductionOrigin: this.expectedProductionOrigin,
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

  public isReady(): boolean {
    return this.sdkInitialized && typeof window !== 'undefined' && Boolean(window.Pi);
  }

  public isPaymentScopeReady(): boolean {
    return this.paymentScopeGranted && Boolean(this.authenticatedUser) && this.authenticated;
  }

  public getAuthenticatedUser(): PiUser | null {
    return this.authenticatedUser;
  }

  public getPaymentStage(): PiPaymentStage {
    return this.currentPaymentStage;
  }

  public setPaymentStage(stage: PiPaymentStage) {
    this.currentPaymentStage = stage;
    this.notifyDiagnosticStateChange();
  }

  public setCustomSandboxMode(sandbox: boolean) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pi_sandbox_override', sandbox ? 'true' : 'false');
      } catch (e) {
        console.warn('Could not save sandbox override to localStorage', e);
      }
    }
    this.sdkInitialized = false;
    this.piInitPromise = null;
    this.initialize(sandbox);
  }

  public async fetchApiConfiguration(): Promise<'configured' | 'missing'> {
    try {
      const res = await safeFetchJson('/api/v2/payments/config');
      if (res.ok && res.data) {
        if (res.data.apiConfiguration) {
          this.apiConfigState = res.data.apiConfiguration as 'configured' | 'missing';
        }
        if (res.data.configuredAppUrl) {
          this.configuredAppUrl = res.data.configuredAppUrl;
        }
      }
    } catch {
      // Keep fallback
    }
    this.notifyDiagnosticStateChange();
    return this.apiConfigState;
  }

  /**
   * Script Loading with Duplicate Injection Guard and Timeout
   */
  public async loadScript(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (window.Pi) {
      this.sdkLoaded = true;
      this.notifyDiagnosticStateChange();
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
            this.sdkLoaded = true;
            this.notifyDiagnosticStateChange();
            resolve(true);
          } else if (attempts >= 50) {
            clearInterval(interval);
            this.sdkLoaded = Boolean(window.Pi);
            resolve(this.sdkLoaded);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      let settled = false;

      const timeoutId = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.sdkLoaded = Boolean(window.Pi);
          this.notifyDiagnosticStateChange();
          resolve(this.sdkLoaded);
        }
      }, 6000);

      script.onload = () => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.Pi) {
            clearInterval(interval);
            clearTimeout(timeoutId);
            if (!settled) {
              settled = true;
              this.sdkLoaded = true;
              this.notifyDiagnosticStateChange();
              resolve(true);
            }
          } else if (attempts >= 30) {
            clearInterval(interval);
            clearTimeout(timeoutId);
            if (!settled) {
              settled = true;
              this.sdkLoaded = Boolean(window.Pi);
              this.notifyDiagnosticStateChange();
              resolve(this.sdkLoaded);
            }
          }
        }, 100);
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        if (!settled) {
          settled = true;
          logPiTrace('[Pi SDK] SCRIPT_LOAD_FAILED CDN script failed to load', 'warn');
          this.sdkLoaded = false;
          this.notifyDiagnosticStateChange();
          resolve(false);
        }
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Pi SDK exactly once per session with Hard Timeout
   */
  public async initialize(sandbox: boolean = isSandboxMode()): Promise<boolean> {
    if (this.sdkInitialized && typeof window !== 'undefined' && window.Pi) {
      this.piInitState = 'success';
      return true;
    }

    if (this.piInitPromise) {
      return this.piInitPromise;
    }

    const reqId = generateReqId('init');
    const ctx = getSafeRuntimeContext();

    logPiTrace(
      `[Pi SDK] INITIALIZE_START reqId=${reqId} sandbox=${sandbox} runtimeOrigin=${ctx.origin} hostname=${ctx.hostname} isPiBrowser=${isPiBrowser()}`
    );

    this.piInitState = 'initializing';
    this.currentPaymentStage = 'INITIALIZING_PI';
    this.notifyDiagnosticStateChange();

    this.piInitPromise = (async () => {
      if (typeof window === 'undefined') return false;

      void this.fetchApiConfiguration();

      if (!window.Pi) {
        await this.loadScript();
      }

      if (window.Pi) {
        this.sdkLoaded = true;
        try {
          window.Pi.init({ version: '2.0', sandbox });
          this.sdkInitialized = true;
          this.piInitState = 'success';
          this.lastErrorCode = null;
          logPiTrace(`[Pi SDK] INITIALIZE_SUCCESS reqId=${reqId} version=2.0 sandbox=${sandbox}`);
          this.notifyDiagnosticStateChange();
          return true;
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          if (errMsg.toLowerCase().includes('initialized')) {
            this.sdkInitialized = true;
            this.piInitState = 'success';
            this.lastErrorCode = null;
            logPiTrace(`[Pi SDK] INITIALIZE_SUCCESS reqId=${reqId} (already initialized)`);
            this.notifyDiagnosticStateChange();
            return true;
          }
          logPiTrace(`[Pi SDK] INITIALIZE_ERROR reqId=${reqId} error=${errMsg}`, 'warn');
          this.piInitState = 'failed';
          this.lastErrorCode = 'SDK_INIT_FAILED';
        }
      } else {
        logPiTrace(`[Pi SDK] INITIALIZE_TIMEOUT reqId=${reqId} error=SCRIPT_UNAVAILABLE`, 'warn');
        this.piInitState = 'failed';
        this.lastErrorCode = 'SDK_NOT_LOADED';
      }

      this.notifyDiagnosticStateChange();
      return this.sdkInitialized;
    })();

    const result = await this.piInitPromise;
    if (!result) {
      this.piInitPromise = null;
    }
    return result;
  }

  /**
   * Reset authentication state and clear active locks
   */
  public resetAuthenticationState(): void {
    this.piAuthPromise = null;
    this.authLifecycleState = 'AUTH_NOT_STARTED';
    this.authErrorType = null;
    this.nativeBridgeState = 'idle';
    this.authenticationError = null;
    this.lastErrorCode = null;
    this.currentPaymentStage = 'IDLE';
    this.activePaymentInFlight = false;
    this.activePaymentId = null;
    logPiTrace('[Pi SDK] AUTH_RESET cleared locks and reset lifecycle state');
    this.notifyDiagnosticStateChange();
  }

  /**
   * Authenticate Pi User with Hard Timeout (12-15s) and Safe Error States
   */
  public async authenticate(
    scopes: string[] = ['payments', 'username'],
    onIncompletePaymentFound?: (payment: PiPayment) => void,
    forceReauth: boolean = false
  ): Promise<PiUser> {
    this.authAttemptCount++;
    const authAttemptId = `auth_${this.authAttemptCount}_${Date.now().toString(36)}`;
    this.lastAuthAttemptId = authAttemptId;
    const inPi = isPiBrowser();

    logPiTrace(
      `[Pi SDK] AUTH_START attemptId=${authAttemptId} isPiBrowser=${inPi} forceReauth=${forceReauth} scopes=${JSON.stringify(scopes)}`
    );

    // Unsupported Browser Guard
    if (!inPi) {
      this.sdkLoaded = false;
      this.sdkInitialized = false;
      this.authenticated = false;
      this.paymentScopeGranted = false;
      this.authenticatedUser = null;
      this.authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
      this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
      this.lastErrorCode = 'PI_SDK_NOT_AVAILABLE';
      this.authenticationError = 'Pi payments require Pi Browser for this environment. Please open PiNova Global Hub in Pi Browser.';
      this.currentPaymentStage = 'FAILED';
      logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} error=NON_PI_BROWSER`, 'warn');
      this.notifyDiagnosticStateChange();
      throw new Error(this.authenticationError);
    }

    // Reuse existing session if authenticated and not forced
    if (!forceReauth && this.paymentScopeGranted && this.authenticatedUser && this.authenticated) {
      this.authLifecycleState = 'AUTH_SUCCESS';
      logPiTrace(`[Pi SDK] AUTH_SUCCESS attemptId=${authAttemptId} REUSING_SESSION username=${this.authenticatedUser.username}`);
      this.notifyDiagnosticStateChange();
      return this.authenticatedUser;
    }

    if (forceReauth) {
      this.piAuthPromise = null;
    }

    // Deduplicate in-flight auth promise
    if (this.piAuthPromise) {
      logPiTrace(`[Pi SDK] AUTH_DEDUPLICATED attemptId=${authAttemptId} - returning active in-flight promise`);
      return this.piAuthPromise;
    }

    this.piAuthPromise = (async () => {
      this.authLifecycleState = 'AUTH_CALL_STARTED';
      this.authErrorType = null;
      this.authenticationError = null;
      this.currentPaymentStage = 'AUTHENTICATING';
      this.notifyDiagnosticStateChange();

      try {
        // Step 1: Ensure initialized
        const hasSdk = await this.initialize();
        if (!hasSdk || typeof window === 'undefined' || !window.Pi) {
          this.authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.piAuthApiState = 'unavailable';
          this.lastErrorCode = 'SDK_INIT_FAILED';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = 'Pi Network SDK could not be initialized. Please reopen this page in Pi Browser and try again.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} error=SDK_INIT_FAILED`, 'warn');
          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        if (typeof window.Pi.authenticate !== 'function') {
          this.authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.piAuthApiState = 'unavailable';
          this.lastErrorCode = 'PI_SDK_NOT_AVAILABLE';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = 'Pi authenticate API is unavailable in this environment.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} error=AUTHENTICATE_UNAVAILABLE`, 'warn');
          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        this.piAuthApiState = 'available';
        this.authenticateInvocation = 'called';
        this.authInvocationCount++;
        this.nativeBridgeState = 'calling_invocation';
        this.notifyDiagnosticStateChange();

        const handleIncomplete = (payment: PiPayment) => {
          logPiTrace(`[Pi SDK] INCOMPLETE_PAYMENT_FOUND attemptId=${authAttemptId} paymentId=${payment?.identifier}`);
          if (onIncompletePaymentFound) {
            try {
              onIncompletePaymentFound(payment);
            } catch (cbErr) {
              console.error('[Pi SDK] Incomplete payment callback error:', cbErr);
            }
          }
        };

        // Step 2: Invoke Pi.authenticate() with Hard 12-Second Timeout Race
        let rawAuthPromise: Promise<any>;
        try {
          rawAuthPromise = window.Pi.authenticate(scopes, handleIncomplete);
          this.nativeBridgeState = 'promise_returned';
          this.authLifecycleState = 'AUTH_PROMISE_RETURNED';
          this.notifyDiagnosticStateChange();
        } catch (syncErr: any) {
          this.nativeBridgeState = 'call_blocked';
          this.authLifecycleState = 'AUTH_ERROR';
          this.authErrorType = 'AUTH_BRIDGE_REJECTED';
          this.lastErrorCode = 'PI_AUTH_REJECTED';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = syncErr?.message || 'Authentication call was blocked by Pi Browser bridge.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} syncError=${this.authenticationError}`, 'warn');
          this.notifyDiagnosticStateChange();
          throw syncErr;
        }

        const AUTH_TIMEOUT_MS = 14000;
        let timeoutHandle: any;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutHandle = setTimeout(() => {
            const timeoutErr = new Error('Pi Browser did not respond to the authentication request. Please tap Retry Pi Authentication.');
            (timeoutErr as any).code = 'AUTH_TIMEOUT';
            reject(timeoutErr);
          }, AUTH_TIMEOUT_MS);
        });

        const auth: any = await Promise.race([rawAuthPromise, timeoutPromise]).finally(() => {
          clearTimeout(timeoutHandle);
        });

        this.nativeBridgeState = 'promise_resolved';

        if (auth && auth.user && auth.accessToken && auth.user.uid && auth.user.username) {
          this.authenticated = true;
          this.paymentScopeGranted = true;
          this.authLifecycleState = 'AUTH_SUCCESS';
          this.authErrorType = null;
          this.authenticationError = null;
          this.currentPaymentStage = 'AUTHENTICATED';
          this.lastErrorCode = null;

          this.authenticatedUser = {
            username: auth.user.username,
            uid: auth.user.uid,
            accessToken: auth.accessToken,
            authenticated: true,
            role: auth.user.username === 'admin' ? 'admin' : 'buyer'
          };

          logPiTrace(`[Pi SDK] AUTH_SUCCESS attemptId=${authAttemptId} username=${auth.user.username}`);
          this.notifyDiagnosticStateChange();
          return this.authenticatedUser;
        } else {
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} error=MISSING_CREDENTIALS`, 'warn');
          throw new Error('Pi authentication returned incomplete user credentials.');
        }
      } catch (err: any) {
        if (this.nativeBridgeState !== 'call_blocked') {
          this.nativeBridgeState = 'promise_rejected';
        }
        this.authenticated = false;
        this.paymentScopeGranted = false;
        this.authenticatedUser = null;
        this.currentPaymentStage = 'FAILED';

        let rawMsg = '';
        if (typeof err === 'string') {
          rawMsg = err;
        } else if (err && typeof err === 'object') {
          rawMsg = err.message || err.error || err.description || JSON.stringify(err);
        }

        const isTimeout = err?.code === 'AUTH_TIMEOUT' || rawMsg.includes('did not respond') || rawMsg.includes('timed out');
        const isCancelled =
          rawMsg.toLowerCase().includes('cancel') ||
          rawMsg.toLowerCase().includes('denied') ||
          rawMsg.toLowerCase().includes('dismiss') ||
          rawMsg.toLowerCase().includes('user_cancelled');
        const isUnavailable =
          rawMsg === 'PI_SDK_NOT_AVAILABLE' ||
          rawMsg.includes('unavailable') ||
          rawMsg.includes('not available');

        if (isTimeout) {
          this.authLifecycleState = 'AUTH_TIMEOUT';
          this.authErrorType = 'AUTH_BRIDGE_TIMEOUT';
          this.lastErrorCode = 'AUTH_TIMEOUT';
          this.currentPaymentStage = 'TIMEOUT';
          this.authenticationError = 'Pi Browser did not respond to the authentication request. Please tap Retry Pi Authentication.';
          logPiTrace(`[Pi SDK] AUTH_TIMEOUT attemptId=${authAttemptId}`, 'warn');
        } else if (isCancelled) {
          this.authLifecycleState = 'AUTH_DENIED';
          this.authErrorType = 'AUTH_USER_CANCELLED';
          this.lastErrorCode = 'PI_AUTH_CANCELLED';
          this.currentPaymentStage = 'CANCELLED';
          this.authenticationError = 'Pi authentication was cancelled in Pi Browser.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} reason=CANCELLED`, 'warn');
        } else if (isUnavailable) {
          this.authLifecycleState = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.lastErrorCode = 'PI_SDK_NOT_AVAILABLE';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = 'Pi Network SDK is unavailable. Please open PiNova Global Hub in Pi Browser.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} reason=SDK_UNAVAILABLE`, 'warn');
        } else {
          this.authLifecycleState = 'AUTH_ERROR';
          this.authErrorType = 'AUTH_BRIDGE_REJECTED';
          this.lastErrorCode = 'PI_AUTH_REJECTED';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = 'Pi authentication was not completed.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${authAttemptId} error=${rawMsg}`, 'warn');
        }

        this.notifyDiagnosticStateChange();
        throw new Error(this.authenticationError);
      } finally {
        this.piAuthPromise = null;
        this.notifyDiagnosticStateChange();
      }
    })();

    return this.piAuthPromise;
  }

  /**
   * Execute Pi Payment with Bridge Response Hard Timeout (25s) and Robust State Machine
   */
  public executePayment(
    paymentData: PiPaymentData,
    callbacks: {
      onSuccess: (paymentId: string, txid: string) => void;
      onCancel: (paymentId: string) => void;
      onError: (error: Error, payment?: PiPayment) => void;
      onStatusUpdate?: (statusMessage: string) => void;
      onIncompletePaymentFound?: (payment: PiPayment) => void;
      idempotencyKey?: string;
    }
  ): void {
    const reqId = generateReqId('pay');
    const inPi = isPiBrowser();
    const idemKey = callbacks.idempotencyKey || `idem_${Date.now()}`;

    const updateStatus = (msg: string) => {
      if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(msg);
    };

    logPiTrace(
      `[Pi SDK] PAYMENT_START reqId=${reqId} amount=${paymentData.amount} memo="${paymentData.memo}" idempotencyKey=${idemKey}`
    );

    if (!inPi || typeof window === 'undefined' || !window.Pi) {
      this.currentPaymentStage = 'FAILED';
      this.lastErrorCode = 'SDK_NOT_LOADED';
      this.notifyDiagnosticStateChange();
      updateStatus('Official Pi Browser required');
      logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=NON_PI_BROWSER`, 'warn');
      callbacks.onError(new Error('Pi Network SDK is not available. Please open this app in Pi Browser and try again.'));
      return;
    }

    if (this.activePaymentInFlight) {
      logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=CONCURRENT_PAYMENT_BLOCKED`, 'warn');
      callbacks.onError(new Error('A payment authorization request is already active in Pi Browser. Please complete or cancel it first.'));
      return;
    }

    this.activePaymentInFlight = true;
    let hasHandledResponse = false;
    let bridgeTimeoutTimer: any = null;
    let signingTimeoutTimer: any = null;

    const cleanupTimers = () => {
      if (bridgeTimeoutTimer) clearTimeout(bridgeTimeoutTimer);
      if (signingTimeoutTimer) clearTimeout(signingTimeoutTimer);
    };

    const finishPaymentFlow = () => {
      cleanupTimers();
      this.activePaymentInFlight = false;
    };

    const runFlow = async () => {
      try {
        // Step 1: Ensure initialized and authenticated
        this.currentPaymentStage = 'AUTHENTICATING';
        this.notifyDiagnosticStateChange();
        updateStatus('Connecting Pi Network Wallet…');

        await this.authenticate(['payments', 'username'], callbacks.onIncompletePaymentFound, false);

        if (!this.paymentScopeGranted || !this.authenticatedUser) {
          this.currentPaymentStage = 'FAILED';
          this.lastErrorCode = 'PI_AUTH_REQUIRED';
          this.notifyDiagnosticStateChange();
          throw new Error('Pi authentication is required before payment. Permissions were not granted.');
        }

        // Step 2: Transition to CREATING_PAYMENT
        this.currentPaymentStage = 'CREATING_PAYMENT';
        this.notifyDiagnosticStateChange();
        updateStatus('Awaiting Pi Wallet authorization dialog…');

        // Hard Timeout: 25 seconds for Pi Browser native UI to invoke first callback
        const BRIDGE_TIMEOUT_MS = 25000;
        bridgeTimeoutTimer = setTimeout(() => {
          if (!hasHandledResponse) {
            hasHandledResponse = true;
            finishPaymentFlow();
            this.currentPaymentStage = 'TIMEOUT';
            this.lastErrorCode = 'PAYMENT_BRIDGE_TIMEOUT';
            this.notifyDiagnosticStateChange();
            logPiTrace(`[Pi SDK] PAYMENT_TIMEOUT reqId=${reqId} (bridge did not respond within ${BRIDGE_TIMEOUT_MS / 1000}s)`, 'warn');
            updateStatus('Pi Browser did not respond');
            callbacks.onError(new Error('Pi Browser did not respond to the payment authorization request. Please retry.'));
          }
        }, BRIDGE_TIMEOUT_MS);

        // Step 3: Trigger native window.Pi.createPayment
        window.Pi!.createPayment(paymentData, {
          onReadyForServerApproval: async (paymentId: string) => {
            cleanupTimers();
            this.activePaymentId = paymentId;
            this.currentPaymentStage = 'WAITING_FOR_PI_APPROVAL';
            this.notifyDiagnosticStateChange();
            logPiTrace(`[Pi SDK] PAYMENT_APPROVAL_START reqId=${reqId} paymentId=${paymentId}`);
            updateStatus('Waiting for server approval...');

            try {
              const res = await safeFetchJson('/api/v2/payments/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, idempotencyKey: idemKey })
              });
              const data = res.data || {};
              if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || res.error || 'Server approval failed');
              }
              logPiTrace(`[Pi SDK] PAYMENT_APPROVAL_SUCCESS reqId=${reqId} paymentId=${paymentId}`);
              this.currentPaymentStage = 'WAITING_FOR_PI_COMPLETION';
              this.notifyDiagnosticStateChange();
              updateStatus('Payment approved by server. Please confirm transaction in Pi Wallet...');

              // Set a generous 60s timer for user blockchain signing
              signingTimeoutTimer = setTimeout(() => {
                if (!hasHandledResponse) {
                  logPiTrace(`[Pi SDK] PAYMENT_SIGNING_WAITING reqId=${reqId} paymentId=${paymentId} (awaiting user blockchain confirmation)`);
                  updateStatus('Awaiting blockchain signature in Pi Wallet...');
                }
              }, 30000);
            } catch (err: any) {
              logPiTrace(`[Pi SDK] PAYMENT_APPROVAL_FAILURE reqId=${reqId} paymentId=${paymentId} error=${err.message}`, 'warn');
              this.currentPaymentStage = 'FAILED';
              this.lastErrorCode = 'PAYMENT_APPROVAL_FAILED';
              this.notifyDiagnosticStateChange();
              if (!hasHandledResponse) {
                hasHandledResponse = true;
                finishPaymentFlow();
                updateStatus('Payment approval failed');
                callbacks.onError(err);
              }
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            cleanupTimers();
            this.currentPaymentStage = 'SERVER_VERIFICATION';
            this.notifyDiagnosticStateChange();
            logPiTrace(`[Pi SDK] PAYMENT_COMPLETION_START reqId=${reqId} paymentId=${paymentId} txid=${txid}`);
            updateStatus('Payment broadcast to Pi blockchain. Completing on server...');

            try {
              const res = await safeFetchJson('/api/v2/payments/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid, idempotencyKey: idemKey })
              });
              const data = res.data || {};
              if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || res.error || 'Server completion failed');
              }
              logPiTrace(`[Pi SDK] PAYMENT_COMPLETED reqId=${reqId} paymentId=${paymentId} txid=${txid}`);
              this.currentPaymentStage = 'COMPLETED';
              this.lastErrorCode = null;
              this.notifyDiagnosticStateChange();

              if (!hasHandledResponse) {
                hasHandledResponse = true;
                finishPaymentFlow();
                updateStatus('Payment verified successfully!');
                callbacks.onSuccess(paymentId, txid);
              }
            } catch (err: any) {
              logPiTrace(`[Pi SDK] PAYMENT_COMPLETION_FAILURE reqId=${reqId} paymentId=${paymentId} error=${err.message}`, 'warn');
              this.currentPaymentStage = 'FAILED';
              this.lastErrorCode = 'PAYMENT_COMPLETION_FAILED';
              this.notifyDiagnosticStateChange();
              if (!hasHandledResponse) {
                hasHandledResponse = true;
                finishPaymentFlow();
                updateStatus('Payment completion failed');
                callbacks.onError(err);
              }
            }
          },

          onCancel: (paymentId: string) => {
            cleanupTimers();
            this.currentPaymentStage = 'CANCELLED';
            this.lastErrorCode = 'PAYMENT_CANCELLED';
            this.notifyDiagnosticStateChange();
            logPiTrace(`[Pi SDK] PAYMENT_CANCELLED reqId=${reqId} paymentId=${paymentId}`);
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              finishPaymentFlow();
              updateStatus('Payment cancelled');
              callbacks.onCancel(paymentId);
            }
          },

          onError: (error: Error, payment?: PiPayment) => {
            cleanupTimers();
            this.currentPaymentStage = 'FAILED';
            this.lastErrorCode = 'PAYMENT_ERROR';
            this.notifyDiagnosticStateChange();
            logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=${error?.message || 'Transaction error'}`, 'warn');
            if (!hasHandledResponse) {
              hasHandledResponse = true;
              finishPaymentFlow();
              updateStatus('Payment error: ' + (error?.message || 'Transaction error'));
              callbacks.onError(error || new Error('Pi payment error occurred.'), payment);
            }
          }
        });
      } catch (err: any) {
        if (!hasHandledResponse) {
          hasHandledResponse = true;
          finishPaymentFlow();
          const errMsg = err?.message || String(err);
          this.currentPaymentStage = 'FAILED';
          this.notifyDiagnosticStateChange();
          logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=${errMsg}`, 'warn');
          updateStatus('Payment execution failed');
          callbacks.onError(err || new Error('Pi payment could not be created.'));
        }
      }
    };

    runFlow();
  }

  /**
   * Async Promise Wrapper for Utility & Flight Checkout Flows
   */
  public async createPayment(params: {
    amountPi: number;
    memo: string;
    metadata?: Record<string, any>;
    onStatusUpdate?: (statusMessage: string) => void;
    onIncompletePaymentFound?: (payment: PiPayment) => void;
    idempotencyKey?: string;
  }): Promise<{
    success: boolean;
    paymentId?: string;
    txid?: string;
    fulfillmentStatus?: 'FULFILLED' | 'FULFILLMENT_PENDING' | 'FAILED';
    message?: string;
    data?: any;
    errorType?: 'TIMEOUT' | 'AUTH_ERROR' | 'CANCELLED' | 'ERROR';
  }> {
    const reqId = generateReqId('pay');
    const inPi = isPiBrowser();
    const idemKey = params.idempotencyKey || `idem_${Date.now()}`;

    if (!inPi) {
      this.currentPaymentStage = 'FAILED';
      this.lastErrorCode = 'SDK_NOT_LOADED';
      this.notifyDiagnosticStateChange();
      if (params.onStatusUpdate) params.onStatusUpdate('Pi Browser required');
      return {
        success: false,
        message: 'Pi Network SDK is not available. Please open this app in Pi Browser and try again.',
        errorType: 'AUTH_ERROR'
      };
    }

    return new Promise((resolve) => {
      this.executePayment(
        {
          amount: params.amountPi,
          memo: params.memo,
          metadata: params.metadata || {}
        },
        {
          idempotencyKey: idemKey,
          onStatusUpdate: params.onStatusUpdate,
          onIncompletePaymentFound: params.onIncompletePaymentFound,

          onSuccess: async (paymentId, txid) => {
            // If flight ticket, return success immediately for flight order creation
            if (params.metadata?.serviceType === 'FLIGHT_TICKET') {
              this.currentPaymentStage = 'COMPLETED';
              this.notifyDiagnosticStateChange();
              resolve({
                success: true,
                paymentId,
                txid,
                fulfillmentStatus: 'FULFILLED',
                message: 'Payment verified on Pi ledger.'
              });
              return;
            }

            // General utility fulfillment
            this.currentPaymentStage = 'SERVER_VERIFICATION';
            this.notifyDiagnosticStateChange();
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

              this.currentPaymentStage = 'ESCROW_FULFILLMENT';
              this.notifyDiagnosticStateChange();

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
                this.currentPaymentStage = 'COMPLETED';
                this.notifyDiagnosticStateChange();
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
                this.currentPaymentStage = 'FAILED';
                this.lastErrorCode = 'SERVER_VERIFICATION_FAILED';
                this.notifyDiagnosticStateChange();
                if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment verification failed');
                resolve({
                  success: false,
                  paymentId,
                  txid,
                  fulfillmentStatus: 'FAILED',
                  message: fulfillData.message || 'Server-side payment verification failed.',
                  errorType: 'ERROR'
                });
              }
            } catch (err: any) {
              this.currentPaymentStage = 'FAILED';
              this.lastErrorCode = 'SERVER_VERIFICATION_FAILED';
              this.notifyDiagnosticStateChange();
              if (params.onStatusUpdate) params.onStatusUpdate('Fulfillment error');
              resolve({
                success: false,
                paymentId,
                txid,
                fulfillmentStatus: 'FAILED',
                message: `Fulfillment error: ${err.message || 'Failed to reach fulfillment endpoint'}`,
                errorType: 'ERROR'
              });
            }
          },

          onCancel: (paymentId) => {
            this.currentPaymentStage = 'CANCELLED';
            this.lastErrorCode = 'PAYMENT_CANCELLED';
            this.notifyDiagnosticStateChange();
            if (params.onStatusUpdate) params.onStatusUpdate('Payment cancelled in Pi Wallet');
            resolve({
              success: false,
              paymentId,
              message: 'Payment was cancelled in Pi Wallet.',
              errorType: 'CANCELLED'
            });
          },

          onError: (err) => {
            const isTimeout = err?.message?.includes('did not respond') || this.currentPaymentStage === 'TIMEOUT';
            this.currentPaymentStage = isTimeout ? 'TIMEOUT' : 'FAILED';
            this.notifyDiagnosticStateChange();
            if (params.onStatusUpdate) params.onStatusUpdate(err.message || 'Payment error encountered');
            resolve({
              success: false,
              message: err.message || 'Pi payment could not be created.',
              errorType: isTimeout ? 'TIMEOUT' : 'ERROR'
            });
          }
        }
      );
    });
  }
}

// Singleton Export
export const PiSdkManager = new PiSdkManagerService();

// Standalone function exports preserving full backward compatibility
export async function initPiSdk(sandbox?: boolean): Promise<boolean> {
  return PiSdkManager.initialize(sandbox);
}

export async function authenticatePiUser(
  onIncompletePaymentFound?: (payment: PiPayment) => void,
  forceReauth: boolean = false
): Promise<PiUser> {
  return PiSdkManager.authenticate(['payments', 'username'], onIncompletePaymentFound, forceReauth);
}

export function resetPiAuthState(): void {
  PiSdkManager.resetAuthenticationState();
}

export function isPiSdkInitialized(): boolean {
  return PiSdkManager.isReady();
}

export function isPaymentScopeReady(): boolean {
  return PiSdkManager.isPaymentScopeReady();
}

export function getPiSdkDiagnosticState(): PiSdkDiagnosticState {
  return PiSdkManager.getDiagnosticState();
}

export function subscribePiSdkState(listener: (state: PiSdkDiagnosticState) => void): () => void {
  return PiSdkManager.subscribeDiagnostic(listener);
}

export function setCustomSandboxMode(sandbox: boolean): void {
  PiSdkManager.setCustomSandboxMode(sandbox);
}

export async function fetchApiConfiguration(): Promise<'configured' | 'missing'> {
  return PiSdkManager.fetchApiConfiguration();
}

export async function initAndAuthenticateProactively(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser | null> {
  const inPi = isPiBrowser();
  if (!inPi) return null;

  try {
    const ready = await PiSdkManager.initialize();
    if (!ready) return null;

    if (typeof document !== 'undefined' && document.readyState !== 'complete') {
      await new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true });
        setTimeout(resolve, 1000);
      });
    }

    await new Promise((r) => setTimeout(r, 600));
    return await PiSdkManager.authenticate(['payments', 'username'], onIncompletePaymentFound, false);
  } catch (err: any) {
    console.warn('[Pi SDK] Proactive auth notice:', err?.message || err);
    return null;
  }
}

export async function ensurePaymentScopeReady(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<boolean> {
  const inPi = isPiBrowser();
  if (!inPi) {
    throw new Error('Pi Network SDK is not available. Please open this app in Pi Browser and try again.');
  }

  const ready = await PiSdkManager.initialize();
  if (!ready) {
    throw new Error('Pi Network SDK could not be initialized. Please verify the Pi App domain configuration.');
  }

  const user = await PiSdkManager.authenticate(['payments', 'username'], onIncompletePaymentFound, false);
  if (!user) {
    throw new Error('Pi authentication is required before payment. Permissions were not granted.');
  }
  return true;
}

export function executePiPayment(
  paymentData: PiPaymentData,
  callbacks: {
    onSuccess: (paymentId: string, txid: string) => void;
    onCancel: (paymentId: string) => void;
    onError: (error: Error, payment?: PiPayment) => void;
    onStatusUpdate?: (statusMessage: string) => void;
    onIncompletePaymentFound?: (payment: PiPayment) => void;
    idempotencyKey?: string;
  }
): void {
  PiSdkManager.executePayment(paymentData, callbacks);
}

export async function createPiPayment(params: {
  amountPi: number;
  memo: string;
  metadata?: Record<string, any>;
  onStatusUpdate?: (statusMessage: string) => void;
  onIncompletePaymentFound?: (payment: PiPayment) => void;
  idempotencyKey?: string;
}) {
  return PiSdkManager.createPayment(params);
}
