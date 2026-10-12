import type { GameId, Lane } from "@/lib/pebble/engine";
import { defaultPlayerName, type Lang } from "@/lib/pebble/i18n";

export const SAVE_VERSION = 2;
const KEY = "pebble-lane-save-v1";

export type GameStats = {
  correct: number;
  attempts: number;
  rounds: number;
};

export type Save = {
  version: number;
  name: string;
  lane: Lane;
  lang: Lang;
  stars: number;
  bestStreak: number;
  sound: boolean;
  games: Record<GameId, GameStats>;
};

const GAME_IDS: GameId[] = ["flash", "market", "orchard", "missing"];

function emptyStats(): GameStats {
  return { correct: 0, attempts: 0, rounds: 0 };
}

export function defaultSave(): Save {
  return {
    version: SAVE_VERSION,
    name: defaultPlayerName("id"),
    lane: "pebbles",
    lang: "id",
    stars: 0,
    bestStreak: 0,
    sound: true,
    games: {
      flash: emptyStats(),
      market: emptyStats(),
      orchard: emptyStats(),
      missing: emptyStats(),
    },
  };
}

export function cleanName(raw: string, lang: Lang = "id"): string {
  const trimmed = raw.replace(/\s+/g, " ").trim().slice(0, 18);
  return trimmed.length > 0 ? trimmed : defaultPlayerName(lang);
}

function whole(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

function normalize(parsed: Partial<Save> | null): Save {
  const base = defaultSave();
  if (!parsed || typeof parsed !== "object") return base;
  const lane: Lane =
    parsed.lane === "stones" || parsed.lane === "boulders" || parsed.lane === "pebbles"
      ? parsed.lane
      : base.lane;
  const lang: Lang = parsed.lang === "en" || parsed.lang === "id" ? parsed.lang : "id";
  const games = { ...base.games };
  for (const id of GAME_IDS) {
    const stats = parsed.games?.[id];
    if (!stats) continue;
    games[id] = {
      correct: whole(stats.correct),
      attempts: whole(stats.attempts),
      rounds: whole(stats.rounds),
    };
  }
  return {
    version: SAVE_VERSION,
    name: typeof parsed.name === "string" ? cleanName(parsed.name, lang) : defaultPlayerName(lang),
    lane,
    lang,
    stars: whole(parsed.stars),
    bestStreak: whole(parsed.bestStreak),
    sound: parsed.sound !== false,
    games,
  };
}

export function loadSave(): Save {
  const store = openStore();
  if (!store) return defaultSave();
  try {
    const raw = store.getItem(KEY);
    if (!raw) return defaultSave();
    return normalize(JSON.parse(raw) as Partial<Save>);
  } catch {
    return defaultSave();
  }
}

export function writeSave(save: Save): void {
  const store = openStore();
  if (!store) return;
  try {
    store.setItem(KEY, JSON.stringify({ ...save, version: SAVE_VERSION }));
  } catch {
    /* Private mode or a full disk — keep the in-memory round. */
  }
}

type Store = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const memory = new Map<string, string>();

const memoryStore: Store = {
  getItem(key) {
    return memory.has(key) ? memory.get(key)! : null;
  },
  setItem(key, value) {
    memory.set(key, value);
  },
};

function openStore(): Store | null {
  if (typeof window === "undefined") return null;
  // A sandboxed iframe without allow-same-origin has an opaque origin.
  // Reading window.localStorage there throws SecurityError, and that throw
  // is not always catchable, so do not touch the property at all.
  try {
    if (window.origin === "null") return memoryStore;
  } catch {
    return memoryStore;
  }
  try {
    return window.localStorage;
  } catch {
    return memoryStore;
  }
}
