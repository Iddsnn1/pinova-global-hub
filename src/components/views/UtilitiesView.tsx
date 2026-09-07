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
  Layers,
  ArrowUpRight,
  Building2,
  BookOpen,
  Award
} from 'lucide-react';
import { UtilityCategory } from '../../types/navigation';
import { UTILITY_CATEGORIES, UtilityCategoryDef } from '../../data/categoryData';
import { PiConversionConfig, UtilityCategoryType } from '../../types/utility';
import { FlexibleUtilityModal } from '../utility/FlexibleUtilityModal';
import { EducationHub, EducationTab } from '../education/EducationHub';

const getMappedCategoryType = (utilityId: string | null): UtilityCategoryType => {
  if (!utilityId) return 'airtime';
  if (utilityId === 'mobile_data' || utilityId === 'data') return 'data';
  if (utilityId === 'water_bills' || utilityId === 'water') return 'water';
  if (utilityId === 'cable_tv' || utilityId === 'cable') return 'cable';
  if (utilityId === 'internet_services' || utilityId === 'internet') return 'internet';
  if (utilityId === 'exam_cards' || utilityId === 'exam') return 'exam';
  if (
    utilityId === 'education_payments' ||
    utilityId === 'education' ||
    utilityId === 'institution_registry' ||
    utilityId === 'admissions_portal' ||
    utilityId === 'receipt_verifier' ||
    utilityId === 'scholarships_aid' ||
    utilityId === 'education_marketplace'
  ) return 'education';
  if (utilityId === 'gift_cards' || utilityId === 'giftcard') return 'giftcard';
  if (utilityId === 'vouchers' || utilityId === 'voucher') return 'voucher';
  if (utilityId === 'government_services' || utilityId === 'government') return 'government';
  if (utilityId === 'event_tickets' || utilityId === 'events') return 'events';
  if (utilityId === 'flight') return 'transport';
  return utilityId as UtilityCategoryType;
};

const isEducationService = (utilityId: string | null): boolean => {
  if (!utilityId) return false;
  return (
    utilityId === 'education' ||
    utilityId === 'education_payments' ||
    utilityId === 'institution_registry' ||
    utilityId === 'admissions_portal' ||
    utilityId === 'receipt_verifier' ||
    utilityId === 'scholarships_aid' ||
    utilityId === 'education_marketplace'
  );
};

const getEducationTabForService = (utilityId: string | null): EducationTab => {
  switch (utilityId) {
    case 'education_payments':
      return 'fees';
    case 'institution_registry':
      return 'directory';
    case 'admissions_portal':
      return 'admissions';
    case 'receipt_verifier':
      return 'verifier';
    case 'scholarships_aid':
      return 'scholarships';
    case 'education_marketplace':
      return 'marketplace';
    default:
      return 'directory';
  }
};

// Logical Service Families for the 18 Global Utilities
interface UtilityFamily {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  serviceIds: string[];
}

const UTILITY_FAMILIES: UtilityFamily[] = [
  {
    id: 'connectivity',
    name: 'Everyday Connectivity & Telecom',
    shortName: 'Connectivity',
    description: 'Instant mobile talktime top-ups, 4G/5G data packages, satellite internet & digital streaming passes.',
    icon: Wifi,
    accentColor: 'indigo',
    serviceIds: ['airtime', 'mobile_data', 'internet_services', 'cable_tv', 'streaming']
  },
  {
    id: 'essential_bills',
    name: 'Essential Municipal & Household Bills',
    shortName: 'Essential Bills',
    description: 'Prepaid electricity tokens, municipal water utilities, civic tax levies and protection policies.',
    icon: Zap,
    accentColor: 'amber',
    serviceIds: ['electricity', 'water_bills', 'government_services', 'insurance']
  },
  {
    id: 'travel_events',
    name: 'Travel, Mobility & Live Events',
    shortName: 'Travel & Events',
    description: 'Book transit metro passes, interstate bus tickets, ride credits and verified VIP event passes.',
    icon: Car,
    accentColor: 'purple',
    serviceIds: ['transport', 'event_tickets']
  },
  {
    id: 'digital_gaming',
    name: 'Digital Vouchers, Gaming & Store Credit',
    shortName: 'Digital & Gaming',
    description: 'Global eGift cards, retail shopping vouchers, ecommerce credits, game currencies and sports balances.',
    icon: Gift,
    accentColor: 'rose',
    serviceIds: ['gift_cards', 'vouchers', 'ecommerce', 'gaming', 'betting']
  },
  {
    id: 'education_exams',
    name: 'Education & Examination Portals',
    shortName: 'Education & Exams',
    description: 'Official examination result checker scratch cards, test registration PINs, institution registry, admissions, and school tuition portals.',
    icon: GraduationCap,
    accentColor: 'pink',
    serviceIds: [
      'exam_cards',
      'education_payments',
      'institution_registry',
      'admissions_portal',
      'receipt_verifier',
      'scholarships_aid',
      'education_marketplace'
    ]
  }
];

// High-demand popular services for quick access strip
const POPULAR_SERVICE_IDS = ['electricity', 'airtime', 'mobile_data', 'cable_tv', 'internet_services', 'transport'];

interface UtilitiesViewProps {
  selectedUtilityCategory?: string;
  utilityConfig: PiConversionConfig;
  userBalancePi: number;
  buyerUsername: string;
  onSelectCategory?: (category: string) => void;
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
  onSelectCategory,
  onTransactionSuccess
}) => {
  // Navigation & Category Selection
  const [selectedUtility, setSelectedUtility] = useState<UtilityCategory | null>(() => {
    if (selectedUtilityCategory && selectedUtilityCategory !== 'all') {
      return selectedUtilityCategory as UtilityCategory;
    }
    return null;
  });

  // Category Family Filter Tab (all | connectivity | essential_bills | etc.)
  const [activeFamilyFilter, setActiveFamilyFilter] = useState<string>('all');

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
    } else {
      setSelectedUtility(null);
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
      case 'Building2': return <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
    }
  };

  const activeDef = UTILITY_CATEGORIES.find((u) => u.id === selectedUtility);

  const handleOpenUtility = (def: UtilityCategoryDef) => {
    setSelectedUtility(def.id);
    setPurchaseReceipt(null);
    if (onSelectCategory) {
      onSelectCategory(def.id);
    }
  };

  const handleBackToEcosystem = () => {
    setSelectedUtility(null);
    setPurchaseReceipt(null);
    if (onSelectCategory) {
      onSelectCategory('all');
    }
  };

  // Modernized Fintech Card Clean Descriptions
  const getCleanDescription = (catId: string, defaultDesc: string): string => {
    switch (catId) {
      case 'airtime': return 'Instant mobile talktime credit recharge across 140+ global telecom operators.';
      case 'mobile_data': return 'High-speed 4G & 5G internet data bundles directly credited to any line.';
      case 'electricity': return 'Pay electricity bills and generate instant prepaid meter tokens.';
      case 'water_bills': return 'Settle municipal water utility balances with verified ledger receipts.';
      case 'cable_tv': return 'Renew digital satellite & decoder subscriptions directly in Pi Coin.';
      case 'internet_services': return 'Pay fiber optic broadband, Starlink, and ISP monthly subscription invoices.';
      case 'exam_cards': return 'Purchase WAEC, NECO, JAMB, NABTEB, and NBAIS result checker scratch card PINs.';
      case 'education_payments': return 'Pay school fees, university tuition deposits, and academic charges across 6 tiers in Pi Coin.';
      case 'institution_registry': return 'Search verified universities, polytechnics, basic colleges, and schools across global jurisdictions.';
      case 'admissions_portal': return 'Submit and track multi-institution academic admission applications and acceptance clearances.';
      case 'receipt_verifier': return 'Cryptographically verify student tuition clearance certificates, digital bursary stamps, and audit hashes.';
      case 'scholarships_aid': return 'Explore merit scholarships, Pioneer endowment grants, and need-based academic subsidies.';
      case 'education_marketplace': return 'Official curriculum textbooks, JAMB/WAEC past questions, scientific calculators, and STEM kits.';
      case 'gift_cards': return 'Purchase international eGift cards for Apple, Amazon, Steam & Google Play.';
      case 'gaming': return 'Top up in-game currencies, battle passes, PUBG UC, Free Fire & Robux.';
      case 'streaming': return 'Manage subscriptions for Netflix, Spotify, YouTube Premium & Disney+.';
      case 'government_services': return 'Settle civic taxes, passport fees, identity verification and permits.';
      case 'insurance': return 'Pay health, auto and protection micro-insurance policy premiums.';
      case 'transport': return 'Book transit metro cards, interstate bus passes and ride-hailing credits.';
      case 'event_tickets': return 'Purchase verified digital entry tickets and VIP access passes.';
      case 'vouchers': return 'Purchase digital retail, supermarket and dining discount vouchers.';
      case 'betting': return 'Instant wallet deposit to licensed sportsbooks and gaming accounts.';
      case 'ecommerce': return 'Load store credit for online shopping and merchant checkouts.';
      default: return defaultDesc;
    }
  };

  // Map of service definition by id for quick lookup
  const utilityMap = useMemo(() => {
    const map = new Map<string, UtilityCategoryDef>();
    UTILITY_CATEGORIES.forEach(cat => map.set(cat.id, cat));
    return map;
  }, []);

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

  // Filtered families based on active filter and search
  const visibleFamilies = useMemo(() => {
    const searchActive = serviceSearchQuery.trim().length > 0;
    const matchingIds = new Set(filteredCategories.map(c => c.id));

    return UTILITY_FAMILIES.map(family => {
      const services = family.serviceIds
        .map(id => utilityMap.get(id))
        .filter((cat): cat is UtilityCategoryDef => Boolean(cat) && (!searchActive || matchingIds.has(cat.id)));
      
      return {
        ...family,
        services
      };
    }).filter(family => {
      if (activeFamilyFilter !== 'all' && family.id !== activeFamilyFilter) {
        return false;
      }
      return family.services.length > 0;
    });
  }, [filteredCategories, activeFamilyFilter, serviceSearchQuery, utilityMap]);

  // High-demand popular services list
  const popularServices = useMemo(() => {
    return POPULAR_SERVICE_IDS
      .map(id => utilityMap.get(id))
      .filter((c): c is UtilityCategoryDef => Boolean(c));
  }, [utilityMap]);

  return (
    <div className="space-y-6 pb-20">
      
      {!selectedUtility ? (
        /* MAIN GLOBAL UTILITIES DESTINATION LANDING */
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* ==================================================== */}
          {/* 1. GLOBAL UTILITIES HERO & VALUE PROPOSITION */}
          {/* ==================================================== */}
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-purple-900/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
                    <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>GLOBAL UTILITIES ECOSYSTEM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-bold text-purple-200 lowercase">18 verified services</span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    Global services, powered by Pi.
                  </h1>
                  
                  <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
                    Discover and access everyday digital, financial, travel, communication, and essential utility services across supported locations worldwide.
                  </p>
                </div>

                {/* Conversion & Wallet Indicators */}
                <div className="flex flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5 shrink-0 flex-wrap">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-black shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Rate: 1 π = ${utilityConfig.piRateUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-purple-400" />
                    <span>Wallet Balance: <strong className="text-white">{userBalancePi.toFixed(2)} π</strong></span>
                  </div>
                </div>

              </div>

              {/* ==================================================== */}
              {/* 2. UNIVERSAL UTILITY DISCOVERY / SEARCH BAR */}
              {/* ==================================================== */}
              <div className="pt-2">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    placeholder="Search utilities, providers or services (e.g., Airtime, Electricity, Starlink, WAEC, DStv, KEDCO, Uber)..."
                    className="w-full pl-10 pr-10 py-3.5 bg-slate-900/90 border border-purple-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                  />
                  {serviceSearchQuery && (
                    <button
                      onClick={() => setServiceSearchQuery('')}
                      className="absolute right-3 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {serviceSearchQuery.trim() && (
                  <div className="mt-2.5 flex items-center justify-between text-xs text-purple-200 px-1">
                    <span>
                      Found <strong className="text-amber-300 font-bold">{filteredCategories.length}</strong> {filteredCategories.length === 1 ? 'service' : 'services'} matching &ldquo;{serviceSearchQuery}&rdquo;
                    </span>
                    <button
                      onClick={() => setServiceSearchQuery('')}
                      className="text-amber-400 hover:underline font-bold text-xs"
                    >
                      Reset filter
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ==================================================== */}
          {/* 3. FEATURED / HIGH-DEMAND POPULAR UTILITIES (Quick Strip) */}
          {/* ==================================================== */}
          {!serviceSearchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    High-Demand Services
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Instant 1-click launch
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {popularServices.map((cat) => (
                  <button
                    key={`popular-${cat.id}`}
                    onClick={() => handleOpenUtility(cat)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col items-start gap-2.5 group active:scale-[0.98]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getUtilityIcon(cat.iconName)}
                    </div>
                    <div className="w-full">
                      <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {cat.badgeText}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. SERVICE CATEGORIES FILTER TABS */}
          {/* ==================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Service Families &amp; Categories</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Organized by domain for fast discovery and global fulfillment.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                <button
                  onClick={() => setActiveFamilyFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeFamilyFilter === 'all'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>All Families</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    activeFamilyFilter === 'all' ? 'bg-purple-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {UTILITY_CATEGORIES.length}
                  </span>
                </button>

                {UTILITY_FAMILIES.map((family) => {
                  const Icon = family.icon;
                  const isActive = activeFamilyFilter === family.id;
                  return (
                    <button
                      key={family.id}
                      onClick={() => setActiveFamilyFilter(family.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{family.shortName}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        isActive ? 'bg-purple-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {family.serviceIds.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================== */}
            {/* 5. STRUCTURED CATEGORY SECTIONS */}
            {/* ==================================================== */}
            {visibleFamilies.length === 0 ? (
              /* No Search Match Empty State */
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  No utility services found matching &ldquo;{serviceSearchQuery}&rdquo;
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try searching for general keywords such as Airtime, Electricity, Data, WAEC, Starlink, TV, or Transport.
                </p>
                <button
                  onClick={() => {
                    setServiceSearchQuery('');
                    setActiveFamilyFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-all"
                >
                  View All {UTILITY_CATEGORIES.length} Services
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {visibleFamilies.map((family) => {
                  const FamilyIcon = family.icon;
                  return (
                    <div
                      key={family.id}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm"
                    >
                      {/* Family Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                              <FamilyIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              {family.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 pl-9">
                            {family.description}
                          </p>
                        </div>
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
                          {family.services.length} {family.services.length === 1 ? 'Service' : 'Services'}
                        </span>
                      </div>

                      {/* Service Grid for this Family */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {family.services.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleOpenUtility(cat)}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left flex flex-col justify-between space-y-3 group shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                                {getUtilityIcon(cat.iconName)}
                              </div>
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
                                {cat.badgeText}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
                                <span>{cat.name}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {getCleanDescription(cat.id, cat.description)}
                              </p>
                            </div>

                            {/* Providers preview & CTA */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                              {cat.popularProviders && cat.popularProviders.length > 0 && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                  <span className="font-bold text-slate-500 dark:text-slate-400">Providers:</span> {cat.popularProviders.slice(0, 3).join(', ')}...
                                </div>
                              )}
                              <div className="text-purple-600 dark:text-purple-400 text-xs font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Open Service</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==================================================== */}
          {/* 6. GLOBAL AVAILABILITY & TRUST INDICATORS */}
          {/* ==================================================== */}
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Instant digital meter tokens, PINs and audit references.</p>
              </div>
            </div>
          </div>

        </div>
      ) : isEducationService(selectedUtility) ? (
        /* GLOBAL EDUCATION ECOSYSTEM MASTER HUB (FULL RESPONSIVE LAYOUT) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <button
            onClick={handleBackToEcosystem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Global Services Ecosystem</span>
          </button>
          <EducationHub
            initialTab={getEducationTabForService(selectedUtility)}
            onBackToUtilities={handleBackToEcosystem}
          />
        </div>
      ) : (
        /* CONTEXT-AWARE UTILITY STEP-BY-STEP PROGRESSIVE TRANSACTION FLOW */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <button
            onClick={handleBackToEcosystem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Global Services Ecosystem</span>
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
                    onClick={() => setPurchaseReceipt(null)}
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
                onClose={() => {
                  // In embedded mode within UtilitiesView, preserve the current service view
                }}
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
                }}
              />
            )}

          </div>

        </div>
      )}

    </div>
  );
};

