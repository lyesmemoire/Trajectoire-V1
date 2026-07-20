/**
 * Calcule la pression adaptative en protégeant la confiance de l'utilisateur.
 * Interdiction des interruptions précoces et mode Recovery obligatoire.
 */
export function calculateAdaptivePressure(metrics: {
  consecutiveInterruptions: number;
  confidenceDrop: number;
  hesitationRate: number;
  lastScore: number;
  secondsInAnswer: number;
  wordCount: number;
}): {
  newPressureLevel: number;
  behaviorMode: "coaching" | "standard" | "recovery";
  canInterrupt: boolean;
} {
  // 1. RÈGLE ABSOLUE : Pas d'interruption avant 45 secondes ou 50 mots
  const isEarly = metrics.secondsInAnswer < 45 && metrics.wordCount < 50;

  // 2. Détection du besoin de RECOVERY
  // Si silence > 8s (hesitationRate proxy) ou réponses trop courtes
  const needsRecovery =
    metrics.consecutiveInterruptions >= 2 ||
    metrics.hesitationRate > 70 ||
    (metrics.wordCount < 10 && metrics.wordCount > 0);

  if (needsRecovery) {
    return {
      newPressureLevel: 20, // Pression minimale
      behaviorMode: "recovery",
      canInterrupt: false,
    };
  }

  // 3. Détection de Fatigue
  if (metrics.lastScore < 40) {
    return {
      newPressureLevel: 40,
      behaviorMode: "coaching",
      canInterrupt: !isEarly,
    };
  }

  return {
    newPressureLevel: 60,
    behaviorMode: "standard",
    canInterrupt: !isEarly,
  };
}

export const RECOVERY_PHRASES = [
  "Prenez votre temps.",
  "Reformulez simplement.",
  "Donnez-moi juste un exemple.",
];
