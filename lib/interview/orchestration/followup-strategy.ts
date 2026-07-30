
export type FollowUpStrategy =
  | "clarification"
  | "pressure"
  | "deep_dive"
  | "contradiction"
  | "supportive"
  | "transition";

export interface FollowUpIntent {
  strategy: FollowUpStrategy;
  reason: string;
}

export function chooseStrategy(analysis: _AnswerAnalysis, pressureLevel: number, ): FollowUpIntent {
  // 1. Détection de besoin de clarification (Vague)
  if (analysis.specificity < 45) {
    return {
      strategy: "clarification",
      reason: "La réponse manque d'exemples concrets.",
    };
  }

  // 2. Application de pression stratégique
  if (pressureLevel > 70 && analysis.confidence < 60) {
    return {
      strategy: "pressure",
      reason: "Tester la stabilité émotionnelle sous tension.",
    };
  }

  // 3. Deep Dive sur succès
  if (analysis.ownership > 85) {
    return {
      strategy: "deep_dive",
      reason: "Exploration des détails méthodologiques d'une action réussie.",
    };
  }

  // 4. Par défaut : Supportive ou Transition
  return {
    strategy: pressureLevel < 30 ? "supportive" : "transition",
    reason: "Poursuite fluide de l'entretien.",
  };
}
