import { createServerClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AnalyticsEngine } from "@/lib/analytics/interview.engine";
import { buildFeatures } from "@/lib/ml/interview.feature-engine";
import { INTERVIEW_MODEL_V1 } from "@/lib/ml/model.registry";
import { updateUserBehaviorProfile } from "@/lib/ml/user.behavioral-memory";
import { detectDrift } from "@/lib/ml/drift.detector";
import {
  StandardInterviewSession,
  PremiumInterviewSession,
  InterviewAnalyticsProjection,
} from "@/domain/interview.contract";

/**
 * SOURCE OF TRUTH for Interview operations.
 * NO direct DB access allowed outside this service.
 *
 * Pipeline on completeSession():
 *   Session (runtime) → Feature Engine → Scoring Engine (model vX)
 *   → Projection Writer → User Behavioral Memory → Drift Detection
 */
export const InterviewService = {

  async startStandardSession(userId: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from("interview_sessions").insert({
      user_id: userId,
      status: "created",
      questions: [],
      answers: [],
    }).select("*").single();

    if (error) throw new Error("Failed to start standard session: " + error.message);
    return data;
  },

  async startPremiumSession(userId: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from("interview_sessions").insert({
      user_id: userId,
      status: "created",
      questions: [],
      answers: [],
      is_premium: true,
      session_type: "interview",
    }).select("*").single();

    if (error) throw new Error("Failed to start premium session: " + error.message);
    return data;
  },

  async submitAnswer(sessionId: string, answer: string) {
    const supabase = await createServerClient();
    const { data: session } = await supabase.from("interview_sessions").select("*").eq("id", sessionId).single();
    if (!session) throw new Error("Session not found");
    if (session.status === "completed") throw new Error("Cannot mutate completed session");

    const currentAnswers = session.answers || [];
    const { data, error } = await supabase.from("interview_sessions").update({
      answers: [...currentAnswers, answer],
      status: "running",
    }).eq("id", sessionId).select("*").single();

    if (error) throw error;
    return data;
  },

  async appendTranscript(sessionId: string, message: any) {
    const supabase = await createServerClient();
    const { data: session } = await supabase.from("premium_interview_sessions").select("*").eq("id", sessionId).single();
    if (!session) throw new Error("Session not found");
    if (session.status === "completed") throw new Error("Cannot mutate completed session");

    const currentTranscript = session.transcript || [];
    const { data, error } = await supabase.from("premium_interview_sessions").update({
      transcript: [...currentTranscript, message],
      status: "streaming",
    }).eq("id", sessionId).select("*").single();

    if (error) throw error;
    return data;
  },

  /**
   * COMPLETE SESSION — Full ML Pipeline
   *
   * 1. Lock session (fetch + guard)
   * 2. Convert to canonical model
   * 3. Feature Engine (pure)
   * 4. Scoring Engine V2 (model-based, deterministic)
   * 5. Write legacy InterviewSession (immutable after)
   * 6. Write InterviewAnalyticsProjection (source of truth)
   * 7. Update User Behavioral Memory (longitudinal)
   * 8. Drift Detection (anomaly flagging)
   * 9. Mark runtime session as completed
   */
  async completeSession(sessionId: string) {
    const supabase = await createServerClient();

    // ── 1. Lock Session ──
    let isStandard = true;
    let { data: session } = await supabase.from("interview_sessions").select("*").eq("id", sessionId).single();

    if (!session) {
      isStandard = false;
      const { data: premiumSession } = await supabase.from("premium_interview_sessions").select("*").eq("id", sessionId).single();
      session = premiumSession;
      if (!session) throw new Error("Session not found");
    }

    if (session.status === "completed") {
      throw new Error("Session is already completed");
    }

    // ── 2. Convert to canonical model ──
    let canonical: StandardInterviewSession | PremiumInterviewSession;
    if (isStandard) {
      canonical = {
        id: session.id,
        userId: session.user_id,
        questions: session.questions || [],
        answers: session.answers || [],
        status: "completed",
        score: session.score,
      };
    } else {
      canonical = {
        id: session.id,
        userId: session.user_id,
        transcript: session.transcript || [],
        memory: session.memory || {},
        persona: session.persona || "standard",
        phases: session.phases || [],
        status: "completed",
      };
    }

    // ── 3. Feature Engine (pure) ──
    const features = buildFeatures(canonical);

    // ── 4. Scoring Engine V2 (model-based) ──
    const activeModel = INTERVIEW_MODEL_V1;
    const projection = AnalyticsEngine.computeScoreWithModel(features, session.user_id, activeModel);

    // ── 5. Prepare Behavior & Drift State (Reads) ──
    const existingProfile = await prisma.userBehaviorProfile.findUnique({
      where: { userId: session.user_id },
    });

    const memoryInput = existingProfile
      ? {
          userId: existingProfile.userId,
          trends: {
            confidenceTrend: ((existingProfile as any).confidenceTrend as number[]) || [],
            clarityTrend: ((existingProfile as any).clarityTrend as number[]) || [],
            improvementRate: 0,
          },
          archetypeEvolution: ((existingProfile as any).archetypeHistory as string[]) || [],
          stabilityScore: (existingProfile as any).stabilityScore ?? 1.0,
        }
      : null;

    const updatedMemory = updateUserBehaviorProfile(memoryInput, projection);

    const previousProjections = await (prisma as any).interviewAnalyticsProjection.findMany({
      where: { userId: session.user_id, sessionId: { not: sessionId } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const previousMapped: InterviewAnalyticsProjection[] = previousProjections.map((p: any) => ({
      sessionId: p.sessionId,
      userId: p.userId,
      behavioralScores: p.behavioralScores as any,
      archetype: p.archetype,
      pressureCurve: p.pressureCurve as any,
      progressionIndex: p.progressionIndex,
      modelVersion: p.modelVersion,
    }));

    const drift = detectDrift(projection, previousMapped);

    if (drift.anomaly) {
      console.warn(
        `[InterviewService] ⚠️ DRIFT ANOMALY for user ${session.user_id} on session ${sessionId}. Score: ${drift.driftScore.toFixed(3)}`
      );
    }

    // ── 6. Agent Evaluator (Orchestration Layer) ──
    const { evaluateSystemContext } = await import("@/lib/orchestration/agent.evaluator");
    const { TraceContext } = await import("@/lib/orchestration/trace.context");
    const { DecisionGraphRepository } = await import("@/lib/orchestration/decision-graph.repository");
    const crypto = await import("crypto");

    const repo = new DecisionGraphRepository();
    const trace = new TraceContext(
      crypto.randomUUID(),
      session.user_id,
      sessionId
    );

    // In a real scenario, CV and Billing signals would be fetched here.
    const evaluationInput = {
      userId: session.user_id,
      sessionId,
      interviewScore: (projection.behavioralScores.confidence + projection.behavioralScores.clarity) / 2,
      interviewConfidence: 0.9,
      cvMatchScore: 0.8, 
      hasBillingInconsistency: false, 
      ipAnomalies: 0,
      velocityAnomalies: 0,
      driftScore: drift.driftScore,
      stabilityScore: updatedMemory.stabilityScore
    };

    const { decision, graph } = evaluateSystemContext(evaluationInput, trace);

    // Persist trace graph immediately
    await repo.save(graph);

    if (decision.status === "block") {
      throw new Error(`SYSTEM BLOCKED by Consensus: ${decision.explanationGraph.join(" | ")}`);
    } else if (decision.status === "freeze") {
      throw new Error(`SYSTEM FROZEN by Consensus: ${decision.explanationGraph.join(" | ")}`);
    } else if (decision.status === "review") {
      console.warn(`[InterviewService] ⚠️ HUMAN REVIEW REQUESTED: ${decision.explanationGraph.join(" | ")}`);
    }

    // ── 7. Write legacy InterviewSession (READ-ONLY after this) ──
    await prisma.interviewSession.upsert({
      where: { id: sessionId },
      create: {
        id: sessionId,
        userId: session.user_id,
        status: "completed",
        currentState: "completed",
        persona: isStandard ? "standard" : session.persona || "standard",
        questions: isStandard ? session.questions : session.transcript,
        answers: isStandard ? session.answers : null,
        clarityScore: projection.behavioralScores.clarity,
        confidenceScore: projection.behavioralScores.confidence,
        ownershipScore: projection.behavioralScores.ownership,
        specificityScore: projection.behavioralScores.specificity,
        authenticityScore: projection.behavioralScores.authenticity,
        completedAt: new Date(),
      },
      update: {
        status: "completed",
        currentState: "completed",
        completedAt: new Date(),
      },
    });

    // ── 8. Write InterviewAnalyticsProjection (SOURCE OF TRUTH) ──
    await (prisma as any).interviewAnalyticsProjection.upsert({
      where: { sessionId },
      create: {
        sessionId,
        userId: session.user_id,
        behavioralScores: projection.behavioralScores,
        archetype: projection.archetype,
        pressureCurve: projection.pressureCurve,
        progressionIndex: projection.progressionIndex,
        modelVersion: activeModel.version,
      },
      update: {
        behavioralScores: projection.behavioralScores,
        archetype: projection.archetype,
        pressureCurve: projection.pressureCurve,
        progressionIndex: projection.progressionIndex,
        modelVersion: activeModel.version,
      },
    });

    // ── 9. Write User Behavioral Memory (longitudinal update) ──
    await (prisma as any).userBehaviorProfile.upsert({
      where: { userId: session.user_id },
      create: {
        userId: session.user_id,
        confidenceTrend: updatedMemory.trends.confidenceTrend,
        clarityTrend: updatedMemory.trends.clarityTrend,
        archetypeHistory: updatedMemory.archetypeEvolution,
        stabilityScore: updatedMemory.stabilityScore,
      },
      update: {
        confidenceTrend: updatedMemory.trends.confidenceTrend,
        clarityTrend: updatedMemory.trends.clarityTrend,
        archetypeHistory: updatedMemory.archetypeEvolution,
        stabilityScore: updatedMemory.stabilityScore,
      },
    });

    // ── 10. Mark runtime session completed ──
    if (isStandard) {
      await supabase.from("interview_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", sessionId);
    } else {
      await supabase.from("premium_interview_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", sessionId);
    }

    return { projection, features, drift, memory: updatedMemory, decision, traceId: trace.graph.build({
      status: decision.status,
      globalScore: decision.globalScore,
      reason: decision.explanationGraph.join(" | ")
    }).traceId };
  },



  async getHistory(userId: string) {
    const supabase = await createServerClient();
    const { data: std } = await supabase.from("interview_sessions").select("*").eq("user_id", userId);
    const { data: prm } = await supabase.from("premium_interview_sessions").select("*").eq("user_id", userId);
    return [...(std || []), ...(prm || [])];
  },

  async getAnalytics(sessionId: string) {
    return (prisma as any).interviewAnalyticsProjection.findUnique({
      where: { sessionId },
    });
  },
};
