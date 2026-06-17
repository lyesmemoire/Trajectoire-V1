import { ObjectiveSelectorContext } from "../selectors/shared/selectorContext";
import { PolicyEffect } from "./PolicyEffect";
import { PolicyPriority } from "./PolicyPriority";

export function applyRecoveryPolicy(
  ctx: ObjectiveSelectorContext,
): PolicyEffect {
  const communication_inconsistency = ctx.signals.get(
    "communication_inconsistency",
  );

  if (communication_inconsistency > 0.6) {
    return {
      priority: PolicyPriority.HIGH,
      preferredObjectives: ["recover_candidate"],
      scoreModifiers: {
        recover_candidate: 0.5,
      },
      id:
        "candidate communication is highly inconsistent, suggesting recovery",
    };
  }

  return { priority: PolicyPriority.NORMAL };
}
