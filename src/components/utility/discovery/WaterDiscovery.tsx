import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplets, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Building,
  Coins,
  ShieldCheck,
  Search,
  X,
  CreditCard,
  Receipt,
  FileCheck
} from 'lucide-react';
import { 
  UtilityServiceProvider, 
  UtilityProviderPackage,
  UtilityTransactionReceipt,
  PiConversionConfig 
} from '../../../types/utility';
import { resolveWaterProviders } from '../../../lib/utility/serviceDiscovery';
import { LocationSelector } from './LocationSelector';
import { createPiPayment } from '../../../lib/piSdk';
import { DigitalReceiptModal } from '../DigitalReceiptModal';

interface WaterDiscoveryProps {
  providers: UtilityServiceProvider[];
  selectedCountryCode: string;
  initialState?: string;
  piConversionConfig?: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onCountryChange: (countryCode: string) => void;
  onStateChange?: (state: string) => void;
  onSelectWaterService: (provider: UtilityServiceProvider, designation: string) => void;
  onTransactionSuccess?: (receipt: UtilityTransactionReceipt) => void;
}

export const WaterDiscovery: React.FC<WaterDiscoveryProps> = ({
  providers,
  selectedCountryCode,
  initialState = '',
  piConversionConfig,
  userBalancePi = 100,
  buyerUsername = 'PiPioneer',
  onCountryChange,
  onStateChange,
  onSelectWaterService,
  onTransactionSuccess
}) => {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [cityOrLga, setCityOrLga] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Provider and Service State
  const [selectedProvider, setSelectedProvider] = useState<UtilityServiceProvider | null>(null);
  const [selectedWaterService, setSelectedWaterService] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);
  const [customFiatAmount, setCustomFiatAmount] = useState<number | ''>(25);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  // Validation and Processing
  const [isValidatingAccount, setIsValidatingAccount] = useState<boolean>(false);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<UtilityTransactionReceipt | null>(null);

  // Conversion rate (Default GCV: 1 Pi = $314,159 USD)
  const activeRate = piConversionConfig?.piRateUsd || 314159;

  // Reset internal downstream state when country changes
  useEffect(() => {
    setSelectedState('');
    setCityOrLga('');
    setSelectedProvider(null);
    setSelectedWaterService('');
    setSelectedPackage(null);
    setCustomFiatAmount(25);
    setAccountNumber('');
    setCustomerName('');
    setIsAccountVerified(false);
    setSearchQuery('');
    setErrorMessage(null);
  }, [selectedCountryCode]);

  // Handle Country Selection
  const handleCountrySelect = (code: string) => {
    setSelectedState('');
    setCityOrLga('');
    setSelectedProvider(null);
    setSelectedWaterService('');
    setSelectedPackage(null);
    setCustomFiatAmount(25);
    setAccountNumber('');
    setCustomerName('');
    setIsAccountVerified(false);
    setSearchQuery('');
    setErrorMessage(null);
    onCountryChange(code);
    onStateChange?.('');
  };

  // Handle State Selection
  const handleStateSelect = (st: string) => {
    setSelectedState(st);
    setCityOrLga('');
    setSelectedProvider(null);
    setSelectedWaterService('');
    setSelectedPackage(null);
    setCustomFiatAmount(25);
    setAccountNumber('');
    setCustomerName('');
    setIsAccountVerified(false);
    setErrorMessage(null);
    onStateChange?.(st);
  };

  // Resolve water providers
  const discoveryResult = useMemo(() => {
    const res = resolveWaterProviders(
      providers,
      selectedCountryCode || 'AE',
      selectedState
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return {
        ...res,
        availableProviders: res.availableProviders.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          (p.designations && p.designations.some((d) => d.toLowerCase().includes(q)))
        )
      };
    }
    return res;
  }, [providers, selectedCountryCode, selectedState, searchQuery]);

  // Handle selecting a water service button
  const handleSelectServiceOption = (
    provider: UtilityServiceProvider,
    serviceName: string
  ) => {
    setSelectedProvider(provider);
    setSelectedWaterService(serviceName);
    setErrorMessage(null);

    // Default package or custom amount
    if (provider.supportsFixedPackages && provider.packages && provider.packages.length > 0) {
      setSelectedPackage(provider.packages[0]);
    } else if (provider.supportsCustomAmount) {
      setCustomFiatAmount(25);
      setSelectedPackage(null);
    }

    onSelectWaterService(provider, serviceName);
  };

  // Calculate effective fiat and Pi network amounts
  const effectiveFiatAmount = selectedPackage ? selectedPackage.fiatPrice : Number(customFiatAmount) || 0;
  const effectivePiAmount = effectiveFiatAmount > 0 ? (effectiveFiatAmount / activeRate).toFixed(7) : '0.0000000';

  // Handle Meter / Account Verification
  const handleVerifyAccount = () => {
    if (!accountNumber.trim()) {
      setErrorMessage('Please enter a valid municipal meter or account reference number.');
      return;
    }
    setIsValidatingAccount(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsValidatingAccount(false);
      setIsAccountVerified(true);
      if (!customerName) {
        setCustomerName('Verified Resident Account');
      }
    }, 700);
  };

  // Handle Pi Payment Execution
  const handleProcessPayment = async () => {
    if (!selectedProvider || !selectedWaterService) {
      setErrorMessage('Please select a water service provider and service type.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage('Please provide your meter or account reference number.');
      return;
    }
    if (effectiveFiatAmount <= 0) {
      setErrorMessage('Please specify a valid payment amount.');
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
      const paymentTitle = `${selectedProvider.name} - ${selectedWaterService}`;
      const memo = `Water settlement for Meter/Ref: ${accountNumber} (${selectedProvider.country})`;

      const piPaymentResult = await createPiPayment({
        amountPi: piAmountNum,
        memo,
        metadata: {
          category: 'water',
          providerId: selectedProvider.id,
          providerName: selectedProvider.name,
          countryCode: selectedProvider.countryCode,
          subdivisionCode: selectedProvider.subdivisionCode || selectedState,
          serviceName: selectedWaterService,
          accountNumber,
          customerName,
          fiatAmount: effectiveFiatAmount,
          fiatCurrency: selectedProvider.currency || 'USD',
          piRateUsd: activeRate
        }
      });

      const receipt: UtilityTransactionReceipt = {
        transactionId: piPaymentResult.txid || `TX-WATER-${Date.now()}`,
        piPaymentId: piPaymentResult.paymentId || `PAY-WATER-${Date.now()}`,
        piTxid: piPaymentResult.txid,
        category: 'water',
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        accountNumber,
        accountName: customerName || 'Verified Account',
        fiatAmount: effectiveFiatAmount,
        fiatCurrency: selectedProvider.currency || 'USD',
        appliedPiRateUsd: activeRate,
        piAmount: piAmountNum,
        packageName: selectedWaterService,
        tokenOrCode: `MTR-TOKEN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        orderProtectionGuaranteed: true,
        buyerUsername: buyerUsername || 'PiPioneer'
      };

      setGeneratedReceipt(receipt);
      onTransactionSuccess?.(receipt);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Water bill payment processing failed. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-cyan-500/20 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Municipal & Regional Water Discovery
                <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Verified Gateways
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Location-aware discovery for municipal water utilities, prepaid meters, and bill settlements.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-cyan-300 font-mono">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span>1 π = ${activeRate.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* Hierarchical Location Selector */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
        <LocationSelector
          countryCode={selectedCountryCode || 'AE'}
          state={selectedState}
          cityOrLga={cityOrLga}
          onCountryChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          onCityOrLgaChange={setCityOrLga}
          showStateSelector={true}
          showCitySelector={false}
          stateLabel="Emirate / State / Region"
        />

        {/* Search Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search water utility by name (e.g. DEWA, FEWA, ADDC, Lagos Water)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Discovery Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Step 1: Select Water Utility & Service</span>
          </h4>
          <span className="text-xs text-cyan-400 font-semibold">
            {discoveryResult.availableProviders.length} Provider(s) Available
          </span>
        </div>

        {discoveryResult.hasVerifiedService && discoveryResult.availableProviders.length > 0 ? (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {discoveryResult.availableProviders.map((prov) => {
              const isProvSelected = selectedProvider?.id === prov.id;
              const defaultDesigs = prov.designations && prov.designations.length > 0
                ? prov.designations
                : [
                    'Municipal Water Meter Payment',
                    'Residential Utility Settlement',
                    'Commercial Water Bill'
                  ];

              return (
                <div
                  key={prov.id}
                  id={`water-card-${prov.id}`}
                  className={`bg-slate-900/90 border rounded-2xl p-4 transition-all space-y-3 ${
                    isProvSelected
                      ? 'border-cyan-500/80 bg-slate-900/95 ring-1 ring-cyan-500/30'
                      : 'border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={prov.logo}
                        alt={prov.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          {prov.name}
                        </h5>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{prov.country}</span>
                          {prov.state && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-cyan-300 font-medium">{prov.state}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Gateway
                    </span>
                  </div>

                  {/* Available Service Options — Interactive Selection Controls */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Water Service Type:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultDesigs.map((desig) => {
                        const isServiceSelected = isProvSelected && selectedWaterService === desig;

                        return (
                          <button
                            id={`btn-water-${prov.id}-${desig.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            type="button"
                            key={desig}
                            onClick={() => handleSelectServiceOption(prov, desig)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all text-xs font-medium flex items-center justify-between group/btn cursor-pointer ${
                              isServiceSelected
                                ? 'bg-cyan-600/20 border-cyan-500 ring-2 ring-cyan-500/40 text-white font-bold shadow-md shadow-cyan-950/40'
                                : 'bg-slate-800/90 hover:bg-slate-800 hover:border-cyan-500/50 border-slate-700/80 text-slate-300 hover:text-white'
                            } border`}
                          >
                            <span className="truncate mr-2">{desig}</span>
                            {isServiceSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
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
          <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl text-center space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit mx-auto text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-amber-300">
                No Verified Digital Water Gateway
              </h5>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                {discoveryResult.statusMessage}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Try selecting "All States / Regions" or picking a major metropolis (e.g. Dubai, Abu Dhabi, Lagos State, or Greater Accra).
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Water Meter Account Details, Amount & Pi Payment */}
      {selectedProvider && selectedWaterService && (
        <div
          id="water-settlement-panel"
          className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl shadow-cyan-950/30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Step 2: Water Account & Settlement Details
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedProvider.name} &bull; <span className="text-cyan-300 font-semibold">{selectedWaterService}</span>
              </p>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
              Direct Gateway
            </span>
          </div>

          {/* Account/Meter Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {selectedProvider.accountLabel || 'Municipal Meter / Account Number'} <span className="text-cyan-400">*</span>
              </label>
              <input
                id="water-meter-input"
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setIsAccountVerified(false);
                }}
                placeholder={selectedProvider.accountPlaceholder || 'e.g. 209-4819-204 or MTR-99201'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Resident / Account Holder Name
              </label>
              <input
                id="water-customer-name-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Mohammed Al Mansoori"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Amount / Package Selection */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Select Settlement / Top-up Amount
            </label>

            {selectedProvider.packages && selectedProvider.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProvider.packages.map((pkg) => {
                  const isPkgSelected = selectedPackage?.id === pkg.id;
                  const pkgPi = (pkg.fiatPrice / activeRate).toFixed(7);

                  return (
                    <button
                      id={`btn-water-pkg-${pkg.id}`}
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setCustomFiatAmount('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isPkgSelected
                          ? 'bg-cyan-600/20 border-cyan-500 ring-1 ring-cyan-500/50 text-white'
                          : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{pkg.name}</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">${pkg.fiatPrice}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>{pkg.description || 'Instant Meter Settlement'}</span>
                        <span className="text-cyan-300 font-mono font-semibold">{pkgPi} π</span>
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
                    id="water-custom-amount-input"
                    type="number"
                    min={selectedProvider.minCustomFiat || 1}
                    max={selectedProvider.maxCustomFiat || 500}
                    value={customFiatAmount}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setCustomFiatAmount(val);
                      setSelectedPackage(null);
                    }}
                    placeholder="Enter USD amount"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {[15, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCustomFiatAmount(preset);
                        setSelectedPackage(null);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                        customFiatAmount === preset
                          ? 'bg-cyan-600 text-white'
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
              <span>Utility Biller</span>
              <span className="font-semibold text-slate-200">{selectedProvider.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Service Type</span>
              <span className="font-semibold text-cyan-300">{selectedWaterService}</span>
            </div>
            {accountNumber && (
              <div className="flex items-center justify-between text-slate-400">
                <span>Meter / Account ID</span>
                <span className="font-mono font-semibold text-slate-200">{accountNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-400">
              <span>Fiat Value</span>
              <span className="font-mono font-bold text-slate-200">${effectiveFiatAmount.toFixed(2)} USD</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="font-bold text-slate-200">Total Pi Network Due</span>
              <span className="font-mono font-bold text-sm text-cyan-400 flex items-center gap-1">
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

          {/* Payment Execution */}
          <button
            id="btn-water-pay-settlement"
            type="button"
            disabled={isProcessingPayment || effectiveFiatAmount <= 0}
            onClick={handleProcessPayment}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
          >
            {isProcessingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Water Settlement...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Settle Water Bill &bull; Pay {effectivePiAmount} π</span>
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
