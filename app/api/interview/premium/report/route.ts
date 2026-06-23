export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { mistralModel } from "@/lib/mistral";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import {
  PremiumReportSchema,
  computeOverallScore,
  computeReadinessLevel,
} from "@/lib/interview/schemas/premium-report.schema";

const RequestSchema = z.object({
  sessionId: z.string().uuid(),
});

const LLMSignalsSchema = PremiumReportSchema.omit({ readiness_level: true });

const InterviewResponseRowSchema = z.object({
  question_index: z.number().int(),
  question_text: z.string(),
  transcription: z.string(),
});

type InterviewResponseRow = z.infer<typeof InterviewResponseRowSchema>;

function parseSessionContext(interviewContext: unknown, jobDescription: string | null) {
  let parsedCv: Record<string, unknown> = {};
  let jobTarget: Record<string, unknown> = {};

  if (typeof interviewContext === "string") {
    try {
      const parsed = JSON.parse(interviewContext) as { cvContext?: Record<string, unknown> };
      parsedCv = parsed.cvContext ?? {};
    } catch {
      parsedCv = {};
    }
  } else if (interviewContext && typeof interviewContext === "object") {
    const ctx = interviewContext as { cvContext?: Record<string, unknown> };
    parsedCv = ctx.cvContext ?? (interviewContext as Record<string, unknown>);
  }

  if (jobDescription) {
    try {
      jobTarget = JSON.parse(jobDescription) as Record<string, unknown>;
    } catch {
      jobTarget = { raw: jobDescription };
    }
  }

  return { parsedCv, jobTarget };
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const body = RequestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json({ error: "sessionId invalide." }, { status: 400 });
    }

    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select(
        `
        id,
        interview_context,
        job_description,
        final_report,
        interview_responses (
          question_index,
          question_text,
          transcription
        )
      `,
      )
      .eq("id", body.data.sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    if (session.final_report) {
      return NextResponse.json(session.final_report);
    }

    const rawResponses = (session.interview_responses ?? []) as unknown[];
    const responses: InterviewResponseRow[] = [];

    for (const row of rawResponses) {
      const parsed = InterviewResponseRowSchema.safeParse(row);
      if (!parsed.success) {
        return NextResponse.json({ error: "Réponse corrompue en base." }, { status: 500 });
      }
      responses.push(parsed.data);
    }

    if (responses.length < 3) {
      return NextResponse.json(
        { error: `${responses.length}/3 questions répondues.` },
        { status: 422 },
      );
    }

    const { parsedCv, jobTarget } = parseSessionContext(
      session.interview_context,
      session.job_description,
    );

    const sortedResponses = [...responses].sort(
      (a, b) => a.question_index - b.question_index,
    );

    const { object: signals } = await generateObject({
      model: mistralModel,
      schema: LLMSignalsSchema,
      temperature: 0.15,
      system: `Tu es un évaluateur d'entretien expert et rigoureux.

RÈGLES ABSOLUES :
- Tu évalues uniquement ce qui est présent dans les transcriptions.
- dimension_scores : chiffres entre 0 et 100, basés sur des critères observables.
- Tu ne génères pas le readiness_level (calculé séparément).
- cv_coherence.discrepancies : uniquement des faits vérifiables, pas des suppositions.
- Zéro compliment vague. Zéro "bien essayé". Uniquement des observations factuelles.`,

      prompt: `CV DU CANDIDAT :
${JSON.stringify(parsedCv, null, 2)}

OFFRE CIBLÉE :
${JSON.stringify(jobTarget, null, 2)}

QUESTIONS ET RÉPONSES :
${sortedResponses
  .map(
    (r) => `
Q${r.question_index + 1} : "${r.question_text}"
Réponse : "${r.transcription}"
`,
  )
  .join("\n")}

Évalue les 4 dimensions (structure, specificity, impact, adaptability)
sur les réponses fournies. Compare les affirmations orales au CV écrit.
Retourne le JSON selon le schéma.`,
    });

    const readiness_level = computeReadinessLevel(signals.dimension_scores);
    const overall_score = computeOverallScore(signals.dimension_scores);

    const reportValidation = PremiumReportSchema.safeParse({
      ...signals,
      readiness_level,
    });

    if (!reportValidation.success) {
      console.error("[PremiumReport] Final Zod validation failed:", reportValidation.error);
      return NextResponse.json({ error: "Rapport généré invalide." }, { status: 500 });
    }

    const finalReport = { ...reportValidation.data, overall_score };

    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({
        final_report: finalReport,
        completed_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", body.data.sessionId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[PremiumReport] Persist failed:", updateError);
      return NextResponse.json({ error: "Erreur de sauvegarde." }, { status: 500 });
    }

    return NextResponse.json(finalReport);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    console.error("[PremiumReport] Error:", error);
    return NextResponse.json({ error: "Erreur de génération." }, { status: 500 });
  }
}
