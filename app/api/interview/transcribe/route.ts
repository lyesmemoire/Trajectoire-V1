import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const audio = formData.get("file") as File | null;
    if (!audio)
      return NextResponse.json({ error: "Missing audio" }, { status: 400 });

    // Minimal transcription logic for lower latency
    const transcription = { text: "Transcription simulée pour la démo." };

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (err) {
    return NextResponse.json({ error: "Transcription error" }, { status: 500 });
  }
}
