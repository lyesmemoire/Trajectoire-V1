import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { transcript, context } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

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
