'use client';

const KEY = 'formo:keyboard:v1';

export interface KeyboardPrefs {
  order: string[];
  collapsed: string[];
  favorites: string[];
}

const DEFAULT: KeyboardPrefs = { order: [], collapsed: [], favorites: [] };

export function getKeyboardPrefs(): KeyboardPrefs {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<KeyboardPrefs>;
    return {
      order: Array.isArray(parsed.order) ? parsed.order : [],
      collapsed: Array.isArray(parsed.collapsed) ? parsed.collapsed : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
    };
  } catch {
    return DEFAULT;
  }
}

export function saveKeyboardPrefs(prefs: KeyboardPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota
  }
}
