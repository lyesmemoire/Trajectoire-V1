/**
 * IRateLimiter Interface
 * Defines the contract for rate limiting implementations
 * Following Dependency Inversion Principle
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
}

export interface IRateLimiter {
  /**
   * Check if a request is allowed based on rate limit
   * @param identifier - Unique identifier (user ID, IP, etc.)
   * @param limit - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns Rate limit result
   */
  checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<RateLimitResult>;

  /**
   * Reset rate limit for an identifier
   * @param identifier - Unique identifier
   */
  reset(identifier: string): Promise<void>;

  /**
   * Clean up expired rate limit entries
   */
  cleanup(): Promise<void>;
}
