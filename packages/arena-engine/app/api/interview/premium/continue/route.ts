import { NextRequest, NextResponse } from "next/server";
import { generateObject }             from "ai";
import { z }                         from "zod";
import { mistralModel }              from "@/lib/mistral";
import { createClient }              from "@/lib/supabase/server";
import { ContinueSessionSchema }     from "@/lib/interview/schemas/continue-session.schema";

const RequestSchema = z.object({
  sessionId:     z.string().uuid(),
  transcription: z.string().min(10).max(5000),
  questionIndex: z.number().int().min(0).max(9),
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

    const { sessionId, transcription, questionIndex } = body.data;

    // 3. Session (RLS ownership)
    const { data: session, error } = await supabase
      .from("interview_sessions")
      .select("parsed_cv, job_target, questions, interview_responses(*)")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    const currentQuestion = session.questions?.[questionIndex];
    if (!currentQuestion) {
      return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
    }

    const isLastQuestion = questionIndex >= (session.questions?.length ?? 0) - 1;

    // 4. Historique des échanges pour le contexte
    const previousResponses = (session.interview_responses ?? [])
      .filter((r: { question_index: number }) => r.question_index < questionIndex)
      .sort((a: { question_index: number }, b: { question_index: number }) =>
        a.question_index - b.question_index
      );

    // 5. generateObject — plus de JSON.parse
    const { object: continuation } = await generateObject({
      model:       mistralModel,
      schema:      ContinueSessionSchema,
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

      prompt: `CV : ${JSON.stringify(session.parsed_cv)}

OFFRE : ${JSON.stringify(session.job_target)}

QUESTION EN COURS (${questionIndex + 1}/${session.questions?.length}) :
"${currentQuestion}"

RÉPONSE DU CANDIDAT :
"${transcription}"

CONTEXTE DES ÉCHANGES PRÉCÉDENTS :
${previousResponses.length > 0
  ? previousResponses
      .map((r: { question_index: number; question_text: string; transcription: string }) =>
        `Q${r.question_index + 1}: "${r.question_text}" → "${r.transcription.slice(0, 200)}..."`
      )
      .join("\n")
  : "Premier échange."}

DERNIÈRE QUESTION : ${isLastQuestion}

Génère la continuation selon le schéma.`,
    });

    return NextResponse.json(continuation);

  } catch (error) {
    console.error("[Continue] Error:", error);
    return NextResponse.json({ error: "Erreur de continuation." }, { status: 500 });
  }
}
