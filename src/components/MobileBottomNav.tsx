import React from 'react';
import { Home, Grid, Smartphone, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface MobileBottomNavProps {
  activeView: 'marketplace' | 'buyer_dashboard' | 'seller_dashboard' | 'admin_dashboard';
  onChangeView: (view: 'marketplace' | 'buyer_dashboard' | 'seller_dashboard' | 'admin_dashboard') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiSearch: () => void;
  currentCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onChangeView,
  cartCount,
  onOpenCart,
  onOpenAiSearch,
  currentCategory,
  onSelectCategory
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 shadow-2xl transition-colors">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* Home / Marketplace */}
        <button
          onClick={() => {
            onChangeView('marketplace');
            onSelectCategory('all');
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-xl transition-all ${
            activeView === 'marketplace' && currentCategory === 'all'
              ? 'text-amber-400 font-bold bg-slate-800/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Catalog</span>
        </button>

        {/* Instant Services */}
        <button
          onClick={() => {
            onChangeView('marketplace');
            onSelectCategory('airtime');
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-xl transition-all ${
            currentCategory === 'airtime' || currentCategory === 'utility' || currentCategory === 'giftcard'
              ? 'text-emerald-400 font-bold bg-slate-800/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Services</span>
        </button>

        {/* AI Assistant */}
        <button
          onClick={onOpenAiSearch}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 transform active:scale-95 transition-all"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-[9px] font-extrabold mt-0.5">AI Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </button>

        {/* Orders / Dashboard */}
        <button
          onClick={() => onChangeView('buyer_dashboard')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-xl transition-all ${
            activeView === 'buyer_dashboard'
              ? 'text-purple-400 font-bold bg-slate-800/80'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>

      </div>
    </div>
  );
};
