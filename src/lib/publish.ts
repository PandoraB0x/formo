import type { Board } from '@/types/element';
import { migrateBoard } from '@/lib/migrations';

const SLUG_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const SLUG_LEN = 8;

export function generateSlug(random: () => number = Math.random): string {
  let s = '';
  for (let i = 0; i < SLUG_LEN; i++) {
    s += SLUG_ALPHABET[Math.floor(random() * SLUG_ALPHABET.length)];
  }
  return s;
}

const SLUG_RE = /^[a-z0-9]{4,32}$/;

export function isValidSlug(s: unknown): s is string {
  return typeof s === 'string' && SLUG_RE.test(s);
}

export function looksLikeBoardShape(x: unknown): x is Board {
  if (!x || typeof x !== 'object') return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.name === 'string' &&
    Array.isArray(b.pages) &&
    typeof b.activePageId === 'string'
  );
}

export interface PublishedRow {
  slug: string;
  board_json: string;
  created_at: string;
}

export function parsePublishedBoard(row: PublishedRow): Board {
  const parsed = JSON.parse(row.board_json);
  return migrateBoard(parsed);
}
