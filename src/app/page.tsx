'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, FolderHeart, LogIn, Rocket, BookOpen } from 'lucide-react';
import { useAuth, logout } from '@/lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const loggedIn = ready && !!user;

  function goWorks() {
    router.push('/works');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafaf5]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgba(143,181,105,0.22), transparent 50%), radial-gradient(circle at 85% 90%, rgba(204,219,174,0.5), transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #2d3d1f 1px, transparent 1px), linear-gradient(to bottom, #2d3d1f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-matcha-500 text-white shadow-sm">
            <Sparkles size={18} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-bold tracking-tight text-matcha-900">Formo</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {loggedIn && user ? (
            <>
              <span className="hidden text-matcha-700 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                }}
                className="rounded-full border border-matcha-200 bg-white px-4 py-1.5 text-sm font-medium text-matcha-700 transition hover:border-matcha-400 hover:text-matcha-900"
              >
                Logi välja
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full border border-matcha-200 bg-white px-4 py-1.5 text-sm font-medium text-matcha-700 transition hover:border-matcha-400 hover:text-matcha-900"
            >
              <LogIn size={14} />
              Logi sisse
            </Link>
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-10 text-center md:pt-20">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-matcha-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-matcha-700">
          <BookOpen size={12} />
          Matemaatika tahvel
        </span>
        <h1 className="text-5xl font-black tracking-tighter text-matcha-900 md:text-7xl">
          Formo
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base text-neutral-600 md:text-lg">
          Kiire visuaalne tahvel valemite, ülesannete ja selgituste loomiseks.
          Lohista, kirjuta, ekspordi PNG või PDF.
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-4 md:grid-cols-2">
          <Link
            href="/app"
            className="group relative overflow-hidden rounded-2xl border border-matcha-300 bg-gradient-to-br from-matcha-400 to-matcha-600 p-[1.5px] shadow-lg shadow-matcha-500/30 transition hover:shadow-matcha-500/50"
          >
            <div className="flex h-full flex-col items-start gap-3 rounded-[14px] bg-gradient-to-br from-matcha-500 to-matcha-700 p-5 text-left text-white md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Rocket size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-lg font-bold md:text-xl">Alusta kohe</p>
                <p className="mt-1 text-sm text-matcha-50/90">
                  Külaliserežiim ilma kontota. Töid ei salvestata — joonista,
                  lae alla ja mine edasi.
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold">
                Ava tahvel
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => (loggedIn ? goWorks() : router.push('/login'))}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-[1.5px] text-left shadow-sm transition hover:border-matcha-300 hover:shadow-md"
          >
            <div className="flex h-full flex-col items-start gap-3 rounded-[14px] bg-white p-5 md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-matcha-100 text-matcha-700">
                <FolderHeart size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-lg font-bold text-matcha-900 md:text-xl">
                  {loggedIn ? 'Minu tööd' : 'Logi sisse'}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {loggedIn
                    ? 'Vaata oma salvestatud tahvleid ja valemite raamatukogu.'
                    : 'Salvesta tööd, ava hiljem uuesti, ehita oma valemite raamatukogu.'}
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-matcha-700">
                {loggedIn ? 'Ava minu tööd' : 'Logi sisse'}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </div>
          </button>
        </div>

        <p className="mt-8 max-w-md text-xs text-neutral-400">
          Külaliserežiim töötab täiesti kohalikult — ühtegi faili
          serverisse ei saadeta.
        </p>
      </section>
    </main>
  );
}
