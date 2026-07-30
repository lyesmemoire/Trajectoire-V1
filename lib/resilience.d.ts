/**
 * Resilience patterns for critical paths.
 */
/**
 * Returns a promise that resolves with the result of the given promise,
 * or resolves with the fallback value if the promise takes longer than ms.
 * If no fallback is provided, it throws a TimeoutError.
 */
export declare class TimeoutError extends Error {
    constructor(message: string);
}
export declare function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue?: T): Promise<T>;
export interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeoutMs: number;
}
export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export declare class CircuitBreaker {
    private options;
    private state;
    private failures;
    private nextAttempt;
    constructor(options: CircuitBreakerOptions);
    getState(): CircuitBreakerState;
    execute<T>(action: () => Promise<T>, fallbackValue?: T): Promise<T>;
    private onSuccess;
    private onFailure;
}
/**
 * Basic Token Bucket or Time Window rate limiter per session.
 */
export declare class SessionRateLimiter {
    private windowMs;
    private maxRequests;
    private limits;
    constructor(windowMs: number, maxRequests: number);
    /**
     * Returns true if allowed, false if rate limited.
     */
    consume(sessionId: string): boolean;
    cleanup(sessionId: string): void;
}
//# sourceMappingURL=resilience.d.ts.map