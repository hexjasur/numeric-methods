'use client';

import React, { createContext, useContext, useMemo } from 'react';
import uz from '@/lib/i18n/locales/uz.json';
import ru from '@/lib/i18n/locales/ru.json';
import en from '@/lib/i18n/locales/en.json';

export type Locale = 'uz' | 'ru' | 'en';
type Dictionary = typeof uz;

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };
const localeEvent = 'app-locale-change';

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'uz';
  const saved = window.localStorage.getItem('app-locale') as Locale | null;
  if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
    return saved;
  }
  const navLang = window.navigator.language.split('-')[0];
  if (navLang === 'ru') return 'ru';
  if (navLang === 'en') return 'en';
  return 'uz';
}

function subscribeLocale(callback: () => void) {
  window.addEventListener(localeEvent, callback);
  return () => window.removeEventListener(localeEvent, callback);
}

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = React.useSyncExternalStore<Locale>(subscribeLocale, getStoredLocale, () => 'uz');

  const setLocale = (l: Locale) => {
    window.localStorage.setItem('app-locale', l);
    window.dispatchEvent(new Event(localeEvent));
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let val: unknown = dict;
      for (const k of keys) {
        if (val === undefined || val === null || typeof val !== 'object') break;
        val = (val as Record<string, unknown>)[k];
      }

      let res = typeof val === 'string' ? val : key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return res;
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
