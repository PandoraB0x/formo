'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import type { Board, Page } from '@/types/element';
import ElementRenderer from './ElementRenderer';

interface Props {
  board: Board;
}

const PADDING = 40;

export default function BoardViewer({ board }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  const page: Page = board.pages[activeIdx] ?? board.pages[0];
  const pageWidth = page.canvas.width;
  const pageHeight = page.canvas.height;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const { scale, offsetX, offsetY } = useMemo(() => {
    if (size.width === 0 || size.height === 0) {
      return { scale: 1, offsetX: 0, offsetY: 0 };
    }
    const sx = (size.width - PADDING * 2) / pageWidth;
    const sy = (size.height - PADDING * 2) / pageHeight;
    const s = Math.max(0.05, Math.min(sx, sy, 1));
    return {
      scale: s,
      offsetX: (size.width - pageWidth * s) / 2,
      offsetY: (size.height - pageHeight * s) / 2,
    };
  }, [size, pageWidth, pageHeight]);

  const sorted = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);
  const bgColor = page.canvas.background === 'white' ? '#ffffff' : '#fdfdfd';

  return (
    <div className="flex h-full w-full flex-col">
      {board.pages.length > 1 && (
        <div className="flex items-center justify-center gap-2 border-b border-neutral-200 bg-white/90 px-4 py-2 text-xs text-neutral-600 backdrop-blur">
          {board.pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={
                i === activeIdx
                  ? 'rounded-md bg-matcha-600 px-3 py-1 text-white'
                  : 'rounded-md border border-neutral-200 px-3 py-1 hover:bg-neutral-50'
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      <div ref={containerRef} className="relative flex-1 bg-neutral-100">
        {size.width > 0 && size.height > 0 && (
          <Stage width={size.width} height={size.height} x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
            <Layer listening={false}>
              <Rect x={0} y={0} width={pageWidth} height={pageHeight} fill={bgColor} stroke="#d4d4d8" strokeWidth={1} />
              <GridBackground width={pageWidth} height={pageHeight} />
            </Layer>
            <Layer listening={false}>
              {sorted.map((el) => (
                <Group
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  rotation={el.rotation}
                  offsetX={el.width / 2}
                  offsetY={el.height / 2}
                >
                  <ElementRenderer element={el} fontFamilyId={board.fontFamily} />
                </Group>
              ))}
            </Layer>
          </Stage>
        )}
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
