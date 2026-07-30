import { extractCVText } from "./extraction/extract-pdf-text";
import { normalizeSkills } from "./normalization/normalize-skills";
import { calculateSkillScore, aggregateFinalScore } from "./scoring/engine";
import { generateATSFeedback } from "./enrichment/generate-feedback";
import { mistralSmallModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { JobOfferSchema, CVSkillsSchema } from "./schemas/orchestrator-schemas";

export interface ATSAnalysis {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
  confidence: number;
}

export async function processATSAnalysis(cvBuffer: Buffer, jobDescription: string, ): Promise<ATSAnalysis> {
  // 1. Extraction
  const extraction = await extractCVText(cvBuffer);

  // 2. Parsing IA de l'offre et du CV (En parallèle)
  const [jobData, cvSkills] = await Promise.all([
    parseJobOffer(jobDescription),
    parseCVSkills(extraction.text),
  ]);

  // 3. Normalisation
  const normalizedJobSkills = normalizeSkills(jobData.required);
  const normalizedCVSkills = normalizeSkills(cvSkills);

  // 4. Scoring déterministe
  const skillResult = calculateSkillScore(
    normalizedJobSkills,
    normalizedCVSkills,
  );

  // Scoring simplifié pour l'exemple (XP et Seniority mockés ici)
  const finalScore = aggregateFinalScore({
    skills: skillResult.score,
    experience: 70,
    seniority: 80,
    readability: extraction.confidence * 100,
  });

  // 5. Enrichment IA
  const feedback = await generateATSFeedback(
    skillResult.matched,
    skillResult.missing,
    finalScore,
  );

  return {
    score: finalScore,
    matchedSkills: skillResult.matched,
    missingSkills: skillResult.missing,
    feedback,
    confidence: extraction.confidence,
  };
}

async function parseJobOffer(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: JobOfferSchema,
    temperature: 0.1,
    system:
      'Extrait les compétences techniques requises. JSON format: { "required": [] }',
    prompt: text,
  });
  return object;
}

async function parseCVSkills(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: CVSkillsSchema,
    temperature: 0.1,
    system: "Extrait toutes les compétences techniques du CV. JSON format: []",
    prompt: text,
  });
  return object;
}
