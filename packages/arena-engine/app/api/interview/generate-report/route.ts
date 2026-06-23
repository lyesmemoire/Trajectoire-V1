import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { mistralModel } from "@/lib/mistral";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  FinalReportSchema,
  PersistedResponseSchema,
  computeAggregateScores,
  computeVerdict,
  hasCriticalInconsistency,
  type FinalReport,
} from "@/lib/interview/report";

const RequestSchema = z.object({
  sessionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "sessionId invalide." }, { status: 400 });
    }

    const { sessionId } = parsed.data;

    // ── 1. Charge la session + les 3 réponses ──────────────────────────────
    const [sessionResult, responsesResult] = await Promise.all([
      supabaseAdmin
        .from("interview_sessions")
        .select("interview_context, job_description, questions, analysis")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single(),
      supabaseAdmin
        .from("interview_responses")
        .select("question_index, question_text, transcription, score")
        .eq("session_id", sessionId)
        .order("question_index"),
    ]);

    if (sessionResult.error || !sessionResult.data) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    // Rapport déjà généré → retour immédiat (idempotence)
    if (sessionResult.data.analysis) {
      return NextResponse.json(sessionResult.data.analysis);
    }

    const responses = responsesResult.data ?? [];

    if (responses.length < 3) {
      return NextResponse.json(
        { error: `Seulement ${responses.length}/3 questions répondues.` },
        { status: 422 }
      );
    }

    // Validation Zod des réponses persistées
    const validatedResponses = responses.map((r) => {
      const result = PersistedResponseSchema.safeParse(r);
      if (!result.success) throw new Error("Réponse corrompue en base.");
      return result.data;
    });

    // ── 2. Calculs déterministes ───────────────────────────────────────────
    const aggregateScores = computeAggregateScores(validatedResponses);
    const criticalInconsistency = hasCriticalInconsistency(validatedResponses);
    const verdict = computeVerdict(aggregateScores.overall, criticalInconsistency);

    // Parse le contexte CV et Job depuis les colonnes existantes
    const parsed_cv = JSON.parse(sessionResult.data.interview_context || "{}").cvContext || {};
    const job_target = JSON.parse(sessionResult.data.job_description || "{}");

    // ── 3. LLM uniquement pour la narration qualitative ───────────────────
    const NarrativeSchema = FinalReportSchema.pick({
      validated_strengths: true,
      critical_gaps: true,
      action_plan: true,
      executive_summary: true,
    });

    const { object: narrative } = await generateObject({
      model: mistralModel,
      temperature: 0.2,
      schema: NarrativeSchema,
      prompt: `Tu es un coach d'entretien expert. Tu dois rédiger la partie narrative d'un rapport d'entretien.

RÈGLES ABSOLUES :
- Tu ne génères aucun score (ils sont calculés mathématiquement ailleurs).
- Chaque "gap" doit citer une vraie réponse du candidat ou un vrai élément du CV.
- Chaque "cv_bullet_to_fix" doit être un extrait textuel exact du CV fourni.
- Pas de compliments vagues. Pas de "Bien essayé". Uniquement des faits.
- L'executive_summary doit être une seule phrase, directe, sans adverbes flatteurs.

DONNÉES :

CV STRUCTURÉ :
${JSON.stringify(parsed_cv, null, 2)}

OFFRE CIBLÉE :
${JSON.stringify(job_target, null, 2)}

RÉPONSES ET SCORES PAR QUESTION :
${validatedResponses
  .map(
    (r) => `
--- Question ${r.question_index + 1} ---
Question : "${r.question_text}"
Réponse : "${r.transcription}"
Alertes factuelles : ${JSON.stringify(r.score.factual_alerts)}
Mots-clés manquants : ${JSON.stringify(r.score.missing_keywords)}
`
  )
  .join("\n")}

VERDICT CALCULÉ : ${verdict}
SCORE GLOBAL : ${aggregateScores.overall}/100
INCOHÉRENCE CRITIQUE : ${criticalInconsistency}

Génère la partie narrative du rapport.`,
    });

    // ── 4. Assemblage final ────────────────────────────────────────────────
    const finalReport: FinalReport = {
      verdict,
      aggregate_scores: aggregateScores,
      critical_inconsistency: criticalInconsistency,
      ...narrative,
    };

    // Validation globale avant persistance
    const reportValidation = FinalReportSchema.safeParse(finalReport);
    if (!reportValidation.success) {
      console.error("[Report] Final validation failed:", reportValidation.error);
      return NextResponse.json(
        { error: "Le rapport généré est invalide." },
        { status: 500 }
      );
    }

    // ── 5. Persistance dans la session (colonne analysis + status) ────────
    await supabaseAdmin
      .from("interview_sessions")
      .update({
        analysis: reportValidation.data as any,
        final_score: reportValidation.data.aggregate_scores.overall,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json(reportValidation.data);
  } catch (error) {
    console.error("[Report] Error:", error);
    return NextResponse.json({ error: "Erreur de génération du rapport." }, { status: 500 });
  }
}
