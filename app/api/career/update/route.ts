import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";
import { NextResponse } from "next/server";
import { updateCareerProfile } from "@/lib/ai/career-memory";
import { generateCareerInsights } from "@/lib/ai/generate-insights";
import { updateArchetypeEvolution } from "@/lib/archetypes/archetype-evolution";
import { computeReturnScore } from "@/lib/prediction/return-model-v1";
import { computeAuthenticityScore } from "@/lib/security/integrity-engine";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const userId = user.id;

    const RequestSchema = z.object({
      sessionId:         z.string().uuid().optional(),
      interviewAnalysis: z.object({
        communicationScore: z.number().min(0).max(100).optional(),
        confidenceScore:    z.number().min(0).max(100).optional(),
        technicalScore:     z.number().min(0).max(100).optional(),
        leadershipScore:    z.number().min(0).max(100).optional(),
        verbosity:          z.number().min(0).optional(),
        interruptionCount:  z.number().int().min(0).optional(),
        recoveryCount:      z.number().int().min(0).optional(),
        freezeCount:        z.number().int().min(0).optional(),
        completionRate:     z.number().min(0).max(100).optional(),
      }).optional(),
      uxFingerprint:   z.record(z.string(), z.unknown()).optional(),
      securitySignals: z.record(z.string(), z.unknown()).optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      sessionId,
      interviewAnalysis,
      uxFingerprint,
      securitySignals,
    } = parsed.data;

    if (!interviewAnalysis) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🛡️ 1. DATASET INTEGRITY CHECK
    const authenticityScore = computeAuthenticityScore({
      interactionEntropy: uxFingerprint?.entropyScore || 0.8,
      headlessDetection: securitySignals?.headless || false,
      unnaturalSpeed: securitySignals?.unnaturalSpeed || false,
      completionRate: interviewAnalysis.completionRate || 1.0,
    });

    // 2. Update Core Scores & Profile
    const profile = await updateCareerProfile({
      userId,
      interviewData: interviewAnalysis,
    });

    // 3. Generate Insights
    await generateCareerInsights(userId);

    // 4. Update Career Archetype DNA
    await updateArchetypeEvolution(userId, {
      clarity: interviewAnalysis.communicationScore,
      confidence: interviewAnalysis.confidenceScore,
      technical: interviewAnalysis.technicalScore,
      ownership: interviewAnalysis.leadershipScore,
      specificity: interviewAnalysis.technicalScore,
      verbosity: interviewAnalysis.verbosity || 50,
    });

    // 5. 🔮 PREDICTIVE RETURN MODEL
    const prediction = computeReturnScore({
      behavior: {
        victorInterrupts: interviewAnalysis.interruptionCount || 0,
        claraRecoveries: interviewAnalysis.recoveryCount || 0,
        freezes: interviewAnalysis.freezeCount || 0,
        replays: 1,
        retries: 0,
      },
      ux: {
        hesitationIndex: uxFingerprint?.hesitationIndex || 0.5,
        scrollEntropy: uxFingerprint?.scrollEntropy || 50,
        clickDelayAvg: uxFingerprint?.clickDelayAvg || 500,
        typingSpeed: uxFingerprint?.typingSpeed || 2.0,
      },
    });

    // 6. Persist results and Authenticity
    if (sessionId) {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: { authenticityScore },
      });

      await prisma.userPredictionSnapshot.create({
        data: {
          userId,
          sessionId,
          returnProbability: prediction.returnProbability,
          returnSegment: prediction.returnSegment,
          primaryDriver: prediction.primaryDriver,
          stressScore: interviewAnalysis.interruptionCount * 10,
          recoveryScore: interviewAnalysis.recoveryCount * 20,
          engagementScore: (1 - (uxFingerprint?.hesitationIndex || 0.5)) * 100,
        },
      });
    }

    return NextResponse.json({
      success: true,
      authenticity: authenticityScore,
      prediction: {
        probability: prediction.returnProbability,
        segment: prediction.returnSegment,
      },
    });
  } catch (error: any) {
    console.error("[Career Update API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
