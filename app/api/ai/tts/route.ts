import { envServer } from "@/lib/env.server";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { aiTtsLimiter } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await aiTtsLimiter.limit(`ai-tts:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const supabase = await createServerClient();
    const RequestSchema = z.object({
      textChunk: z.string().min(1).max(2000),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { textChunk } = parsed.data;

    const ELEVENLABS_API_KEY = envServer.ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = envServer.ELEVENLABS_VOICE_ID;

    try {
      // 1. Attempt ElevenLabs TTS
      if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) throw new Error("ElevenLabs config missing");

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: textChunk,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.45,
              similarity_boost: 0.8,
              style: 0.3,
            },
          }),
        }
      );

      if (!response.ok) throw new Error(`ElevenLabs error: ${response.status}`);

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: { "Content-Type": "audio/mpeg" },
      });

    } catch (e) {
      console.error("[TTS_ELEVENLABS_FAIL]", e);
      
      // 2. Fallback to OpenAI TTS
      const openai = getOpenAIClient();
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: textChunk,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return new NextResponse(buffer, {
        headers: { "Content-Type": "audio/mpeg" },
      });
    }
  } catch (error: any) {
    console.error("[TTS_GLOBAL_ERROR]", error);
    return NextResponse.json({ error: "TTS failure" }, { status: 500 });
  }
}
