import React, { useState } from 'react';
import { educationService } from '../../services/educationService';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  DollarSign,
  Hash,
  Sparkles,
  Lock
} from 'lucide-react';

export const DigitalReceiptVerifier: React.FC = () => {
  const [receiptNumber, setReceiptNumber] = useState('RCP-EDU-NG-2025-001');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptNumber.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await educationService.verifyReceipt(receiptNumber.trim());
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        isAuthentic: false,
        receiptNumber,
        error: err.message || 'Verification request failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleReceipts = [
    'RCP-EDU-NG-2025-001',
    'RCP-EDU-NG-2025-002',
    'RCP-EDU-NG-2025-004'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-semibold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Public Cryptographic Receipt Verification Service</span>
        </div>
        <h3 className="text-xl font-black text-white">Verify Education Fee Clearance</h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Institutions, employers, visa officers, and sponsors can verify the authenticity of any PiNova education receipt using its unique cryptographic reference.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Hash className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Enter Receipt Reference (e.g., RCP-EDU-NG-2025-001)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'Verify Authenticity'}</span>
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-slate-400">Quick Samples:</span>
          {sampleReceipts.map((ref) => (
            <button
              key={ref}
              type="button"
              onClick={() => setReceiptNumber(ref)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] px-2.5 py-1 rounded-lg transition"
            >
              {ref}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Output */}
      {result && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {result.isAuthentic ? (
            <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-6 shadow-2xl space-y-5">
              {/* Authenticity Banner */}
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Official Clearance Authenticated
                    </span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED ON SERVER
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    Valid Institutional Fee Clearance
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    This document matches an authentic, settled fee transaction stored in the immutable PiNova audit register.
                  </p>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Receipt Reference</span>
                  <span className="text-amber-400 font-mono font-bold">{result.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Educational Institution</span>
                  <span className="text-white font-semibold">{result.institutionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Academic Session</span>
                  <span className="text-slate-200">{result.academicSession}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Term / Semester</span>
                  <span className="text-slate-200">{result.termOrSemester}</span>
                </div>
              </div>

              {/* Amount & Settlement */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Fee Schedule Clearance</span>
                  <span className="text-sm font-bold text-white">{result.chargeDescription}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-slate-400 block">Settled Value</span>
                  <span className="text-base font-black text-emerald-400">
                    ${result.amountPaid?.toFixed(2)} {result.currency}
                  </span>
                  {result.piAmount && (
                    <span className="text-[11px] text-amber-400 font-mono block">
                      ({result.piAmount.toFixed(6)} π)
                    </span>
                  )}
                </div>
              </div>

              {/* Cryptographic Hash & Privacy Safeguard */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-300">Privacy & Cryptographic Attestation</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Per privacy standards, private contact numbers, home addresses, and national identification numbers are redacted from public verification outputs.
                </p>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all">
                  SHA-256 Hash: <span className="text-emerald-400">{result.verificationHash}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-xl text-center space-y-3">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-base font-bold text-white">Receipt Verification Failed</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No verified educational fee record was found matching reference "{result.receiptNumber}". Please check the spelling or contact the issuing institution.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
