import React from 'react';
import { ShieldCheck, Lock, Globe, Smartphone, Zap, Gift, Download, Heart } from 'lucide-react';
import { ProductCategory } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { LanguageSelectorDropdown } from './i18n/LanguageSelectorDropdown';

interface FooterProps {
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onOpenLanguageModal?: () => void;
  onOpenVendorApplication?: () => void;
  onOpenSellerStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenLanguageModal, onOpenVendorApplication, onOpenSellerStudio }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-10 sm:pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
          
          {/* Column 1: Brand Info & Compliance */}
          <div className="space-y-3.5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-lg">
                π
              </div>
              <span className="font-black text-lg text-white">{t('common.appName', undefined, 'PiNova Global Hub')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('common.tagline', undefined, 'Enterprise global ecosystem & multi-vendor marketplace built for the Pi Network.')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Order Protection Standard</span>
            </div>

            {/* Permanent Transparency & Operational Notice */}
            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 space-y-1.5">
              <p>
                <strong>Transparency Notice:</strong> PiNova Global Hub is built on a non-custodial architecture. Payment processing relies on the Official Pi SDK v2 and Pi Platform API. PiNova never stores or manages Pi wallet private keys, recovery phrases, passphrases, blockchain infrastructure, or official Pi Network services.
              </p>
              <p>
                <strong>Operational Notice:</strong> Certain marketplace capabilities rely on external service providers and official Pi Platform services. Feature availability and response times may vary depending on provider availability and official Pi Platform status.
              </p>
            </div>

            {/* Language & Region Selection Bar */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Language & Region:</span>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelectorDropdown variant="footer" />
                {onOpenLanguageModal && (
                  <button
                    onClick={onOpenLanguageModal}
                    className="px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>All 23 Languages</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-200 tracking-wider">Product Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('physical')} className="hover:text-purple-400 transition-colors text-left">
                  Physical Products & Electronics
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('digital')} className="hover:text-purple-400 transition-colors text-left">
                  Digital Downloads & Source Code
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('airtime')} className="hover:text-purple-400 transition-colors text-left">
                  Airtime & Mobile Data Bundles
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('utility')} className="hover:text-purple-400 transition-colors text-left">
                  Electricity & Water Utility Payments
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('giftcard')} className="hover:text-purple-400 transition-colors text-left">
                  Amazon & Digital Gift Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Pi Ecosystem Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-200 tracking-wider">Pi Network Integration</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Official Pi SDK v2.0 Protocol</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Pi Platform Server Approvals</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Blockchain Txid Audit</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Merchant / Seller Studio */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 h-fit">
            <h4 className="font-bold text-xs text-white">Merchant Seller Studio</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enterprise management portal for verified vendors, global inventory management, and automated escrow fulfillment.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenSellerStudio || onOpenVendorApplication}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Seller Studio & Inventory Portal →</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PiNova Global Hub. Built for the Pi Network Ecosystem.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Escrow Terms</span>
            <span>Pi Network API Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
