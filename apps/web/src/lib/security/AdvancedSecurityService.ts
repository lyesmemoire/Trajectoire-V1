/**
 * Advanced Security Service
 * Provides rate limiting, bot detection, security headers, and advanced protection
 */

import { getCache } from "@/lib/cache/MemoryCache";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface SecurityHeaders {
  "X-Content-Type-Options": string;
  "X-Frame-Options": string;
  "X-XSS-Protection": string;
  "Strict-Transport-Security": string;
  "Content-Security-Policy": string;
  "Referrer-Policy": string;
  "Permissions-Policy": string;
}

export class AdvancedSecurityService {
  private cache = getCache();
  private static instance: AdvancedSecurityService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AdvancedSecurityService {
    if (!AdvancedSecurityService.instance) {
      AdvancedSecurityService.instance = new AdvancedSecurityService();
    }
    return AdvancedSecurityService.instance;
  }

  /**
   * Rate limiting using sliding window algorithm
   */
  async rateLimit(
    identifier: string,
    limit: number = 100,
    window: number = 60000 // 1 minute
  ): Promise<RateLimitResult> {
    const cacheKey = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - window;

    // Get existing requests
    const requests: number[] = this.cache.get<number[]>(cacheKey) || [];

    // Filter requests within the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (validRequests.length >= limit) {
      return {
        allowed: false,
        limit,
        remaining: 0,
        reset: validRequests[0] + window,
      };
    }

    // Add current request
    validRequests.push(now);
    this.cache.set(cacheKey, validRequests, window);

    return {
      allowed: true,
      limit,
      remaining: limit - validRequests.length,
      reset: validRequests[0] + window,
    };
  }

  /**
   * Slow down response for rate-limited requests
   */
  async slowDown(identifier: string, delay: number = 1000): Promise<void> {
    const cacheKey = `slowdown:${identifier}`;
    const attempts = this.cache.get<number>(cacheKey) || 0;

    // Exponential backoff
    const actualDelay = delay * Math.pow(2, attempts);
    await new Promise(resolve => setTimeout(resolve, actualDelay));

    // Increment attempts
    this.cache.set(cacheKey, attempts + 1, 60000);
  }

  /**
   * Simple bot detection based on user agent patterns
   */
  detectBot(userAgent: string): boolean {
    if (!userAgent) return true; // No user agent = suspicious

    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /headless/i,
      /phantom/i,
      /selenium/i,
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Brute force protection for login attempts
   */
  async checkBruteForce(identifier: string, maxAttempts: number = 5): Promise<boolean> {
    const cacheKey = `bruteforce:${identifier}`;
    const attempts = this.cache.get<number>(cacheKey) || 0;

    if (attempts >= maxAttempts) {
      return false; // Block
    }

    // Increment attempts
    this.cache.set(cacheKey, attempts + 1, 300000); // 5 minutes
    return true; // Allow
  }

  /**
   * Reset brute force counter (on successful login)
   */
  async resetBruteForce(identifier: string): Promise<void> {
    const cacheKey = `bruteforce:${identifier}`;
    this.cache.delete(cacheKey);
  }

  /**
   * Validate origin header
   */
  validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false;
    return allowedOrigins.some(allowed => {
      if (allowed === "*") return true;
      return origin === allowed || origin.startsWith(allowed);
    });
  }

  /**
   * Validate referer header
   */
  validateReferer(referer: string, allowedOrigins: string[]): boolean {
    if (!referer) return true; // Referer is optional
    return this.validateOrigin(referer, allowedOrigins);
  }

  /**
   * Validate host header
   */
  validateHost(host: string, allowedHosts: string[]): boolean {
    if (!host) return false;
    return allowedHosts.includes(host);
  }

  /**
   * Generate security headers
   */
  getSecurityHeaders(): SecurityHeaders {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": this.getCSP(),
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": this.getPermissionsPolicy(),
    };
  }

  /**
   * Generate Content Security Policy
   */
  private getCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
    ].join("; ");
  }

  /**
   * Generate Permissions Policy
   */
  private getPermissionsPolicy(): string {
    return [
      "geolocation=()",
      "microphone=()",
      "camera=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
    ].join(", ");
  }

  /**
   * Validate URL for SSRF protection
   */
  validateSSRF(url: string): boolean {
    try {
      const parsed = new URL(url);

      // Block internal IPs
      const hostname = parsed.hostname;
      const blockedHosts = [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "::1",
        "[::1]",
      ];

      if (blockedHosts.includes(hostname)) {
        return false;
      }

      // Block private IP ranges
      if (
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("172.16.") ||
        hostname.startsWith("172.31.")
      ) {
        return false;
      }

      // Only allow http and https
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize headers to prevent header injection
   */
  sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
      // Remove newlines and carriage returns to prevent header injection
      const sanitizedKey = key.replace(/[\r\n]/g, "");
      const sanitizedValue = value.replace(/[\r\n]/g, "");
      sanitized[sanitizedKey] = sanitizedValue;
    }

    return sanitized;
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  /**
   * IP reputation check (placeholder - would integrate with external service)
   */
  async checkIPReputation(ip: string): Promise<boolean> {
    // Placeholder for IP reputation check
    // In production, integrate with services like:
    // - AbuseIPDB
    // - IPQualityScore
    // - MaxMind
    return true;
  }
}

// Export singleton instance
export const securityService = AdvancedSecurityService.getInstance();
