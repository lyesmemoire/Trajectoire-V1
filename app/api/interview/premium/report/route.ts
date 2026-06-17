import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { getOpenAIClient } from "@/lib/openai";
import { SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const supabase: SupabaseClient<any> =
      (await createSupabaseServerClient()) as any;

    const { sessionId } = await req.json();

    const { data: session } = await supabase
      .from("premium_interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or 'gpt-4o'
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an expert technical recruiter evaluating an interview transcript.
Generate a JSON object with the following structure:
{
  "report": "A professional interview evaluation report including Strengths, Weaknesses, Specific improvements, Example elite answer, and Estimated probability of passing next round.",
  "scores": {
    "technical": <number 0-100>,
    "communication": <number 0-100>,
    "confidence": <number 0-100>,
    "stressHandling": <number 0-100>
  },
  "tags": ["array", "of", "specific", "weakness_or_pattern_tags"]
}

Important tags examples: "missing_metrics", "weak_structure", "rambling", "low_confidence", "strong_technical". Choose up to 5 relevant tags.
`,
        },
        {
          role: "user",
          content: JSON.stringify(session.transcript),
        },
      ],
    });

    const result = JSON.parse(completion.choices[0]?.message.content || "{}");

    // Update session with scores and tags
    await supabase
      .from("premium_interview_sessions")
      .update({
        technical_score: result.scores.technical || 0,
        communication_score: result.scores.communication || 0,
        confidence_score: result.scores.confidence || 0,
        stress_score: result.scores.stressHandling || 0,
        tags: result.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({
      report: result.report,
    });
  } catch (err: any) {
    console.error("POST /api/interview/premium/report error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
