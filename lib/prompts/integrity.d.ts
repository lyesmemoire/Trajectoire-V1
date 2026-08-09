export interface PromptMetadata {
    version: string;
    engine: string;
    fragments: string[];
    config: unknown;
}
/**
 * Prompt Integrity Layer
 * Ensures consistency, auditability, and safety of AI behaviors.
 */
export declare const PromptIntegrity: {
    /**
     * Generates a unique fingerprint for an assembled prompt.
     */
    generateFingerprint: (text: string) => string;
    /**
     * Logs a prompt audit trail to monitor drift and consistency.
     */
    logAudit: (userId: string, sessionId: string, metadata: PromptMetadata) => Promise<void>;
    /**
     * Detects behavioral drift (e.g., tone becoming too aggressive).
     */
    detectDrift: (response: string, expectedTone: string) => boolean;
};
//# sourceMappingURL=integrity.d.ts.map