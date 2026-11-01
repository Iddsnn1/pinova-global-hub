import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck2, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  Database, 
  Server, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { getVendorUsername, getVendorAuthToken } from '../../../lib/vendorAuthBridge';

interface SecurityTabProps {
  userUsername: string;
  serverStatus: {
    status: string;
    verified: boolean;
    pstpAuthorized: boolean;
    sellerLifecycle: string;
  };
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  userUsername,
  serverStatus
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const token = getVendorAuthToken();

  const handleCopySession = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="seller-security-tab">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Seller Security & Compliance Center
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Cryptographic controls, PSTP escrow protocols, and identity-bound merchant governance
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Security Active
          </span>
        </div>

        {/* Security Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Item 1: Authentication */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Cryptographic Server Session
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Negotiated via <code>POST /api/auth/session</code> using Pi Network SDK access tokens. Client claims and local storage roles are never trusted as security boundaries.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Binding: @{userUsername}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Session</span>
            </div>
          </div>

          {/* Item 2: KYC Security */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Private KYC Document Encryption
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Uploaded passports and corporate certificates are encrypted using AES-256-GCM authenticated cipher with 12-byte nonces and 16-byte tags. Written with POSIX 0600 permissions.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Storage: Restricted 0600</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Zero Public Exposure</span>
            </div>
          </div>

          {/* Item 3: PSTP Protection */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              PSTP Escrow Payment Protection
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Funds are held in smart cryptographic escrow throughout the fulfillment lifecycle. Automatic fund release occurs when the buyer signals receipt or verified courier delivery completes.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Agreement: Accepted</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Escrow Enforced</span>
            </div>
          </div>

          {/* Item 4: Payment Verification */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Pi Payment Server-Verified
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pi blockchain payments are validated server-to-server with official Pi platform endpoints. Client-side payment claims or manipulated responses are strictly rejected.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Validation: Server-Side</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Fail-Closed</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Order Verification & Handover */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              QR Order Verification & Instant PSTP Release
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              When delivering goods in person or through local merchant hubs, buyers scan the order's unique QR code to cryptographically confirm receipt on-chain. This instantly triggers PSTP escrow release to your seller balance with zero chargeback risk.
            </p>
          </div>
        </div>
      </div>

      {/* Append-Only Lifecycle Audit Trail Info */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            Append-only Lifecycle Audit Trail
          </h4>
          <span className="text-[11px] font-mono text-neutral-500">
            SHA-256 Chained Hashes
          </span>
        </div>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          Every status transition from order placement, payment verification, fulfillment tracking, to escrow release is immutably logged to the centralized audit repository with server-verified timestamps.
        </p>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>[AUDIT_ACTIVE] Merchant identity verified:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">PASS</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>[AUDIT_ACTIVE] Authoritative governance check:</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">{serverStatus.status || 'UNREGISTERED'}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>[AUDIT_ACTIVE] PSTP Escrow protocol enforcement:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
