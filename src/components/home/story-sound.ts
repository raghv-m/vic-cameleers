"use client";

/**
 * Tiny synthesised sound effects for The Name section: no audio files, nothing recorded or
 * borrowed, just Web Audio oscillators. A soft two-tone bell for the 1860 caravan beats and a low
 * engine rumble for "Today". Only ever created after the visitor turns sound on (a click), so it
 * never autoplays.
 */

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

/** A caravan bell: two sine partials with a long, soft decay. */
export function playBell(): void {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const [freq, level] of [
    [660, 0.12],
    [990, 0.05],
  ] as const) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.7);
  }
}

/** A diesel idle: a low sawtooth, filtered, with a slow throb, fading in and out. */
export function playEngine(): void {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const throb = ctx.createOscillator();
  const throbDepth = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 48;
  filter.type = "lowpass";
  filter.frequency.value = 220;
  throb.frequency.value = 7;
  throbDepth.gain.value = 0.04;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  throb.connect(throbDepth).connect(gain.gain);
  osc.connect(filter).connect(gain).connect(ctx.destination);

  osc.start(now);
  throb.start(now);
  osc.stop(now + 1.9);
  throb.stop(now + 1.9);
}
