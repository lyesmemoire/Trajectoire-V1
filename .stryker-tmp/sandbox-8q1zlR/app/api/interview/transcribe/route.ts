/**
 * @deprecated Cette route retourne une transcription simulée ("Transcription simulée pour la démo").
 * Elle sera supprimée dès que useSpeechAnalysis.ts et VoiceResponsePanel.tsx
 * seront migrés vers le Realtime Gateway V3.
 * Stack officielle : Deepgram STT via apps/realtime-gateway
 * Migration : connecter les composants au Gateway WebSocket au lieu de cette route HTTP.
 */
// @ts-nocheck

import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audio = formData.get("file") as File | null;
    if (!audio)
      return NextResponse.json({ error: "Missing audio" }, { status: 400 });

    // Minimal transcription logic for lower latency
    const transcription = { text: "Transcription simulée pour la démo." };

    return NextResponse.json({
      text: transcription.text,
      _deprecated: true,
      _replacement: "Realtime Gateway V3 — apps/realtime-gateway",
    });
  } catch (err) {
    return NextResponse.json({ error: "Transcription error" }, { status: 500 });
  }
}
