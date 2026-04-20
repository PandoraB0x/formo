export type PageSize = 'A3' | 'A4' | 'A5' | 'custom';
export type Orientation = 'portrait' | 'landscape';

const PAGE_MM: Record<Exclude<PageSize, 'custom'>, { w: number; h: number }> = {
  A3: { w: 297, h: 420 },
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
};

const MM_TO_PX = 96 / 25.4;

export function getPagePixels(
  size: PageSize,
  orientation: Orientation,
  fallback?: { w: number; h: number },
): { w: number; h: number } {
  if (size === 'custom') {
    return fallback ?? { w: 794, h: 1123 };
  }
  const mm = PAGE_MM[size];
  const pw = Math.round(mm.w * MM_TO_PX);
  const ph = Math.round(mm.h * MM_TO_PX);
  return orientation === 'landscape' ? { w: ph, h: pw } : { w: pw, h: ph };
}

export function getPageMillimeters(
  size: PageSize,
  orientation: Orientation,
  fallback: { w: number; h: number },
): { w: number; h: number } {
  if (size === 'custom') {
    return { w: fallback.w / MM_TO_PX, h: fallback.h / MM_TO_PX };
  }
  const mm = PAGE_MM[size];
  return orientation === 'landscape' ? { w: mm.h, h: mm.w } : { w: mm.w, h: mm.h };
}

export const PAGE_SIZE_OPTIONS: { id: PageSize; label: string }[] = [
  { id: 'A3', label: 'A3' },
  { id: 'A4', label: 'A4' },
  { id: 'A5', label: 'A5' },
  { id: 'custom', label: 'Kohandatud' },
];

export const ORIENTATION_OPTIONS: { id: Orientation; label: string }[] = [
  { id: 'portrait', label: 'Püsti' },
  { id: 'landscape', label: 'Rõhtsalt' },
];
