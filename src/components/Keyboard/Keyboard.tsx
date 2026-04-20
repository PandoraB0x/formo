'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, Clock, Star, ChevronDown, GripVertical } from 'lucide-react';
import type { KeyboardKey } from '@/types/element';
import { KEYBOARD_GROUPS, flattenKeys, keyId } from './keyboardConfig';
import { useBoardStore } from '@/store/useBoardStore';
import { addRecentKey, getRecentKeys, clearRecentKeys } from '@/lib/recentKeys';
import { getKeyboardPrefs, saveKeyboardPrefs, type KeyboardPrefs } from '@/lib/keyboardPrefs';
import ShapePreviewSVG from './ShapePreviewSVG';

const FAVORITES_TITLE = 'Lemmikud';

export default function Keyboard() {
  const addElement = useBoardStore((s) => s.addElement);
  const [recent, setRecent] = useState<KeyboardKey[]>([]);
  const [query, setQuery] = useState('');
  const [prefs, setPrefs] = useState<KeyboardPrefs>({ order: [], collapsed: [], favorites: [] });
  const [dragTitle, setDragTitle] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    setRecent(getRecentKeys());
    setPrefs(getKeyboardPrefs());
  }, []);

  function updatePrefs(next: KeyboardPrefs) {
    setPrefs(next);
    saveKeyboardPrefs(next);
  }

  const handlePress = (key: KeyboardKey) => {
    addElement(key.type, key.content);
    setRecent(addRecentKey(key));
  };

  const toggleFavorite = (key: KeyboardKey) => {
    const id = keyId(key);
    const favorites = prefs.favorites.includes(id)
      ? prefs.favorites.filter((x) => x !== id)
      : [...prefs.favorites, id];
    updatePrefs({ ...prefs, favorites });
  };

  const toggleCollapsed = (title: string) => {
    const collapsed = prefs.collapsed.includes(title)
      ? prefs.collapsed.filter((t) => t !== title)
      : [...prefs.collapsed, title];
    updatePrefs({ ...prefs, collapsed });
  };

  const favoriteKeys = useMemo(() => {
    if (!prefs.favorites.length) return [];
    const all = flattenKeys();
    const byId = new Map(all.map((k) => [keyId(k), k]));
    return prefs.favorites
      .map((id) => byId.get(id))
      .filter((k): k is KeyboardKey => Boolean(k));
  }, [prefs.favorites]);

  const orderedGroups = useMemo(() => {
    const groups = [...KEYBOARD_GROUPS];
    if (!prefs.order.length) return groups;
    const titleToGroup = new Map(groups.map((g) => [g.title, g]));
    const result: typeof groups = [];
    const seen = new Set<string>();
    for (const title of prefs.order) {
      const g = titleToGroup.get(title);
      if (g && !seen.has(title)) {
        result.push(g);
        seen.add(title);
      }
    }
    for (const g of groups) {
      if (!seen.has(g.title)) result.push(g);
    }
    return result;
  }, [prefs.order]);

  const allTitlesOrder = useMemo(() => orderedGroups.map((g) => g.title), [orderedGroups]);

  const handleDragStart = (title: string) => setDragTitle(title);
  const handleDragOver = (e: React.DragEvent, title: string) => {
    if (!dragTitle || dragTitle === title) return;
    e.preventDefault();
    setDropTarget(title);
  };
  const handleDrop = (target: string) => {
    if (!dragTitle || dragTitle === target) {
      setDragTitle(null);
      setDropTarget(null);
      return;
    }
    const current = [...allTitlesOrder];
    const from = current.indexOf(dragTitle);
    const to = current.indexOf(target);
    if (from < 0 || to < 0) return;
    current.splice(from, 1);
    current.splice(to, 0, dragTitle);
    updatePrefs({ ...prefs, order: current });
    setDragTitle(null);
    setDropTarget(null);
  };

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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white p-2">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Otsi sümbolit (sin, alfa, →)"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-1.5 pl-7 pr-7 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-matcha-400 focus:outline-none focus:ring-1 focus:ring-matcha-200"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              title="Tühjenda"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5">
        {q ? (
          <section>
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
              Otsingu tulemused ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <p className="text-xs text-neutral-500">Midagi ei leitud</p>
            ) : (
              <KeyGrid
                keys={searchResults}
                onPress={handlePress}
                onToggleFavorite={toggleFavorite}
                favorites={prefs.favorites}
              />
            )}
          </section>
        ) : (
          <>
            {favoriteKeys.length > 0 && (
              <CategoryBlock
                title={FAVORITES_TITLE}
                icon={<Star size={11} className="fill-amber-400 text-amber-400" />}
                collapsed={prefs.collapsed.includes(FAVORITES_TITLE)}
                onToggleCollapsed={() => toggleCollapsed(FAVORITES_TITLE)}
                draggable={false}
              >
                <KeyGrid
                  keys={favoriteKeys}
                  onPress={handlePress}
                  onToggleFavorite={toggleFavorite}
                  favorites={prefs.favorites}
                />
              </CategoryBlock>
            )}

            {recent.length > 0 && (
              <section className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                    <Clock size={11} />
                    Hiljuti kasutatud
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      clearRecentKeys();
                      setRecent([]);
                    }}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700"
                    title="Tühjenda"
                  >
                    tühjenda
                  </button>
                </div>
                <KeyGrid
                  keys={recent}
                  onPress={handlePress}
                  onToggleFavorite={toggleFavorite}
                  favorites={prefs.favorites}
                />
              </section>
            )}

            {orderedGroups.map((group) => {
              const collapsed = prefs.collapsed.includes(group.title);
              const isDragging = dragTitle === group.title;
              const isDropTarget = dropTarget === group.title;
              return (
                <div
                  key={group.title}
                  onDragOver={(e) => handleDragOver(e, group.title)}
                  onDrop={() => handleDrop(group.title)}
                  onDragLeave={() => setDropTarget((t) => (t === group.title ? null : t))}
                  className={
                    isDropTarget ? 'rounded-md ring-2 ring-matcha-400 ring-offset-1' : ''
                  }
                >
                  <CategoryBlock
                    title={group.title}
                    collapsed={collapsed}
                    onToggleCollapsed={() => toggleCollapsed(group.title)}
                    draggable
                    onDragStart={() => handleDragStart(group.title)}
                    onDragEnd={() => {
                      setDragTitle(null);
                      setDropTarget(null);
                    }}
                    dim={isDragging}
                  >
                    <KeyGrid
                      keys={group.keys}
                      onPress={handlePress}
                      onToggleFavorite={toggleFavorite}
                      favorites={prefs.favorites}
                    />
                  </CategoryBlock>
                </div>
              );
            })}
          </>
        )}
      </div>

      <p className="border-t border-neutral-200 px-3 py-2 text-[10px] text-neutral-400">
        Topeltklõps tühjal kohal — arv või tekst. Parem klõps sümbolil — lemmik. Lohista pealkirja — järjesta.
      </p>
    </aside>
  );
}

function CategoryBlock({
  title,
  icon,
  collapsed,
  onToggleCollapsed,
  draggable,
  onDragStart,
  onDragEnd,
  dim,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  dim?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`mb-3 ${dim ? 'opacity-40' : ''}`}>
      <div
        draggable={draggable}
        onDragStart={(e) => {
          if (!draggable) return;
          e.dataTransfer.effectAllowed = 'move';
          onDragStart?.();
        }}
        onDragEnd={onDragEnd}
        className={`mb-1.5 flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500 hover:bg-neutral-100 ${
          draggable ? 'active:cursor-grabbing' : ''
        }`}
        onClick={onToggleCollapsed}
        title={collapsed ? 'Ava' : 'Sulge'}
      >
        {draggable && <GripVertical size={11} className="text-neutral-300" />}
        {icon}
        <span className="flex-1 truncate">{title}</span>
        <ChevronDown
          size={12}
          className={`text-neutral-400 transition ${collapsed ? '-rotate-90' : ''}`}
        />
      </div>
      {!collapsed && children}
    </section>
  );
}

function KeyGrid({
  keys,
  onPress,
  onToggleFavorite,
  favorites,
}: {
  keys: KeyboardKey[];
  onPress: (k: KeyboardKey) => void;
  onToggleFavorite: (k: KeyboardKey) => void;
  favorites: string[];
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {keys.map((key) => {
        const id = keyId(key);
        const isFavorite = favorites.includes(id);
        return (
          <button
            key={id + key.label}
            type="button"
            onClick={() => onPress(key)}
            onContextMenu={(e) => {
              e.preventDefault();
              onToggleFavorite(key);
            }}
            title={
              (key.hint ? `${key.label} — ${key.hint}` : key.label) +
              '  (parem klõps — lemmik)'
            }
            className={`relative flex h-10 items-center justify-center overflow-hidden rounded-md border bg-white px-1 text-sm font-medium text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow active:translate-y-0 ${
              isFavorite
                ? 'border-amber-300 hover:border-amber-400'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            {key.type === 'shape' && typeof key.content === 'string' ? (
              <ShapePreviewSVG
                shapeId={key.content}
                className="h-7 w-7 text-matcha-700"
              />
            ) : (
              <span className="truncate">{key.label}</span>
            )}
            {isFavorite && (
              <Star
                size={8}
                className="absolute right-1 top-1 fill-amber-400 text-amber-400"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
