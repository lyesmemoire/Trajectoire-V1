/**
 * lib/security/ws-message-throttler.ts — Enterprise WebSocket Message Throttler
 *
 * Architecture (Principal SRE / Distributed Real-Time Systems):
 * 1. Pure In-Memory Token Bucket per active session/socket (0 Redis network overhead).
 * 2. Specifically protects against interrupt flooding, PCM audio flooding, control message flooding, and Event Loop Starvation.
 * 3. Enforces a refill rate of 12 messages/second for JSON control frames (with a burst capacity of 24).
 * 4. Enforces a refill rate of 50 messages/second for PCM audio streaming (with a burst capacity of 100).
 * 5. In case of overflow: closes the socket instantly with standard WS code 1008 Policy Violation.
 * 6. Enterprise Observability: Generates Sentry security events, emits Prometheus metrics, logs structured JSON (Pino), and creates OpenTelemetry Spans.
 * 7. 100% Real-Time Purity: Full preservation of ultra-low latency conversational streaming.
 */

import { trace, SpanStatusCode } from "@opentelemetry/api";
import { Counter } from "prom-client";
import * as Sentry from "@sentry/nextjs";
import { logger, createChildLogger } from "../logger.js";

// ── OpenTelemetry Setup ───────────────────────────────────────
const tracer = trace.getTracer("trajectoire-ws-message-throttler");

// ── Prometheus Metrics Setup ──────────────────────────────────
export const wsMessageFloodingRejectedTotal = new Counter({
  name: "trajectoire_ws_message_flooding_rejected_total",
  help: "Total number of active WebSocket connections instantly terminated for message flooding attacks (DoS defense)",
  labelNames: ["endpoint", "frame_type"],
});

export const wsMessageTokensConsumedTotal = new Counter({
  name: "trajectoire_ws_message_tokens_consumed_total",
  help: "Total number of WebSocket message tokens successfully consumed across all active real-time sessions",
  labelNames: ["endpoint", "frame_type"],
});

// ── Master Throttler Config ───────────────────────────────────
export interface ThrottleContext {
  endpoint: "/api/voice" | "/api/signal" | "/ws" | "/v1/runtime";
  sessionId?: string;
  userId?: string;
  closeSocket: (code: number, reason: string) => void;
}

export class WsMessageThrottler {
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(
    private readonly capacity = 24, // Allow temporary burst of 24 frames
    private readonly refillRatePerSec = 12, // Refill rate: 12 messages/sec
    private readonly context?: ThrottleContext
  ) {
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Consumes 1 message token.
   * Returns true if allowed, false if rate is exceeded (flooding attack detected).
   * Automatically executes Sentry events, Otel spans, Prometheus metrics, and socket teardown if context is provided.
   */
  consume(messageType: "control" | "pcm" = "control"): boolean {
    const now = Date.now();
    const elapsedTimeSec = (now - this.lastRefillTimestamp) / 1000;

    if (elapsedTimeSec > 0) {
      this.tokens = Math.min(
        this.capacity,
        this.tokens + elapsedTimeSec * this.refillRatePerSec
      );
      this.lastRefillTimestamp = now;
    }

    if (this.tokens >= 1) {
      this.tokens -= 1;
      if (this.context) {
        wsMessageTokensConsumedTotal.labels(this.context.endpoint, messageType).inc();
      }
      return true;
    }

    // ── Flooding Attack Detected Mitigation ──
    if (this.context) {
      this.executeMitigation(this.context, messageType);
    }

    return false;
  }

  private executeMitigation(ctx: ThrottleContext, messageType: string): void {
    tracer.startActiveSpan("ws_message_flooding_mitigation", (span) => {
      span.setAttribute("endpoint", ctx.endpoint);
      if (ctx.sessionId) span.setAttribute("session.id", ctx.sessionId);
      if (ctx.userId) span.setAttribute("user.id", ctx.userId);
      span.setAttribute("attack.frame_type", messageType);

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `MESSAGE_FLOODING_ATTACK_MITIGATED: Refill rate exceeded`,
      });

      // 1. Prometheus Metric Increment
      wsMessageFloodingRejectedTotal.labels(ctx.endpoint, messageType).inc();

      // 2. Sentry Event & Breadcrumb
      Sentry.addBreadcrumb({
        category: "security.dos",
        message: `WebSocket Message Flooding Attack blocked on ${ctx.endpoint}`,
        level: "fatal",
        data: { sessionId: ctx.sessionId, userId: ctx.userId, frameType: messageType },
      });

      Sentry.captureException(new Error(`WebSocket Message Flooding Mitigated on ${ctx.endpoint}`), {
        tags: {
          security_event: "ws_message_flooding",
          endpoint: ctx.endpoint,
          frame_type: messageType,
        },
        extra: { ...ctx, messageType },
      });

      // 3. Structured Pino JSON Logger
      const log = createChildLogger({
        endpoint: ctx.endpoint,
        sessionId: ctx.sessionId,
        userId: ctx.userId,
        component: "ws-message-throttler",
      });

      log.error(
        { event: "ws_message_flooding_blocked", frameType: messageType },
        "CRITICAL: WebSocket message rate limit exceeded (Flooding Attack). Immediate socket teardown initiated (Code 1008)."
      );

      // 4. Teardown WebSocket with Code 1008 Policy Violation
      ctx.closeSocket(1008, "Policy Violation: WebSocket Message Flooding Attack Detected");

      span.end();
    });
  }
}

/**
 * Dual throttler configured specifically for mixed signaling / PCM audio sockets.
 * Enforces 12 frames/sec for JSON control messages, and 50 frames/sec for PCM audio streaming.
 */
export class SignalingMessageThrottler {
  private controlThrottler: WsMessageThrottler;
  private pcmThrottler: WsMessageThrottler;

  constructor(context?: ThrottleContext) {
    this.controlThrottler = new WsMessageThrottler(24, 12, context);
    this.pcmThrottler = new WsMessageThrottler(100, 50, context);
  }

  consume(messageType: "control" | "pcm" = "control"): boolean {
    if (messageType === "pcm") {
      return this.pcmThrottler.consume("pcm");
    }
    return this.controlThrottler.consume("control");
  }
}
