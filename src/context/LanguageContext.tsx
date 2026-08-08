import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LanguageMeta, TextDirection, TranslationDictionary, TranslationAuditLog } from '../types/i18n';
import { INITIAL_SUPPORTED_LANGUAGES } from '../data/i18nLanguages';
import { getTranslation, LOCALES } from '../data/locales';

interface LanguageContextType {
  currentLanguage: LanguageMeta;
  languages: LanguageMeta[];
  dir: TextDirection;
  isRTL: boolean;
  setLanguage: (code: string) => void;
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
  formatDate: (date: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (piAmount: number, piRateUsd?: number, showEstimatedFiat?: boolean) => {
    piFormatted: string;
    fiatFormatted: string;
    combined: string;
  };
  // Admin Methods
  toggleLanguageStatus: (code: string, enabled: boolean) => void;
  updateTranslationKey: (langCode: string, key: string, newValue: string, updatedBy?: string) => void;
  addNewLanguage: (newLang: LanguageMeta, initialDict?: TranslationDictionary) => void;
  exportTranslationsJSON: (langCode: string) => string;
  importTranslationsJSON: (langCode: string, jsonString: string) => boolean;
  getMissingKeysCount: (langCode: string) => number;
  auditLogs: TranslationAuditLog[];
}

const STORAGE_KEY_LANG = 'pinova_preferred_language';
const STORAGE_KEY_CUSTOM_DICTS = 'pinova_custom_translations';
const STORAGE_KEY_LANG_LIST = 'pinova_languages_meta';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load languages list from storage or default
  const [languages, setLanguages] = useState<LanguageMeta[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG_LIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved languages metadata');
    }
    return INITIAL_SUPPORTED_LANGUAGES;
  });

  // Dynamic custom translations dictionary override map
  const [customDicts, setCustomDicts] = useState<Record<string, TranslationDictionary>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DICTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved custom translations');
    }
    return {};
  });

  // Translation audit logs
  const [auditLogs, setAuditLogs] = useState<TranslationAuditLog[]>([]);

  // Detect initial language
  const detectInitialLanguage = (): LanguageMeta => {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedCode) {
        const found = languages.find((l) => l.code === savedCode && l.enabled);
        if (found) return found;
      }

      // Browser detection
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      if (navLang) {
        // Direct match e.g. 'ha', 'ar', 'fr', 'zh-CN'
        const direct = languages.find((l) => l.code.toLowerCase() === navLang.toLowerCase() && l.enabled);
        if (direct) return direct;

        // Prefix match e.g. 'en-US' -> 'en'
        const prefix = navLang.split('-')[0];
        const prefixMatch = languages.find((l) => l.code.toLowerCase() === prefix.toLowerCase() && l.enabled);
        if (prefixMatch) return prefixMatch;
      }
    } catch (err) {
      console.warn('Language detection error:', err);
    }

    // Default to English
    return languages.find((l) => l.code === 'en') || languages[0];
  };

  const [currentLanguage, setCurrentLanguage] = useState<LanguageMeta>(detectInitialLanguage);

  // Apply RTL and HTML attributes on language change
  useEffect(() => {
    const dir = currentLanguage.dir || (currentLanguage.isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLanguage.code);

    if (dir === 'rtl') {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }

    try {
      localStorage.setItem(STORAGE_KEY_LANG, currentLanguage.code);
    } catch (e) {}
  }, [currentLanguage]);

  // Persist custom dicts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_DICTS, JSON.stringify(customDicts));
    } catch (e) {}
  }, [customDicts]);

  // Persist languages list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG_LIST, JSON.stringify(languages));
    } catch (e) {}
  }, [languages]);

  const setLanguage = (code: string) => {
    const target = languages.find((l) => l.code === code && l.enabled);
    if (target) {
      setCurrentLanguage(target);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>, fallback?: string): string => {
    let text = getTranslation(currentLanguage.code, key, customDicts);
    if (!text && fallback) text = fallback;

    if (params) {
      Object.keys(params).forEach((pKey) => {
        text = text.replace(new RegExp(`{\\s*${pKey}\\s*}`, 'g'), String(params[pKey]));
      });
    }
    return text;
  };

  // Regional Date Formatting
  const formatDate = (dateInput: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) return String(dateInput);

      const locale = currentLanguage.code === 'ha' ? 'ha-NG' : currentLanguage.code === 'ar' ? 'ar-SA' : currentLanguage.code;
      return new Intl.DateTimeFormat(locale, options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);
    } catch (e) {
      return new Date(dateInput).toLocaleDateString();
    }
  };

  // Regional Number Formatting
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    try {
      const locale = currentLanguage.code;
      return new Intl.NumberFormat(locale, options).format(num);
    } catch (e) {
      return num.toLocaleString();
    }
  };

  // Regional Currency & Pi Formatting
  const formatCurrency = (piAmount: number, piRateUsd = 10.0, showEstimatedFiat = true) => {
    const piFormatted = `${piAmount.toFixed(2)} π`;
    
    // Calculate local fiat estimation
    const totalUsd = piAmount * piRateUsd;
    const localFiatValue = totalUsd * (currentLanguage.exchangeRateToUsd || 1.0);
    const fiatFormatted = `${currentLanguage.localCurrencySymbol}${localFiatValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${currentLanguage.localCurrencyCode}`;

    const combined = showEstimatedFiat ? `${piFormatted} (~${fiatFormatted})` : piFormatted;

    return {
      piFormatted,
      fiatFormatted,
      combined
    };
  };

  // Admin Methods
  const toggleLanguageStatus = (code: string, enabled: boolean) => {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, enabled } : l))
    );
  };

  const updateTranslationKey = (
    langCode: string,
    key: string,
    newValue: string,
    updatedBy = 'Admin'
  ) => {
    const oldValue = getTranslation(langCode, key, customDicts);
    setCustomDicts((prev) => ({
      ...prev,
      [langCode]: {
        ...(prev[langCode] || {}),
        [key]: newValue
      }
    }));

    setAuditLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        langCode,
        keyUpdated: key,
        oldValue,
        newValue,
        updatedBy,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const addNewLanguage = (newLang: LanguageMeta, initialDict?: TranslationDictionary) => {
    setLanguages((prev) => {
      if (prev.some((l) => l.code === newLang.code)) return prev;
      return [...prev, newLang];
    });

    if (initialDict) {
      setCustomDicts((prev) => ({
        ...prev,
        [newLang.code]: initialDict
      }));
    }
  };

  const exportTranslationsJSON = (langCode: string): string => {
    const masterKeys = Object.keys(LOCALES['en'] || {});
    const exportDict: Record<string, string> = {};

    masterKeys.forEach((k) => {
      exportDict[k] = getTranslation(langCode, k, customDicts);
    });

    return JSON.stringify(exportDict, null, 2);
  };

  const importTranslationsJSON = (langCode: string, jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        setCustomDicts((prev) => ({
          ...prev,
          [langCode]: {
            ...(prev[langCode] || {}),
            ...parsed
          }
        }));
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON translations', e);
    }
    return false;
  };

  const getMissingKeysCount = (langCode: string): number => {
    const masterKeys = Object.keys(LOCALES['en'] || {});
    let missing = 0;
    masterKeys.forEach((k) => {
      const val = getTranslation(langCode, k, customDicts);
      if (!val || val === k) missing++;
    });
    return missing;
  };

  const dir = currentLanguage.dir || (currentLanguage.isRtl ? 'rtl' : 'ltr');
  const isRTL = dir === 'rtl';

  const value = useMemo(
    () => ({
      currentLanguage,
      languages,
      dir,
      isRTL,
      setLanguage,
      t,
      formatDate,
      formatNumber,
      formatCurrency,
      toggleLanguageStatus,
      updateTranslationKey,
      addNewLanguage,
      exportTranslationsJSON,
      importTranslationsJSON,
      getMissingKeysCount,
      auditLogs
    }),
    [currentLanguage, languages, dir, isRTL, customDicts, auditLogs]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
