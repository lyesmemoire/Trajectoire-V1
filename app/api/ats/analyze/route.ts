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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "CV et Description requis" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    logInfo("[ATS_ANALYZE]", "Input received", {
      route: "api/ats/analyze",
      cvLength: buffer.length,
      offerLength: jobDescription.length
    });

    const result = await processATSAnalysis(buffer, jobDescription);

    return NextResponse.json(result);
  } catch (error: any) {
    logError("[ATS_ANALYZE_ERROR]", error, {
      route: "api/ats/analyze"
    });
    return NextResponse.json({ error: "Échec de l'analyse" }, { status: 500 });
  }
}
