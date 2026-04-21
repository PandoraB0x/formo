import type { Board, BoardElement, Page, PageCanvas } from '@/types/element';
import { getPagePixels, type PageSize, type Orientation } from '@/lib/pageSize';

export const CURRENT_BOARD_VERSION = 2;

type Migrator = (prev: Record<string, unknown>) => Record<string, unknown>;

const MIGRATIONS: Record<number, Migrator> = {
  1: migrateV1ToV2,
};

export function migrateBoard(raw: unknown): Board {
  if (!raw || typeof raw !== 'object') return newBoard();
  let current = raw as Record<string, unknown>;
  let version = detectVersion(current);

  while (version < CURRENT_BOARD_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) break;
    current = step(current);
    version = typeof current.version === 'number' ? current.version : version + 1;
  }

  return finalize(current);
}

function detectVersion(b: Record<string, unknown>): number {
  if (typeof b.version === 'number') return b.version;
  if (Array.isArray(b.pages) && typeof b.activePageId === 'string') return 2;
  return 1;
}

function migrateV1ToV2(prev: Record<string, unknown>): Record<string, unknown> {
  const lc = (prev.canvas as Partial<PageCanvas> & { fontFamily?: string }) ?? {};
  const defaults = getPagePixels('A4', 'portrait');
  const w = (lc.width as number | undefined) ?? defaults.w;
  const h = (lc.height as number | undefined) ?? defaults.h;
  const pageSize: PageSize = (lc.pageSize as PageSize | undefined) ?? 'A4';
  const orientation: Orientation =
    (lc.orientation as Orientation | undefined) ?? (w >= h ? 'landscape' : 'portrait');
  const page: Page = {
    id: uid('page'),
    canvas: {
      width: w,
      height: h,
      background: lc.background ?? 'transparent',
      pageSize,
      orientation,
    },
    elements: (prev.elements as BoardElement[] | undefined) ?? [],
  };
  const now = new Date().toISOString();
  return {
    id: (prev.id as string | undefined) ?? `board_${Date.now().toString(36)}`,
    name: (prev.name as string | undefined) ?? 'Uus tahvel',
    version: 2,
    createdAt: (prev.createdAt as string | undefined) ?? now,
    updatedAt: (prev.updatedAt as string | undefined) ?? now,
    fontFamily: lc.fontFamily ?? 'math',
    activePageId: page.id,
    pages: [page],
  };
}

function finalize(b: Record<string, unknown>): Board {
  if (
    Array.isArray(b.pages) &&
    typeof b.activePageId === 'string' &&
    typeof b.id === 'string' &&
    typeof b.name === 'string'
  ) {
    return { ...b, version: CURRENT_BOARD_VERSION } as Board;
  }
  return newBoard();
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function newBoard(): Board {
  const now = new Date().toISOString();
  const defaults = getPagePixels('A4', 'portrait');
  const page: Page = {
    id: uid('page'),
    canvas: {
      width: defaults.w,
      height: defaults.h,
      background: 'transparent',
      pageSize: 'A4',
      orientation: 'portrait',
    },
    elements: [],
  };
  return {
    id: `board_${Date.now().toString(36)}`,
    name: 'Uus tahvel',
    version: CURRENT_BOARD_VERSION,
    createdAt: now,
    updatedAt: now,
    fontFamily: 'math',
    activePageId: page.id,
    pages: [page],
  };
}
