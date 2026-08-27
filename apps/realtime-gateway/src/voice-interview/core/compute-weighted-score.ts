import { ROLE_WEIGHT_MATRIX, type RoleType } from "./role-weights.js";
import type { StructuredScore } from "./scoring.js";

export function computeWeightedOverall(score: StructuredScore, role: RoleType = "generic", ): number {
  const weights = ROLE_WEIGHT_MATRIX[role] ?? ROLE_WEIGHT_MATRIX["generic"];

  const weighted =
    score.competencies.communication * weights.communication +
    score.competencies.technical_depth * weights.technical_depth +
    score.competencies.clarity * weights.clarity +
    score.competencies.problem_solving * weights.problem_solving +
    score.competencies.confidence * weights.confidence;

  return Math.round(weighted);
}
