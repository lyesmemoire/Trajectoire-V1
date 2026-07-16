import "server-only";

import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import type { InterviewDomainEvent } from "../../domain/contracts/interview.events";

export class InterviewStreamAdapter {
  static toResponse(
    events: AsyncGenerator<InterviewDomainEvent, void, void>,
  ): Response {
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const messageId = crypto.randomUUID();
        writer.write({ type: "text-start", id: messageId });

        for await (const event of events) {
          if (event.type === "TextDelta") {
            writer.write({ type: "text-delta", id: messageId, delta: event.text });
          }

          if (event.type === "Error") {
            writer.write({
              type: "text-delta",
              id: messageId,
              delta: `\n\n[Erreur: ${event.error.message}]`,
            });
          }
        }

        writer.write({ type: "text-end", id: messageId });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}

