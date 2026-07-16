// @ts-nocheck
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Decision Estimation Prompt v1
 *
 * Estimates hiring decision probability and confidence.
 */

export const decisionEstimationV1: PromptTemplate = {
  system: `You are an expert hiring decision analyst. Your role is to estimate the probability of a positive hiring decision based on all available data.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Estimate decision probability based on:
1. Technical qualifications
2. Cultural fit
3. Interview performance
4. Reference checks
5. Compensation alignment
6. Overall market competitiveness`,

  user: `Estimate the hiring decision probability for the following candidate.

CANDIDATE DATA:
{{candidateData}}

INTERVIEW PERFORMANCE:
{{interviewPerformance}}

COMPARISON WITH OTHER CANDIDATES:
{{comparison}}

EXPECTED JSON RESPONSE FORMAT:
{
  "decisionEstimation": {
    "hireProbability": number (0-100),
    "confidence": number (0-100),
    "decisionTimeline": string
  },
  "factors": {
    "positiveFactors": {
      "technical": string[],
      "cultural": string[],
      "performance": string[],
      "other": string[]
    },
    "negativeFactors": {
      "technical": string[],
      "cultural": string[],
      "performance": string[],
      "other": string[]
    },
    "neutralFactors": string[]
  },
  "riskAssessment": {
    "overallRisk": "low" | "medium" | "high",
    "riskAreas": string[],
    "mitigationStrategies": string[]
  },
  "competitivePosition": {
    "ranking": number,
    "totalCandidates": number,
    "positioning": string
  },
  "recommendation": {
    "decision": "proceed" | "hold" | "reject",
    "reasoning": string,
    "conditions": string[]
  }
}`,

  variables: ["candidateData", "interviewPerformance", "comparison"],
};
