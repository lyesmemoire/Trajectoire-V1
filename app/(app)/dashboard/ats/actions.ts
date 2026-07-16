"use server";

import { createServerClient } from "@/lib/supabase/server";
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
    // Use MistralAtsAnalysisAdapter instead of deleted AI Engine
    const { MistralAtsAnalysisAdapter } = await import("@/lib/cv/infrastructure/adapters/mistral-ats-analysis.adapter");
    const atsAdapter = new MistralAtsAnalysisAdapter();
    
    const result = await atsAdapter.analyzeCv("", jobDescription);

    return {
      score: (result as any).score ?? 0,
      matchedSkills: (result as any).matchedKeywords ?? [],
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
