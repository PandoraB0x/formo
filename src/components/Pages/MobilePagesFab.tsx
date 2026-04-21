'use client';

import { useState } from 'react';
import { Layers, Plus, Copy, Trash2, X } from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';
import { useLang } from '@/i18n/useLang';

export default function MobilePagesFab() {
  const { t } = useLang();
  const pages = useBoardStore((s) => s.board.pages);
  const activePageId = useBoardStore((s) => s.board.activePageId);
  const addPage = useBoardStore((s) => s.addPage);
  const deletePage = useBoardStore((s) => s.deletePage);
  const setActivePage = useBoardStore((s) => s.setActivePage);
  const duplicatePage = useBoardStore((s) => s.duplicatePage);
  const [open, setOpen] = useState(false);

  const activeIdx = pages.findIndex((p) => p.id === activePageId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-neutral-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur sm:hidden"
        title={t.pages.pages}
      >
        <Layers size={14} />
        <span className="tabular-nums">
          {Math.max(activeIdx + 1, 1)} / {pages.length}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="mt-auto max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-800">{t.pages.pages}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {pages.map((page, idx) => {
                const active = page.id === activePageId;
                return (
                  <li key={page.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage(page.id);
                        setOpen(false);
                      }}
                      className={`flex flex-1 items-center gap-3 rounded-lg border p-2 text-left text-sm transition ${
                        active
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div
                        className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-neutral-200 bg-white"
                      >
                        {page.thumbnail ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={page.thumbnail}
                            alt={`${t.pages.page} ${idx + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[9px] text-neutral-300">{t.pages.emptyPage}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-800">
                          {t.pages.page} {idx + 1}
                        </span>
                        <span className="text-[11px] uppercase text-neutral-400">
                          {page.canvas.pageSize}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePage(page.id)}
                      className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                      title={t.pages.duplicatePage}
                    >
                      <Copy size={16} />
                    </button>
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deletePage(page.id)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        title={t.pages.deletePage}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => addPage()}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-500"
            >
              <Plus size={16} />
              {t.pages.addPage}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
