export interface NextBestAction {
  title: string;
  description: string;
  duration: number;
  reasoning: string;
}

/**
 * Propose UNE seule action prioritaire pour éviter la surcharge mentale.
 */
export function getAdaptiveRecommendation(analysis: _unknown): NextBestAction {
  // Priorité 1 : Clarté (Le socle)
  if (analysis.clarity < 60) {
    return {
      title: "Focus : Clarté Narrative",
      description:
        "Apprenez à structurer vos réponses complexes avec la méthode STAR.",
      duration: 8,
      reasoning:
        "Vos idées sont excellentes mais se perdent lors des interruptions.",
    };
  }

  // Priorité 2 : Concision
  if (analysis.verbosity > 70) {
    return {
      title: "Focus : Concision Stratégique",
      description:
        "Entraînez-vous à répondre en moins de 60 secondes face à Victor.",
      duration: 5,
      reasoning:
        "Votre impact diminue quand vos réponses deviennent trop longues.",
    };
  }

  // Défaut : Challenge
  return {
    title: "Challenge : Haute Pression",
    description: "Une simulation intense avec 40% d'interruptions en plus.",
    duration: 12,
    reasoning:
      "Vous maîtrisez le fond, testons maintenant votre stabilité émotionnelle.",
  };
}
