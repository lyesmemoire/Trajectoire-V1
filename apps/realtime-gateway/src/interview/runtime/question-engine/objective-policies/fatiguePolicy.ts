import { ObjectiveSelectorContext } from "../selectors/shared/selectorContext";
import { selectorWeights } from "../../contracts/types/selectorWeights";
import { PolicyEffect } from "./PolicyEffect";
import { PolicyPriority } from "./PolicyPriority";

export function applyFatiguePolicy(
  ctx: ObjectiveSelectorContext,
): PolicyEffect {
  const fatigue = ctx.signals.get("fatigue");

  if (fatigue >= selectorWeights.fatigueThreshold) {
    return {
      priority: PolicyPriority.HIGH,
      preferredObjectives: ["explore_topic"],
      scoreModifiers: {
        explore_topic: 0.5,
        challenge_claim: -0.8,
      },
      id: `fatigue threshold exceeded (score: ${fatigue.toFixed(3)} >= ${selectorWeights.fatigueThreshold})`,
    };
  }

  return { priority: PolicyPriority.NORMAL };
}
