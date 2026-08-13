import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  FileText,
  Landmark,
  Coins,
  AlertCircle,
  X,
  FileCheck
} from 'lucide-react';
import { 
  UtilityServiceProvider, 
  UtilityProviderPackage,
  UtilityTransactionReceipt,
  PiConversionConfig 
} from '../../../types/utility';
import { resolveGovernmentServices } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector } from './LocationSelector';
import { createPiPayment } from '../../../lib/piSdk';
import { DigitalReceiptModal } from '../DigitalReceiptModal';

interface GovernmentDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  initialState?: string;
  piConversionConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onCountryChange: (countryCode: string) => void;
  onStateChange?: (state: string) => void;
  onSelectGovernmentAgency: (
    provider: UtilityServiceProvider,
    serviceName: string,
    referenceLabel: string
  ) => void;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
}

export const GovernmentDiscovery: React.FC<GovernmentDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  initialState = '',
  piConversionConfig,
  userBalancePi = 100,
  buyerUsername = 'PiPioneer',
  onCountryChange,
  onStateChange,
  onSelectGovernmentAgency,
  onTransactionSuccess
}) => {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jurisdictionLevel, setJurisdictionLevel] = useState<'all' | 'national' | 'state' | 'municipal'>('all');

  // Selection & Form state
  const [selectedAgency, setSelectedAgency] = useState<UtilityServiceProvider | null>(null);
  const [selectedCivicService, setSelectedCivicService] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);
  const [customFiatAmount, setCustomFiatAmount] = useState<number | ''>(50);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [taxpayerName, setTaxpayerName] = useState<string>('');

  // Processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  const activeRate = piConversionConfig?.piRateUsd || 314159;

  // Reset downstream state on country change
  useEffect(() => {
    setSelectedState('');
    setSelectedAgency(null);
    setSelectedCivicService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setReferenceNumber('');
    setTaxpayerName('');
    setSearchQuery('');
    setErrorMessage(null);
  }, [selectedCountryCode]);

  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    setSelectedAgency(null);
    setSelectedCivicService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setReferenceNumber('');
    setTaxpayerName('');
    setSearchQuery('');
    setErrorMessage(null);
    onCountryChange(code);
    onStateChange?.('');
  };

  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    setSelectedAgency(null);
    setSelectedCivicService('');
    setSelectedPackage(null);
    setCustomFiatAmount(50);
    setReferenceNumber('');
    setTaxpayerName('');
    setErrorMessage(null);
    onStateChange?.(st);
  };

  const govResult = useMemo(() => {
    return resolveGovernmentServices(providers, {
      countryCode: selectedCountryCode || 'NG',
      state: selectedState,
      searchQuery,
      jurisdictionLevel
    });
  }, [providers, selectedCountryCode, selectedState, searchQuery, jurisdictionLevel]);

  const handleSelectServiceOption = (
    provider: UtilityServiceProvider,
    serviceName: string
  ) => {
    setSelectedAgency(provider);
    setSelectedCivicService(serviceName);
    setErrorMessage(null);

    if (provider.supportsFixedPackages && provider.packages && provider.packages.length > 0) {
      setSelectedPackage(provider.packages[0]);
    } else if (provider.supportsCustomAmount) {
      setCustomFiatAmount(50);
      setSelectedPackage(null);
    }

    onSelectGovernmentAgency(
      provider,
      serviceName,
      provider.accountLabel || 'Reference ID / RRR / Taxpayer ID'
    );
  };

  const effectiveFiatAmount = selectedPackage ? selectedPackage.fiatPrice : Number(customFiatAmount) || 0;
  const effectivePiAmount = effectiveFiatAmount > 0 ? (effectiveFiatAmount / activeRate).toFixed(7) : '0.0000000';

  const handleProcessPayment = async () => {
    if (!selectedAgency || !selectedCivicService) {
      setErrorMessage('Please select a government agency and civic service.');
      return;
    }
    if (!referenceNumber.trim()) {
      setErrorMessage(`Please provide your ${selectedAgency.accountLabel || 'Reference ID / RRR'}.`);
      return;
    }
    if (effectiveFiatAmount <= 0) {
      setErrorMessage('Please specify a valid clearance amount.');
      return;
    }

    const piAmountNum = Number(effectivePiAmount);
    if (userBalancePi < piAmountNum) {
      setErrorMessage(`Insufficient Pi balance. Required: ${effectivePiAmount} π, Available: ${userBalancePi.toFixed(4)} π`);
      return;
    }

    setIsProcessingPayment(true);
    setErrorMessage(null);

    try {
      const paymentTitle = `${selectedAgency.name} - ${selectedCivicService}`;
      const memo = `Civic settlement for Ref: ${referenceNumber} (${selectedAgency.country})`;

      const piPaymentResult = await createPiPayment({
        amountPi: piAmountNum,
        memo,
        metadata: {
          category: 'government',
          providerId: selectedAgency.id,
          providerName: selectedAgency.name,
          countryCode: selectedAgency.countryCode,
          subdivisionCode: selectedAgency.subdivisionCode || selectedState,
          serviceName: selectedCivicService,
          accountNumber: referenceNumber,
          customerName: taxpayerName,
          fiatAmount: effectiveFiatAmount,
          fiatCurrency: selectedAgency.currency || 'USD',
          piRateUsd: activeRate
        }
      });

      const receipt: UtilityTransactionReceipt = {
        transactionId: piPaymentResult.txid || `TX-GOV-${Date.now()}`,
        piPaymentId: piPaymentResult.paymentId || `PAY-GOV-${Date.now()}`,
        piTxid: piPaymentResult.txid,
        category: 'government',
        providerId: selectedAgency.id,
        providerName: selectedAgency.name,
        accountNumber: referenceNumber,
        accountName: taxpayerName || 'Verified Citizen / Taxpayer',
        fiatAmount: effectiveFiatAmount,
        fiatCurrency: selectedAgency.currency || 'USD',
        appliedPiRateUsd: activeRate,
        piAmount: piAmountNum,
        packageName: selectedCivicService,
        tokenOrCode: `TSA-REV-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        orderProtectionGuaranteed: true,
        buyerUsername: buyerUsername || 'PiPioneer'
      };

      setGeneratedReceipt(receipt);
      onTransactionSuccess?.(receipt);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Civic bill settlement failed. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-emerald-500/20 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Government & Civic Service Portals
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  TSA / Revenue Clearance
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct settlement for federal taxes, passports, driver licenses, vehicle registration & municipal fees.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-emerald-300 font-mono">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>1 π = ${activeRate.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* Location & Jurisdiction Filter */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'NG'}
          state={selectedState}
          onCountryChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          showStateSelector={true}
          stateLabel="State / Region / Province"
        />

        {/* Agency Search & Jurisdiction Buttons */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Search Agency or Service
            </label>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <X className="w-3 h-3" /> Clear search
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Passport, Tax, Remita RRR, Driver Licence, IRS, Civic..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Agencies' },
              { id: 'national', label: 'Federal / National' },
              { id: 'state', label: 'State IRS / Revenue' },
              { id: 'municipal', label: 'Municipal / City' }
            ].map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setJurisdictionLevel(j.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  jurisdictionLevel === j.id
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agency Search Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Step 1: Select Agency & Civic Service ({govResult.agencies.length} available)
          </h4>
        </div>

        {govResult.agencies.length > 0 ? (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {govResult.agencies.map((agency) => {
              const fullProvider = providers.find((p) => p.id === agency.providerId) || providers[0];
              const isAgencySelected = selectedAgency?.id === agency.providerId;

              return (
                <div
                  key={agency.providerId}
                  id={`gov-card-${agency.providerId}`}
                  className={`bg-slate-900/90 border rounded-2xl p-4 transition-all space-y-3 ${
                    isAgencySelected
                      ? 'border-emerald-500/80 bg-slate-900/95 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={fullProvider.logo}
                        alt={agency.agencyName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          {agency.agencyName}
                        </h5>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Landmark className="w-3 h-3 text-emerald-400" />
                          <span>{agency.country}</span>
                          {agency.state && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-emerald-300 font-medium">{agency.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {agency.hasDirectValidationApi && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        API Validation
                      </span>
                    )}
                  </div>

                  {/* Available Services */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Civic Service:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agency.availableServices.map((serviceName) => {
                        const isServiceSelected = isAgencySelected && selectedCivicService === serviceName;

                        return (
                          <button
                            id={`btn-gov-${agency.providerId}-${serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            type="button"
                            key={serviceName}
                            onClick={() => handleSelectServiceOption(fullProvider, serviceName)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all text-xs font-medium flex items-center justify-between group/btn cursor-pointer ${
                              isServiceSelected
                                ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/40 text-white font-bold shadow-md shadow-emerald-950/40'
                                : 'bg-slate-800/90 hover:bg-slate-800 hover:border-emerald-500/50 border-slate-700/80 text-slate-300 hover:text-white'
                            } border`}
                          >
                            <span className="truncate mr-2">{serviceName}</span>
                            {isServiceSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
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
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center space-y-1">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No agencies match your search</p>
            <p className="text-xs text-slate-400">Try searching for broader terms like "Tax", "Passport", "TSA", or "Permit".</p>
          </div>
        )}
      </div>

      {/* Step 2: Citizen Reference, Amount & Payment Settlement */}
      {selectedAgency && selectedCivicService && (
        <div
          id="gov-settlement-panel"
          className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl shadow-emerald-950/30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Step 2: Civic Clearance & Settlement Details
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedAgency.name} &bull; <span className="text-emerald-300 font-semibold">{selectedCivicService}</span>
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              TSA Compliant
            </span>
          </div>

          {/* Reference input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {selectedAgency.accountLabel || 'Reference ID / RRR / Taxpayer ID'} <span className="text-emerald-400">*</span>
              </label>
              <input
                id="gov-ref-input"
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={selectedAgency.accountPlaceholder || 'e.g. RRR-1829-4910-2918'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Taxpayer / Applicant Full Name
              </label>
              <input
                id="gov-taxpayer-name-input"
                type="text"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                placeholder="e.g. Olayinka Adebayo"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Amount / Package Selection */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Clearance Settlement Amount
            </label>

            {selectedAgency.packages && selectedAgency.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedAgency.packages.map((pkg) => {
                  const isPkgSelected = selectedPackage?.id === pkg.id;
                  const pkgPi = (pkg.fiatPrice / activeRate).toFixed(7);

                  return (
                    <button
                      id={`btn-gov-pkg-${pkg.id}`}
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setCustomFiatAmount('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isPkgSelected
                          ? 'bg-emerald-600/20 border-emerald-500 ring-1 ring-emerald-500/50 text-white'
                          : 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{pkg.name}</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">${pkg.fiatPrice}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>{pkg.description || 'Instant Civic Clearance'}</span>
                        <span className="text-emerald-300 font-mono font-semibold">{pkgPi} π</span>
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
                    id="gov-custom-amount-input"
                    type="number"
                    min={selectedAgency.minCustomFiat || 1}
                    max={selectedAgency.maxCustomFiat || 1000}
                    value={customFiatAmount}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setCustomFiatAmount(val);
                      setSelectedPackage(null);
                    }}
                    placeholder="Enter USD amount"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCustomFiatAmount(preset);
                        setSelectedPackage(null);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                        customFiatAmount === preset
                          ? 'bg-emerald-600 text-white'
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
              <span>Agency</span>
              <span className="font-semibold text-slate-200">{selectedAgency.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Civic Service</span>
              <span className="font-semibold text-emerald-300">{selectedCivicService}</span>
            </div>
            {referenceNumber && (
              <div className="flex items-center justify-between text-slate-400">
                <span>Reference / Tax ID</span>
                <span className="font-mono font-semibold text-slate-200">{referenceNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-400">
              <span>Fiat Value</span>
              <span className="font-mono font-bold text-slate-200">${effectiveFiatAmount.toFixed(2)} USD</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="font-bold text-slate-200">Total Pi Network Due</span>
              <span className="font-mono font-bold text-sm text-emerald-400 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {effectivePiAmount} π
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

          {/* Payment Execution Button */}
          <button
            id="btn-gov-pay-settlement"
            type="button"
            disabled={isProcessingPayment || effectiveFiatAmount <= 0}
            onClick={handleProcessPayment}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            {isProcessingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing TSA Civic Clearance...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Settle Civic Fee &bull; Pay {effectivePiAmount} π</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {generatedReceipt && (
        <DigitalReceiptModal
          receipt={generatedReceipt}
          onClose={() => setGeneratedReceipt(null)}
        />
      )}
    </div>
  );
};
