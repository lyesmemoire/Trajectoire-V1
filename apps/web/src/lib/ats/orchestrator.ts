import {
  generateObject,
} from "ai";

import {
  extractCVText,
} from "./extraction/extract-pdf-text";

import {
  normalizeSkills,
} from "./normalization/normalize-skills";

import {
  calculateSkillScore,
  aggregateFinalScore,
} from "./scoring/engine";

import {
  generateATSFeedback,
} from "./enrichment/generate-feedback";

import {
  JobOfferSchema,
  CVSkillsSchema,
} from "./schemas/orchestrator-schemas";

import {
  getFastAIModel,
  isRemoteAIAvailable,
} from "@/lib/ai/ai-models";

export interface ATSAnalysis {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
  confidence: number;
}

export async function processATSAnalysis(
  cvBuffer: Buffer,
  jobDescription: string,
): Promise<ATSAnalysis> {
  // 1. Extraction
  const extraction =
    await extractCVText(
      cvBuffer,
    );

  // 2. Parsing offre + CV
  const [
    jobData,
    cvSkills,
  ] =
    await Promise.all([
      parseJobOffer(
        jobDescription,
      ),
      parseCVSkills(
        extraction.text,
      ),
    ]);

  // 3. Normalisation
  const normalizedJobSkills =
    normalizeSkills(
      jobData.required,
    );

  const normalizedCVSkills =
    normalizeSkills(
      cvSkills,
    );

  // 4. Scoring déterministe
  const skillResult =
    calculateSkillScore(
      normalizedJobSkills,
      normalizedCVSkills,
    );

  const finalScore =
    aggregateFinalScore({
      skills:
        skillResult.score,

      experience:
        70,

      seniority:
        80,

      readability:
        extraction.confidence *
        100,
    });

  // 5. Feedback
  const feedback =
    await generateATSFeedback(
      skillResult.matched,
      skillResult.missing,
      finalScore,
    );

  return {
    score:
      finalScore,

    matchedSkills:
      skillResult.matched,

    missingSkills:
      skillResult.missing,

    feedback,

    confidence:
      extraction.confidence,
  };
}

async function parseJobOffer(
  text: string,
): Promise<{
  required: string[];
}> {
  if (
    !isRemoteAIAvailable()
  ) {
    return {
      required:
        extractSkillsLocally(
          text,
        ),
    };
  }

  try {
    const {
      object,
    } =
      await generateObject({
        model:
          getFastAIModel(),

        schema:
          JobOfferSchema,

        temperature:
          0.1,

        system:
          'Extrait les compétences techniques requises. JSON format: { "required": [] }',

        prompt:
          text,
      });

    return object;
  } catch {
    return {
      required:
        extractSkillsLocally(
          text,
        ),
    };
  }
}

async function parseCVSkills(
  text: string,
): Promise<string[]> {
  if (
    !isRemoteAIAvailable()
  ) {
    return extractSkillsLocally(
      text,
    );
  }

  try {
    const {
      object,
    } =
      await generateObject({
        model:
          getFastAIModel(),

        schema:
          CVSkillsSchema,

        temperature:
          0.1,

        system:
          "Extrait toutes les compétences techniques du CV. JSON format: []",

        prompt:
          text,
      });

    return object;
  } catch {
    return extractSkillsLocally(
      text,
    );
  }
}

function extractSkillsLocally(
  text: string,
): string[] {
  const normalized =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      );

  const skillDictionary = [
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
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "git",
    "github",
    "gitlab",
    "rest",
    "graphql",
    "html",
    "css",
    "tailwind",
    "prisma",
    "supabase",
    "postgres",
    "linux",
    "terraform",
    "jenkins",
    "ci/cd",
    "agile",
    "scrum",
    "figma",
    "power bi",
    "excel",
    "sap",
    "salesforce",
  ];

  const matches =
    skillDictionary.filter(
      (skill) => {
        const normalizedSkill =
          skill
            .toLowerCase()
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              "",
            );

        return normalized.includes(
          normalizedSkill,
        );
      },
    );

  return Array.from(
    new Set(matches),
  );
}