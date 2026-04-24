import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { isValidSlug, parsePublishedBoard, type PublishedRow } from '@/lib/publish';
import type { Board } from '@/types/element';
import WorksheetShell from './WorksheetShell';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorksheetPage({ params }: Props) {
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
      <WorksheetShell slug={slug} board={board} />
    </main>
  );
}
