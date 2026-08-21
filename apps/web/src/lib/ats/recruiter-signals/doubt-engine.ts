import {
  generateObject,
} from "ai";

import {
  z,
} from "zod";

import {
  PressureMunition,
  PressureMunitionSchema,
} from "../contracts/munitions";

import {
  createChildLogger,
} from "../../logger";

import {
  captureError,
} from "../../sentry-context";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

/**
 * Moteur de Doute Recruteur
 *
 * Cherche :
 * - manque de preuves ;
 * - affirmations vagues ;
 * - absence de métriques ;
 * - buzzwords ;
 * - inadéquations avec l'offre ;
 * - éléments susceptibles d'être challengés.
 *
 * L'IA distante enrichit l'analyse lorsqu'elle est disponible.
 * Le moteur local garantit un résultat sans dépendance externe.
 */
export async function generateRecruiterDoubts(
  cvText: string,
  jobDesc: string,
): Promise<PressureMunition[]> {
  const log =
    createChildLogger({
      component:
        "doubt-engine",
    });

  if (
    !isRemoteAIAvailable()
  ) {
    const localDoubts =
      generateRecruiterDoubtsLocally(
        cvText,
        jobDesc,
      );

    log.info({
      event:
        "local_munitions_generated",

      count:
        localDoubts.length,

      provider:
        "local",
    });

    return localDoubts;
  }

  const prompt = `
Tu es un recruteur senior extrêmement exigeant.

Ton objectif est d'identifier les éléments du CV qui risquent de créer
un doute réel chez un recruteur par rapport à l'offre.

RÈGLES :
1. Sois sceptique et professionnel, jamais agressif.
2. Cherche les affirmations vagues, l'absence de chiffres, les buzzwords,
   les écarts de séniorité et les compétences importantes insuffisamment démontrées.
3. Pour chaque doute, utilise une citation courte du CV dans "snippet".
4. La catégorie doit être "doubt".
5. Ne crée aucune information absente du CV.
6. Indique si le doute peut devenir une question d'entretien via "pressureReady".
7. Les questions proposées doivent demander une preuve, un exemple ou un résultat.

OFFRE :
${jobDesc}

CV :
${cvText}
`.trim();

  for (
    let attempt = 1;
    attempt <= 2;
    attempt++
  ) {
    const start =
      Date.now();

    try {
      const {
        object,
      } =
        await generateObject({
          model:
            getReasoningAIModel(),

          temperature:
            0.2,

          schema:
            z.object({
              doubts:
                z.array(
                  PressureMunitionSchema,
                ),
            }),

          system:
            "Tu es un extracteur strict de signaux recruteur. Respecte exactement le schéma JSON fourni.",

          prompt,
        });

      log.info({
        event:
          "llm_munitions_generated",

        duration:
          Date.now() -
          start,

        count:
          object.doubts.length,

        attempt,

        provider:
          "openai",
      });

      return object.doubts;
    } catch (error) {
      if (
        attempt === 2
      ) {
        log.error({
          error,
          event:
            "llm_extraction_failed_fatal",
          duration:
            Date.now() -
            start,
        });

        captureError(
          error,
          {
            component:
              "doubt-engine",

            event:
              "llm_extraction_failed_fatal",

            duration:
              Date.now() -
              start,
          },
        );

        return generateRecruiterDoubtsLocally(
          cvText,
          jobDesc,
        );
      }

      log.warn({
        event:
          "llm_extraction_retry",

        attempt,

        duration:
          Date.now() -
          start,
      });
    }
  }

  return generateRecruiterDoubtsLocally(
    cvText,
    jobDesc,
  );
}
function generateRecruiterDoubtsLocally(
  cvText: string,
  jobDesc: string,
): PressureMunition[] {
  const doubts:
    PressureMunition[] = [];

  const cvNormalized =
    normalizeText(
      cvText,
    );

  const jobNormalized =
    normalizeText(
      jobDesc,
    );

  const sentences =
    extractSentences(
      cvText,
    );

  // ----------------------------------------------------------
  // 1. Vague claims
  // ----------------------------------------------------------

  const vagueTerms = [
    "expert",
    "experte",
    "excellent",
    "excellente",
    "forte experience",
    "grande experience",
    "maitrise",
    "maitrise parfaite",
    "passionne",
    "passionnee",
    "leader",
    "leadership",
    "strategique",
    "innovant",
    "innovante",
    "performant",
    "performante",
  ];

  const vagueSentences =
    sentences.filter(
      (sentence) => {
        const normalized =
          normalizeText(
            sentence,
          );

        const hasVagueClaim =
          vagueTerms.some(
            (term) =>
              normalized.includes(
                term,
              ),
          );

        return (
          hasVagueClaim &&
          !containsMetric(
            sentence,
          )
        );
      },
    );

  for (
    const sentence of
      vagueSentences.slice(
        0,
        2,
      )
  ) {
    doubts.push(
      createDoubt({
        field:
          "Niveau de preuve",

        snippet:
          sentence,

        hook:
          "Cette affirmation paraît intéressante mais manque de preuve concrète.",

        severity:
          0.62,

        confidence:
          0.76,

        suggestedQuestion:
          "Pouvez-vous illustrer cette affirmation avec un exemple précis, votre contribution personnelle et un résultat mesurable ?",
      }),
    );
  }

  // ----------------------------------------------------------
  // 2. Absence générale de résultats quantifiés
  // ----------------------------------------------------------

  if (
    !containsMetric(
      cvText,
    )
  ) {
    doubts.push(
      createDoubt({
        field:
          "Impact mesurable",

        snippet:
          findRepresentativeSnippet(
            sentences,
          ),

        hook:
          "Le CV présente des responsabilités mais peu de résultats quantifiés.",

        severity:
          0.72,

        confidence:
          0.92,

        suggestedQuestion:
          "Quel résultat concret et mesurable pouvez-vous associer à l'une de vos principales réalisations ?",
      }),
    );
  }

  // ----------------------------------------------------------
  // 3. Leadership revendiqué sans preuve suffisante
  // ----------------------------------------------------------

  const leadershipTerms = [
    "lead",
    "leader",
    "leadership",
    "manager",
    "responsable",
    "pilotage",
    "coordination",
    "encadrement",
    "mentor",
    "equipe",
    "team",
  ];

  const claimsLeadership =
    leadershipTerms.some(
      (term) =>
        cvNormalized.includes(
          term,
        ),
    );

  if (
    claimsLeadership
  ) {
    const leadershipEvidence =
      sentences.find(
        (sentence) => {
          const normalized =
            normalizeText(
              sentence,
            );

          return (
            leadershipTerms.some(
              (term) =>
                normalized.includes(
                  term,
                ),
            ) &&
            containsMetric(
              sentence,
            )
          );
        },
      );

    if (
      !leadershipEvidence
    ) {
      const snippet =
        sentences.find(
          (sentence) => {
            const normalized =
              normalizeText(
                sentence,
              );

            return leadershipTerms.some(
              (term) =>
                normalized.includes(
                  term,
                ),
            );
          },
        );

      doubts.push(
        createDoubt({
          field:
            "Leadership",

          snippet:
            snippet ||
            "Leadership mentionné dans le CV.",

          hook:
            "Le leadership est mentionné mais son périmètre réel reste difficile à mesurer.",

          severity:
            0.65,

          confidence:
            0.8,

          suggestedQuestion:
            "Quelle équipe ou quel périmètre avez-vous réellement piloté, quelles décisions vous appartenaient et quel impact avez-vous obtenu ?",
        }),
      );
    }
  }

  // ----------------------------------------------------------
  // 4. Compétences importantes de l'offre absentes du CV
  // ----------------------------------------------------------

  const jobSkills =
    extractTechnicalSkills(
      jobNormalized,
    );

  const cvSkills =
    extractTechnicalSkills(
      cvNormalized,
    );

  const missingSkills =
    jobSkills.filter(
      (skill) =>
        !cvSkills.includes(
          skill,
        ),
    );

  if (
    missingSkills.length > 0
  ) {
    const importantMissing =
      missingSkills.slice(
        0,
        4,
      );

    doubts.push(
      createDoubt({
        field:
          "Adéquation technique",

        snippet:
          `Compétences non identifiées dans le CV : ${importantMissing.join(", ")}.`,

        hook:
          "Certaines compétences techniques visibles dans l'offre ne sont pas démontrées dans le CV.",

        severity:
          Math.min(
            0.9,
            0.5 +
              importantMissing.length *
                0.08,
          ),

        confidence:
          0.86,

        suggestedQuestion:
          `L'offre mentionne ${importantMissing.join(", ")}. Quel est votre niveau réel sur ces sujets et sur quels projets les avez-vous utilisés ?`,
      }),
    );
  }

  return deduplicateDoubts(
    doubts,
  ).slice(
    0,
    6,
  );
}
interface LocalDoubtInput {
  field: string;
  snippet: string;
  hook: string;
  severity: number;
  confidence: number;
  suggestedQuestion: string;
}

function createDoubt(
  input: LocalDoubtInput,
): PressureMunition {
  return {
    id:
      `doubt_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    category:
      "doubt",

    hook:
      input.hook,

    evidence: {
      field:
        input.field,

      snippet:
        truncateSnippet(
          input.snippet,
        ),
    },

    severity:
      clamp01(
        input.severity,
      ),

    pressureReady:
      true,

    confidence:
      clamp01(
        input.confidence,
      ),

    suggestedQuestion:
      input.suggestedQuestion,
  };
}

function extractTechnicalSkills(
  normalizedText: string,
): string[] {
  const dictionary = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "node.js",
    "nodejs",
    "python",
    "java",
    "c#",
    "c++",
    "php",
    "go",
    "golang",
    "rust",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "terraform",
    "aws",
    "azure",
    "gcp",
    "git",
    "github",
    "gitlab",
    "graphql",
    "rest",
    "linux",
    "devops",
    "ci/cd",
    "machine learning",
    "data science",
    "power bi",
    "tableau",
    "salesforce",
    "sap",
  ];

  return dictionary.filter(
    (skill) =>
      normalizedText.includes(
        normalizeText(
          skill,
        ),
      ),
  );
}

function extractSentences(
  text: string,
): string[] {
  return text
    .split(
      /(?:\r?\n|[.!?]\s+)/,
    )
    .map(
      (sentence) =>
        sentence
          .replace(
            /\s+/g,
            " ",
          )
          .trim(),
    )
    .filter(
      (sentence) =>
        sentence.length >= 20,
    );
}

function containsMetric(
  text: string,
): boolean {
  return /\b\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|heures?|mois|ans?|personnes?|clients?|utilisateurs?|projets?)\b/i.test(
    text,
  );
}

function findRepresentativeSnippet(
  sentences: string[],
): string {
  const sentence =
    sentences.find(
      (item) =>
        item.length >= 30,
    );

  return (
    sentence ||
    "Aucun résultat quantifié clairement identifiable dans le CV."
  );
}

function deduplicateDoubts(
  doubts: PressureMunition[],
): PressureMunition[] {
  const seen =
    new Set<string>();

  return doubts.filter(
    (doubt) => {
      const key =
        `${doubt.evidence.field}:${doubt.evidence.snippet}`
          .toLowerCase();

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}

function truncateSnippet(
  value: string,
): string {
  const cleaned =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    cleaned.length <= 240
  ) {
    return cleaned;
  }

  return `${cleaned.slice(
    0,
    237,
  )}...`;
}

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      1,
      value,
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