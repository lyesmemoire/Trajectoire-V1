// @ts-nocheck
import type { TextEvaluationPort, EvaluationContextDTO } from "../../../application/ports/AIPorts.js";
import type { AnswerEvaluation } from "../../../domain/types.js";
import { ProviderError } from "../../errors/ProviderErrors.js";
import { EvalPromptV1 } from "../../prompts/evaluation/eval-v1.js";
import { EvaluationMapper } from "../../mappers/EvaluationMapper.js";

export interface GroqClient {
  chat: {
    completions: {
      create(params: any): Promise<any>;
    };
  };
}

export class GroqEvaluationAdapter implements TextEvaluationPort {
  constructor(private client: GroqClient) {}

  async evaluateAnswer(transcript: string, context: EvaluationContextDTO): Promise<AnswerEvaluation> {
    try {
      const systemPrompt = EvalPromptV1
        .replace("{{targetRole}}", context.targetRole)
        .replace("{{currentPhase}}", context.currentPhase)
        .replace("{{transcript}}", transcript);

      const response = await this.client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: systemPrompt }],
        response_format: { type: "json_object" }
      });

      const jsonStr = response.choices[0]?.message?.content;
      if (!jsonStr) throw new Error("Empty response from Groq");

      return EvaluationMapper.fromJSON(jsonStr);
    } catch (error) {
      throw new ProviderError("Groq Evaluation Failed", "groq", error);
    }
  }
}
