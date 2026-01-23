'use client';

import { translations, type TranslationKey } from './translations';

export function useTranslation() {
  // 언어는 항상 한국어로 고정
  const language = 'ko';
  
  const t = (key: TranslationKey): string | readonly string[] => {
    return translations[key];
  };

  // 문자열만 반환하는 버전
  const ts = (key: TranslationKey): string => {
    const value = translations[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value as string;
  };

  // 배열만 반환하는 버전
  const ta = (key: TranslationKey): string[] => {
    const value = translations[key];
    if (Array.isArray(value)) {
      return [...value];
    }
    return [value as string];
  };

  return { t, ts, ta, language };
}
