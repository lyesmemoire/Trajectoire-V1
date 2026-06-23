export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateObject } from "ai";
import { mistralModel } from "@/lib/mistral";
import { JobSchema } from "@/types/cv";
import { createChildLogger, logError } from "@/lib/logger";
import { captureError } from "@/lib/sentry-context";

const log = createChildLogger({ component: "cv-extract-job-api" });

const EXTRACT_PROMPT = `Tu es un expert RH en analyse d'offres d'emploi.
Extrais les informations essentielles de l'offre d'emploi suivante dans le schéma JSON strict demandé.
Sépare bien les "Hard Skills" (compétences techniques, outils, langages) des "Soft Skills" (comportement, leadership, communication).

OFFRE D'EMPLOI :
`;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { jobText } = await req.json();

    if (!jobText || jobText.trim().length < 50) {
      return NextResponse.json({ error: "Texte de l'offre trop court ou manquant" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: mistralModel,
      temperature: 0.1,
      schema: JobSchema,
      prompt: EXTRACT_PROMPT + jobText.slice(0, 15000), // Protect against huge inputs
    });

    log.info({
      event: "job_extracted",
      userId: user.id,
      jobTitle: object.title
    });

    return NextResponse.json(object);

  } catch (error) {
    logError("[CV/ExtractJob] Erreur lors de l'extraction", error);
    captureError(error, { component: "cv-extract-job-api" });
    
    return NextResponse.json(
      { error: "Erreur serveur lors de l'analyse de l'offre d'emploi" },
      { status: 500 }
    );
  }
}
