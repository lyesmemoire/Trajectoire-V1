import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { textChunk } = await req.json();

    if (!textChunk) {
      return NextResponse.json({ error: "Text chunk is required" }, { status: 400 });
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

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
