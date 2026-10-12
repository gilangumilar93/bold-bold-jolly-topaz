import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Star } from "lucide-react";
import { makeRound, starsFor, type GameId, type Lane, type Problem } from "@/lib/pebble/engine";
import { copy, goodName, phrase, type Lang } from "@/lib/pebble/i18n";
import { playTone, unlockAudio } from "@/lib/pebble/sound";

const press =
  "transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100";

type Phase = "loading" | "play" | "done" | "leave";

export function PlayRound({
  game,
  lane,
  lang,
  problems: initialProblems,
  sound,
  onBindExit,
  onExit,
  onComplete,
}: {
  game: GameId;
  lane: Lane;
  lang: Lang;
  problems: Problem[];
  sound: boolean;
  onBindExit: (leave: () => void) => void;
  onExit: () => void;
  onComplete: (correct: number, streak: number) => void;
}) {
  const [problems, setProblems] = useState(initialProblems);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [marks, setMarks] = useState<(boolean | null)[]>(() => Array(8).fill(null));
  const [phase, setPhase] = useState<Phase>("play");
  const best = useRef(0);
  const finished = useRef(false);
  const timer = useRef<number | null>(null);
  const awarded = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const text = copy(lang);
  const problem = problems[index];

  function finish(correctNow: number) {
    if (finished.current) return;
    finished.current = true;
    setPhase("done");
    if (!awarded.current) {
      awarded.current = true;
      completeRef.current(correctNow, best.current);
      if (starsFor(correctNow) > 0) {
        window.setTimeout(() => playTone("star", sound), 180);
      }
    }
  }

  function leaveRound() {
    if (phase === "done" || (phase === "play" && index === 0 && picked === null)) {
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

  function advance(from: number, correctNow: number) {
    if (from + 1 >= 8) finish(correctNow);
    else {
      setIndex(from + 1);
      setPicked(null);
    }
  }

  function choose(value: number) {
    if (!problem || picked !== null || phase !== "play") return;
    unlockAudio();
    const ok = value === problem.answer;
    const nextCorrect = correct + (ok ? 1 : 0);
    const nextStreak = ok ? streak + 1 : 0;
    if (nextStreak > best.current) best.current = nextStreak;
    setPicked(value);
    setCorrect(nextCorrect);
    setStreak(nextStreak);
    setMarks((prev) => prev.map((mark, i) => (i === index ? ok : mark)));
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

  if (!problem) {
    return (
      <main className="mx-auto mt-16 max-w-md text-center">
        <p className="font-display text-2xl font-semibold">{text.preparing}</p>
      </main>
    );
  }

  if (phase === "done") {
    const stars = starsFor(correct);
    return (
      <main className="mx-auto mt-10 w-full max-w-md">
        <p className="text-sm font-bold text-moss">{text.roundComplete}</p>
        <h2 className="mt-2 font-display text-4xl leading-tight font-semibold">{text.roundLine(correct, stars)}</h2>
        <div className="mt-5 flex gap-2" aria-label={text.starsAria(stars)}>
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={`size-8 ${i < stars ? "fill-apricot text-apricot" : "text-line"}`}
              strokeWidth={1.75}
            />
          ))}
        </div>
        {best.current > 1 ? (
          <p className="mt-4 text-muted">{text.bestStreakRound(best.current)}</p>
        ) : (
          <p className="mt-4 text-muted">{text.laneStill}</p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            data-again
            onClick={again}
            className={`h-14 rounded-2xl bg-ink text-lg font-extrabold text-paper ${press}`}
          >
            {text.playAgain}
          </button>
          <button
            type="button"
            onClick={onExit}
            className={`h-12 rounded-2xl text-base font-bold text-muted ${press}`}
          >
            {text.backLane}
          </button>
        </div>
      </main>
    );
  }

  if (phase === "leave") {
    return (
      <main className="mx-auto mt-12 w-full max-w-md">
        <h2 className="font-display text-3xl font-semibold">{text.leaveTitle}</h2>
        <p className="mt-3 text-muted">{text.leaveBody}</p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setPhase("play")}
            className={`h-14 rounded-2xl bg-ink text-lg font-extrabold text-paper ${press}`}
          >
            {text.keepGoing}
          </button>
          <button type="button" onClick={onExit} className={`h-12 rounded-2xl font-bold text-muted ${press}`}>
            {text.leave}
          </button>
        </div>
      </main>
    );
  }

  const locked = picked !== null;
  const right = picked === problem.answer;

  return (
    <main className="mx-auto mt-6 w-full max-w-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-muted tabular-nums">
          {text.progress(index + 1)}
          {streak > 1 ? text.streak(streak) : ""}
        </p>
        <button
          type="button"
          onClick={() => {
            if (index === 0 && picked === null) onExit();
            else {
              if (timer.current) window.clearTimeout(timer.current);
              setPhase("leave");
            }
          }}
          className="text-sm font-bold text-muted"
        >
          {text.leave}
        </button>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {marks.map((mark, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i === index && mark === null ? "bg-apricot" : mark === true ? "bg-moss" : mark === false ? "bg-wrong" : "bg-line"
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-sm font-bold text-moss">{phrase(lang, problem.label)}</p>
      <Question problem={problem} lang={lang} />
      <p className="mt-4 text-lg">{phrase(lang, problem.prompt, problem)}</p>
      <p className="mt-3 min-h-7 text-base font-bold" aria-live="polite">
        {picked === null ? "" : right ? text.correct : text.wrong(problem.answer)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {problem.choices.map((choice) => {
          const isPick = picked === choice;
          const reveal = locked && choice === problem.answer;
          const tone = !locked
            ? "border-line bg-card text-ink"
            : reveal
              ? "border-moss bg-moss text-paper"
              : isPick
                ? "border-wrong bg-card text-wrong"
                : "border-line bg-card text-muted";
          return (
            <button
              key={choice}
              type="button"
              data-choice={choice}
              aria-disabled={locked}
              onClick={() => choose(choice)}
              className={`min-h-20 rounded-2xl border-2 font-display text-4xl font-semibold tabular-nums ${tone} ${
                locked ? "" : press
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {locked && !right ? (
        <button
          type="button"
          data-next
          onClick={() => advance(index, correct)}
          className={`mt-4 h-14 w-full rounded-2xl bg-ink text-lg font-extrabold text-paper ${press}`}
        >
          {text.next}
        </button>
      ) : null}
    </main>
  );
}

function Question({ problem, lang }: { problem: Problem; lang: Lang }) {
  const text = copy(lang);
  if (problem.game === "market" && problem.items) {
    return (
      <ul className="mt-4 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        {problem.items.map((item) => (
          <li
            key={`${item.good}-${item.count}`}
            className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
          >
            <span className="font-bold">{goodName(lang, item.good, item.count)}</span>
            <span className="font-display text-2xl font-semibold tabular-nums">{item.price}</span>
          </li>
        ))}
        {problem.pay ? (
          <li className="flex items-center justify-between gap-3 bg-blush px-4 py-3">
            <span className="font-bold">{text.youPay}</span>
            <span className="font-display text-2xl font-semibold tabular-nums">{problem.pay}</span>
          </li>
        ) : null}
      </ul>
    );
  }

  if (problem.game === "orchard" && problem.rows && problem.cols) {
    const dots = Array.from({ length: problem.rows * problem.cols }, (_, i) => i);
    return (
      <div
        className="orchard-grid mt-5 rounded-2xl border border-line bg-card p-4 shadow-card"
        style={{ "--cols": String(problem.cols) } as CSSProperties}
        role="img"
        aria-label={text.orchardAria(problem.rows, problem.cols)}
      >
        {dots.map((dot) => {
          const row = Math.floor(dot / problem.cols!);
          return (
            <span
              key={dot}
              className={`aspect-square w-full rounded-full ${row % 2 === 0 ? "bg-moss" : "bg-apricot"}`}
            />
          );
        })}
      </div>
    );
  }

  if (problem.game === "missing" && problem.pieces) {
    return (
      <div className="mt-5 flex flex-wrap items-center justify-start gap-x-3 gap-y-3">
        {problem.pieces.map((piece, i) =>
          piece.kind === "blank" ? (
            <span
              key={i}
              className="grid h-16 min-w-16 place-items-center rounded-2xl border-2 border-dashed border-apricot bg-blush font-display text-3xl font-semibold text-apricot"
            >
              ?
            </span>
          ) : (
            <span key={i} className="font-display text-5xl font-semibold tabular-nums sm:text-6xl">
              {piece.text}
            </span>
          ),
        )}
      </div>
    );
  }

  return (
    <p className="mt-3 font-display text-6xl leading-none font-semibold tracking-tight tabular-nums sm:text-7xl">
      {problem.equation}
    </p>
  );
}
