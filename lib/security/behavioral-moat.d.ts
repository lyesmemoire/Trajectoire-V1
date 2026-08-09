/**
 * Injects subtle variations in the AI's behavior to prevent easy model fingerprinting.
 * This acts as a "Behavioral Watermark".
 */
export declare function injectBehavioralVariance(basePrompt: string, sessionId: string): string;
/**
 * Unified Threat Scoring for sessions.
 */
export declare function computeSessionThreatScore(signals: {
    cloningRisk: boolean;
    scrapingRisk: boolean;
    rapidNavigation: boolean;
    headlessDetected: boolean;
}): number;
//# sourceMappingURL=behavioral-moat.d.ts.map