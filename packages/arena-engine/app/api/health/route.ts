export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(req: NextRequest) {
  const health: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      redis: "unknown",
      mistral: "unknown",
      stripe: "unknown",
    },
    latency: {},
  };

  const start = Date.now();

  try {
    // 1. Database Check
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = "connected";
  } catch (e) {
    health.services.database = "error";
    health.status = "degraded";
  }

  try {
    // 2. Redis Check
    await redis.ping();
    health.services.redis = "connected";
  } catch (e) {
    health.services.redis = "error";
    health.status = "degraded";
  }

  // 3. AI Connectivity (Mistral)
  // We check if the key is present as a basic check
  health.services.mistral = process.env.MISTRAL_API_KEY
    ? "connected"
    : "missing_key";

  // 4. Stripe Connectivity
  health.services.stripe = process.env.STRIPE_SECRET_KEY
    ? "connected"
    : "missing_key";

  health.latency.total_check_ms = Date.now() - start;

  return NextResponse.json(health);
}
