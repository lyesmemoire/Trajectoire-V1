"use server";

import { createServerClient } from "@/lib/supabase/server";
import { ATSService, ATSAccessError } from "@/lib/ats/service";

export async function runATSAnalysis(cvId: string, jobDescription: string) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié");
  }

  try {
    return await ATSService.run({
      userId: user.id,
      cvId,
      jobDescription,
    });
  } catch (err) {
    if (err instanceof ATSAccessError) {
      throw new Error("upgrade_required");
    }
    throw err;
  }
}
