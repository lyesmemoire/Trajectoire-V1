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

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/runtime/interview/evaluate-answer";

export async function POST(req: NextRequest) {
  let rawBody;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const RequestSchema = z.object({
    answer: z.string().min(1, "La réponse est requise.").max(10000),
    gap:    z.string().max(5000).optional(),
  });

  const parsed = RequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { answer, gap } = parsed.data;

  const result = evaluateAnswer({
    answer,
    gap: typeof gap === "string" ? gap : undefined,
  });

  return NextResponse.json(result, { status: 200 });
}
