'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Loader2, Share2 } from 'lucide-react';
import type { Board } from '@/types/element';
import { useLang } from '@/i18n/useLang';

interface Props {
  open: boolean;
  board: Board;
  onClose: () => void;
}

type State =
  | { kind: 'idle' }
  | { kind: 'publishing' }
  | { kind: 'published'; url: string }
  | { kind: 'error'; msg: string };

export default function PublishDialog({ open, board, onClose }: Props) {
  const { t } = useLang();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setState({ kind: 'idle' });
      setCopied(false);
    }
  }, [open]);

  async function publish() {
    setState({ kind: 'publishing' });
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      const { slug } = (await res.json()) as { slug: string };
      const url = `${window.location.origin}/b/${slug}`;
      setState({ kind: 'published', url });
    } catch (err) {
      setState({
        kind: 'error',
        msg: err instanceof Error ? err.message : 'unknown_error',
      });
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-matcha-800">
          <Share2 size={18} />
          <h2 className="text-lg font-semibold">{t.publish.title}</h2>
        </div>
        <p className="mt-2 text-sm text-neutral-600">{t.publish.subtitle}</p>

        {state.kind === 'idle' && (
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
            >
              {t.publish.cancel}
            </button>
            <button
              type="button"
              onClick={publish}
              className="flex items-center gap-2 rounded-md bg-matcha-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-matcha-700"
            >
              <Share2 size={14} />
              {t.publish.createLink}
            </button>
          </div>
        )}

        {state.kind === 'publishing' && (
          <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 size={14} className="animate-spin" />
            {t.publish.publishing}
          </div>
        )}

        {state.kind === 'error' && (
          <>
            <div className="mt-5 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {t.publish.error}: {state.msg}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setState({ kind: 'idle' })}
                className="rounded-md bg-matcha-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-matcha-700"
              >
                {t.publish.tryAgain}
              </button>
            </div>
          </>
        )}

        {state.kind === 'published' && (
          <>
            <div className="mt-5 flex items-stretch gap-2">
              <input
                readOnly
                value={state.url}
                className="flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-mono text-neutral-700"
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                type="button"
                onClick={() => copy(state.url)}
                title={t.publish.copy}
                className="flex items-center gap-1 rounded-md bg-matcha-600 px-3 text-sm font-semibold text-white transition hover:bg-matcha-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t.publish.copied : t.publish.copy}
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-500">{t.publish.hint}</p>
            <div className="mt-5 flex items-center justify-between">
              <a
                href={state.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-matcha-700 hover:text-matcha-900"
              >
                <ExternalLink size={14} />
                {t.publish.open}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                {t.publish.close}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
