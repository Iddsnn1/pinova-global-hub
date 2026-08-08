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
  Check
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
import { AirtimeRechargeForm } from './AirtimeRechargeForm';

interface FlexibleUtilityModalProps {
  onClose: () => void;
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
  defaultCategory?: UtilityCategoryType;
}

export const FlexibleUtilityModal: React.FC<FlexibleUtilityModalProps> = ({
  onClose,
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onTransactionSuccess,
  defaultCategory = 'airtime'
}) => {
  // Navigation & Step state
  const [selectedCategory, setSelectedCategory] = useState<UtilityCategoryType>(defaultCategory);
  const [selectedProvider, setSelectedProvider] = useState<UtilityServiceProvider | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<'custom' | 'package'>('custom');
  
  // Account Details
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

  // Amount & Package Selection
  const [customFiatAmount, setCustomFiatAmount] = useState<number>(10);
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);

  // Processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Auto select first provider when category changes
  useEffect(() => {
    const categoryProviders = SAMPLE_UTILITY_PROVIDERS.filter(
      (p) => p.category === selectedCategory && p.enabled
    );
    if (categoryProviders.length > 0) {
      const firstProv = categoryProviders[0];
      setSelectedProvider(firstProv);
      setAccountNumber('');
      setAccountValidationResult(null);
      if (firstProv.supportsCustomAmount) {
        setPurchaseMode('custom');
        setCustomFiatAmount(firstProv.minCustomFiat || 10);
      } else if (firstProv.supportsFixedPackages && firstProv.packages.length > 0) {
        setPurchaseMode('package');
        setSelectedPackage(firstProv.packages[0]);
      }
    } else {
      setSelectedProvider(null);
    }
  }, [selectedCategory]);

  // Handle provider selection change
  const handleSelectProvider = (prov: UtilityServiceProvider) => {
    setSelectedProvider(prov);
    setAccountNumber('');
    setAccountValidationResult(null);
    if (prov.supportsCustomAmount) {
      setPurchaseMode('custom');
      setCustomFiatAmount(prov.minCustomFiat || 10);
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

  // Account Validation Handler via Provider Abstraction Adapter
  const handleValidateAccount = async () => {
    if (!accountNumber.trim()) {
      setErrorMessage('Please enter an account or phone number first.');
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
        name: result.accountName || `Account #${accountNumber}`,
        message: result.statusMessage,
        requiresManualVerification: result.requiresManualVerification,
        verificationMethod: result.verificationMethod,
        disclaimer: result.disclaimer
      });
    } catch {
      setAccountValidationResult({
        valid: false,
        message: 'Could not verify account details with provider gateway. Please check and try again.'
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
    return customFiatAmount || 0;
  };

  const calculatedPiAmount = getActiveFiatPrice() / piConversionConfig.piRateUsd;
  const isWithinLimits =
    calculatedPiAmount >= piConversionConfig.minPurchasePi &&
    calculatedPiAmount <= piConversionConfig.maxPurchasePi;

  // Execute Pi Payment
  const handleExecutePayment = async () => {
    if (!selectedProvider) return;
    if (!accountNumber.trim()) {
      setErrorMessage(`Please enter your ${selectedProvider.accountLabel}.`);
      return;
    }
    if (purchaseMode === 'custom' && (!customFiatAmount || customFiatAmount <= 0)) {
      setErrorMessage('Please enter a valid custom amount.');
      return;
    }
    if (purchaseMode === 'package' && !selectedPackage) {
      setErrorMessage('Please select a package plan.');
      return;
    }
    if (!isWithinLimits) {
      setErrorMessage(`Calculated Pi amount (${calculatedPiAmount.toFixed(4)} π) is outside limits (${piConversionConfig.minPurchasePi} π - ${piConversionConfig.maxPurchasePi} π).`);
      return;
    }

    setErrorMessage(null);
    setIsProcessingPayment(true);

    const activeFiat = getActiveFiatPrice();
    const memoText = `${selectedProvider.name} - ${accountNumber} ($${activeFiat.toFixed(2)})`;

    try {
      const paymentResult = await createPiPayment({
        amountPi: Number(calculatedPiAmount.toFixed(4)),
        memo: memoText,
        metadata: {
          category: selectedCategory,
          providerId: selectedProvider.id,
          accountNumber,
          accountName: accountValidationResult?.name || 'Verified Customer',
          fiatAmount: activeFiat,
          fiatCurrency: selectedProvider.currency,
          piRateApplied: piConversionConfig.piRateUsd,
          packageName: selectedPackage?.name || 'Custom Purchase'
        }
      });

      if (paymentResult.success) {
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
          piAmount: Number(calculatedPiAmount.toFixed(4)),
          packageName: selectedPackage?.name || 'Custom Amount Top-Up',
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
        setErrorMessage(paymentResult.message || 'Payment execution failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while contacting Pi Wallet.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const availableProviders = SAMPLE_UTILITY_PROVIDERS.filter((p) => p.category === selectedCategory && p.enabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Dynamic Pi Conversion Engine
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Rate: 1 π = ${piConversionConfig.piRateUsd.toFixed(2)} {piConversionConfig.currencyCode}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">Global Utility & Digital Services</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1: CATEGORY SELECTION (Horizontal Scroll / Grid) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              1. Select Service Category
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
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

          {/* STEP 2: PROVIDER & ACCOUNT DETAILS */}
          {selectedCategory === 'airtime' ? (
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <AirtimeRechargeForm
                piConversionConfig={piConversionConfig}
                userBalancePi={userBalancePi}
                buyerUsername={buyerUsername}
                onExecutePayment={async (params) => {
                  setIsProcessingPayment(true);
                  setErrorMessage(null);
                  try {
                    const paymentResult = await createPiPayment({
                      amountPi: params.piAmount,
                      memo: `${params.provider.name} - ${params.phoneNumber} (${params.packageName || 'Airtime'})`,
                      metadata: {
                        category: 'airtime',
                        country: params.country,
                        countryCode: params.countryCode,
                        providerId: params.provider.id,
                        accountNumber: params.phoneNumber,
                        fiatAmount: params.fiatAmount,
                        packageName: params.packageName
                      }
                    });

                    if (paymentResult && paymentResult.success) {
                      const isFulfilled = paymentResult.fulfillmentStatus === 'FULFILLED';
                      const token = isFulfilled ? (paymentResult.data?.tokenOrCode || paymentResult.data?.providerReference) : undefined;

                      const receipt: UtilityTransactionReceipt = {
                        transactionId: paymentResult.data?.transactionId || `UTIL-TX-${Date.now().toString().slice(-6)}`,
                        piPaymentId: paymentResult.paymentId || `pi_pay_${Date.now()}`,
                        piTxid: paymentResult.txid || `0x${Math.random().toString(16).substring(2, 10)}`,
                        category: 'airtime',
                        providerId: params.provider.id,
                        providerName: params.provider.name,
                        accountNumber: params.phoneNumber,
                        accountName: 'Verified Mobile Line',
                        fiatAmount: params.fiatAmount,
                        fiatCurrency: params.provider.currency,
                        appliedPiRateUsd: piConversionConfig.piRateUsd,
                        piAmount: params.piAmount,
                        packageName: params.packageName || 'Airtime Recharge',
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
                }}
                isProcessingPayment={isProcessingPayment}
                errorMessage={errorMessage}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Provider Selection & Account Details (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Service Provider Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  2. Select Service Provider ({availableProviders.length})
                </label>

                {availableProviders.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-bold">
                    No active providers listed for this category currently. Switch category above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableProviders.map((prov) => {
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
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{prov.name}</h4>
                              <span className="text-[10px] text-slate-400 font-semibold">{prov.country}</span>
                            </div>
                          </div>

                          {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Account / Meter Details Input & Real-Time Validator */}
              {selectedProvider && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      3. Enter {selectedProvider.accountLabel}
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
                        <span>Verify</span>
                      )}
                    </button>
                  </div>

                  {/* Validation Output Message */}
                  {accountValidationResult && (
                    <div className={`p-3 rounded-xl text-xs space-y-1 ${
                      accountValidationResult.valid
                        ? accountValidationResult.requiresManualVerification
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold">{accountValidationResult.name}</span>
                          <span className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                            {accountValidationResult.verificationMethod === 'DIRECT_API' ? 'Direct API Adapter' : 'Manual Verification Mode'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] opacity-90 pl-6">{accountValidationResult.message}</p>
                      {accountValidationResult.disclaimer && (
                        <p className="text-[10px] italic opacity-75 pl-6 border-t border-slate-700/30 pt-1 mt-1">
                          {accountValidationResult.disclaimer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Mode & Amount Selection */}
              {selectedProvider && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      4. Choose Purchase Method
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
                          step="0.50"
                          value={customFiatAmount}
                          onChange={(e) => setCustomFiatAmount(Number(e.target.value))}
                          min={selectedProvider.minCustomFiat || 1}
                          max={selectedProvider.maxCustomFiat || 500}
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
            </div>

            {/* Right Column: Live Order Summary & Pi Conversion Engine (5 cols) */}
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

                {/* Live Order Details Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Category:</span>
                    <span className="font-bold text-white capitalize">{selectedCategory}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Provider:</span>
                    <span className="font-bold text-purple-300">{selectedProvider?.name || 'Not Selected'}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Account Ref:</span>
                    <span className="font-mono font-bold text-white truncate max-w-[150px]">{accountNumber || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Purchase Method:</span>
                    <span className="font-bold text-white capitalize">{purchaseMode}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Local Fiat Value:</span>
                    <span className="font-bold text-white">${getActiveFiatPrice().toFixed(2)} USD</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                    <span>Applied Conversion Rate:</span>
                    <span className="font-mono font-bold text-purple-400">1 π = ${piConversionConfig.piRateUsd.toFixed(2)}</span>
                  </div>

                  {/* Calculated Pi Big Display */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pi Coin Cost</span>
                    <div className="text-3xl font-black text-amber-400 tracking-tight">
                      {calculatedPiAmount.toFixed(4)} π
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
                  <span>Backed by Pi Network v2 Escrow & Order Protection. Instant digital fulfillment.</span>
                </div>

                {/* Execute Purchase Button */}
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
                      <span>Pay {calculatedPiAmount.toFixed(4)} π with Pi Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Digital Receipt Modal Overlay on Success */}
      {generatedReceipt && (
        <DigitalReceiptModal
          receipt={generatedReceipt}
          onClose={() => {
            setGeneratedReceipt(null);
            onClose();
          }}
          onNewTransaction={() => {
            setGeneratedReceipt(null);
            setAccountNumber('');
            setAccountValidationResult(null);
          }}
        />
      )}
    </div>
  );
};
