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
  Smartphone, 
  Globe, 
  Layers
} from 'lucide-react';
import { 
  getPiSdkDiagnosticState, 
  subscribePiSdkState, 
  initPiSdk, 
  authenticatePiUser, 
  resetPiAuthState, 
  isPiBrowser, 
  isSandboxMode,
  setCustomSandboxMode,
  getPiDiagnosticLogs,
  subscribePiDiagnosticLogs,
  logPiTrace,
  PiSdkDiagnosticState
} from '../lib/piSdk';

interface PiDiagnosticViewProps {
  onBackToApp?: () => void;
}

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
      logPiTrace(`[Pi DIAGNOSTIC UI] authenticatePiUser() rejected: ${err?.message || err}`, 'warn');
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

  return (
    <div id="pi-diagnostic-container" className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-900">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight">Pi SDK Isolated Diagnostic Tool</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            This developer module isolates Pi SDK availability, <code className="text-amber-300">Pi.init()</code>, and <code className="text-amber-300">Pi.authenticate()</code> bridge calls.
            It performs zero Duffel queries, zero flight checkout actions, zero payments, and zero escrow operations.
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

      {/* Grid: Environment & SDK Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Environment & Origin */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <Globe className="w-5 h-5 text-indigo-600" />
              <span>Environment & Origin</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Origin:</span>
                <span className="font-mono text-xs font-bold text-slate-800 truncate max-w-[160px]">
                  {diagState.productionOrigin || (typeof window !== 'undefined' ? window.location.origin : 'unknown')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Origin:</span>
                <span className="font-mono text-xs text-slate-700">{diagState.expectedProductionOrigin || 'https://iddsnn.com'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Network:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-xs ${diagState.sandbox ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {diagState.sandbox ? 'SANDBOX (Testnet)' : 'MAINNET (Production)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pi Browser:</span>
                <span className={`font-semibold flex items-center gap-1 text-xs ${diagState.isPiBrowser ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {diagState.isPiBrowser ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-amber-600" />}
                  {diagState.isPiBrowser ? 'Detected' : 'Standard Web'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Iframe State:</span>
                <span className="text-xs font-mono text-slate-700">{diagState.isIframe ? 'Inside Iframe' : 'Top Window'}</span>
              </div>
            </div>
          </div>
          <button
            id="pi-diag-toggle-sandbox-btn"
            onClick={handleToggleSandbox}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            Toggle Mode (Current: {diagState.sandbox ? 'Sandbox' : 'Mainnet'})
          </button>
        </div>

        {/* Card 2: SDK Availability & Bridge Methods */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Pi SDK Bridge Inspection</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">window.Pi:</span>
                <span className={`font-mono text-xs font-bold ${runtimeCheck.hasPi ? 'text-emerald-700' : 'text-red-600'}`}>
                  {runtimeCheck.hasPi ? 'AVAILABLE' : 'UNDEFINED'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pi.init:</span>
                <span className="font-mono text-xs text-slate-700">{runtimeCheck.initType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pi.authenticate:</span>
                <span className="font-mono text-xs text-slate-700">{runtimeCheck.authType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pi.createPayment:</span>
                <span className="font-mono text-xs text-slate-700">{runtimeCheck.createPaymentType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">SDK Initialized:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-xs ${diagState.piInitState === 'success' ? 'bg-emerald-100 text-emerald-800' : diagState.piInitState === 'failed' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>
                  {diagState.piInitState}
                </span>
              </div>
            </div>
          </div>
          <button
            id="pi-diag-init-btn"
            disabled={isInitializing}
            onClick={handleRunInit}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {isInitializing ? 'Running Pi.init()...' : 'Step 1: Test Pi.init()'}
          </button>
        </div>

        {/* Card 3: Live Authentication Bridge State */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <span>Authentication Status</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Lifecycle State:</span>
                <span className={`font-mono text-xs font-semibold ${diagState.authState === 'AUTH_SUCCESS' ? 'text-emerald-700' : diagState.authState.includes('ERROR') || diagState.authState.includes('UNAVAILABLE') ? 'text-red-600' : 'text-amber-700'}`}>
                  {diagState.authState}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bridge State:</span>
                <span className="font-mono text-xs text-slate-700">{diagState.nativeBridgeState}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Active Request Lock:</span>
                <span className="font-mono text-xs text-slate-700">{diagState.activeAuthRequest ? 'LOCKED (1 in flight)' : 'UNLOCKED (idle)'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Attempt ID:</span>
                <span className="font-mono text-xs text-slate-700 truncate max-w-[150px]">{diagState.authAttemptId || 'none'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Authenticated User:</span>
                <span className="font-bold text-xs text-slate-900">{diagState.username ? `@${diagState.username}` : 'Not Authenticated'}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              id="pi-diag-auth-btn"
              disabled={isAuthenticating}
              onClick={() => handleRunAuth(false)}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isAuthenticating ? 'Calling...' : 'Step 2: Pi.authenticate()'}
            </button>
            <button
              id="pi-diag-reset-btn"
              onClick={handleResetState}
              title="Reset State / Clear Locks"
              className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Warning Banner if in Error State */}
      {diagState.error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-amber-900">Current Authentication Notice: </span>
            <span className="text-amber-800">{diagState.error}</span>
            {diagState.lastErrorCode && (
              <span className="ml-2 font-mono text-xs bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-900">
                Code: {diagState.lastErrorCode}
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
            <h2 className="text-sm font-semibold text-slate-200">Real-Time Isolated Pi Trace Logs</h2>
            <span className="text-xs text-slate-500 font-mono">({logs.length} events recorded)</span>
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
              No diagnostic events logged yet. Tap "Step 1: Test Pi.init()" or "Step 2: Test Pi.authenticate()" above to begin isolation trace.
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
                    : item.message.includes('[Pi AUTH TRACE]') 
                    ? 'text-emerald-300' 
                    : item.message.includes('[Pi INIT TRACE]') 
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
