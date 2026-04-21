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
import { emit, on } from '@/lib/events';
import { useLang } from '@/i18n/useLang';
import SymbolButton from './SymbolButton';

export default function SymbolDock() {
  const addElement = useBoardStore((s) => s.addElement);
  const { user, ready } = useAuth();
  const { t } = useLang();
  const loggedIn = ready && !!user;
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [recent, setRecent] = useState<KeyboardKey[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setPinnedIds(getKeyboardPrefs().pinned);
    setRecent(getRecentKeys());
    const offPrefs = on('formo:prefs', () => setPinnedIds(getKeyboardPrefs().pinned));
    const offRecent = on('formo:recent', () => setRecent(getRecentKeys()));
    return () => {
      offPrefs();
      offRecent();
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
    emit('formo:recent');
  };

  const togglePin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const pinned = prefs.pinned.includes(id)
      ? prefs.pinned.filter((x) => x !== id)
      : [...prefs.pinned, id];
    saveKeyboardPrefs({ pinned });
    setPinnedIds(pinned);
    emit('formo:prefs');
  };

  const unpin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const pinned = prefs.pinned.filter((x) => x !== id);
    saveKeyboardPrefs({ pinned });
    setPinnedIds(pinned);
    emit('formo:prefs');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('application/x-formo-key');
    if (!id) return;
    if (!allKeysById.has(id)) return;
    if (pinnedIds.includes(id)) return;
    const prefs = getKeyboardPrefs();
    const pinned = [...prefs.pinned, id];
    saveKeyboardPrefs({ pinned });
    setPinnedIds(pinned);
    emit('formo:prefs');
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
      className={`flex h-full w-48 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 ${
        dragOver ? 'ring-2 ring-inset ring-matcha-400' : ''
      }`}
    >
      <div className="flex-1 overflow-y-auto p-3">
        <section className="mb-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
            <Pin size={12} />
            {t.keyboard.pinned}
          </h3>
          {pinned.length === 0 ? (
            <div className="rounded-md border border-dashed border-neutral-300 bg-white px-2 py-6 text-center text-xs leading-snug text-neutral-400">
              {t.keyboard.dragHere}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {pinned.map((k) => (
                <SymbolButton
                  key={keyId(k) + 'pin'}
                  k={k}
                  size="lg"
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
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
                <Clock size={12} />
                {t.keyboard.recent}
              </h3>
              <button
                type="button"
                onClick={() => {
                  clearRecentKeys();
                  setRecent([]);
                }}
                className="text-[11px] text-neutral-400 hover:text-neutral-700"
                title={t.keyboard.clearTooltip}
              >
                {t.keyboard.clearShort}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recent.map((k) => (
                <SymbolButton
                  key={keyId(k) + 'rec'}
                  k={k}
                  size="lg"
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
          className="flex items-center gap-2 border-t border-neutral-200 bg-amber-50/70 px-3 py-3 text-xs leading-snug text-amber-800 hover:bg-amber-50"
          title={t.keyboard.guestDockTitle}
        >
          <LogIn size={14} className="shrink-0" />
          <span>{t.keyboard.guestDockCta}</span>
        </Link>
      )}
    </aside>
  );
}
