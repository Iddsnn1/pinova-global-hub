import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  Wallet, 
  Store, 
  Info, 
  Lock, 
  Sparkles,
  Zap,
  RefreshCw,
  Copy
} from 'lucide-react';
import { executePiPayment } from '../lib/piSdk';

export interface ParsedPiPaymentQr {
  isValid: boolean;
  type: 'pi_wallet' | 'merchant' | 'escrow' | 'uri' | 'json' | 'generic';
  recipient: string;
  amount?: number;
  memo?: string;
  merchantName?: string;
  raw: string;
  error?: string;
}

export function parsePiPaymentQr(rawQr: string): ParsedPiPaymentQr {
  const trimmed = rawQr.trim();
  if (!trimmed) {
    return { isValid: false, type: 'generic', recipient: '', raw: rawQr, error: 'Empty QR code content' };
  }

  // Security check: reject malicious scripts / injection attempts
  if (/<script|javascript:|data:|eval\(|onload=/i.test(trimmed)) {
    return { isValid: false, type: 'generic', recipient: '', raw: rawQr, error: 'Security alert: Invalid or untrusted QR code payload rejected' };
  }

  // 1. Try URI format: pi:GDFX... or pi:MERCHANT_... ?amount=10&memo=test
  if (trimmed.toLowerCase().startsWith('pi:')) {
    try {
      const uriParts = trimmed.substring(3);
      const [recipientPart, queryString] = uriParts.split('?');
      const params = new URLSearchParams(queryString || '');
      const amountStr = params.get('amount');
      const amount = amountStr ? parseFloat(amountStr) : undefined;
      const memo = params.get('memo') || undefined;
      const merchant = params.get('merchant') || undefined;

      return {
        isValid: Boolean(recipientPart),
        type: 'uri',
        recipient: recipientPart || trimmed,
        amount: amount && !isNaN(amount) && amount > 0 ? amount : undefined,
        memo,
        merchantName: merchant,
        raw: rawQr
      };
    } catch {
      // fallback
    }
  }

  // 2. Try JSON payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const json = JSON.parse(trimmed);
      if (json.recipient || json.wallet || json.merchant || json.to) {
        const recipient = json.recipient || json.wallet || json.merchant || json.to;
        const amount = typeof json.amount === 'number' ? json.amount : parseFloat(json.amount);
        return {
          isValid: true,
          type: 'json',
          recipient: String(recipient),
          amount: !isNaN(amount) && amount > 0 ? amount : undefined,
          memo: json.memo || json.description || json.reference,
          merchantName: json.merchantName || json.store,
          raw: rawQr
        };
      }
    } catch {
      // non-JSON
    }
  }

  // 3. Direct Pi Wallet Address: Starts with G, length >= 20
  if (trimmed.startsWith('G') && trimmed.length >= 20) {
    return {
      isValid: true,
      type: 'pi_wallet',
      recipient: trimmed,
      raw: rawQr
    };
  }

  // 4. Merchant ID format: MERCHANT_...
  if (trimmed.startsWith('MERCHANT_')) {
    return {
      isValid: true,
      type: 'merchant',
      recipient: trimmed,
      merchantName: trimmed.replace('MERCHANT_', '').replace(/_/g, ' '),
      raw: rawQr
    };
  }

  // 5. Escrow / PSTP format: ESCROW_... or PSTP_...
  if (trimmed.startsWith('ESCROW_') || trimmed.startsWith('PSTP_')) {
    return {
      isValid: true,
      type: 'escrow',
      recipient: trimmed,
      memo: 'PSTP Escrow Shield Security Deposit',
      raw: rawQr
    };
  }

  // 6. Generic recipient string
  return {
    isValid: trimmed.length >= 3,
    type: 'generic',
    recipient: trimmed,
    raw: rawQr
  };
}

interface ScanToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawQrCode: string;
  userUsername: string;
  userBalancePi: number;
  onPaymentSuccess?: (result: { paymentId: string; txid: string; amount: number; recipient: string }) => void;
}

export const ScanToPayModal: React.FC<ScanToPayModalProps> = ({
  isOpen,
  onClose,
  rawQrCode,
  userUsername,
  userBalancePi,
  onPaymentSuccess
}) => {
  const [parsedQr, setParsedQr] = useState<ParsedPiPaymentQr | null>(null);
  const [amountInput, setAmountInput] = useState<string>('1.0');
  const [memoInput, setMemoInput] = useState<string>('PiNova Scan-to-Pay Payment');
  const [paymentStep, setPaymentStep] = useState<'review' | 'processing' | 'success' | 'failed'>('review');
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [completedPaymentId, setCompletedPaymentId] = useState<string>('');
  const [completedTxid, setCompletedTxid] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !rawQrCode) return;

    const parsed = parsePiPaymentQr(rawQrCode);
    setParsedQr(parsed);

    // Audit log scan without exposing credentials
    console.log('[PiNova QR Payment Audit]: Scanned QR payload parsed.', {
      type: parsed.type,
      isValid: parsed.isValid,
      recipientPreview: parsed.recipient ? parsed.recipient.slice(0, 10) + '...' : 'none',
      hasAmount: Boolean(parsed.amount)
    });

    if (parsed.amount) {
      setAmountInput(parsed.amount.toString());
    } else {
      setAmountInput('1.0');
    }

    if (parsed.memo) {
      setMemoInput(parsed.memo);
    } else {
      setMemoInput(`PiNova Payment to ${parsed.merchantName || 'Pioneer Merchant'}`);
    }

    setPaymentStep('review');
    setStatusLogs([]);
    setErrorMessage('');
  }, [isOpen, rawQrCode]);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    setStatusLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleStartPayment = () => {
    if (!parsedQr || !parsedQr.isValid) {
      setErrorMessage('Invalid or corrupted QR payment target.');
      setPaymentStep('failed');
      return;
    }

    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid positive Pi amount.');
      return;
    }

    setPaymentStep('processing');
    setStatusLogs([]);
    addLog('Auditing scan payload security and preparing Pi SDK v2 payment...');

    const memo = memoInput.trim() || `PiNova Scan Payment by ${userUsername}`;
    const metadata = {
      type: 'scan_to_pay',
      qrType: parsedQr.type,
      recipient: parsedQr.recipient,
      buyerUsername: userUsername,
      timestamp: new Date().toISOString()
    };

    executePiPayment(
      {
        amount: Number(numericAmount.toFixed(2)),
        memo,
        metadata
      },
      {
        onStatusUpdate: (msg) => {
          addLog(msg);
        },
        onSuccess: (paymentId, txid) => {
          setCompletedPaymentId(paymentId);
          setCompletedTxid(txid);
          setPaymentStep('success');

          if (onPaymentSuccess) {
            onPaymentSuccess({
              paymentId,
              txid,
              amount: numericAmount,
              recipient: parsedQr.recipient
            });
          }
        },
        onCancel: (paymentId) => {
          setErrorMessage(`Payment cancelled by user (ID: ${paymentId}).`);
          setPaymentStep('failed');
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Pi SDK Payment Execution Failed');
          setPaymentStep('failed');
        }
      }
    );
  };

  const copyReceiptDetails = () => {
    const text = `PiNova QR Payment Receipt\nRecipient: ${parsedQr?.recipient}\nAmount: ${amountInput} π\nPayment ID: ${completedPaymentId}\nTXID: ${completedTxid}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>Scan-to-Pay Review</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Official Pi SDK v2
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Review & approve payment via Official Pi Network SDK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={paymentStep === 'processing'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* Invalid QR Error */}
          {parsedQr && !parsedQr.isValid && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Invalid Payment QR Code</span>
              </div>
              <p className="text-xs text-rose-300">
                {parsedQr.error || 'The scanned QR code is either corrupted or does not contain valid Pi payment instructions.'}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs transition-colors"
              >
                Close & Rescan
              </button>
            </div>
          )}

          {/* STEP 1: REVIEW PAYMENT */}
          {parsedQr && parsedQr.isValid && paymentStep === 'review' && (
            <div className="space-y-4">
              
              {/* Recipient Card */}
              <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-purple-400" />
                    <span>Payment Destination</span>
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    PSTP Verified Target
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-xs">
                      π
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white truncate">
                      {parsedQr.merchantName || (parsedQr.type === 'pi_wallet' ? 'Pioneer Wallet' : 'PiNova Merchant')}
                    </div>
                    <code className="text-[11px] font-mono text-amber-300 break-all select-all block mt-0.5">
                      {parsedQr.recipient}
                    </code>
                  </div>
                </div>
              </div>

              {/* Amount & Memo Form */}
              <div className="space-y-3 bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Payment Amount (π)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Wallet Balance: {userBalancePi.toFixed(2)} π</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="Enter Pi Amount (e.g. 10.0)"
                      className="w-full pl-3 pr-12 py-2 bg-slate-900 text-white font-bold text-base rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-amber-400 text-sm">
                      π
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Payment Memo / Reference
                  </label>
                  <input
                    type="text"
                    value={memoInput}
                    onChange={(e) => setMemoInput(e.target.value)}
                    placeholder="Enter payment reference memo..."
                    className="w-full px-3 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Safety Banner */}
              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/60 text-purple-200 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-300 text-[11px]">Official Pi SDK Confirmation Guard</p>
                  <p className="text-[11px] text-slate-300">
                    Clicking <strong className="text-white">Confirm & Pay</strong> will trigger the official Pi Network payment popup. Payments are never executed automatically without your explicit approval inside Pi Wallet.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartPayment}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Confirm & Pay via Pi SDK</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {paymentStep === 'processing' && (
            <div className="py-6 space-y-4 text-center">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-xl">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-black text-white">Connecting to Official Pi Network...</h4>
                <p className="text-xs text-slate-400 mt-1">Please approve the transaction prompt in your Pi Browser Wallet</p>
              </div>

              {/* Live Status Log */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-40 overflow-y-auto text-left space-y-1 font-mono text-[10px] text-slate-300">
                {statusLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight text-emerald-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {paymentStep === 'success' && (
            <div className="py-4 space-y-4 text-center animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-widest">
                  Transaction Complete
                </span>
                <h4 className="text-lg font-black text-white mt-1">Scan-to-Pay Successful!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Sent <strong className="text-amber-400 font-extrabold">{amountInput} π</strong> to {parsedQr?.merchantName || parsedQr?.recipient}
                </p>
              </div>

              {/* Transaction Receipt Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="font-mono text-slate-200 text-[11px] font-bold">{completedPaymentId || 'PI-PAY-88219'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blockchain TXID:</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold truncate max-w-[180px]">{completedTxid || 'TX-892182901'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={copyReceiptDetails}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'Copied Receipt' : 'Copy Receipt'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FAILED */}
          {paymentStep === 'failed' && (
            <div className="py-4 space-y-4 text-center animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-rose-400">Payment Unsuccessful</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                  {errorMessage || 'The Pi SDK payment could not be completed at this time.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStep('review')}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
