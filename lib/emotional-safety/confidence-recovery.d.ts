/**
 * Gère le basculement vers le mode Recovery (Honeypot de Confiance).
 */
export declare function evaluateConfidenceRecovery(_session: unknown, currentMetrics: unknown): {
    active: boolean;
    persona: any;
    newPressure: number;
    instruction: string;
} | {
    active: boolean;
    persona?: undefined;
    newPressure?: undefined;
    instruction?: undefined;
};
//# sourceMappingURL=confidence-recovery.d.ts.map