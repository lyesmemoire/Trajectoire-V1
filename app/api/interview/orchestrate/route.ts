import { NextRequest, NextResponse } from "next/server";
import { orchestrateInterviewStep } from "@/lib/interview/orchestration/interview-orchestrator";
import { getStrictUser } from "@/lib/auth/session-logic";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { RequestHardening } from "@/lib/security/request-hardening";
import { z } from "zod";

const OrchestrateSchema = z.object({
  sessionId: z.string().uuid(),
  userAnswer: z.string().min(1).max(10000),
  currentQuestion: z.string().min(1).max(5000),
  signature: z.string().min(1),
  nonce: z.string().min(1),
  metrics: z.any().optional().default({}),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getStrictUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bodyResult = OrchestrateSchema.safeParse(await req.json());
    if (!bodyResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: bodyResult.error.format() },
        { status: 400 },
      );
    }
    const {
      sessionId,
      userAnswer,
      currentQuestion,
      signature,
      nonce,
      metrics,
    } = bodyResult.data;

    // 🛡️ API HARDENING: Signature & Nonce Verification (Always Enforced)
    const isValid = await RequestHardening.verifyRequest(
      user.id,
      signature,
      JSON.stringify({ sessionId, userAnswer, currentQuestion }),
      nonce,
    );
    if (!isValid)
      return NextResponse.json(
        { error: "Invalid request signature" },
        { status: 403 },
      );

    // 🛡️ OWNERSHIP CHECK (Must happen BEFORE AI call)
    const supabase = await createSupabaseServerClient();
    const { data: session } = await supabase
      .from("interview_sessions")
      .select("answers")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (!session)
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 },
      );

    // 🧠 AI CALL (After validation)
    const result = await orchestrateInterviewStep(
      sessionId,
      userAnswer,
      currentQuestion,
      metrics,
    );

    const currentAnswers = Array.isArray(session.answers)
      ? session.answers
      : [];
    const updatedAnswers = [
      ...currentAnswers,
      {
        question: currentQuestion,
        answer: userAnswer,
        strategy: result.strategyUsed,
        timestamp: new Date().toISOString(),
      },
    ];

    await supabase
      .from("interview_sessions")
      .update({
        answers: updatedAnswers,
        current_state: result.currentState,
        pressure_level: result.pressureLevel,
      })
      .eq("id", sessionId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Orchestrate API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
