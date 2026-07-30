import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EventFactory } from "./EventFactory";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { EngineInput } from "../contracts/Engine";

// ===================================================================
// NORMALIZER ENGINE — Minimal Text Normalization
// ===================================================================

export interface NormalizerContext {
  sessionId: string;
}

export interface NormalizerPayload {
  rawText: string;
}

export const NormalizerManifest: EngineManifest = {
  id: "normalizer",
  version: "1.0.0",
  description: "Normalize ASR transcript (punctuation, hesitation removal, sentence segmentation, Unicode normalization)",
  consumes: ["RawTranscript"],
  produces: ["NormalizedText"],
  facts: ["NormalizedSentence"],
  events: ["TextNormalized"],
  providers: [],
  timeout: 5000,
  retries: 2,
};

export class NormalizerEngine extends BaseEngine<NormalizerContext, NormalizerPayload, BaseEvent<{ normalizedText: string }>> {
  constructor() {
    super({
      name: "NormalizerEngine",
      version: NormalizerManifest.version,
      schemaVersion: "1.0",
    });
  }

  protected async process(
    context: NormalizerContext,
    payload: NormalizerPayload,
    sessionId: string
  ): Promise<BaseEvent<{ normalizedText: string }>[]> {
    const normalizedText = this.normalizeText(payload.rawText);

    const event = EventFactory.createNormalizedEvent({
      sessionId: context.sessionId,
      engine: this.name,
      engineVersion: this.version,
      normalizedText,
    });

    return [event];
  }

  private normalizeText(text: string): string {
    let normalized = text;

    // Remove hesitations (euh, hum, ben, etc.)
    normalized = normalized.replace(/\b(euh|hum|ben|euhm|heu)\b/gi, "");

    // Normalize Unicode
    normalized = normalized.normalize("NFC");

    // Clean up extra whitespace
    normalized = normalized.replace(/\s+/g, " ").trim();

    // Add basic punctuation (simple heuristic)
    normalized = this.addBasicPunctuation(normalized);

    // Segment into sentences
    normalized = this.segmentSentences(normalized);

    return normalized;
  }

  private addBasicPunctuation(text: string): string {
    // Add period at end if missing
    if (!/[.!?]$/.test(text)) {
      text += ".";
    }
    return text;
  }

  private segmentSentences(text: string): string {
    // Simple sentence segmentation based on punctuation
    // In production, this would use a more sophisticated NLP library
    return text.replace(/([.!?])\s+/g, "$1\n");
  }
}
