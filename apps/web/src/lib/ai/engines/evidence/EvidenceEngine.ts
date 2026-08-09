import { Engine } from "../../contracts/Engine";
import { EngineResult } from "../../contracts/EngineResult";
import { StructuredLLMProvider } from "../../contracts/LLMProvider";
import {
  EvidenceEngineInput,
  EvidenceEvent,
  EvidenceOutput,
} from "./EvidenceTypes";
import { EvidenceOutputSchema } from "./EvidenceSchema";
import { EVIDENCE_SYSTEM_PROMPT } from "./EvidencePrompt";

// ===================================================================
// EVIDENCE ENGINE
// Transforms factual Observations into qualified Evidence (or drops them if weak claims).
// ===================================================================

export class EvidenceEngine implements Engine<EvidenceEngineInput, EvidenceEvent> {
  readonly name = "EvidenceEngine";
  readonly version = "1.0.0";

  constructor(private readonly llmProvider: StructuredLLMProvider) {}

  async execute(input: EvidenceEngineInput): Promise<EngineResult<EvidenceEvent>> {
    const startTime = Date.now();
    const { observations } = input.payload;

    if (observations.length === 0) {
      return {
        engine: this.name,
        version: this.version,
        durationMs: 0,
        tokens: { prompt: 0, completion: 0, total: 0 },
        confidence: 1,
        events: [],
        warnings: [],
        metrics: { evidenceEvaluated: 0 },
        debug: {},
      };
    }

    // Prepare prompt payload (only sending the observations payloads to avoid clutter)
    const observationsPayload = observations.map(evt => evt.payload);
    
    const userPrompt = `
Analyze the following OBSERVATIONS extracted from the candidate.
For each observation, determine if it constitutes genuine EVIDENCE or just a vague CLAIM.
Assign dimensional scores, identify supported competencies, and explicitly state what is missing.

OBSERVATIONS:
${JSON.stringify(observationsPayload, null, 2)}
`;

    // Call the LLM Provider
    const result = await this.llmProvider.generateObject<EvidenceOutput>({
      system: EVIDENCE_SYSTEM_PROMPT,
      prompt: userPrompt,
      schema: EvidenceOutputSchema,
      schemaName: "EvidenceEvaluation",
      schemaDescription: "Structured evaluation of observations to qualify them as evidence or discard them as claims.",
    });

    // Create events from the generated analyses
    const events: EvidenceEvent[] = result.object.analyses.map((analysis) => {
      // Find the corresponding observation event to map sequence/session properly if needed
      const sourceObservation = observations.find(o => o.payload.id === analysis.observationId);
      
      return {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        sequence: 0, // Should be assigned by Reducer/EventStore
        engine: this.name,
        eventType: "EVIDENCE_EVALUATED",
        engineVersion: this.version,
        payload: {
          ...analysis,
          id: crypto.randomUUID(),
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
      confidence: events.length > 0 ? 0.9 : 0.5,
      events,
      warnings: [],
      metrics: {
        evidenceEvaluated: events.length,
        genuineProofs: events.filter(e => e.payload.isEvidence).length,
      },
      debug: {
        promptLength: userPrompt.length,
      },
    };
  }
}
