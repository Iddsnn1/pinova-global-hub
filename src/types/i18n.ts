export type TextDirection = 'ltr' | 'rtl';

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: TextDirection;
  enabled: boolean;
  regionCode: string;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  exchangeRateToUsd: number; // 1 USD = X Local Fiat
  dateFormat: string; // e.g. 'YYYY-MM-DD' or 'DD/MM/YYYY' or 'MMM D, YYYY'
  timeFormat: '12h' | '24h';
  completionPercentage: number;
  isRtl?: boolean;
}

export type TranslationDictionary = Record<string, string>;

export interface TranslationSection {
  id: string;
  name: string;
  keys: string[];
}

export interface LocalizationConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  autoDetect: boolean;
  allowFiatEstimation: boolean;
}

export interface TranslationAuditLog {
  id: string;
  langCode: string;
  keyUpdated: string;
  oldValue: string;
  newValue: string;
  updatedBy: string;
  timestamp: string;
}
