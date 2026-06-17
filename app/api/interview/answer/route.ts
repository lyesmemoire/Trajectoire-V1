// app/api/interview/answer/route.ts
// Sauvegarde une réponse individuelle à une question d'entretien

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const { session_id, answer } = await req.json();

    if (!session_id || !answer?.trim()) {
      return NextResponse.json(
        { error: "session_id et answer sont requis." },
        { status: 400 },
      );
    }

    // Récupérer la session (vérifier propriété)
    const { data: session, error: fetchErr } = await (supabase as any)
      .from("interview_sessions")
      .select("answers, questions, status")
      .eq("id", session_id)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !session) {
      return NextResponse.json(
        { error: "Session introuvable." },
        { status: 404 },
      );
    }

    if (session.status === "completed") {
      return NextResponse.json(
        { error: "Session déjà terminée." },
        { status: 400 },
      );
    }

    const currentAnswers: string[] = session.answers || [];

    // Vérifier qu'on ne dépasse pas le nombre de questions
    if (currentAnswers.length >= (session.questions?.length || 7)) {
      return NextResponse.json(
        { error: "Toutes les questions ont déjà été répondues." },
        { status: 400 },
      );
    }

    const updatedAnswers = [...currentAnswers, answer.trim()];

    const { error: updateErr } = await (supabase as any)
      .from("interview_sessions")
      .update({
        answers: updatedAnswers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session_id);

    if (updateErr) {
      console.error("Failed to save answer:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      answersCount: updatedAnswers.length,
      totalQuestions: session.questions?.length || 7,
      isComplete: updatedAnswers.length >= (session.questions?.length || 7),
    });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/interview/answer error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
