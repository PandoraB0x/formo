import type { Lang } from './types';

export interface Dict {
  nav: {
    back: string;
    login: string;
    logout: string;
    guide: string;
  };
  landing: {
    eyebrow: string;
    startNow: string;
    startNowDesc: string;
    myWorks: string;
    myWorksDesc: string;
    loginBtn: string;
    loginDesc: string;
    seeGuide: string;
    footer: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    emailPh: string;
    name: string;
    nameOptional: string;
    namePh: string;
    submit: string;
    error: string;
    guestHint: string;
    guestLink: string;
  };
  works: {
    backHome: string;
    myWorks: string;
    empty: string;
    savedCount: (n: number) => string;
    newBoard: string;
    search: string;
    notFound: string;
    emptyTitle: string;
    emptyHint: string;
    emptyCta: string;
    confirmDelete: string;
    delete: string;
    open: string;
    loading: string;
    backToHome: string;
  };
  toolbar: {
    undo: string;
    redo: string;
    duplicate: string;
    deleteSel: string;
    newBoard: string;
    loginSave: string;
    loginSaveBtn: string;
    save: string;
    openBoard: string;
    myWorks: string;
    saveToLib: string;
    library: string;
    page: string;
    bg: string;
    bgTransparent: string;
    bgWhite: string;
    font: string;
    copyPng: string;
    pngMenu: string;
    pdfMenu: string;
    fullPage: string;
    gridBg: string;
    whiteBg: string;
    transparentBg: string;
    selectionArea: string;
    thisPage: string;
    allPages: string;
    whiteBgPdf: string;
    exportJson: string;
    importJson: string;
    saved: string;
    savedBoards: string;
    nothingSaved: string;
    noPreview: string;
    pdfReady: string;
    pdfError: string;
    selectFirst: string;
    opened: string;
    copied: string;
    clipboardUnavail: string;
    confirmDelete: string;
    savedAs: string;
    imported: string;
    invalidJson: string;
    unnamed: string;
  };
  library: {
    title: string;
    close: string;
    search: string;
    all: string;
    empty: string;
    notFound: string;
    confirmDelete: string;
    insert: string;
    delete: string;
    elementsCount: (n: number) => string;
  };
  snippetDialog: {
    title: string;
    name: string;
    namePh: string;
    category: string;
    categoryPh: string;
    cancel: string;
    save: string;
    defaultCategory: string;
  };
  pages: {
    pages: string;
    addPage: string;
    duplicatePage: string;
    deletePage: string;
    emptyPage: string;
    page: string;
  };
  keyboard: {
    search: string;
    clear: string;
    searchResults: string;
    notFound: string;
    favorites: string;
    recent: string;
    clearShort: string;
    collapse: string;
    expand: string;
    hintTip: string;
    favHint: string;
    pinned: string;
    dragHere: string;
    hintPin: string;
    searchShort: string;
    searchTitle: string;
    searchPlaceholder: string;
    searchHint: string;
    guestDockCta: string;
    guestDockTitle: string;
    clearTooltip: string;
    resultsCount: (n: number) => string;
    groups: Record<string, string>;
  };
  popup: {
    smaller: string;
    larger: string;
    duplicate: string;
    delete: string;
  };
  canvas: {
    emptyHint: string;
    zoomOut: string;
    zoomFit: string;
    zoomIn: string;
    duplicate: string;
    delete: string;
    selectedCount: (n: number) => string;
  };
  guide: {
    metaTitle: string;
    metaDesc: string;
    navLabel: string;
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    ctaStart: string;
    ctaSeeGuide: string;
    footer: string;
    // sections
    s1Title: string;
    s1Sub: string;
    s1StepTitle: string;
    s1StepDesc: string;
    s1Cap: string;
    s1Item1Strong: string;
    s1Item1: string;
    s1Item2Strong: string;
    s1Item2: string;
    s1Item2Em: string;
    s1Tip: string;

    s2Title: string;
    s2Sub: string;
    s2StepTitle: string;
    s2StepDesc: string;
    s2Cap: string;
    s2Body: string;
    s2Tip1: string;
    s2Tip2: string;

    s3Title: string;
    s3Sub: string;
    s3Body: string;
    s3LblNumbers: string;
    s3LblVars: string;
    s3LblOps: string;
    s3LblExpr: string;

    s4Title: string;
    s4Sub: string;
    s4S1Title: string;
    s4S1Desc: string;
    s4S1Cap: string;
    s4S1Body1: string;
    s4S1Body2: string;
    s4S2Title: string;
    s4S2Desc: string;
    s4S2Cap: string;
    s4S2Body1: string;
    s4S2Body2: string;
    s4S3Title: string;
    s4S3Desc: string;
    s4S3Cap: string;
    s4S3Body1: string;
    s4S3Body2: string;

    s5Title: string;
    s5Sub: string;
    s5StepTitle: string;
    s5StepDesc: string;
    s5Cap: string;
    s5Body: string;
    s5Tip: string;

    s6Title: string;
    s6Sub: string;
    s6StepTitle: string;
    s6StepDesc: string;
    s6Cap: string;
    s6Item1: string;
    s6Item2: string;
    s6Item3: string;
    s6Item4a: string;
    s6Item4b: string;
    s6Tip1: string;
    s6Tip2: string;
    s6Tip3: string;

    s7Title: string;
    s7Sub: string;
    s7StepTitle: string;
    s7StepDesc: string;
    s7Cap: string;
    s7Body: string;

    s8Title: string;
    s8Sub: string;
    s8AccTitle: string;
    s8AccDesc: string;
    s8Step1: string;
    s8Step2a: string;
    s8Step2b: string;
    s8Step3: string;
    s8Step3Em1: string;
    s8Step3Em2: string;
    s8Body: string;

    s9Title: string;
    s9Sub: string;
    s9PngCap: string;
    s9PdfCap: string;
    s9Card1Title: string;
    s9Card1Body: string;
    s9Card2Title: string;
    s9Card2Body: string;
    s9Card3Title: string;
    s9Card3Body: string;
    s9TipStrong: string;
    s9TipBody: string;

    s10Title: string;
    s10Sub: string;
    s10LoginCap: string;
    s10WorksCap: string;
    s10Item1Strong: string;
    s10Item1: string;
    s10Item2Strong: string;
    s10Item2: string;
    s10Item3Strong: string;
    s10Item3: string;
    s10NoteStrong: string;
    s10Note: string;

    s11Title: string;
    s11Sub: string;
    s11ThKey: string;
    s11ThAction: string;
    kb: {
      enter: string;
      arrowUp: string;
      upAction: string;
      arrowDown: string;
      downAction: string;
      ctrl: string;
      a: string;
      aAction: string;
      c: string;
      cAction: string;
      v: string;
      vAction: string;
      d: string;
      dAction: string;
      z: string;
      zAction: string;
      shiftZ: string;
      del: string;
      delAction: string;
      esc: string;
      escAction: string;
      space: string;
      spaceAction: string;
    };

    ctaTitle: string;
    ctaSub: string;
    ctaOpen: string;
    ctaHome: string;

    navTitles: {
      s1: string;
      s2: string;
      s3: string;
      s4: string;
      s5: string;
      s6: string;
      s7: string;
      s8: string;
      s9: string;
      s10: string;
      s11: string;
    };
  };
}

const et: Dict = {
  nav: {
    back: 'Tagasi',
    login: 'Logi sisse',
    logout: 'Logi välja',
    guide: 'Juhend',
  },
  landing: {
    eyebrow: 'Matemaatika tahvel',
    startNow: 'Alusta kohe',
    startNowDesc: 'Külaliserežiim ilma kontota',
    myWorks: 'Minu tööd',
    myWorksDesc: 'Salvestatud tahvlid ja valemid',
    loginBtn: 'Logi sisse',
    loginDesc: 'Salvesta tahvleid ja valemeid',
    seeGuide: 'Vaata juhendit',
    footer: 'Külaliserežiim töötab täiesti kohalikult',
  },
  login: {
    title: 'Logi sisse',
    subtitle:
      'Kontot ei ole vaja luua — sisesta lihtsalt e-post ja nimi. Sinu tööd salvestatakse kohalikult.',
    email: 'E-post',
    emailPh: 'maria@kool.ee',
    name: 'Nimi',
    nameOptional: '(valikuline)',
    namePh: 'Maria Tamm',
    submit: 'Logi sisse',
    error: 'Sisesta korrektne e-post',
    guestHint: 'Külalisena saad alustada ilma sisse logimata —',
    guestLink: 'ava tahvel otse',
  },
  works: {
    backHome: 'Avalehele',
    myWorks: 'Minu tööd',
    empty: 'Sul pole veel ühtegi salvestatud tahvlit.',
    savedCount: (n) => `${n} salvestatud tahvlit`,
    newBoard: 'Uus tahvel',
    search: 'Otsi tahvlit…',
    notFound: 'Midagi ei leitud.',
    emptyTitle: 'Veel ühtegi tahvlit pole',
    emptyHint: 'Alusta uut tahvlit ja salvesta see siia.',
    emptyCta: 'Loo esimene',
    confirmDelete: 'Kustuta tahvel?',
    delete: 'Kustuta',
    open: 'Ava:',
    loading: 'Laadimine…',
    backToHome: 'Tagasi avalehele',
  },
  toolbar: {
    undo: 'Võta tagasi (⌘Z)',
    redo: 'Tee uuesti (⌘⇧Z)',
    duplicate: 'Dubleeri (⌘D)',
    deleteSel: 'Kustuta (Del)',
    newBoard: 'Uus tahvel',
    loginSave: 'Logi sisse, et tahvleid salvestada',
    loginSaveBtn: 'Logi sisse salvestama',
    save: 'Salvesta (⌘S)',
    openBoard: 'Ava tahvel',
    myWorks: 'Minu tööd',
    saveToLib: 'Salvesta valem raamatukokku',
    library: 'Valemite raamatukogu',
    page: 'Leht:',
    bg: 'Taust:',
    bgTransparent: 'Läbipaistev',
    bgWhite: 'Valge',
    font: 'Font:',
    copyPng: 'Kopeeri PNG',
    pngMenu: 'Lae alla PNG',
    pdfMenu: 'Lae alla PDF',
    fullPage: 'Kogu leht',
    gridBg: 'Ruudustikuga',
    whiteBg: 'Valge taust',
    transparentBg: 'Läbipaistev',
    selectionArea: 'Valitud ala',
    thisPage: 'See leht',
    allPages: 'Kõik lehed',
    whiteBgPdf: 'Valge taustaga',
    exportJson: 'Ekspordi JSON',
    importJson: 'Impordi JSON',
    saved: 'Salvestatud',
    savedBoards: 'Salvestatud tahvlid',
    nothingSaved: 'Midagi pole veel salvestatud.',
    noPreview: 'eelvaadet pole',
    pdfReady: 'PDF valmis',
    pdfError: 'PDF viga',
    selectFirst: 'Vali elemendid',
    opened: 'Avatud:',
    copied: 'Kopeeritud',
    clipboardUnavail: 'Lõikelaud pole saadaval',
    confirmDelete: 'Kustuta tahvel?',
    savedAs: 'Salvestatud:',
    imported: 'Imporditud:',
    invalidJson: 'Vigane JSON fail',
    unnamed: 'Nimeta',
  },
  library: {
    title: 'Valemite raamatukogu',
    close: 'Sulge',
    search: 'Otsi valemit...',
    all: 'Kõik',
    empty: 'Raamatukogu on tühi. Vali elemendid ja salvesta valem.',
    notFound: 'Midagi ei leitud.',
    confirmDelete: 'Kustuta valem raamatukogust?',
    insert: 'Lisa lõuendile',
    delete: 'Kustuta',
    elementsCount: (n) => `${n} elementi`,
  },
  snippetDialog: {
    title: 'Salvesta valem',
    name: 'Nimi',
    namePh: 'nt Ruudu pindala',
    category: 'Kategooria',
    categoryPh: 'nt Geomeetria',
    cancel: 'Tühista',
    save: 'Salvesta',
    defaultCategory: 'Üldine',
  },
  pages: {
    pages: 'Lehed',
    addPage: 'Lisa leht',
    duplicatePage: 'Dubleeri leht',
    deletePage: 'Kustuta leht',
    emptyPage: 'Tühi leht',
    page: 'Leht',
  },
  keyboard: {
    search: 'Otsi sümbolit (sin, alfa, →)',
    clear: 'Tühjenda',
    searchResults: 'Otsingu tulemused',
    notFound: 'Midagi ei leitud',
    favorites: 'Lemmikud',
    recent: 'Hiljuti kasutatud',
    clearShort: 'tühjenda',
    collapse: 'Sulge',
    expand: 'Ava',
    hintTip:
      'Topeltklõps tühjal kohal — arv või tekst. Parem klõps sümbolil — lemmik. Lohista pealkirja — järjesta.',
    favHint: '(parem klõps — lemmik)',
    pinned: 'Kinnitatud',
    dragHere: 'Lohista siia sümbol ülevalt',
    hintPin: 'Parem klõps — kinnita vasakusse doki. Lohista — sama.',
    searchShort: 'Otsi',
    searchTitle: 'Otsi sümbolit',
    searchPlaceholder: 'Otsi sümbolit (sin, alfa, →)',
    searchHint: 'Alusta tippimist. Näiteks: sin, alfa, →, kuup.',
    guestDockCta: 'Logi sisse — dokk salvestub sulle.',
    guestDockTitle: 'Logi sisse, et dokk salvestuks',
    clearTooltip: 'Tühjenda',
    resultsCount: (n) => `Tulemused (${n})`,
    groups: {
      Numbrid: 'Numbrid',
      Tehted: 'Tehted',
      Võrdlus: 'Võrdlus',
      Sulud: 'Sulud',
      Muutujad: 'Muutujad',
      'Kreeka — väiketähed': 'Kreeka — väiketähed',
      'Kreeka — suurtähed': 'Kreeka — suurtähed',
      Trigonomeetria: 'Trigonomeetria',
      'Logaritmid ja piir': 'Logaritmid ja piir',
      'Integraalid ja summad': 'Integraalid ja summad',
      Hulgateooria: 'Hulgateooria',
      Loogika: 'Loogika',
      Nooled: 'Nooled',
      Geomeetria: 'Geomeetria',
      Struktuurid: 'Struktuurid',
      'Kujundid 2D': 'Kujundid 2D',
      'Kujundid 2D punktiir': 'Kujundid 2D punktiir',
      'Kujundid 3D': 'Kujundid 3D',
    },
  },
  popup: {
    smaller: 'Väiksemaks',
    larger: 'Suuremaks',
    duplicate: 'Dubleeri',
    delete: 'Kustuta',
  },
  canvas: {
    emptyHint: 'Klõpsa vasakul sümbolil või tee topeltklõps tahvlil — siia ilmub element.',
    zoomOut: 'Vähenda',
    zoomFit: 'Mahuta lehele',
    zoomIn: 'Suurenda',
    duplicate: 'Dubleeri',
    delete: 'Kustuta',
    selectedCount: (n) => `${n} valitud`,
  },
  guide: {
    metaTitle: 'Juhend — Formo',
    metaDesc: 'Kuidas kasutada Formo matemaatika tahvlit',
    navLabel: 'Juhend',
    heroEyebrow: 'Matemaatika tahvel',
    heroTitle: 'Kuidas Formot kasutada',
    heroDesc:
      'Visuaalne tahvel õpetajatele ja õpilastele. Loo valemeid, murde, astmeid — kõik brauseris, ilma installimata. Ekspordi PNG või PDF formaadis.',
    ctaStart: 'Alusta kohe',
    ctaSeeGuide: 'Vaata juhendit',
    footer: 'Formo — matemaatika tahvel eesti õpetajatele',

    s1Title: '1. Alustamine',
    s1Sub: 'Kaks viisi, kuidas Formot avada — kiirelt või kontoga.',
    s1StepTitle: 'Ava esileht',
    s1StepDesc: 'Kaks nuppu — vali, mis sobib.',
    s1Cap: 'Esileht: Alusta kohe või Logi sisse',
    s1Item1Strong: 'Alusta kohe',
    s1Item1: ' — avad tahvli külaliserežiimis. Loo, ekspordi, sulge. Midagi ei salvestata.',
    s1Item2Strong: 'Logi sisse',
    s1Item2: ' — sisesta e-post ja nimi. Seejärel saab tahvleid salvestada ja hiljem avada lehelt ',
    s1Item2Em: 'Minu tööd',
    s1Tip: 'Külaliserežiim töötab täiesti kohalikult — ei ühtegi päringut serverile.',

    s2Title: '2. Tahvel ja ruudustik',
    s2Sub: 'Koolivihku imiteeriv 5 × 5 mm ruudustik — mõõda ja joonda täpselt.',
    s2StepTitle: 'Ruudustik nagu päris paberil',
    s2StepDesc: 'Iga ruut = 5 mm. Iga viies joon = 25 mm (tumedam).',
    s2Cap: 'A4 leht 5 mm ruudustikuga',
    s2Body:
      "Vaikimisi on leht A4 püsti. Toolbar'ist saab vahetada A3, A5 või kohandatud mõõtudele ning muuta orientatsiooni püsti ↔ rõhtsalt.",
    s2Tip1: 'Navigeerimine: hoia ',
    s2Tip2: ' ja lohista tahvlit; kasuta kerimisratast suurendamiseks või vähendamiseks.',

    s3Title: '3. Valemite sisestamine',
    s3Sub: 'Topeltklõps + kirjuta + Enter. Formo tunneb avaldised ise ära.',
    s3Body:
      'Tee topeltklõps tühjale kohale — avaneb sisestuskast. Kirjuta arv, muutuja või avaldis ja vajuta Enter. Formo tunneb automaatselt ära:',
    s3LblNumbers: 'Arvud',
    s3LblVars: 'Muutujad',
    s3LblOps: 'Operaatorid',
    s3LblExpr: 'Avaldised',

    s4Title: '4. Murrud, astmed ja indeksid',
    s4Sub: 'Keeruka vormistuse saad lihtsa lühendiga.',
    s4S1Title: 'Murd',
    s4S1Desc: '3/4 + Enter → vertikaalne murd.',
    s4S1Cap: 'Lugeja üles, nimetaja alla',
    s4S1Body1: 'Kirjuta ',
    s4S1Body2: ' ja vajuta Enter. Formo tõstab lugeja üles ja nimetaja alla automaatselt.',
    s4S2Title: 'Aste (ruut, kuup jne)',
    s4S2Desc: '42 + ↑ → 4². Töötab tähtedega ka.',
    s4S2Cap: 'Vajutus üles muudab viimase märgi astendajaks',
    s4S2Body1: 'Kirjuta ',
    s4S2Body2:
      ' ja vajuta ↑ — tulemus on 4². Sama töötab tähtedega: x2 + ↑ → x².',
    s4S3Title: 'Alaindeks (keemia, matemaatika)',
    s4S3Desc: 'H2 + ↓ → H₂.',
    s4S3Cap: 'Vajutus alla muudab viimase märgi alaindeksiks',
    s4S3Body1: 'Kirjuta ',
    s4S3Body2: ' ja vajuta ↓ — tulemus on H₂. Ideaalne keemia valemite jaoks.',

    s5Title: '5. Virtuaalne klaviatuur',
    s5Sub: 'Numbrid, operaatorid, funktsioonid — ühe klõpsu kaugusel.',
    s5StepTitle: 'Kasuta paneeli vasakul',
    s5StepDesc: 'Sobib puuteekraanile ja kui ei soovi klaviatuurivahetust.',
    s5Cap: 'Klõpsa nupule — element lisatakse tahvlile',
    s5Body:
      'Ekraani vasakus servas on paneel numbrite, operaatorite, funktsioonide ja erisümbolitega. Klõpsa nupule — element ilmub kohe tahvlile.',
    s5Tip: 'Mugav iPadil ja puuteekraaniga sülearvutitel — ei pea pidevalt klaviatuurilayoute vahetama.',

    s6Title: '6. Elementide muutmine',
    s6Sub: 'Värv, suurus, dubleerimine ja kustutamine ühes paneelis.',
    s6StepTitle: 'Kiirpaneel valitud elemendi juures',
    s6StepDesc: 'Klõpsa elementi ja muuda seda kohe.',
    s6Cap: 'Kiirpaneel ilmub valitud elemendi kõrvale',
    s6Item1: 'Värvi muutmine (6 esmaselget varianti)',
    s6Item2: 'Šrifti suurus',
    s6Item3: 'Kopeeri (dubleeri)',
    s6Item4a: 'Kustuta (või vajuta ',
    s6Item4b: ')',
    s6Tip1: 'Mitme elemendi valimiseks hoia ',
    s6Tip2: ' ja klõpsa, või tõmba hiirega valimisraam. ',
    s6Tip3: ' valib kõik lehel olevad elemendid.',

    s7Title: '7. Mitu lehte',
    s7Sub: 'Üks tahvel, palju lehti — nagu töövihikul.',
    s7StepTitle: 'Lehtede paneel paremal',
    s7StepDesc: 'Klõpsa + uue lehe lisamiseks, hõlju kaardil dubleerimiseks/kustutamiseks.',
    s7Cap: 'Iga leht on eraldi tööpind',
    s7Body:
      'Igal tahvlil võib olla mitu lehte. Eksport töötab nii üksiku lehe kui kõigi lehtede kohta — saad koostada mitmeleheline tööleht ja salvestada kõik ühe PDF-ina.',

    s8Title: '8. Valemite raamatukogu',
    s8Sub: 'Salvesta tihedalt kasutatavad valemid ja taaskasuta ühe klõpsuga.',
    s8AccTitle: 'Kuidas valemit salvestada ja uuesti kasutada?',
    s8AccDesc: 'Kolm sammu — nimi, kategooria, valmis.',
    s8Step1: 'Vali element või elementide grupp tahvlil.',
    s8Step2a: "Klõpsa toolbar'ist ",
    s8Step2b: ' (järjehoidja+ ikoon).',
    s8Step3: 'Anna nimi ja kategooria (nt ',
    s8Step3Em1: 'Geomeetria',
    s8Step3Em2: 'Füüsika',
    s8Body:
      'Hiljem ava raamatukogu (järjehoidja ikoon), otsi nime järgi või filtreeri kategooria järgi ning klõpsa — valem ilmub kohe tahvlile.',

    s9Title: '9. Eksport: PNG ja PDF',
    s9Sub: 'Kolm taset: kogu leht, kõik lehed või ainult valitud ala.',
    s9PngCap: 'PNG menüü: Kogu leht või Valitud ala',
    s9PdfCap: 'PDF menüü: See leht, Kõik lehed, Valitud ala',
    s9Card1Title: 'Kogu leht',
    s9Card1Body:
      'Terve tahvli leht pildina või PDF-ina. Kolm tausta: ruudustikuga, valge või läbipaistev.',
    s9Card2Title: 'Kõik lehed',
    s9Card2Body: 'Ainult PDF. Mitmeleheline fail — üks leht = üks lehekülg.',
    s9Card3Title: 'Valitud ala',
    s9Card3Body:
      'Ainult valitud elemendid, tihedalt kärbitud. Ideaalne üksiku valemi kopeerimiseks töölehte.',
    s9TipStrong: 'Vihje:',
    s9TipBody:
      ' läbipaistva taustaga PNG sobib mistahes slaiditaustaga — ei pea muretsema esitluse värvi pärast.',

    s10Title: '10. Konto ja salvestamine',
    s10Sub: 'Logi sisse e-postiga, et tahvlid püsivalt alles jääksid.',
    s10LoginCap: 'Sisselogimine: e-post + nimi',
    s10WorksCap: 'Minu tööd — salvestatud tahvlite galerii',
    s10Item1Strong: 'Salvesta',
    s10Item1: ' — salvestab praeguse tahvli koos kõigi lehtedega.',
    s10Item2Strong: 'Ava tahvel',
    s10Item2: ' — kuvab salvestatud tahvlite loendi.',
    s10Item3Strong: 'Minu tööd',
    s10Item3: ' — kõigi tahvlite galerii eelvaadetega.',
    s10NoteStrong: 'Märkus:',
    s10Note:
      ' praegu salvestatakse tahvlid sinu brauserisse (localStorage). Kui vahetad arvutit või puhastad brauseri andmed, lähevad need kaduma. Impordi/ekspordi JSON funktsiooni abil saad tahvli ühest brauserist teise viia.',

    s11Title: '11. Kiirklahvid',
    s11Sub: 'Kõik kombinatsioonid ühes kohas.',
    s11ThKey: 'Klahv',
    s11ThAction: 'Tegevus',
    kb: {
      enter: 'Lisa sisestatud valem',
      arrowUp: ' pärast numbrit/tähte',
      upAction: 'Tee astmeks (4² , x²)',
      arrowDown: ' pärast numbrit/tähte',
      downAction: 'Tee alaindeksiks (H₂)',
      ctrl: 'Ctrl',
      a: 'A',
      aAction: 'Vali kõik',
      c: 'C',
      cAction: 'Kopeeri valitud',
      v: 'V',
      vAction: 'Kleebi',
      d: 'D',
      dAction: 'Dubleeri valitud',
      z: 'Z',
      zAction: 'Võta tagasi',
      shiftZ: 'Tee uuesti',
      del: 'Delete / Backspace',
      delAction: 'Kustuta valitud',
      esc: 'Esc',
      escAction: 'Tühista valik',
      space: ' + hiir',
      spaceAction: 'Liiguta tahvlit',
    },

    ctaTitle: 'Valmis proovima?',
    ctaSub: 'Ava tahvel ja alusta — ei mingit seadistamist.',
    ctaOpen: 'Ava tahvel',
    ctaHome: 'Esilehele',

    navTitles: {
      s1: 'Alustamine',
      s2: 'Tahvel',
      s3: 'Sisestamine',
      s4: 'Murrud',
      s5: 'Klaviatuur',
      s6: 'Muutmine',
      s7: 'Lehed',
      s8: 'Raamatukogu',
      s9: 'Eksport',
      s10: 'Konto',
      s11: 'Kiirklahvid',
    },
  },
};

const en: Dict = {
  nav: {
    back: 'Back',
    login: 'Log in',
    logout: 'Log out',
    guide: 'Guide',
  },
  landing: {
    eyebrow: 'Math whiteboard',
    startNow: 'Start now',
    startNowDesc: 'Guest mode — no account needed',
    myWorks: 'My works',
    myWorksDesc: 'Your saved boards and formulas',
    loginBtn: 'Log in',
    loginDesc: 'Save boards and formulas',
    seeGuide: 'Read the guide',
    footer: 'Guest mode works entirely offline',
  },
  login: {
    title: 'Log in',
    subtitle:
      "No account needed — just enter an email and a name. Your work is stored locally.",
    email: 'Email',
    emailPh: 'maria@school.com',
    name: 'Name',
    nameOptional: '(optional)',
    namePh: 'Maria Smith',
    submit: 'Log in',
    error: 'Enter a valid email',
    guestHint: 'You can also start without logging in —',
    guestLink: 'open the board directly',
  },
  works: {
    backHome: 'Home',
    myWorks: 'My works',
    empty: "You haven't saved any boards yet.",
    savedCount: (n) => `${n} saved board${n === 1 ? '' : 's'}`,
    newBoard: 'New board',
    search: 'Search boards…',
    notFound: 'Nothing found.',
    emptyTitle: 'No boards yet',
    emptyHint: 'Start a new board and save it here.',
    emptyCta: 'Create the first',
    confirmDelete: 'Delete board?',
    delete: 'Delete',
    open: 'Open:',
    loading: 'Loading…',
    backToHome: 'Back to home',
  },
  toolbar: {
    undo: 'Undo (⌘Z)',
    redo: 'Redo (⌘⇧Z)',
    duplicate: 'Duplicate (⌘D)',
    deleteSel: 'Delete (Del)',
    newBoard: 'New board',
    loginSave: 'Log in to save boards',
    loginSaveBtn: 'Log in to save',
    save: 'Save (⌘S)',
    openBoard: 'Open board',
    myWorks: 'My works',
    saveToLib: 'Save formula to library',
    library: 'Formula library',
    page: 'Page:',
    bg: 'Background:',
    bgTransparent: 'Transparent',
    bgWhite: 'White',
    font: 'Font:',
    copyPng: 'Copy PNG',
    pngMenu: 'Download PNG',
    pdfMenu: 'Download PDF',
    fullPage: 'Full page',
    gridBg: 'With grid',
    whiteBg: 'White background',
    transparentBg: 'Transparent',
    selectionArea: 'Selection',
    thisPage: 'This page',
    allPages: 'All pages',
    whiteBgPdf: 'White background',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    saved: 'Saved',
    savedBoards: 'Saved boards',
    nothingSaved: 'Nothing saved yet.',
    noPreview: 'no preview',
    pdfReady: 'PDF ready',
    pdfError: 'PDF error',
    selectFirst: 'Select elements first',
    opened: 'Opened:',
    copied: 'Copied',
    clipboardUnavail: 'Clipboard not available',
    confirmDelete: 'Delete board?',
    savedAs: 'Saved:',
    imported: 'Imported:',
    invalidJson: 'Invalid JSON file',
    unnamed: 'Untitled',
  },
  library: {
    title: 'Formula library',
    close: 'Close',
    search: 'Search formulas...',
    all: 'All',
    empty: 'Library is empty. Select elements and save a formula.',
    notFound: 'Nothing found.',
    confirmDelete: 'Delete formula from library?',
    insert: 'Insert on canvas',
    delete: 'Delete',
    elementsCount: (n) => `${n} element${n === 1 ? '' : 's'}`,
  },
  snippetDialog: {
    title: 'Save formula',
    name: 'Name',
    namePh: 'e.g. Area of a square',
    category: 'Category',
    categoryPh: 'e.g. Geometry',
    cancel: 'Cancel',
    save: 'Save',
    defaultCategory: 'General',
  },
  pages: {
    pages: 'Pages',
    addPage: 'Add page',
    duplicatePage: 'Duplicate page',
    deletePage: 'Delete page',
    emptyPage: 'Empty page',
    page: 'Page',
  },
  keyboard: {
    search: 'Search symbol (sin, alpha, →)',
    clear: 'Clear',
    searchResults: 'Search results',
    notFound: 'Nothing found',
    favorites: 'Favorites',
    recent: 'Recently used',
    clearShort: 'clear',
    collapse: 'Collapse',
    expand: 'Expand',
    hintTip:
      'Double-click empty space — number or text. Right-click a symbol — favorite. Drag a title — reorder.',
    favHint: '(right-click — favorite)',
    pinned: 'Pinned',
    dragHere: 'Drag a symbol here from above',
    hintPin: 'Right-click — pin to left dock. Drag — same.',
    searchShort: 'Search',
    searchTitle: 'Search symbol',
    searchPlaceholder: 'Search symbol (sin, alpha, →)',
    searchHint: 'Start typing. For example: sin, alpha, →, cube.',
    guestDockCta: 'Log in — your dock will persist.',
    guestDockTitle: 'Log in so the dock is saved for you',
    clearTooltip: 'Clear',
    resultsCount: (n) => `Results (${n})`,
    groups: {
      Numbrid: 'Numbers',
      Tehted: 'Operations',
      Võrdlus: 'Comparison',
      Sulud: 'Brackets',
      Muutujad: 'Variables',
      'Kreeka — väiketähed': 'Greek — lowercase',
      'Kreeka — suurtähed': 'Greek — uppercase',
      Trigonomeetria: 'Trigonometry',
      'Logaritmid ja piir': 'Logarithms & limits',
      'Integraalid ja summad': 'Integrals & sums',
      Hulgateooria: 'Set theory',
      Loogika: 'Logic',
      Nooled: 'Arrows',
      Geomeetria: 'Geometry',
      Struktuurid: 'Structures',
      'Kujundid 2D': 'Shapes 2D',
      'Kujundid 2D punktiir': 'Shapes 2D dashed',
      'Kujundid 3D': 'Shapes 3D',
    },
  },
  popup: {
    smaller: 'Smaller',
    larger: 'Larger',
    duplicate: 'Duplicate',
    delete: 'Delete',
  },
  canvas: {
    emptyHint: 'Click a symbol on the left or double-click the canvas — your element appears here.',
    zoomOut: 'Zoom out',
    zoomFit: 'Fit to page',
    zoomIn: 'Zoom in',
    duplicate: 'Duplicate',
    delete: 'Delete',
    selectedCount: (n) => `${n} selected`,
  },
  guide: {
    metaTitle: 'Guide — Formo',
    metaDesc: 'How to use the Formo math whiteboard',
    navLabel: 'Guide',
    heroEyebrow: 'Math whiteboard',
    heroTitle: 'How to use Formo',
    heroDesc:
      'A visual whiteboard for teachers and students. Create formulas, fractions and exponents — all in the browser, no install. Export as PNG or PDF.',
    ctaStart: 'Start now',
    ctaSeeGuide: 'Read the guide',
    footer: 'Formo — a math whiteboard for Estonian teachers',

    s1Title: '1. Getting started',
    s1Sub: 'Two ways to open Formo — quickly or with an account.',
    s1StepTitle: 'Open the home page',
    s1StepDesc: 'Two buttons — pick what fits.',
    s1Cap: 'Home: Start now or Log in',
    s1Item1Strong: 'Start now',
    s1Item1: ' — opens the board in guest mode. Create, export, close. Nothing is saved.',
    s1Item2Strong: 'Log in',
    s1Item2: ' — enter an email and name. Then you can save boards and reopen them later from ',
    s1Item2Em: 'My works',
    s1Tip: 'Guest mode works entirely locally — not a single request to the server.',

    s2Title: '2. Canvas and grid',
    s2Sub: 'A 5 × 5 mm grid just like a school notebook — measure and align precisely.',
    s2StepTitle: 'Grid like real paper',
    s2StepDesc: 'Every cell = 5 mm. Every fifth line = 25 mm (darker).',
    s2Cap: 'A4 sheet with a 5 mm grid',
    s2Body:
      'The default is A4 portrait. From the toolbar you can switch to A3, A5 or custom sizes and flip orientation between portrait and landscape.',
    s2Tip1: 'Navigation: hold ',
    s2Tip2: ' and drag the canvas; use the scroll wheel to zoom in and out.',

    s3Title: '3. Entering formulas',
    s3Sub: 'Double-click + type + Enter. Formo recognizes expressions for you.',
    s3Body:
      'Double-click empty space — an input box appears. Type a number, variable or expression and press Enter. Formo automatically recognizes:',
    s3LblNumbers: 'Numbers',
    s3LblVars: 'Variables',
    s3LblOps: 'Operators',
    s3LblExpr: 'Expressions',

    s4Title: '4. Fractions, exponents and subscripts',
    s4Sub: 'Complex formatting with a simple shortcut.',
    s4S1Title: 'Fraction',
    s4S1Desc: '3/4 + Enter → vertical fraction.',
    s4S1Cap: 'Numerator on top, denominator below',
    s4S1Body1: 'Type ',
    s4S1Body2:
      ' and press Enter. Formo lifts the numerator up and drops the denominator down automatically.',
    s4S2Title: 'Exponent (square, cube, etc.)',
    s4S2Desc: '42 + ↑ → 4². Works with letters too.',
    s4S2Cap: 'Pressing up turns the last character into an exponent',
    s4S2Body1: 'Type ',
    s4S2Body2:
      ' and press ↑ — the result is 4². Same works with letters: x2 + ↑ → x².',
    s4S3Title: 'Subscript (chemistry, math)',
    s4S3Desc: 'H2 + ↓ → H₂.',
    s4S3Cap: 'Pressing down turns the last character into a subscript',
    s4S3Body1: 'Type ',
    s4S3Body2: ' and press ↓ — the result is H₂. Perfect for chemistry formulas.',

    s5Title: '5. Virtual keyboard',
    s5Sub: 'Numbers, operators, functions — one click away.',
    s5StepTitle: 'Use the panel on the left',
    s5StepDesc: 'Great for touchscreens and when you want to avoid keyboard layout swaps.',
    s5Cap: 'Tap a button — the element is added to the canvas',
    s5Body:
      'On the left side of the screen is a panel with numbers, operators, functions and special symbols. Tap a button — the element appears on the canvas right away.',
    s5Tip: 'Convenient on iPad and touch laptops — no more layout switching.',

    s6Title: '6. Editing elements',
    s6Sub: 'Color, size, duplication and deletion in one panel.',
    s6StepTitle: 'Quick panel next to the selected element',
    s6StepDesc: 'Click an element and edit it instantly.',
    s6Cap: 'The quick panel appears next to the selected element',
    s6Item1: 'Change color (6 preset options)',
    s6Item2: 'Font size',
    s6Item3: 'Copy (duplicate)',
    s6Item4a: 'Delete (or press ',
    s6Item4b: ')',
    s6Tip1: 'To select multiple elements hold ',
    s6Tip2: ' and click, or drag a selection box. ',
    s6Tip3: ' selects everything on the page.',

    s7Title: '7. Multiple pages',
    s7Sub: 'One board, many pages — like a workbook.',
    s7StepTitle: 'Pages panel on the right',
    s7StepDesc: 'Click + to add a page, hover a card to duplicate/delete.',
    s7Cap: 'Each page is its own workspace',
    s7Body:
      'Each board can contain multiple pages. Export works both for a single page and for all pages — you can compose a multi-page worksheet and save the whole thing as one PDF.',

    s8Title: '8. Formula library',
    s8Sub: 'Save frequently used formulas and reuse them with one click.',
    s8AccTitle: 'How do I save a formula and reuse it?',
    s8AccDesc: 'Three steps — name, category, done.',
    s8Step1: 'Select an element or a group of elements on the canvas.',
    s8Step2a: 'Click ',
    s8Step2b: ' in the toolbar (bookmark+ icon).',
    s8Step3: 'Give it a name and a category (e.g. ',
    s8Step3Em1: 'Geometry',
    s8Step3Em2: 'Physics',
    s8Body:
      'Later open the library (bookmark icon), search by name or filter by category and click — the formula appears on the canvas.',

    s9Title: '9. Export: PNG and PDF',
    s9Sub: 'Three scopes: full page, all pages, or selection only.',
    s9PngCap: 'PNG menu: Full page or Selection',
    s9PdfCap: 'PDF menu: This page, All pages, Selection',
    s9Card1Title: 'Full page',
    s9Card1Body:
      'The whole board page as an image or PDF. Three backgrounds: with grid, white or transparent.',
    s9Card2Title: 'All pages',
    s9Card2Body: 'PDF only. Multi-page file — one page = one page.',
    s9Card3Title: 'Selection',
    s9Card3Body:
      'Only the selected elements, tightly cropped. Perfect for copying a single formula into a worksheet.',
    s9TipStrong: 'Tip:',
    s9TipBody:
      " PNG with a transparent background works on any slide — no worrying about presentation colors.",

    s10Title: '10. Account and saving',
    s10Sub: 'Log in with an email so boards stay around.',
    s10LoginCap: 'Log in: email + name',
    s10WorksCap: 'My works — gallery of saved boards',
    s10Item1Strong: 'Save',
    s10Item1: ' — saves the current board with all its pages.',
    s10Item2Strong: 'Open board',
    s10Item2: ' — shows the list of saved boards.',
    s10Item3Strong: 'My works',
    s10Item3: ' — gallery of all boards with previews.',
    s10NoteStrong: 'Note:',
    s10Note:
      ' boards are currently stored in your browser (localStorage). If you switch computers or clear browser data, they are gone. Use JSON import/export to move a board between browsers.',

    s11Title: '11. Keyboard shortcuts',
    s11Sub: 'All combinations in one place.',
    s11ThKey: 'Key',
    s11ThAction: 'Action',
    kb: {
      enter: 'Insert the typed formula',
      arrowUp: ' after a number/letter',
      upAction: 'Make an exponent (4², x²)',
      arrowDown: ' after a number/letter',
      downAction: 'Make a subscript (H₂)',
      ctrl: 'Ctrl',
      a: 'A',
      aAction: 'Select all',
      c: 'C',
      cAction: 'Copy selection',
      v: 'V',
      vAction: 'Paste',
      d: 'D',
      dAction: 'Duplicate selection',
      z: 'Z',
      zAction: 'Undo',
      shiftZ: 'Redo',
      del: 'Delete / Backspace',
      delAction: 'Delete selection',
      esc: 'Esc',
      escAction: 'Clear selection',
      space: ' + mouse',
      spaceAction: 'Pan the canvas',
    },

    ctaTitle: 'Ready to try?',
    ctaSub: 'Open the board and start — no setup needed.',
    ctaOpen: 'Open board',
    ctaHome: 'Home',

    navTitles: {
      s1: 'Start',
      s2: 'Canvas',
      s3: 'Input',
      s4: 'Fractions',
      s5: 'Keyboard',
      s6: 'Editing',
      s7: 'Pages',
      s8: 'Library',
      s9: 'Export',
      s10: 'Account',
      s11: 'Shortcuts',
    },
  },
};

const ru: Dict = {
  nav: {
    back: 'Назад',
    login: 'Войти',
    logout: 'Выйти',
    guide: 'Гайд',
  },
  landing: {
    eyebrow: 'Математическая доска',
    startNow: 'Начать',
    startNowDesc: 'Гостевой режим без аккаунта',
    myWorks: 'Мои работы',
    myWorksDesc: 'Сохранённые доски и формулы',
    loginBtn: 'Войти',
    loginDesc: 'Сохраняй доски и формулы',
    seeGuide: 'Смотреть гайд',
    footer: 'Гостевой режим работает полностью локально',
  },
  login: {
    title: 'Вход',
    subtitle:
      'Регистрация не нужна — просто укажи почту и имя. Работы сохраняются локально.',
    email: 'Почта',
    emailPh: 'maria@school.ru',
    name: 'Имя',
    nameOptional: '(необязательно)',
    namePh: 'Мария Смирнова',
    submit: 'Войти',
    error: 'Введи корректный email',
    guestHint: 'Можно начать и без входа —',
    guestLink: 'открыть доску напрямую',
  },
  works: {
    backHome: 'На главную',
    myWorks: 'Мои работы',
    empty: 'Пока нет ни одной сохранённой доски.',
    savedCount: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return `${n} сохранённая доска`;
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
        return `${n} сохранённые доски`;
      return `${n} сохранённых досок`;
    },
    newBoard: 'Новая доска',
    search: 'Поиск досок…',
    notFound: 'Ничего не найдено.',
    emptyTitle: 'Досок пока нет',
    emptyHint: 'Начни новую доску и сохрани её сюда.',
    emptyCta: 'Создать первую',
    confirmDelete: 'Удалить доску?',
    delete: 'Удалить',
    open: 'Открыть:',
    loading: 'Загрузка…',
    backToHome: 'На главную',
  },
  toolbar: {
    undo: 'Отменить (⌘Z)',
    redo: 'Повторить (⌘⇧Z)',
    duplicate: 'Дублировать (⌘D)',
    deleteSel: 'Удалить (Del)',
    newBoard: 'Новая доска',
    loginSave: 'Войди, чтобы сохранять доски',
    loginSaveBtn: 'Войти для сохранения',
    save: 'Сохранить (⌘S)',
    openBoard: 'Открыть доску',
    myWorks: 'Мои работы',
    saveToLib: 'Сохранить формулу в библиотеку',
    library: 'Библиотека формул',
    page: 'Лист:',
    bg: 'Фон:',
    bgTransparent: 'Прозрачный',
    bgWhite: 'Белый',
    font: 'Шрифт:',
    copyPng: 'Копировать PNG',
    pngMenu: 'Скачать PNG',
    pdfMenu: 'Скачать PDF',
    fullPage: 'Весь лист',
    gridBg: 'С клеткой',
    whiteBg: 'Белый фон',
    transparentBg: 'Прозрачный',
    selectionArea: 'Выделение',
    thisPage: 'Этот лист',
    allPages: 'Все листы',
    whiteBgPdf: 'Белый фон',
    exportJson: 'Экспорт JSON',
    importJson: 'Импорт JSON',
    saved: 'Сохранено',
    savedBoards: 'Сохранённые доски',
    nothingSaved: 'Пока ничего не сохранено.',
    noPreview: 'нет превью',
    pdfReady: 'PDF готов',
    pdfError: 'Ошибка PDF',
    selectFirst: 'Выдели элементы',
    opened: 'Открыто:',
    copied: 'Скопировано',
    clipboardUnavail: 'Буфер недоступен',
    confirmDelete: 'Удалить доску?',
    savedAs: 'Сохранено:',
    imported: 'Импортировано:',
    invalidJson: 'Битый JSON-файл',
    unnamed: 'Без названия',
  },
  library: {
    title: 'Библиотека формул',
    close: 'Закрыть',
    search: 'Поиск формулы...',
    all: 'Все',
    empty: 'Библиотека пуста. Выдели элементы и сохрани формулу.',
    notFound: 'Ничего не найдено.',
    confirmDelete: 'Удалить формулу из библиотеки?',
    insert: 'Вставить на холст',
    delete: 'Удалить',
    elementsCount: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return `${n} элемент`;
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
        return `${n} элемента`;
      return `${n} элементов`;
    },
  },
  snippetDialog: {
    title: 'Сохранить формулу',
    name: 'Название',
    namePh: 'напр. Площадь квадрата',
    category: 'Категория',
    categoryPh: 'напр. Геометрия',
    cancel: 'Отмена',
    save: 'Сохранить',
    defaultCategory: 'Общее',
  },
  pages: {
    pages: 'Листы',
    addPage: 'Добавить лист',
    duplicatePage: 'Дублировать лист',
    deletePage: 'Удалить лист',
    emptyPage: 'Пустой лист',
    page: 'Лист',
  },
  keyboard: {
    search: 'Поиск символа (sin, альфа, →)',
    clear: 'Очистить',
    searchResults: 'Результаты поиска',
    notFound: 'Ничего не найдено',
    favorites: 'Избранное',
    recent: 'Недавние',
    clearShort: 'очистить',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    hintTip:
      'Двойной клик по пустому месту — число или текст. Правый клик по символу — в избранное. Перетаскивай заголовок — меняй порядок.',
    favHint: '(правый клик — в избранное)',
    pinned: 'Закреплённые',
    dragHere: 'Перетащи сюда символ сверху',
    hintPin: 'Правый клик — закрепить в левом доке. Перетащи — так же.',
    searchShort: 'Поиск',
    searchTitle: 'Поиск символа',
    searchPlaceholder: 'Поиск символа (sin, альфа, →)',
    searchHint: 'Начни печатать. Например: sin, альфа, →, куб.',
    guestDockCta: 'Войди — док сохранится под тебя.',
    guestDockTitle: 'Войди, чтобы док сохранился',
    clearTooltip: 'Очистить',
    resultsCount: (n) => `Результаты (${n})`,
    groups: {
      Numbrid: 'Цифры',
      Tehted: 'Операции',
      Võrdlus: 'Сравнение',
      Sulud: 'Скобки',
      Muutujad: 'Переменные',
      'Kreeka — väiketähed': 'Греческие — строчные',
      'Kreeka — suurtähed': 'Греческие — прописные',
      Trigonomeetria: 'Тригонометрия',
      'Logaritmid ja piir': 'Логарифмы и предел',
      'Integraalid ja summad': 'Интегралы и суммы',
      Hulgateooria: 'Теория множеств',
      Loogika: 'Логика',
      Nooled: 'Стрелки',
      Geomeetria: 'Геометрия',
      Struktuurid: 'Структуры',
      'Kujundid 2D': 'Фигуры 2D',
      'Kujundid 2D punktiir': 'Фигуры 2D пунктир',
      'Kujundid 3D': 'Фигуры 3D',
    },
  },
  popup: {
    smaller: 'Меньше',
    larger: 'Больше',
    duplicate: 'Дублировать',
    delete: 'Удалить',
  },
  canvas: {
    emptyHint: 'Кликни по символу слева или сделай двойной клик по доске — элемент появится здесь.',
    zoomOut: 'Уменьшить',
    zoomFit: 'По размеру листа',
    zoomIn: 'Увеличить',
    duplicate: 'Дублировать',
    delete: 'Удалить',
    selectedCount: (n) => `${n} выделено`,
  },
  guide: {
    metaTitle: 'Гайд — Formo',
    metaDesc: 'Как пользоваться математической доской Formo',
    navLabel: 'Гайд',
    heroEyebrow: 'Математическая доска',
    heroTitle: 'Как пользоваться Formo',
    heroDesc:
      'Визуальная доска для учителей и учеников. Создавай формулы, дроби, степени — всё в браузере, без установки. Экспорт в PNG или PDF.',
    ctaStart: 'Начать',
    ctaSeeGuide: 'Смотреть гайд',
    footer: 'Formo — математическая доска для эстонских учителей',

    s1Title: '1. Начало работы',
    s1Sub: 'Два способа открыть Formo — быстро или с аккаунтом.',
    s1StepTitle: 'Открой главную',
    s1StepDesc: 'Две кнопки — выбирай что ближе.',
    s1Cap: 'Главная: Начать или Войти',
    s1Item1Strong: 'Начать',
    s1Item1: ' — откроет доску в гостевом режиме. Создавай, экспортируй, закрывай. Ничего не сохраняется.',
    s1Item2Strong: 'Войти',
    s1Item2: ' — укажи почту и имя. После этого доски можно сохранять и открывать со страницы ',
    s1Item2Em: 'Мои работы',
    s1Tip: 'Гостевой режим работает полностью локально — ни одного запроса к серверу.',

    s2Title: '2. Доска и клетка',
    s2Sub: 'Клетка 5 × 5 мм как в школьной тетради — измеряй и выравнивай точно.',
    s2StepTitle: 'Клетка как на бумаге',
    s2StepDesc: 'Каждая клетка = 5 мм. Каждая пятая линия = 25 мм (темнее).',
    s2Cap: 'Лист A4 с клеткой 5 мм',
    s2Body:
      'По умолчанию лист A4 вертикальный. Из тулбара можно переключить на A3, A5 или свой размер и поменять ориентацию.',
    s2Tip1: 'Навигация: удерживай ',
    s2Tip2: ' и таскай доску; колесо мыши — зум.',

    s3Title: '3. Ввод формул',
    s3Sub: 'Двойной клик + ввод + Enter. Formo сам распознаёт выражение.',
    s3Body:
      'Двойной клик по пустому месту — откроется поле ввода. Набирай число, переменную или выражение и жми Enter. Formo автоматически распознает:',
    s3LblNumbers: 'Числа',
    s3LblVars: 'Переменные',
    s3LblOps: 'Операторы',
    s3LblExpr: 'Выражения',

    s4Title: '4. Дроби, степени и индексы',
    s4Sub: 'Сложное оформление одним коротким сочетанием.',
    s4S1Title: 'Дробь',
    s4S1Desc: '3/4 + Enter → вертикальная дробь.',
    s4S1Cap: 'Числитель сверху, знаменатель снизу',
    s4S1Body1: 'Набери ',
    s4S1Body2:
      ' и нажми Enter. Formo автоматически поднимет числитель вверх, знаменатель — вниз.',
    s4S2Title: 'Степень (квадрат, куб и т.д.)',
    s4S2Desc: '42 + ↑ → 4². Работает и с буквами.',
    s4S2Cap: 'Стрелка вверх превращает последний символ в степень',
    s4S2Body1: 'Набери ',
    s4S2Body2:
      ' и нажми ↑ — получится 4². С буквами тоже: x2 + ↑ → x².',
    s4S3Title: 'Нижний индекс (химия, математика)',
    s4S3Desc: 'H2 + ↓ → H₂.',
    s4S3Cap: 'Стрелка вниз превращает последний символ в нижний индекс',
    s4S3Body1: 'Набери ',
    s4S3Body2: ' и нажми ↓ — получится H₂. Идеально для химии.',

    s5Title: '5. Виртуальная клавиатура',
    s5Sub: 'Цифры, операторы, функции — в один клик.',
    s5StepTitle: 'Панель слева',
    s5StepDesc: 'Удобно на сенсорном экране и чтобы не переключать раскладку.',
    s5Cap: 'Клик по кнопке — элемент появляется на холсте',
    s5Body:
      'Слева от доски — панель с цифрами, операторами, функциями и спецсимволами. Клик по кнопке — элемент сразу на холсте.',
    s5Tip: 'Удобно на iPad и сенсорных ноутбуках — не надо постоянно менять раскладку.',

    s6Title: '6. Редактирование элементов',
    s6Sub: 'Цвет, размер, дублирование и удаление — всё в одной панели.',
    s6StepTitle: 'Быстрая панель у выделенного элемента',
    s6StepDesc: 'Клик по элементу — и сразу меняй.',
    s6Cap: 'Быстрая панель появляется рядом с выделенным элементом',
    s6Item1: 'Смена цвета (6 готовых вариантов)',
    s6Item2: 'Размер шрифта',
    s6Item3: 'Копирование (дублирование)',
    s6Item4a: 'Удаление (или нажми ',
    s6Item4b: ')',
    s6Tip1: 'Чтобы выделить несколько — удерживай ',
    s6Tip2: ' и кликай, или протяни рамку. ',
    s6Tip3: ' выделяет всё на листе.',

    s7Title: '7. Несколько листов',
    s7Sub: 'Одна доска — много листов, как рабочая тетрадь.',
    s7StepTitle: 'Панель листов справа',
    s7StepDesc: 'Плюс добавляет лист, ховер по карточке — дублировать/удалить.',
    s7Cap: 'Каждый лист — отдельное рабочее пространство',
    s7Body:
      'На доске может быть несколько листов. Экспорт умеет и один лист, и все сразу — можно собрать многостраничный воркшит и сохранить одним PDF.',

    s8Title: '8. Библиотека формул',
    s8Sub: 'Сохраняй часто используемые формулы и вставляй в один клик.',
    s8AccTitle: 'Как сохранить формулу и вставить её снова?',
    s8AccDesc: 'Три шага — название, категория, готово.',
    s8Step1: 'Выдели элемент или группу элементов на холсте.',
    s8Step2a: 'Нажми в тулбаре ',
    s8Step2b: ' (иконка закладка+).',
    s8Step3: 'Дай название и категорию (например ',
    s8Step3Em1: 'Геометрия',
    s8Step3Em2: 'Физика',
    s8Body:
      'Позже открой библиотеку (иконка закладки), поищи по названию или фильтруй по категории и кликни — формула появится на холсте.',

    s9Title: '9. Экспорт: PNG и PDF',
    s9Sub: 'Три варианта: весь лист, все листы или только выделение.',
    s9PngCap: 'Меню PNG: Весь лист или Выделение',
    s9PdfCap: 'Меню PDF: Этот лист, Все листы, Выделение',
    s9Card1Title: 'Весь лист',
    s9Card1Body:
      'Целый лист доски как изображение или PDF. Три фона: с клеткой, белый или прозрачный.',
    s9Card2Title: 'Все листы',
    s9Card2Body: 'Только PDF. Многостраничный файл — один лист = одна страница.',
    s9Card3Title: 'Выделение',
    s9Card3Body:
      'Только выделенные элементы, плотно обрезанные. Идеально для копирования одной формулы в воркшит.',
    s9TipStrong: 'Подсказка:',
    s9TipBody:
      ' PNG с прозрачным фоном ложится на любой слайд — не надо переживать за цвет презентации.',

    s10Title: '10. Аккаунт и сохранение',
    s10Sub: 'Войди с почтой, чтобы доски остались.',
    s10LoginCap: 'Вход: почта + имя',
    s10WorksCap: 'Мои работы — галерея сохранённых досок',
    s10Item1Strong: 'Сохранить',
    s10Item1: ' — сохранит текущую доску со всеми листами.',
    s10Item2Strong: 'Открыть доску',
    s10Item2: ' — список сохранённых досок.',
    s10Item3Strong: 'Мои работы',
    s10Item3: ' — галерея всех досок с превью.',
    s10NoteStrong: 'Заметка:',
    s10Note:
      ' сейчас доски хранятся в браузере (localStorage). При смене компа или очистке данных браузера они пропадут. Переносить доски между браузерами можно через экспорт/импорт JSON.',

    s11Title: '11. Горячие клавиши',
    s11Sub: 'Все сочетания в одном месте.',
    s11ThKey: 'Клавиша',
    s11ThAction: 'Действие',
    kb: {
      enter: 'Вставить набранную формулу',
      arrowUp: ' после цифры/буквы',
      upAction: 'Сделать степенью (4², x²)',
      arrowDown: ' после цифры/буквы',
      downAction: 'Сделать нижним индексом (H₂)',
      ctrl: 'Ctrl',
      a: 'A',
      aAction: 'Выделить всё',
      c: 'C',
      cAction: 'Копировать выделение',
      v: 'V',
      vAction: 'Вставить',
      d: 'D',
      dAction: 'Дублировать выделение',
      z: 'Z',
      zAction: 'Отменить',
      shiftZ: 'Повторить',
      del: 'Delete / Backspace',
      delAction: 'Удалить выделение',
      esc: 'Esc',
      escAction: 'Снять выделение',
      space: ' + мышь',
      spaceAction: 'Перемещать доску',
    },

    ctaTitle: 'Готов попробовать?',
    ctaSub: 'Открывай доску и начинай — никакой настройки.',
    ctaOpen: 'Открыть доску',
    ctaHome: 'На главную',

    navTitles: {
      s1: 'Старт',
      s2: 'Доска',
      s3: 'Ввод',
      s4: 'Дроби',
      s5: 'Клавиатура',
      s6: 'Редактор',
      s7: 'Листы',
      s8: 'Библиотека',
      s9: 'Экспорт',
      s10: 'Аккаунт',
      s11: 'Клавиши',
    },
  },
};

export const DICTS: Record<Lang, Dict> = { et, en, ru };
