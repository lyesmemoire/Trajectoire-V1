import {
  generateText,
} from "ai";

import {
  getFastAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

export interface ConfidenceReport {
  score: number;
  reasoning: string;
  isReliable: boolean;
}

export async function analyzeAnswerConfidence(
  answer: string,
): Promise<ConfidenceReport> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeConfidenceLocally(
      answer,
    );
  }

  try {
    const {
      text,
    } =
      await generateText({
        model:
          getFastAIModel(),

        temperature:
          0.1,

        system:
          [
            "Analyse l'assurance exprimée dans la réponse du candidat.",
            'Retourne uniquement un JSON : { "score": 0-100, "reasoning": "" }.',
            "Évalue la confiance linguistique, pas la véracité de la réponse.",
          ].join(" "),

        prompt:
          answer,
      });

    const parsed =
      parseConfidenceResponse(
        text,
      );

    if (!parsed) {
      return analyzeConfidenceLocally(
        answer,
      );
    }

    return parsed;
  } catch {
    return analyzeConfidenceLocally(
      answer,
    );
  }
}

function parseConfidenceResponse(
  text: string,
): ConfidenceReport | null {
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

    const score =
      clampScore(
        parsed.score,
      );

    const reasoning =
      typeof parsed.reasoning ===
      "string"
        ? parsed.reasoning.trim()
        : "Analyse de confiance disponible.";

    return {
      score,
      reasoning,
      isReliable:
        score > 40,
    };
  } catch {
    return null;
  }
}

function analyzeConfidenceLocally(
  answer: string,
): ConfidenceReport {
  const normalized =
    normalizeText(
      answer,
    );

  const wordCount =
    answer
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const uncertaintyMarkers = [
    "je pense",
    "je crois",
    "peut etre",
    "probablement",
    "eventuellement",
    "je ne sais pas",
    "pas sur",
    "pas certain",
    "peut-etre",
  ];

  const assertiveMarkers = [
    "j'ai",
    "jai",
    "j'ai decide",
    "jai decide",
    "j'ai pilote",
    "jai pilote",
    "j'ai realise",
    "jai realise",
    "j'ai obtenu",
    "jai obtenu",
    "resultat",
    "impact",
  ];

  const uncertaintyCount =
    uncertaintyMarkers.filter(
      (marker) =>
        normalized.includes(
          normalizeText(
            marker,
          ),
        ),
    ).length;

  const assertiveCount =
    assertiveMarkers.filter(
      (marker) =>
        normalized.includes(
          normalizeText(
            marker,
          ),
        ),
    ).length;

  let score = 60;

  score +=
    Math.min(
      25,
      assertiveCount * 7,
    );

  score -=
    Math.min(
      35,
      uncertaintyCount * 10,
    );

  if (
    wordCount < 8
  ) {
    score -= 15;
  }

  if (
    wordCount >= 30
  ) {
    score += 5;
  }

  score =
    clampScore(
      score,
    );

  const reasoning =
    score >= 75
      ? "La réponse utilise un langage affirmatif et exprime clairement l'action du candidat."
      : score >= 55
        ? "La réponse paraît globalement assurée mais contient encore quelques formulations prudentes."
        : "La réponse contient plusieurs marqueurs d'hésitation ou manque d'affirmation personnelle.";

  return {
    score,
    reasoning,
    isReliable:
      score > 40,
  };
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