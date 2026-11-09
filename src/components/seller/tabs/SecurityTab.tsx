import React from 'react';
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
  AlertCircle
} from 'lucide-react';

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
            Server Status
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
              Merchant access is evaluated by the server for protected operations. This panel displays the current status returned by the merchant status endpoint; it does not expose session tokens.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Merchant: @{userUsername}</span>
              <span className={serverStatus.verified ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>{serverStatus.verified ? 'Verified' : 'Not verified'}</span>
            </div>
          </div>

          {/* Item 2: KYC Security */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Private KYC Document Encryption
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Private document uploads require the server-side document storage and encryption configuration. Confirm successful upload and storage status from the server response; this panel does not independently inspect stored files.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Access: Server-controlled</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Configuration-dependent</span>
            </div>
          </div>

          {/* Item 3: PSTP Protection */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              PSTP Escrow Payment Protection
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This panel displays the PSTP authorization state returned by the server. It does not initiate Pi payments, hold funds, or release escrow.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Authorization: {serverStatus.pstpAuthorized ? 'Granted' : 'Not granted'}</span>
              <span className={serverStatus.pstpAuthorized ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>{serverStatus.pstpAuthorized ? 'Authorized' : 'Pending'}</span>
            </div>
          </div>

          {/* Item 4: Payment Verification */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Pi Payment Server-Verified
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Payment verification must be confirmed by the payment backend for each transaction. This security overview does not establish that a payment was sent, received, or settled.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Evidence: Per transaction</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Not verified here</span>
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
              QR handover should be treated as a delivery confirmation workflow only when the corresponding server endpoint confirms it. This panel does not claim on-chain confirmation or automatic fund release.
            </p>
          </div>
        </div>
      </div>

      {/* Append-Only Lifecycle Audit Trail Info */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            Order & Security Evidence
          </h4>
          <span className="text-[11px] font-mono text-neutral-500">
            SHA-256 Chained Hashes
          </span>
        </div>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
          This overview is not an append-only audit log. Use the order timeline and available server records for transaction-specific evidence; immutable hash chaining is not asserted here.
        </p>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>Merchant identity verification:</span>
            <span className={serverStatus.verified ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>{serverStatus.verified ? 'VERIFIED' : 'PENDING'}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>Server merchant status:</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">{serverStatus.status || 'UNREGISTERED'}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
            <span>PSTP authorization:</span>
            <span className={serverStatus.pstpAuthorized ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>{serverStatus.pstpAuthorized ? 'AUTHORIZED' : 'PENDING'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
