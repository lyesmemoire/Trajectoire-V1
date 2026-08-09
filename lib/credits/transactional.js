import { logger } from "@/lib/logger";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import crypto from "crypto";
export class CreditTransaction {
    /**
     * Réserve les crédits (Lock) avec protection anti-spam
     */
    static async reserve(userId, amount, action, contentHash) {
        const correlationId = crypto.randomUUID();
        const log = logger.child({ correlationId, userId, action });
        // Fenêtre glissante de 1 heure pour éviter les retries agressifs du même job
        const hourBucket = new Date().toISOString().slice(0, 13);
        const idempotencyKey = `${userId}:${action}:${contentHash}:${hourBucket}`;
        log.info("credit_reserve_attempt", { amount, idempotencyKey });
        const supabase = createSupabaseServiceClient();
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
    static async commit(txId, metadata) {
        const log = logger.child({ txId });
        log.info("credit_commit_attempt", metadata);
        const supabase = createSupabaseServiceClient();
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
    static async rollback(txId, reason) {
        const log = logger.child({ txId });
        log.warn("credit_rollback_attempt", { reason });
        const supabase = createSupabaseServiceClient();
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
//# sourceMappingURL=transactional.js.map