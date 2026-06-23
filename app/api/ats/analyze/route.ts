import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { processATSAnalysis } from "@/lib/ats/orchestrator";
import { getAuthenticatedUser } from "@/lib/auth";
import { logInfo, logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    logInfo("[ATS_ANALYZE]", "ATS analysis started", {
      route: "api/ats/analyze"
    });

    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { getUserSubscription, hasPremiumAccess } = await import("@/apps/web/src/lib/billing/get-user-subscription");
    const subscription = await getUserSubscription(user.id);
    const premium = hasPremiumAccess(subscription);
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    const isPremium = hasPremiumAccess(subscription);
    const hasCredits = subscription.credits > 0;
    const hasUsedTrial = subscription.hasUsedFreeTrial;

    if (!isPremium && !hasCredits && hasUsedTrial) {
      return NextResponse.json({ error: "upgrade_required" }, { status: 403 });
    }

    const formData = await req.formData();
    const rawFile = formData.get("file");
    const rawJobDescription = formData.get("jobDescription");

    const RequestSchema = z.object({
      file: z.custom<Blob>(
        (val) => val instanceof Blob || (typeof val === "object" && val !== null),
        { message: "Le fichier CV est requis." }
      ),
      jobDescription: z.string().min(10, "Description de l'offre requise.").max(8000),
    });

    const parsed = RequestSchema.safeParse({ file: rawFile, jobDescription: rawJobDescription });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const file = parsed.data.file as File;
    const jobDescription = parsed.data.jobDescription;

    const buffer = Buffer.from(await file.arrayBuffer());
    
    logInfo("[ATS_ANALYZE]", "Input received", {
      route: "api/ats/analyze",
      cvLength: buffer.length,
      offerLength: jobDescription.length
    });

    const result = await processATSAnalysis(buffer, jobDescription);

    if (!isPremium && !hasCredits && !hasUsedTrial) {
      await supabase
        .from("user_usage")
        .update({ has_used_free_trial: true })
        .eq("user_id", user.id);

      const lockedItem = { subject: "locked", dimension: "locked", reason: "[CONTENU PREMIUM BLOQUÉ]", impact: "[CONTENU PREMIUM BLOQUÉ]", reformulation: "Passez PRO pour débloquer." };
      const lockedBlueprint = { priority: "locked", rec: "[CONTENU PREMIUM BLOQUÉ]", leverage: "Passez PRO pour débloquer l'analyse stratégique complète." };

      return NextResponse.json({
        ...result,
        recruiterDoubts: [
          ...(result.recruiterDoubts && result.recruiterDoubts.length > 0 ? [result.recruiterDoubts[0]] : []),
          ...Array(Math.max(0, (result.recruiterDoubts?.length || 1) - 1)).fill(lockedItem)
        ],
        strategicBlueprint: [
          ...(result.strategicBlueprint && result.strategicBlueprint.length > 0 ? [result.strategicBlueprint[0]] : []),
          ...Array(Math.max(0, (result.strategicBlueprint?.length || 1) - 1)).fill(lockedBlueprint)
        ],
        isPartial: true,
      });
    }

    if (!isPremium && hasCredits) {
      await supabase.rpc("consume_credit", { user_id: user.id, amount: 1 });
    }

    return NextResponse.json({ ...result, isPartial: false });
  } catch (error: any) {
    logError("[ATS_ANALYZE_ERROR]", error, {
      route: "api/ats/analyze"
    });
    return NextResponse.json({ error: "Échec de l'analyse" }, { status: 500 });
  }
}
