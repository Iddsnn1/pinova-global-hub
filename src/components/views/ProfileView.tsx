import React, { useState } from 'react';
import { User, ShieldCheck, MapPin, Wallet, Key, Lock, ArrowRight, CheckCircle2, Package, Sparkles, Briefcase, Bell, Settings, ChevronRight, Users, BarChart3, Code } from 'lucide-react';
import { PiUser, UserRole } from '../../types';
import { MainSection } from '../../types/navigation';
import { ConnectPiButton, AuthStatus } from '../auth/ConnectPiButton';

interface ProfileViewProps {
  user: PiUser;
  currentUserRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenPstpShield: () => void;
  onNavigateSection?: (section: MainSection) => void;
  onOpenNotifications?: () => void;
  onOpenVendorApplication?: () => void;
  onConnectPi?: () => void | Promise<any>;
  authStatus?: AuthStatus;
  authError?: string | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUserRole,
  onSwitchRole,
  onOpenPstpShield,
  onNavigateSection,
  onOpenNotifications,
  onOpenVendorApplication,
  onConnectPi,
  authStatus,
  authError
}) => {
  const [address, setAddress] = useState({
    street: '102 Innovation Drive',
    city: 'London',
    country: 'United Kingdom',
    postalCode: 'EC1A 1BB'
  });
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-20 animate-fade-in">
      
      {/* Pi Authentication Status Card */}
      <ConnectPiButton
        user={user}
        authStatus={authStatus}
        isConnecting={authStatus === 'connecting'}
        onConnect={onConnectPi || (() => {})}
        variant="profile-card"
        errorMessage={authError}
      />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-xl">
            {(user.username || 'Pi').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">@{user.username || 'Pioneer'}</h1>
              {user.authenticated && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Verified Pioneer</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Pi Network Testnet Pioneer ID: {user.uid || 'Pioneer-Verified'}</p>
          </div>
        </div>

        <button
          onClick={onOpenPstpShield}
          className="px-4 py-2.5 rounded-xl bg-purple-950 border border-purple-800 text-amber-300 font-extrabold text-xs flex items-center gap-2 shadow-lg hover:bg-purple-900 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PSTP Reputation Score: 98/100</span>
        </button>
      </div>

      {/* Role Switcher & Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Role Switcher Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-500" />
            <span>Active Navigation Role</span>
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {(['buyer', 'seller', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onSwitchRole(r)}
                className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  currentUserRole === r
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Switching role adjusts accessible controls in the Order Management Center and dashboard tools.
          </p>
        </div>

        {/* Wallet Balance Card */}
        <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>Pi Wallet Balance</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              Testnet / Mainnet Sync
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-amber-400 tracking-tight">
              250.00 π
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Protected by official Pi SDK v2 payment & transaction verification protocol.
            </p>
          </div>
        </div>

      </div>

      {/* Secondary Features Quick Access Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-500" />
          <span>Account Tools & Features</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div
            onClick={() => onNavigateSection && onNavigateSection('developer_platform' as any)}
            className="p-4 rounded-xl bg-indigo-950/70 border border-indigo-500/50 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/30">
                <Code className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Developer Platform & APIs</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-extrabold border border-indigo-800">Module 11</span>
                </h3>
                <p className="text-[11px] text-indigo-200/90">API Gateway, Integrations, Webhooks, Plugins & Sandbox</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('security_trust')}
            className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/50 hover:border-purple-400 transition-all cursor-pointer flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-emerald-400 flex items-center justify-center font-bold border border-purple-500/30">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Enterprise Security & Trust</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-extrabold border border-emerald-800">Module 10</span>
                </h3>
                <p className="text-[11px] text-purple-200/90">MFA, Sessions, AI Fraud Engine, Privacy & Audit</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>
          
          <div
            onClick={() => onNavigateSection && onNavigateSection('community')}
            className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Social & Community Hub</h3>
                <p className="text-[11px] text-indigo-300">Live Chat, Store Feeds, Live Streams & Q&A</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('finance_analytics')}
            className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 hover:border-amber-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Finance & Analytics Engine</h3>
                <p className="text-[11px] text-amber-300">GMS Ledger, Merchant Center & BI Forecasts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>

          {onOpenVendorApplication && (
            <div
              onClick={onOpenVendorApplication}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900 border border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Become a Verified Vendor</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">APPLY</span>
                  </h3>
                  <p className="text-[11px] text-amber-200/90">Store onboarding, merchant credentials & Seller Studio</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </div>
          )}

          <div
            onClick={() => {
              onSwitchRole('seller');
              if (onNavigateSection) onNavigateSection('seller_studio' as any);
            }}
            className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 hover:border-purple-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Merchant & Business Ecosystem</h3>
                <p className="text-[11px] text-purple-300">Multi-Store, Inventory, Staff RBAC & CRM</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('orders')}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Orders & Fulfillment Hub</h3>
                <p className="text-[11px] text-slate-500">Track shipments, keys & returns</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('ai_search')}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">AI Concierge Assistant</h3>
                <p className="text-[11px] text-slate-500">Smart shopping & recommendations</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('services')}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Services & Consultations</h3>
                <p className="text-[11px] text-slate-500">Book freelance tech & advisors</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={onOpenPstpShield}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">PSTP Security Center</h3>
                <p className="text-[11px] text-slate-500">Arbitration & dispute logs</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigateSection && onNavigateSection('admin_governance')}
            className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 hover:border-amber-500 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Platform Administration Console</h3>
                <p className="text-[11px] text-slate-500">User directory, RBAC & system governance</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>

        </div>
      </div>

      {/* Saved Address */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>Default Shipping Address</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">City</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Country</label>
            <input
              type="text"
              value={address.country}
              onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Postal Code</label>
            <input
              type="text"
              value={address.postalCode}
              onChange={(e) => setAddress((p) => ({ ...p, postalCode: e.target.value }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Address saved!
            </span>
          )}
          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 2000);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl ml-auto"
          >
            Save Address
          </button>
        </div>
      </div>

    </div>
  );
};
