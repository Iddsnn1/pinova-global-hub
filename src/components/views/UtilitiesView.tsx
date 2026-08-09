import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Droplet, 
  Tv, 
  Globe, 
  FileCheck, 
  GraduationCap, 
  Gift, 
  Gamepad2, 
  Video, 
  Landmark, 
  Shield, 
  Car, 
  Ticket, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Download, 
  Clock, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { UtilityCategory } from '../../types/navigation';
import { UTILITY_CATEGORIES, UtilityCategoryDef } from '../../data/categoryData';
import { PiConversionConfig } from '../../types/utility';
import { AirtimeRechargeForm } from '../utility/AirtimeRechargeForm';
import { createPiPayment } from '../../lib/piSdk';

interface UtilitiesViewProps {
  selectedUtilityCategory?: string;
  utilityConfig: PiConversionConfig;
  userBalancePi: number;
  buyerUsername: string;
  onTransactionSuccess: (receipt: {
    providerName: string;
    accountNumber: string;
    piAmount: number;
    tokenOrCode?: string;
  }) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  selectedUtilityCategory,
  utilityConfig,
  userBalancePi,
  buyerUsername,
  onTransactionSuccess
}) => {
  // Determine initial tab based on selected category parameter
  const getInitialTab = (): 'airtime_data' | 'utility_bills' | 'all' => {
    if (!selectedUtilityCategory) return 'all';
    const cat = selectedUtilityCategory.toLowerCase();
    if (cat === 'airtime' || cat === 'mobile_data' || cat === 'airtime_data') {
      return 'airtime_data';
    }
    return 'utility_bills';
  };

  const [activeUtilityTab, setActiveUtilityTab] = useState<'airtime_data' | 'utility_bills' | 'all'>(getInitialTab);
  const [selectedUtility, setSelectedUtility] = useState<UtilityCategory | null>(null);

  // Sync tab if selectedUtilityCategory prop changes
  React.useEffect(() => {
    if (selectedUtilityCategory) {
      const cat = selectedUtilityCategory.toLowerCase();
      if (cat === 'airtime' || cat === 'mobile_data' || cat === 'airtime_data') {
        setActiveUtilityTab('airtime_data');
      } else {
        setActiveUtilityTab('utility_bills');
      }
    }
  }, [selectedUtilityCategory]);

  // Active Service Form State
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amountUsd, setAmountUsd] = useState<number>(10);
  const [customAmountUsd, setCustomAmountUsd] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseReceipt, setPurchaseReceipt] = useState<{
    txId: string;
    provider: string;
    account: string;
    amountPi: number;
    token: string;
    timestamp: string;
  } | null>(null);

  const getUtilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-emerald-400" />;
      case 'Wifi': return <Wifi className="w-6 h-6 text-blue-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Droplet': return <Droplet className="w-6 h-6 text-cyan-400" />;
      case 'Tv': return <Tv className="w-6 h-6 text-purple-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-indigo-400" />;
      case 'FileCheck': return <FileCheck className="w-6 h-6 text-yellow-400" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-pink-400" />;
      case 'Gift': return <Gift className="w-6 h-6 text-rose-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-violet-400" />;
      case 'Video': return <Video className="w-6 h-6 text-red-400" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-amber-300" />;
      case 'Shield': return <Shield className="w-6 h-6 text-emerald-300" />;
      case 'Car': return <Car className="w-6 h-6 text-blue-300" />;
      case 'Ticket': return <Ticket className="w-6 h-6 text-purple-300" />;
      default: return <Zap className="w-6 h-6 text-amber-400" />;
    }
  };

  const activeDef = UTILITY_CATEGORIES.find((u) => u.id === selectedUtility);

  // Conversion Math
  const effectiveUsd = customAmountUsd ? parseFloat(customAmountUsd) || 0 : amountUsd;
  const calculatedPi = utilityConfig.piRateUsd > 0 ? effectiveUsd / utilityConfig.piRateUsd : 0;

  const handleOpenUtility = (def: UtilityCategoryDef) => {
    setSelectedUtility(def.id);
    setSelectedProvider(def.popularProviders[0] || 'Default Provider');
    setAccountNumber('');
    setAmountUsd(def.defaultAmountsUsd[0] || 10);
    setCustomAmountUsd('');
    setPurchaseReceipt(null);
  };

  const handleExecutePayment = async () => {
    if (!accountNumber || calculatedPi <= 0) return;
    setIsProcessing(true);

    try {
      const paymentResult = await createPiPayment({
        amountPi: calculatedPi,
        memo: `${selectedProvider} - ${accountNumber} ($${effectiveUsd.toFixed(2)})`,
        metadata: {
          category: selectedUtility || 'utility',
          providerId: selectedProvider,
          accountNumber,
          fiatAmount: effectiveUsd,
          fiatCurrency: 'USD',
          piRateApplied: utilityConfig.piRateUsd
        }
      });

      if (paymentResult && paymentResult.success) {
        const isFulfilled = paymentResult.fulfillmentStatus === 'FULFILLED';
        const token = isFulfilled ? (paymentResult.data?.tokenOrCode || paymentResult.data?.providerReference) : undefined;
        const receipt = {
          txId: paymentResult.txid || `pi_tx_${Date.now()}`,
          provider: selectedProvider,
          account: accountNumber,
          amountPi: calculatedPi,
          token: token || 'Payment Received — Fulfillment Pending',
          timestamp: new Date().toISOString()
        };

        setPurchaseReceipt(receipt);
        onTransactionSuccess({
          providerName: selectedProvider,
          accountNumber,
          piAmount: calculatedPi,
          tokenOrCode: token
        });
      } else {
        alert(paymentResult?.message || 'Payment execution failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* CASE A: UTILITY HUB (15 Service Tiles) */}
      {!selectedUtility ? (
        <div className="space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-2xl mx-4 sm:mx-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Instant Global Utility Payment Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Utilities & Instant Services
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Settle mobile airtime, data bundles, electricity meters, water bills, cable TV, exam pins, gift cards, and streaming subscriptions in Pi Coin with instant token generation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-300 font-bold">
                  Conversion Rate: 1 π = ${utilityConfig.piRateUsd.toFixed(2)} USD
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-purple-300 font-bold">
                  Wallet Balance: {userBalancePi.toFixed(2)} π
                </div>
              </div>
            </div>
          </div>

          {/* 15 Utility Service Grid with Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            
            {/* Entry Point Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Utility Services Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your destination service category
                </p>
              </div>

              {/* Segmented Tab Control */}
              <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setActiveUtilityTab('airtime_data')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeUtilityTab === 'airtime_data'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Airtime & Data</span>
                </button>

                <button
                  onClick={() => setActiveUtilityTab('utility_bills')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeUtilityTab === 'utility_bills'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Pay Utility Bills</span>
                </button>

                <button
                  onClick={() => setActiveUtilityTab('all')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeUtilityTab === 'all'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>All Utilities ({UTILITY_CATEGORIES.length})</span>
                </button>
              </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {UTILITY_CATEGORIES.filter((cat) => {
                const isAirtimeData = ['airtime', 'mobile_data', 'gift_cards', 'exam_cards'].includes(cat.id);
                if (activeUtilityTab === 'airtime_data') return isAirtimeData;
                if (activeUtilityTab === 'utility_bills') return !isAirtimeData;
                return true;
              }).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleOpenUtility(cat)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all text-left flex flex-col justify-between space-y-3 group shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-110 transition-transform">
                      {getUtilityIcon(cat.iconName)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {cat.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Pay Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* CASE B: DEDICATED SERVICE PURCHASE PAGE */
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          
          <button
            onClick={() => setSelectedUtility(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Utilities</span>
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                {getUtilityIcon(activeDef?.iconName || 'Zap')}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeDef?.name} Purchase & Settlement
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeDef?.description}
                </p>
              </div>
            </div>

            {purchaseReceipt ? (
              /* RECEIPT VIEW */
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Utility Transaction Fulfilled Successfully</span>
                </div>

                <div className="space-y-2 text-slate-700 dark:text-slate-300 border-t border-b border-emerald-200/60 dark:border-emerald-800/60 py-3">
                  <div><span className="font-bold">Transaction ID:</span> <span className="font-mono">{purchaseReceipt.txId}</span></div>
                  <div><span className="font-bold">Provider:</span> {purchaseReceipt.provider}</div>
                  <div><span className="font-bold">Account / Ref:</span> {purchaseReceipt.account}</div>
                  <div><span className="font-bold">Settled Pi Amount:</span> <span className="text-emerald-600 font-black">{purchaseReceipt.amountPi.toFixed(4)} π</span></div>
                  <div><span className="font-bold">Digital Token / Key:</span> <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded font-bold">{purchaseReceipt.token}</span></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(purchaseReceipt.token);
                      alert('Token copied to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </button>
                  <button
                    onClick={() => setSelectedUtility(null)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : selectedUtility === 'airtime' || selectedUtility === 'mobile_data' ? (
              /* AIRTIME DEPENDENT SELECTION FLOW (COUNTRY -> NETWORK -> MOBILE -> AMOUNT) */
              <AirtimeRechargeForm
                piConversionConfig={utilityConfig}
                userBalancePi={userBalancePi}
                buyerUsername={buyerUsername}
                onExecutePayment={async (params) => {
                  setIsProcessing(true);
                  try {
                    const paymentResult = await createPiPayment({
                      amountPi: params.piAmount,
                      memo: `${params.provider.name} - ${params.phoneNumber}`,
                      metadata: {
                        category: selectedUtility,
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

                      setPurchaseReceipt({
                        txId: paymentResult.txid || `pi_tx_${Date.now()}`,
                        provider: params.provider.name,
                        account: params.phoneNumber,
                        amountPi: params.piAmount,
                        token: token || 'Payment Received — Fulfillment Pending',
                        timestamp: new Date().toISOString()
                      });
                      onTransactionSuccess({
                        providerName: params.provider.name,
                        accountNumber: params.phoneNumber,
                        piAmount: params.piAmount,
                        tokenOrCode: token
                      });
                    } else {
                      alert(paymentResult?.message || 'Payment failed.');
                    }
                  } catch (err: any) {
                    alert(err.message || 'Error processing payment.');
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                isProcessingPayment={isProcessing}
              />
            ) : (
              /* STANDARD FORM VIEW FOR OTHER UTILITIES */
              <div className="space-y-5">
                
                {/* Provider Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Service Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    {activeDef?.popularProviders.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Account / Phone Number Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {activeDef?.fieldLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={activeDef?.placeholder}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>

                {/* Amount / Denomination Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Package / USD Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {activeDef?.defaultAmountsUsd.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmountUsd(amt);
                          setCustomAmountUsd('');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          amountUsd === amt && !customAmountUsd
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        ${amt} USD
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    placeholder="Or enter custom USD amount..."
                    value={customAmountUsd}
                    onChange={(e) => setCustomAmountUsd(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Real-time Pi Conversion Calculator Card */}
                <div className="p-4 rounded-xl bg-slate-950 text-white space-y-2 border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">USD Value:</span>
                    <span className="font-bold">${effectiveUsd.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Exchange Rate:</span>
                    <span className="text-amber-300 font-bold">1 π = ${utilityConfig.piRateUsd.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-xs font-extrabold text-slate-200">Total Pi Required:</span>
                    <span className="text-lg font-black text-emerald-400">{calculatedPi.toFixed(4)} π</span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleExecutePayment}
                  disabled={!accountNumber || calculatedPi <= 0 || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>{isProcessing ? 'Authorizing Pi Payment...' : `Pay ${calculatedPi.toFixed(4)} π Now`}</span>
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
