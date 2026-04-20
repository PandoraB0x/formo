import type { BoardElement, ElementType, ElementContent } from '@/types/element';

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
