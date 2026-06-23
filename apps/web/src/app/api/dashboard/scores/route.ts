import { NextResponse }              from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@trajectoire/arena-engine/db";

export async function GET() {
  // ── Auth ────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── Requêtes Prisma ──────────────────────────────────────────────────
  const [cvAnalysis, interviewSession] = await Promise.all([
    prisma.cVAnalysis.findFirst({
      where:   { userId: user.id },
      orderBy: { createdAt: "desc" },
      select:  { atsScoreBefore: true, atsScoreAfter: true },
    }),
    prisma.interviewSession.findFirst({
      where:   { userId: user.id, status: "completed" },
      orderBy: { createdAt: "desc" },
      select:  { score: true },
    }),
  ]);

  // ── Calcul des scores ────────────────────────────────────────────────
  const scoreCV: number | null =
    cvAnalysis?.atsScoreAfter ??
    cvAnalysis?.atsScoreBefore ??
    null;

  const scoreVocal: number | null = interviewSession?.score ?? null;

  return NextResponse.json({ scoreCV, scoreVocal });
}
