// @ts-nocheck
export interface PromptMetadata {
  readonly version: string;
  readonly provider: string;
  readonly model: string;
  readonly temperature: number;
  readonly seed: number | null;
  readonly createdAt: string;
}

export const QuestionPromptV1Meta: PromptMetadata = {
  version: "question-v1",
  provider: "openai",
  model: "gpt-4o",
  temperature: 0.7,
  seed: null,
  createdAt: "2025-01-01T00:00:00Z"
};

export const QuestionPromptV1 = `
You are an expert technical interviewer. Generate the next question for the candidate.
Output ONLY the question text. No preamble, no quotes.

Phase: {{currentPhase}}
Target Topic: {{topic}}

Conversation History:
{{history}}
`;
