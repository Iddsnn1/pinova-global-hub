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
  MapPin,
  Sparkles
} from 'lucide-react';
import { UtilityCategory } from '../../types/navigation';
import { UTILITY_CATEGORIES, UtilityCategoryDef } from '../../data/categoryData';
import { PiConversionConfig, UtilityCategoryType } from '../../types/utility';
import { FlexibleUtilityModal } from '../utility/FlexibleUtilityModal';
import { SAMPLE_UTILITY_PROVIDERS } from '../../data/utilityData';
import { getSubdivisionInfo } from '../../data/countrySubdivisions';

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

// Initial Popular Destinations List
const POPULAR_COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'GLOBAL', name: 'Global Services', flag: '🌐' }
];

// Helper: Convert ISO code or Country Name to flag emoji
function getCountryFlag(codeOrName: string): string {
  if (!codeOrName) return '🌐';
  const code = codeOrName.trim().toUpperCase();
  if (code === 'GLOBAL' || code === 'GLOBAL SERVICES' || codeOrName === 'Global') return '🌐';
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    return String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)));
  }
  if (codeOrName === 'Nigeria') return '🇳🇬';
  if (codeOrName === 'Ghana') return '🇬🇭';
  if (codeOrName === 'Kenya') return '🇰🇪';
  if (codeOrName === 'South Africa') return '🇿🇦';
  if (codeOrName === 'United Arab Emirates' || codeOrName === 'UAE') return '🇦🇪';
  if (codeOrName === 'United Kingdom' || codeOrName === 'UK') return '🇬🇧';
  if (codeOrName === 'United States' || codeOrName === 'USA') return '🇺🇸';
  if (codeOrName === 'Saudi Arabia') return '🇸🇦';
  if (codeOrName === 'Turkey' || codeOrName === 'Türkiye') return '🇹🇷';
  if (codeOrName === 'Vietnam') return '🇻🇳';
  if (codeOrName === 'Indonesia') return '🇮🇩';
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

  // Canonical Service Area State (Service Country & Service Region)
  const [serviceCountryCode, setServiceCountryCode] = useState<string>('NG');
  const [serviceRegion, setServiceRegion] = useState<string>('Kano');
  const [countrySearchInput, setCountrySearchInput] = useState<string>('');

  // Global Service Search Input
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

  // Derived full country database from providers and popular list
  const allAvailableCountries = useMemo(() => {
    const map = new Map<string, { code: string; name: string; flag: string }>();
    
    // Add popular defaults first
    POPULAR_COUNTRIES.forEach(c => {
      map.set(c.code, { code: c.code, name: c.name, flag: c.flag });
    });

    // Populate from provider database
    SAMPLE_UTILITY_PROVIDERS.forEach(p => {
      if (!p.enabled) return;
      const code = (p.countryCode || (p.country === 'Global' ? 'GLOBAL' : p.country.slice(0, 2))).toUpperCase();
      if (!map.has(code)) {
        map.set(code, {
          code,
          name: p.country,
          flag: getCountryFlag(code || p.country)
        });
      }
    });

    return Array.from(map.values());
  }, []);

  const selectedCountryObj = useMemo(() => {
    return allAvailableCountries.find(c => c.code === serviceCountryCode) || {
      code: serviceCountryCode,
      name: serviceCountryCode === 'GLOBAL' ? 'Global Services' : serviceCountryCode,
      flag: getCountryFlag(serviceCountryCode)
    };
  }, [allAvailableCountries, serviceCountryCode]);

  // Handle Canonical Service Country Switch
  const handleSelectServiceCountry = (countryCode: string) => {
    setServiceCountryCode(countryCode);
    const subInfo = getSubdivisionInfo(countryCode);
    // Pick the first default region if available, otherwise clear
    if (subInfo.subdivisions && subInfo.subdivisions.length > 0) {
      setServiceRegion(subInfo.subdivisions[0]);
    } else {
      setServiceRegion('');
    }
    setCountrySearchInput('');
  };

  // Search filtered countries list
  const filteredCountries = useMemo(() => {
    if (!countrySearchInput.trim()) return allAvailableCountries;
    const q = countrySearchInput.toLowerCase().trim();
    return allAvailableCountries.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.flag.includes(q)
    );
  }, [allAvailableCountries, countrySearchInput]);

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

              {/* SEARCH SERVICE BAR */}
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

          {/* SERVICE AVAILABILITY: CANONICAL SERVICE AREA & DYNAMIC REGION SELECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Header & Active Service Area Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Service availability</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a country and region to see available utility providers and local services.
                </p>
              </div>

              {/* Selected Service Area Pill */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-900 dark:text-purple-200 self-start sm:self-auto shadow-sm">
                <span className="text-lg leading-none">{selectedCountryObj.flag}</span>
                <span className="font-extrabold">{selectedCountryObj.name}</span>
                {serviceRegion ? (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold border-l border-purple-300 dark:border-purple-700 pl-2">
                    · {serviceRegion}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 border-l border-purple-300 dark:border-purple-700 pl-2">
                    · All Regions
                  </span>
                )}
              </div>
            </div>

            {/* Quick-Pick Popular Destinations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Destinations</span>
                </span>
                <span className="text-[11px] text-slate-400">Quick selection</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {POPULAR_COUNTRIES.map((c) => {
                  const isSelected = serviceCountryCode === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectServiceCountry(c.code)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300'
                      }`}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Country Search Field */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Search All Supported Countries
                </label>
                {countrySearchInput && (
                  <button
                    type="button"
                    onClick={() => setCountrySearchInput('')}
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={countrySearchInput}
                  onChange={(e) => setCountrySearchInput(e.target.value)}
                  placeholder="Search global country name, ISO code (e.g. ZA, GH, AE, US, TR, VN) or flag..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Filtered Country Chips (when searching or browsing) */}
              {countrySearchInput && (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 pt-1">
                  {filteredCountries.map((c) => {
                    const isSelected = serviceCountryCode === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectServiceCountry(c.code)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/30'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                        }`}
                      >
                        <span className="text-sm">{c.flag}</span>
                        <span>{c.name}</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isSelected ? 'bg-purple-700 text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {c.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DYNAMIC REGION / STATE SELECTOR FOR CURRENT SERVICE COUNTRY */}
            {(() => {
              const subInfo = getSubdivisionInfo(serviceCountryCode);
              if (!subInfo.subdivisions || subInfo.subdivisions.length === 0) return null;
              return (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>
                      Select {subInfo.subdivisionName || 'Region / State'} ({selectedCountryObj.name}):
                    </span>
                  </div>
                  <select
                    value={serviceRegion}
                    onChange={(e) => setServiceRegion(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 shadow-sm"
                  >
                    <option value="">All {subInfo.subdivisionName ? `${subInfo.subdivisionName}s` : 'Regions'} / Nationwide</option>
                    {subInfo.subdivisions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              );
            })()}

          </div>

          {/* UTILITY DISCOVERY GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Available Services in {selectedCountryObj.name}
              </h2>
              <span className="text-xs text-slate-500 font-bold">
                {filteredCategories.length} Categories
              </span>
            </div>

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

              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
                <span>{selectedCountryObj.flag}</span>
                <span>{selectedCountryObj.name}</span>
                {serviceRegion && (
                  <span className="text-amber-500 font-extrabold">• {serviceRegion}</span>
                )}
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
                initialCountryCode={serviceCountryCode}
                initialState={serviceRegion || undefined}
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
