import type {
  Board,
  BoardElement,
  Page,
  PageCanvas,
} from '@/types/element';
import { getPagePixels, type PageSize, type Orientation } from '@/lib/pageSize';

export const HISTORY_LIMIT = 40;

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

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

export function newBoard(): Board {
  const now = new Date().toISOString();
  const page = makePage();
  return {
    id: `board_${Date.now().toString(36)}`,
    name: 'Uus tahvel',
    version: 2,
    createdAt: now,
    updatedAt: now,
    fontFamily: 'math',
    activePageId: page.id,
    pages: [page],
  };
}

export function migrateBoard(raw: unknown): Board {
  if (!raw || typeof raw !== 'object') return newBoard();
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.pages) && typeof r.activePageId === 'string') {
    return raw as Board;
  }
  const legacy = raw as {
    id?: string;
    name?: string;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
    canvas?: {
      width?: number;
      height?: number;
      background?: 'transparent' | 'white';
      fontFamily?: string;
      pageSize?: PageSize;
      orientation?: Orientation;
    };
    elements?: BoardElement[];
  };
  const lc = legacy.canvas ?? {};
  const w = lc.width ?? getPagePixels('A4', 'portrait').w;
  const h = lc.height ?? getPagePixels('A4', 'portrait').h;
  const pageSize = lc.pageSize ?? 'A4';
  const orientation = lc.orientation ?? (w >= h ? 'landscape' : 'portrait');
  const page: Page = {
    id: uid('page'),
    canvas: {
      width: w,
      height: h,
      background: lc.background ?? 'transparent',
      pageSize,
      orientation,
    },
    elements: legacy.elements ?? [],
  };
  const now = new Date().toISOString();
  return {
    id: legacy.id ?? `board_${Date.now().toString(36)}`,
    name: legacy.name ?? 'Uus tahvel',
    version: 2,
    createdAt: legacy.createdAt ?? now,
    updatedAt: legacy.updatedAt ?? now,
    fontFamily: lc.fontFamily ?? 'math',
    activePageId: page.id,
    pages: [page],
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
