/**
 * lib/observability/telemetry-hub.ts — Enterprise Observability & SRE Telemetry Hub
 *
 * Architecture (Principal Observability Engineer):
 * 1. Unifies Telemetry across 6 macro-layers: Ingestion Shield, Message Throttlers, FinOps Firewall, DB Pool Optimizer, Runtime P0, and AI Firewall.
 * 2. OpenTelemetry Integration: Manages Spans, Distributed Traces, p95 execution latency histograms, and precise error recording.
 * 3. Enriched Sentry Context: Fully surfaces userId, sessionId, provider pricing, remaining quotas, and Redis Circuit Breaker status.
 * 4. Dedicated Prometheus Metrics: Universal counters, gauges, and histograms for ws.connections, ws.rate_limit_hits, ws.message_flood, finops.cost, db.pool_usage, and runtime.events.
 * 5. Production SLO Specification Registry: Prepares automated Error Budget burn alerting and exact Service Level Objectives.
 */

import { trace, SpanStatusCode, type Tracer } from "@opentelemetry/api";
import { Counter, Gauge, Histogram } from "prom-client";
import * as Sentry from "@sentry/nextjs";
import { logger, createChildLogger } from "../logger.js";
import { envServer } from "../env.server.js";

// ── Master OpenTelemetry Tracer Setup ─────────────────────────
export const telemetryTracer: Tracer = trace.getTracer("trajectoire-enterprise-observability-hub");

// ── Dedicated Production Prometheus Metrics ───────────────────

export const wsConnectionsMetric = new Gauge({
  name: "trajectoire_ws_connections",
  help: "Active real-time WebSocket conversational and WebRTC signaling connections currently established",
  labelNames: ["endpoint"],
});

export const wsRateLimitHitsMetric = new Counter({
  name: "trajectoire_ws_rate_limit_hits",
  help: "Total number of WebSocket Upgrade requests rejected by Upstash Redis sliding window algorithms (HTTP 429 / Ingestion Shield)",
  labelNames: ["endpoint", "limit_tier"],
});

export const wsMessageFloodMetric = new Counter({
  name: "trajectoire_ws_message_flood",
  help: "Total number of WebSocket real-time connections instantly terminated for Message Flooding / Token Bucket rate breaches (Code 1008)",
  labelNames: ["endpoint", "frame_type"],
});

export const finopsCostMetric = new Counter({
  name: "trajectoire_finops_cost",
  help: "Cumulative estimated financial cost consumed in USD by paid external APIs (ElevenLabs TTS, Deepgram STT, OpenAI LLMs)",
  labelNames: ["provider", "service_type"],
});

export const dbPoolUsageMetric = new Gauge({
  name: "trajectoire_db_pool_usage",
  help: "Current active database connection pooling instances and keep-alive fetch connections established to Supavisor (Port 6543)",
  labelNames: ["client_type"],
});

export const runtimeEventsMetric = new Counter({
  name: "trajectoire_runtime_events",
  help: "Total number of highly secured distributed execution commands verified, signed, and routed on /v1/runtime/:sessionId",
  labelNames: ["event_type", "tenant_did"],
});

export const p95ExecutionLatencySummary = new Histogram({
  name: "trajectoire_p95_execution_latency_ms",
  help: "Universal execution latency histogram explicitly structured to compute high-precision p95 percentiles across core layers in milliseconds",
  buckets: [2, 5, 10, 25, 50, 100, 150, 250, 500, 1000],
  labelNames: ["macro_layer", "operation_name"],
});

// ── Observability Context Definition ──────────────────────────

export type MacroLayerComponent =
  | "ws-ingestion-shield"
  | "ws-message-throttler"
  | "finops-firewall"
  | "db-pool-optimizer"
  | "runtime-p0"
  | "ai-firewall";

export interface EnrichedObservabilityContext {
  userId?: string;
  sessionId?: string;
  provider?: "elevenlabs" | "deepgram" | "openai" | "mistral" | string;
  costUsd?: number;
  quotaLimit?: number;
  quotaUsed?: number;
  circuitBreakerState?: "CLOSED" | "OPEN" | "HALF_OPEN";
  component: MacroLayerComponent;
  durationMs?: number;
  [key: string]: unknown;
}

// ── Universal Enriched Telemetry Caller ───────────────────────

/**
 * Universal Observability Interceptor & SRE Telemetry Router.
 *
 * Simultaneously dispatches an incident or execution checkpoint to:
 * 1. Active OpenTelemetry Distributed Trace Spans.
 * 2. Enriched Sentry Master Context & Breadcrumbs.
 * 3. Highly calibrated Prometheus Metrics.
 * 4. Structured Pino JSON Loggers.
 */
export async function recordEnrichedTelemetry(
  operationName: string,
  context: EnrichedObservabilityContext,
  error?: unknown
): Promise<void> {
  const t0 = performance.now();

  return await telemetryTracer.startActiveSpan(`otel_telemetry_${context.component}_${operationName}`, async (span) => {
    // 1. Enrich OpenTelemetry Span Attributes
    span.setAttribute("sre.component", context.component);
    span.setAttribute("sre.operation", operationName);
    if (context.userId) span.setAttribute("user.id", context.userId);
    if (context.sessionId) span.setAttribute("session.id", context.sessionId);
    if (context.provider) span.setAttribute("ai.provider", context.provider);
    if (context.costUsd != null) span.setAttribute("finops.cost_usd", context.costUsd);
    if (context.circuitBreakerState) span.setAttribute("finops.cb_state", context.circuitBreakerState);
    if (context.durationMs != null) {
      span.setAttribute("execution.latency_ms", context.durationMs);
      p95ExecutionLatencySummary.labels(context.component, operationName).observe(context.durationMs);
    }

    // 2. Dispatch to Enriched Sentry Session & Scope
    Sentry.setContext("sre_telemetry_scope", {
      userId: context.userId || "anonymous",
      sessionId: context.sessionId || "none",
      provider: context.provider || "N/A",
      costUsd: context.costUsd ?? 0,
      quotaLimit: context.quotaLimit ?? Infinity,
      quotaUsed: context.quotaUsed ?? 0,
      circuitBreakerState: context.circuitBreakerState || "CLOSED",
      component: context.component,
    });

    const breadcrumbLevel = error ? "fatal" : (context.circuitBreakerState === "OPEN" ? "warning" : "info");
    Sentry.addBreadcrumb({
      category: `observability.${context.component}`,
      message: `[Telemetry] ${operationName}: provider=${context.provider || "N/A"}, cost=$${(context.costUsd ?? 0).toFixed(4)}, cbState=${context.circuitBreakerState || "CLOSED"}`,
      level: breadcrumbLevel,
      data: context,
    });

    if (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      Sentry.captureException(error, {
        tags: {
          sre_component: context.component,
          operation: operationName,
          ai_provider: context.provider || "unknown",
          cb_state: context.circuitBreakerState || "CLOSED",
        },
        extra: context,
      });
    } else {
      span.setStatus({ code: SpanStatusCode.OK });
    }

    // 3. Dispatch to Specific Prometheus Operational Metrics
    if (context.component === "ws-ingestion-shield" && operationName.includes("hit")) {
      wsRateLimitHitsMetric.labels("/api/voice", "burst").inc();
    } else if (context.component === "ws-message-throttler" && operationName.includes("flood")) {
      wsMessageFloodMetric.labels("/api/voice", "control").inc();
    } else if (context.component === "finops-firewall" && context.costUsd != null) {
      finopsCostMetric.labels(context.provider || "unknown", operationName).inc(context.costUsd);
    }

    // 4. Structured JSON Child Logging
    const childLog = createChildLogger({
      userId: context.userId,
      sessionId: context.sessionId,
      macroLayer: context.component,
      cbState: context.circuitBreakerState,
    });

    const logMessage = `[telemetry-hub] Successfully recorded distributed execution telemetry for ${operationName} (${(performance.now() - t0).toFixed(2)}ms)`;
    if (error) {
      childLog.error({ err: error, context }, logMessage);
    } else if (context.circuitBreakerState === "OPEN") {
      childLog.warn({ context }, logMessage);
    } else {
      childLog.info({ context }, logMessage);
    }

    span.end();
  });
}

// ── Production SLO (Service Level Objective) Specification Framework ──

export interface EnterpriseSloTarget {
  sloId: string;
  macroLayer: MacroLayerComponent;
  targetObjectivePercent: number; // e.g. 99.9%
  p95LatencyObjectiveMs?: number; // e.g. < 150ms
  errorBudgetBurnAlertThresholdPercent: number; // e.g. alert if 5% error budget consumed in 1 hour
}

/**
 * Highly Formalized Enterprise Production SLO Specification Template.
 * Ready for automated Prometheus alert rules generation.
 */
export const ENTERPRISE_PRODUCTION_SLO_DEFINITIONS: EnterpriseSloTarget[] = [
  {
    sloId: "slo_ws_availability",
    macroLayer: "ws-ingestion-shield",
    targetObjectivePercent: 99.95,
    p95LatencyObjectiveMs: 25.0, // Instantly screen Edge handshakes in <25ms
    errorBudgetBurnAlertThresholdPercent: 5.0,
  },
  {
    sloId: "slo_ws_anti_flooding",
    macroLayer: "ws-message-throttler",
    targetObjectivePercent: 99.99,
    p95LatencyObjectiveMs: 2.0, // In-memory token evaluation in <2ms
    errorBudgetBurnAlertThresholdPercent: 2.0,
  },
  {
    sloId: "slo_finops_budget_adherence",
    macroLayer: "finops-firewall",
    targetObjectivePercent: 99.99,
    p95LatencyObjectiveMs: 50.0, // Asynchronous Redis quota assessment
    errorBudgetBurnAlertThresholdPercent: 1.0, // Critical alert if FinOps threshold is breached
  },
  {
    sloId: "slo_database_reliability",
    macroLayer: "db-pool-optimizer",
    targetObjectivePercent: 99.90,
    p95LatencyObjectiveMs: 150.0, // Resilient DB queries multiplexed on Supavisor 6543
    errorBudgetBurnAlertThresholdPercent: 5.0,
  },
  {
    sloId: "slo_distributed_bus_p0",
    macroLayer: "runtime-p0",
    targetObjectivePercent: 99.99,
    p95LatencyObjectiveMs: 10.0, // Ultra-low latency Zod and HMAC validation
    errorBudgetBurnAlertThresholdPercent: 2.0,
  },
  {
    sloId: "slo_ai_cognitive_safety",
    macroLayer: "ai-firewall",
    targetObjectivePercent: 99.99,
    p95LatencyObjectiveMs: 800.0, // XML Structured LLM outputs
    errorBudgetBurnAlertThresholdPercent: 2.0,
  },
];
