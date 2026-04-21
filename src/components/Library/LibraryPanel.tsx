'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import type Konva from 'konva';
import { useBoardStore } from '@/store/useBoardStore';
import { listSnippets, deleteSnippet } from '@/lib/snippetStorage';
import { useLang } from '@/i18n/useLang';
import type { Snippet } from '@/types/snippet';

interface Props {
  open: boolean;
  onClose: () => void;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export default function LibraryPanel({ open, onClose, stageRef }: Props) {
  const { t } = useLang();
  const insertSnippet = useBoardStore((s) => s.insertSnippet);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSnippets(listSnippets());
  }, [open]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    snippets.forEach((s) => set.add(s.category || t.snippetDialog.defaultCategory));
    return Array.from(set).sort();
  }, [snippets, t.snippetDialog.defaultCategory]);

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (!query.trim()) return true;
      return s.name.toLowerCase().includes(query.trim().toLowerCase());
    });
  }, [snippets, query, activeCategory]);

  function handleInsert(snippet: Snippet) {
    const stage = stageRef.current;
    let worldPosition = { x: 200, y: 200 };
    if (stage) {
      const sc = stage.scaleX() || 1;
      worldPosition = {
        x: (stage.width() / 2 - stage.x()) / sc - snippet.bboxWidth / 2,
        y: (stage.height() / 2 - stage.y()) / sc - snippet.bboxHeight / 2,
      };
    }
    insertSnippet(snippet, worldPosition);
    onClose();
  }

  function handleDelete(id: string) {
    if (!confirm(t.library.confirmDelete)) return;
    deleteSnippet(id);
    setSnippets(listSnippets());
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-10"
      onClick={onClose}
    >
      <div
        className="flex h-[80vh] w-[760px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <h2 className="text-lg font-semibold">{t.library.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label={t.library.close}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.library.search}
              className="w-full rounded border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-matcha-400 focus:bg-white"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            <CatPill
              label={t.library.all}
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            />
            {categories.map((c) => (
              <CatPill
                key={c}
                label={c}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              {snippets.length === 0 ? t.library.empty : t.library.notFound}
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-3">
              {filtered.map((s) => (
                <SnippetCard
                  key={s.id}
                  snippet={s}
                  insertLabel={t.library.insert}
                  deleteLabel={t.library.delete}
                  elementsLabel={t.library.elementsCount}
                  onInsert={() => handleInsert(s)}
                  onDelete={() => handleDelete(s.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function CatPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-neutral-900 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      }`}
    >
      {label}
    </button>
  );
}

function SnippetCard({
  snippet,
  insertLabel,
  deleteLabel,
  elementsLabel,
  onInsert,
  onDelete,
}: {
  snippet: Snippet;
  insertLabel: string;
  deleteLabel: string;
  elementsLabel: (n: number) => string;
  onInsert: () => void;
  onDelete: () => void;
}) {
  const aspect = snippet.bboxWidth && snippet.bboxHeight ? snippet.bboxWidth / snippet.bboxHeight : 1;
  return (
    <li className="group relative overflow-hidden rounded-lg border border-neutral-200 transition hover:border-matcha-400 hover:shadow">
      <button
        type="button"
        onClick={onInsert}
        className="block w-full bg-white"
        title={insertLabel}
      >
        <div
          className="relative w-full bg-neutral-50"
          style={{ aspectRatio: Math.max(0.3, Math.min(aspect, 4)) }}
        >
          {snippet.thumbnail ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={snippet.thumbnail}
              alt={snippet.name}
              className="absolute inset-0 h-full w-full object-contain p-2"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
              {elementsLabel(snippet.elements.length)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 px-2 py-1 text-xs">
          <span className="truncate font-medium text-neutral-800">{snippet.name}</span>
          <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
            {snippet.category}
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title={deleteLabel}
        className="absolute right-1 top-1 hidden rounded bg-white/90 p-1 text-red-600 shadow ring-1 ring-neutral-200 group-hover:block hover:bg-white"
      >
        <Trash2 size={12} />
      </button>
    </li>
  );
}
