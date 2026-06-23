/**
 * POST /api/product/interview/evaluate — Évaluation d'une réponse d'entretien (P3).
 *
 * Module ISOLÉ : n'utilise que lib/runtime/interview (déterministe).
 * Ne touche PAS au moteur ATS, à ProductOutput, ni au pipeline CV/job.
 *
 * Input  : { answer: string, gap?: string }
 * Output : EvaluateAnswerResult { score, feedback, star }
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/runtime/interview/evaluate-answer";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const { answer, gap } = (body ?? {}) as { answer?: unknown; gap?: unknown };

  if (typeof answer !== "string") {
    return NextResponse.json(
      { error: "Le champ « answer » (string) est requis." },
      { status: 400 },
    );
  }

  const result = evaluateAnswer({
    answer,
    gap: typeof gap === "string" ? gap : undefined,
  });

  return NextResponse.json(result, { status: 200 });
}
