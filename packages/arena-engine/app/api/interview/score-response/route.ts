import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { ResponseScoreSchema } from "@/lib/interview/scoring";
import { supabaseAdmin } from "@/lib/supabase";
import { mistralModel } from "@/lib/mistral"; // Keep consistency with project if preferred, but I'll use OpenAI if available. Since it's easier to use Vercel AI SDK for structured JSON:

const ScoreRequestSchema = z.object({
  sessionId: z.string().uuid(),
  questionIndex: z.number().int().min(0).max(2),
  transcription: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ScoreRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
    }

    const { sessionId, questionIndex, transcription } = parsed.data;

    // Récupération du contexte depuis Supabase
    const { data: session, error } = await supabaseAdmin
      .from("interview_sessions")
      .select("interview_context, job_description, questions")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    const questionsArray = typeof session.questions === "string" ? JSON.parse(session.questions) : session.questions;
    const questionText = questionsArray[questionIndex];
    
    // In our implementation, cv context is in interview_context.cvContext and job is job_description
    const parsed_cv = JSON.parse(session.interview_context || "{}").cvContext || {};
    const job_target = JSON.parse(session.job_description || "{}");

    // Prompt contraint
    const systemPrompt = `Tu es un évaluateur d'entretien d'embauche expert et rigoureux.

RÈGLE ABSOLUE : Tu ne peux évaluer que sur la base des données fournies.
- Tu n'inventes aucune attente.
- Tu ne complimentes pas par défaut.
- Tu détectes les incohérences entre ce que le candidat dit à l'oral et ce qui est écrit dans son CV.
- Si le candidat mentionne un chiffre différent de son CV, c'est une CONTRADICTION.
- Si le candidat dit une chose non présente dans son CV, c'est une potentielle INFLATION.`;

    const userPrompt = `CONTEXTE DE LA SESSION :

CV STRUCTURÉ DU CANDIDAT :
${JSON.stringify(parsed_cv, null, 2)}

OFFRE CIBLÉE :
${JSON.stringify(job_target, null, 2)}

QUESTION POSÉE (index ${questionIndex}) :
"${questionText}"

TRANSCRIPTION DE LA RÉPONSE DU CANDIDAT :
"${transcription}"

TASK : Évalue cette réponse. Compare chaque affirmation du candidat aux données factuelles de son CV.
Calcule les scores :
- coherence (0-100) : La réponse est-elle cohérente avec le CV ?
- depth (0-100) : Le candidat apporte-t-il des détails concrets et spécifiques ?
- clarity (0-100) : La réponse est-elle structurée et compréhensible ?
- overall (0-100) : Score pondéré (coherence×0.4 + depth×0.35 + clarity×0.25)

Retourne le JSON strict selon le schéma demandé.`;

    const { object: scoreData } = await generateObject({
      model: mistralModel,
      schema: ResponseScoreSchema,
      temperature: 0.1,
      system: systemPrompt,
      prompt: userPrompt
    });

    // Persistance en base
    await supabaseAdmin
      .from("interview_responses")
      .insert({
        session_id: sessionId,
        question_index: questionIndex,
        question_text: questionText,
        transcription,
        score: scoreData as any,
      });

    return NextResponse.json(scoreData);
  } catch (error) {
    console.error("[Score] Error:", error);
    return NextResponse.json({ error: "Erreur de scoring." }, { status: 500 });
  }
}
