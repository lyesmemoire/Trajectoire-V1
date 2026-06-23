/**
 * POST /api/product/upload — Extraction de texte PDF pour le flux produit.
 *
 * Endpoint volontairement LÉGER (P2) :
 *  - PDF -> texte brut, rien d'autre.
 *  - PAS d'auth, PAS de base de données, PAS de stockage.
 *  - Le fichier n'est jamais persisté (promesse "on ne stocke pas ton CV").
 *
 * Distinct de /api/upload (dashboard authentifié) afin de ne casser aucun flux.
 *
 * Input  : multipart/form-data, champ "file" (application/pdf)
 * Output : { cvText: string, meta: { pages: number, chars: number } }
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo
const MAX_CHARS = 30000; // garde-fou anti explosion de tokens en aval

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide (multipart/form-data attendu)." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Aucun fichier fourni (champ « file » requis)." },
      { status: 400 },
    );
  }

  // Sécurité : type & taille.
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json(
      { error: "Format non supporté : merci d'envoyer un PDF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 8 Mo)." },
      { status: 413 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const cvText = (data.text ?? "").slice(0, MAX_CHARS).trim();

    if (!cvText) {
      return NextResponse.json(
        {
          error:
            "Impossible d'extraire du texte (PDF scanné/image ?). Colle ton CV manuellement.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        cvText,
        meta: { pages: data.numpages ?? 0, chars: cvText.length },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la lecture du PDF." },
      { status: 500 },
    );
  }
}
