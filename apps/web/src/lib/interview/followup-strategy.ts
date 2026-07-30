export type FollowUpStrategy =
  | "clarification"
  | "pressure"
  | "deep_dive"
  | "contradiction"
  | "supportive";

export interface FollowUpIntent {
  strategy: FollowUpStrategy;
  reason: string;
}

export function chooseStrategy(analysis: any, personaPressure: number, ): FollowUpIntent {
  // 1. Si la réponse est trop vague, demander clarification
  if (analysis.specificity < 40) {
    return {
      strategy: "clarification",
      reason: "La réponse manque de détails concrets.",
    };
  }

  // 2. Si le persona est un recruteur de type "stress", augmenter la pression
  if (personaPressure > 70 && analysis.confidence < 60) {
    return {
      strategy: "pressure",
      reason: "Tester la résistance au stress suite à une réponse hésitante.",
    };
  }

  // 3. Si la réponse est excellente, faire un deep dive sur un point technique
  if (analysis.specificity > 80 && analysis.clarity > 80) {
    return {
      strategy: "deep_dive",
      reason: "Creuser un sujet maîtrisé pour voir les limites.",
    };
  }

  // 4. Par défaut, rester dans le flux de l'entretien (supportive ou suite logique)
  return {
    strategy: "supportive",
    reason: "Poursuivre l'échange naturellement.",
  };
}
