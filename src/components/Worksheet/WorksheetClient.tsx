'use client';

import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import type { Board } from '@/types/element';
import { useBoardStore, getActivePage } from '@/store/useBoardStore';
import Canvas from '@/components/Canvas/Canvas';
import SymbolBar from '@/components/Keyboard/SymbolBar';
import SymbolDock from '@/components/Keyboard/SymbolDock';
import WorksheetToolbar from './WorksheetToolbar';
import WorksheetPageSwitcher from './WorksheetPageSwitcher';
import { loadStudentWork, saveStudentWork, type StudentWork } from '@/lib/worksheetStorage';

interface Props {
  slug: string;
  board: Board;
}

function lockTeacherElements(board: Board): Board {
  return {
    ...board,
    pages: board.pages.map((p) => ({
      ...p,
      elements: p.elements.map((el) => ({ ...el, locked: true })),
    })),
  };
}

function mergeWithStudentWork(board: Board, work: StudentWork): Board {
  return {
    ...board,
    pages: board.pages.map((p) => {
      const studentEls = work[p.id] ?? [];
      if (studentEls.length === 0) return p;
      const maxZ = p.elements.reduce((m, e) => Math.max(m, e.zIndex), 0);
      return {
        ...p,
        elements: [
          ...p.elements,
          ...studentEls.map((el, i) => ({ ...el, locked: false, zIndex: maxZ + 1 + i })),
        ],
      };
    }),
  };
}

export default function WorksheetClient({ slug, board }: Props) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const clipboardRef = useRef<string[]>([]);
  const loadBoard = useBoardStore((s) => s.loadBoard);
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const deleteSelected = useBoardStore((s) => s.deleteSelected);
  const duplicateSelected = useBoardStore((s) => s.duplicateSelected);
  const setSelection = useBoardStore((s) => s.setSelection);

  useEffect(() => {
    const locked = lockTeacherElements(board);
    const work = loadStudentWork(slug);
    const merged = mergeWithStudentWork(locked, work);
    loadBoard(merged);
  }, [slug, board, loadBoard]);

  useEffect(() => {
    const unsub = useBoardStore.subscribe((state) => {
      const work: StudentWork = {};
      for (const page of state.board.pages) {
        const studentEls = page.elements.filter((el) => !el.locked);
        if (studentEls.length > 0) work[page.id] = studentEls;
      }
      saveStudentWork(slug, work);
    });
    return () => unsub();
  }, [slug]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (meta && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (meta && e.key.toLowerCase() === 'c') {
        const ids = useBoardStore.getState().selectedIds;
        if (ids.length) {
          e.preventDefault();
          clipboardRef.current = ids;
        }
        return;
      }
      if (meta && e.key.toLowerCase() === 'v') {
        const ids = clipboardRef.current;
        if (ids.length) {
          e.preventDefault();
          const state = useBoardStore.getState();
          const page = getActivePage(state.board);
          const stillExist = ids.filter((id) => page.elements.some((el) => el.id === id && !el.locked));
          if (stillExist.length) {
            setSelection(stillExist);
            duplicateSelected();
            clipboardRef.current = useBoardStore.getState().selectedIds;
          }
        }
        return;
      }
      if (e.key === 'Escape') {
        setSelection([]);
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const ids = useBoardStore.getState().selectedIds;
        if (ids.length) {
          e.preventDefault();
          deleteSelected();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, deleteSelected, duplicateSelected, setSelection]);

  return (
    <>
      <WorksheetToolbar slug={slug} stageRef={stageRef} />
      <WorksheetPageSwitcher />
      <SymbolBar />
      <main className="flex flex-1 overflow-hidden">
        <div className="hidden sm:block">
          <SymbolDock />
        </div>
        <div className="flex-1 relative">
          <Canvas stageRef={stageRef} />
        </div>
      </main>
    </>
  );
}
