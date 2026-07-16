import type { ScoreSignal } from "../types.js";

export interface DeflectionContext {
  readonly lastScores: ScoreSignal[];
  readonly semanticDeflectionDetected: boolean;
}

export class IsCandidateDeflectingSpec {
  public isSatisfiedBy(context: DeflectionContext): boolean {
    if (context.semanticDeflectionDetected) {
      return true;
    }

    if (context.lastScores.length >= 2) {
      const [prev, current] = context.lastScores.slice(-2);
      if (prev && current && prev.value < 40 && current.value < 40) {
        return true;
      }
    }

    return false;
  }
}
