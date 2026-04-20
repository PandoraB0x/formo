'use client';

import { jsPDF } from 'jspdf';
import type Konva from 'konva';
import type { Board, Page } from '@/types/element';
import type { ExportBackground } from './exportPng';
import { exportStageToPng } from './exportPng';
import { getPageMillimeters } from './pageSize';

interface SinglePageOptions {
  background: ExportBackground;
  pixelRatio?: number;
}

function pageFormat(page: Page) {
  const mm = getPageMillimeters(page.canvas.pageSize, page.canvas.orientation, {
    w: page.canvas.width,
    h: page.canvas.height,
  });
  return { mm, orientation: mm.w >= mm.h ? 'landscape' : 'portrait' } as const;
}

export function exportActivePageToPdf(
  stage: Konva.Stage,
  page: Page,
  options: SinglePageOptions,
): jsPDF {
  const png = exportStageToPng(stage, {
    background: options.background,
    pixelRatio: options.pixelRatio ?? 2,
  });
  const { mm, orientation } = pageFormat(page);
  const pdf = new jsPDF({ orientation, unit: 'mm', format: [mm.w, mm.h] });
  pdf.addImage(png, 'PNG', 0, 0, mm.w, mm.h);
  return pdf;
}

export async function exportAllPagesToPdf(
  stage: Konva.Stage,
  board: Board,
  options: SinglePageOptions,
  setActivePage: (id: string) => void,
  waitForRender: () => Promise<void>,
): Promise<jsPDF> {
  const originalActiveId = board.activePageId;
  let pdf: jsPDF | null = null;

  for (let i = 0; i < board.pages.length; i++) {
    const page = board.pages[i];
    setActivePage(page.id);
    await waitForRender();

    const png = exportStageToPng(stage, {
      background: options.background,
      pixelRatio: options.pixelRatio ?? 2,
    });
    const { mm, orientation } = pageFormat(page);

    if (!pdf) {
      pdf = new jsPDF({ orientation, unit: 'mm', format: [mm.w, mm.h] });
    } else {
      pdf.addPage([mm.w, mm.h], orientation);
    }
    pdf.addImage(png, 'PNG', 0, 0, mm.w, mm.h);
  }

  setActivePage(originalActiveId);
  await waitForRender();

  if (!pdf) throw new Error('No pages to export');
  return pdf;
}

export function downloadPdf(pdf: jsPDF, filename: string): void {
  pdf.save(filename);
}
