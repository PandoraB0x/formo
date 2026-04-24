'use client';

import { useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import {
  splitForScript,
  toSuperscript,
  toSubscript,
  normalizePlusMinus,
} from '@/lib/mathParse';

interface Props {
  elementId: string;
  initialContent: string;
  screenPosition: { x: number; y: number };
  onClose: () => void;
}

export default function SqrtEditor({ elementId, initialContent, screenPosition, onClose }: Props) {
  const stripped = initialContent.replace(/□/g, '');
  const [text, setText] = useState(stripped);
  const [isMobile, setIsMobile] = useState(false);
  const [vv, setVv] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const originalRef = useRef(initialContent);
  const historyPushedRef = useRef(false);

  const setSqrtContentSilent = useBoardStore((s) => s.setSqrtContentSilent);
  const beginHistory = useBoardStore((s) => s.beginHistory);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stripped !== originalRef.current) {
      beginHistory();
      historyPushedRef.current = true;
      setSqrtContentSilent(elementId, stripped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setVv(null);
      return;
    }
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      setVv({
        top: viewport.offsetTop,
        left: viewport.offsetLeft,
        width: viewport.width,
      });
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, [isMobile]);

  const applySilent = (next: string) => {
    if (!historyPushedRef.current) {
      beginHistory();
      historyPushedRef.current = true;
    }
    setSqrtContentSilent(elementId, next);
  };

  const submit = () => {
    onClose();
  };

  const cancel = () => {
    if (historyPushedRef.current) {
      setSqrtContentSilent(elementId, originalRef.current);
    }
    onClose();
  };

  const applyScript = (direction: 'up' | 'down'): boolean => {
    const parts = splitForScript(text);
    if (!parts) return false;
    const converted = direction === 'up' ? toSuperscript(parts.tail) : toSubscript(parts.tail);
    const next = parts.base + converted;
    setText(next);
    applySilent(next);
    return true;
  };

  const desktopWidth = Math.max(160, text.length * 16 + 40);
  const mobileWidth = vv ? Math.min(vv.width - 32, 520) : 320;
  const width = isMobile ? mobileWidth : desktopWidth;

  const wrapperStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        left: vv ? vv.left + vv.width / 2 : '50%',
        top: vv ? vv.top + 16 : 16,
        transform: 'translateX(-50%)',
        zIndex: 60,
      }
    : {
        left: screenPosition.x,
        top: screenPosition.y,
        transform: 'translate(-50%, -50%)',
      };

  return (
    <div
      className={isMobile ? '' : 'absolute z-30'}
      style={wrapperStyle}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            const normalized = normalizePlusMinus(raw);
            if (normalized !== raw) {
              const caret = e.target.selectionStart ?? normalized.length;
              const delta = raw.length - normalized.length;
              setText(normalized);
              applySilent(normalized);
              queueMicrotask(() => {
                inputRef.current?.setSelectionRange(caret - delta, caret - delta);
              });
            } else {
              setText(raw);
              applySilent(raw);
            }
          }}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            } else if (e.key === 'ArrowUp') {
              if (applyScript('up')) e.preventDefault();
            } else if (e.key === 'ArrowDown') {
              if (applyScript('down')) e.preventDefault();
            }
            e.stopPropagation();
          }}
          placeholder="avaldis juure alla · ↑ aste · ↓ indeks"
          className="rounded-md border-2 border-matcha-400 bg-white px-2.5 py-1 text-2xl font-medium text-neutral-900 shadow-lg outline-none focus:border-matcha-500 focus:ring-2 focus:ring-matcha-200"
          style={{
            width,
            fontFamily: "'Cambria Math', 'Latin Modern Math', Georgia, serif",
          }}
        />
        <div className="pointer-events-none absolute left-0 right-0 top-full mt-1 flex justify-center">
          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] text-white shadow">
            Enter — salvesta • Esc — tühista
          </span>
        </div>
      </div>
    </div>
  );
}
