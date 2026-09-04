import React, { useState, useEffect } from 'react';
import { GuardianChildSummary, DigitalEducationReceipt } from '../../types/education';
import { educationService } from '../../services/educationService';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import {
  Users,
  GraduationCap,
  Building2,
  Calendar,
  DollarSign,
  Receipt,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ParentDashboardProps {
  onPayForChild?: (child: GuardianChildSummary) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onPayForChild }) => {
  const [children, setChildren] = useState<GuardianChildSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<DigitalEducationReceipt | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const list = await educationService.getGuardianChildren();
      setChildren(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (receiptId?: string) => {
    if (!receiptId) return;
    try {
      const res = await educationService.verifyReceipt(receiptId);
      if (res.isAuthentic) {
        setActiveReceipt(res as any);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalFamilyOutstanding = children.reduce((sum, c) => sum + c.outstandingBalanceFiat, 0);
  const totalFamilyPaid = children.reduce((sum, c) => sum + c.totalPaidFiat, 0);

  const tierBadgeLabels: Record<string, string> = {
    early_childhood: 'Early Years / Nursery',
    primary: 'Primary Basic Education',
    secondary: 'Secondary (JSS / SSS)',
    tertiary: 'Higher Education / University',
    technical_vocational: 'Vocational & Tech'
  };

  return (
    <div className="space-y-6">
      {/* Parent Portfolio Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                Parent & Guardian Portal
              </span>
              <span className="text-xs text-slate-400">Account: Idris Datti (Pioneer Parent)</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1.5">Family Education Dashboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidated academic and fee records for your children from Early Childhood through University.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Learners Enrolled</span>
              <span className="text-base font-bold text-white">{children.length} Children</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block mb-0.5">Total Settled</span>
              <span className="text-base font-bold text-emerald-400">${totalFamilyPaid.toFixed(2)}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block mb-0.5">Outstanding Balance</span>
              <span className="text-base font-bold text-amber-400">${totalFamilyOutstanding.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Children Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-56 animate-pulse" />
          ))
        ) : (
          children.map((child) => {
            const hasBalance = child.outstandingBalanceFiat > 0;

            return (
              <div
                key={child.studentId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition"
              >
                {/* Child Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={child.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                      alt={child.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{child.fullName}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                          {tierBadgeLabels[child.tier] || child.tier}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium">{child.currentLevel}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{child.institutionName}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasBalance
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {hasBalance ? 'Balance Due' : 'Cleared'}
                  </span>
                </div>

                {/* Academic & Financial Status Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Session / Term</span>
                    <span className="text-slate-200 font-medium text-[11px] truncate block">
                      {child.academicSession}
                    </span>
                    <span className="text-slate-400 text-[10px] block">{child.currentTermOrSemester}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Billed / Paid</span>
                    <span className="text-slate-200 font-medium text-[11px] block">
                      ${child.totalBilledFiat} / <span className="text-emerald-400">${child.totalPaidFiat}</span>
                    </span>
                    <span className="text-slate-500 text-[10px] block">{child.activeInvoiceCount} Active Invoice</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Balance Due</span>
                    <span
                      className={`text-sm font-bold font-mono block ${
                        hasBalance ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      ${child.outstandingBalanceFiat.toFixed(2)}
                    </span>
                    {child.nextDueDate && (
                      <span className="text-[10px] text-slate-500 block">Due: {child.nextDueDate}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  {child.recentReceiptId && (
                    <button
                      onClick={() => handleViewReceipt(child.recentReceiptId)}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Latest Receipt</span>
                    </button>
                  )}

                  {hasBalance ? (
                    <button
                      onClick={() => onPayForChild && onPayForChild(child)}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                    >
                      <span>Pay Fees (${child.outstandingBalanceFiat.toFixed(2)})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex-1 text-center py-2 text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>All Fees Cleared for Current Term</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Digital Receipt Modal */}
      {activeReceipt && (
        <DigitalReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
};
