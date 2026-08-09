export interface RecoveryMetrics {
    totalFreezes: number;
    recoveryTriggered: number;
    recoverySuccessful: number;
    completionAfterRecovery: number;
    falsePositiveRate: number;
    recoveredSessionRate: number;
    returnAfterRecoveryRate: number;
}
/**
 * Audit engine for the Honeypot of Confidence validation.
 */
export declare function computeRecoveryAudit(): Promise<RecoveryMetrics>;
//# sourceMappingURL=recovery-audit.d.ts.map