/**
 * POST /api/ai/tts — Text-To-Speech (ElevenLabs primary, OpenAI fallback)
 *
 * Sécurité renforcée :
 *  - Auth obligatoire (Supabase)
 *  - Rate limiting (@upstash/ratelimit)
 *  - CreditTransaction.reserve → TTS provider → commit/rollback
 *  - Logging structuré (pino)
 *  - Sentry error capture
 *
 * INTERDICTIONS :
 *  - Aucun appel TTS sans auth
 *  - Aucun fallback silencieux
 *  - Aucun appel sans crédit réservé
 */
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getOpenAIClient } from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/auth";
import { CreditTransaction } from "@/lib/credits/transactional";
import { createChildLogger, logError, logWarn } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";

const log = createChildLogger({ component: "ai-tts-api" });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "ai_tts",
});

const TTS_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let txResult: { txId: string } | { error: string } | null = null;
  let provider = "unknown";

  try {
    // ── 1. AUTH ───────────────────────────────────────────────
    const user = await getAuthenticatedUser();
    if (!user) {
      logWarn("[AI/TTS] Unauthenticated request blocked", {
        ip: req.headers.get("x-forwarded-for") ?? "unknown",
      });
      return new Response(
        JSON.stringify({ error: "Non authentifie" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── 2. RATE LIMIT (fail-closed) ───────────────────────────
    try {
      const { success } = await ratelimit.limit(user.id);
      if (!success) {
        logWarn("[AI/TTS] Ratelimit exceeded", { userId: user.id });
        return new Response(
          JSON.stringify({ error: "Trop de requetes. Reessayez dans 1 minute." }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
    } catch (e) {
      logWarn("[AI/TTS] Ratelimit check failed — blocking request", {
        userId: user.id,
        error: e instanceof Error ? e.message : String(e),
      });
      return new Response(
        JSON.stringify({ error: "Service de rate limiting indisponible" }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── 3. INPUT VALIDATION ───────────────────────────────────
    let body: { textChunk?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Corps JSON invalide" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!body.textChunk || typeof body.textChunk !== "string" || body.textChunk.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Le champ textChunk (string non vide) est requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const safeText = body.textChunk.slice(0, 5000);

    // ── 4. CREDIT RESERVATION ─────────────────────────────────
    txResult = await CreditTransaction.reserve(
      user.id,
      TTS_CREDIT_COST,
      "ai_tts",
      safeText.slice(0, 100),
    );

    if ("error" in txResult) {
      logWarn("[AI/TTS] Credit reservation failed", {
        userId: user.id,
        error: txResult.error,
      });
      if (txResult.error.includes("Insufficient")) {
        return new Response(
          JSON.stringify({ error: "Credits insuffisants" }),
          { status: 402, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: txResult.error }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── 5. TTS PROVIDER: ElevenLabs (primaire) ───────────────
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

    let audioBuffer: ArrayBuffer | null = null;

    if (ELEVENLABS_API_KEY && ELEVENLABS_VOICE_ID) {
      try {
        provider = "elevenlabs";
        const response = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/" + ELEVENLABS_VOICE_ID + "/stream",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: safeText,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.45,
                similarity_boost: 0.8,
                style: 0.3,
              },
            }),
          },
        );

        if (!response.ok) {
          throw new Error("ElevenLabs HTTP " + response.status + ": " + response.statusText);
        }

        audioBuffer = await response.arrayBuffer();
      } catch (elevenLabsError) {
        logError("[AI/TTS] ElevenLabs failed, falling back to OpenAI", elevenLabsError, {
          txId: txResult.txId,
          userId: user.id,
          provider: "elevenlabs",
        });
        captureError(elevenLabsError, {
          component: "ai-tts-api",
          event: "elevenlabs_failed",
          provider: "elevenlabs",
        });
      }
    }

    // ── 6. TTS PROVIDER: OpenAI (fallback) ────────────────────
    if (!audioBuffer) {
      provider = "openai";
      try {
        const openai = getOpenAIClient();
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: safeText,
        });

        audioBuffer = await mp3.arrayBuffer();
      } catch (openaiError) {
        logError("[AI/TTS] OpenAI TTS fallback failed", openaiError, {
          txId: txResult.txId,
          userId: user.id,
          provider: "openai",
        });
        captureError(openaiError, {
          component: "ai-tts-api",
          event: "openai_tts_failed",
          provider: "openai",
        });

        await CreditTransaction.rollback(txResult.txId, "all_tts_providers_failed");

        return new Response(
          JSON.stringify({
            error: "Echec de la synthese vocale",
            details: openaiError instanceof Error ? openaiError.message : "Unknown",
          }),
          { status: 502, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // ── 7. CREDIT COMMIT ──────────────────────────────────────
    await CreditTransaction.commit(txResult.txId, {
      provider,
      userId: user.id,
      textLength: safeText.length,
      audioSizeBytes: audioBuffer.byteLength,
      durationMs: Date.now() - startTime,
    });

    log.info({
      event: "tts_completed",
      txId: txResult.txId,
      userId: user.id,
      provider,
      textLength: safeText.length,
      audioSizeBytes: audioBuffer.byteLength,
      durationMs: Date.now() - startTime,
    });

    // ── 8. RETURN AUDIO ───────────────────────────────────────
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    if (txResult && "txId" in txResult) {
      try {
        await CreditTransaction.rollback(txResult.txId, "unhandled_exception");
      } catch {
        logError("[AI/TTS] Emergency rollback failed", error, {
          txId: txResult.txId,
        });
      }
    }

    logError("[AI/TTS] Unhandled error in POST /api/ai/tts", error, {
      durationMs: Date.now() - startTime,
    });
    captureError(error, {
      component: "ai-tts-api",
      event: "unhandled_error",
    });

    return new Response(
      JSON.stringify({
        error: "Erreur serveur lors de la synthese vocale",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
