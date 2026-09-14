import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { getOpenAIKey } from "@/lib/ai/ai-models";

/**
 * POST /api/interview/realtime-transcription
 *
 * Generates an ephemeral session token for OpenAI Realtime Transcription API.
 * Uses /v1/realtime/transcription_sessions endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const apiKey = getOpenAIKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "La transcription vocale n'est pas configurée sur ce serveur." },
        { status: 503 }
      );
    }

    // Create an ephemeral session on OpenAI Realtime Transcription API
    const response = await fetch("https://api.openai.com/v1/realtime/transcription_sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-live-transcribe",
        // Transcription-only configuration
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[/api/interview/realtime-transcription] OpenAI error:", errorText);
      return NextResponse.json(
        { error: "Erreur lors de l'initialisation de la session Live" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Return the ephemeral token
    return NextResponse.json({
      client_secret: data.client_secret.value,
    });
  } catch (error: unknown) {
    console.error("[/api/interview/realtime-transcription]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
