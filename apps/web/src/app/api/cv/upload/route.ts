import { NextRequest, NextResponse } from "next/server";

import { readCvFile, CV_ACCEPTED_TYPES } from "@/lib/cv/cv-file";
import { logger } from "@/lib/logger";
import {
  RateLimitScope,
  RouteType,
} from "@/lib/rate-limiting/centralized-rate-limit.service";
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function handleUpload(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Requête multipart invalide." }, { status: 400 });
    }

    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      return NextResponse.json({ error: 'Champ "file" absent de la requête.' }, { status: 400 });
    }

    // Validation et extraction communes avec l'aperçu gratuit (lib/cv/cv-file.ts).
    const result = await readCvFile(uploaded);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          ...(result.hint ? { hint: result.hint } : {}),
          ...(result.status === 415 ? { accepted: CV_ACCEPTED_TYPES } : {}),
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        textLength: result.text.length,
        extractedText: result.text,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error({
      event: "CV upload - unexpected error",
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Erreur inattendue lors de la lecture du CV." },
      { status: 500 },
    );
  }
}

// Extraction de fichier (CPU) : limite de débit par utilisateur et par IP.
// Pas de CSRF : la route n'écrit rien et ne renvoie le texte qu'à l'appelant.
export const POST = rateLimit(RouteType.UPLOAD, handleUpload, {
  scopes: [RateLimitScope.USER, RateLimitScope.IP],
});
