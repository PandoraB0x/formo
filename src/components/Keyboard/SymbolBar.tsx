'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { KeyboardKey } from '@/types/element';
import { KEYBOARD_GROUPS, flattenKeys, keyId } from './keyboardConfig';
import { useBoardStore } from '@/store/useBoardStore';
import { addRecentKey } from '@/lib/recentKeys';
import { getKeyboardPrefs, saveKeyboardPrefs } from '@/lib/keyboardPrefs';
import SymbolButton from './SymbolButton';

const CATEGORY_META: Record<string, { short: string; tone: string }> = {
  'Numbrid': { short: '123', tone: 'text-neutral-700' },
  'Tehted': { short: '±', tone: 'text-matcha-700' },
  'Võrdlus': { short: '=', tone: 'text-matcha-700' },
  'Sulud': { short: '( )', tone: 'text-neutral-700' },
  'Muutujad': { short: 'x', tone: 'text-neutral-700' },
  'Kreeka — väiketähed': { short: 'α', tone: 'text-matcha-700' },
  'Kreeka — suurtähed': { short: 'Ω', tone: 'text-matcha-700' },
  'Trigonomeetria': { short: 'sin', tone: 'text-matcha-700' },
  'Logaritmid ja piir': { short: 'ln', tone: 'text-matcha-700' },
  'Integraalid ja summad': { short: '∑', tone: 'text-matcha-700' },
  'Hulgateooria': { short: '∈', tone: 'text-matcha-700' },
  'Loogika': { short: '∀', tone: 'text-matcha-700' },
  'Nooled': { short: '→', tone: 'text-matcha-700' },
  'Geomeetria': { short: '∠', tone: 'text-matcha-700' },
  'Struktuurid': { short: '√', tone: 'text-matcha-700' },
  'Kujundid 2D': { short: '△', tone: 'text-matcha-700' },
  'Kujundid 2D punktiir': { short: '◇', tone: 'text-matcha-700' },
  'Kujundid 3D': { short: '◨', tone: 'text-matcha-700' },
};

export default function SymbolBar() {
  const addElement = useBoardStore((s) => s.addElement);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pinned, setPinned] = useState<string[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPinned(getKeyboardPrefs().favorites);
    function onPrefs() {
      setPinned(getKeyboardPrefs().favorites);
    }
    window.addEventListener('formo:prefs', onPrefs);
    return () => window.removeEventListener('formo:prefs', onPrefs);
  }, []);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenKey(null);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, []);

  const handlePress = (k: KeyboardKey) => {
    addElement(k.type, k.content);
    addRecentKey(k);
    window.dispatchEvent(new Event('formo:recent'));
    setOpenKey(null);
    setQuery('');
  };

  const togglePin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const favorites = prefs.favorites.includes(id)
      ? prefs.favorites.filter((x) => x !== id)
      : [...prefs.favorites, id];
    saveKeyboardPrefs({ ...prefs, favorites });
    setPinned(favorites);
    window.dispatchEvent(new Event('formo:prefs'));
  };

  const activeGroup = useMemo(
    () => KEYBOARD_GROUPS.find((g) => g.title === openKey) ?? null,
    [openKey],
  );

  const q = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return [];
    const all = flattenKeys();
    return all.filter((k) => {
      const hay = [
        k.label,
        k.hint ?? '',
        typeof k.content === 'string' ? k.content : '',
        k.type,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  return (
    <div ref={barRef} className="relative z-30 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-1.5">
        <button
          type="button"
          onClick={() => setOpenKey(openKey === '__search' ? null : '__search')}
          className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
            openKey === '__search'
              ? 'border-matcha-500 bg-matcha-50 text-matcha-800'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
          }`}
          title="Otsi sümbolit"
        >
          <Search size={12} />
          Otsi
        </button>
        <div className="h-5 w-px shrink-0 bg-neutral-200" />
        {KEYBOARD_GROUPS.map((g) => {
          const meta = CATEGORY_META[g.title] ?? { short: g.title.slice(0, 3), tone: 'text-neutral-700' };
          const open = openKey === g.title;
          return (
            <button
              key={g.title}
              type="button"
              onClick={() => setOpenKey(open ? null : g.title)}
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
                open
                  ? 'border-matcha-500 bg-matcha-50 text-matcha-800'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
              title={g.title}
            >
              <span className={`text-base leading-none ${meta.tone}`}>{meta.short}</span>
              <span className="hidden md:inline">{g.title}</span>
            </button>
          );
        })}
      </div>

      {openKey === '__search' && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-neutral-200 bg-white shadow-lg">
          <div className="mx-auto max-w-4xl p-3">
            <div className="relative mb-3">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Otsi sümbolit (sin, alfa, →)"
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-8 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-matcha-400 focus:outline-none focus:ring-1 focus:ring-matcha-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  title="Tühjenda"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {!q ? (
              <p className="text-xs text-neutral-500">Alusta tippimist. Näiteks: sin, alfa, →, kuup.</p>
            ) : searchResults.length === 0 ? (
              <p className="text-xs text-neutral-500">Midagi ei leitud</p>
            ) : (
              <>
                <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">
                  Tulemused ({searchResults.length})
                </p>
                <div className="grid grid-cols-10 gap-1.5">
                  {searchResults.map((k) => (
                    <SymbolButton
                      key={keyId(k) + k.label}
                      k={k}
                      onPress={handlePress}
                      onTogglePin={togglePin}
                      pinned={pinned.includes(keyId(k))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeGroup && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-neutral-200 bg-white shadow-lg">
          <div className="mx-auto max-w-4xl p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                {activeGroup.title}
              </p>
              <p className="text-[10px] text-neutral-400">
                Parem klõps — kinnita vasakusse doki. Lohista — sama.
              </p>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {activeGroup.keys.map((k) => (
                <SymbolButton
                  key={keyId(k) + k.label}
                  k={k}
                  onPress={handlePress}
                  onTogglePin={togglePin}
                  pinned={pinned.includes(keyId(k))}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
