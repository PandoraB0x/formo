import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Juhend — Formo',
  description: 'Kuidas kasutada Formo matemaatika tahvlit',
};

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 rounded-2xl border border-matcha-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-neutral-900">{title}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

interface StepImageProps {
  src: string;
  alt: string;
  caption?: string;
}

function StepImage({ src, alt, caption }: StepImageProps) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        className="h-auto w-full"
        sizes="(max-width: 900px) 100vw, 820px"
      />
      {caption && (
        <figcaption className="border-t border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface KbdProps {
  children: React.ReactNode;
}

function Kbd({ children }: KbdProps) {
  return (
    <kbd className="mx-0.5 inline-block rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 text-[11px] font-medium text-neutral-700 shadow-sm">
      {children}
    </kbd>
  );
}

const TOC = [
  { id: 'alustamine', label: '1. Alustamine' },
  { id: 'tahvel', label: '2. Tahvel ja ruudustik' },
  { id: 'sisestamine', label: '3. Valemite sisestamine' },
  { id: 'murrud-astmed', label: '4. Murrud, astmed ja indeksid' },
  { id: 'klaviatuur', label: '5. Virtuaalne klaviatuur' },
  { id: 'muutmine', label: '6. Elementide muutmine' },
  { id: 'lehed', label: '7. Mitu lehte' },
  { id: 'raamatukogu', label: '8. Valemite raamatukogu' },
  { id: 'eksport', label: '9. Eksport (PNG, PDF)' },
  { id: 'konto', label: '10. Konto ja salvestamine' },
  { id: 'kiirklahvid', label: '11. Kiirklahvid' },
];

export default function AbiPage() {
  return (
    <div className="min-h-screen bg-matcha-50/30">
      <header className="sticky top-0 z-20 border-b border-matcha-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-neutral-600 transition hover:text-matcha-700"
          >
            <ArrowLeft size={16} /> Tagasi
          </Link>
          <div className="mx-2 h-5 w-px bg-neutral-200" />
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-matcha-700">
            <Sparkles size={18} />
            Formo
          </Link>
          <span className="ml-auto text-xs text-neutral-500">Juhend</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="mb-10 text-center sm:mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Kuidas Formot kasutada
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
            Formo on visuaalne matemaatika tahvel õpetajatele ja õpilastele. Loo valemeid, graafikuid ja
            töölehti, ekspordi PNG või PDF formaadis. Kõik toimub brauseris — ei mingit installimist.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/app"
              className="rounded-lg bg-matcha-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-matcha-700"
            >
              Alusta kohe
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-matcha-200 bg-white px-5 py-2.5 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-50"
            >
              Logi sisse
            </Link>
          </div>
        </div>

        <nav className="mb-10 rounded-2xl border border-matcha-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Sisukord
          </h2>
          <ol className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded px-2 py-1 text-matcha-800 transition hover:bg-matcha-50"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-6">
          <Section id="alustamine" title="1. Alustamine">
            <p>
              Formo avaneb otse brauseris. Esilehel on kaks võimalust:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong>Alusta kohe</strong> — avad tahvli külaliserežiimis. Loo, ekspordi, sulge. Midagi
                ei salvestata.
              </li>
              <li>
                <strong>Logi sisse</strong> — sisesta e-post ja nimi. Seejärel saab tahvleid salvestada
                ja hiljem uuesti avada lehelt <em>Minu tööd</em>.
              </li>
            </ul>
            <StepImage src="/guide/01-landing.png" alt="Formo esileht" caption="Formo esileht — kaks algpunkti" />
          </Section>

          <Section id="tahvel" title="2. Tahvel ja ruudustik">
            <p>
              Tahvel imiteerib koolivihku: iga ruut on 5 × 5 mm ja iga viies joon on pisut
              tumedam (25 mm vahe) — nii on kergem mõõta ja joondada. Lehe suurus on vaikimisi A4,
              aga saab vahetada A3, A5 või kohandatud mõõtudele. Orientatsioon — püsti või rõhtsalt.
            </p>
            <StepImage src="/guide/02-canvas.png" alt="Tahvli ruudustik" caption="5 mm ruudustik nagu päris paberil" />
            <p className="text-sm text-neutral-600">
              Navigeerimine: hoia <Kbd>Space</Kbd> ja lohista tahvlit, kasuta hiire kerimisratast
              suurendamiseks/vähendamiseks.
            </p>
          </Section>

          <Section id="sisestamine" title="3. Valemite sisestamine">
            <p>
              Tee topeltklõps tühjale kohale — avaneb sisestuskast. Kirjuta arv, muutuja või avaldis ja
              vajuta <Kbd>Enter</Kbd>. Formo tunneb automaatselt ära:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Arvud: <code>5</code>, <code>3.14</code>, <code>-2</code></li>
              <li>Muutujad ja funktsioonid: <code>x</code>, <code>sin</code>, <code>log</code></li>
              <li>Operaatorid: <code>+</code>, <code>-</code>, <code>·</code>, <code>=</code></li>
              <li>Avaldised: <code>x+y</code>, <code>2a-3b</code></li>
            </ul>
          </Section>

          <Section id="murrud-astmed" title="4. Murrud, astmed ja indeksid">
            <p>
              Formo teeb keeruka vormistuse lihtsaks:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Murd:</strong> kirjuta <code>3/4</code> ja vajuta <Kbd>Enter</Kbd> — lugeja läheb üles, nimetaja alla, joon keskele.
              </li>
              <li>
                <strong>Aste (ruut, kuup jne):</strong> kirjuta <code>42</code> ja vajuta <Kbd>↑</Kbd> — tulemus on 4².
                Töötab nii numbritega kui tähtedega: <code>x2</code> + <Kbd>↑</Kbd> → x².
              </li>
              <li>
                <strong>Alaindeks (keemia, matemaatika):</strong> kirjuta <code>H2</code> ja vajuta <Kbd>↓</Kbd> — tulemus on H₂.
              </li>
            </ul>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StepImage src="/guide/03-fraction.png" alt="Murd 3/4" caption="3/4 + Enter = vertikaalne murd" />
              <StepImage src="/guide/04-power.png" alt="Aste 4²" caption="42 + ↑ = 4²" />
              <StepImage src="/guide/05-subscript.png" alt="Indeks H₂" caption="H2 + ↓ = H₂" />
            </div>
          </Section>

          <Section id="klaviatuur" title="5. Virtuaalne klaviatuur">
            <p>
              Ekraani vasakus servas on paneel numbrite, operaatorite, funktsioonide ja sümbolitega. Klõpsa
              nupule — element ilmub tahvlile. Mugav, kui tahad vältida klaviatuurivahetamist või kui
              kasutad puuteekraani.
            </p>
            <StepImage src="/guide/06-keyboard.png" alt="Virtuaalne klaviatuur" />
          </Section>

          <Section id="muutmine" title="6. Elementide muutmine">
            <p>Kui klõpsad elemendile, ilmub redigeerimise paneel:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Värvi muutmine (6 esmaselget varianti)</li>
              <li>Šrifti suurus</li>
              <li>Kopeeri (dubleeri)</li>
              <li>Kustuta (või vajuta <Kbd>Delete</Kbd>)</li>
            </ul>
            <p>
              Mitme elemendi valimiseks hoia <Kbd>Shift</Kbd> ja klõpsa või tõmba hiirega
              valimisraam. <Kbd>⌘</Kbd>+<Kbd>A</Kbd> valib kõik lehel olevad elemendid.
            </p>
            <StepImage src="/guide/07-popup.png" alt="Redigeerimise paneel" caption="Valitud elemendi kiirpaneel" />
          </Section>

          <Section id="lehed" title="7. Mitu lehte">
            <p>
              Paremal servas on lehtede riba. Igal tahvlil võib olla mitu lehte — nagu töövihikul. Klõpsa
              <strong> +</strong> uue lehe lisamiseks, hõlju lehe kaardil, et ilmuksid dubleerimise ja
              kustutamise nupud.
            </p>
            <StepImage src="/guide/08-pages.png" alt="Lehtede paneel" caption="Iga leht on eraldi tööpind, eksport töötab nii üksiku lehe kui kõigi lehtede kohta" />
          </Section>

          <Section id="raamatukogu" title="8. Valemite raamatukogu">
            <p>
              Kui sul on valem, mida kasutad tihti — salvesta see raamatukokku:
            </p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>Vali element või elementide grupp tahvlil.</li>
              <li>Klõpsa <strong>Salvesta valem raamatukokku</strong> (järjehoidja+ ikoon).</li>
              <li>Anna nimi ja kategooria (nt <em>Geomeetria</em>, <em>Füüsika</em>).</li>
            </ol>
            <p>
              Hiljem ava raamatukogu (järjehoidja ikoon), otsi valem nime järgi või filtreeri kategooria
              järgi ning klõpsa — see ilmub kohe tahvlile.
            </p>
          </Section>

          <Section id="eksport" title="9. Eksport: PNG ja PDF">
            <p>Formost saab salvestada kolmel moel:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Kogu leht</strong> — terve tahvli leht pildina või PDF-ina. Kolm tausta valikut:
                ruudustikuga, valge taust või läbipaistev.
              </li>
              <li>
                <strong>Kõik lehed</strong> (ainult PDF) — mitmeleheline PDF, üks leht = üks lehekülg.
              </li>
              <li>
                <strong>Valitud ala</strong> — ainult valitud elemendid, tihedalt kärbitud. Ideaalne
                üksiku valemi ekspordiks töölehte või esitlusse.
              </li>
            </ul>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <StepImage src="/guide/09-png-export.png" alt="PNG ekspordi menüü" caption="PNG menüü: Kogu leht või Valitud ala" />
              <StepImage src="/guide/10-pdf-export.png" alt="PDF ekspordi menüü" caption="PDF menüü: See leht, Kõik lehed, Valitud ala" />
            </div>
            <p className="rounded-lg bg-matcha-50 p-3 text-sm text-matcha-900">
              <strong>Vihje:</strong> läbipaistva taustaga PNG on mugav sõnumite või esitluste jaoks — see
              sobitub automaatselt mis tahes taustaga.
            </p>
          </Section>

          <Section id="konto" title="10. Konto ja salvestamine">
            <p>
              Logi sisse oma e-postiga, et tahvleid püsivalt salvestada. Ülemisel ribal on:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong>Salvesta</strong> — salvestab praeguse tahvli koos kõigi lehtedega.</li>
              <li><strong>Ava tahvel</strong> — kuvab salvestatud tahvlite loendi.</li>
              <li><strong>Minu tööd</strong> — kõigi tahvlite galerii eelvaadetega.</li>
            </ul>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <StepImage src="/guide/11-login.png" alt="Sisselogimise vorm" />
              <StepImage src="/guide/12-works.png" alt="Minu tööd" />
            </div>
            <p className="text-sm text-neutral-600">
              <strong>Märkus:</strong> praegu salvestatakse tahvlid sinu brauserisse (localStorage). Kui
              vahetad arvutit või puhastad brauseri andmed, lähevad need kaduma. Impordi/ekspordi JSON
              funktsiooni abil saad tahvli ühest brauserist teise viia.
            </p>
          </Section>

          <Section id="kiirklahvid" title="11. Kiirklahvid">
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-2">Klahv</th>
                    <th className="px-4 py-2">Tegevus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr><td className="px-4 py-2"><Kbd>Enter</Kbd></td><td className="px-4 py-2">Lisa sisestatud valem</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>↑</Kbd> pärast numbrit/tähte</td><td className="px-4 py-2">Tee astmeks (4² , x²)</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>↓</Kbd> pärast numbrit/tähte</td><td className="px-4 py-2">Tee alaindeksiks (H₂)</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>A</Kbd></td><td className="px-4 py-2">Vali kõik</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>C</Kbd></td><td className="px-4 py-2">Kopeeri valitud</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>V</Kbd></td><td className="px-4 py-2">Kleebi</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>D</Kbd></td><td className="px-4 py-2">Dubleeri valitud</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd></td><td className="px-4 py-2">Võta tagasi</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>⌘</Kbd>/<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd></td><td className="px-4 py-2">Tee uuesti</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>Delete</Kbd> / <Kbd>Backspace</Kbd></td><td className="px-4 py-2">Kustuta valitud</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>Esc</Kbd></td><td className="px-4 py-2">Tühista valik</td></tr>
                  <tr><td className="px-4 py-2"><Kbd>Space</Kbd> + hiir</td><td className="px-4 py-2">Liiguta tahvlit</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <div className="rounded-2xl border border-matcha-200 bg-matcha-50 p-6 text-center sm:p-8">
            <h2 className="text-xl font-semibold text-matcha-900">Valmis proovima?</h2>
            <p className="mt-2 text-sm text-matcha-800">Ava tahvel ja alusta — ei mingit seadistamist.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/app"
                className="rounded-lg bg-matcha-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-matcha-700"
              >
                Ava tahvel
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-matcha-300 bg-white px-5 py-2.5 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-100"
              >
                Esilehele
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-neutral-500">
        Formo — matemaatika tahvel eesti õpetajatele
      </footer>
    </div>
  );
}
