// @ts-nocheck
import { z } from "zod";
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
    const RequestSchema = z.object({
      strategicThinking:    z.number().min(0).max(100).optional().default(0),
      stakeholderInfluence: z.number().min(0).max(100).optional().default(0),
      decisionClarity:      z.number().min(0).max(100).optional().default(0),
      authorityProjection:  z.number().min(0).max(100).optional().default(0),
      pressureStability:    z.number().min(0).max(100).optional().default(0),
    });

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = RequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rawScores = {
      strategicThinking: clamp(parsed.data.strategicThinking),
      stakeholderInfluence: clamp(parsed.data.stakeholderInfluence),
      decisionClarity: clamp(parsed.data.decisionClarity),
      authorityProjection: clamp(parsed.data.authorityProjection),
      pressureStability: clamp(parsed.data.pressureStability),
    };

    // ── Compute ───────────────────────────────────────────────────
    const engine = new ExecutiveResultEngine();
    const result = engine.evaluate(rawScores);

    // ── Persist ───────────────────────────────────────────────────
    const session = await prisma.interviewSession.create({
      data: {
        persona: "simulation",
        currentState: "completed",
        sessionType: "simulation",
        score: result.overallScore,
        status: "completed",
        analysis: {
          overall: result.overallScore,
          percentile: result.percentile,
          level: result.level,
          scores: rawScores,
        },
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
