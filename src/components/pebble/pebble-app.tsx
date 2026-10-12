import { useEffect, useRef, useState } from "react";
import { Calculator, ChevronLeft, CircleDot, Grid3x3, Star, Store, Volume2, VolumeX } from "lucide-react";
import { makeRound, starsFor, type GameId, type Lane, type Problem } from "@/lib/pebble/engine";
import {
  copy,
  defaultPlayerName,
  gameCopy,
  GAME_ORDER,
  LANE_AGES,
  LANE_ORDER,
  laneCopy,
  type Lang,
} from "@/lib/pebble/i18n";
import { cleanName, defaultSave, loadSave, writeSave, type Save } from "@/lib/pebble/save";
import { resumeAudio, unlockAudio } from "@/lib/pebble/sound";
import { PlayRound } from "@/components/pebble/play-round";

const ICONS = {
  flash: Calculator,
  market: Store,
  orchard: Grid3x3,
  missing: CircleDot,
} as const;

const press =
  "transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100";

export function PebbleApp() {
  const [save, setSave] = useState<Save>(defaultSave);
  const [draftName, setDraftName] = useState(defaultPlayerName("id"));
  const [session, setSession] = useState<{ game: GameId; problems: Problem[] } | null>(null);
  const [ready, setReady] = useState(false);
  const saveRef = useRef(save);
  const requestExit = useRef<() => void>(() => undefined);
  saveRef.current = save;
  const text = copy(save.lang);

  useEffect(() => {
    const loaded = loadSave();
    setSave(loaded);
    setDraftName(loaded.name);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = save.lang;
  }, [save.lang]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") resumeAudio();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  function commit(next: Save) {
    setSave(next);
    writeSave(next);
  }

  function setLang(lang: Lang) {
    const current = saveRef.current;
    const name =
      current.name === defaultPlayerName(current.lang) ? defaultPlayerName(lang) : current.name;
    setDraftName(name);
    commit({ ...current, lang, name });
  }

  function openGame(id: GameId) {
    unlockAudio();
    setSession({ game: id, problems: makeRound(id, saveRef.current.lane) });
  }

  const activeGame = session?.game ?? null;

  return (
    <div className="min-h-dvh">
      <div className="h-1.5 bg-apricot" />
      <div className="mx-auto flex w-full max-w-5xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {activeGame ? (
              <button
                type="button"
                onClick={() => requestExit.current()}
                className={`grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-ink shadow-card ${press}`}
                aria-label={text.backGames}
              >
                <ChevronLeft className="size-5" strokeWidth={2.25} />
              </button>
            ) : (
              <PebbleMark />
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold tracking-wide text-apricot">Arsyila’s</p>
              <p className="truncate font-display text-lg leading-tight font-semibold">
                {activeGame ? gameCopy(save.lang, activeGame).title : "Pebble Lane"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-sm font-bold shadow-card tabular-nums">
              <Star className="size-4 fill-apricot text-apricot" aria-hidden />
              <span>{ready ? save.stars : 0}</span>
              <span className="sr-only">{text.stars}</span>
            </p>
            <button
              type="button"
              aria-label={save.sound ? text.soundOn : text.soundOff}
              aria-pressed={save.sound}
              onClick={() => {
                unlockAudio();
                const current = saveRef.current;
                commit({ ...current, sound: !current.sound });
              }}
              className={`grid size-11 place-items-center rounded-full bg-card text-ink shadow-card ${press}`}
            >
              {save.sound ? (
                <Volume2 className="size-5" strokeWidth={2.25} />
              ) : (
                <VolumeX className="size-5" strokeWidth={2.25} />
              )}
            </button>
          </div>
        </header>

        <LangSwitch lang={save.lang} onChange={setLang} />

        {session ? (
          <PlayRound
            key={`${session.game}-${save.lane}`}
            game={session.game}
            lane={save.lane}
            lang={save.lang}
            problems={session.problems}
            sound={save.sound}
            onBindExit={(leave) => {
              requestExit.current = leave;
            }}
            onExit={() => setSession(null)}
            onComplete={(correct, streak) => {
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
                    rounds: stats.rounds + 1,
                  },
                },
              });
            }}
          />
        ) : (
          <Home
            save={save}
            draftName={draftName}
            onDraft={setDraftName}
            onName={(name) => commit({ ...saveRef.current, name: cleanName(name, saveRef.current.lang) })}
            onLane={(next) => commit({ ...saveRef.current, lane: next })}
            onPlay={openGame}
          />
        )}
      </div>
    </div>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  const text = copy(lang);
  const options: { id: Lang; label: string }[] = [
    { id: "id", label: "Bahasa Indonesia" },
    { id: "en", label: "English" },
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-wash p-1" role="group" aria-label={text.language}>
      {options.map((option) => {
        const selected = lang === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`min-h-11 rounded-xl px-2 text-sm font-extrabold ${press} ${
              selected ? "bg-ink text-paper shadow-card" : "text-muted"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function PebbleMark() {
  return (
    <span className="relative block size-11 shrink-0" aria-hidden>
      <span className="absolute top-1 left-0 size-5 rounded-full bg-moss" />
      <span className="absolute top-0 left-4 size-6 rounded-full bg-apricot" />
      <span className="absolute bottom-0 left-2 size-5 rounded-full bg-ink" />
    </span>
  );
}

function Home({
  save,
  draftName,
  onDraft,
  onName,
  onLane,
  onPlay,
}: {
  save: Save;
  draftName: string;
  onDraft: (value: string) => void;
  onName: (value: string) => void;
  onLane: (lane: Lane) => void;
  onPlay: (game: GameId) => void;
}) {
  const text = copy(save.lang);
  const lane = laneCopy(save.lang, save.lane);

  return (
    <main className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
      <section>
        <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{text.headline}</h1>
        <p className="mt-3 max-w-md text-lg text-muted">{text.hello(save.name)}</p>

        <label className="mt-6 block max-w-sm">
          <span className="text-sm font-bold text-muted">{text.playerName}</span>
          <input
            value={draftName}
            maxLength={18}
            autoComplete="nickname"
            onChange={(event) => onDraft(event.target.value)}
            onBlur={() => {
              const next = cleanName(draftName, save.lang);
              onDraft(next);
              onName(next);
            }}
            className="mt-2 h-12 w-full rounded-2xl border border-line bg-card px-4 text-lg font-bold text-ink shadow-card outline-none"
          />
        </label>

        <div className="mt-6" role="group" aria-label={text.difficulty}>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-wash p-1">
            {LANE_ORDER.map((id) => {
              const item = laneCopy(save.lang, id);
              const selected = save.lane === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onLane(id)}
                  className={`min-h-14 rounded-xl px-2 py-2 ${press} ${
                    selected ? "bg-ink text-paper shadow-card" : "text-muted"
                  }`}
                >
                  <span className="block text-sm font-extrabold">{item.label}</span>
                  <span className={`block text-xs ${selected ? "text-paper" : "text-muted"}`}>{LANE_AGES[id]}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted">{lane.blurb}</p>
        </div>

        <div className="mt-8 hidden items-end gap-3 sm:flex" aria-hidden>
          <span className="size-14 rounded-full bg-moss" />
          <span className="size-20 rounded-full bg-apricot" />
          <span className="size-10 rounded-full bg-ink" />
          <span className="mb-1 size-7 rounded-full bg-wash" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {GAME_ORDER.map((id) => {
          const item = gameCopy(save.lang, id);
          const Icon = ICONS[id];
          const stats = save.games[id];
          const orchard = id === "orchard";
          return (
            <button
              key={id}
              type="button"
              data-game={id}
              onClick={() => onPlay(id)}
              className={`flex min-h-20 items-center gap-4 rounded-2xl border border-line bg-card px-4 py-4 text-left shadow-card ${press}`}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                  orchard ? "bg-moss-soft text-moss" : "bg-blush text-apricot"
                }`}
              >
                <Icon className="size-6" strokeWidth={2.1} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl leading-tight font-semibold">{item.title}</span>
                <span className="mt-0.5 block text-sm text-muted">
                  {item.detail}
                  {stats.rounds > 0 ? ` · ${text.rightCount(stats.correct)}` : ""}
                </span>
              </span>
            </button>
          );
        })}
        <p className="px-1 text-sm text-muted sm:col-span-2 lg:col-span-1">
          {text.footer}
          {save.bestStreak > 1 ? text.bestStreak(save.bestStreak) : ""}
        </p>
      </section>
    </main>
  );
}
