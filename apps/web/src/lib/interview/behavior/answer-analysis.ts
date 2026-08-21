import {
  generateText,
} from "ai";

import {
  logError,
} from "@/lib/logger/Logger";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

export interface AnswerAnalysis {
  clarity: number;
  specificity: number;
  confidence: number;
  ownership: number;

  verbosity: number;
  fillerDensity: number;
  relevanceScore: number;
  ramblingScore: number;

  weaknesses: string[];
  strengths: string[];
  summary: string;
}

const SYSTEM_PROMPT = `
Tu es un expert en psychologie comportementale et recrutement.

Analyse la réponse du candidat sur ces dimensions, chacune de 0 à 100 :

- clarity : structure et facilité de compréhension ;
- specificity : faits, exemples et chiffres ;
- confidence : assurance exprimée ;
- ownership : responsabilité personnelle ;
- verbosity : longueur excessive par rapport à la valeur apportée ;
- fillerDensity : fréquence des tics de langage ;
- relevanceScore : adéquation avec la question ;
- ramblingScore : tendance à tourner autour du sujet.

Retourne uniquement un JSON contenant ces huit scores ainsi que :
{
  "weaknesses": [],
  "strengths": [],
  "summary": ""
}
`.trim();

export async function analyzeAnswer(
  answer: string,
  question: string,
): Promise<AnswerAnalysis> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeBehaviorLocally(
      answer,
      question,
    );
  }

  try {
    const {
      text,
    } =
      await generateText({
        model:
          getReasoningAIModel(),

        temperature:
          0.1,

        system:
          SYSTEM_PROMPT,

        prompt: [
          `Question : ${question}`,
          `Réponse : ${answer}`,
        ].join("\n"),
      });

    const parsed =
      parseBehaviorResponse(
        text,
      );

    if (!parsed) {
      return analyzeBehaviorLocally(
        answer,
        question,
      );
    }

    return parsed;
  } catch (error) {
    logError(
      "Analysis Error",
      error,
    );

    return analyzeBehaviorLocally(
      answer,
      question,
    );
  }
}

function analyzeBehaviorLocally(
  answer: string,
  question: string,
): AnswerAnalysis {
  const cleaned =
    answer
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  const normalized =
    normalizeText(
      cleaned,
    );

  const wordCount =
    cleaned
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const sentenceCount =
    Math.max(
      1,
      cleaned
        .split(
          /[.!?]+/,
        )
        .filter(
          (item) =>
            item.trim(),
        ).length,
    );

  const fillerTerms = [
    "euh",
    "heu",
    "bah",
    "ben",
    "du coup",
    "en fait",
    "genre",
    "voila",
    "voilà",
    "donc donc",
  ];

  const fillerCount =
    fillerTerms.reduce(
      (
        total,
        filler,
      ) =>
        total +
        countOccurrences(
          normalized,
          normalizeText(
            filler,
          ),
        ),
      0,
    );

  const hasMetric =
    /\b\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|mois|ans?|personnes?|clients?|utilisateurs?|projets?)\b/i.test(
      cleaned,
    );

  const ownershipMarkers = [
    "j'ai",
    "jai",
    "j'étais",
    "jetais",
    "j'ai decide",
    "jai decide",
    "j'ai pilote",
    "jai pilote",
    "j'ai cree",
    "jai cree",
    "j'ai propose",
    "jai propose",
  ];

  const uncertaintyMarkers = [
    "je pense",
    "je crois",
    "peut etre",
    "probablement",
    "je ne sais pas",
    "pas certain",
  ];

  const questionTerms =
    extractTerms(
      question,
    );

  const answerTerms =
    new Set(
      extractTerms(
        answer,
      ),
    );

  const matchedTerms =
    questionTerms.filter(
      (term) =>
        answerTerms.has(
          term,
        ),
    );

  const relevanceRatio =
    questionTerms.length === 0
      ? 0.7
      : matchedTerms.length /
        questionTerms.length;

  const fillerDensity =
    clampScore(
      wordCount === 0
        ? 0
        : (
            fillerCount /
            wordCount
          ) *
            100 *
            8,
    );

  let verbosity = 35;

  if (
    wordCount > 100
  ) {
    verbosity = 55;
  }

  if (
    wordCount > 180
  ) {
    verbosity = 75;
  }

  if (
    wordCount > 280
  ) {
    verbosity = 90;
  }

  let clarity =
    55;

  if (
    sentenceCount >= 2 &&
    sentenceCount <= 8
  ) {
    clarity += 15;
  }

  if (
    verbosity >= 75
  ) {
    clarity -= 15;
  }

  if (
    fillerDensity > 35
  ) {
    clarity -= 10;
  }

  let specificity =
    45;

  if (hasMetric) {
    specificity += 30;
  }

  if (
    /\b(exemple|situation|resultat|impact|objectif|action)\b/i.test(
      normalized,
    )
  ) {
    specificity += 15;
  }

  let ownership =
    45;

  ownership +=
    Math.min(
      40,
      ownershipMarkers.filter(
        (marker) =>
          normalized.includes(
            normalizeText(
              marker,
            ),
          ),
      ).length *
        10,
    );

  let confidence =
    65;

  confidence -=
    uncertaintyMarkers.filter(
      (marker) =>
        normalized.includes(
          normalizeText(
            marker,
          ),
        ),
    ).length *
    10;

  const relevanceScore =
    clampScore(
      45 +
        relevanceRatio * 55,
    );

  const ramblingScore =
    clampScore(
      verbosity * 0.55 +
        fillerDensity *
          0.25 +
        (
          100 -
          relevanceScore
        ) *
          0.2,
    );

  clarity =
    clampScore(
      clarity,
    );

  specificity =
    clampScore(
      specificity,
    );

  ownership =
    clampScore(
      ownership,
    );

  confidence =
    clampScore(
      confidence,
    );

  const weaknesses:
    string[] = [];

  const strengths:
    string[] = [];

  if (
    clarity >= 70
  ) {
    strengths.push(
      "Réponse structurée",
    );
  } else {
    weaknesses.push(
      "Structure de réponse perfectible",
    );
  }

  if (
    specificity >= 70
  ) {
    strengths.push(
      "Réponse concrète et factuelle",
    );
  } else {
    weaknesses.push(
      "Manque de faits ou de résultats mesurables",
    );
  }

  if (
    relevanceScore < 60
  ) {
    weaknesses.push(
      "Réponse partiellement éloignée de la question",
    );
  }

  if (
    ramblingScore >= 65
  ) {
    weaknesses.push(
      "Réponse trop longue ou insuffisamment focalisée",
    );
  }

  if (
    ownership >= 70
  ) {
    strengths.push(
      "Contribution personnelle bien exprimée",
    );
  }

  return {
    clarity,
    specificity,
    confidence,
    ownership,

    verbosity:
      clampScore(
        verbosity,
      ),

    fillerDensity,

    relevanceScore,

    ramblingScore,

    weaknesses:
      weaknesses.slice(
        0,
        4,
      ),

    strengths:
      strengths.slice(
        0,
        4,
      ),

    summary:
      buildBehaviorSummary({
        clarity,
        specificity,
        relevanceScore,
        ramblingScore,
      }),
  };
}

function parseBehaviorResponse(
  text: string,
): AnswerAnalysis | null {
  try {
    const cleaned =
      text
        .trim()
        .replace(
          /^```json\s*/i,
          "",
        )
        .replace(
          /```$/,
          "",
        )
        .trim();

    const parsed =
      JSON.parse(
        cleaned,
      ) as Record<
        string,
        unknown
      >;

    return {
      clarity:
        clampScore(
          parsed.clarity,
        ),

      specificity:
        clampScore(
          parsed.specificity,
        ),

      confidence:
        clampScore(
          parsed.confidence,
        ),

      ownership:
        clampScore(
          parsed.ownership,
        ),

      verbosity:
        clampScore(
          parsed.verbosity,
        ),

      fillerDensity:
        clampScore(
          parsed.fillerDensity,
        ),

      relevanceScore:
        clampScore(
          parsed.relevanceScore,
        ),

      ramblingScore:
        clampScore(
          parsed.ramblingScore,
        ),

      weaknesses:
        normalizeArray(
          parsed.weaknesses,
        ),

      strengths:
        normalizeArray(
          parsed.strengths,
        ),

      summary:
        typeof parsed.summary ===
        "string"
          ? parsed.summary.trim()
          : "",
    };
  } catch {
    return null;
  }
}

function buildBehaviorSummary(
  values: {
    clarity: number;
    specificity: number;
    relevanceScore: number;
    ramblingScore: number;
  },
): string {
  const positiveAverage =
    (
      values.clarity +
      values.specificity +
      values.relevanceScore
    ) / 3;

  if (
    positiveAverage >= 75 &&
    values.ramblingScore <
      45
  ) {
    return "Réponse claire, ciblée et convaincante.";
  }

  if (
    positiveAverage >= 60
  ) {
    return "Réponse globalement pertinente, mais encore améliorable sur la précision ou la concision.";
  }

  return "Réponse à restructurer pour gagner en pertinence, précision et impact.";
}

function countOccurrences(
  text: string,
  value: string,
): number {
  if (!value) {
    return 0;
  }

  return text
    .split(value)
    .length - 1;
}

function extractTerms(
  text: string,
): string[] {
  const ignored =
    new Set([
      "avec",
      "dans",
      "pour",
      "vous",
      "votre",
      "nous",
      "comment",
      "pourquoi",
      "quel",
      "quelle",
      "quels",
      "quelles",
      "avez",
      "cette",
      "etre",
      "êtes",
    ]);

  return Array.from(
    new Set(
      normalizeText(
        text,
      )
        .split(
          /[^a-z0-9+#.-]+/,
        )
        .filter(
          (word) =>
            word.length >= 4 &&
            !ignored.has(
              word,
            ),
        ),
    ),
  );
}

function normalizeArray(
  value: unknown,
): string[] {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ): item is string =>
        typeof item ===
          "string",
    )
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean);
}

function clampScore(
  value: unknown,
): number {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return 50;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        parsed,
      ),
    ),
  );
}

function normalizeText(
  value: string,
): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}