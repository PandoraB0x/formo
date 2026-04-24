'use client';

import { useBoardStore } from '@/store/useBoardStore';
import { useLang } from '@/i18n/useLang';

export default function WorksheetPageSwitcher() {
  const { t } = useLang();
  const pages = useBoardStore((s) => s.board.pages);
  const activePageId = useBoardStore((s) => s.board.activePageId);
  const setActivePage = useBoardStore((s) => s.setActivePage);

  if (pages.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 border-b border-neutral-200 bg-white/80 px-3 py-1.5 text-xs text-neutral-600 backdrop-blur">
      <span className="mr-1 text-neutral-500">{t.worksheet.pagesLabel}</span>
      {pages.map((p, i) => {
        const isActive = p.id === activePageId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePage(p.id)}
            className={
              isActive
                ? 'min-w-7 rounded-md bg-matcha-600 px-2.5 py-1 text-white'
                : 'min-w-7 rounded-md border border-neutral-200 bg-white px-2.5 py-1 hover:bg-neutral-50'
            }
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
