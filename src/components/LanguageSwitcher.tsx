'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_LANG, LANGS, type Lang } from '@/i18n/types';

const STORAGE_KEY = 'formo:lang:v1';

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'et' || v === 'en' || v === 'ru') return v;
  } catch {}
  return DEFAULT_LANG;
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(readStoredLang());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLangState(readStoredLang());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function changeLang(next: Lang) {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event('formo:lang'));
    } catch {}
  }

  return (
    <div className="flex items-center gap-0.5">
      {LANGS.map(({ code, flag, short }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => changeLang(code)}
            title={code}
            aria-pressed={active}
            className={[
              'flex min-h-[36px] items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold transition-all duration-200',
              active
                ? 'border border-matcha-400 bg-matcha-100 text-matcha-800 shadow-sm scale-[1.04]'
                : 'border border-transparent bg-white/60 text-matcha-600/60 backdrop-blur hover:border-matcha-200 hover:text-matcha-800',
            ].join(' ')}
          >
            <span aria-hidden>{flag}</span>
            {!compact && <span>{short}</span>}
          </button>
        );
      })}
    </div>
  );
}
