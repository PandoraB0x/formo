'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pin, Clock, LogIn } from 'lucide-react';
import type { KeyboardKey } from '@/types/element';
import { flattenKeys, keyId } from './keyboardConfig';
import { useBoardStore } from '@/store/useBoardStore';
import { addRecentKey, getRecentKeys, clearRecentKeys } from '@/lib/recentKeys';
import { getKeyboardPrefs, saveKeyboardPrefs } from '@/lib/keyboardPrefs';
import { useAuth } from '@/lib/auth';
import SymbolButton from './SymbolButton';

export default function SymbolDock() {
  const addElement = useBoardStore((s) => s.addElement);
  const { user, ready } = useAuth();
  const loggedIn = ready && !!user;
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [recent, setRecent] = useState<KeyboardKey[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setPinnedIds(getKeyboardPrefs().favorites);
    setRecent(getRecentKeys());
    function onPrefs() {
      setPinnedIds(getKeyboardPrefs().favorites);
    }
    function onRecent() {
      setRecent(getRecentKeys());
    }
    window.addEventListener('formo:prefs', onPrefs);
    window.addEventListener('formo:recent', onRecent);
    return () => {
      window.removeEventListener('formo:prefs', onPrefs);
      window.removeEventListener('formo:recent', onRecent);
    };
  }, []);

  const allKeysById = useMemo(() => {
    const m = new Map<string, KeyboardKey>();
    for (const k of flattenKeys()) m.set(keyId(k), k);
    return m;
  }, []);

  const pinned = useMemo(
    () =>
      pinnedIds
        .map((id) => allKeysById.get(id))
        .filter((k): k is KeyboardKey => Boolean(k)),
    [pinnedIds, allKeysById],
  );

  const handlePress = (k: KeyboardKey) => {
    addElement(k.type, k.content);
    addRecentKey(k);
    window.dispatchEvent(new Event('formo:recent'));
  };

  const togglePin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const favorites = prefs.favorites.includes(id)
      ? prefs.favorites.filter((x) => x !== id)
      : [...prefs.favorites, id];
    saveKeyboardPrefs({ ...prefs, favorites });
    setPinnedIds(favorites);
    window.dispatchEvent(new Event('formo:prefs'));
  };

  const unpin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const favorites = prefs.favorites.filter((x) => x !== id);
    saveKeyboardPrefs({ ...prefs, favorites });
    setPinnedIds(favorites);
    window.dispatchEvent(new Event('formo:prefs'));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('application/x-formo-key');
    if (!id) return;
    if (!allKeysById.has(id)) return;
    if (pinnedIds.includes(id)) return;
    const prefs = getKeyboardPrefs();
    const favorites = [...prefs.favorites, id];
    saveKeyboardPrefs({ ...prefs, favorites });
    setPinnedIds(favorites);
    window.dispatchEvent(new Event('formo:prefs'));
  };

  return (
    <aside
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/x-formo-key')) {
          e.preventDefault();
          setDragOver(true);
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex h-full w-24 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 ${
        dragOver ? 'ring-2 ring-inset ring-matcha-400' : ''
      }`}
    >
      <div className="flex-1 overflow-y-auto p-2">
        <section className="mb-3">
          <h3 className="mb-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            <Pin size={10} />
            Kinnitatud
          </h3>
          {pinned.length === 0 ? (
            <div className="rounded-md border border-dashed border-neutral-300 bg-white px-1 py-3 text-center text-[10px] leading-tight text-neutral-400">
              Lohista siia
              <br />
              sümbol ülevalt
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {pinned.map((k) => (
                <SymbolButton
                  key={keyId(k) + 'pin'}
                  k={k}
                  size="sm"
                  onPress={handlePress}
                  onTogglePin={togglePin}
                  onRemove={unpin}
                  pinned
                />
              ))}
            </div>
          )}
        </section>

        {recent.length > 0 && (
          <section>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                <Clock size={10} />
                Hiljuti
              </h3>
              <button
                type="button"
                onClick={() => {
                  clearRecentKeys();
                  setRecent([]);
                }}
                className="text-[9px] text-neutral-400 hover:text-neutral-700"
                title="Tühjenda"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {recent.map((k) => (
                <SymbolButton
                  key={keyId(k) + 'rec'}
                  k={k}
                  size="sm"
                  onPress={handlePress}
                  onTogglePin={togglePin}
                  pinned={pinnedIds.includes(keyId(k))}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {ready && !loggedIn && (
        <Link
          href="/login"
          className="flex items-center gap-1.5 border-t border-neutral-200 bg-amber-50/70 px-2 py-2 text-[10px] leading-tight text-amber-800 hover:bg-amber-50"
          title="Logi sisse, et dokk salvestuks"
        >
          <LogIn size={11} className="shrink-0" />
          <span>
            Logi sisse — dokk
            <br />
            salvestub sulle
          </span>
        </Link>
      )}
    </aside>
  );
}
