import React, { useState } from 'react';
import { Smartphone, Zap, Gift, ShieldCheck, ArrowRight, Wifi, Tv, Globe, Droplets, GraduationCap, Gamepad2, Coins, Sparkles, Plus } from 'lucide-react';
import { Product } from '../types';
import { UtilityCategoryType } from '../types/utility';
import { UTILITY_CATEGORY_META } from '../data/utilityData';

interface AirtimeUtilitySectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onInstantBuy: (product: Product, quantity: number, customDetails?: any) => void;
  onOpenFlexibleUtilityModal?: (category?: UtilityCategoryType) => void;
  piRateUsd?: number;
}

export const AirtimeUtilitySection: React.FC<AirtimeUtilitySectionProps> = ({
  products,
  onSelectProduct,
  onInstantBuy,
  onOpenFlexibleUtilityModal,
  piRateUsd = 10.00
}) => {
  const [activeTab, setActiveTab] = useState<UtilityCategoryType>('airtime');

  const categoriesToShow: UtilityCategoryType[] = [
    'airtime',
    'data',
    'electricity',
    'cable',
    'internet',
    'water',
    'exam',
    'giftcard',
    'betting',
    'gaming',
    'streaming'
  ];

  const handleLaunchModal = (cat: UtilityCategoryType) => {
    setActiveTab(cat);
    if (onOpenFlexibleUtilityModal) {
      onOpenFlexibleUtilityModal(cat);
    }
  };

  return (
    <section className="py-8 bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Official Pi Ecosystem Utility Gateway</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                1 π = ${piRateUsd.toFixed(2)} USD
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Airtime, Bills, Gift Cards & Digital Services</h2>
            <p className="text-xs text-slate-300 mt-1">Recharge global lines, pay electric/water meters, fund wallets, and buy digital vouchers with instant Pi SDK settlement.</p>
          </div>

          <button
            onClick={() => handleLaunchModal(activeTab)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Open Flexible Utility Portal</span>
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesToShow.map((catKey) => {
            const meta = UTILITY_CATEGORY_META[catKey] || { title: catKey };
            const isActive = activeTab === catKey;
            return (
              <button
                key={catKey}
                onClick={() => handleLaunchModal(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                }`}
              >
                <span>{meta.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Service Feature Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleLaunchModal('airtime')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-500/80 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-purple-400 transition-colors">Airtime & Data Recharge</h4>
              <p className="text-[11px] text-slate-400">Custom amounts or data bundles for 500+ global telecom carriers.</p>
            </div>
          </div>

          <div
            onClick={() => handleLaunchModal('electricity')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-500/80 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-purple-400 transition-colors">Prepaid Meter & Water Tokens</h4>
              <p className="text-[11px] text-slate-400">20-digit prepaid electric meter tokens generated in seconds.</p>
            </div>
          </div>

          <div
            onClick={() => handleLaunchModal('giftcard')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-purple-500/80 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-purple-400 transition-colors">Gift Cards & Gaming Top-ups</h4>
              <p className="text-[11px] text-slate-400">Amazon, Apple, PUBG UC, Netflix, Steam, 1xBet & Free Fire.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

