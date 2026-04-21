'use client';

const KEY = 'formo:keyboard:v2';
const LEGACY_KEY = 'formo:keyboard:v1';

export interface KeyboardPrefs {
  pinned: string[];
}

const DEFAULT: KeyboardPrefs = { pinned: [] };

export function getKeyboardPrefs(): KeyboardPrefs {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<KeyboardPrefs>;
      return { pinned: Array.isArray(parsed.pinned) ? parsed.pinned : [] };
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as { favorites?: string[] };
      const pinned = Array.isArray(parsed.favorites) ? parsed.favorites : [];
      saveKeyboardPrefs({ pinned });
      return { pinned };
    }
    return DEFAULT;
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
