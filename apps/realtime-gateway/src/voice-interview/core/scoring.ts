import OpenAI from "openai";

export interface StructuredScore {
  overall: number;
  roleUsed?: string;
  competencies: {
    communication: number;
    technical_depth: number;
    clarity: number;
    problem_solving: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  summary: string;
}

export async function scoreStructuredInterview(transcript: string, llm: (prompt: string) => Promise<string>,
): Promise<StructuredScore> {
  const prompt = `
Tu es un recruteur senior.

Analyse cet entretien.

Retourne STRICTEMENT un JSON valide sans texte autour.

Format attendu :

{
  "overall": number (0-100),
  "competencies": {
    "communication": number (0-100),
    "technical_depth": number (0-100),
    "clarity": number (0-100),
    "problem_solving": number (0-100),
    "confidence": number (0-100)
  },
  "strengths": string[],
  "improvements": string[],
  "summary": string
}

Entretien :
${transcript}
`;

  const raw = await llm(prompt);
  return JSON.parse(raw) as StructuredScore;
}

export async function callMistral(prompt: string): Promise<string> {
  // Uses OpenAI client configured with gpt-4o-mini as a robust fallback/default LLM for scoring.
  if (!process.env.OPENAI_API_KEY) {
    console.warn("No OPENAI_API_KEY found, returning mock structured score.");
    return JSON.stringify({
      overall: 82,
      competencies: {
        communication: 78,
        technical_depth: 85,
        clarity: 80,
        problem_solving: 84,
        confidence: 73
      },
      strengths: ["Excellente maîtrise technique", "Résolution de problème méthodique"],
      improvements: ["Pourrait être plus concis (clarté)", "Laisser transparaître plus de confiance"],
      summary: "Candidat très solide techniquement, l'expression orale est bonne mais manque de conviction sur certains points."
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content || "{}";
}
