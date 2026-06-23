
const GatewayEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:  z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});
const gatewayEnv = GatewayEnvSchema.parse(process.env);
import { z } from "zod";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClient } from "@supabase/supabase-js";
import { verifyVoiceToken } from "../auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  gatewayEnv.SUPABASE_SERVICE_ROLE_KEY,
);

export async function registerEngineRoutes(app: FastifyInstance) {
  app.get("/api/engine/metrics", async (request: FastifyRequest, reply: FastifyReply) => {
    // ── Admin Auth Guard ──
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    
    const token = authHeader.replace("Bearer ", "");
    const user = await verifyVoiceToken(token);
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.userId)
      .single();

    if (!profile || profile.role !== "admin") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    // 1. Fetch raw data from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("engine_health_log")
      .select("*")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Database read failed" });
    }

    const logs = data || [];

    // Helper to calculate aggregations
    const calculateStats = (subset: any[]) => {
      const count = subset.length;
      if (count === 0) {
        return { count: 0, meanScore: null, meanIntegrity: null, percentHighPressure: null, timeoutRate: null, errorRate: null };
      }

      const sumScore = subset.reduce((acc, l) => acc + (l.final_executive_score || 0), 0);
      const sumIntegrity = subset.reduce((acc, l) => acc + (l.integrity_risk_index || 0), 0);
      
      const highPressureCount = subset.filter(l => l.max_pressure_level >= 4).length;
      const timeoutCount = subset.filter(l => l.timeout_occurred).length;
      const errorCount = subset.filter(l => l.error_occurred).length;

      return {
        count,
        meanScore: sumScore / count,
        meanIntegrity: sumIntegrity / count,
        percentHighPressure: highPressureCount / count,
        timeoutRate: timeoutCount / count,
        errorRate: errorCount / count
      };
    };

    // Calculate global
    const globalStats = calculateStats(logs);

    // Segmentations
    const groupedByLevel: Record<string, any[]> = {};
    const groupedByJob: Record<string, any[]> = {};
    const groupedByRole: Record<string, any[]> = {};

    logs.forEach(log => {
      if (log.candidate_level) {
        groupedByLevel[log.candidate_level] = groupedByLevel[log.candidate_level] || [];
        groupedByLevel[log.candidate_level]!.push(log);
      }
      if (log.job_category) {
        groupedByJob[log.job_category] = groupedByJob[log.job_category] || [];
        groupedByJob[log.job_category]!.push(log);
      }
      if (log.role_target) {
        groupedByRole[log.role_target] = groupedByRole[log.role_target] || [];
        groupedByRole[log.role_target]!.push(log);
      }
    });

    const byCandidateLevel: Record<string, ReturnType<typeof calculateStats>> = {};
    for (const key in groupedByLevel) {
      byCandidateLevel[key] = calculateStats(groupedByLevel[key] || []);
    }
    
    const byJobCategory: Record<string, ReturnType<typeof calculateStats>> = {};
    for (const key in groupedByJob) {
      byJobCategory[key] = calculateStats(groupedByJob[key] || []);
    }
    
    const byRoleTarget: Record<string, ReturnType<typeof calculateStats>> = {};
    for (const key in groupedByRole) {
      byRoleTarget[key] = calculateStats(groupedByRole[key] || []);
    }

    const response = {
      global: globalStats,
      by_candidate_level: byCandidateLevel,
      by_job_category: byJobCategory,
      by_role_target: byRoleTarget
    };

    // ── Automated Alerting ──────────────────────────────────
    if (globalStats.count > 0) {
      const { triggerAlert } = await import("../rate-limiter.js");
      const ENGINE = "v3_stable_realistic";
      const WINDOW = "last 7 days";

      if (globalStats.meanScore! > 7.3) {
        await triggerAlert({ metric: "meanScore", value: globalStats.meanScore!, threshold: 7.3, engineVersion: ENGINE, window: WINDOW });
      }
      if (globalStats.meanIntegrity! > 0.7) {
        await triggerAlert({ metric: "meanIntegrity", value: globalStats.meanIntegrity!, threshold: 0.7, engineVersion: ENGINE, window: WINDOW });
      }
      if (globalStats.percentHighPressure! > 0.35) {
        await triggerAlert({ metric: "percentHighPressure", value: `${(globalStats.percentHighPressure! * 100).toFixed(1)}%`, threshold: "35%", engineVersion: ENGINE, window: WINDOW });
      }
      if (globalStats.timeoutRate! > 0.03) {
        await triggerAlert({ metric: "timeoutRate", value: `${(globalStats.timeoutRate! * 100).toFixed(1)}%`, threshold: "3%", engineVersion: ENGINE, window: WINDOW });
      }
      if (globalStats.errorRate! > 0.02) {
        await triggerAlert({ metric: "errorRate", value: `${(globalStats.errorRate! * 100).toFixed(1)}%`, threshold: "2%", engineVersion: ENGINE, window: WINDOW });
      }

      // Daily interview count alert (budget protection)
      const todayLogs = logs.filter(l => {
        const created = new Date(l.created_at);
        const today = new Date();
        return created.toDateString() === today.toDateString();
      });
      const DAILY_INTERVIEW_BUDGET_LIMIT = Number(process.env.DAILY_INTERVIEW_LIMIT || 50);
      if (todayLogs.length > DAILY_INTERVIEW_BUDGET_LIMIT) {
        await triggerAlert({ metric: "daily_interviews", value: todayLogs.length, threshold: DAILY_INTERVIEW_BUDGET_LIMIT, engineVersion: ENGINE, window: "today" });
      }
    }

    return reply.send(response);
  });
}
