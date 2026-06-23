/**
 * core/v2/answer-signals.ts — Extraction de signaux faibles (P3.6, Bloc 6). PURE.
 * Tous les signaux sont normalisés 0–1.
 */

export interface AnswerSignals {
  confidence: number;
  specificity: number;
  ownership: number;
  technicalDepth: number;
  quantifiedResults: number;
}

const HEDGES = ["je pense", "peut-être", "je crois", "un peu", "sans doute", "j'imagine", "globalement", "en gros"];
const OWNERSHIP_STRONG = ["j'ai conçu", "j'ai développé", "j'ai mis en place", "j'ai décidé", "j'ai dirigé", "j'ai créé", "j'ai déployé"];
const OWNERSHIP_WEAK = ["j'ai participé", "on a", "nous avons", "l'équipe a", "j'ai aidé"];
const TECH_DEPTH = ["architecture", "performance", "scalab", "latence", "complexité", "trade-off", "compromis", "pattern", "algorithme", "optimis", "sécurité"];

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function extractSignals(answer: string): AnswerSignals {
  const text = (answer ?? "").toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const len = words.length;

  if (len === 0) {
    return { confidence: 0, specificity: 0, ownership: 0, technicalDepth: 0, quantifiedResults: 0 };
  }

  const hedgeCount = HEDGES.filter((h) => text.includes(h)).length;
  const confidence = clamp01(1 - hedgeCount * 0.2);

  // Spécificité : longueur + présence de détails concrets.
  const specificity = clamp01(len / 80);

  const strong = OWNERSHIP_STRONG.filter((m) => text.includes(m)).length;
  const weak = OWNERSHIP_WEAK.filter((m) => text.includes(m)).length;
  const ownership = clamp01(0.4 + strong * 0.3 - weak * 0.2);

  const techHits = TECH_DEPTH.filter((m) => text.includes(m)).length;
  const technicalDepth = clamp01(techHits / 3);

  const quantified = /\d+\s*(%|k€|€|x|fois|jours?|semaines?|mois|heures?|points?)/i.test(text)
    ? 1
    : 0;

  return { confidence, specificity, ownership, technicalDepth, quantifiedResults: quantified };
}
