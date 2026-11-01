import React, { useEffect, useState } from 'react';
import { Globe2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { globalEducationRegistryService } from '../../services/globalEducationRegistryService';

export const GlobalEducationCoverageBanner: React.FC = () => {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof globalEducationRegistryService.getDirectorySnapshot>>['summary'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    globalEducationRegistryService
      .getDirectorySnapshot()
      .then((snapshot) => {
        if (active) setSummary(snapshot.summary);
      })
      .catch((error) => {
        console.error('Global education coverage snapshot failed:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading || !summary) return null;

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-emerald-500/10 p-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">Global Registry Coverage</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Global-first
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Coverage and verification are tracked separately. Missing local records are treated as discovery gaps, not as evidence that a country has no institutions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0 lg:min-w-[520px]">
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
            <span className="block text-[10px] text-slate-500">Countries</span>
            <span className="text-sm font-bold text-white">{summary.countriesInGlobalDirectory}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
            <span className="block text-[10px] text-slate-500">Indexed</span>
            <span className="text-sm font-bold text-white">{summary.institutionsIndexed}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
            <span className="block text-[10px] text-slate-500">Verified</span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" />{summary.verifiedInstitutionsIndexed}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
            <span className="block text-[10px] text-slate-500">Discovery Gaps</span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-400"><AlertTriangle className="w-3.5 h-3.5" />{summary.countriesWithoutLocalRecords}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
