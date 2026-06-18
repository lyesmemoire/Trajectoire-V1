import { buildPrompt } from "@/lib/interview/prompts";
import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { phase, context, stress, lastAnswer, dominantPosture } =
      await req.json();

    const { system, user } = buildPrompt(
      phase,
      context,
      stress,
      lastAnswer,
      dominantPosture
    );

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 60,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    return NextResponse.json({
      question: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("[INTERVIEW_QUESTION_ERROR]", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
