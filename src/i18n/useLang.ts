'use client';

import { useEffect, useState, useCallback } from 'react';
import { DEFAULT_LANG, type Lang } from './types';
import { DICTS } from './dict';

const STORAGE_KEY = 'formo:lang:v1';
const EVENT_NAME = 'formo:lang';

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
    window.addEventListener(EVENT_NAME, sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(EVENT_NAME, sync);
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {}
  }, []);

  return { lang, setLang, t: DICTS[lang] };
}
