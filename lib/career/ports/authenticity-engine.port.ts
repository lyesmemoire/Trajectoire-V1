import { AuthenticityScore } from "../domain/value-objects/authenticity-score.vo";

export interface AuthenticityEnginePort {
  computeAuthenticity(signals: {
    entropyScore: number;
    headless: boolean;
    unnaturalSpeed: boolean;
    completionRate: number;
  }): Promise<AuthenticityScore>;
}
