export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  totalKeywords: number;
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "les",
  "des",
  "une",
  "est",
  "que",
  "qui",
  "dans",
  "avec",
  "sur",
  "par",
  "pour",
  "pas",
  "plus",
  "cette",
  "leur",
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
  return new Set(words);
}

function normalizeKeyword(kw: string): string {
  return kw.replace(/-/g, "").toLowerCase();
}

function generateSuggestions(missing: string[], score: number): string[] {
  const tips: string[] = [];
  if (score < 30) {
    tips.push(
      "Score faible. Personnalisez votre résumé professionnel pour cette offre.",
    );
  } else if (score < 60) {
    tips.push(
      "Score moyen. Intégrez les mots-clés manquants dans vos expériences.",
    );
  } else {
    tips.push(
      "Bon score ATS ! Affinez les détails techniques pour maximiser vos chances.",
    );
  }
  if (missing.length > 0) {
    tips.push(
      `Mots-clés prioritaires à intégrer : ${missing.slice(0, 5).join(", ")}`,
    );
  }
  return tips;
}

export function calculateATSScore(cvText: string, jobDescription: string, ): ATSResult {
  if (!cvText?.trim() || !jobDescription?.trim()) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: [],
      totalKeywords: 0,
    };
  }

  const jobKeywords = extractKeywords(jobDescription);
  const cvKeywords = extractKeywords(cvText);
  const normalizedCv = new Set([...cvKeywords].map(normalizeKeyword));

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobKeywords) {
    if (cvKeywords.has(kw) || normalizedCv.has(normalizeKeyword(kw))) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const total = jobKeywords.size;
  const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return {
    score,
    matchedKeywords: matched.slice(0, 20),
    missingKeywords: missing.slice(0, 15),
    suggestions: generateSuggestions(missing, score),
    totalKeywords: total,
  };
}
