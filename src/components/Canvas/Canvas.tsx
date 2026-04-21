'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useBoardStore } from '@/store/useBoardStore';
import ElementRenderer from './ElementRenderer';
import SelectionPopup from './SelectionPopup';
import InlineInput from './InlineInput';
import { useLang } from '@/i18n/useLang';
import type { BoardElement } from '@/types/element';

interface CanvasProps {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

interface RubberBand {
  x0: number;
  y0: number;
  x: number;
  y: number;
}

interface DragGroup {
  anchorId: string;
  anchorStart: { x: number; y: number };
  others: { id: string; x: number; y: number }[];
}

interface View {
  x: number;
  y: number;
  scale: number;
}

interface InlineAt {
  screenX: number;
  screenY: number;
  worldX: number;
  worldY: number;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.1;

export default function Canvas({ stageRef }: CanvasProps) {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [stageReady, setStageReady] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [inlineAt, setInlineAt] = useState<InlineAt | null>(null);
  const [rubber, setRubber] = useState<RubberBand | null>(null);
  const dragGroupRef = useRef<DragGroup | null>(null);

  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 });
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{
    clientX: number;
    clientY: number;
    viewX: number;
    viewY: number;
  } | null>(null);
  const fittedKeyRef = useRef<string | null>(null);

  const activePage = useBoardStore((s) => s.board.pages.find((p) => p.id === s.board.activePageId) ?? s.board.pages[0]);
  const activePageId = activePage.id;
  const elements = activePage.elements;
  const background = activePage.canvas.background;
  const pageWidth = activePage.canvas.width;
  const pageHeight = activePage.canvas.height;
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const selectElement = useBoardStore((s) => s.selectElement);
  const setSelection = useBoardStore((s) => s.setSelection);
  const toggleInSelection = useBoardStore((s) => s.toggleInSelection);
  const beginHistory = useBoardStore((s) => s.beginHistory);
  const moveElementSilent = useBoardStore((s) => s.moveElementSilent);
  const moveManySilent = useBoardStore((s) => s.moveManySilent);
  const setPageThumbnail = useBoardStore((s) => s.setPageThumbnail);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const timer = window.setTimeout(() => {
      try {
        const targetW = 160;
        const pixelRatio = Math.min(targetW / pageWidth, 1);
        const sx = stage.x();
        const sy = stage.y();
        const sc = stage.scaleX();
        stage.position({ x: 0, y: 0 });
        stage.scale({ x: 1, y: 1 });
        const url = stage.toDataURL({
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
          pixelRatio,
          mimeType: 'image/png',
        });
        stage.position({ x: sx, y: sy });
        stage.scale({ x: sc, y: sc });
        setPageThumbnail(activePageId, url);
      } catch {
        // ignore
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [activePageId, elements, pageWidth, pageHeight, setPageThumbnail, stageRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize({ width: r.width, height: r.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    const key = `${pageWidth}x${pageHeight}`;
    if (fittedKeyRef.current === key) return;
    const margin = 40;
    const scaleX = (size.width - margin * 2) / pageWidth;
    const scaleY = (size.height - margin * 2) / pageHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    setView({
      scale,
      x: (size.width - pageWidth * scale) / 2,
      y: (size.height - pageHeight * scale) / 2,
    });
    fittedKeyRef.current = key;
  }, [size.width, size.height, pageWidth, pageHeight]);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    interface Pinch {
      initialScale: number;
      initialDist: number;
      initialMid: { x: number; y: number };
      initialView: View;
    }
    let pinch: Pinch | null = null;

    function touchData(touches: TouchList) {
      const rect = el!.getBoundingClientRect();
      const x1 = touches[0].clientX - rect.left;
      const y1 = touches[0].clientY - rect.top;
      const x2 = touches[1].clientX - rect.left;
      const y2 = touches[1].clientY - rect.top;
      return {
        midX: (x1 + x2) / 2,
        midY: (y1 + y2) / 2,
        dist: Math.hypot(x2 - x1, y2 - y1),
      };
    }

    function onStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const d = touchData(e.touches);
        const v = viewRef.current;
        pinch = {
          initialScale: v.scale,
          initialDist: d.dist || 1,
          initialMid: { x: d.midX, y: d.midY },
          initialView: { ...v },
        };
        setRubber(null);
      }
    }

    function onMove(e: TouchEvent) {
      if (!pinch || e.touches.length < 2) return;
      e.preventDefault();
      e.stopPropagation();
      const d = touchData(e.touches);
      const factor = d.dist / pinch.initialDist;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, pinch.initialScale * factor),
      );
      const worldX = (pinch.initialMid.x - pinch.initialView.x) / pinch.initialScale;
      const worldY = (pinch.initialMid.y - pinch.initialView.y) / pinch.initialScale;
      setView({
        scale: newScale,
        x: d.midX - worldX * newScale,
        y: d.midY - worldY * newScale,
      });
    }

    function onEnd(e: TouchEvent) {
      if (pinch && e.touches.length < 2) {
        pinch = null;
      }
    }

    const opts = { capture: true, passive: false } as AddEventListenerOptions;
    el.addEventListener('touchstart', onStart, opts);
    el.addEventListener('touchmove', onMove, opts);
    el.addEventListener('touchend', onEnd, { capture: true });
    el.addEventListener('touchcancel', onEnd, { capture: true });
    return () => {
      el.removeEventListener('touchstart', onStart, opts);
      el.removeEventListener('touchmove', onMove, opts);
      el.removeEventListener('touchend', onEnd, { capture: true });
      el.removeEventListener('touchcancel', onEnd, { capture: true });
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space' || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setSpaceDown(true);
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') setSpaceDown(false);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  function fitToPage() {
    if (size.width === 0) return;
    const margin = 40;
    const scaleX = (size.width - margin * 2) / pageWidth;
    const scaleY = (size.height - margin * 2) / pageHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    setView({
      scale,
      x: (size.width - pageWidth * scale) / 2,
      y: (size.height - pageHeight * scale) / 2,
    });
  }

  function zoomAt(direction: 1 | -1, screenX: number, screenY: number) {
    const oldScale = view.scale;
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, direction > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP),
    );
    if (newScale === oldScale) return;
    const worldX = (screenX - view.x) / oldScale;
    const worldY = (screenY - view.y) / oldScale;
    setView({
      scale: newScale,
      x: screenX - worldX * newScale,
      y: screenY - worldY * newScale,
    });
  }

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const native = e.evt as MouseEvent;
    const isMiddle = 'button' in native && native.button === 1;
    if (spaceDown || isMiddle) {
      if ('preventDefault' in native) native.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        clientX: native.clientX ?? 0,
        clientY: native.clientY ?? 0,
        viewX: view.x,
        viewY: view.y,
      };
      return;
    }
    if (e.target !== stage) return;
    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;
    selectElement(null);
    if (inlineAt) setInlineAt(null);
    setRubber({ x0: pointer.x, y0: pointer.y, x: pointer.x, y: pointer.y });
  };

  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (isPanning && panStartRef.current) {
      const native = e.evt as MouseEvent;
      const dx = (native.clientX ?? 0) - panStartRef.current.clientX;
      const dy = (native.clientY ?? 0) - panStartRef.current.clientY;
      const start = panStartRef.current;
      setView((v) => ({ ...v, x: start.viewX + dx, y: start.viewY + dy }));
      return;
    }
    if (!rubber) return;
    const stage = e.target.getStage();
    const pointer = stage?.getRelativePointerPosition();
    if (!pointer) return;
    setRubber((r) => (r ? { ...r, x: pointer.x, y: pointer.y } : null));
  };

  const handleStageMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }
    if (!rubber) return;
    const x1 = Math.min(rubber.x0, rubber.x);
    const y1 = Math.min(rubber.y0, rubber.y);
    const x2 = Math.max(rubber.x0, rubber.x);
    const y2 = Math.max(rubber.y0, rubber.y);
    if (x2 - x1 > 3 || y2 - y1 > 3) {
      const ids = elements
        .filter((el) => {
          const halfW = el.width / 2;
          const halfH = el.height / 2;
          return (
            el.x + halfW >= x1 &&
            el.x - halfW <= x2 &&
            el.y + halfH >= y1 &&
            el.y - halfH <= y2
          );
        })
        .map((el) => el.id);
      setSelection(ids);
    }
    setRubber(null);
  };

  const handleStageDblClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (e.target !== stage) return;
    const screen = stage.getPointerPosition();
    const world = stage.getRelativePointerPosition();
    if (!screen || !world) return;
    setInlineAt({
      screenX: screen.x,
      screenY: screen.y,
      worldX: world.x,
      worldY: world.y,
    });
  };

  const handleStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    const native = e.evt;
    if (!native.ctrlKey && !native.metaKey) return;
    native.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    zoomAt(native.deltaY > 0 ? -1 : 1, pointer.x, pointer.y);
  };

  const handleElementClick = (el: BoardElement, e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const native = e.evt as MouseEvent;
    if (native && (native.ctrlKey || native.metaKey || native.shiftKey)) {
      toggleInSelection(el.id);
    } else if (!selectedIds.includes(el.id)) {
      selectElement(el.id);
    }
  };

  const handleDragStart = (el: BoardElement) => {
    const state = useBoardStore.getState();
    setDraggingId(el.id);
    beginHistory();
    const ids = state.selectedIds.includes(el.id) ? state.selectedIds : [el.id];
    if (!state.selectedIds.includes(el.id)) {
      selectElement(el.id);
    }
    if (ids.length > 1) {
      const activePageNow =
        state.board.pages.find((p) => p.id === state.board.activePageId) ?? state.board.pages[0];
      const others = activePageNow.elements
        .filter((e) => ids.includes(e.id) && e.id !== el.id)
        .map((e) => ({ id: e.id, x: e.x, y: e.y }));
      dragGroupRef.current = {
        anchorId: el.id,
        anchorStart: { x: el.x, y: el.y },
        others,
      };
    } else {
      dragGroupRef.current = null;
    }
  };

  const handleDragMove = (el: BoardElement, e: KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const g = dragGroupRef.current;
    if (g && g.anchorId === el.id) {
      const dx = newX - g.anchorStart.x;
      const dy = newY - g.anchorStart.y;
      moveManySilent([
        { id: el.id, x: newX, y: newY },
        ...g.others.map((o) => ({ id: o.id, x: o.x + dx, y: o.y + dy })),
      ]);
    } else {
      moveElementSilent(el.id, newX, newY);
    }
  };

  const handleDragEnd = (el: BoardElement, e: KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const g = dragGroupRef.current;
    if (g && g.anchorId === el.id) {
      const dx = newX - g.anchorStart.x;
      const dy = newY - g.anchorStart.y;
      moveManySilent([
        { id: el.id, x: newX, y: newY },
        ...g.others.map((o) => ({ id: o.id, x: o.x + dx, y: o.y + dy })),
      ]);
    } else {
      moveElementSilent(el.id, newX, newY);
    }
    dragGroupRef.current = null;
    setDraggingId(null);
  };

  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const rubberRect =
    rubber && (Math.abs(rubber.x - rubber.x0) > 2 || Math.abs(rubber.y - rubber.y0) > 2)
      ? {
          x: Math.min(rubber.x0, rubber.x),
          y: Math.min(rubber.y0, rubber.y),
          w: Math.abs(rubber.x - rubber.x0),
          h: Math.abs(rubber.y - rubber.y0),
        }
      : null;

  const cursor = isPanning ? 'grabbing' : spaceDown ? 'grab' : 'default';

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-neutral-200"
      style={{ cursor }}
    >
      {size.width > 0 && (
        <Stage
          ref={(node) => {
            stageRef.current = node;
            setStageReady(Boolean(node));
          }}
          width={size.width}
          height={size.height}
          x={view.x}
          y={view.y}
          scaleX={view.scale}
          scaleY={view.scale}
          onMouseDown={handleStageMouseDown}
          onTouchStart={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onTouchMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchEnd={handleStageMouseUp}
          onDblClick={handleStageDblClick}
          onDblTap={handleStageDblClick}
          onWheel={handleStageWheel}
        >
          <Layer id="bg-layer" listening={false}>
            <Rect
              x={6}
              y={6}
              width={pageWidth}
              height={pageHeight}
              fill="rgba(0,0,0,0.1)"
            />
            <Rect
              id="page-rect"
              x={0}
              y={0}
              width={pageWidth}
              height={pageHeight}
              fill={background === 'white' ? '#ffffff' : '#fdfdfd'}
              stroke="#d4d4d8"
              strokeWidth={1}
            />
            <GridBackground width={pageWidth} height={pageHeight} />
          </Layer>

          <Layer id="elements-layer">
            {sorted.map((el) => {
              const isSelected = selectedIds.includes(el.id);
              return (
                <Group
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  rotation={el.rotation}
                  offsetX={el.width / 2}
                  offsetY={el.height / 2}
                  draggable={!spaceDown}
                  onClick={(e) => handleElementClick(el, e)}
                  onTap={(e) => handleElementClick(el, e)}
                  onDragStart={() => handleDragStart(el)}
                  onDragMove={(e) => handleDragMove(el, e)}
                  onDragEnd={(e) => handleDragEnd(el, e)}
                >
                  <Rect
                    name="selection-outline"
                    width={el.width}
                    height={el.height}
                    fill="transparent"
                    stroke={isSelected ? '#6366f1' : 'transparent'}
                    strokeWidth={1.5}
                    dash={[4, 4]}
                  />
                  <ElementRenderer element={el} />
                </Group>
              );
            })}
          </Layer>

          <Layer id="ui-layer" listening={false}>
            {rubberRect && (
              <Rect
                x={rubberRect.x}
                y={rubberRect.y}
                width={rubberRect.w}
                height={rubberRect.h}
                fill="rgba(99,102,241,0.08)"
                stroke="#6366f1"
                strokeWidth={1 / view.scale}
                dash={[4 / view.scale, 3 / view.scale]}
              />
            )}
          </Layer>
        </Stage>
      )}

      <ViewControls
        scale={view.scale}
        onZoomIn={() => zoomAt(1, size.width / 2, size.height / 2)}
        onZoomOut={() => zoomAt(-1, size.width / 2, size.height / 2)}
        onFit={fitToPage}
      />

      {stageReady && selectedIds.length <= 1 && (
        <SelectionPopup
          stage={stageRef.current}
          hidden={Boolean(draggingId) || Boolean(inlineAt) || Boolean(rubber)}
          viewKey={`${Math.round(view.x)}_${Math.round(view.y)}_${view.scale.toFixed(3)}`}
        />
      )}

      {stageReady && selectedIds.length > 1 && !draggingId && !inlineAt && !rubber && (
        <MultiSelectionPopup count={selectedIds.length} />
      )}

      {inlineAt && (
        <InlineInput
          screenPosition={{ x: inlineAt.screenX, y: inlineAt.screenY }}
          worldPosition={{ x: inlineAt.worldX, y: inlineAt.worldY }}
          onClose={() => setInlineAt(null)}
        />
      )}

      {elements.length === 0 && !inlineAt && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white/80 px-6 py-4 text-center text-sm text-neutral-500 shadow-sm">
            {t.canvas.emptyHint}
          </div>
        </div>
      )}
    </div>
  );
}

function ViewControls({
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
}: {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}) {
  const { t } = useLang();
  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/95 p-1 text-xs shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100"
        title={t.canvas.zoomOut}
      >
        −
      </button>
      <button
        type="button"
        onClick={onFit}
        className="min-w-[48px] rounded px-2 py-1 text-center font-mono text-neutral-700 hover:bg-neutral-100"
        title={t.canvas.zoomFit}
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100"
        title={t.canvas.zoomIn}
      >
        +
      </button>
    </div>
  );
}

function MultiSelectionPopup({ count }: { count: number }) {
  const { t } = useLang();
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const duplicateSelected = useBoardStore((s) => s.duplicateSelected);
  const deleteSelected = useBoardStore((s) => s.deleteSelected);
  const setColorMany = useBoardStore((s) => s.setColorMany);

  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-xl border border-matcha-200 bg-white/95 p-2 text-xs shadow-xl backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="font-medium text-matcha-600">{t.canvas.selectedCount(count)}</span>
        <button
          type="button"
          onClick={() => duplicateSelected()}
          className="rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100"
        >
          {t.canvas.duplicate}
        </button>
        <button
          type="button"
          onClick={() => deleteSelected()}
          className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
        >
          {t.canvas.delete}
        </button>
        <span className="ml-1 flex items-center gap-1">
          {['#111111', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColorMany(selectedIds, c)}
              title={c}
              className="h-4 w-4 rounded-full ring-1 ring-neutral-200 hover:ring-neutral-500"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function GridBackground({ width, height }: { width: number; height: number }) {
  const step = 5 * (96 / 25.4);
  const minor = '#eef0f3';
  const major = '#dfe3ea';
  const lines: React.ReactNode[] = [];
  let i = 1;
  for (let x = step; x < width; x += step, i++) {
    lines.push(
      <Rect key={`v${i}`} x={x} y={0} width={1} height={height} fill={i % 5 === 0 ? major : minor} listening={false} />,
    );
  }
  i = 1;
  for (let y = step; y < height; y += step, i++) {
    lines.push(
      <Rect key={`h${i}`} x={0} y={y} width={width} height={1} fill={i % 5 === 0 ? major : minor} listening={false} />,
    );
  }
  return <>{lines}</>;
}
