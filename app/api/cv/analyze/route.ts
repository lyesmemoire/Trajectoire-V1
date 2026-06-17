import { NextRequest, NextResponse } from "next/server";
import { mistralModel } from "@/lib/mistral";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateText } from "ai";
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let originalText = "";

    if (file.type === "application/pdf") {
      // Dynamic import to handle CJS/ESM issues in App Router
      const pdf = (await import("pdf-parse")).default;
      const data = await pdf(buffer);
      originalText = data.text;
    } else {
      originalText = buffer.toString("utf-8");
    }

    const { text } = await generateText({
      model: mistralModel,
      temperature: 0.2,
      prompt: OPTIMIZE_PROMPT + "\n\nCV:\n" + originalText,
    });

    const optimizationData = JSON.parse(
      text
        .trim()
        .replace(/^```json/, "")
        .replace(/```$/, ""),
    );
    const cvData = await parseCVToStructure(optimizationData.optimizedText);

    return NextResponse.json({
      originalText,
      optimizedText: optimizationData.optimizedText,
      cvData,
      improvements: optimizationData.improvements,
      atsScore: optimizationData.atsScore,
      keywords: optimizationData.keywords,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
