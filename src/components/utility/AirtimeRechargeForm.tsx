import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Check, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { UtilityServiceProvider, UtilityProviderPackage, PiConversionConfig } from '../../types/utility';
import { AIRTIME_COUNTRIES, validateAirtimePhoneNumber, PhoneValidationStatus } from '../../data/airtimeData';
import { SAMPLE_UTILITY_PROVIDERS } from '../../data/utilityData';

interface AirtimeRechargeFormProps {
  piConversionConfig: PiConversionConfig;
  userBalancePi?: number;
  buyerUsername?: string;
  onExecutePayment: (params: {
    country: string;
    countryCode: string;
    provider: UtilityServiceProvider;
    phoneNumber: string;
    fiatAmount: number;
    piAmount: number;
    packageName?: string;
  }) => Promise<void>;
  isProcessingPayment: boolean;
  errorMessage?: string | null;
}

export const AirtimeRechargeForm: React.FC<AirtimeRechargeFormProps> = ({
  piConversionConfig,
  userBalancePi = 1250.00,
  buyerUsername = 'Pioneer_User',
  onExecutePayment,
  isProcessingPayment,
  errorMessage
}) => {
  // Step 1: Country Selection State - Default to unselected (NO default country)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  // Step 2: Network Operator Selection State - Default to null (NO preselected network)
  const [selectedProvider, setSelectedProvider] = useState<UtilityServiceProvider | null>(null);

  // Step 3: Mobile Phone Number State
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidationStatus | null>(null);

  // Step 4: Amount & Package Selection State
  const [purchaseMode, setPurchaseMode] = useState<'custom' | 'package'>('custom');
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<UtilityProviderPackage | null>(null);

  // Active Country details
  const activeCountry = AIRTIME_COUNTRIES.find((c) => c.code === selectedCountryCode);

  // Dynamically query available networks for selected country
  const availableNetworks = selectedCountryCode ? SAMPLE_UTILITY_PROVIDERS.filter((p) => {
    if (p.category !== 'airtime' || !p.enabled) return false;
    if (p.countryCode) return p.countryCode === selectedCountryCode;
    return activeCountry ? p.country.toLowerCase().includes(activeCountry.name.toLowerCase()) : false;
  }) : [];

  // Reset Network, Phone Number, and Packages whenever Country changes
  const handleSelectCountry = (code: string) => {
    if (code === selectedCountryCode) return;
    setSelectedCountryCode(code);
    setSelectedProvider(null);
    setPhoneNumber('');
    setPhoneValidation(null);
    setSelectedPackage(null);
    setCountrySearchQuery('');
  };

  // Handle Network Change
  const handleSelectNetwork = (prov: UtilityServiceProvider) => {
    setSelectedProvider(prov);
    if (prov.supportsCustomAmount) {
      setPurchaseMode('custom');
    } else if (prov.supportsFixedPackages && prov.packages.length > 0) {
      setPurchaseMode('package');
      setSelectedPackage(prov.packages[0]);
    }
  };

  // Real-time Phone Validation on change
  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (val.trim() && selectedCountryCode) {
      const status = validateAirtimePhoneNumber(val, selectedCountryCode);
      setPhoneValidation(status);
    } else {
      setPhoneValidation(null);
    }
  };

  // Handle custom amount input preserving user keystrokes
  const handleCustomAmountChange = (raw: string) => {
    if (raw === '') {
      setCustomAmountInput('');
      return;
    }
    const sanitized = raw.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    let cleaned = sanitized;
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    setCustomAmountInput(cleaned);
    if (purchaseMode !== 'custom') {
      setPurchaseMode('custom');
    }
  };

  // Amount Math
  const getActiveFiatPrice = (): number => {
    if (purchaseMode === 'package' && selectedPackage) {
      return selectedPackage.fiatPrice;
    }
    if (!customAmountInput || customAmountInput.trim() === '') {
      return 0;
    }
    const parsed = parseFloat(customAmountInput);
    return !isNaN(parsed) && isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const activeFiatPrice = getActiveFiatPrice();
  const calculatedPiAmount = activeFiatPrice / piConversionConfig.piRateUsd;
  const isValidPositiveAmount = typeof activeFiatPrice === 'number' && !isNaN(activeFiatPrice) && isFinite(activeFiatPrice) && activeFiatPrice > 0;
  const minPiThreshold = piConversionConfig.minPurchasePi || 0.000001;
  const isWithinLimits =
    calculatedPiAmount >= minPiThreshold &&
    calculatedPiAmount <= (piConversionConfig.maxPurchasePi || 1000.00);

  const canProceed =
    !!selectedCountryCode &&
    !!activeCountry &&
    !!selectedProvider &&
    !!phoneNumber.trim() &&
    !!phoneValidation?.isValid &&
    isValidPositiveAmount &&
    isWithinLimits &&
    !isProcessingPayment;

  // Filter countries for search dropdown
  const filteredCountries = AIRTIME_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.dialCode.includes(countrySearchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPiAmount = Number(calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4));
    console.log('[PI PAYMENT] button clicked (AirtimeRechargeForm)', {
      country: activeCountry?.name,
      provider: selectedProvider?.name,
      phoneNumber,
      fiatAmount: getActiveFiatPrice(),
      piAmount: finalPiAmount
    });

    if (!canProceed || !selectedProvider || !activeCountry) return;

    await onExecutePayment({
      country: activeCountry.name,
      countryCode: activeCountry.code,
      provider: selectedProvider,
      phoneNumber: phoneValidation?.formatted || phoneNumber,
      fiatAmount: getActiveFiatPrice(),
      piAmount: finalPiAmount,
      packageName: purchaseMode === 'package' ? selectedPackage?.name : 'Custom Airtime Purchase'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* STEP 1: COUNTRY SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Select Destination Country</span>
          </label>
          {activeCountry ? (
            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <span>{activeCountry.flag}</span>
              <span>{activeCountry.name} ({activeCountry.dialCode})</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold text-amber-500">
              * Required (Select a country)
            </span>
          )}
        </div>

        {/* Country Selector Cards & Search */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search global country (e.g. Canada, Germany, Japan, Nigeria, Kenya, USA)..."
              value={countrySearchQuery}
              onChange={(e) => setCountrySearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
            {filteredCountries.map((country) => {
              const isSelected = selectedCountryCode === country.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelectCountry(country.code)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-400/30'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                  }`}
                >
                  <span className="text-lg leading-none">{country.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{country.name}</p>
                    <p className={`text-[10px] font-mono ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                      {country.dialCode}
                    </p>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 2: DYNAMIC NETWORK OPERATOR SELECTION */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
          <span>Select Mobile Network Operator</span>
        </label>

        {!selectedCountryCode ? (
          /* NO COUNTRY SELECTED NOTICE */
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
            <Globe className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Please select a country in Step 1 to view supported mobile operators.
            </p>
          </div>
        ) : availableNetworks.length === 0 ? (
          /* EMPTY STATE FOR COUNTRY */
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400">
              No supported mobile networks available for {activeCountry?.name} currently.
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Please select another supported country (such as Nigeria, Kenya, Ghana, or India).
            </p>
          </div>
        ) : (
          /* NETWORK OPERATOR GRID */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableNetworks.map((network) => {
              const isSelected = selectedProvider?.id === network.id;
              return (
                <div
                  key={network.id}
                  onClick={() => handleSelectNetwork(network)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/30 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                  }`}
                >
                  <img
                    src={network.logo}
                    alt={network.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{network.name}</h4>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">{activeCountry?.name}</span>
                  </div>
                  {isSelected ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                      Selected
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-semibold">
                      Click to select
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 3: MOBILE PHONE NUMBER INPUT & COUNTRY VALIDATION */}
      {selectedProvider && activeCountry && (
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Mobile Phone Number</span>
            </span>
            <span className="text-[10px] font-mono text-purple-500 font-bold">
              Format: {activeCountry.digitsHint}
            </span>
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-700 pr-2 pointer-events-none">
              <span>{activeCountry.flag}</span>
              <span className="font-mono">{activeCountry.dialCode}</span>
            </div>

            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={activeCountry.placeholder}
              className={`w-full pl-24 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none transition-all ${
                phoneValidation
                  ? phoneValidation.isValid
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-purple-500'
              }`}
            />

            {phoneValidation && (
              <div className="absolute right-3">
                {phoneValidation.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
            )}
          </div>

          {phoneValidation && (
            <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
              phoneValidation.isValid
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              <span className="mt-0.5">{phoneValidation.isValid ? '✓' : '⚠️'}</span>
              <div>
                <p className="font-bold text-[11px]">{phoneValidation.message}</p>
                {phoneValidation.isValid && (
                  <p className="text-[10px] font-mono opacity-80 mt-0.5">
                    Formatted Target: {phoneValidation.formatted}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: AIRTIME AMOUNT & DENOMINATION SELECTION */}
      {selectedProvider && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">4</span>
              <span>Airtime Amount / Package</span>
            </label>

            {/* Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {selectedProvider.supportsCustomAmount && (
                <button
                  type="button"
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
                  type="button"
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

          {/* Custom Amount Inputs */}
          {purchaseMode === 'custom' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {[2, 5, 10, 25].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setPurchaseMode('custom');
                      setCustomAmountInput(amt.toString());
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      customAmountInput === amt.toString()
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ${amt}.00 USD
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={customAmountInput}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Enter custom USD value (e.g. 5.00)"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          ) : (
            /* Fixed Packages List */
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedProvider.packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{pkg.name}</h4>
                        {pkg.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-500">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{pkg.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-xs text-purple-600 dark:text-purple-400">${pkg.fiatPrice.toFixed(2)} USD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: ORDER REVIEW & PI CALCULATOR CARD */}
      {selectedProvider && activeCountry && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-2.5">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Destination:</span>
            <span className="font-bold text-purple-300 flex items-center gap-1">
              <span>{activeCountry.flag}</span>
              <span>{activeCountry.name}</span>
              <span className="text-slate-400">• {selectedProvider.name}</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Target Airtime Value:</span>
            <span className="font-bold text-white">${getActiveFiatPrice() < 0.01 ? getActiveFiatPrice().toString() : getActiveFiatPrice().toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Pi Platform Exchange Rate:</span>
            <span className="text-amber-400 font-bold">1 π = ${piConversionConfig.piRateUsd.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">Required Pi Amount:</span>
            <span className="text-xl font-black text-amber-400">{calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4)} π</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 6: EXECUTE PI PAYMENT BUTTON */}
      <button
        type="submit"
        disabled={!canProceed}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-sm shadow-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5"
      >
        {isProcessingPayment ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
            <span>Connecting Pi Wallet...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>
              {canProceed
                ? `Pay ${calculatedPiAmount < 0.0001 ? calculatedPiAmount.toFixed(6) : calculatedPiAmount.toFixed(4)} π Now`
                : !selectedCountryCode
                ? 'Select Country to Continue'
                : !selectedProvider
                ? 'Select Network Operator'
                : !phoneValidation?.isValid
                ? 'Enter Valid Phone Number'
                : 'Complete Form to Pay'}
            </span>
          </>
        )}
      </button>

    </form>
  );
};
