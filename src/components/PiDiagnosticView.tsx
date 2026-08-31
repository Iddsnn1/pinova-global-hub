import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Play, 
  KeyRound, 
  CreditCard,
  Globe, 
  Layers
} from 'lucide-react';
import { 
  getPiSdkDiagnosticState, 
  subscribePiSdkState, 
  initPiSdk, 
  authenticatePiUser, 
  resetPiAuthState, 
  setCustomSandboxMode,
  clearCustomSandboxOverride,
  getPiDiagnosticLogs,
  subscribePiDiagnosticLogs,
  logPiTrace,
  PiSdkDiagnosticState,
  PiAuthState,
  PiPaymentStage
} from '../lib/piSdk';

interface PiDiagnosticViewProps {
  onBackToApp?: () => void;
}

interface RawSdkTestState {
  state: 'idle' | 'running' | 'resolved' | 'rejected' | 'timeout';
  scopesTested: string[] | null;
  invokedAtIso: string | null;
  resolvedAtIso: string | null;
  rejectedAtIso: string | null;
  elapsedMs: number | null;
  rawResponseSummary: {
    hasUser: boolean;
    username?: string;
    uid?: string;
    hasAccessToken: boolean;
    tokenLength?: number;
    rawKeys?: string[];
  } | null;
  rawErrorMessage: string | null;
  incompletePaymentDetected: boolean;
  incompletePaymentId?: string;
}

const AUTH_STAGES: PiAuthState[] = [
  'IDLE',
  'INITIALIZING',
  'AUTHENTICATING',
  'AUTHENTICATED',
  'TIMEOUT',
  'REJECTED',
  'FAILED'
];

const PAYMENT_STAGES: PiPaymentStage[] = [
  'IDLE',
  'CREATING_PAYMENT',
  'WAITING_FOR_PI_APPROVAL',
  'WAITING_FOR_PI_COMPLETION',
  'SERVER_VERIFICATION',
  'ESCROW_FULFILLMENT',
  'COMPLETED',
  'FAILED'
];

export const PiDiagnosticView: React.FC<PiDiagnosticViewProps> = ({ onBackToApp }) => {
  const [diagState, setDiagState] = useState<PiSdkDiagnosticState>(getPiSdkDiagnosticState());
  const [logs, setLogs] = useState<{ timestamp: string; message: string; type: 'info' | 'warn' | 'error' }[]>(getPiDiagnosticLogs());
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rawTestState, setRawTestState] = useState<RawSdkTestState>({
    state: 'idle',
    scopesTested: null,
    invokedAtIso: null,
    resolvedAtIso: null,
    rejectedAtIso: null,
    elapsedMs: null,
    rawResponseSummary: null,
    rawErrorMessage: null,
    incompletePaymentDetected: false
  });

  useEffect(() => {
    const unsubState = subscribePiSdkState((newState) => {
      setDiagState(newState);
    });
    const unsubLogs = subscribePiDiagnosticLogs((newLogs) => {
      setLogs(newLogs);
    });
    return () => {
      unsubState();
      unsubLogs();
    };
  }, []);

  const handleRunInit = async () => {
    setIsInitializing(true);
    logPiTrace('[Pi DIAGNOSTIC UI] Manual trigger: initPiSdk()');
    try {
      const ok = await initPiSdk();
      logPiTrace(`[Pi DIAGNOSTIC UI] initPiSdk() completed with result=${ok}`);
    } catch (err: any) {
      logPiTrace(`[Pi DIAGNOSTIC UI] initPiSdk() exception: ${err?.message || err}`, 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRunAuth = async (scopes?: string[], force: boolean = false) => {
    setIsAuthenticating(true);
    const scopeLabel = scopes ? JSON.stringify(scopes) : 'standard ["username", "payments"]';
    logPiTrace(`[Pi DIAGNOSTIC UI] Manual trigger: authenticatePiUser(scopes=${scopeLabel}, force=${force})`);
    try {
      const user = await authenticatePiUser(scopes, force);
      logPiTrace(`[Pi DIAGNOSTIC UI] authenticatePiUser() succeeded: username=${user.username}`);
    } catch (err: any) {
      logPiTrace(`[Pi DIAGNOSTIC UI] authenticatePiUser() error: ${err?.message || err}`, 'warn');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRunRawSdkTest = async (scopes: string[] = ['username', 'payments']) => {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      const now = new Date().toISOString();
      setRawTestState({
        state: 'rejected',
        scopesTested: scopes,
        invokedAtIso: now,
        resolvedAtIso: null,
        rejectedAtIso: now,
        elapsedMs: 0,
        rawResponseSummary: null,
        rawErrorMessage: 'window.Pi object is not available on global scope.',
        incompletePaymentDetected: false
      });
      return;
    }

    if (typeof (window as any).Pi.authenticate !== 'function') {
      const now = new Date().toISOString();
      setRawTestState({
        state: 'rejected',
        scopesTested: scopes,
        invokedAtIso: now,
        resolvedAtIso: null,
        rejectedAtIso: now,
        elapsedMs: 0,
        rawResponseSummary: null,
        rawErrorMessage: 'window.Pi.authenticate is not a function.',
        incompletePaymentDetected: false
      });
      return;
    }

    const startTime = Date.now();
    const invokedIso = new Date(startTime).toISOString();

    setRawTestState({
      state: 'running',
      scopesTested: scopes,
      invokedAtIso: invokedIso,
      resolvedAtIso: null,
      rejectedAtIso: null,
      elapsedMs: null,
      rawResponseSummary: null,
      rawErrorMessage: null,
      incompletePaymentDetected: false
    });

    logPiTrace(`[RAW SDK TEST] Direct window.Pi.authenticate() started with scopes=${JSON.stringify(scopes)} (bypassing app manager)`);

    const onIncomplete = (payment: any) => {
      logPiTrace(`[RAW SDK TEST] onIncompletePaymentFound callback received: paymentId=${payment?.identifier}`);
      setRawTestState((prev) => ({
        ...prev,
        incompletePaymentDetected: true,
        incompletePaymentId: payment?.identifier
      }));
    };

    try {
      const rawPromise = (window as any).Pi.authenticate(scopes, onIncomplete);
      
      let timeoutHandle: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          const err = new Error('Raw native window.Pi.authenticate() timed out after 25 seconds.');
          (err as any).code = 'RAW_AUTH_TIMEOUT';
          reject(err);
        }, 25000);
      });

      const result = await Promise.race([rawPromise, timeoutPromise]).finally(() => {
        clearTimeout(timeoutHandle);
      });

      const elapsed = Date.now() - startTime;
      const resolvedIso = new Date().toISOString();

      const summary = {
        hasUser: Boolean(result?.user),
        username: result?.user?.username,
        uid: result?.user?.uid,
        hasAccessToken: Boolean(result?.accessToken),
        tokenLength: result?.accessToken?.length,
        rawKeys: result && typeof result === 'object' ? Object.keys(result) : []
      };

      logPiTrace(`[RAW SDK TEST] Direct window.Pi.authenticate() RESOLVED in ${elapsed}ms: username=${summary.username}`);

      setRawTestState({
        state: 'resolved',
        scopesTested: scopes,
        invokedAtIso: invokedIso,
        resolvedAtIso: resolvedIso,
        rejectedAtIso: null,
        elapsedMs: elapsed,
        rawResponseSummary: summary,
        rawErrorMessage: null,
        incompletePaymentDetected: false
      });
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      const rejectedIso = new Date().toISOString();
      const isTimeout = err?.code === 'RAW_AUTH_TIMEOUT' || String(err?.message || '').includes('timed out');
      const errMsg = err?.message || String(err);

      logPiTrace(`[RAW SDK TEST] Direct window.Pi.authenticate() ${isTimeout ? 'TIMED OUT' : 'REJECTED'} in ${elapsed}ms: ${errMsg}`, 'warn');

      setRawTestState({
        state: isTimeout ? 'timeout' : 'rejected',
        scopesTested: scopes,
        invokedAtIso: invokedIso,
        resolvedAtIso: null,
        rejectedAtIso: rejectedIso,
        elapsedMs: elapsed,
        rawResponseSummary: null,
        rawErrorMessage: errMsg,
        incompletePaymentDetected: false
      });
    }
  };

  const handleResetState = () => {
    logPiTrace('[Pi DIAGNOSTIC UI] Manual trigger: resetPiAuthState()');
    resetPiAuthState();
  };

  const handleToggleSandbox = () => {
    const nextMode = !diagState.sandbox;
    logPiTrace(`[Pi DIAGNOSTIC UI] Switching network mode to ${nextMode ? 'SANDBOX' : 'MAINNET'}`);
    setCustomSandboxMode(nextMode);
  };

  const handleClearOverride = () => {
    logPiTrace('[Pi DIAGNOSTIC UI] Clearing manual sandbox override from localStorage');
    clearCustomSandboxOverride();
    initPiSdk();
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runtimeCheck = diagState.runtimeCheck || {
    hasPi: typeof window !== 'undefined' && Boolean((window as any).Pi),
    initType: typeof window !== 'undefined' && (window as any).Pi ? typeof (window as any).Pi.init : 'undefined',
    authType: typeof window !== 'undefined' && (window as any).Pi ? typeof (window as any).Pi.authenticate : 'undefined',
    createPaymentType: typeof window !== 'undefined' && (window as any).Pi ? typeof (window as any).Pi.createPayment : 'undefined'
  };

  const isOfficialOrigin = diagState.productionOrigin === 'https://iddsnn.com' || diagState.productionOrigin.includes('iddsnn.com');
  const envDetails = diagState.environmentDetails;

  return (
    <div id="pi-diagnostic-container" className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight">Pi Network SDK Diagnostic & Inspection</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Live developer telemetry for Pi Browser integration, <code className="text-amber-300">Pi.init()</code>, and <code className="text-amber-300">Pi.authenticate()</code>.
            Zero sensitive credentials, tokens, or private secrets are displayed.
          </p>
        </div>
        {onBackToApp && (
          <button
            id="pi-diag-back-btn"
            onClick={onBackToApp}
            className="self-start md:self-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 transition"
          >
            ← Back to PiNova App
          </button>
        )}
      </div>

      {/* Network Environment Resolver Inspection Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-5 border border-purple-800/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold text-base">Pi Network Environment Resolution</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              diagState.environmentConsistency === 'CONSISTENT'
                ? 'bg-emerald-600/90 text-emerald-100 border border-emerald-400/60'
                : 'bg-rose-600/90 text-rose-100 border border-rose-400/60'
            }`}>
              Configuration: {diagState.environmentConsistency || 'CONSISTENT'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              diagState.network === 'SANDBOX'
                ? 'bg-purple-600/90 text-purple-100 border border-purple-400/60'
                : 'bg-amber-600/90 text-amber-100 border border-amber-400/60'
            }`}>
              Active Network: {diagState.network === 'SANDBOX' ? 'TESTNET' : 'MAINNET'} (sandbox={diagState.sandbox ? 'true' : 'false'})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
            <span className="text-slate-400 block font-medium">Configured Network</span>
            <span className="font-mono text-purple-300 font-bold">{diagState.configuredNetwork === 'SANDBOX' ? 'TESTNET' : 'MAINNET'}</span>
            <div className="text-[11px] text-slate-400 pt-0.5">
              effectiveSandbox: <strong className={diagState.effectiveSandbox ? 'text-purple-300' : 'text-amber-400'}>{String(diagState.effectiveSandbox)}</strong>
            </div>
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
            <span className="text-slate-400 block font-medium">Environment Source</span>
            <span className="font-mono text-purple-300 font-bold truncate block">{diagState.environmentSource || envDetails?.source || 'DEFAULT_FALLBACK'}</span>
            <p className="text-[11px] text-slate-400 pt-0.5">
              Domain <code className="text-slate-300">iddsnn.com</code> is decoupled from network resolution.
            </p>
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
            <span className="text-slate-400 block font-medium">SDK Init Telemetry</span>
            <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>version: <strong className="text-emerald-400">"2.0"</strong></div>
              <div>effectiveSandbox: <strong className={diagState.effectiveSandbox ? 'text-purple-300' : 'text-amber-400'}>{String(diagState.effectiveSandbox)}</strong></div>
              <div>sdkInitSandbox: <strong className={diagState.sdkInitSandbox === null || diagState.sdkInitSandbox === undefined ? 'text-slate-400' : diagState.sdkInitSandbox ? 'text-purple-300' : 'text-amber-400'}>{diagState.sdkInitSandbox === null || diagState.sdkInitSandbox === undefined ? 'not_invoked' : String(diagState.sdkInitSandbox)}</strong></div>
              <div>initCount: <strong className="text-slate-200">{diagState.sdkInitializationCount ?? 0}</strong></div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
            <span className="text-slate-400 block font-medium">Environment Controls</span>
            <div className="flex items-center gap-2 pt-1">
              <button
                id="pi-diag-switch-network-btn"
                onClick={handleToggleSandbox}
                className="flex-1 py-1.5 px-2 bg-purple-700 hover:bg-purple-600 text-white rounded text-[11px] font-semibold transition"
              >
                Switch to {diagState.sandbox ? 'Mainnet' : 'Sandbox (Testnet)'}
              </button>
              {envDetails?.source === 'LOCAL_STORAGE_OVERRIDE' && (
                <button
                  id="pi-diag-clear-override-btn"
                  onClick={handleClearOverride}
                  title="Clear Local Storage Override"
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {diagState.conflictWarning && (
          <div className="mt-3 p-2.5 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{diagState.conflictWarning}</span>
          </div>
        )}
      </div>

      {/* Grid 1: Pi SDK Core State & Origin Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Pi SDK Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Pi SDK State</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                diagState.sdkReadyState === 'ready' 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
              }`}>
                {diagState.sdkReadyState.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Pi object available:</span>
                <span className={`font-mono text-xs font-bold ${runtimeCheck.hasPi ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {runtimeCheck.hasPi ? 'true (window.Pi present)' : 'false (window.Pi undefined)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">SDK initialized:</span>
                <span className={`font-mono text-xs font-bold ${diagState.piInitState === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {diagState.piInitState === 'success' ? 'true' : 'false'} ({diagState.piInitState})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Pi Browser detected:</span>
                <span className={`font-mono text-xs font-bold flex items-center gap-1 ${diagState.isPiBrowser ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {diagState.isPiBrowser ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {diagState.isPiBrowser ? 'true (Pi Environment)' : 'false (Standard Web)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Native auth capability:</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {runtimeCheck.authType === 'function' ? 'available (function)' : 'unavailable'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">SDK initialization status:</span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{diagState.piInitState}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Authentication status:</span>
                <span className={`font-mono text-xs font-bold ${
                  diagState.authState === 'AUTHENTICATED' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : diagState.authState === 'AUTHENTICATING' || diagState.authState === 'INITIALIZING'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : diagState.authState === 'TIMEOUT' || diagState.authState === 'REJECTED' || diagState.authState === 'FAILED'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {diagState.authState}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              id="pi-diag-init-btn"
              disabled={isInitializing}
              onClick={handleRunInit}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isInitializing ? 'Running Pi.init()...' : 'Step 1: Test Pi.init()'}
            </button>
            <button
              id="pi-diag-toggle-sandbox-btn"
              onClick={handleToggleSandbox}
              className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              Network: {diagState.sandbox ? 'Sandbox' : 'Mainnet'}
            </button>
          </div>
        </div>

        {/* Card 2: Origin & Registration Verification */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Domain & Origin Verification</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                isOfficialOrigin 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
              }`}>
                {diagState.originClassification || 'ORIGIN_VERIFIED'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Current origin:</span>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {diagState.productionOrigin || (typeof window !== 'undefined' ? window.location.origin : 'unknown')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Expected/registered origin:</span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{diagState.expectedProductionOrigin || 'https://iddsnn.com'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Origin match status:</span>
                <span className={`font-mono text-xs font-semibold ${isOfficialOrigin ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {isOfficialOrigin ? 'OFFICIAL REGISTERED DOMAIN' : 'PREVIEW / ALTERNATE HOST'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Authenticated user:</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {diagState.username ? `@${diagState.username}` : 'Not Authenticated'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Payment scope:</span>
                <span className={`font-mono text-xs font-bold ${diagState.paymentScope === 'granted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {diagState.paymentScope.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                id="pi-diag-auth-btn"
                disabled={isAuthenticating}
                onClick={() => handleRunAuth(undefined, true)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                {isAuthenticating ? 'Authenticating...' : 'Test Full Scopes'}
              </button>
              <button
                id="pi-diag-auth-minimal-btn"
                disabled={isAuthenticating}
                onClick={() => handleRunAuth(['username', 'payments'], true)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                title="Diagnostic Scope Isolation Test: ['username', 'payments']"
              >
                <Play className="w-3.5 h-3.5" />
                Test Standard Scopes
              </button>
              <button
                id="pi-diag-reset-btn"
                onClick={handleResetState}
                title="Reset State / Clear Locks"
                className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section C & D: 5-Stage Native Bridge Readiness & Passive Bridge Message Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 5-Stage Native Bridge Readiness Breakdown */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-sm">5-Stage Native Bridge Readiness Diagnostic</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Strict Layer Isolation</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Stage 1: JS SDK Available */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-bold">Stage 1: JS SDK Available</div>
                  <div className="text-slate-500 text-[10px]">window.Pi !== undefined</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  diagState.bridgeReadinessTelemetry?.jsSdkAvailable
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {diagState.bridgeReadinessTelemetry?.jsSdkAvailable ? 'PASS (AVAILABLE)' : 'FAIL (UNDEFINED)'}
                </span>
              </div>

              {/* Stage 2: Pi SDK Initialized */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-bold">Stage 2: Pi.init() Executed</div>
                  <div className="text-slate-500 text-[10px]">version="2.0", sandbox={String(diagState.sandbox)}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  diagState.bridgeReadinessTelemetry?.sdkInitialized
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {diagState.bridgeReadinessTelemetry?.sdkInitialized ? 'PASS (INITIALIZED)' : 'NOT_INITIALIZED'}
                </span>
              </div>

              {/* Stage 3: Pi Browser Environment Detected */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-bold">Stage 3: Pi Browser Environment</div>
                  <div className="text-slate-500 text-[10px]">User-Agent & Pi WebView signals</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  diagState.bridgeReadinessTelemetry?.piBrowserDetected
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {diagState.bridgeReadinessTelemetry?.piBrowserDetected ? 'PASS (PI_BROWSER)' : 'STANDARD_BROWSER'}
                </span>
              </div>

              {/* Stage 4: Native Bridge Callable */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-bold">Stage 4: Bridge Function Callable</div>
                  <div className="text-slate-500 text-[10px]">typeof window.Pi.authenticate === "function"</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  diagState.bridgeReadinessTelemetry?.bridgeCallable
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {diagState.bridgeReadinessTelemetry?.bridgeCallable ? 'PASS (CALLABLE)' : 'UNAVAILABLE'}
                </span>
              </div>

              {/* Stage 5: Bridge Responding (Resolved/Rejected vs Hung) */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-300 font-bold">Stage 5: Native Bridge Responsiveness</div>
                  <div className="text-slate-500 text-[10px]">Promise settlement vs 25s timeout hang</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  diagState.bridgeReadinessTelemetry?.bridgeResponding === 'responding'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : diagState.bridgeReadinessTelemetry?.bridgeResponding === 'timed_out'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : diagState.bridgeReadinessTelemetry?.bridgeResponding === 'pending'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {diagState.bridgeReadinessTelemetry?.bridgeResponding === 'responding'
                    ? 'RESPONDING (ACTIVE)'
                    : diagState.bridgeReadinessTelemetry?.bridgeResponding === 'timed_out'
                    ? 'NO RESPONSE (HUNG)'
                    : diagState.bridgeReadinessTelemetry?.bridgeResponding === 'pending'
                    ? 'AWAITING RESPONSE'
                    : 'UNTESTED'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Script Source: <code className="text-slate-300">{diagState.sdkLoadingTelemetry?.scriptSrc || 'https://sdk.minepi.com/pi-sdk.js'}</code> (count: {diagState.sdkLoadingTelemetry?.scriptCount ?? 1}, readyState: {diagState.sdkLoadingTelemetry?.scriptReadyState || 'complete'})
          </div>
        </div>

        {/* Passive PostMessage & Bridge Event Inspector */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-sm">Passive PostMessage & Bridge Inspector</span>
              </div>
              <span className="text-[11px] font-mono text-purple-300">Sanitized (Zero Secrets)</span>
            </div>

            <div className="h-56 overflow-y-auto font-mono text-xs space-y-1.5 pr-1">
              {!diagState.bridgeEvents || diagState.bridgeEvents.length === 0 ? (
                <div className="text-slate-500 italic py-12 text-center text-xs">
                  No postMessage bridge events detected yet. Bridge inspection is passively monitoring `window.onmessage`.
                </div>
              ) : (
                diagState.bridgeEvents.map((evt) => (
                  <div key={evt.id} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-purple-300 font-bold">[{evt.direction}] {evt.eventType}</span>
                      <span className="text-slate-500 text-[10px]">{evt.timestamp.split('T')[1]?.slice(0, 8)}</span>
                    </div>
                    <div className="text-slate-400 text-[10px] flex justify-between">
                      <span>origin: <strong className="text-slate-300">{evt.origin}</strong></span>
                      <span>source: <strong className="text-slate-300">{evt.sourceWindow}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Doc Visibility: <strong className="text-slate-200">{diagState.initLifecycleTelemetry?.documentVisibilityState || 'visible'}</strong></span>
            <span>Lifecycle: <strong className="text-slate-200">{diagState.initLifecycleTelemetry?.pageLifecycleState || 'active'}</strong></span>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span className="font-semibold">Native Bridge & Scope Diagnostic Telemetry</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
            diagState.diagnosticCategory === 'CATEGORY_E_AUTH_SCOPE_COMPATIBILITY'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : diagState.diagnosticCategory === 'CATEGORY_D_AUTH_NO_RESPONSE'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : diagState.authPromiseState === 'resolved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-300'
          }`}>
            {diagState.diagnosticCategory || `BRIDGE_${diagState.nativeBridgeState.toUpperCase()}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Scopes Requested</span>
            <span className="text-purple-300 font-bold break-all">
              {JSON.stringify(diagState.authScopesRequested || [])}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Invocation Count</span>
            <span className="text-emerald-400 font-bold text-sm">
              {diagState.authInvocationCount || 0}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Promise State</span>
            <span className={`font-bold text-sm ${
              diagState.authPromiseState === 'resolved'
                ? 'text-emerald-400'
                : diagState.authPromiseState === 'pending'
                ? 'text-indigo-400'
                : diagState.authPromiseState === 'timed_out' || diagState.authPromiseState === 'rejected'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}>
              {diagState.authPromiseState || 'idle'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Bridge State</span>
            <span className="text-cyan-300 font-bold">
              {diagState.nativeBridgeState || 'idle'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Auth Timeout</span>
            <span className="text-amber-300 font-bold">
              {(diagState.authTimeout || 25000) / 1000}s
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Resolution Time</span>
            <span className="text-emerald-400 font-bold">
              {diagState.authResolutionTimeMs !== null ? `${diagState.authResolutionTimeMs}ms` : '—'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Rejection Time</span>
            <span className="text-rose-400 font-bold">
              {diagState.authRejectionTimeMs !== null ? `${diagState.authRejectionTimeMs}ms` : '—'}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Standard Scopes <code className="text-purple-300">['username', 'payments']</code>:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              diagState.standardScopesResult === 'resolved'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : diagState.standardScopesResult === 'timed_out'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {diagState.standardScopesResult || 'not_tested'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Full Scopes <code className="text-purple-300">['username', 'payments', 'wallet_address']</code>:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              diagState.fullScopesResult === 'resolved'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : diagState.fullScopesResult === 'timed_out'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {diagState.fullScopesResult || 'not_tested'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2.5: True Raw Native SDK Isolation Test (Direct window.Pi.authenticate Bypass) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/50">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-semibold text-base text-slate-100">True Raw Native SDK Isolation Test</h3>
              <p className="text-slate-400 text-xs">
                Directly invokes native <code className="text-cyan-300">window.Pi.authenticate()</code> without application wrappers, locks, or state dependencies.
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider self-start sm:self-auto ${
            rawTestState.state === 'resolved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : rawTestState.state === 'running'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse'
              : rawTestState.state === 'rejected' || rawTestState.state === 'timeout'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}>
            RAW STATUS: {rawTestState.state.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-xs font-mono">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-900/30">
            <span className="text-slate-500 block text-[10px] uppercase">Scopes Tested</span>
            <span className="text-purple-300 font-bold break-all">
              {rawTestState.scopesTested ? JSON.stringify(rawTestState.scopesTested) : 'None (idle)'}
            </span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-900/30">
            <span className="text-slate-500 block text-[10px] uppercase">Invoked At</span>
            <span className="text-slate-200 font-bold truncate block">
              {rawTestState.invokedAtIso ? rawTestState.invokedAtIso.split('T')[1]?.slice(0, 12) : '—'}
            </span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-900/30">
            <span className="text-slate-500 block text-[10px] uppercase">Elapsed Duration</span>
            <span className={`text-sm font-bold ${
              rawTestState.elapsedMs !== null
                ? rawTestState.state === 'resolved'
                  ? 'text-emerald-400'
                  : 'text-rose-400'
                : 'text-slate-400'
            }`}>
              {rawTestState.elapsedMs !== null ? `${rawTestState.elapsedMs}ms` : '—'}
            </span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-900/30">
            <span className="text-slate-500 block text-[10px] uppercase">Incomplete Payment</span>
            <span className={`font-bold ${rawTestState.incompletePaymentDetected ? 'text-amber-400' : 'text-slate-400'}`}>
              {rawTestState.incompletePaymentDetected ? `Found: ${rawTestState.incompletePaymentId || 'yes'}` : 'None'}
            </span>
          </div>
        </div>

        {rawTestState.rawResponseSummary && (
          <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-emerald-800/40 text-xs font-mono">
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Raw Bridge Response Received Successfully:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
              <div>user.username: <strong className="text-emerald-300">@{rawTestState.rawResponseSummary.username || 'present'}</strong></div>
              <div>user.uid: <strong className="text-emerald-300">{rawTestState.rawResponseSummary.uid ? 'present (valid)' : 'none'}</strong></div>
              <div>accessToken: <strong className="text-emerald-300">{rawTestState.rawResponseSummary.hasAccessToken ? `present (${rawTestState.rawResponseSummary.tokenLength} chars)` : 'none'}</strong></div>
              <div>keys: <strong className="text-purple-300">{JSON.stringify(rawTestState.rawResponseSummary.rawKeys || [])}</strong></div>
            </div>
          </div>
        )}

        {rawTestState.rawErrorMessage && (
          <div className="mt-3 p-3 bg-rose-950/60 rounded-xl border border-rose-800/40 text-xs font-mono text-rose-300">
            <div className="text-rose-400 font-bold mb-1 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              Raw Bridge Error:
            </div>
            <div>{rawTestState.rawErrorMessage}</div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-indigo-900/40 flex flex-wrap gap-2">
          <button
            id="pi-diag-raw-auth-standard-btn"
            disabled={rawTestState.state === 'running'}
            onClick={() => handleRunRawSdkTest(['username', 'payments'])}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {rawTestState.state === 'running' && rawTestState.scopesTested?.length === 2 ? 'Testing Raw Standard...' : 'Run Raw Native Auth (Standard: [username, payments])'}
          </button>
          <button
            id="pi-diag-raw-auth-extended-btn"
            disabled={rawTestState.state === 'running'}
            onClick={() => handleRunRawSdkTest(['username', 'payments', 'wallet_address'])}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {rawTestState.state === 'running' && rawTestState.scopesTested?.length === 3 ? 'Testing Raw Full...' : 'Run Raw Native Auth (Extended: [username, payments, wallet_address])'}
          </button>
        </div>
      </div>

      {/* Grid 2: Explicit Authentication & Payment State Machine Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Authentication State Machine */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
            <KeyRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Authentication State Lifecycle</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            {AUTH_STAGES.map((st) => {
              const isActive = diagState.authState === st;
              return (
                <div
                  key={st}
                  className={`p-2 rounded-xl border transition ${
                    isActive
                      ? st === 'AUTHENTICATED'
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-500/20'
                        : st === 'TIMEOUT' || st === 'REJECTED' || st === 'FAILED'
                        ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-500/20'
                        : 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase opacity-75">{st}</div>
                  <div className="text-xs font-bold">{isActive ? '● ACTIVE' : '○'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment State Machine */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Payment State Lifecycle</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            {PAYMENT_STAGES.map((st) => {
              const current = diagState.currentPaymentStage || 'IDLE';
              const isActive = current === st;
              return (
                <div
                  key={st}
                  className={`p-2 rounded-xl border transition ${
                    isActive
                      ? st === 'COMPLETED'
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md shadow-emerald-500/20'
                        : st === 'FAILED' || st === 'CANCELLED' || st === 'TIMEOUT'
                        ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-500/20'
                        : 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-[9px] uppercase truncate opacity-75" title={st}>{st}</div>
                  <div className="text-xs font-bold">{isActive ? '● ACTIVE' : '○'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Warning Banner if in Error State */}
      {diagState.error && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-amber-900 dark:text-amber-200">Authentication Diagnostic Status: </span>
            <span className="text-amber-800 dark:text-amber-300">{diagState.error}</span>
            {diagState.diagnosticCategory && (
              <span className="ml-2 font-mono text-xs bg-rose-200/80 dark:bg-rose-900/80 px-2 py-0.5 rounded text-rose-950 dark:text-rose-100 font-bold">
                {diagState.diagnosticCategory}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Section: Live Diagnostic Log Stream */}
      <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-200">Real-Time Safe Diagnostic Logs (No Credentials)</h2>
            <span className="text-xs text-slate-500 font-mono">({logs.length} events)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="pi-diag-copy-logs-btn"
              onClick={handleCopyLogs}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy Logs'}
            </button>
          </div>
        </div>

        <div className="h-64 overflow-y-auto font-mono text-xs space-y-1 pr-2">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic py-8 text-center">
              No diagnostic events logged yet. Tap "Step 1: Test Pi.init()" or "Step 2: Pi.authenticate()" above to begin isolation trace.
            </div>
          ) : (
            logs.map((item, idx) => (
              <div 
                key={idx} 
                className={`py-0.5 flex gap-2 ${
                  item.type === 'error' 
                    ? 'text-red-400' 
                    : item.type === 'warn' 
                    ? 'text-amber-300' 
                    : item.message.includes('[Pi AUTH_') 
                    ? 'text-emerald-300' 
                    : item.message.includes('[Pi INIT_') 
                    ? 'text-cyan-300' 
                    : 'text-slate-300'
                }`}
              >
                <span className="text-slate-600 select-none">[{item.timestamp.split('T')[1]?.slice(0, 8) || item.timestamp}]</span>
                <span className="break-all">{item.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
