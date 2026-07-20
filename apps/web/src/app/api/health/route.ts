/**
 * Health Check Endpoint
 * Provides comprehensive health status for monitoring and Kubernetes
 * 
 * GET /api/health
 * Returns: status, database, openai, redis, version, uptime, memory
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Application version (should be managed by CI/CD)
const APP_VERSION = process.env.APP_VERSION || "1.0.0";
const START_TIME = Date.now();

interface HealthStatus {
  status: "ok" | "degraded" | "down";
  database: "ok" | "down" | "error";
  openai: "ok" | "down" | "error";
  redis: "ok" | "down" | "error" | "skipped";
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  timestamp: string;
}

export async function GET() {
  const health: HealthStatus = {
    status: "ok",
    database: "ok",
    openai: "ok",
    redis: "skipped",
    version: APP_VERSION,
    uptime: Date.now() - START_TIME,
    memory: {
      used: 0,
      total: 0,
      percentage: 0,
    },
    timestamp: new Date().toISOString(),
  };

  // Check memory usage
  if (typeof process !== "undefined" && process.memoryUsage) {
    const memoryUsage = process.memoryUsage();
    health.memory.used = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
    health.memory.total = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
    health.memory.percentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
  }

  // Check database connection
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();
  } catch (error) {
    health.database = "error";
    health.status = "degraded";
  }

  // Check OpenAI API (optional, only if API key is configured)
  if (process.env.OPENAI_API_KEY) {
    try {
      // Simple check: we don't actually call OpenAI to avoid costs
      // Just verify the key is present and valid format
      if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
        health.openai = "error";
        health.status = "degraded";
      }
    } catch (error) {
      health.openai = "down";
      health.status = "degraded";
    }
  }

  // Check Redis (optional, if configured)
  if (process.env.REDIS_URL) {
    try {
      // Redis check would go here
      // For now, mark as skipped if not configured
      health.redis = "skipped";
    } catch (error) {
      health.redis = "down";
      health.status = "degraded";
    }
  }

  // Determine overall status
  if (health.database === "down" || health.openai === "down") {
    health.status = "down";
  }

  const statusCode = health.status === "ok" ? 200 : health.status === "degraded" ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
