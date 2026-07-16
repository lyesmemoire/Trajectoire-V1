import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Interview Analysis Prompt v1
 *
 * Analyzes interview performance across multiple dimensions.
 */

export const interviewAnalysisV1: PromptTemplate = {
  system: `You are an expert interview analyst. Your role is to evaluate interview performance and provide detailed feedback on communication, leadership, confidence, structure, impact, and synthesis.

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Evaluate the interview for:
1. Communication clarity and effectiveness
2. Leadership presence and influence
3. Confidence and composure
4. Answer structure and organization
5. Impact and persuasiveness
6. Synthesis and conclusion quality`,

  user: `Analyze the following interview transcript and provide performance evaluation.

INTERVIEW TRANSCRIPT:
{{transcript}}

INTERVIEW CONTEXT:
{{context}}

EXPECTED JSON RESPONSE FORMAT:
{
  "overallScore": number (0-100),
  "dimensions": {
    "communication": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    },
    "leadership": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    },
    "confidence": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    },
    "structure": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    },
    "impact": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    },
    "synthesis": {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "feedback": string
    }
  },
  "keyMoments": {
    "bestMoment": string,
    "worstMoment": string,
    "improvementAreas": string[]
  },
  "recommendations": string[],
  "nextSteps": string[]
}`,

  variables: ["transcript", "context"],
};
