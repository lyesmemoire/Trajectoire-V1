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
  weaknesses: string[];
  strengths: string[];
  summary: string;
}

const ANALYSIS_PROMPT = `
Tu es un expert en psychologie comportementale et recrutement.

Analyse la réponse du candidat à une question d'entretien.

Évalue sur 100 :
- Clarté : la réponse est-elle facile à suivre ?
- Spécificité : utilise-t-elle des exemples concrets et des chiffres ?
- Confiance : le ton paraît-il assuré ?
- Ownership : le candidat assume-t-il clairement ses actions ?

Réponds uniquement en JSON avec cette structure :
{
  "clarity": number,
  "specificity": number,
  "confidence": number,
  "ownership": number,
  "weaknesses": string[],
  "strengths": string[],
  "summary": string
}
`.trim();

export async function analyzeAnswer(
  answer: string,
  question: string,
): Promise<AnswerAnalysis> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeAnswerLocally(
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
          ANALYSIS_PROMPT,

        prompt: [
          `Question : ${question}`,
          `Réponse : ${answer}`,
        ].join("\n"),
      });

    const parsed =
      parseAnalysisResponse(
        text,
      );

    if (!parsed) {
      return analyzeAnswerLocally(
        answer,
        question,
      );
    }

    return parsed;
  } catch (error) {
    logError(
      "[analyzeAnswer Error]",
      error,
    );

    return analyzeAnswerLocally(
      answer,
      question,
    );
  }
}

function parseAnalysisResponse(
  text: string,
): AnswerAnalysis | null {
  try {
    const cleanText =
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
        cleanText,
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

      weaknesses:
        normalizeStringArray(
          parsed.weaknesses,
        ),

      strengths:
        normalizeStringArray(
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

function analyzeAnswerLocally(
  answer: string,
  question: string,
): AnswerAnalysis {
  const cleanedAnswer =
    answer
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  const normalizedAnswer =
    normalizeText(
      cleanedAnswer,
    );

  const normalizedQuestion =
    normalizeText(
      question,
    );

  const words =
    cleanedAnswer
      .split(/\s+/)
      .filter(Boolean);

  const wordCount =
    words.length;

  const sentences =
    cleanedAnswer
      .split(/[.!?]+/)
      .map(
        (sentence) =>
          sentence.trim(),
      )
      .filter(Boolean);

  const hasMetric =
    /\b\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|mois|ans?|personnes?|clients?|utilisateurs?|projets?)\b/i.test(
      cleanedAnswer,
    );

  const concreteMarkers = [
    "par exemple",
    "notamment",
    "j'ai",
    "jai",
    "nous avons",
    "resultat",
    "impact",
    "objectif",
    "projet",
    "situation",
    "action",
  ];

  const ownershipMarkers = [
    "j'ai",
    "jai",
    "j'étais",
    "jetais",
    "j'ai décidé",
    "jai decide",
    "j'ai créé",
    "jai cree",
    "j'ai mis",
    "jai mis",
    "j'ai piloté",
    "jai pilote",
    "j'ai proposé",
    "jai propose",
  ];

  const uncertaintyMarkers = [
    "peut etre",
    "peut-être",
    "je pense",
    "je crois",
    "probablement",
    "eventuellement",
    "éventuellement",
    "je ne sais pas",
  ];

  const questionTerms =
    extractSignificantTerms(
      normalizedQuestion,
    );

  const relevantTerms =
    questionTerms.filter(
      (term) =>
        normalizedAnswer.includes(
          term,
        ),
    );

  let clarity = 55;

  if (
    sentences.length >= 2
  ) {
    clarity += 10;
  }

  if (
    wordCount >= 40 &&
    wordCount <= 180
  ) {
    clarity += 15;
  }

  if (
    wordCount > 250
  ) {
    clarity -= 15;
  }

  let specificity = 45;

  if (hasMetric) {
    specificity += 25;
  }

  if (
    concreteMarkers.some(
      (marker) =>
        normalizedAnswer.includes(
          normalizeText(
            marker,
          ),
        ),
    )
  ) {
    specificity += 20;
  }

  let ownership = 45;

  const ownershipCount =
    ownershipMarkers.filter(
      (marker) =>
        normalizedAnswer.includes(
          normalizeText(
            marker,
          ),
        ),
    ).length;

  ownership +=
    Math.min(
      40,
      ownershipCount * 12,
    );

  let confidence = 60;

  const uncertaintyCount =
    uncertaintyMarkers.filter(
      (marker) =>
        normalizedAnswer.includes(
          normalizeText(
            marker,
          ),
        ),
    ).length;

  confidence -=
    uncertaintyCount * 12;

  if (
    wordCount >= 35
  ) {
    confidence += 10;
  }

  if (
    questionTerms.length > 0
  ) {
    const relevanceRatio =
      relevantTerms.length /
      questionTerms.length;

    clarity +=
      Math.round(
        relevanceRatio * 10,
      );
  }

  clarity =
    clampScore(
      clarity,
    );

  specificity =
    clampScore(
      specificity,
    );

  confidence =
    clampScore(
      confidence,
    );

  ownership =
    clampScore(
      ownership,
    );

  const strengths:
    string[] = [];

  const weaknesses:
    string[] = [];

  if (
    clarity >= 70
  ) {
    strengths.push(
      "Réponse structurée et compréhensible",
    );
  } else {
    weaknesses.push(
      "La structure de la réponse peut être plus claire",
    );
  }

  if (
    specificity >= 70
  ) {
    strengths.push(
      "Présence d'éléments concrets ou mesurables",
    );
  } else {
    weaknesses.push(
      "La réponse manque d'exemples précis ou de résultats mesurables",
    );
  }

  if (
    ownership >= 70
  ) {
    strengths.push(
      "Contribution personnelle clairement exprimée",
    );
  } else {
    weaknesses.push(
      "Le rôle personnel du candidat reste insuffisamment explicite",
    );
  }

  if (
    confidence < 55
  ) {
    weaknesses.push(
      "Le langage utilisé traduit une certaine hésitation",
    );
  }

  return {
    clarity,
    specificity,
    confidence,
    ownership,

    weaknesses:
      weaknesses.slice(
        0,
        3,
      ),

    strengths:
      strengths.slice(
        0,
        3,
      ),

    summary:
      buildLocalSummary({
        clarity,
        specificity,
        confidence,
        ownership,
      }),
  };
}

function buildLocalSummary(
  scores: {
    clarity: number;
    specificity: number;
    confidence: number;
    ownership: number;
  },
): string {
  const average =
    Math.round(
      (
        scores.clarity +
        scores.specificity +
        scores.confidence +
        scores.ownership
      ) / 4,
    );

  if (
    average >= 80
  ) {
    return "Réponse solide, claire et convaincante.";
  }

  if (
    average >= 65
  ) {
    return "Réponse globalement convaincante, avec quelques éléments à approfondir.";
  }

  if (
    average >= 50
  ) {
    return "Réponse exploitable mais encore trop générale sur certains points.";
  }

  return "Réponse qui nécessite davantage de structure, de preuves et de précision.";
}

function extractSignificantTerms(
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
      "etes",
      "être",
      "cette",
      "votre",
    ]);

  return Array.from(
    new Set(
      text
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
  ).slice(
    0,
    20,
  );
}

function normalizeStringArray(
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
  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue,
    )
  ) {
    return 50;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        numberValue,
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