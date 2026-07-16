// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { computeAndSaveCTS } from "@/lib/scoring/career-trajectory";
import { z } from "zod";
import { envServer } from "@/lib/env.server";

const feedbackSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  actionableAdvice: z.array(z.string()),
  detailedAnalysis: z.object({
    communication: z.string(),
    technical: z.string()
  }),
  committeeDecision: z.object({
    executiveSummary: z.string(),
    strategicCredibility: z.number(),
    shortlistProbability: z.number(),
    hiringSignal: z.string()
  }).optional()
});

let openai: OpenAI;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: envServer.OPENAI_API_KEY || "dummy" });
  }
  return openai;
}

const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL!,
  token: envServer.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  prefix: "interview_feedback",
});

const FEEDBACK_SYSTEM_PROMPT = `Tu es un expert en recrutement d'élite.
Analyse cet historique d'interview et fournis un feedback.

RÈGLES CRITIQUES:
1. Sois intransigeant mais constructif. 
2. Le format de sortie DOIT être STRICTEMENT un JSON valide. Aucun texte hors JSON.
3. The committee decision represents a simulated executive committee discussion. Tone must be institutional, probabilistic, and non-definitive. Avoid deterministic language such as "will be hired" or "will be rejected". Always frame outcomes as probability-based assessment.

FORMAT JSON ATTENDU:
{
  "overallScore": <number 0-100>,
  "strengths": ["<string>"],
  "weaknesses": ["<string>"],
  "actionableAdvice": ["<string>"],
  "detailedAnalysis": {
    "communication": "<string>",
    "technical": "<string>"
  },
  "committeeDecision": {
    "executiveSummary": "<string>",
    "strategicCredibility": <number 0-100>,
    "shortlistProbability": <number 0-100>,
    "hiringSignal": "strong_yes" | "yes" | "maybe" | "no"
  }
}`;

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Auth
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const supabase = await createServerClient();

    // ✅ 2. Rate Limiting
    // Rate limiting (fail-open)
    try {
      const { success } = await ratelimit.limit(user.id);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }
    } catch (rateLimitError) {
      console.warn(
        "[Feedback] Rate limiter indisponible, requête autorisée:",
        (rateLimitError as Error).message,
      );
    }

    // ✅ 3. Validation
    const body = await req.json();
    const { sessionId, messages } = body;

    if (!sessionId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // ✅ 4. Ownership de session
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("id, status")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 403 },
      );
    }

    if (session.status === "completed") {
      return NextResponse.json(
        { error: "Session déjà évaluée." },
        { status: 400 },
      );
    }

    // ✅ 5. Limiter la taille des messages
    const conversationTranscript = messages
      .slice(-30) // Prend les 30 derniers messages max
      .map(
        (m) =>
          `${m.role === "user" ? "CANDIDAT" : "RECRUTEUR"} : ${String(
            m.content,
          ).slice(0, 1000)}`,
      )
      .join("\n\n");

    // ✅ 6. Appel OpenAI
    let parsed: any;

    try {
      const ai = getOpenAI();
      const completion = await ai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: FEEDBACK_SYSTEM_PROMPT },
          {
            role: "user",
            content: `HISTORIQUE:\n${conversationTranscript}`,
          },
        ],
      });

      const raw = completion.choices[0]?.message.content || "";
      const rawParsed = JSON.parse(raw);

      // Validation stricte Zod
      const validationResult = feedbackSchema.safeParse(rawParsed);
      if (!validationResult.success) {
        throw new Error("Invalid schema: " + validationResult.error.message);
      }
      
      parsed = validationResult.data;

      // Correction, clamping et cohérence métier
      if (parsed.committeeDecision) {
        // Clamp and round strategicCredibility
        let cred = Math.round(parsed.committeeDecision.strategicCredibility);
        cred = Math.max(0, Math.min(100, cred));
        parsed.committeeDecision.strategicCredibility = cred;

        // Clamp and round shortlistProbability
        let prob = Math.round(parsed.committeeDecision.shortlistProbability);
        prob = Math.max(0, Math.min(100, prob));
        parsed.committeeDecision.shortlistProbability = prob;

        // Force hiringSignal consistency
        let newSignal: "strong_yes" | "yes" | "maybe" | "no" = "no";
        if (prob >= 80) newSignal = "strong_yes";
        else if (prob >= 65) newSignal = "yes";
        else if (prob >= 45) newSignal = "maybe";
        
        if (parsed.committeeDecision.hiringSignal !== newSignal) {
           console.warn(`[Feedback API] Corrected hiringSignal from ${parsed.committeeDecision.hiringSignal} to ${newSignal} based on probability ${prob}`);
           parsed.committeeDecision.hiringSignal = newSignal;
        }
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Erreur lors de l'analyse du feedback par l'IA." },
        { status: 500 },
      );
    }

    // ✅ 7. Sauvegarde finale
    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({
        status: "completed",
        score: parsed.overallScore,
        feedback_json: parsed, // On remplace le jobContext par le feedback final
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Erreur sauvegarde." },
        { status: 500 },
      );
    }

    // ✅ 8. Computation du Career Trajectory Score (CTS)
    let ctsResult = null;
    try {
      ctsResult = await computeAndSaveCTS(user.id, sessionId, parsed);
      if (ctsResult) {
        parsed.careerTrajectoryScore = ctsResult;
      }
    } catch (err) {
      console.error("[Feedback API] Failed to compute CTS:", err);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
