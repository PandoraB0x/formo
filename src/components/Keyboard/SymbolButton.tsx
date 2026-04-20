'use client';

import type { KeyboardKey } from '@/types/element';
import { keyId } from './keyboardConfig';
import ShapePreviewSVG from './ShapePreviewSVG';
import { Star, X } from 'lucide-react';

interface Props {
  k: KeyboardKey;
  onPress: (k: KeyboardKey) => void;
  onTogglePin?: (k: KeyboardKey) => void;
  onRemove?: (k: KeyboardKey) => void;
  pinned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SymbolButton({
  k,
  onPress,
  onTogglePin,
  onRemove,
  pinned,
  size = 'md',
}: Props) {
  const dim = size === 'sm' ? 'h-9 text-sm' : size === 'lg' ? 'h-16 text-xl' : 'h-11 text-sm';
  const shapeDim = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7';
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-formo-key', keyId(k));
        e.dataTransfer.effectAllowed = 'copy';
      }}
      onClick={() => onPress(k)}
      onContextMenu={(e) => {
        e.preventDefault();
        onTogglePin?.(k);
      }}
      title={
        (k.hint ? `${k.label} — ${k.hint}` : k.label) +
        (onTogglePin ? '  (parem klõps — kinnita)' : '')
      }
      className={`group/sym relative flex ${dim} items-center justify-center overflow-hidden rounded-md border bg-white px-1 font-medium text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow active:translate-y-0 ${
        pinned
          ? 'border-amber-300 hover:border-amber-400'
          : 'border-neutral-200 hover:border-neutral-400'
      }`}
    >
      {k.type === 'shape' && typeof k.content === 'string' ? (
        <ShapePreviewSVG shapeId={k.content} className={`${shapeDim} text-matcha-700`} />
      ) : (
        <span className="truncate">{k.label}</span>
      )}
      {pinned && (
        <Star size={8} className="absolute right-1 top-1 fill-amber-400 text-amber-400" />
      )}
      {onRemove && (
        <span
          role="button"
          aria-label="Eemalda"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(k);
          }}
          className="absolute right-0 top-0 hidden h-4 w-4 items-center justify-center rounded-bl-md bg-neutral-100 text-neutral-500 hover:bg-red-100 hover:text-red-600 group-hover/sym:flex"
        >
          <X size={10} />
        </span>
      )}
    </button>
  );
}
