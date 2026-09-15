import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { createAdminClient } from "@/lib/supabase/service";
import { prisma } from "@/lib/prisma";

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

    // Validate ownership
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      select: { userId: true, analysis: true }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.userId !== user.id) {
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
