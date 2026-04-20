'use client';

import type { Board } from '@/types/element';
import { migrateBoard } from '@/store/useBoardStore';

const KEY = 'formo:boards:v1';

interface StoredEntry {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail?: string;
  board: Board;
}

function readAll(): StoredEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: StoredEntry[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

export function listSavedBoards(): StoredEntry[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveBoard(board: Board, thumbnail?: string): void {
  const entries = readAll();
  const entry: StoredEntry = {
    id: board.id,
    name: board.name,
    updatedAt: board.updatedAt,
    thumbnail,
    board,
  };
  const idx = entries.findIndex((e) => e.id === board.id);
  if (idx >= 0) entries[idx] = entry;
  else entries.push(entry);
  writeAll(entries);
}

export function deleteSavedBoard(id: string): void {
  writeAll(readAll().filter((e) => e.id !== id));
}

export function loadSavedBoard(id: string): Board | null {
  const entry = readAll().find((e) => e.id === id);
  return entry ? entry.board : null;
}

export function downloadJson(board: Board): void {
  const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${board.name.replace(/\s+/g, '_')}.formo.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function looksLikeBoard(x: unknown): boolean {
  if (!x || typeof x !== 'object') return false;
  const b = x as Record<string, unknown>;
  if (typeof b.name !== 'string') return false;
  const isLegacy = Array.isArray(b.elements) && b.canvas && typeof b.canvas === 'object';
  const isMultiPage = Array.isArray(b.pages) && typeof b.activePageId === 'string';
  return Boolean(isLegacy || isMultiPage);
}

export async function importBoardFromFile(file: File): Promise<Board> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!looksLikeBoard(parsed)) {
    throw new Error('Invalid Formo board JSON');
  }
  const migrated = migrateBoard(parsed);
  const now = new Date().toISOString();
  return {
    ...migrated,
    id: `board_${Date.now().toString(36)}`,
    updatedAt: now,
  };
}
