import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Globe, Check, Search, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSelectorDropdownProps {
  variant?: 'header' | 'footer' | 'mobile';
}

export const LanguageSelectorDropdown: React.FC<LanguageSelectorDropdownProps> = ({ variant = 'header' }) => {
  const { currentLanguage, languages, setLanguage, isRTL, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click (mouse or touch)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const enabledLanguages = languages.filter((l) => l.enabled);

  const filteredLanguages = enabledLanguages.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.regionCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 border ${
          variant === 'header'
            ? 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700/80 text-slate-200 shadow-sm'
            : variant === 'footer'
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            : 'w-full justify-between bg-slate-800 border-slate-700 text-slate-200'
        }`}
        aria-label="Select Language"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-sm sm:text-base leading-none">{currentLanguage.flag}</span>
          <span className="hidden sm:inline font-semibold">{currentLanguage.nativeName}</span>
          <span className="text-[10px] text-slate-300 font-mono uppercase bg-slate-700/60 px-1 py-0.5 rounded">
            {currentLanguage.code}
          </span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? 'left-0' : 'right-0'
          } mt-2 w-72 md:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{t('nav.selectLanguage', undefined, 'Select Language')}</span>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                {enabledLanguages.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language (e.g. Hausa, Arabic, French)..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-amber-500/50"
                autoFocus
              />
            </div>
          </div>

          {/* Language Items List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-800/30">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No language found matching "{searchQuery}"</div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{lang.nativeName}</span>
                          {lang.dir === 'rtl' && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded uppercase font-mono">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lang.name} • {lang.localCurrencySymbol} ({lang.localCurrencyCode})
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Auto-saved for your account
            </span>
            <span className="text-slate-400">Pi SDK v2 Compliant</span>
          </div>
        </div>
      )}
    </div>
  );
};
