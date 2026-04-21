'use client';

import { useLayoutEffect, useState } from 'react';
import { Plus, Minus, RotateCw, RotateCcw, Trash2, Copy } from 'lucide-react';
import type Konva from 'konva';
import { useBoardStore, selectPrimaryId } from '@/store/useBoardStore';
import { COLOR_SWATCHES, SIZE_STEPS, currentSizeIndex, snapRotation } from '@/lib/constants';
import type { BoardElement } from '@/types/element';

interface Props {
  stage: Konva.Stage | null;
  hidden?: boolean;
  viewKey?: string;
}

export default function SelectionPopup({ stage, hidden, viewKey }: Props) {
  const element = useBoardStore((s) => {
    const id = selectPrimaryId(s);
    if (!id) return null;
    const page = s.board.pages.find((p) => p.id === s.board.activePageId) ?? s.board.pages[0];
    return page.elements.find((e) => e.id === id) || null;
  });
  const resizeStep = useBoardStore((s) => s.resizeStep);
  const rotateStep = useBoardStore((s) => s.rotateStep);
  const setColor = useBoardStore((s) => s.setColor);
  const deleteElement = useBoardStore((s) => s.deleteElement);
  const duplicateSelected = useBoardStore((s) => s.duplicateSelected);

  const [pos, setPos] = useState<{ left: number; top: number; below: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!stage || !element) {
      setPos(null);
      return;
    }
    const node = stage.findOne(`#${element.id}`);
    if (!node) {
      setPos(null);
      return;
    }
    const worldBox = node.getClientRect({ relativeTo: stage });
    const scale = stage.scaleX() || 1;
    const sx = stage.x();
    const sy = stage.y();
    const screenX = worldBox.x * scale + sx;
    const screenY = worldBox.y * scale + sy;
    const screenW = worldBox.width * scale;
    const screenH = worldBox.height * scale;
    const below = screenY < 90;
    setPos({
      left: screenX + screenW / 2,
      top: below ? screenY + screenH + 12 : screenY - 12,
      below,
    });
  }, [
    stage,
    viewKey,
    element?.id,
    element?.x,
    element?.y,
    element?.width,
    element?.height,
    element?.rotation,
    element?.fontSize,
  ]);

  if (!element || !pos || hidden) return null;

  return (
    <ElementControls
      element={element}
      pos={pos}
      onSizeChange={(delta) => resizeStep(element.id, delta)}
      onRotate={(delta) => rotateStep(element.id, delta)}
      onColor={(c) => setColor(element.id, c)}
      onDelete={() => deleteElement(element.id)}
      onDuplicate={() => duplicateSelected()}
    />
  );
}

function ElementControls({
  element,
  pos,
  onSizeChange,
  onRotate,
  onColor,
  onDelete,
  onDuplicate,
}: {
  element: BoardElement;
  pos: { left: number; top: number; below: boolean };
  onSizeChange: (delta: -1 | 1) => void;
  onRotate: (delta: -1 | 1) => void;
  onColor: (c: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const sizeIdx = currentSizeIndex(element.fontSize);
  const rot = snapRotation(element.rotation || 0);

  return (
    <div
      className="pointer-events-auto absolute z-20 flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white/95 p-1.5 shadow-xl backdrop-blur"
      style={{
        left: pos.left,
        top: pos.top,
        transform: pos.below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-0.5">
        <PopBtn onClick={() => onSizeChange(-1)} disabled={sizeIdx === 0} title="Väiksemaks">
          <Minus size={14} />
        </PopBtn>
        <span className="min-w-9 text-center text-[10px] font-medium tabular-nums text-neutral-500">
          {sizeIdx + 1}/{SIZE_STEPS.length}
        </span>
        <PopBtn
          onClick={() => onSizeChange(1)}
          disabled={sizeIdx === SIZE_STEPS.length - 1}
          title="Suuremaks"
        >
          <Plus size={14} />
        </PopBtn>

        <Divider />

        <PopBtn onClick={() => onRotate(-1)} title="−45°">
          <RotateCcw size={14} />
        </PopBtn>
        <span className="min-w-10 text-center text-[10px] font-medium tabular-nums text-neutral-500">
          {rot}°
        </span>
        <PopBtn onClick={() => onRotate(1)} title="+45°">
          <RotateCw size={14} />
        </PopBtn>

        <Divider />

        <PopBtn onClick={onDuplicate} title="Dubleeri">
          <Copy size={14} />
        </PopBtn>
        <PopBtn onClick={onDelete} title="Kustuta">
          <Trash2 size={14} />
        </PopBtn>
      </div>

      <div className="flex items-center gap-1 pt-0.5">
        {COLOR_SWATCHES.map((c) => {
          const active = element.color.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              onClick={() => onColor(c)}
              title={c}
              className={`h-4 w-4 rounded-full transition ${
                active
                  ? 'ring-2 ring-neutral-800 ring-offset-1'
                  : 'ring-1 ring-neutral-200 hover:ring-neutral-500'
              }`}
              style={{ backgroundColor: c }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-neutral-200" />;
}

function PopBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-6 w-6 items-center justify-center rounded text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
