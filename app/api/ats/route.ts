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
import { mistralSmallModel } from "@/lib/mistral";
import { generateText } from "ai";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "ats",
});

const ATS_CREDIT_COST = 1;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    try {
      await ratelimit.limit(user.id);
    } catch (e) {}

    const body = await req.json();
    const { cvId, jobDescription } = body;

    if (!cvId || !jobDescription)
      return NextResponse.json(
        { error: "cvId et jobDescription requis" },
        { status: 400 },
      );

    const { data: cv } = await supabase
      .from("cvs")
      .select("id, extracted_text")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();
    if (!cv)
      return NextResponse.json({ error: "CV introuvable" }, { status: 403 });

    const reference = crypto.randomUUID();
    const { data: reserved } = await supabase.rpc("reserve_credits_atomic", {
      user_id_input: user.id,
      amount_input: ATS_CREDIT_COST,
      reason_input: "ats_analysis",
      reference_input: reference,
    });

    if (!reserved)
      return NextResponse.json(
        { error: "Crédits insuffisants" },
        { status: 402 },
      );

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

    let parsed;
    if (cached) {
      parsed = cached.response;
    } else {
      try {
        const { text } = await generateText({
          model: mistralSmallModel,
          temperature: 0.1,
          system: "Expert ATS. Réponds uniquement en JSON.",
          prompt: `Analyse ce CV par rapport à l'offre.
          CV: ${cvTextForAI}
          Offre: ${safeJobDesc}
          
          Retourne ce JSON:
          {
            "score": number,
            "matched_keywords": string[],
            "missing_keywords": string[],
            "strengths": string[],
            "weaknesses": string[],
            "recommendations": string[]
          }`,
        });
        parsed = JSON.parse(text.trim());
        await supabaseAdmin
          .from("ai_cache")
          .insert({
            hash,
            endpoint: "ats",
            model: "mistral-small",
            response: parsed,
          });
      } catch (error) {
        await supabase.rpc("rollback_credits_atomic", {
          user_id_input: user.id,
          amount_input: ATS_CREDIT_COST,
          reason_input: "ats_analysis",
          reference_input: reference,
        });
        return NextResponse.json(
          { error: "Erreur IA Mistral" },
          { status: 500 },
        );
      }
    }

    await supabase.from("ats_reports").insert({
      user_id: user.id,
      cv_id: cvId,
      job_description: safeJobDesc,
      score: parsed.score,
      matched_keywords: parsed.matched_keywords,
      missing_keywords: parsed.missing_keywords,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      suggestions: parsed.recommendations,
    });

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
