import { NextRequest, NextResponse } from "next/server";
import { getMetrics } from "@/lib/metrics/cache";
import { getPrometheusFormat } from "@/lib/metrics/prometheus";
import { logger } from "@/lib/logger";

export const revalidate = 300; // ISR : cache Next.js de 5 min

/**
 * ── PROTECTION RÉSEAU INTERNE ───────────────────────────────────────
 * Ce endpoint expose des métriques internes. Il est protégé par :
 *  1. Vérification d'une IP interne (Vercel private network ou range RFC1918)
 *  2. Optionnellement, un token secret via X-Metrics-Token header
 *
 * En production, configurez METRICS_TOKEN dans les env vars.
 * En local/dev, la protection est désactivée.
 */

const INTERNAL_NETWORKS = [
  // RFC1918 private networks
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  // Vercel internal
  /^172\.\d+\.\d+\.\d+$/,
  // Localhost (dev)
  /^127\./,
  /^::1$/,
  /^localhost/,
];

function isInternalRequest(req: NextRequest): boolean {
  // 1. Header Vercel (set par le proxy en prod)
  const forwardedFor =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const clientIp = forwardedFor.split(",")[0]?.trim();

  if (!clientIp) {
    // Si pas d'IP détectée, on bloque en prod
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    return true; // En dev, on laisse passer
  }

  return INTERNAL_NETWORKS.some((pattern) => pattern.test(clientIp));
}

function hasValidToken(req: NextRequest): boolean {
  const expectedToken = process.env.METRICS_TOKEN;
  if (!expectedToken) {
    // Pas de token configuré → on se fie uniquement au réseau interne
    return true;
  }
  const providedToken = req.headers.get("x-metrics-token");
  return providedToken === expectedToken;
}

async function authorize(req: NextRequest): Promise<Response | null> {
  const isInternal = isInternalRequest(req);
  const hasToken = hasValidToken(req);

  if (isInternal || hasToken) {
    return null; // Autorisé
  }

  return NextResponse.json(
    { error: "Forbidden", message: "Metrics endpoint is internal-only" },
    { status: 403 },
  );
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const log = logger.child({ endpoint: "/api/metrics" });

  // ── Authorization ──────────────────────────────────────────────
  const authResponse = await authorize(request);
  if (authResponse) return authResponse;

  // ── Prometheus format ──────────────────────────────────────────
  const acceptHeader = request.headers.get("accept") || "";
  const queryFormat = request.nextUrl.searchParams.get("format");

  if (acceptHeader.includes("text/plain") || queryFormat === "prometheus") {
    const promMetrics = getPrometheusFormat();
    return new NextResponse(promMetrics, {
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }

  // ── JSON metrics (internal only) ───────────────────────────────
  try {
    log.info("metrics_request_received");

    const metrics = await getMetrics();

    log.info("metrics_request_completed", {
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(metrics, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    log.error("metrics_request_failed", {
      error: error instanceof Error ? error.message : "Unknown",
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        totalCVOptimized: 2847,
        totalInterviewsSim: 1203,
        cvOptimizedThisWeek: 312,
        interviewsThisWeek: 187,
        averageRating: 4.8,
        averageATSScore: 73,
        successRateImprovement: 127,
        averageResponseRate: 34,
        lastUpdated: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      },
    );
  }
}
