export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import { aggressiveTrim } from "@/lib/ai/trimmer";
import { generateHash } from "@/lib/ai/cache";
import { getRelevantCVSections } from "@/lib/ai/rag";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase-server";
import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";
import { parseCVToStructure } from "@/lib/pdf/cv-parser";
import { createChildLogger, logError, logWarn } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";
import { CreditTransaction } from "@/lib/credits/transactional";

const log = createChildLogger({ component: "optimize-api" });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  prefix: "optimize",
});

const OPTIMIZE_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let txResult: { txId: string } | { error: string } | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    try {
      const { success } = await ratelimit.limit(user.id);
      if (!success) {
        logWarn("[Optimize] Ratelimit exceeded", { userId: user.id });
        return NextResponse.json(
          { error: "Trop de requêtes." },
          { status: 429 },
        );
      }
    } catch (e) {
      logWarn("[Optimize] Ratelimit check failed — continuing without limit", {
        userId: user.id,
        error: e instanceof Error ? e.message : String(e),
      });
    }

    const body = await req.json();
    const { cvId, jobDescription } = body;
    if (!cvId)
      return NextResponse.json({ error: "cvId requis" }, { status: 400 });

    const { data: cv } = await supabase
      .from("cvs")
      .select("id, extracted_text")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();
    if (!cv)
      return NextResponse.json({ error: "CV introuvable" }, { status: 403 });

    // ─── Credit reservation via CreditTransaction (correct params) ─────
    const contentHash = crypto
      .createHash("sha256")
      .update(`optimize:${cvId}`)
      .digest("hex");

    txResult = await CreditTransaction.reserve(
      user.id,
      OPTIMIZE_CREDIT_COST,
      "cv_optimization",
      contentHash,
    );

    if ("error" in txResult) {
      logWarn("[Optimize] Credit reservation failed", {
        userId: user.id,
        cvId,
        error: txResult.error,
      });
      if (txResult.error.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Crédits insuffisants" },
          { status: 402 },
        );
      }
      return NextResponse.json(
        { error: txResult.error },
        { status: 500 },
      );
    }

    const safeJobDesc = jobDescription?.slice(0, 5000) || "";
    const cvTextToUse = aggressiveTrim(cv.extracted_text, 5000);

    const supabaseAdmin = createSupabaseServiceClient();
    const relevantSections = await getRelevantCVSections({
      supabaseAdmin,
      cvId,
      jobDescription: safeJobDesc,
      topK: 5,
    });
    const cvTextForAI = relevantSections || cvTextToUse;

    const hash = generateHash(cvTextForAI + safeJobDesc + "mistral-large-v2");
    const { data: cached } = await supabaseAdmin
      .from("ai_cache")
      .select("*")
      .eq("hash", hash)
      .single();

    let parsed: any;
    if (cached) {
      parsed = cached.response;
    } else {
      try {
        const { text } = await generateText({
          model: mistralModel,
          temperature: 0.2,
          system: "Expert CV. Réponds UNIQUEMENT en JSON valide.",
          prompt: `Analyse et optimise ce CV pour cette offre.\n\nCV:\n${cvTextForAI}\n\nOffre:\n${safeJobDesc}\n\nRetourne ce format JSON :\n{ "improvedSummary": "string", "improvedBullets": [{ "original": "string", "improved": "string" }], "keywordsAdded": ["string"], "generalAdvice": "string" }`,
        });

        parsed = JSON.parse(
          text
            .trim()
            .replace(/^```json/, "")
            .replace(/```$/, ""),
        );
        await supabaseAdmin
          .from("ai_cache")
          .insert({
            hash,
            endpoint: "optimize",
            model: "mistral-large",
            response: parsed,
          });
      } catch (error) {
        logError("[Optimize] LLM or cache insert failed", error, {
          txId: txResult.txId,
          cvId,
          durationMs: Date.now() - startTime,
        });
        captureError(error, {
          component: "optimize-api",
          event: "llm_or_cache_failed",
        });

        await CreditTransaction.rollback(txResult.txId, "llm_or_cache_failed");
        return NextResponse.json(
          { error: "Erreur IA Mistral" },
          { status: 500 },
        );
      }
    }

    // ─── NOUVEAUTÉ: Structuration pour PDF ───
    const cvData = await parseCVToStructure(cv.extracted_text);

    if (parsed.improvedSummary) cvData.summary = parsed.improvedSummary;

    const result = { ...parsed, cvData };

    const jobHash = crypto
      .createHash("sha256")
      .update(safeJobDesc.trim().toLowerCase())
      .digest("hex");

    const { error: insertError } = await supabase
      .from("optimized_cvs")
      .insert({
        user_id: user.id,
        cv_id: cvId,
        job_description: safeJobDesc,
        job_hash: jobHash,
        improved_summary: parsed.improvedSummary,
        improved_bullets: parsed.improvedBullets,
        keywords_added: parsed.keywordsAdded,
        general_advice: parsed.generalAdvice,
      });

    if (insertError) {
      logError("[Optimize] Failed to persist optimized_cvs", insertError, {
        txId: txResult.txId,
        cvId,
        durationMs: Date.now() - startTime,
      });
      captureError(insertError, {
        component: "optimize-api",
        event: "optimized_cvs_insert_failure",
      });

      return NextResponse.json(
        {
          error: "Échec de la sauvegarde du CV optimisé",
          details: insertError.message,
          code: insertError.code ?? "DB_INSERT_ERROR",
        },
        { status: 500 },
      );
    }

    // ─── Commit credits (seulement si persistance réussie) ─────
    await CreditTransaction.commit(txResult.txId, {
      cvId,
      tokensUsed: 0,
    });

    log.info({
      event: "optimize_completed_and_committed",
      txId: txResult.txId,
      userId: user.id,
      cvId,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(result);
  } catch (error) {
    // Safety net
    if (txResult && "txId" in txResult) {
      try {
        await CreditTransaction.rollback(txResult.txId, "unhandled_exception");
      } catch {
        logError(
          "[Optimize] Emergency rollback failed",
          error,
          { txId: txResult.txId },
        );
      }
    }

    logError("[Optimize] Unhandled error in POST /api/optimize", error, {
      durationMs: Date.now() - startTime,
    });
    captureError(error, {
      component: "optimize-api",
      event: "unhandled_error",
    });
    return NextResponse.json(
      {
        error: "Erreur serveur lors de l'optimisation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
