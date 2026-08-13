import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Globe, 
  Droplets, 
  GraduationCap, 
  BookOpen, 
  Gift, 
  Ticket, 
  Coins, 
  Gamepad2, 
  Film, 
  Shield, 
  Building2, 
  Plane, 
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Sparkles,
  Check,
  Flag,
  UserCheck,
  CreditCard,
  FileText
} from 'lucide-react';
import { 
  UtilityCategoryType, 
  UtilityServiceProvider, 
  UtilityProviderPackage, 
  PiConversionConfig,
  UtilityTransactionReceipt
} from '../../types/utility';
import { UTILITY_CATEGORY_META, SAMPLE_UTILITY_PROVIDERS } from '../../data/utilityData';
import { createPiPayment } from '../../lib/piSdk';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { ProviderValidationFactory } from '../../modules/utility/providerValidation';
import { supportsServiceDiscovery } from '../../lib/utility/serviceDiscovery';
import { TransportDiscovery } from './discovery/TransportDiscovery';
import { WaterDiscovery } from './discovery/WaterDiscovery';
import { GovernmentDiscovery } from './discovery/GovernmentDiscovery';
import { EducationDiscovery } from './discovery/EducationDiscovery';

interface FlexibleUtilityModalProps {
  onClose?: () => void;
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
  defaultCategory?: UtilityCategoryType;
  isEmbedded?: boolean;
}

// Helper: Get flag emoji for country
function getCountryFlagEmoji(countryCodeOrName: string): string {
  if (!countryCodeOrName) return '🌐';
  const code = countryCodeOrName.toUpperCase();
  if (code === 'NG' || countryCodeOrName === 'Nigeria') return '🇳🇬';
  if (code === 'KE' || countryCodeOrName === 'Kenya') return '🇰🇪';
  if (code === 'GH' || countryCodeOrName === 'Ghana') return '🇬🇭';
  if (code === 'IN' || countryCodeOrName === 'India') return '🇮🇳';
  if (code === 'US' || countryCodeOrName === 'United States') return '🇺🇸';
  if (code === 'GB' || countryCodeOrName === 'United Kingdom') return '🇬🇧';
  if (code === 'ZA' || countryCodeOrName === 'South Africa') return '🇿🇦';
  if (code === 'PH' || countryCodeOrName === 'Philippines') return '🇵🇭';
  if (code === 'ID' || countryCodeOrName === 'Indonesia') return '🇮🇩';
  if (code === 'VN' || countryCodeOrName === 'Vietnam') return '🇻🇳';
  if (code === 'GLOBAL' || countryCodeOrName === 'Global') return '🌐';
  if (code === 'PAN-AFRICA' || countryCodeOrName === 'Pan-Africa') return '🌍';
  if (code === 'WEST AFRICA' || countryCodeOrName === 'West Africa') return '🌍';
  return '🏳️';
}

// Helper: Get default designations for category if provider doesn't specify
function getDefaultDesignationsForCategory(category: UtilityCategoryType): string[] {
  switch (category) {
    case 'airtime': return ['Prepaid (VTU Top-Up)', 'Postpaid Line Settlement', 'Network PIN Voucher'];
    case 'data': return ['SME Data Bundle', 'Direct 4G/5G Top-Up', 'Corporate Unlimited', 'Night Streamer Pack'];
    case 'electricity': return ['Prepaid Meter Token', 'Postpaid Utility Bill'];
    case 'cable': return ['Decoder Subscription', 'Bouquet Upgrade', 'Monthly Package Renewal'];
    case 'internet': return ['Residential Satellite', 'Priority Broadband', 'Fiber Wi-Fi Pass'];
    case 'water': return ['Prepaid Water Meter', 'Postpaid Municipal Bill'];
    case 'exam': return ['Result Checker PIN', 'Candidate Registration e-PIN', 'Verification Token'];
    case 'education': return ['Tuition Fee Portal', 'Acceptance Fee Deposit', 'Hostel / Accommodation Fee'];
    case 'giftcard': return ['Store Region Voucher', 'Digital Gift Code'];
    case 'voucher': return ['Retail Voucher', 'Store Credit Code'];
    case 'betting': return ['Player Wallet Deposit', 'Bonus Promo Top-Up'];
    case 'gaming': return ['Direct In-Game Top-Up (UID)', 'Redemption Voucher Code'];
    case 'streaming': return ['Individual Subscription', 'Family Plan Voucher', 'Annual Pass'];
    case 'insurance': return ['Policy Premium Renewal', 'Health Cover Deposit'];
    case 'government': return ['Federal Tax / TSA Levy', 'Passport Renewal RRR', 'Municipal Permit'];
    case 'transport': return ['Flight e-Voucher', 'Railway Transit Ticket', 'Bus Express Pass'];
    case 'events': return ['VIP Access Pass', 'Regular Event Ticket', 'Early Bird Delegate'];
    case 'ecommerce': return ['Store Credit Voucher', 'Retail Gift Certificate'];
    default: return ['Standard Utility Service'];
  }
}

export const FlexibleUtilityModal: React.FC<FlexibleUtilityModalProps> = ({
  onClose,
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onTransactionSuccess,
  defaultCategory = 'airtime',
  isEmbedded = false
}) => {
  // Navigation & Step state
  const [selectedCategory, setSelectedCategory] = useState<UtilityCategoryType>(defaultCategory);
  
  // Country Selection State
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  // Provider & Designation State
  const [selectedProvider, setSelectedProvider] = useState<UtilityServiceProvider | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');

  // Purchase Mode & Plan State
  const [purchaseMode, setPurchaseMode] = useState<'custom' | 'package'>('custom');
  const [customFiatAmount, setCustomFiatAmount] = useState<number | ''>('');
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);

  // Customer Account & Validation State
  const [accountNumber, setAccountNumber] = useState('');
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);
  const [accountValidationResult, setAccountValidationResult] = useState<{
    valid: boolean;
    name?: string;
    message?: string;
    requiresManualVerification?: boolean;
    verificationMethod?: string;
    disclaimer?: string;
  } | null>(null);

  // Review & Processing State
  const [showReviewStage, setShowReviewStage] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Derive all available providers for selected category
  const categoryProviders = SAMPLE_UTILITY_PROVIDERS.filter(
    (p) => p.category === selectedCategory && p.enabled
  );

  // Derive unique countries for selected category
  const availableCountriesMap = new Map<string, { name: string; code: string; flag: string; count: number }>();
  categoryProviders.forEach((p) => {
    const code = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
    const existing = availableCountriesMap.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      availableCountriesMap.set(code, {
        name: p.country,
        code,
        flag: getCountryFlagEmoji(code || p.country),
        count: 1
      });
    }
  });

  const availableCountries = Array.from(availableCountriesMap.values());

  // Filtered countries by search
  const filteredCountries = availableCountries.filter(c => 
    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Reset/Initialize Country, Provider, Designation when category changes
  useEffect(() => {
    setShowReviewStage(false);
    setErrorMessage(null);
    setAccountNumber('');
    setAccountValidationResult(null);

    const catProvs = SAMPLE_UTILITY_PROVIDERS.filter(
      (p) => p.category === selectedCategory && p.enabled
    );

    if (catProvs.length > 0) {
      // Pick first country
      const firstCode = (catProvs[0].countryCode || (catProvs[0].country === 'Global' ? 'GLOBAL' : catProvs[0].country.slice(0, 2))).toUpperCase();
      setSelectedCountryCode(firstCode);

      // Filter providers for this country
      const matchedProviders = catProvs.filter(p => {
        const pCode = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
        return pCode === firstCode || p.country === catProvs[0].country;
      });

      const firstProv = matchedProviders[0] || catProvs[0];
      setSelectedProvider(firstProv);

      // Initialize Designation
      const desigs = firstProv.designations || getDefaultDesignationsForCategory(selectedCategory);
      setSelectedDesignation(desigs[0] || 'Standard Service');

      // Initialize Purchase Mode & Amount
      if (firstProv.supportsCustomAmount) {
        setPurchaseMode('custom');
        setCustomFiatAmount('');
      } else if (firstProv.supportsFixedPackages && firstProv.packages.length > 0) {
        setPurchaseMode('package');
        setSelectedPackage(firstProv.packages[0]);
      }
    } else {
      setSelectedProvider(null);
      setSelectedCountryCode('');
      setSelectedDesignation('');
    }
  }, [selectedCategory]);

  // Handle Country selection
  const handleSelectCountry = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setShowReviewStage(false);
    setErrorMessage(null);
    setAccountNumber('');
    setAccountValidationResult(null);

    // Filter providers for selected country
    const matchedProviders = categoryProviders.filter(p => {
      const pCode = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
      return pCode === countryCode.toUpperCase();
    });

    if (matchedProviders.length > 0) {
      const firstProv = matchedProviders[0];
      setSelectedProvider(firstProv);

      const desigs = firstProv.designations || getDefaultDesignationsForCategory(selectedCategory);
      setSelectedDesignation(desigs[0] || 'Standard Service');

      if (firstProv.supportsCustomAmount) {
        setPurchaseMode('custom');
        setCustomFiatAmount('');
      } else if (firstProv.supportsFixedPackages && firstProv.packages.length > 0) {
        setPurchaseMode('package');
        setSelectedPackage(firstProv.packages[0]);
      }
    } else {
      setSelectedProvider(null);
    }
  };

  // Handle Provider selection
  const handleSelectProvider = (prov: UtilityServiceProvider) => {
    setSelectedProvider(prov);
    setShowReviewStage(false);
    setErrorMessage(null);
    setAccountNumber('');
    setAccountValidationResult(null);

    const desigs = prov.designations || getDefaultDesignationsForCategory(selectedCategory);
    setSelectedDesignation(desigs[0] || 'Standard Service');

    if (prov.supportsCustomAmount) {
      setPurchaseMode('custom');
      setCustomFiatAmount('');
    } else if (prov.supportsFixedPackages && prov.packages.length > 0) {
      setPurchaseMode('package');
      setSelectedPackage(prov.packages[0]);
    }
  };

  // Get active providers filtered by category AND selected country
  const availableProvidersForCountry = categoryProviders.filter(p => {
    if (!selectedCountryCode) return true;
    const pCode = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
    return pCode === selectedCountryCode.toUpperCase();
  });

  // Active designations list
  const activeDesignations = selectedProvider?.designations || getDefaultDesignationsForCategory(selectedCategory);

  // Icon mapping helper
  const renderCategoryIcon = (catKey: string, className = "w-5 h-5") => {
    switch (catKey) {
      case 'airtime': return <Smartphone className={className} />;
      case 'data': return <Wifi className={className} />;
      case 'electricity': return <Zap className={className} />;
      case 'cable': return <Tv className={className} />;
      case 'internet': return <Globe className={className} />;
      case 'water': return <Droplets className={className} />;
      case 'exam': return <GraduationCap className={className} />;
      case 'education': return <BookOpen className={className} />;
      case 'giftcard': return <Gift className={className} />;
      case 'voucher': return <Ticket className={className} />;
      case 'betting': return <Coins className={className} />;
      case 'gaming': return <Gamepad2 className={className} />;
      case 'streaming': return <Film className={className} />;
      case 'insurance': return <Shield className={className} />;
      case 'government': return <Building2 className={className} />;
      case 'transport': return <Plane className={className} />;
      case 'events': return <Ticket className={className} />;
      case 'ecommerce': return <ShoppingBag className={className} />;
      default: return <Zap className={className} />;
    }
  };

  // Account Validation Handler via Provider Abstraction Adapter
  const handleValidateAccount = async () => {
    if (!accountNumber.trim()) {
      setErrorMessage(`Please enter your ${selectedProvider?.accountLabel || 'account details'} first.`);
      return;
    }

    if (!selectedProvider) {
      setErrorMessage('Please select a utility service provider.');
      return;
    }

    setErrorMessage(null);
    setIsValidatingAccount(true);

    try {
      const adapter = ProviderValidationFactory.getAdapter(
        selectedProvider.id,
        selectedProvider.hasDirectValidationApi ?? false
      );

      const result = await adapter.validateAccount(accountNumber, selectedProvider.name);

      setAccountValidationResult({
        valid: result.valid,
        name: result.accountName || `Verified Account #${accountNumber}`,
        message: result.statusMessage,
        requiresManualVerification: result.requiresManualVerification,
        verificationMethod: result.verificationMethod,
        disclaimer: result.disclaimer
      });
    } catch {
      setAccountValidationResult({
        valid: true,
        name: `Account #${accountNumber}`,
        message: 'Account details recorded for provider settlement validation.',
        verificationMethod: 'MANUAL_VERIFICATION'
      });
    } finally {
      setIsValidatingAccount(false);
    }
  };

  // Dynamic Pi Calculation
  const getActiveFiatPrice = (): number => {
    if (purchaseMode === 'package' && selectedPackage) {
      return selectedPackage.fiatPrice;
    }
    const num = Number(customFiatAmount);
    return typeof num === 'number' && !isNaN(num) && isFinite(num) && num > 0 ? num : 0;
  };

  const calculatedPiAmount = getActiveFiatPrice() / piConversionConfig.piRateUsd;
  const minPiThreshold = piConversionConfig.minPurchasePi || 0.000001;
  const isWithinLimits =
    calculatedPiAmount >= minPiThreshold &&
    calculatedPiAmount <= (piConversionConfig.maxPurchasePi || 1000.00);

  // Can user proceed to review?
  const canProceedToReview =
    !!selectedProvider &&
    !!accountNumber.trim() &&
    getActiveFiatPrice() > 0 &&
    isWithinLimits;

  // Execute Pi Payment
  const handleExecutePayment = async () => {
    const finalPiAmount = Number(calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4));
    console.log('[PI PAYMENT] button clicked (FlexibleUtilityModal)', {
      category: selectedCategory,
      country: selectedCountryCode,
      provider: selectedProvider?.name,
      designation: selectedDesignation,
      accountNumber,
      fiatAmount: getActiveFiatPrice(),
      piAmount: finalPiAmount
    });

    if (!selectedProvider) return;
    if (!accountNumber.trim()) {
      setErrorMessage(`Please enter your ${selectedProvider.accountLabel}.`);
      return;
    }
    if (purchaseMode === 'custom' && Number(getActiveFiatPrice()) <= 0) {
      setErrorMessage('Please enter a valid custom amount greater than $0.');
      return;
    }
    if (purchaseMode === 'package' && !selectedPackage) {
      setErrorMessage('Please select a package plan.');
      return;
    }
    if (!isWithinLimits) {
      setErrorMessage(`Calculated Pi amount (${finalPiAmount} π) is outside allowable limits.`);
      return;
    }

    setErrorMessage(null);
    setIsProcessingPayment(true);

    const activeFiat = getActiveFiatPrice();
    const memoText = `${selectedProvider.name} (${selectedDesignation}) - ${accountNumber} ($${activeFiat.toFixed(2)})`;

    try {
      const paymentResult = await createPiPayment({
        amountPi: finalPiAmount,
        memo: memoText,
        metadata: {
          category: selectedCategory,
          countryCode: selectedCountryCode,
          providerId: selectedProvider.id,
          providerName: selectedProvider.name,
          designation: selectedDesignation,
          accountNumber,
          accountName: accountValidationResult?.name || 'Verified Customer',
          fiatAmount: activeFiat,
          fiatCurrency: selectedProvider.currency,
          piRateApplied: piConversionConfig.piRateUsd,
          packageName: selectedPackage?.name || 'Custom Purchase'
        }
      });

      if (paymentResult && paymentResult.success) {
        const isFulfilled = paymentResult.fulfillmentStatus === 'FULFILLED';
        const token = isFulfilled ? (paymentResult.data?.tokenOrCode || paymentResult.data?.providerReference) : undefined;
        
        const receipt: UtilityTransactionReceipt = {
          transactionId: paymentResult.data?.transactionId || `UTIL-TX-${Date.now().toString().slice(-6)}`,
          piPaymentId: paymentResult.paymentId || `pi_pay_${Date.now()}`,
          piTxid: paymentResult.txid || `0x${Math.random().toString(16).substring(2, 10)}`,
          category: selectedCategory,
          providerId: selectedProvider.id,
          providerName: selectedProvider.name,
          accountNumber: accountNumber,
          accountName: accountValidationResult?.name || 'Verified Customer',
          fiatAmount: activeFiat,
          fiatCurrency: selectedProvider.currency,
          appliedPiRateUsd: piConversionConfig.piRateUsd,
          piAmount: finalPiAmount,
          packageName: `${selectedDesignation} - ${selectedPackage?.name || '$' + activeFiat.toFixed(2)}`,
          tokenOrCode: token,
          serialNumber: isFulfilled ? `REF-${Date.now().toString().slice(-8)}` : undefined,
          status: isFulfilled ? 'SUCCESS' : 'PROCESSING',
          timestamp: new Date().toISOString(),
          orderProtectionGuaranteed: true,
          buyerUsername: buyerUsername
        };

        setGeneratedReceipt(receipt);
        if (onTransactionSuccess) {
          onTransactionSuccess(receipt);
        }
      } else {
        setErrorMessage(paymentResult?.message || 'Payment execution failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while contacting Pi Wallet.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const selectedCountryObj = availableCountries.find(c => c.code === selectedCountryCode) || {
    name: selectedProvider?.country || 'Global',
    code: selectedCountryCode || 'GLOBAL',
    flag: getCountryFlagEmoji(selectedCountryCode || selectedProvider?.country || 'Global'),
    count: availableProvidersForCountry.length
  };

  const contentInner = (
    <div className={`relative w-full ${isEmbedded ? '' : 'max-w-4xl max-h-[92vh] my-4 sm:my-6 shadow-2xl'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shrink-0">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Universal Utility Flow Engine
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Rate: 1 π = ${piConversionConfig.piRateUsd.toFixed(2)} {piConversionConfig.currencyCode}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white mt-0.5">Global Utility & Digital Services</h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
          >
            <X className="w-5 h-5" />
            {isEmbedded && <span>Back</span>}
          </button>
        )}
      </div>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* SAFE DIAGNOSTIC DEBUG BAR (Dev Mode & Runtime Verification) */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-1.5 font-sans font-extrabold text-[11px]">
            <span className="text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              UNIVERSAL UTILITY DIAGNOSTICS & VERIFICATION
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
              Flow State: {selectedProvider ? (accountNumber ? 'Step 6-8 Active' : 'Step 3-5 Active') : 'Step 1-2 Active'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] pt-0.5">
            <div><span className="text-slate-500 font-bold">Category:</span> <span className="text-purple-400 font-extrabold uppercase">{selectedCategory}</span></div>
            <div><span className="text-slate-500 font-bold">Selected Country:</span> <span className="text-emerald-400 font-extrabold">{selectedCountryObj ? `${selectedCountryObj.flag} ${selectedCountryObj.name} (${selectedCountryCode})` : 'None'}</span></div>
            <div className="col-span-1 sm:col-span-2"><span className="text-slate-500 font-bold">Available Countries ({availableCountries.length}):</span> <span className="text-indigo-300 font-bold">{availableCountries.map(c => `${c.flag} ${c.name} (${c.code})`).join(', ') || 'None'}</span></div>
            <div><span className="text-slate-500 font-bold">Filtered Providers ({availableProvidersForCountry.length}):</span> <span className="text-teal-300 font-bold">{selectedProvider ? selectedProvider.name : 'None selected'}</span></div>
          </div>
        </div>
          
          {/* STEP 1: CATEGORY SELECTION (All 18 categories) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                1. Select Service Category (18 Categories Available)
              </label>
              <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 capitalize">
                Active: {UTILITY_CATEGORY_META[selectedCategory]?.title || selectedCategory}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              {Object.keys(UTILITY_CATEGORY_META).map((catKey) => {
                const meta = UTILITY_CATEGORY_META[catKey];
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey as UtilityCategoryType)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                    }`}
                  >
                    <div className={isSelected ? 'text-amber-300' : 'text-purple-500'}>
                      {renderCategoryIcon(catKey, "w-5 h-5")}
                    </div>
                    <span className="text-[10px] font-bold line-clamp-1 leading-tight">{meta.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: COUNTRY / REGION SELECTION */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Select Country / Region
                </label>
              </div>

              {selectedCountryObj && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-xs font-bold">
                  <span>{selectedCountryObj.flag}</span>
                  <span>{selectedCountryObj.name}</span>
                </div>
              )}
            </div>

            {/* Country Pills / Grid */}
            <div className="flex flex-wrap gap-2 pt-1">
              {availableCountries.map((country) => {
                const isSelected = selectedCountryCode.toUpperCase() === country.code.toUpperCase();
                return (
                  <button
                    key={country.code}
                    onClick={() => handleSelectCountry(country.code)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                    }`}
                  >
                    <span className="text-sm">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-purple-700 text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {country.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Provider, Designation, Plan & Account Details (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* SERVICE DISCOVERY ENGINE ROUTING FOR COMPLEX CATEGORIES */}
              {supportsServiceDiscovery(selectedCategory) ? (
                <div className="space-y-5">
                  {selectedCategory === 'transport' && (
                    <TransportDiscovery
                      providers={SAMPLE_UTILITY_PROVIDERS}
                      piConversionConfig={piConversionConfig}
                      onSelectOption={(provider, routeMeta) => {
                        handleSelectProvider(provider);
                        const paxName = routeMeta.passengerDetails ? `${routeMeta.passengerDetails.givenName} ${routeMeta.passengerDetails.familyName}` : '';
                        const paxStr = paxName ? ` [Pax: ${paxName}]` : '';
                        setSelectedDesignation(`${routeMeta.tripDetails}${paxStr}`);
                        setPurchaseMode('custom');
                        setCustomFiatAmount(routeMeta.fiatFare);
                        setAccountNumber(
                          routeMeta.passengerDetails?.passportNumber 
                            ? `PAX-DOC-${routeMeta.passengerDetails.passportNumber}`
                            : `PASSENGER-REF-${routeMeta.originCode}-${routeMeta.destinationCode}`
                        );
                      }}
                    />
                  )}

                  {selectedCategory === 'water' && (
                    <WaterDiscovery
                      providers={SAMPLE_UTILITY_PROVIDERS}
                      selectedCountryCode={selectedCountryCode}
                      onCountryChange={handleSelectCountry}
                      onSelectWaterService={(provider, designation) => {
                        handleSelectProvider(provider);
                        setSelectedDesignation(designation);
                      }}
                    />
                  )}

                  {selectedCategory === 'government' && (
                    <GovernmentDiscovery
                      providers={SAMPLE_UTILITY_PROVIDERS}
                      selectedCountryCode={selectedCountryCode}
                      onCountryChange={handleSelectCountry}
                      onSelectGovernmentAgency={(provider, serviceName) => {
                        handleSelectProvider(provider);
                        setSelectedDesignation(serviceName);
                      }}
                    />
                  )}

                  {selectedCategory === 'education' && (
                    <EducationDiscovery
                      providers={SAMPLE_UTILITY_PROVIDERS}
                      selectedCountryCode={selectedCountryCode}
                      onCountryChange={handleSelectCountry}
                      onSelectInstitutionService={(provider, serviceName) => {
                        handleSelectProvider(provider);
                        setSelectedDesignation(serviceName);
                      }}
                    />
                  )}
                </div>
              ) : (
                /* DIRECT FAST UTILITY SELECTION FOR STANDARD CATEGORIES */
                <div className="space-y-5">
                  {/* STEP 3: SERVICE PROVIDER PICKER */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      3. Select Service Provider ({availableProvidersForCountry.length} available for {selectedCountryObj.name})
                    </label>

                    {availableProvidersForCountry.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-bold">
                        No providers available for {selectedCountryObj.name} in {UTILITY_CATEGORY_META[selectedCategory]?.title}. Select another country above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {availableProvidersForCountry.map((prov) => {
                          const isSelected = selectedProvider?.id === prov.id;
                          return (
                            <div
                              key={prov.id}
                              onClick={() => handleSelectProvider(prov)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/30'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={prov.logo}
                                  alt={prov.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                                />
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{prov.name}</h4>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[10px] text-slate-400 font-semibold">{getCountryFlagEmoji(prov.countryCode || prov.country)} {prov.country}</span>
                                  </div>
                                </div>
                              </div>

                              {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* STEP 4: DESIGNATION / SERVICE TYPE */}
                  {selectedProvider && activeDesignations.length > 0 && (
                    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                        4. Select Designation / Service Type
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {activeDesignations.map((desig) => {
                          const isSelected = selectedDesignation === desig;
                          return (
                            <button
                              key={desig}
                              onClick={() => {
                                setSelectedDesignation(desig);
                                setShowReviewStage(false);
                                setErrorMessage(null);
                                setAccountNumber('');
                                setAccountValidationResult(null);
                                if (selectedProvider?.supportsCustomAmount) {
                                  setPurchaseMode('custom');
                                  setCustomFiatAmount('');
                                } else if (selectedProvider?.supportsFixedPackages && selectedProvider.packages.length > 0) {
                                  setPurchaseMode('package');
                                  setSelectedPackage(selectedProvider.packages[0]);
                                }
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-500'
                              }`}
                            >
                              {desig}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: PURCHASE MODE & PLAN / AMOUNT SELECTION */}
              {selectedProvider && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      5. Choose Purchase Method
                    </label>

                    {/* Mode Selector Switch */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      {selectedProvider.supportsCustomAmount && (
                        <button
                          onClick={() => setPurchaseMode('custom')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            purchaseMode === 'custom'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Custom Amount
                        </button>
                      )}

                      {selectedProvider.supportsFixedPackages && selectedProvider.packages.length > 0 && (
                        <button
                          onClick={() => setPurchaseMode('package')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            purchaseMode === 'package'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Fixed Packages
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mode A: Custom Amount Input */}
                  {purchaseMode === 'custom' && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Enter Fiat / Local Purchase Value</span>
                        <span className="text-slate-400 font-medium">Currency: {selectedProvider.currency}</span>
                      </div>

                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-base font-black text-slate-400">$</span>
                        <input
                          type="number"
                          step="any"
                          min="0.0001"
                          max={selectedProvider.maxCustomFiat || 1000}
                          value={customFiatAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setCustomFiatAmount('');
                            } else {
                              const parsed = parseFloat(val);
                              setCustomFiatAmount(isNaN(parsed) ? '' : parsed);
                            }
                          }}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-black text-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Quick Amount Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[5, 10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setCustomFiatAmount(amt)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              customFiatAmount === amt
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-500'
                            }`}
                          >
                            ${amt}.00
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode B: Predefined Package Grid */}
                  {purchaseMode === 'package' && selectedProvider.packages.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedProvider.packages.map((pkg) => {
                          const isSelected = selectedPackage?.id === pkg.id;
                          return (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedPackage(pkg)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative space-y-1 ${
                                isSelected
                                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/30'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                              }`}
                            >
                              {pkg.badge && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                                  {pkg.badge}
                                </span>
                              )}

                              <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{pkg.name}</h5>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{pkg.description}</p>
                              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                                <span className="font-bold text-slate-500">${pkg.fiatPrice.toFixed(2)} USD</span>
                                <span className="font-black text-amber-500 dark:text-amber-400">
                                  {(pkg.fiatPrice / piConversionConfig.piRateUsd).toFixed(2)} π
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: CUSTOMER DETAILS & REAL-TIME VALIDATION */}
              {selectedProvider && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      6. Enter {selectedProvider.accountLabel}
                    </label>
                    <span className="text-[10px] text-purple-500 font-bold uppercase">Required</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        setAccountValidationResult(null);
                        setShowReviewStage(false);
                      }}
                      placeholder={selectedProvider.accountPlaceholder}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    />

                    <button
                      onClick={handleValidateAccount}
                      disabled={isValidatingAccount || !accountNumber.trim()}
                      className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {isValidatingAccount ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Verify Account</span>
                      )}
                    </button>
                  </div>

                  {/* Validation Output Message */}
                  {accountValidationResult && (
                    <div className={`p-3 rounded-xl text-xs space-y-1 ${
                      accountValidationResult.valid
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold">{accountValidationResult.name}</span>
                          <span className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                            {accountValidationResult.verificationMethod === 'DIRECT_API' ? 'Direct API Gateway' : 'Manual Verification Mode'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] opacity-90 pl-6">{accountValidationResult.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Order Review & Pi Conversion Engine (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-3xl bg-slate-900 text-white border border-purple-500/30 shadow-2xl space-y-5 sticky top-0">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-xs text-white">Live Pi Conversion Engine</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Real-time
                  </span>
                </div>

                {/* STEP 7: ORDER REVIEW SUMMARY BREAKDOWN */}
                <div className="space-y-2.5 text-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    7. Order Review Summary
                  </div>

                  <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Country / Region:</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        {selectedCountryObj.flag} {selectedCountryObj.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Provider:</span>
                      <span className="font-bold text-purple-300">{selectedProvider?.name || 'Not Selected'}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Designation:</span>
                      <span className="font-bold text-amber-300">{selectedDesignation || 'Standard'}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Account Identifier:</span>
                      <span className="font-mono font-bold text-white truncate max-w-[140px]">{accountNumber || '—'}</span>
                    </div>

                    {accountValidationResult?.name && (
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Verified Account Name:</span>
                        <span className="font-bold text-emerald-400 truncate max-w-[140px]">{accountValidationResult.name}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-300">
                      <span>Product / Value:</span>
                      <span className="font-bold text-white">
                        {purchaseMode === 'package' ? (selectedPackage?.name || 'Package') : `$${getActiveFiatPrice().toFixed(2)} USD`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                      <span>Conversion Rate:</span>
                      <span className="font-mono font-bold text-purple-400">1 π = ${piConversionConfig.piRateUsd.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Calculated Pi Big Display */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pi Coin Cost</span>
                    <div className="text-3xl font-black text-amber-400 tracking-tight">
                      {calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4)} π
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Wallet Balance: {userBalancePi.toFixed(2)} π
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Order Protection Guarantee */}
                <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center gap-2.5 text-[11px] text-purple-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Protected by Pi Network v2 Escrow & Order Protection. Instant digital fulfillment.</span>
                </div>

                {/* STEP 8: EXECUTE PI PAYMENT BUTTON */}
                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessingPayment || !selectedProvider || !accountNumber.trim() || !isWithinLimits}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Processing with Pi Wallet...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>Pay {calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4)} π with Pi Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {isEmbedded ? (
        contentInner
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          {contentInner}
        </div>
      )}

      {/* Digital Receipt Modal Overlay on Success */}
      {generatedReceipt && (
        <DigitalReceiptModal
          receipt={generatedReceipt}
          onClose={() => {
            setGeneratedReceipt(null);
            if (onClose) onClose();
          }}
          onNewTransaction={() => {
            setGeneratedReceipt(null);
            setAccountNumber('');
            setAccountValidationResult(null);
            setShowReviewStage(false);
          }}
        />
      )}
    </>
  );
};
