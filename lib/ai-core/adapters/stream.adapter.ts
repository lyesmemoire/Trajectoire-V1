/**
 * AI Domain Standard - Stream Adapter
 * 
 * Common streaming adapter for converting domain events to AI SDK streams.
 * Extracted from Career Copilot and Interview (Rule of Three).
 */

import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export interface StreamEvent {
  type: "TextDelta" | "Error" | "Completed";
  text?: string;
  error?: { message: string };
  metadata?: Record<string, unknown>;
}

export class StreamAdapter {
  static toResponse(
    generator: AsyncGenerator<StreamEvent, void, unknown>,
    options?: {
      onCompleted?: (metadata?: Record<string, unknown>) => void;
    }
  ): Response {
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const messageId = crypto.randomUUID();
        writer.write({ type: "text-start", id: messageId });

        try {
          for await (const event of generator) {
            switch (event.type) {
              case "TextDelta":
                writer.write({ type: "text-delta", id: messageId, delta: event.text ?? "" });
                break;
              case "Error":
                writer.write({
                  type: "text-delta",
                  id: messageId,
                  delta: `\n\n[Erreur: ${event.error?.message || "Erreur inconnue"}]`,
                });
                break;
              case "Completed":
                if (options?.onCompleted) {
                  options.onCompleted(event.metadata);
                }
                break;
            }
          }
        } catch (error) {
          writer.write({
            type: "text-delta",
            id: messageId,
            delta: `\n\n[Erreur système: ${error instanceof Error ? error.message : "Erreur inconnue"}]`,
          });
        }

        writer.write({ type: "text-end", id: messageId });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}
