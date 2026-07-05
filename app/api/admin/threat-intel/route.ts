export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { Redis } from "@upstash/redis";
import { envServer } from "@/lib/env.server";

const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL!,
  token: envServer.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Dashboard Admin : Intelligence contre le Scraping.
 */
export async function GET(req: NextRequest) {
  const user = await getStrictUser(req);
  if (!user || (user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Stats simulées pour le dashboard
  const stats = {
    scrapingAttempts24h: 1420,
    headlessBlocked: 342,
    ipsBlacklisted: 12,
    mostTargetedRoute: "/api/ats/analyze-premium",
    averageEntropyScore: 78, // % (Humain vs Bot)
  };

  return NextResponse.json(stats);
}
