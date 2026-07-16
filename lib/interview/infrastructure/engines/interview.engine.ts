import "server-only";

import { randomUUID } from "node:crypto";
import type {
  InterviewContext,
  InterviewInput,
  InterviewOutput,
} from "../../domain/contracts/interview.dto";
import { InterviewError } from "../../domain/contracts/interview.errors";
import type { InterviewDomainEvent } from "../../domain/contracts/interview.events";
import type { InterviewEnginePort } from "../../domain/ports/interview-engine.port";
import type {
  LLMCompletionInput,
  LLMProviderPort,
} from "../../domain/ports/llm-provider.port";

export class InterviewEngine implements InterviewEnginePort {
  constructor(private readonly provider: LLMProviderPort) {}

  async *generateResponseStream(
    input: InterviewInput,
    _userId: string,
    context: InterviewContext,
  ): AsyncGenerator<InterviewDomainEvent, void, void> {
    const startedAt = Date.now();
    let finalAnswer = "";
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      for await (const chunk of this.streamText(this.createPrompt(input, context))) {
        if (chunk.type === "text") {
          finalAnswer += chunk.text;
          yield { type: "TextDelta", text: chunk.text };
          continue;
        }

        inputTokens = chunk.inputTokens ?? 0;
        outputTokens = chunk.outputTokens ?? 0;
      }

      const output: InterviewOutput = {
        responseId: randomUUID(),
        sessionId: input.sessionId,
        finalAnswer,
        actions: [
          {
            type: "continue_interview",
            label: "Continuer la simulation",
            sessionId: input.sessionId,
          },
        ],
        metadata: {
          model: "mistral-large-latest",
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          latencyMs: Date.now() - startedAt,
          contextSources: ["candidate", "job-offer", "history", "goals", "constraints"],
          completedAtIso: new Date().toISOString(),
        },
      };

      yield { type: "Completed", output };
    } catch (error) {
      throw error instanceof InterviewError
        ? error
        : new InterviewError(error instanceof Error ? error.message : "Interview generation failed");
    }
  }

  private streamText(input: LLMCompletionInput) {
    return this.provider.stream(input);
  }

  private createPrompt(input: InterviewInput, context: InterviewContext): LLMCompletionInput {
    const history = input.history.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    return {
      systemInstruction: [
        "Tu es un recruteur expert qui conduit une simulation d'entretien exigeante et constructive.",
        `Poste ciblé : ${context.candidate.targetRole}.`,
        `Offre : ${context.jobOffer.title}.`,
        `Niveau : ${context.level}.`,
        `Mode : ${context.constraints.mode}.`,
        `Langue : ${context.constraints.language}.`,
        "Pose une seule question de suivi à la fois et reste factuel.",
      ].join("\n"),
      messages: [
        ...history,
        { role: "user", content: input.message },
      ],
      temperature: 0.7,
      maximumOutputTokens: 500,
    };
  }
}

