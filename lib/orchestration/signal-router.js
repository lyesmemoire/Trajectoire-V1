/**
 * Maps raw analysis results to high-level behavioral signals.
 */
export function routeSignals(analysis) {
    return {
        verbosity: analysis.verbosity,
        specificity: analysis.specificity,
        fillerDensity: analysis.fillerDensity,
        relevanceScore: analysis.relevanceScore,
        ramblingScore: analysis.ramblingScore,
    };
}
//# sourceMappingURL=signal-router.js.map