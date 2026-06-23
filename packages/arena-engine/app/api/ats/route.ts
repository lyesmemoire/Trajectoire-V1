import { NextRequest, NextResponse } from "next/server";
import { generateObject }             from "ai";
import { z }                         from "zod";
import { mistralModel }              from "@/lib/mistral";
import { createClient }              from "@/lib/supabase/server";
import {
  JobExtractionSchema,
  normalizeSkills,
} from "@/lib/ats/schemas/job-extraction.schema";

const RequestSchema = z.object({
  raw_job_posting: z.string().min(50).max(15000),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // 2. Input
    const body = RequestSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Offre d'emploi manquante ou trop courte." },
        { status: 400 }
      );
    }

    // 3. Extraction structurée — generateObject
    const { object: extraction } = await generateObject({
      model:       mistralModel,
      schema:      JobExtractionSchema,
      temperature: 0.05, // Quasi-déterministe — extraction factuelle
      system: `Tu es un parseur d'offres d'emploi expert.

RÈGLES :
- Tu extrais uniquement ce qui est explicitement écrit dans l'offre.
- Tu n'inventes ni compétence ni mission absente du texte.
- must_have.hard_skills : uniquement les compétences marquées comme obligatoires
  ("requis", "indispensable", "vous maîtrisez", "expérience en X requise").
- nice_to_have : compétences marquées comme souhaitables ("un plus", "idéalement", "souhaité").
- Si tu ne peux pas déterminer une valeur, utilise null ou UNKNOWN selon le champ.`,

      prompt: `Extrais les informations structurées de cette offre d'emploi :

${body.data.raw_job_posting}`,
    });

    // 4. Normalisation déterministe des compétences (no LLM)
    const normalized: typeof extraction = {
      ...extraction,
      must_have: {
        ...extraction.must_have,
        hard_skills: normalizeSkills(extraction.must_have.hard_skills),
      },
      nice_to_have: {
        ...extraction.nice_to_have,
        hard_skills: normalizeSkills(extraction.nice_to_have.hard_skills),
      },
    };

    // 5. Validation finale
    const finalValidation = JobExtractionSchema.safeParse(normalized);
    if (!finalValidation.success) {
      console.error("[ATS] Post-normalization validation failed:", finalValidation.error);
      return NextResponse.json(
        { error: "Extraction invalide après normalisation." },
        { status: 500 }
      );
    }

    return NextResponse.json(finalValidation.data);

  } catch (error) {
    console.error("[ATS] Error:", error);
    return NextResponse.json({ error: "Erreur d'extraction." }, { status: 500 });
  }
}
