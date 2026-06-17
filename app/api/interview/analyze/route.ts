import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";

export const dynamic = "force-dynamic";

const ANALYSIS_PROMPT = `Tu es un coach expert en entretien d'embauche.
Analyse les questions et réponses ci-dessous.
Retourne UNIQUEMENT un JSON valide :
{
  "scores": {
    "clarity": 0-100,
    "relevance": 0-100,
    "confidence": 0-100,
    "structure": 0-100,
    "depth": 0-100,
    "finalScore": 0-100
  },
  "strengths": string[],
  "improvements": string[],
  "detailedFeedback": [{"question": "string", "score": 0-100, "comment": "string"}],
  "level": "Débutant|Intermédiaire|Confirmé|Expert",
  "tips": string[]
}`;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createSupabaseServerClient();
    const { session_id } = await req.json();

    const { data: session } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (!session)
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 },
      );

    const compact = session.questions
      .map((q: string, i: number) => `Q: ${q}\nR: ${session.answers[i]}`)
      .join("\n\n");

    const { text } = await generateText({
      model: mistralModel,
      temperature: 0.1,
      prompt: `${ANALYSIS_PROMPT}\n\nSession:\n${compact}`,
    });

    const parsed = JSON.parse(
      text
        .trim()
        .replace(/^```json/, "")
        .replace(/```$/, ""),
    );

    await supabase
      .from("interview_sessions")
      .update({
        analysis: parsed,
        score: parsed.scores.finalScore,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", session_id);

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
