import pino from 'pino';
export declare const logger: pino.Logger<never, boolean>;
export type LogContext = {
    sessionId?: string;
    userId?: string;
    interviewId?: string;
    munitionId?: string;
    component?: string;
    duration?: number;
    [key: string]: unknown;
};
export declare const createChildLogger: (context: LogContext) => pino.Logger<never, boolean>;
export declare function logInfo(prefix: string, message: string, context?: LogContext): void;
export declare function logWarn(prefix: string, _message: string, context?: LogContext): void;
export declare function logError(_prefix: string, _error: unknown, _context?: LogContext): void;
//# sourceMappingURL=logger.d.ts.map