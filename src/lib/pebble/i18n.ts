import type { GameId, Lane } from "@/lib/pebble/engine";

export type Lang = "id" | "en";

export type LabelKey = "sum" | "left" | "product" | "shares" | "count" | "rows" | "change" | "total";

export type PromptKey =
  | "addUp"
  | "takeAway"
  | "altogether"
  | "eachGroup"
  | "payChange"
  | "pricesAdd"
  | "howMany"
  | "rowsOf"
  | "which";

export type GoodId =
  | "apple"
  | "bun"
  | "pencil"
  | "sticker"
  | "cracker"
  | "cookie"
  | "muffin"
  | "marker"
  | "notebook";

type PhraseKey = LabelKey | Exclude<PromptKey, "payChange" | "rowsOf">;

const phrases: Record<Lang, Record<PhraseKey, string>> = {
  id: {
    sum: "Jumlah",
    left: "Sisa",
    product: "Perkalian",
    shares: "Bagi rata",
    count: "Hitung",
    rows: "Baris",
    change: "Kembalian",
    total: "Total",
    addUp: "Berapa jumlahnya?",
    takeAway: "Dikurangi, sisanya berapa?",
    altogether: "Semuanya ada berapa?",
    eachGroup: "Setiap kelompok ada berapa?",
    pricesAdd: "Jumlah harganya berapa?",
    howMany: "Ada berapa kerikil?",
    which: "Angka berapa yang tepat?",
  },
  en: {
    sum: "Sum",
    left: "What's left",
    product: "Product",
    shares: "Equal shares",
    count: "Count",
    rows: "Rows",
    change: "Change",
    total: "Total",
    addUp: "What do they add up to?",
    takeAway: "Take away, then what's left?",
    altogether: "How many altogether?",
    eachGroup: "How many in each group?",
    pricesAdd: "What do the prices add up to?",
    howMany: "How many pebbles?",
    which: "Which number completes it?",
  },
};

const goods: Record<Lang, Record<GoodId, string>> = {
  id: {
    apple: "Apel",
    bun: "Roti",
    pencil: "Pensil",
    sticker: "Stiker",
    cracker: "Biskuit",
    cookie: "Kue",
    muffin: "Bolu",
    marker: "Spidol",
    notebook: "Buku",
  },
  en: {
    apple: "Apple",
    bun: "Bun",
    pencil: "Pencil",
    sticker: "Sticker",
    cracker: "Cracker",
    cookie: "Cookie",
    muffin: "Muffin",
    marker: "Marker",
    notebook: "Notebook",
  },
};

const goodsPlural: Record<GoodId, string> = {
  apple: "Apples",
  bun: "Buns",
  pencil: "Pencils",
  sticker: "Stickers",
  cracker: "Crackers",
  cookie: "Cookies",
  muffin: "Muffins",
  marker: "Markers",
  notebook: "Notebooks",
};

const lanes: Record<Lang, Record<Lane, { label: string; blurb: string }>> = {
  id: {
    pebbles: { label: "Kerikil", blurb: "Berhitung, jumlah sampai 10, dan pengurangan mudah." },
    stones: { label: "Batu", blurb: "Jumlah lebih besar, kembalian dari 20, dan perkalian 2 sampai 5 dan 10." },
    boulders: { label: "Bongkah", blurb: "Perkalian sampai 12, pembagian rata, dan kembalian dari 50." },
  },
  en: {
    pebbles: { label: "Pebbles", blurb: "Counting, sums to 10, and easy take-away." },
    stones: { label: "Stones", blurb: "Bigger sums, change from 20, and tables 2 to 5 and 10." },
    boulders: { label: "Boulders", blurb: "Times to 12, equal shares, and change from 50." },
  },
};

const games: Record<Lang, Record<GameId, { title: string; detail: string }>> = {
  id: {
    flash: { title: "Kartu hitung", detail: "Satu soal, empat pilihan." },
    market: { title: "Warung", detail: "Jumlahkan harga, atau cari kembalian." },
    orchard: { title: "Baris kebun", detail: "Hitung kelompok yang sama." },
    missing: { title: "Batu hilang", detail: "Isi yang kosong." },
  },
  en: {
    flash: { title: "Flash cards", detail: "A sum, then four answers." },
    market: { title: "Market stall", detail: "Add prices, or make change." },
    orchard: { title: "Orchard rows", detail: "Count equal groups." },
    missing: { title: "Missing stone", detail: "Fill the blank." },
  },
};

const ui = {
  id: {
    club: "Klub hitung",
    hello: (name: string) => `Halo, ${name}. Empat permainan singkat. Pilih jalur sesuai besar angkanya.`,
    headline: "Delapan soal, lalu sebuah bintang.",
    playerName: "Nama pemain",
    difficulty: "Tingkat kesulitan",
    language: "Bahasa",
    stars: "bintang",
    soundOn: "Suara nyala",
    soundOff: "Suara mati",
    backGames: "Kembali ke permainan",
    rightCount: (n: number) => `${n} benar`,
    footer: "Bintang masuk setelah delapan soal selesai. Kemajuan tersimpan di perangkat ini.",
    bestStreak: (n: number) => ` Rekor beruntun: ${n}.`,
    preparing: "Menyiapkan soal…",
    roundComplete: "Ronde selesai",
    roundLine: (correct: number, stars: number) => {
      if (stars === 3) return "Semua benar. Tiga bintang.";
      if (stars === 0) return `${correct} dari 8. Belum ada bintang.`;
      if (stars === 1) return `${correct} dari 8. Satu bintang.`;
      return `${correct} dari 8. Dua bintang.`;
    },
    starsAria: (n: number) => `${n} bintang`,
    bestStreakRound: (n: number) => `Rekor beruntun ronde ini: ${n}.`,
    laneStill: "Jalurnya masih ada kalau ingin delapan soal lagi.",
    playAgain: "Main lagi",
    backLane: "Kembali ke jalur",
    leaveTitle: "Tinggalkan ronde ini?",
    leaveBody: "Bintang hanya masuk kalau delapan soal selesai.",
    keepGoing: "Lanjut main",
    leave: "Keluar",
    progress: (n: number) => `${n} dari 8`,
    streak: (n: number) => ` · beruntun ${n}`,
    correct: "Benar.",
    wrong: (n: number) => `Belum tepat. Jawabannya ${n}.`,
    next: "Soal berikut",
    youPay: "Kamu bayar",
    payChange: (purse: number) => `Kamu bayar dengan ${purse}. Kembaliannya berapa?`,
    rowsOf: (rows: number, cols: number) => `${rows} baris, tiap baris ${cols}. Ada berapa kerikil?`,
    orchardAria: (rows: number, cols: number) => `${rows} baris, tiap baris ${cols}`,
  },
  en: {
    club: "Math club",
    hello: (name: string) =>
      `Hello, ${name}. Four short games. Pick the lane that fits the size of the numbers.`,
    headline: "Eight questions, then a star.",
    playerName: "Player name",
    difficulty: "Difficulty",
    language: "Language",
    stars: "stars",
    soundOn: "Sound on",
    soundOff: "Sound off",
    backGames: "Back to the games",
    rightCount: (n: number) => `${n} right`,
    footer: "Stars stick when a round of eight is finished. Progress stays on this device.",
    bestStreak: (n: number) => ` Best streak: ${n}.`,
    preparing: "Setting out the stones…",
    roundComplete: "Round complete",
    roundLine: (correct: number, stars: number) => {
      if (stars === 3) return "Every one. Three stars.";
      if (stars === 0) return `${correct} of 8. No star this time.`;
      if (stars === 1) return `${correct} of 8. One star.`;
      return `${correct} of 8. Two stars.`;
    },
    starsAria: (n: number) => `${n} stars`,
    bestStreakRound: (n: number) => `Best streak this round: ${n}.`,
    laneStill: "The lane is still here whenever you want another eight.",
    playAgain: "Play again",
    backLane: "Back to the lane",
    leaveTitle: "Leave this round?",
    leaveBody: "Stars only stick if you finish all eight.",
    keepGoing: "Keep going",
    leave: "Leave",
    progress: (n: number) => `${n} of 8`,
    streak: (n: number) => ` · streak ${n}`,
    correct: "That's right.",
    wrong: (n: number) => `Not this time. It is ${n}.`,
    next: "Next",
    youPay: "You pay",
    payChange: (purse: number) => `You pay with ${purse}. How much change?`,
    rowsOf: (rows: number, cols: number) => `${rows} rows of ${cols}. How many pebbles?`,
    orchardAria: (rows: number, cols: number) => `${rows} rows of ${cols}`,
  },
} as const;

export function copy(lang: Lang) {
  return ui[lang];
}

export function phrase(lang: Lang, key: LabelKey | PromptKey, extra?: { pay?: number | null; rows?: number; cols?: number }): string {
  if (key === "payChange") return ui[lang].payChange(extra?.pay ?? 0);
  if (key === "rowsOf") return ui[lang].rowsOf(extra?.rows ?? 0, extra?.cols ?? 0);
  return phrases[lang][key];
}

export function goodName(lang: Lang, id: GoodId, count: number): string {
  if (count > 1 && lang === "en") return `${count} ${goodsPlural[id]}`;
  if (count > 1) return `${count} ${goods[lang][id]}`;
  return goods[lang][id];
}

export function laneCopy(lang: Lang, lane: Lane) {
  return lanes[lang][lane];
}

export function gameCopy(lang: Lang, game: GameId) {
  return games[lang][game];
}

export function defaultPlayerName(lang: Lang): string {
  return lang === "id" ? "Teman" : "Friend";
}

export const LANE_ORDER: Lane[] = ["pebbles", "stones", "boulders"];
export const GAME_ORDER: GameId[] = ["flash", "market", "orchard", "missing"];
export const LANE_AGES: Record<Lane, string> = {
  pebbles: "5–6",
  stones: "7–8",
  boulders: "9–11",
};
