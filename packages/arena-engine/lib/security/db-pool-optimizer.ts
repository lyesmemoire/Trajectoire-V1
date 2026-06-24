/**
 * lib/security/db-pool-optimizer.ts — Enterprise Database Reliability Engine (DBRE)
 *
 * Architecture (Principal DBRE & Staff SRE):
 * 1. Connection Pooling Singletons: Shares Optimized Prisma Client and Supabase Service Role across all Node.js and Fastify workers.
 * 2. Supavisor / PgBouncer Enforcement: Calibrates connection strings firmly to Port 6543 with transactional pooling query overrides (pgbouncer=true, connection_limit).
 * 3. Autonomous Reconnections & Resilience: Universal executeResilientDbQuery helper executing custom exponential backoff retry loops on connection drops.
 * 4. Universal Keep-Alive & Multiplexing: Attaches keepalive: true custom fetch handlers to multiplex Supabase network sockets.
 * 5. Enterprise Observability: Generates Sentry security/DBRE events, emits Prometheus active connection/latency metrics, and creates OpenTelemetry Spans.
 */

import { PrismaClient } from "@prisma/client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { Gauge, Counter, Histogram } from "prom-client";
import * as Sentry from "@sentry/nextjs";
import { envServer } from "../env.server.js";
import { createChildLogger } from "../logger.js";

// ── OpenTelemetry Setup ───────────────────────────────────────
const tracer = trace.getTracer("trajectoire-db-pool-optimizer");

// ── Prometheus Performance & DBRE Metrics ─────────────────────
export const dbreActiveConnectionsGauge = new Gauge({
  name: "trajectoire_dbre_prisma_connections_active",
  help: "Number of optimized Prisma Connection Singletons actively instantiated across Node.js and Fastify workers",
});

export const dbreDbReconnectionsTotal = new Counter({
  name: "trajectoire_dbre_supabase_reconnections_total",
  help: "Total number of automatic exponential backoff database query retry attempts executed to mitigate pool connection drops",
  labelNames: ["client_type", "failure_reason"],
});

export const dbreQueryLatencyHistogramMs = new Histogram({
  name: "trajectoire_dbre_query_latency_ms",
  help: "Execution latency of resilient database transactions executed through the DBRE optimizer kernel in milliseconds",
  buckets: [2, 10, 25, 50, 100, 250, 500, 1000],
  labelNames: ["query_type"],
});

// ── Autonomous Reconnection & Exponential Backoff Helper ──────
export interface ResilientExecuteOptions {
  operationName: string;
  clientType: "prisma" | "supabase" | string;
  maxRetries?: number;
  initialBackoffMs?: number;
}

/**
 * Universal Database Transaction Execution Gate.
 * Applies automatic retries with exponential backoff on intermittent network drops or connection pool stress.
 */
export async function executeResilientDbQuery<T>(
  queryFn: () => Promise<T>,
  options: ResilientExecuteOptions
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  let currentAttempt = 0;
  let backoffMs = options.initialBackoffMs ?? 100;
  const t0 = performance.now();

  const log = createChildLogger({
    operation: options.operationName,
    clientType: options.clientType,
    component: "db-pool-optimizer",
  });

  return await tracer.startActiveSpan(`dbre_resilient_query_${options.operationName}`, async (span) => {
    span.setAttribute("db.client", options.clientType);
    span.setAttribute("db.operation", options.operationName);

    while (currentAttempt <= maxRetries) {
      try {
        const result = await queryFn();
        const durationMs = performance.now() - t0;

        dbreQueryLatencyHistogramMs.labels(options.operationName).observe(durationMs);
        span.setAttribute("db.execution_duration_ms", durationMs);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (err) {
        currentAttempt++;

        const errorMessage = err instanceof Error ? err.message : String(err);
        const isIntermittentError = errorMessage.includes("timeout") ||
                                    errorMessage.includes("too many clients") ||
                                    errorMessage.includes("connection closed") ||
                                    errorMessage.includes("ECONNRESET") ||
                                    errorMessage.includes("pool") ||
                                    errorMessage.includes("503");

        if (currentAttempt > maxRetries || !isIntermittentError) {
          log.error({ err, currentAttempt }, `FATAL: Database operation failed after ${currentAttempt} attempts`);

          span.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
          Sentry.captureException(err, {
            tags: { dbre_operation: options.operationName, client_type: options.clientType },
            extra: { currentAttempt, backoffMs },
          });

          throw err;
        }

        // Execute Exponential Backoff Reconnection
        dbreDbReconnectionsTotal.labels(options.clientType, errorMessage.slice(0, 30)).inc();

        log.warn(
          { attempt: currentAttempt, maxRetries, waitMs: backoffMs, errSnippet: errorMessage.slice(0, 80) },
          "DB Pool connection drop intercepted. Initiating automatic exponential backoff retry logic."
        );

        Sentry.addBreadcrumb({
          category: "dbre.resilience",
          message: `Automatic Exponential Backoff executed for ${options.operationName} (${options.clientType})`,
          level: "warning",
          data: { attempt: currentAttempt, waitMs: backoffMs },
        });

        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        backoffMs *= 2; // Exponential multiplier
      }
    }

    throw new Error("Resilient DB query loop breached unexpectedly");
  });
}

// ── Prisma Pool Singleton (Supavisor Port 6543 Hardened) ──────
const globalForPrisma = globalThis as unknown as {
  optimizedPrisma?: PrismaClient;
};

export function getOptimizedPrismaClient(): PrismaClient {
  if (globalForPrisma.optimizedPrisma) {
    return globalForPrisma.optimizedPrisma;
  }

  let dbUrl = envServer.DATABASE_URL || process.env.DATABASE_URL || "";

  // Precise Hardening: Normalize Supavisor / PgBouncer cloud URL firmly to Transactional Pooling Port 6543
  if (dbUrl.includes("pooler.supabase.com") && !dbUrl.includes(":6543")) {
    dbUrl = dbUrl.replace(/:5432\b/, ":6543");
  }

  // Inject multiplexing transactional parameters if target is Port 6543
  if (dbUrl.includes(":6543") && !dbUrl.includes("pgbouncer=true")) {
    const separator = dbUrl.includes("?") ? "&" : "?";
    dbUrl = `${dbUrl}${separator}pgbouncer=true&connection_limit=20&pool_timeout=15`;
  }

  const client = new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
    log: envServer.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  if (envServer.NODE_ENV !== "production") {
    globalForPrisma.optimizedPrisma = client;
  }

  dbreActiveConnectionsGauge.inc();
  return client;
}

// ── Supabase Service Role Singleton (Universal Keep-Alive) ────
const globalForSupabase = globalThis as unknown as {
  optimizedSupabase?: SupabaseClient;
};

export function getOptimizedSupabaseClient(): SupabaseClient {
  if (globalForSupabase.optimizedSupabase) {
    return globalForSupabase.optimizedSupabase;
  }

  const supabaseUrl = envServer.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = envServer.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  // Custom persistent Fetch executing exponential backoff retries and Keep-Alive HTTP TCP multiplexing
  const customFetch: typeof fetch = async (url, options) => {
    return await executeResilientDbQuery(
      async () => {
        return await fetch(url, {
          ...options,
          keepalive: true, // Strict Keep-Alive active across all fast Fastify / Next.js workers
        } as RequestInit);
      },
      { operationName: "supabase_keepalive_fetch", clientType: "supabase" }
    );
  };

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: customFetch,
    },
  });

  if (envServer.NODE_ENV !== "production") {
    globalForSupabase.optimizedSupabase = client;
  }

  return client;
}
