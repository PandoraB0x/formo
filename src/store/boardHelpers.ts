import type { Board, BoardElement, Page, PageCanvas } from '@/types/element';
import { getPagePixels } from '@/lib/pageSize';
import { uid, newBoard, migrateBoard } from '@/lib/migrations';

export { uid, newBoard, migrateBoard };

export const HISTORY_LIMIT = 40;

export function makePage(canvas?: Partial<PageCanvas>): Page {
  const defaults = getPagePixels('A4', 'portrait');
  return {
    id: uid('page'),
    canvas: {
      width: canvas?.width ?? defaults.w,
      height: canvas?.height ?? defaults.h,
      background: canvas?.background ?? 'transparent',
      pageSize: canvas?.pageSize ?? 'A4',
      orientation: canvas?.orientation ?? 'portrait',
    },
    elements: [],
  };
}

export function getActivePage(board: Board): Page {
  return board.pages.find((p) => p.id === board.activePageId) ?? board.pages[0];
}

export function withActivePage(board: Board, patch: Partial<Page>): Board {
  const pages = board.pages.map((p) =>
    p.id === board.activePageId ? { ...p, ...patch } : p,
  );
  return { ...board, pages, updatedAt: new Date().toISOString() };
}

export function withActiveElements(board: Board, elements: BoardElement[]): Board {
  return withActivePage(board, { elements });
}

export function withActiveCanvas(board: Board, patch: Partial<PageCanvas>): Board {
  const active = getActivePage(board);
  return withActivePage(board, { canvas: { ...active.canvas, ...patch } });
}
