import React, { useState, useEffect } from 'react';
import { ScholarshipOpportunity } from '../../types/education';
import { educationService } from '../../services/educationService';
import {
  Award,
  DollarSign,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ScholarshipsHub: React.FC = () => {
  const [scholarships, setScholarships] = useState<ScholarshipOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipOpportunity | null>(null);
  const [appliedList, setAppliedList] = useState<string[]>([]);
  const [applicationNotice, setApplicationNotice] = useState<string | null>(null);

  useEffect(() => {
    loadScholarships();
  }, [selectedTier]);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const data = await educationService.getScholarships(
        selectedTier === 'all' ? undefined : selectedTier
      );
      setScholarships(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (sch: ScholarshipOpportunity) => {
    if (!appliedList.includes(sch.id)) {
      setAppliedList([...appliedList, sch.id]);
      setApplicationNotice(`Application for "${sch.title}" submitted with your verified learner credentials!`);
      setTimeout(() => setApplicationNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              Global Scholarship & Financial Aid Pool
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct-to-Institution Payout</span>
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1.5">Education Grants & Scholarships</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Merit, need-based, STEM, and sponsor-funded grants distributed directly to student tuition ledgers.
          </p>
        </div>

        {/* Filter */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
          <span className="text-slate-400 pl-2">Filter Level:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Education Tiers</option>
            <option value="tertiary">Higher Education / University</option>
            <option value="technical_vocational">Technical & Vocational</option>
            <option value="secondary">Secondary Schools</option>
          </select>
        </div>
      </div>

      {applicationNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{applicationNotice}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-56 animate-pulse" />
          ))
        ) : (
          scholarships.map((sch) => {
            const hasApplied = appliedList.includes(sch.id);

            return (
              <div
                key={sch.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4 transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-900/60 px-2.5 py-0.5 rounded-full">
                        {sch.sponsorType} Sponsor
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition mt-1">
                        {sch.title}
                      </h4>
                      <p className="text-xs text-slate-400">{sch.sponsorName}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Grant Value</span>
                      <span className="text-base font-black text-emerald-400">
                        {sch.amountValue}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {sch.description}
                  </p>

                  {/* Coverage Pill */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                    <span className="text-slate-400">Award Coverage:</span>
                    <span className="text-slate-200 font-semibold">{sch.coverageType}</span>
                  </div>

                  {/* Eligibility Checklist */}
                  <div className="mt-3 space-y-1 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Eligibility Requirements
                    </span>
                    {sch.eligibilityCriteria.map((crit, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: {new Date(sch.deadline).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleApply(sch)}
                    disabled={hasApplied}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      hasApplied
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Application Submitted</span>
                      </>
                    ) : (
                      <>
                        <span>Apply For Grant</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
