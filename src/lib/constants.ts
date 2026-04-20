export const SIZE_STEPS = [20, 28, 36, 48, 64, 84, 108, 140, 180, 240];

export interface FontOption {
  id: string;
  label: string;
  stack: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'math', label: 'Cambria Math', stack: "'Cambria Math', 'Latin Modern Math', Georgia, serif" },
  { id: 'serif', label: 'Klassikaline (serif)', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'sans', label: 'Moodne (sans)', stack: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
  { id: 'mono', label: 'Monoruum', stack: "'JetBrains Mono', 'Fira Code', Menlo, monospace" },
  { id: 'hand', label: 'Kiri (käekiri)', stack: "'Caveat', 'Comic Sans MS', cursive" },
  { id: 'chalk', label: 'Kriit', stack: "'Chalkduster', 'Bradley Hand', cursive" },
];

export const DEFAULT_FONT_ID = 'math';

export function fontStack(id: string | undefined): string {
  const opt = FONT_OPTIONS.find((o) => o.id === id) ?? FONT_OPTIONS[0];
  return opt.stack;
}

export const ROTATION_STEP = 45;

export const COLOR_SWATCHES = [
  '#111111',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export function currentSizeIndex(fontSize: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < SIZE_STEPS.length; i += 1) {
    const d = Math.abs(SIZE_STEPS[i] - fontSize);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function snapRotation(rotation: number): number {
  const normalized = ((rotation % 360) + 360) % 360;
  return (Math.round(normalized / ROTATION_STEP) * ROTATION_STEP) % 360;
}
