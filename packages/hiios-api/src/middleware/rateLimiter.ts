/**
 * HIIOS v4 Enterprise — Rate Limiter
 * Basé sur Redis (simulé ici en mémoire pour les tests)
 */

import type { Context, Next } from "hono";
import { createMiddleware }   from "hono/factory";

interface RateLimitConfig {
  max:    number;
  window: "1m" | "15m" | "1h" | "24h";
}

const windowMs: Record<string, number> = {
  "1m":  60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h":  60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
};

// En moi mémoire pour les tests — remplacer par Redis en production
const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimiter(config: RateLimitConfig) {
  return createMiddleware(async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      await next();
      return;
    }

    const key     = `ratelimit:${user.id}:${c.req.path}`;
    const now     = Date.now();
    const window  = windowMs[config.window];
    const current = store.get(key);

    if (!current || current.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + window });
      c.header("X-RateLimit-Limit",     String(config.max));
      c.header("X-RateLimit-Remaining", String(config.max - 1));
      c.header("X-RateLimit-Reset",     String(Math.ceil((now + window) / 1000)));
      await next();
      return;
    }

    if (current.count >= config.max) {
      c.header("X-RateLimit-Limit",     String(config.max));
      c.header("X-RateLimit-Remaining", "0");
      c.header("X-RateLimit-Reset",     String(Math.ceil(current.resetAt / 1000)));
      c.header("Retry-After",           String(Math.ceil((current.resetAt - now) / 1000)));
      return c.json({ error: "Rate limit exceeded" }, 429);
    }

    current.count++;
    c.header("X-RateLimit-Limit",     String(config.max));
    c.header("X-RateLimit-Remaining", String(config.max - current.count));
    c.header("X-RateLimit-Reset",     String(Math.ceil(current.resetAt / 1000)));

    await next();
  });
}
