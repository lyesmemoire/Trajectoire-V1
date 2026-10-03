import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { createAdminClient } from "@/lib/supabase/service";
import { DistributedLock } from "@/lib/concurrency/DistributedLock";
import { prisma } from "@/lib/prisma";
import { isUuid } from "@/lib/interview/session-reader";
import type { Prisma } from "@prisma/client";

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
        // Fetch session directly via prisma (table interview_sessions). `version` sert au verrou optimiste :
        // les autres écritures de `analysis` (ConversationService) s'appuient sur la même colonne.
        const session = isUuid(sessionId)
          ? await prisma.interview_sessions.findUnique({
              where: { id: sessionId },
              select: { user_id: true, analysis: true, version: true }
            })
          : null;

        if (!session) {
          return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }
        if (session.user_id !== user.id) {
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

        // Écriture conditionnelle à la version lue : si une autre écriture (réponse en cours) est passée entre
        // temps, on ne l'écrase pas et on demande de réessayer.
        const written = await prisma.interview_sessions.updateMany({
          where: { id: sessionId, version: session.version },
          data: { analysis: analysis as Prisma.InputJsonValue, version: { increment: 1 }, updated_at: new Date() },
        });
        if (written.count === 0) {
          return NextResponse.json({ error: "Session modified concurrently, retry" }, { status: 409 });
        }

        return NextResponse.json({ success: true, path: storagePath });
      },
      10000 // 10s lock timeout
    );
  } catch (error) {
    console.error("[audio-upload] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
