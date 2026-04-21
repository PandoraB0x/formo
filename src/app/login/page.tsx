'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, LogIn, Sparkles } from 'lucide-react';
import { loginAs } from '@/lib/auth';
import { useLang } from '@/i18n/useLang';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError(t.login.error);
      return;
    }
    loginAs(trimmed, name.trim() || undefined);
    router.push('/works');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafaf5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(143,181,105,0.25), transparent 55%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 self-start text-sm text-matcha-700 transition hover:text-matcha-900"
        >
          <ArrowLeft size={14} />
          {t.nav.back}
        </Link>

        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-matcha-500 text-white shadow-sm">
            <Sparkles size={18} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-bold tracking-tight text-matcha-900">
            Formo
          </span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-matcha-900">{t.login.title}</h1>
          <p className="mt-1 text-sm text-neutral-600">{t.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="text-xs font-medium text-neutral-600">
              {t.login.email}
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={t.login.emailPh}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-matcha-500 focus:ring-2 focus:ring-matcha-200"
              />
            </label>

            <label className="text-xs font-medium text-neutral-600">
              {t.login.name} <span className="text-neutral-400">{t.login.nameOptional}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.login.namePh}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-matcha-500 focus:ring-2 focus:ring-matcha-200"
              />
            </label>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-matcha-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-matcha-700"
            >
              <LogIn size={16} />
              {t.login.submit}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          {t.login.guestHint}{' '}
          <Link href="/app" className="text-matcha-700 underline-offset-2 hover:underline">
            {t.login.guestLink}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
