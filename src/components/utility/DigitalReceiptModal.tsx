import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Copy, Check, Download, Printer, ExternalLink, Zap, ArrowRight, Share2 } from 'lucide-react';
import { UtilityTransactionReceipt } from '../../types/utility';

interface DigitalReceiptModalProps {
  receipt: UtilityTransactionReceipt;
  onClose: () => void;
  onNewTransaction?: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  receipt,
  onClose,
  onNewTransaction
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedTxid, setCopiedTxid] = useState(false);

  const handleCopyToken = () => {
    if (receipt.tokenOrCode) {
      navigator.clipboard.writeText(receipt.tokenOrCode);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handleCopyTxid = () => {
    if (receipt.piTxid) {
      navigator.clipboard.writeText(receipt.piTxid);
      setCopiedTxid(true);
      setTimeout(() => setCopiedTxid(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Transaction Verified
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {new Date(receipt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Utility Payment Receipt</h3>
              <p className="text-xs text-slate-300">Official Pi Network Ecosystem Digital Proof of Fulfillment</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Main Token/Code Box (If Available) */}
          {receipt.tokenOrCode && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-purple-500/40 shadow-xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between text-xs text-purple-300 font-bold uppercase tracking-wider">
                <span>Fulfillment Token / Code</span>
                <span className="text-[10px] text-amber-400 font-extrabold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Instant Delivery
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 font-mono font-black text-lg sm:text-xl text-amber-400 tracking-wider bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="truncate">{receipt.tokenOrCode}</span>
                <button
                  onClick={handleCopyToken}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-sans font-bold flex items-center gap-1.5 shadow-md shrink-0 transition-colors"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {receipt.serialNumber && (
                <div className="text-[11px] text-slate-400 font-mono">
                  Serial Ref: <span className="text-slate-200">{receipt.serialNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Detailed Transaction Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Service Provider</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{receipt.providerName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Account / Meter Ref</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{receipt.accountNumber}</span>
            </div>

            {receipt.accountName && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Verified Account Holder</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{receipt.accountName}</span>
              </div>
            )}

            {receipt.packageName && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Package / Service</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{receipt.packageName}</span>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Local Value</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">${receipt.fiatAmount.toFixed(2)} {receipt.fiatCurrency}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Conversion Rate Applied</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">1 π = ${receipt.appliedPiRateUsd.toFixed(2)} USD</span>
            </div>

            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="font-black text-slate-900 dark:text-slate-100">Total Pi Coin Paid</span>
              <span className="font-black text-amber-500 dark:text-amber-400 text-base">{receipt.piAmount.toFixed(4)} π</span>
            </div>
          </div>

          {/* Security & Order Protection Badge */}
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-purple-900 dark:text-purple-200 block">Protected by PiNova Order Protection</span>
              <span className="text-purple-700 dark:text-purple-300">Transaction ID: {receipt.transactionId}</span>
            </div>
          </div>

          {/* Pi Blockchain Metadata */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Pi Payment ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{receipt.piPaymentId || 'pi_pay_v2_active'}</span>
            </div>
            {receipt.piTxid && (
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Blockchain Tx Hash:</span>
                <button
                  onClick={handleCopyTxid}
                  className="font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-[140px]">{receipt.piTxid}</span>
                  {copiedTxid ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            {onNewTransaction && (
              <button
                onClick={() => {
                  onClose();
                  onNewTransaction();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                <span>New Utility Purchase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
