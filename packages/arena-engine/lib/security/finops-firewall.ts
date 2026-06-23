/**
 * lib/security/finops-firewall.ts — Enterprise Economic Shield & FinOps Firewall
 *
 * Architecture (Principal FinOps Engineer):
 * 1. Autonomous Inspection: Continously monitors and regulates Deepgram, ElevenLabs, OpenAI, and future AI providers.
 * 2. Multi-Tier Ledger: Enforces strict User & System Quotas, Cost Budgets ($ USD tracking), and Error Rate Thresholds.
 * 3. Master Redis Circuit Breaker: Automatically halts expensive external API calls when cost or error limits are tripped.
 * 4. Graceful Degradation: Implements seamless text-only fallbacks and in-memory silent audio WAVs to fully preserve User Experience.
 * 5. Enterprise Observability: Generates Sentry alerts, emits Prometheus FinOps cost/trip metrics, and creates OpenTelemetry Spans.
 */

import { Redis } from "@upstash/redis";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { Counter, Gauge } from "prom-client";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@supabase/supabase-js";
import { envServer } from "../env.server.js";
import { logger, createChildLogger } from "../logger.js";

// ── OpenTelemetry Setup ───────────────────────────────────────
const tracer = trace.getTracer("trajectoire-finops-firewall");

// ── Prometheus Performance & Cost Metrics ─────────────────────
export const finopsCostsUsdTotal = new Counter({
  name: "trajectoire_finops_costs_usd_total",
  help: "Total estimated cumulative cost in USD consumed by external paid AI providers (ElevenLabs, Deepgram, OpenAI)",
  labelNames: ["provider", "service_type"],
});

export const finopsCircuitBreakerTripsTotal = new Counter({
  name: "trajectoire_finops_circuit_breaker_trips_total",
  help: "Total number of times the FinOps Redis Circuit Breaker was automatically tripped to halt expensive API calls",
  labelNames: ["reason", "provider"],
});

export const finopsActiveBudgetGaugeUsd = new Gauge({
  name: "trajectoire_finops_active_budget_gauge_usd",
  help: "Current cumulative daily USD expenditure recorded on the active system ledger",
});

// ── Master FinOps Anchor Pricing ($ USD) ──────────────────────
const COST_PER_1K_CHARS_TTS = 0.18; // ElevenLabs Pro
const COST_PER_MIN_STT = 0.0043; // Deepgram Nova 2 General
const COST_PER_1K_INPUT_TOKENS_OPENAI = 0.00015; // GPT-4o-mini
const COST_PER_1K_OUTPUT_TOKENS_OPENAI = 0.00060; // GPT-4o-mini

const DAILY_SYSTEM_BUDGET_USD = 250.00; // Master Global Daily Circuit Breaker limit
const PROVIDER_CONSECUTIVE_ERROR_MAX = 5; // Automatic Circuit Breaker trip threshold

// ── Backing Core Dependencies Setup ───────────────────────────
const redisUrl = envServer.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = envServer.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = (redisUrl && redisToken) ? new Redis({ url: redisUrl, token: redisToken }) : null;

const Supabase = (envServer.SUPABASE_URL && envServer.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(envServer.SUPABASE_URL, envServer.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// ── Interview Session Plan DB Guard ───────────────────────────
import type { Subscription } from "../billing/subscription-types.js";

const PLAN_LIMITS: Record<string, number> = {
  FREE:   3,
  PRO:    20,
  EXPERT: Infinity,
};

export interface FirewallResult {
  allowed:  boolean;
  reason:   string | null;
  remaining: number | null;
}

export async function checkAndConsumeInterviewFinOps(
  userId: string,
  subscription: Subscription,
  supabase: SupabaseClient
): Promise<FirewallResult> {
  return await tracer.startActiveSpan("check_and_consume_interview_finops", async (span) => {
    span.setAttribute("user.id", userId);

    if (envServer.NODE_ENV === "test") return { allowed: true, reason: null, remaining: null };

    // 1. Check Redis Master Circuit Breaker
    if (redis) {
      const cbState = await redis.get("finops:circuit_breaker:open");
      if (cbState === "true") {
        logger.warn("[finops-firewall] Redis Circuit Breaker is OPEN. Halting external budget consumption.");
        span.setStatus({ code: SpanStatusCode.ERROR, message: "CIRCUIT_BREAKER_OPEN" });
        return { allowed: false, reason: "Circuit breaker is open", remaining: 0 };
      }
    }

    try {
      const limit = PLAN_LIMITS[subscription.plan] ?? PLAN_LIMITS.FREE;

      // Si abonnement PRO/EXPERT actif → vérifier quota mensuel
      if (subscription.isActive) {
        const monthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"

        const { data: usage } = await supabase
          .from("user_usage")
          .select("interviews_this_month, month_key")
          .eq("user_id", userId)
          .maybeSingle();

        const currentMonth = usage?.month_key === monthKey
          ? (usage?.interviews_this_month ?? 0)
          : 0;

        if (currentMonth >= limit) {
          logger.warn({ userId, limit }, "[finops-firewall] User reached monthly interview session quota.");
          span.setStatus({ code: SpanStatusCode.ERROR, message: "MONTHLY_QUOTA_EXCEEDED" });
          return {
            allowed:   false,
            reason:    `Quota mensuel atteint (${limit} entretiens/${subscription.plan})`,
            remaining: 0,
          };
        }

        // Consommer 1 entretien
        await supabase
          .from("user_usage")
          .upsert({
            user_id:               userId,
            interviews_this_month: currentMonth + 1,
            month_key:             monthKey,
          }, { onConflict: "user_id" });

        span.setStatus({ code: SpanStatusCode.OK });
        return {
          allowed:   true,
          reason:    null,
          remaining: limit === Infinity ? null : limit - currentMonth - 1,
        };
      }

      // Pas d'abonnement actif → vérifier les crédits
      if (subscription.credits > 0) {
        // La déduction de crédit est gérée par process_stripe_payment
        // ou un mécanisme séparé — ici on autorise simplement
        span.setStatus({ code: SpanStatusCode.OK });
        return { allowed: true, reason: null, remaining: null };
      }

      span.setStatus({ code: SpanStatusCode.ERROR, message: "NO_ACTIVE_SUBSCRIPTION_OR_CREDITS" });
      return {
        allowed:  false,
        reason:   "Aucun abonnement actif ni crédit disponible",
        remaining: 0,
      };
    } catch (err) {
      logger.error({ err, userId }, "[finops-firewall] Usage ledger validation failed, operating fail-open");
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
      return { allowed: true, reason: null, remaining: null }; // Fail open
    } finally {
      span.end();
    }
  });
}

// ── Standard Universal Circuit Breaker Execution Helper ───────
async function executeCircuitBreakerTrip(reason: string, provider: string): Promise<void> {
  if (!redis) return;

  tracer.startActiveSpan("trip_finops_circuit_breaker", async (span) => {
    span.setAttribute("trip.reason", reason);
    span.setAttribute("trip.provider", provider);

    try {
      await redis.set("finops:circuit_breaker:open", "true", { ex: 3600 }); // Trip for 1 hour

      finopsCircuitBreakerTripsTotal.labels(reason, provider).inc();

      Sentry.addBreadcrumb({
        category: "security.finops",
        message: `FinOps Master Circuit Breaker Tripped: ${reason} on ${provider}`,
        level: "fatal",
        data: { reason, provider },
      });

      Sentry.captureException(new Error(`Financial DoS Firewall Tripped Circuit Breaker: ${reason}`), {
        tags: {
          finops_event: "circuit_breaker_tripped",
          provider,
        },
      });

      logger.error(
        { event: "finops_circuit_breaker_tripped", reason, provider },
        "CRITICAL: Financial DoS firewall automatically engaged. Disabling expensive external AI providers for 1 hour."
      );
    } catch (err) {
      logger.error({ err }, "Failed to execute Circuit Breaker trip storage");
    } finally {
      span.end();
    }
  });
}

// ── Provider Error Rate Threshold Screener ────────────────────
export async function trackProviderErrorRate(provider: "elevenlabs" | "deepgram" | "openai" | string): Promise<void> {
  if (!redis || envServer.NODE_ENV === "test") return;

  try {
    const errorKey = `finops:errors:consecutive:${provider}`;
    const count = await redis.incr(errorKey);
    if (count === 1) await redis.expire(errorKey, 300); // 5 minute tracking window

    if (count >= PROVIDER_CONSECUTIVE_ERROR_MAX) {
      await executeCircuitBreakerTrip(`ERROR_RATE_THRESHOLD_EXCEEDED (${count} consecutive errors in 5m)`, provider);
    }
  } catch (err) {
    logger.warn({ err }, "Failed to track FinOps provider consecutive error rate");
  }
}

// ── Safe Teardown System & Global Cost Increment Helper ───────
async function updateGlobalCostLedger(provider: string, serviceType: string, estimatedCostUsd: number): Promise<boolean> {
  if (estimatedCostUsd <= 0 || !redis || envServer.NODE_ENV === "test") return true;

  try {
    finopsCostsUsdTotal.labels(provider, serviceType).inc(estimatedCostUsd);

    const todayStr = new Date().toISOString().slice(0, 10);
    const globalCostKey = `finops:ledger:system:${todayStr}`;
    const newTotal = await redis.incrbyfloat(globalCostKey, estimatedCostUsd);
    
    finopsActiveBudgetGaugeUsd.set(newTotal);

    if (newTotal >= DAILY_SYSTEM_BUDGET_USD) {
      await executeCircuitBreakerTrip(`DAILY_SYSTEM_BUDGET_EXCEEDED ($${newTotal.toFixed(2)}/$${DAILY_SYSTEM_BUDGET_USD})`, provider);
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

// ── ElevenLabs TTS Inspection & Quota Shield ──────────────────
export interface FinOpsTtsAssessment {
  allowed: boolean;
  mockFallback: boolean;
  estimatedCostUsd: number;
}

const TTS_HOURLY_CHAR_MAX = 25000;
const TTS_DAILY_CHAR_MAX = 100000;
const TTS_ANOMALY_SPIKE_MAX = 3500;

export async function recordAndInspectTtsUsage(userId: string, charCount: number): Promise<FinOpsTtsAssessment> {
  const estimatedCost = (charCount / 1000) * COST_PER_1K_CHARS_TTS;

  if (envServer.NODE_ENV === "test" || !redis) {
    return { allowed: true, mockFallback: false, estimatedCostUsd: estimatedCost };
  }

  try {
    const cbState = await redis.get("finops:circuit_breaker:open");
    if (cbState === "true") {
      return { allowed: false, mockFallback: true, estimatedCostUsd: 0 };
    }

    // Spike Anomaly Screening
    if (charCount > TTS_ANOMALY_SPIKE_MAX) {
      logger.warn({ userId, charCount }, "[finops-firewall] Giant TTS character synthesis anomaly intercepted. Forcing mock audio.");
      return { allowed: false, mockFallback: true, estimatedCostUsd: 0 };
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const currentHour = new Date().toISOString().slice(0, 13);

    // Hourly Quota
    const hourlyKey = `finops:quota:tts:hourly:${userId}:${currentHour}`;
    const hourlyChars = await redis.incrby(hourlyKey, charCount);
    if (hourlyChars === charCount) await redis.expire(hourlyKey, 3600);

    if (hourlyChars > TTS_HOURLY_CHAR_MAX) {
      logger.warn({ userId, hourlyChars }, "[finops-firewall] TTS Hourly character quota exceeded. Switching to mock silence fallback.");
      return { allowed: false, mockFallback: true, estimatedCostUsd: 0 };
    }

    // Daily Quota
    const dailyKey = `finops:quota:tts:daily:${userId}:${todayStr}`;
    const dailyChars = await redis.incrby(dailyKey, charCount);
    if (dailyChars === charCount) await redis.expire(dailyKey, 86400);

    if (dailyChars > TTS_DAILY_CHAR_MAX) {
      logger.warn({ userId, dailyChars }, "[finops-firewall] TTS Daily character quota exceeded. Switching to mock silence fallback.");
      return { allowed: false, mockFallback: true, estimatedCostUsd: 0 };
    }

    const budgetAllowed = await updateGlobalCostLedger("elevenlabs", "tts", estimatedCost);
    if (!budgetAllowed) return { allowed: false, mockFallback: true, estimatedCostUsd: 0 };

    return { allowed: true, mockFallback: false, estimatedCostUsd: estimatedCost };
  } catch {
    return { allowed: true, mockFallback: false, estimatedCostUsd: estimatedCost };
  }
}

// ── Deepgram STT Inspection & Quota Shield ────────────────────
export interface FinOpsSttAssessment {
  allowed: boolean;
  estimatedCostUsd: number;
}

const STT_HOURLY_BYTES_MAX = 15000000; // ~2 hours pure streaming
const STT_DAILY_BYTES_MAX = 50000000; // ~7 hours pure streaming

export async function recordAndInspectSttUsage(userId: string, audioBytes: number): Promise<FinOpsSttAssessment> {
  const approxMinutes = audioBytes / (16000 * 2 * 60);
  const estimatedCost = approxMinutes * COST_PER_MIN_STT;

  if (envServer.NODE_ENV === "test" || !redis) {
    return { allowed: true, estimatedCostUsd: estimatedCost };
  }

  try {
    const cbState = await redis.get("finops:circuit_breaker:open");
    if (cbState === "true") {
      return { allowed: false, estimatedCostUsd: 0 };
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const currentHour = new Date().toISOString().slice(0, 13);

    // Hourly Quota
    const hourlyKey = `finops:quota:stt:hourly:${userId}:${currentHour}`;
    const hourlyBytes = await redis.incrby(hourlyKey, audioBytes);
    if (hourlyBytes === audioBytes) await redis.expire(hourlyKey, 3600);

    if (hourlyBytes > STT_HOURLY_BYTES_MAX) {
      logger.warn({ userId, hourlyBytes }, "[finops-firewall] STT Hourly byte quota exceeded. Halting external ASR WebSocket connection.");
      return { allowed: false, estimatedCostUsd: 0 };
    }

    // Daily Quota
    const dailyKey = `finops:quota:stt:daily:${userId}:${todayStr}`;
    const dailyBytes = await redis.incrby(dailyKey, audioBytes);
    if (dailyBytes === audioBytes) await redis.expire(dailyKey, 86400);

    if (dailyBytes > STT_DAILY_BYTES_MAX) {
      logger.warn({ userId, dailyBytes }, "[finops-firewall] STT Daily byte quota exceeded. Halting external ASR WebSocket connection.");
      return { allowed: false, estimatedCostUsd: 0 };
    }

    const budgetAllowed = await updateGlobalCostLedger("deepgram", "stt", estimatedCost);
    if (!budgetAllowed) return { allowed: false, estimatedCostUsd: 0 };

    return { allowed: true, estimatedCostUsd: estimatedCost };
  } catch {
    return { allowed: true, estimatedCostUsd: estimatedCost };
  }
}

// ── OpenAI & Core LLM Providers FinOps Screener ───────────────
export interface FinOpsLlmAssessment {
  allowed: boolean;
  estimatedCostUsd: number;
}

const LLM_HOURLY_INPUT_TOKENS_MAX = 200000;
const LLM_HOURLY_OUTPUT_TOKENS_MAX = 50000;

export async function recordAndInspectLlmUsage(
  userId: string,
  provider: "openai" | "mistral" | string,
  inputTokens: number,
  outputTokens: number
): Promise<FinOpsLlmAssessment> {
  const estimatedCost = (inputTokens / 1000) * COST_PER_1K_INPUT_TOKENS_OPENAI +
                        (outputTokens / 1000) * COST_PER_1K_OUTPUT_TOKENS_OPENAI;

  if (envServer.NODE_ENV === "test" || !redis) {
    return { allowed: true, estimatedCostUsd: estimatedCost };
  }

  try {
    const cbState = await redis.get("finops:circuit_breaker:open");
    if (cbState === "true") {
      return { allowed: false, estimatedCostUsd: 0 };
    }

    const currentHour = new Date().toISOString().slice(0, 13);

    const inputKey = `finops:quota:llm:input:${userId}:${currentHour}`;
    const hourlyInput = await redis.incrby(inputKey, inputTokens);
    if (hourlyInput === inputTokens) await redis.expire(inputKey, 3600);

    if (hourlyInput > LLM_HOURLY_INPUT_TOKENS_MAX) {
      logger.warn({ userId, hourlyInput }, "[finops-firewall] LLM Hourly input token quota exceeded.");
      return { allowed: false, estimatedCostUsd: 0 };
    }

    const outputKey = `finops:quota:llm:output:${userId}:${currentHour}`;
    const hourlyOutput = await redis.incrby(outputKey, outputTokens);
    if (hourlyOutput === outputTokens) await redis.expire(outputKey, 3600);

    if (hourlyOutput > LLM_HOURLY_OUTPUT_TOKENS_MAX) {
      logger.warn({ userId, hourlyOutput }, "[finops-firewall] LLM Hourly output token quota exceeded.");
      return { allowed: false, estimatedCostUsd: 0 };
    }

    const budgetAllowed = await updateGlobalCostLedger(provider, "llm", estimatedCost);
    if (!budgetAllowed) return { allowed: false, estimatedCostUsd: 0 };

    return { allowed: true, estimatedCostUsd: estimatedCost };
  } catch {
    return { allowed: true, estimatedCostUsd: estimatedCost };
  }
}
