// lib/local-ats.ts
// Analyse ATS locale via Ollama (Llama3 + nomic-embed-text)
// Zéro dépendance OpenAI — tout reste en local

const OLLAMA_BASE = "http://localhost:11434";

// ── Embeddings via nomic-embed-text ──────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_BASE}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama embeddings error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.embedding;
}

// ── Similarité cosinus ───────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i]!, 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// ── Score sémantique ─────────────────────────────────────

export async function computeSemanticScore(cvText: string, jobText: string, ): Promise<number> {
  const [cvEmbed, jobEmbed] = await Promise.all([
    getEmbedding(cvText),
    getEmbedding(jobText),
  ]);

  const similarity = cosineSimilarity(cvEmbed, jobEmbed);
  return Math.round(similarity * 100);
}

// ── Score mots-clés ──────────────────────────────────────

export function computeKeywordScore(cv: string, job: string): number {
  const jobWords = job.toLowerCase().split(/\W+/);
  const cvLower = cv.toLowerCase();

  const uniqueWords = [...new Set(jobWords)].filter((w) => w.length > 3);

  if (uniqueWords.length === 0) return 0;

  let matches = 0;
  uniqueWords.forEach((word) => {
    if (cvLower.includes(word)) matches++;
  });

  return Math.round((matches / uniqueWords.length) * 100);
}

// ── Feedback structuré via Llama3 ────────────────────────

export async function generateFeedback(cvText: string, jobText: string, ): Promise<{
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}> {
  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: `Analyse ATS.

Donne uniquement JSON valide :

{
"score": number,
"matched_keywords": string[],
"missing_keywords": string[],
"strengths": string[],
"weaknesses": string[],
"recommendations": string[]
}

CV:
${cvText.slice(0, 3000)}

JOB:
${jobText.slice(0, 2000)}`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Ollama generate error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const raw = data.response;

  // Extraction robuste du JSON depuis la réponse
  try {
    // Chercher le premier { et le dernier }
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("Pas de JSON trouvé dans la réponse Ollama");
    }
    const jsonStr = raw.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);

    return {
      matched_keywords: Array.isArray(parsed.matched_keywords)
        ? parsed.matched_keywords
        : [],
      missing_keywords: Array.isArray(parsed.missing_keywords)
        ? parsed.missing_keywords
        : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
    };
  } catch (error) {
    console.error("[LocalATS] Failed to parse Llama3 response:", raw);
    return {
      matched_keywords: [],
      missing_keywords: [],
      strengths: ["Analyse non disponible"],
      weaknesses: ["Analyse non disponible"],
      recommendations: [],
    };
  }
}
