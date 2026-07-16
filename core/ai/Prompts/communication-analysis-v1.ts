import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Communication Analysis Prompt v1
 *
 * Analyzes communication skills and effectiveness.
 */

export const communicationAnalysisV1: PromptTemplate = {
  system: `You are an expert communication analyst. Your role is to evaluate communication skills, clarity, effectiveness, and style.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Evaluate communication for:
1. Clarity and conciseness
2. Active listening
3. Non-verbal communication cues
4. Tone and style appropriateness
5. Question asking ability
6. Storytelling and examples`,

  user: `Analyze the communication in the following context.

COMMUNICATION CONTEXT:
{{context}}

TRANSCRIPT/CONTENT:
{{content}}

EXPECTED JSON RESPONSE FORMAT:
{
  "communicationScore": number (0-100),
  "clarity": {
    "score": number (0-100),
    "isClear": boolean,
    "issues": string[],
    "strengths": string[]
  },
  "listening": {
    "score": number (0-100),
    "demonstratesActiveListening": boolean,
    "responses": string[],
    "missedCues": string[]
  },
  "tone": {
    "score": number (0-100),
    "isAppropriate": boolean,
    "toneDescription": string,
    "adjustments": string[]
  },
  "questioning": {
    "score": number (0-100),
    "asksRelevantQuestions": boolean,
    "questionQuality": string[],
    "missedOpportunities": string[]
  },
  "storytelling": {
    "score": number (0-100),
    "usesExamples": boolean,
    "impactfulStories": string[],
    "improvements": string[]
  },
  "overallFeedback": string,
  "recommendations": string[]
}`,

  variables: ["context", "content"],
};
