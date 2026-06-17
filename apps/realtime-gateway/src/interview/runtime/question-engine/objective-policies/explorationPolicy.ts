import { ObjectiveSelectorContext } from "../selectors/shared/selectorContext";
import { PolicyEffect } from "./PolicyEffect";
import { PolicyPriority } from "./PolicyPriority";

export function applyExplorationPolicy(
  ctx: ObjectiveSelectorContext,
): PolicyEffect {
  const novelty = ctx.signals.get("novelty");

  if (novelty > 0.7) {
    return {
      priority: PolicyPriority.NORMAL,
      preferredObjectives: ["detect_depth"],
      scoreModifiers: {
        detect_depth: 0.3,
      },
      id: "high novelty encourages depth detection",
    };
  }

  return { priority: PolicyPriority.NORMAL };
}
