/**
 * POST /api/product/analyze — Endpoint produit UNIQUE.
 *
 * C'est le cœur produit côté API : l'UI ne connaît QUE cette route.
 * Input :  { cvText: string, jobText: string }
 * Output : ProductOutput
 *
 * Volontairement sans auth/DB/crédits (P0.5 : prouver le flux de bout en bout).
 * La sécurisation (auth, rate-limit, crédits) sera ajoutée en P1/P2.
 */
// @ts-nocheck


export const dynamic = "force-dynamic";

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { runProductFlow } from "@/lib/runtime/run-product-flow";

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
    cvText:  z.string().min(10, "CV trop court.").max(15000),
    jobText: z.string().min(10, "Description trop courte.").max(8000),
  });

  const parsed = RequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cvText, jobText } = parsed.data;

  try {
    const result = await runProductFlow({ cvText, jobText });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erreur interne lors de l'analyse." },
      { status: 500 },
    );
  }
}
