'use client';

import { LANGS } from '@/i18n/types';
import { useLang } from '@/i18n/useLang';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5">
      {LANGS.map(({ code, flag, short }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
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
