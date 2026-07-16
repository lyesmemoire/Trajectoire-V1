// @ts-nocheck

const GatewayEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:  z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});
const gatewayEnv = GatewayEnvSchema.parse(process.env);
import { z } from "zod";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyVoiceToken } from "../auth.js";
import { interviewRepository } from "../../voice-interview/persistence/singleton.js";

interface Params {
  sessionId: string;
}

export async function registerInterviewRoutes(app: FastifyInstance) {
  app.get(
    "/api/interviews/:sessionId",
    async (
      request: FastifyRequest<{ Params: Params }>,
      reply: FastifyReply,
    ) => {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const token = authHeader.replace("Bearer ", "");
      const user = await verifyVoiceToken(token);

      if (!user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const { sessionId } = request.params;

      const record = await interviewRepository.get(sessionId);

      if (!record) {
        return reply.status(404).send({ error: "Not found" });
      }

      // Isolation utilisateur
      if (record.userId !== user.userId) {
        return reply.status(403).send({ error: "Forbidden" });
      }

      return reply.send(record);
    },
  );

  app.get("/api/interviews", async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await verifyVoiceToken(token);

    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const records = await interviewRepository.listByUser(user.userId);

    const summary = records.map((r) => {
      const s = r.score as any;
      return {
        sessionId: r.sessionId,
        startedAt: r.startedAt,
        endedAt: r.endedAt,
        targetRole: r.targetRole ?? "generic",
        score: typeof s === "object" ? s : s != null ? { overall: s } : null,
      };
    });

    return reply.send(summary);
  });

    app.post(
      "/api/interviews/init",
      async (request: FastifyRequest<{ Body: { job_offer_text: string, target_role: string, atsReportId?: string } }>, reply) => {
        // ── Rate Limiting (3 tiers: 2/min, 5/h, 10/day) ──
        const ip = request.ip || request.headers["x-forwarded-for"] as string || "unknown";
        const { checkRateLimit } = await import("../rate-limiter.js");
        const rl = await checkRateLimit(ip);
        if (!rl.allowed) {
          return reply.status(429).send({
            error: "Too many requests. Please try again later.",
            retryAfter: rl.retryAfter
          });
        }
  
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
  
        const token = authHeader.replace("Bearer ", "");
        const user = await verifyVoiceToken(token);
        if (!user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
  
        const { job_offer_text, target_role, atsReportId } = request.body;
        if (!job_offer_text || !target_role) {
          return reply.status(400).send({ error: "Missing job_offer_text or target_role" });
        }

      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        gatewayEnv.SUPABASE_SERVICE_ROLE_KEY
      );

      // Fetch CV
      const { data: profile } = await supabase
        .from("profiles")
        .select("cv_text")
        .eq("user_id", user.userId)
        .single();

      if (!profile?.cv_text) {
        return reply.status(400).send({ error: "No CV found in profile. Upload CV first." });
      }

      // Fetch ATS Munitions
      let munitionContext = "";
      if (atsReportId) {
        const { data: atsReport } = await supabase
          .from("premium_ats_reports")
          .select("munition_pack, overall_score")
          .eq("id", atsReportId)
          .eq("user_id", user.userId)
          .single();

        if (atsReport?.munition_pack) {
          const { buildMunitionContext } = await import("../../voice-interview/context/munition-context.js");
          munitionContext = buildMunitionContext(
            atsReport.munition_pack as Parameters<typeof buildMunitionContext>[0],
            atsReport.overall_score ?? 0
          );
        }
      }

      // Import LLM strict to generate context
      const { callLlmStrict } = await import("../../voice-interview/core/llm-strict.js");
      const { z } = await import("zod");

      const ContextSchema = z.object({
        job_summary: z.string(),
        key_requirements: z.array(z.string()),
        cv_strengths: z.array(z.string()),
        cv_weaknesses: z.array(z.string()),
        risk_flags: z.array(z.string()),
        focus_zones: z.array(z.string()),
        leadership_expectations: z.array(z.string()),
      });

      const systemPrompt = `You are an elite Head of Talent and Strategic Business Director evaluating a candidate's CV against a specific Job Description.
Your goal is to prepare a ruthless, highly structured context for a contextual deep-dive interview.
Do not sugarcoat. Be factual and identify exact areas where the candidate is weak compared to the JD.
Extract the key responsibilities, autonomy level, and leadership expectations from the job offer.`;

      const userPrompt = `
TARGET ROLE: ${target_role}

JOB DESCRIPTION:
${job_offer_text}

CANDIDATE CV:
${profile.cv_text}

${munitionContext}

Generate the Interview Context to drive the upcoming technical and behavioral deep dive.`;

      const contextData = await callLlmStrict(
        systemPrompt,
        userPrompt,
        ContextSchema,
        `{ "job_summary": string, "key_requirements": string[], "cv_strengths": string[], "cv_weaknesses": string[], "risk_flags": string[], "focus_zones": string[], "leadership_expectations": string[] }`
      );

      // Store in DB using the correct schema
      const { data: sessionData, error: sessionError } = await supabase
        .from("interview_sessions")
        .insert({
          user_id: user.userId,
          target_role,
          job_offer_summary: contextData.job_summary,
          interview_context: contextData,
          status: "in_progress",
          ats_report_id: atsReportId ?? null
          // No id provided, Postgres generates an UUID. created_at is automatically handled.
        })
        .select("id")
        .single();

      if (sessionError || !sessionData) {
        throw new Error(`[Gateway] Création session échouée: ${sessionError?.message}`);
      }

      const sessionId = sessionData.id;

      return reply.send({
        sessionId,
        interview_context: contextData
      });
    }
  );
}
