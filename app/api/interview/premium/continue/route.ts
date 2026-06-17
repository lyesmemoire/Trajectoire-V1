import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { getOpenAIClient } from "@/lib/openai";
import { buildPremiumPrompt } from "@/lib/interview/premium-prompt";
import { isOpenAIBroken, registerFailure } from "@/lib/openai-breaker";
import { z } from "zod";
import { premiumContinueLimiter } from "@/lib/security/rate-limit";
import { logEvent } from "@/lib/security/audit-log";

export const dynamic = "force-dynamic";
const MAX_TURNS = 20;

export async function POST(req: NextRequest) {
  try {
    if (isOpenAIBroken()) {
      return NextResponse.json(
        { error: "AI temporarily unavailable" },
        { status: 503 },
      );
    }

    // Authenticate user via cookies
    const user = await requireAuth();

    // Rate limit check
    const { success } = await premiumContinueLimiter.limit(
      `premium-continue:${user.id}`,
    );
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Validate payload using Zod
    const payloadSchema = z.object({
      sessionId: z.string(),
      answer: z.string(),
    });
    const rawBody = await req.json();
    const parseResult = payloadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      console.error("[INVALID_PAYLOAD]", parseResult.error);
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }
    const { sessionId, answer } = parseResult.data;

    // Use Service Role exclusively for system DB operations to bypass RLS
    const adminSupabase = createSupabaseServiceClient();

    const { data: session, error: fetchError } = await (adminSupabase as any)
      .from("premium_interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !session) {
      console.error(
        "[INTERVIEW_STREAM_ERROR] Session fetch failed:",
        fetchError,
      );
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Guard against malformed transcript
    if (
      !Array.isArray(session?.transcript) ||
      (session.transcript?.length ?? 0) > MAX_TURNS * 2
    ) {
      return NextResponse.json(
        { error: "Session limit reached" },
        { status: 403 },
      );
    }

    if (session.is_processing) {
      return NextResponse.json(
        { error: "Already processing" },
        { status: 409 },
      );
    }

    // Lock session
    await (adminSupabase as any)
      .from("premium_interview_sessions")
      .update({ is_processing: true })
      .eq("id", sessionId);

    const transcript = [
      ...session.transcript,
      { role: "candidate", content: answer },
    ];

    const openai = getOpenAIClient();

    let stream;
    try {
      const isTechnical = session.phase === "technical_case";
      stream = await openai.chat.completions.create({
        model: "gpt-4o", // Immersive conversation strategy
        stream: true,
        max_tokens: 300,
        temperature: isTechnical ? 0.3 : 0.7,
        messages: buildPremiumPrompt(session, transcript) as any,
      });
    } catch (apiErr) {
      registerFailure();
      // Unlock session on fail
      await (adminSupabase as any)
        .from("premium_interview_sessions")
        .update({ is_processing: false })
        .eq("id", sessionId);
      console.error("[INTERVIEW_STREAM_ERROR] OpenAI API failed:", apiErr);
      return NextResponse.json({ error: "AI API Error" }, { status: 502 });
    }

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            fullText += delta;

            controller.enqueue(encoder.encode(`data: ${delta}\n\n`));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          const updatedTranscript = [
            ...transcript,
            { role: "interviewer", content: fullText },
          ];

          // Update compressed memory in background (Only every 3 turns to save tokens)
          let newMemory = session.memory || {};
          if (updatedTranscript.length % 6 === 0) {
            try {
              const summaryObj = await updateMemory(updatedTranscript);
              newMemory = summaryObj;
            } catch (memErr) {
              console.error("Failed to summarize/compress memory:", memErr);
            }
          }

          // Final save & unlock
          await (adminSupabase as any)
            .from("premium_interview_sessions")
            .update({
              transcript: updatedTranscript,
              memory: newMemory,
              is_processing: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sessionId);

          // Fire‑and‑forget audit log
          logEvent(
            user.id,
            "INTERVIEW_CONTINUE",
            { sessionId },
            req.headers.get("x-forwarded-for") ?? "",
            req.headers.get("user-agent") ?? "",
          );
        } catch (err) {
          console.error(
            "[INTERVIEW_STREAM_ERROR] Streaming generation error:",
            err,
          );
          await (adminSupabase as any)
            .from("premium_interview_sessions")
            .update({ is_processing: false })
            .eq("id", sessionId);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("[INTERVIEW_STREAM_ERROR] General POST error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function updateMemory(transcript: any[]) {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 300,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
Summarize this interview so far in JSON format.
Limit output to 150 words total.
{
  "structuredSummary": "...",
  "keyStrengths": [],
  "keyWeaknesses": []
}
`,
      },
      {
        role: "user",
        content: JSON.stringify(transcript.slice(-4)),
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message.content || "{}");

  // Isolate memory structure and limit arrays
  return {
    structuredSummary: parsed.structuredSummary || "",
    keyStrengths: (parsed.keyStrengths || []).slice(0, 5),
    keyWeaknesses: (parsed.keyWeaknesses || []).slice(0, 5),
  };
}
