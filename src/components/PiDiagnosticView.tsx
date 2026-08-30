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
      const ok = await initPiSdk(diagState.sandbox);
      logPiTrace(`[Pi DIAGNOSTIC UI] initPiSdk() completed with result=${ok}`);
    } catch (err: any) {
      logPiTrace(`[Pi DIAGNOSTIC UI] initPiSdk() exception: ${err?.message || err}`, 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRunAuth = async (force: boolean = false) => {
    setIsAuthenticating(true);
    logPiTrace(`[Pi DIAGNOSTIC UI] Manual trigger: authenticatePiUser(force=${force})`);
    try {
      const user = await authenticatePiUser(undefined, force);
      logPiTrace(`[Pi DIAGNOSTIC UI] authenticatePiUser() succeeded: username=${user.username}`);
    } catch (err: any) {
      logPiTrace(`[Pi DIAGNOSTIC UI] authenticatePiUser() error: ${err?.message || err}`, 'warn');
    } finally {
      setIsAuthenticating(false);
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

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              id="pi-diag-auth-btn"
              disabled={isAuthenticating}
              onClick={() => handleRunAuth(false)}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isAuthenticating ? 'Authenticating...' : 'Step 2: Pi.authenticate()'}
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
