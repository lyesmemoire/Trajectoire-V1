export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateObject } from "ai";
import { mistralModel } from "@/lib/mistral";
import { z } from "zod";
import { createChildLogger, logError } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";

const log = createChildLogger({ component: "cv-rewrite-bullet-api" });

const RewriteResponseSchema = z.object({
  improvedBullet: z.string().describe("Le bullet réécrit avec un verbe d'action et une structure d'impact. Utilise [X] ou [X]% si un chiffre manque."),
  explanation: z.string().describe("Explication courte de l'intervention (ex: 'Remplacement du style nominal par le verbe Piloté')"),
  confidence: z.number().min(0).max(1).describe("Indice de confiance du modèle sur la préservation du sens d'origine"),
});

const REWRITE_PROMPT = `Tu es un Coach CV expert. 
Ta mission est d'améliorer UNE SEULE ligne (bullet point) d'un CV, en te basant sur le diagnostic fourni.

RÈGLES ABSOLUES (ANTI-HALLUCINATION) :
1. INTERDICTION d'inventer des faits, des expériences, des diplômes ou des métriques.
2. Si le diagnostic indique "Manque de métrique chiffrée" et que le texte d'origine n'en contient pas, tu DOIS insérer un placeholder exact comme "[X]%" ou "[X]€" ou "[X] utilisateurs".
3. Le bullet doit commencer par un verbe d'action fort.
4. La taille doit idéalement rester entre 8 et 22 mots.

Tu dois répondre strictement dans le format JSON demandé, avec une explication pédagogique qui montre ce que tu as fait.`;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { originalBullet, issues, jobContext } = body;

    if (!originalBullet) {
      return NextResponse.json({ error: "Le bullet original est requis" }, { status: 400 });
    }

    let jobAdaptationPrompt = "";
    if (jobContext && jobContext.title) {
      jobAdaptationPrompt = `
ADAPTATION OFFRE (CIBLAGE) :
Le candidat postule pour le poste de : "${jobContext.title}".
L'offre recherche ces compétences clés : ${[...jobContext.mustHaveHardSkills, ...jobContext.mustHaveSoftSkills].join(", ")}.

RÈGLE D'ADAPTATION (TRÈS STRICTE) : 
Si l'expérience décrite dans le bullet d'origine correspond à certains de ces mots-clés, reformule le bullet pour les utiliser et faire ressortir cet alignement. 
INTERDICTION ABSOLUE d'ajouter un mot-clé si l'expérience d'origine ne le justifie pas explicitement.
N'utilise jamais un concept équivalent indirect (ex: "environnements conteneurisés" pour sous-entendre Kubernetes). Le mot-clé exact de l'offre doit être utilisable naturellement sans mentir, sinon ne le mets pas.`;
    }

    const { object } = await generateObject({
      model: mistralModel,
      temperature: 0.2, // Faible température pour un comportement déterministe
      schema: RewriteResponseSchema,
      prompt: `${REWRITE_PROMPT}

${jobAdaptationPrompt}

BULLET ORIGINAL :
"${originalBullet}"

FAIBLESSES DÉTECTÉES (DIAGNOSTIC) :
${Array.isArray(issues) && issues.length > 0 ? issues.map((i: string) => "- " + i).join("\n") : "Aucune"}
`,
    });

    log.info({
      event: "bullet_rewritten",
      userId: user.id,
      confidence: object.confidence
    });

    return NextResponse.json(object);

  } catch (error) {
    logError("[CV/RewriteBullet] Erreur lors de la réécriture", error);
    captureError(error, { component: "cv-rewrite-bullet-api" });
    
    return NextResponse.json(
      { error: "Erreur serveur lors de la réécriture du bullet" },
      { status: 500 }
    );
  }
}
