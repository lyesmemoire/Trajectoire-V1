import { mistralModel } from "@/lib/mistral";
import { generateText } from "ai";
const EXTRACTION_PROMPT = `Tu es un expert en analyse de CV. 
Analyse le texte suivant et extrait les informations dans un format JSON STRICT. 
IMPORTANT: Conserve la langue originale du texte.

Schema attendu:
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string | null"
  },
  "summary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "period": "string",
      "location": "string | null",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": "string",
      "mention": "string | null"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"]
  },
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ]
}

Réponds uniquement avec le JSON.

TEXTE DU CV:
`;
export async function parseCVToStructure(cvText) {
    try {
        const { text } = await generateText({
            model: mistralModel,
            temperature: 0.1,
            prompt: EXTRACTION_PROMPT + cvText,
        });
        const cleanText = text
            .trim()
            .replace(/^```json/, "")
            .replace(/```$/, "");
        return JSON.parse(cleanText);
    }
    catch (error) {
        console.error("[ParseCVToStructure Error]:", error);
        throw new Error("Erreur lors de la structuration des données du CV.");
    }
}
//# sourceMappingURL=cv-parser.js.map