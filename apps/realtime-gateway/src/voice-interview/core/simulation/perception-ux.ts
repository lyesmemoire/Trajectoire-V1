/**
 * core/simulation/perception-ux.ts — Perceptual Engine (P4). PURE, déterministe.
 *
 * COUCHE DE MISE EN SCÈNE, pas de logique : projette un état mental STABLE
 * (RecruiterMindState) en paramètres d'EXPÉRIENCE (timing, silence, interruption,
 * ton, intensité). N'introduit aucune décision ni nouvelle simulation.
 *
 * Règles anti-overacting : toutes les sorties sont bornées + lissées pour éviter
 * un recruteur « bipolaire algorithmique ». Repose sur l'invariant de stabilité
 * déjà garanti (les entrées sont bornées).
 */

import type { RecruiterMindState, RecruiterEmotion } from "./recruiter-mind";

/** Paramètres perceptifs consommés par le runtime (voix/UI). */
export interface PerceptionUX {
  /** Délai avant la réponse du recruteur (ms). */
  delayBeforeReplyMs: number;
  /** Probabilité d'un silence appuyé (0–1). */
  silenceProbability: number;
  /** Probabilité d'interruption (barge-in du recruteur) (0–1). */
  interruptionChance: number;
  /** Décalage de ton (négatif = doux, positif = sec), -1 → 1. */
  toneShift: number;
  /** « Tranchant » de la question (0 = ouverte, 1 = abrupte). */
  questionSharpness: number;
  /** Débit de parole relatif (0.8 lent → 1.2 rapide). */
  speechRate: number;
  /** Émotion affichée (reprise du mind, pour l'UI). */
  emotion: RecruiterEmotion;
}

/** Bornes anti-overacting (le recruteur reste crédible, jamais caricatural). */
const LIMITS = {
  delayMin: 250,
  delayMax: 1600,
  silenceMax: 0.45,
  interruptMax: 0.35,
  rateMin: 0.85,
  rateMax: 1.2,
} as const;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Mappe l'état mental en paramètres UX. Déterministe : même mind → même UX.
 * (Les probabilités sont des valeurs, pas des tirages : le tirage aléatoire
 *  éventuel se fait côté runtime, pas ici, pour rester pur/testable.)
 */
export function perceiveUX(mind: RecruiterMindState): PerceptionUX {
  // Délai : pression haute -> réponse plus sèche/rapide ; calme -> plus posé.
  // Fatigue -> légèrement plus lent. Bornes anti-overacting.
  const delayBeforeReplyMs = Math.round(
    clamp(
      900 - mind.pressure * 600 + mind.fatigue * 300,
      LIMITS.delayMin,
      LIMITS.delayMax,
    ),
  );

  // Silence appuyé : surtout en évaluation/suspicion modérée (outil de pression).
  const silenceProbability = clamp(
    mind.suspicion * 0.4 + (mind.pressure > 0.5 ? 0.1 : 0),
    0,
    LIMITS.silenceMax,
  );

  // Interruption : seulement sous forte pression + faible engagement.
  const interruptionChance = clamp(
    mind.pressure >= 0.8 ? 0.2 + (1 - mind.engagement) * 0.15 : mind.pressure * 0.1,
    0,
    LIMITS.interruptMax,
  );

  // Ton : sec si suspicion/pression, doux si confiance/engagement.
  const toneShift = clamp(
    mind.suspicion * 0.6 + mind.pressure * 0.4 - mind.confidenceInCandidate * 0.4 - mind.engagement * 0.2,
    -1,
    1,
  );

  // Tranchant de la question : monte avec suspicion + pression.
  const questionSharpness = clamp(mind.suspicion * 0.5 + mind.pressure * 0.5, 0, 1);

  // Débit : un peu plus rapide sous pression, plus lent si fatigue.
  const speechRate = clamp(
    1 + mind.pressure * 0.15 - mind.fatigue * 0.1,
    LIMITS.rateMin,
    LIMITS.rateMax,
  );

  return {
    delayBeforeReplyMs,
    silenceProbability,
    interruptionChance,
    toneShift,
    questionSharpness,
    speechRate,
    emotion: mind.emotion,
  };
}

/**
 * Lissage temporel (anti-saccade) : évite des variations UX trop brutales entre
 * deux tours. Mélange l'UX précédente et la nouvelle (facteur 0–1).
 * Pur : ne dépend que des entrées.
 */
export function smoothUX(
  prev: PerceptionUX,
  next: PerceptionUX,
  blend = 0.5,
): PerceptionUX {
  const b = clamp(blend, 0, 1);
  const lerp = (a: number, c: number) => a + (c - a) * b;
  return {
    delayBeforeReplyMs: Math.round(lerp(prev.delayBeforeReplyMs, next.delayBeforeReplyMs)),
    silenceProbability: lerp(prev.silenceProbability, next.silenceProbability),
    interruptionChance: lerp(prev.interruptionChance, next.interruptionChance),
    toneShift: lerp(prev.toneShift, next.toneShift),
    questionSharpness: lerp(prev.questionSharpness, next.questionSharpness),
    speechRate: lerp(prev.speechRate, next.speechRate),
    emotion: next.emotion,
  };
}
