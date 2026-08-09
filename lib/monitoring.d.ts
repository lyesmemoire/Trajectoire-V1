export declare const logger: {
    info: (message: string, context?: Record<string, unknown>) => void;
    warn: (message: string, context?: Record<string, unknown>) => void;
    error: (message: string, context?: Record<string, unknown>) => void;
};
export declare function trackBusinessEvent(event: "signup" | "cv_upload" | "ats_run" | "credit_purchase" | "optimize" | "interview", userId: string, metadata?: Record<string, _unknown>): void;
//# sourceMappingURL=monitoring.d.ts.map