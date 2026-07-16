// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { ATSAIEngine } from "@/core/intelligence/engines/atsAIEngine";
import { ATSAccessError } from "@/lib/ats/service";

export async function runATSAnalysis(cvId: string, jobDescription: string) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié");
  }

  try {
    // Use AI Engine instead of direct service
    const result = await ATSAIEngine.analyzeATS({
      cvId,
      jobDescriptionId: "manual", // Manual job description input
      cvContent: "", // Will be loaded from Supabase
      jobDescription,
      candidateId: user.id,
    });

    return {
      score: (result as any).score ?? 0,
      matchedSkills: (result as any).matchedSkills ?? [],
      missingSkills: (result as any).missingSkills ?? [],
      feedback: (result as any).feedback ?? "",
      confidence: (result as any).confidence ?? 0,
      isPartial: false,
    };
  } catch (err) {
    if (err instanceof ATSAccessError) {
      throw new Error("upgrade_required");
    }
    throw err;
  }
}
