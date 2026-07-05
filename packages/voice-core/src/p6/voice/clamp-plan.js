const BOUNDS = {
    delayMs: { min: 0, max: 10000 },
    speechRate: { min: 0.5, max: 2.0 },
};
export function clampVoicePlan(plan) {
    return {
        ...plan,
        delayMs: Math.max(BOUNDS.delayMs.min, Math.min(BOUNDS.delayMs.max, plan.delayMs)),
        speechRate: Math.max(BOUNDS.speechRate.min, Math.min(BOUNDS.speechRate.max, plan.speechRate)),
    };
}
//# sourceMappingURL=clamp-plan.js.map