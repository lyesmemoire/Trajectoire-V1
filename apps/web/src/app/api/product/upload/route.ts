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

import { NextResponse, NextRequest } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo
const MAX_CHARS = 30000; // garde-fou anti explosion de tokens en aval

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch (error) {
    return NextResponse.json(
      { error: "Requête invalide (multipart/form-data attendu)." },
      { status: 400 },
    );
  }

  const file = form.get("file");

  const ALLOWED_MIME  = ["application/pdf"];

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux. Max 8MB." },
      { status: 413 }
    );
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. PDF uniquement." },
      { status: 415 }
    );
  }
  
  const rawName  = (file as File).name ?? "document.pdf";
  const safeName = rawName
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .slice(0, 100);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use pdfjs-dist legacy build for Node.js compatibility
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdfDocument = await loadingTask.promise;
    
    let cvText = "";
    const numPages = pdfDocument.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(" ");
      cvText += pageText + "\n";
    }
    
    cvText = cvText.slice(0, MAX_CHARS).trim();

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
        meta: { pages: numPages, chars: cvText.length },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la lecture du PDF." },
      { status: 500 },
    );
  }
}
