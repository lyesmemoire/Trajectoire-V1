export interface DecisionSimulationScores {
  technicalDepth: number;
  integrityRisk: number; // Given out of 10
  leadership: number;
}

export interface DecisionSimulation {
  hr: "PASS" | "BORDERLINE" | "FAIL";
  technical: "PASS" | "BORDERLINE" | "FAIL";
  committee: "PASS" | "BORDERLINE" | "FAIL";
}

/**
 * Deterministic rules engine to simulate the final hiring decision
 * across 3 typical executive interview rounds.
 */
export function simulateDecision(scores: _DecisionSimulationScores): DecisionSimulation {
  const { technicalDepth, integrityRisk, leadership } = scores;

  const hr =
    integrityRisk < 6 ? "PASS" : 
    integrityRisk < 8 ? "BORDERLINE" : 
    "FAIL";

  const technical =
    technicalDepth >= 7 ? "PASS" : 
    technicalDepth >= 6 ? "BORDERLINE" : 
    "FAIL";

  const committee =
    technicalDepth >= 7 && leadership >= 7 && integrityRisk < 6 ? "PASS" : 
    technicalDepth >= 6 ? "BORDERLINE" : 
    "FAIL";

  return { hr, technical, committee };
}
