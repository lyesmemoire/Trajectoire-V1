/**
 * Resilience patterns for critical paths.
 */
/**
 * Returns a promise that resolves with the result of the given promise,
 * or resolves with the fallback value if the promise takes longer than ms.
 * If no fallback is provided, it throws a TimeoutError.
 */
export class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
    }
}
export async function withTimeout(promise, ms, fallbackValue) {
    let timeoutId;
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            if (fallbackValue !== undefined) {
                resolve(fallbackValue);
            }
            else {
                reject(new TimeoutError(`Operation timed out after ${ms}ms`));
            }
        }, ms);
    });
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
    }
    catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
export class CircuitBreaker {
    options;
    state = 'CLOSED';
    failures = 0;
    nextAttempt = Date.now();
    constructor(options) {
        this.options = options;
    }
    getState() {
        if (this.state === 'OPEN' && Date.now() >= this.nextAttempt) {
            return 'HALF_OPEN';
        }
        return this.state;
    }
    async execute(action, fallbackValue) {
        const currentState = this.getState();
        if (currentState === 'OPEN') {
            if (fallbackValue !== undefined)
                return fallbackValue;
            throw new Error('CircuitBreaker is OPEN');
        }
        try {
            const result = await action();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            if (fallbackValue !== undefined)
                return fallbackValue;
            throw error;
        }
    }
    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    onFailure() {
        this.failures++;
        if (this.failures >= this.options.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.options.resetTimeoutMs;
        }
    }
}
/**
 * Basic Token Bucket or Time Window rate limiter per session.
 */
export class SessionRateLimiter {
    windowMs;
    maxRequests;
    // sessionId -> array of timestamps
    limits = new Map();
    constructor(windowMs, maxRequests) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }
    /**
     * Returns true if allowed, false if rate limited.
     */
    consume(sessionId) {
        const now = Date.now();
        const requests = this.limits.get(sessionId) || [];
        // Filter out old timestamps
        const validRequests = requests.filter(ts => now - ts < this.windowMs);
        if (validRequests.length >= this.maxRequests) {
            this.limits.set(sessionId, validRequests); // optimize memory
            return false;
        }
        validRequests.push(now);
        this.limits.set(sessionId, validRequests);
        return true;
    }
    cleanup(sessionId) {
        this.limits.delete(sessionId);
    }
}
//# sourceMappingURL=resilience.js.map