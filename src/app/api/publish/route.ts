import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateSlug, looksLikeBoardShape } from '@/lib/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const body = payload as { board?: unknown };
  if (!body || typeof body !== 'object' || !looksLikeBoardShape(body.board)) {
    return NextResponse.json({ error: 'invalid_board' }, { status: 400 });
  }

  const db = getDb();
  const insert = db.prepare(
    'INSERT INTO published_boards (slug, board_json, created_at) VALUES (?, ?, ?)',
  );
  const boardJson = JSON.stringify(body.board);
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 6; attempt++) {
    const slug = generateSlug();
    try {
      insert.run(slug, boardJson, now);
      return NextResponse.json({ slug }, { status: 201 });
    } catch (err) {
      if ((err as { code?: string }).code !== 'SQLITE_CONSTRAINT_PRIMARYKEY') throw err;
    }
  }
  return NextResponse.json({ error: 'slug_collision' }, { status: 500 });
}
