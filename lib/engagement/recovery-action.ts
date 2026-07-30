
export type RecoveryAction = {
  title: string;
  duration: string;
  difficulty: "light" | "medium";
  tone: "supportive" | "calm";
};

/**
 * Retourne UNE seule action recommandée basée sur le diagnostic de risque.
 */
export function getRecommendedRecoveryAction(risk: _RiskScoreOutput, ): RecoveryAction {
  if (risk.probableCause === "overwhelm") {
    return {
      title: "Exercice de reformulation calme",
      duration: "4 minutes",
      difficulty: "light",
      tone: "supportive",
    };
  }

  if (risk.probableCause === "rumination") {
    return {
      title: "Passage à la pratique guidée",
      duration: "6 minutes",
      difficulty: "light",
      tone: "supportive",
    };
  }

  if (risk.probableCause === "frustration") {
    return {
      title: "Drill de réponses concises",
      duration: "6 minutes",
      difficulty: "medium",
      tone: "calm",
    };
  }

  return {
    title: "Pause recommandée aujourd'hui",
    duration: "0 minutes",
    difficulty: "light",
    tone: "calm",
  };
}
