/**
 * Rate Limiter - Protection contre les abus
 * 
 * Ce module fournit un rate limiting basé sur la mémoire pour:
 * - Limiter les requêtes par utilisateur/IP
 * - Protéger contre le brute force
 * - Protéger contre le DOS
 * 
 * Note: Pour la production, utiliser Redis ou un service externe (Upstash, Cloudflare)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Configuration des limites par route
 */
export const RATE_LIMITS = {
  login: { max: 5, windowMs: 60 * 1000 }, // 5 requêtes par minute
  signup: { max: 3, windowMs: 60 * 1000 }, // 3 requêtes par minute
  simulation: { max: 30, windowMs: 60 * 1000 }, // 30 requêtes par minute
  message: { max: 10, windowMs: 60 * 1000 }, // 10 messages par minute
  report: { max: 10, windowMs: 60 * 1000 }, // 10 rapports par minute
  default: { max: 100, windowMs: 60 * 1000 }, // 100 requêtes par minute par défaut
};

/**
 * Vérifie si une requête est autorisée selon le rate limit
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Si aucune entrée ou fenêtre expirée, créer une nouvelle entrée
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Incrémenter le compteur
  entry.count++;

  // Vérifier si la limite est dépassée
  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Nettoie les entrées expirées (à appeler périodiquement)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Génère un identifiant unique pour le rate limiting
 */
export function getRateLimitIdentifier(userId?: string, ip?: string): string {
  return userId ? `user:${userId}` : `ip:${ip}`;
}

/**
 * Classe d'erreur pour le rate limit
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}
