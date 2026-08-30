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
    PiNative?: any;
    __PI_NATIVE__?: any;
    ReactNativeWebView?: any;
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
  | 'IDLE'
  | 'INITIALIZING'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'TIMEOUT'
  | 'REJECTED'
  | 'FAILED'
  | 'AUTH_NOT_STARTED'
  | 'AUTH_CALL_STARTED'
  | 'AUTH_PROMISE_RETURNED'
  | 'AUTH_NATIVE_PENDING'
  | 'AUTH_TIMEOUT'
  | 'AUTH_DENIED'
  | 'AUTH_ERROR'
  | 'AUTH_SUCCESS'
  | 'PI_AUTHENTICATE_UNAVAILABLE';

export type PiAuthErrorType =
  | 'AUTH_BRIDGE_TIMEOUT'
  | 'AUTH_BRIDGE_REJECTED'
  | 'AUTH_USER_CANCELLED'
  | 'AUTH_ERROR'
  | 'PI_AUTHENTICATE_UNAVAILABLE'
  | null;

export type PiDiagnosticCategory =
  | 'CATEGORY_A_SDK_MISSING'
  | 'CATEGORY_B_SDK_NOT_INITIALIZED'
  | 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE'
  | 'CATEGORY_D_AUTH_NO_RESPONSE'
  | 'CATEGORY_E_AUTH_REJECTED'
  | 'CATEGORY_F_PAYMENT_CREATION_FAILED'
  | 'CATEGORY_G_PAYMENT_APPROVAL_FAILED'
  | 'CATEGORY_H_PAYMENT_COMPLETION_FAILED'
  | 'ENVIRONMENT_CONFIGURATION_INVALID';

export interface PiRuntimePreflightResult {
  hasPiSdk: boolean;
  hasAuthenticate: boolean;
  hasCreatePayment: boolean;
  hasNativeBridge: boolean;
  isPiUserAgent: boolean;
  isPiBrowser: boolean;
  isRegisteredProductionDomain: boolean;
  isOfficialDomain: boolean;
  currentOrigin: string;
  expectedProductionOrigin: string;
  originMatches: boolean;
  initialized: boolean;
  canAttemptAuth: boolean;
  failReason?: string;
  category?: PiDiagnosticCategory;
}

export type PiNetworkEnvironment = 'SANDBOX' | 'MAINNET';

export interface PiEnvironmentDetails {
  network: PiNetworkEnvironment;
  sandbox: boolean;
  source: 'LOCAL_STORAGE_OVERRIDE' | 'URL_OVERRIDE' | 'VITE_PI_ENV' | 'VITE_PI_SANDBOX' | 'DEFAULT_FALLBACK';
  configuredEnv?: string;
  configuredSandbox?: string;
  hasConflict: boolean;
  conflictWarning?: string;
  overrideValue?: string;
  environmentConsistency: 'CONSISTENT' | 'INVALID';
  configuredNetwork: PiNetworkEnvironment;
  effectiveSandbox: boolean;
  environmentSource: string;
}

export interface PiNetworkConfig {
  environment: 'sandbox' | 'mainnet';
  network: PiNetworkEnvironment;
  sandbox: boolean;
  source: 'LOCAL_STORAGE_OVERRIDE' | 'URL_OVERRIDE' | 'VITE_PI_ENV' | 'VITE_PI_SANDBOX' | 'DEFAULT_FALLBACK';
  hasConflict: boolean;
  conflictWarning?: string;
  configuredEnv?: string;
  configuredSandbox?: string;
  environmentConsistency: 'CONSISTENT' | 'INVALID';
  configuredNetwork: PiNetworkEnvironment;
  effectiveSandbox: boolean;
  environmentSource: string;
}

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
  network: PiNetworkEnvironment;
  environmentDetails?: PiEnvironmentDetails;
  conflictWarning?: string;
  configuredNetwork?: PiNetworkEnvironment;
  effectiveSandbox?: boolean;
  environmentSource?: string;
  environmentConsistency?: 'CONSISTENT' | 'INVALID';
  sdkInitNetwork?: PiNetworkEnvironment | null;
  sdkInitSandbox?: boolean | null;
  sdkInitializationCount?: number;
  piAuthenticationState: 'success' | 'pending' | 'failed';
  paymentScopeState: 'granted' | 'not_granted';
  apiConfiguration: 'configured' | 'missing';
  buildCommit: string;
  sdkState: 'not_loaded' | 'loaded' | 'initializing' | 'ready';
  authState: PiAuthState;
  authErrorType: PiAuthErrorType;
  diagnosticCategory?: PiDiagnosticCategory | null;
  paymentScope: 'granted' | 'not_granted';
  userState: 'authenticated' | 'not_authenticated';
  username: string | null;
  error: string | null;
  isPiBrowser: boolean;
  hasPiSdk: boolean;
  hasNativeBridge: boolean;
  isPiUserAgent: boolean;
  isOfficialDomain: boolean;
  originMatches: boolean;
  isRegisteredProductionDomain: boolean;
  currentPaymentStage?: PiPaymentStage;
  lastErrorCode?: string | null;
  configuredAppUrl?: string;
  expectedProductionOrigin?: string;
  originClassification?: 'OFFICIAL_REGISTERED_DOMAIN' | 'VERCEL_PREVIEW_ORIGIN' | 'LOCAL_DEV_ORIGIN' | 'OTHER_ORIGIN';
  runtimeCheck?: {
    hasPi: boolean;
    initType: string;
    authType: string;
    createPaymentType: string;
  };
  currentOrigin?: string;
  isIframe?: boolean;
}

// In-Memory Diagnostic Log Stream Buffer (strictly sanitized - no tokens/secrets)
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
  if (diagnosticLogBuffer.length > 250) {
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

export function getDomainDiagnosticInfo() {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://iddsnn.com';
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'iddsnn.com';
  const expectedProductionOrigin = 'https://iddsnn.com';
  const isOfficialDomain = currentHostname === 'iddsnn.com' || currentHostname.endsWith('.iddsnn.com');
  const isVercelOrigin = currentHostname.includes('vercel.app');
  let classification: 'OFFICIAL_REGISTERED_DOMAIN' | 'VERCEL_PREVIEW_ORIGIN' | 'LOCAL_DEV_ORIGIN' | 'OTHER_ORIGIN';
  if (isOfficialDomain) {
    classification = 'OFFICIAL_REGISTERED_DOMAIN';
  } else if (isVercelOrigin) {
    classification = 'VERCEL_PREVIEW_ORIGIN';
  } else if (currentHostname === 'localhost' || currentHostname === '127.0.0.1' || currentHostname.includes('ais-dev-')) {
    classification = 'LOCAL_DEV_ORIGIN';
  } else {
    classification = 'OTHER_ORIGIN';
  }
  return {
    currentOrigin,
    currentHostname,
    expectedProductionOrigin,
    matchesExpectedDomain: isOfficialDomain,
    classification
  };
}

export function getPiEnvironmentDetails(): PiEnvironmentDetails {
  if (typeof window === 'undefined') {
    // Safe SSR/build default.
    return {
      network: 'SANDBOX',
      sandbox: true,
      source: 'DEFAULT_FALLBACK',
      hasConflict: false,
      environmentConsistency: 'CONSISTENT',
      configuredNetwork: 'SANDBOX',
      effectiveSandbox: true,
      environmentSource: 'DEFAULT_FALLBACK'
    };
  }

  // ---------------------------------------------------------
  // 1. Explicit local/session override (for development/testing)
  // ---------------------------------------------------------
  try {
    const override = localStorage.getItem('pi_sandbox_override');

    if (override === 'true') {
      return {
        network: 'SANDBOX',
        sandbox: true,
        source: 'LOCAL_STORAGE_OVERRIDE',
        overrideValue: 'true',
        hasConflict: false,
        environmentConsistency: 'CONSISTENT',
        configuredNetwork: 'SANDBOX',
        effectiveSandbox: true,
        environmentSource: 'LOCAL_STORAGE_OVERRIDE'
      };
    }

    if (override === 'false') {
      return {
        network: 'MAINNET',
        sandbox: false,
        source: 'LOCAL_STORAGE_OVERRIDE',
        overrideValue: 'false',
        hasConflict: false,
        environmentConsistency: 'CONSISTENT',
        configuredNetwork: 'MAINNET',
        effectiveSandbox: false,
        environmentSource: 'LOCAL_STORAGE_OVERRIDE'
      };
    }
  } catch {
    // Ignore storage errors.
  }

  // ---------------------------------------------------------
  // 2. Explicit URL override for controlled testing
  // ---------------------------------------------------------
  const search = window.location.search || '';

  if (
    /(?:[?&])(sandbox=true|sandbox=1|env=sandbox)(?:&|$)/i.test(search)
  ) {
    return {
      network: 'SANDBOX',
      sandbox: true,
      source: 'URL_OVERRIDE',
      overrideValue: 'sandbox',
      hasConflict: false,
      environmentConsistency: 'CONSISTENT',
      configuredNetwork: 'SANDBOX',
      effectiveSandbox: true,
      environmentSource: 'URL_OVERRIDE'
    };
  }

  if (
    /(?:[?&])(sandbox=false|sandbox=0|env=mainnet)(?:&|$)/i.test(search)
  ) {
    return {
      network: 'MAINNET',
      sandbox: false,
      source: 'URL_OVERRIDE',
      overrideValue: 'mainnet',
      hasConflict: false,
      environmentConsistency: 'CONSISTENT',
      configuredNetwork: 'MAINNET',
      effectiveSandbox: false,
      environmentSource: 'URL_OVERRIDE'
    };
  }

  // ---------------------------------------------------------
  // 3. Deployment environment variables are authoritative
  // ---------------------------------------------------------
  const metaEnv = (import.meta as any).env || {};
  const rawEnv = metaEnv.VITE_PI_ENV !== undefined ? String(metaEnv.VITE_PI_ENV).trim().toLowerCase() : '';
  const rawSandbox = metaEnv.VITE_PI_SANDBOX !== undefined ? String(metaEnv.VITE_PI_SANDBOX).trim().toLowerCase() : '';

  let hasConflict = false;
  let conflictWarning: string | undefined;

  const envWantsMainnet = rawEnv === 'mainnet';
  const envWantsSandbox = rawEnv === 'sandbox' || rawEnv === 'testnet';
  const sandboxWantsMainnet = rawSandbox === 'false' || rawSandbox === '0';
  const sandboxWantsSandbox = rawSandbox === 'true' || rawSandbox === '1';

  if (rawEnv && rawSandbox) {
    if ((envWantsMainnet && sandboxWantsSandbox) || (envWantsSandbox && sandboxWantsMainnet)) {
      hasConflict = true;
      conflictWarning = `Conflicting Pi environment variables detected (VITE_PI_ENV="${metaEnv.VITE_PI_ENV}", VITE_PI_SANDBOX="${metaEnv.VITE_PI_SANDBOX}"). Configuration is INVALID and payments are blocked until consistent.`;
    }
  }

  const consistency = hasConflict ? 'INVALID' : 'CONSISTENT';

  if (envWantsMainnet) {
    return {
      network: 'MAINNET',
      sandbox: false,
      source: 'VITE_PI_ENV',
      configuredEnv: metaEnv.VITE_PI_ENV,
      configuredSandbox: metaEnv.VITE_PI_SANDBOX,
      hasConflict,
      conflictWarning,
      environmentConsistency: consistency,
      configuredNetwork: 'MAINNET',
      effectiveSandbox: false,
      environmentSource: `VITE_PI_ENV=${metaEnv.VITE_PI_ENV}`
    };
  }

  if (envWantsSandbox) {
    return {
      network: 'SANDBOX',
      sandbox: true,
      source: 'VITE_PI_ENV',
      configuredEnv: metaEnv.VITE_PI_ENV,
      configuredSandbox: metaEnv.VITE_PI_SANDBOX,
      hasConflict,
      conflictWarning,
      environmentConsistency: consistency,
      configuredNetwork: 'SANDBOX',
      effectiveSandbox: true,
      environmentSource: `VITE_PI_ENV=${metaEnv.VITE_PI_ENV}`
    };
  }

  if (sandboxWantsMainnet) {
    return {
      network: 'MAINNET',
      sandbox: false,
      source: 'VITE_PI_SANDBOX',
      configuredEnv: metaEnv.VITE_PI_ENV,
      configuredSandbox: metaEnv.VITE_PI_SANDBOX,
      hasConflict,
      conflictWarning,
      environmentConsistency: consistency,
      configuredNetwork: 'MAINNET',
      effectiveSandbox: false,
      environmentSource: `VITE_PI_SANDBOX=${metaEnv.VITE_PI_SANDBOX}`
    };
  }

  if (sandboxWantsSandbox) {
    return {
      network: 'SANDBOX',
      sandbox: true,
      source: 'VITE_PI_SANDBOX',
      configuredEnv: metaEnv.VITE_PI_ENV,
      configuredSandbox: metaEnv.VITE_PI_SANDBOX,
      hasConflict,
      conflictWarning,
      environmentConsistency: consistency,
      configuredNetwork: 'SANDBOX',
      effectiveSandbox: true,
      environmentSource: `VITE_PI_SANDBOX=${metaEnv.VITE_PI_SANDBOX}`
    };
  }

  // ---------------------------------------------------------
  // 4. IMPORTANT SAFETY DEFAULT
  // ---------------------------------------------------------
  // Do NOT automatically force https://iddsnn.com to Mainnet.
  //
  // The current PiNova environment is being tested on Testnet.
  // Mainnet must only be enabled explicitly through deployment
  // configuration.
  //
  // Therefore, if no explicit environment is configured,
  // default to Sandbox.
  // ---------------------------------------------------------
  return {
    network: 'SANDBOX',
    sandbox: true,
    source: 'DEFAULT_FALLBACK',
    hasConflict: false,
    environmentConsistency: 'CONSISTENT',
    configuredNetwork: 'SANDBOX',
    effectiveSandbox: true,
    environmentSource: 'DEFAULT_FALLBACK'
  };
}

export function getPiNetworkConfig(): PiNetworkConfig {
  const details = getPiEnvironmentDetails();
  return {
    environment: details.sandbox ? 'sandbox' : 'mainnet',
    network: details.network,
    sandbox: details.sandbox,
    source: details.source,
    hasConflict: details.hasConflict,
    conflictWarning: details.conflictWarning,
    configuredEnv: details.configuredEnv,
    configuredSandbox: details.configuredSandbox,
    environmentConsistency: details.environmentConsistency,
    configuredNetwork: details.configuredNetwork,
    effectiveSandbox: details.effectiveSandbox,
    environmentSource: details.environmentSource
  };
}

export function getPiNetworkEnvironment(): PiNetworkEnvironment {
  return getPiEnvironmentDetails().network;
}

export function isSandboxMode(): boolean {
  return getPiEnvironmentDetails().sandbox;
}

export function clearCustomSandboxOverride(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('pi_sandbox_override');
    } catch {
      // Ignore
    }
  }
}

export function getSafeRuntimeContext() {
  const domainInfo = getDomainDiagnosticInfo();
  const origin = domainInfo.currentOrigin;
  const hostname = domainInfo.currentHostname;
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  const sdkAvailable = typeof window !== 'undefined' && Boolean(window.Pi);
  const envDetails = getPiEnvironmentDetails();
  const environment = envDetails.network;
  return { origin, hostname, protocol, sdkAvailable, environment, domainInfo, envDetails };
}

/**
 * Reliable runtime classification using actual browser & native bridge signals.
 * CRITICAL: The domain 'iddsnn.com', 'window.Pi', or Vercel URLs MUST NOT independently
 * classify a browser as Pi Browser.
 */
export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  const isPiUa = /PiBrowser|minepi/i.test(userAgent);
  const hasPiNative = Boolean(
    (window as any).PiNative ||
    (window as any).__PI_NATIVE__ ||
    (window as any).ReactNativeWebView ||
    (window as any).webkit?.messageHandlers?.piBrowser
  );
  const hasUrlParam = typeof window.location !== 'undefined' && /pi_browser=1|pi_browser=true|env=pi/i.test(window.location.search);

  let isEmbeddedInPiApp = false;
  try {
    if (window.self !== window.top) {
      const ref = document.referrer || '';
      if (/minepi\.com|pinetwork/i.test(ref)) {
        isEmbeddedInPiApp = true;
      }
    }
  } catch {
    // Cross-origin restriction; do not falsely assume true
  }

  return isPiUa || hasPiNative || hasUrlParam || isEmbeddedInPiApp;
}

/**
 * Helper to detect standard external desktop / non-Pi mobile browsers
 */
export function isExternalBrowserNonPi(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  const inPi = isPiBrowser();
  const hasBridge = Boolean(
    (window as any).PiNative ||
    (window as any).__PI_NATIVE__ ||
    (window as any).ReactNativeWebView ||
    (window as any).webkit?.messageHandlers?.piBrowser
  );
  const isStandardBrowser = /Chrome|Safari|Firefox|Edge/i.test(userAgent) && !/PiBrowser|minepi/i.test(userAgent);

  return !inPi && !hasBridge && isStandardBrowser;
}

/**
 * Pi Runtime Preflight: Lightweight diagnostic inspection performed before calling authenticate()
 */
export function getPiRuntimePreflight(): PiRuntimePreflightResult {
  const hasPiSdk = typeof window !== 'undefined' && Boolean(window.Pi);
  const hasAuthenticate = hasPiSdk && typeof window.Pi?.authenticate === 'function';
  const hasCreatePayment = hasPiSdk && typeof window.Pi?.createPayment === 'function';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isPiUserAgent = /PiBrowser|minepi/i.test(userAgent);
  const hasNativeBridge = typeof window !== 'undefined' && Boolean(
    (window as any).PiNative ||
    (window as any).__PI_NATIVE__ ||
    (window as any).ReactNativeWebView ||
    (window as any).webkit?.messageHandlers?.piBrowser
  );
  const inPiBrowser = isPiBrowser();
  const domainInfo = getDomainDiagnosticInfo();
  const isRegisteredProductionDomain = domainInfo.matchesExpectedDomain;
  const isOfficialDomain = domainInfo.matchesExpectedDomain;
  const currentOrigin = domainInfo.currentOrigin;
  const expectedProductionOrigin = domainInfo.expectedProductionOrigin;
  const originMatches = currentOrigin === expectedProductionOrigin || domainInfo.classification === 'OFFICIAL_REGISTERED_DOMAIN';
  const isExternal = isExternalBrowserNonPi();

  let canAttemptAuth = true;
  let failReason: string | undefined;
  let category: PiDiagnosticCategory | undefined;

  if (isExternal || (!inPiBrowser && !hasNativeBridge && !isPiUserAgent)) {
    canAttemptAuth = false;
    failReason = 'Please open PiNova Global Hub in the official Pi Browser to authenticate and pay with Pi.';
    category = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
  } else if (!hasPiSdk) {
    // SDK script may not be loaded yet
    canAttemptAuth = false;
    failReason = 'Pi SDK script is not available in window.Pi.';
    category = 'CATEGORY_A_SDK_MISSING';
  } else if (!hasAuthenticate) {
    canAttemptAuth = false;
    failReason = 'Pi.authenticate method is unavailable on window.Pi.';
    category = 'CATEGORY_B_SDK_NOT_INITIALIZED';
  }

  return {
    hasPiSdk,
    hasAuthenticate,
    hasCreatePayment,
    hasNativeBridge,
    isPiUserAgent,
    isPiBrowser: inPiBrowser,
    isRegisteredProductionDomain,
    isOfficialDomain,
    currentOrigin,
    expectedProductionOrigin,
    originMatches,
    initialized: hasPiSdk && PiSdkManager.isReady(),
    canAttemptAuth,
    failReason,
    category
  };
}

/**
 * Single Centralized Client-Side Pi SDK Service: PiSdkManager
 */
class PiSdkManagerService {
  private sdkLoaded = false;
  private sdkInitialized = false;
  private sdkInitNetwork: PiNetworkEnvironment | null = null;
  private sdkInitSandbox: boolean | null = null;
  private sdkInitializationCount = 0;
  private piInitState: 'success' | 'failed' | 'not_called' | 'initializing' = 'not_called';
  private piAuthApiState: 'available' | 'unavailable' = 'unavailable';
  private authenticateInvocation: 'called' | 'not_called' = 'not_called';
  private authInvocationCount = 0;
  private authAttemptCount = 0;
  private lastAuthAttemptId: string | null = null;
  private nativeBridgeState: NativeBridgeState = 'idle';
  private authLifecycleState: PiAuthState = 'IDLE';
  private authErrorType: PiAuthErrorType = null;
  private diagnosticCategory: PiDiagnosticCategory | null = null;
  private authenticated = false;
  private paymentScopeGranted = false;
  private authenticatedUser: PiUser | null = null;
  private authenticationError: string | null = null;
  private apiConfigState: 'configured' | 'missing' = 'configured';
  private currentPaymentStage: PiPaymentStage = 'IDLE';
  private lastErrorCode: string | null = null;
  private configuredAppUrl = 'https://iddsnn.com';
  private readonly expectedProductionOrigin = 'https://iddsnn.com';

  // Singleton Promises & Concurrency Locks
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
    const domainInfo = getDomainDiagnosticInfo();
    const currentOrigin = domainInfo.currentOrigin;
    let isIframe = false;
    try {
      isIframe = typeof window !== 'undefined' ? window.self !== window.top : false;
    } catch {
      isIframe = true;
    }
    const envDetails = getPiEnvironmentDetails();
    const isSandbox = envDetails.sandbox;
    const isSdkReady = this.sdkInitialized && hasPi;
    const inPi = isPiBrowser();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isPiUa = /PiBrowser|minepi/i.test(userAgent);
    const hasBridge = typeof window !== 'undefined' && Boolean(
      (window as any).PiNative ||
      (window as any).__PI_NATIVE__ ||
      (window as any).ReactNativeWebView ||
      (window as any).webkit?.messageHandlers?.piBrowser
    );

    const authStateSummary: 'success' | 'pending' | 'failed' =
      this.authenticated && this.authenticatedUser
        ? 'success'
        : this.authLifecycleState === 'AUTHENTICATING' ||
          this.authLifecycleState === 'INITIALIZING' ||
          this.authLifecycleState === 'AUTH_CALL_STARTED' ||
          this.authLifecycleState === 'AUTH_PROMISE_RETURNED' ||
          this.authLifecycleState === 'AUTH_NATIVE_PENDING' ||
          Boolean(this.piAuthPromise)
        ? 'pending'
        : this.authLifecycleState === 'REJECTED' ||
          this.authLifecycleState === 'FAILED' ||
          this.authLifecycleState === 'TIMEOUT' ||
          this.authLifecycleState === 'AUTH_TIMEOUT' ||
          this.authLifecycleState === 'AUTH_DENIED' ||
          this.authLifecycleState === 'AUTH_ERROR' ||
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
      piEnvDetected: inPi,
      productionOrigin: currentOrigin,
      sandbox: isSandbox,
      sdkReadyState: isSdkReady ? 'ready' : 'not_ready',
      network: envDetails.network,
      environmentDetails: envDetails,
      conflictWarning: envDetails.conflictWarning,
      configuredNetwork: envDetails.configuredNetwork,
      effectiveSandbox: envDetails.effectiveSandbox,
      environmentSource: envDetails.environmentSource,
      environmentConsistency: envDetails.environmentConsistency,
      sdkInitNetwork: this.sdkInitNetwork,
      sdkInitSandbox: this.sdkInitSandbox,
      sdkInitializationCount: this.sdkInitializationCount,
      piAuthenticationState: authStateSummary,
      paymentScopeState: this.paymentScopeGranted ? 'granted' : 'not_granted',
      apiConfiguration: this.apiConfigState,
      buildCommit: BUILD_COMMIT,
      sdkState,
      authState: this.authLifecycleState,
      authErrorType: this.authErrorType,
      diagnosticCategory: this.diagnosticCategory,
      paymentScope: this.paymentScopeGranted ? 'granted' : 'not_granted',
      userState: this.authenticated && this.authenticatedUser ? 'authenticated' : 'not_authenticated',
      username: this.authenticatedUser?.username || null,
      error: this.authenticationError,
      isPiBrowser: inPi,
      hasPiSdk: hasPi,
      hasNativeBridge: hasBridge,
      isPiUserAgent: isPiUa,
      isOfficialDomain: domainInfo.matchesExpectedDomain,
      originMatches: domainInfo.matchesExpectedDomain || domainInfo.classification === 'OFFICIAL_REGISTERED_DOMAIN',
      isRegisteredProductionDomain: domainInfo.matchesExpectedDomain,
      currentPaymentStage: this.currentPaymentStage,
      lastErrorCode: this.lastErrorCode,
      configuredAppUrl: this.configuredAppUrl,
      expectedProductionOrigin: this.expectedProductionOrigin,
      originClassification: domainInfo.classification,
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

  public resetInitializationState(): void {
    this.sdkInitialized = false;
    this.piInitState = 'not_called';
    this.piInitPromise = null;
    this.sdkInitNetwork = null;
    this.sdkInitSandbox = null;
    this.resetAuthenticationState();
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
    this.resetInitializationState();
    void this.initialize(sandbox);
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
   * Initialize Pi SDK exactly once per session using authoritative environment configuration
   */
  public async initialize(sandbox?: boolean): Promise<boolean> {
    const envConfig = getPiNetworkConfig();
    const resolvedSandbox = typeof sandbox === 'boolean' ? sandbox : envConfig.effectiveSandbox;
    const resolvedNetwork: PiNetworkEnvironment = resolvedSandbox ? 'SANDBOX' : 'MAINNET';

    // Inconsistent / conflicting environment validation guard
    if (envConfig.environmentConsistency === 'INVALID' || envConfig.hasConflict) {
      logPiTrace(
        `[Pi SDK] INIT_BLOCKED error=ENVIRONMENT_CONFIGURATION_INVALID ${envConfig.conflictWarning || ''}`,
        'error'
      );
      this.piInitState = 'failed';
      this.diagnosticCategory = 'ENVIRONMENT_CONFIGURATION_INVALID';
      this.lastErrorCode = 'ENVIRONMENT_CONFIGURATION_INVALID';
      this.authLifecycleState = 'FAILED';
      this.notifyDiagnosticStateChange();
      return false;
    }

    // If already initialized for the EXACT resolved sandbox mode
    if (this.sdkInitialized && typeof window !== 'undefined' && window.Pi && this.sdkInitSandbox === resolvedSandbox) {
      this.piInitState = 'success';
      return true;
    }

    // If SDK was previously initialized for a DIFFERENT network (e.g. toggled in UI), reset first
    if (this.sdkInitialized && this.sdkInitSandbox !== null && this.sdkInitSandbox !== resolvedSandbox) {
      logPiTrace(`[Pi SDK] Network environment changed from sandbox=${this.sdkInitSandbox} to sandbox=${resolvedSandbox}. Resetting SDK initialization.`);
      this.resetInitializationState();
    }

    if (this.piInitPromise) {
      return this.piInitPromise;
    }

    const reqId = generateReqId('init');
    const ctx = getSafeRuntimeContext();
    const hasPiObj = typeof window !== 'undefined' && Boolean(window.Pi);
    const inPi = isPiBrowser();

    this.sdkInitializationCount++;
    this.sdkInitNetwork = resolvedNetwork;
    this.sdkInitSandbox = resolvedSandbox;

    logPiTrace(
      `[Pi SDK] PI_OBJECT_AVAILABLE available=${hasPiObj} hasInit=${typeof window !== 'undefined' && typeof window.Pi?.init === 'function'} hasAuth=${typeof window !== 'undefined' && typeof window.Pi?.authenticate === 'function'} hasCreatePayment=${typeof window !== 'undefined' && typeof window.Pi?.createPayment === 'function'}`
    );
    logPiTrace(
      `[Pi SDK] BROWSER_CONTEXT isPiBrowser=${inPi} originClassification=${ctx.domainInfo.classification} isRegisteredDomain=${ctx.domainInfo.matchesExpectedDomain} userAgent=${typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'}`
    );
    logPiTrace(
      `[Pi SDK] INIT_START reqId=${reqId} network=${resolvedNetwork} sandbox=${resolvedSandbox} initCount=${this.sdkInitializationCount} initialOrigin=${ctx.origin} targetOrigin=${this.expectedProductionOrigin}`
    );

    this.piInitState = 'initializing';
    this.currentPaymentStage = 'INITIALIZING_PI';
    this.authLifecycleState = 'INITIALIZING';
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
          window.Pi.init({ version: '2.0', sandbox: resolvedSandbox });
          this.sdkInitialized = true;
          this.piInitState = 'success';
          this.diagnosticCategory = null;
          this.lastErrorCode = null;
          this.authLifecycleState = 'IDLE';
          logPiTrace(`[Pi SDK] INIT_SUCCESS reqId=${reqId} version=2.0 network=${resolvedNetwork} sandbox=${resolvedSandbox}`);
          this.notifyDiagnosticStateChange();
          return true;
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          if (errMsg.toLowerCase().includes('initialized')) {
            this.sdkInitialized = true;
            this.piInitState = 'success';
            this.diagnosticCategory = null;
            this.lastErrorCode = null;
            this.authLifecycleState = 'IDLE';
            logPiTrace(`[Pi SDK] INIT_SUCCESS reqId=${reqId} (already initialized) version=2.0 network=${resolvedNetwork} sandbox=${resolvedSandbox}`);
            this.notifyDiagnosticStateChange();
            return true;
          }
          logPiTrace(`[Pi SDK] INIT_ERROR reqId=${reqId} error=${errMsg}`, 'warn');
          this.piInitState = 'failed';
          this.diagnosticCategory = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.lastErrorCode = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.authLifecycleState = 'FAILED';
        }
      } else {
        logPiTrace(`[Pi SDK] INIT_TIMEOUT reqId=${reqId} error=SCRIPT_UNAVAILABLE`, 'warn');
        this.piInitState = 'failed';
        this.diagnosticCategory = 'CATEGORY_A_SDK_MISSING';
        this.lastErrorCode = 'CATEGORY_A_SDK_MISSING';
        this.authLifecycleState = 'FAILED';
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
   * Reset authentication state and clear active locks cleanly
   */
  public resetAuthenticationState(): void {
    this.authAttemptCount++;
    this.lastAuthAttemptId = `reset_${this.authAttemptCount}_${Date.now().toString(36)}`;
    this.piAuthPromise = null;
    this.authLifecycleState = 'IDLE';
    this.authErrorType = null;
    this.diagnosticCategory = null;
    this.nativeBridgeState = 'idle';
    this.authenticationError = null;
    this.lastErrorCode = null;
    this.currentPaymentStage = 'IDLE';
    this.activePaymentInFlight = false;
    this.activePaymentId = null;
    logPiTrace('[Pi SDK] AUTH_RETRY_READY cleared locks and reset lifecycle state for new attempt');
    this.notifyDiagnosticStateChange();
  }

  /**
   * Authenticate Pi User with Canonical Scopes, Controlled Fallback, Generation Guard & 25s Diagnostic Timeout
   */
  public async authenticate(
    scopes: string[] = ['username', 'payments', 'wallet_address'],
    onIncompletePaymentFound?: (payment: PiPayment) => void,
    forceReauth: boolean = false
  ): Promise<PiUser> {
    this.authAttemptCount++;
    const authAttemptId = `auth_${this.authAttemptCount}_${Date.now().toString(36)}`;
    const authStartTime = Date.now();
    this.lastAuthAttemptId = authAttemptId;
    const attemptId = authAttemptId;
    const domainInfo = getDomainDiagnosticInfo();

    // Step 0: Perform lightweight runtime preflight check
    const preflight = getPiRuntimePreflight();

    logPiTrace(
      `[Pi SDK] AUTH_ATTEMPT_START attemptId=${attemptId} isPiBrowser=${preflight.isPiBrowser} originClassification=${domainInfo.classification} sdkInitialized=${this.sdkInitialized} scopes=${JSON.stringify(scopes)}`
    );

    // Fail IMMEDIATELY without waiting 25s if browser environment is external or lacks bridge
    if (!preflight.canAttemptAuth && preflight.category === 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE') {
      this.sdkLoaded = false;
      this.sdkInitialized = false;
      this.authenticated = false;
      this.paymentScopeGranted = false;
      this.authenticatedUser = null;
      this.authLifecycleState = 'FAILED';
      this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
      this.diagnosticCategory = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.lastErrorCode = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.authenticationError = 'Pi Network SDK is unavailable. Please open PiNova in the official Pi Browser.';
      this.currentPaymentStage = 'FAILED';
      this.nativeBridgeState = 'idle';
      logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE reason=SDK_UNAVAILABLE`, 'warn');
      this.notifyDiagnosticStateChange();
      throw new Error(this.authenticationError);
    }

    // Reuse existing valid session if not forced and payment scope is ready
    if (!forceReauth && this.paymentScopeGranted && this.authenticatedUser && this.authenticated) {
      this.authLifecycleState = 'AUTHENTICATED';
      this.diagnosticCategory = null;
      logPiTrace(`[Pi SDK] AUTH_RESPONSE_SUCCESS attemptId=${attemptId} username=${this.authenticatedUser.username} uid=${this.authenticatedUser.uid} (session_cached)`);
      this.notifyDiagnosticStateChange();
      return this.authenticatedUser;
    }

    if (forceReauth) {
      this.piAuthPromise = null;
    }

    // Deduplicate in-flight auth promise (prevents duplicate Pi.authenticate calls on fast taps)
    if (this.piAuthPromise) {
      logPiTrace(`[Pi SDK] AUTH_DEDUPLICATED attemptId=${attemptId} - awaiting active in-flight promise`);
      return this.piAuthPromise;
    }

    this.piAuthPromise = (async () => {
      this.authLifecycleState = 'AUTHENTICATING';
      this.authErrorType = null;
      this.diagnosticCategory = null;
      this.authenticationError = null;
      this.currentPaymentStage = 'AUTHENTICATING';
      this.nativeBridgeState = 'calling_invocation';
      this.notifyDiagnosticStateChange();

      try {
        // Step 1: Ensure SDK is initialized
        const hasSdk = await this.initialize();
        if (!hasSdk || typeof window === 'undefined' || !window.Pi) {
          this.authLifecycleState = 'FAILED';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.diagnosticCategory = 'CATEGORY_A_SDK_MISSING';
          this.piAuthApiState = 'unavailable';
          this.lastErrorCode = 'CATEGORY_A_SDK_MISSING';
          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'idle';
          this.authenticationError = 'Pi Network SDK is unavailable. Please open PiNova in the official Pi Browser.';
          logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_A_SDK_MISSING error=SDK_INIT_FAILED`, 'warn');
          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        if (typeof window.Pi.authenticate !== 'function') {
          this.authLifecycleState = 'FAILED';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.diagnosticCategory = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.piAuthApiState = 'unavailable';
          this.lastErrorCode = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'idle';
          this.authenticationError = 'Pi Network SDK is unavailable. Please open PiNova in the official Pi Browser.';
          logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_B_SDK_NOT_INITIALIZED error=AUTHENTICATE_UNAVAILABLE`, 'warn');
          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        this.piAuthApiState = 'available';
        this.authenticateInvocation = 'called';
        this.authInvocationCount++;
        this.nativeBridgeState = 'calling_invocation';
        this.authLifecycleState = 'AUTHENTICATING';
        this.currentPaymentStage = 'AUTHENTICATING';
        this.notifyDiagnosticStateChange();

        const handleIncomplete = (payment: PiPayment) => {
          logPiTrace(`[Pi SDK] INCOMPLETE_PAYMENT_FOUND attemptId=${attemptId} paymentId=${payment?.identifier}`);
          if (onIncompletePaymentFound) {
            try {
              onIncompletePaymentFound(payment);
            } catch (cbErr) {
              console.error('[Pi SDK] Incomplete payment callback error:', cbErr);
            }
          }
        };

        // Step 2: Invoke window.Pi.authenticate() with canonical scopes and controlled 1-time fallback
        let rawAuthPromise: Promise<any>;
        try {
          rawAuthPromise = window.Pi.authenticate(scopes, handleIncomplete);
          this.nativeBridgeState = 'promise_pending';
          this.notifyDiagnosticStateChange();
          logPiTrace(`[Pi SDK] AUTH_BRIDGE_INVOKED attemptId=${attemptId} nativeBridgeState=promise_pending`);
        } catch (syncErr: any) {
          // If custom scope failed, retry once with canonical minimal payment scopes
          if (scopes.length > 2 || scopes.includes('wallet_address')) {
            try {
              logPiTrace(`[Pi SDK] Scope fallback to ['username', 'payments'] due to bridge rejection: ${syncErr?.message || syncErr}`);
              rawAuthPromise = window.Pi.authenticate(['username', 'payments'], handleIncomplete);
              this.nativeBridgeState = 'promise_pending';
              this.notifyDiagnosticStateChange();
              logPiTrace(`[Pi SDK] AUTH_BRIDGE_INVOKED attemptId=${attemptId} nativeBridgeState=promise_pending fallback=true`);
            } catch (retryErr: any) {
              this.nativeBridgeState = 'call_blocked';
              this.authLifecycleState = 'REJECTED';
              this.authErrorType = 'AUTH_BRIDGE_REJECTED';
              this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
              this.lastErrorCode = 'CATEGORY_E_AUTH_REJECTED';
              this.currentPaymentStage = 'FAILED';
              this.authenticationError = 'Pi Browser rejected the authentication request. Please retry Pi authentication.';
              logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_E_AUTH_REJECTED syncError=${retryErr?.message || retryErr}`, 'warn');
              this.notifyDiagnosticStateChange();
              throw retryErr;
            }
          } else {
            this.nativeBridgeState = 'call_blocked';
            this.authLifecycleState = 'REJECTED';
            this.authErrorType = 'AUTH_BRIDGE_REJECTED';
            this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
            this.lastErrorCode = 'CATEGORY_E_AUTH_REJECTED';
            this.currentPaymentStage = 'FAILED';
            this.authenticationError = 'Pi Browser rejected the authentication request. Please retry Pi authentication.';
            logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_E_AUTH_REJECTED syncError=${syncErr?.message || syncErr}`, 'warn');
            this.notifyDiagnosticStateChange();
            throw syncErr;
          }
        }

        logPiTrace(`[Pi SDK] AUTH_PROMISE_PENDING attemptId=${attemptId}`);

        // Bounded Safe Timeout (25 seconds) with complete diagnostic preservation
        const AUTH_TIMEOUT_MS = 25000;
        let timeoutHandle: any;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutHandle = setTimeout(() => {
            const elapsed = Date.now() - authStartTime;
            const timeoutContext = {
              attemptId,
              piObjectAvailable: typeof window !== 'undefined' && Boolean(window.Pi),
              sdkInitialized: this.sdkInitialized,
              userAgentDetected: typeof navigator !== 'undefined' ? /PiBrowser|minepi/i.test(navigator.userAgent) : false,
              piBrowserDetected: isPiBrowser(),
              currentOrigin: domainInfo.currentOrigin,
              configuredAppDomain: this.configuredAppUrl,
              originClassification: domainInfo.classification,
              authenticationStartedAt: new Date(authStartTime).toISOString(),
              elapsedMs: elapsed,
              nativeBridgeState: this.nativeBridgeState
            };

            const timeoutErr = new Error(
              'Pi Browser did not respond to the authentication request within 25 seconds. Please make sure PiNova is open in Pi Browser and tap Retry Pi Authentication.'
            );
            (timeoutErr as any).code = 'AUTH_TIMEOUT';
            (timeoutErr as any).diagnosticContext = timeoutContext;
            reject(timeoutErr);
          }, AUTH_TIMEOUT_MS);
        });

        const auth: any = await Promise.race([rawAuthPromise, timeoutPromise]).finally(() => {
          clearTimeout(timeoutHandle);
        });

        // Generation Guard: If this attempt was superseded by a newer Retry attempt, ignore result
        if (this.lastAuthAttemptId !== attemptId) {
          logPiTrace(`[Pi SDK] AUTH_RESPONSE_IGNORED attemptId=${attemptId} - superseded by ${this.lastAuthAttemptId}`);
          return this.authenticatedUser || auth;
        }

        this.nativeBridgeState = 'promise_resolved';

        if (auth && auth.user && auth.accessToken && auth.user.uid && auth.user.username) {
          this.authenticated = true;
          this.paymentScopeGranted = true;
          this.authLifecycleState = 'AUTHENTICATED';
          this.authErrorType = null;
          this.diagnosticCategory = null;
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

          logPiTrace(`[Pi SDK] AUTH_RESPONSE_SUCCESS attemptId=${attemptId} username=${auth.user.username} uid=${auth.user.uid} elapsedMs=${Date.now() - authStartTime}`);
          this.notifyDiagnosticStateChange();
          return this.authenticatedUser;
        } else {
          this.authLifecycleState = 'REJECTED';
          this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
          logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_E_AUTH_REJECTED error=MISSING_CREDENTIALS`, 'warn');
          throw new Error('Pi Browser rejected the authentication request. Please retry Pi authentication.');
        }
      } catch (err: any) {
        if (this.lastAuthAttemptId !== attemptId) {
          logPiTrace(`[Pi SDK] AUTH_ERROR_IGNORED attemptId=${attemptId} - superseded by ${this.lastAuthAttemptId}`);
          return;
        }

        if ((this.nativeBridgeState as string) !== 'call_blocked') {
          this.nativeBridgeState = 'promise_rejected';
        }
        this.authenticated = false;
        this.paymentScopeGranted = false;
        this.authenticatedUser = null;

        let rawMsg = '';
        if (typeof err === 'string') {
          rawMsg = err;
        } else if (err && typeof err === 'object') {
          rawMsg = err.message || err.error || err.description || JSON.stringify(err);
        }

        const isTimeout =
          err?.code === 'AUTH_TIMEOUT' ||
          rawMsg.includes('did not respond') ||
          rawMsg.includes('within 25 seconds') ||
          rawMsg.includes('timed out');
        const isCancelled =
          rawMsg.toLowerCase().includes('cancel') ||
          rawMsg.toLowerCase().includes('denied') ||
          rawMsg.toLowerCase().includes('dismiss') ||
          rawMsg.toLowerCase().includes('user_cancelled');
        const isUnavailable =
          rawMsg === 'PI_SDK_NOT_AVAILABLE' ||
          rawMsg.includes('external browser') ||
          rawMsg.includes('official Pi Browser') ||
          rawMsg.includes('unavailable');

        if (isTimeout) {
          this.authLifecycleState = 'TIMEOUT';
          this.authErrorType = 'AUTH_BRIDGE_TIMEOUT';
          this.diagnosticCategory = 'CATEGORY_D_AUTH_NO_RESPONSE';
          this.lastErrorCode = 'CATEGORY_D_AUTH_NO_RESPONSE';
          this.currentPaymentStage = 'TIMEOUT';
          this.authenticationError =
            'Pi Browser did not respond to the authentication request within 25 seconds. Please make sure PiNova is open in Pi Browser and tap Retry Pi Authentication.';
          logPiTrace(`[Pi SDK] AUTH_TIMEOUT attemptId=${attemptId} category=CATEGORY_D_AUTH_NO_RESPONSE elapsedMs=${Date.now() - authStartTime} nativeBridgeState=${this.nativeBridgeState}`, 'warn');
        } else if (isCancelled) {
          this.authLifecycleState = 'REJECTED';
          this.authErrorType = 'AUTH_USER_CANCELLED';
          this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
          this.lastErrorCode = 'CATEGORY_E_AUTH_REJECTED';
          this.currentPaymentStage = 'CANCELLED';
          this.authenticationError = 'Pi authentication was cancelled. No Pi payment was created.';
          logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_E_AUTH_REJECTED reason=USER_CANCELLED`, 'warn');
        } else if (isUnavailable) {
          this.authLifecycleState = 'FAILED';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.diagnosticCategory = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
          this.lastErrorCode = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError =
            'Pi Network SDK is unavailable. Please open PiNova in the official Pi Browser.';
          logPiTrace(`[Pi SDK] AUTH_ERROR attemptId=${attemptId} category=CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE error=SDK_UNAVAILABLE`, 'warn');
        } else {
          this.authLifecycleState = 'FAILED';
          this.authErrorType = 'AUTH_BRIDGE_REJECTED';
          this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
          this.lastErrorCode = 'CATEGORY_E_AUTH_REJECTED';
          this.currentPaymentStage = 'FAILED';
          this.authenticationError = 'Pi Browser rejected the authentication request. Please retry Pi authentication.';
          logPiTrace(`[Pi SDK] AUTH_REJECTED attemptId=${attemptId} category=CATEGORY_E_AUTH_REJECTED error=${rawMsg}`, 'warn');
        }

        this.notifyDiagnosticStateChange();
        throw new Error(this.authenticationError);
      } finally {
        if (this.lastAuthAttemptId === attemptId) {
          this.piAuthPromise = null;
        }
        this.notifyDiagnosticStateChange();
      }
    })();

    return this.piAuthPromise;
  }

  /**
   * Explicit separate authentication flow for features requiring wallet_address scope
   */
  public async authenticateWithWalletAddress(
    onIncompletePaymentFound?: (payment: PiPayment) => void
  ): Promise<PiUser> {
    return this.authenticate(['username', 'payments', 'wallet_address'], onIncompletePaymentFound, true);
  }

  /**
   * Execute Pi Payment with Bridge Response Hard Timeout (25s), Strict Concurrency Protection & Callbacks
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
      this.diagnosticCategory = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.notifyDiagnosticStateChange();
      updateStatus('Official Pi Browser required');
      logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=NON_PI_BROWSER`, 'warn');
      callbacks.onError(new Error('Please open PiNova Global Hub in the official Pi Browser to authenticate and pay with Pi.'));
      return;
    }

    const envConfig = getPiNetworkConfig();
    if (envConfig.hasConflict) {
      this.currentPaymentStage = 'FAILED';
      this.lastErrorCode = 'INVALID_NETWORK_CONFIG';
      this.notifyDiagnosticStateChange();
      logPiTrace(`[Pi SDK] PAYMENT_BLOCKED reqId=${reqId} error=CONFLICTING_ENVIRONMENT_VARIABLES`, 'error');
      callbacks.onError(new Error(envConfig.conflictWarning || 'Invalid Pi Network Configuration: Conflicting environment variables detected. Payment blocked until resolved.'));
      return;
    }

    if (this.activePaymentInFlight) {
      logPiTrace(`[Pi SDK] PAYMENT_ERROR reqId=${reqId} error=CONCURRENT_PAYMENT_BLOCKED`, 'warn');
      callbacks.onError(new Error('A Pi payment request is already active. Please complete or cancel the current request.'));
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
        // Step 1: Ensure payment scope is ready (no double authenticate if already granted)
        if (!this.paymentScopeGranted || !this.authenticatedUser || !this.authenticated) {
          this.currentPaymentStage = 'AUTHENTICATING';
          this.notifyDiagnosticStateChange();
          updateStatus('Connecting Pi Network Wallet…');

          await this.authenticate(['username', 'payments'], callbacks.onIncompletePaymentFound, false);

          if (!this.paymentScopeGranted || !this.authenticatedUser) {
            this.currentPaymentStage = 'FAILED';
            this.lastErrorCode = 'PI_AUTH_REQUIRED';
            this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
            this.notifyDiagnosticStateChange();
            throw new Error('Pi authentication is required before payment. Permissions were not granted.');
          }
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
            this.diagnosticCategory = 'CATEGORY_F_PAYMENT_CREATION_FAILED';
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

              // Set a generous timer for user blockchain signing
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
              this.diagnosticCategory = 'CATEGORY_G_PAYMENT_APPROVAL_FAILED';
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
              this.diagnosticCategory = null;
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
              this.diagnosticCategory = 'CATEGORY_H_PAYMENT_COMPLETION_FAILED';
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
            this.diagnosticCategory = 'CATEGORY_F_PAYMENT_CREATION_FAILED';
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
          this.diagnosticCategory = 'CATEGORY_F_PAYMENT_CREATION_FAILED';
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
      this.diagnosticCategory = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.notifyDiagnosticStateChange();
      if (params.onStatusUpdate) params.onStatusUpdate('Pi Browser required');
      return {
        success: false,
        message: 'Please open PiNova Global Hub in the official Pi Browser to authenticate and pay with Pi.',
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
            // CRITICAL: For FLIGHT_TICKET, Pi payment verification returns FULFILLMENT_PENDING
            // until the Duffel/carrier booking has actually been created and confirmed!
            if (params.metadata?.serviceType === 'FLIGHT_TICKET') {
              this.currentPaymentStage = 'COMPLETED';
              this.notifyDiagnosticStateChange();
              resolve({
                success: true,
                paymentId,
                txid,
                fulfillmentStatus: 'FULFILLMENT_PENDING',
                message: 'Pi payment verified on Pi ledger. Ready for flight booking creation.'
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
  forceReauth: boolean = false,
  scopes: string[] = ['username', 'payments', 'wallet_address']
): Promise<PiUser> {
  return PiSdkManager.authenticate(scopes, onIncompletePaymentFound, forceReauth);
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

export function fetchApiConfiguration(): Promise<'configured' | 'missing'> {
  return PiSdkManager.fetchApiConfiguration();
}

export async function initAndAuthenticateProactively(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser | null> {
  const inPi = isPiBrowser();
  if (!inPi || isExternalBrowserNonPi()) return null;

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
    return await PiSdkManager.authenticate(['username', 'payments', 'wallet_address'], onIncompletePaymentFound, false);
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
    throw new Error('Please open PiNova Global Hub in the official Pi Browser to authenticate and pay with Pi.');
  }

  const ready = await PiSdkManager.initialize();
  if (!ready) {
    throw new Error('Pi Network SDK could not be initialized. Please verify the Pi App domain configuration.');
  }

  const user = await PiSdkManager.authenticate(['username', 'payments', 'wallet_address'], onIncompletePaymentFound, false);
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
