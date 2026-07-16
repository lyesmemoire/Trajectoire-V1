/**
 * Ajuste le comportement de l'IA Victor pour protéger la confiance de l'utilisateur.
 */
// @ts-nocheck

export function calculateAdaptivePressure(metrics: {
  consecutiveInterruptions: number;
  confidenceDrop: number;
  hesitationRate: number;
  lastScore: number;
}): {
  newPressureLevel: number;
  behaviorMode: "coaching" | "standard" | "recovery";
} {
  // 1. Détection de Surcharge Émotionnelle (Rage Quit Prevention)
  if (metrics.consecutiveInterruptions >= 3 || metrics.confidenceDrop > 30) {
    return {
      newPressureLevel: 20, // Baisse radicale de tension
      behaviorMode: "recovery",
    };
  }

  // 2. Détection de Fatigue (Plusieurs sessions difficiles)
  if (metrics.lastScore < 40 && metrics.hesitationRate > 50) {
    return {
      newPressureLevel: 40,
      behaviorMode: "coaching",
    };
  }

  return {
    newPressureLevel: 60,
    behaviorMode: "standard",
  };
}
