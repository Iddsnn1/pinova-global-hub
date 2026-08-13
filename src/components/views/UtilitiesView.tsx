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
  Flag,
  Globe2,
  Sparkles,
  Check
} from 'lucide-react';
import { UtilityCategory } from '../../types/navigation';
import { UTILITY_CATEGORIES, UtilityCategoryDef } from '../../data/categoryData';
import { PiConversionConfig, UtilityCategoryType } from '../../types/utility';
import { FlexibleUtilityModal } from '../utility/FlexibleUtilityModal';
import { SAMPLE_UTILITY_PROVIDERS } from '../../data/utilityData';

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

// Popular Countries List
const POPULAR_COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'GLOBAL', name: 'Global', flag: '🌐' }
];

// Helper: Convert ISO code to flag emoji
function getCountryFlag(codeOrName: string): string {
  if (!codeOrName) return '🌐';
  const code = codeOrName.trim().toUpperCase();
  if (code === 'GLOBAL' || code === 'GLOBAL SERVICES' || codeOrName === 'Global') return '🌐';
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    return String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)));
  }
  if (codeOrName === 'Nigeria') return '🇳🇬';
  if (codeOrName === 'Kenya') return '🇰🇪';
  if (codeOrName === 'United Arab Emirates' || codeOrName === 'UAE') return '🇦🇪';
  if (codeOrName === 'United Kingdom' || codeOrName === 'UK') return '🇬🇧';
  if (codeOrName === 'United States' || codeOrName === 'USA') return '🇺🇸';
  if (codeOrName === 'Saudi Arabia') return '🇸🇦';
  return '🌐';
}

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

  // Country Selection State
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [countryModalSearch, setCountryModalSearch] = useState<string>('');

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Active Service Receipt State
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

  // Derived full country database from providers
  const allAvailableCountries = useMemo(() => {
    const map = new Map<string, { code: string; name: string; flag: string; count: number }>();
    
    // Add popular defaults
    POPULAR_COUNTRIES.forEach(c => {
      map.set(c.code, { ...c, count: 0 });
    });

    SAMPLE_UTILITY_PROVIDERS.forEach(p => {
      if (!p.enabled) return;
      const code = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
      const existing = map.get(code);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(code, {
          code,
          name: p.country,
          flag: getCountryFlag(code || p.country),
          count: 1
        });
      }
    });

    return Array.from(map.values());
  }, []);

  const selectedCountryObj = useMemo(() => {
    return allAvailableCountries.find(c => c.code === selectedCountryCode) || {
      code: selectedCountryCode,
      name: selectedCountryCode === 'GLOBAL' ? 'Global' : selectedCountryCode,
      flag: getCountryFlag(selectedCountryCode)
    };
  }, [allAvailableCountries, selectedCountryCode]);

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

  // Group Definitions
  const groupA_IDs = ['airtime', 'mobile_data', 'gift_cards', 'exam_cards', 'gaming', 'streaming', 'vouchers', 'betting', 'ecommerce'];
  const groupB_IDs = ['electricity', 'water_bills', 'cable_tv', 'internet_services', 'insurance'];
  const groupC_IDs = ['transport', 'education_payments', 'government_services', 'event_tickets'];

  // Search Filter Handler
  const filterCategoryByQuery = (cat: UtilityCategoryDef) => {
    if (!globalSearchQuery.trim()) return true;
    const q = globalSearchQuery.toLowerCase().trim();

    // Match Category name or description
    if (cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q) || cat.badgeText.toLowerCase().includes(q)) {
      return true;
    }
    // Match popular providers
    if (cat.popularProviders.some(p => p.toLowerCase().includes(q))) {
      return true;
    }
    // Match country name/code if query matches
    if (selectedCountryObj.name.toLowerCase().includes(q) || selectedCountryObj.code.toLowerCase().includes(q)) {
      return true;
    }
    // Match provider dataset
    const mappedCat = getMappedCategoryType(cat.id);
    const hasProviderMatch = SAMPLE_UTILITY_PROVIDERS.some(
      p => p.category === mappedCat && (
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        (p.countryCode && p.countryCode.toLowerCase().includes(q))
      )
    );
    return hasProviderMatch;
  };

  const groupA_Categories = UTILITY_CATEGORIES.filter(c => groupA_IDs.includes(c.id) && filterCategoryByQuery(c));
  const groupB_Categories = UTILITY_CATEGORIES.filter(c => groupB_IDs.includes(c.id) && filterCategoryByQuery(c));
  const groupC_Categories = UTILITY_CATEGORIES.filter(c => groupC_IDs.includes(c.id) && filterCategoryByQuery(c));

  const totalMatchingCategories = groupA_Categories.length + groupB_Categories.length + groupC_Categories.length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* CASE A: MAIN UTILITIES SERVICE DISCOVERY HUB */}
      {!selectedUtility ? (
        <div className="space-y-6">
          
          {/* SECTION 3: COMPACT GLOBAL SERVICES HERO */}
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-5 sm:p-7 rounded-2xl mx-4 sm:mx-6 border border-purple-900/40 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-4xl">
              
              {/* Header Title & Rates */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-amber-300 text-xs font-bold">
                    <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Global Services</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Pi Utility & Service Discovery
                  </h1>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Access verified services across countries and regions. Settle airtime, data, bills, tuition, taxes, and transport instantly with Pi Coin.
                  </p>
                </div>

                {/* Conversion Badges */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-[11px] shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 font-bold">
                    Pi conversion rate: Configured rate (${utilityConfig.piRateUsd.toFixed(2)} USD)
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-purple-500/30 text-purple-300 font-bold">
                    Wallet: {userBalancePi.toFixed(2)} π
                  </span>
                </div>
              </div>

              {/* GLOBAL SEARCH INPUT */}
              <div className="relative pt-1">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    placeholder="Search country, service or provider (e.g., Nigeria, Electricity, MTN, Starlink)..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-purple-500/30 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
                  />
                  {globalSearchQuery && (
                    <button
                      onClick={() => setGlobalSearchQuery('')}
                      className="absolute right-3 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 4 & 5: COUNTRY SELECTOR & COUNTRY CONTEXT */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
            
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              
              {/* Selected Country Context */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-lg">
                  {selectedCountryObj.flag}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    Selected Country / Region
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{selectedCountryObj.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {selectedCountryObj.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Popular Country Shortcuts + Change Button */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {POPULAR_COUNTRIES.map((c) => {
                  const isSelected = selectedCountryCode === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => setSelectedCountryCode(c.code)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 min-h-[36px] ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span className="hidden md:inline">{c.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsCountryModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-extrabold transition-all min-h-[36px] flex items-center gap-1 ml-auto sm:ml-0"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  <span>View All Countries</span>
                </button>
              </div>

            </div>

          </div>

          {/* NO RESULTS SEARCH EMPTY STATE */}
          {globalSearchQuery && totalMatchingCategories === 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                No matching services found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No utility categories or providers matched "{globalSearchQuery}" in {selectedCountryObj.name}.
              </p>
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* SECTION 6: SERVICE CATEGORY GROUPINGS (3 MAJOR SECTIONS) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            
            {/* GROUP A — AIRTIME & DIGITAL SERVICES */}
            {groupA_Categories.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Airtime & Digital Services</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instant mobile top-ups, data passes, gift cards, gaming credits, and digital vouchers
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {groupA_Categories.length} Services
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                  {groupA_Categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleOpenUtility(cat)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all text-left flex flex-col justify-between space-y-2 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {getUtilityIcon(cat.iconName)}
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                          {cat.badgeText}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      <div className="text-purple-600 dark:text-purple-400 text-[11px] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                        <span>Pay Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GROUP B — BILLS & ESSENTIAL SERVICES */}
            {groupB_Categories.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Bills & Essential Services</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Prepaid electric meters, water utility invoices, satellite TV, and Starlink internet
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {groupB_Categories.length} Services
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                  {groupB_Categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleOpenUtility(cat)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all text-left flex flex-col justify-between space-y-2 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {getUtilityIcon(cat.iconName)}
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {cat.badgeText}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      <div className="text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                        <span>Pay Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GROUP C — DISCOVERY & BOOKINGS */}
            {groupC_Categories.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span>Discovery & Bookings</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Multi-step verified engines for flights, university tuition, government levies, and event passes
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20">
                    {groupC_Categories.length} Discovery Engines
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {groupC_Categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleOpenUtility(cat)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-500/30 dark:border-purple-800/60 hover:border-purple-500 transition-all text-left flex flex-col justify-between space-y-2 group shadow-sm hover:shadow-md hover:-translate-y-0.5 ring-1 ring-purple-500/10"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {getUtilityIcon(cat.iconName)}
                        </div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-xs uppercase tracking-wider">
                          Discovery Engine
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      <div className="text-purple-600 dark:text-purple-400 text-[11px] font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                        <span>Launch Discovery</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* COUNTRY SELECTOR MODAL */}
          {isCountryModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-5 max-h-[85vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Select Country or Region
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCountryModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar inside Modal */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={countryModalSearch}
                    onChange={(e) => setCountryModalSearch(e.target.value)}
                    placeholder="Search country name or ISO code..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Country List / Grid */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  
                  {/* Filtered Countries */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allAvailableCountries
                      .filter(c => 
                        c.name.toLowerCase().includes(countryModalSearch.toLowerCase()) ||
                        c.code.toLowerCase().includes(countryModalSearch.toLowerCase())
                      )
                      .map((c) => {
                        const isSelected = selectedCountryCode === c.code;
                        return (
                          <button
                            key={c.code}
                            onClick={() => {
                              setSelectedCountryCode(c.code);
                              setIsCountryModalOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{c.flag}</span>
                              <div>
                                <div className="font-bold">{c.name}</div>
                                <div className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                                  ISO: {c.code}
                                </div>
                              </div>
                            </div>
                            {c.count > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-purple-700 text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {c.count} svcs
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      ) : (
        /* CASE B: DEDICATED CONTEXT-AWARE SERVICE PURCHASE / DISCOVERY PAGE */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <button
            onClick={() => setSelectedUtility(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Service Discovery</span>
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                {getUtilityIcon(activeDef?.iconName || 'Zap')}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeDef?.name} Settlement & Discovery
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeDef?.description}
                </p>
              </div>
            </div>

            {purchaseReceipt ? (
              /* RECEIPT VIEW */
              <div className="p-5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <span>Utility Transaction Fulfilled Successfully</span>
                </div>

                <div className="space-y-2 text-slate-700 dark:text-slate-300 border-t border-b border-purple-200/60 dark:border-purple-800/60 py-3">
                  <div><span className="font-bold">Transaction ID:</span> <span className="font-mono">{purchaseReceipt.txId}</span></div>
                  <div><span className="font-bold">Provider:</span> {purchaseReceipt.provider}</div>
                  <div><span className="font-bold">Account / Ref:</span> {purchaseReceipt.account}</div>
                  <div><span className="font-bold">Settled Pi Amount:</span> <span className="text-purple-600 dark:text-purple-400 font-black">{purchaseReceipt.amountPi.toFixed(4)} π</span></div>
                  <div><span className="font-bold">Digital Token / Key:</span> <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded font-bold">{purchaseReceipt.token}</span></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(purchaseReceipt.token);
                      alert('Token copied to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-1.5"
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
            ) : (
              /* CONTEXT-AWARE UTILITY FLOW WITH PASSED COUNTRY CONTEXT */
              <FlexibleUtilityModal
                isEmbedded={true}
                defaultCategory={getMappedCategoryType(selectedUtility)}
                initialCountryCode={selectedCountryCode}
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
