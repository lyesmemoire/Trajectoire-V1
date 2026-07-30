import { z } from "zod";
import { Engine, EngineInput } from "../../contracts/Engine";
import { EngineResult } from "../../contracts/EngineResult";
import {
  PerceptionEngineInput,
  PerceptionEvent,
  Observation,
} from "./PerceptionTypes";
import { PerceptionOutputSchema } from "./PerceptionSchema";
import { PERCEPTION_SYSTEM_PROMPT } from "./PerceptionPrompt";

import { StructuredLLMProvider } from "../../contracts/LLMProvider";

// ===================================================================
// PERCEPTION ENGINE
// ===================================================================

export class PerceptionEngine implements Engine<PerceptionEngineInput, PerceptionEvent> {
  readonly name = "PerceptionEngine";
  readonly version = "1.0.0";

  constructor(private readonly llmProvider: StructuredLLMProvider) {}

  async execute(input: PerceptionEngineInput): Promise<EngineResult<PerceptionEvent>> {
    const startTime = Date.now();

    const { candidateAnswer } = input.payload;
    const { currentQuestion, messageIndex } = input.context;

    // Build the user prompt
    const userPrompt = `
CURRENT QUESTION:
${currentQuestion || "None (Candidate spoke spontaneously)"}

CANDIDATE ANSWER:
"${candidateAnswer}"

Extract all factual observations according to your instructions.
`;

    // Call the LLM Provider
    const result = await this.llmProvider.generateObject({
      system: PERCEPTION_SYSTEM_PROMPT,
      prompt: userPrompt,
      schema: PerceptionOutputSchema,
      schemaName: "PerceptionExtraction",
      schemaDescription: "A list of factual observations extracted from the candidate's answer.",
    });

    // Create events from observations
    const events: PerceptionEvent[] = result.object.observations.map((obs) => {
      // Ensure specific rules are respected even if LLM hallucinates
      let resolvedType = obs.type;
      
      // Post-processing guard: If the fact is just "I don't remember" or similar, force UNKNOWN
      if (
        obs.normalizedFact.toLowerCase().includes("don't remember") ||
        obs.normalizedFact.toLowerCase().includes("do not remember") ||
        obs.normalizedFact.toLowerCase().includes("forgot")
      ) {
        resolvedType = "UNKNOWN";
      }

      // Re-map the timestamp if it's invalid, or just keep it as parsed
      return {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        sequence: 0, // Should be assigned by Reducer/EventStore later
        engine: this.name,
        eventType: "OBSERVATION_EXTRACTED",
        engineVersion: this.version,
        payload: {
          ...obs,
          id: obs.id || crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          messageIndex: input.context.messageIndex,
          sourceQuestion: input.context.currentQuestion,
          type: resolvedType,
        },
        createdAt: new Date(),
      };
    });

    const durationMs = Date.now() - startTime;

    return {
      engine: this.name,
      version: this.version,
      durationMs,
      tokens: {
        prompt: result.usage.promptTokens,
        completion: result.usage.completionTokens,
        total: result.usage.totalTokens,
      },
      confidence: events.length > 0 ? 0.9 : 0.5, // Arbitrary confidence for the engine's operation
      events,
      warnings: [],
      metrics: {
        observationsExtracted: events.length,
      },
      debug: {
        promptLength: userPrompt.length,
      },
    };
  }
}
