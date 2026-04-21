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

const GROUP_ORDER_PREFIX = 'formo:groupOrder:';

function orderKey(email: string): string {
  return GROUP_ORDER_PREFIX + email.trim().toLowerCase();
}

export function getGroupOrder(email: string | null | undefined): string[] | null {
  if (!email || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(orderKey(email));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return null;
  }
}

export function saveGroupOrder(email: string, order: string[]): void {
  if (!email || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(orderKey(email), JSON.stringify(order));
  } catch {
    // ignore quota
  }
}

export interface Kit {
  id: string;
  name: string;
  groups: string[];
}

const KITS_PREFIX = 'formo:kits:';
const ACTIVE_KIT_PREFIX = 'formo:activeKit:';

function kitsKey(email: string): string {
  return KITS_PREFIX + email.trim().toLowerCase();
}

function activeKitKey(email: string): string {
  return ACTIVE_KIT_PREFIX + email.trim().toLowerCase();
}

function isKit(value: unknown): value is Kit {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    Array.isArray(v.groups) &&
    v.groups.every((g) => typeof g === 'string')
  );
}

export function getKits(email: string | null | undefined): Kit[] {
  if (!email || typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(kitsKey(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isKit);
  } catch {
    return [];
  }
}

export function saveKits(email: string, kits: Kit[]): void {
  if (!email || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(kitsKey(email), JSON.stringify(kits));
  } catch {
    // ignore quota
  }
}

export function getActiveKitId(email: string | null | undefined): string | null {
  if (!email || typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(activeKitKey(email));
  } catch {
    return null;
  }
}

export function setActiveKitId(email: string, id: string | null): void {
  if (!email || typeof window === 'undefined') return;
  try {
    if (id === null) window.localStorage.removeItem(activeKitKey(email));
    else window.localStorage.setItem(activeKitKey(email), id);
  } catch {
    // ignore quota
  }
}
