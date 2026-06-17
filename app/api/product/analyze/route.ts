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

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { runProductFlow } from "@/lib/runtime/run-product-flow";

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

  const { cvText, jobText } = (body ?? {}) as {
    cvText?: unknown;
    jobText?: unknown;
  };

  if (typeof cvText !== "string" || typeof jobText !== "string") {
    return NextResponse.json(
      { error: "cvText et jobText (string) sont requis." },
      { status: 400 },
    );
  }

  if (!cvText.trim() || !jobText.trim()) {
    return NextResponse.json(
      { error: "cvText et jobText ne peuvent pas être vides." },
      { status: 400 },
    );
  }

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
