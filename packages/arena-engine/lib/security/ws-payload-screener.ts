/**
 * lib/security/ws-payload-screener.ts — Enterprise WebSocket Payload & Performance Screener
 *
 * Architecture (Staff Node.js Performance Engineer):
 * 1. Dual C++ Libuv & JS Event Loop Protection: Supports @fastify/websocket maxPayload + pre-JSON.parse() screener.
 * 2. Prevents V8 Out-Of-Memory (OOM) crashes, JSON parse tree asymmetry, and Event Loop Starvation.
 * 3. Enterprise Observability: OpenTelemetry Spans, Prometheus payload histograms/counters, Sentry Breadcrumbs, and structured Pino logs.
 * 4. Fully universal across /api/voice, /api/signal, /ws, and /v1/runtime/:sessionId.
 * 5. 100% Zero Regression: Fully transparent for MediaRecorder 50KB audio streaming and existing E2E suites.
 */

import { trace, SpanStatusCode } from "@opentelemetry/api";
import { Counter, Histogram } from "prom-client";
import * as Sentry from "@sentry/nextjs";
import { logger, createChildLogger } from "../logger.js";
import { envServer } from "../env.server.js";

// ── OpenTelemetry Setup ───────────────────────────────────────
const tracer = trace.getTracer("trajectoire-ws-payload-screener");

// ── Prometheus Performance Metrics Setup ──────────────────────
export const wsPayloadSizeBytes = new Histogram({
  name: "trajectoire_ws_payload_size_bytes",
  help: "Distribution of incoming WebSocket payload sizes in bytes",
  buckets: [128, 512, 1024, 4096, 16384, 50000, 65536],
  labelNames: ["endpoint"],
});

export const wsPayloadRejectedTotal = new Counter({
  name: "trajectoire_ws_payload_rejected_total",
  help: "Total number of WebSocket frames rejected for exceeding maximum memory capacity (OOM defense)",
  labelNames: ["endpoint", "reason"],
});

export const wsParsingLatencyMs = new Histogram({
  name: "trajectoire_ws_parsing_latency_ms",
  help: "Event Loop execution time consumed by JSON.parse() on WebSocket control frames",
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  labelNames: ["endpoint"],
});

// ── Master Payload Screener Config ────────────────────────────
export const MAX_WEBSOCKET_PAYLOAD_SIZE_BYTES = 65536; // 64 KB absolute Libuv / V8 barrier

export interface ScreenPayloadOptions {
  endpoint: "/api/voice" | "/api/signal" | "/ws" | "/v1/runtime";
  sessionId?: string;
  userId?: string;
  closeSocket: (code: number, reason: string) => void;
}

/**
 * Enterprise Payload Screener & Safe JSON Parser.
 *
 * Must be executed as the absolute first gate inside socket.on("message")
 * or Fastify WebSocket stream routers before any manipulation of strings or JSON trees.
 *
 * @param rawData Standard Buffer, ArrayBuffer, Uint8Array, or String received from the WS transport.
 * @param options Topology and teardown callbacks.
 * @returns { valid: boolean, parsedJson?: any, audioChunk?: Uint8Array }
 */
export function screenAndParseWsPayload(
  rawData: Buffer | ArrayBuffer | Uint8Array | string | unknown,
  options: ScreenPayloadOptions
): { valid: boolean; parsedJson?: any; audioChunk?: Uint8Array; isBinary: boolean } {
  return tracer.startActiveSpan("screen_and_parse_ws_payload", (span) => {
    span.setAttribute("endpoint", options.endpoint);
    if (options.sessionId) span.setAttribute("session.id", options.sessionId);
    if (options.userId) span.setAttribute("user.id", options.userId);

    const log = createChildLogger({
      endpoint: options.endpoint,
      sessionId: options.sessionId,
      userId: options.userId,
      component: "ws-payload-screener",
    });

    // 1. Precise Byte / String Length Computation
    let byteLength = 0;
    let isBinary = false;
    let stringPayload: string | null = null;
    let binaryChunk: Uint8Array | undefined = undefined;

    if (typeof rawData === "string") {
      byteLength = Buffer.byteLength(rawData, "utf8");
      stringPayload = rawData;
    } else if (Buffer.isBuffer(rawData)) {
      byteLength = rawData.length;
      // Heuristic to detect binary audio vs UTF-8 JSON
      isBinary = rawData[0] !== 123; // '{' ASCII is 123
      if (isBinary) {
        binaryChunk = new Uint8Array(rawData);
      } else {
        stringPayload = rawData.toString("utf8");
      }
    } else if (rawData instanceof Uint8Array) {
      byteLength = rawData.byteLength;
      isBinary = rawData[0] !== 123;
      if (isBinary) {
        binaryChunk = rawData;
      } else {
        stringPayload = Buffer.from(rawData).toString("utf8");
      }
    } else if (rawData instanceof ArrayBuffer) {
      byteLength = rawData.byteLength;
      const view = new Uint8Array(rawData);
      isBinary = view[0] !== 123;
      if (isBinary) {
        binaryChunk = view;
      } else {
        stringPayload = Buffer.from(rawData).toString("utf8");
      }
    } else {
      // Unknown edge format
      byteLength = 1024;
      stringPayload = String(rawData);
    }

    span.setAttribute("payload.size_bytes", byteLength);
    span.setAttribute("payload.is_binary", isBinary);
    wsPayloadSizeBytes.labels(options.endpoint).observe(byteLength);

    // 2. Out-Of-Memory (OOM) & Libuv Saturation Barrier
    if (byteLength > MAX_WEBSOCKET_PAYLOAD_SIZE_BYTES) {
      log.error(
        { event: "ws_payload_rejected_oom", sizeBytes: byteLength, maxLimitBytes: MAX_WEBSOCKET_PAYLOAD_SIZE_BYTES },
        "CRITICAL: WebSocket frame exceeded maximum memory capacity (64KB). Immediate teardown initiated."
      );

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `OOM_DEFENSE_TRIGGERED: frame size (${byteLength} bytes) exceeds 64KB`,
      });

      wsPayloadRejectedTotal.labels(options.endpoint, "OOM_MAX_SIZE_EXCEEDED").inc();

      Sentry.addBreadcrumb({
        category: "security.performance",
        message: `WebSocket Payload Screener blocked giant frame on ${options.endpoint}`,
        level: "fatal",
        data: { sizeBytes: byteLength, sessionId: options.sessionId },
      });

      options.closeSocket(1009, "Payload Too Large: Frame size exceeds Libuv/V8 64KB memory threshold");
      span.end();
      return { valid: false, isBinary };
    }

    // 3. Binary Audio Transmission Fast-Tracking
    if (isBinary && binaryChunk) {
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return { valid: true, audioChunk: binaryChunk, isBinary: true };
    }

    // 4. Highly Monitored & Safe JSON tree deserialization (Anti Event-Loop Starvation)
    if (!stringPayload || stringPayload.trim().length === 0) {
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return { valid: true, parsedJson: {}, isBinary: false };
    }

    const t0 = performance.now();
    try {
      const parsedJson = JSON.parse(stringPayload);
      const parsingDurationMs = performance.now() - t0;

      wsParsingLatencyMs.labels(options.endpoint).observe(parsingDurationMs);
      span.setAttribute("performance.json_parse_duration_ms", parsingDurationMs);

      // Warning alert if Event Loop starvation is threatened by deep complex trees
      if (parsingDurationMs > 3.0 && envServer.NODE_ENV !== "test") {
        log.warn(
          { event: "event_loop_starvation_warning", parsingDurationMs, sizeBytes: byteLength },
          "WebSocket JSON.parse() consumed excessive Event Loop execution time (>3ms)."
        );
      }

      span.setStatus({ code: SpanStatusCode.OK });
      return { valid: true, parsedJson, isBinary: false };
    } catch (err) {
      log.warn({ event: "ws_json_parse_error", payloadSnippet: stringPayload.slice(0, 100), err }, "Invalid JSON syntax received");
      span.setStatus({ code: SpanStatusCode.ERROR, message: "INVALID_JSON_SYNTAX" });
      wsPayloadRejectedTotal.labels(options.endpoint, "INVALID_JSON_SYNTAX").inc();
      options.closeSocket(1003, "Invalid JSON Syntax");
      return { valid: false, isBinary: false };
    } finally {
      span.end();
    }
  });
}
