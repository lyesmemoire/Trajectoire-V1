import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { createAdminClient } from "@/lib/supabase/service";
import { prisma } from "@/lib/prisma";
import { isUuid } from "@/lib/interview/session-reader";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");
    const messageId = searchParams.get("messageId");

    if (!sessionId || !messageId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { user, authError } = await getVerifiedUserWithRetry();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ownership (table interview_sessions : celle que la simulation alimente).
    // Identifiant mal formé : même réponse qu'une séance absente.
    const session = isUuid(sessionId)
      ? await prisma.interview_sessions.findUnique({
          where: { id: sessionId },
          select: { user_id: true, analysis: true }
        })
      : null;

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const analysis = session.analysis as Record<string, any> | null;
    if (!analysis || !Array.isArray(analysis.qnaEvaluations)) {
      return NextResponse.json({ error: "No evaluations found" }, { status: 404 });
    }

    const qna = analysis.qnaEvaluations.find((q: any) => q.messageId === messageId);
    if (!qna || !qna.audio || !qna.audio.path) {
      return NextResponse.json({ error: "Audio not found for this message" }, { status: 404 });
    }

    const storagePath = qna.audio.path;
    const adminClient = createAdminClient();

    // Create signed URL valid for 5 minutes (300 seconds)
    const { data, error } = await adminClient.storage
      .from("interviews-audio")
      .createSignedUrl(storagePath, 300);

    if (error || !data?.signedUrl) {
      console.error("[audio-replay] Supabase sign URL error:", error);
      return NextResponse.json({ error: "Could not generate replay URL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, signedUrl: data.signedUrl });

  } catch (error) {
    console.error("[audio-replay] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
