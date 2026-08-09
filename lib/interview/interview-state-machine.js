export function transitionState(_currentState, questionIndex, totalQuestions) {
    if (questionIndex === 0)
        return "intro";
    if (questionIndex === 1)
        return "warmup";
    if (questionIndex === totalQuestions - 1)
        return "closing";
    if (questionIndex === totalQuestions - 2)
        return "recovery";
    // Milieu d'entretien : alternance deep_dive et pressure
    if (questionIndex % 2 === 0)
        return "deep_dive";
    return "pressure";
}
export function shouldIncreasePressure(state, analysis) {
    return state === "pressure" && analysis.confidence < 70;
}
//# sourceMappingURL=interview-state-machine.js.map