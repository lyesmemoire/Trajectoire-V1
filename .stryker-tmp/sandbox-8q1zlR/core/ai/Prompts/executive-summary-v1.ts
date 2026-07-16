// @ts-nocheck
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Executive Summary Prompt v1
 *
 * Generates executive summary from candidate data.
 */

export const executiveSummaryV1: PromptTemplate = {
  system: `You are an expert executive recruiter. Your role is to synthesize candidate information into a compelling executive summary for hiring managers and executives.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Create a summary that:
1. Highlights key strengths and achievements
2. Summarizes career trajectory
3. Identifies unique value proposition
4. Flags potential concerns
5. Provides overall recommendation`,

  user: `Generate an executive summary for the following candidate.

CANDIDATE PROFILE:
{{candidateProfile}}

INTERVIEW FEEDBACK:
{{interviewFeedback}}

ASSESSMENT RESULTS:
{{assessmentResults}}

EXPECTED JSON RESPONSE FORMAT:
{
  "executiveSummary": {
    "headline": string,
    "keyStrengths": string[],
    "careerHighlights": string[],
    "uniqueValueProposition": string,
    "overallImpression": string
  },
  "qualificationSummary": {
    "yearsOfExperience": number,
    "relevantRoles": string[],
    "keyAchievements": string[],
    "education": string[]
  },
  "fitAssessment": {
    "roleFit": number (0-100),
    "culturalFit": number (0-100),
    "potential": number (0-100),
    "fitReasoning": string
  },
  "concerns": {
    "hasConcerns": boolean,
    "concerns": string[],
    "severity": "low" | "medium" | "high"
  },
  "recommendation": {
    "recommendation": "strong hire" | "hire" | "consider" | "pass",
    "rationale": string,
    "nextSteps": string[]
  }
}`,

  variables: ["candidateProfile", "interviewFeedback", "assessmentResults"],
};
