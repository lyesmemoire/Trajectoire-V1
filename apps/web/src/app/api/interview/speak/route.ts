import { NextRequest, NextResponse } from "next/server";
import { SpeechService } from "@/lib/ai/services/speech.service";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";

/**
 * POST /api/interview/speak
 *
 * Receives text from the client, converts it to audio server-side
 * via OpenAI TTS. Returns raw audio bytes (audio/mpeg).
 * Never exposes the API key to the browser.
 *
 * Body (application/json):
 *   { text: string }
 *
 * Response: audio/mpeg binary stream
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry();
    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const text: string = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "Texte manquant" },
        { status: 400 }
      );
    }

    // Truncate to a safe length (OpenAI TTS max ~4096 chars)
    const safeText = text.slice(0, 4000);

    const audioBuffer = await SpeechService.textToSpeech({
      text: safeText,
      voice: "alloy",
      language: "fr",
      userId: user.id,
    });

    // Convert Buffer to Uint8Array for Web-standard BodyInit compatibility
    const bytes = new Uint8Array(audioBuffer);

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur de synthèse vocale";

    if (
      message.includes("OPENAI_API_KEY") ||
      message.includes("placeholder")
    ) {
      return NextResponse.json(
        { error: "La synthèse vocale n'est pas configurée sur ce serveur." },
        { status: 503 }
      );
    }

    console.error("[/api/interview/speak]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
