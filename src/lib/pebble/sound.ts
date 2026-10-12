let ctx: AudioContext | null = null;

export function unlockAudio(): void {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume();
}

export function resumeAudio(): void {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

export function playTone(kind: "ok" | "no" | "star", enabled: boolean): void {
  if (!enabled || !ctx || ctx.state !== "running") return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  const start = kind === "ok" ? 523 : kind === "star" ? 659 : 196;
  osc.frequency.setValueAtTime(start, now);
  if (kind === "ok") osc.frequency.linearRampToValueAtTime(784, now + 0.12);
  if (kind === "star") osc.frequency.linearRampToValueAtTime(880, now + 0.16);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "no" ? 0.2 : 0.28));
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.32);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
