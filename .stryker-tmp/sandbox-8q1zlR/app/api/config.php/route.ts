// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { envServer } from "@/lib/env.server";

const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL!,
  token: envServer.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  await redis.set(`blacklist:${ip}`, true, { ex: 604800 }); // 7 days
  return new NextResponse("Not Found", { status: 404 });
}
