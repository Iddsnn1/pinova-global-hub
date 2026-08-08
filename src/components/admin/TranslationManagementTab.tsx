import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  Globe, 
  Plus, 
  Search, 
  Edit3, 
  Check, 
  X, 
  Download, 
  Upload, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal, 
  FileJson, 
  History,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { LanguageMeta } from '../../types/i18n';

export const TranslationManagementTab: React.FC = () => {
  const {
    languages,
    currentLanguage,
    toggleLanguageStatus,
    updateTranslationKey,
    addNewLanguage,
    exportTranslationsJSON,
    importTranslationsJSON,
    getMissingKeysCount,
    auditLogs,
    t
  } = useTranslation();

  const [selectedLangCode, setSelectedLangCode] = useState<string>('en');
  const [searchKey, setSearchKey] = useState<string>('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'languages' | 'import_export' | 'audit_logs'>('editor');

  // New Language Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLangForm, setNewLangForm] = useState<Partial<LanguageMeta>>({
    code: '',
    name: '',
    nativeName: '',
    flag: '🌐',
    dir: 'ltr',
    enabled: true,
    regionCode: 'US',
    localCurrencyCode: 'USD',
    localCurrencySymbol: '$',
    exchangeRateToUsd: 1.0,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    completionPercentage: 100
  });

  // Import JSON Modal state
  const [importJsonText, setImportJsonText] = useState('');
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Master translation key list from English
  const targetLang = languages.find((l) => l.code === selectedLangCode) || languages[0];

  const handleStartEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(t(key));
  };

  const handleSaveKey = (key: string) => {
    updateTranslationKey(selectedLangCode, key, editValue, 'Platform_Admin');
    setEditingKey(null);
  };

  const handleAddLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangForm.code || !newLangForm.name || !newLangForm.nativeName) return;

    const fullLang: LanguageMeta = {
      code: newLangForm.code.trim().toLowerCase(),
      name: newLangForm.name.trim(),
      nativeName: newLangForm.nativeName.trim(),
      flag: newLangForm.flag || '🌐',
      dir: newLangForm.dir || 'ltr',
      enabled: true,
      regionCode: newLangForm.regionCode || 'US',
      localCurrencyCode: newLangForm.localCurrencyCode || 'USD',
      localCurrencySymbol: newLangForm.localCurrencySymbol || '$',
      exchangeRateToUsd: Number(newLangForm.exchangeRateToUsd) || 1.0,
      dateFormat: newLangForm.dateFormat || 'YYYY-MM-DD',
      timeFormat: newLangForm.timeFormat || '24h',
      completionPercentage: 100
    };

    addNewLanguage(fullLang);
    setIsAddModalOpen(false);
    setSelectedLangCode(fullLang.code);
  };

  const handleImportJson = () => {
    const success = importTranslationsJSON(selectedLangCode, importJsonText);
    if (success) {
      setImportNotice({ type: 'success', message: `Successfully imported translation bundle for [${selectedLangCode}]` });
      setImportJsonText('');
    } else {
      setImportNotice({ type: 'error', message: 'Invalid JSON format. Please check syntax and try again.' });
    }
  };

  // Sample master keys
  const masterKeys = [
    'common.appName',
    'common.tagline',
    'common.search',
    'common.save',
    'common.cancel',
    'common.confirm',
    'common.total',
    'common.piBalance',
    'nav.marketplace',
    'nav.buyerDashboard',
    'nav.sellerDashboard',
    'nav.adminDashboard',
    'nav.aiSearch',
    'nav.cart',
    'nav.utilityServices',
    'hero.title',
    'hero.subtitle',
    'hero.ctaShop',
    'hero.ctaUtility',
    'catalog.allCategories',
    'catalog.physicalGoods',
    'catalog.digitalAssets',
    'catalog.airtimeUtility',
    'product.buyNow',
    'product.addToCart',
    'product.inStock',
    'utility.title',
    'utility.airtime',
    'utility.electricity',
    'utility.payUtility',
    'checkout.title',
    'buyer.title',
    'seller.title',
    'admin.title',
    'admin.i18n.title'
  ];

  const filteredKeys = masterKeys.filter((k) => {
    const q = searchKey.toLowerCase();
    const currentVal = t(k).toLowerCase();
    return k.toLowerCase().includes(q) || currentVal.includes(q);
  });

  const missingCount = getMissingKeysCount(selectedLangCode);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Global Language & Localization Management</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
                Module 1 Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Configure 23+ pre-bundled global languages, customize strings in real time, monitor translation completion %, and import/export language JSON bundles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Language</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('editor')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'editor'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Translation Key Editor</span>
        </button>

        <button
          onClick={() => setActiveSubTab('languages')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'languages'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Supported Languages ({languages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('import_export')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'import_export'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileJson className="w-4 h-4" />
          <span>Import / Export JSON</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'audit_logs'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: TRANSLATION KEY EDITOR */}
      {activeSubTab === 'editor' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Target Language Picker */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-400">Target Language:</span>
              <select
                value={selectedLangCode}
                onChange={(e) => setSelectedLangCode(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-sm text-amber-300 font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500/50"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name}) [{l.code}]
                  </option>
                ))}
              </select>
            </div>

            {/* Search Keys */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Search key or string..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Health Stats */}
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Complete
              </span>
              <span className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-mono">
                {targetLang.dir === 'rtl' ? 'RTL Enabled' : 'LTR Layout'}
              </span>
            </div>
          </div>

          {/* Translation Key Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="p-3.5 pl-5">Translation Key</th>
                    <th className="p-3.5">English Baseline</th>
                    <th className="p-3.5">{targetLang.flag} {targetLang.nativeName} ({targetLang.code}) String</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredKeys.map((key) => {
                    const baseline = t(key);
                    const isEditing = editingKey === key;

                    return (
                      <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-amber-300/90 font-medium">{key}</td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">{baseline}</td>
                        <td className="p-3.5 text-slate-200">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-slate-950 border border-amber-500 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-amber-100">{t(key)}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveKey(key)}
                                className="p-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors"
                                title="Save String"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingKey(null)}
                                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(key)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SUPPORTED LANGUAGES MANAGEMENT */}
      {activeSubTab === 'languages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`p-5 rounded-2xl border transition-all ${
                lang.enabled
                  ? 'bg-slate-900 border-slate-800 shadow-xl'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {lang.nativeName}
                      {lang.dir === 'rtl' && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded font-mono">
                          RTL
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">{lang.name}</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lang.enabled}
                    onChange={(e) => toggleLanguageStatus(lang.code, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Language Code:</span>
                  <span className="font-mono text-amber-300">{lang.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Region & Currency:</span>
                  <span className="text-slate-200">
                    {lang.regionCode} • {lang.localCurrencySymbol} ({lang.localCurrencyCode})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completion Status:</span>
                  <span className="font-bold text-emerald-400">{lang.completionPercentage}% Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: IMPORT / EXPORT JSON */}
      {activeSubTab === 'import_export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Box */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <Download className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Export Language Translation Bundle</h3>
            </div>
            <p className="text-xs text-slate-400">
              Download the complete JSON translation file for any supported language to edit offline or translate with AI tools.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Select Language to Export:</label>
              <select
                value={selectedLangCode}
                onChange={(e) => setSelectedLangCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 px-3 py-2 rounded-xl"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name}) [{l.code}]
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const jsonStr = exportTranslationsJSON(selectedLangCode);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pinova-translations-${selectedLangCode}.json`;
                  a.click();
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export {selectedLangCode.toUpperCase()} JSON</span>
              </button>
            </div>
          </div>

          {/* Import Box */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Upload className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Import JSON Translation Bundle</h3>
            </div>
            <p className="text-xs text-slate-400">
              Paste or upload a raw JSON translation dictionary object to update language keys in bulk.
            </p>

            {importNotice && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  importNotice.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{importNotice.message}</span>
              </div>
            )}

            <textarea
              rows={5}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='Paste JSON dictionary (e.g. { "common.appName": "Kasuwar PiNova" })...'
              className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500/50"
            />

            <button
              onClick={handleImportJson}
              disabled={!importJsonText.trim()}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import & Update {selectedLangCode.toUpperCase()} Dictionary</span>
            </button>
          </div>
        </div>
      )}

      {/* ADD LANGUAGE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <span>Register New Supported Language</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLanguageSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Language Code (ISO):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. sw, yo, ig, am"
                    value={newLangForm.code}
                    onChange={(e) => setNewLangForm({ ...newLangForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Flag Emoji / Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. 🇰🇪"
                    value={newLangForm.flag}
                    onChange={(e) => setNewLangForm({ ...newLangForm, flag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">English Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swahili"
                    value={newLangForm.name}
                    onChange={(e) => setNewLangForm({ ...newLangForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Native Name (Endonym):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kiswahili"
                    value={newLangForm.nativeName}
                    onChange={(e) => setNewLangForm({ ...newLangForm, nativeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Text Direction:</label>
                  <select
                    value={newLangForm.dir}
                    onChange={(e) => setNewLangForm({ ...newLangForm, dir: e.target.value as 'ltr' | 'rtl' })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Currency Code:</label>
                  <input
                    type="text"
                    placeholder="KES"
                    value={newLangForm.localCurrencyCode}
                    onChange={(e) => setNewLangForm({ ...newLangForm, localCurrencyCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Currency Symbol:</label>
                  <input
                    type="text"
                    placeholder="KSh"
                    value={newLangForm.localCurrencySymbol}
                    onChange={(e) => setNewLangForm({ ...newLangForm, localCurrencySymbol: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Register Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
