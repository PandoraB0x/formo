'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Rocket,
  FolderHeart,
  LogIn,
  HelpCircle,
  Sparkles,
  PenLine,
} from 'lucide-react';
import { useAuth, logout } from '@/lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const loggedIn = ready && !!user;

  function goWorks() {
    router.push('/works');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafaf5] p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-matcha-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-matcha-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-matcha-200/30 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #2d3d1f 1px, transparent 1px), linear-gradient(to bottom, #2d3d1f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        {loggedIn && user ? (
          <>
            <span className="hidden text-sm text-matcha-700 sm:inline">{user.name}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full border border-matcha-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-matcha-700 backdrop-blur transition hover:border-matcha-400 hover:text-matcha-900"
            >
              Logi välja
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full border border-matcha-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-matcha-700 backdrop-blur transition hover:border-matcha-400 hover:text-matcha-900"
          >
            <LogIn size={14} />
            Logi sisse
          </Link>
        )}
      </div>

      <div className="relative z-10 mb-10 text-center md:mb-14">
        <h1 className="bg-gradient-to-br from-matcha-500 via-matcha-600 to-matcha-800 bg-clip-text text-8xl font-black leading-none tracking-tighter text-transparent md:text-9xl">
          Formo
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-matcha-500" />
          <div className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-matcha-700/70">
            <Sparkles size={11} className="text-matcha-500" />
            Matemaatika tahvel
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-matcha-500" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-4 md:max-w-2xl md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
        <Link href="/app" className="group block">
          <div
            className="h-full rounded-2xl p-[1.5px] shadow-lg shadow-matcha-600/25 transition-shadow group-hover:shadow-matcha-600/40"
            style={{ background: 'linear-gradient(135deg, #a8cd87, #8fb569 50%, #587b3e)' }}
          >
            <div
              className="flex h-full w-full items-center gap-4 rounded-[14px] px-5 py-5 transition-colors md:py-6"
              style={{ background: 'linear-gradient(135deg, #8fb569, #587b3e)' }}
            >
              <div
                className="flex shrink-0 items-center justify-center rounded-2xl shadow-md"
                style={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #a8cd87, #6f9850)',
                }}
              >
                <Rocket size={32} className="text-white" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold leading-tight text-white md:text-2xl">
                  Alusta kohe
                </p>
                <p className="mt-0.5 text-sm leading-snug text-matcha-50/90 md:text-base">
                  Külaliserežiim ilma kontota
                </p>
              </div>
              <ArrowRight
                size={18}
                className="ml-auto shrink-0 text-matcha-50 transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => (loggedIn ? goWorks() : router.push('/login'))}
          className="group block text-left"
        >
          <div
            className="h-full rounded-2xl p-[1.5px] shadow-lg shadow-matcha-400/20 transition-shadow group-hover:shadow-matcha-500/40"
            style={{ background: 'linear-gradient(135deg, #d6e4c1, #8fb569 50%, #6f9850)' }}
          >
            <div className="flex h-full w-full items-center gap-4 rounded-[14px] bg-white px-5 py-5 transition-colors group-hover:bg-matcha-50/60 md:py-6">
              <div
                className="flex shrink-0 items-center justify-center rounded-2xl shadow-md"
                style={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #d6e4c1, #8fb569)',
                }}
              >
                {loggedIn ? (
                  <FolderHeart size={32} className="text-white" strokeWidth={2.2} />
                ) : (
                  <PenLine size={32} className="text-white" strokeWidth={2.2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold leading-tight text-matcha-900 md:text-2xl">
                  {loggedIn ? 'Minu tööd' : 'Logi sisse'}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-matcha-700/80 md:text-base">
                  {loggedIn
                    ? 'Salvestatud tahvlid ja valemid'
                    : 'Salvesta tahvleid ja valemeid'}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="ml-auto shrink-0 text-matcha-500 transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </button>
      </div>

      <div className="relative z-10 mt-8">
        <Link
          href="/abi"
          className="group flex min-h-[44px] items-center gap-2 px-3 py-2.5 text-sm font-medium text-matcha-700/85 transition-colors"
        >
          <HelpCircle size={14} className="text-matcha-500/70 transition-colors group-hover:text-matcha-700" />
          <span className="transition-colors group-hover:text-matcha-900">
            Vaata juhendit
          </span>
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <p className="relative z-10 mt-6 flex items-center gap-1.5 text-xs text-neutral-400">
        <Sparkles size={10} />
        Külaliserežiim töötab täiesti kohalikult
      </p>
    </div>
  );
}
