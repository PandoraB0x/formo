'use client';

import { useEffect, useState, useCallback } from 'react';
import { DEFAULT_LANG, type Lang } from './types';
import { DICTS } from './dict';
import { emit, on } from '@/lib/events';

const STORAGE_KEY = 'formo:lang:v1';

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'et' || v === 'en' || v === 'ru') return v;
  } catch {}
  return DEFAULT_LANG;
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(readStoredLang());
    const sync = () => setLangState(readStoredLang());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener('storage', onStorage);
    const off = on('formo:lang', sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      off();
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      emit('formo:lang');
    } catch {}
  }, []);

  return { lang, setLang, t: DICTS[lang] };
}
