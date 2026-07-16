// @ts-nocheck
// lib/ats/service.ts
// 100% Abonnement — Plus aucune logique crédits

import { createServerClient } from "@/lib/supabase/server";
import { processATSAnalysis }         from "@/lib/ats/orchestrator";
import { GetSubscriptionQuery }       from "@/lib/billing/application/queries/get-subscription.query";
import { appContainer }               from "@/lib/core/runtime/container/app-container";
import { AIUsageService }             from "@/lib/db/ai-usage.service";
import { randomUUID }                 from "crypto";

type PlanType = "free" | "essentiel" | "performance" | "strategique";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RunATSParams {
  userId:         string;
  cvId:           string;
  jobDescription: string;
}

export interface ATSResult {
  reportId:      string;
  score:         number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback:      string;
  confidence:    number;
  isPartial:     boolean;
  lockedInsights?: boolean;
}

// ─── ATSService ───────────────────────────────────────────────────────────────

export const ATSService = {

  async run(params: RunATSParams): Promise<ATSResult> {
    const { userId, cvId, jobDescription } = params;
    const supabase   = await createServerClient();
    const sessionId  = randomUUID();
    const startTime  = Date.now();

    // ── 1. Vérification accès ────────────────────────────────────────────────
    const getSubscriptionQuery = appContainer.resolve<GetSubscriptionQuery>("GetSubscriptionQuery");
    const subscriptionResult = await getSubscriptionQuery.execute({ userId });

    let plan: PlanType = "free";
    let isFreeTrial = false;
    let accessAllowed = false;

    if (subscriptionResult.isSuccess()) {
      const subscription = subscriptionResult.unwrap();
      plan = subscription.plan as PlanType;
      accessAllowed = subscription.status === "active";
      isFreeTrial = plan === "free"; // Simplification: free plan = trial
    }

    if (!accessAllowed) {
      await AIUsageService.insertSupabase({
        user_id: userId,
        feature: "ats_analysis",
        status: "denied",
        plan_type: plan,
        duration_ms: 0,
        error_code: "upgrade_required",
        session_id: sessionId,
      });
      throw new ATSAccessError("upgrade_required");
    }

    // ── 2. Chargement CV depuis la base ──────────────────────────────────────
    const { data: cv, error: cvError } = await supabase
      .from("cvs")
      .select("extracted_text, file_name")
      .eq("id", cvId)
      .eq("user_id", userId)
      .single();

    if (cvError || !cv) {
      throw new Error("CV introuvable ou accès refusé.");
    }

    if (!cv.extracted_text || cv.extracted_text.trim().length < 50) {
      throw new Error("Le CV ne contient pas assez de texte extractible.");
    }

    // ── 3. Analyse ATS ──────────────────────────────────────────────────────
    try {
      const analysisResult = await processATSAnalysis(
        cv.extracted_text,
        jobDescription
      );

      // ── 4. Filtrage par plan ────────────────────────────────────────────────
      const finalResult = filterResultByPlan(analysisResult, plan);

      // ── 5. Insertion rapport en base ────────────────────────────────────────
      const { data: report, error: insertError } = await supabase
        .from("ats_reports")
        .insert({
          user_id:          userId,
          cv_id:            cvId,
          job_description:  jobDescription,
          score:            finalResult.score,
          matched_keywords: finalResult.matchedSkills,
          missing_keywords: finalResult.missingSkills,
          suggestions:      [finalResult.feedback],
          total_keywords:   finalResult.matchedSkills.length + finalResult.missingSkills.length,
        })
        .select("id")
        .single();

      if (insertError || !report) {
        console.error("[ATSService] insert échoué", insertError);
        throw new Error("Impossible de sauvegarder le rapport.");
      }

      // ── 6. Marquer le free trial si applicable ─────────────────────────────
      // Note: Free trial marking would be handled by a separate UseCase if needed
      // For now, we skip this as it's handled by subscription status

      await AIUsageService.insertSupabase({
        user_id: userId,
        feature: "ats_analysis",
        status: "success",
        plan_type: plan,
        duration_ms: Date.now() - startTime,
        error_code: null,
        session_id: sessionId,
      });

      // ── 7. Retour résultat ─────────────────────────────────────────────────
      return {
        reportId:       report.id,
        score:          finalResult.score,
        matchedSkills:  finalResult.matchedSkills,
        missingSkills:  finalResult.missingSkills,
        feedback:       finalResult.feedback,
        confidence:     finalResult.confidence,
        isPartial:      finalResult.isPartial,
        lockedInsights: finalResult.lockedInsights,
      };

    } catch (err) {
      await AIUsageService.insertSupabase({
        user_id: userId,
        feature: "ats_analysis",
        status: "error",
        plan_type: plan,
        duration_ms: Date.now() - startTime,
        error_code: err instanceof ATSAccessError ? err.reason : "llm_failure",
        session_id: sessionId,
      });

      console.error("[ATSService] Erreur", err);
      throw new Error("L'analyse ATS a échoué.");
    }
  },
};

// ─── Filtrage par plan ────────────────────────────────────────────────────────

interface AnalysisOutput {
  score:         number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback:      string;
  confidence:    number;
}

interface FilteredResult extends AnalysisOutput {
  isPartial:      boolean;
  lockedInsights: boolean;
}

function filterResultByPlan(analysis: AnalysisOutput, plan: PlanType): FilteredResult {
  // Free : résultat partiel (curiosité → conversion)
  if (plan === "free") {
    return {
      score:          analysis.score,
      matchedSkills:  analysis.matchedSkills.slice(0, 3),
      missingSkills:  [],
      feedback:       "Analyse partielle. Passez à un plan payant pour obtenir le plan d'action détaillé et toutes les recommandations.",
      confidence:     analysis.confidence,
      isPartial:      true,
      lockedInsights: true,
    };
  }

  // Essentiel : rapport complet standard
  if (plan === "essentiel") {
    return {
      ...analysis,
      isPartial:      false,
      lockedInsights: false,
    };
  }

  // Performance & Stratégique : rapport complet + extras (extensible)
  return {
    ...analysis,
    isPartial:      false,
    lockedInsights: false,
  };
}

// ─── Erreurs typées ───────────────────────────────────────────────────────────

export class ATSAccessError extends Error {
  constructor(public readonly reason: string) {
    super(`ATS access denied: ${reason}`);
    this.name = "ATSAccessError";
  }
}
