import { CareerArchetype } from "./career-archetypes";

export interface ScoreProfile {
  clarity: number;
  specificity: number;
  confidence: number;
  ownership: number;
  technical: number;
  verbosity: number;
}

/**
 * Moteur de détermination d'archétype basé sur les scores.
 */
export function determineArchetype(scores: ScoreProfile): CareerArchetype {
  // 1. Détection Overexplainer
  if (scores.verbosity > 75 && scores.clarity < 60) {
    return "overexplainer";
  }

  // 2. Détection Strategic Leader
  if (scores.ownership > 80 && scores.specificity > 70) {
    return "strategic_leader";
  }

  // 3. Détection Stress Reactive (Confiance basse malgré bonne technique)
  if (scores.confidence < 45 && scores.technical > 70) {
    return "stress_reactive";
  }

  // 4. Détection Analytical Operator
  if (scores.technical > 80 && scores.confidence < 60) {
    return "analytical_operator";
  }

  // 5. Détection Concise Executor
  if (scores.verbosity < 40 && scores.clarity > 75) {
    return "concise_executor";
  }

  // 6. Détection Confident Performer
  if (scores.confidence > 80 && scores.clarity > 70) {
    return "confident_performer";
  }

  // 7. Détection Hesitant Expert
  if (scores.technical > 75 && scores.confidence < 50) {
    return "hesitant_expert";
  }

  // Par défaut
  return "adaptable_communicator";
}

/**
 * Calcule l'évolution narrative.
 */
export function generateEvolutionNarrative(
  prev: CareerArchetype,
  current: CareerArchetype,
): string {
  if (prev === current)
    return "Vous stabilisez votre identité professionnelle actuelle.";

  if (prev === "stress_reactive" && current !== "stress_reactive") {
    return "Progression majeure : vous avez appris à dompter votre stress pour laisser briller vos compétences.";
  }

  if (prev === "overexplainer" && current === "concise_executor") {
    return "Excellente mutation : votre discours est devenu chirurgical et percutant.";
  }

  return "Votre profil évolue vers une nouvelle dimension de leadership.";
}
