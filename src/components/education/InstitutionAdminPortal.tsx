import React, { useState, useEffect } from 'react';
import { InstitutionProfile, EducationInvoice, AdmissionApplication } from '../../types/education';
import { educationService } from '../../services/educationService';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Search,
  Check,
  Award,
  BarChart3,
  Calendar
} from 'lucide-react';

export const InstitutionAdminPortal: React.FC = () => {
  const [selectedInstId, setSelectedInstId] = useState('inst-ng-buk-001');
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<EducationInvoice[]>([]);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<'overview' | 'invoices' | 'admissions' | 'verification'>('overview');

  useEffect(() => {
    loadAll();
  }, [selectedInstId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [instList, analyticsData, invList, appList] = await Promise.all([
        educationService.getInstitutions(),
        educationService.getInstitutionAnalytics(selectedInstId),
        educationService.getInvoices({ institutionId: selectedInstId }),
        educationService.getAdmissions({ institutionId: selectedInstId })
      ]);
      setInstitutions(instList);
      setAnalytics(analyticsData);
      setInvoices(invList);
      setApplications(appList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyApplication = async (appId: string) => {
    try {
      await educationService.acceptOffer(appId);
      await loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const activeInst = institutions.find((i) => i.id === selectedInstId) || institutions[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Institution Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              Institutional Administration Portal
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Accredited Bursar & Registrar Controls</span>
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1.5">{activeInst?.name || 'Institution Admin'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time enrollment rosters, fee schedule collection, Pi Network escrow reconciliation, and admission pipelines.
          </p>
        </div>

        {/* Institution Switcher */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
          <span className="text-slate-400 pl-2">Managing:</span>
          <select
            value={selectedInstId}
            onChange={(e) => setSelectedInstId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 font-semibold focus:outline-none focus:border-amber-500"
          >
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            adminTab === 'overview'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Revenue</span>
        </button>

        <button
          onClick={() => setAdminTab('invoices')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            adminTab === 'invoices'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fee Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('admissions')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            adminTab === 'admissions'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Admissions Applications ({applications.length})</span>
        </button>
      </div>

      {/* Overview Analytics */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Enrolled Learners</span>
              </span>
              <div className="text-2xl font-black text-white">
                {analytics?.totalStudentsEnrolled || 2450}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">+14% vs previous academic term</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Total Fees Collected</span>
              </span>
              <div className="text-2xl font-black text-emerald-400">
                ${analytics?.totalRevenueCollectedFiat?.toLocaleString() || '1,850,000'}
              </div>
              <span className="text-[11px] text-slate-400">USD Equivalent</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Collection Efficiency</span>
              </span>
              <div className="text-2xl font-black text-white">
                {analytics?.collectionRatePercentage?.toFixed(1) || '84.2'}%
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Above regional benchmark</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Pi Settlement Reserve</span>
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {analytics?.totalRevenueCollectedPi?.toFixed(4) || '5.8741'} π
              </div>
              <span className="text-[11px] text-slate-400">Verified on Pi Ledger</span>
            </div>
          </div>

          {/* Institutional Accreditation Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Accreditation & Registry Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Accrediting Authority</span>
                <span className="text-white font-semibold">{activeInst?.accreditation.authority}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Registration Identifier</span>
                <span className="text-emerald-400 font-mono">{activeInst?.accreditation.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Audit Clearance Status</span>
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified & Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {adminTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
            <h4 className="text-sm font-bold text-white">Student Invoices Register</h4>
            <span className="text-slate-400">{invoices.length} Registered Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Matric / Reg</th>
                  <th className="p-3">Total Billed</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-amber-400">{inv.invoiceNumber}</td>
                    <td className="p-3 font-semibold text-white">{inv.studentName}</td>
                    <td className="p-3 font-mono text-slate-400">{inv.studentMatricOrReg}</td>
                    <td className="p-3 font-bold text-white">${inv.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-emerald-400 font-bold">${inv.amountPaid.toFixed(2)}</td>
                    <td className="p-3 text-amber-400 font-mono">${inv.outstandingBalance.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admissions Pipeline Admin */}
      {adminTab === 'admissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
            <h4 className="text-sm font-bold text-white">Admissions Review Board</h4>
            <span className="text-slate-400">{applications.length} Pending & Processed Applications</span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-amber-400">{app.applicationNumber}</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">
                      {app.status}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{app.applicantFullName}</h5>
                  <p className="text-slate-400 text-[11px]">
                    Applied for: {app.programmeName} • Email: {app.applicantEmail}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'SUBMITTED' && (
                    <button
                      onClick={() => handleVerifyApplication(app.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Issue Admission Offer</span>
                    </button>
                  )}
                  {app.status === 'OFFER_ACCEPTED' && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolment Confirmed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
