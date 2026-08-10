import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import { isPiBrowser, subscribePiSdkState, getPiSdkDiagnosticState, PiSdkDiagnosticState } from '../lib/piSdk';

interface PiBrowserBannerProps {
  sandboxMode: boolean;
  userBalancePi: number;
}

export const PiBrowserBanner: React.FC<PiBrowserBannerProps> = ({
  sandboxMode
}) => {
  const inPiBrowser = isPiBrowser();
  const [diagState, setDiagState] = useState<PiSdkDiagnosticState>(getPiSdkDiagnosticState());

  useEffect(() => {
    return subscribePiSdkState((st) => setDiagState(st));
  }, []);

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
          {diagState.authState === 'pending' ? (
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-200 px-3 py-0.5 rounded-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-medium text-[11px]">Waiting for Pi Browser authorization…</span>
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
              <span className="hidden lg:inline">Official Pi Browser Connected</span>
            </div>
          )}

          {/* Temporary Safe Diagnostic Badge (Requirement 19) */}
          <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-900/90 border border-purple-500/40 px-2.5 py-0.5 rounded-md text-slate-200">
            <span>SDK: <strong className={diagState.sdkState === 'ready' ? 'text-emerald-400' : 'text-amber-400'}>{diagState.sdkState}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Auth: <strong className={diagState.authState === 'success' ? 'text-emerald-400' : diagState.authState === 'pending' ? 'text-amber-300 animate-pulse' : 'text-slate-400'}>{diagState.authState}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Scope: <strong className={diagState.paymentScope === 'granted' ? 'text-emerald-400' : 'text-rose-400'}>{diagState.paymentScope}</strong></span>
            <span className="text-slate-600">|</span>
            <span>User: <strong className={diagState.userState === 'authenticated' ? 'text-emerald-400' : 'text-slate-400'}>{diagState.username ? `@${diagState.username}` : diagState.userState}</strong></span>
          </div>
        </div>

        {/* Right Side: Network Status */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px] text-emerald-300">PSTP Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
