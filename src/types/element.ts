export type ElementType =
  | 'number'
  | 'operator'
  | 'paren'
  | 'variable'
  | 'function'
  | 'fraction'
  | 'power'
  | 'subscript'
  | 'sqrt'
  | 'text'
  | 'line'
  | 'shape'
  | 'path';

export type ElementContent =
  | string
  | { numerator: string; denominator: string }
  | { base: string; exponent: string }
  | { base: string; index: string }
  | { points: number[]; strokeWidth: number };

export interface BoardElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  rotation: number;
  zIndex: number;
  locked?: boolean;
}

export interface PageCanvas {
  width: number;
  height: number;
  background: 'transparent' | 'white';
  pageSize: 'A3' | 'A4' | 'A5' | 'custom';
  orientation: 'portrait' | 'landscape';
}

export interface Page {
  id: string;
  canvas: PageCanvas;
  elements: BoardElement[];
  thumbnail?: string;
}

export interface Board {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  fontFamily: string;
  activePageId: string;
  pages: Page[];
}

export interface KeyboardKey {
  label: string;
  type: ElementType;
  content: ElementContent;
  hint?: string;
}

export interface KeyboardGroup {
  title: string;
  short: string;
  keys: KeyboardKey[];
}
