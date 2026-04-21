import { describe, expect, it } from 'vitest';
import {
  generateSlug,
  isValidSlug,
  looksLikeBoardShape,
  parsePublishedBoard,
} from './publish';
import { newBoard } from './migrations';

describe('generateSlug', () => {
  it('produces 8-char alphanumeric slugs from the ambiguous-free alphabet', () => {
    for (let i = 0; i < 20; i++) {
      const s = generateSlug();
      expect(s).toMatch(/^[a-z0-9]{8}$/);
      expect(s).not.toMatch(/[il1o0]/);
    }
  });

  it('uses the injected random source deterministically', () => {
    const a = generateSlug(() => 0);
    const b = generateSlug(() => 0);
    expect(a).toBe(b);
  });
});

describe('isValidSlug', () => {
  it('accepts lowercase alphanumeric 4-32 chars', () => {
    expect(isValidSlug('abcd')).toBe(true);
    expect(isValidSlug('abcdefgh')).toBe(true);
    expect(isValidSlug('a2b3c4d5')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isValidSlug('abc')).toBe(false);
    expect(isValidSlug('ABCDEFGH')).toBe(false);
    expect(isValidSlug('has space')).toBe(false);
    expect(isValidSlug('a-b-c-d')).toBe(false);
    expect(isValidSlug(123)).toBe(false);
    expect(isValidSlug(null)).toBe(false);
    expect(isValidSlug('a'.repeat(33))).toBe(false);
  });
});

describe('looksLikeBoardShape', () => {
  it('accepts a v2 board', () => {
    expect(looksLikeBoardShape(newBoard())).toBe(true);
  });

  it('rejects garbage', () => {
    expect(looksLikeBoardShape(null)).toBe(false);
    expect(looksLikeBoardShape({})).toBe(false);
    expect(looksLikeBoardShape({ name: 'x' })).toBe(false);
    expect(looksLikeBoardShape({ id: 'x', name: 'x', pages: 'nope', activePageId: 'x' })).toBe(false);
  });
});

describe('parsePublishedBoard', () => {
  it('parses + migrates a stored board JSON row', () => {
    const board = newBoard();
    const row = {
      slug: 'abcd1234',
      board_json: JSON.stringify(board),
      created_at: new Date().toISOString(),
    };
    const parsed = parsePublishedBoard(row);
    expect(parsed.id).toBe(board.id);
    expect(parsed.pages).toHaveLength(1);
  });

  it('migrates a legacy v1 payload through the pipeline', () => {
    const legacy = {
      id: 'legacy',
      name: 'Old',
      canvas: { width: 800, height: 600, background: 'white' },
      elements: [],
    };
    const row = {
      slug: 'xxxxxxxx',
      board_json: JSON.stringify(legacy),
      created_at: new Date().toISOString(),
    };
    const parsed = parsePublishedBoard(row);
    expect(parsed.version).toBeGreaterThanOrEqual(2);
    expect(parsed.pages).toHaveLength(1);
  });
});
