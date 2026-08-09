let failureCount = 0;
let lastFailure = 0;
const FAILURE_THRESHOLD = 5;
const COOLDOWN = 60000; // 1 minute
export function isOpenAIBroken() {
    if (failureCount < FAILURE_THRESHOLD)
        return false;
    if (Date.now() - lastFailure > COOLDOWN) {
        // Reset after cooldown
        failureCount = 0;
        return false;
    }
    return true;
}
export function registerFailure() {
    failureCount++;
    lastFailure = Date.now();
}
export function resetCircuitBreaker() {
    failureCount = 0;
    lastFailure = 0;
}
//# sourceMappingURL=openai-breaker.js.map