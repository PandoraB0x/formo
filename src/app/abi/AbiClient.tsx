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
  Layers,
} from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { GUIDE, type StepContent } from './guideContent';

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

// ── Step (desktop: 2-col with screenshot) ────────────────────────────────────
function Step({ n, step }: { n: number; step: StepContent }) {
  const hasImg = !!step.img;
  const flip = step.flip;
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
              <p className="text-base font-bold text-matcha-900 md:text-lg">{step.title}</p>
              <p className="text-sm text-matcha-700/70">{step.desc}</p>
            </div>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed text-matcha-900/85">
            {step.body}
          </div>
        </div>
      </Reveal>
      {step.img && (
        <Reveal delay={n * 40 + 80} from={flip ? 'left' : 'right'}>
          <div className={flip && hasImg ? 'md:order-1' : ''}>
            <Shot src={step.img} alt={step.imgAlt ?? step.title} caption={step.imgCaption} />
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

// ── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      className="mx-5"
      style={{ borderTop: '1px solid rgba(143,181,105,0.2)' }}
    />
  );
}

// Icon map by TOC id — keeps icons wired even though labels come from GUIDE
const SECTION_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  alustamine: Rocket,
  tahvel: Grid3X3,
  sisestamine: PenLine,
  'murrud-astmed': Divide,
  klaviatuur: KeyboardIcon,
  kohandamine: Layers,
  muutmine: Edit3,
  lehed: Files,
  raamatukogu: BookMarked,
  eksport: Download,
  konto: User,
  kiirklahvid: Command,
};

export default function AbiClient() {
  const { lang } = useLang();
  const c = GUIDE[lang];

  const IconFor = (id: string) => {
    const Ico = SECTION_ICONS[id] ?? Rocket;
    return <Ico size={20} />;
  };

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
        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-widest text-matcha-700/60 md:inline">
            {c.navLabel}
          </span>
          <LanguageSwitcher compact />
        </div>
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
              {c.heroPill}
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
              {c.heroTitle}
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-base leading-relaxed text-matcha-800/80 md:mx-0 md:max-w-none md:text-lg">
              {c.heroSub}
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
                  {c.ctaStart} <ArrowRight size={15} />
                </span>
              </Link>
              <a
                href="#alustamine"
                className="flex items-center justify-center gap-2 rounded-xl border border-matcha-300 bg-white/80 px-6 py-3 text-sm font-bold text-matcha-800 backdrop-blur transition hover:border-matcha-500 hover:bg-white"
              >
                {c.ctaView} <ChevronDown size={15} />
              </a>
            </div>
            {/* TOC chips */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {c.toc.map(({ id, label, icon: Icon }) => (
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
                alt={c.heroTitle}
                caption={c.heroCaption}
              />
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── 1. Alustamine ───────────────────────────────────────────────── */}
      <Divider />
      <Section id="alustamine">
        <SectionHead icon={IconFor('alustamine')} title={c.alustamine.title} sub={c.alustamine.sub} />
        {c.alustamine.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 2. Tahvel ja ruudustik ──────────────────────────────────────── */}
      <Divider />
      <Section id="tahvel">
        <SectionHead icon={IconFor('tahvel')} title={c.tahvel.title} sub={c.tahvel.sub} />
        {c.tahvel.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 3. Valemite sisestamine ─────────────────────────────────────── */}
      <Divider />
      <Section id="sisestamine">
        <SectionHead
          icon={IconFor('sisestamine')}
          title={c.sisestamine.head.title}
          sub={c.sisestamine.head.sub}
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
            <p className="text-matcha-900/85">{c.sisestamine.lead}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-[15px] text-matcha-900/85 sm:grid-cols-2">
              {c.sisestamine.cards.map((card) => (
                <li key={card.label} className="rounded-xl bg-matcha-50 px-3 py-2">
                  <span className="text-xs uppercase tracking-wide text-matcha-700/70">
                    {card.label}
                  </span>
                  <div className="mt-0.5 font-mono text-sm">{card.examples}</div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ── 4. Murrud, astmed, indeksid ─────────────────────────────────── */}
      <Divider />
      <Section id="murrud-astmed">
        <SectionHead icon={IconFor('murrud-astmed')} title={c.murrud.title} sub={c.murrud.sub} />
        {c.murrud.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 5. Virtuaalne klaviatuur ────────────────────────────────────── */}
      <Divider />
      <Section id="klaviatuur">
        <SectionHead icon={IconFor('klaviatuur')} title={c.klaviatuur.title} sub={c.klaviatuur.sub} />
        {c.klaviatuur.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 6. Kohandamine ──────────────────────────────────────────────── */}
      <Divider />
      <Section id="kohandamine">
        <SectionHead icon={IconFor('kohandamine')} title={c.kohandamine.title} sub={c.kohandamine.sub} />
        {c.kohandamine.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 7. Muutmine ─────────────────────────────────────────────────── */}
      <Divider />
      <Section id="muutmine">
        <SectionHead icon={IconFor('muutmine')} title={c.muutmine.title} sub={c.muutmine.sub} />
        {c.muutmine.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 8. Mitu lehte ──────────────────────────────────────────────── */}
      <Divider />
      <Section id="lehed">
        <SectionHead icon={IconFor('lehed')} title={c.lehed.title} sub={c.lehed.sub} />
        {c.lehed.steps?.map((step, i) => (
          <Step key={i} n={i + 1} step={step} />
        ))}
      </Section>

      {/* ── 9. Raamatukogu ──────────────────────────────────────────────── */}
      <Divider />
      <Section id="raamatukogu">
        <SectionHead
          icon={IconFor('raamatukogu')}
          title={c.raamatukogu.head.title}
          sub={c.raamatukogu.head.sub}
        />
        <Reveal>
          <Accordion
            icon={<BookMarked size={16} />}
            title={c.raamatukogu.accordionTitle}
            desc={c.raamatukogu.accordionDesc}
            defaultOpen
          >
            {c.raamatukogu.body}
          </Accordion>
        </Reveal>
      </Section>

      {/* ── 10. Eksport ──────────────────────────────────────────────────── */}
      <Divider />
      <Section id="eksport">
        <SectionHead icon={IconFor('eksport')} title={c.eksport.head.title} sub={c.eksport.head.sub} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal from="left">
            <Shot src="/guide/09-png-export.png" alt="PNG" caption={c.eksport.pngCaption} />
          </Reveal>
          <Reveal from="right" delay={80}>
            <Shot src="/guide/10-pdf-export.png" alt="PDF" caption={c.eksport.pdfCaption} />
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {c.eksport.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(143,181,105,0.28)',
                  boxShadow: '0 4px 14px rgba(88,123,62,0.08)',
                }}
              >
                <p className="text-sm font-bold text-matcha-900">{card.title}</p>
                <p className="mt-1 text-sm text-matcha-700/80">{card.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div
          className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
          style={{
            background: 'rgba(254,243,199,0.6)',
            border: '1px solid rgba(234,179,8,0.3)',
            color: '#713f12',
          }}
        >
          {c.eksport.tip}
        </div>
      </Section>

      {/* ── 11. Konto ───────────────────────────────────────────────────── */}
      <Divider />
      <Section id="konto">
        <SectionHead icon={IconFor('konto')} title={c.konto.head.title} sub={c.konto.head.sub} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal from="left">
            <Shot src="/guide/11-login.png" alt="Login" caption={c.konto.loginCaption} />
          </Reveal>
          <Reveal from="right" delay={80}>
            <Shot src="/guide/12-works.png" alt="My works" caption={c.konto.worksCaption} />
          </Reveal>
        </div>
        <Reveal>{c.konto.bullets}</Reveal>
        <div
          className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
          style={{
            background: 'rgba(214,228,193,0.45)',
            border: '1px solid rgba(143,181,105,0.35)',
            color: '#3a5022',
          }}
        >
          {c.konto.note}
        </div>
      </Section>

      {/* ── 12. Kiirklahvid ─────────────────────────────────────────────── */}
      <Divider />
      <Section id="kiirklahvid">
        <SectionHead
          icon={IconFor('kiirklahvid')}
          title={c.kiirklahvid.head.title}
          sub={c.kiirklahvid.head.sub}
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
                style={{ background: 'rgba(214,228,193,0.45)', color: '#3a5022' }}
              >
                <tr>
                  <th className="px-4 py-3">{c.kiirklahvid.colKey}</th>
                  <th className="px-4 py-3">{c.kiirklahvid.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matcha-100 text-matcha-900/85">
                {c.kiirklahvid.rows.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5">{row.keys}</td>
                    <td className="px-4 py-2.5">{row.action}</td>
                  </tr>
                ))}
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
                {c.ctaTitle}
              </h2>
              <p className="relative mt-3 text-sm text-matcha-800/80 md:text-base">
                {c.ctaSub}
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
                    {c.ctaOpen} <ArrowRight size={15} />
                  </span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-matcha-300 bg-white/80 px-6 py-3 text-sm font-bold text-matcha-800 backdrop-blur transition hover:border-matcha-500 hover:bg-white"
                >
                  {c.ctaHome}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 mx-auto max-w-5xl px-5 pb-10 text-center text-xs text-matcha-700/50">
        <span className="inline-flex items-center gap-1.5">
          <HelpCircle size={10} />
          {c.footer}
        </span>
      </footer>
    </div>
  );
}
