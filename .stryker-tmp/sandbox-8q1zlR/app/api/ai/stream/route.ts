// @ts-nocheck
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { aiStreamLimiter } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await aiStreamLimiter.limit(`ai-stream:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const supabase = await createServerClient();
    const RequestSchema = z.object({
      transcript: z.string().min(1).max(10000),
      context:    z.string().max(200).optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { transcript, context } = parsed.data;

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a high-level executive recruiter. 
          Tone: Cold, analytical, direct. 
          CONSTRAINT: MAX 2 SENTENCES. 
          Avoid marketing fluff, emojis.
          Focus on decision-making and strategic arbitrage.
          Context: ${context || "Executive Interview"}.`,
        },
        { role: "user", content: transcript },
      ],
      temperature: 0.2,
      max_tokens: 80,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: content })}\n\n`));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[AI_STREAM_ERROR]", error);
    return NextResponse.json({ error: "AI Stream failure" }, { status: 500 });
  }
}
