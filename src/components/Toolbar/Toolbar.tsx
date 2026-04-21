'use client';

import { useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import {
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Download,
  Upload,
  ClipboardCopy,
  FilePlus,
  Pencil,
  BookMarked,
  BookmarkPlus,
  FolderHeart,
  Share2,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { useBoardStore } from '@/store/useBoardStore';
import {
  exportStageToPng,
  downloadDataUrl,
  copyPngToClipboard,
  type ExportBackground,
} from '@/lib/exportPng';
import {
  saveBoard,
  listSavedBoards,
  loadSavedBoard,
  deleteSavedBoard,
  downloadJson,
  importBoardFromFile,
} from '@/lib/storage';
import {
  exportActivePageToPdf,
  exportAllPagesToPdf,
  exportSelectionToPdf,
  downloadPdf,
} from '@/lib/exportPdf';
import { saveSnippet } from '@/lib/snippetStorage';
import LibraryPanel from '@/components/Library/LibraryPanel';
import SaveSnippetDialog from '@/components/Library/SaveSnippetDialog';
import PublishDialog from '@/components/Toolbar/PublishDialog';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/i18n/useLang';
import Link from 'next/link';
import { FONT_OPTIONS } from '@/lib/constants';
import {
  PAGE_SIZE_OPTIONS,
  ORIENTATION_OPTIONS,
  type PageSize,
  type Orientation,
} from '@/lib/pageSize';

interface Props {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export default function Toolbar({ stageRef }: Props) {
  const { t } = useLang();
  const board = useBoardStore((s) => s.board);
  const activePage = useBoardStore(
    (s) => s.board.pages.find((p) => p.id === s.board.activePageId) ?? s.board.pages[0],
  );
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const hasSelection = selectedIds.length > 0;
  const duplicateSelected = useBoardStore((s) => s.duplicateSelected);
  const deleteSelected = useBoardStore((s) => s.deleteSelected);
  const resetBoard = useBoardStore((s) => s.resetBoard);
  const loadBoard = useBoardStore((s) => s.loadBoard);
  const renameBoard = useBoardStore((s) => s.renameBoard);
  const setBackground = useBoardStore((s) => s.setBackground);
  const setFontFamily = useBoardStore((s) => s.setFontFamily);
  const setPageSize = useBoardStore((s) => s.setPageSize);
  const setOrientation = useBoardStore((s) => s.setOrientation);
  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);
  const pastLen = useBoardStore((s) => s.past.length);
  const futureLen = useBoardStore((s) => s.future.length);

  const [showBoards, setShowBoards] = useState(false);
  const [savedList, setSavedList] = useState<ReturnType<typeof listSavedBoards>>([]);
  const [editingName, setEditingName] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const pdfMenuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setActivePage = useBoardStore((s) => s.setActivePage);
  const buildSnippetFromSelection = useBoardStore((s) => s.buildSnippetFromSelection);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, ready } = useAuth();
  const isGuest = ready && !user;

  useEffect(() => {
    if (!exportMenuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!exportMenuRef.current?.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [exportMenuOpen]);

  useEffect(() => {
    if (!pdfMenuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!pdfMenuRef.current?.contains(e.target as Node)) {
        setPdfMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [pdfMenuOpen]);

  function waitForRender(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }

  function handleExportPdfCurrent(bg: ExportBackground) {
    const stage = stageRef.current;
    if (!stage) return;
    const pdf = exportActivePageToPdf(stage, activePage, { background: bg });
    const idx = board.pages.findIndex((p) => p.id === activePage.id) + 1;
    downloadPdf(pdf, `${board.name.replace(/\s+/g, '_')}_leht${idx}.pdf`);
    setPdfMenuOpen(false);
  }

  async function handleExportPdfAll(bg: ExportBackground) {
    const stage = stageRef.current;
    if (!stage) return;
    setPdfBusy(true);
    try {
      const pdf = await exportAllPagesToPdf(
        stage,
        board,
        { background: bg },
        setActivePage,
        waitForRender,
      );
      downloadPdf(pdf, `${board.name.replace(/\s+/g, '_')}.pdf`);
      showFlash(t.toolbar.pdfReady);
    } catch {
      showFlash(t.toolbar.pdfError);
    } finally {
      setPdfBusy(false);
      setPdfMenuOpen(false);
    }
  }

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1600);
  }

  function handleSave() {
    const stage = stageRef.current;
    let thumb: string | undefined;
    if (stage) {
      try {
        thumb = exportStageToPng(stage, { background: 'white', pixelRatio: 0.4 });
      } catch {
        thumb = undefined;
      }
    }
    saveBoard(board, thumb);
    showFlash(t.toolbar.saved);
  }

  function openBoardsList() {
    setSavedList(listSavedBoards());
    setShowBoards(true);
  }

  function handleLoad(id: string) {
    const loaded = loadSavedBoard(id);
    if (loaded) {
      loadBoard(loaded);
      setShowBoards(false);
      showFlash(`${t.toolbar.opened} ${loaded.name}`);
    }
  }

  function handleDelete(id: string) {
    if (!confirm(t.toolbar.confirmDelete)) return;
    deleteSavedBoard(id);
    setSavedList(listSavedBoards());
  }

  function handleExport(bg: ExportBackground) {
    const stage = stageRef.current;
    if (!stage) return;
    const url = exportStageToPng(stage, { background: bg, pixelRatio: 2 });
    const suffix = bg === 'grid' ? '_ruudud' : bg === 'white' ? '_valge' : '_labipaistev';
    downloadDataUrl(url, `${board.name.replace(/\s+/g, '_')}${suffix}.png`);
    setExportMenuOpen(false);
  }

  function getSelectionBBox(): { x: number; y: number; width: number; height: number } | null {
    const state = useBoardStore.getState();
    const page = state.board.pages.find((p) => p.id === state.board.activePageId) ?? state.board.pages[0];
    const ids = state.selectedIds;
    const chosen = page.elements.filter((e) => ids.includes(e.id));
    if (chosen.length === 0) return null;
    const minX = Math.min(...chosen.map((e) => e.x - e.width / 2));
    const minY = Math.min(...chosen.map((e) => e.y - e.height / 2));
    const maxX = Math.max(...chosen.map((e) => e.x + e.width / 2));
    const maxY = Math.max(...chosen.map((e) => e.y + e.height / 2));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  function handleExportSelectionPng(bg: ExportBackground) {
    const stage = stageRef.current;
    if (!stage) return;
    const bbox = getSelectionBBox();
    if (!bbox) {
      showFlash(t.toolbar.selectFirst);
      return;
    }
    const pad = 8;
    const padded = { x: bbox.x - pad, y: bbox.y - pad, width: bbox.width + pad * 2, height: bbox.height + pad * 2 };
    const url = exportStageToPng(stage, { background: bg, pixelRatio: 2, bbox: padded });
    const suffix = bg === 'grid' ? '_ruudud' : bg === 'white' ? '_valge' : '_labipaistev';
    downloadDataUrl(url, `${board.name.replace(/\s+/g, '_')}_valem${suffix}.png`);
    setExportMenuOpen(false);
  }

  function handleExportSelectionPdf(bg: ExportBackground) {
    const stage = stageRef.current;
    if (!stage) return;
    const bbox = getSelectionBBox();
    if (!bbox) {
      showFlash(t.toolbar.selectFirst);
      return;
    }
    const pdf = exportSelectionToPdf(stage, bbox, { background: bg });
    downloadPdf(pdf, `${board.name.replace(/\s+/g, '_')}_valem.pdf`);
    setPdfMenuOpen(false);
  }

  async function handleCopy() {
    const stage = stageRef.current;
    if (!stage) return;
    try {
      const url = exportStageToPng(stage, { background: 'white', pixelRatio: 2 });
      await copyPngToClipboard(url);
      showFlash(t.toolbar.copied);
    } catch {
      showFlash(t.toolbar.clipboardUnavail);
    }
  }

  function handleExportJson() {
    downloadJson(board);
  }

  function handleImportJsonClick() {
    fileInputRef.current?.click();
  }

  function captureSelectionThumbnail(): string | undefined {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const state = useBoardStore.getState();
    const page = state.board.pages.find((p) => p.id === state.board.activePageId) ?? state.board.pages[0];
    const ids = state.selectedIds;
    const chosen = page.elements.filter((e) => ids.includes(e.id));
    if (chosen.length === 0) return undefined;
    const minX = Math.min(...chosen.map((e) => e.x - e.width / 2));
    const minY = Math.min(...chosen.map((e) => e.y - e.height / 2));
    const maxX = Math.max(...chosen.map((e) => e.x + e.width / 2));
    const maxY = Math.max(...chosen.map((e) => e.y + e.height / 2));
    const pad = 8;
    const sx = stage.x();
    const sy = stage.y();
    const sc = stage.scaleX();
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    try {
      const w = maxX - minX + pad * 2;
      const h = maxY - minY + pad * 2;
      const pixelRatio = Math.min(200 / w, 200 / h, 2);
      return stage.toDataURL({
        x: minX - pad,
        y: minY - pad,
        width: w,
        height: h,
        pixelRatio,
        mimeType: 'image/png',
      });
    } catch {
      return undefined;
    } finally {
      stage.position({ x: sx, y: sy });
      stage.scale({ x: sc, y: sc });
    }
  }

  function handleOpenSaveSnippet() {
    if (!hasSelection) return;
    setSaveDialogOpen(true);
  }

  function handleSaveSnippet(name: string, category: string) {
    const thumbnail = captureSelectionThumbnail();
    const snippet = buildSnippetFromSelection(name, category);
    if (!snippet) {
      showFlash(t.toolbar.selectFirst);
      setSaveDialogOpen(false);
      return;
    }
    saveSnippet({ ...snippet, thumbnail });
    showFlash(`${t.toolbar.savedAs} ${snippet.name}`);
    setSaveDialogOpen(false);
  }

  async function handleImportJsonChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const imported = await importBoardFromFile(file);
      loadBoard(imported);
      showFlash(`${t.toolbar.imported} ${imported.name}`);
    } catch {
      showFlash(t.toolbar.invalidJson);
    }
  }

  return (
    <header className="relative z-10 flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2 text-sm">
      <Link
        href="/"
        className="mr-2 text-base font-semibold tracking-tight text-matcha-700 hover:text-matcha-900"
      >
        Formo
      </Link>

      {editingName ? (
        <input
          autoFocus
          defaultValue={board.name}
          onBlur={(e) => {
            renameBoard(e.target.value.trim() || t.toolbar.unnamed);
            setEditingName(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') setEditingName(false);
          }}
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingName(true)}
          className="flex min-w-0 items-center gap-1 rounded px-2 py-1 text-neutral-700 hover:bg-neutral-100"
        >
          <span className="max-w-[10ch] truncate sm:max-w-none">{board.name}</span>
          <Pencil size={12} className="shrink-0 text-neutral-400" />
        </button>
      )}

      <div className="mx-2 h-5 w-px bg-neutral-200" />

      <ToolButton onClick={undo} disabled={pastLen === 0} label={t.toolbar.undo}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton onClick={redo} disabled={futureLen === 0} label={t.toolbar.redo}>
        <Redo2 size={16} />
      </ToolButton>

      <div className="mx-2 hidden h-5 w-px bg-neutral-200 sm:block" />

      <div className="hidden items-center gap-2 sm:flex">
        <ToolButton onClick={duplicateSelected} disabled={!hasSelection} label={t.toolbar.duplicate}>
          <Copy size={16} />
        </ToolButton>
        <ToolButton
          onClick={deleteSelected}
          disabled={!hasSelection}
          label={t.toolbar.deleteSel}
        >
          <Trash2 size={16} />
        </ToolButton>
      </div>

      <div className="mx-2 hidden h-5 w-px bg-neutral-200 sm:block" />

      <div className="hidden items-center gap-2 sm:flex">
        <ToolButton onClick={resetBoard} label={t.toolbar.newBoard}>
          <FilePlus size={16} />
        </ToolButton>
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-1 rounded-md border border-matcha-200 bg-matcha-50 px-2 py-1 text-xs font-medium text-matcha-800 transition hover:border-matcha-400 hover:bg-matcha-100"
            title={t.toolbar.loginSave}
          >
            <Save size={14} />
            {t.toolbar.loginSaveBtn}
          </Link>
        ) : (
          <>
            <ToolButton onClick={handleSave} label={t.toolbar.save}>
              <Save size={16} />
            </ToolButton>
            <ToolButton onClick={openBoardsList} label={t.toolbar.openBoard}>
              <FolderOpen size={16} />
            </ToolButton>
            <Link
              href="/works"
              title={t.toolbar.myWorks}
              className="flex items-center rounded-md px-2 py-1 text-neutral-700 transition hover:bg-neutral-100"
            >
              <FolderHeart size={16} />
            </Link>
          </>
        )}
      </div>

      <div className="mx-2 hidden h-5 w-px bg-neutral-200 sm:block" />

      <div className="hidden items-center gap-2 sm:flex">
        <ToolButton
          onClick={handleOpenSaveSnippet}
          disabled={!hasSelection}
          label={t.toolbar.saveToLib}
        >
          <BookmarkPlus size={16} />
        </ToolButton>
        <ToolButton onClick={() => setLibraryOpen(true)} label={t.toolbar.library}>
          <BookMarked size={16} />
        </ToolButton>
      </div>

      <div className="mx-2 hidden h-5 w-px bg-neutral-200 sm:block" />

      <label className="hidden items-center gap-1 rounded px-2 py-1 text-xs text-neutral-600 sm:flex">
        {t.toolbar.page}
        <select
          value={activePage.canvas.pageSize}
          onChange={(e) => setPageSize(e.target.value as PageSize)}
          className="rounded border border-neutral-200 bg-white px-1 py-0.5 text-xs"
        >
          {PAGE_SIZE_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          value={activePage.canvas.orientation}
          onChange={(e) => setOrientation(e.target.value as Orientation)}
          className="rounded border border-neutral-200 bg-white px-1 py-0.5 text-xs"
        >
          {ORIENTATION_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="hidden items-center gap-1 rounded px-2 py-1 text-xs text-neutral-600 sm:flex">
        {t.toolbar.bg}
        <select
          value={activePage.canvas.background}
          onChange={(e) => setBackground(e.target.value as 'transparent' | 'white')}
          className="rounded border border-neutral-200 bg-white px-1 py-0.5 text-xs"
        >
          <option value="transparent">{t.toolbar.bgTransparent}</option>
          <option value="white">{t.toolbar.bgWhite}</option>
        </select>
      </label>

      <label className="hidden items-center gap-1 rounded px-2 py-1 text-xs text-neutral-600 sm:flex">
        {t.toolbar.font}
        <select
          value={board.fontFamily ?? 'math'}
          onChange={(e) => setFontFamily(e.target.value)}
          className="rounded border border-neutral-200 bg-white px-1 py-0.5 text-xs"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex">
          <ToolButton onClick={handleCopy} label={t.toolbar.copyPng}>
            <ClipboardCopy size={16} />
          </ToolButton>
        </div>
        <div ref={exportMenuRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setExportMenuOpen((v) => !v)}
            title={t.toolbar.pngMenu}
            className="flex items-center rounded-md px-2 py-1 text-neutral-700 transition hover:bg-neutral-100"
          >
            <Download size={16} />
            <span className="ml-1 text-xs">PNG</span>
          </button>
          {exportMenuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl">
              <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {t.toolbar.fullPage}
              </div>
              <button
                type="button"
                onClick={() => handleExport('grid')}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-sm border border-neutral-200"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />
                {t.toolbar.gridBg}
              </button>
              <button
                type="button"
                onClick={() => handleExport('white')}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-sm border border-neutral-200 bg-white"
                />
                {t.toolbar.whiteBg}
              </button>
              <button
                type="button"
                onClick={() => handleExport('transparent')}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-sm border border-neutral-200"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #d4d4d4 25%, transparent 25%), linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d4 75%), linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)',
                    backgroundSize: '6px 6px',
                    backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0',
                  }}
                />
                {t.toolbar.transparentBg}
              </button>
              <div className="border-y border-neutral-100 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {t.toolbar.selectionArea} {hasSelection ? `(${selectedIds.length})` : ''}
              </div>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleExportSelectionPng('white')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.toolbar.whiteBg}
              </button>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleExportSelectionPng('transparent')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.toolbar.transparentBg}
              </button>
            </div>
          )}
        </div>
        <div ref={pdfMenuRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setPdfMenuOpen((v) => !v)}
            disabled={pdfBusy}
            title={t.toolbar.pdfMenu}
            className="flex items-center rounded-md px-2 py-1 text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40"
          >
            <Download size={16} />
            <span className="ml-1 text-xs">PDF</span>
          </button>
          {pdfMenuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl">
              <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {t.toolbar.thisPage}
              </div>
              <button
                type="button"
                onClick={() => handleExportPdfCurrent('white')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                {t.toolbar.whiteBgPdf}
              </button>
              <button
                type="button"
                onClick={() => handleExportPdfCurrent('transparent')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                {t.toolbar.transparentBg}
              </button>
              <div className="border-y border-neutral-100 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {t.toolbar.allPages} ({board.pages.length})
              </div>
              <button
                type="button"
                onClick={() => handleExportPdfAll('white')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                {t.toolbar.whiteBgPdf}
              </button>
              <button
                type="button"
                onClick={() => handleExportPdfAll('transparent')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50"
              >
                {t.toolbar.transparentBg}
              </button>
              <div className="border-y border-neutral-100 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {t.toolbar.selectionArea} {hasSelection ? `(${selectedIds.length})` : ''}
              </div>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleExportSelectionPdf('white')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.toolbar.whiteBgPdf}
              </button>
              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleExportSelectionPdf('transparent')}
                className="block w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.toolbar.transparentBg}
              </button>
            </div>
          )}
        </div>
        <ToolButton onClick={() => setPublishOpen(true)} label={t.publish.button}>
          <Share2 size={16} />
        </ToolButton>
        <div className="hidden items-center gap-2 sm:flex">
          <ToolButton onClick={handleExportJson} label={t.toolbar.exportJson}>
            <span className="text-xs">JSON</span>
          </ToolButton>
          <ToolButton onClick={handleImportJsonClick} label={t.toolbar.importJson}>
            <Upload size={16} />
          </ToolButton>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportJsonChange}
        />
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          title="Menüü"
          className="flex items-center rounded-md px-2 py-1 text-neutral-700 transition hover:bg-neutral-100 sm:hidden"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {flash && (
        <div className="absolute right-3 top-full mt-1 rounded-md bg-neutral-900 px-3 py-1 text-xs text-white shadow-lg">
          {flash}
        </div>
      )}

      <LibraryPanel open={libraryOpen} onClose={() => setLibraryOpen(false)} stageRef={stageRef} />
      <SaveSnippetDialog
        open={saveDialogOpen}
        onCancel={() => setSaveDialogOpen(false)}
        onSave={handleSaveSnippet}
      />
      <PublishDialog open={publishOpen} board={board} onClose={() => setPublishOpen(false)} />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/40 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="mt-auto max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-800">{board.name}</h3>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            <MobileSection title={t.toolbar.selectionArea}>
              <MobileAction
                icon={<Copy size={18} />}
                label={t.toolbar.duplicate}
                disabled={!hasSelection}
                onClick={() => {
                  duplicateSelected();
                  setMobileMenuOpen(false);
                }}
              />
              <MobileAction
                icon={<Trash2 size={18} />}
                label={t.toolbar.deleteSel}
                disabled={!hasSelection}
                onClick={() => {
                  deleteSelected();
                  setMobileMenuOpen(false);
                }}
              />
              <MobileAction
                icon={<BookmarkPlus size={18} />}
                label={t.toolbar.saveToLib}
                disabled={!hasSelection}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenSaveSnippet();
                }}
              />
            </MobileSection>

            <MobileSection title={t.toolbar.save}>
              <MobileAction
                icon={<FilePlus size={18} />}
                label={t.toolbar.newBoard}
                onClick={() => {
                  resetBoard();
                  setMobileMenuOpen(false);
                }}
              />
              {isGuest ? (
                <Link
                  href="/login"
                  className="flex items-center gap-3 rounded-lg border border-matcha-200 bg-matcha-50 px-3 py-3 text-sm font-medium text-matcha-800"
                >
                  <Save size={18} />
                  {t.toolbar.loginSaveBtn}
                </Link>
              ) : (
                <>
                  <MobileAction
                    icon={<Save size={18} />}
                    label={t.toolbar.save}
                    onClick={() => {
                      handleSave();
                      setMobileMenuOpen(false);
                    }}
                  />
                  <MobileAction
                    icon={<FolderOpen size={18} />}
                    label={t.toolbar.openBoard}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openBoardsList();
                    }}
                  />
                  <Link
                    href="/works"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <FolderHeart size={18} />
                    {t.toolbar.myWorks}
                  </Link>
                </>
              )}
              <MobileAction
                icon={<BookMarked size={18} />}
                label={t.toolbar.library}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLibraryOpen(true);
                }}
              />
            </MobileSection>

            <MobileSection title="Export">
              <MobileAction
                icon={<ClipboardCopy size={18} />}
                label={t.toolbar.copyPng}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCopy();
                }}
              />
              <MobileAction
                icon={<Download size={18} />}
                label={`PNG — ${t.toolbar.whiteBg}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExport('white');
                }}
              />
              <MobileAction
                icon={<Download size={18} />}
                label={`PDF — ${t.toolbar.whiteBgPdf}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExportPdfCurrent('white');
                }}
              />
              <MobileAction
                icon={<Download size={18} />}
                label={t.toolbar.exportJson}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExportJson();
                }}
              />
              <MobileAction
                icon={<Upload size={18} />}
                label={t.toolbar.importJson}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleImportJsonClick();
                }}
              />
            </MobileSection>

            <MobileSection title={t.toolbar.page}>
              <label className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700">
                <span>{t.toolbar.page}</span>
                <select
                  value={activePage.canvas.pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-sm"
                >
                  {PAGE_SIZE_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700">
                <span>{t.toolbar.bg}</span>
                <select
                  value={activePage.canvas.orientation}
                  onChange={(e) => setOrientation(e.target.value as Orientation)}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-sm"
                >
                  {ORIENTATION_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700">
                <span>{t.toolbar.bg}</span>
                <select
                  value={activePage.canvas.background}
                  onChange={(e) => setBackground(e.target.value as 'transparent' | 'white')}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-sm"
                >
                  <option value="transparent">{t.toolbar.bgTransparent}</option>
                  <option value="white">{t.toolbar.bgWhite}</option>
                </select>
              </label>
              <label className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700">
                <span>{t.toolbar.font}</span>
                <select
                  value={board.fontFamily ?? 'math'}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-sm"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </label>
            </MobileSection>
          </div>
        </div>
      )}

      {showBoards && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-10"
          onClick={() => setShowBoards(false)}
        >
          <div
            className="max-h-[80vh] w-[640px] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-lg font-semibold">{t.toolbar.savedBoards}</h2>
            {savedList.length === 0 ? (
              <p className="text-sm text-neutral-500">{t.toolbar.nothingSaved}</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3">
                {savedList.map((entry) => (
                  <li
                    key={entry.id}
                    className="group cursor-pointer overflow-hidden rounded-lg border border-neutral-200 transition hover:border-matcha-400 hover:shadow-md"
                  >
                    <div
                      className="relative flex h-32 w-full items-center justify-center bg-neutral-50"
                      onClick={() => handleLoad(entry.id)}
                    >
                      {entry.thumbnail ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={entry.thumbnail}
                          alt={entry.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-neutral-400">{t.toolbar.noPreview}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-100 p-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleLoad(entry.id)}
                        className="truncate font-medium text-neutral-700"
                      >
                        {entry.name}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function ToolButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="flex items-center rounded-md px-2 py-1 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function MobileAction({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="text-neutral-500">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
