import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { mistralModel } from "@/lib/mistral";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateObject } from "ai";
import { parseCVToStructure } from "@/lib/pdf/cv-parser";

const OPTIMIZE_PROMPT = `Tu es un expert RH senior.
Analyse ce CV et retourne UNIQUEMENT un JSON valide avec cette structure :
{
  "optimizedText": "le CV complet réécrit",
  "improvements": [{"type": "strength|addition|rewrite|warning", "section": "Experience", "description": "..."}],
  "atsScore": {"before": 45, "after": 85},
  "keywords": {"added": ["keyword1"], "existing": ["keyword2"]}
}
`;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const RequestSchema = z.object({
      file: z.custom<Blob>(
        (val) => val instanceof Blob || (typeof val === "object" && val !== null),
        { message: "Le fichier CV est requis." }
      ),
    });

    const parsed = RequestSchema.safeParse({ file: rawFile });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const file = parsed.data.file as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    let originalText = "";

    if (file.type === "application/pdf") {
      const pdf = (await import("pdf-parse")).default;
      const data = await pdf(buffer);
      originalText = data.text;
    } else {
      originalText = buffer.toString("utf-8");
    }

    const CvAnalysisSchema = z.object({
      optimizedText: z.string().max(20000),
      improvements: z.array(z.object({
        type:        z.enum(["strength", "addition", "rewrite", "warning"]),
        section:     z.string().max(100),
        description: z.string().max(2000),
      })).max(15),
      atsScore: z.object({
        before: z.number().min(0).max(100),
        after:  z.number().min(0).max(100),
      }).refine(
        (d) => d.after >= d.before,
        { message: "Score après optimisation doit être >= score avant." }
      ),
      keywords: z.object({
        added:    z.array(z.string().max(100)).max(30),
        existing: z.array(z.string().max(100)).max(30),
      }),
    });

    const { object: optimizationData } = await generateObject({
      model: mistralModel,
      schema: CvAnalysisSchema,
      temperature: 0.2,
      prompt: OPTIMIZE_PROMPT + "\n\nCV:\n" + originalText,
    });
    const cvData = await parseCVToStructure(optimizationData.optimizedText);

    const fullResult = {
      originalText,
      optimizedText: optimizationData.optimizedText,
      cvData,
      improvements: optimizationData.improvements,
      atsScore: optimizationData.atsScore,
      keywords: optimizationData.keywords,
    };

    if (!isPremium && !hasCredits && !hasUsedTrial) {
      await supabase
        .from("user_usage")
        .update({ has_used_free_trial: true })
        .eq("user_id", user.id);

      const lockedItem = { type: "locked", section: "locked", description: "[CONTENU PREMIUM BLOQUÉ]" };
      return NextResponse.json({
        ...fullResult,
        improvements: [
          fullResult.improvements[0],
          ...Array(Math.max(0, fullResult.improvements.length - 1)).fill(lockedItem)
        ],
        isPartial: true,
      });
    }

    if (!isPremium && hasCredits) {
      await supabase.rpc("consume_credit", { user_id: user.id, amount: 1 });
    }

    return NextResponse.json({ ...fullResult, isPartial: false });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
