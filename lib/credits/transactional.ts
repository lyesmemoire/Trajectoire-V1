import { createChildLogger } from "@/lib/core";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import crypto from "crypto";

export class CreditTransaction {
  /**
   * Réserve les crédits (Lock) avec protection anti-spam
   */
  static async reserve(
    userId: string,
    amount: number,
    action: string,
    contentHash: string,
  ): Promise<{ txId: string } | { error: string }> {
    const correlationId = crypto.randomUUID();
    const log = createChildLogger({ correlationId, userId, action });

    // Fenêtre glissante de 1 heure pour éviter les retries agressifs du même job
    const hourBucket = new Date().toISOString().slice(0, 13);
    const idempotencyKey = `${userId}:${action}:${contentHash}:${hourBucket}`;

    log.info({ amount, idempotencyKey }, "credit_reserve_attempt");

    const supabase = createAdminClientSupabase();

    const { data, error } = await supabase.rpc("reserve_credits_atomic", {
      p_user_id: userId,
      p_amount: amount,
      p_action: action,
      p_idemp_key: idempotencyKey,
    });

    if (error) {
      log.warn({ error: error.message }, "credit_reserve_failed");
      return {
        error: error.message.includes("unique")
          ? "Job already in progress for this content."
          : "Insufficient credits or system error.",
      };
    }

    log.info({ txId: data }, "credit_reserved");
    return { txId: data };
  }

  /**
   * Commit (Succès) : Confirme l'utilisation, log les tokens
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async commit(txId: string, metadata?: Record<string, any>) {
    const log = createChildLogger({ txId });
    log.info(metadata || {}, "credit_commit_attempt");

    const supabase = createAdminClientSupabase();
    const tokensUsed = metadata?.tokensUsed ?? 0;

    const { error } = await supabase.rpc("commit_credits_atomic", {
      p_tx_id: txId,
      p_tokens: tokensUsed,
    });

    if (error) {
      log.error({ error: error.message }, "credit_commit_failed");
      throw new Error("Failed to commit transaction");
    }

    log.info("credit_committed");
  }

  /**
   * Rollback (Échec) : Rembourse les crédits à l'utilisateur
   */
  static async rollback(txId: string, reason: string) {
    const log = createChildLogger({ txId });
    log.warn({ reason }, "credit_rollback_attempt");

    const supabase = createAdminClientSupabase();
    const { error } = await supabase.rpc("rollback_credits_atomic", {
      p_tx_id: txId,
      p_reason: reason,
    });

    if (error) {
      log.error({ error: error.message }, "credit_rollback_failed");
      throw new Error("Failed to rollback transaction");
    }

    log.info("credit_rollbacked");
  }
}
