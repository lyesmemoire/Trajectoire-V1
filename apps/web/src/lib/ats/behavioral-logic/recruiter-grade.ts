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
  logError,
} from "@/lib/logger/Logger";

import {
  getReasoningAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

/**
 * Layer 1: Hiring Manager Mode
 *
 * Analyse :
 * - autonomie ;
 * - ownership ;
 * - décisions d'architecture ;
 * - leadership technique ;
 * - niveau de preuve.
 *
 * Fonctionne avec IA distante lorsqu'elle est disponible,
 * sinon avec une analyse locale déterministe.
 */
export async function analyzeTechnicalLeadership(
  cvText: string,
): Promise<PressureMunition[]> {
  if (
    !isRemoteAIAvailable()
  ) {
    return analyzeTechnicalLeadershipLocally(
      cvText,
    );
  }

  const prompt = `
Tu es un CTO / Engineering Manager.

Analyse si le CV montre :
- de l'autonomie ;
- de l'ownership ;
- des décisions d'architecture ;
- du leadership technique ;
- des résultats démontrables.

RÈGLES :
1. Identifie 1 à 3 éléments liés au leadership technique.
2. Utilise "vague_claim" lorsqu'une affirmation manque de preuve concrète.
3. Utilise "doubt" lorsqu'un élément mérite d'être approfondi en entretien.
4. Fournis une citation exacte ou très courte du CV dans "snippet".
5. Ne crée aucune expérience qui n'existe pas dans le CV.

CV :
${cvText}
`.trim();

  for (
    let attempt = 1;
    attempt <= 2;
    attempt++
  ) {
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
              leadershipSignals:
                z.array(
                  PressureMunitionSchema,
                ),
            }),

          system:
            "Tu es un évaluateur strict de leadership technique. Respecte exactement le schéma JSON demandé.",

          prompt,
        });

      return object
        .leadershipSignals;
    } catch (error) {
      if (
        attempt === 2
      ) {
        logError(
          "[Recruiter Grade] Leadership analysis failed after retry",
          error,
        );

        return analyzeTechnicalLeadershipLocally(
          cvText,
        );
      }
    }
  }

  return analyzeTechnicalLeadershipLocally(
    cvText,
  );
}
/**
 * Layer 2: Consistency Engine
 *
 * Détecte les écarts entre les exigences de l'offre
 * et le niveau d'expérience déclaré.
 */
export function detectInconsistencies(
  cv: any,
  job: any,
): PressureMunition[] {
  const issues:
    PressureMunition[] = [];

  const cvYears =
    toSafeNumber(
      cv?.years_experience,
    );

  const requiredYears =
    toSafeNumber(
      job?.min_years,
    );

  if (
    requiredYears > 0 &&
    cvYears < requiredYears
  ) {
    issues.push({
      id:
        createMunitionId(
          "inc_seniority",
        ),

      category:
        "inconsistency",

      hook:
        "J'ai remarqué un décalage entre les années d'expérience demandées et votre parcours...",

      evidence: {
        field:
          "Années d'expérience globales",

        snippet:
          `L'offre demande ${requiredYears} ans, le profil en affiche ${cvYears}.`,
      },

      severity:
        calculateExperienceGapSeverity(
          cvYears,
          requiredYears,
        ),

      pressureReady:
        true,

      confidence:
        1,

      suggestedQuestion:
        `L'offre demande ${requiredYears} ans d'expérience et votre profil en présente environ ${cvYears}. Comment démontrez-vous que votre niveau réel compense cet écart ?`,
    });
  }

  return issues;
}

/**
 * Layer 3: Interview Risk Prediction
 *
 * Transforme les doutes détectés en risques
 * directement exploitables pendant la simulation.
 */
export function predictInterviewRisks(
  weaknesses: PressureMunition[],
): PressureMunition[] {
  return weaknesses.map(
    (
      weakness,
      index,
    ) => ({
      id:
        createMunitionId(
          `risk_${index}`,
        ),

      category:
        "risk",

      hook:
        "Il y a un point spécifique sur lequel un recruteur pourrait vous challenger...",

      evidence:
        weakness.evidence,

      severity:
        weakness.severity,

      pressureReady:
        true,

      confidence:
        weakness.confidence,

      suggestedQuestion:
        weakness.suggestedQuestion ||
        `Préparez-vous à être challengé sur ce point : ${weakness.evidence.snippet}. Quelle preuve concrète pouvez-vous apporter ?`,
    }),
  );
}
function analyzeTechnicalLeadershipLocally(
  cvText: string,
): PressureMunition[] {
  const signals:
    PressureMunition[] = [];

  const normalized =
    normalizeText(
      cvText,
    );

  const leadershipPatterns =
    [
      "lead",
      "leader",
      "leadership",
      "manager",
      "management",
      "responsable",
      "pilotage",
      "pilote",
      "coordination",
      "coordonne",
      "encadrement",
      "encadre",
      "mentor",
      "mentorat",
      "architecture",
      "architecte",
      "strategie",
      "decision",
      "ownership",
      "equipe",
      "team",
    ];

  const leadershipTerms =
    leadershipPatterns.filter(
      (term) =>
        normalized.includes(
          term,
        ),
    );

  if (
    leadershipTerms.length === 0
  ) {
    return [];
  }

  const sentences =
    extractSentences(
      cvText,
    );

  const leadershipSentences =
    sentences.filter(
      (sentence) => {
        const normalizedSentence =
          normalizeText(
            sentence,
          );

        return leadershipPatterns.some(
          (term) =>
            normalizedSentence.includes(
              term,
            ),
        );
      },
    );

  for (
    const sentence of
      leadershipSentences.slice(
        0,
        3,
      )
  ) {
    const hasMetric =
      containsMetric(
        sentence,
      );

    const hasTechnicalEvidence =
      containsTechnicalEvidence(
        sentence,
      );

    const evidenceStrength =
      Number(hasMetric) +
      Number(
        hasTechnicalEvidence,
      );

    signals.push({
      id:
        createMunitionId(
          "leadership",
        ),

      category:
        evidenceStrength === 0
          ? "vague_claim"
          : "doubt",

      hook:
        evidenceStrength === 0
          ? "Cette affirmation de leadership mérite d'être étayée par des preuves plus concrètes."
          : "Ce signal de leadership est intéressant et mérite d'être approfondi en entretien.",

      evidence: {
        field:
          "Leadership technique",

        snippet:
          truncateSnippet(
            sentence,
          ),
      },

      severity:
        evidenceStrength === 0
          ? 0.7
          : 0.45,

      pressureReady:
        true,

      confidence:
        evidenceStrength === 0
          ? 0.72
          : 0.82,

      suggestedQuestion:
        evidenceStrength === 0
          ? "Pouvez-vous donner un exemple précis d'une décision que vous avez personnellement prise, expliquer les alternatives envisagées et mesurer son impact ?"
          : "Quel était précisément votre rôle personnel dans cette décision et quel résultat mesurable avez-vous obtenu ?",
    });
  }

  return signals;
}

function containsMetric(
  text: string,
): boolean {
  return /\b\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|heures?|mois|ans?|personnes?|utilisateurs?|clients?|projets?)\b/i.test(
    text,
  );
}

function containsTechnicalEvidence(
  text: string,
): boolean {
  const normalized =
    normalizeText(
      text,
    );

  const terms = [
    "architecture",
    "api",
    "backend",
    "frontend",
    "database",
    "base de donnees",
    "cloud",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "microservice",
    "performance",
    "securite",
    "migration",
    "scalabilite",
    "typescript",
    "javascript",
    "react",
    "next.js",
    "node",
    "python",
    "java",
    "sql",
  ];

  return terms.some(
    (term) =>
      normalized.includes(
        term,
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

function truncateSnippet(
  text: string,
): string {
  const cleaned =
    text
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    cleaned.length <= 220
  ) {
    return cleaned;
  }

  return `${cleaned.slice(
    0,
    217,
  )}...`;
}

function calculateExperienceGapSeverity(
  currentYears: number,
  requiredYears: number,
): number {
  if (
    requiredYears <= 0
  ) {
    return 0;
  }

  const gap =
    requiredYears -
    currentYears;

  const ratio =
    gap /
    requiredYears;

  return Math.max(
    0.4,
    Math.min(
      1,
      0.5 +
        ratio * 0.5,
    ),
  );
}

function toSafeNumber(
  value: unknown,
): number {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    parsed,
  );
}

function createMunitionId(
  prefix: string,
): string {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
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