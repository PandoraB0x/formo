'use client';

import type { KeyboardKey } from '@/types/element';
import { keyId } from '@/components/Keyboard/keyboardConfig';

const STORAGE_KEY = 'formo:recentKeys:v1';
const MAX_RECENT = 12;

export function getRecentKeys(): KeyboardKey[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as KeyboardKey[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function addRecentKey(key: KeyboardKey): KeyboardKey[] {
  if (typeof window === 'undefined') return [];
  const id = keyId(key);
  const current = getRecentKeys().filter((k) => keyId(k) !== id);
  const next = [key, ...current].slice(0, MAX_RECENT);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage quota — ignore
  }
  return next;
}

export function clearRecentKeys(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
