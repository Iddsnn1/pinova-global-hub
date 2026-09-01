import React from 'react';
import { Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PiUser } from '../../types';

export type AuthStatus = 'disconnected' | 'connecting' | 'connected';

interface ConnectPiButtonProps {
  user: PiUser;
  authStatus?: AuthStatus;
  isConnecting?: boolean;
  onConnect: () => void | Promise<any>;
  variant?: 'header-desktop' | 'header-mobile' | 'profile-card' | 'inline-banner' | 'standalone';
  className?: string;
  errorMessage?: string | null;
}

export const ConnectPiButton: React.FC<ConnectPiButtonProps> = ({
  user,
  authStatus = user?.authenticated ? 'connected' : 'disconnected',
  isConnecting = authStatus === 'connecting',
  onConnect,
  variant = 'header-desktop',
  className = '',
  errorMessage
}) => {
  const isAuthenticated = authStatus === 'connected' || (user?.authenticated && authStatus !== 'disconnected');

  // Handle click with single-flight prevention
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting || isAuthenticated) return;
    onConnect();
  };

  /* =========================================================================
   * Variant 1: Header Desktop (Prominent in top desktop bar)
   * ========================================================================= */
  if (variant === 'header-desktop') {
    if (isAuthenticated) {
      return (
        <div
          id="pi-auth-status-desktop-connected"
          className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/95 border border-emerald-500/50 shadow-sm text-slate-100 ${className}`}
          title={`Connected Pi Account: @${user.username || 'Pioneer'}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0" />
          <div className="flex flex-col text-left leading-none">
            <span className="text-xs font-black text-amber-300 max-w-[120px] truncate">
              @{user.username || 'Pioneer'}
            </span>
            <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
              <span>Connected</span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <button
        id="pi-connect-button-desktop"
        type="button"
        onClick={handleClick}
        disabled={isConnecting}
        aria-busy={isConnecting}
        className={`relative inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl font-black text-xs text-white transition-all shadow-md active:scale-95 disabled:opacity-90 disabled:cursor-wait ${
          isConnecting
            ? 'bg-purple-900 border border-purple-700 text-purple-200'
            : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-500 border border-purple-400/50 hover:border-amber-400 shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.02]'
        } ${className}`}
        title="Connect your verified Pi Network account"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
            <span className="text-[11px] font-bold text-amber-200">Connecting to Pi…</span>
          </>
        ) : (
          <>
            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[11px] leading-none shrink-0 shadow-sm">
              π
            </div>
            <span className="tracking-tight font-extrabold">Connect with Pi</span>
          </>
        )}
      </button>
    );
  }

  /* =========================================================================
   * Variant 2: Header Mobile (Prominent in top mobile bar, >=44px touch target)
   * ========================================================================= */
  if (variant === 'header-mobile') {
    if (isAuthenticated) {
      return (
        <div
          id="pi-auth-status-mobile-connected"
          className={`flex items-center gap-1.5 px-2 py-1.5 min-h-[38px] rounded-xl bg-slate-800/95 border border-emerald-500/50 shadow-sm text-slate-100 shrink-0 ${className}`}
          title={`Connected Pi Account: @${user.username || 'Pioneer'}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse shrink-0" />
          <div className="flex flex-col text-left leading-none max-w-[80px] xs:max-w-[100px] truncate">
            <span className="text-[11px] font-black text-amber-300 truncate">
              @{user.username || 'Pioneer'}
            </span>
            <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider mt-0.5">
              Connected
            </span>
          </div>
        </div>
      );
    }

    return (
      <button
        id="pi-connect-button-mobile"
        type="button"
        onClick={handleClick}
        disabled={isConnecting}
        aria-busy={isConnecting}
        className={`relative inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-[38px] min-w-[110px] rounded-xl font-black text-[11px] text-white transition-all shadow-md active:scale-95 disabled:opacity-90 disabled:cursor-wait shrink-0 ${
          isConnecting
            ? 'bg-purple-950 border border-purple-700 text-purple-200'
            : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 hover:from-purple-600 hover:to-indigo-500 border border-purple-400/60 shadow-purple-900/50'
        } ${className}`}
        title="Connect Pi Account"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
            <span className="text-[10px] font-bold text-amber-200">Connecting…</span>
          </>
        ) : (
          <>
            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] leading-none shrink-0">
              π
            </div>
            <span className="tracking-tight font-extrabold whitespace-nowrap">Connect with Pi</span>
          </>
        )}
      </button>
    );
  }

  /* =========================================================================
   * Variant 3: Profile Card (Prominent display on Profile page)
   * ========================================================================= */
  if (variant === 'profile-card') {
    if (isAuthenticated) {
      return (
        <div
          id="pi-profile-auth-card-connected"
          className={`p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-emerald-500/40 shadow-lg text-white space-y-3 ${className}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                {(user.username || 'Pi').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-300">@{user.username}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected (Testnet)</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">UID: {user.uid || 'Pioneer-Verified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pi Auth v2.0 Ready</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        id="pi-profile-auth-card-disconnected"
        className={`p-6 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-700/60 shadow-xl text-white space-y-4 ${className}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-600/50 text-amber-300 text-xs font-bold">
              <span className="text-amber-400 font-black">π</span>
              <span>Pi Network Pioneer Authentication</span>
            </div>
            <h3 className="text-lg font-black text-white">Connect your Official Pi Account</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authenticate via the native Pi SDK bridge to sync your Pioneer username (@{user?.username || 'user'}), unlock zero-trust escrow payments, and access verified marketplace services.
            </p>
          </div>

          <button
            id="pi-connect-button-profile"
            type="button"
            onClick={handleClick}
            disabled={isConnecting}
            aria-busy={isConnecting}
            className={`px-5 py-3 rounded-xl font-black text-sm text-white transition-all shadow-lg active:scale-95 disabled:opacity-90 disabled:cursor-wait flex items-center gap-2.5 shrink-0 ${
              isConnecting
                ? 'bg-purple-900 border border-purple-600 text-purple-200'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 border border-amber-400/60 shadow-purple-900/50 hover:scale-105'
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Connecting to Pi…</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xs">
                  π
                </div>
                <span>Connect with Pi</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
   * Variant 4: Inline Banner / Standalone
   * ========================================================================= */
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isConnecting || isAuthenticated}
      aria-busy={isConnecting}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-black text-xs text-white transition-all shadow-md active:scale-95 disabled:opacity-90 ${
        isAuthenticated
          ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300 cursor-default'
          : isConnecting
          ? 'bg-purple-900 border border-purple-700 text-purple-200 cursor-wait'
          : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-600 hover:from-purple-600 hover:to-indigo-500 border border-purple-400/60 shadow-purple-900/40'
      } ${className}`}
    >
      {isAuthenticated ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected @{user.username}</span>
        </>
      ) : isConnecting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Connecting to Pi…</span>
        </>
      ) : (
        <>
          <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[11px]">
            π
          </div>
          <span>Connect with Pi</span>
        </>
      )}
    </button>
  );
};
