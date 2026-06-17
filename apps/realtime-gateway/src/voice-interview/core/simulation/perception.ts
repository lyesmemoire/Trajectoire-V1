/**
 * core/simulation/perception.ts — Couche PERCEPTION (refactor P3.7).
 *
 * Regroupe ce que le "recruteur" perçoit d'une réponse :
 *  - signaux faibles (confidence, specificity, ownership, technicalDepth, quantified)
 *  - signaux de bluff
 *  - contradictions CV ↔ réponse (faits)
 *
 * FAÇADE iso-comportement : réexporte la logique existante, sans la modifier.
 * Aucune logique réécrite ici → les tests P3.7 restent verts à l'identique.
 */

export {
  extractSignals,
  type AnswerSignals,
} from "../v2/answer-signals";

export {
  detectBluff,
  buildCredibilityScore,
  type BluffSignals,
  type CredibilityScore,
} from "../v2/bluff-detector";

export {
  extractCandidateFacts,
  detectContradiction,
  type CandidateFacts,
  type Contradiction,
} from "../v2/candidate-facts";

import { extractSignals } from "../v2/answer-signals";
import { detectBluff } from "../v2/bluff-detector";
import {
  detectContradiction,
  type CandidateFacts,
  type Contradiction,
} from "../v2/candidate-facts";
import type { AnswerSignals } from "../v2/answer-signals";
import type { BluffSignals } from "../v2/bluff-detector";

/** Résultat consolidé de la perception d'un tour. */
export interface Perception {
  signals: AnswerSignals;
  bluff: BluffSignals;
  contradiction?: Contradiction;
}

/**
 * Perçoit une réponse en un seul appel (signaux + bluff + contradiction).
 * Pure agrégation des fonctions existantes → comportement identique.
 */
export function perceive(
  transcript: string,
  facts: CandidateFacts,
): Perception {
  const signals = extractSignals(transcript);
  const bluff = detectBluff(transcript, signals);
  const contradiction = detectContradiction(facts, transcript) ?? undefined;
  return contradiction ? { signals, bluff, contradiction } : { signals, bluff };
}
