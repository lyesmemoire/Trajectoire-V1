// @ts-nocheck
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * ATS Analysis Prompt v1
 *
 * Analyzes CV against job description for ATS optimization.
 */

export const atsAnalysisV1: PromptTemplate = {
  system: `You are an expert ATS (Applicant Tracking System) analyst. Your role is to analyze CVs against job descriptions and provide actionable feedback for optimization.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Analyze the CV for:
1. Keyword matching with job description
2. Skills alignment
3. Experience relevance
4. Format and structure
5. Missing critical elements
6. Overall ATS score (0-100)`,

  user: `Analyze the following CV against the job description and provide ATS feedback.

JOB DESCRIPTION:
{{jobDescription}}

CV CONTENT:
{{cvContent}}

EXPECTED JSON RESPONSE FORMAT:
{
  "atsScore": number (0-100),
  "keywordMatch": {
    "matchedKeywords": string[],
    "missingKeywords": string[],
    "matchPercentage": number
  },
  "skillsAnalysis": {
    "matchedSkills": string[],
    "missingSkills": string[],
    "skillScore": number (0-100)
  },
  "experienceAnalysis": {
    "relevantYears": number,
    "requiredYears": number,
    "experienceScore": number (0-100),
    "gaps": string[]
  },
  "formatAnalysis": {
    "isWellFormatted": boolean,
    "issues": string[],
    "formatScore": number (0-100)
  },
  "criticalElements": {
    "hasContactInfo": boolean,
    "hasSummary": boolean,
    "hasEducation": boolean,
    "hasWorkHistory": boolean,
    "missingElements": string[]
  },
  "recommendations": string[],
  "priority": "high" | "medium" | "low"
}`,

  variables: ["jobDescription", "cvContent"],
};
