import { NextRequest, NextResponse }      from "next/server";
import { generateObject }                  from "ai";
import { z }                              from "zod";
import { mistralModel }                   from "@/lib/mistral";
import { createClient }                   from "@/lib/supabase/server";
import {
  PremiumReportSchema,
  computeReadinessLevel,
  computeOverallScore,
} from "@/lib/interview/schemas/premium-report.schema";

// ── Input validation ──────────────────────────────────────────────────────────
const RequestSchema = z.object({
  sessionId: z.string().uuid(),
});

// ── Schéma LLM : signaux bruts uniquement, pas de readiness_level ─────────────
// Le LLM extrait — TypeScript calcule. Jamais l'inverse.
const LLMSignalsSchema = PremiumReportSchema.omit({ readiness_level: true });

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
      return NextResponse.json({ error: "sessionId invalide." }, { status: 400 });
    }

    // 3. Charge la session (RLS garantit l'ownership)
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("id, parsed_cv, job_target, questions, interview_responses(*)")
      .eq("id", body.data.sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    // 4. Idempotence — rapport déjà généré
    if (session.final_report) {
      return NextResponse.json(session.final_report);
    }

    // 5. Vérifie que les 3 réponses existent
    const responses = session.interview_responses ?? [];
    if (responses.length < 3) {
      return NextResponse.json(
        { error: `${responses.length}/3 questions répondues.` },
        { status: 422 }
      );
    }

    // 6. Génération LLM — signaux bruts uniquement
    const { object: signals } = await generateObject({
      model:       mistralModel,
      schema:      LLMSignalsSchema,
      temperature: 0.15,
      system: `Tu es un évaluateur d'entretien expert et rigoureux.

RÈGLES ABSOLUES :
- Tu évalues uniquement ce qui est présent dans les transcriptions.
- dimension_scores : chiffres entre 0 et 100, basés sur des critères observables.
- Tu ne génères pas le readiness_level (calculé séparément).
- cv_coherence.discrepancies : uniquement des faits vérifiables, pas des suppositions.
- Zéro compliment vague. Zéro "bien essayé". Uniquement des observations factuelles.`,

      prompt: `CV DU CANDIDAT :
${JSON.stringify(session.parsed_cv, null, 2)}

OFFRE CIBLÉE :
${JSON.stringify(session.job_target, null, 2)}

QUESTIONS ET RÉPONSES :
${responses
  .sort((a: { question_index: number }, b: { question_index: number }) =>
    a.question_index - b.question_index
  )
  .map((r: { question_index: number; question_text: string; transcription: string }) => `
Q${r.question_index + 1} : "${r.question_text}"
Réponse : "${r.transcription}"
`)
  .join("\n")}

Évalue les 4 dimensions (structure, specificity, impact, adaptability) 
sur les réponses fournies. Compare les affirmations orales au CV écrit.
Retourne le JSON selon le schéma.`,
    });

    // 7. Calcul déterministe — TypeScript, pas le LLM
    const readiness_level = computeReadinessLevel(signals.dimension_scores);
    const overall_score   = computeOverallScore(signals.dimension_scores);

    // 8. Assemblage final avec validation stricte
    const reportValidation = PremiumReportSchema.safeParse({
      ...signals,
      readiness_level,
    });

    if (!reportValidation.success) {
      console.error("[PremiumReport] Final Zod validation failed:", reportValidation.error);
      return NextResponse.json(
        { error: "Rapport généré invalide." },
        { status: 500 }
      );
    }

    const finalReport = { ...reportValidation.data, overall_score };

    // 9. Persistance
    await supabase
      .from("interview_sessions")
      .update({
        final_report:  finalReport,
        completed_at:  new Date().toISOString(),
      })
      .eq("id", body.data.sessionId);

    return NextResponse.json(finalReport);

  } catch (error) {
    console.error("[PremiumReport] Error:", error);
    return NextResponse.json({ error: "Erreur de génération." }, { status: 500 });
  }
}
