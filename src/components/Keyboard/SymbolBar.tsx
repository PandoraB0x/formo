'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  GripVertical,
  Layers,
  Pencil,
  Plus,
  Search,
  X,
} from 'lucide-react';
import type { KeyboardGroup, KeyboardKey } from '@/types/element';
import { KEYBOARD_GROUPS, flattenKeys, keyId } from './keyboardConfig';
import { useBoardStore } from '@/store/useBoardStore';
import { addRecentKey } from '@/lib/recentKeys';
import {
  getActiveKitId,
  getGroupOrder,
  getKeyboardPrefs,
  getKits,
  saveGroupOrder,
  saveKeyboardPrefs,
  saveKits,
  type Kit,
} from '@/lib/keyboardPrefs';
import { emit, on } from '@/lib/events';
import { useLang } from '@/i18n/useLang';
import { useAuth } from '@/lib/auth';
import SymbolButton from './SymbolButton';
import KitMenu from './KitMenu';

function applyOrder(groups: KeyboardGroup[], order: string[] | null): KeyboardGroup[] {
  if (!order || order.length === 0) return groups;
  const byTitle = new Map(groups.map((g) => [g.title, g]));
  const out: KeyboardGroup[] = [];
  const seen = new Set<string>();
  for (const title of order) {
    const g = byTitle.get(title);
    if (g && !seen.has(title)) {
      out.push(g);
      seen.add(title);
    }
  }
  for (const g of groups) {
    if (!seen.has(g.title)) out.push(g);
  }
  return out;
}

export default function SymbolBar() {
  const addElement = useBoardStore((s) => s.addElement);
  const { t } = useLang();
  const { user, ready } = useAuth();
  const loggedIn = ready && !!user;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pinned, setPinned] = useState<string[]>([]);
  const [orderedGroups, setOrderedGroups] = useState<KeyboardGroup[]>(KEYBOARD_GROUPS);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [kits, setKits] = useState<Kit[]>([]);
  const [activeKitId, setActiveKitIdState] = useState<string | null>(null);
  const [editKitId, setEditKitId] = useState<string | null>(null);
  const [kitMenuOpen, setKitMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPinned(getKeyboardPrefs().pinned);
    return on('formo:prefs', () => setPinned(getKeyboardPrefs().pinned));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const saved = user ? getGroupOrder(user.email) : null;
    setOrderedGroups(applyOrder(KEYBOARD_GROUPS, saved));
    if (!user) {
      setReorderMode(false);
      setEditKitId(null);
      setKitMenuOpen(false);
      setKits([]);
      setActiveKitIdState(null);
    }
  }, [user, ready]);

  useEffect(() => {
    if (!ready || !user) return;
    const sync = () => {
      setKits(getKits(user.email));
      setActiveKitIdState(getActiveKitId(user.email));
    };
    sync();
    return on('formo:kits', sync);
  }, [user, ready]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenKey(null);
        setReorderMode(false);
        setEditKitId(null);
      }
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
    emit('formo:recent');
    setOpenKey(null);
    setQuery('');
  };

  const togglePin = (k: KeyboardKey) => {
    const id = keyId(k);
    const prefs = getKeyboardPrefs();
    const pinned = prefs.pinned.includes(id)
      ? prefs.pinned.filter((x) => x !== id)
      : [...prefs.pinned, id];
    saveKeyboardPrefs({ pinned });
    setPinned(pinned);
    emit('formo:prefs');
  };

  const activeKit = useMemo(
    () => kits.find((k) => k.id === activeKitId) ?? null,
    [kits, activeKitId],
  );
  const editingKit = useMemo(
    () => kits.find((k) => k.id === editKitId) ?? null,
    [kits, editKitId],
  );
  const inEditKit = editingKit !== null;

  const visibleGroups = useMemo(() => {
    if (inEditKit) return orderedGroups;
    if (!activeKit) return orderedGroups;
    const allowed = new Set(activeKit.groups);
    return orderedGroups.filter((g) => allowed.has(g.title));
  }, [orderedGroups, activeKit, inEditKit]);

  const activeGroup = useMemo(
    () => visibleGroups.find((g) => g.title === openKey) ?? null,
    [openKey, visibleGroups],
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

  const onPillPointerDown = (e: React.PointerEvent<HTMLButtonElement>, idx: number) => {
    if (!reorderMode) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIdx(idx);
  };

  const onPillPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!reorderMode || draggingIdx === null || !rowRef.current) return;
    const pills = rowRef.current.querySelectorAll<HTMLElement>('[data-group-pill]');
    const x = e.clientX;
    let target = draggingIdx;
    pills.forEach((pill, i) => {
      const r = pill.getBoundingClientRect();
      if (x >= r.left && x <= r.right) target = i;
    });
    if (target !== draggingIdx) {
      setOrderedGroups((prev) => {
        const next = [...prev];
        const [moved] = next.splice(draggingIdx, 1);
        next.splice(target, 0, moved);
        return next;
      });
      setDraggingIdx(target);
    }
  };

  const onPillPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingIdx === null) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setDraggingIdx(null);
    if (user) {
      saveGroupOrder(
        user.email,
        orderedGroups.map((g) => g.title),
      );
    }
  };

  const toggleReorder = () => {
    if (!loggedIn) return;
    setReorderMode((v) => !v);
    setEditKitId(null);
    setOpenKey(null);
  };

  const openKitMenu = () => {
    if (!loggedIn) return;
    setReorderMode(false);
    setEditKitId(null);
    setOpenKey(null);
    setKitMenuOpen((v) => !v);
  };

  const handleEditKit = (kitId: string) => {
    setReorderMode(false);
    setKitMenuOpen(false);
    setOpenKey(null);
    setEditKitId(kitId);
  };

  const finishEditKit = () => setEditKitId(null);

  const toggleKitGroup = (title: string) => {
    if (!editingKit || !user) return;
    const inKit = editingKit.groups.includes(title);
    const nextGroups = inKit
      ? editingKit.groups.filter((x) => x !== title)
      : [...editingKit.groups, title];
    const nextKits = kits.map((k) =>
      k.id === editingKit.id ? { ...k, groups: nextGroups } : k,
    );
    saveKits(user.email, nextKits);
    emit('formo:kits');
  };

  return (
    <div ref={barRef} className="relative z-30 border-b border-neutral-200 bg-white">
      <div
        ref={rowRef}
        className="flex items-center gap-1.5 overflow-x-auto px-2 py-1.5"
      >
        <button
          type="button"
          onClick={() =>
            !reorderMode &&
            !inEditKit &&
            setOpenKey(openKey === '__search' ? null : '__search')
          }
          disabled={reorderMode || inEditKit}
          className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
            openKey === '__search'
              ? 'border-matcha-500 bg-matcha-50 text-matcha-800'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
          } ${reorderMode || inEditKit ? 'opacity-40' : ''}`}
          title={t.keyboard.searchTitle}
        >
          <Search size={12} />
          {t.keyboard.searchShort}
        </button>
        {loggedIn && (
          <div className="relative">
            <button
              type="button"
              onClick={openKitMenu}
              disabled={reorderMode || inEditKit}
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
                kitMenuOpen
                  ? 'border-matcha-500 bg-matcha-50 text-matcha-800'
                  : activeKit
                    ? 'border-matcha-400 bg-matcha-50/60 text-matcha-800 hover:border-matcha-500'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              } ${reorderMode || inEditKit ? 'opacity-40' : ''}`}
              title={t.keyboard.kitsTitle}
            >
              <Layers size={12} />
              <span className="max-w-[120px] truncate">
                {activeKit ? activeKit.name : t.keyboard.kitAll}
              </span>
              <ChevronDown size={12} />
            </button>
            {kitMenuOpen && user && (
              <KitMenu
                email={user.email}
                defaultGroups={visibleGroups.map((g) => g.title)}
                onEditKit={handleEditKit}
                onClose={() => setKitMenuOpen(false)}
              />
            )}
          </div>
        )}
        <div className="h-5 w-px shrink-0 bg-neutral-200" />
        {visibleGroups.map((g, idx) => {
          const open = !inEditKit && !reorderMode && openKey === g.title;
          const isDragging = reorderMode && draggingIdx === idx;
          const inKit = editingKit ? editingKit.groups.includes(g.title) : false;
          const base =
            'flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition';

          let mode: string;
          if (reorderMode) {
            mode = `border-dashed cursor-grab touch-none select-none ${
              isDragging
                ? 'border-matcha-500 bg-matcha-100 text-matcha-800 shadow-md scale-105'
                : 'border-neutral-400 bg-neutral-50 text-neutral-700'
            }`;
          } else if (inEditKit) {
            mode = inKit
              ? 'border-matcha-500 bg-matcha-500 text-white hover:bg-matcha-600 cursor-pointer'
              : 'border-dashed border-neutral-300 bg-white text-neutral-400 hover:border-neutral-500 hover:text-neutral-700 cursor-pointer';
          } else if (open) {
            mode = 'border-matcha-500 bg-matcha-50 text-matcha-800';
          } else {
            mode = 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400';
          }

          return (
            <button
              key={g.title}
              type="button"
              data-group-pill
              onClick={() => {
                if (reorderMode) return;
                if (inEditKit) {
                  toggleKitGroup(g.title);
                  return;
                }
                setOpenKey(open ? null : g.title);
              }}
              onPointerDown={(e) => onPillPointerDown(e, idx)}
              onPointerMove={onPillPointerMove}
              onPointerUp={onPillPointerUp}
              onPointerCancel={onPillPointerUp}
              className={`${base} ${mode}`}
              title={
                reorderMode
                  ? t.keyboard.reorderHint
                  : inEditKit
                    ? t.keyboard.kitEditHint
                    : (t.keyboard.groups[g.title] ?? g.title)
              }
            >
              {reorderMode && <GripVertical size={12} className="text-neutral-400" />}
              {inEditKit &&
                (inKit ? (
                  <Check size={12} />
                ) : (
                  <Plus size={12} className="text-neutral-400" />
                ))}
              <span className="text-base leading-none">
                <span className={inEditKit && inKit ? 'text-white' : 'text-matcha-700'}>
                  {g.short}
                </span>
              </span>
              <span className="hidden md:inline">
                {t.keyboard.groups[g.title] ?? g.title}
              </span>
            </button>
          );
        })}
        {loggedIn && inEditKit && (
          <button
            type="button"
            onClick={finishEditKit}
            className="ml-1 flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-matcha-500 bg-matcha-500 px-3 text-xs font-medium text-white transition hover:bg-matcha-600"
            title={t.keyboard.reorderDone}
          >
            <Check size={12} />
            <span className="hidden md:inline">{t.keyboard.reorderDone}</span>
          </button>
        )}
        {loggedIn && !inEditKit && (
          <button
            type="button"
            onClick={toggleReorder}
            className={`ml-1 flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
              reorderMode
                ? 'border-matcha-500 bg-matcha-500 text-white hover:bg-matcha-600'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
            title={reorderMode ? t.keyboard.reorderDone : t.keyboard.reorderStart}
          >
            {reorderMode ? <Check size={12} /> : <Pencil size={12} />}
            <span className="hidden md:inline">
              {reorderMode ? t.keyboard.reorderDone : t.keyboard.reorderStart}
            </span>
          </button>
        )}
      </div>

      {inEditKit && editingKit && (
        <div className="border-b border-neutral-200 bg-matcha-50/40 px-3 py-1.5 text-[11px] text-matcha-800">
          <span className="font-medium">{editingKit.name}</span>
          <span className="mx-2 text-matcha-400">·</span>
          <span>{t.keyboard.kitEditHint}</span>
        </div>
      )}

      {openKey === '__search' && !reorderMode && !inEditKit && (
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
                placeholder={t.keyboard.searchPlaceholder}
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-8 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-matcha-400 focus:outline-none focus:ring-1 focus:ring-matcha-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  title={t.keyboard.clearTooltip}
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {!q ? (
              <p className="text-xs text-neutral-500">{t.keyboard.searchHint}</p>
            ) : searchResults.length === 0 ? (
              <p className="text-xs text-neutral-500">{t.keyboard.notFound}</p>
            ) : (
              <>
                <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">
                  {t.keyboard.resultsCount(searchResults.length)}
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

      {activeGroup && !reorderMode && !inEditKit && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-neutral-200 bg-white shadow-lg">
          <div className="mx-auto max-w-4xl p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                {t.keyboard.groups[activeGroup.title] ?? activeGroup.title}
              </p>
              <p className="text-[10px] text-neutral-400">
                {t.keyboard.hintPin}
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
