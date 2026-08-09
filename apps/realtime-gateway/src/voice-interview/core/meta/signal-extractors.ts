/**
 * Utilitaires pour extraire les signaux des moteurs V1 et V2
 * afin de les alimenter dans l'évaluation unifiée du meta-brain.
 */

/**
 * Version simplifiée pour l'intégration progressive (Palier 3).
 * Pour l'instant, retourne des valeurs neutres basées sur les signaux V3.
 * À enrichir progressivement avec les vrais appels V1/V2.
 */
export function extractLegacySignalsRudimentary(
  v3Score: number,
  v3IntegrityRisk: number
): {
  v1_signals: {
    score: number;
    decision_hint: "probe" | "deepen" | "move-on";
  };
  v2_signals: {
    specificity: number;
    ownership: number;
    technical_depth: number;
  };
} {
  // Mapping rudimentaire depuis V3 vers V1/V2
  const v1Score = Math.max(0, Math.min(100, 100 - (v3IntegrityRisk * 100)));
  const v1Hint: "probe" | "deepen" | "move-on" = 
    v1Score >= 80 ? "move-on" : v1Score >= 60 ? "deepen" : "probe";

  const v2Specificity = Math.max(0, Math.min(10, v3Score / 10));
  const v2Ownership = Math.max(0, Math.min(10, (1 - v3IntegrityRisk) * 10));
  const v2TechnicalDepth = Math.max(0, Math.min(10, v3Score / 10));

  return {
    v1_signals: {
      score: v1Score,
      decision_hint: v1Hint
    },
    v2_signals: {
      specificity: v2Specificity,
      ownership: v2Ownership,
      technical_depth: v2TechnicalDepth
    }
  };
}
