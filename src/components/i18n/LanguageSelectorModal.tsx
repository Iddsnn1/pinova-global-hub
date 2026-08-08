import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Globe, Search, Check, X, Sparkles, SlidersHorizontal, MapPin, DollarSign, ShieldCheck } from 'lucide-react';
import { LanguageMeta } from '../../types/i18n';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, languages, setLanguage, t, formatCurrency } = useTranslation();
  const [selectedCode, setSelectedCode] = useState(currentLanguage.code);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  if (!isOpen) return null;

  const enabledLanguages = languages.filter((l) => l.enabled);

  const selectedMeta = languages.find((l) => l.code === selectedCode) || currentLanguage;

  const filteredLanguages = enabledLanguages.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.regionCode.toLowerCase().includes(q) ||
      l.localCurrencyCode.toLowerCase().includes(q);

    if (selectedRegion === 'all') return matchesSearch;
    if (selectedRegion === 'africa') return matchesSearch && ['NG', 'KE', 'ET'].includes(l.regionCode);
    if (selectedRegion === 'asia') return matchesSearch && ['CN', 'TW', 'JP', 'KR', 'IN', 'PK', 'BD', 'ID', 'MY'].includes(l.regionCode);
    if (selectedRegion === 'europe') return matchesSearch && ['FR', 'ES', 'DE', 'IT', 'TR', 'RU', 'US'].includes(l.regionCode);
    if (selectedRegion === 'middle_east') return matchesSearch && ['SA', 'PK'].includes(l.regionCode);
    return matchesSearch;
  });

  const handleApply = () => {
    setLanguage(selectedCode);
    onClose();
  };

  // Sample Price format test
  const samplePrice = formatCurrency(10.0, 10.0, true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {t('nav.selectLanguage', undefined, 'Select Language & Localization')}
                <span className="text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  23 Languages
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose your native language and regional preferences for PiNova Global Commerce.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by language, country code, or currency (e.g., Hausa, Arabic, NGN)..."
                className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Region Select */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500/50 appearance-none"
              >
                <option value="all">🌍 All Global Regions</option>
                <option value="africa">🌍 Africa (Hausa, Swahili, Yoruba, Igbo...)</option>
                <option value="asia">🌏 Asia & Pacific (Chinese, Japanese, Hindi...)</option>
                <option value="europe">🌍 Europe & Americas (English, French, Spanish...)</option>
                <option value="middle_east">🕌 Middle East (Arabic, Urdu...)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="p-5 overflow-y-auto max-h-[50vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedCode(lang.code)}
                className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl leading-none">{lang.flag}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {lang.nativeName}
                        {lang.dir === 'rtl' && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono">
                            RTL
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{lang.name}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 bg-amber-500 text-slate-950 rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {lang.regionCode}
                  </span>
                  <span className="font-mono text-amber-400/90 font-medium">
                    1 USD ≈ {lang.localCurrencySymbol}{lang.exchangeRateToUsd} {lang.localCurrencyCode}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Preview & Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="text-xl">{selectedMeta.flag}</span>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Selected: {selectedMeta.nativeName} ({selectedMeta.name})</span>
                <span className="text-[10px] text-slate-400 font-mono">[{selectedMeta.code}]</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Format: {selectedMeta.dateFormat}</span>
                <span>•</span>
                <span>Time: {selectedMeta.timeFormat}</span>
                <span>•</span>
                <span>RTL: {selectedMeta.dir === 'rtl' ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              {t('common.cancel', undefined, 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Switch Language</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
