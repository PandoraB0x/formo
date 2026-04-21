import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isValidSlug, parsePublishedBoard, type PublishedRow } from '@/lib/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 });
  }
  const db = getDb();
  const row = db
    .prepare('SELECT slug, board_json, created_at FROM published_boards WHERE slug = ?')
    .get(slug) as PublishedRow | undefined;

  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  try {
    const board = parsePublishedBoard(row);
    return NextResponse.json({ board, createdAt: row.created_at });
  } catch {
    return NextResponse.json({ error: 'corrupt' }, { status: 500 });
  }
}
