'use client';

import dynamic from 'next/dynamic';
import type { Board } from '@/types/element';

const BoardViewer = dynamic(() => import('./BoardViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-400">…</div>
  ),
});

export default function BoardViewerClient({ board }: { board: Board }) {
  return <BoardViewer board={board} />;
}
