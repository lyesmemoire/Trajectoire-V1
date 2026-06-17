/**
 * core/v2/bluff-detector.ts — Détection de bluff + crédibilité (P3.7.2). PURE.
 *
 * Le but n'est pas de piéger : c'est de mesurer si une compétence revendiquée
 * est étayée par des réponses précises et profondes.
 */

import type { AnswerSignals } from "./answer-signals";

export interface BluffSignals {
  vagueness: number; // 0–1
  buzzwordDensity: number; // 0–1
  lackOfExamples: number; // 0–1
  inabilityToGoDeeper: number; // 0–1
  /** Probabilité agrégée de bluff (0–1). */
  bluffProbability: number;
}

const BUZZWORDS = [
  "microservices", "kubernetes", "devops", "cloud native", "event driven",
  "scalable", "résilient", "best practices", "agile", "synergie", "disruptif",
  "machine learning", "blockchain", "serverless", "observabilité",
];

const VAGUE_MARKERS = [
  "presque pareil", "un peu", "en gros", "je pense", "globalement",
  "ça dépend", "c'est compliqué", "je sais pas trop", "à peu près",
];

const EXAMPLE_MARKERS = ["par exemple", "concrètement", "une fois", "sur le projet", "j'ai", "quand"];

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function detectBluff(
  transcript: string,
  signals: AnswerSignals,
): BluffSignals {
  const text = (transcript ?? "").toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const len = Math.max(1, words.length);

  const buzzHits = BUZZWORDS.filter((b) => text.includes(b)).length;
  const buzzwordDensity = clamp01(buzzHits / Math.max(5, len / 8));

  const vagueHits = VAGUE_MARKERS.filter((v) => text.includes(v)).length;
  const vagueness = clamp01(vagueHits * 0.34);

  const hasExample = EXAMPLE_MARKERS.some((m) => text.includes(m));
  const lackOfExamples = hasExample ? 0 : clamp01(0.6 + (1 - signals.specificity) * 0.4);

  // Incapacité à approfondir : peu de profondeur technique malgré des buzzwords.
  const inabilityToGoDeeper = clamp01(
    buzzwordDensity * 0.6 + (1 - signals.technicalDepth) * 0.4,
  );

  const bluffProbability = clamp01(
    vagueness * 0.3 +
      buzzwordDensity * 0.3 +
      lackOfExamples * 0.2 +
      inabilityToGoDeeper * 0.2,
  );

  return { vagueness, buzzwordDensity, lackOfExamples, inabilityToGoDeeper, bluffProbability };
}

export interface CredibilityScore {
  consistency: number; // 0–100
  specificity: number;
  depth: number;
  evidence: number;
  overall: number;
}

/**
 * Agrège la crédibilité sur l'ensemble des tours.
 * @param contradictionCount nombre de contradictions détectées (CV ↔ réponses)
 */
export function buildCredibilityScore(
  signalsList: AnswerSignals[],
  bluffList: BluffSignals[],
  contradictionCount: number,
): CredibilityScore {
  const n = Math.max(1, signalsList.length);
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

  const specificity = Math.round(avg(signalsList.map((s) => s.specificity)) * 100);
  const depth = Math.round(avg(signalsList.map((s) => s.technicalDepth)) * 100);
  const evidence = Math.round((1 - avg(bluffList.map((b) => b.lackOfExamples))) * 100);
  const avgBluff = avg(bluffList.map((b) => b.bluffProbability));
  const consistency = Math.round(
    Math.max(0, 100 - avgBluff * 60 - (contradictionCount / n) * 100),
  );

  const overall = Math.round(
    consistency * 0.35 + specificity * 0.2 + depth * 0.25 + evidence * 0.2,
  );

  return { consistency, specificity, depth, evidence, overall };
}
