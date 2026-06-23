export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Dashboard Admin : Intelligence contre le Scraping.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
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
