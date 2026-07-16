// @ts-nocheck
import type { QuestionGenerationPort } from "../../../application/ports/AIPorts.js";
import type { InterviewPhase, TopicId } from "../../../domain/types.js";
import { ProviderError } from "../../errors/ProviderErrors.js";
import { QuestionPromptV1 } from "../../prompts/question-generation/question-v1.js";
import type { GroqClient } from "./GroqEvaluationAdapter.js";

export class GroqQuestionGenerationAdapter implements QuestionGenerationPort {
  constructor(private client: GroqClient) {}

  async generateNext(phase: InterviewPhase, topic: TopicId | null, history: readonly string[]): Promise<string> {
    try {
      const systemPrompt = QuestionPromptV1
        .replace("{{currentPhase}}", phase)
        .replace("{{topic}}", topic ? (topic as string) : "General")
        .replace("{{history}}", history.join("\n"));

      const response = await this.client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: systemPrompt }]
      });

      const text = response.choices[0]?.message?.content;
      if (!text) throw new Error("Empty response from Groq");

      return text.trim();
    } catch (error) {
      throw new ProviderError("Groq Question Generation Failed", "groq", error);
    }
  }
}
