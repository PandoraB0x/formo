'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Rocket,
  Grid3X3,
  PenLine,
  Divide,
  Keyboard as KeyboardIcon,
  Edit3,
  Files,
  BookMarked,
  Download,
  User,
  Command,
  Eye,
  HelpCircle,
  Lock,
  Lightbulb,
} from 'lucide-react';

// ── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  from = 'bottom',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const tx = from === 'left' ? '-32px, 0' : from === 'right' ? '32px, 0' : '0, 28px';
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0)' : `translate(${tx})`,
        transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

// ── Screenshot (hover glow) ──────────────────────────────────────────────────
function Shot({
  src,
  alt,
  caption,
  width = 1440,
  height = 900,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div>
      <div
        className="group relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          border: '1px solid rgba(143,181,105,0.28)',
          boxShadow:
            '0 18px 52px rgba(88,123,62,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 26px 72px rgba(88,123,62,0.32), 0 0 0 1px rgba(255,255,255,0.7) inset';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 18px 52px rgba(88,123,62,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full"
          sizes="(max-width: 900px) 100vw, 560px"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(168,205,135,0.05) 0%, transparent 30%)',
          }}
        />
      </div>
      {caption && (
        <p
          className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs"
          style={{ color: 'rgba(45,61,31,0.5)' }}
        >
          <Eye size={11} />
          {caption}
        </p>
      )}
    </div>
  );
}

// ── Tip card ─────────────────────────────────────────────────────────────────
function Tip({
  children,
  tone = 'matcha',
}: {
  children: React.ReactNode;
  tone?: 'matcha' | 'sage' | 'sun';
}) {
  const palette =
    tone === 'sage'
      ? { bg: 'rgba(214,228,193,0.45)', bd: 'rgba(143,181,105,0.35)', tc: '#3a5022' }
      : tone === 'sun'
      ? { bg: 'rgba(254,243,199,0.6)', bd: 'rgba(234,179,8,0.3)', tc: '#713f12' }
      : { bg: 'rgba(168,205,135,0.22)', bd: 'rgba(88,123,62,0.3)', tc: '#2d3d1f' };
  return (
    <div
      className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
      style={{ background: palette.bg, border: `1px solid ${palette.bd}`, color: palette.tc }}
    >
      {children}
    </div>
  );
}

// ── Step (desktop: 2-col with screenshot) ────────────────────────────────────
function Step({
  n,
  title,
  desc,
  img,
  imgAlt,
  imgCaption,
  children,
  flip = false,
}: {
  n: number;
  title: string;
  desc: string;
  img?: string;
  imgAlt?: string;
  imgCaption?: string;
  children?: React.ReactNode;
  flip?: boolean;
}) {
  const hasImg = !!img;
  return (
    <div
      className={`flex flex-col gap-5 ${
        hasImg ? 'md:grid md:grid-cols-2 md:gap-10 md:items-start' : ''
      }`}
    >
      <Reveal delay={n * 40} from={flip ? 'right' : 'left'}>
        <div className={`space-y-4 ${flip && hasImg ? 'md:order-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #a8cd87, #587b3e)' }}
            >
              {n}
            </div>
            <div>
              <p className="text-base font-bold text-matcha-900 md:text-lg">{title}</p>
              <p className="text-sm text-matcha-700/70">{desc}</p>
            </div>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed text-matcha-900/85">
            {children}
          </div>
        </div>
      </Reveal>
      {img && (
        <Reveal delay={n * 40 + 80} from={flip ? 'left' : 'right'}>
          <div className={flip && hasImg ? 'md:order-1' : ''}>
            <Shot src={img} alt={imgAlt ?? title} caption={imgCaption} />
          </div>
        </Reveal>
      )}
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-xl space-y-10 px-5 py-14 md:max-w-4xl md:space-y-14${
        id ? ' scroll-mt-20' : ''
      }`}
    >
      {children}
    </section>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHead({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Reveal>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #a8cd87, #587b3e)' }}
          >
            {icon}
          </div>
          <h2
            className="text-2xl font-black tracking-tight md:text-3xl"
            style={{
              background: 'linear-gradient(135deg, #587b3e 0%, #6f9850 50%, #8fb569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-matcha-700/80 md:text-base">{sub}</p>
      </div>
    </Reveal>
  );
}

// ── Accordion (collapsible rich block) ───────────────────────────────────────
function Accordion({
  icon,
  title,
  desc,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: open ? 'rgba(214,228,193,0.35)' : 'rgba(255,255,255,0.9)',
        border: `1px solid ${open ? 'rgba(143,181,105,0.55)' : 'rgba(143,181,105,0.22)'}`,
        boxShadow: '0 4px 14px rgba(88,123,62,0.08)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="min-h-[44px] w-full text-left"
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #a8cd87, #6f9850)' }}
          >
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-matcha-900 md:text-base">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-matcha-700/70 md:text-sm">{desc}</p>
          </div>
          <span
            className="shrink-0 text-matcha-600 transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDown size={18} />
          </span>
        </div>
      </button>
      {open && (
        <div className="space-y-3 px-5 pb-5 pt-1 text-[15px] leading-relaxed text-matcha-900/85">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Keyboard key ────────────────────────────────────────────────────────────
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="mx-0.5 inline-block rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-matcha-900"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(143,181,105,0.4)',
        boxShadow: '0 1px 2px rgba(88,123,62,0.12)',
      }}
    >
      {children}
    </kbd>
  );
}

// ── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      className="mx-5"
      style={{ borderTop: '1px solid rgba(143,181,105,0.2)' }}
    />
  );
}

const TOC = [
  { id: 'alustamine', label: 'Alustamine', icon: Rocket },
  { id: 'tahvel', label: 'Tahvel', icon: Grid3X3 },
  { id: 'sisestamine', label: 'Sisestamine', icon: PenLine },
  { id: 'murrud-astmed', label: 'Murrud', icon: Divide },
  { id: 'klaviatuur', label: 'Klaviatuur', icon: KeyboardIcon },
  { id: 'muutmine', label: 'Muutmine', icon: Edit3 },
  { id: 'lehed', label: 'Lehed', icon: Files },
  { id: 'raamatukogu', label: 'Raamatukogu', icon: BookMarked },
  { id: 'eksport', label: 'Eksport', icon: Download },
  { id: 'konto', label: 'Konto', icon: User },
  { id: 'kiirklahvid', label: 'Kiirklahvid', icon: Command },
];

export default function AbiClient() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: '#fafaf5' }}
    >
      {/* Ambient matcha blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-matcha-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-[40%] h-[520px] w-[520px] rounded-full bg-matcha-400/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-matcha-200/30 blur-3xl"
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #2d3d1f 1px, transparent 1px), linear-gradient(to bottom, #2d3d1f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Sticky nav ──────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(250,250,245,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(143,181,105,0.2)',
        }}
      >
        <Link
          href="/"
          className="-ml-2 flex min-h-[44px] items-center gap-2 px-2 text-xl font-black"
          style={{
            background: 'linear-gradient(135deg, #587b3e, #8fb569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <ArrowLeft size={16} className="text-matcha-600" strokeWidth={2.5} />
          Formo
        </Link>
        <span className="hidden text-xs uppercase tracking-widest text-matcha-700/60 md:inline">
          Juhend
        </span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-2xl overflow-hidden px-5 pb-14 pt-16 text-center md:max-w-5xl md:pt-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 520,
            height: 520,
            transform: 'translate(-50%,-50%)',
            background:
              'radial-gradient(circle, rgba(143,181,105,0.2) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 md:grid md:grid-cols-2 md:items-center md:gap-12 md:text-left">
          <div>
            <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-matcha-700/70 md:justify-start">
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: 'rgba(143,181,105,0.25)' }}
              >
                <Sparkles size={11} className="text-matcha-600" />
              </span>
              Matemaatika tahvel
            </p>
            <h1
              className="mb-5 text-[2.4rem] font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
              style={{
                background:
                  'linear-gradient(135deg, #587b3e 0%, #6f9850 40%, #a8cd87 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kuidas Formot kasutada
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-base leading-relaxed text-matcha-800/80 md:mx-0 md:max-w-none md:text-lg">
              Visuaalne tahvel õpetajatele ja õpilastele. Loo valemeid, murde, astmeid — kõik
              brauseris, ilma installimata. Ekspordi PNG või PDF formaadis.
            </p>
            <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/app"
                className="group rounded-xl p-[1.5px] shadow-md shadow-matcha-600/25 transition-shadow hover:shadow-matcha-600/40"
                style={{ background: 'linear-gradient(135deg, #a8cd87, #587b3e)' }}
              >
                <span
                  className="flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold text-white transition-transform group-hover:translate-x-0.5"
                  style={{ background: 'linear-gradient(135deg, #8fb569, #587b3e)' }}
                >
                  Alusta kohe <ArrowRight size={15} />
                </span>
              </Link>
              <a
                href="#alustamine"
                className="flex items-center justify-center gap-2 rounded-xl border border-matcha-300 bg-white/80 px-6 py-3 text-sm font-bold text-matcha-800 backdrop-blur transition hover:border-matcha-500 hover:bg-white"
              >
                Vaata juhendit <ChevronDown size={15} />
              </a>
            </div>
            {/* TOC chips */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {TOC.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-matcha-800 transition-colors hover:text-matcha-900"
                  style={{
                    background: 'rgba(214,228,193,0.5)',
                    border: '1px solid rgba(143,181,105,0.3)',
                  }}
                >
                  <Icon size={11} className="text-matcha-600" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 hidden md:mt-0 md:block">
            <Reveal from="right" delay={150}>
              <Shot
                src="/guide/01-landing.png"
                alt="Formo esileht"
                caption="Formo esileht — sealt see algab"
              />
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── 1. Alustamine ───────────────────────────────────────────────── */}
      <Divider />
      <Section id="alustamine">
        <SectionHead
          icon={<Rocket size={20} />}
          title="1. Alustamine"
          sub="Kaks viisi, kuidas Formot avada — kiirelt või kontoga."
        />
        <Step
          n={1}
          title="Ava esileht"
          desc="Kaks nuppu — vali, mis sobib."
          img="/guide/01-landing.png"
          imgAlt="Formo esileht"
          imgCaption="Esileht: Alusta kohe või Logi sisse"
        >
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-matcha-900">Alusta kohe</strong> — avad tahvli
              külaliserežiimis. Loo, ekspordi, sulge. Midagi ei salvestata.
            </li>
            <li>
              <strong className="text-matcha-900">Logi sisse</strong> — sisesta e-post ja nimi.
              Seejärel saab tahvleid salvestada ja hiljem avada lehelt{' '}
              <em>Minu tööd</em>.
            </li>
          </ul>
          <Tip tone="matcha">
            <div className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
              <span>
                Külaliserežiim töötab täiesti kohalikult — ei ühtegi päringut serverile.
              </span>
            </div>
          </Tip>
        </Step>
      </Section>

      {/* ── 2. Tahvel ja ruudustik ──────────────────────────────────────── */}
      <Divider />
      <Section id="tahvel">
        <SectionHead
          icon={<Grid3X3 size={20} />}
          title="2. Tahvel ja ruudustik"
          sub="Koolivihku imiteeriv 5 × 5 mm ruudustik — mõõda ja joonda täpselt."
        />
        <Step
          n={1}
          title="Ruudustik nagu päris paberil"
          desc="Iga ruut = 5 mm. Iga viies joon = 25 mm (tumedam)."
          img="/guide/02-canvas.png"
          imgAlt="Tahvli ruudustik"
          imgCaption="A4 leht 5 mm ruudustikuga"
          flip
        >
          <p>
            Vaikimisi on leht A4 püsti. Toolbar'ist saab vahetada A3, A5 või kohandatud
            mõõtudele ning muuta orientatsiooni püsti ↔ rõhtsalt.
          </p>
          <Tip tone="sage">
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
              <span>
                Navigeerimine: hoia <Kbd>Space</Kbd> ja lohista tahvlit; kasuta
                kerimisratast suurendamiseks või vähendamiseks.
              </span>
            </div>
          </Tip>
        </Step>
      </Section>

      {/* ── 3. Valemite sisestamine ─────────────────────────────────────── */}
      <Divider />
      <Section id="sisestamine">
        <SectionHead
          icon={<PenLine size={20} />}
          title="3. Valemite sisestamine"
          sub="Topeltklõps + kirjuta + Enter. Formo tunneb avaldised ise ära."
        />
        <Reveal>
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(143,181,105,0.25)',
              boxShadow: '0 6px 20px rgba(88,123,62,0.08)',
            }}
          >
            <p className="text-matcha-900/85">
              Tee topeltklõps tühjale kohale — avaneb sisestuskast. Kirjuta arv, muutuja või
              avaldis ja vajuta <Kbd>Enter</Kbd>. Formo tunneb automaatselt ära:
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-[15px] text-matcha-900/85 sm:grid-cols-2">
              <li className="rounded-xl bg-matcha-50 px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-matcha-700/70">
                  Arvud
                </span>
                <div className="mt-0.5 font-mono text-sm">5 · 3.14 · −2</div>
              </li>
              <li className="rounded-xl bg-matcha-50 px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-matcha-700/70">
                  Muutujad
                </span>
                <div className="mt-0.5 font-mono text-sm">x · sin · log</div>
              </li>
              <li className="rounded-xl bg-matcha-50 px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-matcha-700/70">
                  Operaatorid
                </span>
                <div className="mt-0.5 font-mono text-sm">+ − · =</div>
              </li>
              <li className="rounded-xl bg-matcha-50 px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-matcha-700/70">
                  Avaldised
                </span>
                <div className="mt-0.5 font-mono text-sm">x+y · 2a−3b</div>
              </li>
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ── 4. Murrud, astmed, indeksid ─────────────────────────────────── */}
      <Divider />
      <Section id="murrud-astmed">
        <SectionHead
          icon={<Divide size={20} />}
          title="4. Murrud, astmed ja indeksid"
          sub="Keeruka vormistuse saad lihtsa lühendiga."
        />

        <Step
          n={1}
          title="Murd"
          desc="3/4 + Enter → vertikaalne murd."
          img="/guide/03-fraction.png"
          imgAlt="Murd 3/4"
          imgCaption="Lugeja üles, nimetaja alla"
        >
          <p>
            Kirjuta <code className="rounded bg-matcha-100 px-1.5 py-0.5 font-mono">3/4</code>{' '}
            ja vajuta <Kbd>Enter</Kbd>. Formo tõstab lugeja üles ja nimetaja alla
            automaatselt.
          </p>
        </Step>

        <Step
          n={2}
          title="Aste (ruut, kuup jne)"
          desc="42 + ↑ → 4². Töötab tähtedega ka."
          img="/guide/04-power.png"
          imgAlt="Aste 4²"
          imgCaption="Vajutus üles muudab viimase märgi astendajaks"
          flip
        >
          <p>
            Kirjuta <code className="rounded bg-matcha-100 px-1.5 py-0.5 font-mono">42</code>{' '}
            ja vajuta <Kbd>↑</Kbd> — tulemus on 4². Sama töötab tähtedega:{' '}
            <code className="rounded bg-matcha-100 px-1.5 py-0.5 font-mono">x2</code> +{' '}
            <Kbd>↑</Kbd> → x².
          </p>
        </Step>

        <Step
          n={3}
          title="Alaindeks (keemia, matemaatika)"
          desc="H2 + ↓ → H₂."
          img="/guide/05-subscript.png"
          imgAlt="Indeks H₂"
          imgCaption="Vajutus alla muudab viimase märgi alaindeksiks"
        >
          <p>
            Kirjuta <code className="rounded bg-matcha-100 px-1.5 py-0.5 font-mono">H2</code>{' '}
            ja vajuta <Kbd>↓</Kbd> — tulemus on H₂. Ideaalne keemia valemite jaoks.
          </p>
        </Step>
      </Section>

      {/* ── 5. Virtuaalne klaviatuur ────────────────────────────────────── */}
      <Divider />
      <Section id="klaviatuur">
        <SectionHead
          icon={<KeyboardIcon size={20} />}
          title="5. Virtuaalne klaviatuur"
          sub="Numbrid, operaatorid, funktsioonid — ühe klõpsu kaugusel."
        />
        <Step
          n={1}
          title="Kasuta paneeli vasakul"
          desc="Sobib puuteekraanile ja kui ei soovi klaviatuurivahetust."
          img="/guide/06-keyboard.png"
          imgAlt="Virtuaalne klaviatuur"
          imgCaption="Klõpsa nupule — element lisatakse tahvlile"
        >
          <p>
            Ekraani vasakus servas on paneel numbrite, operaatorite, funktsioonide ja
            erisümbolitega. Klõpsa nupule — element ilmub kohe tahvlile.
          </p>
          <Tip tone="matcha">
            Mugav iPadil ja puuteekraaniga sülearvutitel — ei pea pidevalt
            klaviatuurilayoute vahetama.
          </Tip>
        </Step>
      </Section>

      {/* ── 6. Muutmine ─────────────────────────────────────────────────── */}
      <Divider />
      <Section id="muutmine">
        <SectionHead
          icon={<Edit3 size={20} />}
          title="6. Elementide muutmine"
          sub="Värv, suurus, dubleerimine ja kustutamine ühes paneelis."
        />
        <Step
          n={1}
          title="Kiirpaneel valitud elemendi juures"
          desc="Klõpsa elementi ja muuda seda kohe."
          img="/guide/07-popup.png"
          imgAlt="Redigeerimise paneel"
          imgCaption="Kiirpaneel ilmub valitud elemendi kõrvale"
          flip
        >
          <ul className="ml-5 list-disc space-y-1">
            <li>Värvi muutmine (6 esmaselget varianti)</li>
            <li>Šrifti suurus</li>
            <li>Kopeeri (dubleeri)</li>
            <li>
              Kustuta (või vajuta <Kbd>Delete</Kbd>)
            </li>
          </ul>
          <Tip tone="sage">
            Mitme elemendi valimiseks hoia <Kbd>Shift</Kbd> ja klõpsa, või tõmba hiirega
            valimisraam. <Kbd>⌘</Kbd>+<Kbd>A</Kbd> valib kõik lehel olevad elemendid.
          </Tip>
        </Step>
      </Section>

      {/* ── 7. Mitu lehte ──────────────────────────────────────────────── */}
      <Divider />
      <Section id="lehed">
        <SectionHead
          icon={<Files size={20} />}
          title="7. Mitu lehte"
          sub="Üks tahvel, palju lehti — nagu töövihikul."
        />
        <Step
          n={1}
          title="Lehtede paneel paremal"
          desc="Klõpsa + uue lehe lisamiseks, hõlju kaardil dubleerimiseks/kustutamiseks."
          img="/guide/08-pages.png"
          imgAlt="Lehtede paneel"
          imgCaption="Iga leht on eraldi tööpind"
        >
          <p>
            Igal tahvlil võib olla mitu lehte. Eksport töötab nii üksiku lehe kui kõigi
            lehtede kohta — saad koostada mitmeleheline tööleht ja salvestada kõik ühe
            PDF-ina.
          </p>
        </Step>
      </Section>

      {/* ── 8. Raamatukogu ──────────────────────────────────────────────── */}
      <Divider />
      <Section id="raamatukogu">
        <SectionHead
          icon={<BookMarked size={20} />}
          title="8. Valemite raamatukogu"
          sub="Salvesta tihedalt kasutatavad valemid ja taaskasuta ühe klõpsuga."
        />
        <Reveal>
          <Accordion
            icon={<BookMarked size={16} />}
            title="Kuidas valemit salvestada ja uuesti kasutada?"
            desc="Kolm sammu — nimi, kategooria, valmis."
            defaultOpen
          >
            <ol className="ml-5 list-decimal space-y-2">
              <li>Vali element või elementide grupp tahvlil.</li>
              <li>
                Klõpsa toolbar'ist <strong>Salvesta valem raamatukokku</strong>{' '}
                (järjehoidja+ ikoon).
              </li>
              <li>
                Anna nimi ja kategooria (nt <em>Geomeetria</em>, <em>Füüsika</em>).
              </li>
            </ol>
            <p>
              Hiljem ava raamatukogu (järjehoidja ikoon), otsi nime järgi või filtreeri
              kategooria järgi ning klõpsa — valem ilmub kohe tahvlile.
            </p>
          </Accordion>
        </Reveal>
      </Section>

      {/* ── 9. Eksport ──────────────────────────────────────────────────── */}
      <Divider />
      <Section id="eksport">
        <SectionHead
          icon={<Download size={20} />}
          title="9. Eksport: PNG ja PDF"
          sub="Kolm taset: kogu leht, kõik lehed või ainult valitud ala."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal from="left">
            <Shot
              src="/guide/09-png-export.png"
              alt="PNG ekspordi menüü"
              caption="PNG menüü: Kogu leht või Valitud ala"
            />
          </Reveal>
          <Reveal from="right" delay={80}>
            <Shot
              src="/guide/10-pdf-export.png"
              alt="PDF ekspordi menüü"
              caption="PDF menüü: See leht, Kõik lehed, Valitud ala"
            />
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(143,181,105,0.28)',
                boxShadow: '0 4px 14px rgba(88,123,62,0.08)',
              }}
            >
              <p className="text-sm font-bold text-matcha-900">Kogu leht</p>
              <p className="mt-1 text-sm text-matcha-700/80">
                Terve tahvli leht pildina või PDF-ina. Kolm tausta: ruudustikuga, valge või
                läbipaistev.
              </p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(143,181,105,0.28)',
                boxShadow: '0 4px 14px rgba(88,123,62,0.08)',
              }}
            >
              <p className="text-sm font-bold text-matcha-900">Kõik lehed</p>
              <p className="mt-1 text-sm text-matcha-700/80">
                Ainult PDF. Mitmeleheline fail — üks leht = üks lehekülg.
              </p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(143,181,105,0.28)',
                boxShadow: '0 4px 14px rgba(88,123,62,0.08)',
              }}
            >
              <p className="text-sm font-bold text-matcha-900">Valitud ala</p>
              <p className="mt-1 text-sm text-matcha-700/80">
                Ainult valitud elemendid, tihedalt kärbitud. Ideaalne üksiku valemi
                kopeerimiseks töölehte.
              </p>
            </div>
          </div>
        </Reveal>
        <Tip tone="sun">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="mt-0.5 shrink-0" />
            <span>
              <strong>Vihje:</strong> läbipaistva taustaga PNG sobib mistahes
              slaiditaustaga — ei pea muretsema esitluse värvi pärast.
            </span>
          </div>
        </Tip>
      </Section>

      {/* ── 10. Konto ───────────────────────────────────────────────────── */}
      <Divider />
      <Section id="konto">
        <SectionHead
          icon={<User size={20} />}
          title="10. Konto ja salvestamine"
          sub="Logi sisse e-postiga, et tahvlid püsivalt alles jääksid."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal from="left">
            <Shot
              src="/guide/11-login.png"
              alt="Sisselogimise vorm"
              caption="Sisselogimine: e-post + nimi"
            />
          </Reveal>
          <Reveal from="right" delay={80}>
            <Shot
              src="/guide/12-works.png"
              alt="Minu tööd"
              caption="Minu tööd — salvestatud tahvlite galerii"
            />
          </Reveal>
        </div>
        <Reveal>
          <ul className="ml-5 list-disc space-y-1 text-matcha-900/85">
            <li>
              <strong className="text-matcha-900">Salvesta</strong> — salvestab praeguse
              tahvli koos kõigi lehtedega.
            </li>
            <li>
              <strong className="text-matcha-900">Ava tahvel</strong> — kuvab salvestatud
              tahvlite loendi.
            </li>
            <li>
              <strong className="text-matcha-900">Minu tööd</strong> — kõigi tahvlite
              galerii eelvaadetega.
            </li>
          </ul>
        </Reveal>
        <Tip tone="sage">
          <strong>Märkus:</strong> praegu salvestatakse tahvlid sinu brauserisse
          (localStorage). Kui vahetad arvutit või puhastad brauseri andmed, lähevad need
          kaduma. Impordi/ekspordi JSON funktsiooni abil saad tahvli ühest brauserist
          teise viia.
        </Tip>
      </Section>

      {/* ── 11. Kiirklahvid ─────────────────────────────────────────────── */}
      <Divider />
      <Section id="kiirklahvid">
        <SectionHead
          icon={<Command size={20} />}
          title="11. Kiirklahvid"
          sub="Kõik kombinatsioonid ühes kohas."
        />
        <Reveal>
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(143,181,105,0.28)',
              boxShadow: '0 6px 20px rgba(88,123,62,0.08)',
            }}
          >
            <table className="w-full text-sm">
              <thead
                className="text-left text-xs uppercase tracking-wide"
                style={{
                  background: 'rgba(214,228,193,0.45)',
                  color: '#3a5022',
                }}
              >
                <tr>
                  <th className="px-4 py-3">Klahv</th>
                  <th className="px-4 py-3">Tegevus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matcha-100 text-matcha-900/85">
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>Enter</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Lisa sisestatud valem</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>↑</Kbd> pärast numbrit/tähte
                  </td>
                  <td className="px-4 py-2.5">Tee astmeks (4² , x²)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>↓</Kbd> pärast numbrit/tähte
                  </td>
                  <td className="px-4 py-2.5">Tee alaindeksiks (H₂)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>A</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Vali kõik</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Kopeeri valitud</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Kleebi</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>D</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Dubleeri valitud</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Võta tagasi</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Tee uuesti</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>Delete</Kbd> / <Kbd>Backspace</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Kustuta valitud</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>Esc</Kbd>
                  </td>
                  <td className="px-4 py-2.5">Tühista valik</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <Kbd>Space</Kbd> + hiir
                  </td>
                  <td className="px-4 py-2.5">Liiguta tahvlit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Divider />
      <Section>
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl p-[1.5px] shadow-lg shadow-matcha-600/20"
            style={{ background: 'linear-gradient(135deg, #a8cd87, #8fb569 50%, #587b3e)' }}
          >
            <div
              className="relative rounded-[22px] px-6 py-10 text-center md:py-14"
              style={{ background: 'linear-gradient(135deg, #fafaf5, #eef2e4)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-matcha-300/40 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-24 h-60 w-60 rounded-full bg-matcha-400/30 blur-3xl"
              />
              <h2
                className="relative text-3xl font-black tracking-tight md:text-4xl"
                style={{
                  background: 'linear-gradient(135deg, #587b3e, #6f9850 50%, #a8cd87)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Valmis proovima?
              </h2>
              <p className="relative mt-3 text-sm text-matcha-800/80 md:text-base">
                Ava tahvel ja alusta — ei mingit seadistamist.
              </p>
              <div className="relative mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/app"
                  className="group rounded-xl p-[1.5px] shadow-md shadow-matcha-600/25 transition-shadow hover:shadow-matcha-600/40"
                  style={{ background: 'linear-gradient(135deg, #a8cd87, #587b3e)' }}
                >
                  <span
                    className="flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #8fb569, #587b3e)' }}
                  >
                    Ava tahvel <ArrowRight size={15} />
                  </span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-matcha-300 bg-white/80 px-6 py-3 text-sm font-bold text-matcha-800 backdrop-blur transition hover:border-matcha-500 hover:bg-white"
                >
                  Esilehele
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 mx-auto max-w-5xl px-5 pb-10 text-center text-xs text-matcha-700/50">
        <span className="inline-flex items-center gap-1.5">
          <HelpCircle size={10} />
          Formo — matemaatika tahvel eesti õpetajatele
        </span>
      </footer>
    </div>
  );
}
