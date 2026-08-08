import React from 'react';
import { X, Bell, CheckCircle2, ShieldCheck, MessageSquare, Info, FileText, Lock, ArrowUpRight, Zap } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onMarkAllRead
}) => {
  const getNotificationIconAndStyle = (type: string) => {
    switch (type) {
      case 'escrow':
      case 'order_protection':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-500/15 border-emerald-500/30',
          badgeText: 'Order Protection',
          badgeStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        };
      case 'order':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
          bgColor: 'bg-purple-500/15 border-purple-500/30',
          badgeText: 'Digital Receipt',
          badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        };
      case 'security':
        return {
          icon: <Lock className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-500/15 border-amber-500/30',
          badgeText: 'Security Verification',
          badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        };
      case 'message':
        return {
          icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
          bgColor: 'bg-indigo-500/15 border-indigo-500/30',
          badgeText: 'Seller Message',
          badgeStyle: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-sky-400" />,
          bgColor: 'bg-sky-500/15 border-sky-500/30',
          badgeText: 'System Alert',
          badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
        };
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-white border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Notification Hub</h3>
                <p className="text-[11px] text-slate-400">Order updates, payment logs & security events</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onMarkAllRead} 
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 text-[11px] font-bold transition-colors"
              >
                Mark Read
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <Bell className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
                <p className="font-bold text-slate-400 text-xs">No active notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const style = getNotificationIconAndStyle(n.type);
                // Extract order ID if present in title or message
                const orderIdMatch = n.message.match(/ORD-PI-[A-Z0-9_-]+/i) || n.title.match(/ORD-PI-[A-Z0-9_-]+/i);
                const orderId = orderIdMatch ? orderIdMatch[0] : null;

                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                      n.read
                        ? 'bg-slate-900/60 border-slate-800 opacity-80'
                        : 'bg-slate-800/90 border-purple-500/50 shadow-lg shadow-purple-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${style.bgColor}`}>
                          {style.icon}
                        </div>
                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${style.badgeStyle}`}>
                            {style.badgeText}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{n.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      {orderId ? (
                        <span className="text-purple-300 font-bold">Order: {orderId}</span>
                      ) : (
                        <span>Ref: TX-PINOVA-VERIFIED</span>
                      )}
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer status bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Pi Network Platform API Live Syncing Active</span>
          </div>

        </div>
      </div>
    </div>
  );
};

