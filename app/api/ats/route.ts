export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import { generateObject } from "ai";
import { z } from "zod";
import { aggressiveTrim } from "@/lib/ai/trimmer";
import { generateHash } from "@/lib/ai/cache";
import { getRelevantCVSections } from "@/lib/ai/rag";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase-server";
import { mistralSmallModel } from "@/lib/mistral";
import { envServer } from "@/lib/env.server";
import { AtsAnalysisSchema } from "@/lib/ats/schemas/ats-analysis.schema";
import { normalizeSkills } from "@/lib/ats/normalization/normalize-skills";

const ratelimit =
  envServer.UPSTASH_REDIS_REST_URL && envServer.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: envServer.UPSTASH_REDIS_REST_URL,
          token: envServer.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        prefix: "ats",
      })
    : null;

const RequestSchema = z.object({
  cvId: z.string().uuid(),
  jobDescription: z.string().min(50).max(15000),
});

const ATS_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (ratelimit) {
      try {
        await ratelimit.limit(user.id);
      } catch {
        // Fallback gracieux si Redis indisponible
      }
    }

    const body = RequestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "cvId et jobDescription requis (min. 50 caractères)." },
        { status: 400 },
      );
    }

    const { cvId, jobDescription } = body.data;

    const { data: cv } = await supabase
      .from("cvs")
      .select("id, extracted_text")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();

    if (!cv) {
      return NextResponse.json({ error: "CV introuvable" }, { status: 403 });
    }

    const reference = crypto.randomUUID();
    const { data: reserved } = await supabase.rpc("reserve_credits_atomic", {
      user_id_input: user.id,
      amount_input: ATS_CREDIT_COST,
      reason_input: "ats_analysis",
      reference_input: reference,
    });

    if (!reserved) {
      return NextResponse.json({ error: "Crédits insuffisants" }, { status: 402 });
    }

    const safeJobDesc = jobDescription.slice(0, 5000);
    const cvTextToUse = aggressiveTrim(cv.extracted_text, 5000);

    const supabaseAdmin = createSupabaseServiceClient();
    const relevantSections = await getRelevantCVSections({
      supabaseAdmin,
      cvId,
      jobDescription: safeJobDesc,
      topK: 5,
    });
    const cvTextForAI = relevantSections || cvTextToUse;

    const hash = generateHash(cvTextForAI + safeJobDesc + "mistral-small");
    const { data: cached } = await supabaseAdmin
      .from("ai_cache")
      .select("*")
      .eq("hash", hash)
      .single();

    let analysis: z.infer<typeof AtsAnalysisSchema>;

    if (cached?.response) {
      const cachedValidation = AtsAnalysisSchema.safeParse(cached.response);
      if (!cachedValidation.success) {
        return NextResponse.json({ error: "Cache ATS corrompu." }, { status: 500 });
      }
      analysis = cachedValidation.data;
    } else {
      try {
        const { object } = await generateObject({
          model: mistralSmallModel,
          schema: AtsAnalysisSchema,
          temperature: 0.1,
          system: `Tu es un expert ATS. Analyse la compatibilité CV / offre.

RÈGLES :
- score : 0-100, basé sur l'alignement réel des compétences et expériences.
- matched_keywords / missing_keywords : termes concrets de l'offre.
- strengths / weaknesses : observations factuelles, pas de généralités.
- recommendations : actions concrètes pour améliorer le CV.`,
          prompt: `Analyse ce CV par rapport à l'offre.

CV:
${cvTextForAI}

Offre:
${safeJobDesc}`,
        });

        analysis = {
          ...object,
          matched_keywords: normalizeSkills(object.matched_keywords),
          missing_keywords: normalizeSkills(object.missing_keywords),
        };

        const finalValidation = AtsAnalysisSchema.safeParse(analysis);
        if (!finalValidation.success) {
          console.error("[ATS] Post-normalization validation failed:", finalValidation.error);
          await supabase.rpc("rollback_credits_atomic", {
            user_id_input: user.id,
            amount_input: ATS_CREDIT_COST,
            reason_input: "ats_analysis",
            reference_input: reference,
          });
          return NextResponse.json(
            { error: "Extraction invalide après normalisation." },
            { status: 500 },
          );
        }

        analysis = finalValidation.data;

        await supabaseAdmin.from("ai_cache").insert({
          hash,
          endpoint: "ats",
          model: "mistral-small",
          response: analysis,
        });
      } catch (error) {
        await supabase.rpc("rollback_credits_atomic", {
          user_id_input: user.id,
          amount_input: ATS_CREDIT_COST,
          reason_input: "ats_analysis",
          reference_input: reference,
        });
        console.error("[ATS] generateObject failed:", error);
        return NextResponse.json({ error: "Erreur IA Mistral" }, { status: 500 });
      }
    }

    await supabase.from("ats_reports").insert({
      user_id: user.id,
      cv_id: cvId,
      job_description: safeJobDesc,
      score: analysis.score,
      matched_keywords: analysis.matched_keywords,
      missing_keywords: analysis.missing_keywords,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.recommendations,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[ATS] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
