import { mistralModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { ParsedCVSchema, ParsedCV } from "../../types/cv";

const EXTRACTION_PROMPT = `Tu es un expert en analyse de CV. 
Analyse le texte suivant et extrait les informations STRICTEMENT dans le schéma demandé.
IMPORTANT: 
- Conserve la langue originale du texte.
- Si une information n'existe pas, omet-la ou laisse vide.
- Sépare bien chaque responsabilité ou réalisation en "bullets" disctincts dans "experiences".

TEXTE DU CV:
`;

export async function parseCVToStructure(cvText: string): Promise<ParsedCV> {
  try {
    const { object } = await generateObject({
      model: mistralModel,
      temperature: 0.1,
      schema: ParsedCVSchema,
      prompt: EXTRACTION_PROMPT + cvText,
    });

    return object as ParsedCV;
  } catch (error) {
    console.error("[ParseCVToStructure Error]:", error);
    throw new Error("Erreur lors de la structuration des données du CV.");
  }
}
