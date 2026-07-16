// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";

const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL!,
  token: envServer.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * HONEYPOT ROUTE: This route should never be called by a real user.
 * Any call to this route results in an immediate IP blacklist in Redis.
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  LoggerProvider.getLogger().error(
    `[HONEYPOT HIT] IP: ${ip} | UA: ${req.headers.get("user-agent")}`,
  );

  // Blacklist IP for 24h
  await redis.set(`blacklist:${ip}`, true, { ex: 86400 });

  return new NextResponse("System Offline", { status: 503 });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
