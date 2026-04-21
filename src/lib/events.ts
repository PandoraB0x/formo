'use client';

export type FormoEvent =
  | 'formo:prefs'
  | 'formo:recent'
  | 'formo:auth'
  | 'formo:lang'
  | 'formo:kits';

export function emit(name: FormoEvent): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(name));
}

export function on(name: FormoEvent, handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}
