import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Sparkles, Terminal, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { isPiBrowser, subscribePiSdkState, getPiSdkDiagnosticState, authenticatePiUser, setCustomSandboxMode, PiSdkDiagnosticState } from '../lib/piSdk';

interface PiBrowserBannerProps {
  sandboxMode: boolean;
  userBalancePi: number;
}

export const PiBrowserBanner: React.FC<PiBrowserBannerProps> = ({
  sandboxMode
}) => {
  const inPiBrowser = isPiBrowser();
  const [diagState, setDiagState] = useState<PiSdkDiagnosticState>(getPiSdkDiagnosticState());
  const [showDiagPanel, setShowDiagPanel] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    return subscribePiSdkState((st) => setDiagState(st));
  }, []);

  const handleRetryAuth = async () => {
    if (diagState.hasActiveAuthPromise) return;
    setIsRetrying(true);
    try {
      await authenticatePiUser(undefined, true);
    } catch (err) {
      console.warn('[PI BANNER] Retry auth error:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getStatusText = () => {
    switch (diagState.authState) {
      case 'AUTH_CALL_STARTED':
        return 'Connecting to Pi...';
      case 'AUTH_PROMISE_RETURNED':
        return 'Waiting for Pi Browser authorization...';
      case 'AUTH_NATIVE_PENDING':
        return 'Pi Browser authentication is not responding.';
      case 'PI_AUTHENTICATE_UNAVAILABLE':
        return 'Pi Authentication API unavailable';
      case 'AUTH_DENIED':
        return 'Pi authentication denied.';
      case 'AUTH_ERROR':
        return 'Pi authentication failed.';
      case 'AUTH_SUCCESS':
        return `Connected to Pi (@${diagState.username || 'user'})`;
      case 'AUTH_NOT_STARTED':
      default:
        return 'Connecting to Pi...';
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white text-xs border-b border-purple-800/40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Pi Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-purple-900/60 border border-purple-700/50 text-purple-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pi Network v2.0 SDK</span>
            <span className="text-purple-400 font-bold ml-1">
              ({sandboxMode ? 'Testnet Sandbox' : 'Mainnet'})
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Order Protection Verified</span>
          </div>
        </div>

        {/* Center: Environment & Diagnostic Info */}
        <div className="flex flex-wrap items-center gap-2 text-slate-300">
          {diagState.authState === 'AUTH_PROMISE_RETURNED' || diagState.authState === 'AUTH_CALL_STARTED' ? (
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-200 px-3 py-0.5 rounded-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
            </div>
          ) : diagState.authState === 'AUTH_NATIVE_PENDING' ? (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
            </div>
          ) : diagState.authState === 'PI_AUTHENTICATE_UNAVAILABLE' ? (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
            </div>
          ) : diagState.authState === 'AUTH_DENIED' || diagState.authState === 'AUTH_ERROR' ? (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
            </div>
          ) : !inPiBrowser ? (
            <div className="hidden md:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-0.5 rounded-md">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Web Browser Preview: Non-custodial payments require <strong>Pi Browser</strong>.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-300 mr-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{getStatusText()}</span>
            </div>
          )}

          {/* Retry Button */}
          {inPiBrowser && diagState.authState !== 'AUTH_SUCCESS' && (
            <button
              onClick={handleRetryAuth}
              disabled={diagState.hasActiveAuthPromise || isRetrying}
              className="flex items-center gap-1 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 text-white font-medium text-[11px] px-2.5 py-0.5 rounded border border-purple-500/50 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title="Manually retry Pi Network authentication"
            >
              <RefreshCw className={`w-3 h-3 ${diagState.hasActiveAuthPromise || isRetrying ? 'animate-spin' : ''}`} />
              <span>Retry Pi Authentication</span>
            </button>
          )}

          {/* Diagnostic Summary Badge */}
          <button
            onClick={() => setShowDiagPanel(!showDiagPanel)}
            className="flex items-center gap-2 text-[11px] font-mono bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 px-2.5 py-0.5 rounded-md text-slate-200 transition-colors cursor-pointer"
            title="Click to view full Pi Bridge Diagnostics"
          >
            <Terminal className="w-3 h-3 text-purple-400 shrink-0" />
            <span>Bridge: <strong className={diagState.nativeBridgeState === 'promise_resolved' ? 'text-emerald-400' : diagState.nativeBridgeState.includes('pending') ? 'text-rose-400 animate-pulse' : 'text-amber-300'}>{diagState.nativeBridgeState}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Auth: <strong className={diagState.authState === 'AUTH_SUCCESS' ? 'text-emerald-400' : 'text-amber-300'}>{diagState.authState}</strong></span>
            {showDiagPanel ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        {/* Right Side: Network Status */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px] text-emerald-300">PSTP Protected</span>
          </div>
        </div>
      </div>

      {/* Expandable Diagnostic Panel */}
      {showDiagPanel && (
        <div className="bg-slate-950/95 border-t border-purple-800/40 px-4 py-3 font-mono text-[11px] text-slate-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div><span className="text-slate-500">Pi Browser detected:</span> <strong className={diagState.piEnvDetected ? 'text-emerald-400' : 'text-amber-400'}>{diagState.piEnvDetected ? 'yes' : 'no'}</strong></div>
              <div><span className="text-slate-500">SDK script state:</span> <strong className={diagState.sdkScriptState === 'loaded' ? 'text-emerald-400' : 'text-rose-400'}>{diagState.sdkScriptState}</strong></div>
              <div><span className="text-slate-500">Pi.init status:</span> <strong className={diagState.piInitState === 'success' ? 'text-emerald-400' : 'text-amber-400'}>{diagState.piInitState}</strong></div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">authenticate status:</span> <strong className={diagState.piAuthApiState === 'available' ? 'text-emerald-400' : 'text-rose-400'}>{diagState.piAuthApiState}</strong></div>
              <div><span className="text-slate-500">Invocation count:</span> <strong className="text-purple-300 font-bold">{diagState.authenticateInvocationCount}</strong></div>
              <div><span className="text-slate-500">Authentication state:</span> <strong className={diagState.authState === 'AUTH_SUCCESS' ? 'text-emerald-400' : 'text-amber-300'}>{diagState.authState}</strong></div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Native promise:</span> <strong className={diagState.nativeBridgeState === 'promise_resolved' ? 'text-emerald-400' : diagState.nativeBridgeState.includes('pending') ? 'text-rose-400 animate-pulse' : 'text-amber-300'}>{diagState.nativeBridgeState}</strong></div>
              <div><span className="text-slate-500">Payment scope:</span> <strong className={diagState.paymentScope === 'granted' ? 'text-emerald-400' : 'text-rose-400'}>{diagState.paymentScope}</strong></div>
              <div><span className="text-slate-500">Authenticated username:</span> <strong className={diagState.username ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{diagState.username ? `@${diagState.username}` : 'none'}</strong></div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Production origin:</span> <strong className="text-purple-300 select-all">{diagState.productionOrigin || 'none'}</strong></div>
              <div className="flex items-center gap-1.5"><span className="text-slate-500">Sandbox mode:</span> <button onClick={() => setCustomSandboxMode(!diagState.sandbox)} className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700 font-sans cursor-pointer transition-colors" title="Click to toggle Testnet Sandbox vs Mainnet">{diagState.sandbox ? 'Testnet Sandbox (Active)' : 'Mainnet (Active)'}</button></div>
              <div><span className="text-slate-500">Build commit:</span> <strong className="text-emerald-300 font-bold">{diagState.buildCommit}</strong></div>
            </div>
          </div>
          {diagState.error && (
            <div className="mt-2 text-rose-300 bg-rose-950/40 border border-rose-800/40 p-1.5 rounded flex items-center justify-between gap-2">
              <div>
                <strong className="text-rose-200">Error [{diagState.authErrorType || 'AUTH_ERROR'}]:</strong> {diagState.error}
              </div>
              {inPiBrowser && diagState.authState !== 'AUTH_SUCCESS' && (
                <button
                  onClick={handleRetryAuth}
                  disabled={diagState.hasActiveAuthPromise || isRetrying}
                  className="bg-rose-900/80 hover:bg-rose-800 text-rose-100 px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isRetrying ? 'Retrying...' : 'Retry Now'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
