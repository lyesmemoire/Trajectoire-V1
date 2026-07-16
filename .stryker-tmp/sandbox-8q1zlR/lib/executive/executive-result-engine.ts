// @ts-nocheck
export type ExecutiveAxis =
  | "strategicThinking"
  | "stakeholderInfluence"
  | "decisionClarity"
  | "authorityProjection"
  | "pressureStability";

export interface ExecutiveScores {
  strategicThinking: number;
  stakeholderInfluence: number;
  decisionClarity: number;
  authorityProjection: number;
  pressureStability: number;
}

export interface ExecutiveResult {
  overallScore: number;
  level: "Senior Manager" | "Director Ready" | "Executive Track";
  persuasionGap: number;
  influenceScore: number;
  percentile: number;
  scores: ExecutiveScores;
}

export class ExecutiveResultEngine {
  evaluate(input: ExecutiveScores): ExecutiveResult {
    const overall =
      input.strategicThinking * 0.25 +
      input.stakeholderInfluence * 0.2 +
      input.decisionClarity * 0.2 +
      input.authorityProjection * 0.2 +
      input.pressureStability * 0.15;

    const level =
      overall > 80
        ? "Executive Track"
        : overall > 65
        ? "Director Ready"
        : "Senior Manager";

    const persuasionGap = 100 - input.stakeholderInfluence;
    const influenceScore =
      (input.stakeholderInfluence + input.authorityProjection) / 2;

    const percentile = 100 - Math.floor(Math.random() * 25 + 10); // Between 65 and 90

    return {
      overallScore: Math.round(overall),
      level,
      persuasionGap,
      influenceScore,
      percentile,
      scores: input,
    };
  }
}
