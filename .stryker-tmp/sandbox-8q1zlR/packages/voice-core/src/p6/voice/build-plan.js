// @ts-nocheck
import { clampVoicePlan } from "./clamp-plan.js";
export function buildVoicePlan(input) {
    const shouldInterrupt = input.interruptionChance > 0.5;
    const shouldPause = input.silenceProbability > 0.5;
    const rawPlan = {
        version: 1,
        utterance: input.text,
        delayMs: input.delayMs,
        speechRate: input.speechRate,
        shouldInterrupt,
        shouldPause,
    };
    return clampVoicePlan(rawPlan);
}
//# sourceMappingURL=build-plan.js.map