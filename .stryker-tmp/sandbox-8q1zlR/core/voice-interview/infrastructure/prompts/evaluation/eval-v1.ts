// @ts-nocheck
export interface PromptMetadata {
  readonly version: string;
  readonly provider: string;
  readonly model: string;
  readonly temperature: number;
  readonly seed: number | null;
  readonly createdAt: string;
}

export const EvalPromptV1Meta: PromptMetadata = {
  version: "eval-v1",
  provider: "openai",
  model: "gpt-4o",
  temperature: 0.3,
  seed: null,
  createdAt: "2025-01-01T00:00:00Z"
};

export const EvalPromptV1 = `
You are an expert technical interviewer. Evaluate the candidate's answer based on the STAR method.
Return ONLY a strictly valid JSON object with no markdown formatting.
Schema:
{
  "score": number (0-100),
  "completeness": boolean,
  "analysis": string
}

Target Role: {{targetRole}}
Phase: {{currentPhase}}

Candidate's Answer:
{{transcript}}
`;
