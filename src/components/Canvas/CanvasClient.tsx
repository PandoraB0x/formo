'use client';

import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import Canvas from './Canvas';
import Keyboard from '@/components/Keyboard/Keyboard';
import Toolbar from '@/components/Toolbar/Toolbar';
import PagesPanel from '@/components/Pages/PagesPanel';
import { useBoardStore } from '@/store/useBoardStore';

export default function CanvasClient() {
  const stageRef = useRef<Konva.Stage | null>(null);

  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const deleteSelected = useBoardStore((s) => s.deleteSelected);
  const duplicateSelected = useBoardStore((s) => s.duplicateSelected);
  const setSelection = useBoardStore((s) => s.setSelection);

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
      if (meta && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const board = useBoardStore.getState().board;
        const page = board.pages.find((p) => p.id === board.activePageId) ?? board.pages[0];
        const ids = page.elements.map((el) => el.id);
        setSelection(ids);
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
      <Toolbar stageRef={stageRef} />
      <main className="flex flex-1 overflow-hidden">
        <Keyboard />
        <div className="flex-1">
          <Canvas stageRef={stageRef} />
        </div>
        <PagesPanel />
      </main>
    </>
  );
}
