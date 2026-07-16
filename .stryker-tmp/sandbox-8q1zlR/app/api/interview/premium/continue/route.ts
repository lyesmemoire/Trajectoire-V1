// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { mistralModel } from "@/lib/mistral";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { premiumContinueLimiter } from "@/lib/security/rate-limit";
import { ContinueSessionSchema } from "@/lib/interview/schemas/continue-session.schema";

const RequestSchema = z.object({
  sessionId: z.string().uuid(),
  transcription: z.string().min(10).max(5000),
  questionIndex: z.number().int().min(0).max(9),
});

const InterviewResponseRowSchema = z.object({
  question_index: z.number().int(),
  question_text: z.string(),
  transcription: z.string(),
});

type InterviewResponseRow = z.infer<typeof InterviewResponseRowSchema>;

const QuestionsSchema = z.array(z.string());

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
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success: rateLimitOk } = await premiumContinueLimiter.limit(
      `premium-continue:${user.id}`,
    );
    if (!rateLimitOk) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = RequestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: body.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, transcription, questionIndex } = body.data;
    const supabase = await createServerClient();

    const { data: session, error } = await supabase
      .from("interview_sessions")
      .select(
        `
        interview_context,
        job_description,
        questions,
        interview_responses (
          question_index,
          question_text,
          transcription
        )
      `,
      )
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    const questionsResult = QuestionsSchema.safeParse(session.questions ?? []);
    if (!questionsResult.success) {
      return NextResponse.json({ error: "Questions invalides." }, { status: 500 });
    }

    const questions = questionsResult.data;
    const currentQuestion = questions[questionIndex];

    if (!currentQuestion) {
      return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
    }

    const isLastQuestion = questionIndex >= questions.length - 1;

    const rawResponses = (session.interview_responses ?? []) as unknown[];
    const previousResponses: InterviewResponseRow[] = [];

    for (const row of rawResponses) {
      const parsed = InterviewResponseRowSchema.safeParse(row);
      if (parsed.success && parsed.data.question_index < questionIndex) {
        previousResponses.push(parsed.data);
      }
    }

    previousResponses.sort((a, b) => a.question_index - b.question_index);

    const { parsedCv, jobTarget } = parseSessionContext(
      session.interview_context,
      session.job_description,
    );

    const { object: continuation } = await generateObject({
      model: mistralModel,
      schema: ContinueSessionSchema,
      temperature: 0.2,
      system: `Tu es un interviewer expérimenté qui conduit un entretien structuré.

RÈGLES :
- ai_response : réaction directe à ce que le candidat vient de dire (1-2 phrases max).
- follow_up.type : choisis DEEP_DIVE si la réponse est incomplète, CHALLENGE si un
  chiffre ne colle pas avec le CV, NEXT_QUESTION si la réponse est suffisante,
  CLOSING si c'était la dernière question.
- instant_feedback.one_line : observation factuelle — pas "super réponse", mais
  "Vous n'avez pas mentionné le budget alloué que vous citez dans votre CV."
- session_complete : true uniquement si questionIndex est la dernière question
  ET la réponse est suffisante.`,

      prompt: `CV : ${JSON.stringify(parsedCv)}

OFFRE : ${JSON.stringify(jobTarget)}

QUESTION EN COURS (${questionIndex + 1}/${questions.length}) :
"${currentQuestion}"

RÉPONSE DU CANDIDAT :
"${transcription}"

CONTEXTE DES ÉCHANGES PRÉCÉDENTS :
${
  previousResponses.length > 0
    ? previousResponses
        .map(
          (r) =>
            `Q${r.question_index + 1}: "${r.question_text}" → "${r.transcription.slice(0, 200)}..."`,
        )
        .join("\n")
    : "Premier échange."
}

DERNIÈRE QUESTION : ${isLastQuestion}

Génère la continuation selon le schéma.`,
    });

    return NextResponse.json(continuation);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    console.error("[Continue] Error:", error);
    return NextResponse.json({ error: "Erreur de continuation." }, { status: 500 });
  }
}
