// @ts-nocheck
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Leadership Analysis Prompt v1
 *
 * Analyzes leadership presence and potential.
 */

export const leadershipAnalysisV1: PromptTemplate = {
  system: `You are an expert leadership analyst. Your role is to evaluate leadership skills, presence, and potential.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Evaluate leadership for:
1. Vision and strategic thinking
2. Decision-making ability
3. Team influence and motivation
4. Conflict resolution
5. Accountability and responsibility
6. Adaptability and change management`,

  user: `Analyze the leadership qualities in the following context.

LEADERSHIP CONTEXT:
{{context}}

BEHAVIORAL EVIDENCE:
{{evidence}}

EXPECTED JSON RESPONSE FORMAT:
{
  "leadershipScore": number (0-100),
  "vision": {
    "score": number (0-100),
    "demonstratesVision": boolean,
    "strategicThinking": string[],
    "areasForDevelopment": string[]
  },
  "decisionMaking": {
    "score": number (0-100),
    "decisiveness": string,
    "evidenceBasedDecisions": boolean,
    "improvements": string[]
  },
  "influence": {
    "score": number (0-100),
    "influencesOthers": boolean,
    "motivationalStyle": string,
    "impactExamples": string[]
  },
  "conflictResolution": {
    "score": number (0-100),
    "handlesConflictWell": boolean,
    "approach": string,
    "strengths": string[],
    "weaknesses": string[]
  },
  "accountability": {
    "score": number (0-100),
    "takesOwnership": boolean,
    "responsibilityLevel": string,
    "examples": string[]
  },
  "adaptability": {
    "score": number (0-100),
    "adaptsToChange": boolean,
    "flexibility": string[],
    "challenges": string[]
  },
  "overallAssessment": string,
  "recommendations": string[]
}`,

  variables: ["context", "evidence"],
};
