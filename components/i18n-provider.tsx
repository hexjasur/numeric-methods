'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import uz from '@/lib/i18n/locales/uz.json';
import ru from '@/lib/i18n/locales/ru.json';
import en from '@/lib/i18n/locales/en.json';

type Locale = 'uz' | 'ru' | 'en';
type Dictionary = typeof uz;

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('app-locale') as Locale;
    if (saved && dictionaries[saved]) {
      setLocaleState(saved);
    } else {
      const navLang = navigator.language.split('-')[0];
      if (navLang === 'ru') setLocaleState('ru');
      else if (navLang === 'en') setLocaleState('en');
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('app-locale', l);
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let val: any = dict;
      for (const k of keys) {
        if (val === undefined) break;
        val = val[k as keyof typeof val];
      }
      
      let res = val ?? key;
      if (typeof res === 'string' && params) {
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
