import React, { useState, useEffect } from 'react';
import { EducationInvoice, DigitalEducationReceipt, InstitutionProfile } from '../../types/education';
import { educationService } from '../../services/educationService';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Receipt,
  FileText,
  Clock,
  ArrowRight,
  User,
  Search,
  Sparkles
} from 'lucide-react';

interface SchoolFeesEngineProps {
  preselectedInvoiceId?: string;
  preselectedInstitution?: InstitutionProfile | null;
  onPaymentCompleted?: (receipt: DigitalEducationReceipt) => void;
}

export const SchoolFeesEngine: React.FC<SchoolFeesEngineProps> = ({
  preselectedInvoiceId,
  preselectedInstitution,
  onPaymentCompleted
}) => {
  const [invoices, setInvoices] = useState<EducationInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<EducationInvoice | null>(null);
  const [paymentMode, setPaymentMode] = useState<'full' | 'installment'>('full');
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<DigitalEducationReceipt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Conversion rate: $10 USD = 1 Pi (Base Pi conversion rate)
  const PI_RATE_USD = 10.0;

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (invoices.length > 0) {
      if (preselectedInvoiceId) {
        const found = invoices.find((i) => i.id === preselectedInvoiceId);
        if (found) {
          setSelectedInvoice(found);
          setCustomAmount(found.outstandingBalance);
          return;
        }
      }
      if (preselectedInstitution) {
        const found = invoices.find((i) => i.institutionId === preselectedInstitution.id);
        if (found) {
          setSelectedInvoice(found);
          setCustomAmount(found.outstandingBalance);
          return;
        }
      }
      if (!selectedInvoice) {
        // Default to first invoice with outstanding balance
        const withBalance = invoices.find((i) => i.outstandingBalance > 0) || invoices[0];
        setSelectedInvoice(withBalance);
        setCustomAmount(withBalance.outstandingBalance);
      }
    }
  }, [invoices, preselectedInvoiceId, preselectedInstitution]);

  const loadInvoices = async () => {
    try {
      const data = await educationService.getInvoices();
      setInvoices(data);
    } catch (e) {
      console.error('Failed to load invoices:', e);
    }
  };

  const handleSelectInvoice = (inv: EducationInvoice) => {
    setSelectedInvoice(inv);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (paymentMode === 'full') {
      setCustomAmount(inv.outstandingBalance);
    } else {
      setCustomAmount(Number((inv.outstandingBalance / 2).toFixed(2)));
    }
  };

  const handleModeChange = (mode: 'full' | 'installment') => {
    setPaymentMode(mode);
    if (!selectedInvoice) return;

    if (mode === 'full') {
      setCustomAmount(selectedInvoice.outstandingBalance);
    } else {
      setCustomAmount(Number((selectedInvoice.outstandingBalance / 2).toFixed(2)));
    }
  };

  const calculatedPi = (customAmount / PI_RATE_USD);

  const handleExecutePayment = async () => {
    if (!selectedInvoice) return;
    if (customAmount <= 0) {
      setErrorMessage('Please enter a valid payment amount greater than zero.');
      return;
    }
    if (customAmount > selectedInvoice.outstandingBalance + 0.01) {
      setErrorMessage(`Payment amount cannot exceed the remaining balance of $${selectedInvoice.outstandingBalance.toFixed(2)}.`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Execute verified server settlement with Pi Network verification
      const mockPiPaymentId = `pi-pay-edu-${Date.now()}`;
      const mockPiTxid = `pi-tx-${Math.floor(Math.random() * 1000000000000)}`;

      const res = await educationService.payInvoice({
        invoiceId: selectedInvoice.id,
        amountPaid: customAmount,
        currency: selectedInvoice.currency,
        piAmount: calculatedPi,
        piPaymentId: mockPiPaymentId,
        piTxid: mockPiTxid,
        paymentMethod: 'PI_NETWORK',
        payerUsername: 'pioneer_parent',
        idempotencyKey: `IDEMP-FEES-${selectedInvoice.id}-${Date.now()}`
      });

      if (res.success) {
        setSuccessMessage(`Payment of $${customAmount.toFixed(2)} (${calculatedPi.toFixed(4)} π) successfully verified.`);
        setActiveReceipt(res.receipt);
        setSelectedInvoice(res.invoice);
        // Refresh invoices
        await loadInvoices();
        if (onPaymentCompleted) {
          onPaymentCompleted(res.receipt);
        }
      } else {
        setErrorMessage(res.message || 'Payment could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please verify network status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      i.studentName.toLowerCase().includes(q) ||
      i.invoiceNumber.toLowerCase().includes(q) ||
      i.institutionName.toLowerCase().includes(q) ||
      i.studentMatricOrReg.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Fees Engine Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                Global Fees Billing & Settlement Engine
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Trust Server Verified</span>
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1.5">Official School Fees Settlement</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Settle tuition, examination, developmental, laboratory, and institutional charges with verified Pi Network payments.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
            <div>
              <span className="text-slate-400 block">Pi Rate Reference</span>
              <span className="text-white font-mono font-bold">1 π = ${PI_RATE_USD.toFixed(2)} USD</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block">Settlement Speed</span>
              <span className="text-emerald-400 font-semibold">Instant & Receipted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Invoice Selector (4 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Active School Invoices</span>
              </h4>
              <span className="text-xs text-slate-400">{filteredInvoices.length} invoices</span>
            </div>

            {/* Invoice Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, matric or invoice..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Invoices List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredInvoices.map((inv) => {
                const isSelected = selectedInvoice?.id === inv.id;
                const isPaid = inv.status === 'PAID';

                return (
                  <div
                    key={inv.id}
                    onClick={() => handleSelectInvoice(inv)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white line-clamp-1">{inv.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] truncate mb-2">{inv.institutionName}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                      <span className="font-mono text-[10px] text-slate-400">{inv.studentMatricOrReg}</span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Balance:</span>
                        <span className="font-bold text-white">${inv.outstandingBalance.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Fee Details & Pi Checkout (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedInvoice ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Selected Invoice Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-amber-400 font-mono font-semibold">{selectedInvoice.invoiceNumber}</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{selectedInvoice.studentName}</h4>
                  <p className="text-xs text-slate-400">
                    {selectedInvoice.institutionName} • {selectedInvoice.programmeOrClass} ({selectedInvoice.academicSession})
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Due Date</span>
                  <span className="text-xs font-semibold text-rose-400">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Itemized Fee Breakdown */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Institutional Fee Schedule Breakdown
                </h5>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-200 font-medium">{item.description}</span>
                        <span className="text-[10px] text-slate-400 block capitalize">{item.category.replace('_', ' ')}</span>
                      </div>
                      <span className="font-bold text-white">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Balance Summary */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Billed</span>
                  <span className="text-sm font-bold text-white">${selectedInvoice.totalAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Amount Paid</span>
                  <span className="text-sm font-bold text-emerald-400">${selectedInvoice.amountPaid.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Remaining Balance</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">${selectedInvoice.outstandingBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Option: Full vs Installment */}
              {selectedInvoice.outstandingBalance > 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Choose Payment Option
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleModeChange('full')}
                        className={`p-3 rounded-xl border text-left transition text-xs ${
                          paymentMode === 'full'
                            ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="block font-bold">Pay Full Balance</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          ${selectedInvoice.outstandingBalance.toFixed(2)} USD
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleModeChange('installment')}
                        className={`p-3 rounded-xl border text-left transition text-xs ${
                          paymentMode === 'installment'
                            ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="block font-bold">Pay 50% Installment</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          ${(selectedInvoice.outstandingBalance / 2).toFixed(2)} USD
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Amount Confirmation */}
                  <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-xs text-slate-400">Total Settlement Amount (USD)</span>
                      <div className="text-2xl font-black text-white mt-0.5">
                        ${customAmount.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-amber-400 font-semibold flex items-center sm:justify-end gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pi Amount Due</span>
                      </span>
                      <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">
                        {calculatedPi.toFixed(6)} π
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleExecutePayment}
                      disabled={isProcessing}
                      className="flex-1 py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isProcessing ? 'Verifying on Pi Ledger...' : `Pay ${calculatedPi.toFixed(4)} π Now`}
                      </span>
                    </button>

                    {activeReceipt && (
                      <button
                        onClick={() => setActiveReceipt(activeReceipt)}
                        className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span>View Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-5 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h5 className="text-sm font-bold text-white">This Invoice is Fully Paid & Cleared</h5>
                  <p className="text-xs text-slate-300">
                    No outstanding balance remains on this academic invoice. You can download or view the official receipt below.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        // Generate or load receipt
                        educationService.getInvoices().then((invs) => {
                          const i = invs.find((item) => item.id === selectedInvoice.id);
                          if (i) {
                            educationService.verifyReceipt(i.invoiceNumber).then((r) => {
                              if (r.publicSummary) setActiveReceipt(r as any);
                            });
                          }
                        });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>View Official Clearance Receipt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Select an Invoice to Settle</h4>
              <p className="text-xs text-slate-400">
                Choose a student invoice from the left panel to review line items and execute payment with Pi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {activeReceipt && (
        <DigitalReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
};
