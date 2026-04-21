'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType } from '@/types/element';
import { useBoardStore } from '@/store/useBoardStore';

const NUMERIC_PATTERN = /^[\s\d.,+\-−·×÷()=<>≤≥≠≈±%°πe ]*$/;
const FRACTION_PATTERN = /^\s*([^/]+?)\s*\/\s*([^/]+?)\s*$/;
const TRAILING_DIGITS_PATTERN = /^(.+?)(\d+)$/;

function detectType(text: string): ElementType {
  return NUMERIC_PATTERN.test(text) ? 'number' : 'text';
}

function parseFraction(text: string): { numerator: string; denominator: string } | null {
  const m = text.match(FRACTION_PATTERN);
  if (!m) return null;
  const numerator = m[1].trim();
  const denominator = m[2].trim();
  if (!numerator || !denominator) return null;
  return { numerator, denominator };
}

function splitForScript(text: string): { base: string; tail: string } | null {
  const trimmed = text.trim();
  if (trimmed.length < 2) return null;
  const m = trimmed.match(TRAILING_DIGITS_PATTERN);
  if (m) return { base: m[1], tail: m[2] };
  return { base: trimmed.slice(0, -1), tail: trimmed.slice(-1) };
}

interface Props {
  screenPosition: { x: number; y: number };
  worldPosition: { x: number; y: number };
  onClose: () => void;
}

export default function InlineInput({ screenPosition, worldPosition, onClose }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addElement = useBoardStore((s) => s.addElement);
  const [isMobile, setIsMobile] = useState(false);
  const [vv, setVv] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
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

  const submit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      const frac = parseFraction(trimmed);
      if (frac) {
        addElement('fraction', frac, worldPosition);
      } else {
        addElement(detectType(trimmed), trimmed, worldPosition);
      }
    }
    onClose();
  };

  const submitScript = (direction: 'up' | 'down') => {
    const parts = splitForScript(text);
    if (!parts) return false;
    if (direction === 'up') {
      addElement('power', { base: parts.base, exponent: parts.tail }, worldPosition);
    } else {
      addElement('subscript', { base: parts.base, index: parts.tail }, worldPosition);
    }
    onClose();
    return true;
  };

  const cancel = () => {
    onClose();
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
          onChange={(e) => setText(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            } else if (e.key === 'ArrowUp') {
              if (submitScript('up')) e.preventDefault();
            } else if (e.key === 'ArrowDown') {
              if (submitScript('down')) e.preventDefault();
            }
            e.stopPropagation();
          }}
          placeholder="123.45 / 2x+3 / ↑ aste / ↓ indeks"
          className="rounded-md border-2 border-matcha-400 bg-white px-2.5 py-1 text-2xl font-medium text-neutral-900 shadow-lg outline-none focus:border-matcha-500 focus:ring-2 focus:ring-matcha-200"
          style={{
            width,
            fontFamily: "'Cambria Math', 'Latin Modern Math', Georgia, serif",
          }}
        />
        <div className="pointer-events-none absolute left-0 right-0 top-full mt-1 flex justify-center">
          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] text-white shadow">
            Enter — lisa • ↑ aste • ↓ indeks • Esc — tühista
          </span>
        </div>
      </div>
    </div>
  );
}
