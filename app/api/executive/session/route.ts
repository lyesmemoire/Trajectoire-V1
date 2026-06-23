import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/executive/session?id=xxx
 *
 * Returns the computed simulation result for a given session ID.
 * No raw score manipulation possible — data comes straight from DB.
 */
export async function GET(req: NextRequest) {
  const RequestSchema = z.object({
    id: z.string().min(1).max(100),
  });
  const parsed = RequestSchema.safeParse({
    id: req.nextUrl.searchParams.get("id"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "ID de session invalide." }, { status: 400 });
  }
  const { id } = parsed.data;

  const session = await prisma.simulationSession.findUnique({
    where: { id },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: session.id,
    overall: session.overall,
    percentile: session.percentile,
    level: session.level,
    scores: session.scores,
    createdAt: session.createdAt,
  });
}
