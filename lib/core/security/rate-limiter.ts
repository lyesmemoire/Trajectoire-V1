interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitStore> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  private getIdentifier(ip: string, userAgent?: string): string {
    // Use IP + user agent hash as identifier
    const identifier = userAgent ? `${ip}:${userAgent}` : ip;
    return Buffer.from(identifier).toString('base64').substring(0, 32);
  }

  async checkLimit(ip: string, userAgent?: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const identifier = this.getIdentifier(ip, userAgent);
    const now = Date.now();
    const existing = this.store.get(identifier);

    if (!existing || existing.resetTime < now) {
      // New window
      const resetTime = now + this.config.windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.config.maxRequests - 1, resetTime };
    }

    // Existing window
    if (existing.count >= this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: existing.resetTime };
    }

    existing.count++;
    return { allowed: true, remaining: this.config.maxRequests - existing.count, resetTime: existing.resetTime };
  }

  reset(ip: string, userAgent?: string): void {
    const identifier = this.getIdentifier(ip, userAgent);
    this.store.delete(identifier);
  }
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
});

export const registerRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 registrations per hour
});

export const passwordResetRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 password resets per hour
});

export const emailVerificationRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 verification emails per hour
});
