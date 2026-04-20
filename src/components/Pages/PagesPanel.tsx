'use client';

import { Plus, Copy, Trash2 } from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';
import type { Page } from '@/types/element';

export default function PagesPanel() {
  const pages = useBoardStore((s) => s.board.pages);
  const activePageId = useBoardStore((s) => s.board.activePageId);
  const addPage = useBoardStore((s) => s.addPage);
  const deletePage = useBoardStore((s) => s.deletePage);
  const setActivePage = useBoardStore((s) => s.setActivePage);
  const duplicatePage = useBoardStore((s) => s.duplicatePage);

  return (
    <aside className="flex h-full w-40 flex-col border-l border-neutral-200 bg-neutral-50">
      <div className="flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        <span>Lehed</span>
        <span className="tabular-nums text-neutral-400">{pages.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <ul className="flex flex-col gap-2">
          {pages.map((page, idx) => (
            <PageCard
              key={page.id}
              page={page}
              index={idx}
              active={page.id === activePageId}
              canDelete={pages.length > 1}
              onSelect={() => setActivePage(page.id)}
              onDuplicate={() => duplicatePage(page.id)}
              onDelete={() => deletePage(page.id)}
            />
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={addPage}
        className="m-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 bg-white py-2 text-xs font-medium text-neutral-600 transition hover:border-neutral-500 hover:text-neutral-900"
      >
        <Plus size={14} />
        Lisa leht
      </button>
    </aside>
  );
}

function PageCard({
  page,
  index,
  active,
  canDelete,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  page: Page;
  index: number;
  active: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const aspect = page.canvas.width / page.canvas.height;
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        className={`block w-full overflow-hidden rounded-lg border transition ${
          active
            ? 'border-neutral-900 ring-2 ring-neutral-900/20'
            : 'border-neutral-200 hover:border-neutral-400'
        }`}
      >
        <div className="relative w-full bg-white" style={{ aspectRatio: aspect }}>
          {page.thumbnail ? (
            <img
              src={page.thumbnail}
              alt={`Leht ${index + 1}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-300">
              Tühi leht
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-2 py-1 text-[10px] font-medium text-neutral-600">
          <span>Leht {index + 1}</span>
          <span className="uppercase text-neutral-400">{page.canvas.pageSize}</span>
        </div>
      </button>

      <div className="pointer-events-none absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Dubleeri leht"
          className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-neutral-700 shadow ring-1 ring-neutral-200 hover:bg-white"
        >
          <Copy size={12} />
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Kustuta leht"
            className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-red-600 shadow ring-1 ring-neutral-200 hover:bg-white"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </li>
  );
}
