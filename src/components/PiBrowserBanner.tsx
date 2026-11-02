import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Sparkles, Terminal, ChevronDown, ChevronUp, RefreshCw, Smartphone, Download } from 'lucide-react';
import { isPiBrowser, subscribePiSdkState, getPiSdkDiagnosticState, authenticatePiUser, resetPiAuthState, setCustomSandboxMode, PiSdkDiagnosticState } from '../lib/piSdk';

interface PiBrowserBannerProps {
  sandboxMode: boolean;
  userBalancePi: number;
  onOpenDiagnostics?: () => void;
}

export const PiBrowserBanner: React.FC<PiBrowserBannerProps> = ({
  sandboxMode,
  onOpenDiagnostics
}) => {
  const inPiBrowser = isPiBrowser();
  const [diagState, setDiagState] = useState<PiSdkDiagnosticState>(getPiSdkDiagnosticState());
  const [showDiagPanel, setShowDiagPanel] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installHelp, setInstallHelp] = useState(false);

  const handleCopyAppLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2500);
    } catch (error) {
      console.warn('[PI BANNER] Could not copy app link:', error);
    }
  };

  useEffect(() => {
    return subscribePiSdkState((st) => setDiagState(st));
  }, []);

  useEffect(() => {
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as any);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setInstallHelp(false);
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstallPiNova = async () => {
    if (!installPrompt) {
      setInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleRetryAuth = async () => {
    setIsRetrying(true);
    resetPiAuthState();
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
      case 'AUTH_TIMEOUT':
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
          {!inPiBrowser ? (
            <div className="w-full basis-full rounded-xl border border-amber-400/30 bg-amber-950/35 p-3 sm:p-4 text-amber-100">
              <div className="flex flex-wrap items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-300" />
                <strong className="text-xs sm:text-sm">Standard browser detected</strong>
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">Pi Browser recommended</span>
              </div>
              <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-amber-100/85">
                Open PiNova Global Hub inside Pi Browser to use Pi Network authentication and authorized Pi payment features. Payments still require the normal Pi authorization and server verification steps.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={handleInstallPiNova} className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-400/20">
                  <Download className="h-3.5 w-3.5" />
                  {installPrompt ? 'Install PiNova app' : 'How to install PiNova'}
                </button>
                <button type="button" onClick={handleCopyAppLink} className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 text-[11px] font-bold text-slate-950 transition hover:bg-amber-200">
                  <Smartphone className="h-3.5 w-3.5" />
                  {linkCopied ? 'App link copied' : 'Copy PiNova link for Pi Browser'}
                </button>
                <a href="https://play.google.com/store/apps/details?id=pi.browser" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-amber-200/40 px-3 py-2 text-[11px] font-semibold text-amber-100 transition hover:bg-amber-400/10">
                  <Download className="h-3.5 w-3.5" />
                  Get Pi Browser (Google Play)
                </a>
                {onOpenDiagnostics && (
                  <button type="button" onClick={onOpenDiagnostics} className="inline-flex items-center gap-2 rounded-lg border border-slate-400/30 px-3 py-2 text-[11px] font-semibold text-slate-100 transition hover:bg-white/5">
                    <Terminal className="h-3.5 w-3.5" />
                    Pi connection diagnostics
                  </button>
                )}
              </div>
              {installHelp && (
                <p className="mt-2 rounded-lg border border-emerald-300/20 bg-emerald-400/5 p-2 text-[10px] leading-relaxed text-emerald-100">
                  If your browser offers installation, use its menu and choose “Install app” or “Add to Home screen”. If this option is unavailable, continue using PiNova in your browser. Pi Browser access is still recommended for Pi Network authentication.
                </p>
              )}
              <p className="mt-2 text-[10px] text-amber-200/70">
                After installing, open Pi Browser, sign in, then paste the copied PiNova link into its address bar.
              </p>
            </div>
          ) : diagState.authState === 'AUTH_NATIVE_PENDING' || diagState.authState === 'AUTH_TIMEOUT' ? (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
            </div>
          ) : diagState.authState === 'PI_AUTHENTICATE_UNAVAILABLE' || diagState.authState === 'AUTH_DENIED' || diagState.authState === 'AUTH_ERROR' ? (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-medium text-[11px]">{getStatusText()}</span>
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
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Required Standard Diagnostic Metrics Bar */}
            <div className="p-2 bg-slate-900/90 border border-purple-700/40 rounded-lg grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Pi SDK</span>
                <strong className={diagState.sdkReadyState === 'ready' ? 'text-emerald-400' : 'text-rose-400'}>
                  {diagState.sdkReadyState === 'ready' ? 'READY' : 'NOT READY'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Network</span>
                <strong className={diagState.network === 'SANDBOX' ? 'text-purple-300' : 'text-amber-400'}>
                  {diagState.network}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Pi Auth</span>
                <strong className={diagState.piAuthenticationState === 'success' ? 'text-emerald-400' : diagState.piAuthenticationState === 'pending' ? 'text-amber-400 animate-pulse' : 'text-rose-400'}>
                  {diagState.piAuthenticationState.toUpperCase()}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Payment Scope</span>
                <strong className={diagState.paymentScopeState === 'granted' ? 'text-emerald-400' : 'text-rose-400'}>
                  {diagState.paymentScopeState === 'granted' ? 'GRANTED' : 'NOT GRANTED'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">API Config</span>
                <strong className={diagState.apiConfiguration === 'configured' ? 'text-emerald-400' : 'text-rose-400'}>
                  {diagState.apiConfiguration === 'configured' ? 'CONFIGURED' : 'MISSING'}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                <div><span className="text-slate-500">Authenticated user:</span> <strong className={diagState.username ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{diagState.username ? `@${diagState.username}` : 'none'}</strong></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-slate-500">Production origin:</span> <strong className="text-purple-300 select-all">{diagState.productionOrigin || 'none'}</strong></div>
                <div className="flex items-center gap-1.5"><span className="text-slate-500">Sandbox mode:</span> <button onClick={() => setCustomSandboxMode(!diagState.sandbox)} className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700 font-sans cursor-pointer transition-colors" title="Click to toggle Testnet Sandbox vs Mainnet">{diagState.sandbox ? 'Testnet Sandbox (Active)' : 'Mainnet (Active)'}</button></div>
                <div><span className="text-slate-500">Build commit:</span> <strong className="text-emerald-300 font-bold">{diagState.buildCommit}</strong></div>
              </div>
            </div>
            {onOpenDiagnostics && (
              <div className="pt-2 border-t border-purple-900/40 flex justify-end">
                <button
                  id="pi-banner-open-diag-btn"
                  onClick={onOpenDiagnostics}
                  className="px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded text-[11px] font-sans font-semibold transition"
                >
                  Launch Isolated Pi Diagnostic Suite (/pi-diagnostic) →
                </button>
              </div>
            )}
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
