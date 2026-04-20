'use client';

import dynamic from 'next/dynamic';

const CanvasClient = dynamic(() => import('@/components/Canvas/CanvasClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
      Tahvli laadimine…
    </div>
  ),
});

export default function AppPage() {
  return <CanvasClient />;
}
