import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI();

// Validation de la requête entrante
const TranscribeRequestSchema = z.object({
  sessionId: z.string().uuid(),
  questionIndex: z.number().int().min(0).max(2),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const sessionId = formData.get("sessionId") as string;
    const questionIndex = parseInt(formData.get("questionIndex") as string);

    // Validation
    const parsed = TranscribeRequestSchema.safeParse({ sessionId, questionIndex });
    if (!parsed.success || !audioFile) {
      return NextResponse.json(
        { error: "Paramètres invalides ou fichier audio manquant." },
        { status: 400 }
      );
    }

    // Taille max : 25MB (limite Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier audio trop volumineux. Max 25MB." },
        { status: 413 }
      );
    }

    // Transcription Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr",          // Force le français — évite les erreurs de détection
      response_format: "text",
    });

    const text = typeof transcription === "string" ? transcription.trim() : (transcription as any).text?.trim() || "";

    // Garde-fou : réponse vide ou trop courte
    if (text.length < 20) {
      return NextResponse.json(
        { error: "Réponse trop courte ou inaudible. Réessayez." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      transcription: text,
      sessionId,
      questionIndex,
      wordCount: text.split(" ").length,
    });
  } catch (error) {
    console.error("[Transcribe] Error:", error);
    return NextResponse.json(
      { error: "Erreur de transcription. Réessayez." },
      { status: 500 }
    );
  }
}
