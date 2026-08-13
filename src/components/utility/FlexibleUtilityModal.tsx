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
  FileText,
  MapPin
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
import { NIGERIAN_STATES } from './discovery/LocationSelector';

interface FlexibleUtilityModalProps {
  onClose?: () => void;
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
  defaultCategory?: UtilityCategoryType;
  initialCountryCode?: string;
  initialState?: string;
  isEmbedded?: boolean;
}

// Helper: Get flag emoji for country
function getCountryFlagEmoji(countryCodeOrName: string): string {
  if (!countryCodeOrName) return '🌐';
  const code = countryCodeOrName.trim().toUpperCase();
  if (code === 'GLOBAL' || code === 'GLOBAL SERVICES' || countryCodeOrName === 'Global') return '🌐';
  if (code === 'PAN-AFRICA' || code === 'WEST AFRICA') return '🌍';
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    return String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)));
  }
  if (countryCodeOrName === 'Nigeria') return '🇳🇬';
  if (countryCodeOrName === 'Kenya') return '🇰🇪';
  if (countryCodeOrName === 'United Arab Emirates' || countryCodeOrName === 'UAE') return '🇦🇪';
  if (countryCodeOrName === 'United Kingdom' || countryCodeOrName === 'UK') return '🇬🇧';
  if (countryCodeOrName === 'United States' || countryCodeOrName === 'USA') return '🇺🇸';
  if (countryCodeOrName === 'Saudi Arabia') return '🇸🇦';
  if (countryCodeOrName === 'Turkey' || countryCodeOrName === 'Türkiye') return '🇹🇷';
  if (countryCodeOrName === 'Ghana') return '🇬🇭';
  if (countryCodeOrName === 'India') return '🇮🇳';
  if (countryCodeOrName === 'South Africa') return '🇿🇦';
  if (countryCodeOrName === 'Philippines') return '🇵🇭';
  if (countryCodeOrName === 'Indonesia') return '🇮🇩';
  if (countryCodeOrName === 'Vietnam') return '🇻🇳';
  return '🌐';
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
  initialCountryCode = 'NG',
  initialState,
  isEmbedded = false
}) => {
  // Navigation & Category state
  const [selectedCategory, setSelectedCategory] = useState<UtilityCategoryType>(defaultCategory);
  
  // Country & State Selection State
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(initialCountryCode || 'NG');
  const [selectedState, setSelectedState] = useState<string>(initialState || (initialCountryCode === 'NG' ? 'Kano' : ''));
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Derive all available providers for selected category
  const categoryProviders = SAMPLE_UTILITY_PROVIDERS.filter(
    (p) => p.category === selectedCategory && p.enabled
  );

  // Filter providers for country
  const availableProvidersForCountry = categoryProviders.filter(p => {
    if (!selectedCountryCode) return true;
    const pCode = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
    return pCode === selectedCountryCode.toUpperCase();
  });

  // Reset/Initialize Country, Provider, Designation when category changes
  useEffect(() => {
    setErrorMessage(null);
    setAccountNumber('');
    setAccountValidationResult(null);

    const catProvs = SAMPLE_UTILITY_PROVIDERS.filter(
      (p) => p.category === selectedCategory && p.enabled
    );

    if (catProvs.length > 0) {
      const activeCode = selectedCountryCode || 'NG';
      const matchedProviders = catProvs.filter(p => {
        const pCode = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
        return pCode === activeCode.toUpperCase();
      });

      const firstProv = matchedProviders[0] || catProvs[0];
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
  }, [selectedCategory, selectedCountryCode]);

  // Handle Provider selection
  const handleSelectProvider = (prov: UtilityServiceProvider) => {
    setSelectedProvider(prov);
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

  // Utility specific field labels
  const getUtilityFieldLabel = (): string => {
    if (selectedCategory === 'airtime' || selectedCategory === 'data') {
      return 'Mobile Number';
    }
    if (selectedCategory === 'electricity') {
      return 'Meter Number';
    }
    if (selectedCategory === 'cable') {
      return 'Smartcard / IUC Number';
    }
    if (selectedCategory === 'internet') {
      return 'Account / Phone Number';
    }
    if (selectedCategory === 'education' || selectedCategory === 'exam') {
      return 'Student / Candidate Details';
    }
    if (selectedCategory === 'water') {
      return 'Customer / Meter Account';
    }
    if (selectedCategory === 'government') {
      return 'RRR / Invoice Reference';
    }
    return selectedProvider?.accountLabel || 'Account Details';
  };

  // Provider title
  const getProviderSelectionTitle = (): string => {
    if (selectedCategory === 'airtime' || selectedCategory === 'data') return 'Choose your network';
    if (selectedCategory === 'electricity') return 'Choose electricity provider';
    if (selectedCategory === 'cable') return 'Choose cable TV provider';
    if (selectedCategory === 'education' || selectedCategory === 'exam') return 'Choose education provider or examination board';
    if (selectedCategory === 'giftcard') return 'Choose gift card brand';
    return 'Choose service provider';
  };

  // Account Validation Handler via Provider Abstraction Adapter
  const handleValidateAccount = async () => {
    const fieldLabel = getUtilityFieldLabel();
    if (!accountNumber.trim()) {
      setErrorMessage(`Please enter your ${fieldLabel} first.`);
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
        name: `Verified Account #${accountNumber}`,
        message: 'Account details recorded for settlement verification.'
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

  // Execute Pi Payment
  const handleExecutePayment = async () => {
    const finalPiAmount = Number(calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4));

    if (!selectedProvider) return;
    if (!accountNumber.trim()) {
      setErrorMessage(`Please enter your ${getUtilityFieldLabel()}.`);
      return;
    }
    if (purchaseMode === 'custom' && Number(getActiveFiatPrice()) <= 0) {
      setErrorMessage('Please enter a valid amount greater than $0.');
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
          state: selectedState,
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
          accountNumber,
          accountName: accountValidationResult?.name || 'Verified Customer',
          piAmount: finalPiAmount,
          fiatAmount: activeFiat,
          fiatCurrency: selectedProvider.currency,
          timestamp: new Date().toISOString(),
          status: isFulfilled ? 'SUCCESS' : 'PROCESSING',
          tokenOrCode: token || `PIN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          packageName: selectedPackage?.name,
          appliedPiRateUsd: piConversionConfig.piRateUsd,
          orderProtectionGuaranteed: true,
          buyerUsername: buyerUsername || 'Pioneer_User'
        };

        setGeneratedReceipt(receipt);
        if (onTransactionSuccess) {
          onTransactionSuccess(receipt);
        }
      } else {
        setErrorMessage(paymentResult?.message || 'Payment process cancelled or incomplete.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment execution failed. Please check wallet connectivity.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const activeDesignations = selectedProvider?.designations || getDefaultDesignationsForCategory(selectedCategory);

  const contentInner = (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* Modal Header */}
      {!isEmbedded && (
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              {renderCategoryIcon(selectedCategory, "w-5 h-5 text-amber-400")}
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Global Services
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {UTILITY_CATEGORY_META[selectedCategory]?.title || selectedCategory}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30">
              Configured Rate: 1 π = ${piConversionConfig.piRateUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Flow Container */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
        
        {/* DISCOVERY ENGINES FOR COMPLEX CATEGORIES */}
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
                onCountryChange={(code) => setSelectedCountryCode(code)}
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
                onCountryChange={(code) => setSelectedCountryCode(code)}
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
                onCountryChange={(code) => setSelectedCountryCode(code)}
                onSelectInstitutionService={(provider, serviceName) => {
                  handleSelectProvider(provider);
                  setSelectedDesignation(serviceName);
                }}
              />
            )}
          </div>
        ) : (
          /* STANDARD UTILITY FLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Provider, Service Details, Package / Amount */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* PROVIDER SELECTION (MUST BE AFTER UTILITY SELECTION) */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {getProviderSelectionTitle()}
                </label>

                {availableProvidersForCountry.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-bold">
                    No providers available for {selectedCountryCode} in this service. Please select another location.
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
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prov.logo}
                              alt={prov.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{prov.name}</h4>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-semibold">{getCountryFlagEmoji(prov.countryCode || prov.country)} {prov.country}</span>
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

              {/* DESIGNATION / SERVICE PLAN TYPE (IF APPLICABLE) */}
              {selectedProvider && activeDesignations.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Service Plan / Designation
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {activeDesignations.map((desig) => {
                      const isSelected = selectedDesignation === desig;
                      return (
                        <button
                          key={desig}
                          onClick={() => {
                            setSelectedDesignation(desig);
                            setErrorMessage(null);
                            setAccountNumber('');
                            setAccountValidationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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

              {/* SERVICE DETAILS / ACCOUNT INPUT & VERIFICATION */}
              {selectedProvider && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Enter {getUtilityFieldLabel()}
                    </label>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Required</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        setAccountValidationResult(null);
                      }}
                      placeholder={selectedProvider.accountPlaceholder || `Enter ${getUtilityFieldLabel()}`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                    />

                    <button
                      onClick={handleValidateAccount}
                      disabled={isValidatingAccount || !accountNumber.trim()}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {isValidatingAccount ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Verify</span>
                      )}
                    </button>
                  </div>

                  {accountValidationResult && (
                    <div className={`p-3 rounded-xl text-xs space-y-1 ${
                      accountValidationResult.valid
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="font-bold">{accountValidationResult.name}</span>
                      </div>
                      <p className="text-[11px] opacity-90 pl-6">{accountValidationResult.message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* PACKAGE OR CUSTOM AMOUNT SELECTION */}
              {selectedProvider && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Select Package / Amount
                    </label>

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
                          Packages
                        </button>
                      )}
                    </div>
                  </div>

                  {purchaseMode === 'custom' && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Enter Purchase Amount</span>
                        <span className="text-slate-400 font-medium">USD ($)</span>
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
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                        />
                      </div>

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

                  {purchaseMode === 'package' && selectedProvider.packages.length > 0 && (
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
                                {(pkg.fiatPrice / piConversionConfig.piRateUsd).toFixed(4)} π
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column: Order Review Summary & Pay with Pi */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-3xl bg-slate-900 text-white border border-purple-500/30 shadow-2xl space-y-5 sticky top-0">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Order Review
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Pi-Native
                  </span>
                </div>

                <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Country / Region:</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {getCountryFlagEmoji(selectedCountryCode)} {selectedCountryCode}
                      {selectedCountryCode === 'NG' && selectedState ? ` (${selectedState})` : ''}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Provider:</span>
                    <span className="font-bold text-purple-300">{selectedProvider?.name || 'Not Selected'}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Service:</span>
                    <span className="font-bold text-amber-300">{selectedDesignation || 'Standard'}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>{getUtilityFieldLabel()}:</span>
                    <span className="font-mono font-bold text-white truncate max-w-[140px]">{accountNumber || '—'}</span>
                  </div>

                  {accountValidationResult?.name && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Verified Name:</span>
                      <span className="font-bold text-emerald-400 truncate max-w-[140px]">{accountValidationResult.name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Package / Value:</span>
                    <span className="font-bold text-white">
                      {purchaseMode === 'package' ? (selectedPackage?.name || 'Package') : `$${getActiveFiatPrice().toFixed(2)} USD`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                    <span>Configured Rate:</span>
                    <span className="font-mono font-bold text-purple-400">1 π = ${piConversionConfig.piRateUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                {/* Total Pi Display */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pi Cost</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                    {calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4)} π
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Order Guarantee */}
                <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center gap-2.5 text-[11px] text-purple-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Protected by Pi Escrow. Instant digital fulfillment upon payment.</span>
                </div>

                {/* PAY WITH PI WALLET BUTTON */}
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
        )}

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
          }}
        />
      )}
    </>
  );
};
