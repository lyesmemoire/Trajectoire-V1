/**
 * POST /api/cv/analyze — Analyse IA de CV (Mistral)
 *
 * Sécurité renforcée :
 *  - Auth obligatoire (Supabase)
 *  - Rate limiting (@upstash/ratelimit)
 *  - CreditTransaction.reserve → LLM → commit/rollback
 *  - Logging structuré (pino)
 *  - Sentry error capture
 *
 * INTERDICTIONS :
 *  - Aucun appel LLM sans auth
 *  - Aucun appel LLM sans crédit réservé
 *  - Aucun fallback silencieux
 */
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { mistralModel } from "@/lib/mistral";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateText } from "ai";
import { parseCVToStructure } from "@/lib/pdf/cv-parser";
import { CreditTransaction } from "@/lib/credits/transactional";
import { createChildLogger, logError, logWarn } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";
import crypto from "crypto";

const log = createChildLogger({ component: "cv-analyze-api" });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "cv_analyze",
});

const ANALYZE_CREDIT_COST = 1;

const OPTIMIZE_PROMPT = `Tu es un expert RH senior.
Analyse ce CV et retourne UNIQUEMENT un JSON valide avec cette structure :
{
  "optimizedText": "le CV complet reecrit",
  "improvements": [{"type": "strength|addition|rewrite|warning", "section": "Experience", "description": "..."}],
  "atsScore": {"before": 45, "after": 85},
  "keywords": {"added": ["keyword1"], "existing": ["keyword2"]}
}`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let txResult: { txId: string } | { error: string } | null = null;

  try {
    // ── 1. AUTH ───────────────────────────────────────────────
    const user = await getAuthenticatedUser();
    if (!user) {
      logWarn("[CV/Analyze] Unauthenticated request blocked", {
        ip: req.headers.get("x-forwarded-for") ?? "unknown",
      });
      return NextResponse.json(
        { error: "Non authentifie" },
        { status: 401 },
      );
    }

    // ── 2. RATE LIMIT (fail-closed) ──────────────────────────
    try {
      const { success } = await ratelimit.limit(user.id);
      if (!success) {
        logWarn("[CV/Analyze] Ratelimit exceeded", { userId: user.id });
        return NextResponse.json(
          { error: "Trop de requetes. Reessayez dans 1 minute." },
          { status: 429 },
        );
      }
    } catch (e) {
      logWarn("[CV/Analyze] Ratelimit check failed — blocking request", {
        userId: user.id,
        error: e instanceof Error ? e.message : String(e),
      });
      return NextResponse.json(
        { error: "Service de rate limiting indisponible" },
        { status: 503 },
      );
    }

    // ── 3. INPUT PARSING ──────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Fichier manquant" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── 4. CREDIT RESERVATION ─────────────────────────────────
    const fileHash = crypto
      .createHash("sha256")
      .update(file.name + ":" + file.size)
      .digest("hex")
      .slice(0, 32);

    txResult = await CreditTransaction.reserve(
      user.id,
      ANALYZE_CREDIT_COST,
      "cv_analyze",
      fileHash,
    );

    if ("error" in txResult) {
      logWarn("[CV/Analyze] Credit reservation failed", {
        userId: user.id,
        fileName: file.name,
        error: txResult.error,
      });
      if (txResult.error.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Credits insuffisants" },
          { status: 402 },
        );
      }
      return NextResponse.json(
        { error: txResult.error },
        { status: 500 },
      );
    }

    // ── 5. CV TEXT EXTRACTION ─────────────────────────────────
    let originalText = "";
    try {
      if (file.type === "application/pdf") {
        const pdf = (await import("pdf-parse")).default;
        const data = await pdf(buffer);
        originalText = data.text;
      } else {
        originalText = buffer.toString("utf-8");
      }
    } catch (extractError) {
      logError("[CV/Analyze] Text extraction failed", extractError, {
        txId: txResult.txId,
        userId: user.id,
        fileType: file.type,
      });
      captureError(extractError, {
        component: "cv-analyze-api",
        event: "text_extraction_failed",
      });

      await CreditTransaction.rollback(txResult.txId, "text_extraction_failed");

      return NextResponse.json(
        { error: "Impossible d extraire le texte du fichier", details: extractError instanceof Error ? extractError.message : "Unknown" },
        { status: 422 },
      );
    }

    if (!originalText || originalText.trim().length < 50) {
      logWarn("[CV/Analyze] Extracted text too short", {
        txId: txResult.txId,
        userId: user.id,
        textLength: originalText.length,
      });

      await CreditTransaction.rollback(txResult.txId, "insufficient_cv_text");

      return NextResponse.json(
        { error: "Le texte extrait du CV est insuffisant pour l analyse" },
        { status: 422 },
      );
    }

    // ── 6. STRUCTURED CV PARSING ──────────────────────────────
    let cvData;
    try {
      cvData = await parseCVToStructure(originalText);
    } catch (parseError) {
      logError("[CV/Analyze] CV structure parsing failed", parseError, {
        txId: txResult.txId,
        userId: user.id,
        durationMs: Date.now() - startTime,
      });
      captureError(parseError, {
        component: "cv-analyze-api",
        event: "cv_structure_parsing_failed",
      });

      await CreditTransaction.rollback(txResult.txId, "parsing_failed");

      return NextResponse.json(
        { error: "Erreur lors de la structuration du CV", details: parseError instanceof Error ? parseError.message : "Unknown" },
        { status: 500 },
      );
    }

    // ── 7. DETERMINISTIC SCORING ──────────────────────────────
    const { evaluateCV } = await import("@/lib/cv/scoring");
    const diagnostic = evaluateCV(cvData);

    // ── 8. CREDIT COMMIT ──────────────────────────────────────
    await CreditTransaction.commit(txResult.txId, {
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      textLength: originalText.length,
      hasOptimizedText: false,
      durationMs: Date.now() - startTime,
    });

    log.info({
      event: "cv_analyze_completed",
      txId: txResult.txId,
      userId: user.id,
      fileName: file.name,
      textLength: originalText.length,
      overallScore: diagnostic.overallScore,
      durationMs: Date.now() - startTime,
    });

    // ── 9. RESPONSE ───────────────────────────────────────────
    return NextResponse.json({
      originalText,
      cvData,
      diagnostic
    });
  } catch (error) {
    if (txResult && "txId" in txResult) {
      try {
        await CreditTransaction.rollback(txResult.txId, "unhandled_exception");
      } catch {
        logError("[CV/Analyze] Emergency rollback failed", error, {
          txId: txResult.txId,
        });
      }
    }

    logError("[CV/Analyze] Unhandled error in POST /api/cv/analyze", error, {
      durationMs: Date.now() - startTime,
    });
    captureError(error, {
      component: "cv-analyze-api",
      event: "unhandled_error",
    });

    return NextResponse.json(
      {
        error: "Erreur serveur lors de l analyse CV",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
