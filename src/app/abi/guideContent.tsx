'use client';

import type { ReactNode } from 'react';
import {
  Rocket,
  Grid3X3,
  PenLine,
  Divide,
  Keyboard as KeyboardIcon,
  Layers,
  Edit3,
  Files,
  BookMarked,
  Download,
  User,
  Command,
  Lock,
  Lightbulb,
  Eye,
  Trash2,
  Type,
  type LucideIcon,
} from 'lucide-react';
import type { Lang } from '@/i18n/types';

// ── Kbd for content bodies ───────────────────────────────────────────────────
function K({ children }: { children: ReactNode }) {
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
function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-matcha-100 px-1.5 py-0.5 font-mono">{children}</code>
  );
}
function B({ children }: { children: ReactNode }) {
  return <strong className="text-matcha-900">{children}</strong>;
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface StepContent {
  title: string;
  desc: string;
  img?: string;
  imgAlt?: string;
  imgCaption?: string;
  flip?: boolean;
  body: ReactNode;
}

export interface SectionContent {
  title: string;
  sub: string;
  steps?: StepContent[];
  custom?: ReactNode;
}

export interface TocItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface InputTypeCard {
  label: string;
  examples: string;
}

export interface ExportCard {
  title: string;
  body: string;
}

export interface ShortcutRow {
  keys: ReactNode;
  action: string;
}

export interface GuideContent {
  navLabel: string;
  heroPill: string;
  heroTitle: string;
  heroSub: string;
  ctaStart: string;
  ctaView: string;
  heroCaption: string;
  toc: TocItem[];
  alustamine: SectionContent;
  tahvel: SectionContent;
  sisestamine: {
    head: { title: string; sub: string };
    lead: ReactNode;
    cards: InputTypeCard[];
  };
  murrud: SectionContent;
  klaviatuur: SectionContent;
  kohandamine: SectionContent;
  muutmine: SectionContent;
  lehed: SectionContent;
  raamatukogu: {
    head: { title: string; sub: string };
    accordionTitle: string;
    accordionDesc: string;
    body: ReactNode;
  };
  eksport: {
    head: { title: string; sub: string };
    pngCaption: string;
    pdfCaption: string;
    cards: ExportCard[];
    tip: ReactNode;
  };
  konto: {
    head: { title: string; sub: string };
    loginCaption: string;
    worksCaption: string;
    bullets: ReactNode;
    note: ReactNode;
  };
  kiirklahvid: {
    head: { title: string; sub: string };
    colKey: string;
    colAction: string;
    rows: ShortcutRow[];
  };
  ctaTitle: string;
  ctaSub: string;
  ctaOpen: string;
  ctaHome: string;
  footer: string;
}

// ── Shortcut rows (same JSX across languages, localized action text) ─────────
function rows(t: {
  enter: string;
  up: string;
  down: string;
  selectAll: string;
  copy: string;
  paste: string;
  dup: string;
  undo: string;
  redo: string;
  del: string;
  esc: string;
  pan: string;
  afterLetter: string;
}): ShortcutRow[] {
  return [
    { keys: <K>Enter</K>, action: t.enter },
    {
      keys: (
        <>
          <K>↑</K> {t.afterLetter}
        </>
      ),
      action: t.up,
    },
    {
      keys: (
        <>
          <K>↓</K> {t.afterLetter}
        </>
      ),
      action: t.down,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>A</K>
        </>
      ),
      action: t.selectAll,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>C</K>
        </>
      ),
      action: t.copy,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>V</K>
        </>
      ),
      action: t.paste,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>D</K>
        </>
      ),
      action: t.dup,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>Z</K>
        </>
      ),
      action: t.undo,
    },
    {
      keys: (
        <>
          <K>⌘</K>/<K>Ctrl</K> + <K>Shift</K> + <K>Z</K>
        </>
      ),
      action: t.redo,
    },
    {
      keys: (
        <>
          <K>Delete</K> / <K>Backspace</K>
        </>
      ),
      action: t.del,
    },
    { keys: <K>Esc</K>, action: t.esc },
    {
      keys: (
        <>
          <K>Space</K> + {t.pan}
        </>
      ),
      action: t.pan,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTONIAN
// ═══════════════════════════════════════════════════════════════════════════
const ET: GuideContent = {
  navLabel: 'Juhend',
  heroPill: 'Matemaatika tahvel',
  heroTitle: 'Kuidas Formot kasutada',
  heroSub:
    'Visuaalne tahvel õpetajatele ja õpilastele. Loo valemeid, murde, astmeid — kõik brauseris, ilma installimata. Ekspordi PNG või PDF formaadis.',
  ctaStart: 'Alusta kohe',
  ctaView: 'Vaata juhendit',
  heroCaption: 'Formo esileht — sealt see algab',
  toc: [
    { id: 'alustamine', label: 'Alustamine', icon: Rocket },
    { id: 'tahvel', label: 'Tahvel', icon: Grid3X3 },
    { id: 'sisestamine', label: 'Sisestamine', icon: PenLine },
    { id: 'murrud-astmed', label: 'Murrud', icon: Divide },
    { id: 'klaviatuur', label: 'Klaviatuur', icon: KeyboardIcon },
    { id: 'kohandamine', label: 'Kohandamine', icon: Layers },
    { id: 'muutmine', label: 'Muutmine', icon: Edit3 },
    { id: 'lehed', label: 'Lehed', icon: Files },
    { id: 'raamatukogu', label: 'Raamatukogu', icon: BookMarked },
    { id: 'eksport', label: 'Eksport', icon: Download },
    { id: 'konto', label: 'Konto', icon: User },
    { id: 'kiirklahvid', label: 'Kiirklahvid', icon: Command },
  ],
  alustamine: {
    title: '1. Alustamine',
    sub: 'Kaks viisi, kuidas Formot avada — kiirelt või kontoga.',
    steps: [
      {
        title: 'Ava esileht',
        desc: 'Kaks nuppu — vali, mis sobib.',
        img: '/guide/01-landing.png',
        imgAlt: 'Formo esileht',
        imgCaption: 'Esileht: Alusta kohe või Logi sisse',
        body: (
          <>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <B>Alusta kohe</B> — avad tahvli külaliserežiimis. Loo, ekspordi, sulge. Midagi ei salvestata.
              </li>
              <li>
                <B>Logi sisse</B> — sisesta e-post ja nimi. Seejärel saab tahvleid salvestada ja hiljem avada lehelt <em>Minu tööd</em>.
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>Külaliserežiim töötab täiesti kohalikult — ei ühtegi päringut serverile.</span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  tahvel: {
    title: '2. Tahvel ja ruudustik',
    sub: 'Koolivihku imiteeriv 5 × 5 mm ruudustik — mõõda ja joonda täpselt.',
    steps: [
      {
        title: 'Ruudustik nagu päris paberil',
        desc: 'Iga ruut = 5 mm. Iga viies joon = 25 mm (tumedam).',
        img: '/guide/02-canvas.png',
        imgAlt: 'Tahvli ruudustik',
        imgCaption: 'A4 leht 5 mm ruudustikuga',
        flip: true,
        body: (
          <>
            <p>
              Vaikimisi on leht A4 püsti. Toolbar&apos;ist saab vahetada A3, A5 või kohandatud mõõtudele ning muuta orientatsiooni püsti ↔ rõhtsalt.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Navigeerimine: hoia <K>Space</K> ja lohista tahvlit; kasuta kerimisratast suurendamiseks või vähendamiseks.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  sisestamine: {
    head: {
      title: '3. Valemite sisestamine',
      sub: 'Topeltklõps + kirjuta + Enter. Formo tunneb avaldised ise ära.',
    },
    lead: (
      <>
        Tee topeltklõps tühjale kohale — avaneb sisestuskast. Kirjuta arv, muutuja või avaldis ja vajuta <K>Enter</K>. Formo tunneb automaatselt ära:
      </>
    ),
    cards: [
      { label: 'Arvud', examples: '5 · 3.14 · −2' },
      { label: 'Muutujad', examples: 'x · sin · log' },
      { label: 'Operaatorid', examples: '+ − · =' },
      { label: 'Avaldised', examples: 'x+y · 2a−3b' },
    ],
  },
  murrud: {
    title: '4. Murrud, astmed ja indeksid',
    sub: 'Keeruka vormistuse saad lihtsa lühendiga.',
    steps: [
      {
        title: 'Murd',
        desc: '3/4 + Enter → vertikaalne murd.',
        img: '/guide/03-fraction.png',
        imgAlt: 'Murd 3/4',
        imgCaption: 'Lugeja üles, nimetaja alla',
        body: (
          <p>
            Kirjuta <C>3/4</C> ja vajuta <K>Enter</K>. Formo tõstab lugeja üles ja nimetaja alla automaatselt.
          </p>
        ),
      },
      {
        title: 'Aste (ruut, kuup jne)',
        desc: '42 + ↑ → 4². Töötab tähtedega ka.',
        img: '/guide/04-power.png',
        imgAlt: 'Aste 4²',
        imgCaption: 'Vajutus üles muudab viimase märgi astendajaks',
        flip: true,
        body: (
          <p>
            Kirjuta <C>42</C> ja vajuta <K>↑</K> — tulemus on 4². Sama töötab tähtedega: <C>x2</C> + <K>↑</K> → x².
          </p>
        ),
      },
      {
        title: 'Alaindeks (keemia, matemaatika)',
        desc: 'H2 + ↓ → H₂.',
        img: '/guide/05-subscript.png',
        imgAlt: 'Indeks H₂',
        imgCaption: 'Vajutus alla muudab viimase märgi alaindeksiks',
        body: (
          <p>
            Kirjuta <C>H2</C> ja vajuta <K>↓</K> — tulemus on H₂. Ideaalne keemia valemite jaoks.
          </p>
        ),
      },
    ],
  },
  klaviatuur: {
    title: '5. Virtuaalne klaviatuur',
    sub: 'Numbrid, operaatorid, funktsioonid — ühe klõpsu kaugusel.',
    steps: [
      {
        title: 'Kategooriate riba ülal',
        desc: 'Numbrid, tehted, kreeka tähed, geomeetria, kujundid — kõik ühes ribas.',
        img: '/guide/06-keyboard.png',
        imgAlt: 'Virtuaalne klaviatuur',
        imgCaption: 'Klõpsa kategooriale — avaneb sümbolipaneel',
        body: (
          <>
            <p>
              Tahvli kohal on kategooriate riba: <B>Numbrid</B>, <B>Tehted</B>, <B>Võrdlus</B>, <B>Trigonomeetria</B>, kreeka tähed, geomeetria, kujundid ja palju muud. Klõpsa pillil — avaneb sümbolite paneel. Klõpsa sümbolil — element ilmub tahvlile.
            </p>
            <p>
              Otsi vajalikku sümbolit <K>Otsi</K> nupu kaudu: tipi „sin&quot;, „alfa&quot;, „→&quot; või „kuup&quot; — Formo leiab selle kõikidest kategooriatest korraga.
            </p>
          </>
        ),
      },
      {
        title: 'Kinnitatud sümbolid vasakul',
        desc: 'Sinu lemmikud on alati käeulatuses.',
        flip: true,
        body: (
          <>
            <p>
              Klõpsa mis tahes sümbolil <B>paremklahviga</B> (või lohista seda) — see ilmub ekraani vasakus servas asuvasse kinnitatud sümbolite dokki. Seal näidatakse ka viimati kasutatud sümboleid.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              Mugav iPadil ja puuteekraaniga sülearvutitel — ei pea pidevalt klaviatuurilayoute vahetama.
            </div>
          </>
        ),
      },
    ],
  },
  kohandamine: {
    title: '6. Klaviatuuri kohandamine',
    sub: 'Muuda kategooriate järjekorda ja loo igale klassile oma komplekt.',
    steps: [
      {
        title: 'Kategooriate järjekord',
        desc: 'Lohista pille nii, nagu sulle mugav — järjekord salvestub sinu kontole.',
        body: (
          <>
            <p>
              Logi sisse ja vajuta kategooriate riba lõpus nuppu{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-xs font-medium">
                <Edit3 size={11} /> Muuda järjekorda
              </span>
              . Pillid muutuvad katkendjoonega ja neid saab lohistada — sõrmega tahvelarvutis või hiirega arvutis. Lohista <B>Trigonomeetria</B> ettepoole, kui kasutad seda sagedasti; <B>Logaritmid</B> tagaplaanile, kui vähem.
            </p>
            <p>
              Vajuta{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-matcha-500 bg-matcha-500 px-2 py-0.5 text-xs font-medium text-white">
                <Eye size={11} /> Valmis
              </span>{' '}
              (või <K>Esc</K>), et lõpetada — järjekord jääb meelde ka pärast brauseri sulgemist.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Funktsioon on saadaval ainult sisse logitud kasutajatele — iga õpetaja järjekord on tema oma, ka kui keegi teine sama arvutit kasutab.
                </span>
              </div>
            </div>
          </>
        ),
      },
      {
        title: 'Sümbolite komplektid klassidele',
        desc: 'Üks komplekt 5. klassile, teine 11. klassile — vaheta ühe klõpsuga.',
        flip: true,
        body: (
          <>
            <p>
              Kategooriate riba alguses on <B>Komplektid</B> nupp (<Layers size={11} className="inline text-matcha-700" /> ikooniga). Klõpsa sellel — avaneb menüü, kust saad:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>valida <em>Kõik kategooriad</em> (vaikimisi — kõik on näha);</li>
              <li>
                klõpsata <em>Uus komplekt</em>, et luua nimeline komplekt (nt <em>„5. klass&quot;</em>, <em>„Trigonomeetria eksam&quot;</em>, <em>„Füüsika&quot;</em>);
              </li>
              <li>vahetada aktiivset komplekti — riba näitab ainult valitud kategooriaid;</li>
              <li>
                muuta komplekti koosseisu (<Edit3 size={11} className="inline" /> ikoon) — klõpsa kategooriate pillidele, et need komplekti lisada või eemaldada;
              </li>
              <li>
                komplekti ümber nimetada (<Type size={11} className="inline" /> ikoon) või kustutada (<Trash2 size={11} className="inline" /> ikoon).
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Näide: 5. klassile peida „Logaritmid&quot;, „Integraalid&quot;, „Trigonomeetria&quot; — õpilased näevad ainult seda, mida nad juba õpivad. Kui vahetud 11. klassi tundi, vali teine komplekt ja kõik tuleb kohe tagasi.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  muutmine: {
    title: '7. Elementide muutmine',
    sub: 'Värv, suurus, dubleerimine ja kustutamine ühes paneelis.',
    steps: [
      {
        title: 'Kiirpaneel valitud elemendi juures',
        desc: 'Klõpsa elementi ja muuda seda kohe.',
        img: '/guide/07-popup.png',
        imgAlt: 'Redigeerimise paneel',
        imgCaption: 'Kiirpaneel ilmub valitud elemendi kõrvale',
        flip: true,
        body: (
          <>
            <ul className="ml-5 list-disc space-y-1">
              <li>Värvi muutmine (6 esmaselget varianti)</li>
              <li>Šrifti suurus</li>
              <li>Kopeeri (dubleeri)</li>
              <li>
                Kustuta (või vajuta <K>Delete</K>)
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              Mitme elemendi valimiseks hoia <K>Shift</K> ja klõpsa, või tõmba hiirega valimisraam. <K>⌘</K>+<K>A</K> valib kõik lehel olevad elemendid.
            </div>
          </>
        ),
      },
    ],
  },
  lehed: {
    title: '8. Mitu lehte',
    sub: 'Üks tahvel, palju lehti — nagu töövihikul.',
    steps: [
      {
        title: 'Lehtede paneel paremal',
        desc: 'Klõpsa + uue lehe lisamiseks, hõlju kaardil dubleerimiseks/kustutamiseks.',
        img: '/guide/08-pages.png',
        imgAlt: 'Lehtede paneel',
        imgCaption: 'Iga leht on eraldi tööpind',
        body: (
          <p>
            Igal tahvlil võib olla mitu lehte. Eksport töötab nii üksiku lehe kui kõigi lehtede kohta — saad koostada mitmeleheline tööleht ja salvestada kõik ühe PDF-ina.
          </p>
        ),
      },
    ],
  },
  raamatukogu: {
    head: {
      title: '9. Valemite raamatukogu',
      sub: 'Salvesta tihedalt kasutatavad valemid ja taaskasuta ühe klõpsuga.',
    },
    accordionTitle: 'Kuidas valemit salvestada ja uuesti kasutada?',
    accordionDesc: 'Kolm sammu — nimi, kategooria, valmis.',
    body: (
      <>
        <ol className="ml-5 list-decimal space-y-2">
          <li>Vali element või elementide grupp tahvlil.</li>
          <li>
            Klõpsa toolbar&apos;ist <B>Salvesta valem raamatukokku</B> (järjehoidja+ ikoon).
          </li>
          <li>
            Anna nimi ja kategooria (nt <em>Geomeetria</em>, <em>Füüsika</em>).
          </li>
        </ol>
        <p>
          Hiljem ava raamatukogu (järjehoidja ikoon), otsi nime järgi või filtreeri kategooria järgi ning klõpsa — valem ilmub kohe tahvlile.
        </p>
      </>
    ),
  },
  eksport: {
    head: {
      title: '10. Eksport: PNG ja PDF',
      sub: 'Kolm taset: kogu leht, kõik lehed või ainult valitud ala.',
    },
    pngCaption: 'PNG menüü: Kogu leht või Valitud ala',
    pdfCaption: 'PDF menüü: See leht, Kõik lehed, Valitud ala',
    cards: [
      {
        title: 'Kogu leht',
        body: 'Terve tahvli leht pildina või PDF-ina. Kolm tausta: ruudustikuga, valge või läbipaistev.',
      },
      {
        title: 'Kõik lehed',
        body: 'Ainult PDF. Mitmeleheline fail — üks leht = üks lehekülg.',
      },
      {
        title: 'Valitud ala',
        body: 'Ainult valitud elemendid, tihedalt kärbitud. Ideaalne üksiku valemi kopeerimiseks töölehte.',
      },
    ],
    tip: (
      <div className="flex items-start gap-2">
        <Lightbulb size={14} className="mt-0.5 shrink-0" />
        <span>
          <B>Vihje:</B> läbipaistva taustaga PNG sobib mistahes slaiditaustaga — ei pea muretsema esitluse värvi pärast.
        </span>
      </div>
    ),
  },
  konto: {
    head: {
      title: '11. Konto ja salvestamine',
      sub: 'Logi sisse e-postiga, et tahvlid püsivalt alles jääksid.',
    },
    loginCaption: 'Sisselogimine: e-post + nimi',
    worksCaption: 'Minu tööd — salvestatud tahvlite galerii',
    bullets: (
      <ul className="ml-5 list-disc space-y-1 text-matcha-900/85">
        <li>
          <B>Salvesta</B> — salvestab praeguse tahvli koos kõigi lehtedega.
        </li>
        <li>
          <B>Ava tahvel</B> — kuvab salvestatud tahvlite loendi.
        </li>
        <li>
          <B>Minu tööd</B> — kõigi tahvlite galerii eelvaadetega.
        </li>
      </ul>
    ),
    note: (
      <>
        <B>Märkus:</B> praegu salvestatakse tahvlid sinu brauserisse (localStorage). Kui vahetad arvutit või puhastad brauseri andmed, lähevad need kaduma. Impordi/ekspordi JSON funktsiooni abil saad tahvli ühest brauserist teise viia.
      </>
    ),
  },
  kiirklahvid: {
    head: { title: '12. Kiirklahvid', sub: 'Kõik kombinatsioonid ühes kohas.' },
    colKey: 'Klahv',
    colAction: 'Tegevus',
    rows: rows({
      enter: 'Lisa sisestatud valem',
      up: 'Tee astmeks (4² , x²)',
      down: 'Tee alaindeksiks (H₂)',
      selectAll: 'Vali kõik',
      copy: 'Kopeeri valitud',
      paste: 'Kleebi',
      dup: 'Dubleeri valitud',
      undo: 'Võta tagasi',
      redo: 'Tee uuesti',
      del: 'Kustuta valitud',
      esc: 'Tühista valik',
      pan: 'Liiguta tahvlit',
      afterLetter: 'pärast numbrit/tähte',
    }),
  },
  ctaTitle: 'Valmis proovima?',
  ctaSub: 'Ava tahvel ja alusta — ei mingit seadistamist.',
  ctaOpen: 'Ava tahvel',
  ctaHome: 'Esilehele',
  footer: 'Formo — matemaatika tahvel eesti õpetajatele',
};

// ═══════════════════════════════════════════════════════════════════════════
// ENGLISH
// ═══════════════════════════════════════════════════════════════════════════
const EN: GuideContent = {
  navLabel: 'Guide',
  heroPill: 'Math whiteboard',
  heroTitle: 'How to use Formo',
  heroSub:
    'A visual whiteboard for teachers and students. Build formulas, fractions, powers — all in the browser, no installs. Export as PNG or PDF.',
  ctaStart: 'Start now',
  ctaView: 'See the guide',
  heroCaption: 'Formo landing page — this is where it starts',
  toc: [
    { id: 'alustamine', label: 'Getting started', icon: Rocket },
    { id: 'tahvel', label: 'Canvas', icon: Grid3X3 },
    { id: 'sisestamine', label: 'Input', icon: PenLine },
    { id: 'murrud-astmed', label: 'Fractions', icon: Divide },
    { id: 'klaviatuur', label: 'Keyboard', icon: KeyboardIcon },
    { id: 'kohandamine', label: 'Customize', icon: Layers },
    { id: 'muutmine', label: 'Editing', icon: Edit3 },
    { id: 'lehed', label: 'Pages', icon: Files },
    { id: 'raamatukogu', label: 'Library', icon: BookMarked },
    { id: 'eksport', label: 'Export', icon: Download },
    { id: 'konto', label: 'Account', icon: User },
    { id: 'kiirklahvid', label: 'Shortcuts', icon: Command },
  ],
  alustamine: {
    title: '1. Getting started',
    sub: 'Two ways to open Formo — quick try or with an account.',
    steps: [
      {
        title: 'Open the landing page',
        desc: 'Two buttons — pick whichever fits.',
        img: '/guide/01-landing.png',
        imgAlt: 'Formo landing page',
        imgCaption: 'Landing: Start now or Sign in',
        body: (
          <>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <B>Start now</B> — opens the whiteboard in guest mode. Create, export, close. Nothing is saved.
              </li>
              <li>
                <B>Sign in</B> — enter email and name. Then you can save boards and reopen them from <em>My works</em>.
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>Guest mode is fully local — no requests to any server.</span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  tahvel: {
    title: '2. Canvas and grid',
    sub: 'A 5 × 5 mm school-notebook grid — measure and align precisely.',
    steps: [
      {
        title: 'A grid like real paper',
        desc: 'Each square = 5 mm. Every fifth line = 25 mm (darker).',
        img: '/guide/02-canvas.png',
        imgAlt: 'Canvas grid',
        imgCaption: 'A4 page with 5 mm grid',
        flip: true,
        body: (
          <>
            <p>
              The default page is A4 portrait. From the toolbar you can switch to A3, A5 or custom size and flip orientation portrait ↔ landscape.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Navigation: hold <K>Space</K> and drag the canvas; use the scroll wheel to zoom in or out.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  sisestamine: {
    head: {
      title: '3. Entering formulas',
      sub: 'Double-click + type + Enter. Formo recognizes expressions on its own.',
    },
    lead: (
      <>
        Double-click on an empty spot — an input box opens. Type a number, variable or expression and press <K>Enter</K>. Formo auto-detects:
      </>
    ),
    cards: [
      { label: 'Numbers', examples: '5 · 3.14 · −2' },
      { label: 'Variables', examples: 'x · sin · log' },
      { label: 'Operators', examples: '+ − · =' },
      { label: 'Expressions', examples: 'x+y · 2a−3b' },
    ],
  },
  murrud: {
    title: '4. Fractions, powers and subscripts',
    sub: 'Complex formatting with simple shortcuts.',
    steps: [
      {
        title: 'Fraction',
        desc: '3/4 + Enter → vertical fraction.',
        img: '/guide/03-fraction.png',
        imgAlt: 'Fraction 3/4',
        imgCaption: 'Numerator up, denominator down',
        body: (
          <p>
            Type <C>3/4</C> and press <K>Enter</K>. Formo stacks the numerator and denominator automatically.
          </p>
        ),
      },
      {
        title: 'Power (square, cube, etc.)',
        desc: '42 + ↑ → 4². Works with letters too.',
        img: '/guide/04-power.png',
        imgAlt: 'Power 4²',
        imgCaption: 'Pressing up turns the last character into an exponent',
        flip: true,
        body: (
          <p>
            Type <C>42</C> and press <K>↑</K> — you get 4². Same with letters: <C>x2</C> + <K>↑</K> → x².
          </p>
        ),
      },
      {
        title: 'Subscript (chemistry, math)',
        desc: 'H2 + ↓ → H₂.',
        img: '/guide/05-subscript.png',
        imgAlt: 'Subscript H₂',
        imgCaption: 'Pressing down turns the last character into a subscript',
        body: (
          <p>
            Type <C>H2</C> and press <K>↓</K> — you get H₂. Perfect for chemistry formulas.
          </p>
        ),
      },
    ],
  },
  klaviatuur: {
    title: '5. Virtual keyboard',
    sub: 'Numbers, operators, functions — one click away.',
    steps: [
      {
        title: 'Category row on top',
        desc: 'Numbers, operations, Greek letters, geometry, shapes — all in one row.',
        img: '/guide/06-keyboard.png',
        imgAlt: 'Virtual keyboard',
        imgCaption: 'Click a category — the symbol panel opens',
        body: (
          <>
            <p>
              Above the canvas there&apos;s a category row: <B>Numbers</B>, <B>Operations</B>, <B>Comparison</B>, <B>Trigonometry</B>, Greek letters, geometry, shapes and much more. Click a pill — the symbol panel opens. Click a symbol — it lands on the canvas.
            </p>
            <p>
              Use <K>Search</K> to find anything: type &ldquo;sin&rdquo;, &ldquo;alpha&rdquo;, &ldquo;→&rdquo; or &ldquo;cube&rdquo; — Formo searches across all categories at once.
            </p>
          </>
        ),
      },
      {
        title: 'Pinned symbols on the left',
        desc: 'Your favorites always at hand.',
        flip: true,
        body: (
          <>
            <p>
              <B>Right-click</B> (or drag) any symbol — it lands in the pinned-symbols dock on the left side of the screen. The dock also shows recently used symbols.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              Handy on iPads and touchscreen laptops — no need to keep switching keyboard layouts.
            </div>
          </>
        ),
      },
    ],
  },
  kohandamine: {
    title: '6. Customizing the keyboard',
    sub: 'Reorder categories and build a tailored set for each class.',
    steps: [
      {
        title: 'Category order',
        desc: 'Drag the pills however you like — the order is stored on your account.',
        body: (
          <>
            <p>
              Sign in and press the button at the end of the category row:{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-xs font-medium">
                <Edit3 size={11} /> Reorder
              </span>
              . Pills get a dashed border and become draggable — with a finger on a tablet or with a mouse on a computer. Drag <B>Trigonometry</B> forward if you use it often; <B>Logarithms</B> back if you use it less.
            </p>
            <p>
              Press{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-matcha-500 bg-matcha-500 px-2 py-0.5 text-xs font-medium text-white">
                <Eye size={11} /> Done
              </span>{' '}
              (or <K>Esc</K>) to finish — the order survives closing the browser.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Available only to signed-in users — each teacher&apos;s order is their own, even when someone else uses the same computer.
                </span>
              </div>
            </div>
          </>
        ),
      },
      {
        title: 'Symbol sets for each class',
        desc: 'One set for grade 5, another for grade 11 — switch with a single click.',
        flip: true,
        body: (
          <>
            <p>
              At the start of the category row there&apos;s a <B>Sets</B> button (<Layers size={11} className="inline text-matcha-700" /> icon). Click it — a menu opens where you can:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>pick <em>All categories</em> (default — everything is visible);</li>
              <li>
                click <em>New set</em> to create a named set (e.g. <em>&ldquo;Grade 5&rdquo;</em>, <em>&ldquo;Trig exam&rdquo;</em>, <em>&ldquo;Physics&rdquo;</em>);
              </li>
              <li>switch the active set — the row shows only the chosen categories;</li>
              <li>
                edit the set&apos;s contents (<Edit3 size={11} className="inline" /> icon) — click pills to add or remove categories;
              </li>
              <li>
                rename the set (<Type size={11} className="inline" /> icon) or delete it (<Trash2 size={11} className="inline" /> icon).
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Example: for grade 5 hide &ldquo;Logarithms&rdquo;, &ldquo;Integrals&rdquo;, &ldquo;Trigonometry&rdquo; — students only see what they actually study. When you move to the grade 11 class, switch to a different set and everything comes back instantly.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  muutmine: {
    title: '7. Editing elements',
    sub: 'Color, size, duplicate and delete — all in one panel.',
    steps: [
      {
        title: 'Quick panel next to the selected element',
        desc: 'Click an element and change it right there.',
        img: '/guide/07-popup.png',
        imgAlt: 'Editing panel',
        imgCaption: 'The quick panel appears next to the selected element',
        flip: true,
        body: (
          <>
            <ul className="ml-5 list-disc space-y-1">
              <li>Color (6 easy-to-read variants)</li>
              <li>Font size</li>
              <li>Copy (duplicate)</li>
              <li>
                Delete (or press <K>Delete</K>)
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              To select multiple elements, hold <K>Shift</K> and click, or drag a selection box with the mouse. <K>⌘</K>+<K>A</K> selects everything on the page.
            </div>
          </>
        ),
      },
    ],
  },
  lehed: {
    title: '8. Multiple pages',
    sub: 'One board, many pages — like a workbook.',
    steps: [
      {
        title: 'Pages panel on the right',
        desc: 'Click + to add, hover a card to duplicate or delete.',
        img: '/guide/08-pages.png',
        imgAlt: 'Pages panel',
        imgCaption: 'Each page is its own canvas',
        body: (
          <p>
            A board can have many pages. Export works per page or across all pages — you can build a multi-page worksheet and save it as one PDF.
          </p>
        ),
      },
    ],
  },
  raamatukogu: {
    head: {
      title: '9. Formula library',
      sub: 'Save frequently used formulas and reuse them with a click.',
    },
    accordionTitle: 'How to save and reuse a formula?',
    accordionDesc: 'Three steps — name, category, done.',
    body: (
      <>
        <ol className="ml-5 list-decimal space-y-2">
          <li>Select an element or group on the canvas.</li>
          <li>
            Click <B>Save formula to library</B> in the toolbar (bookmark+ icon).
          </li>
          <li>
            Give it a name and a category (e.g. <em>Geometry</em>, <em>Physics</em>).
          </li>
        </ol>
        <p>
          Later open the library (bookmark icon), search by name or filter by category, then click — the formula lands on the canvas.
        </p>
      </>
    ),
  },
  eksport: {
    head: { title: '10. Export: PNG and PDF', sub: 'Three scopes: whole page, all pages, or a selection.' },
    pngCaption: 'PNG menu: Whole page or Selection',
    pdfCaption: 'PDF menu: This page, All pages, Selection',
    cards: [
      {
        title: 'Whole page',
        body: 'The full board page as an image or PDF. Three backgrounds: grid, white, or transparent.',
      },
      {
        title: 'All pages',
        body: 'PDF only. A multi-page file — one page = one sheet.',
      },
      {
        title: 'Selection',
        body: 'Only selected elements, tightly cropped. Perfect for pasting a single formula into a worksheet.',
      },
    ],
    tip: (
      <div className="flex items-start gap-2">
        <Lightbulb size={14} className="mt-0.5 shrink-0" />
        <span>
          <B>Tip:</B> transparent-background PNG fits any slide background — no need to worry about presentation colors.
        </span>
      </div>
    ),
  },
  konto: {
    head: { title: '11. Account and saving', sub: 'Sign in with email to keep boards permanently.' },
    loginCaption: 'Sign-in: email + name',
    worksCaption: 'My works — gallery of saved boards',
    bullets: (
      <ul className="ml-5 list-disc space-y-1 text-matcha-900/85">
        <li>
          <B>Save</B> — stores the current board with all pages.
        </li>
        <li>
          <B>Open board</B> — shows a list of saved boards.
        </li>
        <li>
          <B>My works</B> — gallery of all boards with previews.
        </li>
      </ul>
    ),
    note: (
      <>
        <B>Note:</B> boards are currently saved in your browser (localStorage). If you switch computers or clear browser data, they&apos;re gone. Use Import/Export JSON to move a board between browsers.
      </>
    ),
  },
  kiirklahvid: {
    head: { title: '12. Shortcuts', sub: 'All combinations in one place.' },
    colKey: 'Key',
    colAction: 'Action',
    rows: rows({
      enter: 'Insert the typed formula',
      up: 'Make it a power (4² , x²)',
      down: 'Make it a subscript (H₂)',
      selectAll: 'Select all',
      copy: 'Copy selection',
      paste: 'Paste',
      dup: 'Duplicate selection',
      undo: 'Undo',
      redo: 'Redo',
      del: 'Delete selection',
      esc: 'Clear selection',
      pan: 'Pan canvas',
      afterLetter: 'after a digit/letter',
    }),
  },
  ctaTitle: 'Ready to try?',
  ctaSub: 'Open the board and start — no setup.',
  ctaOpen: 'Open the board',
  ctaHome: 'Home',
  footer: 'Formo — math whiteboard for teachers',
};

// ═══════════════════════════════════════════════════════════════════════════
// RUSSIAN
// ═══════════════════════════════════════════════════════════════════════════
const RU: GuideContent = {
  navLabel: 'Руководство',
  heroPill: 'Математическая доска',
  heroTitle: 'Как пользоваться Formo',
  heroSub:
    'Визуальная доска для учителей и учеников. Создавай формулы, дроби, степени — всё в браузере, без установки. Экспорт в PNG или PDF.',
  ctaStart: 'Начать сейчас',
  ctaView: 'Смотреть руководство',
  heroCaption: 'Главная Formo — всё начинается здесь',
  toc: [
    { id: 'alustamine', label: 'Начало', icon: Rocket },
    { id: 'tahvel', label: 'Доска', icon: Grid3X3 },
    { id: 'sisestamine', label: 'Ввод', icon: PenLine },
    { id: 'murrud-astmed', label: 'Дроби', icon: Divide },
    { id: 'klaviatuur', label: 'Клавиатура', icon: KeyboardIcon },
    { id: 'kohandamine', label: 'Настройка', icon: Layers },
    { id: 'muutmine', label: 'Редактирование', icon: Edit3 },
    { id: 'lehed', label: 'Страницы', icon: Files },
    { id: 'raamatukogu', label: 'Библиотека', icon: BookMarked },
    { id: 'eksport', label: 'Экспорт', icon: Download },
    { id: 'konto', label: 'Аккаунт', icon: User },
    { id: 'kiirklahvid', label: 'Горячие клавиши', icon: Command },
  ],
  alustamine: {
    title: '1. Начало работы',
    sub: 'Два способа открыть Formo — быстро или с аккаунтом.',
    steps: [
      {
        title: 'Открой главную',
        desc: 'Две кнопки — выбери подходящую.',
        img: '/guide/01-landing.png',
        imgAlt: 'Главная Formo',
        imgCaption: 'Главная: Начать сейчас или Войти',
        body: (
          <>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <B>Начать сейчас</B> — открывает доску в гостевом режиме. Создавай, экспортируй, закрывай. Ничего не сохраняется.
              </li>
              <li>
                <B>Войти</B> — введи email и имя. После этого доски можно сохранять и открывать позже на странице <em>Мои работы</em>.
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>Гостевой режим работает полностью локально — ни одного запроса на сервер.</span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  tahvel: {
    title: '2. Доска и сетка',
    sub: 'Сетка 5 × 5 мм как в тетради — меряй и выравнивай точно.',
    steps: [
      {
        title: 'Сетка как на настоящей бумаге',
        desc: 'Каждая клетка = 5 мм. Каждая пятая линия = 25 мм (темнее).',
        img: '/guide/02-canvas.png',
        imgAlt: 'Сетка доски',
        imgCaption: 'Лист A4 с сеткой 5 мм',
        flip: true,
        body: (
          <>
            <p>
              По умолчанию — A4 портретной ориентации. В панели инструментов можно переключиться на A3, A5 или свой размер и повернуть портрет ↔ альбом.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Навигация: зажми <K>Space</K> и тащи доску; колесо мыши — масштаб.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  sisestamine: {
    head: {
      title: '3. Ввод формул',
      sub: 'Двойной клик + ввод + Enter. Formo сам распознаёт выражения.',
    },
    lead: (
      <>
        Двойной клик по пустому месту — откроется поле ввода. Введи число, переменную или выражение и нажми <K>Enter</K>. Formo распознаёт автоматически:
      </>
    ),
    cards: [
      { label: 'Числа', examples: '5 · 3.14 · −2' },
      { label: 'Переменные', examples: 'x · sin · log' },
      { label: 'Операторы', examples: '+ − · =' },
      { label: 'Выражения', examples: 'x+y · 2a−3b' },
    ],
  },
  murrud: {
    title: '4. Дроби, степени и индексы',
    sub: 'Сложное оформление — простым сокращением.',
    steps: [
      {
        title: 'Дробь',
        desc: '3/4 + Enter → вертикальная дробь.',
        img: '/guide/03-fraction.png',
        imgAlt: 'Дробь 3/4',
        imgCaption: 'Числитель сверху, знаменатель снизу',
        body: (
          <p>
            Набери <C>3/4</C> и нажми <K>Enter</K>. Formo поставит числитель сверху, знаменатель снизу автоматически.
          </p>
        ),
      },
      {
        title: 'Степень (квадрат, куб и т.д.)',
        desc: '42 + ↑ → 4². С буквами тоже работает.',
        img: '/guide/04-power.png',
        imgAlt: 'Степень 4²',
        imgCaption: 'Стрелка вверх превращает последний символ в степень',
        flip: true,
        body: (
          <p>
            Набери <C>42</C> и нажми <K>↑</K> — получится 4². Так же с буквами: <C>x2</C> + <K>↑</K> → x².
          </p>
        ),
      },
      {
        title: 'Подстрочный индекс (химия, математика)',
        desc: 'H2 + ↓ → H₂.',
        img: '/guide/05-subscript.png',
        imgAlt: 'Индекс H₂',
        imgCaption: 'Стрелка вниз превращает последний символ в нижний индекс',
        body: (
          <p>
            Набери <C>H2</C> и нажми <K>↓</K> — получится H₂. Идеально для химических формул.
          </p>
        ),
      },
    ],
  },
  klaviatuur: {
    title: '5. Виртуальная клавиатура',
    sub: 'Цифры, операторы, функции — в одном клике.',
    steps: [
      {
        title: 'Лента категорий сверху',
        desc: 'Числа, действия, греческие буквы, геометрия, фигуры — всё в одной ленте.',
        img: '/guide/06-keyboard.png',
        imgAlt: 'Виртуальная клавиатура',
        imgCaption: 'Клик по категории — открывается панель символов',
        body: (
          <>
            <p>
              Над доской — лента категорий: <B>Числа</B>, <B>Действия</B>, <B>Сравнение</B>, <B>Тригонометрия</B>, греческие буквы, геометрия, фигуры и многое другое. Клик по пилюле — открывается панель символов. Клик по символу — элемент появится на доске.
            </p>
            <p>
              Ищи символ через кнопку <K>Поиск</K>: введи «sin», «альфа», «→» или «куб» — Formo найдёт его во всех категориях сразу.
            </p>
          </>
        ),
      },
      {
        title: 'Закреплённые символы слева',
        desc: 'Твои избранные всегда под рукой.',
        flip: true,
        body: (
          <>
            <p>
              <B>Правый клик</B> (или перетаскивание) по любому символу — он появится в доке закреплённых символов слева. Там же показываются недавно использованные.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              Удобно на iPad и сенсорных ноутбуках — не нужно постоянно переключать раскладки клавиатуры.
            </div>
          </>
        ),
      },
    ],
  },
  kohandamine: {
    title: '6. Настройка клавиатуры',
    sub: 'Меняй порядок категорий и создавай свой комплект для каждого класса.',
    steps: [
      {
        title: 'Порядок категорий',
        desc: 'Перетаскивай пилюли как удобно — порядок сохранится в твоём аккаунте.',
        body: (
          <>
            <p>
              Войди в аккаунт и нажми в конце ленты категорий кнопку{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-xs font-medium">
                <Edit3 size={11} /> Изменить порядок
              </span>
              . Пилюли получат пунктирную рамку и станут перетаскиваемыми — пальцем на планшете или мышью на компьютере. Перетащи <B>Тригонометрию</B> вперёд, если часто ею пользуешься; <B>Логарифмы</B> назад, если редко.
            </p>
            <p>
              Нажми{' '}
              <span className="inline-flex items-center gap-1 rounded-full border border-matcha-500 bg-matcha-500 px-2 py-0.5 text-xs font-medium text-white">
                <Eye size={11} /> Готово
              </span>{' '}
              (или <K>Esc</K>), чтобы завершить — порядок останется даже после закрытия браузера.
            </p>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              <div className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Функция доступна только вошедшим пользователям — у каждого учителя свой порядок, даже если кто-то ещё пользуется тем же компьютером.
                </span>
              </div>
            </div>
          </>
        ),
      },
      {
        title: 'Комплекты символов для классов',
        desc: 'Один комплект для 5 класса, другой для 11 — переключай одним кликом.',
        flip: true,
        body: (
          <>
            <p>
              В начале ленты категорий есть кнопка <B>Комплекты</B> (иконка <Layers size={11} className="inline text-matcha-700" />). Клик по ней — откроется меню, где можно:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>выбрать <em>Все категории</em> (по умолчанию — видно всё);</li>
              <li>
                нажать <em>Новый комплект</em>, чтобы создать именованный комплект (напр. <em>«5 класс»</em>, <em>«Экзамен по тригонометрии»</em>, <em>«Физика»</em>);
              </li>
              <li>переключать активный комплект — лента покажет только выбранные категории;</li>
              <li>
                редактировать состав комплекта (иконка <Edit3 size={11} className="inline" />) — кликай по пилюлям категорий, чтобы добавить или убрать их;
              </li>
              <li>
                переименовать комплект (иконка <Type size={11} className="inline" />) или удалить (иконка <Trash2 size={11} className="inline" />).
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(168,205,135,0.22)', border: '1px solid rgba(88,123,62,0.3)', color: '#2d3d1f' }}
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-matcha-700" />
                <span>
                  Пример: для 5 класса спрячь «Логарифмы», «Интегралы», «Тригонометрию» — ученики видят только то, что уже проходят. Переходишь на урок 11 класса — выбираешь другой комплект, и всё возвращается мгновенно.
                </span>
              </div>
            </div>
          </>
        ),
      },
    ],
  },
  muutmine: {
    title: '7. Редактирование элементов',
    sub: 'Цвет, размер, дублирование и удаление — в одной панели.',
    steps: [
      {
        title: 'Быстрая панель рядом с элементом',
        desc: 'Клик по элементу — меняй его сразу.',
        img: '/guide/07-popup.png',
        imgAlt: 'Панель редактирования',
        imgCaption: 'Быстрая панель появляется рядом с выбранным элементом',
        flip: true,
        body: (
          <>
            <ul className="ml-5 list-disc space-y-1">
              <li>Цвет (6 контрастных вариантов)</li>
              <li>Размер шрифта</li>
              <li>Копировать (дублировать)</li>
              <li>
                Удалить (или нажать <K>Delete</K>)
              </li>
            </ul>
            <div
              className="space-y-1.5 rounded-2xl p-4 text-sm leading-relaxed"
              style={{ background: 'rgba(214,228,193,0.45)', border: '1px solid rgba(143,181,105,0.35)', color: '#3a5022' }}
            >
              Для выбора нескольких элементов зажми <K>Shift</K> и кликай, или выдели мышкой рамку. <K>⌘</K>+<K>A</K> выбирает всё на странице.
            </div>
          </>
        ),
      },
    ],
  },
  lehed: {
    title: '8. Несколько страниц',
    sub: 'Одна доска, много страниц — как в рабочей тетради.',
    steps: [
      {
        title: 'Панель страниц справа',
        desc: 'Клик + добавляет страницу, наведение на карточку — дублировать или удалить.',
        img: '/guide/08-pages.png',
        imgAlt: 'Панель страниц',
        imgCaption: 'Каждая страница — отдельное рабочее поле',
        body: (
          <p>
            У доски может быть много страниц. Экспорт работает как для одной, так и для всех страниц — можно составить многостраничный лист и сохранить всё в один PDF.
          </p>
        ),
      },
    ],
  },
  raamatukogu: {
    head: {
      title: '9. Библиотека формул',
      sub: 'Сохраняй часто используемые формулы и применяй их в один клик.',
    },
    accordionTitle: 'Как сохранить и повторно использовать формулу?',
    accordionDesc: 'Три шага — имя, категория, готово.',
    body: (
      <>
        <ol className="ml-5 list-decimal space-y-2">
          <li>Выбери элемент или группу элементов на доске.</li>
          <li>
            В панели инструментов нажми <B>Сохранить формулу в библиотеку</B> (иконка закладка+).
          </li>
          <li>
            Задай имя и категорию (напр. <em>Геометрия</em>, <em>Физика</em>).
          </li>
        </ol>
        <p>
          Позже открой библиотеку (иконка закладки), найди по имени или отфильтруй по категории и кликни — формула появится на доске.
        </p>
      </>
    ),
  },
  eksport: {
    head: { title: '10. Экспорт: PNG и PDF', sub: 'Три уровня: вся страница, все страницы или только выделение.' },
    pngCaption: 'Меню PNG: Вся страница или Выделение',
    pdfCaption: 'Меню PDF: Эта страница, Все страницы, Выделение',
    cards: [
      {
        title: 'Вся страница',
        body: 'Полная страница доски как картинка или PDF. Три фона: с сеткой, белый или прозрачный.',
      },
      {
        title: 'Все страницы',
        body: 'Только PDF. Многостраничный файл — одна страница = один лист.',
      },
      {
        title: 'Выделение',
        body: 'Только выбранные элементы, плотно обрезано. Идеально для вставки одной формулы в рабочий лист.',
      },
    ],
    tip: (
      <div className="flex items-start gap-2">
        <Lightbulb size={14} className="mt-0.5 shrink-0" />
        <span>
          <B>Подсказка:</B> PNG с прозрачным фоном подойдёт к любому слайду — не нужно думать про цвет презентации.
        </span>
      </div>
    ),
  },
  konto: {
    head: { title: '11. Аккаунт и сохранение', sub: 'Войди по email — доски останутся надолго.' },
    loginCaption: 'Вход: email + имя',
    worksCaption: 'Мои работы — галерея сохранённых досок',
    bullets: (
      <ul className="ml-5 list-disc space-y-1 text-matcha-900/85">
        <li>
          <B>Сохранить</B> — сохраняет текущую доску со всеми страницами.
        </li>
        <li>
          <B>Открыть доску</B> — показывает список сохранённых досок.
        </li>
        <li>
          <B>Мои работы</B> — галерея всех досок с превью.
        </li>
      </ul>
    ),
    note: (
      <>
        <B>Заметка:</B> сейчас доски сохраняются в твоём браузере (localStorage). Если сменишь компьютер или очистишь данные браузера — они пропадут. Используй Импорт/Экспорт JSON, чтобы перенести доску между браузерами.
      </>
    ),
  },
  kiirklahvid: {
    head: { title: '12. Горячие клавиши', sub: 'Все комбинации в одном месте.' },
    colKey: 'Клавиша',
    colAction: 'Действие',
    rows: rows({
      enter: 'Вставить набранную формулу',
      up: 'Сделать степенью (4² , x²)',
      down: 'Сделать нижним индексом (H₂)',
      selectAll: 'Выбрать всё',
      copy: 'Копировать выделение',
      paste: 'Вставить',
      dup: 'Дублировать выделение',
      undo: 'Отменить',
      redo: 'Повторить',
      del: 'Удалить выделение',
      esc: 'Снять выделение',
      pan: 'Перемещать доску',
      afterLetter: 'после цифры/буквы',
    }),
  },
  ctaTitle: 'Готов попробовать?',
  ctaSub: 'Открой доску и начинай — без настроек.',
  ctaOpen: 'Открыть доску',
  ctaHome: 'На главную',
  footer: 'Formo — математическая доска для учителей',
};

export const GUIDE: Record<Lang, GuideContent> = { et: ET, en: EN, ru: RU };
