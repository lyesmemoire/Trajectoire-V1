export const dynamic = "force-dynamic";

import { z } from "zod";
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
import { generateObject } from "ai";
import { parseCVToStructure } from "@/lib/pdf/cv-parser";

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
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    try {
      const { success } = await ratelimit.limit(user.id);
      if (!success)
        return NextResponse.json(
          { error: "Trop de requêtes." },
          { status: 429 },
        );
    } catch (e) {}

    const RequestSchema = z.object({
      cvId: z.string().uuid("cvId doit être un UUID valide"),
      jobDescription: z.string().min(10).max(8000).optional().nullable(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { cvId, jobDescription } = parsed.data;

    const { data: cv } = await supabase
      .from("cvs")
      .select("id, extracted_text")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();
    if (!cv)
      return NextResponse.json({ error: "CV introuvable" }, { status: 403 });

    const reference = crypto.randomUUID();
    const { data: resData } = await supabase.rpc("reserve_credits_atomic", {
      user_id_input: user.id,
      amount_input: OPTIMIZE_CREDIT_COST,
      reason_input: "cv_optimization",
      reference_input: reference,
    });

    if (!resData)
      return NextResponse.json(
        { error: "Crédits insuffisants" },
        { status: 402 },
      );

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

    let parsed;
    if (cached) {
      parsed = cached.response;
    } else {
      try {
        const OptimizeSchema = z.object({
          improvedSummary: z.string().max(3000),
          improvedBullets: z.array(z.object({
            original: z.string().max(500),
            improved: z.string().max(800),
          })).max(15),
          keywordsAdded: z.array(z.string().max(100)).max(30),
          generalAdvice: z.string().max(3000),
        });

        const { object } = await generateObject({
          model: mistralModel,
          schema: OptimizeSchema,
          temperature: 0.2,
          system: "Expert CV. Réponds UNIQUEMENT en JSON valide.",
          prompt: `Analyse et optimise ce CV pour cette offre.\n\nCV:\n${cvTextForAI}\n\nOffre:\n${safeJobDesc}\n\nRetourne ce format JSON :\n{ "improvedSummary": "string", "improvedBullets": [{ "original": "string", "improved": "string" }], "keywordsAdded": ["string"], "generalAdvice": "string" }`,
        });

        parsed = object;
        await supabaseAdmin
          .from("ai_cache")
          .insert({
            hash,
            endpoint: "optimize",
            model: "mistral-large",
            response: parsed,
          });
      } catch (error) {
        await supabase.rpc("rollback_credits_atomic", {
          user_id_input: user.id,
          amount_input: OPTIMIZE_CREDIT_COST,
          reason_input: "cv_optimization",
          reference_input: reference,
        });
        return NextResponse.json(
          { error: "Erreur IA Mistral" },
          { status: 500 },
        );
      }
    }

    // ─── NOUVEAUTÉ: Structuration pour PDF ───
    // On fusionne le texte optimisé dans la structure complète du CV
    const cvData = await parseCVToStructure(cv.extracted_text);

    // Injecter les optimisations dans les données structurées
    if (parsed.improvedSummary) cvData.summary = parsed.improvedSummary;

    // Remplacement intelligent des bullets dans l'expérience (optionnel, ici on renvoie tout)
    const result = { ...parsed, cvData };

    const jobHash = crypto
      .createHash("sha256")
      .update(safeJobDesc.trim().toLowerCase())
      .digest("hex");
    await supabase.from("optimized_cvs").insert({
      user_id: user.id,
      cv_id: cvId,
      job_description: safeJobDesc,
      job_hash: jobHash,
      improved_summary: parsed.improvedSummary,
      improved_bullets: parsed.improvedBullets,
      keywords_added: parsed.keywordsAdded,
      general_advice: parsed.generalAdvice,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
