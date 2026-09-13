import { NextRequest, NextResponse } from "next/server";
import { SpeechService } from "@/lib/ai/services/speech.service";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";

/**
 * POST /api/interview/transcribe
 *
 * Receives a multipart audio blob from the client (audio/webm from MediaRecorder),
 * transcribes it server-side via OpenAI Whisper/gpt-4o-audio-transcribe.
 * Never exposes the API key to the browser.
 *
 * Body (multipart/form-data):
 *   file: Blob  — audio recording
 *
 * Response:
 *   { text: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check — same pattern as other simulation routes
    const { user } = await getVerifiedUserWithRetry();
    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Fichier audio manquant" },
        { status: 400 }
      );
    }

    // Convert Blob → File (required by OpenAI SDK)
    const audioFile = new File([file], "recording.webm", {
      type: file.type || "audio/webm",
    });

    const text = await SpeechService.speechToText({
      audioFile,
      language: "fr",
      userId: user.id,
    });

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur de transcription";

    // If AI is not configured, return a clear error — text mode still works
    if (
      message.includes("OPENAI_API_KEY") ||
      message.includes("placeholder")
    ) {
      return NextResponse.json(
        { error: "La transcription vocale n'est pas configurée sur ce serveur." },
        { status: 503 }
      );
    }

    console.error("[/api/interview/transcribe]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
