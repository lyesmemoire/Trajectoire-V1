import { Redis } from "@upstash/redis";
import { logWarn, logError } from "@/lib/logger/Logger";

// Singleton pattern pour éviter les connexions multiples (historique)
let redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  // En développement ou si pas de config, retourner null (pas de cache)
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    logWarn("Redis not configured, metrics will not be cached");
    return null;
  }

  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redisInstance;
}

// Helper pour get/set avec TTL
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300, // 5 minutes par défaut
): Promise<T> {
  const redis = getRedisClient();

  // Si pas de Redis, exécuter directement
  if (!redis) {
    return fetchFn();
  }

  try {
    // Tentative de récupération du cache
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss : récupérer les données fraîches
    const fresh = await fetchFn();

    // Stocker en cache (fire-and-forget)
    redis.setex(key, ttlSeconds, fresh).catch((err) => logError("[REDIS_ERROR]", err));

    return fresh;
  } catch (error) {
    logError("[REDIS_ERROR]", error);
    return fetchFn();
  }
}

// Helper pour invalider le cache
export async function invalidateCache(key: string): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.del(key).catch((err) => logError("[REDIS_ERROR]", err));
  }
}
