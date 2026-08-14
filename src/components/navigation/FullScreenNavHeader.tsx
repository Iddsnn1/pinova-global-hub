import React, { useState, useRef, useEffect } from 'react';
import { 
  Home,
  Search, 
  ShoppingBag,
  Sparkles, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Zap, 
  Package, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft,
  Briefcase,
  Layers,
  Store,
  Users,
  Code,
  QrCode,
  CheckCircle2,
  MoreVertical,
  X
} from 'lucide-react';
import { MainSection, BreadcrumbItem, VisitedCategory } from '../../types/navigation';
import { PiUser } from '../../types';
import { LanguageSelectorDropdown } from '../i18n/LanguageSelectorDropdown';

interface FullScreenNavHeaderProps {
  activeSection: MainSection;
  onNavigateSection: (section: MainSection) => void;
  breadcrumbs: BreadcrumbItem[];
  canGoBack: boolean;
  onGoBack: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUniversalSearch: (query?: string) => void;
  cartCount: number;
  unreadNotifsCount: number;
  user: PiUser;
  userBalancePi?: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  onOpenPstpShield: () => void;
  onOpenQrScanner?: () => void;
  recentlyVisitedCategories: VisitedCategory[];
  onSelectVisitedCategory: (visited: VisitedCategory) => void;
}

export const FullScreenNavHeader: React.FC<FullScreenNavHeaderProps> = ({
  activeSection,
  onNavigateSection,
  breadcrumbs,
  canGoBack,
  onGoBack,
  searchQuery,
  onSearchChange,
  onOpenUniversalSearch,
  cartCount,
  unreadNotifsCount,
  user,
  userBalancePi = 250.00,
  darkMode,
  onToggleDarkMode,
  onOpenNotifications,
  onOpenPstpShield,
  onOpenQrScanner,
  recentlyVisitedCategories,
  onSelectVisitedCategory
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click (mouse or touch)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Five primary navigation destinations
  const primarySections: { id: MainSection; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4 text-amber-400" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Package className="w-4 h-4" /> },
    { id: 'utilities', label: 'Utilities', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 text-white transition-colors shadow-xl">
      {/* DESKTOP TOP BAR (>= 768px) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 py-2 items-center justify-between gap-3">
        
        {/* Brand Logo & Back Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back</span>
            </button>
          )}

          <div 
            onClick={() => onNavigateSection('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-base tracking-tighter">
                π
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
                  PiNova
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 uppercase tracking-wider">
                  Global Hub
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Badge */}
          <div 
            onClick={onOpenPstpShield}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/90 border border-amber-500/40 text-amber-300 cursor-pointer hover:bg-slate-800 transition-colors"
            title="Pi Wallet Balance & PSTP Shield"
          >
            <span className="font-black text-amber-400 text-xs">π</span>
            <span className="font-extrabold text-xs text-white tracking-tight">{userBalancePi.toFixed(1)}</span>
          </div>
        </div>

        {/* Center Universal Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-2 relative">
          <div 
            onClick={() => onOpenUniversalSearch(searchQuery)}
            className="relative cursor-pointer group"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <input
              type="text"
              readOnly
              placeholder="Search products, merchants, services, utilities, or orders..."
              value={searchQuery}
              className="w-full pl-10 pr-24 py-1.5 bg-slate-800/90 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs cursor-pointer transition-all"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenUniversalSearch(searchQuery);
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm hover:opacity-95"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Right Actions (Desktop) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* QR Scanner Trigger */}
          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Universal QR & Barcode Scanner"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline text-[11px]">Scan QR</span>
            </button>
          )}

          {/* Marketplace Shortcut */}
          <button
            onClick={() => onNavigateSection('marketplace')}
            className={`px-2.5 py-1.5 rounded-xl border transition-all items-center gap-1 text-xs font-bold flex ${
              activeSection === 'marketplace'
                ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Marketplace Menu"
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span className="hidden xl:inline">Marketplace</span>
          </button>

          {/* Merchant Studio Shortcut */}
          <button
            onClick={() => onNavigateSection('seller_studio' as any)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-300 transition-all items-center gap-1 text-xs font-bold flex"
            title="Merchant Studio & Inventory"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">Merchant</span>
          </button>

          {/* Admin Governance Shortcut */}
          <button
            onClick={() => onNavigateSection('admin_governance')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/50 text-emerald-300 transition-all items-center gap-1 text-xs font-bold flex"
            title="Admin Control Desk"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* Language Selector Dropdown */}
          <LanguageSelectorDropdown variant="header" />

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Day/Night Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Pioneer ID / User Profile Dropdown (Desktop) */}
          <div className="relative shrink-0" ref={userDropdownRef}>
            <button
              onClick={() => { setShowUserDropdown(!showUserDropdown); setShowMoreMenu(false); }}
              className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-purple-500/40 hover:border-purple-400 transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              title="Pioneer ID & Profile Menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-black text-amber-300 max-w-[120px] truncate">
                  @{user.username}
                </span>
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span>VERIFIED</span>
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">Pioneer ID</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">Verified</span>
                  </div>
                  <p className="font-bold text-amber-400 mt-0.5 text-xs truncate">@{user.username}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">UID: {user.uid}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { onNavigateSection('marketplace'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <Package className="w-4 h-4 text-purple-400" />
                    <span>Global Marketplace</span>
                  </button>
                  <button
                    onClick={() => { onNavigateSection('seller_studio' as any); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>Merchant Studio & Orders</span>
                  </button>
                  <button
                    onClick={() => { onNavigateSection('admin_governance'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Governance Center</span>
                  </button>
                  <button
                    onClick={() => { onNavigateSection('orders'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Escrow & Order History</span>
                  </button>
                  <button
                    onClick={() => { onNavigateSection('profile'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors border-t border-slate-800/80 pt-2 mt-1"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Security Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE TOP BAR (< 768px) - Strictly prioritized for 320px, 360px, 390px, 430px screens */}
      <div className="flex md:hidden w-full max-w-full px-1.5 py-1.5 items-center justify-between gap-1 overflow-x-hidden">
        
        {/* Left Priority Controls: 1. Back button, 2. Wallet Balance */}
        <div className="flex items-center gap-1 shrink-0">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-0.5 text-xs font-bold shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* Pi Wallet Balance Badge */}
          <div 
            onClick={onOpenPstpShield}
            className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-800/90 border border-amber-500/40 text-amber-300 cursor-pointer hover:bg-slate-800 transition-colors shrink-0"
            title="Pi Wallet Balance & PSTP Shield"
          >
            <span className="font-black text-amber-400 text-xs">π</span>
            <span className="font-extrabold text-[11px] text-white tracking-tight">{userBalancePi.toFixed(1)}</span>
          </div>
        </div>

        {/* Center Priority Control: 3. Pioneer ID / Profile (PERMANENTLY VISIBLE, NEVER HIDDEN) */}
        <div className="relative shrink-0 mx-0.5" ref={userDropdownRef}>
          <button
            onClick={() => { setShowUserDropdown(!showUserDropdown); setShowMoreMenu(false); }}
            className="flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-xl bg-slate-800/95 hover:bg-slate-700 text-slate-200 border border-purple-500/50 hover:border-purple-400 transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 shrink-0"
            title="Pioneer ID & Profile Menu"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-sm shrink-0">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex items-center gap-0.5 text-left leading-tight">
              <span className="text-[11px] font-black text-amber-300 max-w-[50px] min-w-0 xs:max-w-[70px] sm:max-w-[100px] truncate">
                @{user.username}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0 hidden xs:inline" />
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Pioneer ID Mobile Modal Dropdown */}
          {showUserDropdown && (
            <div className="fixed top-12 right-2 left-2 xs:left-auto xs:right-2 xs:w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs">Pioneer ID</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">Verified</span>
                </div>
                <p className="font-bold text-amber-400 mt-0.5 text-xs truncate">@{user.username}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">UID: {user.uid}</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => { onNavigateSection('marketplace'); setShowUserDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                >
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>Global Marketplace</span>
                </button>
                <button
                  onClick={() => { onNavigateSection('seller_studio' as any); setShowUserDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Merchant Studio & Orders</span>
                </button>
                <button
                  onClick={() => { onNavigateSection('admin_governance'); setShowUserDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Governance Center</span>
                </button>
                <button
                  onClick={() => { onNavigateSection('orders'); setShowUserDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                >
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Escrow & Order History</span>
                </button>
                <button
                  onClick={() => { onNavigateSection('profile'); setShowUserDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors border-t border-slate-800/80 pt-2 mt-1"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile & Security Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls in Priority Order: 4. Notifications, 5. QR Scanner, 6. Search, 7/8. More Menu (Language & Theme) */}
        <div className="flex items-center gap-1 shrink-0">
          
          {/* 4. Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* 5. QR Scanner (Visible on screen width >= 360px or accessible via More menu) */}
          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 transition-colors shrink-0 hidden xs:flex items-center"
              title="Universal QR Scanner"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}

          {/* 6. Universal Search (Visible on screen width >= 390px or accessible via More menu) */}
          <button
            onClick={() => onOpenUniversalSearch(searchQuery)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 transition-colors shrink-0 hidden sm:flex items-center"
            title="Search Products & Utilities"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Overflow "More" Menu Button (Houses 5. QR, 6. Search, 7. Language Selector, 8. Theme Toggle on small screens) */}
          <div className="relative shrink-0" ref={moreMenuRef}>
            <button
              onClick={() => { setShowMoreMenu(!showMoreMenu); setShowUserDropdown(false); }}
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors flex items-center justify-center shrink-0"
              title="More Controls & Tools"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Mobile Overflow "More" Popover Menu */}
            {showMoreMenu && (
              <div className="fixed top-12 right-2 left-2 xs:left-auto xs:right-2 xs:w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-2">
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
                  <span>Header Controls & Tools</span>
                  <button 
                    onClick={() => setShowMoreMenu(false)}
                    className="text-slate-500 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {/* Universal Search */}
                  <button
                    onClick={() => { onOpenUniversalSearch(searchQuery); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <Search className="w-4 h-4 text-purple-400" />
                    <span>Search Products & Utilities</span>
                  </button>

                  {/* QR Scanner */}
                  {onOpenQrScanner && (
                    <button
                      onClick={() => { onOpenQrScanner(); setShowMoreMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span>Universal QR Scanner</span>
                    </button>
                  )}

                  {/* Language Selector */}
                  <div className="px-3 py-1.5 flex items-center justify-between bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-semibold text-xs">Language</span>
                    <LanguageSelectorDropdown variant="header" />
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={() => { onToggleDarkMode(); setShowMoreMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                      <span>Theme Mode</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{darkMode ? 'Dark' : 'Light'}</span>
                  </button>

                  {/* PSTP Shield */}
                  <button
                    onClick={() => { onOpenPstpShield(); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:bg-slate-800 font-bold transition-colors border-t border-slate-800/80 pt-2 mt-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>PSTP Shield & Escrow</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Navigation Breadcrumb Bar & Primary Section Tabs */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onNavigateSection('home')}
            className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PiNova Global Hub</span>
          </button>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              <button
                onClick={() => onNavigateSection(b.section, (b as any).category)}
                className="hover:text-purple-300 font-medium whitespace-nowrap capitalize text-slate-300 transition-colors"
              >
                {b.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Primary Section Navigation Tabs (Desktop only - Mobile uses Bottom Navigation) */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {primarySections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onNavigateSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}

          {/* Secondary Quick Jump Triggers */}
          <button
            onClick={() => onNavigateSection('services')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'services'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-blue-400 hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Services</span>
          </button>
          <button
            onClick={() => onNavigateSection('ai_search')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'ai_search'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Concierge</span>
          </button>
          <button
            onClick={() => onNavigateSection('developer_platform')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'developer_platform'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-indigo-400 hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Developer API</span>
          </button>
          <button
            onClick={() => onNavigateSection('security_trust')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'security_trust'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-emerald-400 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security & Trust</span>
          </button>
          <button
            onClick={() => onNavigateSection('admin_governance')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'admin_governance'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-amber-400 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Center</span>
          </button>
          <button
            onClick={() => onNavigateSection('finance_analytics')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'finance_analytics'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300 hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onNavigateSection('community')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'community'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Community</span>
          </button>
        </div>

      </div>

      {/* Recently Visited Categories Pill Bar */}
      {recentlyVisitedCategories.length > 0 && (
        <div className="bg-slate-900/90 border-t border-slate-800/50 px-3 sm:px-6 py-1 flex items-center gap-2 text-[11px] overflow-x-auto no-scrollbar">
          <span className="text-slate-500 font-medium shrink-0">Recently Visited:</span>
          {recentlyVisitedCategories.map((rv) => (
            <button
              key={rv.id}
              onClick={() => onSelectVisitedCategory(rv)}
              className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-purple-950/80 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors whitespace-nowrap font-medium flex items-center gap-1"
            >
              <span>{rv.name}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

