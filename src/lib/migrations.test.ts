import { describe, expect, it } from 'vitest';
import { CURRENT_BOARD_VERSION, migrateBoard, newBoard, uid } from './migrations';
import type { BoardElement } from '@/types/element';

describe('uid', () => {
  it('prefixes the generated id', () => {
    expect(uid('el')).toMatch(/^el_/);
  });

  it('produces unique ids on successive calls', () => {
    const a = uid('x');
    const b = uid('x');
    expect(a).not.toBe(b);
  });
});

describe('newBoard', () => {
  it('creates a board at the current version with one A4 portrait page', () => {
    const board = newBoard();
    expect(board.version).toBe(CURRENT_BOARD_VERSION);
    expect(board.pages).toHaveLength(1);
    expect(board.activePageId).toBe(board.pages[0].id);
    expect(board.pages[0].canvas.pageSize).toBe('A4');
    expect(board.pages[0].canvas.orientation).toBe('portrait');
    expect(board.pages[0].elements).toEqual([]);
    expect(board.fontFamily).toBe('math');
  });
});

describe('migrateBoard', () => {
  it('falls back to a fresh board for non-object input', () => {
    expect(migrateBoard(null).version).toBe(CURRENT_BOARD_VERSION);
    expect(migrateBoard(undefined).version).toBe(CURRENT_BOARD_VERSION);
    expect(migrateBoard('nope').version).toBe(CURRENT_BOARD_VERSION);
    expect(migrateBoard(42).pages).toHaveLength(1);
  });

  it('migrates a legacy v1 single-canvas board into a multi-page v2 board', () => {
    const legacyElements: BoardElement[] = [
      {
        id: 'el_legacy_1',
        type: 'number',
        content: '42',
        x: 100,
        y: 200,
        width: 40,
        height: 40,
        fontSize: 24,
        color: '#000',
        rotation: 0,
        zIndex: 0,
      },
    ];
    const legacy = {
      id: 'board_legacy',
      name: 'Vana tahvel',
      canvas: {
        width: 1200,
        height: 800,
        background: 'white',
        fontFamily: 'serif',
      },
      elements: legacyElements,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };

    const migrated = migrateBoard(legacy);

    expect(migrated.version).toBe(CURRENT_BOARD_VERSION);
    expect(migrated.id).toBe('board_legacy');
    expect(migrated.name).toBe('Vana tahvel');
    expect(migrated.fontFamily).toBe('serif');
    expect(migrated.pages).toHaveLength(1);
    expect(migrated.activePageId).toBe(migrated.pages[0].id);
    expect(migrated.pages[0].elements).toEqual(legacyElements);
    expect(migrated.pages[0].canvas.width).toBe(1200);
    expect(migrated.pages[0].canvas.height).toBe(800);
    expect(migrated.pages[0].canvas.background).toBe('white');
    expect(migrated.pages[0].canvas.orientation).toBe('landscape');
  });

  it('infers portrait orientation when legacy canvas is taller than wide', () => {
    const legacy = {
      id: 'b1',
      name: 'A',
      canvas: { width: 600, height: 900, background: 'transparent' },
      elements: [],
    };
    const migrated = migrateBoard(legacy);
    expect(migrated.pages[0].canvas.orientation).toBe('portrait');
  });

  it('is idempotent on an already-current v2 board', () => {
    const current = newBoard();
    const again = migrateBoard(current);
    expect(again.version).toBe(CURRENT_BOARD_VERSION);
    expect(again.id).toBe(current.id);
    expect(again.pages).toHaveLength(current.pages.length);
    expect(again.activePageId).toBe(current.activePageId);
  });

  it('rewrites a v2-shaped board to the current version even if version field is missing', () => {
    const shaped = {
      ...newBoard(),
      version: undefined,
    };
    const migrated = migrateBoard(shaped);
    expect(migrated.version).toBe(CURRENT_BOARD_VERSION);
  });

  it('falls back to a new board when the shape is invalid after migration', () => {
    const broken = { name: 'nope', pages: 'not-an-array' };
    const migrated = migrateBoard(broken);
    expect(migrated.version).toBe(CURRENT_BOARD_VERSION);
    expect(migrated.pages).toHaveLength(1);
  });
});
