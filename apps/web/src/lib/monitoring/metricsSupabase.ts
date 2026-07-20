/**
 * Monitoring Metrics Persistant (Supabase)
 * 
 * Ce module fournit des fonctions pour:
 * - Suivre la latence des requêtes IA (persistant)
 * - Suivre le coût IA (tokens) (persistant)
 * - Suivre les erreurs et timeouts (persistant)
 * - Suivre les rate limits (429) (persistant)
 */

import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";

/**
 * Enregistre une métrique IA dans Supabase
 */
export async function recordAIRequest(
  latency: number,
  promptTokens: number,
  completionTokens: number,
  totalTokens: number,
  model: string,
  userId?: string,
  context?: string
): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.from("ai_metrics").insert({
      user_id: userId,
      latency_ms: latency,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      model,
      context,
    });
  } catch (error) {
    logError("Failed to record AI metrics", error);
  }
}

/**
 * Enregistre une erreur dans Supabase
 */
export async function recordError(
  type: string,
  message: string,
  userId?: string,
  context?: string
): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.from("error_logs").insert({
      user_id: userId,
      error_type: type,
      error_message: message,
      context,
    });
  } catch (error) {
    logError("Failed to record error", error);
  }
}

/**
 * Récupère les statistiques de latence pour un utilisateur
 */
export async function getLatencyStats(userId?: string, days: number = 7): Promise<{
  avg: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
  p99: number;
} | null> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const { data } = await supabase
      .from("ai_metrics")
      .select("latency_ms")
      .eq("user_id", userId || "")
      .gte("created_at", startDate.toISOString())
      .order("latency_ms", { ascending: true });

    if (!data || data.length === 0) return null;

    const latencies = data.map(m => m.latency_ms);
    const sum = latencies.reduce((a, b) => a + b, 0);

    return {
      avg: sum / latencies.length,
      min: latencies[0],
      max: latencies[latencies.length - 1],
      p50: latencies[Math.floor(latencies.length * 0.5)],
      p95: latencies[Math.floor(latencies.length * 0.95)],
      p99: latencies[Math.floor(latencies.length * 0.99)],
    };
  } catch (error) {
    console.error("Failed to get latency stats:", error);
    return null;
  }
}

/**
 * Récupère les statistiques de tokens pour un utilisateur
 */
export async function getTokenStats(userId?: string, days: number = 7): Promise<{
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  avgTokensPerRequest: number;
} | null> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const { data } = await supabase
      .from("ai_metrics")
      .select("prompt_tokens, completion_tokens, total_tokens")
      .eq("user_id", userId || "")
      .gte("created_at", startDate.toISOString());

    if (!data || data.length === 0) return null;

    const totalPromptTokens = data.reduce((sum, m) => sum + m.prompt_tokens, 0);
    const totalCompletionTokens = data.reduce((sum, m) => sum + m.completion_tokens, 0);
    const totalTokens = data.reduce((sum, m) => sum + m.total_tokens, 0);

    return {
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      avgTokensPerRequest: totalTokens / data.length,
    };
  } catch (error) {
    console.error("Failed to get token stats:", error);
    return null;
  }
}

/**
 * Compte les erreurs par type
 */
export async function getErrorCounts(userId?: string, days: number = 7): Promise<Record<string, number>> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const { data } = await supabase
      .from("error_logs")
      .select("error_type")
      .eq("user_id", userId || "")
      .gte("created_at", startDate.toISOString());

    if (!data) return {};

    const counts: Record<string, number> = {};
    for (const error of data) {
      counts[error.error_type] = (counts[error.error_type] || 0) + 1;
    }

    return counts;
  } catch (error) {
    console.error("Failed to get error counts:", error);
    return {};
  }
}
