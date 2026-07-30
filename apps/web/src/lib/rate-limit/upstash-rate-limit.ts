import { Redis } from "@upstash/redis"
import { logger } from "@/lib/logger"

let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  }
  return redis
}

export async function checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; reset: number }> {
  try {
    const redis = getRedis()
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowStart = now - windowSeconds * 1000

    // Nettoyer les entrées expirées
    await redis.zremrangebyscore(key, 0, windowStart)

    // Compter les requêtes dans la fenêtre
    const count = await redis.zcard(key)

    if (count >= limit) {
      // Récupérer le timestamp de la plus ancienne requête
      const oldest = await redis.zrange(key, 0, 0, { withScores: true }) as [string, number][]
      const reset = oldest.length > 0 ? Math.ceil(oldest[0][1] + windowSeconds * 1000) : now + windowSeconds * 1000
      
      return { allowed: false, reset }
    }

    // Ajouter cette requête
    await redis.zadd(key, { score: now, member: now.toString() })
    
    // Définir l'expiration de la clé
    await redis.expire(key, windowSeconds)

    return { allowed: true, reset: now + windowSeconds * 1000 }
  } catch (error) {
    logger.error({ error: error, component: "upstash-rate-limit" }, "Rate limit check failed, allowing request")
    // Fail open : si Redis échoue, on autorise la requête
    return { allowed: true, reset: Date.now() + windowSeconds * 1000 }
  }
}
