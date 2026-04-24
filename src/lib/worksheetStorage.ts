'use client';

import type { BoardElement } from '@/types/element';

const PREFIX = 'formo:worksheet:v1:';

function keyFor(slug: string): string {
  return `${PREFIX}${slug}`;
}

export type StudentWork = Record<string, BoardElement[]>;

export function loadStudentWork(slug: string): StudentWork {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(keyFor(slug));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: StudentWork = {};
    for (const [pageId, els] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(els)) {
        out[pageId] = (els as BoardElement[]).map((el) => ({ ...el, locked: false }));
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveStudentWork(slug: string, work: StudentWork): void {
  if (typeof window === 'undefined') return;
  try {
    const cleaned: StudentWork = {};
    for (const [pageId, els] of Object.entries(work)) {
      if (els.length > 0) cleaned[pageId] = els;
    }
    window.localStorage.setItem(keyFor(slug), JSON.stringify(cleaned));
  } catch {
    /* quota or serialization error — silently drop */
  }
}

export function clearStudentWork(slug: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(keyFor(slug));
}
