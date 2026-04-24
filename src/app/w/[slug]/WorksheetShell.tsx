'use client';

import dynamic from 'next/dynamic';
import type { Board } from '@/types/element';

const WorksheetClient = dynamic(() => import('@/components/Worksheet/WorksheetClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
      Laeb töölehte...
    </div>
  ),
});

interface Props {
  slug: string;
  board: Board;
}

export default function WorksheetShell({ slug, board }: Props) {
  return <WorksheetClient slug={slug} board={board} />;
}
