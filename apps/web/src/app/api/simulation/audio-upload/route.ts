import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { createAdminClient } from "@/lib/supabase/service";
import { DistributedLock } from "@/lib/concurrency/DistributedLock";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const { user, authError } = await getVerifiedUserWithRetry();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const sessionId = formData.get("sessionId") as string | null;
    const messageId = formData.get("messageId") as string | null;
    const audioBlob = formData.get("audio") as Blob | null;

    if (!sessionId || !messageId || !audioBlob) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Size and MIME validation
    if (audioBlob.size > 50 * 1024 * 1024) { // 50 MB
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 413 });
    }
    const mimeType = audioBlob.type;
    if (!mimeType.startsWith("audio/webm") && !mimeType.startsWith("audio/ogg")) {
      return NextResponse.json({ error: "Invalid audio format" }, { status: 400 });
    }

    // 4. Session ownership & data verification
    return await DistributedLock.execute(
      `session:${sessionId}`,
      async () => {
        // Fetch session directly via prisma
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

        // 5. Verify messageId exists in qnaEvaluations
        const analysis = session.analysis as Record<string, any> | null;
        if (!analysis || !Array.isArray(analysis.qnaEvaluations)) {
          return NextResponse.json({ error: "No evaluations found" }, { status: 404 });
        }

        const qnaIndex = analysis.qnaEvaluations.findIndex((qna: any) => qna.messageId === messageId);
        if (qnaIndex === -1) {
          return NextResponse.json({ error: "Message ID not found in evaluations" }, { status: 404 });
        }

        const qna = analysis.qnaEvaluations[qnaIndex];
        // Allow updating if no audio yet or explicitly overwriting (though we just overwrite here)
        // No text matching is used!

        // 6. Upload to Storage
        const fileExt = mimeType.includes("ogg") ? "ogg" : "webm";
        const storagePath = `${user.id}/${sessionId}/${messageId}.${fileExt}`;
        const adminClient = createAdminClient();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await adminClient.storage
          .from("interviews-audio")
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          console.error("[audio-upload] Supabase Storage error:", uploadError);
          // Honest HTTP error, but client won't block
          return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
        }

        // 7. Persist Metadata in JSONB
        // Update analysis locally
        analysis.qnaEvaluations[qnaIndex].audio = {
          path: storagePath,
          mimeType,
          durationMs: qna.oralPerformance?.durationMs || null, // Optional enhancement
        };

        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: { analysis: analysis as any },
        });

        return NextResponse.json({ success: true, path: storagePath });
      },
      10000 // 10s lock timeout
    );
  } catch (error) {
    console.error("[audio-upload] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
