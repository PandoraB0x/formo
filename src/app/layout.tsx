import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formo — Matemaatika tahvel',
  description: 'Kiire visuaalne tahvel matemaatika õpetajatele',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
