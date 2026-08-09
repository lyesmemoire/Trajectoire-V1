/**
 * Readiness Probe Endpoint
 * Checks if the application is ready to accept traffic
 * 
 * GET /api/health/readiness
 * Returns: status, checks, timestamp
 */

import { NextResponse } from "next/server";

interface ReadinessCheck {
  name: string;
  status: "ok" | "down" | "error";
  message?: string;
}

interface ReadinessStatus {
  status: "ready" | "not_ready";
  checks: ReadinessCheck[];
  timestamp: string;
}

export async function GET() {
  const checks: ReadinessCheck[] = [];
  let overallStatus: "ready" | "not_ready" = "ready";

  // Check database connectivity
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();
    checks.push({ name: "database", status: "ok" });
  } catch (error) {
    checks.push({ 
      name: "database", 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
    overallStatus = "not_ready";
  }

  // Check Redis connectivity (if configured)
  if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
      });
      await redis.ping();
      checks.push({ name: "redis", status: "ok" });
    } catch (error) {
      checks.push({ 
        name: "redis", 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
      overallStatus = "not_ready";
    }
  } else {
    checks.push({ name: "redis", status: "ok", message: "not configured" });
  }

  // Check Supabase connectivity (if configured)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error } = await supabase.from("_test_readiness_").select("*").limit(1);
      // Ignore 404 errors - table doesn't exist but connection works
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      checks.push({ name: "supabase", status: "ok" });
    } catch (error) {
      checks.push({ 
        name: "supabase", 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
      overallStatus = "not_ready";
    }
  } else {
    checks.push({ name: "supabase", status: "ok", message: "not configured" });
  }

  // Check OpenAI API key format (if configured)
  if (process.env.OPENAI_API_KEY) {
    if (process.env.OPENAI_API_KEY.startsWith("sk-")) {
      checks.push({ name: "openai", status: "ok" });
    } else {
      checks.push({ 
        name: "openai", 
        status: "error", 
        message: "Invalid API key format" 
      });
      overallStatus = "not_ready";
    }
  } else {
    checks.push({ name: "openai", status: "ok", message: "not configured" });
  }

  // Check Stripe API key format (if configured)
  if (process.env.STRIPE_SECRET_KEY) {
    if (process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
      checks.push({ name: "stripe", status: "ok" });
    } else {
      checks.push({ 
        name: "stripe", 
        status: "error", 
        message: "Invalid API key format" 
      });
      overallStatus = "not_ready";
    }
  } else {
    checks.push({ name: "stripe", status: "ok", message: "not configured" });
  }

  const statusCode = overallStatus === "ready" ? 200 : 503;

  return NextResponse.json({
    status: overallStatus,
    checks,
    timestamp: new Date().toISOString(),
  }, { status: statusCode });
}
