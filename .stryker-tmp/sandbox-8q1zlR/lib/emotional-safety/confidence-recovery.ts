// @ts-nocheck
import { PERSONAS } from "../interview/personas/persona-config";
import { detectUserFreeze } from "./freeze-detector";

/**
 * Gère le basculement vers le mode Recovery (Honeypot de Confiance).
 */
export function evaluateConfidenceRecovery(session: any, currentMetrics: any) {
  const isFrozen = detectUserFreeze(currentMetrics);

  if (isFrozen) {
    return {
      active: true,
      persona: PERSONAS["supportive"], // Passage à Clara
      newPressure: 20,
      instruction:
        "Le candidat est en surcharge. Simplifie la question. Sois rassurante et professionnelle.",
    };
  }

  return { active: false };
}
