import { NextRequest, NextResponse }    from "next/server";
import { generateObject }               from "ai";
import { z }                           from "zod";
import { mistralModel }                from "@/lib/mistral";
import { createClient }                from "@/lib/supabase/server";
import {
  FeedbackSignalsSchema,
  FeedbackResponseSchema,
  computeFeedbackScore,
} from "@/lib/interview/schemas/feedback.schema";

// ── Input ─────────────────────────────────────────────────────────────────────
const RequestSchema = z.object({
  sessionId:     z.string().uuid(),
  questionIndex: z.number().int().min(0).max(9),
  transcription: z.string().min(10).max(8000),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // 2. Input
    const body = RequestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: body.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId, questionIndex, transcription } = body.data;

    // 3. Session + contexte (RLS ownership)
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("parsed_cv, job_target, questions")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    const question = session.questions?.[questionIndex];
    if (!question) {
      return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
    }

    // 4. Extraction des signaux — LLM ne score JAMAIS
    const { object: signals } = await generateObject({
      model:       mistralModel,
      schema:      FeedbackSignalsSchema,
      temperature: 0.1,
      system: `Tu es un évaluateur d'entretien expert. Tu extrais des signaux 
qualitatifs depuis la réponse d'un candidat. Tu ne calcules jamais de score.

RÈGLES ABSOLUES :
- observations.cv_alignment.contradictions : uniquement si un chiffre ou fait 
  oral contredit explicitement le CV fourni. Zéro supposition.
- observations.content.concrete_count : compte les exemples chiffrés, noms de 
  projets, technologies citées, dates, budgets. Pas d'estimation.
- recommendations : max 3, ordonnées par impact décroissant, actionnables en 
  moins d'une semaine de préparation.
- summary : une phrase. Pas "Bien essayé". Un fait observable.`,

      prompt: `CV DU CANDIDAT :
${JSON.stringify(session.parsed_cv, null, 2)}

OFFRE CIBLÉE :
${JSON.stringify(session.job_target, null, 2)}

QUESTION (${questionIndex + 1}) :
"${question}"

TRANSCRIPTION DE LA RÉPONSE :
"${transcription}"

Extrais les signaux qualitatifs selon le schéma.
Tu n'émets aucun score numérique — c'est calculé séparément.`,
    });

    // 5. Score déterministe — TypeScript pur
    const scores = computeFeedbackScore(signals);

    // 6. Assemblage + validation finale
    const feedbackValidation = FeedbackResponseSchema.safeParse({
      scores,
      signals,
      computed_at: new Date().toISOString(),
    });

    if (!feedbackValidation.success) {
      console.error("[Feedback] Final validation failed:", feedbackValidation.error);
      return NextResponse.json(
        { error: "Feedback généré invalide." },
        { status: 500 }
      );
    }

    // 7. Persistance — on met à jour interview_responses avec le feedback
    const { error: updateError } = await supabase
      .from("interview_responses")
      .update({
        score: {
          ...feedbackValidation.data.scores,
          signals:     feedbackValidation.data.signals,
          computed_at: feedbackValidation.data.computed_at,
        },
      })
      .eq("session_id", sessionId)
      .eq("question_index", questionIndex);

    if (updateError) {
      // Non bloquant — on retourne quand même le feedback
      console.error("[Feedback] Persistence failed:", updateError);
    }

    return NextResponse.json(feedbackValidation.data);

  } catch (error) {
    console.error("[Feedback] Error:", error);
    return NextResponse.json({ error: "Erreur de feedback." }, { status: 500 });
  }
}
