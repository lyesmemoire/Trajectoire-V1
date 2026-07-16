// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";

// Vercel Cron routes can run up to 5 minutes
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // ✅ 1. Authorization: Only Vercel Cron or local secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${envServer.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClientSupabase();

    // ✅ 2. Fetch all alert rules
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from("cost_alerts")
      .select("*");

    if (rulesError || !rules) {
      throw new Error("Impossible de charger les règles d'alerte");
    }

    let alertTriggered = false;
    const alertMessages: string[] = [];

    // ✅ 3. Evaluate each rule
    for (const rule of rules) {
      const minutes = rule.window_minutes;
      const threshold = rule.threshold;

      // Execute SUM query on ai_usage_stats for the specific window
      // Due to Supabase JS limits with SUM, we can use RPC or fetch and reduce.
      // Fetching is fine if the volume per 10 mins is reasonable, or we can use an RPC.
      // To be strictly robust and avoid RPC dependency, we'll fetch within the window.
      // (For huge scale, an RPC 'get_cost_sum_for_window' would be better).

      const windowStart = new Date(Date.now() - minutes * 60000).toISOString();

      const { data: stats, error: statsError } = await supabaseAdmin
        .from("ai_usage_stats")
        .select("estimated_cost")
        .gte("created_at", windowStart);

      if (statsError) {
        console.error("Error fetching stats:", statsError);
        continue;
      }

      const totalCost = stats.reduce(
        (sum, row) => sum + (Number(row.estimated_cost) || 0),
        0,
      );

      if (totalCost > threshold) {
        alertTriggered = true;
        alertMessages.push(
          `⚠️ *Alerte Coût OpenAI* : ${totalCost.toFixed(3)}$ dépensés sur les ${minutes} dernières minutes. (Seuil: ${threshold}$)`,
        );
      }
    }

    // ✅ 4. Send to Slack if needed
    if (
      alertTriggered &&
      envServer.SLACK_WEBHOOK_URL &&
      alertMessages.length > 0
    ) {
      const slackMessage = alertMessages.join("\n\n");

      await fetch(envServer.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: slackMessage }),
      });
    }

    return NextResponse.json({ success: true, alerted: alertTriggered });
  } catch (error) {
    LoggerProvider.getLogger().error("[CRON] Cost Check Error", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
