'use client';

import { MousePointer2, Pencil } from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';

const PEN_COLORS = ['#111111', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const PEN_WIDTHS = [2, 3, 5, 8, 12];

export default function PenToolbar() {
  const tool = useBoardStore((s) => s.tool);
  const setTool = useBoardStore((s) => s.setTool);
  const penColor = useBoardStore((s) => s.penColor);
  const setPenColor = useBoardStore((s) => s.setPenColor);
  const penWidth = useBoardStore((s) => s.penWidth);
  const setPenWidth = useBoardStore((s) => s.setPenWidth);

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-20 flex flex-col gap-1.5">
      <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/95 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setTool('select')}
          title="Valik (V)"
          className={`flex items-center gap-1 rounded px-2 py-1.5 text-xs ${
            tool === 'select'
              ? 'bg-matcha-600 text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <MousePointer2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => setTool('pen')}
          title="Pliiats (P)"
          className={`flex items-center gap-1 rounded px-2 py-1.5 text-xs ${
            tool === 'pen'
              ? 'bg-matcha-600 text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <Pencil size={14} />
        </button>
      </div>

      {tool === 'pen' && (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/95 p-2 shadow-lg backdrop-blur">
          <div className="flex items-center gap-1">
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPenColor(c)}
                title={c}
                className={`h-5 w-5 rounded-full transition ${
                  penColor.toLowerCase() === c.toLowerCase()
                    ? 'ring-2 ring-neutral-800 ring-offset-1'
                    : 'ring-1 ring-neutral-200 hover:ring-neutral-500'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="mx-1 h-5 w-px bg-neutral-200" />

          <div className="flex items-center gap-1">
            {PEN_WIDTHS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setPenWidth(w)}
                title={`${w}px`}
                className={`flex h-6 w-6 items-center justify-center rounded transition ${
                  penWidth === w ? 'bg-neutral-200' : 'hover:bg-neutral-100'
                }`}
              >
                <span
                  className="rounded-full bg-neutral-800"
                  style={{ width: Math.min(w + 2, 14), height: Math.min(w + 2, 14) }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
