import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";
import { mistralModel } from "@/lib/mistral";
import { generateObject } from "ai";

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

const RequestSchema = z.object({
  session_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createSupabaseServerClient();
    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { session_id } = parsed.data;

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

    // NOTE: scores calculés par le LLM — acceptable pour ce module démo sans auth.
    // À migrer vers calcul TypeScript si ce module devient une feature core.
    const AnalysisSchema = z.object({
      scores: z.object({
        clarity:    z.number().min(0).max(100),
        relevance:  z.number().min(0).max(100),
        confidence: z.number().min(0).max(100),
        structure:  z.number().min(0).max(100),
        depth:      z.number().min(0).max(100),
        finalScore: z.number().min(0).max(100),
      }),
      strengths:    z.array(z.string().max(500)).max(10),
      improvements: z.array(z.string().max(500)).max(10),
      detailedFeedback: z.array(z.object({
        question: z.string().max(1000),
        score:    z.number().min(0).max(100),
        comment:  z.string().max(2000),
      })).max(20),
      level: z.preprocess(
        (val) => {
          if (typeof val !== "string") return val;
          const map: Record<string, string> = {
            "débutant":      "Débutant",
            "debutant":      "Débutant",
            "intermédiaire": "Intermédiaire",
            "intermediaire": "Intermédiaire",
            "confirmé":      "Confirmé",
            "confirme":      "Confirmé",
            "expert":        "Expert",
          };
          return map[val.toLowerCase().trim()] ?? val;
        },
        z.enum(["Débutant", "Intermédiaire", "Confirmé", "Expert"])
      ),
      tips: z.array(z.string().max(500)).max(10),
    });

    const { object: parsedData } = await generateObject({
      model: mistralModel,
      schema: AnalysisSchema,
      temperature: 0.1,
      prompt: `${ANALYSIS_PROMPT}\n\nSession:\n${compact}`,
    });

    await supabase
      .from("interview_sessions")
      .update({
        analysis: parsedData,
        score: parsedData.scores.finalScore,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", session_id);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
