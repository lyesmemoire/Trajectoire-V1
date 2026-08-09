export declare const ErrorCodes: {
    readonly AUTH_REQUIRED: {
        readonly code: "AUTH_REQUIRED";
        readonly status: 401;
        readonly message: "Authentication required";
    };
    readonly AUTH_INVALID: {
        readonly code: "AUTH_INVALID";
        readonly status: 401;
        readonly message: "Invalid credentials";
    };
    readonly AUTH_EXPIRED: {
        readonly code: "AUTH_EXPIRED";
        readonly status: 401;
        readonly message: "Session expired";
    };
    readonly AUTH_EMAIL_EXISTS: {
        readonly code: "AUTH_EMAIL_EXISTS";
        readonly status: 409;
        readonly message: "Email already registered";
    };
    readonly INSUFFICIENT_CREDITS: {
        readonly code: "INSUFFICIENT_CREDITS";
        readonly status: 402;
        readonly message: "Not enough credits";
    };
    readonly CREDIT_TRANSACTION_FAILED: {
        readonly code: "CREDIT_TRANSACTION_FAILED";
        readonly status: 500;
        readonly message: "Credit operation failed";
    };
    readonly VALIDATION_ERROR: {
        readonly code: "VALIDATION_ERROR";
        readonly status: 400;
        readonly message: "Invalid input";
    };
    readonly INVALID_FILE_TYPE: {
        readonly code: "INVALID_FILE_TYPE";
        readonly status: 400;
        readonly message: "Invalid file type";
    };
    readonly FILE_TOO_LARGE: {
        readonly code: "FILE_TOO_LARGE";
        readonly status: 400;
        readonly message: "File too large";
    };
    readonly NOT_FOUND: {
        readonly code: "NOT_FOUND";
        readonly status: 404;
        readonly message: "Resource not found";
    };
    readonly SESSION_NOT_FOUND: {
        readonly code: "SESSION_NOT_FOUND";
        readonly status: 404;
        readonly message: "Session not found";
    };
    readonly ANALYSIS_NOT_FOUND: {
        readonly code: "ANALYSIS_NOT_FOUND";
        readonly status: 404;
        readonly message: "Analysis not found";
    };
    readonly RATE_LIMIT_EXCEEDED: {
        readonly code: "RATE_LIMIT_EXCEEDED";
        readonly status: 429;
        readonly message: "Rate limit exceeded";
    };
    readonly INTERNAL_ERROR: {
        readonly code: "INTERNAL_ERROR";
        readonly status: 500;
        readonly message: "Internal server error";
    };
    readonly AI_SERVICE_ERROR: {
        readonly code: "AI_SERVICE_ERROR";
        readonly status: 503;
        readonly message: "AI service unavailable";
    };
    readonly DATABASE_ERROR: {
        readonly code: "DATABASE_ERROR";
        readonly status: 500;
        readonly message: "Database error";
    };
};
export declare class APIError extends Error {
    readonly code: string;
    readonly status: number;
    readonly details?: Record<string, unknown>;
    constructor(errorDef: (typeof ErrorCodes)[keyof typeof ErrorCodes], details?: Record<string, unknown>);
    toJSON(): {
        error: string;
        code: string;
    };
}
export declare class AuthError extends APIError {
    constructor(errorDef: typeof ErrorCodes.AUTH_REQUIRED | typeof ErrorCodes.AUTH_INVALID | typeof ErrorCodes.AUTH_EXPIRED);
}
export declare class ValidationError extends APIError {
    readonly fieldErrors: Record<string, string>;
    constructor(fieldErrors: Record<string, string>);
    toJSON(): {
        error: string;
        code: string;
        details: Record<string, string>;
    };
}
export declare class InsufficientCreditsError extends APIError {
    readonly currentCredits: number;
    readonly requiredCredits: number;
    constructor(currentCredits: number, requiredCredits: number);
    toJSON(): {
        error: string;
        code: string;
        currentCredits: number;
        requiredCredits: number;
    };
}
export declare class RateLimitError extends APIError {
    readonly retryAfter: number;
    constructor(retryAfter: number);
    toJSON(): {
        error: string;
        code: string;
        retryAfter: number;
    };
}
export declare function handleAPIError(error: unknown): {
    status: number;
    body: {
        error: string;
        code: string;
    };
};
//# sourceMappingURL=errors.d.ts.map