import React, { useState, useEffect, useMemo } from 'react';
import {
  InstitutionProfile,
  EducationTier,
  UniversityFaculty,
  AcademicDepartment,
  EducationProgramme
} from '../../types/education';
import { educationService } from '../../services/educationService';
import { ALL_GLOBAL_COUNTRIES, getCountryFlag, getSubdivisionInfo } from '../../data/countrySubdivisions';
import {
  Search,
  Building2,
  MapPin,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ExternalLink,
  Award,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  Layers,
  School,
  Info,
  Sparkles
} from 'lucide-react';

interface InstitutionDirectoryProps {
  onSelectInstitutionForFees?: (institution: InstitutionProfile) => void;
  onApplyForAdmission?: (institution: InstitutionProfile) => void;
}

export const InstitutionDirectory: React.FC<InstitutionDirectoryProps> = ({
  onSelectInstitutionForFees,
  onApplyForAdmission
}) => {
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedSubdivision, setSelectedSubdivision] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isPublicFilter, setIsPublicFilter] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionProfile | null>(null);

  // Cascading Academic Hierarchy Filter State
  const [selectedHierarchyInstitution, setSelectedHierarchyInstitution] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');

  // Modal internal filter state
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSelectedFacultyId, setModalSelectedFacultyId] = useState('all');

  const subdivisionInfo = selectedCountry !== 'ALL' ? getSubdivisionInfo(selectedCountry) : null;
  const availableSubdivisions = subdivisionInfo ? subdivisionInfo.subdivisions : [];

  const { priorityCountries, remainingGlobalCountries } = useMemo(() => {
    const priorityCodes = ['GH', 'KE', 'ZA', 'EG', 'RW', 'UG', 'TZ', 'US', 'GB', 'CA'];
    const priority = priorityCodes
      .map((code) => ALL_GLOBAL_COUNTRIES.find((c) => c.code === code))
      .filter((c): c is (typeof ALL_GLOBAL_COUNTRIES)[0] => Boolean(c));

    const remaining = ALL_GLOBAL_COUNTRIES
      .filter((c) => c.code !== 'NG' && !priorityCodes.includes(c.code))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    return { priorityCountries: priority, remainingGlobalCountries: remaining };
  }, []);

  // Cascading hierarchy derivations
  const hierarchyInst = useMemo(() => {
    if (!selectedHierarchyInstitution) return null;
    return institutions.find((i) => i.id === selectedHierarchyInstitution) || null;
  }, [institutions, selectedHierarchyInstitution]);

  const availableFaculties = useMemo(() => {
    return hierarchyInst?.faculties || [];
  }, [hierarchyInst]);

  // Determine institution-appropriate terminology (Faculty vs School vs College vs Division)
  const unitTerm = useMemo(() => {
    if (!availableFaculties || availableFaculties.length === 0) {
      if (hierarchyInst?.supportedTiers?.includes('secondary') || hierarchyInst?.institutionType === 'secondary_school') {
        return { singular: 'Curricular Track', plural: 'Curricular Tracks' };
      }
      return { singular: 'Academic Unit', plural: 'Academic Units' };
    }
    const types = availableFaculties.map((f) => f.unitType || 'faculty');
    if (types.every((t) => t === 'school')) return { singular: 'School', plural: 'Schools' };
    if (types.every((t) => t === 'college')) return { singular: 'College', plural: 'Colleges' };
    if (types.every((t) => t === 'division')) return { singular: 'Division', plural: 'Divisions' };
    if (types.some((t) => t === 'school')) return { singular: 'School / Faculty', plural: 'Schools & Faculties' };
    return { singular: 'Faculty', plural: 'Faculties' };
  }, [availableFaculties, hierarchyInst]);

  const currentFaculty = useMemo(() => {
    if (!selectedFaculty) return null;
    return availableFaculties.find((f) => f.id === selectedFaculty) || null;
  }, [availableFaculties, selectedFaculty]);

  const availableDepartments = useMemo(() => {
    return currentFaculty?.departments || [];
  }, [currentFaculty]);

  const currentDepartment = useMemo(() => {
    if (!selectedDepartment) return null;
    return availableDepartments.find((d) => d.id === selectedDepartment) || null;
  }, [availableDepartments, selectedDepartment]);

  const availableProgrammes = useMemo(() => {
    if (currentDepartment) {
      return currentDepartment.programmes || [];
    }
    if (hierarchyInst?.programmes && (!hierarchyInst.faculties || hierarchyInst.faculties.length === 0)) {
      return hierarchyInst.programmes;
    }
    return [];
  }, [currentDepartment, hierarchyInst]);

  const currentProgramme = useMemo(() => {
    if (!selectedProgramme) return null;
    return availableProgrammes.find((p) => p.id === selectedProgramme) || null;
  }, [availableProgrammes, selectedProgramme]);

  // Cascading reset handlers ensuring parent resets all child states
  const handleHierarchyInstitutionChange = (instId: string) => {
    setSelectedHierarchyInstitution(instId);
    setSelectedFaculty('');
    setSelectedDepartment('');
    setSelectedProgramme('');
  };

  const handleFacultyChange = (facId: string) => {
    setSelectedFaculty(facId);
    setSelectedDepartment('');
    setSelectedProgramme('');
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setSelectedProgramme('');
  };

  const handleProgrammeChange = (progId: string) => {
    setSelectedProgramme(progId);
  };

  const handleResetHierarchy = () => {
    setSelectedHierarchyInstitution('');
    setSelectedFaculty('');
    setSelectedDepartment('');
    setSelectedProgramme('');
  };

  useEffect(() => {
    loadInstitutions();
  }, [selectedCountry, selectedSubdivision, selectedTier, selectedType, isPublicFilter]);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      // Validate that selectedSubdivision belongs to current country if a country is active
      const validSubdivision =
        selectedCountry !== 'ALL' && availableSubdivisions.includes(selectedSubdivision)
          ? selectedSubdivision
          : undefined;

      const data = await educationService.getInstitutions({
        countryCode: selectedCountry === 'ALL' ? undefined : selectedCountry,
        state: validSubdivision,
        tier: selectedTier === 'all' ? undefined : selectedTier,
        institutionType: selectedType === 'all' ? undefined : selectedType,
        isPublic: isPublicFilter === 'all' ? undefined : isPublicFilter === 'public',
        search: searchQuery.trim() || undefined
      });
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchQuery('');
    setSelectedCountry('ALL');
    setSelectedSubdivision('all');
    setSelectedTier('all');
    setSelectedType('all');
    setIsPublicFilter('all');
    handleResetHierarchy();
    setLoading(true);
    try {
      const data = await educationService.getInstitutions({});
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadInstitutions();
  };

  const tierLabels: Record<EducationTier, string> = {
    early_childhood: 'Early Childhood',
    primary: 'Primary Basic',
    secondary: 'Secondary',
    tertiary: 'Tertiary / University',
    technical_vocational: 'Vocational & Tech',
    professional_continuing: 'Professional / CPD'
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search global institutions by name, code, state, or city (e.g., Oxford, Lagos, Bayero, Harvard)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
          <button
            id="education-search-directory-btn"
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Search Global Directory
          </button>
        </form>

        {/* Facet Filters */}
        <div className={`grid grid-cols-2 ${availableSubdivisions.length > 0 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-4'} gap-3 pt-2 border-t border-slate-800 text-xs`}>
          {/* Country */}
          <div>
            <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Country</span>
              </span>
              {selectedCountry === 'NG' ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Deployment Hub
                </span>
              ) : selectedCountry !== 'ALL' ? (
                <span className="text-[10px] text-amber-400 font-mono">
                  {getCountryFlag(selectedCountry)} {selectedCountry}
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-medium">
                  🌍 Global Scope
                </span>
              )}
            </label>
            <select
              id="education-country-select"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedSubdivision('all');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="ALL">🌍 All Countries (Global)</option>
              <option value="NG">🇳🇬 Nigeria (Deployment Hub)</option>
              <optgroup label="Supported Regional Hubs">
                {priorityCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {getCountryFlag(c.code)} {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Global Nations & Territories (190+ Countries)">
                {remainingGlobalCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {getCountryFlag(c.code)} {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* State / Subdivision (Dynamic) */}
          {availableSubdivisions.length > 0 && (
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                {subdivisionInfo?.subdivisionName || 'State / Region'}
              </label>
              <select
                value={selectedSubdivision}
                onChange={(e) => setSelectedSubdivision(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All {subdivisionInfo?.subdivisionName ? `${subdivisionInfo.subdivisionName}s` : 'Regions'}</option>
                {availableSubdivisions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Education Tier */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Education Level / Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Tiers (K-12 to University)</option>
              <option value="early_childhood">Early Childhood / Nursery</option>
              <option value="primary">Primary Basic Education</option>
              <option value="secondary">Secondary (JSS & SSS)</option>
              <option value="tertiary">Tertiary / University / Poly</option>
              <option value="technical_vocational">Technical & Vocational</option>
              <option value="professional_continuing">Professional / Executive</option>
            </select>
          </div>

          {/* Institution Type */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Institution Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Types</option>
              <option value="university">Universities</option>
              <option value="polytechnic">Polytechnics</option>
              <option value="secondary_school">Secondary Schools</option>
              <option value="primary_school">Primary Academies</option>
              <option value="vocational_institute">Vocational & Tech Institutes</option>
            </select>
          </div>

          {/* Ownership */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Ownership</label>
            <select
              value={isPublicFilter}
              onChange={(e) => setIsPublicFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All (Public & Private)</option>
              <option value="public">Public / Federal / State</option>
              <option value="private">Private Institutions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cascading Academic Hierarchy & Programme Navigator */}
      <div id="academic-hierarchy-explorer" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Academic Hierarchy & Cascading Filter</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-2 py-0.5 rounded-full border border-slate-700">
                  Institution → {unitTerm.singular} → Department → Programme
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Explore verified faculties, schools, departments, and degree curricula with itemized institutional fee schedules.
              </p>
            </div>
          </div>

          {(selectedHierarchyInstitution || selectedFaculty || selectedDepartment || selectedProgramme) && (
            <button
              onClick={handleResetHierarchy}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto font-medium transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Hierarchy Filter</span>
            </button>
          )}
        </div>

        {/* 4 Cascading Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Level 1: Institution */}
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Institution</span>
              </span>
              {selectedHierarchyInstitution && (
                <span className="text-[10px] text-emerald-400 font-mono">Selected</span>
              )}
            </label>
            <select
              id="education-hierarchy-institution-select"
              value={selectedHierarchyInstitution}
              onChange={(e) => handleHierarchyInstitutionChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-medium transition"
            >
              <option value="">Select Institution to explore...</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.institutionCode})
                </option>
              ))}
            </select>
          </div>

          {/* Level 2: Faculty / School / College / Division */}
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>2. {unitTerm.singular}</span>
              </span>
              {selectedFaculty && (
                <span className="text-[10px] text-emerald-400 font-mono">Selected</span>
              )}
            </label>
            <select
              id="education-hierarchy-faculty-select"
              value={selectedFaculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              disabled={!selectedHierarchyInstitution || availableFaculties.length === 0}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
            >
              {!selectedHierarchyInstitution ? (
                <option value="">Select institution first...</option>
              ) : availableFaculties.length === 0 ? (
                <option value="">Direct Curricular Tracks (No Faculties)</option>
              ) : (
                <>
                  <option value="">Select {unitTerm.singular} ({availableFaculties.length} available)...</option>
                  {availableFaculties.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} {fac.unitType && fac.unitType !== 'faculty' ? `[${fac.unitType.toUpperCase()}]` : ''}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Level 3: Department */}
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Department</span>
              </span>
              {selectedDepartment && (
                <span className="text-[10px] text-emerald-400 font-mono">Selected</span>
              )}
            </label>
            <select
              id="education-hierarchy-department-select"
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              disabled={!selectedFaculty || availableDepartments.length === 0}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
            >
              {!selectedFaculty ? (
                <option value="">Select {unitTerm.singular.toLowerCase()} first...</option>
              ) : availableDepartments.length === 0 ? (
                <option value="">No departments published</option>
              ) : (
                <>
                  <option value="">Select Department ({availableDepartments.length} available)...</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} {dept.code ? `(${dept.code})` : ''}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Level 4: Programme / Specialization */}
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Programme</span>
              </span>
              {selectedProgramme && (
                <span className="text-[10px] text-emerald-400 font-mono">Selected</span>
              )}
            </label>
            <select
              id="education-hierarchy-programme-select"
              value={selectedProgramme}
              onChange={(e) => handleProgrammeChange(e.target.value)}
              disabled={
                (!currentDepartment && (!hierarchyInst?.programmes || hierarchyInst.programmes.length === 0)) ||
                availableProgrammes.length === 0
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
            >
              {!currentDepartment && (!hierarchyInst?.programmes || hierarchyInst.programmes.length === 0) ? (
                <option value="">Select department first...</option>
              ) : availableProgrammes.length === 0 ? (
                <option value="">No programmes published</option>
              ) : (
                <>
                  <option value="">Select Programme ({availableProgrammes.length} available)...</option>
                  {availableProgrammes.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name} ({prog.credentialAwarded})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Selected Hierarchy Feedback & Detail Pane */}
        {hierarchyInst && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="font-semibold text-white flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                {hierarchyInst.name}
              </span>
              {currentFaculty && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-amber-300 font-medium">
                    {currentFaculty.name}
                  </span>
                </>
              )}
              {currentDepartment && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-emerald-300 font-medium">
                    {currentDepartment.name}
                  </span>
                </>
              )}
              {currentProgramme && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-blue-300 font-bold">
                    {currentProgramme.name}
                  </span>
                </>
              )}
            </div>

            {/* Case A: Programme is Selected -> Show Full Programme Card */}
            {currentProgramme && (
              <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {currentProgramme.code}
                      </span>
                      <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-600/30 px-2 py-0.5 rounded-full font-semibold">
                        Accredited Programme
                      </span>
                    </div>
                    <h5 className="text-base font-bold text-white mt-1">{currentProgramme.name}</h5>
                    <p className="text-xs text-slate-400">
                      Credential: <strong className="text-slate-200">{currentProgramme.credentialAwarded}</strong> • Duration: {currentProgramme.durationYears} {currentProgramme.durationYears === 1 ? 'Year' : 'Years'} • Level: {currentProgramme.levelCode}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-amber-400 font-mono font-bold text-lg block">
                      ${currentProgramme.tuitionPerPeriod} {currentProgramme.currency}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {currentProgramme.feePeriod || 'per semester'}
                    </span>
                  </div>
                </div>

                {/* Itemized Fee Breakdown */}
                {currentProgramme.feeSchedule && (
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      <span>Itemized Institutional Fee Breakdown</span>
                      <span className="text-amber-400 font-mono">Official Regulatory Schedule</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Tuition:</span>
                        <span className="font-semibold text-white">${currentProgramme.feeSchedule.tuition}</span>
                      </div>
                      {currentProgramme.feeSchedule.registration !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Registration:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.registration}</span>
                        </div>
                      )}
                      {currentProgramme.feeSchedule.examination !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Assessment:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.examination}</span>
                        </div>
                      )}
                      {currentProgramme.feeSchedule.laboratory !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Lab / Practical:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.laboratory}</span>
                        </div>
                      )}
                      {currentProgramme.feeSchedule.library !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Library Access:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.library}</span>
                        </div>
                      )}
                      {currentProgramme.feeSchedule.technology !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Tech Portal:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.technology}</span>
                        </div>
                      )}
                      {currentProgramme.feeSchedule.accommodation !== undefined && (
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Accommodation:</span>
                          <span className="font-semibold text-white">${currentProgramme.feeSchedule.accommodation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {currentProgramme.admissionRequirements && currentProgramme.admissionRequirements.length > 0 && (
                  <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-slate-200">Admission Criteria & Prerequisites: </strong>
                    <span>{currentProgramme.admissionRequirements.join(' • ')}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {onSelectInstitutionForFees && (
                    <button
                      onClick={() => onSelectInstitutionForFees(hierarchyInst)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20"
                    >
                      Pay School Fees for this Programme
                    </button>
                  )}
                  {onApplyForAdmission && (
                    <button
                      onClick={() => onApplyForAdmission(hierarchyInst)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
                    >
                      Apply for Admission
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInstitution(hierarchyInst)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition ml-auto"
                  >
                    View Institution Profile
                  </button>
                </div>
              </div>
            )}

            {/* Case B: Department is Selected (no specific programme yet) */}
            {currentDepartment && !currentProgramme && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentDepartment.name}</span>
                      {currentDepartment.code && (
                        <span className="text-xs font-mono text-slate-400">({currentDepartment.code})</span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400">
                      Academic Unit: {currentFaculty?.name || 'Direct Division'} • {currentDepartment.programmes?.length || 0} Accredited Programmes
                    </p>
                  </div>
                  {currentDepartment.verificationStatus === 'VERIFIED' && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600/30 px-2 py-0.5 rounded-full font-semibold">
                      Verified Curriculum
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {currentDepartment.programmes?.map((prog) => (
                    <div
                      key={prog.id}
                      onClick={() => handleProgrammeChange(prog.id)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-1.5 group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-xs group-hover:text-amber-400 transition line-clamp-1">
                          {prog.name}
                        </span>
                        <span className="text-amber-400 font-mono font-bold text-xs shrink-0 ml-2">
                          ${prog.tuitionPerPeriod}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {prog.credentialAwarded} • {prog.durationYears} {prog.durationYears === 1 ? 'Year' : 'Years'}
                      </p>
                      <span className="text-[10px] text-amber-400/90 hover:underline inline-flex items-center gap-1 font-semibold pt-1">
                        <span>Select Programme</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case C: Faculty is Selected (no department yet) */}
            {currentFaculty && !currentDepartment && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentFaculty.name}</span>
                      {currentFaculty.unitType && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                          {currentFaculty.unitType}
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {currentFaculty.departments?.length || 0} Academic Departments under this {unitTerm.singular}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentFaculty.departments?.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => handleDepartmentChange(dept.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 transition flex items-center gap-1.5"
                    >
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({dept.programmes?.length || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Case D: Institution Selected (no faculty yet) */}
            {!currentFaculty && availableFaculties.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {hierarchyInst.name} Academic Structure
                    </h5>
                    <p className="text-xs text-slate-400">
                      {availableFaculties.length} {unitTerm.plural} • {availableFaculties.reduce((sum, f) => sum + (f.departments?.length || 0), 0)} Total Departments
                    </p>
                  </div>
                  {hierarchyInst.hierarchyVerificationStatus && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300">
                      {hierarchyInst.hierarchyVerificationStatus === 'VERIFIED'
                        ? 'Accreditation Hierarchy Verified'
                        : 'Accreditation Hierarchy Verified (Active)'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {availableFaculties.map((fac) => (
                    <button
                      key={fac.id}
                      onClick={() => handleFacultyChange(fac.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 transition flex items-center gap-1.5"
                    >
                      <span>{fac.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        ({fac.departments?.length || 0} depts)
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Case E: Institution has direct programmes (no faculties, e.g. King's College, Decagon) */}
            {!currentFaculty && availableFaculties.length === 0 && hierarchyInst.programmes && hierarchyInst.programmes.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div>
                  <h5 className="text-sm font-bold text-white">
                    Direct Curricular Tracks ({hierarchyInst.programmes.length} tracks)
                  </h5>
                  <p className="text-xs text-slate-400">
                    This institution organizes curricular offerings directly without university-style faculties.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {hierarchyInst.programmes.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleProgrammeChange(p.id)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-1 group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-xs group-hover:text-amber-400 transition">
                          {p.name}
                        </span>
                        <span className="text-amber-400 font-mono font-bold text-xs">${p.tuitionPerPeriod}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {p.credentialAwarded} • {p.durationYears} {p.durationYears === 1 ? 'Year' : 'Years'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Directory Results Grid */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Global Verified Institutions Directory</span>
          <span className="text-xs bg-slate-800 text-slate-300 font-normal px-2.5 py-0.5 rounded-full border border-slate-700">
            {institutions.length} Found
          </span>
        </h3>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Accreditation Validated</span>
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-64 animate-pulse" />
          ))}
        </div>
      ) : institutions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">
            {selectedCountry !== 'ALL'
              ? 'No institutions are currently registered in this region.'
              : 'No institutions matched your filter'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            {selectedCountry !== 'ALL' && selectedSubdivision !== 'all' ? (
              `No institutions are currently registered in ${selectedSubdivision}, ${
                ALL_GLOBAL_COUNTRIES.find((c) => c.code === selectedCountry)?.name || selectedCountry
              }.`
            ) : selectedCountry !== 'ALL' ? (
              `No institutions are currently registered in ${
                ALL_GLOBAL_COUNTRIES.find((c) => c.code === selectedCountry)?.name || selectedCountry
              }.`
            ) : (
              'Try adjusting your search criteria, switching country, or resetting the education tier filter.'
            )}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutions.map((inst) => (
            <div
              key={inst.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col transition group"
            >
              {/* Cover Image & Badges */}
              <div className="h-32 w-full bg-slate-950 relative overflow-hidden">
                <img
                  src={inst.coverImageUrl || inst.logoUrl}
                  alt={inst.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                {/* Verification Badge */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {inst.verificationStatus === 'VERIFIED' && (
                    <span className="flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified Registry
                    </span>
                  )}
                  {inst.isPublic ? (
                    <span className="bg-blue-950/80 backdrop-blur-md text-blue-300 border border-blue-500/40 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Public / Federal
                    </span>
                  ) : (
                    <span className="bg-purple-950/80 backdrop-blur-md text-purple-300 border border-purple-500/40 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>

                {/* Country Pill */}
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {inst.country}
                </span>

                {/* Logo Overlap */}
                <div className="absolute bottom-2 left-4 w-12 h-12 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-md">
                  <img src={inst.logoUrl} alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Institution Content */}
              <div className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-amber-400 font-semibold">{inst.institutionCode}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {inst.city}, {inst.state}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                    {inst.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inst.overviewDescription}</p>
                </div>

                {/* Accreditation & Supported Tiers */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{inst.accreditation.authority}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {inst.supportedTiers.map((tier) => (
                      <span
                        key={tier}
                        className="bg-slate-800/90 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {tierLabels[tier]}
                      </span>
                    ))}
                    {inst.faculties && inst.faculties.length > 0 && (
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {inst.faculties.length} {inst.faculties.every(f => f.unitType === 'school') ? 'Schools' : 'Faculties'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setModalSearchTerm('');
                      setModalSelectedFacultyId('all');
                      setSelectedInstitution(inst);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      handleHierarchyInstitutionChange(inst.id);
                      document.getElementById('academic-hierarchy-explorer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    title="Explore academic hierarchy"
                    className="py-2 px-2.5 bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 border border-slate-700/60"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hierarchy</span>
                  </button>

                  {onSelectInstitutionForFees && (
                    <button
                      onClick={() => onSelectInstitutionForFees(inst)}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/10"
                    >
                      Pay Fees
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Institution Detailed Profile Modal */}
      {selectedInstitution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="relative h-44 bg-slate-950 overflow-hidden">
              <img
                src={selectedInstitution.coverImageUrl || selectedInstitution.logoUrl}
                alt=""
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/60" />

              <button
                onClick={() => setSelectedInstitution(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-xl shrink-0">
                  <img src={selectedInstitution.logoUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {selectedInstitution.institutionCode}
                    </span>
                    <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-full font-semibold">
                      Verified Institution
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedInstitution.name}</h3>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Overview & Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedInstitution.overviewDescription}</p>
              </div>

              {/* Key Meta Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Accreditation</span>
                  <span className="text-white font-medium">{selectedInstitution.accreditation.authority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Registration #</span>
                  <span className="text-emerald-400 font-mono">{selectedInstitution.accreditation.registrationNumber || 'NUC/VERIFIED'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Location</span>
                  <span className="text-white font-medium">{selectedInstitution.city}, {selectedInstitution.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Pi Network Payment</span>
                  <span className="text-amber-400 font-bold">Enabled & Verified</span>
                </div>
              </div>

              {/* Faculties & Academic Programmes */}
              {selectedInstitution.faculties && selectedInstitution.faculties.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span>Academic Units, Departments & Verified Curricula</span>
                      </h4>
                      <span className="text-xs text-slate-400">
                        {selectedInstitution.faculties.length}{' '}
                        {selectedInstitution.faculties.every(f => f.unitType === 'school') ? 'Schools' : selectedInstitution.faculties.every(f => f.unitType === 'college') ? 'Colleges' : 'Faculties'} •{' '}
                        {selectedInstitution.faculties.reduce((acc, f) => acc + (f.departments?.length || 0), 0)} Departments
                      </span>
                    </div>

                    {selectedInstitution.hierarchyVerificationStatus && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 self-start sm:self-auto">
                        Accreditation: {selectedInstitution.hierarchyVerificationStatus}
                      </span>
                    )}
                  </div>

                  {/* Quick in-modal search & filter */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={modalSearchTerm}
                      onChange={(e) => setModalSearchTerm(e.target.value)}
                      placeholder="Filter faculties, departments, or programmes..."
                      className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {selectedInstitution.faculties.length > 1 && (
                      <select
                        value={modalSelectedFacultyId}
                        onChange={(e) => setModalSelectedFacultyId(e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="all">All Academic Units</option>
                        {selectedInstitution.faculties.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedInstitution.faculties
                      .filter((fac) => modalSelectedFacultyId === 'all' || fac.id === modalSelectedFacultyId)
                      .filter((fac) => {
                        if (!modalSearchTerm.trim()) return true;
                        const term = modalSearchTerm.toLowerCase();
                        if (fac.name.toLowerCase().includes(term)) return true;
                        return fac.departments.some(
                          (d) =>
                            d.name.toLowerCase().includes(term) ||
                            (d.code && d.code.toLowerCase().includes(term)) ||
                            d.programmes.some((p) => p.name.toLowerCase().includes(term) || (p.code && p.code.toLowerCase().includes(term)))
                        );
                      })
                      .map((fac) => (
                      <div key={fac.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-sm font-bold text-white">{fac.name}</h5>
                            {fac.unitType && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-700 text-amber-300">
                                {fac.unitType}
                              </span>
                            )}
                            {fac.verificationStatus === 'VERIFIED' && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {fac.departments.length} {fac.departments.length === 1 ? 'Department' : 'Departments'}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {fac.departments.map((dept) => (
                            <div key={dept.id} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-amber-300/90">{dept.name}</span>
                                {dept.code && (
                                  <span className="text-[10px] font-mono text-slate-400">({dept.code})</span>
                                )}
                                {dept.verificationStatus === 'VERIFIED' && (
                                  <span className="text-[9px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">
                                    Accredited
                                  </span>
                                )}
                              </div>
                              <div className="space-y-2.5 divide-y divide-slate-800/80">
                                {dept.programmes.map((prog) => (
                                  <div key={prog.id} className="pt-2 first:pt-0 space-y-1.5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                                      <div>
                                        <span className="font-bold text-white block">{prog.name}</span>
                                        <span className="text-[11px] text-slate-400">
                                          Award: {prog.credentialAwarded} • Duration: {prog.durationYears} {prog.durationYears === 1 ? 'Year' : 'Years'}
                                        </span>
                                      </div>
                                      <div className="text-left sm:text-right">
                                        <span className="text-amber-400 font-bold font-mono text-sm block">
                                          ${prog.tuitionPerPeriod} {prog.currency}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block capitalize">
                                          {prog.feePeriod || 'per semester'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Itemized Institutional Fee Schedule */}
                                    {prog.feeSchedule ? (
                                      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                          Official Institutional Fee Schedule ({prog.feePeriod || 'per semester'})
                                        </span>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                          <div>
                                            <span className="text-slate-400 block">Tuition:</span>
                                            <span className="font-semibold text-slate-200">${prog.feeSchedule.tuition}</span>
                                          </div>
                                          {prog.feeSchedule.registration !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Registration:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.registration}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.examination !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Examination:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.examination}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.laboratory !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Laboratory:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.laboratory}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.library !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Library:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.library}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.technology !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Tech/Portal:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.technology}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.association !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Union/Assoc:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.association}</span>
                                            </div>
                                          )}
                                          {prog.feeSchedule.accommodation !== undefined && (
                                            <div>
                                              <span className="text-slate-400 block">Accommodation:</span>
                                              <span className="font-semibold text-slate-200">${prog.feeSchedule.accommodation}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-slate-900/60 rounded-lg p-2 text-[11px] text-slate-400 italic">
                                        Fee schedule not published for this programme/session.
                                      </div>
                                    )}

                                    {prog.admissionRequirements && prog.admissionRequirements.length > 0 && (
                                      <p className="text-[10px] text-slate-400 pt-0.5">
                                        <strong className="text-slate-300">Admission Criteria:</strong> {prog.admissionRequirements.join(' • ')}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Programmes (for Secondary / Primary / Tech) */}
              {selectedInstitution.programmes && selectedInstitution.programmes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Academic Programmes & Curricular Tracks</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedInstitution.programmes.map((p) => (
                      <div key={p.id} className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white block text-sm">{p.name}</span>
                            <span className="text-[11px] text-slate-400">
                              Credential: {p.credentialAwarded} ({p.durationYears < 1 ? `${Math.round(p.durationYears * 12)} Months` : `${p.durationYears} Years`})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-amber-400 font-bold font-mono text-sm block">
                              ${p.tuitionPerPeriod} {p.currency}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {p.feePeriod || (p.tier === 'technical_vocational' ? 'per programme' : 'per term')}
                            </span>
                          </div>
                        </div>

                        {p.feeSchedule ? (
                          <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Institutional Fee Breakdown ({p.feePeriod || 'per term'})
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Tuition:</span>
                                <span className="font-semibold text-slate-200">${p.feeSchedule.tuition}</span>
                              </div>
                              {p.feeSchedule.registration !== undefined && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Registration:</span>
                                  <span className="font-semibold text-slate-200">${p.feeSchedule.registration}</span>
                                </div>
                              )}
                              {p.feeSchedule.examination !== undefined && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Exam/Assessment:</span>
                                  <span className="font-semibold text-slate-200">${p.feeSchedule.examination}</span>
                                </div>
                              )}
                              {p.feeSchedule.laboratory !== undefined && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Lab/Practical:</span>
                                  <span className="font-semibold text-slate-200">${p.feeSchedule.laboratory}</span>
                                </div>
                              )}
                              {p.feeSchedule.library !== undefined && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Library:</span>
                                  <span className="font-semibold text-slate-200">${p.feeSchedule.library}</span>
                                </div>
                              )}
                              {p.feeSchedule.technology !== undefined && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Tech Portal:</span>
                                  <span className="font-semibold text-slate-200">${p.feeSchedule.technology}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-950/60 rounded-lg p-2 text-[11px] text-slate-400 italic">
                            Fee schedule not published for this programme/session.
                          </div>
                        )}

                        {p.admissionRequirements.length > 0 && (
                          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                            <strong className="text-slate-300">Prerequisites:</strong> {p.admissionRequirements.join('; ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Truthful Empty State if No Faculties and No Programmes */}
              {(!selectedInstitution.faculties || selectedInstitution.faculties.length === 0) &&
                (!selectedInstitution.programmes || selectedInstitution.programmes.length === 0) && (
                  <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6 text-center">
                    <GraduationCap className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <h5 className="text-sm font-bold text-white">Academic departments are not yet published for this institution</h5>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Official curriculum structures, departmental offerings, and fee schedules for this institution are currently undergoing accreditation review.
                    </p>
                  </div>
                )}

              {/* Contact Information */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {selectedInstitution.contactEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {selectedInstitution.contactPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <a href={selectedInstitution.website} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                    {selectedInstitution.website}
                  </a>
                </span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedInstitution(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>

              {onApplyForAdmission && (
                <button
                  onClick={() => {
                    const inst = selectedInstitution;
                    setSelectedInstitution(null);
                    onApplyForAdmission(inst);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Apply for Admission</span>
                </button>
              )}

              {onSelectInstitutionForFees && (
                <button
                  onClick={() => {
                    const inst = selectedInstitution;
                    setSelectedInstitution(null);
                    onSelectInstitutionForFees(inst);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Pay School Fees
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
