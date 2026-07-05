import { AuthenticityEnginePort } from "../../ports/authenticity-engine.port";
import { AuthenticityScore } from "../../domain/value-objects/authenticity-score.vo";
import { computeAuthenticityScore } from "@/lib/security/integrity-engine";

export class IntegrityEngineAdapter implements AuthenticityEnginePort {
  async computeAuthenticity(signals: {
    entropyScore: number;
    headless: boolean;
    unnaturalSpeed: boolean;
    completionRate: number;
  }): Promise<AuthenticityScore> {
    const rawScore = computeAuthenticityScore({
      interactionEntropy: signals.entropyScore,
      headlessDetection: signals.headless,
      unnaturalSpeed: signals.unnaturalSpeed,
      completionRate: signals.completionRate,
    });

    return AuthenticityScore.create(rawScore);
  }
}
