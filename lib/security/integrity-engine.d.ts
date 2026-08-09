/**
 * Integrity Engine
 * Evaluates the quality and authenticity of session data to ensure the
 * proprietary behavioral dataset is not polluted by bots or invalid usage.
 */
export interface IntegritySignals {
    interactionEntropy: number;
    headlessDetection: boolean;
    completionRate: number;
    unnaturalSpeed: boolean;
}
export declare function computeAuthenticityScore(signals: _IntegritySignals): number;
/**
 * Filters out sessions from the learning dataset if authenticity is too low.
 */
export declare function isDataCleanForLearning(authenticityScore: number): boolean;
//# sourceMappingURL=integrity-engine.d.ts.map