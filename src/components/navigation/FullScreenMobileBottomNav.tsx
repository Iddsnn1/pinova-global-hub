import React from 'react';
import { Home, Package, Zap, ShoppingBag, User } from 'lucide-react';
import { MainSection } from '../../types/navigation';

interface FullScreenMobileBottomNavProps {
  activeSection: MainSection;
  onNavigateSection: (section: MainSection) => void;
  cartCount: number;
}

export const FullScreenMobileBottomNav: React.FC<FullScreenMobileBottomNavProps> = ({
  activeSection,
  onNavigateSection,
  cartCount
}) => {
  const items: { id: MainSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Package className="w-5 h-5" /> },
    { id: 'utilities', label: 'Utilities', icon: <Zap className="w-5 h-5" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-5 h-5" />, badge: cartCount },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full max-w-full overflow-hidden z-40 bg-slate-900/98 backdrop-blur-xl border-t border-slate-800 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigateSection(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[50px] min-h-[46px] px-2 py-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-amber-400 font-extrabold bg-slate-800/90 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 font-bold tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
