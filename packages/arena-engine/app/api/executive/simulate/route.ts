import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ExecutiveResultEngine } from "@/lib/executive/executive-result-engine";
import { executiveSimulateLimiter } from "@/lib/security/rate-limit";

/**
 * POST /api/executive/simulate
 *
 * Server-authoritative simulation endpoint.
 * Receives raw executive scores, computes the result server-side,
 * persists a SimulationSession, and returns the session ID.
 *
 * The frontend NEVER sees or manipulates raw scores.
 */
export async function POST(req: NextRequest) {
  try {
    // ── Rate Limit ────────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const { success } = await executiveSimulateLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before retrying." },
        { status: 429 }
      );
    }

    // ── Input Validation ──────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const rawScores = {
      strategicThinking: clamp(Number(body.strategicThinking) || 0),
      stakeholderInfluence: clamp(Number(body.stakeholderInfluence) || 0),
      decisionClarity: clamp(Number(body.decisionClarity) || 0),
      authorityProjection: clamp(Number(body.authorityProjection) || 0),
      pressureStability: clamp(Number(body.pressureStability) || 0),
    };

    // ── Compute ───────────────────────────────────────────────────
    const engine = new ExecutiveResultEngine();
    const result = engine.evaluate(rawScores);

    // ── Persist ───────────────────────────────────────────────────
    const session = await prisma.simulationSession.create({
      data: {
        overall: result.overallScore,
        percentile: result.percentile,
        level: result.level,
        scores: rawScores as any,
      },
    });

    // ── Response ──────────────────────────────────────────────────
    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    console.error("[EXEC_SIMULATION]", error);
    return NextResponse.json(
      { error: "Simulation failed. Please retry." },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}
