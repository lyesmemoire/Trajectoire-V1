export const dynamic = "force-dynamic";

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateObject } from "ai";
import { mistralModel } from "@/lib/mistral";
import { InterviewPreparationSchema } from "@/types/cv";
import { createChildLogger, logError } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

const log = createChildLogger({ component: "interview-generate-questions-api" });

const GENERATE_PROMPT = `Tu es un recruteur senior extrêmement précis.

CONTEXTE :
Voici le CV structuré du candidat :
{ParsedCV_JSON}

Voici l'offre d'emploi ciblée :
{JobTarget_JSON}

Voici les compétences manquantes détectées :
{MissingSkills_Array}

{Munition_Context}

MISSION :
Génère EXACTEMENT 3 questions d'entretien ciblées et non génériques.

CONTRAINTES STRICTES :
1. Question 1 → doit cibler la principale vulnérabilité du CV (compétence manquante ou faible).
2. Question 2 → doit demander des détails techniques ou chiffrés sur le bullet le plus fort du CV.
3. Question 3 → doit être comportementale/situationnelle, directement liée au poste visé.
4. Chaque question doit contenir un élément précis du CV ou de l'offre (technologie, chiffre, mission).
5. Interdiction absolue de poser des questions génériques (ex: "Parlez-moi de vous").
6. Ne jamais inventer une compétence ou expérience absente du CV.
7. Si aucune vulnérabilité claire n'existe, cibler une compétence secondaire.
`;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const RequestSchema = z.object({
      cvData: z.object({
        personalInfo: z.object({
          name: z.string().min(1).optional(),
        }).passthrough().optional(),
      }).passthrough(),
      jobTarget: z.object({
        title: z.string().min(1).max(200),
      }).passthrough(),
      missingSkills: z.array(z.string().max(100)).max(20).default([]),
      atsReportId:   z.string().uuid().optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let munitionContext = "";

    if (parsed.data.atsReportId) {
      const supabase = await createSupabaseServerClient();
      const { data: atsReport } = await supabase
        .from("premium_ats_reports")
        .select("munition_pack, overall_score")
        .eq("id", parsed.data.atsReportId)
        .eq("user_id", user.id)
        .single();

      if (atsReport?.munition_pack) {
        const pack = atsReport.munition_pack as {
          munitions: Array<{
            suggestedQuestion: string;
            evidence?:         string;
            severity?:         string;
          }>;
          context?: {
            overallATS: number;
            riskLevel:  string;
          };
        };

        const topMunition = (pack.munitions ?? [])[0];

        if (topMunition) {
          munitionContext = `
CONTEXTE ANALYSE ATS (score global : ${atsReport.overall_score}/100) :
Niveau de risque recruteur : ${pack.context?.riskLevel ?? "MOYEN"}

INSTRUCTION ABSOLUE POUR Q1 :
La question de vulnérabilité doit être exactement celle-ci :
"${topMunition.suggestedQuestion}"
${topMunition.evidence
  ? \`Preuve dans le CV à mentionner : "\${topMunition.evidence}"\`
  : ""}

Ne pas reformuler cette question en version générique.
Elle est basée sur des faits extraits du CV réel.
`;
        }
      }
    }

    const dynamicPrompt = GENERATE_PROMPT
      .replace("{ParsedCV_JSON}",       JSON.stringify(parsed.data.cvData))
      .replace("{JobTarget_JSON}",      JSON.stringify(parsed.data.jobTarget))
      .replace("{MissingSkills_Array}", JSON.stringify(parsed.data.missingSkills))
      .replace("{Munition_Context}",    munitionContext);

    const { object } = await generateObject({
      model: mistralModel,
      temperature: 0.3,
      schema: InterviewPreparationSchema,
      prompt: dynamicPrompt,
    });

    const corpusText = (JSON.stringify(parsed.data.cvData) + " " + JSON.stringify(parsed.data.jobTarget)).toLowerCase();
    const corpusWords = new Set(corpusText.split(/\\W+/).filter(w => w.length > 4));

    for (const q of object.questions) {
      const qWords = q.toLowerCase().split(/\\W+/).filter(w => w.length > 4);
      const hasIntersection = qWords.some(w => corpusWords.has(w));
      
      if (!hasIntersection) {
        throw new Error("Sécurité Anti-Générique : Le LLM a généré une question trop générique sans lien avec le CV ou l'Offre.");
      }
    }

    const { data: session, error: dbError } = await supabaseAdmin
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        job_title: parsed.data.jobTarget.title,
        job_description: JSON.stringify(parsed.data.jobTarget),
        interview_context: JSON.stringify({ cvContext: parsed.data.cvData }),
        questions: JSON.stringify(object.questions),
        status: "in_progress",
        ats_report_id: parsed.data.atsReportId ?? null,
      })
      .select("id")
      .single();

    if (dbError || !session) {
      logError("[Interview/GenerateQuestions] Erreur DB", dbError);
      throw new Error("Erreur de création de la session d'entretien.");
    }

    log.info({
      event: "interview_session_created",
      userId: user.id,
      sessionId: session.id
    });

    return NextResponse.json({ sessionId: session.id, preparation: object });

  } catch (error) {
    logError("[Interview/GenerateQuestions] Erreur", error);
    captureError(error, { component: "interview-generate-questions-api" });
    
    return NextResponse.json(
      { error: "Erreur serveur lors de la génération des questions" },
      { status: 500 }
    );
  }
}
