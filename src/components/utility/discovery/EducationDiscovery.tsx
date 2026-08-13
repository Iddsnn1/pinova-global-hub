import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Building, 
  ChevronRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UtilityServiceProvider } from '../../../types/utility';
import { searchInstitutions } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector, NIGERIAN_STATES } from './LocationSelector';

interface EducationDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  onCountryChange: (countryCode: string) => void;
  onSelectInstitutionService: (
    provider: UtilityServiceProvider,
    serviceName: string,
    accountLabel: string
  ) => void;
}

export const EducationDiscovery: React.FC<EducationDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  onCountryChange,
  onSelectInstitutionService
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('Bayero'); // Default helpful initial query
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState<
    'all' | 'university' | 'polytechnic' | 'college' | 'exam_board' | 'e_learning'
  >('all');

  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    onCountryChange(code);
  };

  const eduResult = searchInstitutions(providers, {
    countryCode: selectedCountryCode || 'NG',
    state: selectedState,
    searchQuery,
    institutionType: institutionTypeFilter
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-pink-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl border border-pink-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Education & Tuition Clearance Hub
              <span className="text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                Verified Portal
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Search universities, polytechnics, exam boards, and e-learning portals to settle tuition & fee tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Institution Search */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'NG'}
          state={selectedState}
          availableStates={selectedCountryCode === 'NG' ? NIGERIAN_STATES : undefined}
          onCountryChange={handleCountrySelect}
          onStateChange={setSelectedState}
          showStateSelector={true}
          stateLabel="State / Region"
        />

        {/* Search Input */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Search Institution Name or Alias
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Bayero, Nairobi, Lagos, WAEC, JAMB..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500/50"
            />
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            {[
              { label: 'Bayero (BUK)', query: 'Bayero' },
              { label: 'Univ of Nairobi', query: 'Nairobi' },
              { label: 'UNILAG', query: 'Lagos' },
              { label: 'Exam Boards', query: 'Exam' },
              { label: 'Coursera / EdX', query: 'Coursera' }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setSearchQuery(chip.query)}
                className="bg-slate-800/80 hover:bg-slate-700 text-pink-300 border border-slate-700/60 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Institution Type Filters */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'university', label: 'Universities' },
              { id: 'polytechnic', label: 'Polytechnics' },
              { id: 'college', label: 'Colleges' },
              { id: 'exam_board', label: 'Exam Boards' },
              { id: 'e_learning', label: 'E-Learning' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setInstitutionTypeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  institutionTypeFilter === t.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Institution Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Matching Institutions ({eduResult.institutions.length})
          </h4>
        </div>

        {eduResult.institutions.length > 0 ? (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {eduResult.institutions.map((inst) => {
              const fullProvider = providers.find((p) => p.id === inst.providerId) || providers[0];

              return (
                <div
                  key={inst.providerId}
                  className="bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 p-4 rounded-2xl transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fullProvider.logo}
                        alt={inst.institutionName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                            {inst.institutionName}
                          </h5>
                          {inst.institutionCode && (
                            <span className="text-[10px] bg-slate-800 text-pink-300 border border-pink-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                              {inst.institutionCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <BookOpen className="w-3 h-3 text-pink-400" />
                          <span>{inst.country}</span>
                          {inst.state && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300">{inst.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Available Institution Services */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Education Clearance Fee:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inst.availableServices.map((serviceName) => (
                        <button
                          type="button"
                          key={serviceName}
                          onClick={() =>
                            onSelectInstitutionService(
                              fullProvider,
                              serviceName,
                              fullProvider.accountLabel || 'Student / Candidate Reg No'
                            )
                          }
                          className="text-left bg-slate-800/90 hover:bg-pink-950/50 hover:border-pink-500/60 border border-slate-700/80 p-2.5 rounded-xl transition-all text-xs text-white font-medium flex items-center justify-between group/btn"
                        >
                          <span className="truncate mr-2">{serviceName}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-pink-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center space-y-1">
            <GraduationCap className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No institutions match "{searchQuery}"</p>
            <p className="text-xs text-slate-400">Try searching for broader terms like "University", "Polytechnic", "Lagos", or "Exam".</p>
          </div>
        )}
      </div>
    </div>
  );
};
