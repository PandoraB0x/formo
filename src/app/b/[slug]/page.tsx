import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { isValidSlug, parsePublishedBoard, type PublishedRow } from '@/lib/publish';
import type { Board } from '@/types/element';
import BoardViewerClient from '@/components/Canvas/BoardViewerClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublishedBoardPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const db = getDb();
  const row = db
    .prepare('SELECT slug, board_json, created_at FROM published_boards WHERE slug = ?')
    .get(slug) as PublishedRow | undefined;

  if (!row) notFound();

  let board: Board;
  try {
    board = parsePublishedBoard(row);
  } catch {
    notFound();
  }

  return (
    <main className="flex h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-semibold tracking-tight text-matcha-700 hover:text-matcha-900">
            Formo
          </Link>
          <span className="h-4 w-px bg-neutral-200" />
          <span className="truncate text-sm font-medium text-neutral-800">{board.name}</span>
        </div>
        <Link
          href="/app"
          className="rounded-md bg-matcha-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-matcha-700"
        >
          Ava oma Formo
        </Link>
      </header>
      <div className="flex-1 overflow-hidden">
        <BoardViewerClient board={board} />
      </div>
    </main>
  );
}
