import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { getStrictUser } from "@/lib/auth/get-user";
import { speechLimiter } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { success } = await speechLimiter.limit(`speech:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const formData = await req.formData();
    const audio = formData.get("audio") as File | null;
    if (!audio)
      return NextResponse.json(
        { error: "Fichier audio manquant" },
        { status: 400 },
      );

    const openai = getOpenAIClient();
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "fr",
      response_format: "verbose_json",
    });

    return NextResponse.json({
      transcript: transcription.text,
      segments: (transcription as any).segments,
      duration: (transcription as any).duration,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur de transcription" },
      { status: 500 },
    );
  }
}
