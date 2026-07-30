/**
 * Audit Service - Historisation des actions sensibles
 * 
 * Ce module fournit des fonctions pour:
 * - Enregistrer les actions sensibles
 * - Suivre les connexions
 * - Suivre les suppressions de compte
 * - Suivre les exports de données
 * - Suivre les paiements
 * - Suivre les générations de rapport
 */

import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";

export type AuditAction =
  | "user_login"
  | "user_logout"
  | "user_signup"
  | "account_delete"
  | "account_export"
  | "simulation_create"
  | "simulation_message"
  | "simulation_end"
  | "report_generate"
  | "quota_exceeded"
  | "rate_limit_exceeded"
  | "admin_action";

export type ResourceType = "user" | "session" | "message" | "report" | "quota" | "system";

/**
 * Enregistre une action dans l'audit trail
 */
export async function auditLog(userId: string, action: AuditAction, resourceType: ResourceType, resourceId?: string, metadata?: Record<string, unknown>): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata: metadata || {},
    });
  } catch (error) {
    logError("Audit log error", error);
  }
}

/**
 * Récupère l'historique d'audit pour un utilisateur
 */
export async function getUserAuditHistory(userId: string, limit: number = 100): Promise<Array<{
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}>> {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    logError("Get audit history error", error);
    return [];
  }
}

/**
 * Récupère les actions récentes (admin)
 */
export async function getRecentAuditLogs(limit: number = 100): Promise<Array<{
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}>> {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    logError("Get recent audit logs error", error);
    return [];
  }
}

/**
 * Compte les actions par type pour un utilisateur
 */
export async function getActionCounts(userId: string, days: number = 7): Promise<Record<string, number>> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const { data } = await supabase
      .from("audit_log")
      .select("action")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString());

    if (!data) return {};

    const counts: Record<string, number> = {};
    for (const entry of data) {
      counts[entry.action] = (counts[entry.action] || 0) + 1;
    }

    return counts;
  } catch (error) {
    logError("Get action counts error", error);
    return {};
  }
}

/**
 * Détecte les comportements anormaux
 */
export async function detectAnomalousBehavior(userId: string): Promise<{ anomalous: boolean; reason?: string }> {
  const actionCounts = await getActionCounts(userId, 1); // Dernière heure

  // Détecter un nombre anormal de simulations
  if (actionCounts["simulation_create"] > 20) {
    return { anomalous: true, reason: "Too many simulations in 1 hour" };
  }

  // Détecter un nombre anormal de messages
  if (actionCounts["simulation_message"] > 100) {
    return { anomalous: true, reason: "Too many messages in 1 hour" };
  }

  // Détecter un nombre anormal de rate limits
  if (actionCounts["rate_limit_exceeded"] > 10) {
    return { anomalous: true, reason: "Too many rate limit violations" };
  }

  return { anomalous: false };
}
