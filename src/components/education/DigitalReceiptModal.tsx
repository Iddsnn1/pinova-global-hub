import React from 'react';
import { DigitalEducationReceipt } from '../../types/education';
import { ShieldCheck, CheckCircle2, Download, Printer, X, Building2, Calendar, Hash } from 'lucide-react';

interface DigitalReceiptModalProps {
  receipt: DigitalEducationReceipt | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-teal-900/60 p-6 border-b border-slate-700/80 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                Official Digital Education Receipt
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Verified Payment Clearance</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Tamper-resistant institutional receipt verified by the PiNova Global Education Ecosystem.
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-6">
          {/* Institution & Student Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Educational Institution</span>
              </div>
              <p className="text-sm font-semibold text-white">{receipt.institutionName}</p>
              <p className="text-xs text-slate-400 mt-1">Invoice Ref: {receipt.invoiceNumber}</p>
            </div>

            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Details</span>
              </div>
              <p className="text-sm font-semibold text-white">{receipt.studentName}</p>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">Matric/Reg: {receipt.studentMatricOrReg}</p>
            </div>
          </div>

          {/* Academic Session & Charge Details */}
          <div className="border-t border-b border-slate-800 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Session</span>
              <span className="text-slate-200 font-medium">{receipt.academicSession}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Term / Semester</span>
              <span className="text-slate-200 font-medium">{receipt.termOrSemester}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Class / Level</span>
              <span className="text-slate-200 font-medium">{receipt.educationLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Payment Date</span>
              <span className="text-slate-200 font-medium">{new Date(receipt.paymentDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Charge Itemization */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Fee Description</span>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-sm text-slate-200">{receipt.chargeDescription}</span>
              <span className="text-sm font-bold text-white">${receipt.amountPaid.toFixed(2)} {receipt.currency}</span>
            </div>
          </div>

          {/* Settlement Breakdown in USD & Pi */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Total Amount Settled</span>
              <div className="text-2xl font-black text-white mt-0.5">
                ${receipt.amountPaid.toFixed(2)} <span className="text-sm font-normal text-slate-400">USD</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Pi Network Payment</span>
              <div className="text-xl font-bold text-amber-300 font-mono">
                {receipt.piAmount ? `${receipt.piAmount.toFixed(6)} π` : 'Direct Escrow'}
              </div>
              {receipt.piTxid && (
                <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                  TxID: {receipt.piTxid}
                </span>
              )}
            </div>
          </div>

          {/* Cryptographic Verification Badge & Hash */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Cryptographically Verified Receipt</span>
              </span>
              <span className="font-mono text-slate-300 font-bold">{receipt.receiptNumber}</span>
            </div>

            <div className="text-[10px] text-slate-500 font-mono truncate">
              SHA-256 Audit Hash: <span className="text-slate-400">{receipt.verificationHash}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-800/80 p-4 border-t border-slate-700 flex justify-between items-center gap-3">
          <span className="text-xs text-slate-400">
            Verification Ref: <span className="font-mono text-slate-200">{receipt.verificationReference}</span>
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
