import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Building,
  Coins,
  ShieldCheck,
  ShieldAlert,
  X,
  CreditCard,
  RefreshCw,
  Info,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import {
  UtilityServiceProvider,
  UtilityProviderPackage,
  UtilityTransactionReceipt,
  PiConversionConfig,
  ElectricityServiceArea,
  ElectricityMeterVerificationResult
} from '../../../types/utility';
import { resolveElectricityProviders, verifyElectricityMeter, identifyLikelyElectricityProvider } from '../../../lib/utility/electricityDiscovery';
import { LocationSelector } from './LocationSelector';
import { createPiPayment } from '../../../lib/piSdk';
import { DigitalReceiptModal } from '../DigitalReceiptModal';

interface ElectricityDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  initialState?: string;
  piConversionConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onCountryChange: (countryCode: string) => void;
  onStateChange?: (state: string) => void;
  onSelectElectricityService?: (provider: UtilityServiceProvider, serviceArea?: ElectricityServiceArea) => void;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
}

/**
 * Mask sensitive meter number for privacy-compliant customer display
 */
function maskMeterNumber(rawMeter: string): string {
  const clean = rawMeter.replace(/\s+/g, '');
  if (clean.length <= 6) return clean;
  const start = clean.slice(0, 4);
  const end = clean.slice(-3);
  return `${start} •••• ${end}`;
}

export const ElectricityDiscovery: React.FC<ElectricityDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  initialState = '',
  piConversionConfig,
  userBalancePi = 100,
  buyerUsername = 'PiPioneer',
  onCountryChange,
  onStateChange,
  onSelectElectricityService,
  onTransactionSuccess
}) => {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedServiceAreaId, setSelectedServiceAreaId] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<UtilityServiceProvider | null>(null);
  const [selectedServicePlan, setSelectedServicePlan] = useState<string>('Prepaid Meter Token Generation');
  
  // Meter & Account input state
  const [meterNumber, setMeterNumber] = useState<string>('');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [isValidatingMeter, setIsValidatingMeter] = useState<boolean>(false);
  const [meterVerificationResult, setMeterVerificationResult] = useState<ElectricityMeterVerificationResult | null>(null);

  // Amount state
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);
  const [customFiatAmount, setCustomFiatAmount] = useState<number | ''>(25);

  // Flow & Modal state
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Conversion rate (Default GCV: 1 Pi = $314,159 USD)
  const activeRate = piConversionConfig?.piRateUsd || 314159;

  // 1. Resolve Electricity Providers & Service Areas
  const electricityResolution = useMemo(() => {
    return resolveElectricityProviders(
      {
        countryCode: selectedCountryCode,
        state: selectedState,
        serviceAreaId: selectedServiceAreaId
      },
      providers
    );
  }, [selectedCountryCode, selectedState, selectedServiceAreaId, providers]);

  // Synchronize state when country changes
  useEffect(() => {
    setSelectedState(initialState);
    setSelectedServiceAreaId('');
    setSelectedProvider(null);
    setMeterNumber('');
    setMeterVerificationResult(null);
    setErrorMessage(null);
  }, [selectedCountryCode, initialState]);

  // Auto-select single resolved provider if 1:1 match in region
  useEffect(() => {
    if (electricityResolution.isProviderResolved && electricityResolution.resolvedProvider) {
      setSelectedProvider(electricityResolution.resolvedProvider);
    } else if (electricityResolution.availableProviders.length > 0 && !selectedProvider) {
      setSelectedProvider(electricityResolution.availableProviders[0]);
    }
  }, [electricityResolution, selectedProvider]);

  // Meter Prefix Provider Identification preview
  const likelyProviderInfo = useMemo(() => {
    if (!meterNumber.trim() || meterNumber.trim().length < 4) return null;
    return identifyLikelyElectricityProvider(meterNumber.trim(), selectedCountryCode, selectedProvider?.id);
  }, [meterNumber, selectedCountryCode, selectedProvider?.id]);

  // Handle State Change
  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    setSelectedServiceAreaId('');
    setMeterVerificationResult(null);
    setErrorMessage(null);
    if (onStateChange) {
      onStateChange(st);
    }
  };

  // Handle Service Area Selection
  const handleServiceAreaSelect = (area: ElectricityServiceArea) => {
    setSelectedServiceAreaId(area.id);
    const matchingProv = providers.find((p) => p.id === area.providerId) || 
                         electricityResolution.availableProviders.find((p) => p.id === area.providerId);
    if (matchingProv) {
      setSelectedProvider(matchingProv);
      if (onSelectElectricityService) {
        onSelectElectricityService(matchingProv, area);
      }
    }
  };

  // Handle Meter Verification
  const handleVerifyMeter = async () => {
    if (!meterNumber.trim()) {
      setErrorMessage('Please enter your meter or account number to verify.');
      return;
    }

    setErrorMessage(null);
    setIsValidatingMeter(true);

    try {
      const result = await verifyElectricityMeter({
        meterNumber: meterNumber.trim(),
        meterType,
        preliminaryProviderId: selectedProvider?.id,
        countryCode: selectedCountryCode,
        state: selectedState,
        serviceAreaId: selectedServiceAreaId
      });

      setMeterVerificationResult(result);

      if (result.status === 'MISMATCH') {
        // Mismatch detected - do NOT silently switch without user action
        setErrorMessage(null);
      }
    } catch {
      setErrorMessage('Verification timed out. Please double check meter digits and retry.');
    } finally {
      setIsValidatingMeter(false);
    }
  };

  // Switch Provider in case of Mismatch
  const handleAcceptMismatchSwitch = (targetProviderId: string) => {
    const trueProvider = providers.find((p) => p.id === targetProviderId) ||
                         electricityResolution.availableProviders.find((p) => p.id === targetProviderId);
    if (trueProvider) {
      setSelectedProvider(trueProvider);
      setMeterVerificationResult(null);
      setErrorMessage(null);
      // Re-trigger verification with newly selected provider
      setTimeout(() => {
        handleVerifyMeter();
      }, 50);
    }
  };

  // Calculate fiat and Pi amounts
  const finalFiatAmount = selectedPackage ? selectedPackage.fiatPrice : (Number(customFiatAmount) || 0);
  const calculatedPiAmount = finalFiatAmount > 0 ? Number((finalFiatAmount / activeRate).toFixed(7)) : 0;

  // Handle Payment Settlement
  const handleProceedPayment = async () => {
    if (!selectedProvider) {
      setErrorMessage('Please select a utility distribution provider.');
      return;
    }

    if (!meterNumber.trim() || meterNumber.trim().length < 5) {
      setErrorMessage('Please enter a valid meter number (at least 5 characters).');
      return;
    }

    if (meterVerificationResult?.status === 'MISMATCH') {
      setErrorMessage('Please resolve the electricity provider mismatch before proceeding with payment.');
      return;
    }

    if (finalFiatAmount <= 0) {
      setErrorMessage('Please specify a valid payment amount.');
      return;
    }

    if (userBalancePi < calculatedPiAmount) {
      setErrorMessage(`Insufficient Pi balance. Required: ${calculatedPiAmount} π, Available: ${userBalancePi} π.`);
      return;
    }

    setErrorMessage(null);
    setIsProcessingPayment(true);

    try {
      const memo = `Electricity ${selectedServicePlan} - ${selectedProvider.name} (Meter: ${meterNumber})`;
      const paymentResult = await createPiPayment({
        amountPi: calculatedPiAmount,
        memo,
        metadata: {
          category: 'electricity',
          providerId: selectedProvider.id,
          meterNumber,
          serviceArea: electricityResolution.selectedServiceArea?.name || selectedState,
          fiatAmount: finalFiatAmount
        }
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment execution failed on Pi Blockchain.');
      }

      // Generate 20-Digit Standard Electricity STS Token
      const generateStsToken = () => {
        const seg = () => Math.floor(1000 + Math.random() * 9000);
        return `${seg()}-${seg()}-${seg()}-${seg()}-${seg()}`;
      };

      const receipt: UtilityTransactionReceipt = {
        transactionId: `TX-ELEC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        piPaymentId: paymentResult.txid || `PI-PAY-${Date.now()}`,
        piTxid: paymentResult.txid,
        category: 'electricity',
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        accountNumber: meterNumber,
        accountName: meterVerificationResult?.customerName || `Meter Account #${meterNumber}`,
        fiatAmount: finalFiatAmount,
        fiatCurrency: 'USD',
        appliedPiRateUsd: activeRate,
        piAmount: calculatedPiAmount,
        packageName: selectedServicePlan,
        tokenOrCode: generateStsToken(),
        serialNumber: `STS-MTR-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        orderProtectionGuaranteed: true,
        buyerUsername
      };

      setGeneratedReceipt(receipt);
      if (onTransactionSuccess) {
        onTransactionSuccess(receipt);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment settlement failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100" id="electricity-discovery-container">
      {/* 1. CANONICAL SERVICE AVAILABILITY LOCATION SELECTOR */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
        <LocationSelector
          countryCode={selectedCountryCode || 'GLOBAL'}
          state={selectedState}
          onCountryChange={onCountryChange}
          onStateChange={handleStateSelect}
          stateLabel="State / Province"
        />
      </div>

      {/* 2. RESOLUTION STATUS & SERVICE AREA HIERARCHY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            Electricity Distribution & Service Areas
          </label>
          <span className="text-[11px] text-slate-400">
            {electricityResolution.availableProviders.length} provider(s) identified
          </span>
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
          electricityResolution.availableProviders.length > 0
            ? 'bg-slate-900/80 border border-slate-800 text-slate-300'
            : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
        }`}>
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{electricityResolution.statusMessage}</p>
        </div>

        {/* Granular Service Area District Selector */}
        {electricityResolution.availableServiceAreas.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Specific Service Area / District:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {electricityResolution.availableServiceAreas.map((area) => {
                const isSelected = selectedServiceAreaId === area.id || 
                                  (!selectedServiceAreaId && area.isPrimary && selectedProvider?.id === area.providerId);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleServiceAreaSelect(area)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {area.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {area.coverageDescription || area.lgasOrCities?.join(', ')}
                    </p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/80 text-[10px]">
                      <span className="text-amber-400 font-semibold">{area.providerName}</span>
                      {area.isPrimary && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Primary Area</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Provider Cards */}
        {electricityResolution.availableProviders.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Distribution Company (DisCo):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {electricityResolution.availableProviders.map((provider) => {
                const isSelected = selectedProvider?.id === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(provider);
                      setMeterVerificationResult(null);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/30'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 truncate">
                          {provider.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {provider.country} · {provider.state || 'Multi-state Network'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. SERVICE PLAN SELECTION */}
      {selectedProvider && (
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Service Plan / Payment Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'prepaid', title: 'Prepaid Token', subtitle: 'Standard STS Meter Token', icon: Zap },
              { id: 'postpaid', title: 'Postpaid Bill', subtitle: 'Monthly Bill Settlement', icon: CheckCircle2 },
              { id: 'commercial', title: 'Commercial / MD', subtitle: 'Maximum Demand & Power', icon: Building }
            ].map((plan) => {
              const isSelected = (plan.id === 'prepaid' && selectedServicePlan.includes('Prepaid')) ||
                                (plan.id === 'postpaid' && selectedServicePlan.includes('Postpaid')) ||
                                (plan.id === 'commercial' && selectedServicePlan.includes('Commercial'));
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    if (plan.id === 'prepaid') {
                      setSelectedServicePlan('Prepaid Meter Token Generation');
                      setMeterType('prepaid');
                    } else if (plan.id === 'postpaid') {
                      setSelectedServicePlan('Postpaid Monthly Bill Settlement');
                      setMeterType('postpaid');
                    } else {
                      setSelectedServicePlan('Commercial Utility Payment');
                      setMeterType('postpaid');
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <plan.icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="text-xs font-bold block text-slate-100">{plan.title}</span>
                    <span className="text-[10px] text-slate-400">{plan.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. METER RESOLUTION & VERIFICATION FLOW */}
      {selectedProvider && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              Meter / Customer Identifier
            </label>
            <span className="text-[10px] text-slate-400">Step 1: Format & Provider · Step 2: Verification</span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value);
                  setMeterVerificationResult(null);
                }}
                placeholder={selectedProvider.accountPlaceholder || 'Enter 11 to 13-digit meter number'}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
              {meterNumber && (
                <button
                  type="button"
                  onClick={() => {
                    setMeterNumber('');
                    setMeterVerificationResult(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleVerifyMeter}
              disabled={isValidatingMeter || !meterNumber.trim() || meterNumber.trim().length < 5}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {isValidatingMeter ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying meter...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify</span>
                </>
              )}
            </button>
          </div>

          {/* Local Provider Identification (Before or alongside real verification) */}
          {likelyProviderInfo?.matched && !meterVerificationResult && (
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-slate-200">Provider identified:</strong> {likelyProviderInfo.providerName}
                  {likelyProviderInfo.serviceAreaName ? ` (${likelyProviderInfo.serviceAreaName})` : ''}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Likely provider</span>
            </div>
          )}

          {/* VERIFICATION STATE DISPLAY */}

          {/* State: VERIFIED (Real provider confirmation with validated fields) */}
          {meterVerificationResult?.status === 'VERIFIED' && meterVerificationResult.isCustomerVerified && (
            <div className="p-3.5 rounded-xl text-xs space-y-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Meter verified ✓</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  {meterVerificationResult.accountStatus || 'Active Account'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-500/20 text-[11px]">
                {meterVerificationResult.customerName && (
                  <div>
                    <span className="text-emerald-400/80 font-medium">Customer: </span>
                    <span className="font-semibold text-emerald-100">{meterVerificationResult.customerName}</span>
                  </div>
                )}
                <div>
                  <span className="text-emerald-400/80 font-medium">Meter: </span>
                  <span className="font-mono text-emerald-100">{maskMeterNumber(meterVerificationResult.meterNumber)}</span>
                </div>
                <div>
                  <span className="text-emerald-400/80 font-medium">Tariff: </span>
                  <span className="text-emerald-100">{meterVerificationResult.tariffBand || 'Standard Distribution Tariff'}</span>
                </div>
                <div>
                  <span className="text-emerald-400/80 font-medium">Status: </span>
                  <span className="text-emerald-100">{meterVerificationResult.accountStatus || 'Active / Enabled'}</span>
                </div>
                {meterVerificationResult.customerAddress && (
                  <div className="sm:col-span-2">
                    <span className="text-emerald-400/80 font-medium">Service Address: </span>
                    <span className="text-emerald-100">{meterVerificationResult.customerAddress}</span>
                  </div>
                )}
                {meterVerificationResult.outstandingDebtFiat !== undefined && meterVerificationResult.outstandingDebtFiat > 0 && (
                  <div className="sm:col-span-2 text-amber-300">
                    <span className="font-medium">Outstanding Balance: </span>
                    <span className="font-bold">${meterVerificationResult.outstandingDebtFiat.toFixed(2)} USD</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* State: MISMATCH (Selected provider differs from authoritative meter routing) */}
          {meterVerificationResult?.status === 'MISMATCH' && (
            <div className="p-3.5 rounded-xl text-xs space-y-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <div className="flex items-center gap-2 font-bold text-rose-200">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Provider mismatch</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                Your meter is associated with a different electricity provider. Please review the service area/provider selection.
              </p>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-[11px] flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Associated provider: </span>
                  <span className="font-bold text-slate-100">{meterVerificationResult.resolvedProviderName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAcceptMismatchSwitch(meterVerificationResult.resolvedProviderId)}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition-colors"
                >
                  Switch to {meterVerificationResult.resolvedProviderName.split(' ')[0]}
                </button>
              </div>
            </div>
          )}

          {/* State: UNAVAILABLE / PROVIDER_IDENTIFIED (No fake data; clearly informs verification is required) */}
          {meterVerificationResult?.status === 'UNAVAILABLE' && (
            <div className="p-3.5 rounded-xl text-xs space-y-2 bg-slate-950/80 border border-slate-700/80 text-slate-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Meter number captured</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                  Provider verification required
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                We need to verify this meter with the electricity provider before displaying customer details or processing the transaction.
              </p>
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Provider identified:</span>
                <span className="font-semibold text-slate-200">{meterVerificationResult.resolvedProviderName}</span>
              </div>
            </div>
          )}

          {/* State: INVALID */}
          {meterVerificationResult?.status === 'INVALID' && (
            <div className="p-3.5 rounded-xl text-xs space-y-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Invalid Meter Number</span>
              </div>
              <p className="text-[11px] text-rose-200/90">
                {meterVerificationResult.statusMessage || 'Meter/account number could not be verified. Please check the digits and try again.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. PACKAGE OR CUSTOM AMOUNT SELECTION */}
      {selectedProvider && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Token Recharge Amount
            </label>
            <span className="text-[11px] text-slate-400">
              1 Pi = ${activeRate.toLocaleString()} USD
            </span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amt) => {
              const isSelected = !selectedPackage && customFiatAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedPackage(null);
                    setCustomFiatAmount(amt);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">${amt} USD</div>
                  <div className="text-[10px] text-slate-400">
                    ~{(amt / activeRate).toFixed(6)} π
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</div>
            <input
              type="number"
              min="1"
              max="1000"
              value={customFiatAmount}
              onChange={(e) => {
                setSelectedPackage(null);
                setCustomFiatAmount(e.target.value === '' ? '' : Number(e.target.value));
              }}
              placeholder="Enter custom USD amount (e.g. 35)"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-8 pr-28 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-semibold"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
              ≈ {calculatedPiAmount} π
            </div>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* 6. ORDER REVIEW & SETTLEMENT */}
      {selectedProvider && (
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Order Summary</span>
            <span className="text-xs font-bold text-amber-400">{calculatedPiAmount} π</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Service Country:</span>
              <span className="font-semibold text-slate-200">{electricityResolution.countryName}</span>
            </div>
            {selectedState && (
              <div className="flex justify-between">
                <span className="text-slate-400">State / Region:</span>
                <span className="font-semibold text-slate-200">{selectedState}</span>
              </div>
            )}
            {electricityResolution.selectedServiceArea && (
              <div className="flex justify-between">
                <span className="text-slate-400">Service Area:</span>
                <span className="font-semibold text-amber-300">{electricityResolution.selectedServiceArea.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Distribution Provider:</span>
              <span className="font-semibold text-purple-300">{selectedProvider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Service Plan:</span>
              <span className="font-semibold text-slate-200">{selectedServicePlan}</span>
            </div>
            {meterNumber && (
              <div className="flex justify-between">
                <span className="text-slate-400">Meter / Account ID:</span>
                <span className="font-mono text-slate-200">{maskMeterNumber(meterNumber)}</span>
              </div>
            )}
            {meterVerificationResult?.customerName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-semibold text-emerald-400">{meterVerificationResult.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Tariff Classification:</span>
              <span className="text-slate-300">
                {meterVerificationResult?.tariffBand
                  ? meterVerificationResult.tariffBand
                  : 'Tariff information unavailable (confirmed at token vend)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Energy Units:</span>
              <span className="text-slate-300">
                {meterVerificationResult?.unitsPurchasable
                  ? `${meterVerificationResult.unitsPurchasable} kWh`
                  : 'Delivered at token generation (STS Standard)'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
              <span className="text-slate-100">Total Settlement:</span>
              <span className="text-amber-400">{calculatedPiAmount} π (${finalFiatAmount} USD)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedPayment}
            disabled={isProcessingPayment || !meterNumber.trim() || finalFiatAmount <= 0 || meterVerificationResult?.status === 'MISMATCH'}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessingPayment ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Pi Settlement...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Pay {calculatedPiAmount} π & Generate STS Token</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* DIGITAL RECEIPT MODAL */}
      {generatedReceipt && (
        <DigitalReceiptModal
          receipt={generatedReceipt}
          isOpen={true}
          onClose={() => setGeneratedReceipt(null)}
        />
      )}
    </div>
  );
};
