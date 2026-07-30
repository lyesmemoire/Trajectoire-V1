import { extractCVText } from "./extraction/extract-pdf-text";
import { normalizeSkills } from "./normalization/normalize-skills";
import { calculateSkillScore } from "./scoring/engine";
import {
  calculatePremiumATSScore,
  PremiumATSScore,
} from "./scoring/premium-engine";
import { detectRecruiterSignals } from "./recruiter-signals/detector";
import { generateRecruiterDoubts } from "./recruiter-signals/doubt-engine";
import {
  analyzeTechnicalLeadership,
  detectInconsistencies,
  predictInterviewRisks,
} from "./behavioral-logic/recruiter-grade";
import { mistralModel, mistralSmallModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { JobIntelligenceSchema, AdvancedCVSchema, RecruiterFeedbackSchema } from "./schemas/orchestrator-schemas";

import { MunitionPack } from "./contracts/munitions";

export interface PremiumATSAnalysis {
  candidateId: string;
  jobTitle: string;
  analyzedAt: string;

  score: PremiumATSScore;
  recruiterSignals: string[];
  strengths: string[];
  missingSkills: string[];
  rewriteSuggestions: Array<{ original: string; improved: string }>;
  confidence: number;
  
  munitionPack: MunitionPack;
}

/**
 * Orchestrateur ATS Premium focalisé sur le "Recruiter Doubt".
 */
export async function processPremiumATSAnalysis(cvBuffer: Buffer, jobDescription: string, ): Promise<PremiumATSAnalysis> {
  // 1. Extraction (Invisible sophistication)
  const extraction = await extractCVText(cvBuffer);

  // 2. Intelligence Gathering
  const [jobData, cvProfile, doubts] = await Promise.all([
    analyzeJobOfferIntelligence(jobDescription),
    extractAdvancedCVProfile(extraction.text),
    generateRecruiterDoubts(extraction.text, jobDescription),
  ]);

  // 3. Deterministic Mapping
  const skillMatch = calculateSkillScore(
    normalizeSkills(jobData.hard_skills),
    normalizeSkills(cvProfile.hard_skills),
  );

  // 4. Analysis Layers
  const [techLeadership, simulation] = await Promise.all([
    analyzeTechnicalLeadership(extraction.text),
    simulateRecruiterFeedback(cvProfile, skillMatch.score),
  ]);

  // 5. Multi-dimensional Scoring
  const premiumScore = calculatePremiumATSScore(
    {
      skillMatchScore: skillMatch.score,
      seniorityScore: 85,
      readabilityScore: extraction.confidence * 100,
    },
    {
      leadershipScore: cvProfile.leadership_score,
      metricsScore: cvProfile.impact_metrics_score,
    },
  );

  const inconsistencies = detectInconsistencies(cvProfile, jobData);
  const interviewRisks = predictInterviewRisks(doubts);

  const munitionPack: MunitionPack = {
    generatedAt: new Date().toISOString(),
    munitions: [...doubts, ...techLeadership, ...inconsistencies, ...interviewRisks],
    context: {
      overallATS: premiumScore.overall,
      riskLevel: premiumScore.overall < 60 ? "high" : premiumScore.overall < 80 ? "medium" : "low",
      coachingFocus: skillMatch.missing,
    }
  };

  return {
    candidateId: "anonymous", // Pour l'instant
    jobTitle: jobData.title || "Poste non spécifié",
    analyzedAt: munitionPack.generatedAt,
    score: premiumScore,
    recruiterSignals: detectRecruiterSignals(jobDescription),
    strengths: simulation.strengths,
    missingSkills: skillMatch.missing,
    rewriteSuggestions: simulation.rewrites,
    confidence: extraction.confidence,
    munitionPack,
  };
}

async function analyzeJobOfferIntelligence(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: JobIntelligenceSchema,
    temperature: 0.1,
    system:
      'Analyze job offer. JSON format: { "title": "", "hard_skills": [], "seniority": "", "min_years": 0 }',
    prompt: text,
  });
  return object;
}

async function extractAdvancedCVProfile(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: AdvancedCVSchema,
    temperature: 0.1,
    system:
      'Analyze CV. JSON format: { "hard_skills": [], "seniority": 0, "leadership_score": 0, "impact_metrics_score": 0, "years_experience": 0 }',
    prompt: text,
  });
  return object;
}

async function simulateRecruiterFeedback(_cv: any, score: number) {
  const { object } = await generateObject({
    model: mistralModel,
    schema: RecruiterFeedbackSchema,
    temperature: 0.1,
    system:
      'Act as a picky recruiter. JSON: { "concerns": [], "strengths": [], "rewrites": [{ "original": "", "improved": "" }] }',
    prompt: `Score: ${score}`,
  });
  return object;
}
