// @ts-nocheck
import { NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { LoggerProvider } from "@/lib/core/observability/logger";
import { envServer } from "@/lib/env.server";

const CLEANUP_THRESHOLD_MINUTES = 10;

export async function GET(request: Request) {
  const startTime = Date.now();
  const log = LoggerProvider.getLogger();

  // 1. Vérification du secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${envServer.CRON_SECRET}`) {
    log.warn("cleanup_unauthorized_attempt", { ip: request.headers.get("x-forwarded-for") });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  log.info("cleanup_started");

  try {
    const supabase = createAdminClientSupabase();

    // 2. Récupérer les transactions expirées
    const { data: expiredTxs, error: fetchError } = await supabase
      .from("credit_transactions")
      .select("id, user_id, amount, action, created_at")
      .eq("state", "reserved")
      .lt(
        "created_at",
        new Date(
          Date.now() - CLEANUP_THRESHOLD_MINUTES * 60 * 1000,
        ).toISOString(),
      );

    if (fetchError) {
      log.error("cleanup_fetch_failed", { error: fetchError.message });
      return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }

    const count = expiredTxs?.length || 0;
    log.info("cleanup_found_expired", { count });

    if (count === 0) {
      return NextResponse.json({
        success: true,
        cleaned: 0,
        durationMs: Date.now() - startTime,
      });
    }

    // 3. Rollback de chaque transaction expirée
    const results = await Promise.allSettled(
      expiredTxs!.map(async (tx: any) => {
        const { error } = await supabase.rpc("rollback_credits_atomic", {
          p_tx_id: tx.id,
          p_reason: "Timeout cleanup by cron",
        });

        if (error) {
          log.error("cleanup_rollback_failed", { txId: tx.id, error: error.message });
          throw error;
        }

        log.info("cleanup_rollback_success", {
          txId: tx.id,
          userId: tx.user_id,
          amount: tx.amount,
          action: tx.action,
        });
      }),
    );

    const succeeded = results.filter(
      (r: any) => r.status === "fulfilled",
    ).length;
    const failed = results.filter((r: any) => r.status === "rejected").length;

    log.info("cleanup_completed", {
      total: count,
      succeeded,
      failed,
      durationMs: Date.now() - startTime,
    });

    // 4. Alert si taux d'échec > 10%
    if (failed > count * 0.1) {
      log.error("cleanup_high_failure_rate", {
        failureRate: (failed / count) * 100,
        failed,
        total: count,
      });
    }

    return NextResponse.json({
      success: true,
      cleaned: succeeded,
      failed,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    log.error("cleanup_unexpected_error", {
      error: error instanceof Error ? error.message : "Unknown",
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
