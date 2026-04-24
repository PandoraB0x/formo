import type { BoardElement, ElementType, ElementContent } from '@/types/element';
import { SHAPE_MAP } from '@/lib/shapes';
import { parseFraction } from '@/lib/mathParse';

let counter = 0;
function uid(): string {
  counter += 1;
  return `el_${Date.now().toString(36)}_${counter.toString(36)}`;
}

const INLINE_LINE_HEIGHT = 1.25;

const DEFAULTS: Record<ElementType, { width: number; height: number; fontSize: number }> = {
  number: { width: 50, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  operator: { width: 50, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  paren: { width: 30, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  variable: { width: 50, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  function: { width: 110, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  text: { width: 140, height: 64 * INLINE_LINE_HEIGHT, fontSize: 64 },
  fraction: { width: 90, height: 140, fontSize: 48 },
  power: { width: 90, height: 90, fontSize: 56 },
  subscript: { width: 90, height: 90, fontSize: 56 },
  sqrt: { width: 120, height: 100, fontSize: 56 },
  line: { width: 200, height: 6, fontSize: 64 },
  shape: { width: 140, height: 120, fontSize: 64 },
  path: { width: 100, height: 100, fontSize: 64 },
};

const TEXT_WIDTH_FACTOR = 0.58;
const AUTO_WIDTH_TYPES: ElementType[] = ['number', 'operator', 'variable', 'function', 'text'];

function computeWidth(type: ElementType, content: ElementContent, fontSize: number, base: number): number {
  if (!AUTO_WIDTH_TYPES.includes(type)) return base;
  const text = typeof content === 'string' ? content : '';
  if (!text) return base;
  const measured = Math.ceil(text.length * fontSize * TEXT_WIDTH_FACTOR) + 16;
  return Math.max(base, measured);
}

function computeFractionSize(
  content: ElementContent,
  fontSize: number,
): { width: number; height: number } {
  const c = (content && typeof content === 'object' ? content : {}) as {
    numerator?: string;
    denominator?: string;
  };
  const num = c.numerator ?? '';
  const den = c.denominator ?? '';
  const maxLen = Math.max(1, num.length, den.length);
  const width = Math.max(80, Math.ceil(maxLen * fontSize * TEXT_WIDTH_FACTOR) + 24);
  const height = Math.round(fontSize * 2.8);
  return { width, height };
}

export function computeSqrtSize(
  content: ElementContent,
  fontSize: number,
): { width: number; height: number } {
  const text = typeof content === 'string' ? content : '';
  const minWidth = Math.round((DEFAULTS.sqrt.width / DEFAULTS.sqrt.fontSize) * fontSize);
  const minHeight = Math.round((DEFAULTS.sqrt.height / DEFAULTS.sqrt.fontSize) * fontSize);

  const frac = parseFraction(text);
  if (frac) {
    const partFs = Math.round(fontSize * 0.75);
    const maxLen = Math.max(1, frac.numerator.length, frac.denominator.length);
    const textWidth = Math.ceil(maxLen * partFs * TEXT_WIDTH_FACTOR);
    const height = Math.max(minHeight, Math.round(partFs * 2.8) + 16);
    const hookSpace = height * 0.22 + 20;
    const width = Math.max(minWidth, hookSpace + textWidth + 20);
    return { width, height };
  }

  const height = minHeight;
  const hookSpace = height * 0.22 + 20;
  const textWidth = Math.ceil(text.length * fontSize * TEXT_WIDTH_FACTOR);
  const width = Math.max(minWidth, hookSpace + textWidth + 12);
  return { width, height };
}

function computeScriptSize(
  type: 'power' | 'subscript',
  content: ElementContent,
  fontSize: number,
  baseWidth: number,
  baseHeight: number,
): { width: number; height: number } {
  const c = (content && typeof content === 'object' ? content : {}) as {
    base?: string;
    exponent?: string;
    index?: string;
  };
  const baseText = c.base ?? '';
  const tailText = (type === 'power' ? c.exponent : c.index) ?? '';
  const tailFs = Math.max(12, fontSize * 0.55);
  const baseTextW = Math.ceil(baseText.length * fontSize * TEXT_WIDTH_FACTOR);
  const tailTextW = Math.ceil(tailText.length * tailFs * TEXT_WIDTH_FACTOR);
  const needed = baseTextW + tailTextW + 24;
  return { width: Math.max(baseWidth, needed), height: baseHeight };
}

export function makeElement(
  type: ElementType,
  content: ElementContent,
  position: { x: number; y: number },
  zIndex: number
): BoardElement {
  const d = DEFAULTS[type];
  let width = computeWidth(type, content, d.fontSize, d.width);
  let height = d.height;
  if (type === 'fraction') {
    const sz = computeFractionSize(content, d.fontSize);
    width = sz.width;
    height = sz.height;
  }
  if (type === 'sqrt') {
    const sz = computeSqrtSize(content, d.fontSize);
    width = sz.width;
    height = sz.height;
  }
  if (type === 'power' || type === 'subscript') {
    const sz = computeScriptSize(type, content, d.fontSize, d.width, d.height);
    width = sz.width;
    height = sz.height;
  }
  if (type === 'shape' && typeof content === 'string') {
    const def = SHAPE_MAP.get(content);
    if (def) {
      width = def.width;
      height = def.height;
    }
  }
  return {
    id: uid(),
    type,
    content,
    x: position.x,
    y: position.y,
    width,
    height,
    fontSize: d.fontSize,
    color: '#111111',
    rotation: 0,
    zIndex,
  };
}

export function duplicateElement(el: BoardElement, zIndex: number): BoardElement {
  return {
    ...el,
    id: uid(),
    x: el.x + 20,
    y: el.y + 20,
    zIndex,
    content:
      typeof el.content === 'string'
        ? el.content
        : ({ ...el.content } as ElementContent),
  };
}
