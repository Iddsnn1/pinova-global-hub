import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Building, 
  ChevronRight, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Receipt,
  RotateCcw,
  Check,
  User,
  Wallet,
  Coins,
  X,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { 
  UtilityServiceProvider, 
  UtilityProviderPackage,
  UtilityTransactionReceipt,
  PiConversionConfig 
} from '../../../types/utility';
import { searchInstitutions } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector } from './LocationSelector';
import { createPiPayment } from '../../../lib/piSdk';
import { DigitalReceiptModal } from '../DigitalReceiptModal';
import { formatPiAmount, calculateAuthoritativePiAmount } from '../../../utils/formatters';

interface EducationDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  initialState?: string;
  piConversionConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onCountryChange: (countryCode: string) => void;
  onStateChange?: (state: string) => void;
  onSelectInstitutionService: (
    provider: UtilityServiceProvider,
    serviceName: string,
    accountLabel: string
  ) => void;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
}

export const EducationDiscovery: React.FC<EducationDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  initialState = '',
  piConversionConfig,
  userBalancePi = 100,
  buyerUsername = 'PiPioneer',
  onCountryChange,
  onStateChange,
  onSelectInstitutionService,
  onTransactionSuccess
}) => {
  // Location and Filter State
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<
    'all' | 'university' | 'polytechnic' | 'college' | 'exam_board' | 'e_learning'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Service and Order State
  const [selectedInstitution, setSelectedInstitution] = useState<UtilityServiceProvider | null>(null);
  const [selectedEducationService, setSelectedEducationService] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);
  const [customFiatAmount, setCustomFiatAmount] = useState<number | ''>(50);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [studentFullName, setStudentFullName] = useState<string>('');
  const [academicSession, setAcademicSession] = useState<string>('2025/2026');

  // Validation and Processing
  const [isValidatingAccount, setIsValidatingAccount] = useState<boolean>(false);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Conversion rate (Default GCV: 1 Pi = $314,159 USD)
  const activeRate = piConversionConfig?.piRateUsd || 314159;

  // Reset institution selection on country change, but keep selectedInstitutionType
  useEffect(() => {
    setSelectedState('');
    setSelectedInstitution(null);
    setSelectedEducationService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setAccountNumber('');
    setStudentFullName('');
    setIsAccountVerified(false);
    setSearchQuery('');
    setErrorMessage(null);
  }, [selectedCountryCode]);

  // Handle Country Selection
  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    setSelectedInstitution(null);
    setSelectedEducationService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setAccountNumber('');
    setStudentFullName('');
    setIsAccountVerified(false);
    setSearchQuery('');
    setErrorMessage(null);
    onCountryChange(code);
    onStateChange?.('');
  };

  // Handle State / Region Selection
  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    setSelectedInstitution(null);
    setSelectedEducationService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setAccountNumber('');
    setStudentFullName('');
    setIsAccountVerified(false);
    setErrorMessage(null);
    onStateChange?.(st);
  };

  // Query institutions dynamically
  const eduResult = useMemo(() => {
    return searchInstitutions(providers, {
      countryCode: selectedCountryCode || 'GLOBAL',
      state: selectedState,
      institutionType: selectedInstitutionType,
      searchQuery
    });
  }, [providers, selectedCountryCode, selectedState, selectedInstitutionType, searchQuery]);

  // Handle clicking an Education Clearance Fee option
  const handleSelectClearanceOption = (
    provider: UtilityServiceProvider,
    serviceName: string
  ) => {
    setSelectedInstitution(provider);
    setSelectedEducationService(serviceName);
    setErrorMessage(null);

    // Set initial package or default amount if available
    if (provider.supportsFixedPackages && provider.packages && provider.packages.length > 0) {
      setSelectedPackage(provider.packages[0]);
    } else if (provider.supportsCustomAmount) {
      setCustomFiatAmount(100);
      setSelectedPackage(null);
    }

    // Call parent handler
    onSelectInstitutionService(
      provider,
      serviceName,
      provider.accountLabel || 'Student Matric / Reg Number'
    );
  };

  // Calculate current fiat amount and Pi equivalent
  const effectiveFiatAmount: number = useMemo(() => {
    if (selectedPackage) {
      return selectedPackage.fiatPrice;
    }
    if (typeof customFiatAmount === 'number' && customFiatAmount > 0) {
      return customFiatAmount;
    }
    return 0;
  }, [selectedPackage, customFiatAmount]);

  const effectivePiAmount: number = useMemo(() => {
    if (effectiveFiatAmount <= 0) return 0;
    return calculateAuthoritativePiAmount(effectiveFiatAmount, activeRate);
  }, [effectiveFiatAmount, activeRate]);

  // Validate student account / matric number
  const handleValidateStudent = () => {
    if (!accountNumber.trim()) {
      setErrorMessage('Please enter a valid student matriculation or candidate registration number.');
      return;
    }
    setIsValidatingAccount(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsValidatingAccount(false);
      setIsAccountVerified(true);
      if (!studentFullName) {
        setStudentFullName(`${buyerUsername} (Portal Verified)`);
      }
    }, 450);
  };

  // Process Pi Payment for Tuition / Fee Clearance
  const handleProcessPayment = async () => {
    if (!selectedInstitution) {
      setErrorMessage('Please select an educational institution.');
      return;
    }
    if (!selectedEducationService) {
      setErrorMessage('Please select an education clearance fee type.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage('Please provide the student matriculation / registration ID.');
      return;
    }
    if (effectiveFiatAmount <= 0 || effectivePiAmount <= 0) {
      setErrorMessage('Please specify a valid fee deposit amount.');
      return;
    }
    if (userBalancePi < effectivePiAmount) {
      setErrorMessage(`Insufficient balance: You need ${formatPiAmount(effectivePiAmount)} π but have ${formatPiAmount(userBalancePi)} π.`);
      return;
    }

    setIsProcessingPayment(true);
    setErrorMessage(null);

    try {
      const memo = `PiNova Education Clearance: ${selectedInstitution.name} - ${selectedEducationService} (${accountNumber.trim()})`;
      const metadata = {
        category: 'education',
        providerId: selectedInstitution.id,
        institutionName: selectedInstitution.name,
        serviceName: selectedEducationService,
        accountNumber: accountNumber.trim(),
        fiatAmount: effectiveFiatAmount,
        countryCode: selectedCountryCode,
        state: selectedState
      };

      const payment = await createPiPayment({
        amountPi: effectivePiAmount,
        memo,
        metadata
      });

      const receipt: UtilityTransactionReceipt = {
        transactionId: payment.txid || `TX-EDU-${Date.now().toString(36).toUpperCase()}`,
        piTxid: payment.txid,
        piPaymentId: payment.paymentId || `PAY-EDU-${Date.now().toString(36).toUpperCase()}`,
        category: 'education',
        providerId: selectedInstitution.id,
        providerName: selectedInstitution.name,
        accountNumber: accountNumber.trim(),
        accountName: studentFullName || `${buyerUsername} (Student Clearance)`,
        fiatAmount: effectiveFiatAmount,
        fiatCurrency: selectedInstitution.currency || 'USD',
        appliedPiRateUsd: activeRate,
        piAmount: effectivePiAmount,
        packageName: selectedPackage?.name || selectedEducationService,
        tokenOrCode: `CLR-PIN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        orderProtectionGuaranteed: true,
        buyerUsername: buyerUsername || 'Pioneer_User'
      };

      setGeneratedReceipt(receipt);
      onTransactionSuccess?.(receipt);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment processing encountered an error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-pink-500/20 shadow-lg">
        <div className="flex items-center justify-between gap-3">
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
                Location-aware discovery for universities, polytechnics, exam boards, and fee settlements.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-pink-300 font-mono">
            <Coins className="w-3.5 h-3.5 text-pink-400" />
            <span>1 π = ${activeRate.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* Location & Institution Search */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'GLOBAL'}
          state={selectedState}
          onCountryChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          showStateSelector={true}
          stateLabel="State / Region / Emirate"
        />

        {/* 2. Institution Type Filter */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Institution Type
            </label>
            <span className="text-[11px] text-slate-400">
              {eduResult.institutions.length} matching
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
                id={`edu-filter-type-${t.id}`}
                type="button"
                onClick={() => {
                  setSelectedInstitutionType(t.id as any);
                  setSelectedInstitution(null);
                  setSelectedEducationService('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedInstitutionType === t.id
                    ? 'bg-pink-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Search Input */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Search Institution Name or Code
            </label>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium"
              >
                <X className="w-3 h-3" /> Clear search
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="edu-institution-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institution, e.g. Bayero, BUK, KUST, Kano Poly, Legon, AUS, WAEC..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500/50"
            />
          </div>
        </div>
      </div>

      {/* Institution Results & Dynamic Clearance Fee Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Step 1: Select Institution & Clearance Fee</span>
            <span className="text-slate-500 font-normal">({eduResult.institutions.length} available)</span>
          </h4>
        </div>

        {eduResult.institutions.length > 0 ? (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {eduResult.institutions.map((inst) => {
              const fullProvider =
                providers.find((p) => p.id === inst.providerId) || (providers[0] as UtilityServiceProvider);

              const isThisInstSelected = selectedInstitution?.id === inst.providerId;

              // Dynamically derived clearance options from provider data
              const clearanceOptions =
                inst.availableServices && inst.availableServices.length > 0
                  ? inst.availableServices
                  : fullProvider.designations && fullProvider.designations.length > 0
                  ? fullProvider.designations
                  : [
                      'Semester Tuition Fee Deposit',
                      'Acceptance Fee Clearance',
                      'Campus Accommodation Levy',
                      'E-Learning Certification Pass'
                    ];

              return (
                <div
                  key={inst.providerId}
                  id={`edu-card-${inst.providerId}`}
                  className={`bg-slate-900/90 border rounded-2xl p-4 transition-all space-y-3 ${
                    isThisInstSelected
                      ? 'border-pink-500/80 bg-slate-900/95 ring-1 ring-pink-500/30'
                      : 'border-slate-800 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fullProvider.logo}
                        alt={inst.institutionName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-bold text-white">
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
                              <span className="text-pink-300/90 font-medium">{inst.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Available Institution Services — Real Interactive Buttons */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Education Clearance Fee:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {clearanceOptions.map((serviceName) => {
                        const isOptionSelected =
                          isThisInstSelected && selectedEducationService === serviceName;

                        return (
                          <button
                            id={`btn-fee-${inst.providerId}-${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            type="button"
                            key={serviceName}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectClearanceOption(fullProvider, serviceName);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all text-xs font-medium flex items-center justify-between group/btn cursor-pointer ${
                              isOptionSelected
                                ? 'bg-pink-600/20 border-pink-500 ring-2 ring-pink-500/40 text-white font-bold shadow-md shadow-pink-950/40'
                                : 'bg-slate-800/90 hover:bg-slate-800 hover:border-pink-500/50 border-slate-700/80 text-slate-300 hover:text-white'
                            } border`}
                          >
                            <span className="truncate mr-2">{serviceName}</span>
                            {isOptionSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-pink-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              {searchQuery ? `No institutions match "${searchQuery}"` : 'No supported institutions found for this type in this location.'}
            </p>
            <p className="text-xs text-slate-400">
              Try selecting another Institution Type tab or "All States / Regions" in the location bar above.
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Contextual Student Details, Amount & Clearance Settlement Form */}
      {selectedInstitution && selectedEducationService && (
        <div 
          id="edu-clearance-settlement-panel"
          className="bg-slate-900/95 border border-pink-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl shadow-pink-950/30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Step 2: Student Clearance & Payment Details
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedInstitution.name} &bull; <span className="text-pink-300 font-semibold">{selectedEducationService}</span>
              </p>
            </div>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-semibold">
              Ready for Settlement
            </span>
          </div>

          {/* Student Reg / Matriculation Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {selectedInstitution.accountLabel || 'Student Matric / Admission Number'} <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="edu-student-reg-input"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setIsAccountVerified(false);
                  }}
                  placeholder={selectedInstitution.accountPlaceholder || 'e.g. U19/CS/1042 or 2025-AUS-8841'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Student Full Name (Optional)
              </label>
              <input
                id="edu-student-name-input"
                type="text"
                value={studentFullName}
                onChange={(e) => setStudentFullName(e.target.value)}
                placeholder="e.g. Amina Mohammed"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500/50"
              />
            </div>
          </div>

          {/* Amount / Package Selection */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Clearance Fee Amount
            </label>

            {selectedInstitution.packages && selectedInstitution.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedInstitution.packages.map((pkg) => {
                  const isPkgSelected = selectedPackage?.id === pkg.id;
                  const pkgPi = calculateAuthoritativePiAmount(pkg.fiatPrice, activeRate);

                  return (
                    <button
                      id={`btn-edu-pkg-${pkg.id}`}
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setCustomFiatAmount('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isPkgSelected
                          ? 'bg-pink-600/20 border-pink-500 ring-1 ring-pink-500/50 text-white'
                          : 'bg-slate-800/80 border-slate-700 hover:border-pink-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{pkg.name}</span>
                        <span className="text-xs font-bold text-pink-400 font-mono">${pkg.fiatPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>{pkg.description || 'Instant Portal Deposit'}</span>
                        <span className="text-pink-300 font-mono font-semibold">{formatPiAmount(pkgPi)} π</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    id="edu-custom-amount-input"
                    type="number"
                    min={selectedInstitution.minCustomFiat || 5}
                    max={selectedInstitution.maxCustomFiat || 1000}
                    value={customFiatAmount}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setCustomFiatAmount(val);
                      setSelectedPackage(null);
                    }}
                    placeholder="Enter USD amount"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:ring-2 focus:ring-pink-500/50"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 100, 250].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCustomFiatAmount(preset);
                        setSelectedPackage(null);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                        customFiatAmount === preset
                          ? 'bg-pink-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Review Summary */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Institution</span>
              <span className="font-semibold text-slate-200">{selectedInstitution.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Clearance Service</span>
              <span className="font-semibold text-pink-300">{selectedEducationService}</span>
            </div>
            {accountNumber && (
              <div className="flex items-center justify-between text-slate-400">
                <span>Student ID</span>
                <span className="font-mono font-semibold text-slate-200">{accountNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-400">
              <span>Fiat Value</span>
              <span className="font-mono font-bold text-slate-200">${effectiveFiatAmount.toFixed(2)} USD</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="font-bold text-slate-200">Total Pi Network Due</span>
              <span className="font-mono font-bold text-sm text-pink-400 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {formatPiAmount(effectivePiAmount)} π
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Payment & Settlement Trigger */}
          <button
            id="btn-edu-pay-settlement"
            type="button"
            disabled={isProcessingPayment || effectiveFiatAmount <= 0}
            onClick={handleProcessPayment}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-950/40 transition-all cursor-pointer"
          >
            {isProcessingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Escrow Clearance...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Settle Clearance &bull; Pay {formatPiAmount(effectivePiAmount)} π</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Digital Receipt Modal for Education Clearance */}
      {generatedReceipt && (
        <DigitalReceiptModal
          receipt={generatedReceipt}
          onClose={() => setGeneratedReceipt(null)}
        />
      )}
    </div>
  );
};
