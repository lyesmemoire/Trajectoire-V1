/**
 * core/simulation/integration.ts — Binding Simulation → V2 (P3.9). PURE.
 *
 * Principe de design (test de découplage) :
 *   « je supprime la simulation et V2 continue de fonctionner »
 *
 * Ce module NE décide PAS des questions (c'est le rôle de V2). Il :
 *  1. dérive un `SimulationSignal` depuis la perception/évaluation d'un tour,
 *  2. construit un `SimulationContext` (mood + contraintes) depuis le SimulationState,
 *  3. APPLIQUE ces contraintes au TEXTE de la prochaine question (ton, longueur,
 *     interruption, hook cross-session) — transformation de sortie, pas de décision.
 *
 * Aucune dépendance transport. Optionnel : si non utilisé, V2 est inchangé.
 */
// @ts-nocheck


import {
  type SimulationState,
  type SimulationSignal,
} from "./simulation-state.js";
import { mayInterrupt, type PressureState } from "./pressure.js";
import { buildMemoryHook } from "./cross-session.js";
import type { ReactivePersona } from "./persona-reactivity.js";

/** Contexte exploité pour façonner la prochaine sortie (pas la décision). */
export interface SimulationContext {
  recruiterMood: ReactivePersona["mode"];
  tone: "calm" | "normal" | "aggressive";
  /** Doit-on raccourcir la question ? (pression haute) */
  shorten: boolean;
  /** Le recruteur peut-il interrompre ? */
  canInterrupt: boolean;
  /** Latence simulée ajoutée (ms), pour le runtime. */
  responseLatencyBias: number;
  /** Accroche de continuité (ouverture seulement), si historique. */
  crossSessionHook: string | null;
}

/** Dérive le signal de simulation à partir des observations d'un tour. */
export interface TurnObservation {
  score: number;
  specificity: number;
  bluffProbability: number;
  hasContradiction: boolean;
  isTechnical: boolean;
  /** Score du tour précédent (progression). */
  previousScore?: number;
}

export function deriveSignal(obs: TurnObservation): SimulationSignal {
  const weakAnswer = obs.score < 55 || obs.specificity < 0.25;
  const strongAnswer = obs.score >= 75;
  const bluff = obs.bluffProbability >= 0.55;
  const signal: SimulationSignal = {
    weakAnswer,
    strongAnswer,
    contradiction: obs.hasContradiction,
    bluff,
    strongTechnical: strongAnswer && obs.isTechnical,
  };
  if (obs.previousScore !== undefined) {
    signal.progression = obs.score > obs.previousScore;
  }
  return signal;
}

function toneFromPressure(p: PressureState): SimulationContext["tone"] {
  if (p.rhythm === "interrupted") return "aggressive";
  if (p.rhythm === "fast") return "aggressive";
  if (p.rhythm === "calm") return "calm";
  return "normal";
}

/** Construit le contexte de simulation depuis l'état global. */
export function buildSimulationContext(
  state: SimulationState,
  opts: { opening?: boolean } = {},
): SimulationContext {
  return {
    recruiterMood: state.persona.mode,
    tone: toneFromPressure(state.pressure),
    shorten: state.pressure.level >= 60,
    canInterrupt: mayInterrupt(state.pressure),
    responseLatencyBias: state.pressure.responseLatencyBias,
    crossSessionHook: opts.opening ? buildMemoryHook(state.crossSession) : null,
  };
}

/**
 * Applique le contexte au TEXTE d'une question V2 (façonnage de sortie).
 * V2 a déjà choisi QUOI demander ; ici on ajuste COMMENT c'est formulé.
 */
export function applySimulationToQuestion(
  question: string,
  ctx: SimulationContext,
): string {
  if (!question) return question;
  let out = question;

  // Ton selon la pression (préfixe court, n'altère pas le sens).
  if (ctx.tone === "aggressive") out = `Soyons direct. ${out}`;
  else if (ctx.tone === "calm") out = `Prends ton temps. ${out}`;

  // Pression haute -> on signale qu'on attend une réponse concise.
  if (ctx.shorten) out = `${out} (Sois concis.)`;

  // Mode interrogatoire si recruteur agressif.
  if (ctx.recruiterMood === "AGGRESSIVE") out = `${out} Et sois précis.`;

  return out;
}

/**
 * Hook d'ouverture : préfixe la première question avec l'accroche cross-session.
 */
export function applyOpeningContext(
  question: string,
  ctx: SimulationContext,
): string {
  if (ctx.crossSessionHook) return `${ctx.crossSessionHook} ${question}`;
  return question;
}
