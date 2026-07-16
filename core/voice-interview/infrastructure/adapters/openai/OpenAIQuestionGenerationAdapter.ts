import type { QuestionGenerationPort } from "../../../application/ports/AIPorts.js";
import type { InterviewPhase, TopicId } from "../../../domain/types.js";
import { ProviderError } from "../../errors/ProviderErrors.js";
import { QuestionPromptV1 } from "../../prompts/question-generation/question-v1.js";
import type { OpenAIClient } from "./OpenAIEvaluationAdapter.js";

export class OpenAIQuestionGenerationAdapter implements QuestionGenerationPort {
  constructor(private client: OpenAIClient) {}

  async generateNext(phase: InterviewPhase, topic: TopicId | null, history: readonly string[]): Promise<string> {
    try {
      const systemPrompt = QuestionPromptV1
        .replace("{{currentPhase}}", phase)
        .replace("{{topic}}", topic ? (topic as string) : "General")
        .replace("{{history}}", history.join("\n"));

      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }]
      });

      const text = response.choices[0]?.message?.content;
      if (!text) throw new Error("Empty response from OpenAI");

      return text.trim();
    } catch (error) {
      throw new ProviderError("OpenAI Question Generation Failed", "openai", error);
    }
  }
}
