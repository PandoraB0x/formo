'use client';

import { useState } from 'react';
import type Konva from 'konva';
import { Download, Undo2, Redo2, Trash2, Loader2 } from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';
import { exportAllPagesToPdf, downloadPdf } from '@/lib/exportPdf';
import { clearStudentWork } from '@/lib/worksheetStorage';
import { useLang } from '@/i18n/useLang';

interface Props {
  slug: string;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

function waitFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export default function WorksheetToolbar({ slug, stageRef }: Props) {
  const { t } = useLang();
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const boardName = useBoardStore((s) => s.board.name);
  const [exporting, setExporting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDownloadPdf() {
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);
    try {
      const state = useBoardStore.getState();
      const pdf = await exportAllPagesToPdf(
        stage,
        state.board,
        { background: 'white', pixelRatio: 2 },
        state.setActivePage,
        waitFrame,
      );
      const studentName = (window.prompt(t.worksheet.namePrompt, '') ?? '').trim();
      const suffix = studentName ? `_${studentName.replace(/\s+/g, '_')}` : '';
      downloadPdf(pdf, `${state.board.name}${suffix}.pdf`);
    } catch (err) {
      console.error(err);
      alert(t.worksheet.downloadError);
    } finally {
      setExporting(false);
    }
  }

  function handleResetWork() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 2500);
      return;
    }
    clearStudentWork(slug);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2 border-b border-neutral-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      <div className="flex-1 truncate text-sm font-semibold text-matcha-800">
        {boardName}
        <span className="ml-2 rounded-full bg-matcha-100 px-2 py-0.5 text-[10px] font-medium text-matcha-700">
          {t.worksheet.badge}
        </span>
      </div>

      <button
        type="button"
        onClick={() => undo()}
        title={t.worksheet.undo}
        className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
      >
        <Undo2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => redo()}
        title={t.worksheet.redo}
        className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
      >
        <Redo2 size={16} />
      </button>

      <div className="mx-1 h-6 w-px bg-neutral-200" />

      <button
        type="button"
        onClick={handleResetWork}
        title={t.worksheet.resetTitle}
        className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs transition ${
          confirming
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
      >
        <Trash2 size={14} />
        {confirming ? t.worksheet.resetConfirm : t.worksheet.reset}
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={exporting}
        className="flex items-center gap-1.5 rounded-md bg-matcha-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-matcha-700 disabled:opacity-60"
      >
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {t.worksheet.download}
      </button>
    </div>
  );
}
