import {
  generateText,
} from "ai";

import {
  getFastAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

const FEEDBACK_PROMPT = `
Tu es un expert en recrutement.

Analyse le matching entre un candidat et une offre d'emploi.

Objectifs :
- expliquer clairement pourquoi le score est élevé ou bas ;
- mettre en avant les compétences pertinentes trouvées ;
- identifier les compétences importantes manquantes ;
- rester factuel et concis.

Format :
2 à 3 phrases maximum.
`.trim();

export async function generateATSFeedback(
  matched: string[],
  missing: string[],
  score: number,
): Promise<string> {
  /*
   * Aucun fournisseur distant configuré :
   * on génère immédiatement un feedback déterministe.
   */
  if (
    !isRemoteAIAvailable()
  ) {
    return generateLocalFeedback(
      matched,
      missing,
      score,
    );
  }

  try {
    const {
      text,
    } =
      await generateText({
        model:
          getFastAIModel(),

        system:
          FEEDBACK_PROMPT,

        prompt: [
          `Score : ${score}/100`,
          `Compétences trouvées : ${formatSkills(matched)}`,
          `Compétences manquantes : ${formatSkills(missing)}`,
        ].join("\n"),
      });

    const normalized =
      text.trim();

    if (!normalized) {
      return generateLocalFeedback(
        matched,
        missing,
        score,
      );
    }

    return normalized;
  } catch {
    return generateLocalFeedback(
      matched,
      missing,
      score,
    );
  }
}

function generateLocalFeedback(
  matched: string[],
  missing: string[],
  score: number,
): string {
  const normalizedScore =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score),
      ),
    );

  const matchedText =
    formatSkills(
      matched.slice(0, 4),
    );

  const missingText =
    formatSkills(
      missing.slice(0, 4),
    );

  if (
    normalizedScore >= 80
  ) {
    if (
      missing.length === 0
    ) {
      return `Le profil présente une très bonne adéquation avec l'offre, avec un score de ${normalizedScore}/100. Les principales compétences recherchées sont bien représentées, notamment ${matchedText}.`;
    }

    return `Le profil présente une forte adéquation avec l'offre, avec un score de ${normalizedScore}/100. Les compétences ${matchedText} sont bien couvertes, mais ${missingText} restent à renforcer ou à mieux démontrer.`;
  }

  if (
    normalizedScore >= 60
  ) {
    return `Le profil présente une adéquation correcte avec l'offre, avec un score de ${normalizedScore}/100. Les compétences ${matchedText} constituent des points positifs, tandis que ${missingText} limitent encore le niveau de matching.`;
  }

  if (
    normalizedScore >= 40
  ) {
    return `Le matching reste partiel avec un score de ${normalizedScore}/100. Certaines compétences pertinentes sont présentes, notamment ${matchedText}, mais plusieurs éléments importants manquent encore : ${missingText}.`;
  }

  if (
    matched.length === 0
  ) {
    return `Le niveau de matching est faible avec un score de ${normalizedScore}/100. Peu de compétences directement liées à l'offre ont été identifiées et plusieurs exigences importantes restent absentes ou insuffisamment visibles dans le CV.`;
  }

  return `Le niveau de matching est faible avec un score de ${normalizedScore}/100. Quelques compétences comme ${matchedText} sont présentes, mais les écarts restent importants, notamment concernant ${missingText}.`;
}

function formatSkills(
  skills: string[],
): string {
  const cleaned =
    Array.from(
      new Set(
        skills
          .map(
            (skill) =>
              skill.trim(),
          )
          .filter(Boolean),
      ),
    );

  if (
    cleaned.length === 0
  ) {
    return "aucune compétence spécifique identifiée";
  }

  if (
    cleaned.length === 1
  ) {
    return cleaned[0]!;
  }

  if (
    cleaned.length === 2
  ) {
    return `${cleaned[0]} et ${cleaned[1]}`;
  }

  const last =
    cleaned[
      cleaned.length - 1
    ];

  return `${cleaned
    .slice(0, -1)
    .join(", ")} et ${last}`;
}