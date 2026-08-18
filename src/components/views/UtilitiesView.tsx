import React, { useState, useMemo } from 'react';
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
  Coins, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  ChevronRight,
  Search,
  X,
  Globe2,
  ShieldCheck,
  Lock,
  Sparkles,
  Clock
} from 'lucide-react';
import { UtilityCategory } from '../../types/navigation';
import { UTILITY_CATEGORIES, UtilityCategoryDef } from '../../data/categoryData';
import { PiConversionConfig, UtilityCategoryType } from '../../types/utility';
import { FlexibleUtilityModal } from '../utility/FlexibleUtilityModal';

const getMappedCategoryType = (utilityId: string | null): UtilityCategoryType => {
  if (!utilityId) return 'airtime';
  if (utilityId === 'mobile_data' || utilityId === 'data') return 'data';
  if (utilityId === 'water_bills' || utilityId === 'water') return 'water';
  if (utilityId === 'cable_tv' || utilityId === 'cable') return 'cable';
  if (utilityId === 'internet_services' || utilityId === 'internet') return 'internet';
  if (utilityId === 'exam_cards' || utilityId === 'exam') return 'exam';
  if (utilityId === 'education_payments' || utilityId === 'education') return 'education';
  if (utilityId === 'gift_cards' || utilityId === 'giftcard') return 'giftcard';
  if (utilityId === 'vouchers' || utilityId === 'voucher') return 'voucher';
  if (utilityId === 'government_services' || utilityId === 'government') return 'government';
  if (utilityId === 'event_tickets' || utilityId === 'events') return 'events';
  if (utilityId === 'flight') return 'transport';
  return utilityId as UtilityCategoryType;
};

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
    transactionId?: string;
    category?: string;
    packageName?: string;
    piPaymentId?: string;
    piTxid?: string;
  }) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  selectedUtilityCategory,
  utilityConfig,
  userBalancePi,
  buyerUsername,
  onTransactionSuccess
}) => {
  // Navigation & Category Selection
  const [selectedUtility, setSelectedUtility] = useState<UtilityCategory | null>(() => {
    if (selectedUtilityCategory && selectedUtilityCategory !== 'all') {
      return selectedUtilityCategory as UtilityCategory;
    }
    return null;
  });

  // Universal Service Search Input
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');

  // Active Transaction Receipt State
  const [purchaseReceipt, setPurchaseReceipt] = useState<{
    txId: string;
    provider: string;
    account: string;
    amountPi: number;
    token: string;
    timestamp: string;
  } | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    if (selectedUtilityCategory && selectedUtilityCategory !== 'all') {
      setSelectedUtility(selectedUtilityCategory as UtilityCategory);
    }
  }, [selectedUtilityCategory]);

  // Icon Resolver
  const getUtilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Tv': return <Tv className="w-5 h-5 text-purple-500 dark:text-purple-300" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
      case 'Gift': return <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'Video': return <Video className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-300" />;
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Car': return <Car className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Ticket': return <Ticket className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Coins': return <Coins className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
      default: return <Zap className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
    }
  };

  const activeDef = UTILITY_CATEGORIES.find((u) => u.id === selectedUtility);

  const handleOpenUtility = (def: UtilityCategoryDef) => {
    setSelectedUtility(def.id);
    setPurchaseReceipt(null);
  };

  // Modernized Fintech Card Clean Descriptions
  const getCleanDescription = (catId: string, defaultDesc: string): string => {
    switch (catId) {
      case 'airtime': return 'Recharge your mobile line or buy talktime credit.';
      case 'mobile_data': return 'High-speed 4G & 5G internet data packages.';
      case 'electricity': return 'Pay electricity bills and prepaid meter tokens securely with Pi.';
      case 'water_bills': return 'Pay municipal water and utility bills.';
      case 'cable_tv': return 'Manage TV subscriptions and digital entertainment services.';
      case 'internet_services': return 'Buy broadband, fiber, and connectivity packages.';
      case 'exam_cards': return 'Purchase WAEC, NECO, and JAMB result checker PINs.';
      case 'education_payments': return 'Access exam services, tuition and digital education products.';
      case 'gift_cards': return 'Purchase supported digital gift cards with Pi.';
      case 'gaming': return 'Buy in-game credits and digital gaming cards.';
      case 'streaming': return 'Manage subscriptions and streaming passes.';
      case 'government_services': return 'Settle government levies, taxes and official fees.';
      case 'insurance': return 'Pay health, auto and protection insurance policy premiums.';
      case 'transport': return 'Book flight vouchers and transit passes.';
      case 'event_tickets': return 'Purchase event tickets and VIP access passes.';
      case 'vouchers': return 'Get retail vouchers and store credits.';
      case 'betting': return 'Top up gaming and sports wallet balances.';
      case 'ecommerce': return 'Load store credit for online shopping.';
      default: return defaultDesc;
    }
  };

  // Filter category by search
  const filteredCategories = useMemo(() => {
    if (!serviceSearchQuery.trim()) return UTILITY_CATEGORIES;
    const q = serviceSearchQuery.toLowerCase().trim();
    return UTILITY_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      getCleanDescription(cat.id, cat.description).toLowerCase().includes(q) ||
      cat.popularProviders.some(p => p.toLowerCase().includes(q))
    );
  }, [serviceSearchQuery]);

  return (
    <div className="space-y-6 pb-20">
      
      {!selectedUtility ? (
        /* MAIN GLOBAL UTILITIES DESTINATION LANDING */
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-purple-900/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>GLOBAL UTILITIES</span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    Global services, powered by Pi.
                  </h1>
                  
                  <p className="text-sm text-slate-300 max-w-2xl font-medium">
                    Recharge, pay bills and access digital services wherever you are.
                  </p>
                </div>

                {/* Conversion Badges */}
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-black shadow-lg">
                    Configured Pi Rate: 1 π = ${utilityConfig.piRateUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </div>
                  <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-bold">
                    Wallet: {userBalancePi.toFixed(2)} π
                  </div>
                </div>

              </div>

              {/* UNIVERSAL SERVICE SEARCH BAR */}
              <div className="pt-2">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    placeholder="Search utility or service (e.g., Airtime, Electricity, WAEC, DStv, KEDCO)..."
                    className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-purple-500/30 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                  />
                  {serviceSearchQuery && (
                    <button
                      onClick={() => setServiceSearchQuery('')}
                      className="absolute right-3 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* EXPLORE SERVICES SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Explore Services
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose a service category to get started.
                </p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold self-start sm:self-auto mt-1 sm:mt-0">
                {filteredCategories.length} Categories
              </span>
            </div>

            {/* SERVICE CATEGORY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleOpenUtility(cat)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all text-left flex flex-col justify-between space-y-3 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getUtilityIcon(cat.iconName)}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {cat.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {getCleanDescription(cat.id, cat.description)}
                    </p>
                  </div>

                  <div className="text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Pay with Pi</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TRUST INDICATORS & PLATFORM BENEFITS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Instant Pi Settlement</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Direct automated fulfillment via the official Pi SDK.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">190+ Global Regions</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Broad telecom, electricity & municipal coverage worldwide.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Verified Providers</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Authenticated billers, exam bodies & utility networks.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Secure Receipts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Instant digital token tokens, PINs and audit references.</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* CONTEXT-AWARE UTILITY STEP-BY-STEP PROGRESSIVE TRANSACTION FLOW */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <button
            onClick={() => setSelectedUtility(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Global Services</span>
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  {getUtilityIcon(activeDef?.iconName || 'Zap')}
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {activeDef?.name}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {getCleanDescription(activeDef?.id || '', activeDef?.description || '')}
                  </p>
                </div>
              </div>
            </div>

            {purchaseReceipt ? (
              /* RECEIPT VIEW */
              <div className="p-6 bg-purple-50 dark:bg-purple-950/40 rounded-3xl border border-purple-200 dark:border-purple-800 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <span>Transaction Fulfilled Successfully</span>
                </div>

                <div className="space-y-2 text-slate-700 dark:text-slate-300 border-t border-b border-purple-200/60 dark:border-purple-800/60 py-3">
                  <div><span className="font-bold">Transaction Reference:</span> <span className="font-mono">{purchaseReceipt.txId}</span></div>
                  <div><span className="font-bold">Provider:</span> {purchaseReceipt.provider}</div>
                  <div><span className="font-bold">Account / Ref:</span> {purchaseReceipt.account}</div>
                  <div><span className="font-bold">Settled Pi Amount:</span> <span className="text-purple-600 dark:text-purple-400 font-black">{purchaseReceipt.amountPi.toFixed(4)} π</span></div>
                  <div><span className="font-bold">Digital Token / PIN:</span> <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded font-bold">{purchaseReceipt.token}</span></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(purchaseReceipt.token);
                      alert('Token copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </button>
                  <button
                    onClick={() => setSelectedUtility(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* FLEXIBLE UTILITY MODAL IN EMBEDDED MODE */
              <FlexibleUtilityModal
                isEmbedded={true}
                defaultCategory={getMappedCategoryType(selectedUtility)}
                initialCountryCode="GLOBAL"
                piConversionConfig={utilityConfig}
                userBalancePi={userBalancePi}
                buyerUsername={buyerUsername}
                onClose={() => setSelectedUtility(null)}
                onTransactionSuccess={(receipt) => {
                  onTransactionSuccess({
                    providerName: receipt.providerName,
                    accountNumber: receipt.accountNumber,
                    piAmount: receipt.piAmount,
                    tokenOrCode: receipt.tokenOrCode,
                    transactionId: receipt.transactionId,
                    category: receipt.category,
                    packageName: receipt.packageName,
                    piPaymentId: receipt.piPaymentId,
                    piTxid: receipt.piTxid
                  });
                  setSelectedUtility(null);
                }}
              />
            )}

          </div>

        </div>
      )}

    </div>
  );
};
