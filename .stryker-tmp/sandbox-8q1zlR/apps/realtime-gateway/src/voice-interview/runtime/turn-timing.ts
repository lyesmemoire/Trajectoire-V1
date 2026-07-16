/**
 * runtime/turn-timing.ts — Réalisation des paramètres UX en plan d'exécution (P4.2). PURE.
 * PerceptionUX (déclaratif) -> TurnPlan (concret). Déterministe (Rng injecté).
 */
// @ts-nocheck

import type { PerceptionUX } from "../core/simulation/perception-ux.js";
import type { Rng } from "./rng.js";

export const TIMING = {
  msPerCharBase: 55,
  minSpeakMs: 400,
  emphaticSilenceMs: 700,
  interruptAtFraction: 0.6,
} as const;

export interface TurnPlan {
  delayBeforeReplyMs: number;
  emphaticSilence: boolean;
  totalLeadMs: number;
  recruiterInterrupts: boolean;
  speechRate: number;
  estimatedSpeakMs: number;
}

export function estimateSpeakMs(text: string, speechRate: number): number {
  const rate = speechRate > 0 ? speechRate : 1;
  const raw = Math.max(0, text.length) * TIMING.msPerCharBase;
  return Math.max(TIMING.minSpeakMs, Math.round(raw / rate));
}

export function buildTurnPlan(
  ux: PerceptionUX,
  replyText: string,
  rng: Rng,
): TurnPlan {
  const emphaticSilence = rng.chance(ux.silenceProbability);
  const recruiterInterrupts = rng.chance(ux.interruptionChance);
  const delayBeforeReplyMs = Math.max(0, Math.round(ux.delayBeforeReplyMs));
  const totalLeadMs =
    delayBeforeReplyMs + (emphaticSilence ? TIMING.emphaticSilenceMs : 0);
  return {
    delayBeforeReplyMs,
    emphaticSilence,
    totalLeadMs,
    recruiterInterrupts,
    speechRate: ux.speechRate,
    estimatedSpeakMs: estimateSpeakMs(replyText, ux.speechRate),
  };
}

export function interruptAtMs(
  plan: TurnPlan,
  candidateSpeechMs: number,
): number | null {
  if (!plan.recruiterInterrupts) return null;
  return Math.round(Math.max(0, candidateSpeechMs) * TIMING.interruptAtFraction);
}
