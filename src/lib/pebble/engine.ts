import type { GoodId, LabelKey, PromptKey } from "@/lib/pebble/i18n";

export type Lane = "pebbles" | "stones" | "boulders";
export type GameId = "flash" | "market" | "orchard" | "missing";

export type MarketLine = { good: GoodId; count: number; price: number };
export type Piece = { kind: "text"; text: string } | { kind: "blank" };

export type Problem = {
  key: string;
  game: GameId;
  label: LabelKey;
  prompt: PromptKey;
  answer: number;
  choices: number[];
  equation?: string;
  items?: MarketLine[];
  pay?: number | null;
  rows?: number;
  cols?: number;
  pieces?: Piece[];
};

const ROUND_SIZE = 8;

const GOODS: GoodId[] = ["apple", "bun", "pencil", "sticker", "cracker", "cookie", "muffin", "marker", "notebook"];

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = next[i]!;
    next[i] = next[j]!;
    next[j] = swap;
  }
  return next;
}

function choicesAround(answer: number): number[] {
  const pool = new Set<number>([answer]);
  const deltas = shuffle([1, -1, 2, -2, 3, -3, 4, -4, 5, 10, -10, 6, 8, -8]);
  for (const delta of deltas) {
    const value = answer + delta;
    if (value >= 0 && value !== answer) pool.add(value);
    if (pool.size === 4) break;
  }
  let extra = 1;
  while (pool.size < 4 && extra < 40) {
    const value = answer + extra;
    if (value >= 0) pool.add(value);
    extra += 1;
  }
  return shuffle([...pool]).slice(0, 4);
}

function text(value: string | number): Piece {
  return { kind: "text", text: String(value) };
}

function blank(): Piece {
  return { kind: "blank" };
}

export function starsFor(correct: number, total = ROUND_SIZE): 0 | 1 | 2 | 3 {
  if (correct >= total) return 3;
  if (correct >= total - 2) return 2;
  if (correct >= total / 2) return 1;
  return 0;
}

export function makeProblem(game: GameId, lane: Lane): Problem {
  if (game === "flash") return makeFlash(lane);
  if (game === "market") return makeMarket(lane);
  if (game === "orchard") return makeOrchard(lane);
  return makeMissing(lane);
}

export function makeRound(game: GameId, lane: Lane, count = ROUND_SIZE): Problem[] {
  const round: Problem[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (round.length < count && guard < count * 12) {
    guard += 1;
    const problem = makeProblem(game, lane);
    if (seen.has(problem.key)) continue;
    seen.add(problem.key);
    round.push(problem);
  }
  while (round.length < count) round.push(makeProblem(game, lane));
  return round;
}

function makeFlash(lane: Lane): Problem {
  if (lane === "pebbles") {
    if (Math.random() < 0.62) {
      const a = randInt(0, 9);
      const b = randInt(0, 10 - a);
      return equation("flash", "sum", `${a} + ${b}`, a + b, "addUp");
    }
    const a = randInt(1, 10);
    const b = randInt(0, a);
    return equation("flash", "left", `${a} − ${b}`, a - b, "takeAway");
  }

  const roll = Math.random();
  if (lane === "stones" && roll < 0.34) {
    const factor = pick([2, 3, 4, 5, 10]);
    const other = randInt(1, 10);
    return equation("flash", "product", `${factor} × ${other}`, factor * other, "altogether");
  }
  if (lane === "boulders" && roll < 0.4) {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    return equation("flash", "product", `${a} × ${b}`, a * b, "altogether");
  }
  if (lane === "boulders" && roll < 0.7) {
    const factor = randInt(2, 12);
    const quotient = randInt(2, 12);
    return equation("flash", "shares", `${factor * quotient} ÷ ${factor}`, quotient, "eachGroup");
  }
  if (roll < 0.72) {
    const a = randInt(lane === "stones" ? 8 : 14, lane === "stones" ? 40 : 80);
    const b = randInt(3, lane === "stones" ? 30 : 60);
    return equation("flash", "sum", `${a} + ${b}`, a + b, "addUp");
  }
  const a = randInt(12, lane === "stones" ? 50 : 90);
  const b = randInt(1, a);
  return equation("flash", "left", `${a} − ${b}`, a - b, "takeAway");
}

function equation(
  game: GameId,
  label: LabelKey,
  expression: string,
  answer: number,
  prompt: PromptKey,
): Problem {
  return {
    key: `${game}|${expression}`,
    game,
    label,
    prompt,
    equation: expression,
    answer,
    choices: choicesAround(answer),
  };
}

function makeMarket(lane: Lane): Problem {
  const count = lane === "boulders" ? 3 : 2;
  const names = shuffle(GOODS).slice(0, count);
  const priceCap = lane === "pebbles" ? 5 : lane === "stones" ? 9 : 12;
  const priceFloor = lane === "pebbles" ? 1 : 2;
  let items: MarketLine[] = names.map((good) => ({
    good,
    count: 1,
    price: randInt(priceFloor, priceCap),
  }));

  if (lane === "boulders" && Math.random() < 0.45) {
    const first = items[0]!;
    items = [{ ...first, count: 2, price: first.price * 2 }, ...items.slice(1)];
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const purse = lane === "boulders" ? (Math.random() < 0.5 ? 20 : 50) : 20;
  const askChange = lane !== "pebbles" && total < purse && total > 0 && Math.random() < 0.6;
  const answer = askChange ? purse - total : total;
  const key = `${items.map((item) => `${item.good}x${item.count}:${item.price}`).join(",")}|${askChange ? purse : "total"}`;

  return {
    key: `market|${key}`,
    game: "market",
    label: askChange ? "change" : "total",
    prompt: askChange ? "payChange" : "pricesAdd",
    items,
    pay: askChange ? purse : null,
    answer,
    choices: choicesAround(answer),
  };
}

function makeOrchard(lane: Lane): Problem {
  let rows = 1;
  let cols = randInt(2, 8);
  if (lane === "pebbles") {
    if (Math.random() < 0.45) {
      rows = 1;
      cols = randInt(2, 8);
    } else {
      rows = randInt(2, 3);
      cols = randInt(2, 4);
    }
  } else if (lane === "stones") {
    rows = randInt(2, 5);
    cols = randInt(2, 6);
  } else {
    rows = randInt(3, 8);
    cols = randInt(3, 6);
  }
  const answer = rows * cols;
  return {
    key: `orchard|${rows}x${cols}`,
    game: "orchard",
    label: rows === 1 ? "count" : "rows",
    prompt: rows === 1 ? "howMany" : "rowsOf",
    rows,
    cols,
    answer,
    choices: choicesAround(answer),
  };
}

function makeMissing(lane: Lane): Problem {
  const roll = Math.random();

  if (lane !== "pebbles" && roll < (lane === "boulders" ? 0.46 : 0.28)) {
    const a = randInt(2, lane === "boulders" ? 12 : 6);
    const b = randInt(2, lane === "boulders" ? 12 : 10);
    const product = a * b;
    if (Math.random() < 0.5) {
      return missingProblem(`×|${a}|${b}`, "product", [text(a), text("×"), blank(), text("="), text(product)], b);
    }
    return missingProblem(`×|b|${a}|${b}`, "product", [blank(), text("×"), text(b), text("="), text(product)], a);
  }

  if (lane === "boulders" && roll < 0.68) {
    const factor = randInt(2, 12);
    const quotient = randInt(2, 12);
    const product = factor * quotient;
    if (Math.random() < 0.5) {
      return missingProblem(
        `÷|${product}|${factor}`,
        "shares",
        [text(product), text("÷"), blank(), text("="), text(quotient)],
        factor,
      );
    }
    return missingProblem(
      `÷|q|${product}|${quotient}`,
      "shares",
      [text(product), text("÷"), text(factor), text("="), blank()],
      quotient,
    );
  }

  if (roll < 0.78) {
    const max = lane === "pebbles" ? 10 : lane === "stones" ? 30 : 60;
    const a = randInt(0, max);
    const b = randInt(0, lane === "pebbles" ? Math.max(0, 10 - a) : max);
    const sum = a + b;
    if (Math.random() < 0.5) {
      return missingProblem(`+|${a}|${b}`, "sum", [text(a), text("+"), blank(), text("="), text(sum)], b);
    }
    return missingProblem(`+|b|${a}|${b}`, "sum", [blank(), text("+"), text(b), text("="), text(sum)], a);
  }

  const max = lane === "pebbles" ? 10 : lane === "stones" ? 40 : 80;
  const a = randInt(2, max);
  const b = randInt(0, a);
  return missingProblem(`−|${a}|${b}`, "left", [text(a), text("−"), blank(), text("="), text(a - b)], b);
}

function missingProblem(key: string, label: LabelKey, pieces: Piece[], answer: number): Problem {
  return {
    key: `missing|${key}`,
    game: "missing",
    label,
    prompt: "which",
    pieces,
    answer,
    choices: choicesAround(answer),
  };
}
