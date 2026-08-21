import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface SessionData {
  jobTitle?: string;
  level?: string;
  interviewType?: string;
}

interface EvaluationResult {
  overallScore: number;
  answers: string[];
  feedback: string[];
}

interface EvaluateRequestBody {
  sessionData?: SessionData;
  answers?: string[];
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as EvaluateRequestBody;

    const sessionData = body.sessionData ?? {};

    const answers = Array.isArray(body.answers)
      ? body.answers.filter(
          (answer): answer is string =>
            typeof answer === "string",
        )
      : [];

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const report = await evaluateInterview(
      sessionData,
      answers,
    );

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        job_title: sessionData.jobTitle ?? null,
        level: sessionData.level ?? null,
        interview_type:
          sessionData.interviewType ?? null,
        status: "completed",
        duration_seconds:
          Math.floor(Math.random() * 1800) + 300,
        answers,
        feedback: {
          items: report.feedback,
        },
        score: report.overallScore,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (sessionError) {
      console.error(
        "[Interview Evaluate] Session insert failed:",
        sessionError,
      );

      return NextResponse.json(
        {
          error:
            "Failed to persist interview session",
        },
        { status: 500 },
      );
    }

    const { error: reportError } = await supabase
      .from("reports")
      .insert({
        session_id: session.id,
        overall_score: report.overallScore,
        strengths: report.feedback,
      });

    if (reportError) {
      console.error(
        "[Interview Evaluate] Report insert failed:",
        reportError,
      );

      return NextResponse.json(
        {
          error:
            "Failed to persist interview report",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error(
      "[Interview Evaluate] Unexpected error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to evaluate interview",
      },
      { status: 500 },
    );
  }
}

async function evaluateInterview(
  _sessionData: SessionData,
  answers: string[],
): Promise<EvaluationResult> {
  const score =
    Math.floor(Math.random() * 30) + 70;

  const feedback = [
    "Bonne structure de réponse",
    "Communication claire",
    "Exemples pertinents",
    "À approfondir sur certains aspects techniques",
  ];

  return {
    overallScore: score,
    answers,
    feedback,
  };
}
