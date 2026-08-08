import React from 'react';
import { ShieldCheck, Info, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { isPiBrowser } from '../lib/piSdk';

interface PiBrowserBannerProps {
  sandboxMode: boolean;
  userBalancePi: number;
}

export const PiBrowserBanner: React.FC<PiBrowserBannerProps> = ({
  sandboxMode,
  userBalancePi
}) => {
  const inPiBrowser = isPiBrowser();

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

        {/* Center: Environment info */}
        <div className="hidden md:flex items-center gap-2 text-slate-300">
          {!inPiBrowser ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-0.5 rounded-md">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Web Browser Preview: Pi SDK fallback active. Non-custodial payment approval relies on Official Pi SDK v2 & Pi Platform API inside <strong>Pi Browser</strong>.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Pi Browser Connected — Non-custodial Pi Platform API Active</span>
            </div>
          )}
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
