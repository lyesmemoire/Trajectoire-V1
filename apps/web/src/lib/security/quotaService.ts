/**
 * Quota Service - Gestion des quotas utilisateur
 * 
 * Ce module fournit des fonctions pour:
 * - Vérifier les quotas utilisateur
 * - Incrémenter l'utilisation
 * - Réinitialiser les quotas périodiquement
 * - Gérer les plans (Free, Premium)
 */

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger/Logger";
import { getCache, CacheKeys, TTL } from "@/lib/cache/MemoryCache";

export type QuotaType = "simulations" | "messages" | "reports" | "tokens";

export interface QuotaConfig {
  type: QuotaType;
  limit: number;
  period: "daily" | "monthly";
}

// Configuration des quotas par plan
export const QUOTA_CONFIGS: Record<string, Record<QuotaType, QuotaConfig>> = {
  free: {
    simulations: { type: "simulations", limit: 10, period: "daily" },
    messages: { type: "messages", limit: 50, period: "daily" },
    reports: { type: "reports", limit: 5, period: "daily" },
    tokens: { type: "tokens", limit: 100000, period: "monthly" },
  },
  premium: {
    simulations: { type: "simulations", limit: 100, period: "daily" },
    messages: { type: "messages", limit: 500, period: "daily" },
    reports: { type: "reports", limit: 50, period: "daily" },
    tokens: { type: "tokens", limit: 1000000, period: "monthly" },
  },
};

/**
 * Vérifie si l'utilisateur a atteint son quota
 * Utilise le cache mémoire pour optimiser les requêtes fréquentes
 */
export async function checkQuota(
  userId: string,
  quotaType: QuotaType,
  plan: string = "free"
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const cache = getCache();
  const cacheKey = CacheKeys.userQuota(userId, quotaType);
  
  // Essayer de récupérer depuis le cache
  const cached = cache.get<{ allowed: boolean; remaining: number; resetTime: Date }>(cacheKey);
  if (cached) {
    logger.debug("Quota cache hit", { userId, quotaType });
    return cached;
  }

  const supabase = await createClient();
  const config = QUOTA_CONFIGS[plan]?.[quotaType] || QUOTA_CONFIGS.free[quotaType];
  const now = new Date();
  
  // Calculer la période
  let periodStart: Date;
  let periodEnd: Date;
  
  if (config.period === "daily") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  try {
    // Chercher ou créer le quota
    const { data: quota } = await supabase
      .from("user_quotas")
      .select("*")
      .eq("user_id", userId)
      .eq("quota_type", quotaType)
      .gte("period_start", periodStart.toISOString())
      .single();

    if (!quota) {
      // Créer un nouveau quota
      await supabase.from("user_quotas").insert({
        user_id: userId,
        quota_type: quotaType,
        quota_limit: config.limit,
        quota_used: 0,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      });

      return {
        allowed: true,
        remaining: config.limit,
        resetTime: periodEnd,
      };
    }

    const remaining = quota.quota_limit - quota.quota_used;
    const result = {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      resetTime: new Date(quota.period_end),
    };
    
    // Mettre en cache le résultat (TTL court pour les quotas)
    cache.set(cacheKey, result, TTL.SHORT);
    
    return result;
  } catch (error) {
    logger.error("Quota check error", { userId, quotaType, error });
    // Fallback: autoriser si erreur
    const fallbackResult = {
      allowed: true,
      remaining: config.limit,
      resetTime: periodEnd,
    };
    return fallbackResult;
  }
}

/**
 * Incrémente l'utilisation du quota
 * Invalide le cache après incrémentation
 */
export async function incrementQuota(
  userId: string,
  quotaType: QuotaType,
  amount: number = 1
): Promise<void> {
  const cache = getCache();
  const cacheKey = CacheKeys.userQuota(userId, quotaType);
  
  // Invalider le cache avant incrémentation
  cache.delete(cacheKey);
  
  const supabase = await createClient();
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  try {
    await supabase.rpc("increment_quota", {
      p_user_id: userId,
      p_quota_type: quotaType,
      p_amount: amount,
      p_period_start: periodStart.toISOString(),
      p_period_end: periodEnd.toISOString(),
    });
  } catch (error) {
    logger.error("Quota increment error", { userId, quotaType, amount, error });
  }
}

/**
 * Réinitialise les quotas expirés (à appeler périodiquement)
 */
export async function cleanupExpiredQuotas(): Promise<void> {
  const supabase = await createClient();
  const now = new Date();

  try {
    await supabase
      .from("user_quotas")
      .delete()
      .lt("period_end", now.toISOString());
  } catch (error) {
    logger.error("Quota cleanup error", { error });
  }
}

/**
 * Récupère les quotas actuels d'un utilisateur
 */
export async function getUserQuotas(userId: string): Promise<Record<QuotaType, { limit: number; used: number; remaining: number }>> {
  const supabase = await createClient();
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const { data: quotas } = await supabase
      .from("user_quotas")
      .select("*")
      .eq("user_id", userId)
      .gte("period_start", periodStart.toISOString());

    const result: Record<QuotaType, { limit: number; used: number; remaining: number }> = {
      simulations: { limit: 10, used: 0, remaining: 10 },
      messages: { limit: 50, used: 0, remaining: 50 },
      reports: { limit: 5, used: 0, remaining: 5 },
      tokens: { limit: 100000, used: 0, remaining: 100000 },
    };

    if (quotas) {
      for (const quota of quotas) {
        const type = quota.quota_type as QuotaType;
        result[type] = {
          limit: quota.quota_limit,
          used: quota.quota_used,
          remaining: quota.quota_limit - quota.quota_used,
        };
      }
    }

    return result;
  } catch (error) {
    logger.error("Get quotas error", { userId, error });
    return {
      simulations: { limit: 10, used: 0, remaining: 10 },
      messages: { limit: 50, used: 0, remaining: 50 },
      reports: { limit: 5, used: 0, remaining: 5 },
      tokens: { limit: 100000, used: 0, remaining: 100000 },
    };
  }
}
