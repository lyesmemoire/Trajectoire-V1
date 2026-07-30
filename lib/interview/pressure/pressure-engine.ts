import { AnswerAnalysis } from "../behavior/answer-analysis";
import { PersonaConfig } from "../personas/persona-config";

/**
 * Calcule le nouveau niveau de pression basé sur la performance et le persona.
 */
export function calculatePressureImpact(currentLevel: number, analysis: AnswerAnalysis, persona: PersonaConfig, ): number {
  let impact = 0;

  // Si la confiance est faible, on augmente souvent la pression (test de résistance)
  if (analysis.confidence < 50) {
    impact += persona.pressureLevel / 10;
  }

  // Si la spécificité est élevée, on peut relâcher un peu ou faire un deep dive
  if (analysis.specificity > 80) {
    impact -= 5;
  }

  // Ajustement par persona
  if (persona.id === "stress") {
    impact += 5; // Victor pousse toujours un peu plus
  }

  const nextLevel = Math.max(0, Math.min(100, currentLevel + impact));
  return Math.round(nextLevel);
}

export function shouldTriggerInterruption(pressureLevel: number, persona: PersonaConfig, ): boolean {
  const threshold = 100 - persona.interruptionRate;
  return pressureLevel > threshold && Math.random() * 100 > threshold;
}
