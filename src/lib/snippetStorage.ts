'use client';

import type { Snippet } from '@/types/snippet';

const KEY = 'formo:snippets:v1';

function readAll(): Snippet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Snippet[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(snippets: Snippet[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(snippets));
}

export function listSnippets(): Snippet[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveSnippet(snippet: Snippet): void {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === snippet.id);
  if (idx >= 0) all[idx] = snippet;
  else all.push(snippet);
  writeAll(all);
}

export function deleteSnippet(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function listCategories(): string[] {
  const set = new Set(readAll().map((s) => s.category || 'Üldine'));
  return Array.from(set).sort();
}
