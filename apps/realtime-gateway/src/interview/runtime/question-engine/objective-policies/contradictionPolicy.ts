import { ObjectiveSelectorContext } from "../selectors/shared/selectorContext";
import { PolicyEffect } from "./PolicyEffect";
import { PolicyPriority } from "./PolicyPriority";

// Hard-coded contradiction threshold for now
const CONTRADICTION_LIMIT = 0.7;

export function applyContradictionPolicy(
  ctx: ObjectiveSelectorContext,
): PolicyEffect {
  const contradiction = ctx.signals.get("contradiction");

  if (contradiction >= CONTRADICTION_LIMIT) {
    return {
      priority: PolicyPriority.HIGH,
      preferredObjectives: ["challenge_claim"],
      scoreModifiers: {
        challenge_claim: 0.6,
      },
      id: `high contradiction score (score: ${contradiction.toFixed(3)} >= ${CONTRADICTION_LIMIT})`,
    };
  }

  return { priority: PolicyPriority.NORMAL };
}
