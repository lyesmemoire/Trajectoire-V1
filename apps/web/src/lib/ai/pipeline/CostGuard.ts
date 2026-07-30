import { CognitiveContext } from "@/domain/entities/CognitiveContext";

export class CostGuard {
  /**
   * Checks if the estimated token cost is within the remaining budget.
   * If not, it activates 'Compression Mode' or throws an error if entirely depleted.
   */
  public checkBudget(context: CognitiveContext, estimatedTokens: number): { allowed: boolean; compressionMode: boolean } {
    const { tokenBudget, tokensConsumed } = context.budget;
    const remaining = tokenBudget - tokensConsumed;

    if (remaining <= 0) {
      return { allowed: false, compressionMode: true };
    }

    if (remaining < estimatedTokens * 2) {
      // Running low, enable compression mode
      return { allowed: true, compressionMode: true };
    }

    return { allowed: true, compressionMode: false };
  }
}
