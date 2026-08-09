import { RiskLevel, ProbableCause } from "../emotional-safety/risk-score";
export type RecoveryEmailInput = {
    userId: string;
    email: string;
    firstName?: string;
    riskLevel: RiskLevel;
    probableCause: ProbableCause;
    recommendedAction: {
        title: string;
        duration: string;
    };
};
/**
 * Service unique d'envoi d'email de reprise doux et minimaliste.
 */
export declare function sendRecoveryEmail(input: _RecoveryEmailInput): Promise<import("resend").CreateEmailResponseSuccess>;
//# sourceMappingURL=resend-coaching.d.ts.map