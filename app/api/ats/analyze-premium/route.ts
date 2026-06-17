import { NextRequest, NextResponse } from "next/server";
import { processPremiumATSAnalysis } from "@/lib/ats/premium-orchestrator";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
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
    const result = await processPremiumATSAnalysis(buffer, jobDescription);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[PREMIUM ATS API ERROR]:", error);
    return NextResponse.json(
      { error: "Échec de l'analyse ultra-sophistiquée" },
      { status: 500 },
    );
  }
}
