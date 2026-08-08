import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Store, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Gift, 
  Download, 
  Package, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { ProductCategory, PiUser } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { LanguageSelectorDropdown } from './i18n/LanguageSelectorDropdown';

interface HeaderProps {
  currentCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAiSearch: () => void;
  onOpenNotifications: () => void;
  onOpenPstpShield: () => void;
  unreadNotificationsCount: number;
  user: PiUser;
  onAuthenticate: () => void;
  activeView: 'marketplace' | 'buyer_dashboard' | 'seller_dashboard' | 'admin_dashboard';
  onChangeView: (view: 'marketplace' | 'buyer_dashboard' | 'seller_dashboard' | 'admin_dashboard') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAiSearch,
  onOpenNotifications,
  onOpenPstpShield,
  unreadNotificationsCount,
  user,
  onAuthenticate,
  activeView,
  onChangeView,
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchQueryChange
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { t } = useTranslation();

  const categories: { id: ProductCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('catalog.allCategories', undefined, 'All Products'), icon: <Layers className="w-4 h-4" /> },
    { id: 'physical', label: t('catalog.physicalGoods', undefined, 'Physical Goods'), icon: <Package className="w-4 h-4" /> },
    { id: 'digital', label: t('catalog.digitalAssets', undefined, 'Digital Downloads'), icon: <Download className="w-4 h-4" /> },
    { id: 'airtime', label: t('utility.airtime', undefined, 'Airtime & Data'), icon: <Smartphone className="w-4 h-4" /> },
    { id: 'utility', label: t('catalog.airtimeUtility', undefined, 'Utility Bills'), icon: <Zap className="w-4 h-4" /> },
    { id: 'giftcard', label: t('catalog.giftCards', undefined, 'Gift Cards'), icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeView('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-purple-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-xl tracking-tighter">
                π
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 dark:from-purple-400 dark:via-indigo-300 dark:to-amber-400 bg-clip-text text-transparent">
                  PiNova
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Pi Coin Enterprise Marketplace
              </p>
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, digital keys, utilities, or ask AI..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onFocus={onOpenAiSearch}
                className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
              />
              <button
                onClick={onOpenAiSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>AI Search</span>
              </button>
            </div>
          </div>

          {/* Action Icons & User Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile AI Search Button */}
            <button
              onClick={onOpenAiSearch}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="AI Search Assistant"
            >
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </button>

            {/* PSTP Protection Shield */}
            <button
              onClick={onOpenPstpShield}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-amber-300 border border-purple-500/40 hover:border-amber-400/60 transition-all flex items-center gap-1.5 shadow-sm group"
              title="PiNova Secure Transaction Protection (PSTP)"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-black text-xs tracking-tight text-white">PSTP Shield</span>
            </button>

            {/* Language Selector Dropdown */}
            <LanguageSelectorDropdown variant="header" />

            {/* Dark/Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-800/80 transition-colors flex items-center gap-2"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-bold text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold truncate max-w-[100px]">{user.username}</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold capitalize">
                    {activeView === 'marketplace' ? 'Browse' : activeView.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Signed in as</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate">@{user.username}</p>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => { onChangeView('marketplace'); setShowRoleDropdown(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        activeView === 'marketplace'
                          ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-purple-500" />
                      <span>Global Marketplace</span>
                    </button>

                    <button
                      onClick={() => { onChangeView('buyer_dashboard'); setShowRoleDropdown(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        activeView === 'buyer_dashboard'
                          ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Buyer Dashboard</span>
                    </button>

                    <button
                      onClick={() => { onChangeView('seller_dashboard'); setShowRoleDropdown(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        activeView === 'seller_dashboard'
                          ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Store className="w-4 h-4 text-amber-500" />
                      <span>Seller Studio & Orders</span>
                    </button>

                    <button
                      onClick={() => { onChangeView('admin_dashboard'); setShowRoleDropdown(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        activeView === 'admin_dashboard'
                          ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Admin Control Desk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (activeView !== 'marketplace') onChangeView('marketplace');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                currentCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
