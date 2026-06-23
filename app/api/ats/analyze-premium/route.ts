import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { processPremiumATSAnalysis } from "@/lib/ats/premium-orchestrator";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

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
    const result = await processPremiumATSAnalysis(buffer, jobDescription);

    let reportId: string | null = null;

    if (user) {
      const { data: savedReport, error: saveError } = await supabase
        .from("premium_ats_reports")
        .insert({
          user_id:       user.id,
          cv_file_name:  file.name ?? null,
          job_offer_raw: jobDescription,
          overall_score: result.score?.overall ?? null,
          ats_result:    result,
          munition_pack: result.munitionPack ?? null,
        })
        .select("id")
        .single();

      if (saveError) {
        console.error("[PremiumATS] Persistence failed:", saveError.message);
      } else {
        reportId = savedReport?.id ?? null;
      }
    }

    return NextResponse.json({
      ...result,
      reportId,
    });
  } catch (error: any) {
    console.error("[PREMIUM ATS API ERROR]:", error);
    return NextResponse.json(
      { error: "Échec de l'analyse ultra-sophistiquée" },
      { status: 500 },
    );
  }
}
