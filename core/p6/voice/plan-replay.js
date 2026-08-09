import { validateVoicePlan } from "./plan-validator.js";
export function serializePlan(plan) {
    return JSON.stringify(plan);
}
export function deserializePlan(data) {
    const plan = JSON.parse(data);
    const validation = validateVoicePlan(plan);
    if (!validation.valid) {
        throw new Error(`Invalid VoiceExecutionPlan data: ${validation.errors.join(", ")}`);
    }
    return plan;
}
//# sourceMappingURL=plan-replay.js.map