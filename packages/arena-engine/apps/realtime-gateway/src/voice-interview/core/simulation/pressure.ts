/**
 * core/simulation/pressure.ts — Stress dynamique temps réel (P3.8). PURE, déterministe.
 *
 * Simule un recruteur qui module pression cognitive et rythme selon les réponses.
 */

export type PressureRhythm = "calm" | "normal" | "fast" | "interrupted";

export interface PressureState {
  level: number; // 0–100
  rhythm: PressureRhythm;
  aggressiveness: number; // 0–1
  responseLatencyBias: number; // ms ajoutés artificiellement
}

export interface PressureSignal {
  weakAnswer?: boolean;
  strongAnswer?: boolean;
  contradiction?: boolean;
  bluff?: boolean;
}

export function createPressureState(): PressureState {
  return { level: 20, rhythm: "calm", aggressiveness: 0.2, responseLatencyBias: 0 };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function rhythmFor(level: number): PressureRhythm {
  if (level < 30) return "calm";
  if (level < 60) return "normal";
  if (level <= 80) return "fast";
  return "interrupted";
}

export function updatePressure(
  state: PressureState,
  signal: PressureSignal,
): PressureState {
  let level = state.level;
  if (signal.weakAnswer) level += 15;
  if (signal.strongAnswer) level -= 10;
  if (signal.contradiction) level += 25;
  if (signal.bluff) level += 30;
  level = clamp(level, 0, 100);

  const rhythm = rhythmFor(level);
  const aggressiveness = clamp(level / 100, 0, 1);
  // Plus la pression monte, plus le recruteur "presse" (latence réduite).
  const responseLatencyBias =
    rhythm === "interrupted" ? -200 : rhythm === "fast" ? -100 : rhythm === "calm" ? 200 : 0;

  return { level, rhythm, aggressiveness, responseLatencyBias };
}

/** Indique si, à ce niveau de pression, le recruteur peut interrompre. */
export function mayInterrupt(state: PressureState): boolean {
  return state.rhythm === "interrupted";
}
