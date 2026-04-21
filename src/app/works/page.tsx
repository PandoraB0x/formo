'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Sparkles, Trash2, LogOut, Search, FileText } from 'lucide-react';
import { listSavedBoards, loadSavedBoard, deleteSavedBoard } from '@/lib/storage';
import { useAuth, logout } from '@/lib/auth';
import { useBoardStore } from '@/store/useBoardStore';
import { useLang } from '@/i18n/useLang';
import type { Dict } from '@/i18n/dict';
import type { Lang } from '@/i18n/types';

type Entry = ReturnType<typeof listSavedBoards>[number];

const LOCALE_MAP: Record<Lang, string> = { et: 'et-EE', en: 'en-US', ru: 'ru-RU' };

export default function WorksPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { lang, t } = useLang();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (user) setEntries(listSavedBoards());
  }, [user]);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.trim().toLowerCase();
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  function handleOpen(id: string) {
    const board = loadSavedBoard(id);
    if (!board) return;
    useBoardStore.getState().loadBoard(board);
    router.push('/app');
  }

  function handleDelete(id: string) {
    if (!confirm(t.works.confirmDelete)) return;
    deleteSavedBoard(id);
    setEntries(listSavedBoards());
  }

  function handleNew() {
    useBoardStore.getState().resetBoard();
    router.push('/app');
  }

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        {t.works.loading}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf5]">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-matcha-900"
            aria-label={t.works.backToHome}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-matcha-500 text-white">
              <Sparkles size={16} strokeWidth={2.4} />
            </span>
            <span className="text-base font-bold tracking-tight">Formo</span>
          </Link>

          <div className="relative ml-4 hidden flex-1 md:block">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.works.search}
              className="w-full max-w-md rounded-full border border-neutral-200 bg-neutral-50 py-1.5 pl-9 pr-3 text-sm outline-none focus:border-matcha-400 focus:bg-white"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-neutral-500 sm:inline">{user.name}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-600 transition hover:border-matcha-300 hover:text-matcha-900"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t.nav.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-matcha-700"
            >
              <ArrowLeft size={12} />
              {t.works.backHome}
            </Link>
            <h1 className="text-2xl font-bold text-matcha-900 md:text-3xl">
              {t.works.myWorks}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {entries.length === 0 ? t.works.empty : t.works.savedCount(entries.length)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNew}
            className="flex items-center gap-2 rounded-full bg-matcha-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-matcha-700"
          >
            <Plus size={16} />
            {t.works.newBoard}
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onNew={handleNew} hasFilter={!!query.trim()} t={t} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <WorkCard
                key={entry.id}
                entry={entry}
                onOpen={() => handleOpen(entry.id)}
                onDelete={() => handleDelete(entry.id)}
                t={t}
                lang={lang}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function WorkCard({
  entry,
  onOpen,
  onDelete,
  t,
  lang,
}: {
  entry: Entry;
  onOpen: () => void;
  onDelete: () => void;
  t: Dict;
  lang: Lang;
}) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-matcha-300 hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        title={`${t.works.open} ${entry.name}`}
      >
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-matcha-50 to-neutral-100">
          {entry.thumbnail ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={entry.thumbnail}
              alt={entry.name}
              className="absolute inset-0 h-full w-full object-contain p-3"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-matcha-300">
              <FileText size={40} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-matcha-900">
              {entry.name}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {formatDate(entry.updatedAt, lang)}
            </p>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title={t.works.delete}
        className="absolute right-2 top-2 hidden rounded-lg bg-white/90 p-1.5 text-red-600 shadow ring-1 ring-neutral-200 transition group-hover:block hover:bg-white"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

function EmptyState({ onNew, hasFilter, t }: { onNew: () => void; hasFilter: boolean; t: Dict }) {
  if (hasFilter) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 py-14 text-center">
        <p className="text-sm text-neutral-500">{t.works.notFound}</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-dashed border-matcha-200 bg-white/50 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-matcha-100 text-matcha-700">
        <FileText size={24} />
      </div>
      <p className="text-base font-semibold text-matcha-900">{t.works.emptyTitle}</p>
      <p className="mt-1 text-sm text-neutral-500">{t.works.emptyHint}</p>
      <button
        type="button"
        onClick={onNew}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-matcha-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-matcha-700"
      >
        <Plus size={14} />
        {t.works.emptyCta}
      </button>
    </div>
  );
}

function formatDate(iso: string, lang: Lang): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(LOCALE_MAP[lang], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
