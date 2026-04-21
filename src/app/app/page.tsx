'use client';

import dynamic from 'next/dynamic';
import { useLang } from '@/i18n/useLang';

const CanvasClient = dynamic(() => import('@/components/Canvas/CanvasClient'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

function LoadingScreen() {
  const { t } = useLang();
  return (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
      {t.works.loading}
    </div>
  );
}

export default function AppPage() {
  return <CanvasClient />;
}
