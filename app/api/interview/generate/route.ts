export const dynamic = "force-dynamic";

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getPersonaPrompt } from "@/lib/interview/personas";
import { mistralSmallModel } from "@/lib/mistral";
import { streamText } from "ai";
import { createServerClient } from "@/lib/supabase/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { envServer } from "@/lib/env.server";

const redis = new Redis({
  url: envServer.UPSTASH_REDIS_REST_URL!,
  token: envServer.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "interview_generate",
});

const RequestSchema = z.object({
  messages: z.array(z.any()),
  personaId: z.string().min(1),
  jobContext: z.any().optional(),
  sessionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Auth
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const supabase = await createServerClient();

    // ✅ 2. Rate Limiting
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
        "[Generate] Rate limiter indisponible:",
        (rateLimitError as Error).message,
      );
    }

    // ✅ 3. Validation
    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { messages, personaId, jobContext, sessionId } = parsed.data;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Tableau de messages requis." },
        { status: 400 },
      );
    }

    if (!personaId || !sessionId) {
      return NextResponse.json(
        { error: "personaId et sessionId requis." },
        { status: 400 },
      );
    }

    // ✅ 4. Ownership de la session
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("id, status")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session || session.status === "completed") {
      return NextResponse.json(
        { error: "Session invalide ou terminée." },
        { status: 403 },
      );
    }

    // ✅ 5. Génération stream via Mistral (Vercel AI SDK)
    const systemPrompt = getPersonaPrompt(personaId, jobContext);

    const result = await streamText({
      model: mistralSmallModel,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
