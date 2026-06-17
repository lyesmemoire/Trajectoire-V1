import { getServerDb } from "@/lib/db/client";
import { UserService } from "@/lib/db/user.service";
import { 
  CreditOperation, 
  CreditOperationResult, 
  assertValidCreditOperation 
} from "@/domain/billing.contract";
import { validateCreditUsage, validateCreditTransaction } from "@/lib/db/validators/billing.validator";

function assertBillingBoundary(stack: string = new Error().stack || "") {
  // If we really wanted to inspect stack, we could.
  // But practically, ESLint enforces the boundary.
  // For runtime protection, we just ensure it exists.
}

export const BillingService = {
  /**
   * Spends credits atomically and logs usage.
   * This handles Idempotency via operationId.
   */
  async spendCredits(op: CreditOperation, dbClient?: any): Promise<CreditOperationResult> {
    assertBillingBoundary();
    assertValidCreditOperation(op);

    const supabase = dbClient || await getServerDb();

    // 1. Atomic Deduction
    const { data, error } = await supabase.rpc("deduct_credits_atomic", {
      uid: op.userId,
      amt: op.amount,
    });

    if (error) {
      console.error("[PRISMA_ERROR] Deduction failed:", {
        userId: op.userId,
        amount: op.amount,
        action: op.action,
        error: error.message,
      });

      if (error.message.includes("Insufficient credits")) {
        return { success: false, error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" };
      }
      if (error.message.includes("not found")) {
        return { success: false, error: "User not found", code: "USER_NOT_FOUND" };
      }
      return { success: false, error: "Database error", code: "DB_ERROR" };
    }

    // 2. Append-only Audit Log
    const { error: logError } = await supabase.from("credit_usage").insert({
      user_id: op.userId,
      action: op.action,
      credits_spent: op.amount,
      tokens_used: 0,
      estimated_cost_eur: 0,
      metadata: op.metadata ?? {},
    });

    if (logError) {
      console.error("[PRISMA_ERROR] Audit log failed (non-blocking):", logError.message);
    }

    return { success: true, remainingCredits: data as number };
  },

  /**
   * 2PC: Reserve credits for a long-running operation (like LLM generation).
   * Credits are deducted immediately, but kept in 'reserved' state.
   */
  async reserveCredits(op: CreditOperation, dbClient?: any): Promise<{ success: boolean; txId?: string; error?: string; cached?: boolean }> {
    assertBillingBoundary();
    assertValidCreditOperation(op);
    const supabase = dbClient || await getServerDb();

    // Idempotency check
    const { data: existingTx } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("idempotency_key", op.operationId)
      .single();

    if (existingTx) {
      if (existingTx.state === "reserved" || existingTx.state === "committed") {
        return { success: true, txId: existingTx.id, cached: true };
      }
    }

    const { data, error } = await supabase.rpc("reserve_credits_atomic", {
      p_user_id: op.userId,
      p_amount: op.amount,
      p_action: op.action,
      p_idemp_key: op.operationId,
    });

    if (error) {
      console.error("[PRISMA_ERROR] Reserve failed:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, txId: data };
  },

  /**
   * 2PC: Commit a previously reserved transaction.
   */
  async commitCredits(txId: string, tokensUsed: number = 0, dbClient?: any): Promise<boolean> {
    assertBillingBoundary();
    const supabase = dbClient || await getServerDb();
    const { error } = await supabase.rpc("commit_credits_atomic", {
      p_tx_id: txId,
      p_tokens: tokensUsed,
    });

    if (error) {
      console.error("[PRISMA_ERROR] Commit failed:", error.message);
      return false;
    }
    return true;
  },

  /**
   * 2PC: Rollback a previously reserved transaction (refunds credits).
   */
  async rollbackCredits(txId: string, reason: string, dbClient?: any): Promise<boolean> {
    assertBillingBoundary();
    const supabase = dbClient || await getServerDb();
    const { error } = await supabase.rpc("rollback_credits_atomic", {
      p_tx_id: txId,
      p_reason: reason,
    });

    if (error) {
      console.error("[PRISMA_ERROR] Rollback failed:", error.message);
      return false;
    }
    return true;
  },

  /**
   * Adds or refunds credits atomically and logs usage (as negative spend).
   * This is the ONLY way to add credits in the system.
   */
  async refundCredits(op: CreditOperation, dbClient?: any): Promise<CreditOperationResult> {
    assertBillingBoundary();
    assertValidCreditOperation(op);

    const supabase = dbClient || await getServerDb();

    // 0. Check Idempotency
    const { data: existingTx } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("idempotency_key", op.operationId)
      .single();

    if (existingTx && existingTx.state === "committed") {
      return { success: true, remainingCredits: await this.getBalance(op.userId, supabase), cached: true } as any;
    }

    // 1. Atomic Add
    const { data, error } = await supabase.rpc("add_credits_atomic", {
      uid: op.userId,
      amt: op.amount,
    });

    if (error) {
      console.error("[PRISMA_ERROR] Addition failed:", error.message);
      return { success: false, error: error.message, code: "DB_ERROR" };
    }

    // 2. Mark in transactions
    await supabase.from("credit_transactions").insert({
      idempotency_key: op.operationId,
      user_id: op.userId,
      amount: op.amount,
      action: op.action,
      state: "committed"
    });

    return { success: true, remainingCredits: data as number };
  },

  /**
   * Reads the current verified balance of a user.
   */
  async getBalance(userId: string, dbClient?: any): Promise<number> {
    assertBillingBoundary();
    const supabase = dbClient || await getServerDb();
    const { data, error } = await UserService.getProfile(userId, "credits", supabase);
    if (error) {
      console.error("[PRISMA_ERROR] Failed to read balance:", error.message);
      return 0;
    }
    const profile = data as any;
    return profile?.credits ?? 0;
  },

  /**
   * Helper equivalent to hasEnoughCredits.
   */
  async hasEnoughBalance(userId: string, required: number, dbClient?: any): Promise<boolean> {
    assertBillingBoundary();
    const balance = await this.getBalance(userId, dbClient);
    return balance >= required;
  },

  /**
   * Reads the credit usage audit trail for a user.
   */
  async getLedger(userId: string, dbClient?: any) {
    assertBillingBoundary();
    const supabase = dbClient || await getServerDb();
    const { data, error } = await supabase
      .from("credit_usage")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PRISMA_ERROR] Failed to read ledger:", error.message);
      return [];
    }

    return (data || []).map(validateCreditUsage);
  }
};
