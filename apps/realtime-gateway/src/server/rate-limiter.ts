import { envServer } from "../../../../lib/env.server.js";
/**
 * Rate Limiter & Session Guards — Upstash Redis
 * 
 * Provides:
 * 1. Multi-tier HTTP rate limiting (burst / hourly / daily)
 * 2. WebSocket session uniqueness (per userId + per IP)
 * 3. Daily WebSocket quota
 * 4. Alerting via Slack webhook
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ── Redis Client ──────────────────────────────────────────────
const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL,
  token: envServer.UPSTASH_REDIS_REST_TOKEN,
});

// ── HTTP Rate Limiters (3 tiers) ──────────────────────────────
export const burstLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  prefix: "rl:burst",
});

export const hourlyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "rl:hourly",
});

export const dailyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"),
  prefix: "rl:daily",
});

/**
 * Check all 3 rate limit tiers for a given IP.
 * Returns { allowed: boolean, retryAfter?: number }
 */
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const burst = await burstLimiter.limit(ip);
  if (!burst.success) return { allowed: false, retryAfter: Math.ceil(burst.reset - Date.now() / 1000) };

  const hourly = await hourlyLimiter.limit(ip);
  if (!hourly.success) return { allowed: false, retryAfter: Math.ceil(hourly.reset - Date.now() / 1000) };

  const daily = await dailyLimiter.limit(ip);
  if (!daily.success) return { allowed: false, retryAfter: Math.ceil(daily.reset - Date.now() / 1000) };

  return { allowed: true };
}

// ── WebSocket Session Guards ──────────────────────────────────

const WS_SESSION_TTL = 45 * 60; // 45 minutes TTL (auto-cleanup on crash)
const WS_DAILY_MAX = 2;

/**
 * Acquire a WebSocket session lock for userId + IP.
 * Returns true if the session is allowed, false if blocked.
 */
export async function acquireWsSession(userId: string, ip: string): Promise<boolean> {
  // 1. Check if user already has an active session
  const userKey = `active_ws:user:${userId}`;
  const existingUser = await redis.get(userKey);
  if (existingUser) return false;

  // 2. Check if IP already has an active session
  const ipKey = `active_ws:ip:${ip}`;
  const existingIp = await redis.get(ipKey);
  if (existingIp) return false;

  // 3. Check daily quota
  const dailyKey = `daily_ws:${userId}`;
  const dailyCount = await redis.get<number>(dailyKey);
  if (dailyCount !== null && dailyCount >= WS_DAILY_MAX) return false;

  // 4. Acquire locks
  await redis.set(userKey, "1", { ex: WS_SESSION_TTL });
  await redis.set(ipKey, "1", { ex: WS_SESSION_TTL });

  // 5. Increment daily counter
  const newCount = await redis.incr(dailyKey);
  if (newCount === 1) {
    await redis.expire(dailyKey, 86400); // 24h TTL
  }

  return true;
}

/**
 * Release the WebSocket session lock when the session ends.
 */
export async function releaseWsSession(userId: string, ip: string): Promise<void> {
  await redis.del(`active_ws:user:${userId}`);
  await redis.del(`active_ws:ip:${ip}`);
}

// ── Alerting (Slack Webhook) ──────────────────────────────────

interface AlertPayload {
  metric: string;
  value: number | string;
  threshold: number | string;
  engineVersion: string;
  window: string;
}

/**
 * Send a structured alert to Slack (and log to console as fallback).
 * Never throws — alerting must not crash the server.
 */
export async function triggerAlert(payload: AlertPayload): Promise<void> {
  const message = `[TRAJECTOIRE ALERT]\n\nMetric: ${payload.metric}\nValue: ${payload.value}\nThreshold: ${payload.threshold}\nEngine: ${payload.engineVersion}\nWindow: ${payload.window}`;

  // Always log to console
  console.warn(message);

  // Slack webhook (if configured)
  const slackUrl = envServer.SLACK_ALERT_WEBHOOK_URL;
  if (slackUrl) {
    try {
      await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          username: "Trajectoire Engine",
          icon_emoji: ":warning:",
        }),
      });
    } catch (error) {
      console.error("Slack alert failed:", err);
    }
  }

  // Email fallback (if configured, via simple SMTP or Resend)
  const emailAlertTo = envServer.ALERT_EMAIL_TO;
  if (emailAlertTo && envServer.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${envServer.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "alerts@trajectoire.app",
          to: emailAlertTo,
          subject: `[TRAJECTOIRE ALERT] ${payload.metric}`,
          text: message,
        }),
      });
    } catch (error) {
      console.error("Email alert failed:", err);
    }
  }
}

// ── LLM Consecutive Error Tracker ─────────────────────────────

const LLM_ERROR_THRESHOLD = 3;

/**
 * Track consecutive LLM errors for a session.
 * Returns true if threshold is reached (session should be killed).
 */
export async function trackLlmError(sessionId: string): Promise<boolean> {
  const key = `llm_errors:${sessionId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WS_SESSION_TTL);
  }
  return count >= LLM_ERROR_THRESHOLD;
}

/**
 * Reset LLM error counter after a successful call.
 */
export async function resetLlmErrors(sessionId: string): Promise<void> {
  await redis.del(`llm_errors:${sessionId}`);
}
