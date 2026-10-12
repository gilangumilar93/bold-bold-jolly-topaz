import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Star, c as ChevronLeft, i as Store, l as Calculator, n as Volume2, o as Grid3x3, s as CircleDot, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Jcd2Yx73.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROUND_SIZE = 8;
var GOODS = [
	"apple",
	"bun",
	"pencil",
	"sticker",
	"cracker",
	"cookie",
	"muffin",
	"marker",
	"notebook"
];
function randInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}
function pick(items) {
	return items[Math.floor(Math.random() * items.length)];
}
function shuffle(items) {
	const next = [...items];
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const swap = next[i];
		next[i] = next[j];
		next[j] = swap;
	}
	return next;
}
function choicesAround(answer) {
	const pool = /* @__PURE__ */ new Set([answer]);
	const deltas = shuffle([
		1,
		-1,
		2,
		-2,
		3,
		-3,
		4,
		-4,
		5,
		10,
		-10,
		6,
		8,
		-8
	]);
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
function text(value) {
	return {
		kind: "text",
		text: String(value)
	};
}
function blank() {
	return { kind: "blank" };
}
function starsFor(correct, total = ROUND_SIZE) {
	if (correct >= total) return 3;
	if (correct >= total - 2) return 2;
	if (correct >= total / 2) return 1;
	return 0;
}
function makeProblem(game, lane) {
	if (game === "flash") return makeFlash(lane);
	if (game === "market") return makeMarket(lane);
	if (game === "orchard") return makeOrchard(lane);
	return makeMissing(lane);
}
function makeRound(game, lane, count = ROUND_SIZE) {
	const round = [];
	const seen = /* @__PURE__ */ new Set();
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
function makeFlash(lane) {
	if (lane === "pebbles") {
		if (Math.random() < .62) {
			const a = randInt(0, 9);
			const b = randInt(0, 10 - a);
			return equation("flash", "sum", `${a} + ${b}`, a + b, "addUp");
		}
		const a = randInt(1, 10);
		const b = randInt(0, a);
		return equation("flash", "left", `${a} − ${b}`, a - b, "takeAway");
	}
	const roll = Math.random();
	if (lane === "stones" && roll < .34) {
		const factor = pick([
			2,
			3,
			4,
			5,
			10
		]);
		const other = randInt(1, 10);
		return equation("flash", "product", `${factor} × ${other}`, factor * other, "altogether");
	}
	if (lane === "boulders" && roll < .4) {
		const a = randInt(2, 12);
		const b = randInt(2, 12);
		return equation("flash", "product", `${a} × ${b}`, a * b, "altogether");
	}
	if (lane === "boulders" && roll < .7) {
		const factor = randInt(2, 12);
		const quotient = randInt(2, 12);
		return equation("flash", "shares", `${factor * quotient} ÷ ${factor}`, quotient, "eachGroup");
	}
	if (roll < .72) {
		const a = randInt(lane === "stones" ? 8 : 14, lane === "stones" ? 40 : 80);
		const b = randInt(3, lane === "stones" ? 30 : 60);
		return equation("flash", "sum", `${a} + ${b}`, a + b, "addUp");
	}
	const a = randInt(12, lane === "stones" ? 50 : 90);
	const b = randInt(1, a);
	return equation("flash", "left", `${a} − ${b}`, a - b, "takeAway");
}
function equation(game, label, expression, answer, prompt) {
	return {
		key: `${game}|${expression}`,
		game,
		label,
		prompt,
		equation: expression,
		answer,
		choices: choicesAround(answer)
	};
}
function makeMarket(lane) {
	const count = lane === "boulders" ? 3 : 2;
	const names = shuffle(GOODS).slice(0, count);
	const priceCap = lane === "pebbles" ? 5 : lane === "stones" ? 9 : 12;
	const priceFloor = lane === "pebbles" ? 1 : 2;
	let items = names.map((good) => ({
		good,
		count: 1,
		price: randInt(priceFloor, priceCap)
	}));
	if (lane === "boulders" && Math.random() < .45) {
		const first = items[0];
		items = [{
			...first,
			count: 2,
			price: first.price * 2
		}, ...items.slice(1)];
	}
	const total = items.reduce((sum, item) => sum + item.price, 0);
	const purse = lane === "boulders" ? Math.random() < .5 ? 20 : 50 : 20;
	const askChange = lane !== "pebbles" && total < purse && total > 0 && Math.random() < .6;
	const answer = askChange ? purse - total : total;
	return {
		key: `market|${`${items.map((item) => `${item.good}x${item.count}:${item.price}`).join(",")}|${askChange ? purse : "total"}`}`,
		game: "market",
		label: askChange ? "change" : "total",
		prompt: askChange ? "payChange" : "pricesAdd",
		items,
		pay: askChange ? purse : null,
		answer,
		choices: choicesAround(answer)
	};
}
function makeOrchard(lane) {
	let rows = 1;
	let cols = randInt(2, 8);
	if (lane === "pebbles") {
		if (Math.random() < .45) {
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
		choices: choicesAround(answer)
	};
}
function makeMissing(lane) {
	const roll = Math.random();
	if (lane !== "pebbles" && roll < (lane === "boulders" ? .46 : .28)) {
		const a = randInt(2, lane === "boulders" ? 12 : 6);
		const b = randInt(2, lane === "boulders" ? 12 : 10);
		const product = a * b;
		if (Math.random() < .5) return missingProblem(`×|${a}|${b}`, "product", [
			text(a),
			text("×"),
			blank(),
			text("="),
			text(product)
		], b);
		return missingProblem(`×|b|${a}|${b}`, "product", [
			blank(),
			text("×"),
			text(b),
			text("="),
			text(product)
		], a);
	}
	if (lane === "boulders" && roll < .68) {
		const factor = randInt(2, 12);
		const quotient = randInt(2, 12);
		const product = factor * quotient;
		if (Math.random() < .5) return missingProblem(`÷|${product}|${factor}`, "shares", [
			text(product),
			text("÷"),
			blank(),
			text("="),
			text(quotient)
		], factor);
		return missingProblem(`÷|q|${product}|${quotient}`, "shares", [
			text(product),
			text("÷"),
			text(factor),
			text("="),
			blank()
		], quotient);
	}
	if (roll < .78) {
		const max = lane === "pebbles" ? 10 : lane === "stones" ? 30 : 60;
		const a = randInt(0, max);
		const b = randInt(0, lane === "pebbles" ? Math.max(0, 10 - a) : max);
		const sum = a + b;
		if (Math.random() < .5) return missingProblem(`+|${a}|${b}`, "sum", [
			text(a),
			text("+"),
			blank(),
			text("="),
			text(sum)
		], b);
		return missingProblem(`+|b|${a}|${b}`, "sum", [
			blank(),
			text("+"),
			text(b),
			text("="),
			text(sum)
		], a);
	}
	const a = randInt(2, lane === "pebbles" ? 10 : lane === "stones" ? 40 : 80);
	const b = randInt(0, a);
	return missingProblem(`−|${a}|${b}`, "left", [
		text(a),
		text("−"),
		blank(),
		text("="),
		text(a - b)
	], b);
}
function missingProblem(key, label, pieces, answer) {
	return {
		key: `missing|${key}`,
		game: "missing",
		label,
		prompt: "which",
		pieces,
		answer,
		choices: choicesAround(answer)
	};
}
var phrases = {
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
		which: "Angka berapa yang tepat?"
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
		which: "Which number completes it?"
	}
};
var goods = {
	id: {
		apple: "Apel",
		bun: "Roti",
		pencil: "Pensil",
		sticker: "Stiker",
		cracker: "Biskuit",
		cookie: "Kue",
		muffin: "Bolu",
		marker: "Spidol",
		notebook: "Buku"
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
		notebook: "Notebook"
	}
};
var goodsPlural = {
	apple: "Apples",
	bun: "Buns",
	pencil: "Pencils",
	sticker: "Stickers",
	cracker: "Crackers",
	cookie: "Cookies",
	muffin: "Muffins",
	marker: "Markers",
	notebook: "Notebooks"
};
var lanes = {
	id: {
		pebbles: {
			label: "Kerikil",
			blurb: "Berhitung, jumlah sampai 10, dan pengurangan mudah."
		},
		stones: {
			label: "Batu",
			blurb: "Jumlah lebih besar, kembalian dari 20, dan perkalian 2 sampai 5 dan 10."
		},
		boulders: {
			label: "Bongkah",
			blurb: "Perkalian sampai 12, pembagian rata, dan kembalian dari 50."
		}
	},
	en: {
		pebbles: {
			label: "Pebbles",
			blurb: "Counting, sums to 10, and easy take-away."
		},
		stones: {
			label: "Stones",
			blurb: "Bigger sums, change from 20, and tables 2 to 5 and 10."
		},
		boulders: {
			label: "Boulders",
			blurb: "Times to 12, equal shares, and change from 50."
		}
	}
};
var games = {
	id: {
		flash: {
			title: "Kartu hitung",
			detail: "Satu soal, empat pilihan."
		},
		market: {
			title: "Warung",
			detail: "Jumlahkan harga, atau cari kembalian."
		},
		orchard: {
			title: "Baris kebun",
			detail: "Hitung kelompok yang sama."
		},
		missing: {
			title: "Batu hilang",
			detail: "Isi yang kosong."
		}
	},
	en: {
		flash: {
			title: "Flash cards",
			detail: "A sum, then four answers."
		},
		market: {
			title: "Market stall",
			detail: "Add prices, or make change."
		},
		orchard: {
			title: "Orchard rows",
			detail: "Count equal groups."
		},
		missing: {
			title: "Missing stone",
			detail: "Fill the blank."
		}
	}
};
var ui = {
	id: {
		club: "Klub hitung",
		hello: (name) => `Halo, ${name}. Empat permainan singkat. Pilih jalur sesuai besar angkanya.`,
		headline: "Delapan soal, lalu sebuah bintang.",
		playerName: "Nama pemain",
		difficulty: "Tingkat kesulitan",
		language: "Bahasa",
		stars: "bintang",
		soundOn: "Suara nyala",
		soundOff: "Suara mati",
		backGames: "Kembali ke permainan",
		rightCount: (n) => `${n} benar`,
		footer: "Bintang masuk setelah delapan soal selesai. Kemajuan tersimpan di perangkat ini.",
		bestStreak: (n) => ` Rekor beruntun: ${n}.`,
		preparing: "Menyiapkan soal…",
		roundComplete: "Ronde selesai",
		roundLine: (correct, stars) => {
			if (stars === 3) return "Semua benar. Tiga bintang.";
			if (stars === 0) return `${correct} dari 8. Belum ada bintang.`;
			if (stars === 1) return `${correct} dari 8. Satu bintang.`;
			return `${correct} dari 8. Dua bintang.`;
		},
		starsAria: (n) => `${n} bintang`,
		bestStreakRound: (n) => `Rekor beruntun ronde ini: ${n}.`,
		laneStill: "Jalurnya masih ada kalau ingin delapan soal lagi.",
		playAgain: "Main lagi",
		backLane: "Kembali ke jalur",
		leaveTitle: "Tinggalkan ronde ini?",
		leaveBody: "Bintang hanya masuk kalau delapan soal selesai.",
		keepGoing: "Lanjut main",
		leave: "Keluar",
		progress: (n) => `${n} dari 8`,
		streak: (n) => ` · beruntun ${n}`,
		correct: "Benar.",
		wrong: (n) => `Belum tepat. Jawabannya ${n}.`,
		next: "Soal berikut",
		youPay: "Kamu bayar",
		payChange: (purse) => `Kamu bayar dengan ${purse}. Kembaliannya berapa?`,
		rowsOf: (rows, cols) => `${rows} baris, tiap baris ${cols}. Ada berapa kerikil?`,
		orchardAria: (rows, cols) => `${rows} baris, tiap baris ${cols}`
	},
	en: {
		club: "Math club",
		hello: (name) => `Hello, ${name}. Four short games. Pick the lane that fits the size of the numbers.`,
		headline: "Eight questions, then a star.",
		playerName: "Player name",
		difficulty: "Difficulty",
		language: "Language",
		stars: "stars",
		soundOn: "Sound on",
		soundOff: "Sound off",
		backGames: "Back to the games",
		rightCount: (n) => `${n} right`,
		footer: "Stars stick when a round of eight is finished. Progress stays on this device.",
		bestStreak: (n) => ` Best streak: ${n}.`,
		preparing: "Setting out the stones…",
		roundComplete: "Round complete",
		roundLine: (correct, stars) => {
			if (stars === 3) return "Every one. Three stars.";
			if (stars === 0) return `${correct} of 8. No star this time.`;
			if (stars === 1) return `${correct} of 8. One star.`;
			return `${correct} of 8. Two stars.`;
		},
		starsAria: (n) => `${n} stars`,
		bestStreakRound: (n) => `Best streak this round: ${n}.`,
		laneStill: "The lane is still here whenever you want another eight.",
		playAgain: "Play again",
		backLane: "Back to the lane",
		leaveTitle: "Leave this round?",
		leaveBody: "Stars only stick if you finish all eight.",
		keepGoing: "Keep going",
		leave: "Leave",
		progress: (n) => `${n} of 8`,
		streak: (n) => ` · streak ${n}`,
		correct: "That's right.",
		wrong: (n) => `Not this time. It is ${n}.`,
		next: "Next",
		youPay: "You pay",
		payChange: (purse) => `You pay with ${purse}. How much change?`,
		rowsOf: (rows, cols) => `${rows} rows of ${cols}. How many pebbles?`,
		orchardAria: (rows, cols) => `${rows} rows of ${cols}`
	}
};
function copy(lang) {
	return ui[lang];
}
function phrase(lang, key, extra) {
	if (key === "payChange") return ui[lang].payChange(extra?.pay ?? 0);
	if (key === "rowsOf") return ui[lang].rowsOf(extra?.rows ?? 0, extra?.cols ?? 0);
	return phrases[lang][key];
}
function goodName(lang, id, count) {
	if (count > 1 && lang === "en") return `${count} ${goodsPlural[id]}`;
	if (count > 1) return `${count} ${goods[lang][id]}`;
	return goods[lang][id];
}
function laneCopy(lang, lane) {
	return lanes[lang][lane];
}
function gameCopy(lang, game) {
	return games[lang][game];
}
function defaultPlayerName(lang) {
	return lang === "id" ? "Teman" : "Friend";
}
var LANE_ORDER = [
	"pebbles",
	"stones",
	"boulders"
];
var GAME_ORDER = [
	"flash",
	"market",
	"orchard",
	"missing"
];
var LANE_AGES = {
	pebbles: "5–6",
	stones: "7–8",
	boulders: "9–11"
};
var KEY = "pebble-lane-save-v1";
var GAME_IDS = [
	"flash",
	"market",
	"orchard",
	"missing"
];
function emptyStats() {
	return {
		correct: 0,
		attempts: 0,
		rounds: 0
	};
}
function defaultSave() {
	return {
		version: 2,
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
			missing: emptyStats()
		}
	};
}
function cleanName(raw, lang = "id") {
	const trimmed = raw.replace(/\s+/g, " ").trim().slice(0, 18);
	return trimmed.length > 0 ? trimmed : defaultPlayerName(lang);
}
function whole(value, fallback = 0) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}
function normalize(parsed) {
	const base = defaultSave();
	if (!parsed || typeof parsed !== "object") return base;
	const lane = parsed.lane === "stones" || parsed.lane === "boulders" || parsed.lane === "pebbles" ? parsed.lane : base.lane;
	const lang = parsed.lang === "en" || parsed.lang === "id" ? parsed.lang : "id";
	const games = { ...base.games };
	for (const id of GAME_IDS) {
		const stats = parsed.games?.[id];
		if (!stats) continue;
		games[id] = {
			correct: whole(stats.correct),
			attempts: whole(stats.attempts),
			rounds: whole(stats.rounds)
		};
	}
	return {
		version: 2,
		name: typeof parsed.name === "string" ? cleanName(parsed.name, lang) : defaultPlayerName(lang),
		lane,
		lang,
		stars: whole(parsed.stars),
		bestStreak: whole(parsed.bestStreak),
		sound: parsed.sound !== false,
		games
	};
}
function loadSave() {
	if (typeof window === "undefined") return defaultSave();
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return defaultSave();
		return normalize(JSON.parse(raw));
	} catch {
		return defaultSave();
	}
}
function writeSave(save) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY, JSON.stringify({
			...save,
			version: 2
		}));
	} catch {}
}
var ctx = null;
function unlockAudio() {
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return;
	if (!ctx) ctx = new AudioCtx();
	if (ctx.state === "suspended") ctx.resume();
}
function resumeAudio() {
	if (ctx && ctx.state === "suspended") ctx.resume();
}
function playTone(kind, enabled) {
	if (!enabled || !ctx || ctx.state !== "running") return;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	const start = kind === "ok" ? 523 : kind === "star" ? 659 : 196;
	osc.frequency.setValueAtTime(start, now);
	if (kind === "ok") osc.frequency.linearRampToValueAtTime(784, now + .12);
	if (kind === "star") osc.frequency.linearRampToValueAtTime(880, now + .16);
	gain.gain.setValueAtTime(1e-4, now);
	gain.gain.exponentialRampToValueAtTime(.07, now + .02);
	gain.gain.exponentialRampToValueAtTime(1e-4, now + (kind === "no" ? .2 : .28));
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(now);
	osc.stop(now + .32);
	osc.onended = () => {
		osc.disconnect();
		gain.disconnect();
	};
}
var press$1 = "transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100";
function PlayRound({ game, lane, lang, problems: initialProblems, sound, onBindExit, onExit, onComplete }) {
	const [problems, setProblems] = (0, import_react.useState)(initialProblems);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [marks, setMarks] = (0, import_react.useState)(() => Array(8).fill(null));
	const [phase, setPhase] = (0, import_react.useState)("play");
	const best = (0, import_react.useRef)(0);
	const finished = (0, import_react.useRef)(false);
	const timer = (0, import_react.useRef)(null);
	const awarded = (0, import_react.useRef)(false);
	const completeRef = (0, import_react.useRef)(onComplete);
	completeRef.current = onComplete;
	(0, import_react.useEffect)(() => {
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, []);
	const text = copy(lang);
	const problem = problems[index];
	function finish(correctNow) {
		if (finished.current) return;
		finished.current = true;
		setPhase("done");
		if (!awarded.current) {
			awarded.current = true;
			completeRef.current(correctNow, best.current);
			if (starsFor(correctNow) > 0) window.setTimeout(() => playTone("star", sound), 180);
		}
	}
	function leaveRound() {
		if (phase === "done" || phase === "play" && index === 0 && picked === null) {
			onExit();
			return;
		}
		if (phase === "leave") {
			onExit();
			return;
		}
		if (timer.current) window.clearTimeout(timer.current);
		if (index === 7 && picked !== null) {
			finish(correct);
			return;
		}
		setPhase("leave");
	}
	onBindExit(leaveRound);
	function advance(from, correctNow) {
		if (from + 1 >= 8) finish(correctNow);
		else {
			setIndex(from + 1);
			setPicked(null);
		}
	}
	function choose(value) {
		if (!problem || picked !== null || phase !== "play") return;
		unlockAudio();
		const ok = value === problem.answer;
		const nextCorrect = correct + (ok ? 1 : 0);
		const nextStreak = ok ? streak + 1 : 0;
		if (nextStreak > best.current) best.current = nextStreak;
		setPicked(value);
		setCorrect(nextCorrect);
		setStreak(nextStreak);
		setMarks((prev) => prev.map((mark, i) => i === index ? ok : mark));
		playTone(ok ? "ok" : "no", sound);
		if (ok) {
			const from = index;
			timer.current = window.setTimeout(() => advance(from, nextCorrect), 880);
		}
	}
	function again() {
		if (timer.current) window.clearTimeout(timer.current);
		finished.current = false;
		awarded.current = false;
		best.current = 0;
		setProblems(makeRound(game, lane));
		setIndex(0);
		setPicked(null);
		setCorrect(0);
		setStreak(0);
		setMarks(Array(8).fill(null));
		setPhase("play");
	}
	if (!problem) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto mt-16 max-w-md text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-semibold",
			children: text.preparing
		})
	});
	if (phase === "done") {
		const stars = starsFor(correct);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto mt-10 w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-moss",
					children: text.roundComplete
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl leading-tight font-semibold",
					children: text.roundLine(correct, stars)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex gap-2",
					"aria-label": text.starsAria(stars),
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						className: `size-8 ${i < stars ? "fill-apricot text-apricot" : "text-line"}`,
						strokeWidth: 1.75
					}, i))
				}),
				best.current > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted",
					children: text.bestStreakRound(best.current)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted",
					children: text.laneStill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-again": true,
						onClick: again,
						className: `h-14 rounded-2xl bg-ink text-lg font-extrabold text-paper ${press$1}`,
						children: text.playAgain
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onExit,
						className: `h-12 rounded-2xl text-base font-bold text-muted ${press$1}`,
						children: text.backLane
					})]
				})
			]
		});
	}
	if (phase === "leave") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto mt-12 w-full max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-semibold",
				children: text.leaveTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: text.leaveBody
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPhase("play"),
					className: `h-14 rounded-2xl bg-ink text-lg font-extrabold text-paper ${press$1}`,
					children: text.keepGoing
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onExit,
					className: `h-12 rounded-2xl font-bold text-muted ${press$1}`,
					children: text.leave
				})]
			})
		]
	});
	const locked = picked !== null;
	const right = picked === problem.answer;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto mt-6 w-full max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-bold text-muted tabular-nums",
					children: [text.progress(index + 1), streak > 1 ? text.streak(streak) : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (index === 0 && picked === null) onExit();
						else {
							if (timer.current) window.clearTimeout(timer.current);
							setPhase("leave");
						}
					},
					className: "text-sm font-bold text-muted",
					children: text.leave
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-1.5",
				"aria-hidden": true,
				children: marks.map((mark, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 flex-1 rounded-full ${i === index && mark === null ? "bg-apricot" : mark === true ? "bg-moss" : mark === false ? "bg-wrong" : "bg-line"}` }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm font-bold text-moss",
				children: phrase(lang, problem.label)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Question, {
				problem,
				lang
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg",
				children: phrase(lang, problem.prompt, problem)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 min-h-7 text-base font-bold",
				"aria-live": "polite",
				children: picked === null ? "" : right ? text.correct : text.wrong(problem.answer)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: problem.choices.map((choice) => {
					const isPick = picked === choice;
					const reveal = locked && choice === problem.answer;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-choice": choice,
						"aria-disabled": locked,
						onClick: () => choose(choice),
						className: `min-h-20 rounded-2xl border-2 font-display text-4xl font-semibold tabular-nums ${!locked ? "border-line bg-card text-ink" : reveal ? "border-moss bg-moss text-paper" : isPick ? "border-wrong bg-card text-wrong" : "border-line bg-card text-muted"} ${locked ? "" : press$1}`,
						children: choice
					}, choice);
				})
			}),
			locked && !right ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-next": true,
				onClick: () => advance(index, correct),
				className: `mt-4 h-14 w-full rounded-2xl bg-ink text-lg font-extrabold text-paper ${press$1}`,
				children: text.next
			}) : null
		]
	});
}
function Question({ problem, lang }) {
	const text = copy(lang);
	if (problem.game === "market" && problem.items) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-4 overflow-hidden rounded-2xl border border-line bg-card shadow-card",
		children: [problem.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold",
				children: goodName(lang, item.good, item.count)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl font-semibold tabular-nums",
				children: item.price
			})]
		}, `${item.good}-${item.count}`)), problem.pay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between gap-3 bg-blush px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold",
				children: text.youPay
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl font-semibold tabular-nums",
				children: problem.pay
			})]
		}) : null]
	});
	if (problem.game === "orchard" && problem.rows && problem.cols) {
		const dots = Array.from({ length: problem.rows * problem.cols }, (_, i) => i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "orchard-grid mt-5 rounded-2xl border border-line bg-card p-4 shadow-card",
			style: { "--cols": String(problem.cols) },
			role: "img",
			"aria-label": text.orchardAria(problem.rows, problem.cols),
			children: dots.map((dot) => {
				const row = Math.floor(dot / problem.cols);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `aspect-square w-full rounded-full ${row % 2 === 0 ? "bg-moss" : "bg-apricot"}` }, dot);
			})
		});
	}
	if (problem.game === "missing" && problem.pieces) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 flex flex-wrap items-center justify-start gap-x-3 gap-y-3",
		children: problem.pieces.map((piece, i) => piece.kind === "blank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-16 min-w-16 place-items-center rounded-2xl border-2 border-dashed border-apricot bg-blush font-display text-3xl font-semibold text-apricot",
			children: "?"
		}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-5xl font-semibold tabular-nums sm:text-6xl",
			children: piece.text
		}, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 font-display text-6xl leading-none font-semibold tracking-tight tabular-nums sm:text-7xl",
		children: problem.equation
	});
}
var ICONS = {
	flash: Calculator,
	market: Store,
	orchard: Grid3x3,
	missing: CircleDot
};
var press = "transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100";
function PebbleApp() {
	const [save, setSave] = (0, import_react.useState)(defaultSave);
	const [draftName, setDraftName] = (0, import_react.useState)(defaultPlayerName("id"));
	const [session, setSession] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const saveRef = (0, import_react.useRef)(save);
	const requestExit = (0, import_react.useRef)(() => void 0);
	saveRef.current = save;
	const text = copy(save.lang);
	(0, import_react.useEffect)(() => {
		const loaded = loadSave();
		setSave(loaded);
		setDraftName(loaded.name);
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = save.lang;
	}, [save.lang]);
	(0, import_react.useEffect)(() => {
		function onVisible() {
			if (document.visibilityState === "visible") resumeAudio();
		}
		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	}, []);
	function commit(next) {
		setSave(next);
		writeSave(next);
	}
	function setLang(lang) {
		const current = saveRef.current;
		const name = current.name === defaultPlayerName(current.lang) ? defaultPlayerName(lang) : current.name;
		setDraftName(name);
		commit({
			...current,
			lang,
			name
		});
	}
	function openGame(id) {
		unlockAudio();
		setSession({
			game: id,
			problems: makeRound(id, saveRef.current.lane)
		});
	}
	const activeGame = session?.game ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 bg-apricot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col px-5 py-5 sm:px-8 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [activeGame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => requestExit.current(),
							className: `grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-ink shadow-card ${press}`,
							"aria-label": text.backGames,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-5",
								strokeWidth: 2.25
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PebbleMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs font-extrabold tracking-wide text-apricot",
								children: "Arsyila’s"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-display text-lg leading-tight font-semibold",
								children: activeGame ? gameCopy(save.lang, activeGame).title : "Pebble Lane"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-sm font-bold shadow-card tabular-nums",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4 fill-apricot text-apricot",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ready ? save.stars : 0 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: text.stars
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": save.sound ? text.soundOn : text.soundOff,
							"aria-pressed": save.sound,
							onClick: () => {
								unlockAudio();
								const current = saveRef.current;
								commit({
									...current,
									sound: !current.sound
								});
							},
							className: `grid size-11 place-items-center rounded-full bg-card text-ink shadow-card ${press}`,
							children: save.sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-5",
								strokeWidth: 2.25
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
								className: "size-5",
								strokeWidth: 2.25
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, {
					lang: save.lang,
					onChange: setLang
				}),
				session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayRound, {
					game: session.game,
					lane: save.lane,
					lang: save.lang,
					problems: session.problems,
					sound: save.sound,
					onBindExit: (leave) => {
						requestExit.current = leave;
					},
					onExit: () => setSession(null),
					onComplete: (correct, streak) => {
						const current = saveRef.current;
						const stats = current.games[session.game];
						commit({
							...current,
							stars: current.stars + starsFor(correct),
							bestStreak: Math.max(current.bestStreak, streak),
							games: {
								...current.games,
								[session.game]: {
									correct: stats.correct + correct,
									attempts: stats.attempts + 8,
									rounds: stats.rounds + 1
								}
							}
						});
					}
				}, `${session.game}-${save.lane}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home$1, {
					save,
					draftName,
					onDraft: setDraftName,
					onName: (name) => commit({
						...saveRef.current,
						name: cleanName(name, saveRef.current.lang)
					}),
					onLane: (next) => commit({
						...saveRef.current,
						lane: next
					}),
					onPlay: openGame
				})
			]
		})]
	});
}
function LangSwitch({ lang, onChange }) {
	const text = copy(lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-wash p-1",
		role: "group",
		"aria-label": text.language,
		children: [{
			id: "id",
			label: "Bahasa Indonesia"
		}, {
			id: "en",
			label: "English"
		}].map((option) => {
			const selected = lang === option.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": selected,
				onClick: () => onChange(option.id),
				className: `min-h-11 rounded-xl px-2 text-sm font-extrabold ${press} ${selected ? "bg-ink text-paper shadow-card" : "text-muted"}`,
				children: option.label
			}, option.id);
		})
	});
}
function PebbleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative block size-11 shrink-0",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 left-0 size-5 rounded-full bg-moss" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 left-4 size-6 rounded-full bg-apricot" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-2 size-5 rounded-full bg-ink" })
		]
	});
}
function Home$1({ save, draftName, onDraft, onName, onLane, onPlay }) {
	const text = copy(save.lang);
	const lane = laneCopy(save.lang, save.lane);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl",
				children: text.headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-lg text-muted",
				children: text.hello(save.name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-6 block max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-bold text-muted",
					children: text.playerName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draftName,
					maxLength: 18,
					autoComplete: "nickname",
					onChange: (event) => onDraft(event.target.value),
					onBlur: () => {
						const next = cleanName(draftName, save.lang);
						onDraft(next);
						onName(next);
					},
					className: "mt-2 h-12 w-full rounded-2xl border border-line bg-card px-4 text-lg font-bold text-ink shadow-card outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				role: "group",
				"aria-label": text.difficulty,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1 rounded-2xl bg-wash p-1",
					children: LANE_ORDER.map((id) => {
						const item = laneCopy(save.lang, id);
						const selected = save.lane === id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": selected,
							onClick: () => onLane(id),
							className: `min-h-14 rounded-xl px-2 py-2 ${press} ${selected ? "bg-ink text-paper shadow-card" : "text-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-extrabold",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block text-xs ${selected ? "text-paper" : "text-muted"}`,
								children: LANE_AGES[id]
							})]
						}, id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: lane.blurb
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 hidden items-end gap-3 sm:flex",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-14 rounded-full bg-moss" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-20 rounded-full bg-apricot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-10 rounded-full bg-ink" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mb-1 size-7 rounded-full bg-wash" })
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-1",
			children: [GAME_ORDER.map((id) => {
				const item = gameCopy(save.lang, id);
				const Icon = ICONS[id];
				const stats = save.games[id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-game": id,
					onClick: () => onPlay(id),
					className: `flex min-h-20 items-center gap-4 rounded-2xl border border-line bg-card px-4 py-4 text-left shadow-card ${press}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid size-12 shrink-0 place-items-center rounded-xl ${id === "orchard" ? "bg-moss-soft text-moss" : "bg-blush text-apricot"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-6",
							strokeWidth: 2.1
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xl leading-tight font-semibold",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block text-sm text-muted",
							children: [item.detail, stats.rounds > 0 ? ` · ${text.rightCount(stats.correct)}` : ""]
						})]
					})]
				}, id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-1 text-sm text-muted sm:col-span-2 lg:col-span-1",
				children: [text.footer, save.bestStreak > 1 ? text.bestStreak(save.bestStreak) : ""]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PebbleApp, {});
}
//#endregion
export { Home as component };
