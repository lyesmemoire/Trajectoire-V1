/**
 * Rate Limiter Persistant (Supabase)
 * 
 * Ce module fournit un rate limiting basé sur Supabase pour:
 * - Persistance entre redémarrages
 * - Distribution multi-instance
 * - Protection contre le brute force
 * - Protection contre le DOS
 */

import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

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
 * Vérifie si une requête est autorisée selon le rate limit (Supabase)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const supabase = await createClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);
  const windowEnd = new Date(now.getTime() + windowMs);

  try {
    // Nettoyer les anciennes entrées
    await supabase
      .from("rate_limits")
      .delete()
      .lt("window_end", windowStart.toISOString());

    // Chercher une entrée existante
    const { data: existing } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .gt("window_end", now.toISOString())
      .single();

    if (!existing) {
      // Créer une nouvelle entrée
      const { error: insertError } = await supabase
        .from("rate_limits")
        .insert({
          identifier,
          count: 1,
          window_start: now.toISOString(),
          window_end: windowEnd.toISOString(),
        });

      if (insertError) {
        logError("Rate limit insert error", insertError);
        // Fallback: autoriser si erreur
        return { allowed: true, remaining: limit - 1, resetTime: windowEnd.getTime() };
      }

      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: windowEnd.getTime(),
      };
    }

    // Incrémenter le compteur
    const newCount = existing.count + 1;
    const { error: updateError } = await supabase
      .from("rate_limits")
      .update({ count: newCount })
      .eq("id", existing.id);

    if (updateError) {
      logError("Rate limit update error", updateError);
      // Fallback: autoriser si erreur
      return { allowed: true, remaining: limit - existing.count, resetTime: new Date(existing.window_end).getTime() };
    }

    // Vérifier si la limite est dépassée
    if (newCount > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(existing.window_end).getTime(),
      };
    }

    return {
      allowed: true,
      remaining: limit - newCount,
      resetTime: new Date(existing.window_end).getTime(),
    };
  } catch (error) {
    logError("Rate limit error", error);
    // Fallback: autoriser si erreur
    return { allowed: true, remaining: limit - 1, resetTime: windowEnd.getTime() };
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
