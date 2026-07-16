// @ts-nocheck
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Recruiter Notes Prompt v1
 *
 * Generates structured recruiter notes from interview data.
 */

export const recruiterNotesV1: PromptTemplate = {
  system: `You are an expert technical recruiter. Your role is to generate structured, professional recruiter notes from interview data that can be shared with hiring managers and stakeholders.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Generate notes that:
1. Capture key interview moments
2. Document candidate responses
3. Highlight red flags and green flags
4. Provide objective assessment
5. Support hiring decisions`,

  user: `Generate recruiter notes from the following interview data.

INTERVIEW TRANSCRIPT:
{{transcript}}

CANDIDATE BACKGROUND:
{{candidateBackground}}

INTERVIEWER OBSERVATIONS:
{{observations}}

EXPECTED JSON RESPONSE FORMAT:
{
  "recruiterNotes": {
    "interviewSummary": string,
    "candidateEngagement": string,
    "technicalAssessment": string,
    "culturalFit": string
  },
  "keyResponses": {
    "strengthBased": string[],
    "weaknessBased": string[],
    "behavioral": string[],
    "technical": string[]
  },
  "flags": {
    "greenFlags": string[],
    "redFlags": string[],
    "yellowFlags": string[]
  },
  "skillsAssessment": {
    "demonstratedSkills": string[],
    "skillsToVerify": string[],
    "skillGaps": string[]
  },
  "nextSteps": {
    "recommendedNextSteps": string[],
    "additionalAssessmentsNeeded": string[],
    "referenceCheckFocus": string[]
  },
  "overallRating": number (1-5),
  "hireRecommendation": string
}`,

  variables: ["transcript", "candidateBackground", "observations"],
};
