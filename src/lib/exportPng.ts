'use client';

import Konva from 'konva';

export type ExportBackground = 'grid' | 'white' | 'transparent';

interface ExportOptions {
  background: ExportBackground;
  padding?: number;
  pixelRatio?: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

function computeBBox(stage: Konva.Stage): { x: number; y: number; width: number; height: number } {
  const page = stage.findOne<Konva.Rect>('#page-rect');
  if (page) {
    return { x: page.x(), y: page.y(), width: page.width(), height: page.height() };
  }
  const layer = stage.findOne<Konva.Layer>('#elements-layer');
  if (!layer) return { x: 0, y: 0, width: stage.width(), height: stage.height() };
  const box = layer.getClientRect({ skipTransform: false });
  if (!Number.isFinite(box.width) || box.width <= 0) {
    return { x: 0, y: 0, width: stage.width(), height: stage.height() };
  }
  return box;
}

export function exportStageToPng(stage: Konva.Stage, opts: ExportOptions): string {
  const pad = opts.padding ?? 0;
  const pr = opts.pixelRatio ?? 2;

  const tr = stage.findOne<Konva.Transformer>('Transformer');
  const trVisible = tr?.isVisible() ?? false;
  tr?.hide();

  const savedView = {
    x: stage.x(),
    y: stage.y(),
    scaleX: stage.scaleX(),
    scaleY: stage.scaleY(),
  };
  stage.x(0);
  stage.y(0);
  stage.scale({ x: 1, y: 1 });

  const box = opts.bbox ?? computeBBox(stage);

  const bgLayer = stage.findOne<Konva.Layer>('#bg-layer');
  let bgRect: Konva.Rect | null = null;
  let bgLayerHidden = false;

  if (opts.background === 'transparent') {
    if (bgLayer && bgLayer.isVisible()) {
      bgLayer.hide();
      bgLayerHidden = true;
    }
  } else if (opts.background === 'white') {
    if (bgLayer) {
      bgRect = new Konva.Rect({
        x: box.x - pad,
        y: box.y - pad,
        width: box.width + pad * 2,
        height: box.height + pad * 2,
        fill: '#ffffff',
        listening: false,
      });
      bgLayer.add(bgRect);
      bgLayer.batchDraw();
    }
  }

  const dataUrl = stage.toDataURL({
    mimeType: 'image/png',
    x: box.x - pad,
    y: box.y - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
    pixelRatio: pr,
  });

  bgRect?.destroy();
  if (bgLayerHidden) bgLayer?.show();
  if (trVisible) tr?.show();

  stage.x(savedView.x);
  stage.y(savedView.y);
  stage.scale({ x: savedView.scaleX, y: savedView.scaleY });

  bgLayer?.batchDraw();
  stage.findOne<Konva.Layer>('#ui-layer')?.batchDraw();

  return dataUrl;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function copyPngToClipboard(dataUrl: string): Promise<void> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  if (!navigator.clipboard || !('write' in navigator.clipboard)) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
