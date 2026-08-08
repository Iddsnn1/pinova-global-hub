import { TranslationDictionary } from '../../types/i18n';
import { enDictionary } from './en';
import { haDictionary } from './ha';
import { arDictionary } from './ar';
import { frDictionary } from './fr';
import { esDictionary } from './es';
import { zhDictionary } from './zh';

export const LOCALES: Record<string, TranslationDictionary> = {
  en: enDictionary,
  ha: haDictionary,
  ar: arDictionary,
  fr: frDictionary,
  es: esDictionary,
  'zh-CN': zhDictionary,
  'zh-TW': zhDictionary
};

/**
 * Returns translation string for a given key, with fallback to English
 */
export function getTranslation(
  langCode: string,
  key: string,
  customDicts?: Record<string, TranslationDictionary>
): string {
  // Check active runtime dynamic translation store first
  if (customDicts && customDicts[langCode] && customDicts[langCode][key]) {
    return customDicts[langCode][key];
  }

  // Check pre-bundled dictionary
  const dict = LOCALES[langCode] || LOCALES['en'];
  if (dict && dict[key]) {
    return dict[key];
  }

  // Fallback to Master English Dictionary
  if (enDictionary[key]) {
    return enDictionary[key];
  }

  // Return the key itself as last fallback
  return key;
}
