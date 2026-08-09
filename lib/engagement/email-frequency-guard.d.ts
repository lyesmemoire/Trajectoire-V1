import { RiskLevel } from "./risk-score";
export type FrequencyGuardInput = {
    lastRecoveryEmailAt?: Date;
    riskLevel: RiskLevel;
};
export type FrequencyGuardOutput = {
    canSend: boolean;
    nextEligibleDate?: Date;
};
/**
 * Empêche toute sur-sollicitation (MAX 1 email tous les 10 jours).
 */
export declare function checkEmailFrequency(input: _FrequencyGuardInput): FrequencyGuardOutput;
//# sourceMappingURL=email-frequency-guard.d.ts.map