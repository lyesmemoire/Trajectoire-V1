import { getCached, invalidateCache } from "@/lib/redis";
import { fetchMetricsFromDB } from "./queries";
import { Metrics } from "./types";

const CACHE_KEY = "metrics:public";
const CACHE_TTL = 300; // 5 minutes

/**
 * Récupère les métriques (avec cache)
 */
export async function getMetrics(): Promise<Metrics> {
  return getCached(CACHE_KEY, fetchMetricsFromDB, CACHE_TTL);
}

/**
 * Invalide le cache (à appeler après chaque job complété)
 */
export async function refreshMetricsCache(): Promise<void> {
  await invalidateCache(CACHE_KEY);
}
