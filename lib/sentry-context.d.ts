export declare const setSentryContext: (context: {
    sessionId?: string;
    userId?: string;
    interviewId?: string;
    component?: string;
}) => void;
export declare const captureError: (error: Error | unknown, context?: Record<string, _unknown>) => void;
//# sourceMappingURL=sentry-context.d.ts.map