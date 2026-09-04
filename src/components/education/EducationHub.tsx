import React, { useState } from 'react';
import { InstitutionDirectory } from './InstitutionDirectory';
import { SchoolFeesEngine } from './SchoolFeesEngine';
import { ParentDashboard } from './ParentDashboard';
import { AdmissionsPipeline } from './AdmissionsPipeline';
import { DigitalReceiptVerifier } from './DigitalReceiptVerifier';
import { ScholarshipsHub } from './ScholarshipsHub';
import { InstitutionAdminPortal } from './InstitutionAdminPortal';
import { EducationMarketplace } from './EducationMarketplace';
import { InstitutionProfile, GuardianChildSummary, DigitalEducationReceipt } from '../../types/education';
import {
  GraduationCap,
  CreditCard,
  Users,
  Search,
  Award,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FileCheck2,
  Globe2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export type EducationTab =
  | 'directory'
  | 'fees'
  | 'children'
  | 'admissions'
  | 'verifier'
  | 'scholarships'
  | 'admin'
  | 'marketplace';

interface EducationHubProps {
  initialTab?: EducationTab;
  onBackToUtilities?: () => void;
}

export const EducationHub: React.FC<EducationHubProps> = ({
  initialTab = 'directory',
  onBackToUtilities
}) => {
  const [activeTab, setActiveTab] = useState<EducationTab>(initialTab);
  const [preselectedInstitution, setPreselectedInstitution] = useState<InstitutionProfile | null>(null);
  const [preselectedInvoiceId, setPreselectedInvoiceId] = useState<string | undefined>(undefined);

  const handleSelectInstitutionForFees = (institution: InstitutionProfile) => {
    setPreselectedInstitution(institution);
    setActiveTab('fees');
  };

  const handleApplyForAdmission = (institution: InstitutionProfile) => {
    setPreselectedInstitution(institution);
    setActiveTab('admissions');
  };

  const handlePayForChild = (child: GuardianChildSummary) => {
    // Look up child invoice or switch to fees
    setPreselectedInvoiceId(undefined);
    setActiveTab('fees');
  };

  const navTabs = [
    { id: 'directory' as EducationTab, label: 'Institution Registry', icon: Building2, tag: 'Global' },
    { id: 'fees' as EducationTab, label: 'School Fees Engine', icon: CreditCard, tag: 'Pi Pay' },
    { id: 'children' as EducationTab, label: 'My Children', icon: Users, tag: 'Family' },
    { id: 'admissions' as EducationTab, label: 'Admissions & Enrolment', icon: GraduationCap, tag: 'Pipeline' },
    { id: 'verifier' as EducationTab, label: 'Verify Receipt', icon: ShieldCheck, tag: 'Public' },
    { id: 'scholarships' as EducationTab, label: 'Scholarships & Grants', icon: Award, tag: 'Financial Aid' },
    { id: 'admin' as EducationTab, label: 'Institution Portal', icon: FileCheck2, tag: 'Bursar' },
    { id: 'marketplace' as EducationTab, label: 'Marketplace', icon: ShoppingBag, tag: 'Supplies' }
  ];

  return (
    <div className="space-y-6">
      {/* Ecosystem Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                PiNova Global Education Ecosystem
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Trust Verifiable Infrastructure
              </span>
            </div>

            {onBackToUtilities && (
              <button
                onClick={onBackToUtilities}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              >
                ← Return to Utilities Hub
              </button>
            )}
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              A Global Infrastructure for Learners, Parents & Institutions
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with verified schools, colleges, and universities across 6 education tiers. Pay tuition and academic charges with Pi Network, track multi-child family records, apply for admissions, and issue tamper-proof receipts.
            </p>
          </div>

          {/* Quick Stats Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Supported Tiers</span>
              <span className="text-white font-bold text-sm">6 Complete Levels</span>
              <span className="text-[10px] text-amber-400 block mt-0.5">Creche to PhD & CPD</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Receipt Validation</span>
              <span className="text-emerald-400 font-bold text-sm">SHA-256 Verified</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Zero-leak public audit</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Primary Deployment</span>
              <span className="text-white font-bold text-sm">Nigeria (West Africa)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Global schema ready</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Payment Methods</span>
              <span className="text-amber-400 font-bold text-sm">Pi Network & Escrow</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Instant ledger settlement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  isActive
                    ? 'bg-slate-950/30 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'directory' && (
          <InstitutionDirectory
            onSelectInstitutionForFees={handleSelectInstitutionForFees}
            onApplyForAdmission={handleApplyForAdmission}
          />
        )}

        {activeTab === 'fees' && (
          <SchoolFeesEngine
            preselectedInvoiceId={preselectedInvoiceId}
            preselectedInstitution={preselectedInstitution}
          />
        )}

        {activeTab === 'children' && (
          <ParentDashboard onPayForChild={handlePayForChild} />
        )}

        {activeTab === 'admissions' && (
          <AdmissionsPipeline preselectedInstitution={preselectedInstitution} />
        )}

        {activeTab === 'verifier' && (
          <DigitalReceiptVerifier />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsHub />
        )}

        {activeTab === 'admin' && (
          <InstitutionAdminPortal />
        )}

        {activeTab === 'marketplace' && (
          <EducationMarketplace />
        )}
      </div>
    </div>
  );
};
