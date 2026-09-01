import { PiUser } from '../types';
import { safeFetchJson } from './safeFetch';

/* =========================================================
 * Pi Network SDK v2 — PiNova Global Hub
 * Production origin: https://iddsnn.com
 * ========================================================= */

declare global {
  interface Window {
    Pi?: {
      init: (config: {
        version: string;
        sandbox?: boolean;
      }) => void;

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
    __PI_SDK_MANAGER__?: PiSdkManagerService;
    PiNative?: any;
    __PI_NATIVE__?: any;
    ReactNativeWebView?: any;
  }
}

/* =========================================================
 * Types
 * ========================================================= */

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

/* =========================================================
 * State
 * ========================================================= */

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
  | 'CATEGORY_E_AUTH_SCOPE_COMPATIBILITY'
  | 'CATEGORY_F_PAYMENT_CREATION_FAILED'
  | 'CATEGORY_G_PAYMENT_APPROVAL_FAILED'
  | 'CATEGORY_H_PAYMENT_COMPLETION_FAILED'
  | 'ENVIRONMENT_CONFIGURATION_INVALID';

/* =========================================================
 * Diagnostic contracts
 * ========================================================= */

export type PiNetworkEnvironment = 'SANDBOX' | 'MAINNET';

export interface PiEnvironmentDetails {
  network: PiNetworkEnvironment;
  sandbox: boolean;
  source:
    | 'LOCAL_STORAGE_OVERRIDE'
    | 'URL_OVERRIDE'
    | 'VITE_PI_ENV'
    | 'VITE_PI_SANDBOX'
    | 'OFFICIAL_REGISTERED_DOMAIN'
    | 'DEVELOPMENT_FALLBACK'
    | 'DEFAULT_FALLBACK';
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
  source: PiEnvironmentDetails['source'];
  hasConflict: boolean;
  conflictWarning?: string;
  configuredEnv?: string;
  configuredSandbox?: string;
  environmentConsistency: 'CONSISTENT' | 'INVALID';
  configuredNetwork: PiNetworkEnvironment;
  effectiveSandbox: boolean;
  environmentSource: string;
}

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

export interface PiBridgeEventTelemetry {
  id: string;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND';
  origin: string;
  sourceWindow: 'SELF' | 'PARENT' | 'TOP' | 'OTHER';
  eventType: string;
  payloadCategory: string;
  elapsedMs: number;
}

export interface SdkScriptTelemetry {
  scriptFound: boolean;
  scriptSrc: string | null;
  scriptCount: number;
  scriptReadyState: string;
  scriptLoadEventFired: boolean;
}

export interface InitLifecycleTelemetry {
  initCount: number;
  initTimestamp: string | null;
  initSandbox: boolean | null;
  initVersion: string;
  initOrigin: string;
  documentVisibilityState: string;
  pageLifecycleState: string;
}

export interface NativeBridgeReadinessTelemetry {
  jsSdkAvailable: boolean;
  sdkInitialized: boolean;
  piBrowserDetected: boolean;
  bridgeCallable: boolean;
  bridgeResponding:
    | 'responding'
    | 'timed_out'
    | 'pending'
    | 'untested';
}

export interface PiSdkDiagnosticState {
  sdkScriptState: 'loaded' | 'not_loaded';
  piInitState:
    | 'success'
    | 'failed'
    | 'not_called'
    | 'initializing';

  piAuthApiState: 'available' | 'unavailable';

  authenticateInvocation: 'called' | 'not_called';
  authenticateInvocationCount: number;

  authAttemptId: string | null;
  activeAuthRequest: boolean;
  hasActiveAuthPromise: boolean;

  nativeBridgeState: NativeBridgeState;

  authScopesRequested: string[];
  authInvocationCount: number;

  authPromiseState:
    | 'idle'
    | 'pending'
    | 'resolved'
    | 'rejected'
    | 'timed_out';

  authTimeout: number;

  authResolutionTimeMs: number | null;
  authRejectionTimeMs: number | null;

  standardScopesResult:
    | 'resolved'
    | 'timed_out'
    | 'rejected'
    | null;

  fullScopesResult:
    | 'resolved'
    | 'timed_out'
    | 'rejected'
    | null;

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
  sdkInitTimestamp?: string | null;

  sdkLoadingTelemetry?: SdkScriptTelemetry;
  initLifecycleTelemetry?: InitLifecycleTelemetry;
  bridgeReadinessTelemetry?: NativeBridgeReadinessTelemetry;

  bridgeEvents?: PiBridgeEventTelemetry[];

  piAuthenticationState:
    | 'success'
    | 'pending'
    | 'failed';

  paymentScopeState:
    | 'granted'
    | 'not_granted';

  apiConfiguration:
    | 'configured'
    | 'missing';

  buildCommit: string;

  sdkState:
    | 'not_loaded'
    | 'loaded'
    | 'initializing'
    | 'ready';

  authState: PiAuthState;

  authErrorType: PiAuthErrorType;

  diagnosticCategory?: PiDiagnosticCategory | null;

  paymentScope:
    | 'granted'
    | 'not_granted';

  userState:
    | 'authenticated'
    | 'not_authenticated';

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

  originClassification?:
    | 'OFFICIAL_REGISTERED_DOMAIN'
    | 'VERCEL_PREVIEW_ORIGIN'
    | 'LOCAL_DEV_ORIGIN'
    | 'OTHER_ORIGIN';

  runtimeCheck?: {
    hasPi: boolean;
    initType: string;
    authType: string;
    createPaymentType: string;
  };

  currentOrigin?: string;
  isIframe?: boolean;
}

/* =========================================================
 * Diagnostics log
 * ========================================================= */

const diagnosticLogBuffer: {
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error';
}[] = [];

type LogListener = (
  logs: {
    timestamp: string;
    message: string;
    type: 'info' | 'warn' | 'error';
  }[]
) => void;

const logListeners = new Set<LogListener>();

export function logPiTrace(
  message: string,
  type: 'info' | 'warn' | 'error' = 'info'
): void {
  const timestamp = new Date().toISOString();

  if (type === 'error') {
    console.error(message);
  } else if (type === 'warn') {
    console.warn(message);
  } else {
    console.log(message);
  }

  diagnosticLogBuffer.push({
    timestamp,
    message,
    type
  });

  if (diagnosticLogBuffer.length > 250) {
    diagnosticLogBuffer.shift();
  }

  logListeners.forEach((listener) => {
    try {
      listener([...diagnosticLogBuffer]);
    } catch {
      // Ignore listener failures.
    }
  });
}

export function getPiDiagnosticLogs() {
  return [...diagnosticLogBuffer];
}

export function subscribePiDiagnosticLogs(
  listener: LogListener
): () => void {
  logListeners.add(listener);

  listener([...diagnosticLogBuffer]);

  return () => {
    logListeners.delete(listener);
  };
}

function generateReqId(prefix = 'pi'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

/* =========================================================
 * Domain
 * ========================================================= */

export function getDomainDiagnosticInfo() {
  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://iddsnn.com';

  const currentHostname =
    typeof window !== 'undefined'
      ? window.location.hostname
      : 'iddsnn.com';

  const expectedProductionOrigin =
    'https://iddsnn.com';

  const isOfficialDomain =
    currentHostname === 'iddsnn.com' ||
    currentHostname.endsWith('.iddsnn.com');

  const isVercelOrigin =
    currentHostname.includes('vercel.app');

  let classification:
    | 'OFFICIAL_REGISTERED_DOMAIN'
    | 'VERCEL_PREVIEW_ORIGIN'
    | 'LOCAL_DEV_ORIGIN'
    | 'OTHER_ORIGIN';

  if (isOfficialDomain) {
    classification = 'OFFICIAL_REGISTERED_DOMAIN';
  } else if (isVercelOrigin) {
    classification = 'VERCEL_PREVIEW_ORIGIN';
  } else if (
    currentHostname === 'localhost' ||
    currentHostname === '127.0.0.1' ||
    currentHostname.includes('ais-dev-')
  ) {
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

/* =========================================================
 * Environment
 * ========================================================= */

export function getPiEnvironmentDetails(): PiEnvironmentDetails {
  const domainInfo =
    getDomainDiagnosticInfo();

  const isOfficialDomain =
    domainInfo.matchesExpectedDomain ||
    domainInfo.classification ===
      'OFFICIAL_REGISTERED_DOMAIN';

  if (typeof window === 'undefined') {
    return {
      network: isOfficialDomain ? 'MAINNET' : 'SANDBOX',
      sandbox: !isOfficialDomain,
      source: isOfficialDomain ? 'OFFICIAL_REGISTERED_DOMAIN' : 'DEFAULT_FALLBACK',
      hasConflict: false,
      environmentConsistency: 'CONSISTENT',
      configuredNetwork: isOfficialDomain ? 'MAINNET' : 'SANDBOX',
      effectiveSandbox: !isOfficialDomain,
      environmentSource: isOfficialDomain ? 'OFFICIAL_REGISTERED_DOMAIN' : 'DEFAULT_FALLBACK'
    };
  }

  // 1. Explicit Local Storage Override (allows manual test toggle from Diagnostic UI)
  try {
    const override = localStorage.getItem(
      'pi_sandbox_override'
    );

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

  // 2. Explicit URL Query Parameter Override (for testing and direct browser debugging)
  const search =
    typeof window !== 'undefined'
      ? window.location.search || ''
      : '';

  if (
    /(?:[?&])(sandbox=true|sandbox=1|env=sandbox|env=testnet)(?:&|$)/i.test(
      search
    )
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
    /(?:[?&])(sandbox=false|sandbox=0|env=mainnet|env=production)(?:&|$)/i.test(
      search
    )
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

  // 3. Build & Runtime Environment Variables
  const metaEnv = (import.meta as any).env || {};

  const rawEnv =
    metaEnv.VITE_PI_ENV !== undefined
      ? String(metaEnv.VITE_PI_ENV)
          .trim()
          .toLowerCase()
      : '';

  const rawSandbox =
    metaEnv.VITE_PI_SANDBOX !== undefined
      ? String(metaEnv.VITE_PI_SANDBOX)
          .trim()
          .toLowerCase()
      : '';

  const envWantsMainnet =
    rawEnv === 'mainnet' ||
    rawEnv === 'production';

  const envWantsSandbox =
    rawEnv === 'sandbox' ||
    rawEnv === 'testnet';

  const sandboxWantsMainnet =
    rawSandbox === 'false' ||
    rawSandbox === '0';

  const sandboxWantsSandbox =
    rawSandbox === 'true' ||
    rawSandbox === '1';

  let hasConflict = false;
  let conflictWarning: string | undefined;

  if (
    rawEnv &&
    rawSandbox &&
    (
      (envWantsMainnet && sandboxWantsSandbox) ||
      (envWantsSandbox && sandboxWantsMainnet)
    )
  ) {
    hasConflict = true;

    conflictWarning =
      `Conflicting Pi environment variables detected ` +
      `(VITE_PI_ENV="${metaEnv.VITE_PI_ENV}", ` +
      `VITE_PI_SANDBOX="${metaEnv.VITE_PI_SANDBOX}"). ` +
      `Configuration is INVALID and payments are blocked ` +
      `until consistent.`;
  }

  const consistency =
    hasConflict
      ? 'INVALID'
      : 'CONSISTENT';

  // Explicit Mainnet configured via environment
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
      environmentSource:
        `VITE_PI_ENV=${metaEnv.VITE_PI_ENV}`
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
      environmentSource:
        `VITE_PI_SANDBOX=${metaEnv.VITE_PI_SANDBOX}`
    };
  }

  // 4. Official Registered Production Domain Resolution
  // On https://iddsnn.com, the Pi Developer Portal registration is authoritative:
  // Production domain defaults to MAINNET unless overridden via URL/LocalStorage for debugging.
  if (isOfficialDomain) {
    return {
      network: 'MAINNET',
      sandbox: false,
      source: 'OFFICIAL_REGISTERED_DOMAIN',
      configuredEnv: metaEnv.VITE_PI_ENV,
      configuredSandbox: metaEnv.VITE_PI_SANDBOX,
      hasConflict: false,
      environmentConsistency: 'CONSISTENT',
      configuredNetwork: 'MAINNET',
      effectiveSandbox: false,
      environmentSource: 'OFFICIAL_REGISTERED_DOMAIN (iddsnn.com)'
    };
  }

  // 5. Non-Production Development Environment Resolution
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
      environmentSource:
        `VITE_PI_ENV=${metaEnv.VITE_PI_ENV}`
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
      environmentSource:
        `VITE_PI_SANDBOX=${metaEnv.VITE_PI_SANDBOX}`
    };
  }

  return {
    network: 'SANDBOX',
    sandbox: true,
    source: 'DEVELOPMENT_FALLBACK',
    hasConflict: false,
    environmentConsistency: 'CONSISTENT',
    configuredNetwork: 'SANDBOX',
    effectiveSandbox: true,
    environmentSource: 'DEVELOPMENT_FALLBACK'
  };
}

export function getPiNetworkConfig(): PiNetworkConfig {
  const details =
    getPiEnvironmentDetails();

  return {
    environment:
      details.sandbox
        ? 'sandbox'
        : 'mainnet',

    network: details.network,
    sandbox: details.sandbox,
    source: details.source,

    hasConflict:
      details.hasConflict,

    conflictWarning:
      details.conflictWarning,

    configuredEnv:
      details.configuredEnv,

    configuredSandbox:
      details.configuredSandbox,

    environmentConsistency:
      details.environmentConsistency,

    configuredNetwork:
      details.configuredNetwork,

    effectiveSandbox:
      details.effectiveSandbox,

    environmentSource:
      details.environmentSource
  };
}

export function getPiNetworkEnvironment(): PiNetworkEnvironment {
  return getPiEnvironmentDetails().network;
}

export function isSandboxMode(): boolean {
  return getPiEnvironmentDetails().sandbox;
}

export function clearCustomSandboxOverride(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(
      'pi_sandbox_override'
    );
  } catch {
    // Ignore.
  }
}

export function getSafeRuntimeContext() {
  const domainInfo =
    getDomainDiagnosticInfo();

  const origin =
    domainInfo.currentOrigin;

  const hostname =
    domainInfo.currentHostname;

  const protocol =
    typeof window !== 'undefined'
      ? window.location.protocol
      : 'https:';

  const sdkAvailable =
    typeof window !== 'undefined' &&
    Boolean(window.Pi);

  const envDetails =
    getPiEnvironmentDetails();

  return {
    origin,
    hostname,
    protocol,
    sdkAvailable,
    environment: envDetails.network,
    domainInfo,
    envDetails
  };
}

/* =========================================================
 * Pi Browser detection
 * ========================================================= */

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent =
    navigator.userAgent || '';

  const isPiUa =
    /PiBrowser|minepi/i.test(
      userAgent
    );

  const hasPiNative =
    Boolean(
      (window as any).PiNative ||
      (window as any).__PI_NATIVE__ ||
      (window as any).ReactNativeWebView ||
      (window as any).webkit
        ?.messageHandlers
        ?.piBrowser
    );

  const hasUrlParam =
    /pi_browser=1|pi_browser=true|env=pi/i.test(
      window.location.search
    );

  let embeddedInPi = false;

  try {
    if (window.self !== window.top) {
      const referrer =
        document.referrer || '';

      if (
        /minepi\.com|pinetwork/i.test(
          referrer
        )
      ) {
        embeddedInPi = true;
      }
    }
  } catch {
    // Do not assume Pi Browser.
  }

  return (
    isPiUa ||
    hasPiNative ||
    hasUrlParam ||
    embeddedInPi
  );
}

export function isExternalBrowserNonPi(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent =
    navigator.userAgent || '';

  const inPi =
    isPiBrowser();

  const hasBridge =
    Boolean(
      (window as any).PiNative ||
      (window as any).__PI_NATIVE__ ||
      (window as any).ReactNativeWebView ||
      (window as any).webkit
        ?.messageHandlers
        ?.piBrowser
    );

  const standardBrowser =
    /Chrome|Safari|Firefox|Edge/i.test(
      userAgent
    ) &&
    !/PiBrowser|minepi/i.test(
      userAgent
    );

  return (
    !inPi &&
    !hasBridge &&
    standardBrowser
  );
}

/* =========================================================
 * Runtime preflight
 * ========================================================= */

export function getPiRuntimePreflight(): PiRuntimePreflightResult {
  const hasPiSdk =
    typeof window !== 'undefined' &&
    Boolean(window.Pi);

  const hasAuthenticate =
    hasPiSdk &&
    typeof window.Pi?.authenticate ===
      'function';

  const hasCreatePayment =
    hasPiSdk &&
    typeof window.Pi?.createPayment ===
      'function';

  const userAgent =
    typeof navigator !== 'undefined'
      ? navigator.userAgent || ''
      : '';

  const isPiUserAgent =
    /PiBrowser|minepi/i.test(
      userAgent
    );

  const hasNativeBridge =
    typeof window !== 'undefined' &&
    Boolean(
      (window as any).PiNative ||
      (window as any).__PI_NATIVE__ ||
      (window as any).ReactNativeWebView ||
      (window as any).webkit
        ?.messageHandlers
        ?.piBrowser
    );

  const inPiBrowser =
    isPiBrowser();

  const domainInfo =
    getDomainDiagnosticInfo();

  const isRegisteredProductionDomain =
    domainInfo.matchesExpectedDomain;

  const isOfficialDomain =
    domainInfo.matchesExpectedDomain;

  const currentOrigin =
    domainInfo.currentOrigin;

  const expectedProductionOrigin =
    domainInfo.expectedProductionOrigin;

  const originMatches =
    currentOrigin === expectedProductionOrigin ||
    domainInfo.classification ===
      'OFFICIAL_REGISTERED_DOMAIN';

  const isExternal =
    isExternalBrowserNonPi();

  let canAttemptAuth = true;
  let failReason: string | undefined;
  let category:
    | PiDiagnosticCategory
    | undefined;

  if (
    isExternal ||
    (
      !inPiBrowser &&
      !hasNativeBridge &&
      !isPiUserAgent
    )
  ) {
    canAttemptAuth = false;

    failReason =
      'Please open PiNova Global Hub in the official Pi Browser to authenticate and pay with Pi.';

    category =
      'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
  } else if (!hasPiSdk) {
    canAttemptAuth = false;

    failReason =
      'Pi SDK script is not available in window.Pi.';

    category =
      'CATEGORY_A_SDK_MISSING';
  } else if (!hasAuthenticate) {
    canAttemptAuth = false;

    failReason =
      'Pi.authenticate method is unavailable on window.Pi.';

    category =
      'CATEGORY_B_SDK_NOT_INITIALIZED';
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
    initialized:
      hasPiSdk &&
      PiSdkManager.isReady(),
    canAttemptAuth,
    failReason,
    category
  };
}

/* =========================================================
 * Pi SDK Manager
 * ========================================================= */

export class PiSdkManagerService {
  private sdkLoaded = false;

  private sdkInitialized = false;

  private sdkInitNetwork:
    PiNetworkEnvironment | null = null;

  private sdkInitSandbox:
    boolean | null = null;

  private sdkInitializationCount = 0;

  private piInitState:
    | 'success'
    | 'failed'
    | 'not_called'
    | 'initializing' =
    'not_called';

  private piAuthApiState:
    | 'available'
    | 'unavailable' =
    'unavailable';

  private authenticateInvocation:
    | 'called'
    | 'not_called' =
    'not_called';

  private authInvocationCount = 0;

  private authAttemptCount = 0;

  private lastAuthAttemptId:
    string | null = null;

  private nativeBridgeState:
    NativeBridgeState = 'idle';

  private authScopesRequested:
    string[] = [
      'username',
      'payments'
    ];

  private authPromiseState:
    | 'idle'
    | 'pending'
    | 'resolved'
    | 'rejected'
    | 'timed_out' =
    'idle';

  private readonly authTimeout =
    25000;

  private authResolutionTimeMs:
    number | null = null;

  private authRejectionTimeMs:
    number | null = null;

  private standardScopesResult:
    | 'resolved'
    | 'timed_out'
    | 'rejected'
    | null = null;

  private fullScopesResult:
    | 'resolved'
    | 'timed_out'
    | 'rejected'
    | null = null;

  private authLifecycleState:
    PiAuthState = 'IDLE';

  private authErrorType:
    PiAuthErrorType = null;

  private diagnosticCategory:
    PiDiagnosticCategory | null = null;

  private authenticated = false;

  private paymentScopeGranted = false;

  private authenticatedUser:
    PiUser | null = null;

  private authenticationError:
    string | null = null;

  private apiConfigState:
    'configured' | 'missing' =
    'configured';

  private currentPaymentStage:
    PiPaymentStage = 'IDLE';

  private lastErrorCode:
    string | null = null;

  private configuredAppUrl =
    'https://iddsnn.com';

  private readonly expectedProductionOrigin =
    'https://iddsnn.com';

  private piInitPromise:
    Promise<boolean> | null = null;

  private piAuthPromise:
    Promise<PiUser> | null = null;

  private activePaymentId:
    string | null = null;

  private activePaymentInFlight = false;

  private sdkInitTimestamp:
    string | null = null;

  private scriptLoadEventFired = false;

  private bridgeEvents:
    PiBridgeEventTelemetry[] = [];

  private diagnosticListeners =
    new Set<
      (state: PiSdkDiagnosticState) => void
    >();

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.__PI_SDK_MANAGER__ = this;

    if (
      document.readyState ===
      'complete'
    ) {
      this.scriptLoadEventFired = true;
    } else {
      window.addEventListener(
        'load',
        () => {
          this.scriptLoadEventFired = true;
          this.notifyDiagnosticStateChange();
        },
        { once: true }
      );
    }

    window.addEventListener(
      'message',
      (event) => {
        try {
          const origin =
            event.origin || 'unknown';

          let eventType = 'unknown';
          let payloadCategory =
            'non_object';

          if (
            typeof event.data ===
            'string'
          ) {
            try {
              const parsed =
                JSON.parse(event.data);

              eventType =
                parsed.type ||
                parsed.action ||
                parsed.event ||
                'json_payload';

              payloadCategory =
                'structured_json';
            } catch {
              eventType =
                event.data.slice(
                  0,
                  30
                );

              payloadCategory =
                'plain_string';
            }
          } else if (
            event.data &&
            typeof event.data ===
              'object'
          ) {
            eventType =
              event.data.type ||
              event.data.action ||
              event.data.event ||
              (
                Object.keys(
                  event.data
                ).join(',') ||
                'empty_obj'
              );

            payloadCategory =
              event.data.type
                ? 'structured_pi_event'
                : 'generic_obj';
          }

          let sourceWindow:
            | 'SELF'
            | 'PARENT'
            | 'TOP'
            | 'OTHER' =
            'OTHER';

          if (
            event.source ===
            window
          ) {
            sourceWindow = 'SELF';
          } else if (
            event.source ===
            window.parent
          ) {
            sourceWindow = 'PARENT';
          } else if (
            event.source ===
            window.top
          ) {
            sourceWindow = 'TOP';
          }

          this.recordBridgeEvent({
            direction: 'INBOUND',
            origin,
            sourceWindow,
            eventType,
            payloadCategory
          });
        } catch {
          // Passive diagnostics only.
        }
      },
      { passive: true }
    );
  }

  public recordBridgeEvent(
    event: Omit<
      PiBridgeEventTelemetry,
      'id' | 'timestamp' | 'elapsedMs'
    >
  ): void {
    const entry: PiBridgeEventTelemetry = {
      ...event,
      id: generateReqId('bridge'),
      timestamp:
        new Date().toISOString(),
      elapsedMs: 0
    };

    this.bridgeEvents.unshift(entry);

    if (
      this.bridgeEvents.length > 30
    ) {
      this.bridgeEvents.pop();
    }

    logPiTrace(
      `[Pi BRIDGE] MESSAGE_RECEIVED origin=${event.origin} source=${event.sourceWindow} type=${event.eventType} category=${event.payloadCategory}`
    );

    this.notifyDiagnosticStateChange();
  }

  public getScriptTelemetry(): SdkScriptTelemetry {
    if (
      typeof document ===
      'undefined'
    ) {
      return {
        scriptFound: false,
        scriptSrc: null,
        scriptCount: 0,
        scriptReadyState: 'unknown',
        scriptLoadEventFired: false
      };
    }

    const scripts =
      Array.from(
        document.querySelectorAll(
          'script[src*="pi-sdk"]'
        )
      );

    const found =
      scripts.length > 0 ||
      Boolean(
        typeof window !==
          'undefined' &&
          window.Pi
      );

    return {
      scriptFound: found,

      scriptSrc:
        scripts[0]?.getAttribute(
          'src'
        ) ||
        (
          found
            ? 'https://sdk.minepi.com/pi-sdk.js'
            : null
        ),

      scriptCount:
        scripts.length,

      scriptReadyState:
        document.readyState,

      scriptLoadEventFired:
        this.scriptLoadEventFired ||
        document.readyState ===
          'complete'
    };
  }

  public getInitLifecycleTelemetry(): InitLifecycleTelemetry {
    const domainInfo =
      getDomainDiagnosticInfo();

    return {
      initCount:
        this.sdkInitializationCount,

      initTimestamp:
        this.sdkInitTimestamp,

      initSandbox:
        this.sdkInitSandbox,

      initVersion: '2.0',

      initOrigin:
        domainInfo.currentOrigin,

      documentVisibilityState:
        typeof document !==
        'undefined'
          ? document.visibilityState
          : 'unknown',

      pageLifecycleState:
        typeof document !==
          'undefined' &&
        document.hidden
          ? 'hidden'
          : 'active'
    };
  }

  public getBridgeReadinessTelemetry(): NativeBridgeReadinessTelemetry {
    const hasPi =
      typeof window !==
        'undefined' &&
      Boolean(window.Pi);

    const initialized =
      this.sdkInitialized &&
      hasPi;

    let responding:
      | 'responding'
      | 'timed_out'
      | 'pending'
      | 'untested' =
      'untested';

    if (
      this.authPromiseState ===
      'resolved'
    ) {
      responding = 'responding';
    } else if (
      this.authPromiseState ===
      'timed_out'
    ) {
      responding = 'timed_out';
    } else if (
      this.authPromiseState ===
      'pending'
    ) {
      responding = 'pending';
    } else if (
      this.authPromiseState ===
      'rejected'
    ) {
      responding = 'responding';
    }

    return {
      jsSdkAvailable: hasPi,
      sdkInitialized: initialized,
      piBrowserDetected:
        isPiBrowser(),

      bridgeCallable:
        hasPi &&
        typeof window.Pi
          ?.authenticate ===
          'function',

      bridgeResponding: responding
    };
  }

  public subscribeDiagnostic(
    listener: (
      state: PiSdkDiagnosticState
    ) => void
  ): () => void {
    this.diagnosticListeners.add(
      listener
    );

    listener(
      this.getDiagnosticState()
    );

    return () => {
      this.diagnosticListeners.delete(
        listener
      );
    };
  }

  private notifyDiagnosticStateChange(): void {
    const state =
      this.getDiagnosticState();

    if (
      typeof window !==
      'undefined'
    ) {
      window.__PI_DIAGNOSTICS__ =
        state;
    }

    this.diagnosticListeners.forEach(
      (listener) => {
        try {
          listener(state);
        } catch {
          // Ignore.
        }
      }
    );
  }

  public getDiagnosticState(): PiSdkDiagnosticState {
    let sdkState:
      PiSdkDiagnosticState['sdkState'] =
      'not_loaded';

    const hasPi =
      typeof window !==
        'undefined' &&
      Boolean(window.Pi);

    if (
      this.sdkInitialized &&
      hasPi
    ) {
      sdkState = 'ready';
    } else if (
      this.piInitPromise ||
      this.piInitState ===
        'initializing'
    ) {
      sdkState = 'initializing';
    } else if (
      this.sdkLoaded ||
      hasPi
    ) {
      sdkState = 'loaded';
    }

    const domainInfo =
      getDomainDiagnosticInfo();

    const envDetails =
      getPiEnvironmentDetails();

    const inPi =
      isPiBrowser();

    const userAgent =
      typeof navigator !==
      'undefined'
        ? navigator.userAgent || ''
        : '';

    const hasBridge =
      typeof window !==
        'undefined' &&
      Boolean(
        (window as any).PiNative ||
        (window as any).__PI_NATIVE__ ||
        (window as any)
          .ReactNativeWebView ||
        (window as any).webkit
          ?.messageHandlers
          ?.piBrowser
      );

    const authStateSummary:
      | 'success'
      | 'pending'
      | 'failed' =
      this.authenticated &&
      this.authenticatedUser
        ? 'success'
        : this.authLifecycleState ===
              'AUTHENTICATING' ||
          this.authLifecycleState ===
              'INITIALIZING' ||
          this.authLifecycleState ===
              'AUTH_CALL_STARTED' ||
          this.authLifecycleState ===
              'AUTH_PROMISE_RETURNED' ||
          this.authLifecycleState ===
              'AUTH_NATIVE_PENDING' ||
          Boolean(
            this.piAuthPromise
          )
        ? 'pending'
        : this.authLifecycleState ===
              'REJECTED' ||
          this.authLifecycleState ===
              'FAILED' ||
          this.authLifecycleState ===
              'TIMEOUT' ||
          this.authLifecycleState ===
              'AUTH_TIMEOUT' ||
          this.authLifecycleState ===
              'AUTH_DENIED' ||
          this.authLifecycleState ===
              'AUTH_ERROR' ||
          this.authLifecycleState ===
              'PI_AUTHENTICATE_UNAVAILABLE'
        ? 'failed'
        : 'pending';

    let isIframe = false;

    try {
      isIframe =
        typeof window !==
          'undefined'
          ? window.self !==
            window.top
          : false;
    } catch {
      isIframe = true;
    }

    return {
      sdkScriptState:
        hasPi || this.sdkLoaded
          ? 'loaded'
          : 'not_loaded',

      piInitState:
        this.piInitState,

      piAuthApiState:
        hasPi &&
        typeof window.Pi
          ?.authenticate ===
          'function'
          ? 'available'
          : this.piAuthApiState,

      authenticateInvocation:
        this.authenticateInvocation,

      authenticateInvocationCount:
        this.authInvocationCount,

      authAttemptId:
        this.lastAuthAttemptId,

      activeAuthRequest:
        Boolean(
          this.piAuthPromise
        ),

      hasActiveAuthPromise:
        Boolean(
          this.piAuthPromise
        ),

      nativeBridgeState:
        this.nativeBridgeState,

      authScopesRequested:
        this.authScopesRequested,

      authInvocationCount:
        this.authInvocationCount,

      authPromiseState:
        this.authPromiseState,

      authTimeout:
        this.authTimeout,

      authResolutionTimeMs:
        this.authResolutionTimeMs,

      authRejectionTimeMs:
        this.authRejectionTimeMs,

      standardScopesResult:
        this.standardScopesResult,

      fullScopesResult:
        this.fullScopesResult,

      piEnvDetected:
        inPi,

      productionOrigin:
        domainInfo.currentOrigin,

      sandbox:
        envDetails.sandbox,

      sdkReadyState:
        this.sdkInitialized &&
        hasPi
          ? 'ready'
          : 'not_ready',

      network:
        envDetails.network,

      environmentDetails:
        envDetails,

      conflictWarning:
        envDetails.conflictWarning,

      configuredNetwork:
        envDetails.configuredNetwork,

      effectiveSandbox:
        envDetails.effectiveSandbox,

      environmentSource:
        envDetails.environmentSource,

      environmentConsistency:
        envDetails.environmentConsistency,

      sdkInitNetwork:
        this.sdkInitNetwork,

      sdkInitSandbox:
        this.sdkInitSandbox,

      sdkInitializationCount:
        this.sdkInitializationCount,

      sdkInitTimestamp:
        this.sdkInitTimestamp,

      sdkLoadingTelemetry:
        this.getScriptTelemetry(),

      initLifecycleTelemetry:
        this.getInitLifecycleTelemetry(),

      bridgeReadinessTelemetry:
        this.getBridgeReadinessTelemetry(),

      bridgeEvents:
        [...this.bridgeEvents],

      piAuthenticationState:
        authStateSummary,

      paymentScopeState:
        this.paymentScopeGranted
          ? 'granted'
          : 'not_granted',

      apiConfiguration:
        this.apiConfigState,

      buildCommit:
        BUILD_COMMIT,

      sdkState,

      authState:
        this.authLifecycleState,

      authErrorType:
        this.authErrorType,

      diagnosticCategory:
        this.diagnosticCategory,

      paymentScope:
        this.paymentScopeGranted
          ? 'granted'
          : 'not_granted',

      userState:
        this.authenticated &&
        this.authenticatedUser
          ? 'authenticated'
          : 'not_authenticated',

      username:
        this.authenticatedUser
          ?.username || null,

      error:
        this.authenticationError,

      isPiBrowser: inPi,

      hasPiSdk: hasPi,

      hasNativeBridge:
        hasBridge,

      isPiUserAgent:
        /PiBrowser|minepi/i.test(
          userAgent
        ),

      isOfficialDomain:
        domainInfo.matchesExpectedDomain,

      originMatches:
        domainInfo.matchesExpectedDomain,

      isRegisteredProductionDomain:
        domainInfo.matchesExpectedDomain,

      currentPaymentStage:
        this.currentPaymentStage,

      lastErrorCode:
        this.lastErrorCode,

      configuredAppUrl:
        this.configuredAppUrl,

      expectedProductionOrigin:
        this.expectedProductionOrigin,

      originClassification:
        domainInfo.classification,

      runtimeCheck: {
        hasPi,

        initType:
          hasPi
            ? typeof window.Pi
                ?.init
            : 'undefined',

        authType:
          hasPi
            ? typeof window.Pi
                ?.authenticate
            : 'undefined',

        createPaymentType:
          hasPi
            ? typeof window.Pi
                ?.createPayment
            : 'undefined'
      },

      currentOrigin:
        domainInfo.currentOrigin,

      isIframe
    };
  }

  public isReady(): boolean {
    return (
      this.sdkInitialized &&
      typeof window !==
        'undefined' &&
      Boolean(window.Pi)
    );
  }

  public isPaymentScopeReady(): boolean {
    return (
      this.paymentScopeGranted &&
      Boolean(
        this.authenticatedUser
      ) &&
      this.authenticated
    );
  }

  public getAuthenticatedUser(): PiUser | null {
    return this.authenticatedUser;
  }

  public getPaymentStage(): PiPaymentStage {
    return this.currentPaymentStage;
  }

  public setPaymentStage(
    stage: PiPaymentStage
  ): void {
    this.currentPaymentStage =
      stage;

    this.notifyDiagnosticStateChange();
  }

  /* =======================================================
   * Initialization
   * ======================================================= */

  public async loadScript(): Promise<boolean> {
    if (
      typeof window ===
      'undefined'
    ) {
      return false;
    }

    if (window.Pi) {
      this.sdkLoaded = true;
      this.notifyDiagnosticStateChange();
      return true;
    }

    return new Promise(
      (resolve) => {
        const existing =
          document.querySelector(
            'script[src*="pi-sdk.js"]'
          );

        if (existing) {
          let attempts = 0;

          const timer =
            window.setInterval(
              () => {
                attempts++;

                if (window.Pi) {
                  clearInterval(
                    timer
                  );

                  this.sdkLoaded =
                    true;

                  this.notifyDiagnosticStateChange();

                  resolve(true);
                } else if (
                  attempts >= 60
                ) {
                  clearInterval(
                    timer
                  );

                  resolve(
                    Boolean(
                      window.Pi
                    )
                  );
                }
              },
              100
            );

          return;
        }

        const script =
          document.createElement(
            'script'
          );

        script.src =
          'https://sdk.minepi.com/pi-sdk.js';

        script.async = true;

        let settled = false;

        const timeoutId =
          window.setTimeout(
            () => {
              if (!settled) {
                settled = true;

                this.sdkLoaded =
                  Boolean(
                    window.Pi
                  );

                resolve(
                  this.sdkLoaded
                );
              }
            },
            10000
          );

        script.onload = () => {
          let attempts = 0;

          const timer =
            window.setInterval(
              () => {
                attempts++;

                if (window.Pi) {
                  clearInterval(
                    timer
                  );

                  clearTimeout(
                    timeoutId
                  );

                  if (!settled) {
                    settled = true;

                    this.sdkLoaded =
                      true;

                    this.notifyDiagnosticStateChange();

                    resolve(true);
                  }
                } else if (
                  attempts >= 50
                ) {
                  clearInterval(
                    timer
                  );

                  clearTimeout(
                    timeoutId
                  );

                  if (!settled) {
                    settled = true;

                    this.sdkLoaded =
                      Boolean(
                        window.Pi
                      );

                    resolve(
                      this.sdkLoaded
                    );
                  }
                }
              },
              100
            );
        };

        script.onerror = () => {
          clearTimeout(
            timeoutId
          );

          if (!settled) {
            settled = true;

            this.sdkLoaded =
              false;

            logPiTrace(
              '[Pi SDK] SCRIPT_LOAD_FAILED CDN script failed to load',
              'warn'
            );

            this.notifyDiagnosticStateChange();

            resolve(false);
          }
        };

        document.head.appendChild(
          script
        );
      }
    );
  }

  public async initialize(
    sandbox?: boolean
  ): Promise<boolean> {
    const envConfig =
      getPiNetworkConfig();

    if (
      envConfig.environmentConsistency ===
        'INVALID' ||
      envConfig.hasConflict
    ) {
      this.piInitState =
        'failed';

      this.diagnosticCategory =
        'ENVIRONMENT_CONFIGURATION_INVALID';

      this.lastErrorCode =
        'ENVIRONMENT_CONFIGURATION_INVALID';

      this.authLifecycleState =
        'FAILED';

      logPiTrace(
        `[Pi SDK] INIT_BLOCKED ${envConfig.conflictWarning || ''}`,
        'error'
      );

      this.notifyDiagnosticStateChange();

      return false;
    }

    const resolvedSandbox =
      typeof sandbox ===
      'boolean'
        ? sandbox
        : envConfig.effectiveSandbox;

    const resolvedNetwork:
      PiNetworkEnvironment =
        resolvedSandbox
          ? 'SANDBOX'
          : 'MAINNET';

    if (
      this.sdkInitialized &&
      window.Pi &&
      this.sdkInitSandbox ===
        resolvedSandbox
    ) {
      return true;
    }

    if (
      this.sdkInitialized &&
      this.sdkInitSandbox !==
        null &&
      this.sdkInitSandbox !==
        resolvedSandbox
    ) {
      this.resetInitializationState();
    }

    if (this.piInitPromise) {
      return this.piInitPromise;
    }

    const reqId =
      generateReqId('init');

    this.sdkInitializationCount++;

    this.sdkInitNetwork =
      resolvedNetwork;

    this.sdkInitSandbox =
      resolvedSandbox;

    this.sdkInitTimestamp =
      new Date().toISOString();

    this.piInitState =
      'initializing';

    this.currentPaymentStage =
      'INITIALIZING_PI';

    this.authLifecycleState =
      'INITIALIZING';

    this.notifyDiagnosticStateChange();

    this.piInitPromise =
      (async () => {
        if (
          typeof window ===
          'undefined'
        ) {
          return false;
        }

        if (!window.Pi) {
          await this.loadScript();
        }

        if (
          !window.Pi ||
          typeof window.Pi.init !==
            'function'
        ) {
          this.piInitState =
            'failed';

          this.diagnosticCategory =
            'CATEGORY_A_SDK_MISSING';

          this.lastErrorCode =
            'CATEGORY_A_SDK_MISSING';

          this.authLifecycleState =
            'FAILED';

          logPiTrace(
            `[Pi SDK] INIT_FAILED reqId=${reqId} reason=SDK_UNAVAILABLE`,
            'warn'
          );

          this.notifyDiagnosticStateChange();

          return false;
        }

        try {
          window.Pi.init({
            version: '2.0',
            sandbox:
              resolvedSandbox
          });

          this.sdkLoaded = true;
          this.sdkInitialized = true;

          this.piInitState =
            'success';

          this.diagnosticCategory =
            null;

          this.lastErrorCode = null;

          this.authLifecycleState =
            'IDLE';

          logPiTrace(
            `[Pi TELEMETRY] SDK_INITIALIZED reqId=${reqId} version=2.0 network=${resolvedNetwork} sandbox=${resolvedSandbox}`
          );

          this.notifyDiagnosticStateChange();

          return true;
        } catch (error: any) {
          const message =
            String(
              error?.message ||
              error
            );

          /*
           * Pi SDK can report an "already initialized"
           * condition when another application lifecycle
           * path initialized the SDK first.
           *
           * This is safe only when window.Pi still exists.
           */
          if (
            message
              .toLowerCase()
              .includes(
                'initialized'
              ) &&
            window.Pi
          ) {
            this.sdkLoaded = true;
            this.sdkInitialized =
              true;

            this.piInitState =
              'success';

            this.authLifecycleState =
              'IDLE';

            this.diagnosticCategory =
              null;

            this.lastErrorCode = null;

            this.notifyDiagnosticStateChange();

            return true;
          }

          this.piInitState =
            'failed';

          this.diagnosticCategory =
            'CATEGORY_B_SDK_NOT_INITIALIZED';

          this.lastErrorCode =
            'CATEGORY_B_SDK_NOT_INITIALIZED';

          this.authLifecycleState =
            'FAILED';

          logPiTrace(
            `[Pi SDK] INIT_ERROR reqId=${reqId} error=${message}`,
            'warn'
          );

          this.notifyDiagnosticStateChange();

          return false;
        }
      })();

    const result =
      await this.piInitPromise;

    if (!result) {
      this.piInitPromise = null;
    }

    return result;
  }

  public resetInitializationState(): void {
    this.sdkInitialized =
      false;

    this.piInitState =
      'not_called';

    this.piInitPromise =
      null;

    this.sdkInitNetwork =
      null;

    this.sdkInitSandbox =
      null;

    this.resetAuthenticationState();
  }

  public setCustomSandboxMode(
    sandbox: boolean
  ): void {
    if (
      typeof window !==
      'undefined'
    ) {
      try {
        localStorage.setItem(
          'pi_sandbox_override',
          sandbox
            ? 'true'
            : 'false'
        );
      } catch {
        // Ignore.
      }
    }

    this.resetInitializationState();

    void this.initialize(
      sandbox
    );
  }

  /* =======================================================
   * API configuration
   * ======================================================= */

  public async fetchApiConfiguration(): Promise<
    'configured' | 'missing'
  > {
    try {
      const response =
        await safeFetchJson(
          '/api/v2/payments/config'
        );

      if (
        response.ok &&
        response.data
      ) {
        const data =
          response.data as any;

        if (
          data.apiConfiguration ===
          'configured'
        ) {
          this.apiConfigState =
            'configured';
        } else if (
          data.apiConfiguration ===
          'missing'
        ) {
          this.apiConfigState =
            'missing';
        }

        if (
          typeof data.configuredAppUrl ===
            'string' &&
          data.configuredAppUrl
        ) {
          this.configuredAppUrl =
            data.configuredAppUrl;
        }
      }
    } catch {
      // Keep existing state.
    }

    this.notifyDiagnosticStateChange();

    return this.apiConfigState;
  }

  /* =======================================================
   * Authentication
   *
   * IMPORTANT:
   * This method must be triggered from an explicit
   * user gesture such as a Pay button.
   * ======================================================= */

  /**
   * FINAL PRODUCTION Pi AUTHENTICATION
   *
   * Design:
   * - Canonical payment scopes: ['username', 'payments']
   * - Optional wallet scope: ['username', 'payments', 'wallet_address']
   * - Single-flight protection: never overlap native Pi.authenticate() calls
   * - 25s bounded wait
   * - Generation guard against stale native callbacks
   * - Scope-specific cached-session validation
   * - No unsafe automatic wallet_address -> payment-scope fallback
   * - Async + synchronous Pi.authenticate failures handled
   * - Timeout invalidates the current generation
   */
  public async authenticate(
    scopes: string[] = ['username', 'payments'],
    onIncompletePaymentFound?: (payment: PiPayment) => void,
    forceReauth: boolean = false
  ): Promise<PiUser> {

    const requestedScopes = scopes.includes('wallet_address')
      ? ['username', 'payments', 'wallet_address']
      : ['username', 'payments'];

    const requiresWalletAddress = requestedScopes.includes('wallet_address');

    const domainInfo = getDomainDiagnosticInfo();
    const preflight = getPiRuntimePreflight();

    /*
     * ------------------------------------------------------------
     * STEP 0 — Runtime preflight
     * ------------------------------------------------------------
     */
    if (
      !preflight.canAttemptAuth &&
      preflight.category === 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE'
    ) {
      this.sdkLoaded = false;
      this.sdkInitialized = false;
      this.authenticated = false;
      this.paymentScopeGranted = false;
      this.authenticatedUser = null;

      this.authLifecycleState = 'FAILED';
      this.authPromiseState = 'rejected';
      this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
      this.diagnosticCategory = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.lastErrorCode = 'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';
      this.currentPaymentStage = 'FAILED';
      this.nativeBridgeState = 'idle';

      this.authenticationError =
        'Pi Network SDK is unavailable. Please open PiNova Global Hub in the official Pi Browser.';

      this.authRejectionTimeMs = 0;

      logPiTrace(
        `[Pi SDK] AUTH_PRECHECK_FAILED ` +
        `category=CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE ` +
        `origin=${domainInfo.currentOrigin}`,
        'warn'
      );

      this.notifyDiagnosticStateChange();
      throw new Error(this.authenticationError);
    }

    /*
     * ------------------------------------------------------------
     * STEP 1 — Existing valid session
     *
     * IMPORTANT:
     * A standard authenticated session is NOT enough for a
     * wallet_address request.
     * ------------------------------------------------------------
     */
    const cachedScopeReady = requiresWalletAddress
      ? this.fullScopesResult === 'resolved'
      : this.standardScopesResult === 'resolved';

    if (
      !forceReauth &&
      cachedScopeReady &&
      this.authenticated &&
      this.authenticatedUser &&
      this.paymentScopeGranted
    ) {
      this.authLifecycleState = 'AUTHENTICATED';
      this.authPromiseState = 'resolved';
      this.diagnosticCategory = null;
      this.lastErrorCode = null;

      logPiTrace(
        `[Pi SDK] AUTH_SESSION_REUSED ` +
        `scopes=${JSON.stringify(requestedScopes)} ` +
        `username=${this.authenticatedUser.username}`
      );

      this.notifyDiagnosticStateChange();
      return this.authenticatedUser;
    }

    /*
     * ------------------------------------------------------------
     * STEP 2 — NEVER overlap native Pi.authenticate() calls
     *
     * forceReauth does NOT cancel an existing native bridge call.
     * We cannot safely cancel Pi's native request from JS.
     *
     * Therefore:
     *   active request -> await it
     *   completed/failed -> new request may start
     * ------------------------------------------------------------
     */
    if (this.piAuthPromise) {
      logPiTrace(
        `[Pi SDK] AUTH_DEDUPLICATED ` +
        `scopes=${JSON.stringify(requestedScopes)} ` +
        `forceReauth=${forceReauth}`
      );

      return this.piAuthPromise;
    }

    /*
     * ------------------------------------------------------------
     * STEP 3 — New generation
     * ------------------------------------------------------------
     */
    this.authAttemptCount++;

    const authAttemptId =
      `auth_${this.authAttemptCount}_${Date.now().toString(36)}`;

    const attemptId = authAttemptId;
    const authStartTime = Date.now();

    this.lastAuthAttemptId = attemptId;
    this.authScopesRequested = [...requestedScopes];

    this.authPromiseState = 'pending';
    this.authResolutionTimeMs = null;
    this.authRejectionTimeMs = null;

    logPiTrace(
      `[Pi SDK] AUTH_ATTEMPT_START ` +
      `attemptId=${attemptId} ` +
      `isPiBrowser=${preflight.isPiBrowser} ` +
      `origin=${domainInfo.currentOrigin} ` +
      `originClassification=${domainInfo.classification} ` +
      `sdkInitialized=${this.sdkInitialized} ` +
      `scopes=${JSON.stringify(requestedScopes)}`
    );

    /*
     * ------------------------------------------------------------
     * STEP 4 — Single authentication promise
     * ------------------------------------------------------------
     */
    this.piAuthPromise = (async (): Promise<PiUser> => {

      this.authLifecycleState = 'AUTHENTICATING';
      this.authPromiseState = 'pending';
      this.authErrorType = null;
      this.diagnosticCategory = null;
      this.authenticationError = null;
      this.currentPaymentStage = 'AUTHENTICATING';
      this.nativeBridgeState = 'calling_invocation';

      this.notifyDiagnosticStateChange();

      try {

        /*
         * --------------------------------------------------------
         * STEP 5 — Initialize SDK
         * --------------------------------------------------------
         */
        const hasSdk = await this.initialize();

        if (
          !hasSdk ||
          typeof window === 'undefined' ||
          !window.Pi
        ) {
          this.authLifecycleState = 'FAILED';
          this.authPromiseState = 'rejected';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.diagnosticCategory = 'CATEGORY_A_SDK_MISSING';
          this.lastErrorCode = 'CATEGORY_A_SDK_MISSING';
          this.piAuthApiState = 'unavailable';
          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'idle';

          this.authenticationError =
            'Pi Network SDK is unavailable. Please open PiNova Global Hub in the official Pi Browser.';

          this.authRejectionTimeMs =
            Date.now() - authStartTime;

          logPiTrace(
            `[Pi SDK] AUTH_INIT_FAILED ` +
            `attemptId=${attemptId} ` +
            `category=CATEGORY_A_SDK_MISSING`,
            'warn'
          );

          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        /*
         * --------------------------------------------------------
         * STEP 6 — Verify authenticate API
         * --------------------------------------------------------
         */
        if (typeof window.Pi.authenticate !== 'function') {

          this.authLifecycleState = 'FAILED';
          this.authPromiseState = 'rejected';
          this.authErrorType = 'PI_AUTHENTICATE_UNAVAILABLE';
          this.diagnosticCategory = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.lastErrorCode = 'CATEGORY_B_SDK_NOT_INITIALIZED';
          this.piAuthApiState = 'unavailable';
          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'idle';

          this.authenticationError =
            'Pi Network authentication is unavailable. Please reopen PiNova Global Hub in the official Pi Browser.';

          this.authRejectionTimeMs =
            Date.now() - authStartTime;

          logPiTrace(
            `[Pi SDK] AUTH_API_UNAVAILABLE ` +
            `attemptId=${attemptId}`,
            'warn'
          );

          this.notifyDiagnosticStateChange();
          throw new Error(this.authenticationError);
        }

        this.piAuthApiState = 'available';
        this.authenticateInvocation = 'called';
        this.authInvocationCount++;

        /*
         * --------------------------------------------------------
         * STEP 7 — Incomplete payment handler
         * --------------------------------------------------------
         */
        const handleIncomplete = (payment: PiPayment) => {

          logPiTrace(
            `[Pi SDK] INCOMPLETE_PAYMENT_FOUND ` +
            `attemptId=${attemptId} ` +
            `paymentId=${payment?.identifier || 'unknown'}`
          );

          if (onIncompletePaymentFound) {
            try {
              onIncompletePaymentFound(payment);
            } catch (callbackError) {
              console.error(
                '[Pi SDK] Incomplete payment callback error:',
                callbackError
              );
            }
          }
        };

        /*
         * --------------------------------------------------------
         * STEP 8 — Native Pi.authenticate()
         *
         * IMPORTANT:
         * Do NOT automatically downgrade wallet_address requests.
         *
         * Payment authentication:
         *   username + payments
         *
         * Wallet authentication:
         *   username + payments + wallet_address
         * --------------------------------------------------------
         */
        let nativeAuthPromise: Promise<any>;

        this.nativeBridgeState = 'calling_invocation';
        this.currentPaymentStage = 'AUTHENTICATING';

        this.notifyDiagnosticStateChange();

        try {

          const nativeResult =
            window.Pi.authenticate(
              requestedScopes,
              handleIncomplete
            );

          nativeAuthPromise =
            Promise.resolve(nativeResult);

          this.nativeBridgeState = 'promise_pending';
          this.authPromiseState = 'pending';

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_CALLED ` +
            `attemptId=${attemptId} ` +
            `scopes=${JSON.stringify(requestedScopes)}`
          );

          this.notifyDiagnosticStateChange();

        } catch (syncError: any) {

          this.nativeBridgeState = 'call_blocked';

          this.authLifecycleState = 'REJECTED';
          this.authPromiseState = 'rejected';
          this.authErrorType = 'AUTH_BRIDGE_REJECTED';
          this.diagnosticCategory = 'CATEGORY_E_AUTH_REJECTED';
          this.lastErrorCode = 'CATEGORY_E_AUTH_REJECTED';
          this.currentPaymentStage = 'FAILED';

          this.authenticationError =
            'Pi Browser rejected the authentication request. Please retry Pi authentication.';

          this.authRejectionTimeMs =
            Date.now() - authStartTime;

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_SYNC_REJECTED ` +
            `attemptId=${attemptId} ` +
            `error=${syncError?.message || syncError}`,
            'warn'
          );

          this.notifyDiagnosticStateChange();
          throw syncError;
        }

        /*
         * --------------------------------------------------------
         * STEP 9 — 25 second bounded timeout
         * --------------------------------------------------------
         */
        const AUTH_TIMEOUT_MS = 25_000;

        let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

        const timeoutPromise = new Promise<never>((_, reject) => {

          timeoutHandle = setTimeout(() => {

            const elapsed =
              Date.now() - authStartTime;

            const timeoutContext = {
              attemptId,
              elapsedMs: elapsed,
              piObjectAvailable:
                typeof window !== 'undefined' &&
                Boolean(window.Pi),
              sdkInitialized: this.sdkInitialized,
              piBrowserDetected: isPiBrowser(),
              userAgentDetected:
                typeof navigator !== 'undefined'
                  ? /PiBrowser|minepi/i.test(navigator.userAgent)
                  : false,
              currentOrigin: domainInfo.currentOrigin,
              configuredAppDomain: this.configuredAppUrl,
              originClassification: domainInfo.classification,
              scopesRequested: [...requestedScopes],
              nativeBridgeState: this.nativeBridgeState,
              authenticationStartedAt:
                new Date(authStartTime).toISOString()
            };

            const timeoutError = new Error(
              'Pi Browser did not respond to the authentication request within 25 seconds.'
            );

            (timeoutError as any).code =
              'AUTH_TIMEOUT';

            (timeoutError as any).diagnosticContext =
              timeoutContext;

            logPiTrace(
              `[Pi TELEMETRY] NATIVE_AUTH_TIMEOUT ` +
              `attemptId=${attemptId} ` +
              `elapsedMs=${elapsed} ` +
              `scopes=${JSON.stringify(requestedScopes)}`,
              'warn'
            );

            reject(timeoutError);

          }, AUTH_TIMEOUT_MS);
        });

        /*
         * --------------------------------------------------------
         * STEP 10 — Race native bridge against timeout
         * --------------------------------------------------------
         */
        let auth: any;

        try {

          auth = await Promise.race([
            nativeAuthPromise,
            timeoutPromise
          ]);

        } finally {

          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
          }
        }

        /*
         * --------------------------------------------------------
         * STEP 11 — Generation guard
         *
         * If a newer authentication cycle has already started,
         * this response must never overwrite the new state.
         * --------------------------------------------------------
         */
        if (this.lastAuthAttemptId !== attemptId) {

          logPiTrace(
            `[Pi SDK] AUTH_RESPONSE_IGNORED ` +
            `attemptId=${attemptId} ` +
            `currentAttempt=${this.lastAuthAttemptId}`
          );

          return this.authenticatedUser || auth;
        }

        /*
         * --------------------------------------------------------
         * STEP 12 — Validate native response
         * --------------------------------------------------------
         */
        const elapsed =
          Date.now() - authStartTime;

        this.authResolutionTimeMs = elapsed;

        if (
          !auth ||
          !auth.user ||
          !auth.accessToken ||
          !auth.user.uid ||
          !auth.user.username
        ) {

          throw Object.assign(
            new Error(
              'Pi Browser returned an incomplete authentication response.'
            ),
            {
              code: 'AUTH_MISSING_CREDENTIALS'
            }
          );
        }

        /*
         * --------------------------------------------------------
         * STEP 13 — Successful authentication
         * --------------------------------------------------------
         */
        this.authenticated = true;
        this.paymentScopeGranted = true;

        this.authenticatedUser = {
          username: auth.user.username,
          uid: auth.user.uid,
          accessToken: auth.accessToken,
          authenticated: true,
          role:
            auth.user.username === 'admin'
              ? 'admin'
              : 'buyer'
        };

        if (requiresWalletAddress) {
          this.fullScopesResult = 'resolved';
        } else {
          this.standardScopesResult = 'resolved';
        }

        this.authLifecycleState = 'AUTHENTICATED';
        this.authPromiseState = 'resolved';
        this.authErrorType = null;
        this.diagnosticCategory = null;
        this.authenticationError = null;
        this.currentPaymentStage = 'AUTHENTICATED';
        this.nativeBridgeState = 'promise_resolved';
        this.lastErrorCode = null;

        logPiTrace(
          `[Pi TELEMETRY] NATIVE_AUTH_RESOLVED ` +
          `attemptId=${attemptId} ` +
          `username=${auth.user.username} ` +
          `uid=${auth.user.uid} ` +
          `scopes=${JSON.stringify(requestedScopes)} ` +
          `elapsedMs=${elapsed}`
        );

        this.notifyDiagnosticStateChange();

        return this.authenticatedUser;

      } catch (err: any) {

        /*
         * --------------------------------------------------------
         * STEP 14 — Ignore stale errors
         * --------------------------------------------------------
         */
        if (this.lastAuthAttemptId !== attemptId) {

          logPiTrace(
            `[Pi SDK] AUTH_ERROR_IGNORED ` +
            `attemptId=${attemptId} ` +
            `currentAttempt=${this.lastAuthAttemptId}`
          );

          return this.authenticatedUser as PiUser;
        }

        const elapsed =
          Date.now() - authStartTime;

        this.authRejectionTimeMs = elapsed;

        const rawMsg =
          typeof err === 'string'
            ? err
            : err?.message ||
              err?.error ||
              err?.description ||
              '';

        const normalizedMsg =
          String(rawMsg).toLowerCase();

        const errorCode =
          String(err?.code || '').toUpperCase();

        const isTimeout =
          errorCode === 'AUTH_TIMEOUT' ||
          normalizedMsg.includes('did not respond') ||
          normalizedMsg.includes('within 25 seconds') ||
          normalizedMsg.includes('timed out') ||
          normalizedMsg.includes('timeout');

        const isCancelled =
          normalizedMsg.includes('cancel') ||
          normalizedMsg.includes('denied') ||
          normalizedMsg.includes('dismiss') ||
          normalizedMsg.includes('user_cancelled');

        const isUnavailable =
          errorCode === 'PI_SDK_NOT_AVAILABLE' ||
          normalizedMsg.includes('external browser') ||
          normalizedMsg.includes('official pi browser') ||
          normalizedMsg.includes('sdk unavailable');

        const isMissingCredentials =
          errorCode === 'AUTH_MISSING_CREDENTIALS';

        /*
         * --------------------------------------------------------
         * TIMEOUT
         * --------------------------------------------------------
         */
        if (isTimeout) {

          this.authLifecycleState = 'TIMEOUT';
          this.authPromiseState = 'timed_out';
          this.authErrorType = 'AUTH_BRIDGE_TIMEOUT';

          if (requiresWalletAddress) {
            this.fullScopesResult = 'timed_out';

            this.diagnosticCategory =
              'CATEGORY_E_AUTH_SCOPE_COMPATIBILITY';

            this.lastErrorCode =
              'CATEGORY_E_AUTH_SCOPE_COMPATIBILITY';

            this.authenticationError =
              'Pi Browser did not complete the wallet_address authentication request within 25 seconds. The standard payment authentication flow remains separate; retry wallet authentication only if the feature requires wallet_address.';
          } else {

            this.standardScopesResult = 'timed_out';

            this.diagnosticCategory =
              'CATEGORY_D_AUTH_NO_RESPONSE';

            this.lastErrorCode =
              'CATEGORY_D_AUTH_NO_RESPONSE';

            this.authenticationError =
              'Pi Browser did not respond to the authentication request within 25 seconds. Please make sure PiNova Global Hub is open in the official Pi Browser and tap Retry Pi Authentication.';
          }

          this.authenticated = false;
          this.paymentScopeGranted = false;
          this.authenticatedUser = null;

          this.currentPaymentStage = 'TIMEOUT';
          this.nativeBridgeState = 'idle';

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_TIMED_OUT ` +
            `attemptId=${attemptId} ` +
            `category=${this.diagnosticCategory} ` +
            `scopes=${JSON.stringify(requestedScopes)} ` +
            `elapsedMs=${elapsed}`,
            'warn'
          );

        /*
         * --------------------------------------------------------
         * USER CANCEL / DENIAL
         * --------------------------------------------------------
         */
        } else if (isCancelled) {

          this.authLifecycleState = 'REJECTED';
          this.authPromiseState = 'rejected';
          this.authErrorType = 'AUTH_USER_CANCELLED';
          this.diagnosticCategory =
            'CATEGORY_E_AUTH_REJECTED';

          this.lastErrorCode =
            'CATEGORY_E_AUTH_REJECTED';

          if (requiresWalletAddress) {
            this.fullScopesResult = 'rejected';
          } else {
            this.standardScopesResult = 'rejected';
          }

          this.currentPaymentStage = 'CANCELLED';

          this.authenticationError =
            'Pi authentication was cancelled or denied. No Pi payment was created.';

          this.authenticated = false;
          this.paymentScopeGranted = false;
          this.authenticatedUser = null;

          this.nativeBridgeState = 'promise_rejected';

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_CANCELLED ` +
            `attemptId=${attemptId} ` +
            `scopes=${JSON.stringify(requestedScopes)} ` +
            `elapsedMs=${elapsed}`,
            'warn'
          );

        /*
         * --------------------------------------------------------
         * SDK / BRIDGE UNAVAILABLE
         * --------------------------------------------------------
         */
        } else if (isUnavailable) {

          this.authLifecycleState = 'FAILED';
          this.authPromiseState = 'rejected';
          this.authErrorType =
            'PI_AUTHENTICATE_UNAVAILABLE';

          this.diagnosticCategory =
            'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';

          this.lastErrorCode =
            'CATEGORY_C_BROWSER_BRIDGE_UNAVAILABLE';

          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'idle';

          this.authenticationError =
            'Pi Network authentication is unavailable. Please open PiNova Global Hub in the official Pi Browser.';

          this.authenticated = false;
          this.paymentScopeGranted = false;
          this.authenticatedUser = null;

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_UNAVAILABLE ` +
            `attemptId=${attemptId}`,
            'warn'
          );

        /*
         * --------------------------------------------------------
         * INCOMPLETE / INVALID RESPONSE
         * --------------------------------------------------------
         */
        } else if (isMissingCredentials) {

          this.authLifecycleState = 'REJECTED';
          this.authPromiseState = 'rejected';
          this.authErrorType =
            'AUTH_BRIDGE_REJECTED';

          this.diagnosticCategory =
            'CATEGORY_E_AUTH_REJECTED';

          this.lastErrorCode =
            'CATEGORY_E_AUTH_REJECTED';

          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'promise_rejected';

          this.authenticationError =
            'Pi Browser returned an incomplete authentication response. Please retry Pi authentication.';

          this.authenticated = false;
          this.paymentScopeGranted = false;
          this.authenticatedUser = null;

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_INVALID_RESPONSE ` +
            `attemptId=${attemptId} ` +
            `elapsedMs=${elapsed}`,
            'warn'
          );

        /*
         * --------------------------------------------------------
         * GENERAL BRIDGE REJECTION
         * --------------------------------------------------------
         */
        } else {

          this.authLifecycleState = 'REJECTED';
          this.authPromiseState = 'rejected';
          this.authErrorType =
            'AUTH_BRIDGE_REJECTED';

          this.diagnosticCategory =
            'CATEGORY_E_AUTH_REJECTED';

          this.lastErrorCode =
            'CATEGORY_E_AUTH_REJECTED';

          this.currentPaymentStage = 'FAILED';
          this.nativeBridgeState = 'promise_rejected';

          this.authenticationError =
            rawMsg
              ? `Pi Browser rejected the authentication request: ${rawMsg}`
              : 'Pi Browser rejected the authentication request. Please retry Pi authentication.';

          this.authenticated = false;
          this.paymentScopeGranted = false;
          this.authenticatedUser = null;

          logPiTrace(
            `[Pi TELEMETRY] NATIVE_AUTH_REJECTED ` +
            `attemptId=${attemptId} ` +
            `category=CATEGORY_E_AUTH_REJECTED ` +
            `scopes=${JSON.stringify(requestedScopes)} ` +
            `error=${rawMsg || 'unknown'} ` +
            `elapsedMs=${elapsed}`,
            'warn'
          );
        }

        this.notifyDiagnosticStateChange();

        throw new Error(this.authenticationError);

      } finally {

        /*
         * --------------------------------------------------------
         * STEP 15 — Promise cleanup
         *
         * Only the current generation may clear the active promise.
         * --------------------------------------------------------
         */
        if (this.lastAuthAttemptId === attemptId) {

          this.piAuthPromise = null;

          if (
            this.authLifecycleState === 'TIMEOUT' ||
            this.authLifecycleState === 'FAILED' ||
            this.authLifecycleState === 'REJECTED'
          ) {
            this.nativeBridgeState = 'idle';
          }
        }

        this.notifyDiagnosticStateChange();
      }
    })();

    return this.piAuthPromise;
  }


  /**
   * Dedicated authentication flow for features that explicitly
   * require wallet_address.
   *
   * IMPORTANT:
   * This never downgrades to standard payment authentication.
   */
  public async authenticateWithWalletAddress(
    onIncompletePaymentFound?: (payment: PiPayment) => void
  ): Promise<PiUser> {

    return this.authenticate(
      ['username', 'payments', 'wallet_address'],
      onIncompletePaymentFound,
      true
    );
  }

  public resetAuthenticationState(): void {
    this.authAttemptCount++;

    this.lastAuthAttemptId =
      `reset_${this.authAttemptCount}_${Date.now().toString(36)}`;

    this.piAuthPromise =
      null;

    this.authenticated =
      false;

    this.paymentScopeGranted =
      false;

    this.authenticatedUser =
      null;

    this.authLifecycleState =
      'IDLE';

    this.authPromiseState =
      'idle';

    this.authErrorType =
      null;

    this.diagnosticCategory =
      null;

    this.nativeBridgeState =
      'idle';

    this.authenticationError =
      null;

    this.lastErrorCode =
      null;

    this.authResolutionTimeMs =
      null;

    this.authRejectionTimeMs =
      null;

    this.currentPaymentStage =
      'IDLE';

    this.activePaymentInFlight =
      false;

    this.activePaymentId =
      null;

    this.notifyDiagnosticStateChange();
  }

  /* =======================================================
   * Payment
   * ======================================================= */

  public executePayment(
    paymentData: PiPaymentData,
    callbacks: {
      onSuccess: (
        paymentId: string,
        txid: string
      ) => void;

      onCancel: (
        paymentId: string
      ) => void;

      onError: (
        error: Error,
        payment?: PiPayment
      ) => void;

      onStatusUpdate?: (
        statusMessage: string
      ) => void;

      onIncompletePaymentFound?: (
        payment: PiPayment
      ) => void;

      idempotencyKey?: string;
    }
  ): void {
    void this.createPayment({
      amountPi:
        paymentData.amount,

      memo:
        paymentData.memo,

      metadata:
        paymentData.metadata,

      onStatusUpdate:
        callbacks.onStatusUpdate,

      onIncompletePaymentFound:
        callbacks.onIncompletePaymentFound,

      idempotencyKey:
        callbacks.idempotencyKey
    })
      .then((result) => {
        if (
          result &&
          result.paymentId &&
          result.txid
        ) {
          callbacks.onSuccess(
            result.paymentId,
            result.txid
          );
        }
      })
      .catch((error) => {
        callbacks.onError(
          error instanceof Error
            ? error
            : new Error(
                String(error)
              )
        );
      });
  }

  public async createPayment(params: {
    amountPi: number;
    memo: string;
    metadata?: Record<string, any>;
    onStatusUpdate?: (
      statusMessage: string
    ) => void;
    onIncompletePaymentFound?: (
      payment: PiPayment
    ) => void;
    idempotencyKey?: string;
  }): Promise<{
    paymentId: string;
    txid: string;
    success: boolean;
    fulfillmentStatus?: string;
    message?: string;
    data?: any;
    errorType?: string;
  }> {
    if (
      !Number.isFinite(
        params.amountPi
      ) ||
      params.amountPi <= 0
    ) {
      throw new Error(
        'Invalid Pi payment amount.'
      );
    }

    if (
      this.activePaymentInFlight
    ) {
      throw new Error(
        'A Pi payment is already in progress. Please wait for it to finish.'
      );
    }

    this.activePaymentInFlight =
      true;

    this.currentPaymentStage =
      'CREATING_PAYMENT';

    params.onStatusUpdate?.(
      'Authenticating with Pi...'
    );

    this.notifyDiagnosticStateChange();

    try {
      const user =
        await this.authenticate(
          ['username', 'payments'],
          params.onIncompletePaymentFound,
          false
        );

      if (
        !user ||
        !this.paymentScopeGranted
      ) {
        throw new Error(
          'Pi payment permission was not granted.'
        );
      }

      const ready =
        await this.initialize();

      if (!ready) {
        throw new Error(
          'Pi Network SDK could not be initialized.'
        );
      }

      if (
        typeof window ===
          'undefined' ||
        !window.Pi ||
        typeof window.Pi
          .createPayment !==
          'function'
      ) {
        throw new Error(
          'Pi.createPayment is unavailable.'
        );
      }

      const idempotencyKey =
        params.idempotencyKey ||
        generateReqId(
          'payment'
        );

      this.currentPaymentStage =
        'CREATING_PAYMENT';

      params.onStatusUpdate?.(
        'Creating Pi payment...'
      );

      this.notifyDiagnosticStateChange();

      const result =
        await new Promise<{
          paymentId: string;
          txid: string;
          success: boolean;
          fulfillmentStatus?: string;
          message?: string;
          data?: any;
          errorType?: string;
        }>(
          (resolve, reject) => {
            let settled = false;

            const safeResolve = (
              value: {
                paymentId: string;
                txid: string;
                success: boolean;
                fulfillmentStatus?: string;
                message?: string;
                data?: any;
                errorType?: string;
              }
            ) => {
              if (settled) {
                return;
              }

              settled = true;
              resolve(value);
            };

            const safeReject = (
              error: Error
            ) => {
              if (settled) {
                return;
              }

              settled = true;
              reject(error);
            };

            const timeout =
              window.setTimeout(
                () => {
                  this.currentPaymentStage =
                    'TIMEOUT';

                  safeReject(
                    new Error(
                      'Pi payment timed out. Please check your Pi Wallet and try again.'
                    )
                  );
                },
                120000
              );

            const clear =
              () => {
                clearTimeout(
                  timeout
                );
              };

            try {
              window.Pi!.createPayment(
                {
                  amount:
                    params.amountPi,

                  memo:
                    params.memo,

                  metadata: {
                    ...(params.metadata ||
                      {}),
                    piNova:
                      true,
                    idempotencyKey,
                    buildCommit:
                      BUILD_COMMIT
                  }
                },

                {
                  onReadyForServerApproval:
                    async (
                      paymentId
                    ) => {
                      this.activePaymentId =
                        paymentId;

                      this.currentPaymentStage =
                        'WAITING_FOR_PI_APPROVAL';

                      params.onStatusUpdate?.(
                        'Waiting for Pi payment approval...'
                      );

                      this.notifyDiagnosticStateChange();

                      try {
                        const response =
                          await safeFetchJson(
                            '/api/v2/payments/approve',
                            {
                              method:
                                'POST',

                              headers: {
                                'Content-Type':
                                  'application/json',

                                'Idempotency-Key':
                                  idempotencyKey
                              },

                              body:
                                JSON.stringify(
                                  {
                                    paymentId,
                                    uid:
                                      user.uid,
                                    username:
                                      user.username,
                                    amount:
                                      params.amountPi,
                                    memo:
                                      params.memo,
                                    metadata:
                                      params.metadata ||
                                      {}
                                  }
                                )
                            }
                          );

                        if (
                          !response.ok
                        ) {
                          throw new Error(
                            `Server approval failed (${response.status}).`
                          );
                        }

                        this.currentPaymentStage =
                          'WAITING_FOR_PI_COMPLETION';

                        params.onStatusUpdate?.(
                          'Pi payment approved. Waiting for blockchain completion...'
                        );

                        this.notifyDiagnosticStateChange();
                      } catch (error: any) {
                        this.currentPaymentStage =
                          'FAILED';

                        this.diagnosticCategory =
                          'CATEGORY_G_PAYMENT_APPROVAL_FAILED';

                        this.lastErrorCode =
                          'CATEGORY_G_PAYMENT_APPROVAL_FAILED';

                        clear();

                        safeReject(
                          error instanceof Error
                            ? error
                            : new Error(
                                String(
                                  error
                                )
                              )
                        );
                      }
                    },

                  onReadyForServerCompletion:
                    async (
                      paymentId,
                      txid
                    ) => {
                      this.currentPaymentStage =
                        'SERVER_VERIFICATION';

                      params.onStatusUpdate?.(
                        'Verifying Pi transaction on the server...'
                      );

                      this.notifyDiagnosticStateChange();

                      try {
                        const response =
                          await safeFetchJson(
                            '/api/v2/payments/complete',
                            {
                              method:
                                'POST',

                              headers: {
                                'Content-Type':
                                  'application/json',

                                'Idempotency-Key':
                                  idempotencyKey
                              },

                              body:
                                JSON.stringify(
                                  {
                                    paymentId,
                                    txid,
                                    uid:
                                      user.uid,
                                    username:
                                      user.username,
                                    amount:
                                      params.amountPi,
                                    memo:
                                      params.memo,
                                    metadata:
                                      params.metadata ||
                                      {}
                                  }
                                )
                            }
                          );

                        if (
                          !response.ok
                        ) {
                          throw new Error(
                            `Server completion failed (${response.status}).`
                          );
                        }

                        const data =
                          (response.data ||
                            {}) as any;

                        /*
                         * Do not claim success merely because
                         * the endpoint returned HTTP 200.
                         *
                         * The backend returns verified=true
                         * after Pi blockchain verification.
                         */
                        if (
                          data.verified ===
                            false ||
                          data.success ===
                            false
                        ) {
                          throw new Error(
                            'Pi transaction could not be verified.'
                          );
                        }

                        this.currentPaymentStage =
                          'COMPLETED';

                        params.onStatusUpdate?.(
                          'Pi payment completed and verified successfully.'
                        );

                        clear();

                        safeResolve({
                          paymentId,
                          txid,
                          success: true,
                          fulfillmentStatus: 'FULFILLED',
                          message: 'Pi payment verified and completed successfully.',
                          data
                        });

                        this.notifyDiagnosticStateChange();
                      } catch (error: any) {
                        this.currentPaymentStage =
                          'FAILED';

                        this.diagnosticCategory =
                          'CATEGORY_H_PAYMENT_COMPLETION_FAILED';

                        this.lastErrorCode =
                          'CATEGORY_H_PAYMENT_COMPLETION_FAILED';

                        clear();

                        safeReject(
                          error instanceof Error
                            ? error
                            : new Error(
                                String(
                                  error
                                )
                              )
                        );
                      }
                    },

                  onCancel:
                    (
                      paymentId
                    ) => {
                      this.currentPaymentStage =
                        'CANCELLED';

                      params.onStatusUpdate?.(
                        'Pi payment was cancelled.'
                      );

                      clear();

                      try {
                        params.onIncompletePaymentFound;
                      } catch {
                        // Ignore.
                      }

                      safeReject(
                        new Error(
                          `Pi payment cancelled: ${paymentId}`
                        )
                      );

                      this.notifyDiagnosticStateChange();
                    },

                  onError:
                    (
                      error,
                      payment
                    ) => {
                      this.currentPaymentStage =
                        'FAILED';

                      this.diagnosticCategory =
                        'CATEGORY_F_PAYMENT_CREATION_FAILED';

                      this.lastErrorCode =
                        'CATEGORY_F_PAYMENT_CREATION_FAILED';

                      clear();

                      safeReject(
                        error instanceof Error
                          ? error
                          : new Error(
                              String(
                                error
                              )
                            )
                      );

                      if (
                        payment
                      ) {
                        logPiTrace(
                          `[Pi SDK] PAYMENT_ERROR paymentId=${payment.identifier}`,
                          'error'
                        );
                      }

                      this.notifyDiagnosticStateChange();
                    }
                }
              );
            } catch (error: any) {
              clear();

              this.currentPaymentStage =
                'FAILED';

              safeReject(
                error instanceof Error
                  ? error
                  : new Error(
                      String(error)
                    )
              );

              this.notifyDiagnosticStateChange();
            }
          }
        );

      return result;
    } finally {
      this.activePaymentInFlight =
        false;

      this.activePaymentId =
        null;

      this.notifyDiagnosticStateChange();
    }
  }
}

/* =========================================================
 * Singleton
 * ========================================================= */

export const PiSdkManager =
  new PiSdkManagerService();

/* =========================================================
 * Public helper functions
 * ========================================================= */

export async function initializePi(
  sandbox?: boolean
): Promise<boolean> {
  return PiSdkManager.initialize(
    sandbox
  );
}

export async function initPiSdk(
  sandbox?: boolean
): Promise<boolean> {
  return PiSdkManager.initialize(
    sandbox
  );
}

export function isPiSdkInitialized(): boolean {
  return PiSdkManager.isReady();
}

export function isPaymentScopeReady(): boolean {
  return PiSdkManager.isPaymentScopeReady();
}

export async function authenticatePiUser(
  param1?: string[] | ((payment: PiPayment) => void),
  param2?: boolean | ((payment: PiPayment) => void),
  param3?: boolean | string[]
): Promise<PiUser> {
  let scopes: string[] = ['username', 'payments'];
  let onIncomplete: ((payment: PiPayment) => void) | undefined = undefined;
  let force = false;

  if (Array.isArray(param1)) {
    scopes = param1;
    if (typeof param2 === 'boolean') force = param2;
    else if (typeof param2 === 'function') onIncomplete = param2;
    if (typeof param3 === 'boolean') force = param3;
  } else if (typeof param1 === 'function') {
    onIncomplete = param1;
    if (typeof param2 === 'boolean') force = param2;
    if (Array.isArray(param3)) scopes = param3;
  } else {
    if (typeof param2 === 'boolean') force = param2;
    if (Array.isArray(param3)) scopes = param3;
  }

  const preflight = getPiRuntimePreflight();
  if (!preflight.canAttemptAuth) {
    throw new Error(
      preflight.failReason ||
        'Please open PiNova Global Hub in the official Pi Browser.'
    );
  }

  const ready = await PiSdkManager.initialize();
  if (!ready) {
    throw new Error(
      'Pi Network SDK could not be initialized. Please verify the Pi App domain configuration.'
    );
  }

  const user = await PiSdkManager.authenticate(
    scopes,
    onIncomplete,
    force
  );

  if (!user) {
    throw new Error(
      'Pi authentication is required before payment. Permissions were not granted.'
    );
  }

  return user;
}

export function executePiPayment(
  paymentData: PiPaymentData,
  callbacks: {
    onSuccess: (
      paymentId: string,
      txid: string
    ) => void;

    onCancel: (
      paymentId: string
    ) => void;

    onError: (
      error: Error,
      payment?: PiPayment
    ) => void;

    onStatusUpdate?: (
      statusMessage: string
    ) => void;

    onIncompletePaymentFound?: (
      payment: PiPayment
    ) => void;

    idempotencyKey?: string;
  }
): void {
  PiSdkManager.executePayment(
    paymentData,
    callbacks
  );
}

export async function createPiPayment(
  params: {
    amountPi: number;
    memo: string;
    metadata?: Record<string, any>;

    onStatusUpdate?: (
      statusMessage: string
    ) => void;

    onIncompletePaymentFound?: (
      payment: PiPayment
    ) => void;

    idempotencyKey?: string;
  }
): Promise<{
  paymentId: string;
  txid: string;
  success: boolean;
  fulfillmentStatus?: string;
  message?: string;
  data?: any;
  errorType?: string;
}> {
  return PiSdkManager.createPayment(
    params
  );
}

/* =========================================================
 * Reset / diagnostics exports
 * ========================================================= */

export function resetPiAuthState(): void {
  PiSdkManager.resetAuthenticationState();
}

export function getPiDiagnostics(): PiSdkDiagnosticState {
  return PiSdkManager.getDiagnosticState();
}

export function getPiSdkDiagnosticState(): PiSdkDiagnosticState {
  return PiSdkManager.getDiagnosticState();
}

export function subscribePiDiagnostics(
  listener: (
    state: PiSdkDiagnosticState
  ) => void
): () => void {
  return PiSdkManager.subscribeDiagnostic(
    listener
  );
}

export function subscribePiSdkDiagnostic(
  listener: (
    state: PiSdkDiagnosticState
  ) => void
): () => void {
  return PiSdkManager.subscribeDiagnostic(
    listener
  );
}

export function subscribePiSdkState(
  listener: (
    state: PiSdkDiagnosticState
  ) => void
): () => void {
  return PiSdkManager.subscribeDiagnostic(
    listener
  );
}

export function setCustomSandboxMode(sandbox: boolean): void {
  PiSdkManager.setCustomSandboxMode(sandbox);
}

export function fetchApiConfiguration(): Promise<'configured' | 'missing'> {
  return PiSdkManager.fetchApiConfiguration();
}

export async function initAndAuthenticateProactively(
  _onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser | null> {
  const inPi = isPiBrowser();
  if (!inPi || isExternalBrowserNonPi()) return null;

  try {
    const ready = await PiSdkManager.initialize();
    if (!ready) return null;

    const existingUser = PiSdkManager.getAuthenticatedUser();
    if (existingUser && (existingUser as any).authenticated) {
      return existingUser;
    }
    return null;
  } catch (err: any) {
    console.warn('[Pi SDK] Proactive init notice:', err?.message || err);
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

  const user = await PiSdkManager.authenticate(['username', 'payments'], onIncompletePaymentFound, false);
  if (!user) {
    throw new Error('Pi authentication is required before payment. Permissions were not granted.');
  }
  return true;
}

export function getPiPaymentStage(): PiPaymentStage {
  return PiSdkManager.getPaymentStage();
}

export function setPiPaymentStage(
  stage: PiPaymentStage
): void {
  PiSdkManager.setPaymentStage(
    stage
  );
}

export function getAuthenticatedPiUser(): PiUser | null {
  return PiSdkManager.getAuthenticatedUser();
}

export function authenticateWithWalletAddress(
  onIncompletePaymentFound?: (payment: PiPayment) => void
): Promise<PiUser> {
  return PiSdkManager.authenticateWithWalletAddress(onIncompletePaymentFound);
}
