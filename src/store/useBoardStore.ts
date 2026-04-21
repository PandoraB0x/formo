'use client';

import { create } from 'zustand';
import type {
  Board,
  BoardElement,
  ElementType,
  ElementContent,
  Page,
} from '@/types/element';
import { makeElement, duplicateElement } from '@/lib/elementFactory';
import type { Snippet, SnippetElement } from '@/types/snippet';
import { SIZE_STEPS, ROTATION_STEP, currentSizeIndex, snapRotation } from '@/lib/constants';
import { getPagePixels, type PageSize, type Orientation } from '@/lib/pageSize';
import {
  HISTORY_LIMIT,
  uid,
  makePage,
  newBoard,
  migrateBoard,
  getActivePage,
  withActiveElements,
  withActiveCanvas,
} from './boardHelpers';

export { migrateBoard, getActivePage };

interface BoardState {
  board: Board;
  selectedIds: string[];
  past: Board[];
  future: Board[];

  addElement: (type: ElementType, content: ElementContent, viewport?: { x: number; y: number }) => void;
  deleteElement: (id: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  selectElement: (id: string | null) => void;
  setSelection: (ids: string[]) => void;
  toggleInSelection: (id: string) => void;
  resizeStep: (id: string, delta: -1 | 1) => void;
  rotateStep: (id: string, delta: -1 | 1) => void;
  setColor: (id: string, color: string) => void;
  setColorMany: (ids: string[], color: string) => void;

  beginHistory: () => void;
  moveElementSilent: (id: string, x: number, y: number) => void;
  moveManySilent: (deltas: { id: string; x: number; y: number }[]) => void;

  loadBoard: (board: Board) => void;
  resetBoard: () => void;
  renameBoard: (name: string) => void;
  setBackground: (bg: 'transparent' | 'white') => void;
  setFontFamily: (id: string) => void;
  setPageSize: (size: PageSize) => void;
  setOrientation: (o: Orientation) => void;

  addPage: () => void;
  deletePage: (id: string) => void;
  setActivePage: (id: string) => void;
  reorderPage: (from: number, to: number) => void;
  setPageThumbnail: (id: string, thumbnail: string) => void;
  duplicatePage: (id: string) => void;

  buildSnippetFromSelection: (name: string, category: string) => Snippet | null;
  insertSnippet: (snippet: Snippet, worldPosition: { x: number; y: number }) => void;

  undo: () => void;
  redo: () => void;
}

function pushHistory(state: BoardState): Pick<BoardState, 'past' | 'future'> {
  const past = [...state.past, state.board].slice(-HISTORY_LIMIT);
  return { past, future: [] };
}

function activeElements(state: BoardState): BoardElement[] {
  return getActivePage(state.board).elements;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: newBoard(),
  selectedIds: [],
  past: [],
  future: [],

  addElement: (type, content, viewport) => {
    const state = get();
    const els = activeElements(state);
    const offset = els.length * 6;
    const pos = viewport
      ? { x: viewport.x, y: viewport.y }
      : { x: 300 + offset, y: 300 + offset };
    const maxZ = els.reduce((m, e) => Math.max(m, e.zIndex), 0);
    const el = makeElement(type, content, pos, maxZ + 1);
    set({
      ...pushHistory(state),
      board: withActiveElements(state.board, [...els, el]),
      selectedIds: [el.id],
    });
  },

  deleteElement: (id) => {
    const state = get();
    const els = activeElements(state).filter((e) => e.id !== id);
    set({
      ...pushHistory(state),
      board: withActiveElements(state.board, els),
      selectedIds: state.selectedIds.filter((x) => x !== id),
    });
  },

  deleteSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;
    const toDelete = new Set(state.selectedIds);
    const els = activeElements(state).filter((e) => !toDelete.has(e.id));
    set({
      ...pushHistory(state),
      board: withActiveElements(state.board, els),
      selectedIds: [],
    });
  },

  duplicateSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;
    const selSet = new Set(state.selectedIds);
    const all = activeElements(state);
    const originals = all.filter((e) => selSet.has(e.id));
    if (originals.length === 0) return;
    let maxZ = all.reduce((m, e) => Math.max(m, e.zIndex), 0);
    const copies = originals.map((o) => {
      maxZ += 1;
      return duplicateElement(o, maxZ);
    });
    const newIds = copies.map((c) => c.id);
    set({
      ...pushHistory(state),
      board: withActiveElements(state.board, [...all, ...copies]),
      selectedIds: newIds,
    });
  },

  selectElement: (id) => set({ selectedIds: id ? [id] : [] }),

  setSelection: (ids) => set({ selectedIds: ids }),

  toggleInSelection: (id) => {
    const state = get();
    const has = state.selectedIds.includes(id);
    const next = has ? state.selectedIds.filter((x) => x !== id) : [...state.selectedIds, id];
    set({ selectedIds: next });
  },

  resizeStep: (id, delta) => {
    const state = get();
    const all = activeElements(state);
    const el = all.find((e) => e.id === id);
    if (!el) return;
    const idx = currentSizeIndex(el.fontSize);
    const nextIdx = Math.max(0, Math.min(SIZE_STEPS.length - 1, idx + delta));
    if (nextIdx === idx) return;
    const newFontSize = SIZE_STEPS[nextIdx];
    const ratio = newFontSize / el.fontSize;
    const els = all.map((e) => {
      if (e.id !== id) return e;
      if (e.type === 'line') {
        return { ...e, fontSize: newFontSize, width: e.width * ratio };
      }
      return { ...e, fontSize: newFontSize, width: e.width * ratio, height: e.height * ratio };
    });
    set({ ...pushHistory(state), board: withActiveElements(state.board, els) });
  },

  rotateStep: (id, delta) => {
    const state = get();
    const all = activeElements(state);
    const el = all.find((e) => e.id === id);
    if (!el) return;
    const current = snapRotation(el.rotation || 0);
    const next = ((current + delta * ROTATION_STEP) % 360 + 360) % 360;
    const els = all.map((e) => (e.id === id ? { ...e, rotation: next } : e));
    set({ ...pushHistory(state), board: withActiveElements(state.board, els) });
  },

  setColor: (id, color) => {
    const state = get();
    const all = activeElements(state);
    const el = all.find((e) => e.id === id);
    if (!el || el.color === color) return;
    const els = all.map((e) => (e.id === id ? { ...e, color } : e));
    set({ ...pushHistory(state), board: withActiveElements(state.board, els) });
  },

  setColorMany: (ids, color) => {
    const state = get();
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const els = activeElements(state).map((e) => (idSet.has(e.id) ? { ...e, color } : e));
    set({ ...pushHistory(state), board: withActiveElements(state.board, els) });
  },

  beginHistory: () => {
    const state = get();
    set(pushHistory(state));
  },

  moveElementSilent: (id, x, y) => {
    const state = get();
    const els = activeElements(state).map((e) => (e.id === id ? { ...e, x, y } : e));
    const pages = state.board.pages.map((p) =>
      p.id === state.board.activePageId ? { ...p, elements: els } : p,
    );
    set({ board: { ...state.board, pages } });
  },

  moveManySilent: (deltas) => {
    const state = get();
    const map = new Map(deltas.map((d) => [d.id, { x: d.x, y: d.y }]));
    const els = activeElements(state).map((e) => {
      const d = map.get(e.id);
      return d ? { ...e, x: d.x, y: d.y } : e;
    });
    const pages = state.board.pages.map((p) =>
      p.id === state.board.activePageId ? { ...p, elements: els } : p,
    );
    set({ board: { ...state.board, pages } });
  },

  loadBoard: (board) =>
    set({ board: migrateBoard(board), selectedIds: [], past: [], future: [] }),

  resetBoard: () =>
    set({ board: newBoard(), selectedIds: [], past: [], future: [] }),

  renameBoard: (name) => {
    const state = get();
    set({ board: { ...state.board, name, updatedAt: new Date().toISOString() } });
  },

  setBackground: (background) => {
    const state = get();
    set({ ...pushHistory(state), board: withActiveCanvas(state.board, { background }) });
  },

  setFontFamily: (id) => {
    const state = get();
    if (state.board.fontFamily === id) return;
    set({
      ...pushHistory(state),
      board: { ...state.board, fontFamily: id, updatedAt: new Date().toISOString() },
    });
  },

  setPageSize: (size) => {
    const state = get();
    const active = getActivePage(state.board);
    if (active.canvas.pageSize === size) return;
    const orientation = active.canvas.orientation;
    const px = getPagePixels(size, orientation, {
      w: active.canvas.width,
      h: active.canvas.height,
    });
    set({
      ...pushHistory(state),
      board: withActiveCanvas(state.board, {
        pageSize: size,
        width: px.w,
        height: px.h,
      }),
    });
  },

  setOrientation: (orientation) => {
    const state = get();
    const active = getActivePage(state.board);
    if (active.canvas.orientation === orientation) return;
    const px = getPagePixels(active.canvas.pageSize, orientation, {
      w: active.canvas.height,
      h: active.canvas.width,
    });
    set({
      ...pushHistory(state),
      board: withActiveCanvas(state.board, {
        orientation,
        width: px.w,
        height: px.h,
      }),
    });
  },

  addPage: () => {
    const state = get();
    const active = getActivePage(state.board);
    const page = makePage(active.canvas);
    set({
      ...pushHistory(state),
      board: {
        ...state.board,
        pages: [...state.board.pages, page],
        activePageId: page.id,
        updatedAt: new Date().toISOString(),
      },
      selectedIds: [],
    });
  },

  deletePage: (id) => {
    const state = get();
    if (state.board.pages.length <= 1) return;
    const idx = state.board.pages.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const pages = state.board.pages.filter((p) => p.id !== id);
    const activePageId =
      state.board.activePageId === id
        ? pages[Math.min(idx, pages.length - 1)].id
        : state.board.activePageId;
    set({
      ...pushHistory(state),
      board: { ...state.board, pages, activePageId, updatedAt: new Date().toISOString() },
      selectedIds: [],
    });
  },

  setActivePage: (id) => {
    const state = get();
    if (state.board.activePageId === id) return;
    if (!state.board.pages.some((p) => p.id === id)) return;
    set({
      board: { ...state.board, activePageId: id },
      selectedIds: [],
    });
  },

  reorderPage: (from, to) => {
    const state = get();
    const pages = [...state.board.pages];
    if (from < 0 || from >= pages.length || to < 0 || to >= pages.length) return;
    const [moved] = pages.splice(from, 1);
    pages.splice(to, 0, moved);
    set({
      ...pushHistory(state),
      board: { ...state.board, pages, updatedAt: new Date().toISOString() },
    });
  },

  setPageThumbnail: (id, thumbnail) => {
    const state = get();
    const pages = state.board.pages.map((p) => (p.id === id ? { ...p, thumbnail } : p));
    set({ board: { ...state.board, pages } });
  },

  duplicatePage: (id) => {
    const state = get();
    const source = state.board.pages.find((p) => p.id === id);
    if (!source) return;
    const copy: Page = {
      ...source,
      id: uid('page'),
      elements: source.elements.map((e) => ({ ...e, id: uid('el') })),
      thumbnail: undefined,
    };
    const idx = state.board.pages.findIndex((p) => p.id === id);
    const pages = [...state.board.pages];
    pages.splice(idx + 1, 0, copy);
    set({
      ...pushHistory(state),
      board: {
        ...state.board,
        pages,
        activePageId: copy.id,
        updatedAt: new Date().toISOString(),
      },
      selectedIds: [],
    });
  },

  buildSnippetFromSelection: (name, category) => {
    const state = get();
    const page = getActivePage(state.board);
    const ids = state.selectedIds;
    if (ids.length === 0) return null;
    const chosen = page.elements.filter((e) => ids.includes(e.id));
    if (chosen.length === 0) return null;
    const minX = Math.min(...chosen.map((e) => e.x - e.width / 2));
    const minY = Math.min(...chosen.map((e) => e.y - e.height / 2));
    const maxX = Math.max(...chosen.map((e) => e.x + e.width / 2));
    const maxY = Math.max(...chosen.map((e) => e.y + e.height / 2));
    const elements: SnippetElement[] = chosen.map((e) => ({
      ...e,
      relX: e.x - e.width / 2 - minX,
      relY: e.y - e.height / 2 - minY,
    }));
    const now = new Date().toISOString();
    return {
      id: uid('snip'),
      name: name.trim() || 'Valem',
      category: category.trim() || 'Üldine',
      elements,
      bboxWidth: maxX - minX,
      bboxHeight: maxY - minY,
      createdAt: now,
      updatedAt: now,
    };
  },

  insertSnippet: (snippet, worldPosition) => {
    const state = get();
    const els = activeElements(state);
    const maxZ = els.reduce((m, e) => Math.max(m, e.zIndex), 0);
    const newElements: BoardElement[] = snippet.elements.map((se, i) => ({
      id: `el_${Date.now().toString(36)}_${i.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      type: se.type,
      content:
        typeof se.content === 'string'
          ? se.content
          : ({ ...se.content } as ElementContent),
      x: worldPosition.x + se.relX + se.width / 2,
      y: worldPosition.y + se.relY + se.height / 2,
      width: se.width,
      height: se.height,
      fontSize: se.fontSize,
      color: se.color,
      rotation: se.rotation,
      zIndex: maxZ + 1 + i,
    }));
    const newIds = newElements.map((e) => e.id);
    set({
      ...pushHistory(state),
      board: withActiveElements(state.board, [...els, ...newElements]),
      selectedIds: newIds,
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    set({
      board: previous,
      past: state.past.slice(0, -1),
      future: [state.board, ...state.future].slice(0, HISTORY_LIMIT),
      selectedIds: [],
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    set({
      board: next,
      past: [...state.past, state.board].slice(-HISTORY_LIMIT),
      future: state.future.slice(1),
      selectedIds: [],
    });
  },
}));

export function selectPrimaryId(state: BoardState): string | null {
  return state.selectedIds[state.selectedIds.length - 1] ?? null;
}
