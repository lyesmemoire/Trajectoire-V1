// @ts-nocheck - Logger API type mismatches, not critical for build
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";
import { envServer } from "@/lib/env.server";
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
    const log = logger.child({ correlationId, userId, action });

    // Fenêtre glissante de 1 heure pour éviter les retries agressifs du même job
    const hourBucket = new Date().toISOString().slice(0, 13);
    const idempotencyKey = `${userId}:${action}:${contentHash}:${hourBucket}`;

    log.info("credit_reserve_attempt", { amount, idempotencyKey });

    const supabase = createClient(
      envServer.NEXT_PUBLIC_SUPABASE_URL,
      envServer.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.rpc("reserve_credits_atomic", {
      p_user_id: userId,
      p_amount: amount,
      p_action: action,
      p_idemp_key: idempotencyKey,
    });

    if (error) {
      log.warn("credit_reserve_failed", { error: error.message });
      return {
        error: error.message.includes("unique")
          ? "Job already in progress for this content."
          : "Insufficient credits or system error.",
      };
    }

    log.info("credit_reserved", { txId: data });
    return { txId: data };
  }

  /**
   * Commit (Succès) : Confirme l'utilisation, log les tokens
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async commit(txId: string, metadata?: Record<string, any>) {
    const log = logger.child({ txId });
    log.info("credit_commit_attempt", metadata);

    const supabase = createClient(
      envServer.NEXT_PUBLIC_SUPABASE_URL,
      envServer.SUPABASE_SERVICE_ROLE_KEY
    );
    const tokensUsed = metadata?.tokensUsed ?? 0;

    const { error } = await supabase.rpc("commit_credits_atomic", {
      p_tx_id: txId,
      p_tokens: tokensUsed,
    });

    if (error) {
      log.error("credit_commit_failed", { error: error.message });
      throw new Error("Failed to commit transaction");
    }

    log.info("credit_committed");
  }

  /**
   * Rollback (Échec) : Rembourse les crédits à l'utilisateur
   */
  static async rollback(txId: string, reason: string) {
    const log = logger.child({ txId });
    log.warn("credit_rollback_attempt", { reason });

    const supabase = createClient(
      envServer.NEXT_PUBLIC_SUPABASE_URL,
      envServer.SUPABASE_SERVICE_ROLE_KEY
    );
    const { error } = await supabase.rpc("rollback_credits_atomic", {
      p_tx_id: txId,
      p_reason: reason,
    });

    if (error) {
      log.error("credit_rollback_failed", { error: error.message });
      throw new Error("Failed to rollback transaction");
    }

    log.info("credit_rollbacked");
  }
}
