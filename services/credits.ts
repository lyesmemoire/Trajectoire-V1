import { createSupabaseServiceClient } from "@/lib/supabase-server";
import type { CreditAction } from "@/types/database";

export { CreditAction };

export const CREDIT_COSTS = {
  ats_check: 0,
  cv_optimize: 1,
  interview_generate: 1,
  interview_feedback: 2,
} as const;

export interface CreditOperationResult {
  success: boolean;
  remainingCredits?: number;
  error?: string;
  code?: "INSUFFICIENT_CREDITS" | "USER_NOT_FOUND" | "DB_ERROR";
}

export async function deductCredits(userId: string, amount: number, action: CreditAction, metadata?: Record<string, _unknown>, ): Promise<CreditOperationResult> {
  const supabase = createSupabaseServiceClient() as unknown;

  const { data, error } = await supabase.rpc("deduct_credits_atomic", {
    uid: userId,
    amt: amount,
  });

  if (error) {
    console.error("[Credits] Deduction failed:", {
      userId,
      amount,
      action,
      error: error.message,
    });

    if (error.message.includes("Insufficient credits")) {
      return {
        success: false,
        error: "Insufficient credits",
        code: "INSUFFICIENT_CREDITS",
      };
    }
    if (error.message.includes("not found")) {
      return {
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND",
      };
    }
    return { success: false, error: "Database error", code: "DB_ERROR" };
  }

  await logCreditUsage(supabase, userId, action, amount, 0, 0, metadata);

  return { success: true, remainingCredits: data as number };
}

export async function addCredits(userId: string, amount: number, action: CreditAction, metadata?: Record<string, _unknown>, ): Promise<CreditOperationResult> {
  const supabase = createSupabaseServiceClient() as unknown;

  const { data, error } = await supabase.rpc("add_credits_atomic", {
    uid: userId,
    amt: amount,
  });

  if (error) {
    console.error("[Credits] Addition failed:", {
      userId,
      amount,
      action,
      error: error.message,
    });
    return { success: false, error: error.message, code: "DB_ERROR" };
  }

  await logCreditUsage(supabase, userId, action, -amount, 0, 0, metadata);

  return { success: true, remainingCredits: data as number };
}

export async function getCredits(userId: string): Promise<number> {
  const supabase = createSupabaseServiceClient() as unknown;
  const { data, _error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  const profile = data as unknown;
  return (profile as { credits?: number })?.credits ?? 0;
}

export async function hasEnoughCredits(userId: string, required: number, ): Promise<boolean> {
  const balance = await getCredits(userId);
  return balance >= required;
}

async function logCreditUsage(
  supabase: unknown,
  userId: string,
  action: CreditAction,
  creditsSpent: number,
  tokensUsed: number,
  estimatedCostEur: number,
  metadata?: Record<string, unknown>
) {
  const { error } = await supabase.from("credit_usage").insert({
    user_id: userId,
    action,
    credits_spent: creditsSpent,
    tokens_used: tokensUsed,
    estimated_cost_eur: estimatedCostEur,
    metadata: metadata ?? {},
  });
  if (error) {
    console.error("[Credits] Log failed (non-blocking):", error.message);
  }
}
